import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
/**
 * `message_tool_only` allows the model to stay silent by simply not calling the
 * message tool, so short private final text is not evidence of message loss.
 * Warn only for unusually substantive private finals, which usually means the
 * model wrote a user-facing answer but missed the configured delivery tool.
 */
export declare function shouldWarnAboutPrivateMessageToolFinal(params: {
    sourceReplyDeliveryMode: SourceReplyDeliveryMode | undefined;
    sendPolicyDenied: boolean;
    successfulSourceReplyDelivery: boolean;
    finalText: string;
}): boolean;
/**
 * Emit metadata-only operator signal. The body is intentionally omitted:
 * `message_tool_only` keeps normal final text private by design.
 */
export declare function warnPrivateMessageToolFinal(params: {
    sessionKey: string | undefined;
    channel: string | undefined;
    finalTextLength: number;
}): void;
