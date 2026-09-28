import { D as withPluginCache, c as getPluginCacheRetirementSignal, g as isPluginCacheFactInvalidatedError, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { A as tryResolveDefaultAgentId, E as listAgentEntries, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as normalizeBuiltInProviderModelId } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-D0kh4WcK.mjs";
import { t as MODEL_PRICING_SOURCES } from "./model-catalog-pricing-CvFizjD3.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { d as resolvePluginMetadataSnapshotAsync, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as createStaticProviderModelIdNormalizer } from "./model-ref-shared-BgRrSHjn.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { a as prepareRemoteModelCatalogStartupSnapshot, i as getRemoteModelCatalogPricing, o as isRemoteModelCatalogRefreshEnabled, t as planEffectiveModelCatalogRows } from "./model-catalog-BFaZ221R.mjs";
import { n as normalizeModelCostConfig, r as normalizeResolvedPricing, t as calculateUsageCost } from "./usage-cost-Va5dwVFW.mjs";
import "./src-BpANEEBH.mjs";
import { a as normalizeProviderMapKeys } from "./models-config.merge-Deg2vlWf.mjs";
import { t as MODELS_JSON_STATE } from "./models-config-state-TumWTRCu.mjs";
import { c as hasRecordedUsageCost } from "./usage-XXLoqJQC.mjs";
import "./token-format-o0FIe7MV.mjs";
import path from "node:path";
import { isIP } from "node:net";
import { createHash } from "node:crypto";
//#region src/model-catalog/pricing.ts
const EMPTY_CONFIG = {};
const pricingContextByConfig = /* @__PURE__ */ new WeakMap();
function activeManifestRegistry(snapshot, config) {
	if (config.plugins?.enabled === false) return {
		plugins: [],
		diagnostics: []
	};
	return {
		diagnostics: snapshot.manifestRegistry.diagnostics,
		plugins: snapshot.manifestRegistry.plugins.filter((plugin) => isInstalledPluginEnabled(snapshot.index, plugin.id, config))
	};
}
function normalizedHostedKey(key, normalizeKey) {
	const slash = key.indexOf("/");
	if (slash <= 0 || slash === key.length - 1) return;
	return normalizeKey(key.slice(0, slash), key.slice(slash + 1));
}
function buildPricingContext(config, snapshot) {
	const registry = snapshot ? activeManifestRegistry(snapshot, config) : {
		plugins: [],
		diagnostics: []
	};
	const normalizeModel = createStaticProviderModelIdNormalizer({ manifestPlugins: snapshot ?? [] });
	const normalizeKey = (provider, model) => {
		const providerId = normalizeProviderId(provider);
		return buildModelCatalogRef(providerId, normalizeModel(providerId, model.trim()));
	};
	const catalog = /* @__PURE__ */ new Map();
	for (const row of planEffectiveModelCatalogRows({
		registry,
		config
	}).rows) if (row.cost) catalog.set(buildModelCatalogRef(row.provider, row.id), row.cost);
	const policies = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins) for (const [provider, policy] of Object.entries(plugin.modelPricing?.providers ?? {})) policies.set(provider, {
		external: policy.external !== false,
		authoritative: MODEL_PRICING_SOURCES.some(({ id, authoritative }) => authoritative && Boolean(policy[id]))
	});
	const hosted = snapshot ? getRemoteModelCatalogPricing(config) ?? {} : {};
	const normalizedHosted = /* @__PURE__ */ new Map();
	for (const [key, pricing] of Object.entries(hosted).toSorted(([a], [b]) => a.localeCompare(b))) {
		const normalized = normalizedHostedKey(key, normalizeKey);
		if (normalized && !normalizedHosted.has(normalized)) normalizedHosted.set(normalized, pricing);
	}
	return {
		config,
		normalizeKey,
		catalog,
		hosted,
		normalizedHosted,
		policies,
		fingerprint: JSON.stringify({
			catalog: [...catalog.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			hosted: Object.entries(hosted).toSorted(([a], [b]) => a.localeCompare(b)),
			normalizedHosted: [...normalizedHosted.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			policies: [...policies.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			normalization: [...snapshot?.owners.modelIdNormalizationPolicies ?? []].toSorted(([a], [b]) => a.localeCompare(b))
		})
	};
}
/** Reuses the static pricing policy captured for this config. */
function resolveModelPricingContext(config = EMPTY_CONFIG) {
	const existing = pricingContextByConfig.get(config);
	if (existing) return existing;
	let snapshot;
	try {
		snapshot = resolvePluginMetadataSnapshot({
			config,
			env: process.env,
			allowWorkspaceScopedCurrent: true
		});
	} catch {
		snapshot = void 0;
	}
	const context = buildPricingContext(config, snapshot);
	pricingContextByConfig.set(config, context);
	return context;
}
/** Prepare the existing config-owned context before synchronous per-record pricing. */
async function prepareModelPricingContext(config = EMPTY_CONFIG) {
	if (pricingContextByConfig.has(config)) return;
	const env = cloneEnvWithPlatformSemantics(process.env);
	const cache = getPluginCache();
	const release = retainPluginCache(cache);
	const metadata = cache.metadata;
	const signal = getPluginCacheRetirementSignal(cache);
	const assertCurrent = () => {
		signal.throwIfAborted();
		if (cache.metadata !== metadata) throw new Error("Pricing metadata changed during preparation; retry the operation.");
	};
	try {
		await withPluginCache(cache, async () => {
			let snapshot;
			try {
				snapshot = await resolvePluginMetadataSnapshotAsync({
					config,
					env,
					allowWorkspaceScopedCurrent: true
				});
			} catch (error) {
				if (isPluginCacheFactInvalidatedError(error)) throw error;
				snapshot = void 0;
			}
			assertCurrent();
			if (snapshot && isRemoteModelCatalogRefreshEnabled(config)) await prepareRemoteModelCatalogStartupSnapshot({ env });
			assertCurrent();
			if (!pricingContextByConfig.has(config)) {
				const context = buildPricingContext(config, snapshot);
				assertCurrent();
				pricingContextByConfig.set(config, context);
			}
		});
	} finally {
		release();
	}
}
function hasKnownPricing(pricing) {
	return Boolean(pricing.tieredPricing?.some((tier) => tier.input > 0 || tier.output > 0 || tier.cacheRead > 0 || tier.cacheWrite > 0)) || (pricing.input ?? 0) > 0 || (pricing.output ?? 0) > 0 || (pricing.cacheRead ?? 0) > 0 || (pricing.cacheWrite ?? 0) > 0;
}
function isPrivateOrLoopbackHost(hostname) {
	const host = hostname.trim().toLowerCase().replace(/^\[|\]$/gu, "");
	if (host === "localhost" || host === "localhost.localdomain" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
	const addressFamily = isIP(host);
	if (addressFamily === 6) return host === "::1" || host === "0:0:0:0:0:0:0:1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd");
	if (addressFamily === 4) return host.startsWith("127.") || host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.") || /^172\.(1[6-9]|2\d|3[0-1])\./u.test(host);
	return false;
}
function isPrivateOrLoopbackUrl(value) {
	if (!value) return false;
	try {
		return isPrivateOrLoopbackHost(new URL(value).hostname);
	} catch {
		return false;
	}
}
/** Resolves catalog-first pricing for a key prepared by this metadata context. */
function resolveModelPricing(context, key) {
	const provider = key.slice(0, key.indexOf("/"));
	const providerConfig = context.config.models?.providers?.[provider];
	const configuredModel = providerConfig?.models?.find((entry) => context.normalizeKey(provider, entry.id) === key);
	if (isPrivateOrLoopbackUrl(configuredModel?.baseUrl) || isPrivateOrLoopbackUrl(providerConfig?.baseUrl)) return;
	const baseModel = /^openrouter\/([^:]+):(?:nitro|floor)$/u.exec(key)?.[1];
	const pricingKeys = baseModel ? [key, `openrouter/${baseModel}`] : [key];
	const policy = context.policies.get(provider);
	for (const pricingKey of pricingKeys) {
		const catalog = context.catalog.get(pricingKey);
		if (catalog && hasKnownPricing(catalog)) return catalog;
		if (policy?.external === false) return;
		const hosted = context.hosted[pricingKey] ?? (policy ? void 0 : context.normalizedHosted.get(pricingKey));
		if (hosted && (hasKnownPricing(hosted) || policy?.authoritative)) return hosted;
	}
}
function modelCatalogPricingFingerprint(context) {
	const resolvedConfig = context.config;
	const configuredEndpoints = Object.entries(resolvedConfig.models?.providers ?? {}).toSorted(([a], [b]) => a.localeCompare(b)).map(([provider, providerConfig]) => ({
		provider,
		baseUrl: providerConfig.baseUrl,
		models: (providerConfig.models ?? []).map((model) => ({
			id: model.id,
			baseUrl: model.baseUrl
		})).toSorted((a, b) => a.id.localeCompare(b.id))
	}));
	return JSON.stringify({
		policyVersion: 2,
		pricing: context.fingerprint,
		configuredEndpoints
	});
}
//#endregion
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
function isRawModelCostConfig(value) {
	return value !== null && typeof value === "object";
}
function hasModelCostRates(cost) {
	return cost !== void 0 && (cost.input !== void 0 || cost.output !== void 0 || cost.cacheRead !== void 0 || cost.cacheWrite !== void 0 || Boolean(cost.tieredPricing?.length));
}
function collectProviderCostSources(providers) {
	return Object.entries(normalizeProviderMapKeys(providers)).flatMap(([providerKey, provider]) => (provider?.models ?? []).map((model) => ({
		providerKey,
		model,
		modelId: model.id
	})));
}
function buildProviderCostIndexBundle(structure, normalizeKey) {
	const sources = /* @__PURE__ */ new Map();
	for (const { providerKey, model, modelId } of structure) {
		const key = normalizeKey(providerKey, modelId);
		const rows = sources.get(key) ?? [];
		rows.push(model);
		sources.set(key, rows);
	}
	return {
		entries: /* @__PURE__ */ new Map(),
		sources,
		structure
	};
}
function refreshProviderCostIndexEntry(index, key) {
	let cost;
	for (const model of index.sources.get(key) ?? []) if (isRawModelCostConfig(model.cost)) cost = mergeModelCost(model.cost, cost);
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
	const structure = collectProviderCostSources(providers);
	if (!index || index.structure.length !== structure.length || index.structure.some((source, position) => {
		const current = structure[position];
		return !current || source.model !== current.model || source.modelId !== current.modelId || source.providerKey !== current.providerKey;
	})) {
		index = buildProviderCostIndexBundle(structure, normalizeKey);
		cache.set(providers, index);
	}
	for (const entryKey of key === void 0 ? index.sources.keys() : [key]) refreshProviderCostIndexEntry(index, entryKey);
	return index.entries;
}
function loadModelsJsonCostIndex(options) {
	const agentDir = options?.agentDir;
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
		const normalizeKey = options?.normalizeKey ?? normalizeRawModelKey;
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
	const resolvedAgentDir = resolveCostAgentDir(config, agentDir);
	const sourceConfig = config ? projectConfigOntoRuntimeSourceSnapshot(config) : void 0;
	const pricingContext = resolveModelPricingContext(config);
	const serialized = stableCostFingerprintValue({
		configuredRaw: serializeCostIndex(getProviderCostIndex(sourceConfig?.models?.providers)),
		configuredNormalized: serializeCostIndex(getProviderCostIndex(sourceConfig?.models?.providers, pricingContext.normalizeKey)),
		modelsJsonRaw: serializeCostIndex(loadModelsJsonCostIndex({ agentDir: resolvedAgentDir })),
		modelsJsonNormalized: serializeCostIndex(loadModelsJsonCostIndex({
			agentDir: resolvedAgentDir,
			normalizeKey: pricingContext.normalizeKey
		})),
		catalogPricing: modelCatalogPricingFingerprint(pricingContext)
	});
	return createHash("sha256").update(serialized).digest("hex");
}
/**
* Resolves local models.json first, then authored overrides over effective catalog prices.
* Complete direct prices need no plugin normalization or provider discovery.
*/
function resolveModelCostConfig(params) {
	const provider = normalizeProviderId(normalizeOptionalString(params.provider) ?? "");
	const model = normalizeOptionalString(params.model);
	if (!provider || !model) return;
	const rawKey = normalizeRawModelKey(provider, model);
	const agentDir = resolveCostAgentDir(params.config, params.agentDir);
	const rawModelsJsonCost = loadModelsJsonCostIndex({ agentDir }).get(rawKey);
	if (hasModelCostRates(rawModelsJsonCost)) return normalizeModelCostConfig(rawModelsJsonCost);
	const sourceConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	let configuredCost = getProviderCostIndex(sourceConfig?.models?.providers, void 0, rawKey).get(rawKey);
	let pricingContext;
	if (params.allowPluginNormalization !== false && !configuredCost) {
		pricingContext = resolveModelPricingContext(params.config);
		const key = pricingContext.normalizeKey(provider, model);
		const modelsJsonCost = loadModelsJsonCostIndex({
			agentDir,
			normalizeKey: pricingContext.normalizeKey
		}).get(key);
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
export { resetUsageFormatCachesForTest as a, prepareModelPricingContext as c, formatUsd as i, estimateUsageCost as n, resolveModelCostConfig as o, formatCostUsageCachePrefix as r, resolveModelCostConfigFingerprint as s, estimateAggregateUsageCost as t };
