import { h as createDefaultModelsPresetAppliers } from "./provider-onboard-Be0xLg2V.mjs";
//#region extensions/litellm/onboard.ts
const LITELLM_BASE_URL = "http://localhost:4000";
const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
const LITELLM_DEFAULT_MODEL_REF = `litellm/${LITELLM_DEFAULT_MODEL_ID}`;
const LITELLM_DEFAULT_CONTEXT_WINDOW = 1e6;
const LITELLM_DEFAULT_MAX_TOKENS = 128e3;
const LITELLM_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
function buildLitellmModelDefinition() {
	return {
		id: LITELLM_DEFAULT_MODEL_ID,
		name: "Claude Opus 4.6",
		reasoning: true,
		input: ["text", "image"],
		cost: LITELLM_DEFAULT_COST,
		contextWindow: LITELLM_DEFAULT_CONTEXT_WINDOW,
		maxTokens: LITELLM_DEFAULT_MAX_TOKENS
	};
}
const { applyConfig: applyLitellmConfig, applyProviderConfig: applyLitellmProviderConfig } = createDefaultModelsPresetAppliers({
	primaryModelRef: LITELLM_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => {
		const existingProvider = cfg.models?.providers?.litellm;
		const resolvedBaseUrl = typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl.trim() : "";
		return {
			providerId: "litellm",
			api: "openai-completions",
			baseUrl: resolvedBaseUrl || "http://localhost:4000",
			defaultModels: resolvedBaseUrl && cfg.models?.mode !== "replace" ? [] : [buildLitellmModelDefinition()],
			defaultModelId: LITELLM_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: LITELLM_DEFAULT_MODEL_REF,
				alias: "LiteLLM"
			}]
		};
	}
});
//#endregion
export { applyLitellmProviderConfig as a, applyLitellmConfig as i, LITELLM_DEFAULT_MODEL_ID as n, buildLitellmModelDefinition as o, LITELLM_DEFAULT_MODEL_REF as r, LITELLM_BASE_URL as t };
