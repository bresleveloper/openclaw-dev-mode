import { n as VENICE_DEFAULT_MODEL_REF, r as VENICE_MODEL_CATALOG, t as VENICE_BASE_URL } from "./.setup/models-D73jPrCr.mjs";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/venice/onboard.ts
const { applyConfig: applyVeniceConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: VENICE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "venice",
		api: "openai-completions",
		baseUrl: VENICE_BASE_URL,
		catalogModels: VENICE_MODEL_CATALOG,
		aliases: [{
			modelRef: VENICE_DEFAULT_MODEL_REF,
			alias: "GLM 4.7"
		}]
	})
});
//#endregion
export { applyVeniceConfig };
