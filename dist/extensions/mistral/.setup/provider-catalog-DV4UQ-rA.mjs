import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/mistral/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "mistral",
	categories: ["models"],
	capabilityCatalogEntry: "./capability-catalog.ts",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["mistral"],
	providerEndpoints: [{
		"endpointClass": "mistral-public",
		"hosts": ["api.mistral.ai"]
	}],
	providerRequest: { "providers": { "mistral": { "family": "mistral" } } },
	modelCatalog: {
		"modelsDev": { "mistral": "mistral" },
		"providers": { "mistral": {
			"baseUrl": "https://api.mistral.ai/v1",
			"api": "openai-completions",
			"defaultModel": "mistral-large-latest",
			"models": [
				{
					"id": "codestral-latest",
					"name": "Codestral (latest)",
					"input": ["text"],
					"contextWindow": 128e3,
					"maxTokens": 4096,
					"cost": {
						"input": .3,
						"output": .9,
						"cacheRead": .03,
						"cacheWrite": 0
					}
				},
				{
					"id": "devstral-medium-latest",
					"name": "Devstral 2 (latest)",
					"status": "deprecated",
					"replacedBy": "mistral-medium-3-5",
					"input": ["text"],
					"contextWindow": 262144,
					"maxTokens": 32768,
					"cost": {
						"input": .4,
						"output": 2,
						"cacheRead": .04,
						"cacheWrite": 0
					}
				},
				{
					"id": "mistral-large-latest",
					"name": "Mistral Large 3 (latest)",
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 16384,
					"cost": {
						"input": .5,
						"output": 1.5,
						"cacheRead": .05,
						"cacheWrite": 0
					}
				},
				{
					"id": "mistral-medium-2508",
					"name": "Mistral Medium 3.1",
					"status": "deprecated",
					"replacedBy": "mistral-medium-3-5",
					"input": ["text", "image"],
					"contextWindow": 128e3,
					"maxTokens": 8192,
					"cost": {
						"input": .4,
						"output": 2,
						"cacheRead": .04,
						"cacheWrite": 0
					}
				},
				{
					"id": "mistral-medium-3-5",
					"name": "Mistral Medium 3.5",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 8192,
					"cost": {
						"input": 1.5,
						"output": 7.5,
						"cacheRead": .15,
						"cacheWrite": 0
					}
				},
				{
					"id": "mistral-small-latest",
					"name": "Mistral Small 4 (latest)",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 16384,
					"cost": {
						"input": .15,
						"output": .6,
						"cacheRead": .015,
						"cacheWrite": 0
					}
				},
				{
					"id": "mistral-small-2603",
					"name": "Mistral Small 4 (26.03)",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 16384,
					"cost": {
						"input": .15,
						"output": .6,
						"cacheRead": .015,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "mistral": "refreshable" }
	},
	setup: { "providers": [{
		"id": "mistral",
		"envVars": ["MISTRAL_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "mistral",
		"method": "api-key",
		"choiceId": "mistral-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Mistral API key",
		"groupId": "mistral",
		"groupLabel": "Mistral AI",
		"groupHint": "API key",
		"optionKey": "mistralApiKey",
		"cliFlag": "--mistral-api-key",
		"cliOption": "--mistral-api-key <key>",
		"cliDescription": "Mistral API key"
	}],
	contracts: {
		"embeddingProviders": ["mistral"],
		"mediaUnderstandingProviders": ["mistral"],
		"realtimeTranscriptionProviders": ["mistral"]
	},
	mediaUnderstandingProviderMetadata: { "mistral": {
		"capabilities": ["audio"],
		"defaultModels": { "audio": "voxtral-mini-latest" },
		"autoPriority": { "audio": 50 }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/mistral/provider-catalog.ts
function buildMistralProvider() {
	return buildManifestModelProviderConfig({
		providerId: "mistral",
		catalog: openclaw_plugin_default.modelCatalog.providers.mistral
	});
}
//#endregion
export { openclaw_plugin_default as n, buildMistralProvider as t };
