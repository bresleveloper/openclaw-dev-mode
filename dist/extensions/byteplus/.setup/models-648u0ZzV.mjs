import { buildManifestProviderCatalogFamily } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/byteplus/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "byteplus",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providerCatalogEntry: "./provider-discovery.ts",
	providers: ["byteplus", "byteplus-plan"],
	setup: { "providers": [{
		"id": "byteplus",
		"envVars": ["BYTEPLUS_API_KEY"]
	}] },
	providerAuthAliases: { "byteplus-plan": "byteplus" },
	modelCatalog: {
		"providers": {
			"byteplus": {
				"baseUrl": "https://ark.ap-southeast.bytepluses.com/api/v3",
				"api": "openai-completions",
				"models": [
					{
						"id": "dola-seed-2-1-turbo-260628",
						"name": "Dola Seed 2.1 Turbo",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 256e3,
						"cost": {
							"input": .5,
							"output": 2.5,
							"cacheRead": .1,
							"cacheWrite": 0
						}
					},
					{
						"id": "seed-2-0-code-preview-260328",
						"name": "Seed 2.0 Code Preview",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 128e3,
						"cost": {
							"input": .5,
							"output": 3,
							"cacheRead": .1,
							"cacheWrite": 0
						}
					},
					{
						"id": "glm-5-2-260617",
						"name": "GLM 5.2",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 128e3,
						"cost": {
							"input": 1.4,
							"output": 4.4,
							"cacheRead": .26,
							"cacheWrite": 0
						}
					},
					{
						"id": "deepseek-v4-pro-260425",
						"name": "DeepSeek V4 Pro",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 384e3,
						"cost": {
							"input": 1.74,
							"output": 3.48,
							"cacheRead": .145,
							"cacheWrite": 0
						}
					},
					{
						"id": "deepseek-v4-flash-260425",
						"name": "DeepSeek V4 Flash",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 384e3,
						"cost": {
							"input": .14,
							"output": .28,
							"cacheRead": .028,
							"cacheWrite": 0
						}
					},
					{
						"id": "glm-4-7-251222",
						"name": "GLM 4.7",
						"status": "deprecated",
						"replacedBy": "glm-5-2-260617",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 256e3,
						"maxTokens": 128e3,
						"cost": {
							"input": .6,
							"output": 2.2,
							"cacheRead": .11,
							"cacheWrite": 0
						}
					}
				]
			},
			"byteplus-plan": {
				"baseUrl": "https://ark.ap-southeast.bytepluses.com/api/coding/v3",
				"api": "openai-completions",
				"defaultModel": "ark-code-latest",
				"models": [{
					"id": "ark-code-latest",
					"name": "Ark Coding Plan",
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 4096,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}, {
					"id": "kimi-k2.5",
					"name": "Kimi K2.5 Coding",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 256e3,
					"maxTokens": 32768,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}]
			}
		},
		"discovery": {
			"byteplus": "refreshable",
			"byteplus-plan": "refreshable"
		}
	},
	providerAuthChoices: [{
		"provider": "byteplus",
		"method": "api-key",
		"choiceId": "byteplus-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "BytePlus API key",
		"groupId": "byteplus",
		"groupLabel": "BytePlus",
		"groupHint": "API key",
		"optionKey": "byteplusApiKey",
		"cliFlag": "--byteplus-api-key",
		"cliOption": "--byteplus-api-key <key>",
		"cliDescription": "BytePlus API key"
	}],
	contracts: { "videoGenerationProviders": ["byteplus"] },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/byteplus/models.ts
/**
* BytePlus model catalog helpers derived from the plugin manifest.
*/
const BYTEPLUS_PROVIDER_CATALOG = buildManifestProviderCatalogFamily({ surfaces: [{
	id: "byteplus",
	label: "BytePlus",
	catalog: openclaw_plugin_default.modelCatalog.providers.byteplus
}, {
	id: "byteplus-plan",
	label: "BytePlus Plan",
	catalog: openclaw_plugin_default.modelCatalog.providers["byteplus-plan"]
}] });
const BYTEPLUS_PROVIDER = BYTEPLUS_PROVIDER_CATALOG.entries[0];
const BYTEPLUS_CODING_PROVIDER = BYTEPLUS_PROVIDER_CATALOG.entries[1];
/** Base URL for BytePlus chat/model APIs from the manifest catalog. */
const BYTEPLUS_BASE_URL = BYTEPLUS_PROVIDER.baseUrl;
/** Base URL for BytePlus Plan coding APIs from the manifest catalog. */
const BYTEPLUS_CODING_BASE_URL = BYTEPLUS_CODING_PROVIDER.baseUrl;
/** BytePlus general model catalog entries. */
const BYTEPLUS_MODEL_CATALOG = BYTEPLUS_PROVIDER.models;
/** BytePlus coding/planning model catalog entries. */
const BYTEPLUS_CODING_MODEL_CATALOG = BYTEPLUS_CODING_PROVIDER.models;
//#endregion
export { BYTEPLUS_PROVIDER_CATALOG as a, BYTEPLUS_MODEL_CATALOG as i, BYTEPLUS_CODING_BASE_URL as n, openclaw_plugin_default as o, BYTEPLUS_CODING_MODEL_CATALOG as r, BYTEPLUS_BASE_URL as t };
