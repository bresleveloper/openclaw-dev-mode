import { type ChatType } from "../../channels/chat-type.js";
import type { ChannelOutboundTargetMode } from "../../channels/plugins/types.core.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { AgentDefaultsConfig } from "../../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { DeliveryContext } from "../../utils/delivery-context.types.js";
import type { DeliverableMessageChannel, GatewayMessageChannel } from "../../utils/message-channel.js";
import { type OutboundTargetResolution } from "./targets-resolve-shared.js";
/** Deliverable channel id accepted by outbound target resolution. */
export type OutboundChannel = DeliverableMessageChannel;
/** Heartbeat target channel id from agent/default heartbeat config. */
export type HeartbeatTarget = OutboundChannel;
/** Resolved outbound delivery destination and routing hints. */
export type OutboundTarget = {
    channel: OutboundChannel;
    to?: string;
    chatType?: ChatType;
    reason?: string;
    accountId?: string;
    threadId?: string | number;
    lastChannel?: DeliverableMessageChannel;
    lastAccountId?: string;
};
/** Sender identity context used when a heartbeat needs channel-compatible metadata. */
export type HeartbeatSenderContext = {
    sender: string;
    provider?: DeliverableMessageChannel;
    allowFrom: string[];
};
export type { OutboundTargetResolution } from "./targets-resolve-shared.js";
export { resolveSessionDeliveryTarget, type SessionDeliveryTarget } from "./targets-session.js";
/** Resolves a user-supplied outbound destination through the channel plugin. */
export declare function resolveOutboundTarget(params: {
    channel: GatewayMessageChannel;
    to?: string;
    allowFrom?: string[];
    allowBootstrap?: boolean;
    cfg?: OpenClawConfig;
    accountId?: string | null;
    mode?: ChannelOutboundTargetMode;
}): OutboundTargetResolution;
/** Resolves the heartbeat delivery destination from config, session state, and turn source. */
export declare function resolveHeartbeatDeliveryTarget(params: {
    cfg: OpenClawConfig;
    entry?: SessionEntry;
    heartbeat?: AgentDefaultsConfig["heartbeat"];
    turnSource?: DeliveryContext;
}): OutboundTarget;
/** Resolves heartbeat delivery and lets plugins refine the outbound session route. */
export declare function resolveHeartbeatDeliveryTargetWithSessionRoute(params: {
    cfg: OpenClawConfig;
    agentId: string;
    entry?: SessionEntry;
    heartbeat?: AgentDefaultsConfig["heartbeat"];
    turnSource?: DeliveryContext;
    currentSessionKey?: string;
}): Promise<OutboundTarget>;
/** Resolves the sender id/allow-list context used for heartbeat sends. */
export declare function resolveHeartbeatSenderContext(params: {
    cfg: OpenClawConfig;
    entry?: SessionEntry;
    delivery: OutboundTarget;
}): HeartbeatSenderContext;
