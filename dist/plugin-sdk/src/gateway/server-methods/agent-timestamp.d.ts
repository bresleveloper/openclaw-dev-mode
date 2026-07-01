import type { OpenClawConfig } from "../../config/types.js";
export interface TimestampInjectionOptions {
    timezone?: string;
    now?: Date;
    includeTimestamp?: boolean;
}
/**
 * Build a `[DOW YYYY-MM-DD HH:MM TZ] ` prefix string from an explicit date.
 *
 * Returns undefined if formatting fails (malformed timezone etc.).
 * Does NOT guard against TIMESTAMP_ENVELOPE_PATTERN or CRON_TIME_MARKER —
 * callers that need those guards should use {@link injectTimestamp} instead.
 *
 * This is the primitive used by the persistence path to stamp each stored
 * message with ITS OWN arrival timestamp (not the current wall-clock time),
 * so historical messages carry a stable, immutable prefix.
 */
export declare function buildTimestampPrefix(date: Date, opts?: Pick<TimestampInjectionOptions, "timezone">): string | undefined;
/**
 * Injects a compact timestamp prefix into a message if one isn't already
 * present. Uses the same `YYYY-MM-DD HH:MM TZ` format as channel envelope
 * timestamps ({@link formatZonedTimestamp}), keeping token cost low (~7
 * tokens) and format consistent across all agent contexts.
 *
 * NOTE: The standard user-turn path no longer calls this. Per-message stamps
 * are now applied once at the LLM boundary (normalizeMessagesForLlmBoundary)
 * from each message's own timestamp, so storage stays bare and the current and
 * historical sends are byte-identical — eliminating the prompt-cache bust
 * described in issue #3658. This helper is retained only for any remaining
 * non-user-turn callers and as the shared prefix primitive's wrapper.
 *
 * Channel messages (Discord, Telegram, etc.) already have timestamps via
 * envelope formatting and take a separate code path — they never reach
 * these handlers, so there is no double-stamping risk. The detection
 * pattern is a safety net for edge cases.
 *
 * @see https://github.com/openclaw/openclaw/issues/3658
 */
export declare function injectTimestamp(message: string, opts?: TimestampInjectionOptions): string;
/**
 * Build TimestampInjectionOptions from an OpenClawConfig.
 */
export declare function timestampOptsFromConfig(cfg: OpenClawConfig): TimestampInjectionOptions;
