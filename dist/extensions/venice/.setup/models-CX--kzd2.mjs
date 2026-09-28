import { parseVeniceModelPricing } from "../pricing-api.js";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/venice/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "venice",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["venice"],
	contracts: { "usageProviders": ["venice"] },
	modelPricing: { "providers": { "venice": { "venice": { "provider": "venice" } } } },
	providerAuthChoices: [{
		"provider": "venice",
		"method": "api-key",
		"choiceId": "venice-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Venice AI API key",
		"groupId": "venice",
		"groupLabel": "Venice AI",
		"groupHint": "Privacy-focused (uncensored models)",
		"optionKey": "veniceApiKey",
		"cliFlag": "--venice-api-key",
		"cliOption": "--venice-api-key <key>",
		"cliDescription": "Venice API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	setup: { "providers": [{
		"id": "venice",
		"authMethods": ["api-key"],
		"envVars": ["VENICE_API_KEY"]
	}] },
	modelCatalog: {
		"modelsDev": { "venice": "venice" },
		"providers": { "venice": {
			"baseUrl": "https://api.venice.ai/api/v1",
			"api": "openai-completions",
			"defaultModel": "zai-org-glm-4.7",
			"models": [
				{
					"id": "zai-org-glm-5-2",
					"name": "GLM 5.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"cost": {
						"input": 1.4,
						"output": 4.4,
						"cacheRead": .26,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "zai-org-glm-4.7",
					"name": "GLM 4.7",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 198e3,
					"maxTokens": 16384,
					"cost": {
						"input": .55,
						"output": 2.65,
						"cacheRead": .11,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "venice-uncensored-1-2",
					"name": "Venice Uncensored 1.2",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 128e3,
					"maxTokens": 8192,
					"cost": {
						"input": .2,
						"output": .9,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "google-gemma-4-31b-it",
					"name": "Google Gemma 4 31B Instruct",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 256e3,
					"maxTokens": 8192,
					"cost": {
						"input": .12,
						"output": .36,
						"cacheRead": .09,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "kimi-k2-6",
					"name": "Kimi K2.6",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 256e3,
					"maxTokens": 65536,
					"cost": {
						"input": .75,
						"output": 3.5,
						"cacheRead": .16,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "deepseek-v3.2",
					"name": "DeepSeek V3.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 16e4,
					"maxTokens": 32768,
					"cost": {
						"input": .33,
						"output": .48,
						"cacheRead": .16,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "qwen3-235b-a22b-thinking-2507",
					"name": "Qwen3 235B Thinking",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 128e3,
					"maxTokens": 16384,
					"cost": {
						"input": .45,
						"output": 3.5,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "qwen3-coder-480b-a35b-instruct-turbo",
					"name": "Qwen3 Coder 480B Turbo",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 65536,
					"cost": {
						"input": .35,
						"output": 1.5,
						"cacheRead": .04,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "qwen3-vl-235b-a22b",
					"name": "Qwen3 VL 235B (Vision)",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 128e3,
					"maxTokens": 16384,
					"cost": {
						"input": .21,
						"output": 1.9,
						"cacheRead": .1,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "grok-4-5",
					"name": "Grok 4.5",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 5e5,
					"maxTokens": 32e3,
					"cost": {
						"input": 2.27,
						"output": 6.8,
						"cacheRead": .34,
						"cacheWrite": 0,
						"tieredPricing": [{
							"input": 2.27,
							"output": 6.8,
							"cacheRead": .34,
							"cacheWrite": 0,
							"range": [0, 200001]
						}, {
							"input": 4.53,
							"output": 13.6,
							"cacheRead": .68,
							"cacheWrite": 0,
							"range": [200001]
						}]
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "qwen-3-7-max",
					"name": "Qwen 3.7 Max (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536,
					"cost": {
						"input": 2.7,
						"output": 8.05,
						"cacheRead": .27,
						"cacheWrite": 3.35
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "qwen-3-7-plus",
					"name": "Qwen 3.7 Plus (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536,
					"cost": {
						"input": .5,
						"output": 2,
						"cacheRead": .05,
						"cacheWrite": .625,
						"tieredPricing": [{
							"input": .5,
							"output": 2,
							"cacheRead": .05,
							"cacheWrite": .625,
							"range": [0, 256001]
						}, {
							"input": 1.5,
							"output": 6,
							"cacheRead": .15,
							"cacheWrite": 1.875,
							"range": [256001]
						}]
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "claude-fable-5",
					"name": "Claude Fable 5 (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"cost": {
						"input": 12,
						"output": 60,
						"cacheRead": 1.2,
						"cacheWrite": 15
					},
					"compat": {
						"supportsUsageInStreaming": false,
						"codeMode": "capable"
					}
				},
				{
					"id": "claude-opus-5",
					"name": "Claude Opus 5 (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"cost": {
						"input": 6,
						"output": 30,
						"cacheRead": .6,
						"cacheWrite": 7.5
					},
					"compat": {
						"supportsUsageInStreaming": false,
						"codeMode": "capable"
					}
				},
				{
					"id": "claude-sonnet-4-6",
					"name": "Claude Sonnet 4.6 (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 64e3,
					"cost": {
						"input": 3.6,
						"output": 18,
						"cacheRead": .36,
						"cacheWrite": 4.5
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "openai-gpt-56-sol",
					"name": "GPT-5.6 Sol (via Venice)",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"cost": {
						"input": 6.25,
						"output": 37.5,
						"cacheRead": .625,
						"cacheWrite": 7.8125
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "zai-org-glm-4.6",
					"name": "GLM 4.6",
					"status": "deprecated",
					"replacedBy": "zai-org-glm-4.7",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 198e3,
					"maxTokens": 16384,
					"cost": {
						"input": .43,
						"output": 1.75,
						"cacheRead": .08,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "google-gemma-3-27b-it",
					"name": "Google Gemma 3 27B Instruct",
					"status": "deprecated",
					"replacedBy": "google-gemma-4-31b-it",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 198e3,
					"maxTokens": 16384,
					"cost": {
						"input": .12,
						"output": .2,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				},
				{
					"id": "kimi-k2-5",
					"name": "Kimi K2.5",
					"status": "deprecated",
					"replacedBy": "kimi-k2-6",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 256e3,
					"maxTokens": 65536,
					"cost": {
						"input": .56,
						"output": 3.5,
						"cacheRead": .22,
						"cacheWrite": 0
					},
					"compat": { "supportsUsageInStreaming": false }
				}
			]
		} },
		"discovery": { "venice": "refreshable" }
	}
};
//#endregion
//#region extensions/venice/models.ts
const VENICE_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.venice;
const VENICE_BASE_URL = VENICE_MANIFEST_CATALOG.baseUrl;
const VENICE_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "venice");
const VENICE_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const VENICE_DEFAULT_CONTEXT_WINDOW = 128e3;
const VENICE_DEFAULT_MAX_TOKENS = 4096;
const VENICE_DISCOVERY_HARD_MAX_TOKENS = 131072;
const VENICE_DISCOVERY_TIMEOUT_MS = 1e4;
const VENICE_DISCOVERY_CACHE_TTL_MS = 6e4;
function decorateVeniceModelDefinition(entry) {
	return {
		...entry,
		compat: {
			supportsUsageInStreaming: false,
			...entry.compat
		}
	};
}
/** Venice's decorated network-free fallback catalog. */
const VENICE_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "venice",
	catalog: VENICE_MANIFEST_CATALOG
}).models.map(decorateVeniceModelDefinition);
function normalizePositiveInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveApiMaxCompletionTokens(params) {
	const raw = normalizePositiveInt(params.apiModel.model_spec?.maxCompletionTokens);
	if (!raw) return;
	const contextWindow = normalizePositiveInt(params.apiModel.model_spec?.availableContextTokens);
	const knownMaxTokens = typeof params.knownMaxTokens === "number" && Number.isFinite(params.knownMaxTokens) ? Math.floor(params.knownMaxTokens) : void 0;
	return Math.min(raw, contextWindow ?? knownMaxTokens ?? VENICE_DEFAULT_CONTEXT_WINDOW, knownMaxTokens ?? VENICE_DISCOVERY_HARD_MAX_TOKENS);
}
function resolveApiSupportsTools(apiModel) {
	const supportsFunctionCalling = apiModel.model_spec?.capabilities?.supportsFunctionCalling;
	return typeof supportsFunctionCalling === "boolean" ? supportsFunctionCalling : void 0;
}
function projectVeniceModels(rows, fallback) {
	const catalogById = new Map(fallback.models.map((model) => [model.id, model]));
	const models = [];
	for (const row of rows) {
		if (!row || typeof row !== "object" || Array.isArray(row)) continue;
		const apiModel = row;
		if (typeof apiModel.id !== "string" || !apiModel.id.trim()) continue;
		const catalogEntry = catalogById.get(apiModel.id);
		const liveCost = parseVeniceModelPricing(apiModel.model_spec?.pricing);
		const apiMaxTokens = resolveApiMaxCompletionTokens({
			apiModel,
			knownMaxTokens: catalogEntry?.maxTokens
		});
		const apiSupportsTools = resolveApiSupportsTools(apiModel);
		if (catalogEntry) {
			const definition = {
				...catalogEntry,
				input: [...catalogEntry.input],
				cost: liveCost ?? { ...catalogEntry.cost },
				...catalogEntry.compat ? { compat: { ...catalogEntry.compat } } : {}
			};
			if (apiMaxTokens !== void 0) definition.maxTokens = apiMaxTokens;
			if (apiSupportsTools === false) definition.compat = {
				...definition.compat,
				supportsTools: false
			};
			models.push(definition);
		} else {
			const apiSpec = apiModel.model_spec;
			const lowerModelId = normalizeLowercaseStringOrEmpty(apiModel.id);
			const isReasoning = apiSpec?.capabilities?.supportsReasoning || lowerModelId.includes("thinking") || lowerModelId.includes("reason") || lowerModelId.includes("r1");
			const hasVision = apiSpec?.capabilities?.supportsVision === true;
			models.push({
				id: apiModel.id,
				name: apiSpec?.name || apiModel.id,
				reasoning: isReasoning,
				input: hasVision ? ["text", "image"] : ["text"],
				cost: liveCost ?? VENICE_DEFAULT_COST,
				contextWindow: normalizePositiveInt(apiSpec?.availableContextTokens) ?? VENICE_DEFAULT_CONTEXT_WINDOW,
				maxTokens: apiMaxTokens ?? VENICE_DEFAULT_MAX_TOKENS,
				compat: {
					supportsUsageInStreaming: false,
					...apiSupportsTools === false ? { supportsTools: false } : {}
				}
			});
		}
	}
	return models;
}
const VENICE_MODEL_DISCOVERY_OPTIONS = {
	timeoutMs: VENICE_DISCOVERY_TIMEOUT_MS,
	ttlMs: VENICE_DISCOVERY_CACHE_TTL_MS,
	authentication: "none",
	projectRows: projectVeniceModels
};
//#endregion
export { openclaw_plugin_default as a, VENICE_MODEL_DISCOVERY_OPTIONS as i, VENICE_DEFAULT_MODEL_REF as n, VENICE_MODEL_CATALOG as r, VENICE_BASE_URL as t };
