export declare const COMPLETION_SHELLS: readonly ["zsh", "bash", "powershell", "fish"];
export type CompletionShell = (typeof COMPLETION_SHELLS)[number];
export declare const COMPLETION_SKIP_PLUGIN_COMMANDS_ENV = "OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS";
/** Narrows an arbitrary shell label to a completion shell supported by installer logic. */
export declare function isCompletionShell(value: string): value is CompletionShell;
/** Resolves the active shell from environment paths, defaulting to zsh for unknown shells. */
export declare function resolveShellFromEnv(env?: NodeJS.ProcessEnv): CompletionShell;
/** Returns the per-shell cached completion script path for a sanitized CLI binary name. */
export declare function resolveCompletionCachePath(shell: CompletionShell, binName: string): string;
/** Check if the completion cache file exists for the given shell. */
export declare function completionCacheExists(shell: CompletionShell, binName?: string): Promise<boolean>;
/** Formats the command users can run to reload the shell profile after installation. */
export declare function formatCompletionReloadCommand(shell: CompletionShell, profilePath: string): string;
/** Resolves the shell startup profile path that should contain the OpenClaw completion block. */
export declare function resolveCompletionProfilePath(shell: CompletionShell, options?: {
    env?: NodeJS.ProcessEnv;
    homeDir?: () => string;
    platform?: NodeJS.Platform;
}): string;
/** Returns whether a shell profile already contains an OpenClaw completion block or source line. */
export declare function isCompletionInstalled(shell: CompletionShell, binName?: string): Promise<boolean>;
/**
 * Check if the profile uses the slow dynamic completion pattern.
 * Returns true if profile has `source <(openclaw completion ...)` instead of cached file.
 */
export declare function usesSlowDynamicCompletion(shell: CompletionShell, binName?: string): Promise<boolean>;
export declare function installCompletion(shell: string, yes: boolean, binName?: string): Promise<void>;
