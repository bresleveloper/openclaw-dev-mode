import type { GatewayRequestHandlers, GatewayRequestOptions } from "./server-methods/types.js";
export declare const coreGatewayHandlers: GatewayRequestHandlers;
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
export declare function handleGatewayRequest(opts: GatewayRequestOptions & {
    extraHandlers?: GatewayRequestHandlers;
}): Promise<void>;
