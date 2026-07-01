import type { ChannelId, ChannelMessageActionName, ChannelThreadingToolContext } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MessageToolsConfig } from "../../config/types.tools.js";
import type { MessagePresentation } from "../../interactive/payload.js";
/**
 * Builds a channel-native presentation for forwarded cross-context text.
 */
export type CrossContextPresentationBuilder = (message: string) => MessagePresentation;
/**
 * Text and optional rich-presentation wrapper for cross-context outbound sends.
 */
export type CrossContextDecoration = {
    prefix: string;
    suffix: string;
    presentationBuilder?: CrossContextPresentationBuilder;
};
/**
 * Resolves the message-tool policy after applying any agent-specific overrides.
 */
export declare function resolveEffectiveMessageToolsConfig(params: {
    cfg: OpenClawConfig;
    agentId?: string | null;
}): MessageToolsConfig | undefined;
/**
 * Returns the normalized allowed message actions for an agent or the global policy.
 */
export declare function resolveAllowedMessageActions(params: {
    cfg: OpenClawConfig;
    agentId?: string | null;
}): string[] | undefined;
/**
 * Rejects disabled message actions before channel-specific send handling runs.
 */
export declare function enforceMessageActionAllowlist(params: {
    cfg: OpenClawConfig;
    agentId?: string | null;
    action: ChannelMessageActionName;
}): void;
/**
 * Enforces cross-context message-send policy for a bound channel/thread context.
 */
export declare function enforceCrossContextPolicy(params: {
    channel: ChannelId;
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
    toolContext?: ChannelThreadingToolContext;
    cfg: OpenClawConfig;
    agentId?: string | null;
}): void;
/**
 * Builds cross-context marker text or a channel-native presentation for forwarded sends.
 */
export declare function buildCrossContextDecoration(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    target: string;
    toolContext?: ChannelThreadingToolContext;
    accountId?: string | null;
    agentId?: string | null;
}): Promise<CrossContextDecoration | null>;
/**
 * Reports whether an action can carry a cross-context marker in outbound payloads.
 */
export declare function shouldApplyCrossContextMarker(action: ChannelMessageActionName): boolean;
/**
 * Applies text markers or a preferred rich presentation to a cross-context message.
 */
export declare function applyCrossContextDecoration(params: {
    message: string;
    decoration: CrossContextDecoration;
    preferPresentation: boolean;
}): {
    message: string;
    presentation?: MessagePresentation;
    usedPresentation: boolean;
};
