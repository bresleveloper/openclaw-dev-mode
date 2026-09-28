import { t as buildKilocodeProvider } from "./.setup/provider-catalog-DVP2RSKr.mjs";
import { KILOCODE_BASE_URL, KILOCODE_DEFAULT_MODEL_REF } from "./provider-models.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/kilocode/onboard.ts
const { applyConfig: applyKilocodeConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: KILOCODE_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "kilocode",
		api: "openai-completions",
		baseUrl: KILOCODE_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? buildKilocodeProvider().models : [],
		aliases: [{
			modelRef: KILOCODE_DEFAULT_MODEL_REF,
			alias: "Kilo Gateway"
		}]
	})
});
//#endregion
export { KILOCODE_DEFAULT_MODEL_REF, applyKilocodeConfig };
