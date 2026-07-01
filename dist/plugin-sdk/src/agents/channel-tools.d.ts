import type { ChannelAgentTool, ChannelMessageActionName } from "../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export { copyChannelAgentToolMeta, getChannelAgentToolMeta } from "./channel-tool-metadata.js";
type ChannelMessageActionDiscoveryParams = {
    cfg?: OpenClawConfig;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
};
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
export declare function listChannelSupportedActions(params: ChannelMessageActionDiscoveryParams & {
    channel?: string;
}): ChannelMessageActionName[];
/**
 * Get the list of all supported message actions across all configured channels.
 */
export declare function listAllChannelSupportedActions(params: ChannelMessageActionDiscoveryParams): ChannelMessageActionName[];
/** List agent tools contributed by registered channel plugins. */
export declare function listChannelAgentTools(params: {
    cfg?: OpenClawConfig;
}): ChannelAgentTool[];
/** Resolve channel-specific message tool hints for system prompt assembly. */
export declare function resolveChannelMessageToolHints(params: {
    cfg?: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): string[];
/** Resolve channel prompt capabilities, including native approval UI support. */
export declare function resolveChannelPromptCapabilities(params: {
    cfg?: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): string[];
/** Resolve optional channel reaction guidance for assistant replies. */
export declare function resolveChannelReactionGuidance(params: {
    cfg?: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): {
    level: "minimal" | "extensive";
    channel: string;
} | undefined;
/** Test-only utilities for channel tool discovery state. */
export declare const testing: {
    resetLoggedListActionErrors(): void;
};
export { testing as __testing };
