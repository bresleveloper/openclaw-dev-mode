type SafeBinSemanticValidationParams = {
    binName?: string;
    positional: readonly string[];
};
/** Normalizes a configured safe-bin entry to its executable basename without Windows suffixes. */
export declare function normalizeSafeBinName(raw: string): string;
/** Applies command-specific semantic gates for executables that are risky as broad safeBins. */
export declare function validateSafeBinSemantics(params: SafeBinSemanticValidationParams): boolean;
/** Lists configured safeBins that need operator warnings because their semantics are broad. */
export declare function listRiskyConfiguredSafeBins(entries: Iterable<string>): Array<{
    bin: string;
    warning: string;
}>;
export {};
