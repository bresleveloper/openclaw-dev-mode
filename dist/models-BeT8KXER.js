import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-D_YliG-V.js";
//#endregion
//#region extensions/cohere/models.ts
/**
* Cohere model catalog helpers derived from the plugin manifest.
*/
const COHERE_MANIFEST_CATALOG = {
	"providers": { "cohere": {
		"baseUrl": "https://api.cohere.ai/compatibility/v1",
		"api": "openai-completions",
		"models": [{
			"id": "command-a-03-2025",
			"name": "Command A",
			"input": ["text"],
			"contextWindow": 256e3,
			"maxTokens": 8e3,
			"cost": {
				"input": 2.5,
				"output": 10,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsUsageInStreaming": false,
				"maxTokensField": "max_tokens"
			}
		}]
	} },
	"discovery": { "cohere": "static" }
}.providers.cohere;
const COHERE_BASE_URL = COHERE_MANIFEST_CATALOG.baseUrl;
const COHERE_MODEL_CATALOG = COHERE_MANIFEST_CATALOG.models;
function buildCohereCatalogModels() {
	return buildManifestModelProviderConfig({
		providerId: "cohere",
		catalog: COHERE_MANIFEST_CATALOG
	}).models;
}
function buildCohereModelDefinition(model) {
	return buildManifestModelProviderConfig({
		providerId: "cohere",
		catalog: {
			...COHERE_MANIFEST_CATALOG,
			models: [model]
		}
	}).models[0];
}
//#endregion
export { buildCohereModelDefinition as i, COHERE_MODEL_CATALOG as n, buildCohereCatalogModels as r, COHERE_BASE_URL as t };
