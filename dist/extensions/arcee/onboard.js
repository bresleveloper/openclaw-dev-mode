import { ARCEE_BASE_URL } from "./models.js";
import { OPENROUTER_BASE_URL, buildArceeCatalogModels, buildArceeOpenRouterCatalogModels } from "./provider-catalog.js";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/arcee/onboard.ts
const ARCEE_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";
const ARCEE_OPENROUTER_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";
const ARCEE_PRESET = {
	primaryModelRef: ARCEE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "arcee",
		api: "openai-completions",
		baseUrl: ARCEE_BASE_URL,
		catalogModels: buildArceeCatalogModels,
		aliases: [{
			modelRef: ARCEE_DEFAULT_MODEL_REF,
			alias: "Arcee AI"
		}]
	})
};
const ARCEE_OPENROUTER_PRESET = {
	primaryModelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "arcee",
		api: "openai-completions",
		baseUrl: OPENROUTER_BASE_URL,
		catalogModels: buildArceeOpenRouterCatalogModels,
		aliases: [{
			modelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
			alias: "Arcee AI (OpenRouter)"
		}]
	})
};
const { applyConfig: applyArceeConfig } = createModelCatalogPresetAppliers(ARCEE_PRESET);
const { applyConfig: applyArceeOpenRouterConfig } = createModelCatalogPresetAppliers(ARCEE_OPENROUTER_PRESET);
const { applyConfig: applyArceeOnboardConfig } = createProviderConnectionPresetAppliers(ARCEE_PRESET);
const { applyConfig: applyArceeOpenRouterOnboardConfig } = createProviderConnectionPresetAppliers(ARCEE_OPENROUTER_PRESET);
//#endregion
export { ARCEE_DEFAULT_MODEL_REF, ARCEE_OPENROUTER_DEFAULT_MODEL_REF, applyArceeConfig, applyArceeOnboardConfig, applyArceeOpenRouterConfig, applyArceeOpenRouterOnboardConfig };
