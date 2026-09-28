import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { g as supportsClaudeAdaptiveThinking } from "./anthropic-Cy4mTngV.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
//#region extensions/github-copilot/openclaw.plugin.json
var modelCatalog = {
	"providers": { "github-copilot": {
		"baseUrl": "https://api.individual.githubcopilot.com",
		"api": "openai-responses",
		"models": [
			{
				"id": "claude-fable-5",
				"name": "Claude Fable 5",
				"api": "anthropic-messages",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 128e3,
				"cost": {
					"input": 10,
					"output": 50,
					"cacheRead": 1,
					"cacheWrite": 12.5
				},
				"compat": { "codeMode": "capable" }
			},
			{
				"id": "claude-opus-5",
				"name": "Claude Opus 5",
				"api": "anthropic-messages",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 25,
					"cacheRead": .5,
					"cacheWrite": 6.25
				},
				"compat": {
					"codeMode": "capable",
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					]
				}
			},
			{
				"id": "claude-sonnet-5",
				"name": "Claude Sonnet 5",
				"api": "anthropic-messages",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 128e3,
				"cost": {
					"input": 2,
					"output": 10,
					"cacheRead": .2,
					"cacheWrite": 2.5
				},
				"compat": { "codeMode": "capable" }
			},
			{
				"id": "claude-haiku-4.5",
				"name": "Claude Haiku 4.5",
				"api": "anthropic-messages",
				"input": ["text", "image"],
				"contextWindow": 2e5,
				"maxTokens": 64e3,
				"cost": {
					"input": 1,
					"output": 5,
					"cacheRead": .1,
					"cacheWrite": 1.25
				}
			},
			{
				"id": "claude-opus-4.8",
				"name": "Claude Opus 4.8",
				"api": "anthropic-messages",
				"status": "deprecated",
				"replacedBy": "claude-opus-5",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 25,
					"cacheRead": .5,
					"cacheWrite": 6.25
				}
			},
			{
				"id": "claude-sonnet-4.6",
				"name": "Claude Sonnet 4.6",
				"api": "anthropic-messages",
				"status": "deprecated",
				"replacedBy": "claude-sonnet-5",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 1e6,
				"maxTokens": 128e3,
				"cost": {
					"input": 3,
					"output": 15,
					"cacheRead": .3,
					"cacheWrite": 3.75
				}
			},
			{
				"id": "gemini-3.6-flash",
				"name": "Gemini 3.6 Flash",
				"api": "openai-completions",
				"compat": {
					"codeMode": "capable",
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsUsageInStreaming": false,
					"maxTokensField": "max_tokens"
				},
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"cost": {
					"input": 1.5,
					"output": 7.5,
					"cacheRead": .15,
					"cacheWrite": 0
				}
			},
			{
				"id": "gemini-3.1-pro-preview",
				"name": "Gemini 3.1 Pro Preview",
				"api": "openai-completions",
				"compat": {
					"codeMode": "capable",
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsUsageInStreaming": false,
					"maxTokensField": "max_tokens"
				},
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"cost": {
					"input": 2,
					"output": 12,
					"cacheRead": .2,
					"cacheWrite": 0
				}
			},
			{
				"id": "gemini-3.5-flash",
				"name": "Gemini 3.5 Flash",
				"api": "openai-completions",
				"compat": {
					"codeMode": "capable",
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsUsageInStreaming": false,
					"maxTokensField": "max_tokens"
				},
				"status": "deprecated",
				"replacedBy": "gemini-3.6-flash",
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"cost": {
					"input": 1.5,
					"output": 9,
					"cacheRead": .15,
					"cacheWrite": 0
				}
			},
			{
				"id": "gemini-2.5-pro",
				"name": "Gemini 2.5 Pro",
				"api": "openai-completions",
				"compat": {
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsUsageInStreaming": false,
					"maxTokensField": "max_tokens"
				},
				"status": "deprecated",
				"replacedBy": "gemini-3.1-pro-preview",
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"cost": {
					"input": 1.25,
					"output": 10,
					"cacheRead": .125,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.6-sol",
				"name": "GPT-5.6 Sol",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 922e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"compat": {
					"codeMode": "capable",
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					]
				}
			},
			{
				"id": "gpt-5.6-terra",
				"name": "GPT-5.6 Terra",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 922e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2.5,
					"output": 15,
					"cacheRead": .25,
					"cacheWrite": 0
				},
				"compat": {
					"codeMode": "capable",
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					]
				}
			},
			{
				"id": "gpt-5.6-luna",
				"name": "GPT-5.6 Luna",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 922e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 1,
					"output": 6,
					"cacheRead": .1,
					"cacheWrite": 0
				},
				"compat": {
					"codeMode": "capable",
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					]
				}
			},
			{
				"id": "gpt-5.3-codex",
				"name": "GPT-5.3-Codex",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": null
				},
				"compat": { "supportedReasoningEfforts": [
					"low",
					"medium",
					"high",
					"xhigh"
				] },
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 1.75,
					"output": 14,
					"cacheRead": .175,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4",
				"name": "GPT-5.4",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-terra",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": null
				},
				"compat": { "supportedReasoningEfforts": [
					"none",
					"low",
					"medium",
					"high",
					"xhigh"
				] },
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
				"id": "gpt-5.5",
				"name": "GPT-5.5",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-sol",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": null
				},
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"compat": {
					"codeMode": "capable",
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh"
					]
				}
			},
			{
				"id": "gpt-5.4-mini",
				"name": "GPT-5.4 mini",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-luna",
				"reasoning": true,
				"thinkingLevelMap": {
					"minimal": "low",
					"xhigh": "xhigh",
					"max": null
				},
				"compat": { "supportedReasoningEfforts": [
					"none",
					"low",
					"medium",
					"high",
					"xhigh"
				] },
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": .75,
					"output": 4.5,
					"cacheRead": .075,
					"cacheWrite": 0
				}
			}
		]
	} },
	"discovery": { "github-copilot": "refreshable" }
};
//#endregion
//#region extensions/github-copilot/model-metadata.ts
const DEFAULT_COPILOT_MODEL = "github-copilot/claude-sonnet-5";
const COPILOT_CHAT_COMPLETIONS_COMPAT = {
	supportsStore: false,
	supportsDeveloperRole: false,
	supportsUsageInStreaming: false,
	maxTokensField: "max_tokens"
};
const manifestCatalog = modelCatalog.providers["github-copilot"];
const manifestModels = buildManifestModelProviderConfig({
	providerId: "github-copilot",
	catalog: manifestCatalog
}).models;
const STATIC_MODEL_OVERRIDES = new Map([
	...manifestModels.map((model) => [model.id, model]),
	["claude-opus-4.6-1m", {
		name: "Claude Opus 4.6 (1M context)",
		api: "anthropic-messages",
		reasoning: true,
		contextWindow: 1e6,
		maxTokens: 64e3,
		thinkingLevelMap: {
			xhigh: null,
			max: null
		},
		compat: { supportedReasoningEfforts: [
			"low",
			"medium",
			"high"
		] }
	}],
	["claude-opus-4.7-1m-internal", {
		name: "Claude Opus 4.7 (1M context)",
		api: "anthropic-messages",
		reasoning: true,
		contextWindow: 1e6,
		maxTokens: 64e3,
		thinkingLevelMap: {
			xhigh: "xhigh",
			max: null
		},
		compat: { supportedReasoningEfforts: [
			"low",
			"medium",
			"high",
			"xhigh"
		] }
	}]
]);
function isCopilotGeminiModelId(modelId) {
	return /(?:^|[-_.])gemini(?:$|[-_.])/.test(modelId);
}
function isCopilotClaude45ModelId(modelId) {
	return /^claude-(?:haiku|opus|sonnet)-4[.-]5(?:$|[-.])/.test(modelId);
}
function resolveCopilotTransportApi(modelId) {
	const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
	if (normalized.includes("claude")) return "anthropic-messages";
	if (isCopilotGeminiModelId(normalized)) return "openai-completions";
	return "openai-responses";
}
function resolveCopilotModelCompat(modelId) {
	const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
	if (isCopilotGeminiModelId(normalized)) return { ...COPILOT_CHAT_COMPLETIONS_COMPAT };
	if (isCopilotClaude45ModelId(normalized)) return { supportsEagerToolInputStreaming: false };
}
function resolveCopilotThinkingLevelMap(modelId, compat, api) {
	const normalizedModelId = normalizeOptionalLowercaseString(modelId) ?? "";
	const runtimeApi = api ?? resolveCopilotTransportApi(normalizedModelId);
	const staticCompat = resolveStaticCopilotModelOverride(normalizedModelId)?.compat;
	const efforts = compat?.supportsReasoningEffort === false ? [] : compat?.supportedReasoningEfforts ?? staticCompat?.supportedReasoningEfforts;
	if (!Array.isArray(efforts)) return;
	const supported = new Set(efforts.map(normalizeOptionalLowercaseString));
	const supportsEffort = runtimeApi !== "anthropic-messages" || supportsClaudeAdaptiveThinking({ id: normalizedModelId });
	return {
		...runtimeApi === "openai-responses" && !supported.has("minimal") && supported.has("low") ? { minimal: "low" } : {},
		xhigh: supportsEffort && supported.has("xhigh") ? "xhigh" : null,
		max: supportsEffort && runtimeApi !== "openai-completions" && supported.has("max") ? "max" : null
	};
}
function resolveStaticCopilotModelOverride(modelId) {
	return STATIC_MODEL_OVERRIDES.get(normalizeOptionalLowercaseString(modelId) ?? "");
}
//#endregion
export { resolveStaticCopilotModelOverride as a, resolveCopilotTransportApi as i, resolveCopilotModelCompat as n, resolveCopilotThinkingLevelMap as r, DEFAULT_COPILOT_MODEL as t };
