import type { BlockReplyPayload } from "./embedded-agent-payloads.js";
import type { EmbeddedAgentSubscribeContext, EmbeddedAgentSubscribeState } from "./embedded-agent-subscribe.handlers.types.js";
import type { AgentEvent, AgentMessage } from "./runtime/index.js";
/** Moves queued tool media into a non-reasoning assistant reply payload. */
export declare function consumePendingToolMediaIntoReply(state: Pick<EmbeddedAgentSubscribeState, "pendingToolMediaUrls" | "pendingToolAudioAsVoice" | "pendingToolTrustedLocalMedia">, payload: BlockReplyPayload): BlockReplyPayload;
/** Consumes queued tool media as a standalone reply payload. */
export declare function consumePendingToolMediaReply(state: Pick<EmbeddedAgentSubscribeState, "pendingToolMediaUrls" | "pendingToolAudioAsVoice" | "pendingToolTrustedLocalMedia">): BlockReplyPayload | null;
/** Reads queued tool media without clearing it. */
export declare function readPendingToolMediaReply(state: Pick<EmbeddedAgentSubscribeState, "pendingToolMediaUrls" | "pendingToolAudioAsVoice" | "pendingToolTrustedLocalMedia">): BlockReplyPayload | null;
/** Merges pending reply directives into one reply payload and clears them. */
export declare function consumePendingAssistantReplyDirectivesIntoReply(state: Pick<EmbeddedAgentSubscribeState, "pendingAssistantReplyDirectives">, payload: BlockReplyPayload): BlockReplyPayload;
/** True when a reply payload has text, media, or voice content worth sending. */
export declare function hasAssistantVisibleReply(params: {
    text?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    audioAsVoice?: boolean;
}): boolean;
/** Handles assistant message-start boundaries for streaming state. */
export declare function handleMessageStart(ctx: EmbeddedAgentSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
}): void;
/** Handles assistant message deltas, reasoning, directives, and block replies. */
export declare function handleMessageUpdate(ctx: EmbeddedAgentSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
    assistantMessageEvent?: unknown;
}): void;
/** Handles assistant message-end finalization, block flush, and usage commit. */
export declare function handleMessageEnd(ctx: EmbeddedAgentSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
}): void | Promise<void>;
