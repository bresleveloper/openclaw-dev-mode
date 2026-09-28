import { i as normalizeModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import { o as createUpstreamProviderCatalog, s as listProviderCatalogSnapshotEntries, u as fetchLiveProviderModelIds } from "./provider-catalog-live-runtime-BAhXMc_e.mjs";
//#region extensions/opencode-go/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "opencode-go",
	categories: ["models"],
	activation: { "onStartup": false },
	providerCatalogEntry: "./provider-discovery.ts",
	enabledByDefault: true,
	providers: ["opencode-go"],
	providerEndpoints: [{
		"endpointClass": "opencode-go-native",
		"baseUrls": ["https://opencode.ai/zen/go", "https://opencode.ai/zen/go/v1"]
	}],
	providerRequest: { "providers": { "opencode-go": { "family": "opencode" } } },
	modelCatalog: {
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
	},
	setup: { "providers": [{
		"id": "opencode-go",
		"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "opencode-go",
		"method": "api-key",
		"choiceId": "opencode-go",
		"appGuidedSecret": true,
		"choiceLabel": "OpenCode Go catalog",
		"groupId": "opencode",
		"groupLabel": "OpenCode",
		"groupHint": "Shared API key infrastructure for Zen + Go",
		"optionKey": "opencodeGoApiKey",
		"cliFlag": "--opencode-go-api-key",
		"cliOption": "--opencode-go-api-key <key>",
		"cliDescription": "OpenCode API key (Go catalog)"
	}],
	contracts: { "mediaUnderstandingProviders": ["opencode-go"] },
	mediaUnderstandingProviderMetadata: { "opencode-go": {
		"capabilities": ["image"],
		"defaultModels": { "image": "kimi-k2.6" }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/opencode-go/provider-catalog.ts
const PROVIDER_ID = "opencode-go";
const OPENCODE_GO_OPENAI_BASE_URL = "https://opencode.ai/zen/go/v1";
const OPENCODE_GO_ANTHROPIC_BASE_URL = "https://opencode.ai/zen/go";
const OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code"
]);
const OPENCODE_GO_MODELS_ENDPOINT = "https://opencode.ai/zen/go/v1/models";
const OPENCODE_UPSTREAM_CATALOG_ENDPOINT = "https://models.opencode.ai/api.json";
const OPENCODE_GO_MODELS_TIMEOUT_MS = 5e3;
const OPENCODE_GO_MODELS_CACHE_TTL_MS = 6e4;
const OPENCODE_GO_MANIFEST_PROVIDER = openclaw_plugin_default.modelCatalog.providers[PROVIDER_ID];
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
async function resolveOpencodeGoStarterModel(params) {
	const liveModelIds = await fetchLiveProviderModelIds({
		providerId: PROVIDER_ID,
		endpoint: OPENCODE_GO_MODELS_ENDPOINT,
		discoveryApiKey: params.apiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		timeoutMs: OPENCODE_GO_MODELS_TIMEOUT_MS,
		auditContext: "opencode-go-onboarding-model-discovery"
	});
	const preferredModelId = params.preferredModelRef.replace(`${PROVIDER_ID}/`, "");
	return liveModelIds.includes(preferredModelId) ? params.preferredModelRef : void 0;
}
async function buildOpencodeGoLiveProviderConfig(params = {}) {
	return await opencodeGoCatalog.buildLiveProvider(params);
}
function listOpencodeGoModelCatalogEntries() {
	return listProviderCatalogSnapshotEntries(opencodeGoCatalog.getSnapshot());
}
function resolveOpencodeGoModel(modelId) {
	return OPENCODE_GO_SEED_CATALOG.get(modelId.trim().toLowerCase())?.model;
}
function isOpencodeGoKimiNoReasoningModelId(modelId) {
	return typeof modelId === "string" && OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function normalizeOpencodeGoResolvedModel(model) {
	if (!isOpencodeGoKimiNoReasoningModelId(model.id)) return;
	const compat = model.compat && typeof model.compat === "object" && !Array.isArray(model.compat) ? model.compat : void 0;
	if (!model.reasoning && !compat?.supportsReasoningEffort) return;
	return {
		...model,
		reasoning: false,
		compat: {
			...compat,
			supportsReasoningEffort: false
		}
	};
}
function normalizeBaseUrl(baseUrl) {
	return (baseUrl ?? "").trim().replace(/\/+$/, "");
}
function normalizeOpencodeGoBaseUrl(params) {
	const normalized = normalizeBaseUrl(params.baseUrl);
	if (!normalized) return;
	if (normalized === OPENCODE_GO_OPENAI_BASE_URL) return OPENCODE_GO_OPENAI_BASE_URL;
	if (normalized === OPENCODE_GO_ANTHROPIC_BASE_URL) return OPENCODE_GO_ANTHROPIC_BASE_URL;
	if (normalized === "https://opencode.ai/go") return OPENCODE_GO_ANTHROPIC_BASE_URL;
	if (normalized === "https://opencode.ai/go/v1") return params.api === "anthropic-messages" ? OPENCODE_GO_ANTHROPIC_BASE_URL : OPENCODE_GO_OPENAI_BASE_URL;
}
//#endregion
export { normalizeOpencodeGoBaseUrl as a, resolveOpencodeGoStarterModel as c, listOpencodeGoModelCatalogEntries as i, openclaw_plugin_default as l, buildStaticOpencodeGoProviderConfig as n, normalizeOpencodeGoResolvedModel as o, isOpencodeGoKimiNoReasoningModelId as r, resolveOpencodeGoModel as s, buildOpencodeGoLiveProviderConfig as t };
