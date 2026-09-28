import { createUpstreamProviderCatalog, fetchLiveProviderModelIds, listProviderCatalogSnapshotEntries } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { normalizeModelCompat } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/opencode/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "opencode",
	categories: ["models"],
	activation: { "onStartup": true },
	providerCatalogEntry: "./provider-discovery.ts",
	enabledByDefault: true,
	providers: ["opencode"],
	providerEndpoints: [{
		"endpointClass": "opencode-native",
		"baseUrls": ["https://opencode.ai/zen", "https://opencode.ai/zen/v1"]
	}],
	providerRequest: { "providers": { "opencode": { "family": "opencode" } } },
	modelCatalog: {
		"providers": { "opencode": {
			"baseUrl": "https://opencode.ai/zen/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "claude-opus-5",
					"name": "Claude Opus 5",
					"api": "anthropic-messages",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 5,
						"output": 25,
						"cacheRead": .5,
						"cacheWrite": 6.25
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
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
					"id": "gpt-5.6-sol",
					"name": "GPT-5.6 Sol",
					"api": "openai-responses",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 2.5,
						"tieredPricing": [{
							"input": 2,
							"output": 10,
							"cacheRead": .2,
							"cacheWrite": 2.5,
							"range": [0, 272e3]
						}, {
							"input": 4,
							"output": 15,
							"cacheRead": .4,
							"cacheWrite": 5,
							"range": [272e3]
						}]
					},
					"contextWindow": 105e4,
					"contextTokens": 922e3,
					"maxTokens": 128e3,
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
					"id": "gpt-5-nano",
					"name": "GPT-5 Nano",
					"api": "openai-responses",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": .05,
						"output": .4,
						"cacheRead": .005,
						"cacheWrite": 0
					},
					"contextWindow": 4e5,
					"contextTokens": 272e3,
					"maxTokens": 128e3,
					"thinkingLevelMap": { "off": null },
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high"
						],
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "gemini-3.6-flash",
					"name": "Gemini 3.6 Flash",
					"api": "google-generative-ai",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 1.5,
						"output": 7.5,
						"cacheRead": .15,
						"cacheWrite": 0
					},
					"contextWindow": 1048576,
					"maxTokens": 65536,
					"compat": {
						"codeMode": "capable",
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"minimal",
							"low",
							"medium",
							"high"
						],
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "minimax-m3",
					"name": "MiniMax M3",
					"api": "openai-completions",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": .3,
						"output": 1.2,
						"cacheRead": .06,
						"cacheWrite": 0
					},
					"contextWindow": 512e3,
					"maxTokens": 128e3,
					"compat": {
						"supportsUsageInStreaming": true,
						"maxTokensField": "max_tokens",
						"supportsDeveloperRole": false,
						"supportsStrictMode": false
					}
				},
				{
					"id": "kimi-k3",
					"name": "Kimi K3",
					"api": "openai-completions",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"contextWindow": 1048576,
					"maxTokens": 131072,
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
					"id": "big-pickle",
					"name": "Big Pickle",
					"api": "openai-completions",
					"provider": "opencode",
					"baseUrl": "https://opencode.ai/zen/v1",
					"reasoning": true,
					"input": ["text"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 2e5,
					"contextTokens": 16e4,
					"maxTokens": 32e3,
					"compat": {
						"supportsUsageInStreaming": true,
						"maxTokensField": "max_tokens",
						"supportsDeveloperRole": false,
						"supportsStrictMode": false
					}
				}
			]
		} },
		"discovery": { "opencode": "runtime" }
	},
	modelPricing: { "providers": { "opencode": { "openCode": { "provider": "opencode" } } } },
	setup: { "providers": [{
		"id": "opencode",
		"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "opencode",
		"method": "api-key",
		"choiceId": "opencode-zen",
		"appGuidedSecret": true,
		"choiceLabel": "OpenCode Zen catalog",
		"groupId": "opencode",
		"groupLabel": "OpenCode",
		"groupHint": "Shared API key infrastructure for Zen + Go",
		"optionKey": "opencodeZenApiKey",
		"cliFlag": "--opencode-zen-api-key",
		"cliOption": "--opencode-zen-api-key <key>",
		"cliDescription": "OpenCode API key (Zen catalog)"
	}],
	contracts: { "mediaUnderstandingProviders": ["opencode"] },
	mediaUnderstandingProviderMetadata: { "opencode": {
		"capabilities": ["image"],
		"defaultModels": { "image": "gpt-5-nano" }
	} },
	configGroups: [{
		"id": "native-sessions",
		"title": "Native sessions",
		"order": 10,
		"properties": ["sessionCatalog"]
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": { "sessionCatalog": {
			"type": "object",
			"additionalProperties": false,
			"properties": { "enabled": {
				"type": "boolean",
				"default": true
			} }
		} }
	},
	uiHints: { "sessionCatalog.enabled": {
		"label": "OpenCode Session Catalog",
		"help": "Auto-detect OpenCode sessions on the Gateway and paired nodes, then show them in the sessions sidebar."
	} }
};
//#endregion
//#region extensions/opencode/provider-catalog.ts
const PROVIDER_ID = "opencode";
const OPENCODE_ZEN_OPENAI_BASE_URL = "https://opencode.ai/zen/v1";
const OPENCODE_ZEN_ANTHROPIC_BASE_URL = "https://opencode.ai/zen";
const OPENCODE_ZEN_MODELS_ENDPOINT = "https://opencode.ai/zen/v1/models";
const OPENCODE_UPSTREAM_CATALOG_ENDPOINT = "https://models.opencode.ai/api.json";
const OPENCODE_ZEN_MODELS_TIMEOUT_MS = 5e3;
const OPENCODE_ZEN_MODELS_CACHE_TTL_MS = 6e4;
const OPENCODE_ZEN_MANIFEST_PROVIDER = openclaw_plugin_default.modelCatalog.providers.opencode;
const OPENCODE_ZEN_SEED_CATALOG = new Map(OPENCODE_ZEN_MANIFEST_PROVIDER.models.map((row) => {
	const model = normalizeModelCompat({
		...row,
		provider: PROVIDER_ID,
		api: row.api ?? OPENCODE_ZEN_MANIFEST_PROVIDER.api,
		baseUrl: row.baseUrl ?? OPENCODE_ZEN_MANIFEST_PROVIDER.baseUrl
	});
	return [model.id, {
		model,
		..."status" in row && row.status === "deprecated" ? { status: "deprecated" } : {},
		..."replacedBy" in row && typeof row.replacedBy === "string" ? { replacedBy: row.replacedBy } : {}
	}];
}));
const opencodeZenCatalog = createUpstreamProviderCatalog({
	providerId: PROVIDER_ID,
	seed: OPENCODE_ZEN_SEED_CATALOG,
	upstreamSeed: new Map(Array.from(OPENCODE_ZEN_SEED_CATALOG, ([id, { model }]) => [id, { model }])),
	providerConfig: {
		api: "openai-completions",
		baseUrl: OPENCODE_ZEN_OPENAI_BASE_URL
	},
	metadataEndpoint: OPENCODE_UPSTREAM_CATALOG_ENDPOINT,
	modelsEndpoint: OPENCODE_ZEN_MODELS_ENDPOINT,
	anthropicBaseUrl: OPENCODE_ZEN_ANTHROPIC_BASE_URL,
	timeoutMs: OPENCODE_ZEN_MODELS_TIMEOUT_MS,
	ttlMs: OPENCODE_ZEN_MODELS_CACHE_TTL_MS,
	auditContext: "opencode-zen-model-discovery",
	isStaticEntryActive: (entry) => entry?.status !== "deprecated"
});
async function prepareOpencodeZenModel(params) {
	return (await opencodeZenCatalog.refreshMetadata(params))?.get(params.modelId.trim().toLowerCase())?.model;
}
function buildStaticOpencodeZenProviderConfig(apiKey) {
	return opencodeZenCatalog.buildStaticProvider(apiKey);
}
async function resolveOpencodeZenStarterModel(params) {
	const liveModelIds = await fetchLiveProviderModelIds({
		providerId: PROVIDER_ID,
		endpoint: OPENCODE_ZEN_MODELS_ENDPOINT,
		discoveryApiKey: params.apiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		timeoutMs: OPENCODE_ZEN_MODELS_TIMEOUT_MS,
		auditContext: "opencode-zen-onboarding-model-discovery"
	});
	const preferredModelId = params.preferredModelRef.replace(`${PROVIDER_ID}/`, "");
	return liveModelIds.includes(preferredModelId) ? params.preferredModelRef : void 0;
}
async function buildOpencodeZenLiveProviderConfig(params = {}) {
	return await opencodeZenCatalog.buildLiveProvider(params);
}
function listOpencodeZenModelCatalogEntries() {
	return listProviderCatalogSnapshotEntries(opencodeZenCatalog.getSnapshot());
}
function resolveOpencodeZenModel(modelId) {
	return opencodeZenCatalog.getSnapshot().get(modelId.trim().toLowerCase())?.model;
}
function normalizeBaseUrl(baseUrl) {
	return (baseUrl ?? "").trim().replace(/\/+$/, "");
}
function normalizeOpencodeZenBaseUrl(params) {
	const normalized = normalizeBaseUrl(params.baseUrl);
	if (!normalized) return;
	const isAnthropicRoute = params.api === "anthropic-messages";
	if (normalized === OPENCODE_ZEN_ANTHROPIC_BASE_URL) return isAnthropicRoute ? OPENCODE_ZEN_ANTHROPIC_BASE_URL : OPENCODE_ZEN_OPENAI_BASE_URL;
	if (normalized === OPENCODE_ZEN_OPENAI_BASE_URL) return isAnthropicRoute ? OPENCODE_ZEN_ANTHROPIC_BASE_URL : OPENCODE_ZEN_OPENAI_BASE_URL;
}
//#endregion
export { prepareOpencodeZenModel as a, openclaw_plugin_default as c, normalizeOpencodeZenBaseUrl as i, buildStaticOpencodeZenProviderConfig as n, resolveOpencodeZenModel as o, listOpencodeZenModelCatalogEntries as r, resolveOpencodeZenStarterModel as s, buildOpencodeZenLiveProviderConfig as t };
