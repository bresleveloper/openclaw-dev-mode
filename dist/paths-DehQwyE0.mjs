import { u as resolveGatewayNativeServiceIdentityConflict } from "./constants-CJCmIHb-.mjs";
import { t as normalizeHomeDirValue } from "./home-dir-D0b-ywue.mjs";
import { i as resolveRequiredHomeDir, n as resolveHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { n as normalizeProfileName, r as resolveProfileStateDir } from "./profile-utils-D5FwriYc.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import { n as parseTcpPort } from "./tcp-port-BVV_ljmK.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/config/state-dir.ts
const LEGACY_STATE_DIRNAMES = [".clawdbot"];
const NEW_STATE_DIRNAME = ".openclaw";
function resolveDefaultHomeDir() {
	return resolveRequiredHomeDir(process.env, os.homedir);
}
function resolveLegacyStateDirs(homedir = resolveDefaultHomeDir) {
	return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
function resolveNewStateDir(homedir = resolveDefaultHomeDir) {
	return path.join(homedir(), NEW_STATE_DIRNAME);
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
	if (isFastTestRuntimeEnv(env)) return newDir;
	if (fs.existsSync(newDir)) return newDir;
	const existingLegacy = resolveLegacyStateDirs(effectiveHomedir).find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	if (existingLegacy) return existingLegacy;
	return newDir;
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
let isNixMode = resolveIsNixMode();
/** Config mutation policy is independent of Nix package and service ownership. */
function resolveIsConfigReadOnly(env = process.env) {
	return env.OPENCLAW_CONFIG_READONLY === "1" || resolveIsNixMode(env);
}
const CONFIG_FILENAME = "openclaw.json";
const LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
/** True when the root CLI selected a non-default isolated profile. */
function isNamedProfile(env = process.env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	return Boolean(profile && profile.toLowerCase() !== "default");
}
function resolveSystemAccountHomeDir() {
	return os.userInfo().homedir;
}
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
function normalizePathForComparison(candidate) {
	const resolved = path.resolve(candidate);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		return resolved;
	}
}
/** Whether the process uses the default home-scoped state directory. */
function isDefaultStateDir(env = process.env, homedir = envHomedir(env)) {
	if (!env.OPENCLAW_STATE_DIR?.trim()) return true;
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	return normalizePathForComparison(resolveStateDir(env, effectiveHomedir)) === normalizePathForComparison(resolveNewStateDir(effectiveHomedir));
}
function resolveNativeServiceProfileConflict(env = process.env, platform = process.platform) {
	if (platform !== "darwin" && platform !== "win32") return null;
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	if (profile !== profile.toLowerCase()) return profile;
	if (platform !== "darwin") return null;
	return profile === "gateway" || profile === "node" ? profile : null;
}
/** Whether host service management belongs to the active default install identity. */
function isDefaultInstallIdentity(env = process.env, homedir = resolveSystemAccountHomeDir, platform = process.platform) {
	const accountHome = resolveRequiredHomeDir({}, homedir);
	if (normalizeHomeDirValue(env.OPENCLAW_HOME)) return false;
	if (normalizePathForComparison(resolveRequiredHomeDir(env, homedir)) !== normalizePathForComparison(accountHome)) return false;
	if (resolveNativeServiceProfileConflict(env, platform) || resolveGatewayNativeServiceIdentityConflict(env, platform)) return false;
	let canonicalStateDir;
	try {
		canonicalStateDir = resolveProfileStateDir(env.OPENCLAW_PROFILE ?? "default", env, homedir);
	} catch {
		return false;
	}
	if (normalizePathForComparison(resolveStateDir(env, envHomedir(env))) !== normalizePathForComparison(canonicalStateDir)) return false;
	if (!isNamedProfile(env) && !env.OPENCLAW_CONFIG_PATH?.trim()) return true;
	return normalizePathForComparison(resolveConfigPathCandidate(env, envHomedir(env))) === normalizePathForComparison(path.join(canonicalStateDir, CONFIG_FILENAME));
}
/** Whether external session catalogs may inherit a scan root from process HOME. */
function allowsProcessHomeSessionScan(env = process.env, homedir = resolveSystemAccountHomeDir, platform = process.platform) {
	return !isNamedProfile(env) && isDefaultInstallIdentity(env, homedir, platform);
}
function normalizeStateDirEnv(env = process.env) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, envHomedir(env));
	const openclawOverride = env.OPENCLAW_STATE_DIR?.trim();
	if (openclawOverride) env.OPENCLAW_STATE_DIR = resolveUserPath(openclawOverride, env, effectiveHomedir);
}
function resolveUserPath(input, env = process.env, homedir = envHomedir(env)) {
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
/**
* Optional allowlist of directories that `$include` directives may resolve
* outside the config directory. Set via `OPENCLAW_INCLUDE_ROOTS` as a
* platform-delimited path list (`:` on POSIX, `;` on Windows).
*
* Each entry is tilde-expanded and resolved to an absolute path. Entries that
* cannot be resolved or that are not absolute after expansion are dropped.
*
* Returns an empty array when the var is unset or contains no usable entries,
* preserving the historical behavior where `$include` is confined to the
* directory containing `openclaw.json`.
*/
function resolveIncludeRoots(env = process.env, homedir = envHomedir(env)) {
	const raw = env.OPENCLAW_INCLUDE_ROOTS?.trim();
	if (!raw) return [];
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const seen = /* @__PURE__ */ new Set();
	const roots = [];
	for (const entry of raw.split(path.delimiter)) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const resolved = path.resolve(resolveHomeRelativePath(trimmed, {
			env,
			homedir: effectiveHomedir
		}));
		if (!path.isAbsolute(resolved) || seen.has(resolved)) continue;
		seen.add(resolved);
		roots.push(resolved);
	}
	return roots;
}
let STATE_DIR = resolveStateDir();
/**
* Config file path (JSON or JSON5).
* Can be overridden via OPENCLAW_CONFIG_PATH.
* Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
*/
function resolveCanonicalConfigPath(env = process.env, stateDir) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir ?? resolveStateDir(env, envHomedir(env)), CONFIG_FILENAME);
}
/**
* Resolve the active config path by preferring existing config candidates
* before falling back to the canonical path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	if (isFastTestRuntimeEnv(env)) return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
	const existing = resolveDefaultConfigCandidates(env, homedir).find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
/**
* Active config path (prefers existing config files).
*/
function resolveConfigPath(env = process.env, stateDir, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const selectedStateDir = stateDir ?? resolveStateDir(env, envHomedir(env));
	if (isFastTestRuntimeEnv(env)) return path.join(selectedStateDir, CONFIG_FILENAME);
	const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
	const existing = [path.join(selectedStateDir, CONFIG_FILENAME), ...LEGACY_CONFIG_FILENAMES.map((name) => path.join(selectedStateDir, name))].find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	if (stateOverride) return path.join(selectedStateDir, CONFIG_FILENAME);
	const defaultStateDir = resolveStateDir(env, homedir);
	if (path.resolve(selectedStateDir) === path.resolve(defaultStateDir)) return resolveConfigPathCandidate(env, homedir);
	return path.join(selectedStateDir, CONFIG_FILENAME);
}
let CONFIG_PATH = resolveConfigPathCandidate();
/**
* Re-pins process-stable runtime paths after an early startup selector changes the environment.
*
* Gateway startup must call this before importing runtime modules that derive their own constants
* from these live bindings, otherwise one process can split reads and writes across two targets.
*/
function pinRuntimePaths(env = process.env) {
	normalizeStateDirEnv(env);
	isNixMode = resolveIsNixMode(env);
	STATE_DIR = resolveStateDir(env);
	CONFIG_PATH = resolveConfigPathCandidate(env);
	return {
		configPath: CONFIG_PATH,
		stateDir: STATE_DIR
	};
}
function captureRuntimeStateEnvironment() {
	return {
		...process.env,
		OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR?.trim() || STATE_DIR
	};
}
/**
* Resolve default config path candidates across default locations.
* Order: explicit config path → state-dir-derived paths → new default.
*/
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	if (explicit) return [resolveUserPath(explicit, env, effectiveHomedir)];
	const candidates = [];
	const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (openclawStateDir) {
		const resolved = resolveUserPath(openclawStateDir, env, effectiveHomedir);
		candidates.push(path.join(resolved, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(resolved, name)));
	}
	const defaultDirs = [resolveNewStateDir(effectiveHomedir), ...resolveLegacyStateDirs(effectiveHomedir)];
	for (const dir of defaultDirs) {
		candidates.push(path.join(dir, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(dir, name)));
	}
	return candidates;
}
const DEFAULT_GATEWAY_PORT = 18789;
/**
* Gateway lock directory inside the selected state tree.
* Default: $OPENCLAW_STATE_DIR/tmp/openclaw-<uid> (uid suffix when available).
*/
function resolveGatewayLockDir(stateDir = resolveStateDir(), uid = typeof process.getuid === "function" ? process.getuid() : void 0) {
	const suffix = uid != null ? `openclaw-${uid}` : "openclaw";
	return path.join(normalizePathForComparison(stateDir), "tmp", suffix);
}
/**
* Queue-owned copies of outbound attachments that have not been delivered yet,
* held outside the media store so its TTL sweep cannot reclaim an attachment a
* durable row still has to send.
*/
function resolveDeliveryQueueMediaDir(stateDir) {
	return path.join(stateDir ?? resolveStateDir(), "delivery-queue-media");
}
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
function resolveOAuthDir(env = process.env, stateDir = resolveStateDir(env, envHomedir(env))) {
	const override = env.OPENCLAW_OAUTH_DIR?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir, "credentials");
}
function parseGatewayPortEnvValue(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return null;
	if (/^\d+$/.test(trimmed)) return parseTcpPort(trimmed);
	const bracketedIpv6Match = trimmed.match(/^\[[^\]]+\]:(\d+)$/);
	if (bracketedIpv6Match?.[1]) return parseTcpPort(bracketedIpv6Match[1]);
	const firstColon = trimmed.indexOf(":");
	const lastColon = trimmed.lastIndexOf(":");
	if (firstColon <= 0 || firstColon !== lastColon) return null;
	const suffix = trimmed.slice(firstColon + 1);
	if (!/^\d+$/.test(suffix)) return null;
	return parseTcpPort(suffix);
}
function resolveGatewayPort(cfg, env = process.env) {
	const envRaw = env.OPENCLAW_GATEWAY_PORT?.trim();
	const envPort = parseGatewayPortEnvValue(envRaw);
	if (envPort !== null) return envPort;
	const configPort = cfg?.gateway?.port;
	if (typeof configPort === "number" && Number.isFinite(configPort)) {
		if (configPort > 0) return configPort;
	}
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	if (!profile) return DEFAULT_GATEWAY_PORT;
	let hash = 2166136261;
	for (const byte of Buffer.from(profile, "utf8")) hash = Math.imul(hash ^ byte, 16777619) >>> 0;
	return 2e4 + hash % 4e4;
}
//#endregion
export { resolveOAuthDir as C, resolveStateDirFromHome as D, resolveStateDir as E, resolveNativeServiceProfileConflict as S, resolveNewStateDir as T, resolveGatewayLockDir as _, captureRuntimeStateEnvironment as a, resolveIsConfigReadOnly as b, isNamedProfile as c, pinRuntimePaths as d, resolveCanonicalConfigPath as f, resolveDeliveryQueueMediaDir as g, resolveDefaultConfigCandidates as h, allowsProcessHomeSessionScan as i, isNixMode as l, resolveConfigPathCandidate as m, DEFAULT_GATEWAY_PORT as n, isDefaultInstallIdentity as o, resolveConfigPath as p, STATE_DIR as r, isDefaultStateDir as s, CONFIG_PATH as t, normalizeStateDirEnv as u, resolveGatewayPort as v, resolveLegacyStateDirs as w, resolveIsNixMode as x, resolveIncludeRoots as y };
