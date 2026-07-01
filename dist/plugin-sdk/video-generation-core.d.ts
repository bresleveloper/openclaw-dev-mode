import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { s as AuthProfileStore } from "./types-nLOnyeRM.js";
import { Zn as VideoGenerationProviderPlugin } from "./types-CXLy55Xw.js";
import { t as FallbackAttempt } from "./model-fallback.types-B1mOnouf.js";
import { n as createSubsystemLogger } from "./subsystem-Boo2DQIV.js";
import { n as getProviderEnvVars } from "./provider-env-vars-hRQuBoEz.js";
import { a as VideoGenerationModelCapabilitiesContext, c as VideoGenerationProviderCapabilities, d as VideoGenerationResolution, f as VideoGenerationResult, i as VideoGenerationModeCapabilities, l as VideoGenerationProviderConfiguredContext, m as VideoGenerationTransformCapabilities, n as VideoGenerationIgnoredOverride, p as VideoGenerationSourceAsset, r as VideoGenerationMode, s as VideoGenerationProvider, t as GeneratedVideoAsset, u as VideoGenerationRequest } from "./types-DOMhfYsC.js";
import { n as isFailoverError, t as describeFailoverError } from "./failover-error-DHkhp1Yg.js";
import { p as throwCapabilityGenerationFailure, r as buildNoCapabilityModelConfiguredMessage, s as resolveCapabilityModelCandidates } from "./runtime-shared-BGm8_RTc.js";
import { n as resolveAgentModelPrimaryValue, t as resolveAgentModelFallbackValues } from "./model-input-CkMbo366.js";
import { n as listVideoGenerationProviders, t as getVideoGenerationProvider } from "./provider-registry-B8ztvaIq.js";

//#region src/video-generation/model-ref.d.ts
declare function parseVideoGenerationModelRef(raw: string | undefined): {
  provider: string;
  model: string;
} | null;
//#endregion
export { type AuthProfileStore, type FallbackAttempt, type GeneratedVideoAsset, type OpenClawConfig, type VideoGenerationIgnoredOverride, type VideoGenerationMode, type VideoGenerationModeCapabilities, type VideoGenerationModelCapabilitiesContext, type VideoGenerationProvider, type VideoGenerationProviderCapabilities, type VideoGenerationProviderConfiguredContext, type VideoGenerationProviderPlugin, type VideoGenerationRequest, type VideoGenerationResolution, type VideoGenerationResult, type VideoGenerationSourceAsset, type VideoGenerationTransformCapabilities, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getProviderEnvVars, getVideoGenerationProvider, isFailoverError, listVideoGenerationProviders, parseVideoGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };