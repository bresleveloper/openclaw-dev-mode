import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { RoutePeer } from "../../routing/resolve-route.js";
import type { ResolvedMessagingTarget } from "./target-resolver.js";
/** Session route produced for an outbound message target. */
export type OutboundSessionRoute = {
    sessionKey: string;
    baseSessionKey: string;
    peer: RoutePeer;
    chatType: "direct" | "group" | "channel";
    from: string;
    to: string;
    threadId?: string | number;
};
/** Inputs required to resolve an outbound target into a session route. */
export type ResolveOutboundSessionRouteParams = {
    cfg: OpenClawConfig;
    channel: ChannelId;
    plugin?: ChannelPlugin;
    agentId: string;
    accountId?: string | null;
    target: string;
    currentSessionKey?: string;
    resolvedTarget?: ResolvedMessagingTarget;
    replyToId?: string | null;
    threadId?: string | number | null;
};
/** Resolves the session route used to mirror outbound delivery into conversation state. */
export declare function resolveOutboundSessionRoute(params: ResolveOutboundSessionRouteParams): Promise<OutboundSessionRoute | null>;
/** Persists best-effort session metadata for an outbound-only route. */
export declare function ensureOutboundSessionEntry(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    accountId?: string | null;
    route: OutboundSessionRoute;
}): Promise<void>;
