//#region src/config/model-cost.ts
/** Merge rates without letting inherited tiers silently replace authored flat or zero pricing. */
function mergeModelCost(lowerPriority, higherPriority) {
	if (!lowerPriority || !higherPriority) return higherPriority ?? lowerPriority;
	if (Object.keys(higherPriority).length === 0) return lowerPriority;
	const { tieredPricing: _tieredPricing, ...lowerPriorityRates } = lowerPriority;
	return {
		...lowerPriorityRates,
		...higherPriority
	};
}
//#endregion
export { mergeModelCost as t };
