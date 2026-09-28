import { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, buildMistralModelDefinition } from "./model-definitions.js";
import { createDefaultModelsConnectionPresetAppliers, createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/mistral/onboard.ts
const mistralPreset = {
	primaryModelRef: MISTRAL_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "mistral",
		api: "openai-completions",
		baseUrl: MISTRAL_BASE_URL,
		defaultModels: () => [buildMistralModelDefinition()],
		defaultModelId: MISTRAL_DEFAULT_MODEL_ID,
		aliases: [{
			modelRef: MISTRAL_DEFAULT_MODEL_REF,
			alias: "Mistral"
		}]
	})
};
const { applyConfig: applyMistralConfig, applyProviderConfig: applyMistralProviderConfig } = createDefaultModelsPresetAppliers(mistralPreset);
const { applyConfig: applyMistralConnectionConfig } = createDefaultModelsConnectionPresetAppliers(mistralPreset);
//#endregion
export { applyMistralConfig, applyMistralConnectionConfig, applyMistralProviderConfig };
