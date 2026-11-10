import { l as asNonNegativeFiniteNumber, s as asFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/usage.ts
const USAGE_COST_COMPONENTS = [
	"input",
	"output",
	"cacheRead",
	"cacheWrite"
];
function makeZeroUsageSnapshot() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function hasNonzeroUsage(usage) {
	if (!usage || usage.usageReport?.state === "unavailable") return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.contextUsage?.state === "available" ? usage.contextUsage.promptTokens : void 0,
		usage.contextUsage?.state === "available" ? usage.contextUsage.totalTokens : void 0,
		usage.reasoningTokens,
		usage.total
	].some((v) => typeof v === "number" && Number.isFinite(v) && v > 0) || usage.contextUsage?.state === "unavailable";
}
/** Complete accounting includes measured zero; billing may exist without token counts. */
function hasBillableUsage(usage) {
	return usage?.usageReport?.state !== "unavailable" && (usage?.usageReport?.state === "available" || usage?.cost !== void 0 || hasNonzeroUsage(usage));
}
/** Adapter-default zeros are not price evidence; billed totals and cost components are. */
function hasRecordedUsageCost(value) {
	const cost = asOptionalRecord(value);
	const total = asFiniteNumber(cost?.total);
	return total !== void 0 && total >= 0 && (total > 0 || cost?.totalOrigin === "provider-billed" || USAGE_COST_COMPONENTS.some((key) => (asFiniteNumber(cost?.[key]) ?? 0) !== 0));
}
/** Empty transport snapshots synthesize $0; recorded cost evidence can establish an observation. */
function hasObservedModelUsage(usage) {
	return usage?.usageReport !== void 0 || hasRecordedUsageCost(usage?.cost) || hasNonzeroUsage(usage);
}
const normalizeTokenCount = (value) => {
	const numeric = asFiniteNumber(value);
	return numeric === void 0 ? void 0 : Math.min(Math.max(0, Math.trunc(numeric)), Number.MAX_SAFE_INTEGER);
};
function normalizeContextUsage(raw) {
	if (raw?.state !== "available") return raw?.state === "unavailable" ? { state: "unavailable" } : void 0;
	const promptTokens = normalizeTokenCount(raw.promptTokens);
	const totalTokens = normalizeTokenCount(raw.totalTokens);
	return promptTokens !== void 0 && totalTokens !== void 0 && totalTokens >= promptTokens ? {
		state: "available",
		promptTokens,
		totalTokens
	} : void 0;
}
function normalizeUsage(raw) {
	if (!raw) return;
	if (raw.usageReport?.state === "unavailable") return {
		usageReport: { state: "unavailable" },
		contextUsage: { state: "unavailable" }
	};
	const cacheRead = normalizeTokenCount(raw.cacheRead ?? raw.cache_read ?? raw.cache_read_input_tokens ?? raw.cached_input_tokens ?? raw.cached ?? raw.cached_tokens ?? raw.input_tokens_details?.cached_tokens ?? raw.prompt_tokens_details?.cached_tokens);
	const cacheWrite = normalizeTokenCount(raw.cacheWrite ?? raw.cache_write ?? raw.cache_creation_input_tokens ?? raw.cache_write_input_tokens ?? raw.input_tokens_details?.cache_write_tokens ?? raw.prompt_tokens_details?.cache_write_tokens ?? raw.prompt_tokens_details?.cache_creation_input_tokens);
	const cacheWrite1h = normalizeTokenCount(raw.cacheWrite1h);
	const directInput = asFiniteNumber(raw.input);
	const rawInputValue = raw.input ?? raw.inputTokens ?? raw.input_tokens ?? raw.promptTokens ?? raw.prompt_tokens ?? raw.prompt_n ?? raw.timings?.prompt_n;
	const cliCacheReadIncludedInInput = raw.cached_input_tokens !== void 0 || raw.cached !== void 0;
	const openAiCacheReadIncludedInInput = raw.cached_tokens !== void 0 || raw.input_tokens_details?.cached_tokens !== void 0 || raw.prompt_tokens_details?.cached_tokens !== void 0;
	const cacheWriteIncludedInInput = raw.cache_write_input_tokens !== void 0 || raw.input_tokens_details?.cache_write_tokens !== void 0 || raw.prompt_tokens_details?.cache_write_tokens !== void 0 || raw.prompt_tokens_details?.cache_creation_input_tokens !== void 0;
	const rawInput = asFiniteNumber(rawInputValue);
	const normalizedInput = rawInput !== void 0 ? rawInput - (openAiCacheReadIncludedInInput || directInput === void 0 && cliCacheReadIncludedInInput ? cacheRead ?? 0 : 0) - (directInput === void 0 && cacheWriteIncludedInInput ? cacheWrite ?? 0 : 0) : rawInput;
	const input = normalizeTokenCount(normalizedInput);
	const output = normalizeTokenCount(raw.output ?? raw.outputTokens ?? raw.output_tokens ?? raw.completionTokens ?? raw.completion_tokens ?? raw.predicted_n ?? raw.timings?.predicted_n);
	const contextUsage = normalizeContextUsage(raw.contextUsage);
	const reasoningTokens = normalizeTokenCount(raw.reasoningTokens ?? raw.reasoning_tokens ?? raw.completion_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.thinking_tokens);
	const total = normalizeTokenCount(raw.total ?? raw.totalTokens ?? raw.total_tokens);
	const costTotal = asFiniteNumber(raw.cost?.total);
	const cost = costTotal !== void 0 && costTotal >= 0 ? {
		total: costTotal,
		...raw.cost?.totalOrigin === "provider-billed" ? { totalOrigin: "provider-billed" } : {}
	} : void 0;
	if (cost?.total === 0) for (const key of USAGE_COST_COMPONENTS) {
		const component = asFiniteNumber(raw.cost?.[key]);
		if (component !== void 0 && component !== 0) cost[key] = component;
	}
	if ([
		input,
		output,
		cacheRead,
		cacheWrite,
		contextUsage,
		reasoningTokens,
		total,
		cost
	].every((value) => value === void 0)) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		...cacheWrite1h !== void 0 ? { cacheWrite1h } : {},
		...raw.cacheTelemetry?.state === "available" || raw.cacheTelemetry?.state === "unavailable" ? { cacheTelemetry: { state: raw.cacheTelemetry.state } } : {},
		...cost ? { cost } : {},
		...contextUsage ? { contextUsage } : {},
		...raw.usageReport?.state === "available" ? { usageReport: { state: "available" } } : {},
		...reasoningTokens !== void 0 ? { reasoningTokens } : {},
		total
	};
}
/** Aggregate token counters for model.usage diagnostics, separate from context snapshots. */
function toDiagnosticUsage(usage) {
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const promptTokens = input + cacheRead + cacheWrite;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		promptTokens,
		total: usage.total ?? promptTokens + output
	};
}
/**
* Maps normalized usage to OpenAI Chat Completions `usage` fields.
*
* `prompt_tokens` is input + cacheRead (cache write is excluded to match the
* OpenAI-style breakdown used by the compat endpoint).
*
* `total_tokens` is the greater of the component sum and aggregate `total` when
* present, so a partial breakdown cannot discard a valid upstream total.
*
* `prompt_tokens_details.cached_tokens` is emitted when `cacheRead > 0` so
* downstream chat-completions clients can compute the cache-aware blended
* cost. Field name and shape match OpenAI's documented usage breakdown:
* https://platform.openai.com/docs/guides/prompt-caching
*/
function toOpenAiChatCompletionsUsage(usage) {
	if (usage?.usageReport?.state === "unavailable") return;
	const input = usage?.input ?? 0;
	const output = usage?.output ?? 0;
	const cacheRead = usage?.cacheRead ?? 0;
	const promptTokens = Math.max(0, input + cacheRead);
	const completionTokens = Math.max(0, output);
	const componentTotal = promptTokens + completionTokens;
	const totalTokens = Math.max(componentTotal, asNonNegativeFiniteNumber(usage?.total) ?? 0);
	const reasoningTokens = normalizeTokenCount(usage?.reasoningTokens);
	return {
		prompt_tokens: promptTokens,
		completion_tokens: completionTokens,
		total_tokens: totalTokens,
		...cacheRead > 0 ? { prompt_tokens_details: { cached_tokens: cacheRead } } : {},
		...reasoningTokens !== void 0 ? { completion_tokens_details: { reasoning_tokens: reasoningTokens } } : {}
	};
}
/**
* Maps normalized usage to OpenAI Responses `usage` fields.
*
* Responses reports cache reads and writes as subsets of `input_tokens`, so
* recombine OpenClaw's separately priced buckets and retain their details.
* Reasoning tokens remain a detail of `output_tokens`, not an extra bucket.
*/
function toOpenAiResponsesUsage(usage) {
	if (usage?.usageReport?.state === "unavailable") return;
	const input = Math.max(0, usage?.input ?? 0);
	const output = Math.max(0, usage?.output ?? 0);
	const cacheRead = Math.max(0, usage?.cacheRead ?? 0);
	const cacheWrite = Math.max(0, usage?.cacheWrite ?? 0);
	const reasoningTokens = Math.max(0, usage?.reasoningTokens ?? 0);
	const inputTokens = input + cacheRead + cacheWrite;
	const componentTotal = inputTokens + output;
	const aggregateTotal = Math.max(0, usage?.total ?? 0);
	return {
		input_tokens: inputTokens,
		input_tokens_details: {
			cached_tokens: cacheRead,
			cache_write_tokens: cacheWrite
		},
		output_tokens: output,
		output_tokens_details: { reasoning_tokens: reasoningTokens },
		total_tokens: Math.max(componentTotal, aggregateTotal)
	};
}
function derivePromptTokens(usage) {
	if (!usage) return;
	const input = usage.input ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const sum = input + cacheRead + cacheWrite;
	return sum > 0 ? sum : void 0;
}
function derivePromptTokensFromTotal(usage) {
	const total = asPositiveFiniteNumber(usage?.total);
	const output = asNonNegativeFiniteNumber(usage?.output);
	if (total === void 0 || output === void 0) return;
	const promptTokens = total - output;
	return promptTokens > 0 ? promptTokens : void 0;
}
function deriveContextPromptTokens(params) {
	const promptOverride = asPositiveFiniteNumber(params.promptTokens);
	if (promptOverride !== void 0) return promptOverride;
	for (const [index, usage] of [params.lastCallUsage, params.usage].entries()) {
		if (usage?.usageReport?.state === "unavailable" || usage?.contextUsage?.state === "unavailable") return;
		if (usage?.contextUsage?.state === "available") return usage.contextUsage.promptTokens;
		const promptTokens = derivePromptTokens(usage) ?? (index === 0 ? derivePromptTokensFromTotal(usage) : void 0);
		if (promptTokens !== void 0) return promptTokens;
	}
}
function deriveSessionTotalTokens(params) {
	const tokens = deriveContextPromptTokens(params);
	return (params.lastCallUsage ?? params.usage)?.usageReport?.state === "available" ? asNonNegativeFiniteNumber(tokens) : asPositiveFiniteNumber(tokens);
}
//#endregion
export { hasBillableUsage as a, hasRecordedUsageCost as c, toDiagnosticUsage as d, toOpenAiChatCompletionsUsage as f, deriveSessionTotalTokens as i, makeZeroUsageSnapshot as l, deriveContextPromptTokens as n, hasNonzeroUsage as o, toOpenAiResponsesUsage as p, derivePromptTokens as r, hasObservedModelUsage as s, USAGE_COST_COMPONENTS as t, normalizeUsage as u };
