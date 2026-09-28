import { r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-6ld30jSx.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/agents/embedded-agent-runner/tool-result-text-budget.ts
const toolResultTextEstimates = /* @__PURE__ */ new WeakMap();
function readPreparedToolResultTextChars(block, text, minimumRawWeight) {
	const cached = toolResultTextEstimates.get(block);
	return cached?.text === text && cached.minimumRawWeight === minimumRawWeight ? cached.chars : void 0;
}
function prepareToolResultTextChars(block, text, minimumRawWeight) {
	const cached = readPreparedToolResultTextChars(block, text, minimumRawWeight);
	if (cached !== void 0) return cached;
	const chars = estimateStringCharsWithMinimumRawWeight(text, { minimumRawWeight });
	toolResultTextEstimates.set(block, {
		text,
		minimumRawWeight,
		chars
	});
	return chars;
}
function isToolResultTextBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = Reflect.get(block, "type");
	return (type === "text" || type === "toolResult") && typeof Reflect.get(block, "text") === "string";
}
function sliceToolResultTextBudget(text, maxChars, options, fromEnd) {
	const budget = Math.max(0, Math.floor(maxChars));
	if (text.length <= budget && estimateStringCharsWithMinimumRawWeight(text, options) <= budget) return text;
	let best = "";
	let low = 0;
	let high = Math.min(text.length, budget);
	const minimumRawWeight = Math.max(1, options.minimumRawWeight ?? 1);
	const additive = minimumRawWeight === 1 || minimumRawWeight === 2;
	let measuredLength = 0;
	let measuredChars = 0;
	while (low <= high) {
		const midpoint = Math.floor((low + high) / 2);
		const candidate = fromEnd ? sliceUtf16Safe(text, text.length - midpoint) : sliceUtf16Safe(text, 0, midpoint);
		if (additive) {
			const start = Math.min(measuredLength, candidate.length);
			const end = Math.max(measuredLength, candidate.length);
			const delta = fromEnd ? text.slice(text.length - end, text.length - start) : text.slice(start, end);
			const deltaChars = estimateStringCharsWithMinimumRawWeight(delta, options);
			measuredChars += candidate.length >= measuredLength ? deltaChars : -deltaChars;
			measuredLength = candidate.length;
		} else measuredChars = estimateStringCharsWithMinimumRawWeight(candidate, options);
		if (measuredChars <= budget) {
			best = candidate;
			low = midpoint + 1;
		} else high = midpoint - 1;
	}
	return best;
}
function sliceToolResultTextToBudget(text, maxChars, options = {}) {
	return sliceToolResultTextBudget(text, maxChars, options, false);
}
function sliceToolResultTextTailToBudget(text, maxChars, options = {}) {
	return sliceToolResultTextBudget(text, maxChars, options, true);
}
//#endregion
//#region src/agents/tool-result-limits.ts
/** Automatic live tool-result caps derived from the effective model context. */
const MAX_TOOL_RESULT_CONTEXT_SHARE = .3;
const DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS = 16e3;
const LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 32e3;
const XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 64e3;
const LARGE_CONTEXT_TOOL_RESULT_TOKENS = 1e5;
const XL_CONTEXT_TOOL_RESULT_TOKENS = 2e5;
function resolveAutoLiveToolResultMaxChars(contextWindowTokens) {
	if (!Number.isFinite(contextWindowTokens)) return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	const tokens = Math.floor(contextWindowTokens);
	if (tokens >= XL_CONTEXT_TOOL_RESULT_TOKENS) return XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	if (tokens >= LARGE_CONTEXT_TOOL_RESULT_TOKENS) return LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
}
function calculateMaxToolResultCharsWithCap(contextWindowTokens, hardCapChars) {
	const maxChars = Math.floor(contextWindowTokens * MAX_TOOL_RESULT_CONTEXT_SHARE) * 4;
	return Math.min(maxChars, Math.max(1, hardCapChars));
}
function resolveLiveToolResultMaxChars(params) {
	return calculateMaxToolResultCharsWithCap(params.contextWindowTokens, resolveAutoLiveToolResultMaxChars(params.contextWindowTokens));
}
function resolveToolResultContextMaxChars(contextWindowTokens) {
	return Math.max(1024, Math.floor(Math.max(1, Math.floor(contextWindowTokens)) * 2 * .5));
}
function resolveToolResultBudget(contextWindowTokens) {
	if (contextWindowTokens === void 0 || !Number.isFinite(contextWindowTokens) || contextWindowTokens <= 0) return;
	return {
		maxChars: resolveLiveToolResultMaxChars({ contextWindowTokens }),
		maxContextChars: resolveToolResultContextMaxChars(contextWindowTokens)
	};
}
function toolResultFitsBudget(text, budget) {
	if (budget === void 0) return true;
	const chars = estimateStringCharsWithMinimumRawWeight(text);
	return chars <= budget.maxChars && (chars * 2 <= budget.maxContextChars || estimateStringCharsWithMinimumRawWeight(text, { minimumRawWeight: 2 }) <= budget.maxContextChars);
}
//#endregion
export { resolveToolResultBudget as a, isToolResultTextBlock as c, sliceToolResultTextTailToBudget as d, sliceToolResultTextToBudget as f, resolveLiveToolResultMaxChars as i, prepareToolResultTextChars as l, calculateMaxToolResultCharsWithCap as n, resolveToolResultContextMaxChars as o, resolveAutoLiveToolResultMaxChars as r, toolResultFitsBudget as s, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS as t, readPreparedToolResultTextChars as u };
