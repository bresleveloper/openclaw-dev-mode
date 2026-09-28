import { o as buildStaticBasetenModels, r as BASETEN_DEFAULT_MODEL_REF, t as BASETEN_BASE_URL } from "./.setup/models-CwKDnNIj.mjs";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/baseten/onboard.ts
/** Baseten onboarding config helpers. */
const { applyConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: BASETEN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, catalogModels) => ({
		providerId: "baseten",
		api: "openai-completions",
		baseUrl: BASETEN_BASE_URL,
		catalogModels,
		aliases: [{
			modelRef: BASETEN_DEFAULT_MODEL_REF,
			alias: "Inkling"
		}]
	})
});
/** Applies Baseten's provider catalog, Inkling alias, and default model. */
const applyBasetenConfig = (cfg) => applyConfig(cfg, buildStaticBasetenModels());
const applyBasetenSetupConfig = (cfg) => applyConfig(cfg, cfg.models?.mode === "replace" ? buildStaticBasetenModels() : []);
//#endregion
export { applyBasetenConfig, applyBasetenSetupConfig };
