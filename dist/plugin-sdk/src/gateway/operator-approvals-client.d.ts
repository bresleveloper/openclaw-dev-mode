import type { OpenClawConfig } from "../config/types.openclaw.js";
import { GatewayClient, type GatewayClientOptions } from "./client.js";
/** Create a Gateway client authorized for operator approval event handling. */
export declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk" | "onReconnectPaused"> & {
    config: OpenClawConfig;
    gatewayUrl?: string;
}): Promise<GatewayClient>;
/** Run a callback with a started operator-approvals Gateway client and close it after. */
export declare function withOperatorApprovalsGatewayClient<T>(params: {
    config: OpenClawConfig;
    gatewayUrl?: string;
    clientDisplayName: string;
}, run: (client: GatewayClient) => Promise<T>): Promise<T>;
