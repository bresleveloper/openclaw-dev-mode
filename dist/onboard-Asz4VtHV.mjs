import { _ as createProviderConnectionPresetAppliers, g as createModelCatalogPresetAppliers } from "./provider-onboard-Be0xLg2V.mjs";
import { n as HUGGINGFACE_MODEL_CATALOG, t as HUGGINGFACE_BASE_URL } from "./models-DNT1wpxE.mjs";
//#region extensions/huggingface/onboard.ts
const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
const huggingfacePreset = {
	primaryModelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "huggingface",
		api: "openai-completions",
		baseUrl: HUGGINGFACE_BASE_URL,
		catalogModels: () => HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model)),
		aliases: [{
			modelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
			alias: "Hugging Face"
		}]
	})
};
const { applyConfig: applyHuggingfaceConfig } = createModelCatalogPresetAppliers(huggingfacePreset);
const { applyConfig: applyHuggingfaceConnectionConfig } = createProviderConnectionPresetAppliers(huggingfacePreset);
//#endregion
export { applyHuggingfaceConfig as n, applyHuggingfaceConnectionConfig as r, HUGGINGFACE_DEFAULT_MODEL_REF as t };
