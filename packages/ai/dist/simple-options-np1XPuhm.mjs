import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-fsri9iCu.mjs";
import { v as sanitizeSurrogates } from "./host-yTvBrYM2.mjs";
import { i as copyProviderAcceptanceObserver } from "./transport-stream-shared-B5RioB_Q.mjs";
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
	if (!dynamicSuffix) return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}`;
	return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}\n\n${dynamicSuffix}`;
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
export { normalizeStructuredPromptSection as _, codeModeToolSurfaceObserver as a, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY as c, prependSystemPromptAdditionAfterCacheBoundary as d, splitSystemPromptCacheBoundary as f, normalizePromptCapabilityIds as g, stripSystemPromptRelocatableBoundary as h, clampReasoning as i, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END as l, stripSystemPromptCacheBoundary as m, buildBaseOptions as n, reasoningTagTextPolicy as o, splitSystemPromptRelocatableBoundary as p, clampMaxTokensToModel as r, SYSTEM_PROMPT_CACHE_BOUNDARY as s, adjustMaxTokensForThinking as t, ensureSystemPromptCacheBoundary as u, sortPromptCacheToolsByName as v };
