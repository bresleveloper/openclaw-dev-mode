import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { C as resolveOpenAICodexReasoningEfforts, _ as OPENAI_GPT_6_MODEL_IDS, a as OPENAI_GPT_54_MINI_MODEL_ID, c as OPENAI_GPT_54_PRO_MODEL_ID, f as OPENAI_GPT_56_MODEL_ID, l as OPENAI_GPT_55_MODEL_ID, o as OPENAI_GPT_54_MODEL_ID, r as OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, s as OPENAI_GPT_54_NANO_MODEL_ID, u as OPENAI_GPT_55_PRO_MODEL_ID } from "./model-route-contract-B0eTJHEC.mjs";
//#region extensions/openai/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": { "openai": "openai" },
	"providers": { "openai": {
		"baseUrl": "https://api.openai.com/v1",
		"api": "openai-responses",
		"defaultUtilityModel": "gpt-5.6-luna",
		"models": [
			{
				"id": "gpt-6-astra",
				"name": "GPT-6 Astra",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 10,
					"output": 50,
					"cacheRead": 1,
					"cacheWrite": 12.5,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					}, {
						"range": [272001],
						"input": 20,
						"output": 75,
						"cacheRead": 2,
						"cacheWrite": 25
					}]
				},
				"thinkingLevelMap": {
					"off": null,
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-6-sol",
				"name": "GPT-6 Sol",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2,
					"output": 10,
					"cacheRead": .2,
					"cacheWrite": 2.5,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 2.5
					}, {
						"range": [272001],
						"input": 4,
						"output": 15,
						"cacheRead": .4,
						"cacheWrite": 5
					}]
				},
				"thinkingLevelMap": {
					"off": "none",
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-6-luna",
				"name": "GPT-6 Luna",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": .1,
					"output": .5,
					"cacheRead": .01,
					"cacheWrite": .125,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": .1,
						"output": .5,
						"cacheRead": .01,
						"cacheWrite": .125
					}, {
						"range": [272001],
						"input": .2,
						"output": .75,
						"cacheRead": .02,
						"cacheWrite": .25
					}]
				},
				"thinkingLevelMap": {
					"off": "none",
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-sol",
				"name": "GPT-5.6 Sol",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 6.25
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-terra",
				"name": "GPT-5.6 Terra",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2.5,
					"output": 15,
					"cacheRead": .25,
					"cacheWrite": 3.125
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-luna",
				"name": "GPT-5.6 Luna",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 1,
					"output": 6,
					"cacheRead": .1,
					"cacheWrite": 1.25
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.5",
				"name": "GPT-5.5",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-sol",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 6e3,
					"preferredSidePx": 2048,
					"tokenMode": "detail"
				} },
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gpt-5.5-pro",
				"name": "gpt-5.5-pro",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-sol",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 6e3,
					"preferredSidePx": 2048,
					"tokenMode": "detail"
				} },
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 30,
					"output": 180,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gpt-5.4",
				"name": "GPT-5.4",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"maxTokens": 128e3,
				"cost": {
					"input": 2.5,
					"output": 15,
					"cacheRead": .25,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-pro",
				"name": "GPT-5.4 Pro",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"maxTokens": 128e3,
				"cost": {
					"input": 30,
					"output": 180,
					"cacheRead": 0,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-mini",
				"name": "GPT-5.4 Mini",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"maxTokens": 128e3,
				"cost": {
					"input": .75,
					"output": 4.5,
					"cacheRead": .075,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-nano",
				"name": "GPT-5.4 Nano",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"maxTokens": 128e3,
				"cost": {
					"input": .2,
					"output": 1.25,
					"cacheRead": .02,
					"cacheWrite": 0
				}
			}
		]
	} },
	"aliases": { "azure-openai-responses": {
		"provider": "openai",
		"api": "azure-openai-responses"
	} },
	"discovery": { "openai": "runtime" },
	"suppressions": [
		{
			"provider": "openai",
			"model": "gpt-5.4",
			"reason": "GPT-5.4 has retired from the ChatGPT-account Codex route.",
			"retirement": { "replacedBy": "gpt-5.6-terra" },
			"when": { "baseUrlHosts": ["chatgpt.com"] }
		},
		{
			"provider": "openai",
			"model": "gpt-5.4-mini",
			"reason": "GPT-5.4 Mini has retired from the ChatGPT-account Codex route.",
			"retirement": { "replacedBy": "gpt-5.6-luna" },
			"when": { "baseUrlHosts": ["chatgpt.com"] }
		},
		{
			"provider": "openai",
			"model": "gpt-5.3-codex-spark",
			"reason": "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; OpenAI API-key auth cannot use this model.",
			"when": { "baseUrlHosts": ["api.openai.com"] }
		},
		{
			"provider": "azure-openai-responses",
			"model": "gpt-5.3-codex-spark",
			"reason": "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; Azure/OpenAI API-key auth cannot use this model."
		}
	]
};
//#endregion
//#region extensions/openai/thinking-policy.ts
const OPENAI_THINKING_BASE_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
const OPENAI_THINKING_LEVEL_ORDER = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
const OPENAI_CODEX_XHIGH_MODEL_IDS = [
	OPENAI_GPT_56_MODEL_ID,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_53_CODEX_SPARK_MODEL_ID
];
const OPENAI_UNIFIED_XHIGH_MODEL_IDS = [
	...OPENAI_CODEX_XHIGH_MODEL_IDS,
	OPENAI_GPT_54_MINI_MODEL_ID,
	OPENAI_GPT_54_NANO_MODEL_ID
];
function normalizeCodexReasoningEffort(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized === "none") return "off";
	return OPENAI_THINKING_LEVEL_ORDER.find((level) => level === normalized);
}
function buildCodexLevels(efforts) {
	const supported = /* @__PURE__ */ new Set();
	for (const effort of efforts) {
		const level = normalizeCodexReasoningEffort(effort);
		if (level) supported.add(level);
	}
	return OPENAI_THINKING_LEVEL_ORDER.filter((level) => supported.has(level)).map((id) => ({ id }));
}
function buildOpenAIThinkingProfile(params) {
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const agentRuntime = normalizeLowercaseStringOrEmpty(params.agentRuntime ?? "");
	const codexEfforts = params.compat?.supportedReasoningEfforts?.map(normalizeLowercaseStringOrEmpty);
	if (params.compat?.supportsReasoningEffort === false || codexEfforts?.length === 0) {
		const hostRuntime = !agentRuntime || agentRuntime === "auto" || agentRuntime === "openclaw";
		return { levels: params.api === "openai-completions" && hostRuntime && [
			"qwen",
			"qwen-chat-template",
			"zai",
			"deepseek",
			"together"
		].includes(params.compat?.thinkingFormat ?? "") ? OPENAI_THINKING_BASE_LEVELS : [] };
	}
	const canSynthesizeUltra = params.thinkingLevelMap?.max !== null;
	if (OPENAI_GPT_6_MODEL_IDS.some((id) => id === modelId)) {
		const fallbackEfforts = modelCatalog.providers.openai.models.find((model) => model.id === modelId)?.compat?.supportedReasoningEfforts ?? [];
		const efforts = codexEfforts ?? (agentRuntime === "codex" ? fallbackEfforts.filter((effort) => effort !== "none") : fallbackEfforts);
		const supportsUltra = [
			"openclaw",
			"codex",
			"auto"
		].includes(agentRuntime) && efforts.includes("max") && (agentRuntime === "codex" ? modelId === "gpt-6-astra" || efforts.includes("ultra") : canSynthesizeUltra);
		const defaultLevel = efforts.includes("medium") ? "medium" : efforts.includes("low") ? "low" : void 0;
		return {
			levels: buildCodexLevels(supportsUltra ? [...efforts, "ultra"] : efforts),
			...defaultLevel ? { defaultLevel } : {}
		};
	}
	const resolvedCodexEfforts = params.api === void 0 || params.api === "openai-chatgpt-responses" ? resolveOpenAICodexReasoningEfforts(modelId, codexEfforts) : void 0;
	const knownCodexEfforts = resolveOpenAICodexReasoningEfforts(modelId, void 0);
	const isGpt56Variant = knownCodexEfforts !== void 0;
	const codexSupportsMax = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("max");
	const supportsMax = modelId.startsWith("gpt-5.6") && (agentRuntime !== "codex" || codexSupportsMax);
	const codexSupportsUltra = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("ultra");
	const supportsXHigh = params.xhighModelIds.some((prefix) => modelId.startsWith(prefix));
	const supportsUltra = (modelId === "gpt-5.6" || isGpt56Variant) && ((agentRuntime === "openclaw" || agentRuntime === "auto") && (canSynthesizeUltra || codexEfforts?.includes("ultra")) || agentRuntime === "codex" && codexSupportsUltra);
	const nativeCodexNeedsAccountEffortValidation = agentRuntime === "codex" && params.compat?.supportedReasoningEfforts === void 0 && (params.api === void 0 || params.api === "openai-chatgpt-responses") && !supportsXHigh && !modelId.startsWith("gpt-5.6");
	const defaultLevel = isGpt56Variant ? "medium" : void 0;
	const fallbackLevels = [
		...OPENAI_THINKING_BASE_LEVELS,
		...supportsXHigh ? [{ id: "xhigh" }] : [],
		...supportsMax ? [{ id: "max" }] : [],
		...supportsUltra ? [{ id: "ultra" }] : [],
		...nativeCodexNeedsAccountEffortValidation ? [{ id: "xhigh" }, { id: "max" }] : []
	];
	const levels = agentRuntime === "codex" && resolvedCodexEfforts !== void 0 ? buildCodexLevels(resolvedCodexEfforts) : fallbackLevels;
	return {
		levels,
		...defaultLevel && levels.some((level) => level.id === defaultLevel) ? { defaultLevel } : {}
	};
}
function resolveOpenAICodexThinkingProfile(modelId, agentRuntime, compat, api, thinkingLevelMap) {
	return buildOpenAIThinkingProfile({
		modelId,
		xhighModelIds: OPENAI_CODEX_XHIGH_MODEL_IDS,
		agentRuntime,
		api,
		compat,
		thinkingLevelMap
	});
}
function resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat, api, thinkingLevelMap) {
	return buildOpenAIThinkingProfile({
		modelId,
		xhighModelIds: OPENAI_UNIFIED_XHIGH_MODEL_IDS,
		agentRuntime,
		api,
		compat,
		thinkingLevelMap
	});
}
//#endregion
export { resolveUnifiedOpenAIThinkingProfile as n, modelCatalog as r, resolveOpenAICodexThinkingProfile as t };
