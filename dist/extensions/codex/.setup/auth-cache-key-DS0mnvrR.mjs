import { y as resolveMacOSDesktopCodexAppPathCandidates } from "./managed-binary-ARII6CR1.mjs";
import { c as MAX_CWD_LENGTH, d as boundedCatalogString } from "./session-catalog-parsing-BS06j5dj.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { n as defineCodexBuildState } from "./build-state-heW11Zft.mjs";
import { C as resolveCodexAppServerLocalHomeDir, u as inferCodexAppServerConnectionClass } from "./config-options-ZyoXdPOW.mjs";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-CRWvp1Xm.mjs";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-C1YmeiUB.mjs";
import { l as observeCodexCatalogEphemeralThreads, n as projectCodexCatalogNativeThread, o as codexCatalogSourceForClient } from "./session-catalog-native-projection-BLwj5FZe.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import fs, { watch } from "node:fs";
import path from "node:path";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import os from "node:os";
import fs$1, { lstat } from "node:fs/promises";
import { sleepWithAbort } from "openclaw/plugin-sdk/retry-runtime";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { constants as constants$1, createZstdDecompress } from "node:zlib";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { readSecretFile } from "openclaw/plugin-sdk/secret-file";
// extensions/codex/src/app-server/desktop-generation-fingerprint.ts
/** Fingerprints every desktop candidate that can own a managed fallback artifact. */
async function readMacOSDesktopGenerationFingerprint(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const entries = [];
	const bundles = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const command = await statFingerprint(candidate.appServerCommandPath);
		entries.push(`candidate:${candidate.appName}:${candidate.appServerCommandPath}:${command}`);
		if (bundles.has(candidate.appBundlePath)) continue;
		bundles.add(candidate.appBundlePath);
		entries.push(`${candidate.appBundlePath}\0${await statFingerprint(candidate.appBundlePath)}`);
	}
	return createHash("sha256").update(entries.join("\0")).digest("hex");
}
async function statFingerprint(filePath) {
	try {
		return statTuple(await fs$1.stat(filePath, { bigint: true }));
	} catch (error) {
		return missingFingerprint(error);
	}
}
function statTuple(stat) {
	return [
		stat.dev,
		stat.ino,
		stat.mode,
		stat.size,
		stat.mtimeNs,
		stat.ctimeNs
	].join(":");
}
function missingFingerprint(error) {
	const code = extractErrorCode(error);
	if (code === "ENOENT" || code === "ENOTDIR") return "missing";
	throw error;
}
// extensions/codex/src/app-server/desktop-generation-owner.ts
const SETTLE_DELAY_MS = 1e3;
/** Coalesces filesystem invalidations into one stable desktop generation. */
function createCodexDesktopGenerationOwner(params) {
	let generation = params.initialGeneration;
	let dirty = false;
	let refresh;
	const markDirty = () => {
		dirty = true;
	};
	const reconcile = () => {
		if (refresh) return refresh;
		refresh = (async () => {
			await sleepWithAbort(SETTLE_DELAY_MS, params.signal, { ref: false });
			dirty = false;
			const fingerprint = await params.readFingerprint();
			params.signal.throwIfAborted();
			const previous = generation;
			generation = previous?.fingerprint === fingerprint ? previous : {
				epoch: (previous?.epoch ?? 0) + 1,
				fingerprint
			};
			if (previous && generation !== previous) params.onGenerationChange?.(generation);
			return generation;
		})().catch((error) => {
			dirty = true;
			throw error;
		}).finally(() => {
			refresh = void 0;
		});
		return refresh;
	};
	return {
		read: () => generation,
		markDirty,
		wait: () => dirty ? reconcile() : refresh ?? Promise.resolve(generation),
		refresh: () => {
			markDirty();
			return reconcile();
		},
		waitForIdle: async () => {
			await refresh?.catch(() => {});
		}
	};
}
// extensions/codex/src/app-server/desktop-generation.ts
/** Lifecycle-owned generation for managed macOS Codex desktop artifacts. */
const APPLICATIONS_PATH = "/Applications";
const state = defineCodexBuildState("openclaw.codexDesktopGenerationState", () => ({}));
function waitForCodexDesktopGeneration() {
	const current = state();
	const owner = current.owner;
	return (current.watcher ? owner?.wait() : owner?.refresh()) ?? Promise.resolve(void 0);
}
function createCodexDesktopGenerationService(params) {
	const platform = process.platform;
	return {
		apiVersion: 2,
		id: "codex-desktop-generation",
		async start(ctx) {
			if (platform !== "darwin") return;
			const current = state();
			current.context = ctx;
			const owner = createCodexDesktopGenerationOwner({
				signal: ctx.scheduler.signal,
				readFingerprint: readMacOSDesktopGenerationFingerprint,
				onGenerationChange: params.onGenerationChange,
				initialGeneration: current.lastGeneration
			});
			current.owner = owner;
			const candidateNames = new Set(resolveMacOSDesktopCodexAppPathCandidates("darwin").map((candidate) => candidate.appName));
			try {
				current.watcher = watch(APPLICATIONS_PATH, { recursive: false }, (_eventType, filename) => {
					if (ctx.scheduler.signal.aborted || filename && !candidateNames.has(filename.split(path.sep)[0] ?? "")) return;
					owner.markDirty();
					refreshGeneration(current, owner.wait());
				});
				current.watcher.on("error", (error) => reportWatcherFailure(current, error));
			} catch (error) {
				reportWatcherFailure(current, error);
			}
			refreshGeneration(current, owner.refresh());
		},
		async stop() {
			const current = state();
			const owner = current.owner;
			const scheduler = current.context?.scheduler;
			scheduler?.beginClose();
			current.lastGeneration = current.owner?.read() ?? current.lastGeneration;
			current.owner = void 0;
			current.context = void 0;
			current.watcher?.close();
			current.watcher = void 0;
			await Promise.all([scheduler?.stop(), owner?.waitForIdle()]);
		}
	};
}
function reportWatcherFailure(current, error) {
	if (current.context?.scheduler.signal.aborted) return;
	current.watcher?.close();
	current.watcher = void 0;
	current.owner?.markDirty();
	current.context?.serviceHealth?.reportFailure(error);
	current.context?.logger.warn(`codex desktop generation watcher failed: ${String(error)}`);
}
function refreshGeneration(current, refresh) {
	return refresh.then(() => {
		if (!current.context?.scheduler.signal.aborted && current.watcher) current.context?.serviceHealth?.clearFailure();
	}).catch((error) => {
		if (!current.context || current.context.scheduler.signal.aborted) return;
		current.context?.serviceHealth?.reportFailure(error);
		current.context?.logger.warn(`codex desktop generation refresh failed: ${String(error)}`);
	});
}
// extensions/codex/src/app-server/shared-client-lifecycle.ts
/** Client ownership and synchronous retirement, independent of startup/auth execution. */
function getOrCreateSharedClientEntry(state, key) {
	let entry = state.clients.get(key);
	if (!entry) {
		entry = {
			key,
			ready: false,
			activeLeases: 0,
			anonymousLeases: 0,
			pendingAcquires: 0,
			closeWhenIdle: false,
			onStartedClientCallbacks: /* @__PURE__ */ new Set()
		};
		state.clients.set(key, entry);
	}
	return entry;
}
var SharedCodexFallbackJoinError = class extends Error {
	constructor() {
		super("Shared Codex fallback already has a startup owner");
		this.code = "CODEX_SHARED_FALLBACK_JOIN";
		this.name = "SharedCodexFallbackJoinError";
	}
};
function isSharedCodexFallbackJoinError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_SHARED_FALLBACK_JOIN";
}
/**
* Moves a current entry to the fallback key. False means the caller must
* re-acquire instead of starting a second client under an already-owned key.
*/
function rekeySharedClientEntry(entry, key) {
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) !== entry) return false;
	const target = state.clients.get(key);
	if (target) return target === entry;
	state.clients.delete(entry.key);
	entry.key = key;
	state.clients.set(key, entry);
	return true;
}
function closeSharedClientEntryIfUnclaimed(entry, options) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return false;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) !== entry) return false;
	state.clients.delete(entry.key);
	cancelSharedClientIdleRetirement(entry);
	entry.client?.close(options);
	return Boolean(entry.client);
}
function clearSharedCodexAppServerClientIfCurrentAndUnclaimed(client, options) {
	const entry = getCurrentSharedClientEntry(client);
	return {
		found: entry !== void 0,
		closed: entry ? closeSharedClientEntryIfUnclaimed(entry, options) : false,
		activeLeases: entry?.activeLeases ?? 0,
		pendingAcquires: entry?.pendingAcquires ?? 0
	};
}
const createCodexAppServerStartupLifetime = () => ({
	controller: new AbortController(),
	pending: /* @__PURE__ */ new Set()
});
function ownCodexStartup(lifetime, operation) {
	lifetime.pending.add(operation);
	const release = () => lifetime.pending.delete(operation);
	operation.then(release, release);
	return operation;
}
const getSharedCodexAppServerClientState = defineCodexBuildState("openclaw.codexAppServerClientState", () => ({
	clients: /* @__PURE__ */ new Map(),
	liveClients: /* @__PURE__ */ new Set(),
	isolatedClients: /* @__PURE__ */ new Set(),
	entriesByClient: /* @__PURE__ */ new WeakMap(),
	startup: createCodexAppServerStartupLifetime(),
	startMetadata: /* @__PURE__ */ new WeakMap()
}));
function trackIsolatedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	state.isolatedClients.add(client);
	client.addTransportExitHandler((exitedClient) => {
		state.isolatedClients.delete(exitedClient);
	});
}
function hasActiveSharedCodexAppServerWork() {
	const state = getSharedCodexAppServerClientState();
	if (state.startup.pending.size > 0 || state.startup.controller.signal.aborted) return true;
	for (const entry of state.clients.values()) if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return true;
	for (const client of state.liveClients) {
		const entry = state.entriesByClient.get(client);
		if (entry && (entry.activeLeases > 0 || entry.pendingAcquires > 0)) return true;
	}
	return false;
}
function getCurrentSharedClientEntry(client) {
	const state = getSharedCodexAppServerClientState();
	const entry = client ? state.entriesByClient.get(client) : void 0;
	return entry && entry.client === client && state.clients.get(entry.key) === entry ? entry : void 0;
}
/**
* Retires a matching shared client gracefully: detach from the map
* (future acquisitions get a fresh client) and close once leases drain.
*/
function retireSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	const currentEntry = getCurrentSharedClientEntry(client);
	const entry = currentEntry ?? state.entriesByClient.get(client);
	if (!entry || entry.client !== client) return;
	cancelSharedClientIdleRetirement(entry);
	if (currentEntry) {
		state.clients.delete(entry.key);
		entry.closeWhenIdle = true;
	}
	return {
		activeLeases: entry.activeLeases,
		closed: currentEntry ? closeRetiredSharedClientEntryIfIdle(entry) : false
	};
}
/** Gracefully retires exact clients attached to an older desktop generation. */
function retireSharedCodexAppServerClientsBeforeDesktopGeneration(generation) {
	const state = getSharedCodexAppServerClientState();
	for (const entry of state.clients.values()) {
		const client = entry.client;
		const attached = client ? state.startMetadata.get(client) : void 0;
		if (client && attached?.desktopGeneration && attached.desktopGeneration.epoch < generation.epoch) retireSharedCodexAppServerClientIfCurrent(client);
	}
}
function closeRetiredSharedClientEntryIfIdle(entry) {
	if (!entry.closeWhenIdle || entry.activeLeases > 0 || entry.pendingAcquires > 0 || !entry.client) return false;
	entry.closeWhenIdle = false;
	return closeRetiredSharedClientEntry(entry);
}
function closeRetiredSharedClientEntry(entry) {
	const client = entry.client;
	if (!client) return false;
	entry.client = void 0;
	cancelSharedClientIdleRetirement(entry);
	client.close();
	return true;
}
/** Exit registration also observes transports that have already terminated. */
function waitForCodexAppServerClientExit(client) {
	const metadata = getSharedCodexAppServerClientState().startMetadata.get(client);
	const exited = metadata?.transportExit ?? new Promise((resolve) => {
		client.addTransportExitHandler(() => resolve());
	});
	if (metadata) metadata.transportExit = exited;
	return exited;
}
/** Acquire the recorded owner atomically, or join its exit before a replacement writes. */
async function retainSharedCodexAppServerClientByInstanceId(clientId, options) {
	const id = clientId?.trim();
	if (!id) return;
	const state = getSharedCodexAppServerClientState();
	for (const client of state.liveClients) {
		if (client.getInstanceId() !== id) continue;
		const entry = state.entriesByClient.get(client);
		if (entry?.client !== client || client.getCloseError()) {
			if (options?.waitForExit === false && client.getCloseError()) return;
			await racePromiseWithAbortSignal(waitForCodexAppServerClientExit(client), options?.signal, options?.createAbortError);
			return;
		}
		const release = retainSharedClientEntry(entry);
		return {
			client,
			release: (waitForRetirement = false) => {
				release();
				return options?.waitForExit !== false && (client.getCloseError() || waitForRetirement && entry.closeWhenIdle) ? waitForCodexAppServerClientExit(client) : void 0;
			}
		};
	}
}
const CODEX_APP_SERVER_CLIENT_IDLE_GRACE_MS = 3e5;
function cancelSharedClientIdleRetirement(entry) {
	clearTimeout(entry.idleTimer);
	entry.idleTimer = void 0;
}
function refreshSharedClientIdleRetirement(client) {
	const entry = getCurrentSharedClientEntry(client);
	if (entry) scheduleSharedClientIdleRetirement(entry);
}
function scheduleSharedClientIdleRetirement(entry) {
	cancelSharedClientIdleRetirement(entry);
	if (!entry.ready || entry.activeLeases > 0 || entry.pendingAcquires > 0 || !entry.client || entry.hasOwnedThreads?.() || getCurrentSharedClientEntry(entry.client) !== entry) return;
	entry.idleTimer = setTimeout(() => {
		entry.idleTimer = void 0;
		if (entry.activeLeases === 0 && entry.pendingAcquires === 0 && !entry.hasOwnedThreads?.()) retireSharedCodexAppServerClientIfCurrent(entry.client);
	}, CODEX_APP_SERVER_CLIENT_IDLE_GRACE_MS);
	entry.idleTimer.unref?.();
}
function retainSharedClientEntry(entry, counter = "activeLeases") {
	let released = false;
	cancelSharedClientIdleRetirement(entry);
	entry[counter] += 1;
	return () => {
		if (released) return;
		released = true;
		releaseSharedClientEntry(entry, counter);
	};
}
function releaseSharedClientEntry(entry, counter) {
	entry[counter] -= 1;
	closeRetiredSharedClientEntryIfIdle(entry);
	scheduleSharedClientIdleRetirement(entry);
}
// extensions/codex/src/session-catalog-home-id.ts
function canonicalCodexCatalogHome(value) {
	const resolved = path.resolve(value);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		return resolved;
	}
}
/** One canonical identity for catalog discovery and durable ownership rows. */
function codexCatalogHomeId(codexHome) {
	return codexCatalogHomeIdFromCanonicalPath(canonicalCodexCatalogHome(codexHome));
}
/** Hashes lifecycle-prepared paths without repeating filesystem discovery. */
function codexCatalogHomeIdFromCanonicalPath(codexHome) {
	return sha256Hex(`openclaw:codex-session-catalog-home:v1\0${codexHome}`);
}
// extensions/codex/src/session-catalog-provenance.ts
const MAX_SESSION_META_BYTES = 1048576;
const SESSION_META_READ_CHUNK_BYTES = 65536;
const MAX_COMPRESSED_META_BYTES = 8388608;
const SESSION_META_DEADLINE_MS = 5e3;
const MAX_PROVENANCE_CACHE_ENTRIES = 2e4;
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const provenanceByPath = /* @__PURE__ */ new Map();
function cacheProvenance(key, value) {
	provenanceByPath.delete(key);
	provenanceByPath.set(key, value);
	if (provenanceByPath.size > MAX_PROVENANCE_CACHE_ENTRIES) provenanceByPath.delete(provenanceByPath.keys().next().value);
}
/** Undefined means the metadata line is not durable enough to cache yet. */
async function readCodexSessionMeta(sessionsRoot, rolloutPath, threadId, options = {}) {
	const deadline = options.canonicalSource ? performance.now() + SESSION_META_DEADLINE_MS : Infinity;
	let safeRoot;
	try {
		if (options.canonicalSource) {
			const stat = await lstat(sessionsRoot);
			if (!stat.isDirectory() || stat.isSymbolicLink()) return;
		}
		safeRoot = await root(sessionsRoot, {
			hardlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER,
			symlinks: "reject"
		});
	} catch {
		return;
	}
	const candidates = rolloutPath.endsWith(".zst") ? [rolloutPath, rolloutPath.slice(0, -4)] : [rolloutPath, `${rolloutPath}.zst`];
	for (const candidate of candidates) {
		let opened;
		try {
			opened = await safeRoot.open(path.relative(sessionsRoot, candidate));
		} catch (error) {
			if (isJsonObject(error) && (error.code === "not-found" || error.code === "ENOENT")) continue;
			return;
		}
		try {
			const compressed = candidate.endsWith(".zst");
			if (!opened.stat.size || options.canonicalSource && compressed && opened.stat.size > MAX_COMPRESSED_META_BYTES || performance.now() >= deadline) return;
			const input = opened.handle.createReadStream({
				autoClose: false,
				highWaterMark: SESSION_META_READ_CHUNK_BYTES,
				end: opened.stat.size - 1
			});
			const decoder = compressed ? createZstdDecompress({
				chunkSize: SESSION_META_READ_CHUNK_BYTES,
				params: options.canonicalSource ? { [constants$1.ZSTD_d_windowLogMax]: 25 } : void 0
			}) : void 0;
			if (decoder) {
				input.on("error", (error) => decoder.destroy(error));
				input.pipe(decoder);
			}
			const reader = decoder ?? input;
			const timer = options.canonicalSource ? setTimeout(() => reader.destroy(/* @__PURE__ */ new Error("Codex rollout metadata observation timed out")), Math.floor(Math.max(1, deadline - performance.now()))) : void 0;
			const chunks = [];
			let bytesReadTotal = 0;
			let line;
			try {
				for await (const value of reader) {
					const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
					const newline = chunk.indexOf(10);
					const prefix = newline >= 0 ? chunk.subarray(0, newline) : chunk;
					bytesReadTotal += prefix.length;
					if (bytesReadTotal > MAX_SESSION_META_BYTES) return;
					chunks.push(prefix);
					if (newline >= 0) {
						line = utf8Decoder.decode(Buffer.concat(chunks));
						break;
					}
				}
			} finally {
				clearTimeout(timer);
				reader.destroy();
				input.destroy();
			}
			if (!line) return;
			const parsed = JSON.parse(line);
			if (!isJsonObject(parsed) || parsed.type !== "session_meta" || !isJsonObject(parsed.payload)) return null;
			const payload = parsed.payload;
			return payload.id === threadId ? payload : null;
		} catch {
			return;
		} finally {
			await opened.handle.close().catch(() => void 0);
		}
	}
}
/** Passive local listing uses native creation provenance, with rollout fallback for older records. */
async function isOpenClawManagedCodexThread(thread, localSessionsRoot, diagnostics) {
	const started = diagnostics ? performance.now() : 0;
	if (diagnostics) diagnostics.fields.provenanceChecks++;
	try {
		const rolloutPath = thread.path?.trim();
		if (!localSessionsRoot || !rolloutPath) return false;
		if (thread.originator) return thread.originator === "openclaw";
		const cacheKey = `${localSessionsRoot}\0${rolloutPath}`;
		const cached = provenanceByPath.get(cacheKey);
		if (cached !== void 0) {
			if (diagnostics) diagnostics.fields.provenanceCacheHits++;
			return cached;
		}
		if (diagnostics) diagnostics.fields.provenanceReadCalls++;
		const metadata = await readCodexSessionMeta(localSessionsRoot, rolloutPath, thread.id);
		const managed = metadata === void 0 ? void 0 : metadata?.originator === "openclaw";
		if (managed !== void 0) cacheProvenance(cacheKey, managed);
		return managed ?? false;
	} finally {
		if (diagnostics) diagnostics.fields.provenanceMs = (diagnostics.fields.provenanceMs ?? 0) + performance.now() - started;
	}
}
// extensions/codex/src/session-catalog-events.ts
const getCatalogEvents = defineCodexBuildState("openclaw.codexCatalogEvents", () => ({
	listeners: /* @__PURE__ */ new Map(),
	clients: /* @__PURE__ */ new WeakMap()
}));
const CATALOG_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"turn/started",
	"turn/completed",
	"thread/archived",
	"thread/deleted",
	"thread/unarchived",
	"thread/reverted",
	"thread/name/updated",
	"thread/status/changed",
	"thread/settings/updated"
]);
function notifyEphemeralThread(homeKey, rawId) {
	const id = boundedCatalogString(rawId, 256);
	if (!id) return;
	for (const listener of getCatalogEvents().listeners.get(homeKey) ?? []) try {
		listener.onEphemeralThread?.(id);
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog ephemeral observer failed", { error });
	}
}
/** Uses prepared local identity or resolves it once during client/index startup. */
async function codexCatalogResidentHomeKey(params) {
	if (inferCodexAppServerConnectionClass(params.startOptions) === "remote") {
		const fingerprint = buildCodexAppServerConnectionFingerprint({
			start: params.startOptions,
			connectionClass: "remote"
		}, params.agentDir);
		return `remote:${createHash("sha256").update(fingerprint).digest("hex")}`;
	}
	if (params.sourceHomeId) return params.sourceHomeId;
	const home = path.resolve(params.runtimeIdentity?.codexHome ?? resolveCodexAppServerLocalHomeDir(params.startOptions, params.agentDir));
	return codexCatalogHomeIdFromCanonicalPath(await fs$1.realpath(home).catch(() => home));
}
function subscribeCodexCatalogEvents(homeKey, listener, callbacks = {}) {
	const { listeners } = getCatalogEvents();
	let homeListeners = listeners.get(homeKey);
	if (!homeListeners) {
		homeListeners = /* @__PURE__ */ new Set();
		listeners.set(homeKey, homeListeners);
	}
	const subscription = {
		notify: listener,
		...callbacks
	};
	homeListeners.add(subscription);
	return () => {
		homeListeners.delete(subscription);
		if (homeListeners.size === 0 && listeners.get(homeKey) === homeListeners) listeners.delete(homeKey);
	};
}
/** Observes physical clients without extending their lease or native thread lifetime. */
function observeCodexCatalogClient(client, params) {
	const state = getCatalogEvents();
	const existing = state.clients.get(client);
	if (existing) return existing.then(() => void 0);
	const observing = (async () => {
		const homeKey = await codexCatalogResidentHomeKey({
			...params,
			runtimeIdentity: client.getRuntimeIdentity()
		});
		if (client.getCloseError()) return;
		const source = codexCatalogSourceForClient(client);
		observeCodexCatalogEphemeralThreads(source, notifyEphemeralThread.bind(void 0, homeKey));
		const notifyLifecycle = (callback) => {
			for (const listener of state.listeners.get(homeKey) ?? []) try {
				listener[callback]?.(source);
			} catch (error) {
				embeddedAgentLog.warn("Codex catalog lifecycle observer failed", {
					callback,
					error
				});
			}
		};
		const readThread = async (threadId) => (await client.request("thread/read", {
			threadId,
			includeTurns: false
		}, {
			timeoutMs: 6e4,
			catalogPreview: true
		})).thread;
		const stopNotifications = client.addNotificationHandler((event) => {
			if (!CATALOG_NOTIFICATION_METHODS.has(event.method)) return;
			for (const listener of state.listeners.get(homeKey) ?? []) listener.notify(event, readThread, source);
		});
		const stopClose = client.addCloseHandler(() => {
			stopNotifications();
			stopClose();
			notifyLifecycle("onClose");
		});
		if (inferCodexAppServerConnectionClass(params.startOptions) === "remote") notifyLifecycle("onRemoteReady");
		return {
			homeKey,
			source
		};
	})();
	state.clients.set(client, observing);
	return observing.then(() => void 0);
}
/** Acknowledged resume settings may differ from the response thread's persisted metadata. */
async function publishCodexCatalogResume(client, response, sanitize) {
	try {
		const prepared = {
			thread: projectCodexCatalogNativeThread(response.thread, sanitize),
			cwd: boundedCatalogString(response.cwd, MAX_CWD_LENGTH),
			modelProvider: boundedCatalogString(response.modelProvider, 500, "truncate")
		};
		const state = getCatalogEvents();
		const binding = await state.clients.get(client);
		if (!binding || binding.source.closed) return;
		await Promise.all(Array.from(state.listeners.get(binding.homeKey) ?? [], async (listener) => {
			try {
				await listener.onResume?.(prepared, binding.source);
			} catch (error) {
				embeddedAgentLog.warn("Codex catalog resume observer failed", { error });
			}
		}));
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog resume publication failed", { error });
	}
}
// extensions/codex/src/app-server/auth-cache-key.ts
/** Auth cache identity and native CLI credential reads, without login or refresh. */
const CODEX_AUTH_JSON_FILENAME = "auth.json";
const CODEX_APP_SERVER_API_KEY_ENV_VARS = ["CODEX_API_KEY", "OPENAI_API_KEY"];
function resolveCodexAppServerFallbackApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	const apiKey = readFirstNonEmptyEnvEntry(resolveCodexAppServerSpawnEnv(params.startOptions), CODEX_APP_SERVER_API_KEY_ENV_VARS);
	if (!apiKey) return params.allowNativeAuthFile === false ? void 0 : resolveCodexCliAuthFileApiKeyCacheKey(process.env);
	return fingerprintAuthCacheKey(apiKey.key, "env-api-key", apiKey.key, apiKey.value);
}
/** Secret-free cache identity for an API key already resolved by the runtime plan. */
function resolveCodexAppServerPreparedApiKeyCacheKey(apiKey) {
	const resolved = apiKey?.trim();
	return resolved ? fingerprintApiKeyAuthProfileCacheKey(resolved) : void 0;
}
function fingerprintApiKeyAuthProfileCacheKey(apiKey) {
	return fingerprintAuthCacheKey("api_key", "auth-profile-api-key", apiKey);
}
function fingerprintTokenAuthProfileCacheKey(accessToken) {
	return fingerprintAuthCacheKey("token", "auth-profile-token", accessToken);
}
function fingerprintAuthCacheKey(prefix, domain, ...parts) {
	return `${prefix}:sha256:${sha256Hex(`openclaw:codex:app-server-${domain}:v1\0${parts.join("\0")}`)}`;
}
function resolveCodexCliAuthFilePath(env) {
	const codexHome = env.CODEX_HOME?.trim() || "~/.codex";
	if (codexHome === "~" || codexHome.startsWith("~/") || codexHome.startsWith("~\\")) {
		const home = env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
		return path.join(home, codexHome.slice(codexHome === "~" ? 1 : 2), CODEX_AUTH_JSON_FILENAME);
	}
	return path.join(codexHome, CODEX_AUTH_JSON_FILENAME);
}
function parseCodexCliAuthFileApiKey(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	return isRecord(parsed) ? normalizeOptionalString(parsed.OPENAI_API_KEY) : void 0;
}
async function readCodexCliAuthFileApiKey(env) {
	try {
		return parseCodexCliAuthFileApiKey(await readSecretFile(resolveCodexCliAuthFilePath(env), "Codex CLI auth file"));
	} catch {
		return;
	}
}
function resolveCodexCliAuthFileApiKeyCacheKey(env) {
	try {
		const apiKey = parseCodexCliAuthFileApiKey(fs.readFileSync(resolveCodexCliAuthFilePath(env), "utf8"));
		return apiKey ? fingerprintAuthCacheKey("CODEX_AUTH_JSON", "cli-auth-json-api-key", apiKey) : void 0;
	} catch {
		return;
	}
}
function readFirstNonEmptyEnv(env, keys) {
	return readFirstNonEmptyEnvEntry(env, keys)?.value;
}
function readFirstNonEmptyEnvEntry(env, keys) {
	for (const key of keys) {
		const value = env[key]?.trim();
		if (value) return {
			key,
			value
		};
	}
}
export { retainSharedCodexAppServerClientByInstanceId as A, hasActiveSharedCodexAppServerWork as C, rekeySharedClientEntry as D, refreshSharedClientIdleRetirement as E, createCodexDesktopGenerationService as F, waitForCodexDesktopGeneration as I, readMacOSDesktopGenerationFingerprint as L, retireSharedCodexAppServerClientsBeforeDesktopGeneration as M, trackIsolatedCodexAppServerClient as N, releaseSharedClientEntry as O, waitForCodexAppServerClientExit as P, getSharedCodexAppServerClientState as S, ownCodexStartup as T, SharedCodexFallbackJoinError as _, readCodexCliAuthFileApiKey as a, getCurrentSharedClientEntry as b, resolveCodexAppServerPreparedApiKeyCacheKey as c, publishCodexCatalogResume as d, subscribeCodexCatalogEvents as f, codexCatalogHomeIdFromCanonicalPath as g, codexCatalogHomeId as h, fingerprintTokenAuthProfileCacheKey as i, retireSharedCodexAppServerClientIfCurrent as j, retainSharedClientEntry as k, codexCatalogResidentHomeKey as l, readCodexSessionMeta as m, CODEX_AUTH_JSON_FILENAME as n, readFirstNonEmptyEnv as o, isOpenClawManagedCodexThread as p, fingerprintApiKeyAuthProfileCacheKey as r, resolveCodexAppServerFallbackApiKeyCacheKey as s, CODEX_APP_SERVER_API_KEY_ENV_VARS as t, observeCodexCatalogClient as u, clearSharedCodexAppServerClientIfCurrentAndUnclaimed as v, isSharedCodexFallbackJoinError as w, getOrCreateSharedClientEntry as x, createCodexAppServerStartupLifetime as y };
