import { n as defineCodexBuildState } from "./build-state-C7EnDVgr.mjs";
import { f as resolveCodexAppServerLocalHomeDir, r as inferCodexAppServerConnectionClass } from "./config-security-BEReZ6go.mjs";
import { C as boundedCatalogString, b as MAX_CWD_LENGTH, r as projectCodexCatalogNativeThread, s as codexCatalogSourceForClient, u as observeCodexCatalogEphemeralThreads } from "./session-catalog-native-projection-DowriLid.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import { createHash } from "node:crypto";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { createZstdDecompress } from "node:zlib";
//#region extensions/codex/src/app-server/shared-client-lifecycle.ts
/** Client ownership and synchronous retirement, independent of startup/auth execution. */
const createCodexAppServerStartupLifetime = () => ({
	controller: new AbortController(),
	pending: /* @__PURE__ */ new Set()
});
const getSharedCodexAppServerClientState = defineCodexBuildState("openclaw.codexAppServerClientState", () => ({
	clients: /* @__PURE__ */ new Map(),
	liveClients: /* @__PURE__ */ new Set(),
	isolatedClients: /* @__PURE__ */ new Set(),
	entriesByClient: /* @__PURE__ */ new WeakMap(),
	desktopGenerationDrainChecks: /* @__PURE__ */ new Set(),
	startup: createCodexAppServerStartupLifetime(),
	startMetadata: /* @__PURE__ */ new WeakMap()
}));
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
* Retires a matching shared client. Default is graceful: detach from the map
* (future acquisitions get a fresh client) and close once leases drain.
* `failActiveLeases` is for suspect clients only (timed-out turns): it closes
* the physical connection immediately so co-leased attempts hit the normal
* client-closed retry path, and pending acquires reject instead of leasing
* the poisoned process. Routine cleanup must NOT use it — it would abort
* healthy sibling turns on a working client.
*/
function retireSharedCodexAppServerClientIfCurrent(client, opts) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	const currentEntry = getCurrentSharedClientEntry(client);
	const entry = currentEntry ?? state.entriesByClient.get(client);
	if (!entry || entry.client !== client && !entry.closeError) return;
	if (currentEntry) {
		state.clients.delete(entry.key);
		entry.closeWhenIdle = true;
	}
	if (opts?.failActiveLeases && (currentEntry || !entry.closeError)) {
		entry.closeError = /* @__PURE__ */ new Error("codex app-server client is closed");
		return {
			activeLeases: entry.activeLeases,
			closed: closeRetiredSharedClientEntry(entry)
		};
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
	client.close();
	return true;
}
//#endregion
//#region extensions/codex/src/session-catalog-home-id.ts
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
	return createHash("sha256").update("openclaw:codex-session-catalog-home:v1\0").update(codexHome).digest("hex");
}
//#endregion
//#region extensions/codex/src/session-catalog-provenance.ts
const MAX_SESSION_META_BYTES = 1048576;
const SESSION_META_READ_CHUNK_BYTES = 65536;
const MAX_PROVENANCE_CACHE_ENTRIES = 2e4;
const provenanceByPath = /* @__PURE__ */ new Map();
function cacheProvenance(key, value) {
	provenanceByPath.delete(key);
	provenanceByPath.set(key, value);
	while (provenanceByPath.size > MAX_PROVENANCE_CACHE_ENTRIES) {
		const oldest = provenanceByPath.keys().next().value;
		if (oldest === void 0) break;
		provenanceByPath.delete(oldest);
	}
}
/** Undefined means the metadata line is not durable enough to cache yet. */
async function readCodexSessionMeta(sessionsRoot, rolloutPath, threadId) {
	let safeRoot;
	try {
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
		} catch {
			continue;
		}
		const input = opened.handle.createReadStream({
			autoClose: false,
			highWaterMark: SESSION_META_READ_CHUNK_BYTES
		});
		const reader = candidate.endsWith(".zst") ? input.pipe(createZstdDecompress()) : input;
		try {
			const chunks = [];
			let bytesReadTotal = 0;
			let line;
			for await (const value of reader) {
				const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
				const remaining = MAX_SESSION_META_BYTES - bytesReadTotal;
				if (remaining <= 0) break;
				const bounded = chunk.subarray(0, remaining);
				bytesReadTotal += bounded.length;
				const newline = bounded.indexOf(10);
				chunks.push(newline >= 0 ? bounded.subarray(0, newline) : bounded);
				if (newline >= 0) {
					line = Buffer.concat(chunks).toString("utf8");
					break;
				}
			}
			if (!line) continue;
			let parsed;
			try {
				parsed = JSON.parse(line);
			} catch {
				continue;
			}
			if (!isJsonObject(parsed) || parsed.type !== "session_meta" || !isJsonObject(parsed.payload)) return null;
			const payload = parsed.payload;
			return payload.id === threadId ? payload : null;
		} catch {
			continue;
		} finally {
			reader.destroy();
			input.destroy();
			await opened.handle.close().catch(() => void 0);
		}
	}
}
/** Passive local listing uses native creation provenance, with rollout fallback for older records. */
async function isOpenClawManagedCodexThread(thread, localSessionsRoot, diagnostics) {
	const started = diagnostics ? performance.now() : 0;
	if (diagnostics) diagnostics.fields.provenanceChecks++;
	try {
		const rolloutPath = typeof thread.path === "string" ? thread.path.trim() : "";
		if (!localSessionsRoot || !rolloutPath) return false;
		if (typeof thread.originator === "string" && thread.originator.length > 0) return thread.originator === "openclaw";
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
//#endregion
//#region extensions/codex/src/session-catalog-events.ts
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
function publishCodexCatalogResume(client, response, sanitize) {
	try {
		return publishPreparedResume(client, {
			thread: projectCodexCatalogNativeThread(response.thread, sanitize),
			cwd: boundedCatalogString(response.cwd, MAX_CWD_LENGTH),
			modelProvider: boundedCatalogString(response.modelProvider, 500, "truncate")
		});
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog resume publication failed", { error });
		return Promise.resolve();
	}
}
async function publishPreparedResume(client, response) {
	try {
		const state = getCatalogEvents();
		const binding = await state.clients.get(client);
		if (!binding || binding.source.closed) return;
		await Promise.all(Array.from(state.listeners.get(binding.homeKey) ?? [], async (listener) => {
			try {
				await listener.onResume?.(response, binding.source);
			} catch (error) {
				embeddedAgentLog.warn("Codex catalog resume observer failed", { error });
			}
		}));
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog resume publication failed", { error });
	}
}
//#endregion
export { isOpenClawManagedCodexThread as a, codexCatalogHomeIdFromCanonicalPath as c, createCodexAppServerStartupLifetime as d, getCurrentSharedClientEntry as f, retireSharedCodexAppServerClientsBeforeDesktopGeneration as g, retireSharedCodexAppServerClientIfCurrent as h, subscribeCodexCatalogEvents as i, closeRetiredSharedClientEntry as l, hasActiveSharedCodexAppServerWork as m, observeCodexCatalogClient as n, readCodexSessionMeta as o, getSharedCodexAppServerClientState as p, publishCodexCatalogResume as r, codexCatalogHomeId as s, codexCatalogResidentHomeKey as t, closeRetiredSharedClientEntryIfIdle as u };
