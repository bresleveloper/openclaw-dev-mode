export declare const POSIX_SHELL_WRAPPERS: Set<"ash" | "bash" | "dash" | "fish" | "ksh" | "sh" | "zsh">;
export declare const POWERSHELL_WRAPPERS: Set<string>;
type ShellWrapperCommand = {
    isWrapper: boolean;
    command: string | null;
};
/** Return true when an executable token names a supported shell wrapper. */
export declare function isShellWrapperExecutable(token: string): boolean;
/** Return true when argv resolves to a shell wrapper invocation. */
export declare function isShellWrapperInvocation(argv: string[]): boolean;
type ShellMultiplexerUnwrapResult = {
    kind: "not-wrapper";
} | {
    kind: "blocked";
    wrapper: string;
} | {
    kind: "unwrapped";
    wrapper: string;
    argv: string[];
};
/** Unwrap busybox/toybox shell applets or fail closed for ambiguous applets. */
export declare function unwrapKnownShellMultiplexerInvocation(argv: string[]): ShellMultiplexerUnwrapResult;
/** Return true when dispatch wrappers set env before the shell wrapper. */
export declare function hasEnvManipulationBeforeShellWrapper(argv: string[]): boolean;
/** Resolve the argv segment that should be transported for shell execution. */
export declare function resolveShellWrapperTransportArgv(argv: string[]): string[] | null;
/** Extract the raw inline command payload from a shell wrapper argv. */
export declare function extractShellWrapperInlineCommand(argv: string[]): string | null;
/** Extract a command payload only when it is safe to bind to raw command text. */
export declare function extractBindableShellWrapperInlineCommand(argv: string[], rawCommand?: string | null): string | null;
/** Classify shell wrapper argv and return the approval-display command when safe. */
export declare function extractShellWrapperCommand(argv: string[], rawCommand?: string | null): ShellWrapperCommand;
/** Return true when shell wrapper startup behavior blocks command rebinding. */
export declare function isBlockedShellWrapperCommand(argv: string[], rawCommand?: string | null): boolean;
export {};
