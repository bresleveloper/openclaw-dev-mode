import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/meta/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "meta",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["meta"],
	providerEndpoints: [{
		"endpointClass": "meta-native",
		"hosts": ["api.meta.ai"]
	}],
	providerRequest: { "providers": { "meta": { "family": "meta" } } },
	modelCatalog: {
		"modelsDev": { "meta": "meta" },
		"providers": { "meta": {
			"baseUrl": "https://api.meta.ai/v1",
			"api": "openai-responses",
			"defaultModel": "muse-spark-1.3",
			"models": [
				{
					"id": "muse-spark-1.3",
					"name": "Muse Spark 1.3",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"off": "minimal",
						"minimal": "minimal",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "xhigh"
					},
					"compat": {
						"supportsTools": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh"
						]
					},
					"cost": {
						"input": 1.25,
						"output": 4.25,
						"cacheRead": .15,
						"cacheWrite": 0
					}
				},
				{
					"id": "muse-spark-1.3-contributor",
					"name": "Muse Spark 1.3 Contributor",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"off": "minimal",
						"minimal": "minimal",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "xhigh"
					},
					"compat": {
						"supportsTools": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh"
						]
					},
					"cost": {
						"input": .1,
						"output": .2,
						"cacheRead": .002,
						"cacheWrite": 0
					}
				},
				{
					"id": "muse-spark-1.2",
					"name": "Muse Spark 1.2",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"off": "minimal",
						"minimal": "minimal",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "xhigh"
					},
					"compat": {
						"supportsTools": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh"
						]
					},
					"cost": {
						"input": 1.25,
						"output": 4.25,
						"cacheRead": .15,
						"cacheWrite": 0
					}
				},
				{
					"id": "muse-spark-1.2-contributor",
					"name": "Muse Spark 1.2 Contributor",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"off": "minimal",
						"minimal": "minimal",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "xhigh"
					},
					"compat": {
						"supportsTools": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh"
						]
					},
					"cost": {
						"input": .1,
						"output": .2,
						"cacheRead": .002,
						"cacheWrite": 0
					}
				},
				{
					"id": "muse-spark-1.1",
					"name": "Muse Spark 1.1",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"off": "minimal",
						"minimal": "minimal",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "xhigh"
					},
					"compat": {
						"supportsTools": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh"
						]
					},
					"cost": {
						"input": 1.25,
						"output": 4.25,
						"cacheRead": .15,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "meta": "refreshable" }
	},
	setup: { "providers": [{
		"id": "meta",
		"authMethods": ["api-key"],
		"envVars": ["MODEL_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "meta",
		"method": "api-key",
		"choiceId": "meta-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Meta API key",
		"choiceHint": "Meta (Responses API)",
		"groupId": "meta",
		"groupLabel": "Meta",
		"groupHint": "Meta (Responses API)",
		"onboardingFeatured": true,
		"optionKey": "metaApiKey",
		"cliFlag": "--meta-api-key",
		"cliOption": "--meta-api-key <key>",
		"cliDescription": "Meta API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/meta/provider-catalog.ts
/**
* Meta model provider builder.
*/
/** Builds the Meta OpenAI-compatible model provider config. */
function buildMetaProvider() {
	return buildManifestModelProviderConfig({
		providerId: "meta",
		catalog: openclaw_plugin_default.modelCatalog.providers.meta
	});
}
//#endregion
export { openclaw_plugin_default as n, buildMetaProvider as t };
