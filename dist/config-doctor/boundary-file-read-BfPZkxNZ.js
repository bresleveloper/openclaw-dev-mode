import { A as normalizeLowercaseStringOrEmpty } from "./runtime-doctor-migrations-Bq3PkBbD.js";
import "./number-coercion-BU-w62w9.js";
import { d as resolveRequiredHomeDir, p as resolveUserPath, u as resolveHomeRelativePath } from "./account-core-D92inL1O.js";
import path from "node:path";
import fs from "node:fs";
import { canUseRootFileOpen, openRootFileSync } from "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/errors";
import os from "node:os";
//#region src/cli/profile-utils.ts
const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
function isValidProfileName(value) {
	return PROFILE_NAME_RE.test(value);
}
/** Resolve the canonical home-scoped state root for a validated CLI profile. */
function resolveProfileStateDir(profile, env, homedir) {
	const trimmed = profile.trim();
	if (!isValidProfileName(trimmed)) throw new Error(`Invalid profile name: ${JSON.stringify(profile)}`);
	const suffix = normalizeLowercaseStringOrEmpty(trimmed) === "default" ? "" : `-${trimmed}`;
	return path.join(resolveRequiredHomeDir(env, homedir), `.openclaw${suffix}`);
}
//#endregion
//#region src/config/state-dir.ts
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
function resolveStateDirFromHome(_env, effectiveHomedir) {
	return resolveNewStateDir(effectiveHomedir);
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
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		roots.push(resolved);
	}
	return roots;
}
resolveStateDir();
/**
* Resolve the explicitly selected or canonical config path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	return resolveConfigPath(env, void 0, homedir);
}
/**
* Active config path.
*/
function resolveConfigPath(env = process.env, stateDir, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	return path.join(stateDir ?? resolveStateDir(env, homedir), CONFIG_FILENAME);
}
resolveConfigPathCandidate();
/**
* Gateway lock directory inside the selected state tree.
* Default: $OPENCLAW_STATE_DIR/tmp/openclaw-<uid> (uid suffix when available).
*/
function resolveGatewayLockDir(stateDir = resolveStateDir(), uid = typeof process.getuid === "function" ? process.getuid() : void 0) {
	return resolveGatewayLockDirForCanonicalStateDir(normalizePathForComparison(stateDir), uid);
}
/** Append the lock layout when the caller has already resolved the state directory. */
function resolveGatewayLockDirForCanonicalStateDir(stateDir, uid = typeof process.getuid === "function" ? process.getuid() : void 0) {
	const suffix = uid != null ? `openclaw-${uid}` : "openclaw";
	return path.join(stateDir, "tmp", suffix);
}
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
function resolveOAuthDir(env = process.env, stateDir = resolveStateDir(env, envHomedir(env))) {
	const override = env.OPENCLAW_OAUTH_DIR?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir, "credentials");
}
//#endregion
export { resolveGatewayLockDirForCanonicalStateDir as a, resolveStateDir as c, resolveGatewayLockDir as i, resolveProfileStateDir as l, openRootFileSync as n, resolveIncludeRoots as o, resolveConfigPath as r, resolveOAuthDir as s, canUseRootFileOpen as t };
