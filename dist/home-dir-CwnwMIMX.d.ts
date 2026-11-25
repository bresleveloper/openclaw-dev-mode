/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw, or ~/.openclaw-<profile> for a named profile.
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the effective home or falls back to cwd when no home source exists. */
declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
export { resolveUserPath as n, resolveStateDir as r, resolveRequiredHomeDir as t };