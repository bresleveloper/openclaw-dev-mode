import type { OpenClawConfig } from "../config/types.js";
import { type ExplicitGatewayAuth } from "./credentials.js";
/** Resolves best-effort credentials for non-mutating local/remote gateway probes. */
export declare function resolveGatewayProbeSurfaceAuth(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    surface: "local" | "remote";
}): Promise<{
    token?: string;
    password?: string;
    diagnostics?: string[];
}>;
/** Resolves credentials for client paths that must either authenticate or explain the failure. */
export declare function resolveGatewayInteractiveSurfaceAuth(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
    suppressEnvAuthFallback?: boolean;
    surface: "local" | "remote";
}): Promise<{
    token?: string;
    password?: string;
    failureReason?: string;
}>;
