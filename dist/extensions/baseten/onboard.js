import { o as buildStaticBasetenModels, r as BASETEN_DEFAULT_MODEL_REF, t as BASETEN_BASE_URL } from "./.setup/models-BOkRtUeP.mjs";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/baseten/onboard.ts
const { applyConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: BASETEN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, catalogModels) => ({
		providerId: "baseten",
		api: "openai-completions",
		baseUrl: BASETEN_BASE_URL,
		catalogModels,
		aliases: [{
			modelRef: BASETEN_DEFAULT_MODEL_REF,
			alias: "DeepSeek V4.1 Flash"
		}]
	})
});
/** Applies Baseten's provider catalog and starter model without replacing an explicit primary. */
const applyBasetenConfig = (cfg) => applyConfig(cfg, buildStaticBasetenModels());
const applyBasetenSetupConfig = (cfg) => applyConfig(cfg, cfg.models?.mode === "replace" ? buildStaticBasetenModels() : []);
//#endregion
export { applyBasetenConfig, applyBasetenSetupConfig };
