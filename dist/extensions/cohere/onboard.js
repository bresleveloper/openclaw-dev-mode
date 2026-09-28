import { i as openclaw_plugin_default, n as buildCohereCatalogModels, t as COHERE_BASE_URL } from "./.setup/models-DxsOE4Aq.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/cohere/onboard.ts
const COHERE_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "cohere");
const { applyConfig: applyCohereConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: COHERE_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "cohere",
		api: "openai-completions",
		baseUrl: COHERE_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? buildCohereCatalogModels() : [],
		aliases: [{
			modelRef: COHERE_DEFAULT_MODEL_REF,
			alias: "Cohere Command A+"
		}]
	})
});
//#endregion
export { applyCohereConfig };
