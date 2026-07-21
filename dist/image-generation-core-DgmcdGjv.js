import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import "./subsystem-C3fiUGN1.js";
import "./provider-env-vars-B13rZtiu.js";
import "./failover-error-B2zFYEnG.js";
import "./runtime-shared-DLj3qmkt.js";
import "./provider-registry-BPBvtgol.js";
import "./provider-model-shared-CcfAdtmN.js";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("./image-generation-core.auth.runtime.js"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as n, OPENAI_DEFAULT_IMAGE_MODEL as t };
