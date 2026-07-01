/**
 * Detects message-tool sends that delivered a visible reply to the current source.
 */
import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
/** Return true when a result envelope carries a provider message identifier. */
export declare function hasMessagingDeliveryReceipt(value: unknown): boolean;
/** Return true only when a messaging tool result proves a real visible delivery. */
export declare function isDeliveredMessagingToolResult(params: {
    toolName?: string;
    args?: unknown;
    result?: unknown;
    hookResult?: unknown;
    isError?: boolean;
}): boolean;
/**
 * Only implicit-route, non-dry-run, delivered `message.send` calls qualify.
 * Explicit routes and other messaging tools are outbound side effects, not source replies.
 */
export declare function isDeliveredMessageToolOnlySourceReplyResult(params: {
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    toolName: string;
    args?: unknown;
    result?: unknown;
    hookResult?: unknown;
    isError?: boolean;
}): boolean;
