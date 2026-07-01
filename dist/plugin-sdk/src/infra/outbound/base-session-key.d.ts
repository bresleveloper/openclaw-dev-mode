import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type RoutePeer } from "../../routing/resolve-route.js";
/**
 * Builds the canonical outbound base-session key for a resolved route peer.
 *
 * Mirrors the routing layer's session-scope rules so outbound-only sends and
 * inbound route resolution keep the same `dmScope` and identity-link behavior.
 */
export declare function buildOutboundBaseSessionKey(params: {
    cfg: OpenClawConfig;
    agentId: string;
    channel: string;
    accountId?: string | null;
    peer: RoutePeer;
}): string;
