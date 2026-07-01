import type { GatewayAuthConfig, GatewayTailscaleMode, GatewayTrustedProxyConfig } from "../config/types.gateway.js";
/** Authentication modes after config, override, and credential inputs are combined. */
export type ResolvedGatewayAuthMode = "none" | "token" | "password" | "trusted-proxy";
/** Records which input selected the effective Gateway auth mode. */
export type ResolvedGatewayAuthModeSource = "override" | "config" | "password" | "token" | "default";
/** Fully resolved Gateway auth policy before startup validates required secrets. */
export type ResolvedGatewayAuth = {
    mode: ResolvedGatewayAuthMode;
    modeSource?: ResolvedGatewayAuthModeSource;
    token?: string;
    password?: string;
    allowTailscale: boolean;
    trustedProxy?: GatewayTrustedProxyConfig;
};
/** Shared-secret auth shape exposed to Gateway clients that support a single bearer secret. */
export type EffectiveSharedGatewayAuth = {
    mode: "token" | "password";
    secret: string | undefined;
};
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
export declare function resolveGatewayAuth(params: {
    authConfig?: GatewayAuthConfig | null;
    authOverride?: GatewayAuthConfig | null;
    env?: NodeJS.ProcessEnv;
    tailscaleMode?: GatewayTailscaleMode;
}): ResolvedGatewayAuth;
/** Return the effective token/password secret for clients that cannot model every auth mode. */
export declare function resolveEffectiveSharedGatewayAuth(params: {
    authConfig?: GatewayAuthConfig | null;
    authOverride?: GatewayAuthConfig | null;
    env?: NodeJS.ProcessEnv;
    tailscaleMode?: GatewayTailscaleMode;
}): EffectiveSharedGatewayAuth | null;
