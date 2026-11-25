import { buildManifestProviderCatalogFamily } from "openclaw/plugin-sdk/provider-catalog-shared";
// extensions/tencent/openclaw.plugin.json
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
				"family": "tencent",
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
						"id": "hy4",
						"name": "Hy4 (TokenHub)",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 1024e3,
						"contextTokens": 96e4,
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
							"supportedReasoningEfforts": ["none", "high"],
							"defaultThinkingLevel": "high"
						}
					},
					{
						"id": "hy4-flash",
						"name": "Hy4 flash (TokenHub)",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 1048576,
						"contextTokens": 983040,
						"maxTokens": 65536,
						"cost": {
							"input": .07,
							"output": .281,
							"cacheRead": .003,
							"cacheWrite": 0
						},
						"compat": {
							"supportsUsageInStreaming": true,
							"supportsReasoningEffort": true,
							"supportedReasoningEfforts": ["none", "high"],
							"defaultThinkingLevel": "high"
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
				"family": "tencent",
				"models": [
					{
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
					},
					{
						"id": "hy4",
						"name": "Hy4 (TokenPlan)",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 1024e3,
						"contextTokens": 96e4,
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
							"supportedReasoningEfforts": ["none", "high"],
							"defaultThinkingLevel": "high"
						}
					},
					{
						"id": "hy4-flash",
						"name": "Hy4 flash (TokenPlan)",
						"reasoning": true,
						"input": ["text", "image"],
						"contextWindow": 1048576,
						"contextTokens": 983040,
						"maxTokens": 65536,
						"cost": {
							"input": .07,
							"output": .281,
							"cacheRead": .003,
							"cacheWrite": 0
						},
						"compat": {
							"supportsUsageInStreaming": true,
							"supportsReasoningEffort": true,
							"supportedReasoningEfforts": ["none", "high"],
							"defaultThinkingLevel": "high"
						}
					},
					{
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
					}
				]
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
// extensions/tencent/models.ts
const TOKENHUB_PROVIDER_ID = "tencent-tokenhub";
const TOKENPLAN_PROVIDER_ID = "tencent-tokenplan";
const TENCENT_PROVIDER_CATALOG = buildManifestProviderCatalogFamily({
	docsPath: "/providers/tencent",
	surfaces: [{
		id: TOKENHUB_PROVIDER_ID,
		label: "Tencent TokenHub"
	}, {
		id: TOKENPLAN_PROVIDER_ID,
		label: "Tencent TokenPlan"
	}].map(({ id, label }) => {
		const catalog = openclaw_plugin_default.modelCatalog.providers[id];
		return {
			id,
			label,
			catalog: {
				...catalog,
				models: catalog.models.map((model) => Object.assign({}, model, { api: "openai-completions" }))
			}
		};
	})
});
const TOKENHUB_PROVIDER = TENCENT_PROVIDER_CATALOG.entries[0];
const TOKENPLAN_PROVIDER = TENCENT_PROVIDER_CATALOG.entries[1];
const TOKENHUB_BASE_URL = TOKENHUB_PROVIDER.baseUrl;
const TOKENPLAN_BASE_URL = TOKENPLAN_PROVIDER.baseUrl;
const TOKENHUB_MODEL_CATALOG = TOKENHUB_PROVIDER.models;
const TOKENPLAN_MODEL_CATALOG = TOKENPLAN_PROVIDER.models;
const buildTokenHubProvider = TOKENHUB_PROVIDER.buildProvider;
const buildTokenPlanProvider = TOKENPLAN_PROVIDER.buildProvider;
export { TOKENPLAN_BASE_URL as a, buildTokenHubProvider as c, TOKENHUB_PROVIDER_ID as i, buildTokenPlanProvider as l, TOKENHUB_BASE_URL as n, TOKENPLAN_MODEL_CATALOG as o, TOKENHUB_MODEL_CATALOG as r, TOKENPLAN_PROVIDER_ID as s, TENCENT_PROVIDER_CATALOG as t, openclaw_plugin_default as u };
