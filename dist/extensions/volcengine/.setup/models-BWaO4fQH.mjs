import { buildManifestProviderCatalogFamily } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/volcengine/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "volcengine",
	categories: ["models"],
	capabilityCatalogEntry: "./capability-catalog.ts",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providerCatalogEntry: "./provider-discovery.ts",
	providers: ["volcengine", "volcengine-plan"],
	setup: { "providers": [{
		"id": "volcengine",
		"envVars": ["VOLCANO_ENGINE_API_KEY"]
	}, {
		"id": "volcengine-tts",
		"envVars": [
			"VOLCENGINE_TTS_API_KEY",
			"BYTEPLUS_SEED_SPEECH_API_KEY",
			"VOLCENGINE_TTS_APPID",
			"VOLCENGINE_TTS_TOKEN"
		]
	}] },
	providerAuthAliases: { "volcengine-plan": "volcengine" },
	providerRequest: { "providers": {
		"volcengine": { "openAICompletions": { "supportsStreamingUsage": true } },
		"volcengine-plan": { "openAICompletions": { "supportsStreamingUsage": true } }
	} },
	modelCatalog: {
		"modelsDev": {
			"volcengine": "volcengine",
			"volcengine-plan": "volcengine-coding-plan"
		},
		"providers": {
			"volcengine": {
				"baseUrl": "https://ark.cn-beijing.volces.com/api/v3",
				"api": "openai-completions",
				"models": [
					{
						"id": "doubao-seed-evolving",
						"name": "Doubao Seed Evolving",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 1024e3,
						"maxTokens": 256e3,
						"cost": {
							"input": .885478,
							"output": 4.427391,
							"cacheRead": .177096,
							"cacheWrite": 0
						}
					},
					{
						"id": "doubao-seed-2-1-pro-260628",
						"name": "Doubao Seed 2.1 Pro",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 256e3,
						"cost": {
							"input": .885478,
							"output": 4.427391,
							"cacheRead": .177096,
							"cacheWrite": 0
						}
					},
					{
						"id": "doubao-seed-2-1-turbo-260628",
						"name": "Doubao Seed 2.1 Turbo",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 256e3,
						"cost": {
							"input": .442739,
							"output": 2.213695,
							"cacheRead": .088548,
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
							"input": 1.180638,
							"output": 4.132231,
							"cacheRead": .295159,
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
							"input": 1.770956,
							"output": 3.541913,
							"cacheRead": .14758,
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
							"input": .14758,
							"output": .295159,
							"cacheRead": .029516,
							"cacheWrite": 0
						}
					},
					{
						"id": "kimi-k2-5-260127",
						"name": "Kimi K2.5",
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 4096,
						"cost": {
							"input": 1e-4,
							"output": 2e-4,
							"cacheRead": 0,
							"cacheWrite": 0
						},
						"status": "deprecated",
						"replacedBy": "doubao-seed-evolving"
					},
					{
						"id": "glm-4-7-251222",
						"name": "GLM 4.7",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 2e5,
						"maxTokens": 128e3,
						"cost": {
							"input": 1e-4,
							"output": 2e-4,
							"cacheRead": 0,
							"cacheWrite": 0
						},
						"status": "deprecated",
						"replacedBy": "glm-5-2-260617"
					},
					{
						"id": "deepseek-v3-2-251201",
						"name": "DeepSeek V3.2",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 128e3,
						"maxTokens": 32e3,
						"cost": {
							"input": .295159,
							"output": .442739,
							"cacheRead": .059032,
							"cacheWrite": 0,
							"tieredPricing": [{
								"input": .295159,
								"output": .442739,
								"cacheRead": .059032,
								"cacheWrite": 0,
								"range": [0, 32e3]
							}, {
								"input": .590319,
								"output": .885478,
								"cacheRead": .059032,
								"cacheWrite": 0,
								"range": [32e3]
							}]
						},
						"status": "deprecated",
						"replacedBy": "deepseek-v4-flash-260425"
					}
				]
			},
			"volcengine-plan": {
				"baseUrl": "https://ark.cn-beijing.volces.com/api/coding/v3",
				"api": "openai-completions",
				"defaultModel": "ark-code-latest",
				"models": [
					{
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
					},
					{
						"id": "doubao-seed-2.1-turbo",
						"name": "Doubao Seed 2.1 Turbo",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 256e3,
						"maxTokens": 256e3,
						"cost": {
							"input": 0,
							"output": 0,
							"cacheRead": 0,
							"cacheWrite": 0
						}
					},
					{
						"id": "glm-5.2",
						"name": "GLM 5.2",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 128e3,
						"cost": {
							"input": 0,
							"output": 0,
							"cacheRead": 0,
							"cacheWrite": 0
						},
						"compat": { "codeMode": "capable" }
					},
					{
						"id": "deepseek-v4-pro",
						"name": "DeepSeek V4 Pro",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 384e3,
						"cost": {
							"input": 0,
							"output": 0,
							"cacheRead": 0,
							"cacheWrite": 0
						},
						"compat": { "codeMode": "capable" }
					},
					{
						"id": "deepseek-v4-flash",
						"name": "DeepSeek V4 Flash",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 384e3,
						"cost": {
							"input": 0,
							"output": 0,
							"cacheRead": 0,
							"cacheWrite": 0
						},
						"compat": { "codeMode": "capable" }
					}
				]
			}
		},
		"discovery": {
			"volcengine": "refreshable",
			"volcengine-plan": "refreshable"
		}
	},
	providerAuthChoices: [{
		"provider": "volcengine",
		"method": "api-key",
		"choiceId": "volcengine-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Volcano Engine API key",
		"groupId": "volcengine",
		"groupLabel": "Volcano Engine",
		"groupHint": "API key",
		"optionKey": "volcengineApiKey",
		"cliFlag": "--volcengine-api-key",
		"cliOption": "--volcengine-api-key <key>",
		"cliDescription": "Volcano Engine API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	contracts: { "speechProviders": [
		"volcengine",
		"bytedance",
		"doubao"
	] }
};
//#endregion
//#region extensions/volcengine/models.ts
const VOLCENGINE_PROVIDER_CATALOG = buildManifestProviderCatalogFamily({ surfaces: [{
	id: "volcengine",
	label: "Volcengine",
	catalog: openclaw_plugin_default.modelCatalog.providers.volcengine
}, {
	id: "volcengine-plan",
	label: "Volcengine Plan",
	catalog: openclaw_plugin_default.modelCatalog.providers["volcengine-plan"]
}] });
const DOUBAO_PROVIDER = VOLCENGINE_PROVIDER_CATALOG.entries[0];
const DOUBAO_CODING_PROVIDER = VOLCENGINE_PROVIDER_CATALOG.entries[1];
const DOUBAO_BASE_URL = DOUBAO_PROVIDER.baseUrl;
const DOUBAO_CODING_BASE_URL = DOUBAO_CODING_PROVIDER.baseUrl;
const DOUBAO_MODEL_CATALOG = DOUBAO_PROVIDER.models;
const DOUBAO_CODING_MODEL_CATALOG = DOUBAO_CODING_PROVIDER.models;
//#endregion
export { VOLCENGINE_PROVIDER_CATALOG as a, DOUBAO_MODEL_CATALOG as i, DOUBAO_CODING_BASE_URL as n, openclaw_plugin_default as o, DOUBAO_CODING_MODEL_CATALOG as r, DOUBAO_BASE_URL as t };
