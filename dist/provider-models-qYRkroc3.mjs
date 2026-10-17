import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-DQ2tKK7m.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-model-shared-CgZ78XZA.mjs";
import { i as normalizeXaiModelId } from "./model-id-BCpLVsfx.mjs";
import { f as resolveXaiForwardCompatDefinition, t as XAI_BASE_URL } from "./model-definitions-BTg9V4Hq.mjs";
import { t as applyXaiRuntimeModelCompat } from "./runtime-model-compat-CEunIORS.mjs";
//#region extensions/xai/provider-models.ts
const XAI_MODERN_MODEL_PREFIXES = [
	"grok-4.7",
	"grok-4.6",
	"grok-4.5",
	"grok-build-0.1",
	"grok-4.3",
	"grok-4.20"
];
function isModernXaiModel(modelId) {
	const normalized = normalizeXaiModelId(modelId.trim());
	const lower = normalizeOptionalLowercaseString(normalized) ?? "";
	if (!lower || lower.includes("multi-agent")) return false;
	return XAI_MODERN_MODEL_PREFIXES.some((prefix) => lower.startsWith(prefix));
}
function resolveXaiForwardCompatModel(params) {
	const definition = resolveXaiForwardCompatDefinition(params.ctx.modelId);
	if (!definition) return;
	return applyXaiRuntimeModelCompat(normalizeModelCompat({
		id: definition.id,
		name: definition.name,
		api: params.ctx.providerConfig?.api ?? "openai-responses",
		provider: params.providerId,
		baseUrl: normalizeOptionalString(params.ctx.providerConfig?.baseUrl) ?? XAI_BASE_URL,
		reasoning: definition.reasoning,
		input: definition.input,
		cost: definition.cost,
		contextWindow: definition.contextWindow,
		maxTokens: definition.maxTokens
	}));
}
//#endregion
export { resolveXaiForwardCompatModel as n, isModernXaiModel as t };
