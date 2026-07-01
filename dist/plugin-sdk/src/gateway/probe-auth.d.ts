import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExplicitGatewayAuth } from "./credentials.js";
export { resolveGatewayProbeTarget } from "./probe-target.js";
export type { GatewayProbeTargetResolution } from "./probe-target.js";
export declare function resolveGatewayProbeCredentialConfig(params: {
    cfg: OpenClawConfig;
    mode: "local" | "remote";
}): OpenClawConfig;
/** Resolves synchronous probe auth, throwing when configured secrets cannot be read. */
export declare function resolveGatewayProbeAuth(params: {
    cfg: OpenClawConfig;
    mode: "local" | "remote";
    env?: NodeJS.ProcessEnv;
}): {
    token?: string;
    password?: string;
};
/** Resolves probe auth with async SecretRef support. */
export declare function resolveGatewayProbeAuthWithSecretInputs(params: {
    cfg: OpenClawConfig;
    mode: "local" | "remote";
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
}): Promise<{
    token?: string;
    password?: string;
}>;
/** Resolves probe auth without throwing for unavailable SecretRefs, returning a warning. */
export declare function resolveGatewayProbeAuthSafeWithSecretInputs(params: {
    cfg: OpenClawConfig;
    mode: "local" | "remote";
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
}): Promise<{
    auth: {
        token?: string;
        password?: string;
    };
    warning?: string;
}>;
/** Synchronous safe probe auth wrapper for config-only credential paths. */
export declare function resolveGatewayProbeAuthSafe(params: {
    cfg: OpenClawConfig;
    mode: "local" | "remote";
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
}): {
    auth: {
        token?: string;
        password?: string;
    };
    warning?: string;
};
