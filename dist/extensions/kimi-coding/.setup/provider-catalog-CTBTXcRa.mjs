import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/kimi-coding/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "kimi",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: [
		"kimi",
		"kimi-code",
		"kimi-coding"
	],
	modelIdNormalization: { "providers": { "kimi": { "aliases": {
		"kimi-code": "kimi-for-coding",
		"k2p5": "kimi-for-coding",
		"k3[1m]": "k3"
	} } } },
	providerRequest: { "providers": {
		"kimi": {
			"family": "moonshot",
			"compatibilityFamily": "moonshot"
		},
		"kimi-coding": {
			"family": "moonshot",
			"compatibilityFamily": "moonshot"
		}
	} },
	modelCatalog: {
		"modelsDev": { "kimi": "kimi-for-coding" },
		"providers": { "kimi": {
			"baseUrl": "https://api.kimi.com/coding/",
			"api": "anthropic-messages",
			"headers": { "User-Agent": "claude-code/0.1.0" },
			"defaultModel": "kimi-for-coding",
			"models": [
				{
					"id": "k3",
					"name": "Kimi K3",
					"reasoning": true,
					"upstreamModel": "moonshot/kimi-k3",
					"thinkingLevelMap": {
						"minimal": "low",
						"low": "low",
						"medium": "high",
						"high": "high",
						"xhigh": "max",
						"max": "max"
					},
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "k3-256k",
					"name": "Kimi K3 (256k)",
					"reasoning": true,
					"upstreamModel": "moonshot/kimi-k3",
					"thinkingLevelMap": {
						"minimal": "low",
						"low": "low",
						"medium": "high",
						"high": "high",
						"xhigh": "max",
						"max": "max"
					},
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 131072,
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "kimi-for-coding",
					"name": "Kimi Code",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 32768,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				},
				{
					"id": "kimi-for-coding-highspeed",
					"name": "Kimi K2.7 Code HighSpeed",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 32768,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "kimi": "static" }
	},
	modelPricing: { "providers": {
		"kimi": {
			"openRouter": { "provider": "moonshotai" },
			"liteLLM": { "provider": "moonshot" }
		},
		"kimi-coding": {
			"openRouter": { "provider": "moonshotai" },
			"liteLLM": { "provider": "moonshot" }
		}
	} },
	setup: { "providers": [{
		"id": "kimi",
		"envVars": ["KIMI_API_KEY", "KIMICODE_API_KEY"]
	}, {
		"id": "kimi-coding",
		"envVars": ["KIMI_API_KEY", "KIMICODE_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "kimi",
		"method": "api-key",
		"choiceId": "kimi-code-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Kimi Code API key (subscription)",
		"groupId": "moonshot",
		"groupLabel": "Moonshot AI (Kimi)",
		"groupHint": "Kimi Code membership · https://www.kimi.com/membership/pricing",
		"optionKey": "kimiCodeApiKey",
		"cliFlag": "--kimi-code-api-key",
		"cliOption": "--kimi-code-api-key <key>",
		"cliDescription": "Kimi Code API key (subscription)"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/kimi-coding/provider-catalog.ts
const KIMI_PROVIDER_ID = "kimi";
const KIMI_CODING_CATALOG = openclaw_plugin_default.modelCatalog.providers.kimi;
const KIMI_MODEL_ALIASES = new Map(Object.entries(openclaw_plugin_default.modelIdNormalization.providers.kimi.aliases));
const KIMI_CODING_BASE_URL = KIMI_CODING_CATALOG.baseUrl;
const KIMI_CODING_DEFAULT_MODEL_ID = KIMI_CODING_CATALOG.defaultModel;
const KIMI_CODING_LEGACY_MODEL_IDS = ["kimi-code", "k2p5"];
function buildKimiCodingProvider() {
	return buildManifestModelProviderConfig({
		providerId: KIMI_PROVIDER_ID,
		catalog: KIMI_CODING_CATALOG
	});
}
function normalizeKimiCodingModelId(modelId) {
	return KIMI_MODEL_ALIASES.get(modelId) ?? modelId;
}
//#endregion
export { normalizeKimiCodingModelId as a, buildKimiCodingProvider as i, KIMI_CODING_DEFAULT_MODEL_ID as n, openclaw_plugin_default as o, KIMI_CODING_LEGACY_MODEL_IDS as r, KIMI_CODING_BASE_URL as t };
