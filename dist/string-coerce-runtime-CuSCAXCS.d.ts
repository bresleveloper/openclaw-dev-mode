declare function asBoolean(value: unknown): boolean | undefined;
declare function parseBooleanValue(value: unknown, options?: {
  /** Lowercase string values that should parse as true. */
  truthy?: string[];
  /** Lowercase string values that should parse as false. */
  falsy?: string[];
}): boolean | undefined;
/**
 * Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
 * This intentionally formats for humans, not for machine parsing.
 */
declare function summarizeStringEntries(params: {
  /** Entries to summarize; nullish values are treated as an empty list. */
  entries?: ReadonlyArray<string> | null;
  /** Maximum visible entries; non-finite values use the default and values below one clamp to one. */
  limit?: number;
  emptyText?: string;
}): string;
export { asBoolean as n, parseBooleanValue as r, summarizeStringEntries as t };