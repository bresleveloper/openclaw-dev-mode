import { LONGCAT_BASE_URL, LONGCAT_DEFAULT_MODEL_REF, LONGCAT_MODEL_CATALOG } from "./models.js";
import { createModelCatalogPresetAppliers, createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/longcat/onboard.ts
const longCatPreset = {
	primaryModelRef: LONGCAT_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "longcat",
		api: "openai-completions",
		baseUrl: LONGCAT_BASE_URL,
		catalogModels: () => LONGCAT_MODEL_CATALOG,
		aliases: [{
			modelRef: LONGCAT_DEFAULT_MODEL_REF,
			alias: "LongCat 2.0"
		}]
	})
};
const { applyConfig: applyLongCatConfig } = createModelCatalogPresetAppliers(longCatPreset);
const { applyConfig: applyLongCatConnectionConfig } = createProviderConnectionPresetAppliers(longCatPreset);
//#endregion
export { applyLongCatConfig, applyLongCatConnectionConfig };
