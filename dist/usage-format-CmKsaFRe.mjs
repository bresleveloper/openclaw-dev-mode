import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { n as normalizeBuiltInProviderModelId } from "./provider-model-id-normalization-BUc8S34C.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { n as normalizeModelCostConfig, r as normalizeResolvedPricing, t as calculateUsageCost } from "./usage-cost-Va5dwVFW.mjs";
import "./src-UF9QYDzr.mjs";
import { o as normalizeProviderMapKeys } from "./models-config.merge-M6U_2rg_.mjs";
import { t as MODELS_JSON_STATE } from "./models-config-state-HMKwOxfz.mjs";
import { i as resolveModelPricingContext, r as resolveModelPricing, t as modelCatalogPricingFingerprint } from "./pricing-Bwenqzdn.mjs";
import { c as hasRecordedUsageCost } from "./usage-XmAH1cfG.mjs";
import "./token-format-BRba24iW.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/utils/usage-format.ts
/**
* Shared token/cost formatting and pricing lookup helpers for CLI, TUI, gateway, and status output.
* Keep this module synchronous; request paths call it while rendering usage summaries.
*/
const EMPTY_PROVIDER_COST_INDEX = /* @__PURE__ */ new Map();
let providerCostIndexByNormalizer = /* @__PURE__ */ new WeakMap();
/** Formats a USD amount for usage summaries, keeping tiny costs visible. */
function formatUsd(value) {
	if (value === void 0 || !Number.isFinite(value)) return;
	if (value >= .01) return `$${value.toFixed(2)}`;
	return `$${value.toFixed(4)}`;
}
/** Prefix aggregate totals with their recorded cache-readiness notice. */
function formatCostUsageCachePrefix(cacheStatus) {
	return cacheStatus && cacheStatus.status !== "fresh" ? `Usage totals may be incomplete (${cacheStatus.status}). Run this command again later.\n` : "";
}
function normalizeRawModelKey(provider, model) {
	const providerId = normalizeProviderId(provider);
	return buildModelCatalogRef(providerId, normalizeBuiltInProviderModelId(providerId, model.trim()));
}
function hasModelCostRates(cost) {
	return cost !== void 0 && (cost.input !== void 0 || cost.output !== void 0 || cost.cacheRead !== void 0 || cost.cacheWrite !== void 0 || Boolean(cost.tieredPricing?.length));
}
function refreshProviderCostIndexEntry(index, key) {
	let cost;
	for (const model of index.sources.get(key) ?? []) {
		const candidate = model.cost;
		if (candidate !== null && typeof candidate === "object") cost = mergeModelCost(model.cost, cost);
	}
	if (cost) index.entries.set(key, cost);
	else index.entries.delete(key);
}
function getProviderCostIndex(providers, normalizeKey = normalizeRawModelKey, key) {
	if (!providers) return EMPTY_PROVIDER_COST_INDEX;
	let cache = providerCostIndexByNormalizer.get(normalizeKey);
	if (!cache) {
		cache = /* @__PURE__ */ new WeakMap();
		providerCostIndexByNormalizer.set(normalizeKey, cache);
	}
	let index = cache.get(providers);
	const structure = Object.entries(normalizeProviderMapKeys(providers)).flatMap(([providerKey, provider]) => (provider?.models ?? []).map((model) => ({
		providerKey,
		model,
		modelId: model.id
	})));
	if (!index || index.structure.length !== structure.length || index.structure.some((source, position) => {
		const current = structure[position];
		return !current || source.model !== current.model || source.modelId !== current.modelId || source.providerKey !== current.providerKey;
	})) {
		const sources = /* @__PURE__ */ new Map();
		for (const { providerKey, model, modelId } of structure) {
			const modelKey = normalizeKey(providerKey, modelId);
			const rows = sources.get(modelKey) ?? [];
			rows.push(model);
			sources.set(modelKey, rows);
		}
		index = {
			entries: /* @__PURE__ */ new Map(),
			sources,
			structure
		};
		cache.set(providers, index);
	}
	for (const entryKey of key === void 0 ? index.sources.keys() : [key]) refreshProviderCostIndexEntry(index, entryKey);
	return index.entries;
}
function loadModelsJsonCostIndex(agentDir, normalizeKey = normalizeRawModelKey) {
	if (!agentDir) return EMPTY_PROVIDER_COST_INDEX;
	const modelsPath = path.join(agentDir, "models.json");
	try {
		let modelsJsonCostCache = MODELS_JSON_STATE.costCache.get(agentDir);
		if (!modelsJsonCostCache) {
			const parsed = tryReadJsonSync(modelsPath);
			if (!parsed) return EMPTY_PROVIDER_COST_INDEX;
			modelsJsonCostCache = {
				providers: parsed?.providers,
				entries: /* @__PURE__ */ new WeakMap()
			};
			pruneMapToMaxSize(MODELS_JSON_STATE.costCache, 127);
			MODELS_JSON_STATE.costCache.set(agentDir, modelsJsonCostCache);
		}
		let entries = modelsJsonCostCache.entries.get(normalizeKey);
		if (!entries) {
			entries = getProviderCostIndex(modelsJsonCostCache.providers, normalizeKey);
			modelsJsonCostCache.entries.set(normalizeKey, entries);
		}
		return entries;
	} catch {
		return EMPTY_PROVIDER_COST_INDEX;
	}
}
function resolveCostAgentDir(config, agentDir) {
	if (agentDir) return agentDir;
	if (config && listAgentEntries(config).length > 0) {
		const defaultAgentId = tryResolveDefaultAgentId(config);
		return defaultAgentId ? resolveAgentDir(config, defaultAgentId) : void 0;
	}
	return path.join(resolveStateDir(), "agents", "main", "agent");
}
function stableCostFingerprintValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? JSON.stringify(value) : JSON.stringify(String(value));
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map((entry) => stableCostFingerprintValue(entry)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).filter((key) => record[key] !== void 0).toSorted().map((key) => `${JSON.stringify(key)}:${stableCostFingerprintValue(record[key])}`).join(",")}}`;
}
function serializeCostIndex(entries) {
	return Array.from(entries.entries()).toSorted(([a], [b]) => a.localeCompare(b));
}
/**
* Fingerprints all model-pricing sources that can affect usage cost estimates.
* Consumers cache this value to know when resolved cost entries need recomputation.
*/
function resolveModelCostConfigFingerprint(config, agentDir) {
	return fingerprintModelCostPricing(config, agentDir, resolveModelPricingContext(config));
}
function fingerprintModelCostPricing(config, agentDir, pricingContext) {
	const resolvedAgentDir = resolveCostAgentDir(config, agentDir);
	const sourceConfig = config ? projectConfigOntoRuntimeSourceSnapshot(config) : void 0;
	const serialized = stableCostFingerprintValue({
		configuredRaw: serializeCostIndex(getProviderCostIndex(sourceConfig?.models?.providers)),
		configuredNormalized: serializeCostIndex(getProviderCostIndex(sourceConfig?.models?.providers, pricingContext.normalizeKey)),
		modelsJsonRaw: serializeCostIndex(loadModelsJsonCostIndex(resolvedAgentDir)),
		modelsJsonNormalized: serializeCostIndex(loadModelsJsonCostIndex(resolvedAgentDir, pricingContext.normalizeKey)),
		catalogPricing: modelCatalogPricingFingerprint(pricingContext)
	});
	return createHash("sha256").update(serialized).digest("hex");
}
/** Captures hosted rows, normalization policy, and prices for one usage operation. */
function captureModelCostPricing(config, agentDir) {
	const pricingContext = resolveModelPricingContext(config);
	return {
		fingerprint: () => fingerprintModelCostPricing(config, agentDir, pricingContext),
		resolve: (provider, model) => resolveModelCostConfigWithPricing({
			provider,
			model,
			config,
			agentDir
		}, pricingContext)
	};
}
/**
* Resolves local models.json first, then authored overrides over effective catalog prices.
* Complete direct prices need no plugin normalization or provider discovery.
*/
function resolveModelCostConfig(params) {
	return resolveModelCostConfigWithPricing(params);
}
function resolveModelCostConfigWithPricing(params, capturedPricing) {
	const provider = normalizeProviderId(normalizeOptionalString(params.provider) ?? "");
	const model = normalizeOptionalString(params.model);
	if (!provider || !model) return;
	const rawKey = normalizeRawModelKey(provider, model);
	const agentDir = resolveCostAgentDir(params.config, params.agentDir);
	const rawModelsJsonCost = loadModelsJsonCostIndex(agentDir).get(rawKey);
	if (hasModelCostRates(rawModelsJsonCost)) return normalizeModelCostConfig(rawModelsJsonCost);
	const sourceConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	let configuredCost = getProviderCostIndex(sourceConfig?.models?.providers, void 0, rawKey).get(rawKey);
	let pricingContext = capturedPricing;
	if (params.allowPluginNormalization !== false && !configuredCost) {
		pricingContext ??= resolveModelPricingContext(params.config);
		const key = pricingContext.normalizeKey(provider, model);
		const modelsJsonCost = loadModelsJsonCostIndex(agentDir, pricingContext.normalizeKey).get(key);
		if (hasModelCostRates(modelsJsonCost)) return normalizeModelCostConfig(modelsJsonCost);
		configuredCost = getProviderCostIndex(sourceConfig?.models?.providers, pricingContext.normalizeKey, key).get(key);
	}
	if (configuredCost && configuredCost.input !== void 0 && configuredCost.output !== void 0 && configuredCost.cacheRead !== void 0 && configuredCost.cacheWrite !== void 0) return normalizeModelCostConfig(configuredCost);
	if (params.allowPluginNormalization !== false) pricingContext ??= resolveModelPricingContext(params.config);
	const inheritedCost = pricingContext ? resolveModelPricing(pricingContext, pricingContext.normalizeKey(provider, model)) : getProviderCostIndex(params.config?.models?.providers, void 0, rawKey).get(rawKey);
	const merged = mergeModelCost(hasModelCostRates(inheritedCost) ? normalizeResolvedPricing(inheritedCost) : void 0, configuredCost);
	return hasModelCostRates(merged) ? normalizeResolvedPricing(merged) : void 0;
}
/** Estimates one call's USD cost; tier selection includes cached prompt tokens. */
function estimateUsageCost(params) {
	const usage = params.usage;
	const cost = params.cost;
	if (!usage || !cost) return;
	const total = calculateUsageCost(usage, cost).total;
	return Number.isFinite(total) ? total : void 0;
}
/** Preserve summed per-call costs; aggregate tokens cannot reconstruct request tiers. */
function estimateAggregateUsageCost(params) {
	const usage = params.usage;
	if (usage?.cost && hasRecordedUsageCost(usage.cost)) return usage.cost.total;
	if (!(usage && [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite
	].some((value) => value !== void 0))) return usage?.cost?.total;
	const cost = params.cost ?? resolveModelCostConfig(params);
	if (usage?.cost && cost) return usage.cost.total;
	return cost?.tieredPricing?.length ? void 0 : estimateUsageCost({
		usage,
		cost
	});
}
function resetUsageFormatCachesForTest() {
	MODELS_JSON_STATE.costCache.clear();
	providerCostIndexByNormalizer = /* @__PURE__ */ new WeakMap();
}
//#endregion
export { formatUsd as a, resolveModelCostConfigFingerprint as c, formatCostUsageCachePrefix as i, estimateAggregateUsageCost as n, resetUsageFormatCachesForTest as o, estimateUsageCost as r, resolveModelCostConfig as s, captureModelCostPricing as t };
