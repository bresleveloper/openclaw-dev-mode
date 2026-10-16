//#region src/agents/date-time.d.ts
/** Build current prompt text using the configured timezone or the canonical host fallback. */
declare function buildTemporalContextText(params: {
  configuredTimezone?: string;
  sessionStatusAvailable: boolean;
}): string;
/** Add normalized timestamp fields without overwriting valid existing values. */
declare function withNormalizedTimestamp<T extends Record<string, unknown>>(value: T, rawTimestamp: unknown): T & {
  timestampMs?: number;
  timestampUtc?: string;
};
//#endregion
export { withNormalizedTimestamp as n, buildTemporalContextText as t };