import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { I as hasMediaPayload } from "./host-Dm4e6L6R.mjs";
import { b as responsesServiceTierObserver } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { c as truncateUtf16Safe } from "./provider-error-B7aKA_dg.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-B3kUqQ-q.mjs";
import { n as normalizeStructuredPromptSection } from "./prompt-cache-stability-oTx0nIsh.mjs";
import { a as copyProviderAcceptanceObserver } from "./transport-stream-shared-DPUASGj0.mjs";
import { modelRequestBodyState } from "./internal/model-request-body.mjs";
import { PROVIDER_CONTEXT_HANDOFF, PROVIDER_DEFERRED_TOOL_NAMES, PROVIDER_MODEL_INPUT } from "./provider-types.mjs";
// packages/ai/src/utils/system-prompt-cache-boundary.ts
const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
/** Producer-delimited Runtime facts; instructions must remain outside this region. */
const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY = "\n<!-- OPENCLAW-RELOCATABLE-BOUNDARY -->\n";
const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END = "\n<!-- /OPENCLAW-RELOCATABLE-BOUNDARY -->";
const strippedSystemPrompts = /* @__PURE__ */ new Map();
const MAX_STRIPPED_SYSTEM_PROMPTS = 32;
/** Carry this fact with its session; interleaved sessions cannot evict a live revision. */
function prepareSystemPrompt(text, previous) {
	if (previous?.text === text) return previous;
	let stripped;
	let instructions;
	return Object.freeze({
		text,
		get stripped() {
			return stripped ??= stripSystemPromptCacheBoundary(text);
		},
		get instructions() {
			return instructions ??= sanitizeSurrogates(this.stripped);
		}
	});
}
/** A stream's boundary transform carries the revision it actually passes downstream. */
function createSystemPromptCacheBoundaryStripper() {
	let prepared;
	return (context) => {
		if (!context.systemPrompt) return context;
		const stripped = prepareSystemPrompt(context.systemPrompt, context.preparedSystemPrompt).stripped;
		prepared = prepareSystemPrompt(stripped, prepared);
		return {
			...context,
			systemPrompt: stripped,
			preparedSystemPrompt: prepared
		};
	};
}
function stripSystemPromptCacheBoundary(text) {
	let stripped = strippedSystemPrompts.get(text);
	if (stripped === void 0) {
		stripped = stripSystemPromptRelocatableBoundary(text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n").replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY.trim(), ""));
		for (const oldest of strippedSystemPrompts.keys()) {
			if (strippedSystemPrompts.size < MAX_STRIPPED_SYSTEM_PROMPTS) break;
			strippedSystemPrompts.delete(oldest);
		}
		strippedSystemPrompts.set(text, stripped);
	}
	return stripped;
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
/** Keep the stripped prompt's separator in wire text while marking its stable prefix. */
function splitSystemPromptCacheBoundaryForWire(text) {
	const split = splitSystemPromptCacheBoundary(text);
	if (!split) return;
	const wireText = text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
	if (!split.stablePrefix) return {
		stablePrefix: "",
		dynamicSuffix: wireText
	};
	return split.dynamicSuffix ? {
		stablePrefix: split.stablePrefix,
		dynamicSuffix: wireText.slice(split.stablePrefix.length)
	} : {
		stablePrefix: wireText,
		dynamicSuffix: ""
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
// packages/ai/src/provider-options.ts
const measuredRequestPressures = /* @__PURE__ */ new WeakMap();
/** Request-local pressure admitted by the host's matched provider-usage owner. */
const measuredRequestPressure = {
	set(model, context, tokens) {
		if (tokens === void 0) {
			measuredRequestPressures.delete(context);
			return;
		}
		measuredRequestPressures.set(context, {
			model: {
				provider: model.provider,
				id: model.id,
				api: model.api,
				baseUrl: model.baseUrl
			},
			messages: context.messages,
			tools: context.tools,
			systemPrompt: context.systemPrompt,
			tokens
		});
	},
	get(model, context) {
		const pressure = measuredRequestPressures.get(context);
		return pressure && pressure.model.provider === model.provider && pressure.model.id === model.id && pressure.model.api === model.api && pressure.model.baseUrl === model.baseUrl && pressure.messages === context.messages && pressure.tools === context.tools && pressure.systemPrompt === context.systemPrompt ? pressure.tokens : void 0;
	}
};
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
const PREPARED_REQUEST_SUFFIX = Symbol("preparedRequestSuffix");
/** The caller supplies a captured wire prefix; transport repair must retain its late tool results. */
const preparedRequestSuffix = {
	mark(context, toolCallIds) {
		Reflect.set(context, PREPARED_REQUEST_SUFFIX, toolCallIds);
	},
	has(context) {
		return Reflect.has(context, PREPARED_REQUEST_SUFFIX);
	},
	hasToolCall(context, id) {
		return Reflect.get(context, PREPARED_REQUEST_SUFFIX)?.has(id) ?? false;
	},
	toolCallId(context, id, normalized) {
		const ids = Reflect.get(context, PREPARED_REQUEST_SUFFIX);
		return ids && !ids.has(id) && ids.has(normalized) ? normalized : id;
	}
};
// packages/ai/src/providers/tool-result-text.ts
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
	let structured;
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		structured = JSON.stringify(record, function structuredToolResultReplacer(key, value) {
			if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) return `[omitted ${key}]`;
			if (key === "data") {
				const normalizedMimeType = readMimeType(this)?.split(";", 1)[0]?.trim().toLowerCase();
				if (normalizedMimeType && !TEXTUAL_MIME_PATTERN.test(normalizedMimeType)) {
					const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
					return length ? `[binary data omitted: ${length} chars]` : "[binary data omitted]";
				}
			}
			if (typeof value === "bigint") return value.toString();
			if (typeof value === "string") return value.replace(INLINE_DATA_URI_PATTERN, (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`);
			if (typeof value === "function" || typeof value === "symbol" || value === void 0) return;
			if (!value || typeof value !== "object") return value;
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			return value;
		});
		if (!structured || structured === "{}") return;
	} catch {
		return;
	}
	return sanitizeSurrogates(truncateStructuredToolText(structured));
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
// packages/ai/src/providers/simple-options.ts
function buildBaseOptions(model, options, apiKey) {
	const firstEventOptions = options;
	const baseOptions = {
		[PROVIDER_CONTEXT_HANDOFF]: options?.[PROVIDER_CONTEXT_HANDOFF],
		[PROVIDER_MODEL_INPUT]: options?.[PROVIDER_MODEL_INPUT],
		[PROVIDER_DEFERRED_TOOL_NAMES]: options?.[PROVIDER_DEFERRED_TOOL_NAMES],
		temperature: options?.temperature,
		...options?.serviceTier ? { serviceTier: options.serviceTier } : {},
		maxTokens: options?.maxTokens,
		responseFormat: options?.responseFormat,
		stop: options?.stop,
		signal: options?.signal,
		apiKey: apiKey || options?.apiKey,
		transport: options?.transport,
		cacheRetention: options?.cacheRetention,
		promptCacheTtl: options?.promptCacheTtl,
		sessionId: options?.sessionId,
		promptCacheKey: options?.promptCacheKey,
		headers: options?.headers,
		onPayload: options?.onPayload,
		onResponse: options?.onResponse,
		onProviderWait: options?.onProviderWait,
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
export { splitSystemPromptRelocatableBoundary as C, splitSystemPromptCacheBoundaryForWire as S, stripSystemPromptRelocatableBoundary as T, createSystemPromptCacheBoundaryStripper as _, describeToolResultMediaPlaceholder as a, prependSystemPromptAdditionAfterCacheBoundary as b, extractToolResultText as c, measuredRequestPressure as d, preparedRequestSuffix as f, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END as g, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY as h, clampReasoning as i, formatToolResultText as l, SYSTEM_PROMPT_CACHE_BOUNDARY as m, buildBaseOptions as n, describeUnsupportedToolResultMedia as o, reasoningTagTextPolicy as p, clampMaxTokensToModel as r, extractToolResultBlockText as s, adjustMaxTokensForThinking as t, codeModeToolSurfaceObserver as u, ensureSystemPromptCacheBoundary as v, stripSystemPromptCacheBoundary as w, splitSystemPromptCacheBoundary as x, prepareSystemPrompt as y };
