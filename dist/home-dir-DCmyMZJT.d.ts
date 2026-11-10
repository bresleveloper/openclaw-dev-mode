//#region src/config/state-dir.d.ts
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
//#region src/infra/home-dir.d.ts
/** Resolves the effective home or falls back to cwd when no home source exists. */
declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
export { resolveUserPath as n, resolveStateDir as r, resolveRequiredHomeDir as t };