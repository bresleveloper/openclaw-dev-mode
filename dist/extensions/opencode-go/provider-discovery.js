import { createUpstreamProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { normalizeModelCompat } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/opencode-go/openclaw.plugin.json
var modelCatalog = {
	"providers": { "opencode-go": {
		"baseUrl": "https://opencode.ai/zen/go/v1",
		"api": "openai-completions",
		"models": [
			{
				"id": "deepseek-v4-pro",
				"name": "DeepSeek V4 Pro",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1e6,
				"maxTokens": 384e3,
				"cost": {
					"input": .435,
					"output": .87,
					"cacheRead": .003625,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": ["high", "max"],
					"maxTokensField": "max_tokens",
					"supportsDeveloperRole": false,
					"supportsStrictMode": false,
					"codeMode": "capable"
				}
			},
			{
				"id": "deepseek-v4-flash",
				"name": "DeepSeek V4 Flash",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1e6,
				"maxTokens": 384e3,
				"cost": {
					"input": .14,
					"output": .28,
					"cacheRead": .0028,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"high",
						"max"
					],
					"maxTokensField": "max_tokens",
					"supportsDeveloperRole": false,
					"supportsStrictMode": false,
					"codeMode": "capable"
				}
			},
			{
				"id": "kimi-k3",
				"name": "Kimi K3",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 131072,
				"cost": {
					"input": 3,
					"output": 15,
					"cacheRead": .3,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": ["max"],
					"maxTokensField": "max_tokens",
					"supportsDeveloperRole": false,
					"supportsStrictMode": false,
					"codeMode": "capable"
				}
			},
			{
				"id": "kimi-k2.6",
				"name": "Kimi K2.6",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 65536,
				"cost": {
					"input": .95,
					"output": 4,
					"cacheRead": .16,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsDeveloperRole": false,
					"supportsStrictMode": false
				}
			},
			{
				"id": "gpt-5.6-luna",
				"name": "GPT-5.6 Luna",
				"api": "openai-responses",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 922e3,
				"maxTokens": 128e3,
				"cost": {
					"input": .2,
					"output": 1.2,
					"cacheRead": .02,
					"cacheWrite": .25,
					"tieredPricing": [{
						"input": .2,
						"output": 1.2,
						"cacheRead": .02,
						"cacheWrite": .25,
						"range": [0, 272e3]
					}, {
						"input": .4,
						"output": 1.8,
						"cacheRead": .04,
						"cacheWrite": .5,
						"range": [272e3]
					}]
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"maxTokensField": "max_tokens",
					"codeMode": "capable"
				}
			},
			{
				"id": "qwen3.8-max",
				"name": "Qwen3.8 Max",
				"api": "anthropic-messages",
				"baseUrl": "https://opencode.ai/zen/go",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 131072,
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .25,
					"cacheWrite": 2.5
				},
				"compat": {
					"thinkingFormat": "qwen",
					"codeMode": "capable"
				}
			},
			{
				"id": "hy3-preview",
				"name": "HY3 Preview",
				"status": "preview",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 262144,
				"maxTokens": 32768,
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"supportsDeveloperRole": false,
					"supportsStrictMode": false
				}
			}
		]
	} },
	"discovery": { "opencode-go": "runtime" }
};
//#endregion
//#region extensions/opencode-go/provider-catalog.ts
const PROVIDER_ID = "opencode-go";
const OPENCODE_GO_OPENAI_BASE_URL = "https://opencode.ai/zen/go/v1";
const OPENCODE_GO_ANTHROPIC_BASE_URL = "https://opencode.ai/zen/go";
const OPENCODE_GO_MODELS_ENDPOINT = "https://opencode.ai/zen/go/v1/models";
const OPENCODE_UPSTREAM_CATALOG_ENDPOINT = "https://models.opencode.ai/api.json";
const OPENCODE_GO_MODELS_TIMEOUT_MS = 5e3;
const OPENCODE_GO_MODELS_CACHE_TTL_MS = 6e4;
const OPENCODE_GO_MANIFEST_PROVIDER = modelCatalog.providers[PROVIDER_ID];
const OPENCODE_GO_SEED_CATALOG = new Map(OPENCODE_GO_MANIFEST_PROVIDER.models.map((row) => {
	const hydrated = {
		...row,
		provider: PROVIDER_ID,
		api: "api" in row ? row.api : OPENCODE_GO_MANIFEST_PROVIDER.api,
		baseUrl: "baseUrl" in row ? row.baseUrl : OPENCODE_GO_MANIFEST_PROVIDER.baseUrl
	};
	const model = normalizeModelCompat(hydrated);
	return [model.id.toLowerCase(), {
		model,
		..."status" in row && (row.status === "deprecated" || row.status === "preview") ? { status: row.status } : {}
	}];
}));
const opencodeGoCatalog = createUpstreamProviderCatalog({
	providerId: PROVIDER_ID,
	seed: OPENCODE_GO_SEED_CATALOG,
	providerConfig: {
		api: "openai-completions",
		baseUrl: OPENCODE_GO_OPENAI_BASE_URL
	},
	metadataEndpoint: OPENCODE_UPSTREAM_CATALOG_ENDPOINT,
	modelsEndpoint: OPENCODE_GO_MODELS_ENDPOINT,
	anthropicBaseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
	timeoutMs: OPENCODE_GO_MODELS_TIMEOUT_MS,
	ttlMs: OPENCODE_GO_MODELS_CACHE_TTL_MS,
	auditContext: "opencode-go-model-discovery",
	isStaticEntryActive: (entry) => !entry?.status,
	decorateModel: (model) => model.api === "anthropic-messages" && model.id.startsWith("qwen") ? {
		...model,
		compat: {
			...model.compat,
			thinkingFormat: "qwen"
		}
	} : model
});
function buildStaticOpencodeGoProviderConfig(apiKey) {
	return opencodeGoCatalog.buildStaticProvider(apiKey);
}
//#endregion
//#region extensions/opencode-go/provider-discovery.ts
const opencodeGoProviderDiscovery = {
	id: "opencode-go",
	label: "OpenCode Go",
	docsPath: "/providers/models",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildStaticOpencodeGoProviderConfig() })
	}
};
//#endregion
export { opencodeGoProviderDiscovery as default };
