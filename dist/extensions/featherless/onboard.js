import { a as FEATHERLESS_DEFAULT_MODEL_REF, l as buildFeatherlessCatalogModels, t as FEATHERLESS_BASE_URL } from "./.setup/models-2eLGnbkC.mjs";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
// extensions/featherless/onboard.ts
const featherlessPreset = {
	primaryModelRef: FEATHERLESS_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "featherless",
		api: "openai-completions",
		baseUrl: FEATHERLESS_BASE_URL,
		catalogModels: buildFeatherlessCatalogModels,
		aliases: [{
			modelRef: FEATHERLESS_DEFAULT_MODEL_REF,
			alias: "Qwen3 32B"
		}]
	})
};
const { applyConfig: applyFeatherlessConfig } = createModelCatalogPresetAppliers(featherlessPreset);
const { applyConfig: applyFeatherlessConnectionConfig } = createProviderConnectionPresetAppliers(featherlessPreset);
export { FEATHERLESS_DEFAULT_MODEL_REF, applyFeatherlessConfig, applyFeatherlessConnectionConfig };
