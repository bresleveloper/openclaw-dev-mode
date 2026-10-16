import { n as defineCodexBuildState } from "./build-state-BgEYwu09.mjs";
import { u as resolveMacOSDesktopCodexAppPathCandidates } from "./managed-binary-C1VFoVPf.mjs";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-a0HDa2Mj.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import fs, { constants, existsSync, watch } from "node:fs";
import path from "node:path";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { sha256File } from "openclaw/plugin-sdk/file-access-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/retry-runtime";
import { readSecretFile } from "openclaw/plugin-sdk/secret-file";
//#region extensions/codex/src/app-server/desktop-generation-fingerprint.ts
const MAX_COMPUTER_USE_PLUGIN_TREE_ENTRIES = 4096;
/** Fingerprints every desktop candidate that can own a managed fallback artifact. */
async function readMacOSDesktopGenerationFingerprint(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const entries = [];
	const bundles = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const command = await statFingerprint(candidate.appServerCommandPath);
		entries.push(`candidate:${candidate.appName}:${candidate.appServerCommandPath}:${command}`);
		if (bundles.has(candidate.appBundlePath)) continue;
		bundles.add(candidate.appBundlePath);
		for (const artifactPath of resolveMacOSDesktopGenerationPaths(candidate)) entries.push(`${artifactPath}\0${await statFingerprint(artifactPath)}`);
		for (const pluginRoot of resolveComputerUseArtifactRoots(candidate)) entries.push(`${pluginRoot}\0${await readCodexDesktopArtifactTreeFingerprint(pluginRoot)}`);
	}
	return createHash("sha256").update(entries.join("\0")).digest("hex");
}
function resolveMacOSDesktopGenerationPaths(candidate) {
	return [
		candidate.appBundlePath,
		path.join(candidate.bundledMarketplacePath, ".agents", "plugins", "marketplace.json"),
		path.join(candidate.appBundlePath, "Contents", "Resources", "cua_node", "bin", "node"),
		path.join(candidate.appBundlePath, "Contents", "Resources", "cua_node", "bin", "node_repl"),
		...candidate.computerUseServiceAppPaths.flatMap((servicePath) => [
			servicePath,
			path.join(servicePath, "Contents", "Info.plist"),
			path.join(servicePath, "Contents", "SharedSupport", "SkyComputerUseClient.app", "Contents", "MacOS", "SkyComputerUseClient")
		])
	];
}
function resolveComputerUseArtifactRoots(candidate) {
	const modules = path.join(candidate.appBundlePath, "Contents", "Resources", "cua_node", "lib", "node_modules", "@oai");
	return [
		path.join(candidate.bundledMarketplacePath, "plugins", "computer-use"),
		path.join(candidate.bundledMarketplacePath, "plugins", "unified-computer-use"),
		path.join(modules, "cua-repl"),
		path.join(modules, "cua"),
		path.join(modules, "sky", "dist")
	];
}
/** Stable roots that cover bundle replacement and recursive artifact updates. */
function resolveMacOSDesktopGenerationWatchPaths(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const watched = /* @__PURE__ */ new Set(["/Applications"]);
	for (const candidate of candidates) watched.add(candidate.appBundlePath);
	return [...watched];
}
async function readCodexDesktopArtifactTreeFingerprint(root) {
	let rootStat;
	try {
		rootStat = await fs$1.lstat(root, { bigint: true });
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" || code === "ENOTDIR") return "missing";
		throw error;
	}
	if (!rootStat.isDirectory()) return statFingerprint(root);
	let entryCount = 0;
	const hash = createHash("sha256");
	hash.update("openclaw-codex-computer-use-plugin-tree-v1\0");
	const visit = async (directory, relativeDirectory, before) => {
		hash.update(`directory\0${relativeDirectory}\0${statTuple(before)}\0`);
		const entries = (await fs$1.readdir(directory, { withFileTypes: true })).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		for (const entry of entries) {
			entryCount += 1;
			if (entryCount > MAX_COMPUTER_USE_PLUGIN_TREE_ENTRIES) throw new Error("Codex Computer Use plugin exceeds the bounded tree size");
			const entryPath = path.join(directory, entry.name);
			const relativePath = path.join(relativeDirectory, entry.name);
			const entryStat = await fs$1.lstat(entryPath, { bigint: true });
			if (entryStat.isDirectory()) await visit(entryPath, relativePath, entryStat);
			else hash.update(`entry\0${relativePath}\0${await statFingerprint(entryPath)}\0`);
		}
		if (!sameStat(before, await fs$1.lstat(directory, { bigint: true }))) throw new Error(`Codex desktop artifact changed while fingerprinting: ${directory}`);
	};
	await visit(root, ".", rootStat);
	return hash.digest("hex");
}
async function statFingerprint(filePath) {
	try {
		const entry = await fs$1.lstat(filePath, { bigint: true });
		const type = entry.isSymbolicLink() ? "link" : entry.isDirectory() ? "directory" : entry.isFile() ? "file" : "other";
		const own = statTuple(entry);
		if (!entry.isSymbolicLink()) return `${type}:${own}:${entry.isFile() ? await readFileFingerprint(filePath, entry, false) : ""}`;
		const [link, realPath, target] = await Promise.all([
			fs$1.readlink(filePath),
			fs$1.realpath(filePath),
			fs$1.stat(filePath, { bigint: true })
		]);
		const content = target.isFile() ? await readFileFingerprint(filePath, target, true) : "";
		return `${type}:${own}:${link}:${realPath}:${statTuple(target)}:${content}`;
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" || code === "ENOTDIR") return "missing";
		throw error;
	}
}
async function readFileFingerprint(filePath, expected, followsSymlink) {
	const noFollow = followsSymlink ? 0 : constants.O_NOFOLLOW ?? 0;
	const handle = await fs$1.open(filePath, constants.O_RDONLY | noFollow);
	try {
		const before = await handle.stat({ bigint: true });
		if (!sameStat(before, expected)) throw new Error(`Codex desktop artifact changed while fingerprinting: ${filePath}`);
		const hash = await sha256File(handle, { maxBytes: Number(before.size) });
		const after = await handle.stat({ bigint: true });
		if (BigInt(hash.bytes) !== before.size || !sameStat(before, after)) throw new Error(`Codex desktop artifact changed while fingerprinting: ${filePath}`);
		return hash.digest;
	} finally {
		await handle.close();
	}
}
function sameStat(left, right) {
	return statTuple(left) === statTuple(right);
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
//#endregion
//#region extensions/codex/src/app-server/desktop-generation-owner.ts
const SETTLE_DELAY_MS = 1e3;
/** Coalesces filesystem invalidations into one stable desktop generation. */
function createCodexDesktopGenerationOwner(params) {
	let generation = params.initialGeneration;
	let invalidation = 0;
	let dirty = false;
	let refresh;
	const markDirty = () => {
		invalidation += 1;
		dirty = true;
	};
	const reconcile = () => {
		if (refresh) return refresh;
		refresh = (async () => {
			for (;;) {
				params.signal.throwIfAborted();
				const observedInvalidation = invalidation;
				const first = await params.readFingerprint();
				await sleepWithAbort(SETTLE_DELAY_MS, params.signal, { ref: false });
				params.signal.throwIfAborted();
				const second = await params.readFingerprint();
				params.signal.throwIfAborted();
				if (observedInvalidation !== invalidation || first !== second) continue;
				const previous = generation;
				generation = previous?.fingerprint === second ? previous : {
					epoch: (previous?.epoch ?? 0) + 1,
					fingerprint: second
				};
				dirty = false;
				if (previous && generation !== previous) params.onGenerationChange?.(generation);
				return generation;
			}
		})().finally(() => {
			refresh = void 0;
		});
		return refresh;
	};
	return {
		read: () => generation,
		markDirty,
		wait: () => dirty ? reconcile() : Promise.resolve(generation),
		refresh: () => {
			markDirty();
			return reconcile();
		},
		isCurrent: (candidate) => Boolean(candidate && !params.signal.aborted && !dirty && generation && candidate.epoch === generation.epoch && candidate.fingerprint === generation.fingerprint),
		waitForIdle: async () => {
			await refresh?.catch(() => {});
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/desktop-generation.ts
/** Lifecycle-owned generation for managed macOS Codex desktop artifacts. */
const APPLICATIONS_PATH = "/Applications";
const REARM_INITIAL_DELAY_MS = 100;
const REARM_MAX_DELAY_MS = 3e4;
const state = defineCodexBuildState("openclaw.codexDesktopGenerationState", () => ({}));
function waitForCodexDesktopGeneration() {
	return state().owner?.wait() ?? Promise.resolve(void 0);
}
function isCodexDesktopGenerationCurrent(generation) {
	return state().owner?.isCurrent(generation) ?? false;
}
function createCodexDesktopGenerationService(params, runtime = {
	platform: process.platform,
	readFingerprint: readMacOSDesktopGenerationFingerprint,
	resolveWatchPaths: resolveMacOSDesktopGenerationWatchPaths,
	pathExists: existsSync,
	watchPath: (watchedPath, options, listener) => watch(watchedPath, options, listener)
}) {
	return {
		apiVersion: 2,
		id: "codex-desktop-generation",
		async start(ctx) {
			if (runtime.platform !== "darwin") return;
			const current = state();
			current.context = ctx;
			current.runtime = { ...runtime };
			current.owner = createCodexDesktopGenerationOwner({
				signal: ctx.scheduler.signal,
				readFingerprint: runtime.readFingerprint,
				onGenerationChange: params.onGenerationChange,
				initialGeneration: current.lastGeneration
			});
			armWatchers(current);
			refreshGeneration(current, current.owner, current.owner.refresh());
		},
		async stop() {
			const current = state();
			const owner = current.owner;
			const scheduler = current.context?.scheduler;
			scheduler?.beginClose();
			current.lastGeneration = current.owner?.read() ?? current.lastGeneration;
			current.owner = void 0;
			current.armEpoch = (current.armEpoch ?? 0) + 1;
			current.context = void 0;
			current.runtime = void 0;
			current.watchHealthy = void 0;
			current.rearmDelayMs = void 0;
			current.rearmPending = false;
			closeWatchers(current);
			await Promise.all([scheduler?.stop(), owner?.waitForIdle()]);
		}
	};
}
function armWatchers(current) {
	const owner = current.owner;
	const runtime = current.runtime;
	if (!owner || !runtime || current.watchers) return false;
	const armEpoch = (current.armEpoch ?? 0) + 1;
	current.armEpoch = armEpoch;
	const watchers = /* @__PURE__ */ new Set();
	current.watchers = watchers;
	const candidateNames = new Set(resolveMacOSDesktopCodexAppPathCandidates("darwin").map((candidate) => candidate.appName));
	let complete = true;
	for (const watchedPath of runtime.resolveWatchPaths()) {
		if (!runtime.pathExists(watchedPath)) continue;
		try {
			const watcher = runtime.watchPath(watchedPath, { recursive: watchedPath !== APPLICATIONS_PATH }, (_eventType, filename) => {
				if (!isCurrentArm(current, owner, watchers, armEpoch)) return;
				if (watchedPath === APPLICATIONS_PATH && filename && !candidateNames.has(filename.toString().split(path.sep)[0] ?? "")) return;
				owner.markDirty();
				scheduleRearm(current, owner);
			});
			watchers.add(watcher);
			watcher.on("error", (error) => {
				if (!isCurrentArm(current, owner, watchers, armEpoch)) return;
				reportWatcherFailure(current, owner, error);
				scheduleRearm(current, owner);
			});
		} catch (error) {
			complete = false;
			reportWatcherFailure(current, owner, error);
			scheduleRearm(current, owner);
		}
	}
	current.watchHealthy = complete;
	if (complete) current.rearmDelayMs = REARM_INITIAL_DELAY_MS;
	return complete;
}
function reportWatcherFailure(current, owner, error) {
	if (current.watchHealthy === false) return;
	current.watchHealthy = false;
	owner.markDirty();
	current.context?.serviceHealth?.reportFailure(error);
	current.context?.logger.warn(`codex desktop generation watcher failed: ${String(error)}`);
}
function isCurrentArm(current, owner, watchers, armEpoch) {
	return current.owner === owner && !current.context?.scheduler.signal.aborted && current.watchers === watchers && current.armEpoch === armEpoch;
}
function scheduleRearm(current, owner) {
	if (current.rearmPending && current.watchHealthy === false) return;
	const delayMs = current.watchHealthy === false ? current.rearmDelayMs ?? REARM_INITIAL_DELAY_MS : REARM_INITIAL_DELAY_MS;
	if (current.watchHealthy === false) current.rearmDelayMs = Math.min(delayMs * 2, REARM_MAX_DELAY_MS);
	current.rearmPending = true;
	current.context?.scheduler.schedule({
		id: "watcher-rearm",
		delayMs,
		run: async () => {
			current.rearmPending = false;
			if (current.owner !== owner || current.context?.scheduler.signal.aborted) return;
			const wasUnhealthy = current.watchHealthy === false;
			closeWatchers(current);
			if (!armWatchers(current) || wasUnhealthy) owner.markDirty();
			await refreshGeneration(current, owner, owner.wait());
		}
	});
}
function refreshGeneration(current, owner, refresh) {
	return refresh.then(() => {
		if (current.owner === owner && !current.context?.scheduler.signal.aborted && current.watchHealthy) current.context?.serviceHealth?.clearFailure();
	}).catch((error) => {
		if (current.owner !== owner || current.context?.scheduler.signal.aborted) return;
		current.context?.serviceHealth?.reportFailure(error);
		current.context?.logger.warn(`codex desktop generation refresh failed: ${String(error)}`);
	});
}
function closeWatchers(current) {
	const watchers = current.watchers;
	current.watchers = void 0;
	for (const watcher of watchers ?? []) watcher.close();
}
//#endregion
//#region extensions/codex/src/app-server/shared-client-lifecycle.ts
/** Client ownership and synchronous retirement, independent of startup/auth execution. */
function observeAcquire(options, observation) {
	try {
		options?.onAcquireObservation?.(observation);
	} catch {}
}
function observeSharedClientAcquire(entry, options) {
	const observer = (boundary) => observeAcquire(options, { boundary });
	if (options?.onAcquireObservation) (entry.acquireBoundaryObservers ??= /* @__PURE__ */ new Set()).add(observer);
	observeAcquire(options, {
		boundary: entry.acquireBoundary ?? "entry-selection",
		startup: entry.startup ? entry.acquireBoundary === "ready" ? "ready-cache-hit" : "joined-shared" : "created-shared"
	});
	return () => entry.acquireBoundaryObservers?.delete(observer);
}
function recordSharedClientAcquireBoundary(entry, boundary) {
	entry.acquireBoundary = boundary;
	for (const observer of entry.acquireBoundaryObservers ?? []) observer(boundary);
}
function getOrCreateSharedClientEntry(state, key) {
	let entry = state.clients.get(key);
	if (!entry) {
		entry = {
			key,
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
function closeSharedClientEntryIfUnclaimed(entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return false;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) !== entry) return false;
	state.clients.delete(entry.key);
	entry.client?.close();
	return Boolean(entry.client);
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
function retirePendingSharedClientEntryIfUnclaimed(entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return;
	entry.startupAbort?.abort(/* @__PURE__ */ new Error("Codex app-server startup was abandoned"));
	entry.closeWhenIdle = true;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) === entry) state.clients.delete(entry.key);
	if (!entry.client) return;
	closeRetiredSharedClientEntry(entry);
}
/** Failed final claimants join physical cleanup; healthy peers keep their startup. */
async function waitForUnclaimedSharedClientStartup(entry) {
	if (!entry.startupTransport || entry.activeLeases > 0 || entry.pendingAcquires > 0) return;
	await entry.startupTransport.then((client) => client.closeAndWait(), () => {});
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
async function retainSharedCodexAppServerClientByInstanceId(clientId) {
	const id = clientId?.trim();
	if (!id) return;
	const state = getSharedCodexAppServerClientState();
	for (const client of state.liveClients) {
		if (client.getInstanceId() !== id) continue;
		const entry = state.entriesByClient.get(client);
		if (entry?.client !== client || entry.closeError || client.getCloseError()) {
			await waitForCodexAppServerClientExit(client);
			return;
		}
		const release = retainSharedClientEntry(entry);
		return {
			client,
			release: (waitForRetirement = false) => {
				release();
				return client.getCloseError() || waitForRetirement && entry.closeWhenIdle ? waitForCodexAppServerClientExit(client) : void 0;
			}
		};
	}
}
function notifyDesktopGenerationDrainChecks(state) {
	for (const check of state.desktopGenerationDrainChecks) check();
}
function retainSharedClientEntry(entry, counter = "activeLeases") {
	let released = false;
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
	notifyDesktopGenerationDrainChecks(getSharedCodexAppServerClientState());
}
//#endregion
//#region extensions/codex/src/app-server/auth-cache-key.ts
/** Auth cache identity and native CLI credential reads, without login or refresh. */
const CODEX_HOME_ENV_VAR = "CODEX_HOME";
const HOME_ENV_VAR = "HOME";
const CODEX_HOME_DIRNAME = ".codex";
const CODEX_AUTH_JSON_FILENAME = "auth.json";
const CODEX_APP_SERVER_API_KEY_ENV_VARS = ["CODEX_API_KEY", "OPENAI_API_KEY"];
function resolveCodexAppServerFallbackApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	const apiKey = readFirstNonEmptyEnvEntry(resolveCodexAppServerSpawnEnv(params.startOptions, params.baseEnv ?? process.env, params.platform ?? process.platform), CODEX_APP_SERVER_API_KEY_ENV_VARS);
	if (!apiKey) return resolveCodexCliAuthFileApiKeyCacheKey(params.baseEnv ?? process.env);
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
	return `${prefix}:sha256:${createHash("sha256").update(`openclaw:codex:app-server-${domain}:v1\0`).update(parts.join("\0")).digest("hex")}`;
}
function resolveCodexCliAuthFilePath(env) {
	const configuredCodexHome = env[CODEX_HOME_ENV_VAR]?.trim();
	if (configuredCodexHome) return path.join(resolveHomeRelativePath(configuredCodexHome, env), CODEX_AUTH_JSON_FILENAME);
	const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
	return path.join(home, CODEX_HOME_DIRNAME, CODEX_AUTH_JSON_FILENAME);
}
function resolveHomeRelativePath(value, env) {
	if (value === "~" || value.startsWith("~/") || value.startsWith("~\\")) {
		const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
		return path.join(home, value.slice(value === "~" ? 1 : 2));
	}
	return value;
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
//#endregion
export { waitForCodexDesktopGeneration as A, retirePendingSharedClientEntryIfUnclaimed as C, waitForUnclaimedSharedClientStartup as D, waitForCodexAppServerClientExit as E, createCodexDesktopGenerationService as O, retainSharedCodexAppServerClientByInstanceId as S, retireSharedCodexAppServerClientsBeforeDesktopGeneration as T, observeSharedClientAcquire as _, readCodexCliAuthFileApiKey as a, releaseSharedClientEntry as b, resolveCodexAppServerPreparedApiKeyCacheKey as c, getCurrentSharedClientEntry as d, getOrCreateSharedClientEntry as f, observeAcquire as g, notifyDesktopGenerationDrainChecks as h, fingerprintTokenAuthProfileCacheKey as i, readCodexDesktopArtifactTreeFingerprint as j, isCodexDesktopGenerationCurrent as k, closeSharedClientEntryIfUnclaimed as l, hasActiveSharedCodexAppServerWork as m, CODEX_AUTH_JSON_FILENAME as n, readFirstNonEmptyEnv as o, getSharedCodexAppServerClientState as p, fingerprintApiKeyAuthProfileCacheKey as r, resolveCodexAppServerFallbackApiKeyCacheKey as s, CODEX_APP_SERVER_API_KEY_ENV_VARS as t, createCodexAppServerStartupLifetime as u, ownCodexStartup as v, retireSharedCodexAppServerClientIfCurrent as w, retainSharedClientEntry as x, recordSharedClientAcquireBoundary as y };
