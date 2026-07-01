/** Returns whether a value is a plain MCP config record. */
export declare function isMcpConfigRecord(value: unknown): value is Record<string, unknown>;
/** Coerces string/number/boolean entries from a config object into strings. */
export declare function toMcpStringRecord(value: unknown, options?: {
    onDroppedEntry?: (key: string, value: unknown) => void;
}): Record<string, string> | undefined;
/** Coerces MCP env config while dropping dangerous inherited host env names. */
export declare function toMcpEnvRecord(value: unknown, options?: {
    onDroppedEntry?: (key: string, value: unknown) => void;
}): Record<string, string> | undefined;
/** Coerces an MCP string-array config value, dropping non-string entries. */
export declare function toMcpStringArray(value: unknown): string[] | undefined;
