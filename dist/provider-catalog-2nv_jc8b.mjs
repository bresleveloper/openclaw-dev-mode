import { i as discoverHuggingfaceModels, t as HUGGINGFACE_BASE_URL } from "./models-DNT1wpxE.mjs";
//#region extensions/huggingface/provider-catalog.ts
async function buildHuggingfaceProvider(discoveryApiKey = "", options = {}) {
	return {
		baseUrl: HUGGINGFACE_BASE_URL,
		api: "openai-completions",
		models: await discoverHuggingfaceModels(discoveryApiKey, void 0, options)
	};
}
//#endregion
export { buildHuggingfaceProvider as t };
