//#region packages/normalization-core/src/record-coerce.d.ts
/** Coerces object-like values to records, falling back to an empty record. */
declare function asRecord(value: unknown): Record<string, unknown>;
/** Reads a field only when it exists as a string. */
declare function readStringField(record: Record<string, unknown> | null | undefined, key: string): string | undefined;
/** Returns a non-array record or undefined. */
declare function asOptionalRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns a non-array record or null. */
declare function asNullableRecord(value: unknown): Record<string, unknown> | null;
/** Returns any object-backed record, including arrays, or undefined. */
declare function asOptionalObjectRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns any object-backed record, including arrays, or null. */
declare function asNullableObjectRecord(value: unknown): Record<string, unknown> | null;
//#endregion
//#region src/shared/string-sample.d.ts
/**
 * Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
 * This intentionally formats for humans, not for machine parsing.
 */
/** Formats a bounded comma-separated sample of string entries with a hidden-count suffix. */
declare function summarizeStringEntries(params: {
  /** Entries to summarize; nullish values are treated as an empty list. */entries?: ReadonlyArray<string> | null; /** Maximum visible entries; non-finite values use the default and values below one clamp to one. */
  limit?: number; /** Text returned when no entries are available. */
  emptyText?: string;
}): string;
//#endregion
export { asOptionalRecord as a, asOptionalObjectRecord as i, asNullableObjectRecord as n, asRecord as o, asNullableRecord as r, readStringField as s, summarizeStringEntries as t };