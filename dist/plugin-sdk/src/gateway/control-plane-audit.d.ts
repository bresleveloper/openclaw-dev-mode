import type { GatewayClient } from "./server-methods/types.js";
/** Stable actor fields included in control-plane audit and rate-limit logs. */
export type ControlPlaneActor = {
    actor: string;
    deviceId: string;
    clientIp: string;
    connId: string;
};
/** Extracts audit identity from a possibly missing or partially connected client. */
export declare function resolveControlPlaneActor(client: GatewayClient | null): ControlPlaneActor;
/** Formats actor identity as compact key/value text for structured gateway logs. */
export declare function formatControlPlaneActor(actor: ControlPlaneActor): string;
/** Summarizes changed config/state paths without letting audit logs grow unbounded. */
export declare function summarizeChangedPaths(paths: string[], maxPaths?: number): string;
