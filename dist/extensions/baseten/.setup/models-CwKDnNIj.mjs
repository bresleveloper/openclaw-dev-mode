import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { asNonArrayRecord, filterStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
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
			"defaultModel": "thinkingmachines/inkling",
			"models": [
				{
					"id": "deepseek-ai/DeepSeek-V4-Pro",
					"name": "DeepSeek V4 Pro",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 262e3,
					"maxTokens": 262e3,
					"cost": {
						"input": 1.74,
						"output": 3.48,
						"cacheRead": .145,
						"cacheWrite": 0
					},
					"compat": {
						"codeMode": "capable",
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
				},
				{
					"id": "zai-org/GLM-4.7",
					"name": "GLM 4.7",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 2e5,
					"maxTokens": 2e5,
					"cost": {
						"input": .6,
						"output": 2.2,
						"cacheRead": .12,
						"cacheWrite": 0
					}
				},
				{
					"id": "zai-org/GLM-5.2",
					"name": "GLM 5.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 524e3,
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
					"input": ["text"],
					"contextWindow": 524e3,
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
					"id": "thinkingmachines/inkling",
					"name": "Inkling",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048e3,
					"maxTokens": 32e3,
					"cost": {
						"input": 1,
						"output": 4.05,
						"cacheRead": .17,
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
				},
				{
					"id": "moonshotai/Kimi-K2.6",
					"name": "Kimi K2.6",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262e3,
					"maxTokens": 262e3,
					"cost": {
						"input": .95,
						"output": 4,
						"cacheRead": .16,
						"cacheWrite": 0
					}
				},
				{
					"id": "moonshotai/Kimi-K2.7-Code",
					"name": "Kimi K2.7 Code",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262e3,
					"maxTokens": 262e3,
					"cost": {
						"input": .95,
						"output": 4,
						"cacheRead": .16,
						"cacheWrite": 0
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
						"cacheRead": 0,
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
		"groupHint": "Hosted Model APIs, including Inkling",
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
/**
* Baseten model catalog, compat metadata, and live row projection.
*/
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
/** Base URL for Baseten's OpenAI-compatible Model APIs. */
const BASETEN_BASE_URL = BASETEN_MANIFEST_CATALOG.baseUrl;
/** Default Baseten model id used for onboarding. */
const BASETEN_DEFAULT_MODEL_ID = BASETEN_MANIFEST_CATALOG.defaultModel;
/** Default Baseten model ref used for onboarding. */
const BASETEN_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "baseten");
/** Bundled fallback rows for all Baseten Model APIs available at release time. */
const BASETEN_MODEL_CATALOG = BASETEN_MANIFEST_CATALOG.models;
/** Whether Baseten requires chat-template thinking control for this model. */
function usesBasetenChatTemplateThinking(modelId) {
	return CHAT_TEMPLATE_THINKING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
/** Complete OpenAI-compatible transport policy for one Baseten model. */
function buildBasetenModelCompat(modelId) {
	return {
		...BASE_COMPAT,
		...structuredClone(BASETEN_MODEL_COMPAT.get(modelId))
	};
}
/** Builds the network-free fallback catalog. */
function buildStaticBasetenModels() {
	return buildManifestModelProviderConfig({
		providerId: "baseten",
		catalog: BASETEN_MANIFEST_CATALOG
	}).models.map((model) => Object.assign(model, { compat: buildBasetenModelCompat(model.id) }));
}
function readPositiveInteger(value) {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isSafeInteger(number) && number > 0 ? number : void 0;
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
	const id = typeof row.id === "string" ? row.id.trim() : "";
	if (!id) return;
	const hasLiveFeatures = Array.isArray(row.supported_features);
	const features = new Set(filterStringEntries(row.supported_features));
	const pricing = asNonArrayRecord(row.pricing);
	const inputPrice = readPerTokenPrice(pricing.prompt);
	const outputPrice = readPerTokenPrice(pricing.completion);
	const cacheReadPrice = readPerTokenPrice(pricing.input_cache_read);
	const supportsReasoningEffort = features.has("reasoning_effort");
	const fallbackCompat = fallback?.compat ?? buildBasetenModelCompat(id);
	const compat = hasLiveFeatures ? applyLiveReasoningEffortCompat(fallbackCompat, supportsReasoningEffort) : fallbackCompat;
	return {
		id,
		name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : fallback?.name ?? id,
		reasoning: hasLiveFeatures ? features.has("reasoning") || supportsReasoningEffort : fallback?.reasoning ?? false,
		input: hasLiveFeatures ? features.has("vision") ? ["text", "image"] : ["text"] : fallback?.input ?? ["text"],
		cost: {
			input: inputPrice ?? fallback?.cost.input ?? 0,
			output: outputPrice ?? fallback?.cost.output ?? 0,
			cacheRead: cacheReadPrice ?? fallback?.cost.cacheRead ?? 0,
			cacheWrite: fallback?.cost.cacheWrite ?? 0
		},
		contextWindow: readPositiveInteger(row.context_length) ?? fallback?.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
		maxTokens: readPositiveInteger(row.max_completion_tokens) ?? fallback?.maxTokens ?? DEFAULT_MAX_TOKENS,
		compat
	};
}
/** Projects Baseten's authenticated `/models` response into OpenClaw model rows. */
function projectBasetenLiveModels(rows) {
	const fallbacks = new Map(buildStaticBasetenModels().map((model) => [model.id, model]));
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const row of rows) {
		if (!row || typeof row !== "object" || Array.isArray(row)) continue;
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
