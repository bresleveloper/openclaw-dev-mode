//#region packages/normalization-core/src/record-coerce.d.ts
/** Type guard for non-array object records at browser-safe boundaries. */
declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Coerces object-like values to records, falling back to an empty record. */
declare function asRecord(value: unknown): Record<string, unknown>;
/** Reads a field only when it exists as a string. */
declare function readStringField(record: Record<string, unknown> | null | undefined, key: string): string | undefined;
/** Returns a non-array record or undefined. */
declare function asOptionalRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns a non-array record or a fresh ordinary empty record. */
declare function asNonArrayRecord(value: unknown): Record<string, unknown>;
/** Returns a non-array record or null. */
declare function asNullableRecord(value: unknown): Record<string, unknown> | null;
/** Returns any object-backed record, including arrays, or undefined. */
declare function asOptionalObjectRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns any object-backed record, including arrays, or null. */
declare function asNullableObjectRecord(value: unknown): Record<string, unknown> | null;
/** Retains string-valued own enumerable entries from a non-array record. */
declare function filterStringRecord(value: unknown): Record<string, string> | undefined;
//#endregion
export { asOptionalRecord as a, isRecord as c, asOptionalObjectRecord as i, readStringField as l, asNullableObjectRecord as n, asRecord as o, asNullableRecord as r, filterStringRecord as s, asNonArrayRecord as t };