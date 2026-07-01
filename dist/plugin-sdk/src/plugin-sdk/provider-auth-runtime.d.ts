import type { OpenClawConfig } from "../config/config.js";
export { resolveEnvApiKey } from "../agents/model-auth-env.js";
export { collectProviderApiKeysForExecution, executeWithApiKeyRotation, } from "../agents/api-key-rotation.js";
export { NON_ENV_SECRETREF_MARKER } from "../agents/model-auth-markers.js";
export { requireApiKey, resolveAwsSdkEnvVarName, type ResolvedProviderAuth, } from "../agents/model-auth-runtime-shared.js";
export type { ProviderPreparedRuntimeAuth } from "../plugins/types.js";
export type { ResolvedProviderRuntimeAuth } from "../plugins/runtime/model-auth-types.js";
/**
 * OAuth authorization code and state captured by the local callback listener.
 */
export type OAuthCallbackResult = {
    /** Authorization code returned by the OAuth provider callback. */
    code: string;
    /** State value returned by the callback and validated against the expected state. */
    state: string;
};
/**
 * Non-secret auth profile metadata used by provider discovery helpers.
 */
export type ProviderAuthProfileMetadata = {
    profileId?: string;
    accountId?: string;
};
export declare function resolveProviderAuthProfileMetadata(params: {
    provider: string;
    cfg?: OpenClawConfig;
    profileId?: string;
    agentDir?: string;
}): ProviderAuthProfileMetadata;
export declare function buildOAuthCallbackOriginResolver(
/** HTTPS IdP hosts allowed to receive a CORS echo from the loopback callback. */
allowedHosts: readonly string[] | undefined): (originHeader: string | string[] | undefined) => string | undefined;
/**
 * Generates a high-entropy OAuth state token for local callback validation.
 */
export declare function generateOAuthState(): string;
/**
 * Parses a pasted OAuth redirect URL into callback code/state fields.
 */
export declare function parseOAuthCallbackInput(
/** Full redirect URL pasted by the operator after manual OAuth completion. */
input: string, messages?: {
    /** Override for URLs that omit the state query parameter. */
    missingState?: string;
    /** Override for values that are not parseable redirect URLs. */
    invalidInput?: string;
}): OAuthCallbackResult | {
    error: string;
};
/**
 * Starts a temporary loopback HTTP listener and waits for a validated OAuth callback.
 */
export declare function waitForLocalOAuthCallback(params: {
    /** State token that the callback must echo before the listener resolves. */
    expectedState: string;
    /** Maximum wait time before the listener rejects. */
    timeoutMs: number;
    /** Loopback port to bind for the temporary callback server. */
    port: number;
    /** URL path accepted as the OAuth callback endpoint. */
    callbackPath: string;
    /** Redirect URI shown in progress messages and provider setup flows. */
    redirectUri: string;
    /** HTML success heading rendered after a valid callback. */
    successTitle: string;
    /** Optional progress message emitted once the listener starts. */
    progressMessage?: string;
    /** Loopback hostname to bind; defaults to localhost. */
    hostname?: string;
    /** Progress callback invoked after the server begins listening. */
    onProgress?: (message: string) => void;
    /**
     * IdP hosts allowed to receive CORS echo on loopback callback preflights.
     */
    corsOriginAllowlist?: readonly string[];
}): Promise<OAuthCallbackResult>;
type ResolveApiKeyForProvider = typeof import("../agents/model-auth.js").resolveApiKeyForProvider;
type GetRuntimeAuthForModel = typeof import("../plugins/runtime/runtime-model-auth.runtime.js").getRuntimeAuthForModel;
/**
 * Resolves provider API-key auth through the runtime auth module when available.
 */
export declare function resolveApiKeyForProvider(
/** Provider auth lookup params forwarded to the runtime auth module. */
params: Parameters<ResolveApiKeyForProvider>[0]): Promise<Awaited<ReturnType<ResolveApiKeyForProvider>>>;
/**
 * Resolves the prepared runtime auth payload for a concrete model request.
 */
export declare function getRuntimeAuthForModel(
/** Concrete model auth request forwarded to the runtime auth module. */
params: Parameters<GetRuntimeAuthForModel>[0]): Promise<Awaited<ReturnType<GetRuntimeAuthForModel>>>;
