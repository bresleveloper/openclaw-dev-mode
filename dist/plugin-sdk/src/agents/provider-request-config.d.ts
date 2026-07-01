import type { ModelDefinitionConfig } from "../config/types.js";
import type { ConfiguredModelProviderRequest, ConfiguredProviderRequest } from "../config/types.provider-request.js";
import type { PinnedDispatcherPolicy } from "../infra/net/ssrf.js";
import type { Api } from "../llm/types.js";
import type { ProviderRequestCapabilities, ProviderRequestCapability, ProviderRequestTransport } from "./provider-attribution.js";
import { type ProviderRequestPolicyResolution } from "./provider-attribution.js";
type RequestApi = Api | ModelDefinitionConfig["api"];
/** Auth override accepted from sanitized provider/model request config. */
export type ProviderRequestAuthOverride = {
    mode: "provider-default";
} | {
    mode: "authorization-bearer";
    token: string;
} | {
    mode: "header";
    headerName: string;
    value: string;
    prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
export type ProviderRequestTlsOverride = {
    ca?: string;
    cert?: string;
    key?: string;
    passphrase?: string;
    serverName?: string;
    insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
export type ProviderRequestProxyOverride = {
    mode: "env-proxy";
    tls?: ProviderRequestTlsOverride;
} | {
    mode: "explicit-proxy";
    url: string;
    tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
export type ProviderRequestTransportOverrides = {
    headers?: Record<string, string>;
    auth?: ProviderRequestAuthOverride;
    proxy?: ProviderRequestProxyOverride;
    tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
export type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
    allowPrivateNetwork?: boolean;
};
type ResolvedProviderRequestAuthConfig = {
    configured: false;
    mode: "provider-default" | "authorization-bearer";
    injectAuthorizationHeader: boolean;
} | {
    configured: true;
    mode: "authorization-bearer";
    headerName: "Authorization";
    value: string;
    injectAuthorizationHeader: true;
} | {
    configured: true;
    mode: "header";
    headerName: string;
    value: string;
    prefix?: string;
    injectAuthorizationHeader: false;
};
type ResolvedProviderRequestProxyConfig = {
    configured: false;
} | {
    configured: true;
    mode: "env-proxy";
    tls: ResolvedProviderRequestTlsConfig;
} | {
    configured: true;
    mode: "explicit-proxy";
    proxyUrl: string;
    tls: ResolvedProviderRequestTlsConfig;
};
type ResolvedProviderRequestTlsConfig = {
    configured: false;
} | {
    configured: true;
    ca?: string;
    cert?: string;
    key?: string;
    passphrase?: string;
    serverName?: string;
    rejectUnauthorized?: boolean;
};
type ResolvedProviderRequestExtraHeadersConfig = {
    configured: boolean;
    headers?: Record<string, string>;
};
export type ResolvedProviderRequestConfig = {
    api?: RequestApi;
    baseUrl?: string;
    headers?: Record<string, string>;
    extraHeaders: ResolvedProviderRequestExtraHeadersConfig;
    auth: ResolvedProviderRequestAuthConfig;
    proxy: ResolvedProviderRequestProxyConfig;
    tls: ResolvedProviderRequestTlsConfig;
    policy: ProviderRequestPolicyResolution;
};
type ProviderRequestHeaderPrecedence = "caller-wins" | "defaults-win";
type ResolvedProviderRequestPolicyConfig = ResolvedProviderRequestConfig & {
    allowPrivateNetwork: boolean;
    privateNetworkExplicitlyDenied: boolean;
    capabilities: ProviderRequestCapabilities;
};
type ResolveProviderRequestPolicyConfigParams = {
    provider?: string;
    api?: RequestApi;
    baseUrl?: string;
    defaultBaseUrl?: string;
    capability?: ProviderRequestCapability;
    transport?: ProviderRequestTransport;
    discoveredHeaders?: Record<string, string>;
    providerHeaders?: Record<string, string>;
    modelHeaders?: Record<string, string>;
    callerHeaders?: Record<string, string>;
    precedence?: ProviderRequestHeaderPrecedence;
    authHeader?: boolean;
    compat?: unknown;
    modelId?: string | null;
    allowPrivateNetwork?: boolean;
    request?: ModelProviderRequestTransportOverrides;
};
/** Sanitizes provider-level request overrides after secret resolution. */
export declare function sanitizeConfiguredProviderRequest(request: ConfiguredProviderRequest | undefined): ProviderRequestTransportOverrides | undefined;
/** Sanitizes model-level request overrides after secret resolution. */
export declare function sanitizeConfiguredModelProviderRequest(request: ConfiguredModelProviderRequest | undefined): ModelProviderRequestTransportOverrides | undefined;
/** Merges provider request overrides with later entries taking precedence. */
export declare function mergeProviderRequestOverrides(...overrides: Array<ProviderRequestTransportOverrides | undefined>): ProviderRequestTransportOverrides | undefined;
/** Merges model request overrides, preserving the latest private-network policy. */
export declare function mergeModelProviderRequestOverrides(...overrides: Array<ModelProviderRequestTransportOverrides | undefined>): ModelProviderRequestTransportOverrides | undefined;
/** Normalizes provider base URLs by trimming trailing slashes. */
export declare function normalizeBaseUrl(baseUrl: string | undefined, fallback: string): string;
export declare function normalizeBaseUrl(baseUrl: string | undefined, fallback?: string): string | undefined;
/** Sanitizes runtime-only provider request overrides for auth request paths. */
export declare function sanitizeRuntimeProviderRequestOverrides(request: ProviderRequestTransportOverrides | undefined): ProviderRequestTransportOverrides | undefined;
/** Applies provider-prepared runtime auth overrides to a resolved model. */
export declare function applyPreparedRuntimeAuthToModel<T extends {
    provider: string;
    api?: RequestApi;
    baseUrl?: string;
    headers?: Record<string, string>;
}>(model: T, preparedAuth: {
    baseUrl?: string;
    request?: ModelProviderRequestTransportOverrides;
} | null | undefined): T;
/** Builds the dispatcher proxy/TLS policy for outbound provider requests. */
export declare function buildProviderRequestDispatcherPolicy(request: Pick<ResolvedProviderRequestConfig, "proxy" | "tls">): PinnedDispatcherPolicy | undefined;
/** Resolves the full provider request policy, headers, auth, proxy, and TLS config. */
export declare function resolveProviderRequestPolicyConfig(params: ResolveProviderRequestPolicyConfigParams): ResolvedProviderRequestPolicyConfig;
/** Resolves request config used during model/catalog setup paths. */
export declare function resolveProviderRequestConfig(params: {
    provider: string;
    api?: RequestApi;
    baseUrl?: string;
    capability?: ProviderRequestCapability;
    transport?: ProviderRequestTransport;
    discoveredHeaders?: Record<string, string>;
    providerHeaders?: Record<string, string>;
    modelHeaders?: Record<string, string>;
    authHeader?: boolean;
    request?: ProviderRequestTransportOverrides;
}): ResolvedProviderRequestConfig;
/** Resolves final headers for one provider request route. */
export declare function resolveProviderRequestHeaders(params: {
    provider: string;
    api?: RequestApi;
    baseUrl?: string;
    capability?: ProviderRequestCapability;
    transport?: ProviderRequestTransport;
    callerHeaders?: Record<string, string>;
    defaultHeaders?: Record<string, string>;
    precedence?: ProviderRequestHeaderPrecedence;
    request?: ProviderRequestTransportOverrides;
}): Record<string, string> | undefined;
/** Attaches model-scoped provider request transport metadata without mutating the model. */
export declare function attachModelProviderRequestTransport<TModel extends object>(model: TModel, request: ModelProviderRequestTransportOverrides | undefined): TModel;
/** Reads provider request transport metadata attached to a model definition. */
export declare function getModelProviderRequestTransport(model: object): ModelProviderRequestTransportOverrides | undefined;
export {};
