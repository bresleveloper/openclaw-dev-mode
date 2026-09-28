import { a as FEATHERLESS_DEFAULT_MODEL_REF, l as buildFeatherlessCatalogModels, t as FEATHERLESS_BASE_URL } from "./.setup/models-J3WOft2N.mjs";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/featherless/onboard.ts
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
//#endregion
export { FEATHERLESS_DEFAULT_MODEL_REF, applyFeatherlessConfig, applyFeatherlessConnectionConfig };
