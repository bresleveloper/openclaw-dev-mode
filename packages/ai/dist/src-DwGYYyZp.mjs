import "./diagnostics-DzrF1h4J.mjs";
import "./validation-Dw7cb6BV.mjs";
//#region packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase() ?? "";
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
const CLAUDE_FABLE_5_THINKING_PROFILE = {
	levels: [
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "max" }
	],
	defaultLevel: "medium",
	preserveWhenCatalogReasoningFalse: true
};
const CLAUDE_SONNET_5_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high"
};
const CLAUDE_OPUS_5_THINKING_PROFILE = CLAUDE_SONNET_5_THINKING_PROFILE;
const CLAUDE_OPUS_55_THINKING_PROFILE = CLAUDE_FABLE_5_THINKING_PROFILE;
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
function resolveClaudeModelIdentity(ref) {
	const normalized = normalizeClaudeModelId((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id);
	return /(?:^|[-/])(claude-[^/]+)$/.exec(normalized)?.[1] ?? normalized;
}
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeFable5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeMythos5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/**
* Prefix-bound thinking requires append-only runtime context. Extend this list
* only with live replay proof for the model (Mythos 5.1 remains unproven).
*/
function bindsClaudeThinkingPrefix(ref) {
	return resolveClaudeOpus55ModelIdentity(ref) !== void 0 || /^claude-fable-5-1(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity(ref));
}
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
function requiresClaudeMandatoryAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus55ModelIdentity(ref) !== void 0 || resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeSonnet5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const match = /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
function resolveClaudeOpus5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const opus55Identity = resolveClaudeOpus55ModelIdentity(ref);
	if (opus55Identity) return opus55Identity;
	if (normalized === "opus" || normalized === "opus-5") return "claude-opus-5";
	const match = /(?:^|-)claude-opus-5(?=$|[^a-z0-9])/.exec(normalized);
	if (!match) return;
	return normalized.slice((match.index ?? 0) + (match[0].startsWith("-") ? 1 : 0));
}
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
function resolveClaudeOpus55ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "opus-5-5") return "claude-opus-5-5";
	return /^claude-opus-5-5(?=$|[^a-z0-9])/.test(normalized) ? normalized : void 0;
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model has a native 1M-token context window. */
function supportsClaude1MContext(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports Anthropic's native fast mode. */
function supportsClaudeFastMode(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-opus-4-8(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native max effort. */
function supportsClaudeNativeMaxEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8)|sonnet-5)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model rejects caller-selected sampling parameters. */
function requiresClaudeDefaultSampling(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return supportsClaudeNativeXhighEffort(ref) || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/**
* Fill native Claude effort mappings only when the provider did not publish a
* narrower route-specific contract.
*/
function resolveClaudeNativeThinkingLevelMap(ref) {
	if (ref.thinkingLevelMap !== void 0) return ref.thinkingLevelMap;
	if (!supportsClaudeNativeMaxEffort(ref)) return;
	return {
		xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
		max: "max"
	};
}
//#endregion
//#region packages/llm-core/src/usage-cost.ts
const sortedPricingTiers = /* @__PURE__ */ new WeakMap();
const finiteOrZero = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
function normalizeTieredPricing(raw) {
	if (!raw || raw.length === 0) return;
	const result = [];
	for (const tier of raw) {
		const range = tier.range;
		const start = Array.isArray(range) && typeof range[0] === "number" ? range[0] : NaN;
		if (!Number.isFinite(start)) continue;
		const rawEnd = range.length >= 2 ? range[1] : null;
		const end = typeof rawEnd === "number" && Number.isFinite(rawEnd) && rawEnd > start ? rawEnd : Infinity;
		if (!Number.isFinite(tier.input) || !Number.isFinite(tier.output) || !Number.isFinite(tier.cacheRead) || !Number.isFinite(tier.cacheWrite)) continue;
		result.push({
			input: tier.input,
			output: tier.output,
			cacheRead: tier.cacheRead,
			cacheWrite: tier.cacheWrite,
			range: [start, end]
		});
	}
	return result.length > 0 ? result.toSorted((a, b) => a.range[0] - b.range[0]) : void 0;
}
function normalizeModelCostConfig(cost) {
	const normalizedTiers = normalizeTieredPricing(cost.tieredPricing);
	return {
		input: cost.input,
		output: cost.output,
		cacheRead: cost.cacheRead,
		cacheWrite: cost.cacheWrite,
		...normalizedTiers ? { tieredPricing: normalizedTiers } : {}
	};
}
function normalizeResolvedPricing(cost) {
	return normalizeModelCostConfig({
		input: finiteOrZero(cost.input),
		output: finiteOrZero(cost.output),
		cacheRead: finiteOrZero(cost.cacheRead),
		cacheWrite: finiteOrZero(cost.cacheWrite),
		...cost.tieredPricing ? { tieredPricing: cost.tieredPricing } : {}
	});
}
function selectPricingRates(cost, promptTokens) {
	const tiers = cost.tieredPricing;
	if (!tiers?.length) return cost;
	let sorted = sortedPricingTiers.get(tiers);
	if (!sorted) {
		sorted = normalizeTieredPricing(tiers) ?? [];
		sortedPricingTiers.set(tiers, sorted);
	}
	if (promptTokens <= 0) return sorted[0] ?? cost;
	return sorted.find((tier) => promptTokens >= tier.range[0] && promptTokens < tier.range[1]) ?? sorted.findLast((tier) => promptTokens >= tier.range[0]) ?? sorted[0] ?? cost;
}
/** Price one model call, selecting its tier before billing the separate token buckets. */
function calculateUsageCost(usage, pricing) {
	const input = finiteOrZero(usage.input);
	const output = finiteOrZero(usage.output);
	const cacheRead = finiteOrZero(usage.cacheRead);
	const cacheWrite = finiteOrZero(usage.cacheWrite);
	const rates = selectPricingRates(pricing, input + cacheRead + cacheWrite);
	const cacheWrite1h = Math.min(cacheWrite, Math.max(0, finiteOrZero(usage.cacheWrite1h)));
	const cacheWrite5m = cacheWrite - cacheWrite1h;
	const cost = {
		input: input * rates.input / 1e6,
		output: output * rates.output / 1e6,
		cacheRead: cacheRead * rates.cacheRead / 1e6,
		cacheWrite: (cacheWrite5m * rates.cacheWrite + cacheWrite1h * rates.input * 2) / 1e6,
		total: 0
	};
	cost.total = cost.input + cost.output + cost.cacheRead + cost.cacheWrite;
	return cost;
}
//#endregion
export { supportsClaudeNativeXhighEffort as S, resolveClaudeSonnet5ModelIdentity as _, CLAUDE_OPUS_55_THINKING_PROFILE as a, supportsClaudeFastMode as b, bindsClaudeThinkingPrefix as c, resolveClaudeFable5ModelIdentity as d, resolveClaudeModelIdentity as f, resolveClaudeOpus5ModelIdentity as g, resolveClaudeOpus55ModelIdentity as h, CLAUDE_FABLE_5_THINKING_PROFILE as i, requiresClaudeDefaultSampling as l, resolveClaudeNativeThinkingLevelMap as m, normalizeModelCostConfig as n, CLAUDE_OPUS_5_THINKING_PROFILE as o, resolveClaudeMythos5ModelIdentity as p, normalizeResolvedPricing as r, CLAUDE_SONNET_5_THINKING_PROFILE as s, calculateUsageCost as t, requiresClaudeMandatoryAdaptiveThinking as u, supportsClaude1MContext as v, supportsClaudeNativeMaxEffort as x, supportsClaudeAdaptiveThinking as y };
