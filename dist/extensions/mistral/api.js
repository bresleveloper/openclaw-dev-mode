import { MISTRAL_MEDIUM_3_5_ID, MISTRAL_SMALL_4_ID, MISTRAL_SMALL_LATEST_ID, resolveMistralReasoningEffortMap } from "./provider-policy-api.js";
import { buildMistralProvider } from "./provider-catalog.js";
import { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, buildMistralModelDefinition } from "./model-definitions.js";
import { applyMistralConfig, applyMistralProviderConfig } from "./onboard.js";
import { MISTRAL_MODEL_TRANSPORT_PATCH } from "openclaw/plugin-sdk/provider-model-shared";
import { asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/mistral/api.ts
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
export { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, MISTRAL_MEDIUM_3_5_ID, MISTRAL_MODEL_TRANSPORT_PATCH, MISTRAL_SMALL_4_ID, MISTRAL_SMALL_LATEST_ID, applyMistralConfig, applyMistralModelCompat, applyMistralProviderConfig, buildMistralModelDefinition, buildMistralProvider, resolveMistralCompatPatch };
