import { DEEPSEEK_MODEL_CATALOG } from "./models.js";
// extensions/deepseek/provider-policy-api.ts
const PREVIOUS_BUNDLED_COSTS = {
	"deepseek-v4-flash": [{
		input: .14,
		output: .28,
		cacheRead: .028,
		cacheWrite: 0
	}, {
		input: .14,
		output: .28,
		cacheRead: .0028,
		cacheWrite: 0
	}],
	"deepseek-v4-pro": [{
		input: 1.74,
		output: 3.48,
		cacheRead: .145,
		cacheWrite: 0
	}, {
		input: .435,
		output: .87,
		cacheRead: .003625,
		cacheWrite: 0
	}],
	"deepseek-v4-flash-vision-exp": [{
		input: .44,
		output: 1.32,
		cacheRead: .014,
		cacheWrite: 0
	}]
};
function isPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function hasCostValues(cost) {
	if (!cost || typeof cost !== "object") return false;
	const c = cost;
	return typeof c.input === "number" || typeof c.output === "number" || typeof c.cacheRead === "number" || typeof c.cacheWrite === "number";
}
function hasSameCost(left, right) {
	if (!left || typeof left !== "object" || !right) return false;
	const cost = left;
	if (Object.hasOwn(cost, "tieredPricing")) return false;
	return cost.input === right.input && cost.output === right.output && cost.cacheRead === right.cacheRead && cost.cacheWrite === right.cacheWrite;
}
function isPreviousBundledMetadataSnapshot(raw) {
	return raw.contextWindow === 1e6 && raw.maxTokens === 384e3 && (PREVIOUS_BUNDLED_COSTS[raw.id]?.some((cost) => hasSameCost(raw.cost, cost)) ?? false);
}
/**
* Provider policy surface for DeepSeek.
*
* Hydrates missing `contextWindow`, `cost`, and `maxTokens` from the bundled
* catalog for matching model ids. Explicit user overrides are preserved.
*/
function normalizeConfig(params) {
	const { providerConfig } = params;
	if (!Array.isArray(providerConfig.models) || providerConfig.models.length === 0) return providerConfig;
	const catalog = new Map(DEEPSEEK_MODEL_CATALOG.map((model) => [model.id, model]));
	let mutated = false;
	const nextModels = providerConfig.models.map((model) => {
		const catalogEntry = catalog.get(model.id);
		if (!catalogEntry) return model;
		const hasPreviousBundledMetadata = isPreviousBundledMetadataSnapshot(model);
		const patched = {};
		for (const key of ["contextWindow", "maxTokens"]) if ((!isPositiveNumber(model[key]) || hasPreviousBundledMetadata && model[key] !== catalogEntry[key]) && isPositiveNumber(catalogEntry[key])) patched[key] = catalogEntry[key];
		if ((!hasCostValues(model.cost) || hasPreviousBundledMetadata) && hasCostValues(catalogEntry.cost) && !hasSameCost(model.cost, catalogEntry.cost)) patched.cost = catalogEntry.cost;
		if (Object.keys(patched).length === 0) return model;
		mutated = true;
		return {
			...model,
			...patched
		};
	});
	if (!mutated) return providerConfig;
	return {
		...providerConfig,
		models: nextModels
	};
}
export { normalizeConfig };
