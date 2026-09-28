//#region src/infra/session-cost-usage-totals.ts
function createEmptyCostUsageTotals() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		totalCost: 0,
		inputCost: 0,
		outputCost: 0,
		cacheReadCost: 0,
		cacheWriteCost: 0,
		missingCostEntries: 0
	};
}
function cloneCostUsageTotals(totals) {
	return {
		input: totals.input,
		output: totals.output,
		cacheRead: totals.cacheRead,
		cacheWrite: totals.cacheWrite,
		totalTokens: totals.totalTokens,
		totalCost: totals.totalCost,
		inputCost: totals.inputCost,
		outputCost: totals.outputCost,
		cacheReadCost: totals.cacheReadCost,
		cacheWriteCost: totals.cacheWriteCost,
		missingCostEntries: totals.missingCostEntries,
		...totals.missingCostByModel ? { missingCostByModel: { ...totals.missingCostByModel } } : {}
	};
}
function addCostUsageTotals(target, source) {
	target.input += source.input;
	target.output += source.output;
	target.cacheRead += source.cacheRead;
	target.cacheWrite += source.cacheWrite;
	target.totalTokens += source.totalTokens;
	target.totalCost += source.totalCost;
	target.inputCost += source.inputCost;
	target.outputCost += source.outputCost;
	target.cacheReadCost += source.cacheReadCost;
	target.cacheWriteCost += source.cacheWriteCost;
	target.missingCostEntries += source.missingCostEntries;
	if (source.missingCostByModel) {
		target.missingCostByModel ??= {};
		for (const [model, count] of Object.entries(source.missingCostByModel)) target.missingCostByModel[model] = (target.missingCostByModel[model] ?? 0) + count;
	}
}
function formatMissingCostEntries(totals) {
	const byModel = Object.entries(totals.missingCostByModel ?? {}).filter(([, count]) => count > 0).toSorted(([modelA, countA], [modelB, countB]) => countB - countA || modelA.localeCompare(modelB));
	if (byModel.length === 0) return String(totals.missingCostEntries);
	return `${totals.missingCostEntries} (${byModel.map(([model, count]) => `${model} ${count}`).join(", ")})`;
}
//#endregion
export { formatMissingCostEntries as i, cloneCostUsageTotals as n, createEmptyCostUsageTotals as r, addCostUsageTotals as t };
