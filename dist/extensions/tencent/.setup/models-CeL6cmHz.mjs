import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/tencent/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "tencent",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providerCatalogEntry: "./provider-discovery.ts",
	providers: ["tencent-tokenhub", "tencent-tokenplan"],
	modelCatalog: {
		"modelsDev": {
			"tencent-tokenhub": "tencent-tokenhub",
			"tencent-tokenplan": "tencent-token-plan"
		},
		"providers": {
			"tencent-tokenhub": {
				"baseUrl": "https://tokenhub.tencentmaas.com/v1",
				"api": "openai-completions",
				"defaultModel": "hy4-preview",
				"models": [
					{
						"id": "hy3-preview",
						"name": "Hy3 preview (TokenHub)",
						"status": "deprecated",
						"replacedBy": "hy4-preview",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 256e3,
						"maxTokens": 128e3,
						"cost": {
							"input": .176,
							"output": .587,
							"cacheRead": .059,
							"cacheWrite": 0,
							"tieredPricing": [
								{
									"input": .176,
									"output": .587,
									"cacheRead": .059,
									"cacheWrite": 0,
									"range": [0, 16e3]
								},
								{
									"input": .235,
									"output": .939,
									"cacheRead": .088,
									"cacheWrite": 0,
									"range": [16e3, 32e3]
								},
								{
									"input": .293,
									"output": 1.173,
									"cacheRead": .117,
									"cacheWrite": 0,
									"range": [32e3]
								}
							]
						},
						"compat": {
							"supportsUsageInStreaming": true,
							"supportsReasoningEffort": true,
							"supportedReasoningEfforts": [
								"none",
								"low",
								"high"
							]
						}
					},
					{
						"id": "hy3",
						"name": "Hy3 (TokenHub)",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 256e3,
						"maxTokens": 128e3,
						"cost": {
							"input": .147,
							"output": .587,
							"cacheRead": .037,
							"cacheWrite": 0
						},
						"compat": {
							"supportsUsageInStreaming": true,
							"supportsReasoningEffort": true,
							"supportedReasoningEfforts": ["none", "high"]
						}
					},
					{
						"id": "hy4-preview",
						"name": "Hy4 preview (TokenHub)",
						"reasoning": true,
						"input": ["text"],
						"contextWindow": 1024e3,
						"maxTokens": 64e3,
						"cost": {
							"input": .834,
							"output": 2.501,
							"cacheRead": .042,
							"cacheWrite": 0
						},
						"compat": {
							"supportsUsageInStreaming": true,
							"supportsReasoningEffort": true,
							"supportedReasoningEfforts": ["none", "high"]
						}
					}
				]
			},
			"tencent-tokenplan": {
				"baseUrl": "https://api.lkeap.cloud.tencent.com/plan/v3",
				"api": "openai-completions",
				"defaultModel": "hy4-preview",
				"models": [{
					"id": "hy3",
					"name": "Hy3 (TokenPlan)",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 128e3,
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["none", "high"]
					}
				}, {
					"id": "hy4-preview",
					"name": "Hy4 preview (TokenPlan)",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1024e3,
					"maxTokens": 64e3,
					"cost": {
						"input": .834,
						"output": 2.501,
						"cacheRead": .042,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["none", "high"]
					}
				}]
			}
		},
		"discovery": {
			"tencent-tokenhub": "refreshable",
			"tencent-tokenplan": "refreshable"
		}
	},
	setup: { "providers": [{
		"id": "tencent-tokenhub",
		"envVars": ["TOKENHUB_API_KEY"]
	}, {
		"id": "tencent-tokenplan",
		"envVars": ["TOKENPLAN_API_KEY"]
	}] },
	configContracts: { "compatibilityMigrationPaths": [
		"models.providers.tencent-tokenhub",
		"agents.defaults.models.tencent-tokenhub/hy3",
		"agents.defaults.models.tencent-tokenhub/hy3-preview",
		"agents.defaults.models.tencent-tokenhub/hy4-preview"
	] },
	providerAuthChoices: [{
		"provider": "tencent-tokenhub",
		"method": "api-key",
		"choiceId": "tokenhub-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Tencent TokenHub",
		"groupId": "tencent",
		"groupLabel": "Tencent Cloud",
		"groupHint": "Tencent TokenHub",
		"optionKey": "tokenhubApiKey",
		"cliFlag": "--tokenhub-api-key",
		"cliOption": "--tokenhub-api-key <key>",
		"cliDescription": "Tencent TokenHub API key"
	}, {
		"provider": "tencent-tokenplan",
		"method": "api-key",
		"choiceId": "tokenplan-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Tencent TokenPlan",
		"groupId": "tencent",
		"groupLabel": "Tencent Cloud",
		"groupHint": "Tencent TokenPlan",
		"optionKey": "tokenplanApiKey",
		"cliFlag": "--tokenplan-api-key",
		"cliOption": "--tokenplan-api-key <key>",
		"cliDescription": "Tencent TokenPlan API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/tencent/models.ts
const TOKENHUB_PROVIDER_ID = "tencent-tokenhub";
const TOKENHUB_BASE_URL = openclaw_plugin_default.modelCatalog.providers[TOKENHUB_PROVIDER_ID].baseUrl;
const TOKENHUB_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers[TOKENHUB_PROVIDER_ID];
const TOKENHUB_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: TOKENHUB_PROVIDER_ID,
	catalog: TOKENHUB_MANIFEST_CATALOG
}).models.map((model) => Object.assign(model, { api: "openai-completions" }));
const TOKENPLAN_PROVIDER_ID = "tencent-tokenplan";
const TOKENPLAN_BASE_URL = openclaw_plugin_default.modelCatalog.providers[TOKENPLAN_PROVIDER_ID].baseUrl;
const TOKENPLAN_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers[TOKENPLAN_PROVIDER_ID];
const TOKENPLAN_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: TOKENPLAN_PROVIDER_ID,
	catalog: TOKENPLAN_MANIFEST_CATALOG
}).models.map((model) => Object.assign(model, { api: "openai-completions" }));
//#endregion
export { TOKENPLAN_MODEL_CATALOG as a, TOKENPLAN_BASE_URL as i, TOKENHUB_MODEL_CATALOG as n, TOKENPLAN_PROVIDER_ID as o, TOKENHUB_PROVIDER_ID as r, openclaw_plugin_default as s, TOKENHUB_BASE_URL as t };
