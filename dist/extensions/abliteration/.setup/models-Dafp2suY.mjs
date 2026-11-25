import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/abliteration/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "abliteration",
	categories: ["models"],
	name: "Abliteration",
	description: "OpenClaw Abliteration provider plugin.",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["abliteration"],
	setup: { "providers": [{
		"id": "abliteration",
		"envVars": ["ABLITERATION_API_KEY", "ABLIT_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "abliteration",
		"method": "api-key",
		"choiceId": "abliteration-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Abliteration API key",
		"choiceHint": "OpenAI-compatible abliterated open-weight models",
		"groupId": "abliteration",
		"groupLabel": "Abliteration",
		"groupHint": "OpenAI-compatible abliterated open-weight models",
		"optionKey": "abliterationApiKey",
		"cliFlag": "--abliteration-api-key",
		"cliOption": "--abliteration-api-key <key>",
		"cliDescription": "Abliteration API key"
	}],
	modelCatalog: {
		"providers": { "abliteration": {
			"baseUrl": "https://api.abliteration.ai/v1",
			"api": "openai-completions",
			"defaultModel": "abliterated-model-large-flash",
			"models": [
				{
					"id": "abliterated-model-large-flash",
					"name": "Abliterated Large Flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 262144,
					"cost": {
						"input": 1,
						"output": 2,
						"cacheRead": .1,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": true,
						"supportsPromptCacheKey": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"thinkingFormat": "openai",
						"supportedReasoningEfforts": [
							"none",
							"low",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"low": "low",
							"high": "high",
							"max": "max"
						},
						"supportsLongCacheRetention": false
					}
				},
				{
					"id": "abliterated-model-large-v2",
					"name": "Abliterated Large v2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 999990,
					"cost": {
						"input": 3,
						"output": 5,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": true,
						"supportsPromptCacheKey": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"thinkingFormat": "openai",
						"supportedReasoningEfforts": [
							"low",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "low",
							"low": "low",
							"high": "high",
							"max": "max"
						},
						"supportsLongCacheRetention": false
					}
				},
				{
					"id": "abliterated-model",
					"name": "Abliterated Model",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 262134,
					"cost": {
						"input": 1,
						"output": 3,
						"cacheRead": .1,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": true,
						"supportsPromptCacheKey": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"thinkingFormat": "openai",
						"supportedReasoningEfforts": [
							"none",
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"minimal": "minimal",
							"low": "low",
							"medium": "medium",
							"high": "high",
							"xhigh": "xhigh",
							"max": "max"
						},
						"supportsLongCacheRetention": false
					}
				},
				{
					"id": "abliterated-model-large",
					"name": "Abliterated Large",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 999990,
					"cost": {
						"input": 3,
						"output": 5,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": true,
						"supportsPromptCacheKey": true,
						"supportsReasoningEffort": true,
						"maxTokensField": "max_tokens",
						"thinkingFormat": "openai",
						"supportedReasoningEfforts": [
							"none",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"high": "high",
							"max": "max"
						},
						"supportsLongCacheRetention": false
					},
					"status": "deprecated"
				}
			]
		} },
		"discovery": { "abliteration": "static" }
	},
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
// extensions/abliteration/models.ts
function buildAbliterationProvider() {
	return buildManifestModelProviderConfig({
		providerId: "abliteration",
		catalog: openclaw_plugin_default.modelCatalog.providers.abliteration
	});
}
const ABLITERATION_DEFAULT_MODEL_REF = `abliteration/abliterated-model-large-flash`;
export { buildAbliterationProvider as n, openclaw_plugin_default as r, ABLITERATION_DEFAULT_MODEL_REF as t };
