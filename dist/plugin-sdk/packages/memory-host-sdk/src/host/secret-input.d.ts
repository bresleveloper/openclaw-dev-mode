/** Return true when a configured memory secret contains a literal value or reference. */
export declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
/** Resolve memory secret input, reading env refs directly when available. */
export declare function resolveMemorySecretInputString(params: {
    value: unknown;
    path: string;
}): string | undefined;
