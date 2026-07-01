import type { TalkEvent } from "./talk-events.js";
/**
 * Log severity produced from Talk event envelopes.
 */
type TalkLogLevel = "info" | "warn";
/**
 * Compact structured log record for a non-noisy Talk event.
 */
type TalkLogRecord = {
    level: TalkLogLevel;
    message: string;
    attributes: Record<string, string | number | boolean>;
};
/**
 * Converts high-level Talk events into compact structured log records, skipping noisy deltas.
 */
export declare function createTalkLogRecord(event: TalkEvent): TalkLogRecord | undefined;
/**
 * Emits Talk logs best-effort so logging failures never break realtime audio handling.
 */
export declare function recordTalkLogEvent(event: TalkEvent): void;
export {};
