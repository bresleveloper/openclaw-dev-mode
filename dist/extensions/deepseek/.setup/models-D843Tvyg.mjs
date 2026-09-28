import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/deepseek/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "deepseek",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providerCatalogEntry: "./provider-discovery.ts",
	providers: ["deepseek"],
	contracts: { "usageProviders": ["deepseek"] },
	providerEndpoints: [{
		"endpointClass": "deepseek-native",
		"hosts": ["api.deepseek.com"]
	}],
	providerRequest: { "providers": { "deepseek": { "family": "deepseek" } } },
	modelCatalog: {
		"modelsDev": { "deepseek": "deepseek" },
		"providers": { "deepseek": {
			"baseUrl": "https://api.deepseek.com",
			"api": "openai-completions",
			"defaultModel": "deepseek-v4-pro",
			"models": [
				{
					"id": "deepseek-v4-flash",
					"name": "DeepSeek V4 Flash",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .14,
						"output": .28,
						"cacheRead": .0028,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"codeMode": "preferred"
					}
				},
				{
					"id": "deepseek-v4-pro",
					"name": "DeepSeek V4 Pro",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .435,
						"output": .87,
						"cacheRead": .003625,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"codeMode": "preferred"
					}
				},
				{
					"id": "deepseek-v4-flash-vision-exp",
					"name": "DeepSeek V4 Flash Vision (Experimental)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .44,
						"output": 1.32,
						"cacheRead": .014,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"codeMode": "preferred"
					}
				},
				{
					"id": "deepseek-flash",
					"name": "DeepSeek V4.1 Flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .3,
						"output": 1.2,
						"cacheRead": .006,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"codeMode": "preferred"
					}
				}
			]
		} },
		"discovery": { "deepseek": "refreshable" }
	},
	setup: { "providers": [{
		"id": "deepseek",
		"envVars": ["DEEPSEEK_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "deepseek",
		"method": "api-key",
		"choiceId": "deepseek-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "DeepSeek API key",
		"groupId": "deepseek",
		"groupLabel": "DeepSeek",
		"groupHint": "API key",
		"optionKey": "deepseekApiKey",
		"cliFlag": "--deepseek-api-key",
		"cliOption": "--deepseek-api-key <key>",
		"cliDescription": "DeepSeek API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/deepseek/models.ts
const DEEPSEEK_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.deepseek;
const DEEPSEEK_BASE_URL = DEEPSEEK_MANIFEST_CATALOG.baseUrl;
const DEEPSEEK_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "deepseek",
	catalog: DEEPSEEK_MANIFEST_CATALOG
}).models.map((model) => Object.assign(model, { api: "openai-completions" }));
const DEEPSEEK_V4_MODEL_IDS = new Set(DEEPSEEK_MODEL_CATALOG.map((model) => model.id).filter((id) => id === "deepseek-flash" || id.startsWith("deepseek-v4-")));
function isDeepSeekV4ModelId(modelId) {
	return DEEPSEEK_V4_MODEL_IDS.has(modelId.toLowerCase());
}
function isDeepSeekV4ModelRef(model) {
	return model.provider === "deepseek" && typeof model.id === "string" && isDeepSeekV4ModelId(model.id);
}
//#endregion
export { openclaw_plugin_default as a, isDeepSeekV4ModelRef as i, DEEPSEEK_MODEL_CATALOG as n, isDeepSeekV4ModelId as r, DEEPSEEK_BASE_URL as t };
