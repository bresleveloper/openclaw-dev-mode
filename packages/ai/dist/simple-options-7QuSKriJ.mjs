import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-CtgOVOSv.mjs";
import { M as hasMediaPayload, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { g as responsesServiceTierObserver } from "./openai-responses-contracts-BKu8O7l4.mjs";
import { o as truncateUtf16Safe } from "./provider-error-DQBE1bUQ.mjs";
import { P as sanitizeSurrogates, i as copyProviderAcceptanceObserver } from "./transport-stream-shared-CCR7hSW0.mjs";
//#region packages/ai/src/utils/prompt-cache-stability.ts
/**
* Prompt-cache normalization helpers. They keep generated prompt sections
* deterministic across platform newlines, trailing whitespace, and input
* ordering.
*/
/** Canonicalizes provider tool order without relying on host locale settings. */
function sortPromptCacheToolsByName(tools) {
	const compareText = (left, right) => {
		const leftText = left ?? "";
		const rightText = right ?? "";
		return leftText < rightText ? -1 : leftText > rightText ? 1 : 0;
	};
	return tools.toSorted((left, right) => compareText(left.wireName ?? left.name, right.wireName ?? right.name) || compareText(left.description, right.description));
}
/** Normalize structured prompt text before hashing or snapshot comparison. */
function normalizeStructuredPromptSection(text) {
	return sanitizeSurrogates(text).replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
function normalizePromptCapabilityIds(capabilities) {
	const seen = /* @__PURE__ */ new Set();
	for (const capability of capabilities) {
		const value = normalizeLowercaseStringOrEmpty(normalizeStructuredPromptSection(capability));
		if (value) seen.add(value);
	}
	return [...seen].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region packages/ai/src/utils/system-prompt-cache-boundary.ts
const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
/** Producer-delimited Runtime facts; instructions must remain outside this region. */
const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY = "\n<!-- OPENCLAW-RELOCATABLE-BOUNDARY -->\n";
const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END = "\n<!-- /OPENCLAW-RELOCATABLE-BOUNDARY -->";
function stripSystemPromptCacheBoundary(text) {
	return stripSystemPromptRelocatableBoundary(text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n").replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY.trim(), ""));
}
/** Reject ambiguous markers from workspace or hook text instead of moving instructions. */
function splitSystemPromptRelocatableBoundary(text) {
	const opening = SYSTEM_PROMPT_RELOCATABLE_BOUNDARY.trim();
	const closing = SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END.trim();
	const start = text.indexOf(opening);
	const end = text.indexOf(closing);
	if (start === -1 || end < start || text.includes(opening, start + 38) || text.includes(closing, end + 39)) return;
	return {
		remainingPrompt: [text.slice(0, start).trimEnd(), text.slice(end + 39).trimStart()].filter(Boolean).join("\n"),
		relocatable: text.slice(start + 38, end).trim()
	};
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
/** Keep explicit cache breakpoints while removing relocation metadata. */
function stripSystemPromptRelocatableBoundary(text) {
	return text.replaceAll(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY, "\n").replaceAll(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END, "").replaceAll(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY.trim(), "").replaceAll(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END.trim(), "");
}
function prependSystemPromptAdditionAfterCacheBoundary(params) {
	const systemPromptAddition = typeof params.systemPromptAddition === "string" ? normalizeStructuredPromptSection(params.systemPromptAddition) : "";
	if (!systemPromptAddition) return params.systemPrompt;
	if (params.systemPrompt.trim().length === 0) return systemPromptAddition;
	const split = splitSystemPromptCacheBoundary(params.systemPrompt);
	if (!split) return `${systemPromptAddition}\n\n${params.systemPrompt}`;
	const dynamicSuffix = split.dynamicSuffix ? normalizeStructuredPromptSection(split.dynamicSuffix) : "";
	return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}${dynamicSuffix ? `\n\n${dynamicSuffix}` : ""}`;
}
//#endregion
//#region packages/ai/src/providers/tool-result-text.ts
const STRUCTURED_TOOL_RESULT_MAX_CHARS = 8e3;
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
function stringifyStructuredBlock(block) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const host = getAiTransportHost();
		const redactedBlock = host.redactModelVisibleSecrets({ structuredToolResult: block }).structuredToolResult;
		const serialized = JSON.stringify(redactedBlock, function structuredToolResultReplacer(key, value) {
			if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) return `[omitted ${key}]`;
			if (key === "data") {
				const mimeType = readMimeType(this);
				if (mimeType && isBinaryMimeType(mimeType)) return describeOmittedValue(value, "binary data");
			}
			if (typeof value === "bigint") return value.toString();
			if (typeof value === "string") return redactInlineDataUris(host.redactModelVisibleSecrets(value));
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
function truncateStructuredToolText(text) {
	if (text.length <= STRUCTURED_TOOL_RESULT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, STRUCTURED_TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
function classifyToolResultMedia(blocks) {
	let hasImage = false;
	let hasAudio = false;
	for (const block of blocks) {
		if (!hasMediaPayload(block) || block.type === "text") continue;
		const type = typeof block.type === "string" ? block.type : void 0;
		const mimeType = readMimeType(block)?.toLowerCase();
		hasImage ||= Boolean(type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.startsWith("image/"));
		hasAudio ||= Boolean(type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.startsWith("audio/"));
	}
	return {
		hasImage,
		hasAudio
	};
}
function describeToolResultMediaPlaceholder(blocks) {
	const { hasImage, hasAudio } = classifyToolResultMedia(blocks);
	if (hasImage && hasAudio) return "(see attached media)";
	if (hasAudio) return "(see attached audio)";
	return hasImage ? "(see attached image)" : void 0;
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
	return structured ? sanitizeSurrogates(truncateStructuredToolText(structured)) : void 0;
}
function extractToolResultText(blocks, options) {
	const explicitTexts = [];
	const structuredBlocks = [];
	for (const block of blocks) {
		if (!block || typeof block !== "object") continue;
		if (block.type === "text") {
			const text = extractToolResultBlockText(block);
			if (text) explicitTexts.push(text);
		} else structuredBlocks.push(block);
	}
	if (explicitTexts.length > 0 && !options?.includeStructured) return explicitTexts.join("\n");
	const structuredTexts = [];
	for (const block of structuredBlocks) {
		const text = extractToolResultBlockText(block);
		if (text) structuredTexts.push(text);
	}
	if (explicitTexts.length > 0) {
		if (structuredTexts.length > 0) explicitTexts.push(truncateStructuredToolText(structuredTexts.join("\n")));
		return explicitTexts.join("\n");
	}
	return truncateStructuredToolText(structuredTexts.join("\n"));
}
/** Describe media that cannot be represented on the target provider wire. */
function describeUnsupportedToolResultMedia(blocks, support) {
	const { hasImage, hasAudio } = classifyToolResultMedia(blocks);
	const omittedImage = hasImage && !support.images;
	const omittedAudio = hasAudio && !support.audio;
	if (omittedImage && omittedAudio) return "[unsupported tool-result media omitted]";
	if (omittedAudio) return "[unsupported tool-result audio omitted]";
	return omittedImage ? "[unsupported tool-result image omitted]" : void 0;
}
function formatToolResultText(params) {
	const body = params.text.trim() ? `${params.text}${params.omittedMediaPlaceholder ? `\n${params.omittedMediaPlaceholder}` : ""}` : params.omittedMediaPlaceholder ?? params.mediaPlaceholder ?? "(no tool output)";
	return `${params.isError ? "[tool error] " : ""}${body}`;
}
//#endregion
//#region packages/ai/src/provider-options.ts
const CODE_MODE_TOOL_SURFACE_OBSERVER = Symbol("openaiCodeModeToolSurfaceObserver");
const CODE_MODE_TOOL_SURFACE_COLLECTOR = Symbol("openaiCodeModeToolSurfaceCollector");
const STRICT_REASONING_TAG_TEXT = Symbol("openaiStrictReasoningTagText");
function markStrictReasoningTagText(options) {
	Reflect.set(options, STRICT_REASONING_TAG_TEXT, true);
}
function isStrictReasoningTagText(options) {
	return options ? Reflect.get(options, STRICT_REASONING_TAG_TEXT) === true : false;
}
const codeModeToolSurfaceObserver = {
	set(options, observer, collector) {
		Reflect.set(options, CODE_MODE_TOOL_SURFACE_OBSERVER, observer);
		if (collector) Reflect.set(options, CODE_MODE_TOOL_SURFACE_COLLECTOR, collector);
	},
	get(options) {
		if (!options) return;
		const observer = Reflect.get(options, CODE_MODE_TOOL_SURFACE_OBSERVER);
		return typeof observer === "function" ? (observation) => observer(observation) : void 0;
	},
	getCollector(options) {
		if (!options) return;
		const collector = Reflect.get(options, CODE_MODE_TOOL_SURFACE_COLLECTOR);
		return typeof collector === "function" ? (observation) => collector(observation) : void 0;
	}
};
/** Internal output policy for callers that must not recover ambiguous reasoning as visible text. */
const reasoningTagTextPolicy = {
	markStrict: markStrictReasoningTagText,
	isStrict: isStrictReasoningTagText,
	copy(source, target) {
		if (isStrictReasoningTagText(source)) markStrictReasoningTagText(target);
	}
};
//#endregion
//#region packages/ai/src/transports/model-request-body.ts
const REQUEST_BODY = Symbol("modelRequestBody");
/** Call-local state survives option spreads; no payload is cached across requests. */
function modelRequestBodyState(options, inheritFrom) {
	let state = Reflect.get(options, REQUEST_BODY) ?? (inheritFrom && Reflect.get(inheritFrom, REQUEST_BODY));
	if (!state) state = {};
	Reflect.set(options, REQUEST_BODY, state);
	return state;
}
function serializeModelRequestBody(payload) {
	const json = JSON.stringify(payload);
	return {
		body: new TextEncoder().encode(json),
		stream: json !== void 0 && JSON.parse(json)?.stream === true
	};
}
const encodedBodyStreams = /* @__PURE__ */ new WeakMap();
function encodedModelRequestBodyStream(body) {
	return typeof body === "object" && body !== null ? encodedBodyStreams.get(body) : void 0;
}
/** SDK RequestOptions.body overrides encoding while the original params retain stream metadata. */
function prepareModelRequestBody(options) {
	const state = options ? modelRequestBodyState(options) : {};
	state.enabled = true;
	return async (payload) => {
		const encoded = state.encode ? await state.encode(payload) : serializeModelRequestBody(payload);
		state.onBytes?.(encoded.body.byteLength);
		encodedBodyStreams.set(encoded.body, encoded.stream);
		return {
			body: encoded.body,
			headers: { "content-type": "application/json" }
		};
	};
}
//#endregion
//#region packages/ai/src/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
	const firstEventOptions = options;
	const baseOptions = {
		temperature: options?.temperature,
		...options?.serviceTier ? { serviceTier: options.serviceTier } : {},
		maxTokens: options?.maxTokens,
		responseFormat: options?.responseFormat,
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
		maxRetryDelayMs: options?.maxRetryDelayMs,
		metadata: options?.metadata
	};
	reasoningTagTextPolicy.copy(options, baseOptions);
	responsesServiceTierObserver.copy(options, baseOptions);
	modelRequestBodyState(baseOptions, options);
	return copyProviderAcceptanceObserver(options, baseOptions);
}
function clampMaxTokensToModel(model, requestedMaxTokens) {
	return requestedMaxTokens === void 0 ? void 0 : Math.max(1, Math.min(requestedMaxTokens, model.maxTokens ?? requestedMaxTokens));
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
export { stripSystemPromptCacheBoundary as C, sortPromptCacheToolsByName as D, normalizeStructuredPromptSection as E, splitSystemPromptRelocatableBoundary as S, normalizePromptCapabilityIds as T, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY as _, encodedModelRequestBodyStream as a, prependSystemPromptAdditionAfterCacheBoundary as b, serializeModelRequestBody as c, describeToolResultMediaPlaceholder as d, describeUnsupportedToolResultMedia as f, SYSTEM_PROMPT_CACHE_BOUNDARY as g, formatToolResultText as h, clampReasoning as i, codeModeToolSurfaceObserver as l, extractToolResultText as m, buildBaseOptions as n, modelRequestBodyState as o, extractToolResultBlockText as p, clampMaxTokensToModel as r, prepareModelRequestBody as s, adjustMaxTokensForThinking as t, reasoningTagTextPolicy as u, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END as v, stripSystemPromptRelocatableBoundary as w, splitSystemPromptCacheBoundary as x, ensureSystemPromptCacheBoundary as y };
