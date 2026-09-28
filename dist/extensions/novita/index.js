import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
//#region extensions/novita/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "novita",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: [
		"novita",
		"novita-ai",
		"novitaai"
	],
	providerAuthAliases: {
		"novita-ai": "novita",
		"novitaai": "novita"
	},
	providerEndpoints: [{
		"endpointClass": "novita-native",
		"hosts": ["api.novita.ai"]
	}],
	providerRequest: { "providers": {
		"novita": { "family": "novita" },
		"novita-ai": { "family": "novita" },
		"novitaai": { "family": "novita" }
	} },
	setup: { "providers": [{
		"id": "novita",
		"envVars": ["NOVITA_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "novita",
		"method": "api-key",
		"choiceId": "novita-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "NovitaAI API key",
		"choiceHint": "OpenAI-compatible NovitaAI endpoint",
		"groupId": "novita",
		"groupLabel": "NovitaAI",
		"groupHint": "OpenAI-compatible NovitaAI endpoint",
		"optionKey": "novitaApiKey",
		"cliFlag": "--novita-api-key",
		"cliOption": "--novita-api-key <key>",
		"cliDescription": "NovitaAI API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	modelCatalog: {
		"modelsDev": { "novita": "novita-ai" },
		"aliases": {
			"novita-ai": { "provider": "novita" },
			"novitaai": { "provider": "novita" }
		},
		"providers": { "novita": {
			"baseUrl": "https://api.novita.ai/openai/v1",
			"api": "openai-completions",
			"defaultModel": "deepseek/deepseek-v4-pro",
			"models": [
				{
					"id": "moonshotai/kimi-k3",
					"name": "Kimi K3",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 1048576,
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "moonshotai/kimi-k2.7-code",
					"name": "Kimi K2.7 Code",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 262144,
					"cost": {
						"input": .95,
						"output": 4,
						"cacheRead": .19,
						"cacheWrite": 0
					}
				},
				{
					"id": "minimax/minimax-m3",
					"name": "MiniMax M3",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"cost": {
						"input": .3,
						"output": 1.2,
						"cacheRead": .06,
						"cacheWrite": 0
					}
				},
				{
					"id": "zai-org/glm-5.2",
					"name": "GLM-5.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 1.4,
						"output": 4.4,
						"cacheRead": .26,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "deepseek/deepseek-v4-pro",
					"name": "DeepSeek V4 Pro",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 393216,
					"cost": {
						"input": 1.6,
						"output": 3.2,
						"cacheRead": .135,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "deepseek/deepseek-v4-flash",
					"name": "DeepSeek V4 Flash",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 393216,
					"cost": {
						"input": .14,
						"output": .28,
						"cacheRead": .028,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "capable" }
				},
				{
					"id": "qwen/qwen3.7-max",
					"name": "Qwen3.7-Max",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 65536,
					"cost": {
						"input": 1.25,
						"output": 3.75,
						"cacheRead": .25,
						"cacheWrite": 0
					}
				},
				{
					"id": "minimax/minimax-m2.7",
					"name": "MiniMax M2.7",
					"status": "deprecated",
					"replacedBy": "minimax/minimax-m3",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 204800,
					"maxTokens": 131072,
					"cost": {
						"input": .3,
						"output": 1.2,
						"cacheRead": .06,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "novita": "refreshable" }
	}
};
//#endregion
//#region extensions/novita/index.ts
const PROVIDER_ID = "novita";
var novita_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "NovitaAI Provider",
	description: "Official OpenClaw NovitaAI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "NovitaAI",
		docsPath: "/providers/novita",
		aliases: ["novita-ai", "novitaai"],
		manifestAuth: {
			noteTitle: "NovitaAI",
			noteMessage: "Manage API keys at https://novita.ai/settings/key-management"
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
export { novita_default as default };
