import { i as buildCerebrasCatalogModels, o as openclaw_plugin_default, t as CEREBRAS_BASE_URL } from "./.setup/provider-catalog-DycAcVkn.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/cerebras/onboard.ts
const CEREBRAS_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "cerebras");
const { applyConfig: applyCerebrasConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: CEREBRAS_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "cerebras",
		api: "openai-completions",
		baseUrl: CEREBRAS_BASE_URL,
		catalogModels: buildCerebrasCatalogModels,
		aliases: [{
			modelRef: CEREBRAS_DEFAULT_MODEL_REF,
			alias: "Cerebras Gemma 4 31B"
		}]
	})
});
//#endregion
export { CEREBRAS_DEFAULT_MODEL_REF, applyCerebrasConfig };
