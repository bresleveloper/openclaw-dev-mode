import { a as FIREWORKS_DEFAULT_MODEL_REF, i as FIREWORKS_DEFAULT_MODEL_ID, o as buildFireworksCatalogModels, s as buildFireworksProvider } from "./.setup/provider-catalog-V11bjNKP.mjs";
import { createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/fireworks/onboard.ts
const { applyConfig: applyFireworksConfig } = createDefaultModelsPresetAppliers({
	primaryModelRef: FIREWORKS_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => {
		const defaultProvider = buildFireworksProvider();
		return {
			providerId: "fireworks",
			api: defaultProvider.api ?? "openai-completions",
			baseUrl: defaultProvider.baseUrl,
			defaultModels: cfg.models?.mode === "replace" ? buildFireworksCatalogModels() : [],
			defaultModelId: FIREWORKS_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: FIREWORKS_DEFAULT_MODEL_REF,
				alias: "GLM 5.2 Fast"
			}]
		};
	}
});
//#endregion
export { applyFireworksConfig };
