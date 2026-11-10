import { r as createLazyRuntimeModule } from "../lazy-runtime-CJrzFzqU.mjs";
import { s as resolveAgentModelPrimaryValue } from "../model-input-CeM8o97s.mjs";
import { a as resolveCapabilityModelCandidates, n as buildNoCapabilityModelConfiguredMessage, o as resolveCapabilityModelCandidatesAsync, p as throwCapabilityGenerationFailure } from "../runtime-shared-DrcE5eH-.mjs";
import { t as getProviderEnvVars } from "../provider-env-vars-71Y-LZb0.mjs";
//#region src/plugin-sdk/image-generation-core.ts
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("../image-generation-core.auth.runtime-CmSkQcoO.mjs"));
/**
* Resolve image-generation provider API keys through the lazy auth runtime helper.
*
* @deprecated Retained for plugins built against OpenClaw 2026.10.4 and earlier; tracked by
* `plugin-sdk-private-runtime-shipped-exports`.
*/
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { buildNoCapabilityModelConfiguredMessage, getProviderEnvVars, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, resolveCapabilityModelCandidatesAsync, throwCapabilityGenerationFailure };
