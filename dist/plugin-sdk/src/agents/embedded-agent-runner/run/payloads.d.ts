import type { SourceReplyDeliveryMode } from "../../../auto-reply/get-reply-options.types.js";
import { type HeartbeatToolResponse } from "../../../auto-reply/heartbeat-tool-response.js";
import { type ReplyPayload } from "../../../auto-reply/reply-payload.js";
import type { ReasoningLevel, ThinkLevel, VerboseLevel } from "../../../auto-reply/thinking.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { AssistantMessage } from "../../../llm/types.js";
import type { MessagingToolSourceReplyPayload } from "../../embedded-agent-messaging.types.js";
import type { ToolResultFormat } from "../../embedded-agent-subscribe.shared-types.js";
import { type ToolErrorSummary } from "../../tool-error-summary.js";
type ToolMetaEntry = {
    toolName: string;
    meta?: string;
};
/**
 * Converts a completed embedded attempt into reply payloads for channels. This
 * is the boundary that suppresses duplicate source replies, filters raw API
 * errors, preserves directive metadata, and decides when tool failures must be
 * surfaced to the user.
 */
export declare function buildEmbeddedRunPayloads(params: {
    assistantTexts: string[];
    assistantMessageIndex?: number;
    toolMetas: ToolMetaEntry[];
    lastAssistant: AssistantMessage | undefined;
    currentAssistant?: AssistantMessage | null;
    lastToolError?: ToolErrorSummary;
    config?: OpenClawConfig;
    isCronTrigger?: boolean;
    isHeartbeatTrigger?: boolean;
    sessionKey: string;
    provider?: string;
    model?: string;
    /** Credential auth mode for billing copy (#80877). */
    authMode?: string;
    verboseLevel?: VerboseLevel;
    reasoningLevel?: ReasoningLevel;
    thinkingLevel?: ThinkLevel;
    toolResultFormat?: ToolResultFormat;
    suppressToolErrorWarnings?: boolean | (() => boolean | undefined);
    inlineToolResultsAllowed: boolean;
    didSendViaMessagingTool?: boolean;
    didDeliverSourceReplyViaMessageTool?: boolean;
    messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    agentId?: string;
    runId?: string;
    runAborted?: boolean;
    didSendDeterministicApprovalPrompt?: boolean;
    heartbeatToolResponse?: HeartbeatToolResponse;
}): ReplyPayload[];
export {};
