import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
//#region extensions/gmi/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "gmi",
	categories: ["models"],
	name: "GMI Cloud",
	description: "OpenClaw GMI Cloud provider plugin.",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: [
		"gmi",
		"gmi-cloud",
		"gmicloud"
	],
	providerAuthAliases: {
		"gmi-cloud": "gmi",
		"gmicloud": "gmi"
	},
	providerEndpoints: [{
		"endpointClass": "gmi-native",
		"hosts": ["api.gmi-serving.com"]
	}],
	providerRequest: { "providers": {
		"gmi": { "family": "gmi" },
		"gmi-cloud": { "family": "gmi" },
		"gmicloud": { "family": "gmi" }
	} },
	setup: { "providers": [{
		"id": "gmi",
		"envVars": ["GMI_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "gmi",
		"method": "api-key",
		"choiceId": "gmi-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "GMI Cloud API key",
		"choiceHint": "OpenAI-compatible GMI Cloud endpoint",
		"groupId": "gmi",
		"groupLabel": "GMI Cloud",
		"groupHint": "OpenAI-compatible GMI Cloud endpoint",
		"optionKey": "gmiApiKey",
		"cliFlag": "--gmi-api-key",
		"cliOption": "--gmi-api-key <key>",
		"cliDescription": "GMI Cloud API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	modelCatalog: {
		"modelsDev": { "gmi": "gmicloud" },
		"aliases": {
			"gmi-cloud": { "provider": "gmi" },
			"gmicloud": { "provider": "gmi" }
		},
		"providers": { "gmi": {
			"baseUrl": "https://api.gmi-serving.com/v1",
			"api": "openai-completions",
			"defaultModel": "openai/gpt-5.6-sol",
			"models": [
				{
					"id": "zai-org/GLM-5.2-FP8",
					"name": "GLM-5.2 FP8",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 128e3,
					"cost": {
						"input": .923,
						"output": 2.903,
						"cacheRead": .171,
						"cacheWrite": 0
					}
				},
				{
					"id": "zai-org/GLM-5.1-FP8",
					"name": "GLM-5.1 FP8",
					"status": "deprecated",
					"replacedBy": "zai-org/GLM-5.2-FP8",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 202752,
					"maxTokens": 65536,
					"cost": {
						"input": .979,
						"output": 3.08,
						"cacheRead": .182,
						"cacheWrite": 0
					}
				},
				{
					"id": "deepseek-ai/DeepSeek-V4-Pro",
					"name": "DeepSeek V4 Pro",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 384e3,
					"cost": {
						"input": .678,
						"output": 1.357,
						"cacheRead": .056,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "deepseek-ai/DeepSeek-V3.2",
					"name": "DeepSeek V3.2",
					"status": "deprecated",
					"replacedBy": "deepseek-ai/DeepSeek-V4-Pro",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 163840,
					"maxTokens": 65536,
					"cost": {
						"input": .29,
						"output": .43,
						"cacheRead": .03,
						"cacheWrite": 0
					}
				},
				{
					"id": "google/gemini-3.5-flash-lite",
					"name": "Gemini 3.5 Flash Lite",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 65536,
					"cost": {
						"input": .3,
						"output": 2.5,
						"cacheRead": .03,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "anthropic/claude-sonnet-5",
					"name": "Claude Sonnet 5",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 409600,
					"maxTokens": 128e3,
					"cost": {
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "anthropic/claude-sonnet-4.6",
					"name": "Claude Sonnet 4.6",
					"status": "deprecated",
					"replacedBy": "anthropic/claude-sonnet-5",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 409600,
					"maxTokens": 64e3,
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					}
				},
				{
					"id": "openai/gpt-5.6-sol",
					"name": "GPT-5.6 Sol",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 105e4,
					"maxTokens": 128e3,
					"cost": {
						"input": 5,
						"output": 30,
						"cacheRead": .5,
						"cacheWrite": 6.25
					},
					"compat": { "codeMode": "capable" }
				}
			]
		} },
		"discovery": { "gmi": "refreshable" }
	}
};
//#endregion
//#region extensions/gmi/index.ts
const PROVIDER_ID = "gmi";
var gmi_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "GMI Cloud Provider",
	description: "GMI Cloud provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "GMI Cloud",
		docsPath: "/providers/gmi",
		aliases: ["gmi-cloud", "gmicloud"],
		manifestAuth: {
			noteTitle: "GMI Cloud",
			noteMessage: "Manage API keys at https://www.gmicloud.ai/"
		},
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai")
	}
});
//#endregion
export { gmi_default as default };
