import { a as resolveClaudeFable5ModelIdentity, i as requiresClaudeMandatoryAdaptiveThinking, l as resolveClaudeSonnet5ModelIdentity, r as requiresClaudeDefaultSampling, s as resolveClaudeMythos5ModelIdentity } from "./src-CZ503MYJ.mjs";
import { n as getAiTransportHost } from "./host-4t713IeR.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-DT5o51ur.mjs";
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region packages/ai/src/utils/prompt-cache-stability.ts
/**
* Prompt-cache normalization helpers. They keep generated prompt sections
* deterministic across platform newlines, trailing whitespace, and input
* ordering.
*/
/** Normalize structured prompt text before hashing or snapshot comparison. */
function normalizeStructuredPromptSection(text) {
	return sanitizeSurrogates(text).replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
function normalizePromptCapabilityIds(capabilities) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const capability of capabilities) {
		const value = normalizeLowercaseStringOrEmpty(normalizeStructuredPromptSection(capability));
		if (!value || seen.has(value)) continue;
		seen.add(value);
		normalized.push(value);
	}
	return normalized.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region packages/ai/src/utils/system-prompt-cache-boundary.ts
/**
* System prompt cache-boundary helpers.
*
* Keeps stable prompt prefixes separate from dynamic runtime additions for provider prompt caching.
*/
const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
	return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
}
function ensureSystemPromptCacheBoundary(systemPrompt) {
	if (systemPrompt.trim().length === 0) return systemPrompt;
	return systemPrompt.includes("\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n") ? systemPrompt : `${systemPrompt}${SYSTEM_PROMPT_CACHE_BOUNDARY}`;
}
function splitSystemPromptCacheBoundary(text) {
	const boundaryIndex = text.indexOf(SYSTEM_PROMPT_CACHE_BOUNDARY);
	if (boundaryIndex === -1) return;
	return {
		stablePrefix: text.slice(0, boundaryIndex).trimEnd(),
		dynamicSuffix: text.slice(boundaryIndex + 34).trimStart()
	};
}
function prependSystemPromptAdditionAfterCacheBoundary(params) {
	const systemPromptAddition = typeof params.systemPromptAddition === "string" ? normalizeStructuredPromptSection(params.systemPromptAddition) : "";
	if (!systemPromptAddition) return params.systemPrompt;
	if (params.systemPrompt.trim().length === 0) return systemPromptAddition;
	const split = splitSystemPromptCacheBoundary(params.systemPrompt);
	if (!split) return `${systemPromptAddition}\n\n${params.systemPrompt}`;
	const dynamicSuffix = split.dynamicSuffix ? normalizeStructuredPromptSection(split.dynamicSuffix) : "";
	if (!dynamicSuffix) return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}`;
	return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}\n\n${dynamicSuffix}`;
}
//#endregion
//#region packages/ai/src/providers/anthropic-model-contract.ts
function normalizeModelId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
	const normalized = normalizeLowercaseStringOrEmpty(api);
	return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
	const responseModelId = normalizeModelId(ref.responseModelId);
	return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
}
function usesClaudeFable5MessagesContract(model) {
	return normalizeApi(model.api) === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
}
/** Return whether streamed output must wait for the terminal refusal decision. */
function usesClaudeStreamingRefusalContract(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return resolveClaudeFable5ModelIdentity(model) !== void 0 || resolveClaudeMythos5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function requiresClaudeAdaptiveThinking(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return requiresClaudeMandatoryAdaptiveThinking(model);
}
/** Return whether omitted thinking should default to adaptive/high. */
function defaultsClaudeAdaptiveThinking(model) {
	return requiresClaudeAdaptiveThinking(model) || normalizeApi(model.api) === "anthropic-messages" && resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
/** Remove Sonnet 5 assistant prefills while preserving completed tool-use turns. */
function prepareClaudeSonnet5RequestContext(model, context) {
	if (!resolveClaudeSonnet5ModelIdentity(model)) return context;
	let end = context.messages.length;
	while (end > 0) {
		const message = context.messages[end - 1];
		if (message?.role !== "assistant" || Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall")) break;
		end -= 1;
	}
	return end === context.messages.length ? context : {
		...context,
		messages: context.messages.slice(0, end)
	};
}
function applyClaudeRequestContract(params, model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return;
	const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
	if (!requiresClaudeDefaultSampling(model) && !sonnet5) return;
	delete params.temperature;
	delete params.top_p;
	delete params.top_k;
	if (sonnet5) delete params.service_tier;
}
function resolveReplayModelBoundIdentity(ref) {
	if (normalizeApi(ref.api) !== "anthropic-messages") return;
	const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : {
		id: ref.modelId,
		params: ref.modelParams
	};
	const fableIdentity = resolveClaudeFable5ModelIdentity(modelRef);
	if (fableIdentity) return `fable:${fableIdentity}`;
	const mythosIdentity = resolveClaudeMythos5ModelIdentity(modelRef);
	if (mythosIdentity) return `mythos:${mythosIdentity}`;
	const sonnetIdentity = resolveClaudeSonnet5ModelIdentity(modelRef);
	return sonnetIdentity ? `sonnet:${sonnetIdentity}` : void 0;
}
function resolveModelBoundThinkingReplayMode(params) {
	const sourceApi = normalizeApi(params.source.api);
	const targetApi = normalizeApi(params.target.api);
	const sourceIdentity = resolveReplayModelBoundIdentity(params.source);
	const targetIdentity = resolveReplayModelBoundIdentity(params.target);
	const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
	if (!sourceIdentity && !targetIdentity) return "default";
	if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) return "preserve";
	return sourceApi === targetApi && sourceIdentity === targetIdentity ? "preserve" : "drop";
}
//#endregion
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
//#region packages/ai/src/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
	const firstEventOptions = options;
	return {
		temperature: options?.temperature,
		maxTokens: options?.maxTokens,
		stop: options?.stop,
		signal: options?.signal,
		apiKey: apiKey || options?.apiKey,
		transport: options?.transport,
		cacheRetention: options?.cacheRetention,
		sessionId: options?.sessionId,
		promptCacheKey: options?.promptCacheKey,
		headers: options?.headers,
		onPayload: options?.onPayload,
		onResponse: options?.onResponse,
		timeoutMs: options?.timeoutMs,
		firstEventTimeoutMs: firstEventOptions?.firstEventTimeoutMs,
		onFirstEventTimeout: firstEventOptions?.onFirstEventTimeout,
		maxRetries: options?.maxRetries,
		maxRetryDelayMs: options?.maxRetryDelayMs,
		metadata: options?.metadata
	};
}
function clampReasoning(effort) {
	return effort === "xhigh" ? "high" : effort;
}
function adjustMaxTokensForThinking(baseMaxTokens, modelMaxTokens, reasoningLevel, customBudgets) {
	const budgets = {
		minimal: 1024,
		low: 2048,
		medium: 8192,
		high: 16384,
		max: 32768,
		...customBudgets
	};
	const minOutputTokens = 1024;
	let thinkingBudget = budgets[clampReasoning(reasoningLevel)];
	const maxTokens = baseMaxTokens === void 0 ? modelMaxTokens : Math.min(baseMaxTokens + thinkingBudget, modelMaxTokens);
	if (maxTokens <= thinkingBudget) thinkingBudget = Math.max(0, maxTokens - minOutputTokens);
	return {
		maxTokens,
		thinkingBudget
	};
}
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
//#endregion
//#region packages/ai/src/providers/tool-result-text.ts
const PROVIDER_TOOL_RESULT_MAX_CHARS = 8e3;
const IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
	"image",
	"image_url",
	"input_image"
]);
const AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
	"audio",
	"input_audio",
	"output_audio"
]);
const MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([...IMAGE_TOOL_RESULT_TYPES, ...AUDIO_TOOL_RESULT_TYPES]);
const INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
const MIME_KEY_CANDIDATES = [
	"mimeType",
	"mime_type",
	"mediaType",
	"media_type",
	"contentType",
	"content_type"
];
const TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
const OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
function readMimeType(value) {
	if (!isRecord(value)) return;
	for (const key of MIME_KEY_CANDIDATES) {
		const mimeType = value[key];
		if (typeof mimeType === "string" && mimeType.trim().length > 0) return mimeType;
	}
}
function isBinaryMimeType(mimeType) {
	const normalized = mimeType.split(";", 1)[0]?.trim().toLowerCase();
	return normalized ? !TEXTUAL_MIME_PATTERN.test(normalized) : false;
}
function describeOmittedValue(value, label) {
	const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
	return length ? `[${label} omitted: ${length} chars]` : `[${label} omitted]`;
}
function redactInlineDataUris(value) {
	return value.replace(INLINE_DATA_URI_PATTERN, (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`);
}
function redactStructuredTextValue(value) {
	const host = getAiTransportHost();
	const redacted = host.redactToolPayloadText(value);
	const trimmed = redacted.trim();
	if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return redacted;
	try {
		const redactedWrapper = host.redactSecrets({ structuredTextValue: JSON.parse(redacted) });
		return JSON.stringify(redactedWrapper.structuredTextValue);
	} catch {
		return redacted;
	}
}
function stringifyStructuredBlock(block) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const redactedBlock = getAiTransportHost().redactSecrets({ structuredToolResult: block }).structuredToolResult;
		const serialized = JSON.stringify(redactedBlock, function structuredToolResultReplacer(key, value) {
			if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) return `[omitted ${key}]`;
			if (key === "data") {
				const mimeType = readMimeType(this);
				if (mimeType && isBinaryMimeType(mimeType)) return describeOmittedValue(value, "binary data");
			}
			if (typeof value === "bigint") return value.toString();
			if (typeof value === "string") return redactInlineDataUris(redactStructuredTextValue(value));
			if (typeof value === "function" || typeof value === "symbol" || value === void 0) return;
			if (!value || typeof value !== "object") return value;
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			return value;
		});
		if (!serialized || serialized === "{}") return;
		return serialized;
	} catch {
		return;
	}
}
function truncateProviderToolText(text) {
	if (text.length <= PROVIDER_TOOL_RESULT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, PROVIDER_TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
function describeToolResultMediaPlaceholder(blocks) {
	let hasImage = false;
	let hasAudio = false;
	for (const block of blocks) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		const type = typeof record.type === "string" ? record.type : void 0;
		const mimeType = readMimeType(record);
		if (type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("image/")) hasImage = true;
		if (type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.toLowerCase().startsWith("audio/")) hasAudio = true;
	}
	if (hasImage && hasAudio) return "(see attached media)";
	if (hasAudio) return "(see attached audio)";
	if (hasImage) return "(see attached image)";
}
function extractToolResultBlockText(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	if (typeof record.type === "string" && MEDIA_ONLY_TOOL_RESULT_TYPES.has(record.type)) return;
	if (record.type === "text") {
		const text = typeof record.text === "string" ? record.text : "";
		return text ? sanitizeSurrogates(text) : void 0;
	}
	const structured = stringifyStructuredBlock(record);
	return structured ? sanitizeSurrogates(truncateProviderToolText(structured)) : void 0;
}
function extractToolResultText(blocks) {
	const explicitTexts = [];
	const structuredTexts = [];
	for (const block of blocks) {
		const text = extractToolResultBlockText(block);
		if (!text) continue;
		if (block.type === "text") explicitTexts.push(text);
		else structuredTexts.push(text);
	}
	if (explicitTexts.length > 0) return sanitizeSurrogates(explicitTexts.join("\n"));
	return sanitizeSurrogates(truncateProviderToolText(structuredTexts.join("\n")));
}
//#endregion
//#region packages/ai/src/providers/transform-messages.ts
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
const NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
	const result = [];
	let previousWasPlaceholder = false;
	for (const block of content) {
		if (block.type === "image") {
			if (!previousWasPlaceholder) result.push({
				type: "text",
				text: placeholder
			});
			previousWasPlaceholder = true;
			continue;
		}
		result.push(block);
		previousWasPlaceholder = block.text === placeholder;
	}
	return result;
}
function downgradeUnsupportedImages(messages, model) {
	if (model.input.includes("image")) return messages;
	return messages.map((msg) => {
		if (msg.role === "user" && Array.isArray(msg.content)) return {
			...msg,
			content: replaceImagesWithPlaceholder(msg.content, NON_VISION_USER_IMAGE_PLACEHOLDER)
		};
		if (msg.role === "toolResult") return {
			...msg,
			content: replaceImagesWithPlaceholder(msg.content, NON_VISION_TOOL_IMAGE_PLACEHOLDER)
		};
		return msg;
	});
}
/**
* Normalize tool call ID for cross-provider compatibility.
* OpenAI Responses API generates IDs that are 450+ chars with special characters like `|`.
* Anthropic APIs require IDs matching ^[a-zA-Z0-9_-]+$ (max 64 chars).
*/
function transformMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const transformed = downgradeUnsupportedImages(messages, model).map((msg) => {
		if (msg.role === "user") return msg;
		if (msg.role === "toolResult") {
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			if (normalizedId && normalizedId !== msg.toolCallId) return Object.assign({}, msg, { toolCallId: normalizedId });
			return msg;
		}
		if (msg.role === "assistant") {
			const assistantMsg = msg;
			const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
				source: {
					provider: assistantMsg.provider,
					api: assistantMsg.api,
					modelId: assistantMsg.model,
					responseModelId: assistantMsg.responseModel
				},
				target: {
					provider: model.provider,
					api: model.api,
					modelId: model.id,
					modelParams: model.params
				}
			});
			const isSameModel = modelBoundThinkingReplayMode === "preserve" || assistantMsg.provider === model.provider && assistantMsg.api === model.api && assistantMsg.model === model.id;
			const transformedContent = (typeof assistantMsg.content === "string" ? [{
				type: "text",
				text: assistantMsg.content
			}] : assistantMsg.content).flatMap((block) => {
				if (block.type === "thinking") {
					if (modelBoundThinkingReplayMode === "drop") return [];
					if (block.redacted) return isSameModel ? block : [];
					if (isSameModel && block.thinkingSignature) return block;
					if (!block.thinking || block.thinking.trim() === "") return [];
					if (isSameModel) return block;
					return {
						type: "text",
						text: block.thinking
					};
				}
				if (block.type === "text") {
					if (isSameModel) return block;
					return {
						type: "text",
						text: block.text
					};
				}
				if (block.type === "toolCall") {
					const toolCall = block;
					let normalizedToolCall = toolCall;
					if (!isSameModel && toolCall.thoughtSignature) {
						normalizedToolCall = Object.assign({}, toolCall);
						delete normalizedToolCall.thoughtSignature;
					}
					if (!isSameModel && normalizeToolCallId) {
						const normalizedId = normalizeToolCallId(toolCall.id, model, assistantMsg);
						if (normalizedId !== toolCall.id) {
							toolCallIdMap.set(toolCall.id, normalizedId);
							normalizedToolCall = Object.assign({}, normalizedToolCall, { id: normalizedId });
						}
					}
					return normalizedToolCall;
				}
				return block;
			});
			return Object.assign({}, assistantMsg, { content: transformedContent });
		}
		return msg;
	});
	const result = [];
	let pendingToolCalls = [];
	let existingToolResultIds = /* @__PURE__ */ new Set();
	const insertSyntheticToolResults = () => {
		if (pendingToolCalls.length > 0) {
			for (const tc of pendingToolCalls) if (!existingToolResultIds.has(tc.id)) result.push({
				role: "toolResult",
				toolCallId: tc.id,
				toolName: tc.name,
				content: [{
					type: "text",
					text: "No result provided"
				}],
				isError: true,
				timestamp: Date.now()
			});
			pendingToolCalls = [];
			existingToolResultIds = /* @__PURE__ */ new Set();
		}
	};
	for (const msg of transformed) if (msg.role === "assistant") {
		insertSyntheticToolResults();
		const assistantMsg = msg;
		if (assistantMsg.stopReason === "error" || assistantMsg.stopReason === "aborted") continue;
		const toolCalls = assistantMsg.content.filter((b) => b.type === "toolCall");
		if (toolCalls.length > 0) {
			pendingToolCalls = toolCalls;
			existingToolResultIds = /* @__PURE__ */ new Set();
		}
		result.push(msg);
	} else if (msg.role === "toolResult") {
		existingToolResultIds.add(msg.toolCallId);
		result.push(msg);
	} else if (msg.role === "user") {
		insertSyntheticToolResults();
		result.push(msg);
	} else result.push(msg);
	insertSyntheticToolResults();
	return result;
}
//#endregion
export { normalizeLowercaseStringOrEmpty as C, normalizeStructuredPromptSection as S, ensureSystemPromptCacheBoundary as _, adjustMaxTokensForThinking as a, stripSystemPromptCacheBoundary as b, isRecord as c, prepareClaudeSonnet5RequestContext as d, requiresClaudeAdaptiveThinking as f, SYSTEM_PROMPT_CACHE_BOUNDARY as g, usesClaudeStreamingRefusalContract as h, extractToolResultText as i, applyClaudeRequestContract as l, usesClaudeFable5MessagesContract as m, describeToolResultMediaPlaceholder as n, buildBaseOptions as o, resolveModelBoundThinkingReplayMode as p, extractToolResultBlockText as r, clampReasoning as s, transformMessages as t, defaultsClaudeAdaptiveThinking as u, prependSystemPromptAdditionAfterCacheBoundary as v, normalizeOptionalString as w, normalizePromptCapabilityIds as x, splitSystemPromptCacheBoundary as y };
