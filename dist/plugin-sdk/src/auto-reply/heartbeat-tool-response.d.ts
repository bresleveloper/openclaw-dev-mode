import type { ReplyPayload } from "./reply-payload.js";
/** Tool name used by heartbeat runs to report visible or silent progress. */
export declare const HEARTBEAT_RESPONSE_TOOL_NAME = "heartbeat_respond";
/** Allowed heartbeat response outcomes. */
export declare const HEARTBEAT_TOOL_OUTCOMES: readonly ["no_change", "progress", "done", "blocked", "needs_attention"];
type HeartbeatToolOutcome = (typeof HEARTBEAT_TOOL_OUTCOMES)[number];
/** Allowed heartbeat notification priorities. */
export declare const HEARTBEAT_TOOL_PRIORITIES: readonly ["low", "normal", "high"];
type HeartbeatToolPriority = (typeof HEARTBEAT_TOOL_PRIORITIES)[number];
/** Normalized response emitted by the heartbeat response tool. */
export type HeartbeatToolResponse = {
    outcome: HeartbeatToolOutcome;
    notify: boolean;
    summary: string;
    notificationText?: string;
    reason?: string;
    priority?: HeartbeatToolPriority;
    nextCheck?: string;
};
/** Validate and normalize unknown heartbeat tool output. */
export declare function normalizeHeartbeatToolResponse(value: unknown): HeartbeatToolResponse | undefined;
/** Resolve the user-visible notification text for a heartbeat response. */
export declare function getHeartbeatToolNotificationText(response: HeartbeatToolResponse): string;
/** Store a heartbeat tool response in reply channel data for later extraction. */
export declare function createHeartbeatToolResponsePayload(response: HeartbeatToolResponse): ReplyPayload;
/** Find the last heartbeat tool response embedded in a reply result. */
export declare function resolveHeartbeatToolResponseFromReplyResult(replyResult: ReplyPayload | ReplyPayload[] | undefined): HeartbeatToolResponse | undefined;
export {};
