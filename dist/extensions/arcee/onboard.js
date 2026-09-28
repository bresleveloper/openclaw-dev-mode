import { ARCEE_BASE_URL } from "./models.js";
import { OPENROUTER_BASE_URL, buildArceeCatalogModels, buildArceeOpenRouterCatalogModels } from "./provider-catalog.js";
import { applyProviderConfigWithModelCatalogPreset, applyProviderConnectionConfig } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/arcee/onboard.ts
/**
* Arcee setup preset appliers. They seed model catalog defaults for direct
* Arcee API usage and the OpenRouter-backed path.
*/
/** Default Arcee model ref for direct API setup. */
const ARCEE_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";
/** Default Arcee model ref for OpenRouter setup. */
const ARCEE_OPENROUTER_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";
const ARCEE_PRESET = {
	primaryModelRef: ARCEE_DEFAULT_MODEL_REF,
	providerId: "arcee",
	api: "openai-completions",
	baseUrl: ARCEE_BASE_URL,
	aliases: [{
		modelRef: ARCEE_DEFAULT_MODEL_REF,
		alias: "Arcee AI"
	}]
};
const ARCEE_OPENROUTER_PRESET = {
	primaryModelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
	providerId: "arcee",
	api: "openai-completions",
	baseUrl: OPENROUTER_BASE_URL,
	aliases: [{
		modelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
		alias: "Arcee AI (OpenRouter)"
	}]
};
/** Apply direct Arcee provider defaults to config. */
function applyArceeConfig(cfg) {
	return applyProviderConfigWithModelCatalogPreset(cfg, {
		...ARCEE_PRESET,
		catalogModels: buildArceeCatalogModels()
	});
}
/** Apply OpenRouter-backed Arcee provider defaults to config. */
function applyArceeOpenRouterConfig(cfg) {
	return applyProviderConfigWithModelCatalogPreset(cfg, {
		...ARCEE_OPENROUTER_PRESET,
		catalogModels: buildArceeOpenRouterCatalogModels()
	});
}
function applyArceeOnboardConfig(cfg) {
	return applyProviderConnectionConfig(cfg, {
		...ARCEE_PRESET,
		catalogModels: buildArceeCatalogModels
	});
}
function applyArceeOpenRouterOnboardConfig(cfg) {
	return applyProviderConnectionConfig(cfg, {
		...ARCEE_OPENROUTER_PRESET,
		catalogModels: buildArceeOpenRouterCatalogModels
	});
}
//#endregion
export { ARCEE_DEFAULT_MODEL_REF, ARCEE_OPENROUTER_DEFAULT_MODEL_REF, applyArceeConfig, applyArceeOnboardConfig, applyArceeOpenRouterConfig, applyArceeOpenRouterOnboardConfig };
