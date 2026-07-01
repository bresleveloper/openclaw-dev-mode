import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelOutboundTargetMode } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { GatewayMessageChannel } from "../../utils/message-channel.js";
/**
 * Result of resolving a concrete outbound target for a channel send.
 */
export type OutboundTargetResolution = {
    ok: true;
    to: string;
} | {
    ok: false;
    error: Error;
};
/**
 * Inputs shared by direct and heartbeat outbound target resolution.
 */
export type ResolveOutboundTargetParams = {
    channel: GatewayMessageChannel;
    to?: string;
    allowFrom?: string[];
    cfg?: OpenClawConfig;
    accountId?: string | null;
    mode?: ChannelOutboundTargetMode;
};
/**
 * Resolves a target through a channel plugin or the generic fallback path.
 */
export declare function resolveOutboundTargetWithPlugin(params: {
    plugin: ChannelPlugin | undefined;
    target: ResolveOutboundTargetParams;
    onMissingPlugin?: () => OutboundTargetResolution | undefined;
}): OutboundTargetResolution | undefined;
