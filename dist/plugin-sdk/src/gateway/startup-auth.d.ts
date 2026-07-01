import type { GatewayAuthConfig, GatewayTailscaleConfig } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveGatewayAuth } from "./auth.js";
export { assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets.js";
/** Merge sparse runtime auth overrides into persisted Gateway auth config. */
export declare function mergeGatewayAuthConfig(base?: GatewayAuthConfig, override?: GatewayAuthConfig): GatewayAuthConfig;
/** Merge sparse runtime Tailscale overrides into persisted Gateway Tailscale config. */
export declare function mergeGatewayTailscaleConfig(base?: GatewayTailscaleConfig, override?: GatewayTailscaleConfig): GatewayTailscaleConfig;
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
export declare function ensureGatewayStartupAuth(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    authOverride?: GatewayAuthConfig;
    tailscaleOverride?: GatewayTailscaleConfig;
    warn?: (message: string) => void;
    /**
     * Legacy startup option retained for external callers. Startup-generated auth
     * is runtime-only; durable auth changes must go through explicit config tools.
     */
    persist?: boolean;
    baseHash?: string;
}): Promise<{
    cfg: OpenClawConfig;
    auth: ReturnType<typeof resolveGatewayAuth>;
    generatedToken?: string;
    persistedGeneratedToken: boolean;
}>;
