import { r as openclaw_plugin_default } from "./.setup/provider-catalog-CjtjKKvK.mjs";
import { CEREBRAS_BASE_URL, buildCerebrasCatalogModels } from "./models.js";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/cerebras/onboard.ts
const CEREBRAS_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "cerebras");
const { applyConfig: applyCerebrasConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: CEREBRAS_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "cerebras",
		api: "openai-completions",
		baseUrl: CEREBRAS_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? buildCerebrasCatalogModels() : [],
		aliases: [{
			modelRef: CEREBRAS_DEFAULT_MODEL_REF,
			alias: "Cerebras Gemma 4 31B"
		}]
	})
});
//#endregion
export { CEREBRAS_DEFAULT_MODEL_REF, applyCerebrasConfig };
