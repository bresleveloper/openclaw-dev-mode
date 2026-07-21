import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
//#region src/config/paths.d.ts
/**
 * Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
 * In this mode:
 * - No auto-install flows should be attempted
 * - Missing dependencies should produce actionable Nix-specific error messages
 * - Config is managed externally (read-only from Nix perspective)
 */
declare function resolveIsNixMode(env?: NodeJS.ProcessEnv): boolean;
declare let isNixMode: boolean;
declare function resolveLegacyStateDirs(homedir?: () => string): string[];
declare function resolveNewStateDir(homedir?: () => string): string;
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare function normalizeStateDirEnv(env?: NodeJS.ProcessEnv): void;
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
declare function resolveIncludeRoots(env?: NodeJS.ProcessEnv, homedir?: () => string): string[];
declare let STATE_DIR: string;
/**
 * Resolve the active config path by preferring existing config candidates
 * before falling back to the canonical path.
 */
declare function resolveConfigPathCandidate(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/**
 * Active config path (prefers existing config files).
 */
declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
declare let CONFIG_PATH: string;
/**
 * Re-pins process-stable runtime paths after an early startup selector changes the environment.
 *
 * Gateway startup must call this before importing runtime modules that derive their own constants
 * from these live bindings, otherwise one process can split reads and writes across two targets.
 */
declare function pinRuntimePaths(env?: NodeJS.ProcessEnv): {
  configPath: string;
  stateDir: string;
};
/**
 * Resolve default config path candidates across default locations.
 * Order: explicit config path → state-dir-derived paths → new default.
 */
declare function resolveDefaultConfigCandidates(env?: NodeJS.ProcessEnv, homedir?: () => string): string[];
declare const DEFAULT_GATEWAY_PORT = 18789;
/**
 * Gateway lock directory (ephemeral).
 * Default: os.tmpdir()/openclaw-<uid> (uid suffix when available).
 */
declare function resolveGatewayLockDir(tmpdir?: () => string): string;
/**
 * OAuth credentials storage directory.
 *
 * Precedence:
 * - `OPENCLAW_OAUTH_DIR` (explicit override)
 * - `$*_STATE_DIR/credentials` (canonical server/default)
 */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveOAuthPath(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
export { resolveOAuthPath as _, normalizeStateDirEnv as a, resolveConfigPathCandidate as c, resolveGatewayPort as d, resolveIncludeRoots as f, resolveOAuthDir as g, resolveNewStateDir as h, isNixMode as i, resolveDefaultConfigCandidates as l, resolveLegacyStateDirs as m, DEFAULT_GATEWAY_PORT as n, pinRuntimePaths as o, resolveIsNixMode as p, STATE_DIR as r, resolveConfigPath as s, CONFIG_PATH as t, resolveGatewayLockDir as u, resolveStateDir as v };