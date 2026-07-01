import { type ConnectParams, type ErrorShape } from "../../packages/gateway-protocol/src/index.js";
import type { GatewayClient, GatewayRequestContext } from "./server-methods/shared-types.js";
/**
 * Starts the agent-consult chat run that backs realtime Talk tool calls.
 */
export declare function startTalkRealtimeAgentConsult(params: {
    context: GatewayRequestContext;
    client: GatewayClient | null;
    isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
    requestId: string;
    sessionKey: string;
    callId: string;
    args: unknown;
    relaySessionId?: string;
    connId?: string;
}): Promise<{
    ok: true;
    runId: string;
    idempotencyKey: string;
} | {
    ok: false;
    error: ErrorShape;
}>;
