import { r as buildCohereCatalogModels, t as COHERE_BASE_URL } from "./models-dx-ru0jz.js";
//#region extensions/cohere/provider-catalog.ts
function buildCohereProvider() {
	return {
		baseUrl: COHERE_BASE_URL,
		api: "openai-completions",
		models: buildCohereCatalogModels()
	};
}
//#endregion
export { buildCohereProvider as t };
