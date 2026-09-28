import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import "openclaw/plugin-sdk/provider-model-metadata";
//#region extensions/openai/base-url.ts
const OPENAI_CODEX_RESPONSES_BASE_URL = "https://chatgpt.com/backend-api/codex";
const OPENAI_PLATFORM_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/v1",
	"/v1/"
]);
const OPENAI_CHATGPT_PATHS = /* @__PURE__ */ new Set([
	"/backend-api",
	"/backend-api/",
	"/backend-api/v1",
	"/backend-api/v1/",
	"/backend-api/codex",
	"/backend-api/codex/",
	"/backend-api/codex/v1",
	"/backend-api/codex/v1/",
	"/backend-api/codex/responses",
	"/backend-api/codex/responses/"
]);
/** Classifies exact native endpoints, valid custom URLs, and unsafe/invalid input. */
function classifyOpenAIBaseUrl(baseUrl) {
	if (baseUrl === void 0 || baseUrl === null || baseUrl === "") return "unresolved";
	if (typeof baseUrl !== "string") return "invalid";
	const trimmed = baseUrl.trim();
	if (!trimmed) return "unresolved";
	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:" || !url.hostname || url.username || url.password) return "invalid";
		const rawHost = url.hostname.toLowerCase();
		const host = rawHost.endsWith(".") ? rawHost.slice(0, -1) : rawHost;
		if (host === "api.openai.com" || host === "chatgpt.com") {
			if (url.protocol !== "https:" || url.port || url.search || url.hash) return "invalid";
			if (host === "api.openai.com" && OPENAI_PLATFORM_PATHS.has(url.pathname)) return "platform";
			if (host === "chatgpt.com" && OPENAI_CHATGPT_PATHS.has(url.pathname)) return "chatgpt";
			return "invalid";
		}
		return "custom";
	} catch {
		return "invalid";
	}
}
function resolveOpenAIDefaultBaseUrl(env = process.env) {
	return normalizeOptionalString(env.OPENAI_BASE_URL) ?? "https://api.openai.com/v1";
}
function isOpenAIApiBaseUrl(baseUrl) {
	return classifyOpenAIBaseUrl(baseUrl) === "platform";
}
function isOpenAICodexBaseUrl(baseUrl) {
	return classifyOpenAIBaseUrl(baseUrl) === "chatgpt";
}
/** True only for an HTTPS OpenAI Platform endpoint eligible for native transport hooks. */
function isOpenAIHttpsApiBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string" || classifyOpenAIBaseUrl(baseUrl) !== "platform") return false;
	return new URL(baseUrl.trim()).protocol === "https:";
}
//#endregion
//#region extensions/openai/model-route-contract.ts
const OPENAI_CHAT_LATEST_MODEL_ID = "chat-latest";
const OPENAI_GPT_6_MODEL_IDS = [
	"gpt-6-astra",
	"gpt-6-sol",
	"gpt-6-luna"
];
const OPENAI_GPT_56_MODEL_ID = "gpt-5.6";
const OPENAI_GPT_56_SOL_MODEL_ID = "gpt-5.6-sol";
const OPENAI_GPT_56_TERRA_MODEL_ID = "gpt-5.6-terra";
const OPENAI_GPT_56_LUNA_MODEL_ID = "gpt-5.6-luna";
const OPENAI_GPT_55_MODEL_ID = "gpt-5.5";
const OPENAI_GPT_55_PRO_MODEL_ID = "gpt-5.5-pro";
const OPENAI_GPT_54_MODEL_ID = "gpt-5.4";
const OPENAI_GPT_54_LEGACY_MODEL_ID = "gpt-5.4-codex";
const OPENAI_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
const OPENAI_GPT_54_NANO_MODEL_ID = "gpt-5.4-nano";
const OPENAI_GPT_53_CODEX_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const OPENAI_GPT_56_VARIANT_MODEL_IDS = [
	OPENAI_GPT_56_SOL_MODEL_ID,
	OPENAI_GPT_56_TERRA_MODEL_ID,
	OPENAI_GPT_56_LUNA_MODEL_ID
];
const OPENAI_CODEX_REASONING_EFFORT_ORDER = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
const OPENAI_CODEX_REASONING_EFFORTS_BY_MODEL = /* @__PURE__ */ new Map([
	[OPENAI_GPT_56_SOL_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER],
	[OPENAI_GPT_56_TERRA_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER],
	[OPENAI_GPT_56_LUNA_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER.slice(0, -1)]
]);
/** Models with known first-party Platform and ChatGPT transports. */
const OPENAI_DUAL_ROUTE_MODEL_IDS = [
	...OPENAI_GPT_6_MODEL_IDS,
	...OPENAI_GPT_56_VARIANT_MODEL_IDS,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_54_MINI_MODEL_ID
];
/** Direct aliases excluded from the ChatGPT catalog. */
const OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS = [OPENAI_CHAT_LATEST_MODEL_ID, OPENAI_GPT_56_MODEL_ID];
const OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS = [OPENAI_GPT_53_CODEX_SPARK_MODEL_ID];
/** Modern model refs recognized by the unified OpenAI provider surface. */
const OPENAI_PROVIDER_MODERN_MODEL_IDS = [
	...OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS,
	...OPENAI_DUAL_ROUTE_MODEL_IDS,
	OPENAI_GPT_54_NANO_MODEL_ID,
	...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS
];
const OPENAI_CHATGPT_MODERN_MODEL_IDS = [...OPENAI_DUAL_ROUTE_MODEL_IDS, ...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS];
new Set(OPENAI_DUAL_ROUTE_MODEL_IDS);
const openAIPlatformOnlyRouteModelIds = new Set(OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS);
const openAISubscriptionOnlyRouteModelIds = new Set(OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS);
function normalizeOpenAIModelRouteId(value) {
	const modelId = value?.trim() ?? "";
	const normalized = modelId.toLowerCase();
	return normalized === "gpt-5.4-codex" || normalized === `openai/gpt-5.4-codex` ? OPENAI_GPT_54_MODEL_ID : modelId;
}
function normalizeOpenAIRouteMembershipId(value) {
	return normalizeOpenAIModelRouteId(value).toLowerCase();
}
/**
* Merge live Codex observations with first-party model capabilities.
* An explicit empty list remains authoritative; partial non-empty observations
* cannot erase capabilities known by every other OpenAI model surface.
*/
function resolveOpenAICodexReasoningEfforts(modelId, observed) {
	const known = OPENAI_CODEX_REASONING_EFFORTS_BY_MODEL.get(normalizeOpenAIRouteMembershipId(modelId));
	if (!known) return observed ? [...observed] : void 0;
	if (observed === void 0 || observed.length === 0) return observed ? [] : [...known];
	const normalizedObserved = observed.map((effort) => effort.trim().toLowerCase()).filter(Boolean);
	const supported = /* @__PURE__ */ new Set([...known, ...normalizedObserved]);
	const knownSet = new Set(known);
	for (const effort of OPENAI_CODEX_REASONING_EFFORT_ORDER) if (!knownSet.has(effort)) supported.delete(effort);
	return [...OPENAI_CODEX_REASONING_EFFORT_ORDER.filter((effort) => supported.delete(effort)), ...supported];
}
function isOpenAIPlatformOnlyRouteModelId(value) {
	return openAIPlatformOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
function isOpenAISubscriptionOnlyRouteModelId(value) {
	return openAISubscriptionOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
//#endregion
//#region extensions/openai/realtime-quicksilver.ts
const OPENAI_GPT_LIVE_MODEL_PREFIX = "gpt-live";
const OPENAI_GPT_LIVE_MODELS = ["gpt-live-1", "gpt-live-1-codex"];
const OPENAI_GPT_LIVE_API_VOICES = [
	"alloy",
	"ash",
	"ballad",
	"beacon",
	"bossa",
	"cedar",
	"cinder",
	"coral",
	"delta",
	"echo",
	"gleam",
	"marin",
	"meridian",
	"quartz",
	"ripple",
	"sage",
	"shimmer",
	"stone",
	"tempo",
	"verse",
	"vesper",
	"willow"
];
const OPENAI_GPT_LIVE_VOICES = [
	"arbor",
	"breeze",
	"cove",
	"ember",
	"juniper",
	"maple",
	"sol",
	"spruce",
	"vale"
];
const OPENAI_GPT_LIVE_UNLISTED_VOICES = ["marin", "cedar"];
function isOpenAIGptLiveApiModel(model) {
	return model?.trim().toLowerCase() === "gpt-live-1";
}
function isOpenAIGptLiveSubscriptionModel(model) {
	return model?.trim().toLowerCase() === "gpt-live-1-codex";
}
function isSupportedOpenAIGptLiveModel(model) {
	return isOpenAIGptLiveApiModel(model) || isOpenAIGptLiveSubscriptionModel(model);
}
function resolveOpenAIQuicksilverVoice(model, value) {
	const voices = resolveOpenAIQuicksilverVoices(model);
	const defaultVoice = isOpenAIGptLiveSubscriptionModel(model) ? "cove" : "marin";
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return voices.find((voice) => voice === normalized) ?? defaultVoice;
	}
	return defaultVoice;
}
function resolveOpenAIQuicksilverVoices(model) {
	if (isOpenAIGptLiveApiModel(model)) return OPENAI_GPT_LIVE_API_VOICES;
	return isOpenAIGptLiveSubscriptionModel(model) ? OPENAI_GPT_LIVE_VOICES : OPENAI_GPT_LIVE_UNLISTED_VOICES;
}
function isOpenAIGptLiveModel(model) {
	if (!model) return false;
	const normalized = model.trim().toLowerCase();
	return normalized === OPENAI_GPT_LIVE_MODEL_PREFIX || normalized.startsWith(`${OPENAI_GPT_LIVE_MODEL_PREFIX}-`);
}
const OPENAI_QUICKSILVER_CAPABILITIES = {
	transports: ["webrtc", "gateway-relay"],
	handlesAgentConsult: true,
	supportsBargeIn: false,
	handlesInputAudioBargeIn: true,
	supportsActivationNameGating: false,
	supportsToolCalls: false,
	supportsVideoFrames: false
};
function resolveOpenAIQuicksilverVoiceCapabilities(model) {
	return {
		voices: resolveOpenAIQuicksilverVoices(model),
		voiceSelectionPolicy: "allowlist-default"
	};
}
//#endregion
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
//#region extensions/openai/native-web-search-policy.ts
/** Shared by catalog selection and payload construction before any provider request. */
function resolveNativeWebSearch(ctx) {
	const provider = ctx.config?.tools?.web?.search?.provider?.trim().toLowerCase();
	return ctx.config?.tools?.web?.search?.enabled !== false && (!provider || provider === "auto" || provider === "openai") && ctx.api === "openai-responses" && ctx.provider.trim().toLowerCase() === "openai" && (!ctx.baseUrl || isOpenAIApiBaseUrl(ctx.baseUrl));
}
//#endregion
//#region extensions/openai/provider-policy-api.ts
const OPENAI_PROVIDER_ID = "openai";
/** Resolves authored OpenAI provider config without activating the runtime plugin. */
function resolveAuthoredOpenAIProviderConfig(params) {
	if (params.provider.trim().toLowerCase() !== OPENAI_PROVIDER_ID) return;
	const providers = Object.entries(params.config?.models?.providers ?? {});
	const requestedProvider = params.provider.trim();
	const providerKey = providers.find(([providerId]) => providerId.trim() === requestedProvider)?.[0].trim() ?? providers.find(([providerId]) => providerId.trim().toLowerCase() === OPENAI_PROVIDER_ID)?.[0].trim();
	let providerConfig;
	for (const [providerId, candidate] of providers) {
		if (providerId.trim() !== providerKey || !candidate) continue;
		providerConfig = providerConfig ? {
			...providerConfig,
			...candidate,
			models: candidate.models ?? providerConfig.models
		} : candidate;
	}
	return providerConfig;
}
function projectRealtimeVoicePublicProjection(ctx) {
	const model = normalizeOptionalString(ctx.config.model) ?? ctx.providerConfig.model;
	const modelId = typeof model === "string" ? model : void 0;
	if (!isOpenAIGptLiveModel(modelId)) return { config: ctx.config };
	if (isSupportedOpenAIGptLiveModel(modelId)) return {
		config: ctx.config,
		clientHints: { gatewayRelaySupported: ctx.config.consultRouting !== "force-agent-consult" && !normalizeOptionalString(ctx.providerConfig.azureEndpoint) && !normalizeOptionalString(ctx.providerConfig.azureDeployment) }
	};
	const { model: _model, ...publicConfig } = ctx.config;
	return {
		config: publicConfig,
		clientHints: {
			modelSource: "gateway",
			gatewayRelaySupported: false
		}
	};
}
//#endregion
export { OPENAI_PROVIDER_MODERN_MODEL_IDS as A, resolveOpenAIDefaultBaseUrl as B, OPENAI_GPT_55_PRO_MODEL_ID as C, OPENAI_GPT_56_TERRA_MODEL_ID as D, OPENAI_GPT_56_SOL_MODEL_ID as E, OPENAI_CODEX_RESPONSES_BASE_URL as F, classifyOpenAIBaseUrl as I, isOpenAIApiBaseUrl as L, isOpenAISubscriptionOnlyRouteModelId as M, normalizeOpenAIModelRouteId as N, OPENAI_GPT_56_VARIANT_MODEL_IDS as O, resolveOpenAICodexReasoningEfforts as P, isOpenAICodexBaseUrl as R, OPENAI_GPT_55_MODEL_ID as S, OPENAI_GPT_56_MODEL_ID as T, OPENAI_GPT_54_LEGACY_MODEL_ID as _, resolveUnifiedOpenAIThinkingProfile as a, OPENAI_GPT_54_NANO_MODEL_ID as b, OPENAI_QUICKSILVER_CAPABILITIES as c, isOpenAIGptLiveSubscriptionModel as d, resolveOpenAIQuicksilverVoice as f, OPENAI_GPT_53_CODEX_SPARK_MODEL_ID as g, OPENAI_CHAT_LATEST_MODEL_ID as h, resolveOpenAICodexThinkingProfile as i, isOpenAIPlatformOnlyRouteModelId as j, OPENAI_GPT_6_MODEL_IDS as k, isOpenAIGptLiveApiModel as l, OPENAI_CHATGPT_MODERN_MODEL_IDS as m, resolveAuthoredOpenAIProviderConfig as n, modelCatalog as o, resolveOpenAIQuicksilverVoiceCapabilities as p, resolveNativeWebSearch as r, OPENAI_GPT_LIVE_MODELS as s, projectRealtimeVoicePublicProjection as t, isOpenAIGptLiveModel as u, OPENAI_GPT_54_MINI_MODEL_ID as v, OPENAI_GPT_56_LUNA_MODEL_ID as w, OPENAI_GPT_54_PRO_MODEL_ID as x, OPENAI_GPT_54_MODEL_ID as y, isOpenAIHttpsApiBaseUrl as z };
