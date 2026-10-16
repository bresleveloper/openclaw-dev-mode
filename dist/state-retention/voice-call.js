import path from "node:path";
import fs from "node:fs/promises";
import { hasNodeErrorCode as hasErrnoCode } from "@openclaw/fs-safe/path";
import fs$1 from "node:fs";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/output";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
import "@openclaw/fs-safe/config";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or undefined. */
function asOptionalRecord(value) {
	return isRecord(value) ? value : void 0;
}
//#endregion
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}));
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
//#endregion
//#region src/plugins/doctor-retired-state.ts
/** Refuses retired files without parsing, importing, or removing their contents. */
function defineRetiredPluginStateMigration(params) {
	const inspect = async (input, candidates) => {
		const sources = [];
		for (const source of candidates ?? await params.findSources(input)) {
			const sourcePath = typeof source === "string" ? source : source.directory;
			try {
				const stat = await fs.lstat(sourcePath);
				if (typeof source === "string" || !stat.isDirectory()) {
					sources.push(sourcePath);
					continue;
				}
				for (const name of await fs.readdir(sourcePath)) if (name.startsWith(source.prefix ?? "") && name.endsWith(source.suffix)) sources.push(path.join(sourcePath, name));
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			}
		}
		return [...new Set(sources)].toSorted();
	};
	const describe = (sources) => `${params.label} uses a retired pre-July 2026 format: ${sources.join(", ")}. Install OpenClaw ${params.intermediateVersion}. ${params.recoveryInstructions ?? "Run openclaw doctor --fix before upgrading to latest."} Retired files were left untouched. If the intermediate Doctor retains a listed file, verify its migration or recovery needs, back it up, and move it out of the active state directory before retrying.`;
	const warnings = async (input, candidates) => {
		const sources = await inspect(input, candidates);
		return sources.length ? [describe(sources)] : [];
	};
	return {
		id: params.id,
		label: params.label,
		collectBackupResources: async (input) => (await inspect(input)).map((source) => ({
			path: source,
			kind: "file"
		})),
		async detectLegacyState(input) {
			const preview = await warnings(input);
			return preview.length ? { preview } : null;
		},
		async migrateLegacyState(input) {
			return {
				changes: [],
				warnings: await warnings(input)
			};
		},
		async assertSupportedState(input, candidates) {
			const found = await warnings(input, candidates);
			if (found.length) throw new Error(found.join("\n"));
		}
	};
}
//#endregion
//#region packages/normalization-core/src/home-dir.ts
function normalizeHomeDirValue(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(homedir) {
	try {
		return normalizeHomeDirValue(homedir());
	} catch {
		return;
	}
}
function resolveTermuxHome(env) {
	const prefix = normalizeHomeDirValue(env.PREFIX);
	if (!prefix || !normalizeHomeDirValue(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeDirValue(env.HOME) ?? normalizeHomeDirValue(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawOsHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir, options) {
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveOsHomeDir(env, homedir);
	if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
		const osHome = resolveRawOsHomeDir(env, homedir);
		if (!osHome) return options?.preserveUnresolvedTilde ? path.resolve(explicitHome) : void 0;
		return path.resolve(explicitHome.replace(/^~(?=$|[\\/])/, () => osHome));
	}
	return path.resolve(explicitHome);
}
//#endregion
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/home-dir.ts
const userPathBaseDirectory = resolveGlobalSingleton(Symbol.for("openclaw.userPathBaseDirectory"), () => new AsyncLocalStorage());
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
function resolvePathWithHome(input, opts, resolveHome) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed, {
		home: resolveHome(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
		env: opts?.env,
		homedir: opts?.homedir
	}) : trimmed;
	const base = userPathBaseDirectory.getStore();
	return base ? path.resolve(base, expanded) : path.resolve(expanded);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	return resolvePathWithHome(input, opts, resolveRequiredHomeDir);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath$1(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
//#endregion
//#region src/infra/test-runtime-env.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
function isVitestRuntimeEnv(env = process.env) {
	const vitest = env.VITEST;
	return vitest === "true" || vitest === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0 || env.NODE_ENV === "test";
}
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
function isFastTestRuntimeEnv(env = process.env) {
	return env.OPENCLAW_TEST_FAST === "1" && (isVitestRuntimeEnv(env) || env !== process.env && isVitestRuntimeEnv(process.env));
}
//#endregion
//#region src/config/state-dir.ts
function resolveLegacyStateDirs(homedir = resolveRequiredHomeDir) {
	return [path.join(homedir(), ".clawdbot")];
}
function resolveNewStateDir(homedir = resolveRequiredHomeDir) {
	return path.join(homedir(), ".openclaw");
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(env, effectiveHomedir) {
	const newDir = resolveNewStateDir(effectiveHomedir);
	if (isFastTestRuntimeEnv(env) || fs$1.existsSync(newDir)) return newDir;
	return resolveLegacyStateDirs(effectiveHomedir).find((dir) => fs$1.existsSync(dir)) ?? newDir;
}
//#endregion
//#region src/config/paths.ts
/**
* Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
* In this mode:
* - No auto-install flows should be attempted
* - Missing dependencies should produce actionable Nix-specific error messages
* - Config is managed externally (read-only from Nix perspective)
*/
function resolveIsNixMode(env = process.env) {
	return env.OPENCLAW_NIX_MODE === "1";
}
resolveIsNixMode();
const CONFIG_FILENAME = "openclaw.json";
const LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
function configPathsInStateDir(stateDir) {
	return [CONFIG_FILENAME, ...LEGACY_CONFIG_FILENAMES].map((name) => path.join(stateDir, name));
}
function findExistingConfigPath(candidates) {
	return candidates.find((candidate) => fs$1.existsSync(candidate));
}
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
resolveStateDir();
/**
* Config file path (JSON or JSON5).
* Can be overridden via OPENCLAW_CONFIG_PATH.
* Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
*/
function resolveCanonicalConfigPath(env = process.env, stateDir) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath$1(override, env, envHomedir(env));
	return path.join(stateDir ?? resolveStateDir(env, envHomedir(env)), CONFIG_FILENAME);
}
/**
* Resolve the active config path by preferring existing config candidates
* before falling back to the canonical path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath$1(override, env, homedir);
	if (isFastTestRuntimeEnv(env)) return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
	return findExistingConfigPath(resolveDefaultConfigCandidates(env, homedir)) ?? resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
resolveConfigPathCandidate();
/**
* Resolve default config path candidates across default locations.
* Order: explicit config path → state-dir-derived paths → new default.
*/
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	if (explicit) return [resolveUserPath$1(explicit, env, effectiveHomedir)];
	const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
	return [
		...openclawStateDir ? [resolveUserPath$1(openclawStateDir, env, effectiveHomedir)] : [],
		resolveNewStateDir(effectiveHomedir),
		...resolveLegacyStateDirs(effectiveHomedir)
	].flatMap(configPathsInStateDir);
}
//#endregion
//#region extensions/voice-call/src/utils.ts
/** Runtime uses the OS home; Doctor supplies the home from its migration environment. */
function resolveUserPath(input, homedir = os.homedir) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, homedir));
}
//#endregion
//#region extensions/voice-call/src/store-path.ts
/** Resolve the plugin-owned store below OpenClaw's canonical state directory. */
function resolveDefaultVoiceCallStoreDir(env = process.env) {
	return path.join(resolveStateDir(env), "voice-calls");
}
/** Read the configured voice-call store path from either package id. */
function getVoiceCallConfigStore(config) {
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const store = asOptionalRecord(config.plugins?.entries?.[pluginId]?.config)?.store;
		if (typeof store === "string" && store.trim()) return store.trim();
	}
	return "";
}
/** Resolve the voice-call store path used by legacy and plugin-state call records. */
function resolveVoiceCallStorePath(params) {
	const configuredStore = getVoiceCallConfigStore(params.config);
	if (configuredStore) return resolveUserPath(configuredStore, () => params.env.HOME?.trim() || os.homedir());
	return resolveDefaultVoiceCallStoreDir(params.env);
}
//#endregion
//#region extensions/voice-call/state-retention-api.ts
const packageName = "@openclaw/voice-call";
const stateMigrations = [defineRetiredPluginStateMigration({
	id: "voice-call-calls-jsonl-to-plugin-state",
	label: "Voice Call JSONL call log",
	intermediateVersion: "2026.9.7",
	findSources: (input) => [path.join(resolveVoiceCallStorePath(input), "calls.jsonl")]
})];
//#endregion
export { packageName, stateMigrations };
