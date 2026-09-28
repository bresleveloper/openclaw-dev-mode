import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
import { t as createSubsystemLogger } from "../subsystem-DleLyu58.mjs";
import { n as normalizeGooglePreviewModelId } from "../provider-model-id-normalize-DODOj1rv.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "../model-input-DKxKaZGG.mjs";
import { a as isFailoverError } from "../error-ON38hPhx.mjs";
import { i as describeFailoverError } from "../failover-error-BwAkMLuL.mjs";
import { i as listImageGenerationProviders, t as getImageGenerationProvider } from "../registry-D9StkV9M.mjs";
import { d as throwCapabilityGenerationFailure, i as resolveCapabilityModelCandidates, n as buildNoCapabilityModelConfiguredMessage } from "../runtime-shared-B1C-7v_z.mjs";
import { t as parseGenerationModelRef } from "../model-ref-4WSJM5TU.mjs";
import "../provider-model-shared-DUNuGxOQ.mjs";
import { t as getProviderEnvVars } from "../provider-env-vars-BVYgJD4_.mjs";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("../image-generation-core.auth.runtime-MIk81mxV.mjs"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { OPENAI_DEFAULT_IMAGE_MODEL, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getImageGenerationProvider, getProviderEnvVars, isFailoverError, listImageGenerationProviders, normalizeGooglePreviewModelId as normalizeGoogleModelId, parseGenerationModelRef as parseImageGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };
