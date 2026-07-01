export declare const POSIX_INLINE_COMMAND_FLAGS: Set<string>;
export declare const POWERSHELL_INLINE_COMMAND_FLAGS: Set<string>;
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
export declare function advancePosixInlineOptionScan(token: string): number;
/** Find the inline command payload for a shell wrapper argv. */
export declare function resolveInlineCommandMatch(argv: string[], flags: ReadonlySet<string>, options?: {
    allowCombinedC?: boolean;
    isOptionToken?: (token: string) => boolean;
    restValueFlags?: ReadonlySet<string>;
    stopAtFirstNonOption?: boolean;
    valueOptions?: ReadonlySet<string>;
}): {
    command: string | null;
    valueTokenIndex: number | null;
};
/** Return true when an inline shell payload directly dispatches positional args. */
export declare function isDirectShellPositionalCarrierCommand(command: string): boolean;
/** Find the PowerShell inline command payload and value token index. */
export declare function resolvePowerShellInlineCommandMatch(argv: string[]): {
    command: string | null;
    valueTokenIndex: number | null;
};
/** Return true when a PowerShell flag consumes the rest of argv as command text. */
export declare function isPowerShellInlineRestCommandFlag(token: string): boolean;
/** Return true when a PowerShell flag treats the next token as script file text. */
export declare function isPowerShellInlineFileCommandFlag(token: string): boolean;
/** Detect POSIX interactive startup before an inline command flag. */
export declare function hasPosixInteractiveStartupBeforeInlineCommand(argv: readonly string[], flags: ReadonlySet<string>): boolean;
/** Detect POSIX login startup before an inline command flag. */
export declare function hasPosixLoginStartupBeforeInlineCommand(argv: readonly string[], flags: ReadonlySet<string>): boolean;
/** Detect fish init-command options that run before the inline command. */
export declare function hasFishInitCommandOption(argv: string[]): boolean;
/** Detect fish attached `-cCOMMAND` forms that should not be rebound. */
export declare function hasFishAttachedCommandOption(argv: string[]): boolean;
