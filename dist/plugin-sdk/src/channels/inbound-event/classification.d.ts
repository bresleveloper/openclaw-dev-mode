import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ConversationFacts } from "../turn/types.js";
import type { InboundEventKind } from "./kind.js";
/**
 * Facts needed to classify whether inbound room activity should wake the agent.
 */
export type ClassifyChannelInboundEventParams = {
    conversation: Pick<ConversationFacts, "kind">;
    unmentionedGroupPolicy?: InboundEventKind;
    wasMentioned?: boolean;
    hasControlCommand?: boolean;
    hasAbortRequest?: boolean;
    commandSource?: "native" | "text";
};
/**
 * Classifies an inbound channel event as an actionable request or passive room event.
 */
export declare function classifyChannelInboundEvent(params: ClassifyChannelInboundEventParams): InboundEventKind;
/**
 * Resolves the configured policy for unmentioned group/channel inbound events.
 */
export declare function resolveUnmentionedGroupInboundPolicy(params: {
    cfg: OpenClawConfig;
    agentId?: string;
}): InboundEventKind;
