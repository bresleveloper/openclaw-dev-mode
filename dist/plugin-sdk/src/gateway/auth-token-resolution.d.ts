import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretInputUnresolvedReasonStyle } from "./resolve-configured-secret-input-string.js";
type GatewayAuthTokenResolutionSource = "explicit" | "config" | "secretRef" | "env";
type GatewayAuthTokenEnvFallback = "never" | "no-secret-ref" | "always";
/** Resolves gateway.auth.token with configurable env fallback and SecretRef diagnostics. */
export declare function resolveGatewayAuthToken(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    explicitToken?: string;
    envFallback?: GatewayAuthTokenEnvFallback;
    unresolvedReasonStyle?: SecretInputUnresolvedReasonStyle;
}): Promise<{
    token?: string;
    source?: GatewayAuthTokenResolutionSource;
    secretRefConfigured: boolean;
    unresolvedRefReason?: string;
}>;
export {};
