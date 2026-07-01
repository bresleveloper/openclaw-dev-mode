import type { GatewayRequestContext } from "./types.js";
export type SessionChangedPayload = {
    sessionKey?: string;
    agentId?: string;
    reason: string;
    compacted?: boolean;
};
export declare function emitSessionsChanged(context: Pick<GatewayRequestContext, "broadcastToConnIds" | "chatAbortControllers" | "getRuntimeConfig" | "getSessionEventSubscriberConnIds">, payload: SessionChangedPayload): void;
