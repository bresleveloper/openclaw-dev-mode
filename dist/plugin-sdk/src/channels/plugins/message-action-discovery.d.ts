import { type TSchema } from "typebox";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelMessageCapability } from "./message-capabilities.js";
import { type ChannelMessageToolDiscoveryAdapter } from "./message-tool-api.js";
import type { ChannelMessageActionDiscoveryContext, ChannelMessageActionName, ChannelMessageToolSchemaContribution } from "./types.public.js";
/**
 * Input used to discover channel message actions for agent tool schemas.
 */
export type ChannelMessageActionDiscoveryInput = {
    cfg?: OpenClawConfig;
    channel?: string | null;
    currentChannelProvider?: string | null;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
    senderIsOwner?: boolean;
};
type ChannelMessageActionDiscoveryParams = ChannelMessageActionDiscoveryInput & {
    cfg: OpenClawConfig;
};
type ChannelMessageToolMediaSourceParamKeyInput = ChannelMessageActionDiscoveryParams & {
    action?: ChannelMessageActionName;
};
/**
 * Normalizes a raw channel/provider id before consulting action discovery hooks.
 */
export declare function resolveMessageActionDiscoveryChannelId(raw?: string | null): string | undefined;
/**
 * Builds the context object passed to plugin message-tool discovery hooks.
 */
export declare function createMessageActionDiscoveryContext(params: ChannelMessageActionDiscoveryInput): ChannelMessageActionDiscoveryContext;
type ResolvedChannelMessageActionDiscovery = {
    actions: ChannelMessageActionName[];
    capabilities: readonly ChannelMessageCapability[];
    schemaContributions: ChannelMessageToolSchemaContribution[];
    mediaSourceParams: readonly string[];
};
/**
 * Finds the lightest available message-tool discovery adapter for one channel.
 */
export declare function resolveCurrentChannelMessageToolDiscoveryAdapter(channel?: string | null): {
    pluginId: string;
    actions: ChannelMessageToolDiscoveryAdapter;
} | null;
/**
 * Resolves one plugin's message action metadata with caller-selected fields.
 */
export declare function resolveMessageActionDiscoveryForPlugin(params: {
    pluginId: string;
    actions?: ChannelMessageToolDiscoveryAdapter;
    context: ChannelMessageActionDiscoveryContext;
    action?: ChannelMessageActionName;
    includeActions?: boolean;
    includeCapabilities?: boolean;
    includeSchema?: boolean;
}): ResolvedChannelMessageActionDiscovery;
/**
 * Lists actions whose schemas do not block cross-channel tool usage.
 */
export declare function listCrossChannelSchemaSupportedMessageActions(params: ChannelMessageActionDiscoveryParams & {
    channel?: string;
}): ChannelMessageActionName[];
/**
 * Lists message capabilities advertised across registered channel plugins.
 */
export declare function listChannelMessageCapabilities(cfg: OpenClawConfig): ChannelMessageCapability[];
/**
 * Lists message capabilities advertised by the current channel.
 */
export declare function listChannelMessageCapabilitiesForChannel(params: ChannelMessageActionDiscoveryParams): ChannelMessageCapability[];
/**
 * Resolves extra message-tool schema properties from channel discovery hooks.
 */
export declare function resolveChannelMessageToolSchemaProperties(params: ChannelMessageActionDiscoveryParams): Record<string, TSchema>;
/**
 * Resolves tool parameter names that should be treated as media source selectors.
 */
export declare function resolveChannelMessageToolMediaSourceParamKeys(params: ChannelMessageToolMediaSourceParamKeyInput): string[];
/**
 * Returns whether any registered channel advertises a message capability.
 */
export declare function channelSupportsMessageCapability(cfg: OpenClawConfig, capability: ChannelMessageCapability): boolean;
/**
 * Returns whether the current channel advertises a message capability.
 */
export declare function channelSupportsMessageCapabilityForChannel(params: ChannelMessageActionDiscoveryParams, capability: ChannelMessageCapability): boolean;
export declare const testing: {
    resetLoggedMessageActionErrors(): void;
};
export { testing as __testing };
