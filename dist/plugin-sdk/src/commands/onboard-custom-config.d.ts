import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretInput } from "../config/types.secrets.js";
/** Result of best-effort image-input inference for custom model ids. */
type CustomModelImageInputInference = {
    supportsImageInput: boolean;
    confidence: "known" | "unknown";
};
/** Infers image-input support from common custom model naming conventions. */
export declare function resolveCustomModelImageInputInference(modelId: string): CustomModelImageInputInference;
/** Returns whether a custom model id is known to support image input. */
export declare function inferCustomModelSupportsImageInput(modelId: string): boolean;
export type CustomApiCompatibility = "openai" | "openai-responses" | "anthropic";
/** Config mutation result for a custom API setup pass. */
export type CustomApiResult = {
    config: OpenClawConfig;
    providerId?: string;
    modelId?: string;
    providerIdRenamedFrom?: string;
};
/** Inputs used to persist a custom provider in the OpenClaw config. */
type ApplyCustomApiConfigParams = {
    config: OpenClawConfig;
    baseUrl: string;
    modelId: string;
    compatibility: CustomApiCompatibility;
    apiKey?: SecretInput;
    providerId?: string;
    alias?: string;
    supportsImageInput?: boolean;
};
/** Raw CLI flag values for non-interactive custom API setup. */
type ParseNonInteractiveCustomApiFlagsParams = {
    baseUrl?: string;
    modelId?: string;
    compatibility?: string;
    apiKey?: string;
    providerId?: string;
    supportsImageInput?: boolean;
};
/** Validated non-interactive custom API setup flags. */
type ParsedNonInteractiveCustomApiFlags = {
    baseUrl: string;
    modelId: string;
    compatibility: CustomApiCompatibility;
    apiKey?: string;
    providerId?: string;
    supportsImageInput?: boolean;
};
type CustomApiErrorCode = "missing_required" | "invalid_compatibility" | "invalid_base_url" | "invalid_model_id" | "invalid_provider_id" | "invalid_alias";
/** Error class used by callers to turn custom API validation failures into CLI UX. */
export declare class CustomApiError extends Error {
    readonly code: CustomApiErrorCode;
    constructor(code: CustomApiErrorCode, message: string);
}
type ResolveCustomProviderIdParams = {
    config: OpenClawConfig;
    baseUrl: string;
    providerId?: string;
};
/** Provider id selected for a custom endpoint, with collision rename metadata. */
type ResolvedCustomProviderId = {
    providerId: string;
    providerIdRenamedFrom?: string;
};
/** Converts arbitrary endpoint labels into provider-id-safe tokens. */
export declare function normalizeEndpointId(raw: string): string;
/** Builds a stable custom provider id from an endpoint URL host and port. */
export declare function buildEndpointIdFromUrl(baseUrl: string): string;
/** Returns a human-readable alias collision error for a custom model ref. */
export declare function resolveCustomModelAliasError(params: {
    raw: string;
    cfg: OpenClawConfig;
    modelRef: string;
}): string | undefined;
type VerificationRequest = {
    endpoint: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
};
/** Normalizes optional provider API key input while preserving secret refs. */
export declare function normalizeOptionalProviderApiKey(value: unknown): SecretInput | undefined;
/** Builds a minimal OpenAI-family request used only to verify custom endpoints. */
export declare function buildOpenAiVerificationProbeRequest(params: {
    baseUrl: string;
    apiKey: string;
    modelId: string;
    responsesApi?: boolean;
}): VerificationRequest;
/** Builds a minimal Anthropic-compatible request used only to verify endpoints. */
export declare function buildAnthropicVerificationProbeRequest(params: {
    baseUrl: string;
    apiKey: string;
    modelId: string;
}): VerificationRequest;
/** Resolves the provider id that should own a custom endpoint in config. */
export declare function resolveCustomProviderId(params: ResolveCustomProviderIdParams): ResolvedCustomProviderId;
/** Validates non-interactive custom API flags before config mutation. */
export declare function parseNonInteractiveCustomApiFlags(params: ParseNonInteractiveCustomApiFlagsParams): ParsedNonInteractiveCustomApiFlags;
/** Applies custom provider config and makes the custom model the primary model. */
export declare function applyCustomApiConfig(params: ApplyCustomApiConfigParams): CustomApiResult;
export {};
