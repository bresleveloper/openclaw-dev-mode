/** Final execution strategy chosen for a Windows spawn command. */
export type WindowsSpawnResolution = "direct" | "node-entrypoint" | "exe-entrypoint" | "shell-fallback";
/** Direct-spawn resolution before shell fallback is considered. */
export type WindowsSpawnCandidateResolution = Exclude<WindowsSpawnResolution, "shell-fallback">;
/** Direct-spawn candidate before shell fallback policy is applied. */
export type WindowsSpawnProgramCandidate = {
    /** Executable passed to child_process after wrapper resolution. */
    command: string;
    /** Arguments prepended before call-site argv, usually a resolved JS entrypoint. */
    leadingArgv: string[];
    /** Candidate resolution path, or unresolved-wrapper when shell policy must decide. */
    resolution: WindowsSpawnCandidateResolution | "unresolved-wrapper";
    /** Hide the transient Windows console for Node/exe entrypoint launches. */
    windowsHide?: boolean;
};
/** Spawn program after Windows wrapper resolution and fallback policy. */
export type WindowsSpawnProgram = {
    command: string;
    leadingArgv: string[];
    resolution: WindowsSpawnResolution;
    shell?: boolean;
    windowsHide?: boolean;
};
/** Fully materialized child_process invocation for a resolved Windows spawn program. */
export type WindowsSpawnInvocation = {
    command: string;
    argv: string[];
    resolution: WindowsSpawnResolution;
    shell?: boolean;
    windowsHide?: boolean;
};
/** Inputs used to resolve a command into a Windows-safe direct spawn program. */
export type ResolveWindowsSpawnProgramParams = {
    command: string;
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
    execPath?: string;
    packageName?: string;
    /** Trusted compatibility escape hatch for callers that intentionally accept shell-mediated wrapper execution. */
    allowShellFallback?: boolean;
};
/** Inputs for candidate resolution that intentionally excludes shell fallback policy. */
export type ResolveWindowsSpawnProgramCandidateParams = Omit<ResolveWindowsSpawnProgramParams, "allowShellFallback">;
/** Parsed executable plus inline arguments from a command string. */
export type WindowsSpawnCommandInlineArgs = {
    executable: string;
    arguments: string;
};
/** Detect command strings like `node script.js` that should be split before spawn. */
export declare function detectWindowsSpawnCommandInlineArgs(command: string): WindowsSpawnCommandInlineArgs | null;
/** Resolve a Windows command name through PATH and PATHEXT so wrapper inspection sees the real file. */
export declare function resolveWindowsExecutablePath(command: string, env: NodeJS.ProcessEnv): string;
/** Resolve the safest direct spawn candidate for Windows wrappers, scripts, and binaries. */
export declare function resolveWindowsSpawnProgramCandidate(params: ResolveWindowsSpawnProgramCandidateParams): WindowsSpawnProgramCandidate;
/** Apply shell-fallback policy when Windows wrapper resolution could not find a direct entrypoint. */
export declare function applyWindowsSpawnProgramPolicy(params: {
    candidate: WindowsSpawnProgramCandidate;
    allowShellFallback?: boolean;
}): WindowsSpawnProgram;
/** Resolve the final Windows spawn program after candidate discovery and fallback policy. */
export declare function resolveWindowsSpawnProgram(params: ResolveWindowsSpawnProgramParams): WindowsSpawnProgram;
/** Combine a resolved Windows spawn program with call-site argv for actual process launch. */
export declare function materializeWindowsSpawnProgram(program: WindowsSpawnProgram, argv: string[]): WindowsSpawnInvocation;
