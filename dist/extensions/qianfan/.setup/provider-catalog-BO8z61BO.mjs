import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/qianfan/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "qianfan",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["qianfan"],
	setup: { "providers": [{
		"id": "qianfan",
		"authMethods": ["api-key"],
		"envVars": ["QIANFAN_API_KEY"]
	}] },
	modelCatalog: {
		"providers": { "qianfan": {
			"baseUrl": "https://qianfan.baidubce.com/v2",
			"api": "openai-completions",
			"models": [
				{
					"id": "deepseek-v4-pro",
					"name": "DeepSeek V4 Pro",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1e6,
					"maxTokens": 393216,
					"cost": {
						"input": 1.771957,
						"output": 3.543915,
						"cacheRead": .147663,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "ernie-5.1",
					"name": "ERNIE 5.1",
					"input": ["text"],
					"reasoning": false,
					"contextWindow": 128e3,
					"maxTokens": 65536,
					"cost": {
						"input": .590652,
						"output": 2.657936,
						"cacheRead": 0,
						"cacheWrite": 0,
						"tieredPricing": [{
							"input": .590652,
							"output": 2.657936,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [0, 32001]
						}, {
							"input": .885979,
							"output": 3.248589,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [32001]
						}]
					}
				},
				{
					"id": "ernie-5.0",
					"name": "ERNIE 5.0",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 128e3,
					"maxTokens": 65536,
					"cost": {
						"input": .885979,
						"output": 3.543915,
						"cacheRead": 0,
						"cacheWrite": 0,
						"tieredPricing": [{
							"input": .885979,
							"output": 3.543915,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [0, 32001]
						}, {
							"input": 1.476631,
							"output": 5.906525,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [32001]
						}]
					}
				},
				{
					"id": "deepseek-v3.2",
					"name": "DeepSeek V3.2",
					"input": ["text"],
					"reasoning": false,
					"contextWindow": 128e3,
					"maxTokens": 32768,
					"cost": {
						"input": .295326,
						"output": .442989,
						"cacheRead": .059065,
						"cacheWrite": 0,
						"tieredPricing": [{
							"input": .295326,
							"output": .442989,
							"cacheRead": .059065,
							"cacheWrite": 0,
							"range": [0, 32001]
						}, {
							"input": .590652,
							"output": .885979,
							"cacheRead": .059065,
							"cacheWrite": 0,
							"range": [32001]
						}]
					},
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use deepseek-v4-pro for new Qianfan setups.",
					"replacedBy": "deepseek-v4-pro"
				},
				{
					"id": "ernie-5.0-thinking-preview",
					"name": "ERNIE-5.0-Thinking-Preview",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 128e3,
					"maxTokens": 65536,
					"cost": {
						"input": .885979,
						"output": 3.543915,
						"cacheRead": 0,
						"cacheWrite": 0,
						"tieredPricing": [{
							"input": .885979,
							"output": 3.543915,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [0, 32001]
						}, {
							"input": 1.476631,
							"output": 5.906525,
							"cacheRead": 0,
							"cacheWrite": 0,
							"range": [32001]
						}]
					},
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use the stable ernie-5.0 id for new Qianfan setups.",
					"replacedBy": "ernie-5.0"
				}
			]
		} },
		"discovery": { "qianfan": "refreshable" }
	},
	providerAuthChoices: [{
		"provider": "qianfan",
		"method": "api-key",
		"choiceId": "qianfan-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Qianfan API key",
		"groupId": "qianfan",
		"groupLabel": "Qianfan",
		"groupHint": "API key",
		"optionKey": "qianfanApiKey",
		"cliFlag": "--qianfan-api-key",
		"cliOption": "--qianfan-api-key <key>",
		"cliDescription": "QIANFAN API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/qianfan/provider-catalog.ts
const QIANFAN_BASE_URL = "https://qianfan.baidubce.com/v2";
const QIANFAN_DEFAULT_MODEL_ID = "deepseek-v4-pro";
function buildQianfanProvider() {
	return buildManifestModelProviderConfig({
		providerId: "qianfan",
		catalog: openclaw_plugin_default.modelCatalog.providers.qianfan
	});
}
//#endregion
export { openclaw_plugin_default as i, QIANFAN_DEFAULT_MODEL_ID as n, buildQianfanProvider as r, QIANFAN_BASE_URL as t };
