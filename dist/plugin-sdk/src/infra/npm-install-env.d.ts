/** Options that scope npm config and cache paths for project-local installs. */
export type NpmProjectInstallEnvOptions = {
    cacheDir?: string;
    npmConfigCwd?: string;
    npmConfigPrefix?: string | null;
};
type NpmFreshnessConfigScope = {
    npmConfigCwd?: string;
    npmConfigPrefix?: string | null;
};
/**
 * Builds npm args that bypass host freshness policies for OpenClaw-managed installs.
 * Existing npmrc policy decides whether `before` or `min-release-age` is safer.
 */
export declare function createNpmFreshnessBypassArgs(env?: NodeJS.ProcessEnv, now?: Date, scope?: NpmFreshnessConfigScope): string[];
/** Applies the same npm freshness bypass policy through environment variables. */
export declare function applyNpmFreshnessBypassEnv(env: NodeJS.ProcessEnv, now?: Date, scope?: NpmFreshnessConfigScope): void;
/**
 * Creates npm env for project-local installs, clearing global/workspace config
 * and adding fetch, freshness, cache, and POSIX script-shell defaults.
 */
export declare function createNpmProjectInstallEnv(env: NodeJS.ProcessEnv, options?: NpmProjectInstallEnvOptions, now?: Date): NodeJS.ProcessEnv;
/** Returns true when caller env already pins npm's lifecycle script shell. */
export declare function hasNpmScriptShellSetting(env: NodeJS.ProcessEnv): boolean;
/** Resolves an absolute POSIX shell for npm lifecycle scripts when one is available. */
export declare function resolvePosixNpmScriptShell(env: NodeJS.ProcessEnv): string | null;
/** Sets npm's script-shell env only when the caller has not configured one. */
export declare function applyPosixNpmScriptShellEnv(env: NodeJS.ProcessEnv): void;
export {};
