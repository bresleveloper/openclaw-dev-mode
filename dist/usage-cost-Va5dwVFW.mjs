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
export { normalizeModelCostConfig as n, normalizeResolvedPricing as r, calculateUsageCost as t };
