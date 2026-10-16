import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { asNonArrayRecord, asOptionalRecord, asPositiveSafeInteger, filterStringEntries, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/baseten/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "baseten",
	categories: ["models"],
	name: "Baseten",
	description: "OpenClaw Baseten provider plugin.",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["baseten"],
	providerRequest: { "providers": { "baseten": {
		"family": "baseten",
		"openAICompletions": { "supportsStreamingUsage": true }
	} } },
	modelCatalog: {
		"modelsDev": { "baseten": "baseten" },
		"providers": { "baseten": {
			"baseUrl": "https://inference.baseten.co/v1",
			"api": "openai-completions",
			"defaultModel": "deepseek-ai/DeepSeek-V4.1-Flash",
			"models": [
				{
					"id": "deepseek-ai/DeepSeek-V4.1-Flash",
					"name": "DeepSeek V4.1 Flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 262144,
					"cost": {
						"input": .3,
						"output": 1.2,
						"cacheRead": .007,
						"cacheWrite": 0
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"low",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"adaptive": "max"
						}
					}
				},
				{
					"id": "deepseek-ai/DeepSeek-V4-Pro-0813",
					"name": "DeepSeek V4 Pro 0813",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 262144,
					"cost": {
						"input": 1.32,
						"output": 3.96,
						"cacheRead": .132,
						"cacheWrite": 0
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"low",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"adaptive": "max"
						}
					}
				},
				{
					"id": "zai-org/GLM-5.2",
					"name": "GLM 5.2",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048e3,
					"maxTokens": 262e3,
					"cost": {
						"input": 1.4,
						"output": 4.4,
						"cacheRead": .14,
						"cacheWrite": 0
					},
					"compat": {
						"codeMode": "capable",
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"minimal": "high",
							"low": "high",
							"medium": "high",
							"xhigh": "high",
							"adaptive": "max"
						}
					}
				},
				{
					"id": "zai-org/GLM-5.2-Fast",
					"name": "GLM 5.2 Fast",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048e3,
					"maxTokens": 262e3,
					"cost": {
						"input": 2.1,
						"output": 6.6,
						"cacheRead": .21,
						"cacheWrite": 0
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"high",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"minimal": "high",
							"low": "high",
							"medium": "high",
							"xhigh": "high",
							"adaptive": "max"
						}
					}
				},
				{
					"id": "nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B",
					"name": "Nemotron Ultra",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 202e3,
					"maxTokens": 202e3,
					"cost": {
						"input": .6,
						"output": 2.4,
						"cacheRead": .12,
						"cacheWrite": 0
					}
				},
				{
					"id": "openai/gpt-oss-120b",
					"name": "GPT OSS 120B",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 128e3,
					"maxTokens": 128e3,
					"cost": {
						"input": .1,
						"output": .5,
						"cacheRead": .1,
						"cacheWrite": 0
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"minimal",
							"low",
							"medium",
							"high",
							"xhigh",
							"max"
						],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"adaptive": "max"
						}
					}
				}
			]
		} },
		"discovery": { "baseten": "refreshable" }
	},
	setup: { "providers": [{
		"id": "baseten",
		"envVars": ["BASETEN_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "baseten",
		"method": "api-key",
		"choiceId": "baseten-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Baseten API key",
		"groupId": "baseten",
		"groupLabel": "Baseten",
		"groupHint": "Hosted Model APIs",
		"optionKey": "basetenApiKey",
		"cliFlag": "--baseten-api-key",
		"cliOption": "--baseten-api-key <key>",
		"cliDescription": "Baseten API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/baseten/models.ts
const BASETEN_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.baseten;
const BASETEN_MODEL_COMPAT = new Map(buildManifestModelProviderConfig({
	providerId: "baseten",
	catalog: BASETEN_MANIFEST_CATALOG
}).models.map(({ id, compat }) => [id, compat]));
const DEFAULT_CONTEXT_WINDOW = 128e3;
const DEFAULT_MAX_TOKENS = 8192;
const CHAT_TEMPLATE_THINKING_MODEL_IDS = /* @__PURE__ */ new Set([
	"zai-org/glm-4.7",
	"zai-org/glm-5.2",
	"zai-org/glm-5.2-fast",
	"moonshotai/kimi-k2.6",
	"moonshotai/kimi-k2.7-code",
	"nvidia/nvidia-nemotron-3-ultra-550b-a55b"
]);
const BASE_COMPAT = {
	supportsStore: false,
	supportsDeveloperRole: false,
	supportsUsageInStreaming: true,
	supportsStrictMode: true,
	supportsTools: true,
	maxTokensField: "max_tokens"
};
const BASETEN_BASE_URL = BASETEN_MANIFEST_CATALOG.baseUrl;
const BASETEN_DEFAULT_MODEL_ID = BASETEN_MANIFEST_CATALOG.defaultModel;
const BASETEN_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "baseten");
const BASETEN_MODEL_CATALOG = BASETEN_MANIFEST_CATALOG.models;
function usesBasetenChatTemplateThinking(modelId) {
	return CHAT_TEMPLATE_THINKING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function buildBasetenModelCompat(modelId) {
	return {
		...BASE_COMPAT,
		...structuredClone(BASETEN_MODEL_COMPAT.get(modelId))
	};
}
function buildStaticBasetenModels() {
	return buildManifestModelProviderConfig({
		providerId: "baseten",
		catalog: BASETEN_MANIFEST_CATALOG
	}).models.map((model) => Object.assign(model, { compat: buildBasetenModelCompat(model.id) }));
}
function readPerTokenPrice(value) {
	if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return;
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) && number >= 0 ? Number((number * 1e6).toFixed(9)) : void 0;
}
function applyLiveReasoningEffortCompat(fallbackCompat, supportsReasoningEffort) {
	if (supportsReasoningEffort) return {
		...fallbackCompat,
		supportsReasoningEffort: true
	};
	const compat = { ...fallbackCompat };
	delete compat.supportsReasoningEffort;
	delete compat.supportedReasoningEfforts;
	delete compat.reasoningEffortMap;
	return compat;
}
function projectLiveModel(row, fallback) {
	if (row.object !== void 0 && row.object !== "model") return;
	const id = normalizeOptionalString(row.id);
	if (!id) return;
	const hasLiveFeatures = Array.isArray(row.supported_features);
	const features = new Set(filterStringEntries(row.supported_features));
	const pricing = asNonArrayRecord(row.pricing);
	const inputPrice = readPerTokenPrice(pricing.prompt);
	const outputPrice = readPerTokenPrice(pricing.completion);
	const cacheReadPrice = readPerTokenPrice(pricing.input_cache_read);
	const hasDocumentedSparseFeatures = ["deepseek-ai/DeepSeek-V4.1-Flash", "deepseek-ai/DeepSeek-V4-Pro-0813"].includes(id) && [
		"tools",
		"reasoning",
		"json_mode",
		"structured_outputs"
	].every((feature) => features.has(feature));
	const fallbackCompat = fallback?.compat ?? buildBasetenModelCompat(id);
	const supportsReasoningEffort = features.has("reasoning_effort") || hasDocumentedSparseFeatures && fallbackCompat.supportsReasoningEffort === true;
	const compat = hasLiveFeatures ? applyLiveReasoningEffortCompat(fallbackCompat, supportsReasoningEffort) : fallbackCompat;
	return {
		id,
		name: normalizeOptionalString(row.name) ?? fallback?.name ?? id,
		reasoning: hasLiveFeatures ? features.has("reasoning") || supportsReasoningEffort : fallback?.reasoning ?? false,
		input: hasLiveFeatures ? features.has("vision") || hasDocumentedSparseFeatures && fallback?.input.includes("image") ? ["text", "image"] : ["text"] : fallback?.input ?? ["text"],
		cost: {
			input: inputPrice ?? fallback?.cost.input ?? 0,
			output: outputPrice ?? fallback?.cost.output ?? 0,
			cacheRead: cacheReadPrice ?? fallback?.cost.cacheRead ?? 0,
			cacheWrite: fallback?.cost.cacheWrite ?? 0
		},
		contextWindow: asPositiveSafeInteger(Number(row.context_length)) ?? fallback?.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
		maxTokens: asPositiveSafeInteger(Number(row.max_completion_tokens)) ?? fallback?.maxTokens ?? DEFAULT_MAX_TOKENS,
		compat
	};
}
/** Projects Baseten's authenticated `/models` response into OpenClaw model rows. */
function projectBasetenLiveModels(rows) {
	const fallbacks = new Map(buildStaticBasetenModels().map((model) => [model.id, model]));
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const value of rows) {
		const row = asOptionalRecord(value);
		if (!row) continue;
		const model = projectLiveModel(row, fallbacks.get(String(row.id)));
		if (!model || seen.has(model.id)) continue;
		seen.add(model.id);
		models.push(model);
	}
	return models;
}
/** Resolves a forward-compatible Baseten model id not yet in the bundled catalog. */
function resolveBasetenDynamicModel(modelId) {
	const id = modelId.trim();
	if (!id || BASETEN_MODEL_CATALOG.some((model) => model.id === id)) return;
	return {
		id,
		name: id,
		provider: "baseten",
		api: "openai-completions",
		baseUrl: BASETEN_BASE_URL,
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_WINDOW,
		maxTokens: DEFAULT_MAX_TOKENS,
		compat: buildBasetenModelCompat(id)
	};
}
//#endregion
export { buildBasetenModelCompat as a, resolveBasetenDynamicModel as c, BASETEN_MODEL_CATALOG as i, usesBasetenChatTemplateThinking as l, BASETEN_DEFAULT_MODEL_ID as n, buildStaticBasetenModels as o, BASETEN_DEFAULT_MODEL_REF as r, projectBasetenLiveModels as s, BASETEN_BASE_URL as t, openclaw_plugin_default as u };
