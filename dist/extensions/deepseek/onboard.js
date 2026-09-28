import { a as openclaw_plugin_default, n as DEEPSEEK_MODEL_CATALOG, t as DEEPSEEK_BASE_URL } from "./.setup/models-D843Tvyg.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/deepseek/onboard.ts
const DEEPSEEK_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "deepseek");
const { applyConfig: applyDeepSeekConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: DEEPSEEK_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "deepseek",
		api: "openai-completions",
		baseUrl: DEEPSEEK_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? structuredClone(DEEPSEEK_MODEL_CATALOG) : [],
		aliases: [{
			modelRef: DEEPSEEK_DEFAULT_MODEL_REF,
			alias: "DeepSeek"
		}]
	})
});
//#endregion
export { applyDeepSeekConfig };
