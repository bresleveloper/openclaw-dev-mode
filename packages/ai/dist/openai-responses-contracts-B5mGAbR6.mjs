import { i as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE } from "./types-BXd0kI8-.mjs";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { o as normalizeOptionalString, r as normalizeLowercaseStringOrEmpty } from "./string-coerce-Cj8sqWHx.mjs";
//#region packages/llm-core/src/model-data.ts
const MODEL_DATA_APIS = [
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-interactions",
	"google-vertex",
	"github-copilot",
	"bedrock-converse-stream",
	"ollama",
	"pi-messages",
	"azure-openai-responses"
];
const MODEL_DATA_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
const MODEL_DATA_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-types.ts
const OPENAI_ULTRAFAST_CONTEXT_TOKENS = 26e4;
/** Prompt capacity for models served through a context-limited processing tier. */
function resolveModelServiceTierContextTokens(provider, serviceTier) {
	return provider === "openai" && serviceTier === "ultrafast" ? OPENAI_ULTRAFAST_CONTEXT_TOKENS : void 0;
}
[...MODEL_DATA_APIS];
[...MODEL_DATA_THINKING_FORMATS];
const MODEL_CATALOG_THINKING_LEVELS = [...MODEL_DATA_THINKING_LEVELS];
const OPENAI_THINKING_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses"
]);
/** Managed API aliases retain the source adapter's reasoning contract. */
function resolveOpenAIThinkingApi(api) {
	if (typeof api !== "string") return;
	const sourceApi = api.replace(/^openclaw-(.+)-transport$/u, "$1");
	return OPENAI_THINKING_APIS.has(sourceApi) ? sourceApi : void 0;
}
/** Map keys describe logical choices; provider-native values retain their spelling. */
function listMappedModelThinkingLevels(model) {
	const compat = asOptionalRecord(model.compat);
	const efforts = compat?.supportedReasoningEfforts;
	const api = resolveOpenAIThinkingApi(model.api);
	const format = compat?.thinkingFormat;
	if (!api || api === "openai-completions" && (format === "qwen" || format === "qwen-chat-template" || format === "zai") || compat?.supportsReasoningEffort === false || Array.isArray(efforts) && efforts.length === 0) return [];
	const mapping = asOptionalRecord(compat?.reasoningEffortMap);
	const mapped = new Set(Object.entries(mapping ?? {}).flatMap(([level, effort]) => typeof effort === "string" && effort.trim() ? [level.trim().toLowerCase()] : []));
	return MODEL_CATALOG_THINKING_LEVELS.filter((level) => mapped.has(level));
}
//#endregion
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Normalizes array-backed string lists and rejects non-array input as empty. */
function normalizeTrimmedStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const normalized = normalizeOptionalString(entry);
		return normalized ? [normalized] : [];
	});
}
/** Normalizes an array-backed string list and removes duplicates. */
function normalizeUniqueTrimmedStringList(value) {
	return uniqueStrings(normalizeTrimmedStringList(value));
}
//#endregion
//#region packages/ai/src/providers/openai-reasoning-effort.ts
/**
* OpenAI-compatible reasoning-effort normalization. Different GPT families
* expose different accepted effort enums, so callers map requested values here
* before constructing provider payloads.
*/
const ENABLED_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_5_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high"
];
const GPT_51_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high"
];
const GPT_52_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_56_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_6_MANDATORY_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_CODEX_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_PRO_REASONING_EFFORTS = [
	"medium",
	"high",
	"xhigh"
];
const GPT_5_PRO_REASONING_EFFORTS = ["high"];
const GPT_51_CODEX_MAX_REASONING_EFFORTS = [
	"none",
	"medium",
	"high",
	"xhigh"
];
const GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
const GENERIC_REASONING_EFFORTS = [
	"low",
	"medium",
	"high"
];
const CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
	"none",
	...ENABLED_REASONING_EFFORTS,
	"off"
]);
function normalizeModelId(id) {
	return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
/** Return whether a model is the GPT-5.4 mini family. */
function isOpenAIGpt54MiniModel(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return /^gpt-5\.4-mini(?:-|$)/u.test(id);
}
/** Return whether a model is the GPT-5.5 family. */
function isOpenAIGpt55Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
	return /^gpt-5\.5(?:-|$)/u.test(id) || /^gpt-5\.5(?:\s|\(|-|$)/u.test(name);
}
/** Return whether a model is the GPT-5.6 family. */
function isOpenAIGpt56Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const name = normalizeModelId(typeof model.name === "string" ? model.name : void 0);
	return /^gpt-5\.6(?:-|$)/u.test(id) || /^gpt-5\.6(?:\s|\(|-|$)/u.test(name);
}
/** Apply the native Chat Completions tool contract after callers qualify the endpoint and model ID. */
function applyOpenAICompletionsToolReasoning(payload, model) {
	if (!Array.isArray(payload.tools) || payload.tools.length === 0) return;
	if (isOpenAIGpt56Model(model)) payload.reasoning_effort = "none";
	else if (isOpenAIGpt54MiniModel(model) || isOpenAIGpt55Model(model)) delete payload.reasoning_effort;
}
/** Return whether a model has a known GPT-6 reasoning and sampling contract. */
function isOpenAIGpt6Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return id === "gpt-6-astra" || id === "gpt-6-sol" || id === "gpt-6-luna" || id === "gpt-6.1-sol";
}
/** Normalize user-facing reasoning effort names to API effort names. */
function normalizeOpenAIReasoningEffort(effort) {
	const trimmed = effort.trim();
	const folded = trimmed.toLowerCase();
	return CANONICAL_REASONING_EFFORTS.has(folded) ? folded : trimmed;
}
function readCompatReasoningEfforts(compat) {
	if (!compat || typeof compat !== "object") return;
	if (compat.supportsReasoningEffort === false) return [];
	const raw = compat.supportedReasoningEfforts;
	if (!Array.isArray(raw)) return;
	return normalizeUniqueTrimmedStringList(raw);
}
function isDisabledReasoningEffort(effort) {
	return effort === "none" || effort === "off";
}
/** Resolve the reasoning efforts accepted by a specific OpenAI-compatible model. */
function resolveOpenAISupportedReasoningEfforts(model) {
	return resolveOpenAIModelReasoningEfforts(model) ?? GENERIC_REASONING_EFFORTS;
}
/** Read a declared or known model contract, leaving unknown compatible models unspecified. */
function resolveOpenAIModelReasoningEfforts(model) {
	const compatEfforts = readCompatReasoningEfforts(model.compat);
	if (compatEfforts) return compatEfforts;
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const api = resolveOpenAIThinkingApi(model.api);
	const supportsMax = api !== "openai-completions";
	if (isOpenAIGpt6Model(model) && api !== "azure-openai-responses") {
		if (id === "gpt-6-astra" || id === "gpt-6.1-sol") return supportsMax ? GPT_6_MANDATORY_REASONING_EFFORTS : GPT_CODEX_REASONING_EFFORTS;
		return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	}
	if (/^gpt-5\.6(?:-|$)/u.test(id)) return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-mini") return GPT_51_CODEX_MINI_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-max") return GPT_51_CODEX_MAX_REASONING_EFFORTS;
	if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) return GPT_CODEX_REASONING_EFFORTS;
	if (id === "gpt-5-pro") return GPT_5_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) return GPT_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) return GPT_52_REASONING_EFFORTS;
	if (/^gpt-5\.1(?:-|$)/u.test(id)) return GPT_51_REASONING_EFFORTS;
	if (/^gpt-5(?:-|$)/u.test(id)) return GPT_5_REASONING_EFFORTS;
}
/**
* Return whether a model accepts temperature. GPT-5.6 and known GPT-6 models
* reject it with a 400; catalog compat can override per model.
*/
function supportsOpenAITemperature(model) {
	const compat = model.compat;
	if (compat && typeof compat === "object") {
		const declared = compat.supportsTemperature;
		if (typeof declared === "boolean") return declared;
	}
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return (!isOpenAIGpt6Model(model) || resolveOpenAIThinkingApi(model.api) === "azure-openai-responses") && !/^gpt-5\.6(?:-|$)/u.test(id);
}
/** Return whether a model accepts a requested reasoning effort. */
function supportsOpenAIReasoningEffort(model, effort) {
	return resolveOpenAISupportedReasoningEfforts(model).includes(normalizeOpenAIReasoningEffort(effort));
}
/** Read provider mappings without folding provider-native labels. */
function resolveOpenAIReasoningEffortMapping(effort, mapping) {
	const requested = normalizeOpenAIReasoningEffort(effort);
	return mapping?.[requested] ?? (mapping && CANONICAL_REASONING_EFFORTS.has(requested) ? Object.entries(mapping).find(([key]) => normalizeOpenAIReasoningEffort(key) === requested)?.[1] : void 0);
}
/** Resolve a requested reasoning effort to the closest value supported by the model. */
function resolveOpenAIReasoningEffortForModel(params) {
	const requested = normalizeOpenAIReasoningEffort(params.effort);
	const mapped = resolveOpenAIReasoningEffortMapping(requested, params.fallbackMap);
	const normalized = mapped === void 0 ? requested : mapped.trim();
	const supported = resolveOpenAISupportedReasoningEfforts(params.model);
	if (supported.includes(normalized)) return normalized;
	if (requested === "off" && supported.includes("none")) return "none";
	if (isDisabledReasoningEffort(requested) || isDisabledReasoningEffort(normalized)) return;
	const requestedRank = ENABLED_REASONING_EFFORTS.findIndex((effort) => effort === normalized);
	const ranked = ENABLED_REASONING_EFFORTS.filter((effort) => supported.includes(effort));
	return (requestedRank < 0 ? void 0 : ranked.findLast((effort) => ENABLED_REASONING_EFFORTS.indexOf(effort) <= requestedRank) ?? ranked[0]) ?? supported.find((effort) => !isDisabledReasoningEffort(normalizeOpenAIReasoningEffort(effort)));
}
//#endregion
//#region packages/ai/src/transports/openai-responses-service-tier.ts
/** Only an explicit parameter rejection permits resending at a slower tier. */
function isResponsesServiceTierRejection(error) {
	if (!isRecord(error)) return false;
	const detail = isRecord(error.error) ? error.error : error;
	const status = error.status ?? detail.status;
	if (status !== void 0 && status !== 400 && status !== 422) return false;
	return (detail.type === "invalid_request_error" || detail.code === "invalid_request_error" || detail.code === "unsupported_parameter" || detail.code === "unsupported_value" || detail.code === "invalid_value" || detail.code === "invalid_prompt" && detail.message === "Invalid service_tier argument" || detail.code === null && detail.param === "service_tier" && (detail.type === "error" || detail.type === void 0) || status === 400 || status === 422) && (detail.param === "service_tier" || detail.message === "Invalid service_tier argument");
}
function nextResponsesServiceTier(requestedTier, error) {
	if (!isResponsesServiceTierRejection(error)) return;
	return requestedTier === "ultrafast" ? "priority" : requestedTier === "priority" ? "default" : void 0;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-contracts.ts
const DEFAULT_AZURE_OPENAI_API_VERSION = "preview";
const OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS = "Follow the user request.";
const AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS = 3e4;
const RESPONSE_FAILED_NO_DETAILS_MESSAGE = "Unknown error (no error details in response)";
const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
const OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY = "openclawReasoningReplay";
const RESPONSES_RETAINED_USER = Symbol("responsesRetainedUser");
const OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE = "openai-responses-compaction";
const OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE = "openai-responses-retained-compaction";
const OPENAI_RESPONSES_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"azure-openai-responses",
	"openai-chatgpt-responses",
	"openclaw-openai-responses-transport",
	"openclaw-openai-chatgpt-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
var OpenAIResponsesWebSocketPreDispatchError = class extends Error {
	constructor(cause) {
		super("OpenAI Responses WebSocket failed before request dispatch", { cause });
		this.name = "OpenAIResponsesWebSocketPreDispatchError";
	}
};
var OpenAIResponsesWebSocketPostDispatchError = class extends Error {
	constructor(cause) {
		super("OpenAI Responses WebSocket failed after request dispatch; outcome is unknown", { cause });
		this.code = PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE;
		this.name = "OpenAIResponsesWebSocketPostDispatchError";
	}
};
var OpenAIResponsesWebSocketServerError = class extends Error {
	constructor(code, status, param, message, cause) {
		super(message, { cause });
		this.code = code;
		this.status = status;
		this.param = param;
		this.name = "OpenAIResponsesWebSocketServerError";
	}
};
var OpenAIResponsesWebSocketSafeRetryError = class extends OpenAIResponsesWebSocketServerError {};
function readWebSocketServerError(value) {
	if (!isRecord(value) || value.type !== "error") return;
	const details = isRecord(value.error) ? value.error : value;
	const code = typeof details.code === "string" ? details.code : isResponsesServiceTierRejection(details) ? "invalid_request_error" : void 0;
	if (!code || typeof details.message !== "string") return;
	const rawStatus = value.status ?? value.status_code;
	return {
		code,
		message: details.message,
		param: typeof details.param === "string" ? details.param : null,
		status: typeof rawStatus === "number" ? rawStatus : void 0
	};
}
function isPreviousResponseRejection(error) {
	return error.code === "previous_response_not_found" || error.code === "unsupported_parameter" && error.param === "previous_response_id";
}
function parseOpenAIResponsesWebSocketServerError(cause) {
	if (!isRecord(cause)) return;
	let details = readWebSocketServerError(cause.error) ?? readWebSocketServerError(cause);
	if (!details && typeof cause.message === "string") try {
		details = readWebSocketServerError(JSON.parse(cause.message));
	} catch {}
	if (!details) return;
	return new (isPreviousResponseRejection(details) || isResponsesServiceTierRejection(details) || details.code === "websocket_connection_limit_reached" || details.code === "invalid_encrypted_content" || details.code === "thinking_signature_invalid" ? OpenAIResponsesWebSocketSafeRetryError : OpenAIResponsesWebSocketServerError)(details.code, details.status, details.param, details.message, cause);
}
const PROMPT_OBSERVER = Symbol("openaiResponsesPromptObserver");
const responsesPromptObserver = {
	set(options, observer) {
		Reflect.set(options, PROMPT_OBSERVER, observer);
	},
	get(options) {
		return Reflect.get(options, PROMPT_OBSERVER);
	},
	copy(source, target) {
		const observer = source && responsesPromptObserver.get(source);
		if (observer) responsesPromptObserver.set(target, observer);
	}
};
const SERVICE_TIER_OBSERVER = Symbol("openaiResponsesServiceTierObserver");
const responsesServiceTierObserver = {
	set(options, observer) {
		Reflect.set(options, SERVICE_TIER_OBSERVER, observer);
	},
	get(options) {
		return Reflect.get(options, SERVICE_TIER_OBSERVER);
	},
	copy(source, target) {
		const observer = source && responsesServiceTierObserver.get(source);
		if (observer) responsesServiceTierObserver.set(target, observer);
	},
	reject(options, requestedTier) {
		(options && responsesServiceTierObserver.get(options))?.({
			requestedTier,
			rejected: true
		});
	},
	observe(options, requestedTier, responseTier, response) {
		const observer = options && responsesServiceTierObserver.get(options);
		if (observer && typeof requestedTier === "string" && /^[a-z0-9_-]{1,64}$/i.test(requestedTier) && typeof responseTier === "string" && /^[a-z0-9_-]{1,64}$/i.test(responseTier)) observer({
			requestedTier,
			responseTier,
			...response && {
				responseId: response.id,
				responseModel: response.model,
				inputTokens: response.usage?.input_tokens,
				cachedTokens: response.usage?.input_tokens_details?.cached_tokens
			}
		});
	}
};
//#endregion
export { supportsOpenAIReasoningEffort as A, isOpenAIGpt56Model as C, resolveOpenAIReasoningEffortForModel as D, resolveOpenAIModelReasoningEfforts as E, listMappedModelThinkingLevels as F, resolveModelServiceTierContextTokens as I, resolveOpenAIThinkingApi as L, normalizeStringEntries as M, uniqueValues as N, resolveOpenAIReasoningEffortMapping as O, MODEL_CATALOG_THINKING_LEVELS as P, isOpenAIGpt55Model as S, normalizeOpenAIReasoningEffort as T, responsesServiceTierObserver as _, OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE as a, applyOpenAICompletionsToolReasoning as b, OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE as c, OpenAIResponsesWebSocketSafeRetryError as d, RESPONSES_RETAINED_USER as f, responsesPromptObserver as g, parseOpenAIResponsesWebSocketServerError as h, OPENAI_RESPONSES_APIS as i, supportsOpenAITemperature as j, resolveOpenAISupportedReasoningEfforts as k, OpenAIResponsesWebSocketPostDispatchError as l, isPreviousResponseRejection as m, DEFAULT_AZURE_OPENAI_API_VERSION as n, OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY as o, RESPONSE_FAILED_NO_DETAILS_MESSAGE as p, OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS as r, OPENAI_RESPONSES_REASONING_REPLAY_META_KEY as s, AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS as t, OpenAIResponsesWebSocketPreDispatchError as u, isResponsesServiceTierRejection as v, isOpenAIGpt6Model as w, isOpenAIGpt54MiniModel as x, nextResponsesServiceTier as y };
