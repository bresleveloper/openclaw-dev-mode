import type { SourceReplyDeliveryMode } from "../../../auto-reply/get-reply-options.types.js";
import type { AfterToolCallContext, AfterToolCallResult, Agent } from "../../runtime/index.js";
/**
 * Determines whether a `message.send` tool call delivered a visible source reply
 * in message-tool-only delivery mode. Only implicit-route, non-dry-run,
 * delivered sends qualify; explicit routes and errors are not source replies.
 */
export declare function isDeliveredMessageToolOnlySourceReply(params: {
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    context: AfterToolCallContext;
    hookResult?: AfterToolCallResult;
}): boolean;
/** Installs an after-tool hook that records source reply delivery evidence. */
export declare function installMessageToolOnlyTerminalHook(params: {
    agent: Agent;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    onDeliveredSourceReply?: () => void;
}): void;
