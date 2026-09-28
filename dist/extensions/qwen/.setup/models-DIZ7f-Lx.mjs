import { applyProviderNativeStreamingUsageCompat, buildManifestModelProviderConfig, supportsNativeStreamingUsageCompat } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/qwen/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": {
		"qwen": "alibaba-coding-plan",
		"qwen-token-plan": "alibaba-token-plan"
	},
	"suppressions": [
		{
			"provider": "qwen",
			"model": "qwen3.8-max",
			"reason": "qwen3.8-max is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go or Token Plan endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "qwen",
			"model": "qwen3.8-flash",
			"reason": "qwen3.8-flash is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go or Token Plan endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "modelstudio",
			"model": "qwen3.8-max",
			"reason": "qwen3.8-max is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go or Token Plan endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "modelstudio",
			"model": "qwen3.8-flash",
			"reason": "qwen3.8-flash is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go or Token Plan endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "qwen",
			"model": "qwen3.6-flash",
			"reason": "qwen3.6-flash is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go Qwen endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "qwen",
			"model": "qwen3.7-max",
			"reason": "qwen3.7-max is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go Qwen endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "modelstudio",
			"model": "qwen3.6-flash",
			"reason": "qwen3.6-flash is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go Qwen endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		},
		{
			"provider": "modelstudio",
			"model": "qwen3.7-max",
			"reason": "qwen3.7-max is not supported on the Qwen Coding Plan endpoint; use a Standard pay-as-you-go Qwen endpoint.",
			"when": { "baseUrlHosts": ["coding.dashscope.aliyuncs.com", "coding-intl.dashscope.aliyuncs.com"] }
		}
	],
	"providers": {
		"qwen": {
			"api": "openai-completions",
			"models": [
				{
					"id": "qwen3.5-plus",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.6-flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.6-plus",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.7-max",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.7-plus",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.8-max",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"minimal": "low",
						"high": "xhigh",
						"max": "xhigh"
					},
					"compat": {
						"codeMode": "capable",
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"low",
							"medium",
							"xhigh"
						],
						"reasoningEffortMap": {
							"minimal": "low",
							"high": "xhigh",
							"max": "xhigh"
						}
					}
				},
				{
					"id": "qwen3.8-flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"minimal": "low",
						"high": "xhigh",
						"max": "xhigh"
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"low",
							"medium",
							"xhigh"
						],
						"reasoningEffortMap": {
							"minimal": "low",
							"high": "xhigh",
							"max": "xhigh"
						}
					}
				},
				{
					"id": "qwen3-max-2026-01-23",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 262144,
					"maxTokens": 65536
				},
				{
					"id": "qwen3-coder-next",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 262144,
					"maxTokens": 65536
				},
				{
					"id": "qwen3-coder-plus",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "MiniMax-M2.5",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "glm-5",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 202752,
					"maxTokens": 16384
				},
				{
					"id": "glm-4.7",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 202752,
					"maxTokens": 16384
				},
				{
					"id": "kimi-k2.5",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 32768
				}
			]
		},
		"qwen-token-plan": {
			"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "qwen3.7-plus",
					"name": "qwen3.7-plus",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3.8-max",
					"name": "qwen3.8-max",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"minimal": "low",
						"high": "xhigh",
						"max": "xhigh"
					},
					"compat": {
						"codeMode": "capable",
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"low",
							"medium",
							"xhigh"
						],
						"reasoningEffortMap": {
							"minimal": "low",
							"high": "xhigh",
							"max": "xhigh"
						}
					}
				},
				{
					"id": "qwen3.8-flash",
					"name": "qwen3.8-flash",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"thinkingLevelMap": {
						"minimal": "low",
						"high": "xhigh",
						"max": "xhigh"
					},
					"compat": {
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"low",
							"medium",
							"xhigh"
						],
						"reasoningEffortMap": {
							"minimal": "low",
							"high": "xhigh",
							"max": "xhigh"
						}
					}
				},
				{
					"id": "qwen3.6-plus",
					"name": "qwen3.6-plus",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 1e6,
					"maxTokens": 65536
				},
				{
					"id": "qwen3-coder-next",
					"name": "qwen3-coder-next",
					"reasoning": true,
					"input": ["text"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 262144,
					"maxTokens": 65536,
					"status": "deprecated",
					"replacedBy": "qwen3.7-plus"
				},
				{
					"id": "kimi-k2.5",
					"name": "kimi-k2.5",
					"reasoning": true,
					"input": ["text", "image"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 262144,
					"maxTokens": 98304
				},
				{
					"id": "glm-5",
					"name": "glm-5",
					"reasoning": true,
					"input": ["text"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 202752,
					"maxTokens": 16384
				},
				{
					"id": "MiniMax-M2.5",
					"name": "MiniMax-M2.5",
					"reasoning": true,
					"input": ["text"],
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"contextWindow": 196608,
					"maxTokens": 32768
				}
			]
		}
	},
	"discovery": {
		"qwen": "runtime",
		"qwen-token-plan": "refreshable"
	}
};
//#endregion
//#region extensions/qwen/models.ts
const QWEN_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
const QWEN_GLOBAL_BASE_URL = QWEN_BASE_URL;
const QWEN_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
const QWEN_STANDARD_CN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const QWEN_STANDARD_GLOBAL_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const QWEN_TOKEN_PLAN_PROVIDER_ID = "qwen-token-plan";
const QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID = "bailian-token-plan";
const QWEN_TOKEN_PLAN_GLOBAL_BASE_URL = "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_TOKEN_PLAN_CN_BASE_URL = "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_DEFAULT_MODEL_ID = "qwen3.5-plus";
const QWEN_36_FLASH_MODEL_ID = "qwen3.6-flash";
const QWEN_36_PLUS_MODEL_ID = "qwen3.6-plus";
const QWEN_37_MAX_MODEL_ID = "qwen3.7-max";
const QWEN_37_PLUS_MODEL_ID = "qwen3.7-plus";
const QWEN_38_MODEL_IDS = /* @__PURE__ */ new Set(["qwen3.8-max", "qwen3.8-flash"]);
function isQwen38ModelId(modelId) {
	return QWEN_38_MODEL_IDS.has(modelId.trim().toLowerCase());
}
const QWEN_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const QWEN_DEFAULT_MODEL_REF = `qwen/${QWEN_DEFAULT_MODEL_ID}`;
const QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID = QWEN_37_PLUS_MODEL_ID;
const QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF = `${QWEN_TOKEN_PLAN_PROVIDER_ID}/${QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID}`;
function isQwenTokenPlanThinkingOnlyModelId(modelId) {
	const normalized = modelId.trim().toLowerCase();
	return normalized === "minimax-m2.5" || normalized.startsWith("kimi-k2.7-code");
}
function isQwenTokenPlanDeepSeekV4ModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("deepseek-v4");
}
function isQwenTokenPlanKimiModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("kimi-");
}
function isQwenTokenPlanGlmModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("glm-");
}
function supportsQwenTokenPlanGlmMaxThinking(modelId) {
	return modelId.trim().toLowerCase() === "glm-5.2";
}
const QWEN_TOKEN_PLAN_BASE_URLS = {
	global: QWEN_TOKEN_PLAN_GLOBAL_BASE_URL,
	cn: QWEN_TOKEN_PLAN_CN_BASE_URL
};
function resolveQwenTokenPlanBaseUrl(region) {
	return QWEN_TOKEN_PLAN_BASE_URLS[region];
}
const QWEN_TOKEN_PLAN_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
	catalog: modelCatalog.providers[QWEN_TOKEN_PLAN_PROVIDER_ID]
}).models;
const QWEN_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "qwen",
	catalog: {
		...modelCatalog.providers.qwen,
		baseUrl: QWEN_BASE_URL
	}
}).models;
function isQwenCodingPlanBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return false;
	try {
		const hostname = new URL(trimmed).hostname.toLowerCase().replace(/\.+$/, "");
		return hostname === "coding.dashscope.aliyuncs.com" || hostname === "coding-intl.dashscope.aliyuncs.com";
	} catch {
		return false;
	}
}
function isQwen36PlusSupportedBaseUrl(_baseUrl) {
	return true;
}
const QWEN_STANDARD_ONLY_MODEL_IDS = /* @__PURE__ */ new Set([
	QWEN_36_FLASH_MODEL_ID,
	QWEN_37_MAX_MODEL_ID,
	...QWEN_38_MODEL_IDS
]);
function isQwenStandardOnlyModelId(modelId) {
	return QWEN_STANDARD_ONLY_MODEL_IDS.has(modelId);
}
function buildQwenModelCatalogForBaseUrl(baseUrl) {
	return isQwenCodingPlanBaseUrl(baseUrl) ? QWEN_MODEL_CATALOG.filter((model) => !isQwenStandardOnlyModelId(model.id)) : QWEN_MODEL_CATALOG;
}
function isNativeQwenBaseUrl(baseUrl) {
	return supportsNativeStreamingUsageCompat({
		providerId: "qwen",
		baseUrl
	});
}
function applyQwenNativeStreamingUsageCompat(provider) {
	return applyProviderNativeStreamingUsageCompat({
		providerId: "qwen",
		providerConfig: provider
	});
}
function buildQwenModelDefinition(params) {
	const catalog = QWEN_MODEL_CATALOG.find((model) => model.id === params.id);
	return {
		id: params.id,
		name: params.name ?? catalog?.name ?? params.id,
		reasoning: params.reasoning ?? catalog?.reasoning ?? false,
		input: params.input ?? (catalog?.input ? [...catalog.input] : ["text"]),
		cost: params.cost ?? catalog?.cost ?? QWEN_DEFAULT_COST,
		contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 262144,
		maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 65536
	};
}
function buildQwenDefaultModelDefinition() {
	return buildQwenModelDefinition({ id: QWEN_DEFAULT_MODEL_ID });
}
/** @deprecated Use QWEN_BASE_URL. */
const MODELSTUDIO_BASE_URL = QWEN_BASE_URL;
/** @deprecated Use QWEN_GLOBAL_BASE_URL. */
const MODELSTUDIO_GLOBAL_BASE_URL = QWEN_GLOBAL_BASE_URL;
/** @deprecated Use QWEN_CN_BASE_URL. */
const MODELSTUDIO_CN_BASE_URL = QWEN_CN_BASE_URL;
/** @deprecated Use QWEN_STANDARD_CN_BASE_URL. */
const MODELSTUDIO_STANDARD_CN_BASE_URL = QWEN_STANDARD_CN_BASE_URL;
/** @deprecated Use QWEN_STANDARD_GLOBAL_BASE_URL. */
const MODELSTUDIO_STANDARD_GLOBAL_BASE_URL = QWEN_STANDARD_GLOBAL_BASE_URL;
/** @deprecated Use QWEN_DEFAULT_MODEL_ID. */
const MODELSTUDIO_DEFAULT_MODEL_ID = QWEN_DEFAULT_MODEL_ID;
/** @deprecated Use QWEN_DEFAULT_COST. */
const MODELSTUDIO_DEFAULT_COST = QWEN_DEFAULT_COST;
/** @deprecated Use qwen/${QWEN_DEFAULT_MODEL_ID}. */
const MODELSTUDIO_DEFAULT_MODEL_REF = `modelstudio/${QWEN_DEFAULT_MODEL_ID}`;
/** @deprecated Use QWEN_MODEL_CATALOG. */
const MODELSTUDIO_MODEL_CATALOG = QWEN_MODEL_CATALOG;
const isNativeModelStudioBaseUrl = isNativeQwenBaseUrl;
const applyModelStudioNativeStreamingUsageCompat = applyQwenNativeStreamingUsageCompat;
const buildModelStudioModelDefinition = buildQwenModelDefinition;
const buildModelStudioDefaultModelDefinition = buildQwenDefaultModelDefinition;
//#endregion
export { applyModelStudioNativeStreamingUsageCompat as A, isQwen38ModelId as B, QWEN_TOKEN_PLAN_CN_BASE_URL as C, QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID as D, QWEN_TOKEN_PLAN_GLOBAL_BASE_URL as E, buildQwenModelCatalogForBaseUrl as F, isQwenTokenPlanKimiModelId as G, isQwenStandardOnlyModelId as H, buildQwenModelDefinition as I, supportsQwenTokenPlanGlmMaxThinking as J, isQwenTokenPlanThinkingOnlyModelId as K, isNativeModelStudioBaseUrl as L, buildModelStudioDefaultModelDefinition as M, buildModelStudioModelDefinition as N, QWEN_TOKEN_PLAN_MODEL_CATALOG as O, buildQwenDefaultModelDefinition as P, isNativeQwenBaseUrl as R, QWEN_STANDARD_GLOBAL_BASE_URL as S, QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF as T, isQwenTokenPlanDeepSeekV4ModelId as U, isQwenCodingPlanBaseUrl as V, isQwenTokenPlanGlmModelId as W, QWEN_DEFAULT_MODEL_ID as _, MODELSTUDIO_DEFAULT_MODEL_REF as a, QWEN_MODEL_CATALOG as b, MODELSTUDIO_STANDARD_CN_BASE_URL as c, QWEN_36_PLUS_MODEL_ID as d, QWEN_37_MAX_MODEL_ID as f, QWEN_DEFAULT_COST as g, QWEN_CN_BASE_URL as h, MODELSTUDIO_DEFAULT_MODEL_ID as i, applyQwenNativeStreamingUsageCompat as j, QWEN_TOKEN_PLAN_PROVIDER_ID as k, MODELSTUDIO_STANDARD_GLOBAL_BASE_URL as l, QWEN_BASE_URL as m, MODELSTUDIO_CN_BASE_URL as n, MODELSTUDIO_GLOBAL_BASE_URL as o, QWEN_37_PLUS_MODEL_ID as p, resolveQwenTokenPlanBaseUrl as q, MODELSTUDIO_DEFAULT_COST as r, MODELSTUDIO_MODEL_CATALOG as s, MODELSTUDIO_BASE_URL as t, QWEN_36_FLASH_MODEL_ID as u, QWEN_DEFAULT_MODEL_REF as v, QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID as w, QWEN_STANDARD_CN_BASE_URL as x, QWEN_GLOBAL_BASE_URL as y, isQwen36PlusSupportedBaseUrl as z };
