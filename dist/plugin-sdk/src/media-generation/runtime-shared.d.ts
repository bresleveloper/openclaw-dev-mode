import type { MediaGenerationNormalizationMetadataInput } from "../../packages/media-generation-core/src/normalization.js";
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import type { AgentModelConfig } from "../config/types.agents-shared.js";
import type { OpenClawConfig } from "../config/types.js";
import { getProviderEnvVars as getDefaultProviderEnvVars } from "../secrets/provider-env-vars.js";
export type { MediaGenerationNormalizationMetadataInput, MediaNormalizationEntry, MediaNormalizationValue, } from "../../packages/media-generation-core/src/normalization.js";
export { hasMediaNormalizationEntry } from "../../packages/media-generation-core/src/normalization.js";
export type ParsedProviderModelRef = {
    provider: string;
    model: string;
};
/** Records one provider/model failure in the common fallback-attempt shape. */
export declare function recordCapabilityCandidateFailure(params: {
    attempts: FallbackAttempt[];
    provider: string;
    model: string;
    error: unknown;
}): void;
export declare function resolveMediaProviderDefaultTimeoutMs(timeoutMs: number | undefined): number | undefined;
/** Resolves a request timeout, preferring per-request over provider defaults. */
export declare function resolveMediaProviderRequestTimeoutMs(params: {
    timeoutMs?: number;
    providerDefaultTimeoutMs?: number;
}): number | undefined;
type CapabilityProviderCandidate = {
    id: string;
    aliases?: readonly string[];
    defaultModel?: string | null;
    models?: readonly string[];
    isConfigured?: (ctx: {
        cfg?: OpenClawConfig;
        agentDir?: string;
    }) => boolean;
};
/** Builds ordered provider/model candidates for one media capability request. */
export declare function resolveCapabilityModelCandidates(params: {
    cfg: OpenClawConfig;
    modelConfig: AgentModelConfig | undefined;
    modelOverride?: string;
    parseModelRef: (raw: string | undefined) => ParsedProviderModelRef | null;
    agentDir?: string;
    listProviders?: (cfg?: OpenClawConfig) => CapabilityProviderCandidate[];
    autoProviderFallback?: boolean;
}): ParsedProviderModelRef[];
/** Derives a reduced aspect ratio string from a WIDTHxHEIGHT size. */
export declare function deriveAspectRatioFromSize(size?: string): string | undefined;
/** Chooses the closest supported aspect ratio for a request. */
export declare function resolveClosestAspectRatio(params: {
    requestedAspectRatio?: string;
    requestedSize?: string;
    supportedAspectRatios?: readonly string[];
}): string | undefined;
/** Chooses the closest supported size by aspect ratio and area. */
export declare function resolveClosestSize(params: {
    requestedSize?: string;
    requestedAspectRatio?: string;
    supportedSizes?: readonly string[];
}): string | undefined;
/** Chooses the closest supported resolution by numeric rank or custom order. */
export declare function resolveClosestResolution<TResolution extends string>(params: {
    requestedResolution?: TResolution;
    supportedResolutions?: readonly TResolution[];
    order?: readonly TResolution[];
}): TResolution | undefined;
/** Rounds duration and clamps it to a provider maximum when supplied. */
export declare function normalizeDurationToClosestMax(durationSeconds?: number, maxDurationSeconds?: number): number | undefined;
/** Builds user-visible metadata describing provider normalization decisions. */
export declare function buildMediaGenerationNormalizationMetadata(params: {
    normalization?: MediaGenerationNormalizationMetadataInput;
    requestedSizeForDerivedAspectRatio?: string;
    includeSupportedDurationSeconds?: boolean;
}): Record<string, unknown>;
/** Throws a summarized error after all provider/model candidates fail. */
export declare function throwCapabilityGenerationFailure(params: {
    capabilityLabel: string;
    attempts: FallbackAttempt[];
    lastError: unknown;
}): never;
/** Formats setup guidance when no model is configured for a media capability. */
export declare function buildNoCapabilityModelConfiguredMessage(params: {
    capabilityLabel: string;
    modelConfigKey: string;
    providers: Array<{
        id: string;
        defaultModel?: string | null;
    }>;
    fallbackSampleRef?: string;
    getProviderEnvVars?: typeof getDefaultProviderEnvVars;
}): string;
