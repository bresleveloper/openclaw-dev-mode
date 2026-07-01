/** Resolves OpenClaw's effective home, honoring OPENCLAW_HOME before OS homes. */
export declare function resolveEffectiveHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string | undefined;
/** Resolves the underlying OS user home, ignoring OPENCLAW_HOME overrides. */
export declare function resolveOsHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string | undefined;
/** Resolves the effective home or falls back to cwd when no home source exists. */
export declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
export declare function resolveRequiredOsHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
export declare function expandHomePrefix(input: string, opts?: {
    home?: string;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): string;
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
export declare function resolveHomeRelativePath(input: string, opts?: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): string;
/**
 * Backward-compatible alias for resolving user paths against the effective home.
 *
 * @deprecated Use resolveHomeRelativePath.
 */
export declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves a user-supplied path against the OS home, ignoring OPENCLAW_HOME. */
export declare function resolveOsHomeRelativePath(input: string, opts?: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): string;
