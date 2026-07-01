import type { OpenClawConfig } from "../config/types.openclaw.js";
export { hasGatewayPasswordEnvCandidate, hasGatewayTokenEnvCandidate, trimToUndefined, } from "./credential-planner.js";
export type ExplicitGatewayAuth = {
    token?: string;
    password?: string;
};
type ResolvedGatewayCredentials = {
    token?: string;
    password?: string;
};
/** Selects local Gateway credentials or remote Gateway client credentials. */
export type GatewayCredentialMode = "local" | "remote";
/** Chooses whether environment credentials or config credentials win for local auth. */
export type GatewayCredentialPrecedence = "env-first" | "config-first";
/** Chooses whether remote config or environment credentials win for remote client auth. */
export type GatewayRemoteCredentialPrecedence = "remote-first" | "env-first";
/** Controls whether remote client auth may fall back to env/local credentials. */
export type GatewayRemoteCredentialFallback = "remote-env-local" | "remote-only";
/** Raised when a command path needs Gateway credentials before secret refs were resolved. */
export declare class GatewaySecretRefUnavailableError extends Error {
    readonly code = "GATEWAY_SECRET_REF_UNAVAILABLE";
    readonly path: string;
    constructor(path: string);
}
/** Type guard for unresolved Gateway secret-ref errors, optionally scoped to a config path. */
export declare function isGatewaySecretRefUnavailableError(error: unknown, expectedPath?: string): error is GatewaySecretRefUnavailableError;
/** Resolve direct token/password values with caller-selected env-vs-config precedence. */
export declare function resolveGatewayCredentialsFromValues(params: {
    configToken?: unknown;
    configPassword?: unknown;
    env?: NodeJS.ProcessEnv;
    tokenPrecedence?: GatewayCredentialPrecedence;
    passwordPrecedence?: GatewayCredentialPrecedence;
}): ResolvedGatewayCredentials;
/** Resolve Gateway credentials from config, explicit auth, URL overrides, and mode policy. */
export declare function resolveGatewayCredentialsFromConfig(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
    urlOverride?: string;
    urlOverrideSource?: "cli" | "env";
    modeOverride?: GatewayCredentialMode;
    localTokenPrecedence?: GatewayCredentialPrecedence;
    localPasswordPrecedence?: GatewayCredentialPrecedence;
    remoteTokenPrecedence?: GatewayRemoteCredentialPrecedence;
    remotePasswordPrecedence?: GatewayRemoteCredentialPrecedence;
    remoteTokenFallback?: GatewayRemoteCredentialFallback;
    remotePasswordFallback?: GatewayRemoteCredentialFallback;
}): ResolvedGatewayCredentials;
/** Resolve the stricter credential view used by Gateway probe paths. */
export declare function resolveGatewayProbeCredentialsFromConfig(params: {
    cfg: OpenClawConfig;
    mode: GatewayCredentialMode;
    env?: NodeJS.ProcessEnv;
    explicitAuth?: ExplicitGatewayAuth;
}): ResolvedGatewayCredentials;
