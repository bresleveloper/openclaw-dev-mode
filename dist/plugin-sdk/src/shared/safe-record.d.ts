/** Defensive object guard for values that may have hostile traps. */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Read one property from a record-like value without letting traps escape. */
export declare function readRecordValue(value: unknown, key: string): unknown;
/** Copy array entries defensively from values that may throw on length/index access. */
export declare function copyArrayEntries(value: unknown): unknown[];
/** Copy record entries whose values are also record-shaped. */
export declare function copyRecordEntries<T>(value: unknown): Array<[string, T]>;
