import type { RuntimeVersionEnv } from "../version.js";
type ProviderAttributionVerification = "vendor-documented" | "vendor-hidden-api-spec" | "vendor-sdk-hook-only" | "internal-runtime";
type ProviderAttributionHook = "request-headers" | "default-headers" | "user-agent-extra" | "custom-user-agent";
/** Product attribution policy emitted for verified provider hooks. */
export type ProviderAttributionPolicy = {
    provider: string;
    enabledByDefault: boolean;
    verification: ProviderAttributionVerification;
    hook?: ProviderAttributionHook;
    docsUrl?: string;
    reviewNote?: string;
    product: string;
    version: string;
    headers?: Record<string, string>;
};
type ProviderAttributionIdentity = Pick<ProviderAttributionPolicy, "product" | "version">;
/** Transport family used when resolving provider-specific request policy. */
export type ProviderRequestTransport = "stream" | "websocket" | "http" | "media-understanding";
/** Capability family used when endpoint rules differ by media or LLM request type. */
export type ProviderRequestCapability = "llm" | "audio" | "image" | "video" | "other";
/** Normalized endpoint class used by provider policy and SSRF/attribution decisions. */
export type ProviderEndpointClass = "default" | "anthropic-public" | "cerebras-native" | "chutes-native" | "deepseek-native" | "github-copilot-native" | "groq-native" | "mistral-public" | "moonshot-native" | "modelstudio-native" | "nvidia-native" | "openai-public" | "openai" | "opencode-native" | "azure-openai" | "openrouter" | "xai-native" | "xiaomi-native" | "zai-native" | "google-generative-ai" | "google-vertex" | "local" | "custom" | "invalid";
/** Parsed endpoint facts derived from provider id and base URL. */
export type ProviderEndpointResolution = {
    endpointClass: ProviderEndpointClass;
    hostname?: string;
    googleVertexRegion?: string;
};
/** Raw model/provider fields accepted by policy resolution. */
export type ProviderRequestPolicyInput = {
    provider?: string | null;
    api?: string | null;
    baseUrl?: string | null;
    transport?: ProviderRequestTransport;
    capability?: ProviderRequestCapability;
};
/** Provider policy facts consumed by transports before constructing a request. */
export type ProviderRequestPolicyResolution = {
    provider?: string;
    policy?: ProviderAttributionPolicy;
    endpointClass: ProviderEndpointClass;
    usesConfiguredBaseUrl: boolean;
    knownProviderFamily: string;
    attributionProvider?: string;
    attributionHeaders?: Record<string, string>;
    allowsHiddenAttribution: boolean;
    usesKnownNativeOpenAIEndpoint: boolean;
    usesKnownNativeOpenAIRoute: boolean;
    usesVerifiedOpenAIAttributionHost: boolean;
    usesExplicitProxyLikeEndpoint: boolean;
};
/** Policy input plus model compatibility fields for feature-level capability resolution. */
export type ProviderRequestCapabilitiesInput = ProviderRequestPolicyInput & {
    modelId?: string | null;
    compat?: unknown;
};
/** Known compatibility family that needs provider-specific request adjustments. */
export type ProviderRequestCompatibilityFamily = "moonshot";
/** Feature capability facts for one resolved provider/model request route. */
export type ProviderRequestCapabilities = ProviderRequestPolicyResolution & {
    isKnownNativeEndpoint: boolean;
    allowsOpenAIServiceTier: boolean;
    supportsOpenAIReasoningCompatPayload: boolean;
    allowsAnthropicServiceTier: boolean;
    supportsResponsesStoreField: boolean;
    allowsResponsesStore: boolean;
    shouldStripResponsesPromptCache: boolean;
    supportsNativeStreamingUsageCompat: boolean;
    supportsOpenAICompletionsStreamingUsageCompat: boolean;
    compatibilityFamily?: ProviderRequestCompatibilityFamily;
};
export declare function resolveProviderEndpoint(baseUrl: string | null | undefined): ProviderEndpointResolution;
export declare function resolveProviderAttributionIdentity(env?: RuntimeVersionEnv): ProviderAttributionIdentity;
export declare function listProviderAttributionPolicies(env?: RuntimeVersionEnv): ProviderAttributionPolicy[];
export declare function resolveProviderAttributionPolicy(provider?: string | null, env?: RuntimeVersionEnv): ProviderAttributionPolicy | undefined;
export declare function resolveProviderRequestPolicy(input: ProviderRequestPolicyInput, env?: RuntimeVersionEnv): ProviderRequestPolicyResolution;
export declare function resolveProviderRequestCapabilities(input: ProviderRequestCapabilitiesInput, env?: RuntimeVersionEnv): ProviderRequestCapabilities;
export declare function describeProviderRequestRoutingSummary(input: ProviderRequestPolicyInput, env?: RuntimeVersionEnv): string;
export {};
