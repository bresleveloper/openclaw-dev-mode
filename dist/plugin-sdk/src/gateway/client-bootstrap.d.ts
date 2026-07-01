import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ExplicitGatewayAuth } from "./credentials.js";
/**
 * Maps connection-detail source labels to the override kinds that affect auth fallback.
 */
export declare function resolveGatewayUrlOverrideSource(urlSource: string): "cli" | "env" | undefined;
/**
 * Resolves the URL, auth material, and handshake tuning needed to start a GatewayClient.
 */
export declare function resolveGatewayClientBootstrap(params: {
    config: OpenClawConfig;
    gatewayUrl?: string;
    explicitAuth?: ExplicitGatewayAuth;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    url: string;
    urlSource: string;
    preauthHandshakeTimeoutMs?: number;
    auth: {
        token?: string;
        password?: string;
    };
}>;
