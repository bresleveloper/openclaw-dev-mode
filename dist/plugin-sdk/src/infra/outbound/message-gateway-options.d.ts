import { type GatewayClientMode, type GatewayClientName } from "../../utils/message-channel.js";
/** Raw gateway options accepted by outbound message senders. */
export type OutboundMessageGatewayOptionsInput = {
    url?: string;
    token?: string;
    timeoutMs?: number;
    clientName?: GatewayClientName;
    clientDisplayName?: string;
    mode?: GatewayClientMode;
};
/** Normalizes outbound gateway options and fills CLI defaults. */
export declare function resolveOutboundMessageGatewayOptions(gateway?: OutboundMessageGatewayOptionsInput): {
    url: string | undefined;
    token: string | undefined;
    timeoutMs: number;
    clientName: import("@openclaw/gateway-protocol/client-info").GatewayClientId;
    clientDisplayName: string | undefined;
    mode: GatewayClientMode;
};
