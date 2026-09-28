import { n as defineCodexBuildState } from "./build-state-C7EnDVgr.mjs";
import { u as resolveMacOSDesktopCodexAppPathCandidates } from "./managed-binary-BnshlFag.mjs";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-h2VHOskC.mjs";
import { createHash } from "node:crypto";
import fs, { constants, existsSync, watch } from "node:fs";
import path from "node:path";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { sha256File } from "openclaw/plugin-sdk/file-access-runtime";
import { readSecretFile } from "openclaw/plugin-sdk/secret-file";
//#region extensions/codex/src/app-server/desktop-generation-fingerprint.ts
const MAX_COMPUTER_USE_PLUGIN_TREE_ENTRIES = 4096;
/** Fingerprints every desktop candidate that can own a managed fallback artifact. */
async function readMacOSDesktopGenerationFingerprint(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const entries = [];
	for (const candidate of candidates) {
		const command = await statFingerprint(candidate.appServerCommandPath);
		entries.push(`candidate:${candidate.appName}:${candidate.appServerCommandPath}:${command}`);
		for (const artifactPath of resolveMacOSDesktopGenerationPaths(candidate)) entries.push(`${artifactPath}\0${await statFingerprint(artifactPath)}`);
		const pluginRoot = resolveComputerUsePluginRoot(candidate);
		entries.push(`${pluginRoot}\0${await directoryTreeFingerprint(pluginRoot)}`);
	}
	return createHash("sha256").update(entries.join("\0")).digest("hex");
}
function resolveMacOSDesktopGenerationPaths(candidate) {
	return [
		candidate.appBundlePath,
		path.join(candidate.bundledMarketplacePath, ".agents", "plugins", "marketplace.json"),
		...candidate.computerUseServiceAppPaths.flatMap((servicePath) => [
			servicePath,
			path.join(servicePath, "Contents", "Info.plist"),
			path.join(servicePath, "Contents", "SharedSupport", "SkyComputerUseClient.app", "Contents", "MacOS", "SkyComputerUseClient")
		])
	];
}
function resolveComputerUsePluginRoot(candidate) {
	return path.join(candidate.bundledMarketplacePath, "plugins", "computer-use");
}
/** Stable roots that cover bundle replacement and recursive artifact updates. */
function resolveMacOSDesktopGenerationWatchPaths(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const watched = /* @__PURE__ */ new Set(["/Applications"]);
	for (const candidate of candidates) watched.add(candidate.appBundlePath);
	return [...watched];
}
async function directoryTreeFingerprint(root) {
	let rootStat;
	try {
		rootStat = await fs$1.lstat(root, { bigint: true });
	} catch (error) {
		if (isNodeError(error, "ENOENT") || isNodeError(error, "ENOTDIR")) return "missing";
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
		if (isNodeError(error, "ENOENT") || isNodeError(error, "ENOTDIR")) return "missing";
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
function isNodeError(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
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
	let stopped = false;
	const markDirty = () => {
		invalidation += 1;
		dirty = true;
	};
	const reconcile = () => {
		if (refresh) return refresh;
		refresh = (async () => {
			for (;;) {
				if (stopped) throw new Error("Codex desktop generation owner stopped");
				const observedInvalidation = invalidation;
				const first = await params.readFingerprint();
				await delay(SETTLE_DELAY_MS);
				if (stopped) throw new Error("Codex desktop generation owner stopped");
				const second = await params.readFingerprint();
				if (stopped) throw new Error("Codex desktop generation owner stopped");
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
		isCurrent: (candidate) => Boolean(candidate && !dirty && generation && candidate.epoch === generation.epoch && candidate.fingerprint === generation.fingerprint),
		stop: () => {
			stopped = true;
		}
	};
}
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
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
		id: "codex-desktop-generation",
		async start(ctx) {
			if (runtime.platform !== "darwin") return;
			const current = state();
			current.context = ctx;
			current.readFingerprint = runtime.readFingerprint;
			current.resolveWatchPaths = runtime.resolveWatchPaths;
			current.pathExists = runtime.pathExists;
			current.watchPath = runtime.watchPath;
			current.owner = createCodexDesktopGenerationOwner({
				readFingerprint: current.readFingerprint,
				onGenerationChange: params.onGenerationChange,
				initialGeneration: current.lastGeneration
			});
			armWatchers(current);
			refreshGeneration(current, current.owner, current.owner.refresh());
		},
		async stop() {
			const current = state();
			current.lastGeneration = current.owner?.read() ?? current.lastGeneration;
			current.owner?.stop();
			current.owner = void 0;
			current.armEpoch = (current.armEpoch ?? 0) + 1;
			current.context = void 0;
			current.readFingerprint = void 0;
			current.resolveWatchPaths = void 0;
			current.pathExists = void 0;
			current.watchPath = void 0;
			current.watchHealthy = void 0;
			current.rearmDelayMs = void 0;
			if (current.rearmTimer) {
				clearTimeout(current.rearmTimer);
				current.rearmTimer = void 0;
			}
			closeWatchers(current);
		}
	};
}
function armWatchers(current) {
	const owner = current.owner;
	if (!owner || current.watchers) return false;
	const armEpoch = (current.armEpoch ?? 0) + 1;
	current.armEpoch = armEpoch;
	const watchers = /* @__PURE__ */ new Set();
	current.watchers = watchers;
	const candidateNames = new Set(resolveMacOSDesktopCodexAppPathCandidates("darwin").map((candidate) => candidate.appName));
	let complete = true;
	for (const watchedPath of current.resolveWatchPaths?.() ?? []) {
		if (!current.pathExists?.(watchedPath)) continue;
		try {
			const watcher = current.watchPath?.(watchedPath, { recursive: watchedPath !== APPLICATIONS_PATH }, (_eventType, filename) => {
				if (!isCurrentArm(current, owner, watchers, armEpoch)) return;
				if (watchedPath === APPLICATIONS_PATH && filename && !candidateNames.has(filename.toString().split(path.sep)[0] ?? "")) return;
				owner.markDirty();
				scheduleRearm(current, owner);
			});
			if (!watcher) {
				complete = false;
				reportWatcherFailure(current, owner, /* @__PURE__ */ new Error(`Could not watch ${watchedPath}`));
				scheduleRearm(current, owner);
				continue;
			}
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
	return current.owner === owner && current.watchers === watchers && current.armEpoch === armEpoch;
}
function scheduleRearm(current, owner) {
	if (current.rearmTimer) {
		if (current.watchHealthy === false) return;
		clearTimeout(current.rearmTimer);
	}
	const delayMs = current.watchHealthy === false ? current.rearmDelayMs ?? REARM_INITIAL_DELAY_MS : REARM_INITIAL_DELAY_MS;
	if (current.watchHealthy === false) current.rearmDelayMs = Math.min(delayMs * 2, REARM_MAX_DELAY_MS);
	current.rearmTimer = setTimeout(() => {
		current.rearmTimer = void 0;
		if (current.owner !== owner) return;
		const wasUnhealthy = current.watchHealthy === false;
		closeWatchers(current);
		if (!armWatchers(current) || wasUnhealthy) owner.markDirty();
		refreshGeneration(current, owner, owner.wait());
	}, delayMs);
	current.rearmTimer.unref();
}
function logRefreshFailure(current, owner) {
	return (error) => {
		if (current.owner !== owner) return;
		current.context?.serviceHealth?.reportFailure(error);
		current.context?.logger.warn(`codex desktop generation refresh failed: ${String(error)}`);
	};
}
function refreshGeneration(current, owner, refresh) {
	refresh.then(() => {
		if (current.owner === owner && current.watchHealthy) current.context?.serviceHealth?.clearFailure();
	}).catch(logRefreshFailure(current, owner));
}
function closeWatchers(current) {
	const watchers = current.watchers;
	current.watchers = void 0;
	for (const watcher of watchers ?? []) watcher.close();
}
//#endregion
//#region extensions/codex/src/app-server/auth-cache-key.ts
/** Auth cache identity and native CLI credential reads, without login or refresh. */
const CODEX_HOME_ENV_VAR = "CODEX_HOME";
const HOME_ENV_VAR = "HOME";
const CODEX_HOME_DIRNAME = ".codex";
const CODEX_AUTH_JSON_FILENAME = "auth.json";
const CODEX_APP_SERVER_API_KEY_ENV_VARS = ["CODEX_API_KEY", "OPENAI_API_KEY"];
function resolveCodexAppServerEnvApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	const apiKey = readFirstNonEmptyEnvEntry(resolveCodexAppServerSpawnEnv(params.startOptions, params.baseEnv ?? process.env, params.platform ?? process.platform), CODEX_APP_SERVER_API_KEY_ENV_VARS);
	if (!apiKey) return;
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-env-api-key:v1");
	hash.update("\0");
	hash.update(apiKey.key);
	hash.update("\0");
	hash.update(apiKey.value);
	return `${apiKey.key}:sha256:${hash.digest("hex")}`;
}
function resolveCodexAppServerFallbackApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	return resolveCodexAppServerEnvApiKeyCacheKey(params) ?? resolveCodexCliAuthFileApiKeyCacheKey(params.baseEnv ?? process.env);
}
/** Secret-free cache identity for an API key already resolved by the runtime plan. */
function resolveCodexAppServerPreparedApiKeyCacheKey(apiKey) {
	const resolved = apiKey?.trim();
	return resolved ? fingerprintApiKeyAuthProfileCacheKey(resolved) : void 0;
}
function fingerprintApiKeyAuthProfileCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `api_key:sha256:${hash.digest("hex")}`;
}
function fingerprintTokenAuthProfileCacheKey(accessToken) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-token:v1");
	hash.update("\0");
	hash.update(accessToken);
	return `token:sha256:${hash.digest("hex")}`;
}
function fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-cli-auth-json-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `CODEX_AUTH_JSON:sha256:${hash.digest("hex")}`;
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
	if (!parsed || typeof parsed !== "object") return;
	const apiKey = parsed.OPENAI_API_KEY;
	return typeof apiKey === "string" && apiKey.trim() ? apiKey.trim() : void 0;
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
		return apiKey ? fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) : void 0;
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
export { readCodexCliAuthFileApiKey as a, resolveCodexAppServerPreparedApiKeyCacheKey as c, waitForCodexDesktopGeneration as d, fingerprintTokenAuthProfileCacheKey as i, createCodexDesktopGenerationService as l, CODEX_AUTH_JSON_FILENAME as n, readFirstNonEmptyEnv as o, fingerprintApiKeyAuthProfileCacheKey as r, resolveCodexAppServerFallbackApiKeyCacheKey as s, CODEX_APP_SERVER_API_KEY_ENV_VARS as t, isCodexDesktopGenerationCurrent as u };
