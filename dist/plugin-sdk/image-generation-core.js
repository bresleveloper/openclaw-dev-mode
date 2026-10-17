import { r as createLazyRuntimeModule } from "../lazy-runtime-CJrzFzqU.mjs";
import { t as createSubsystemLogger } from "../subsystem-I-uqdx4f.mjs";
import { n as normalizeGooglePreviewModelId } from "../provider-model-id-normalize-Bx8UgVVS.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "../model-input-C9K4a_6k.mjs";
import { a as isFailoverError } from "../error-B1Zb0HrJ.mjs";
import { i as describeFailoverError } from "../failover-error-BZ8WG_0i.mjs";
import { i as listImageGenerationProviders, t as getImageGenerationProvider } from "../registry-B1Y9Uoiz.mjs";
import { d as throwCapabilityGenerationFailure, i as resolveCapabilityModelCandidates, n as buildNoCapabilityModelConfiguredMessage } from "../runtime-shared-26hQf7I9.mjs";
import { t as parseGenerationModelRef } from "../model-ref-BPLi1CUl.mjs";
import "../provider-model-shared-CgZ78XZA.mjs";
import { t as getProviderEnvVars } from "../provider-env-vars-DC-s-8go.mjs";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("../image-generation-core.auth.runtime-Oh-4-N77.mjs"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { OPENAI_DEFAULT_IMAGE_MODEL, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getImageGenerationProvider, getProviderEnvVars, isFailoverError, listImageGenerationProviders, normalizeGooglePreviewModelId as normalizeGoogleModelId, parseGenerationModelRef as parseImageGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };
