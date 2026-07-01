export type TimeFormatPreference = "auto" | "12" | "24";
export type ResolvedTimeFormat = "12" | "24";
/** Resolve a valid IANA timezone from config, host preferences, or UTC. */
export declare function resolveUserTimezone(configured?: string): string;
/** Resolve 12/24-hour display preference, detecting the host for `auto`. */
export declare function resolveUserTimeFormat(preference?: TimeFormatPreference): ResolvedTimeFormat;
/** Format a stable YYYY-MM-DD stamp in the requested timezone. */
export declare function formatDateStamp(nowMs: number, timeZone: string): string;
/** Normalize Date, second, millisecond, or parseable string timestamps. */
export declare function normalizeTimestamp(raw: unknown): {
    timestampMs: number;
    timestampUtc: string;
} | undefined;
/** Add normalized timestamp fields without overwriting valid existing values. */
export declare function withNormalizedTimestamp<T extends Record<string, unknown>>(value: T, rawTimestamp: unknown): T & {
    timestampMs?: number;
    timestampUtc?: string;
};
/** Format the prompt-facing localized time string with weekday and date. */
export declare function formatUserTime(date: Date, timeZone: string, format: ResolvedTimeFormat): string | undefined;
