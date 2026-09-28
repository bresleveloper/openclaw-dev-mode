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
/**
* Build a lookup from the bundled DeepSeek model catalog so we can hydrate
* missing metadata (contextWindow, cost, maxTokens) into user-configured
* model rows without overwriting explicit overrides.
*/
function buildCatalogIndex() {
	const index = /* @__PURE__ */ new Map();
	for (const model of DEEPSEEK_MODEL_CATALOG) index.set(model.id, model);
	return index;
}
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
	const catalog = buildCatalogIndex();
	let mutated = false;
	const nextModels = providerConfig.models.map((model) => {
		const raw = model;
		const catalogEntry = catalog.get(raw.id);
		if (!catalogEntry) return model;
		const previousEntry = PREVIOUS_BUNDLED_METADATA[raw.id];
		const hasPreviousBundledMetadata = isPreviousBundledMetadataSnapshot(raw, previousEntry);
		let modelMutated = false;
		const patched = {};
		if ((!isPositiveNumber(raw.contextWindow) || hasPreviousBundledMetadata && raw.contextWindow !== catalogEntry.contextWindow) && isPositiveNumber(catalogEntry.contextWindow)) {
			patched.contextWindow = catalogEntry.contextWindow;
			modelMutated = true;
		}
		if ((!isPositiveNumber(raw.maxTokens) || hasPreviousBundledMetadata && raw.maxTokens !== catalogEntry.maxTokens) && isPositiveNumber(catalogEntry.maxTokens)) {
			patched.maxTokens = catalogEntry.maxTokens;
			modelMutated = true;
		}
		if ((!hasCostValues(raw.cost) || hasPreviousBundledMetadata) && hasCostValues(catalogEntry.cost) && !hasSameCost(raw.cost, catalogEntry.cost)) {
			patched.cost = catalogEntry.cost;
			modelMutated = true;
		}
		if (!modelMutated) return model;
		mutated = true;
		return {
			...raw,
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
