import type { GatewayAuthMode, GatewayTailscaleMode } from "../config/types.gateway.js";
/** True when Tailscale exposure is configured without gateway authentication. */
export declare function isUnsafeGatewayTailscaleNoAuth(params: {
    authMode?: GatewayAuthMode;
    tailscaleMode?: GatewayTailscaleMode;
}): boolean;
/** Formats the shared validation message for unsafe Tailscale no-auth exposure. */
export declare function formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode: GatewayTailscaleMode): string;
