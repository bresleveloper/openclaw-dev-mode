/** Type guard for non-array object records at browser-safe boundaries. */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Coerces object-like values to records, falling back to an empty record. */
export declare function asRecord(value: unknown): Record<string, unknown>;
/** Reads a field only when it exists as a string. */
export declare function readStringField(record: Record<string, unknown> | null | undefined, key: string): string | undefined;
/** Returns a non-array record or undefined. */
export declare function asOptionalRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns a non-array record or null. */
export declare function asNullableRecord(value: unknown): Record<string, unknown> | null;
/** Returns any object-backed record, including arrays, or undefined. */
export declare function asOptionalObjectRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns any object-backed record, including arrays, or null. */
export declare function asNullableObjectRecord(value: unknown): Record<string, unknown> | null;
