import type { GatewayBroadcastFn } from "../server-broadcast-types.js";
/**
 * Presence snapshot broadcaster for gateway clients.
 */
export declare function broadcastPresenceSnapshot(params: {
    broadcast: GatewayBroadcastFn;
    incrementPresenceVersion: () => number;
    getHealthVersion: () => number;
}): number;
