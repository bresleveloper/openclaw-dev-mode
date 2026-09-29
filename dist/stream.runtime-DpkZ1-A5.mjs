import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as readProviderResponseErrorText } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { p as transformMessages, v as createAssistantMessageEventStream } from "./llm-CLV5ZXaS.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { S as notifyLlmRequestActivity, f as createPlainTextToolCallCompatWrapper } from "./provider-stream-shared-CuBHNQvM.mjs";
import { n as parseJsonPreservingUnsafeIntegers, t as parseJsonObjectPreservingUnsafeIntegers } from "./json-unsafe-integers-BeeNmB5X.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./extension-shared-N0S3ppSB.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { b as parseTerminalToolCallArguments, d as failTransportStream, h as isImageWithMediaPayload, l as describeUnsupportedToolResultMedia, m as formatToolResultText, t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, u as extractToolResultText, v as notifyProviderHttpResponse, w as sortPromptCacheToolsByName } from "./provider-transport-runtime-BWh0ty1f.mjs";
import { m as isOllamaCloudOrigin, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-Dkg1KktH.mjs";
import { n as resolveOllamaBaseUrlForRun } from "./provider-base-url-Crmh7W8f.mjs";
import { d as isOllamaCloudModel, n as buildOllamaBaseUrlSsrFPolicy } from "./provider-models-CxPgc7Wt.mjs";
import { a as resolveOllamaConfiguredNumCtx, c as shouldInjectOllamaCompatNumCtx, d as createKimiInlineReasoningSanitizer, f as isOllamaCloudKimiModelRef, i as resolveOllamaCompatNumCtxEnabled, l as supportsNativeOllamaMax, n as isOllamaCompatProvider, o as resolveOllamaThinkParamValue, s as shouldForwardNativeOllamaThink, t as createConfiguredOllamaCompatStreamWrapper, u as wrapOllamaCompatNumCtx } from "./stream-compat-BLFheAUa.mjs";
import { t as OLLAMA_INCOMPLETE_STREAM_ERROR } from "./stream-contract-CaPxW4Jp.mjs";
import { t as normalizeOllamaWireModelId } from "./model-id-DKXRqH2s.mjs";
import { t as checkNdjsonRecordCap } from "./stream-ndjson-cap-DcEMmBe-.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/ollama/src/sanitizers/visible-content.ts
const noopVisibleContentSanitizer = {
	resolveStreamText(params) {
		return {
			kind: "visible",
			text: params.text
		};
	},
	sanitizeFinalText(text) {
		return text;
	}
};
function createOllamaVisibleContentSanitizer(modelId) {
	if (isOllamaCloudKimiModelRef(modelId)) return createKimiInlineReasoningSanitizer();
	return noopVisibleContentSanitizer;
}
function sanitizeOllamaFinalVisibleContent(params) {
	return createOllamaVisibleContentSanitizer(params.modelId).sanitizeFinalText(params.text);
}
//#endregion
//#region extensions/ollama/src/stream.runtime.ts
const OLLAMA_NATIVE_BASE_URL = OLLAMA_DEFAULT_BASE_URL;
const OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
const OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES = 8192;
const GARBLED_VISIBLE_TEXT_MODEL_RE = /\b(?:glm|kimi)\b/i;
const GARBLED_VISIBLE_TEXT_MIN_CHARS = 80;
const GARBLED_VISIBLE_TEXT_SYMBOL_RE = /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]/gu;
const LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/gu;
function throwIfOllamaStreamAborted(signal) {
	if (signal?.aborted) throw new Error("Request was aborted");
}
function createOllamaStreamCooperativeScheduler(signal) {
	let lastYieldedAt = Date.now();
	let eventsSinceYield = 0;
	return { async afterEvent() {
		throwIfOllamaStreamAborted(signal);
		eventsSinceYield += 1;
		const now = Date.now();
		if (eventsSinceYield < OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS && now - lastYieldedAt < OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS) return;
		eventsSinceYield = 0;
		lastYieldedAt = now;
		await new Promise((resolve) => {
			setTimeout(resolve, 0);
		});
		throwIfOllamaStreamAborted(signal);
	} };
}
function countMatches(text, re) {
	re.lastIndex = 0;
	return Array.from(text.matchAll(re)).length;
}
function maxCharacterFrequency(text) {
	const counts = /* @__PURE__ */ new Map();
	let max = 0;
	for (const char of text) {
		const count = (counts.get(char) ?? 0) + 1;
		counts.set(char, count);
		max = Math.max(max, count);
	}
	return max;
}
function isKnownOllamaGarbledVisibleTextModel(modelId) {
	return GARBLED_VISIBLE_TEXT_MODEL_RE.test(modelId);
}
function isLikelyGarbledVisibleText(params) {
	if (!isKnownOllamaGarbledVisibleTextModel(params.modelId)) return false;
	const compact = params.text.replace(/\s+/g, "");
	if (compact.length < GARBLED_VISIBLE_TEXT_MIN_CHARS) return false;
	const letterOrDigitCount = countMatches(compact, LETTER_OR_DIGIT_RE);
	const symbolCount = countMatches(compact, GARBLED_VISIBLE_TEXT_SYMBOL_RE);
	const maxFrequency = maxCharacterFrequency(compact);
	const letterOrDigitRatio = letterOrDigitCount / compact.length;
	const symbolRatio = symbolCount / compact.length;
	const dominantCharacterRatio = maxFrequency / compact.length;
	return letterOrDigitRatio < .08 && symbolRatio > .6 && (dominantCharacterRatio > .22 || /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]{12,}/u.test(compact));
}
const OLLAMA_OPTION_PARAM_KEYS = /* @__PURE__ */ new Set([
	"num_keep",
	"seed",
	"num_predict",
	"top_k",
	"top_p",
	"min_p",
	"typical_p",
	"repeat_last_n",
	"temperature",
	"repeat_penalty",
	"presence_penalty",
	"frequency_penalty",
	"stop",
	"num_ctx",
	"num_batch",
	"num_gpu",
	"main_gpu",
	"use_mmap",
	"num_thread"
]);
const OLLAMA_TOP_LEVEL_PARAM_KEYS = /* @__PURE__ */ new Set([
	"format",
	"keep_alive",
	"truncate",
	"shift"
]);
/**
* Resolves num_ctx for native /api/chat requests:
*  1. explicit `params.num_ctx` set on the model wins,
*  2. the effective `contextTokens` runtime cap is forwarded when present,
*  3. otherwise Ollama's model, OLLAMA_CONTEXT_LENGTH, VRAM, or Modelfile policy decides.
*
* This intentionally differs from the OpenAI-compat resolver by not falling back
* to a default context size: that fallback is a sane wrapper-side guess for
* the OpenAI-compat path, but native `/api/chat` should not force the full
* advertised `contextWindow`; only an explicit runtime cap or operator override is forwarded.
*/
function resolveOllamaNativeNumCtx(model) {
	const configured = resolveOllamaConfiguredNumCtx(model);
	if (configured !== void 0) return configured;
	const effective = model.contextTokens;
	if (typeof effective !== "number" || !Number.isFinite(effective) || effective <= 0) return;
	return Math.floor(effective);
}
function resolveOllamaModelOptions(model) {
	const options = {};
	const params = model.params;
	if (params && typeof params === "object" && !Array.isArray(params)) for (const [key, value] of Object.entries(params)) {
		if (key === "num_ctx") continue;
		if (value !== void 0 && OLLAMA_OPTION_PARAM_KEYS.has(key)) options[key] = value;
	}
	const numCtx = resolveOllamaNativeNumCtx(model);
	if (numCtx !== void 0) options.num_ctx = numCtx;
	return options;
}
function normalizeOllamaGreedySamplingOptions(options) {
	if (options.temperature !== 0) return;
	if (options.top_p === void 0 || typeof options.top_p === "number" && Number.isFinite(options.top_p) && options.top_p !== 1) options.top_p = 1;
}
function resolveOllamaTopLevelParams(model) {
	const requestParams = {};
	const params = model.params;
	if (params && typeof params === "object" && !Array.isArray(params)) {
		for (const [key, value] of Object.entries(params)) if (value !== void 0 && OLLAMA_TOP_LEVEL_PARAM_KEYS.has(key)) requestParams[key] = value;
	}
	const think = resolveOllamaThinkParamValue(params, supportsNativeOllamaMax(model));
	if (think !== void 0 && shouldForwardNativeOllamaThink(model, think)) requestParams.think = think;
	return Object.keys(requestParams).length > 0 ? requestParams : void 0;
}
function resolveStreamingTextDelta(previousText, nextText) {
	if (!nextText) return "";
	if (!previousText) return nextText;
	if (nextText.startsWith(previousText)) return nextText.slice(previousText.length);
	return nextText;
}
function buildOllamaChatRequest(params) {
	return {
		model: normalizeOllamaWireModelId(params.modelId, params.providerId),
		messages: params.messages,
		stream: params.stream ?? true,
		...params.tools && params.tools.length > 0 ? { tools: params.tools } : {},
		...params.options ? { options: params.options } : {},
		...params.requestParams
	};
}
function resolveOllamaResponseFormat(responseFormat, params) {
	if (!responseFormat || isOllamaCloudModel(params.modelId) || isOllamaCloudOrigin(params.baseUrl)) return;
	if (responseFormat.type === "json_object") return "json";
	if (responseFormat.type === "text") return;
	if (responseFormat.type === "json_schema" && isRecord(responseFormat.json_schema)) {
		const schema = responseFormat.json_schema.schema;
		return isRecord(schema) ? schema : void 0;
	}
	return responseFormat;
}
const CHARS_PER_TOKEN_ESTIMATE = 4;
function buildUsageWithNoCost(params) {
	const input = params.input ?? 0;
	const output = params.output ?? 0;
	return {
		input,
		output,
		cacheRead: params.cacheRead ?? 0,
		cacheWrite: params.cacheWrite ?? 0,
		cacheTelemetry: params.cacheTelemetry ?? (params.cacheRead !== void 0 && params.cacheWrite !== void 0 ? { state: "available" } : { state: "unavailable" }),
		totalTokens: params.totalTokens ?? input + output,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		},
		...params.contextUsage ? { contextUsage: params.contextUsage } : {}
	};
}
function buildStreamAssistantMessage(params) {
	return {
		role: "assistant",
		content: params.content,
		stopReason: params.stopReason,
		api: params.model.api,
		provider: params.model.provider,
		model: params.model.id,
		usage: params.usage,
		timestamp: params.timestamp ?? Date.now()
	};
}
function safeJsonLength(value) {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringChars(serialized) : 0;
	} catch {
		return 0;
	}
}
function estimateTokensFromChars(chars) {
	if (!Number.isFinite(chars) || chars <= 0) return 0;
	return Math.max(1, Math.round(chars / CHARS_PER_TOKEN_ESTIMATE));
}
function resolveOllamaStopReason(response) {
	if (response.done_reason === "length") return "length";
	if (response.message.tool_calls?.length) return "toolUse";
	return "stop";
}
function estimateOllamaPromptTokens(params) {
	let chars = 0;
	for (const message of params.messages) {
		chars += estimateStringChars(message.content);
		chars += message.thinking ? estimateStringChars(message.thinking) : 0;
		chars += safeJsonLength(message.images);
		chars += safeJsonLength(message.tool_calls);
		chars += message.tool_name ? estimateStringChars(message.tool_name) : 0;
	}
	chars += safeJsonLength(params.tools);
	return estimateTokensFromChars(chars);
}
function estimateOllamaCompletionTokens(response, extraOutputChars = 0) {
	return estimateTokensFromChars(extraOutputChars + estimateStringChars(response.message.content) + (response.message.thinking ? estimateStringChars(response.message.thinking) : 0) + (response.message.reasoning ? estimateStringChars(response.message.reasoning) : 0) + safeJsonLength(response.message.tool_calls));
}
function resolveUsageFallback(fallback) {
	return resolveOptionalUsageCount(typeof fallback === "function" ? fallback() : fallback) ?? 0;
}
function resolveOptionalUsageCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function extractOllamaImages(content) {
	if (!Array.isArray(content)) return [];
	return content.filter((part) => part.type === "image").map((part) => part.data);
}
function extractOllamaThinking(content) {
	if (!Array.isArray(content)) return "";
	return content.filter((part) => isRecord(part) && part.type === "thinking" && typeof part.thinking === "string" && !part.redacted).map((part) => part.thinking).join("");
}
function ensureArgsObject(value) {
	return parseJsonObjectPreservingUnsafeIntegers(value) ?? {};
}
function inferOllamaSchemaType(schema) {
	if (schema.properties && isRecord(schema.properties)) return "object";
	if (schema.items) return "array";
	if (Array.isArray(schema.enum) && schema.enum.length > 0) {
		const values = schema.enum.filter((value) => value !== null);
		if (values.length > 0 && values.every((value) => typeof value === "string")) return "string";
		if (values.length > 0 && values.every((value) => typeof value === "number")) return "number";
		if (values.length > 0 && values.every((value) => typeof value === "boolean")) return "boolean";
	}
	for (const unionKey of ["anyOf", "oneOf"]) {
		const variants = schema[unionKey];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			if (!isRecord(variant)) continue;
			const variantType = variant.type;
			if (typeof variantType === "string" && variantType !== "null") return variantType;
			if (Array.isArray(variantType)) {
				const firstType = variantType.find((entry) => typeof entry === "string" && entry !== "null");
				if (firstType) return firstType;
			}
			const inferred = inferOllamaSchemaType(variant);
			if (inferred) return inferred;
		}
	}
}
function normalizeOllamaToolSchema(schema, isRoot = false) {
	if (!isRecord(schema)) return {
		type: "object",
		properties: {}
	};
	const normalized = {};
	for (const [key, value] of Object.entries(schema)) {
		if (key === "properties" && isRecord(value)) {
			normalized.properties = Object.fromEntries(Object.entries(value).map(([propertyName, propertySchema]) => [propertyName, normalizeOllamaToolSchema(propertySchema)]));
			continue;
		}
		if (key === "items") {
			normalized.items = Array.isArray(value) ? value.map((entry) => normalizeOllamaToolSchema(entry)) : normalizeOllamaToolSchema(value);
			continue;
		}
		if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
			normalized[key] = value.map((entry) => normalizeOllamaToolSchema(entry));
			continue;
		}
		normalized[key] = value;
	}
	const schemaType = normalized.type;
	if (typeof schemaType !== "string" && (!Array.isArray(schemaType) || !schemaType.some((entry) => typeof entry === "string" && entry !== "null"))) normalized.type = inferOllamaSchemaType(normalized) ?? (isRoot ? "object" : "string");
	if (normalized.type === "object" && !isRecord(normalized.properties)) normalized.properties = {};
	return normalized;
}
function readOllamaToolCallId(value) {
	return normalizeOptionalString(value);
}
function extractToolCalls(content, options = {}) {
	if (!Array.isArray(content)) return [];
	const parts = content;
	const result = [];
	for (const part of parts) if (part.type === "toolCall") {
		const id = readOllamaToolCallId(part.id);
		result.push({
			...id ? { id } : {},
			function: {
				name: normalizeOllamaToolCallName(part.name, options),
				arguments: ensureArgsObject(part.arguments)
			}
		});
	} else if (part.type === "tool_use") {
		const id = readOllamaToolCallId(part.id);
		result.push({
			...id ? { id } : {},
			function: {
				name: normalizeOllamaToolCallName(part.name, options),
				arguments: ensureArgsObject(part.input)
			}
		});
	}
	return result;
}
function buildOllamaToolNameSet(tools) {
	if (!tools || !Array.isArray(tools)) return;
	const names = /* @__PURE__ */ new Set();
	for (const tool of tools) if (typeof tool.name === "string" && tool.name.trim()) names.add(tool.name.trim());
	return names.size > 0 ? names : void 0;
}
function normalizeOllamaToolCallName(rawName, options = {}) {
	const trimmed = rawName.trim();
	if (!trimmed) return trimmed;
	const availableToolNames = options.availableToolNames;
	if (availableToolNames?.has(trimmed)) return trimmed;
	const strippedAnySeparator = trimmed.replace(/^(?:functions?|tools?)[./_-]+/iu, "").trim();
	if (availableToolNames && strippedAnySeparator !== trimmed && availableToolNames.has(strippedAnySeparator)) return strippedAnySeparator;
	if (availableToolNames) return trimmed;
	return trimmed.replace(/^(?:functions?|tools?)[./]+/iu, "").trim();
}
function convertToOllamaMessages(messages, system, options = {}) {
	const result = [];
	if (system) result.push({
		role: "system",
		content: system
	});
	for (const msg of messages) {
		if (msg.role === "user") {
			const text = extractTextContent(msg.content);
			const images = extractOllamaImages(msg.content);
			result.push({
				role: "user",
				content: text,
				...images.length > 0 ? { images } : {}
			});
			continue;
		}
		if (msg.role === "assistant") {
			const text = extractTextContent(msg.content);
			const thinking = extractOllamaThinking(msg.content);
			const toolCalls = extractToolCalls(msg.content, options);
			result.push({
				role: "assistant",
				content: text,
				...thinking ? { thinking } : {},
				...toolCalls.length > 0 ? { tool_calls: toolCalls } : {}
			});
			continue;
		}
		if (msg.role === "tool" || msg.role === "toolResult") {
			const content = Array.isArray(msg.content) ? msg.content : [{
				type: "text",
				text: typeof msg.content === "string" ? msg.content : ""
			}];
			const text = extractToolResultText(content, { includeStructured: true });
			const images = content.filter(isImageWithMediaPayload).map((part) => part.data);
			const omittedMediaPlaceholder = describeUnsupportedToolResultMedia(content, {
				images: true,
				audio: false
			});
			const mediaPlaceholder = images.length > 0 ? "(see attached image)" : void 0;
			const toolName = typeof msg.toolName === "string" ? msg.toolName : void 0;
			const toolCallId = typeof msg.toolCallId === "string" ? msg.toolCallId : void 0;
			result.push({
				role: "tool",
				content: formatToolResultText({
					text,
					mediaPlaceholder,
					omittedMediaPlaceholder,
					isError: msg.isError === true
				}),
				...images.length > 0 ? { images } : {},
				...toolCallId ? { tool_call_id: toolCallId } : {},
				...toolName ? { tool_name: toolName } : {}
			});
		}
	}
	return result;
}
function extractOllamaTools(tools) {
	if (!tools || !Array.isArray(tools)) return [];
	const result = [];
	for (const tool of sortPromptCacheToolsByName(tools)) {
		if (typeof tool.name !== "string" || !tool.name) continue;
		result.push({
			type: "function",
			function: {
				name: tool.name,
				description: typeof tool.description === "string" ? tool.description : "",
				parameters: normalizeOllamaToolSchema(tool.parameters, true)
			}
		});
	}
	return result;
}
function buildAssistantMessage(response, modelInfo, usageFallback, options = {}) {
	const content = [];
	const thinking = modelInfo.reasoning === false ? "" : response.message.thinking ?? response.message.reasoning ?? "";
	if (thinking) content.push({
		type: "thinking",
		thinking
	});
	const rawText = response.message.content || "";
	const text = options.sanitizeVisibleContent === false ? rawText : sanitizeOllamaFinalVisibleContent({
		modelId: modelInfo.id,
		text: rawText
	});
	if (text) content.push({
		type: "text",
		text
	});
	const toolCalls = response.message.tool_calls;
	if (toolCalls && toolCalls.length > 0) for (const toolCall of toolCalls) content.push({
		type: "toolCall",
		id: readOllamaToolCallId(toolCall.id) ?? `ollama_call_${randomUUID()}`,
		name: normalizeOllamaToolCallName(toolCall.function.name, options),
		arguments: parseTerminalToolCallArguments(toolCall.function.arguments)
	});
	const reportedPromptTokens = resolveOptionalUsageCount(response.prompt_eval_count);
	const reportedOutputTokens = resolveOptionalUsageCount(response.eval_count);
	const promptTokens = reportedPromptTokens ?? resolveUsageFallback(usageFallback?.input);
	const outputTokens = reportedOutputTokens ?? resolveUsageFallback(usageFallback?.output);
	const reportedCacheRead = resolveOptionalUsageCount(response.prompt_eval_cached_count);
	const cacheRead = reportedCacheRead === void 0 ? void 0 : Math.min(reportedCacheRead, promptTokens);
	const contextUsage = reportedPromptTokens !== void 0 && reportedOutputTokens !== void 0 ? {
		state: "available",
		promptTokens,
		totalTokens: promptTokens + outputTokens
	} : void 0;
	return buildStreamAssistantMessage({
		model: modelInfo,
		content,
		stopReason: resolveOllamaStopReason(response),
		usage: buildUsageWithNoCost({
			input: promptTokens - (cacheRead ?? 0),
			output: outputTokens,
			contextUsage,
			...cacheRead === void 0 ? {} : {
				cacheRead,
				cacheWrite: 0,
				totalTokens: promptTokens + outputTokens
			}
		})
	});
}
async function* parseNdjsonStream(reader) {
	const decoder = new TextDecoder("utf-8", { fatal: true });
	let buffer = "";
	let pendingRecordBytes = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			pendingRecordBytes = checkNdjsonRecordCap(value, pendingRecordBytes);
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed) continue;
				yield parseOllamaNdjsonRecord(trimmed);
			}
		}
		buffer += decoder.decode();
		if (buffer.trim()) yield parseOllamaNdjsonRecord(buffer.trim());
	} finally {
		reader.cancel().catch(() => void 0);
		reader.releaseLock();
	}
}
function parseOllamaNdjsonRecord(value) {
	let parsed;
	try {
		parsed = parseJsonPreservingUnsafeIntegers(value);
	} catch {
		throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	}
	if (!isRecord(parsed)) throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	if (typeof parsed.error === "string") {
		const status = typeof parsed.status === "number" && Number.isFinite(parsed.status) ? parsed.status : void 0;
		throw Object.assign(new Error(status === void 0 ? parsed.error : `${status}: ${parsed.error}`), {
			...status === void 0 ? {} : { status },
			body: parsed
		});
	}
	if (!isRecord(parsed.message) || typeof parsed.done !== "boolean") throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	return parsed;
}
function resolveOllamaChatUrl(baseUrl) {
	return `${baseUrl.trim().replace(/\/+$/, "").replace(/\/v1$/i, "") || OLLAMA_NATIVE_BASE_URL}/api/chat`;
}
function resolveOllamaModelHeaders(model) {
	if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
	return model.headers;
}
function resolveOllamaRequestTimeoutMs(model, options) {
	const raw = options?.requestTimeoutMs ?? options?.timeoutMs ?? model.requestTimeoutMs;
	return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : void 0;
}
function createRawOllamaStreamFn(baseUrl, defaultHeaders, localService) {
	const chatUrl = resolveOllamaChatUrl(baseUrl);
	const ssrfPolicy = buildOllamaBaseUrlSsrFPolicy(chatUrl);
	return (model, context, options) => {
		const stream = createAssistantMessageEventStream();
		const run = async () => {
			try {
				const availableToolNames = buildOllamaToolNameSet(context.tools);
				const toolCallNameOptions = availableToolNames ? { availableToolNames } : {};
				const ollamaMessages = convertToOllamaMessages(transformMessages(context.messages ?? [], model), context.systemPrompt, toolCallNameOptions);
				const ollamaTools = extractOllamaTools(context.tools);
				const ollamaOptions = resolveOllamaModelOptions(model);
				if (typeof options?.temperature === "number") ollamaOptions.temperature = options.temperature;
				if (typeof options?.maxTokens === "number") ollamaOptions.num_predict = options.maxTokens;
				if (typeof options?.topP === "number") ollamaOptions.top_p = options.topP;
				if (typeof options?.frequencyPenalty === "number") ollamaOptions.frequency_penalty = options.frequencyPenalty;
				if (typeof options?.presencePenalty === "number") ollamaOptions.presence_penalty = options.presencePenalty;
				if (typeof options?.seed === "number") ollamaOptions.seed = options.seed;
				if (options?.stop && options.stop.length > 0) ollamaOptions.stop = options.stop;
				normalizeOllamaGreedySamplingOptions(ollamaOptions);
				const responseFormat = ollamaTools.length > 0 ? void 0 : resolveOllamaResponseFormat(options?.responseFormat, {
					baseUrl,
					modelId: model.id
				});
				const requestParams = {
					...model.provider !== "ollama-cloud" && !isOllamaCloudModel(model.id) && !isOllamaCloudOrigin(baseUrl) ? {
						truncate: false,
						shift: false
					} : {},
					...resolveOllamaTopLevelParams(model),
					...responseFormat !== void 0 ? { format: responseFormat } : {}
				};
				const body = buildOllamaChatRequest({
					modelId: model.id,
					providerId: model.provider,
					messages: ollamaMessages,
					stream: true,
					tools: ollamaTools,
					options: ollamaOptions,
					requestParams
				});
				const replacement = await options?.onPayload?.(body, model);
				const requestBody = replacement === void 0 ? body : replacement;
				const headers = {
					"Content-Type": "application/json",
					...defaultHeaders,
					...options?.headers
				};
				if (options?.apiKey && (!headers.Authorization || !isNonSecretApiKeyMarker(options.apiKey))) headers.Authorization = `Bearer ${options.apiKey}`;
				const requestTimeoutMs = resolveOllamaRequestTimeoutMs(model, options);
				const acquisitionDeadline = localService ? buildTimeoutAbortSignal({
					timeoutMs: requestTimeoutMs,
					signal: options?.signal,
					operation: "ollama-stream.local-service"
				}) : void 0;
				const localServiceLease = await localService?.acquire({
					providerId: localService.providerId,
					baseUrl,
					headers
				}, acquisitionDeadline?.signal).finally(acquisitionDeadline?.cleanup);
				const { response, release, refreshTimeout } = await fetchWithSsrFGuard({
					url: chatUrl,
					init: {
						method: "POST",
						headers,
						body: JSON.stringify(requestBody)
					},
					policy: ssrfPolicy,
					...options?.signal ? { signal: options.signal } : {},
					timeoutMs: requestTimeoutMs,
					auditContext: "ollama-stream.chat"
				}).catch((error) => {
					localServiceLease?.release();
					throw error;
				});
				try {
					await notifyProviderHttpResponse({
						options,
						response,
						model
					});
					if (!response.ok) {
						const errorText = await readProviderResponseErrorText(response, OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES, headers).catch(() => "unknown error");
						throw Object.assign(/* @__PURE__ */ new Error(`${response.status} ${errorText}`), {
							status: response.status,
							body: errorText
						});
					}
					if (!response.body) throw new Error("Ollama API returned empty response body");
					const reader = response.body.getReader();
					let accumulatedRawContent = "";
					let accumulatedVisibleContent = "";
					let accumulatedThinking = "";
					let suppressedThinking = "";
					const accumulatedToolCalls = [];
					const streamedToolCalls = [];
					let finalResponse;
					let pendingFinalVisibleContent;
					const modelInfo = {
						api: model.api,
						provider: model.provider,
						id: model.id,
						reasoning: model.reasoning
					};
					const shouldEmitThinking = model.reasoning ?? true;
					const visibleContentSanitizer = createOllamaVisibleContentSanitizer(model.id);
					const cooperativeScheduler = createOllamaStreamCooperativeScheduler(options?.signal);
					let streamStarted = false;
					let thinkingStarted = false;
					let thinkingEnded = false;
					let textBlockStarted = false;
					let textBlockClosed = false;
					const textContentIndex = () => thinkingStarted ? 1 : 0;
					const buildCurrentContent = () => {
						const parts = [];
						if (accumulatedThinking) parts.push({
							type: "thinking",
							thinking: accumulatedThinking
						});
						if (accumulatedVisibleContent) parts.push({
							type: "text",
							text: accumulatedVisibleContent
						});
						parts.push(...streamedToolCalls);
						return parts;
					};
					const ensureStreamStarted = () => {
						if (streamStarted) return;
						streamStarted = true;
						const emptyPartial = buildStreamAssistantMessage({
							model: modelInfo,
							content: [],
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "start",
							partial: emptyPartial
						});
					};
					const closeThinkingBlock = () => {
						if (!thinkingStarted || thinkingEnded) return;
						thinkingEnded = true;
						const partial = buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "thinking_end",
							contentIndex: 0,
							content: accumulatedThinking,
							partial
						});
					};
					const closeTextBlock = () => {
						if (!textBlockStarted || textBlockClosed) return;
						textBlockClosed = true;
						const partial = buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "text_end",
							contentIndex: textContentIndex(),
							content: accumulatedVisibleContent,
							partial
						});
					};
					const flushVisibleText = (nextVisibleContent) => {
						if (nextVisibleContent === void 0) return;
						const delta = resolveStreamingTextDelta(accumulatedVisibleContent, nextVisibleContent);
						if (!delta) return;
						if (thinkingStarted && !thinkingEnded) closeThinkingBlock();
						ensureStreamStarted();
						if (!textBlockStarted) {
							textBlockStarted = true;
							const partial = buildStreamAssistantMessage({
								model: modelInfo,
								content: buildCurrentContent(),
								stopReason: "stop",
								usage: buildUsageWithNoCost({})
							});
							stream.push({
								type: "text_start",
								contentIndex: textContentIndex(),
								partial
							});
						}
						accumulatedVisibleContent = nextVisibleContent;
						stream.push({
							type: "text_delta",
							contentIndex: textContentIndex(),
							delta
						});
					};
					const resolveVisibleContent = (final) => {
						const resolution = visibleContentSanitizer.resolveStreamText({
							text: accumulatedRawContent,
							final
						});
						if (resolution.kind === "pending") return;
						return resolution.text;
					};
					for await (const chunk of parseNdjsonStream(reader)) {
						throwIfOllamaStreamAborted(options?.signal);
						notifyLlmRequestActivity(options?.signal);
						if (finalResponse) throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
						refreshTimeout?.();
						const thinkingDelta = chunk.message?.thinking ?? chunk.message?.reasoning;
						if (thinkingDelta && shouldEmitThinking) {
							ensureStreamStarted();
							if (!thinkingStarted) {
								thinkingStarted = true;
								const partial = buildStreamAssistantMessage({
									model: modelInfo,
									content: buildCurrentContent(),
									stopReason: "stop",
									usage: buildUsageWithNoCost({})
								});
								stream.push({
									type: "thinking_start",
									contentIndex: 0,
									partial
								});
							}
							accumulatedThinking += thinkingDelta;
							const partial = buildStreamAssistantMessage({
								model: modelInfo,
								content: buildCurrentContent(),
								stopReason: "stop",
								usage: buildUsageWithNoCost({})
							});
							stream.push({
								type: "thinking_delta",
								contentIndex: 0,
								delta: thinkingDelta,
								partial
							});
						}
						if (thinkingDelta && !shouldEmitThinking) suppressedThinking += thinkingDelta;
						if (chunk.message?.content) {
							const rawDelta = chunk.message.content;
							accumulatedRawContent += rawDelta;
							flushVisibleText(resolveVisibleContent(false));
						}
						if (chunk.message?.tool_calls?.length) {
							flushVisibleText(resolveVisibleContent(true));
							closeThinkingBlock();
							closeTextBlock();
							for (const rawToolCall of chunk.message.tool_calls) {
								const id = readOllamaToolCallId(rawToolCall.id) ?? `ollama_call_${randomUUID()}`;
								accumulatedToolCalls.push({
									...rawToolCall,
									id
								});
							}
						}
						if (chunk.done) {
							pendingFinalVisibleContent = resolveVisibleContent(true);
							finalResponse = chunk;
							continue;
						}
						await cooperativeScheduler.afterEvent();
					}
					if (!finalResponse) throw new Error(OLLAMA_INCOMPLETE_STREAM_ERROR);
					if (pendingFinalVisibleContent !== void 0 && isLikelyGarbledVisibleText({
						text: pendingFinalVisibleContent,
						modelId: model.id
					})) throw new Error(`Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`);
					flushVisibleText(pendingFinalVisibleContent);
					if (isLikelyGarbledVisibleText({
						text: accumulatedVisibleContent,
						modelId: model.id
					})) throw new Error(`Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`);
					finalResponse.message.content = accumulatedVisibleContent;
					if (accumulatedThinking) finalResponse.message.thinking = accumulatedThinking;
					if (finalResponse.done_reason === "length") delete finalResponse.message.tool_calls;
					else if (accumulatedToolCalls.length > 0) finalResponse.message.tool_calls = accumulatedToolCalls;
					const completedResponse = finalResponse;
					const assistantMessage = buildAssistantMessage(finalResponse, modelInfo, {
						input: () => estimateOllamaPromptTokens({
							messages: ollamaMessages,
							tools: ollamaTools
						}),
						output: () => estimateOllamaCompletionTokens(completedResponse, estimateStringChars(suppressedThinking))
					}, {
						...toolCallNameOptions,
						sanitizeVisibleContent: false
					});
					closeThinkingBlock();
					closeTextBlock();
					const reason = resolveOllamaStopReason(finalResponse);
					if (reason === "toolUse") for (const completedToolCall of assistantMessage.content) {
						if (completedToolCall.type !== "toolCall") continue;
						ensureStreamStarted();
						const placeholder = {
							...completedToolCall,
							arguments: {}
						};
						streamedToolCalls.push(placeholder);
						const contentIndex = buildCurrentContent().length - 1;
						const partial = () => buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "toolcall_start",
							contentIndex,
							partial: partial()
						});
						streamedToolCalls[streamedToolCalls.length - 1] = completedToolCall;
						stream.push({
							type: "toolcall_delta",
							contentIndex,
							delta: JSON.stringify(completedToolCall.arguments),
							partial: partial()
						});
						stream.push({
							type: "toolcall_end",
							contentIndex,
							toolCall: completedToolCall,
							partial: partial()
						});
					}
					stream.push({
						type: "done",
						reason,
						message: assistantMessage
					});
				} finally {
					try {
						await release();
					} finally {
						localServiceLease?.release();
					}
				}
			} catch (err) {
				const stopReason = options?.signal?.aborted ? "aborted" : "error";
				failTransportStream({
					stream,
					signal: options?.signal,
					error: err,
					output: buildStreamAssistantMessage({
						model,
						content: [],
						stopReason,
						usage: buildUsageWithNoCost({})
					})
				});
			} finally {
				stream.end();
			}
		};
		queueMicrotask(() => void run());
		return stream;
	};
}
function createOllamaStreamFn(baseUrl, defaultHeaders) {
	return createPlainTextToolCallCompatWrapper(createRawOllamaStreamFn(baseUrl, defaultHeaders));
}
function createConfiguredOllamaStreamFn(params) {
	const modelBaseUrl = readStringValue(params.model.baseUrl)?.trim();
	const baseUrl = resolveOllamaBaseUrlForRun({
		modelBaseUrl,
		providerBaseUrl: params.providerBaseUrl
	});
	return createPlainTextToolCallCompatWrapper(createRawOllamaStreamFn(baseUrl, resolveOllamaModelHeaders(params.model), params.providerBaseUrl?.trim() || !modelBaseUrl ? params.localService : void 0));
}
//#endregion
export { OLLAMA_NATIVE_BASE_URL, buildAssistantMessage, buildOllamaChatRequest, convertToOllamaMessages, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn, createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream, resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
