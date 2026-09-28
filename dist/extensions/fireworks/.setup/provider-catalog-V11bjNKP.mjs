import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/fireworks/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "fireworks",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["fireworks"],
	setup: { "providers": [{
		"id": "fireworks",
		"envVars": ["FIREWORKS_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "fireworks",
		"method": "api-key",
		"choiceId": "fireworks-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Fireworks API key",
		"groupId": "fireworks",
		"groupLabel": "Fireworks",
		"groupHint": "API key",
		"optionKey": "fireworksApiKey",
		"cliFlag": "--fireworks-api-key",
		"cliOption": "--fireworks-api-key <key>",
		"cliDescription": "Fireworks API key"
	}],
	modelCatalog: {
		"aliases": { "fireworks-ai": {
			"provider": "fireworks",
			"api": "openai-completions"
		} },
		"modelsDev": { "fireworks": "fireworks-ai" },
		"providers": { "fireworks": {
			"baseUrl": "https://api.fireworks.ai/inference/v1",
			"api": "openai-completions",
			"defaultModel": "accounts/fireworks/routers/glm-5p2-fast",
			"models": [
				{
					"id": "accounts/fireworks/routers/glm-5p2-fast",
					"name": "GLM 5.2 Fast",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 256e3,
					"cost": {
						"input": 2.1,
						"output": 6.6,
						"cacheRead": .21,
						"cacheWrite": 0
					}
				},
				{
					"id": "accounts/fireworks/models/kimi-k2p6",
					"name": "Kimi K2.6",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 262144,
					"cost": {
						"input": .95,
						"output": 4,
						"cacheRead": .16,
						"cacheWrite": 0
					}
				},
				{
					"id": "accounts/fireworks/routers/kimi-k2p6-turbo",
					"name": "Kimi K2.6 Fast",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 256e3,
					"compat": { "unsupportedToolSchemaKeywords": ["not"] },
					"cost": {
						"input": 2,
						"output": 8,
						"cacheRead": .3,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "fireworks": "refreshable" }
	},
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/fireworks/provider-catalog.ts
const FIREWORKS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "fireworks",
	catalog: openclaw_plugin_default.modelCatalog.providers.fireworks
});
const FIREWORKS_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "fireworks");
const FIREWORKS_BASE_URL = FIREWORKS_MANIFEST_PROVIDER.baseUrl;
const FIREWORKS_DEFAULT_MODEL_ID = FIREWORKS_DEFAULT_MODEL_REF.slice(10);
function requireFireworksManifestModel(id) {
	const model = FIREWORKS_MANIFEST_PROVIDER.models.find((entry) => entry.id === id);
	if (!model) throw new Error(`Missing Fireworks modelCatalog row ${id}`);
	return model;
}
const FIREWORKS_DEFAULT_MODEL = requireFireworksManifestModel(FIREWORKS_DEFAULT_MODEL_ID);
const FIREWORKS_DEFAULT_CONTEXT_WINDOW = FIREWORKS_DEFAULT_MODEL.contextWindow;
const FIREWORKS_DEFAULT_MAX_TOKENS = FIREWORKS_DEFAULT_MODEL.maxTokens;
function isFireworksCatalogModelId(modelId) {
	return FIREWORKS_MANIFEST_PROVIDER.models.some((model) => model.id === modelId);
}
function buildFireworksCatalogModels() {
	return FIREWORKS_MANIFEST_PROVIDER.models.map((model) => structuredClone(model));
}
function buildFireworksProvider() {
	return buildManifestModelProviderConfig({
		providerId: "fireworks",
		catalog: openclaw_plugin_default.modelCatalog.providers.fireworks
	});
}
//#endregion
export { FIREWORKS_DEFAULT_MODEL_REF as a, isFireworksCatalogModelId as c, FIREWORKS_DEFAULT_MODEL_ID as i, openclaw_plugin_default as l, FIREWORKS_DEFAULT_CONTEXT_WINDOW as n, buildFireworksCatalogModels as o, FIREWORKS_DEFAULT_MAX_TOKENS as r, buildFireworksProvider as s, FIREWORKS_BASE_URL as t };
