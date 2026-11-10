//#region src/utils/boolean.d.ts
/**
 * Shared boolean coercion helpers for config, env, and plugin SDK runtime inputs.
 *
 * `asBoolean` is intentionally strict; string parsing is opt-in through
 * `parseBooleanValue` so schema callers do not silently accept ambiguous text.
 */
type BooleanParseOptions = {
  /** Lowercase string values that should parse as true. */
  truthy?: string[];
  /** Lowercase string values that should parse as false. */
  falsy?: string[];
};
declare function asBoolean(value: unknown): boolean | undefined;
declare function parseBooleanValue(value: unknown, options?: BooleanParseOptions): boolean | undefined;
//#endregion
//#region src/shared/string-sample.d.ts
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
//#endregion
export { asBoolean as n, parseBooleanValue as r, summarizeStringEntries as t };