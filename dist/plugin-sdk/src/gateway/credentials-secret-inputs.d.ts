import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExplicitGatewayAuth, type GatewayCredentialMode, type GatewayCredentialPrecedence, type GatewayRemoteCredentialFallback, type GatewayRemoteCredentialPrecedence } from "./credentials.js";
import { type SupportedGatewaySecretInputPath } from "./secret-input-paths.js";
type GatewayCredentialSecretInputOptions = {
    config: OpenClawConfig;
    explicitAuth?: ExplicitGatewayAuth;
    urlOverride?: string;
    urlOverrideSource?: "cli" | "env";
    env?: NodeJS.ProcessEnv;
    modeOverride?: GatewayCredentialMode;
    localTokenPrecedence?: GatewayCredentialPrecedence;
    localPasswordPrecedence?: GatewayCredentialPrecedence;
    remoteTokenPrecedence?: GatewayRemoteCredentialPrecedence;
    remotePasswordPrecedence?: GatewayRemoteCredentialPrecedence;
    remoteTokenFallback?: GatewayRemoteCredentialFallback;
    remotePasswordFallback?: GatewayRemoteCredentialFallback;
};
/** Test whether resolving a configured secret-ref path could affect selected credentials. */
export declare function gatewaySecretInputPathCanWin(params: GatewayCredentialSecretInputOptions & {
    path: SupportedGatewaySecretInputPath;
}): boolean;
/** Resolve Gateway credentials after materializing winning configured secret refs. */
export declare function resolveGatewayCredentialsWithSecretInputs(params: GatewayCredentialSecretInputOptions): Promise<{
    token?: string;
    password?: string;
}>;
export {};
