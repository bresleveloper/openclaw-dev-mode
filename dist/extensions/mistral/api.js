import { MISTRAL_MEDIUM_3_5_ID, MISTRAL_SMALL_4_ID, MISTRAL_SMALL_LATEST_ID, resolveMistralReasoningEffortMap } from "./provider-policy-api.js";
import { t as buildMistralProvider } from "./.setup/provider-catalog-DV4UQ-rA.mjs";
import { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, buildMistralModelDefinition } from "./model-definitions.js";
import { applyMistralConfig, applyMistralProviderConfig } from "./onboard.js";
import { asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/mistral/api.ts
const MISTRAL_MODEL_TRANSPORT_PATCH = {
	supportsStore: false,
	supportsPromptCacheKey: true,
	supportsLongCacheRetention: false,
	maxTokensField: "max_tokens"
};
function resolveMistralCompatPatch(model) {
	const reasoningEffortMap = resolveMistralReasoningEffortMap(model.id);
	return {
		...MISTRAL_MODEL_TRANSPORT_PATCH,
		supportsReasoningEffort: reasoningEffortMap !== void 0,
		reasoningEffortMap
	};
}
function applyMistralModelCompat(model) {
	const compat = asOptionalObjectRecord(model.compat);
	const patch = resolveMistralCompatPatch(model);
	if (Object.entries(patch).every(([key, value]) => compat?.[key] === value)) return model;
	return {
		...model,
		compat: {
			...compat,
			...patch
		}
	};
}
//#endregion
export { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, MISTRAL_MEDIUM_3_5_ID, MISTRAL_MODEL_TRANSPORT_PATCH, MISTRAL_SMALL_4_ID, MISTRAL_SMALL_LATEST_ID, applyMistralConfig, applyMistralModelCompat, applyMistralProviderConfig, buildMistralModelDefinition, buildMistralProvider, resolveMistralCompatPatch };
