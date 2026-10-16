import { n as DEEPSEEK_MODEL_CATALOG } from "./.setup/models-D843Tvyg.mjs";
import { resolveDeepSeekV4ThinkingProfile } from "./thinking.js";
//#region extensions/deepseek/provider-policy-api.ts
const PREVIOUS_BUNDLED_METADATA = {
	"deepseek-v4-flash": {
		contextWindow: 1e6,
		maxTokens: 384e3,
		cost: {
			input: .14,
			output: .28,
			cacheRead: .028,
			cacheWrite: 0
		}
	},
	"deepseek-v4-pro": {
		contextWindow: 1e6,
		maxTokens: 384e3,
		cost: {
			input: 1.74,
			output: 3.48,
			cacheRead: .145,
			cacheWrite: 0
		}
	},
	"deepseek-chat": {
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: .28,
			output: .42,
			cacheRead: .028,
			cacheWrite: 0
		}
	},
	"deepseek-reasoner": {
		contextWindow: 131072,
		maxTokens: 65536,
		cost: {
			input: .28,
			output: .42,
			cacheRead: .028,
			cacheWrite: 0
		}
	}
};
const ZERO_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
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
function isShippedZeroCostAliasSnapshot(raw, previous) {
	return (raw.id === "deepseek-chat" || raw.id === "deepseek-reasoner") && raw.contextWindow === previous?.contextWindow && raw.maxTokens === previous?.maxTokens && hasSameCost(raw.cost, ZERO_COST);
}
function isPreviousBundledMetadataSnapshot(raw, previous) {
	if (!previous) return false;
	return raw.contextWindow === previous.contextWindow && raw.maxTokens === previous.maxTokens && (hasSameCost(raw.cost, previous.cost) || isShippedZeroCostAliasSnapshot(raw, previous));
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
		const hasPreviousBundledMetadata = isPreviousBundledMetadataSnapshot(model, PREVIOUS_BUNDLED_METADATA[model.id]);
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
function resolveThinkingProfile(params) {
	return params.provider.trim().toLowerCase() === "deepseek" ? resolveDeepSeekV4ThinkingProfile(params.modelId) : null;
}
//#endregion
export { normalizeConfig, resolveThinkingProfile };
