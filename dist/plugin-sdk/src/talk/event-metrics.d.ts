/**
 * Shared metric extraction helpers for Talk event diagnostics and logging.
 *
 * Talk event payloads are provider-owned JSON blobs, so callers must coerce
 * records and read only bounded numeric counters that are safe to export.
 */
/** Read the first non-negative finite number from a provider payload record. */
export declare function firstFiniteTalkEventNumber(record: Record<string, unknown> | undefined, keys: readonly string[]): number | undefined;
