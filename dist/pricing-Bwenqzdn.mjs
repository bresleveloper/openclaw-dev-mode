import { D as withPluginCache, c as getPluginCacheRetirementSignal, g as isPluginCacheFactInvalidatedError, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Zl-RSskC.mjs";
import { t as MODEL_PRICING_SOURCES } from "./model-catalog-pricing-C9-7BMLS.mjs";
import { d as resolvePluginMetadataSnapshotAsync, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as createStaticProviderModelIdNormalizer } from "./model-ref-shared-KBg0y299.mjs";
import { f as isRemoteModelCatalogRefreshEnabled, i as getRemoteModelCatalogPricing, o as getRemoteModelCatalogUpstreamPricing, r as getActiveRemoteModelCatalog, s as prepareRemoteModelCatalogStartupSnapshot } from "./remote-overlay-C3A-3o4_.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-ChjLpeN0.mjs";
import { isIP } from "node:net";
//#region src/model-catalog/pricing.ts
const EMPTY_CONFIG = {};
const pricingContextByConfig = /* @__PURE__ */ new WeakMap();
function readPricingContext(config, catalog) {
	const contexts = pricingContextByConfig.get(config);
	return catalog ? contexts?.catalogs.get(catalog) : contexts?.absent;
}
function retainPricingContext(config, catalog, context) {
	let contexts = pricingContextByConfig.get(config);
	if (!contexts) {
		contexts = { catalogs: /* @__PURE__ */ new WeakMap() };
		pricingContextByConfig.set(config, contexts);
	}
	if (catalog) contexts.catalogs.set(catalog, context);
	else contexts.absent = context;
}
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
	const rowKeys = /* @__PURE__ */ new Set();
	for (const row of planEffectiveModelCatalogRows({
		registry,
		config
	}).rows) {
		const ref = buildModelCatalogRef(row.provider, row.id);
		rowKeys.add(ref);
		if (row.cost) catalog.set(ref, row.cost);
	}
	const policies = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins) for (const [provider, policy] of Object.entries(plugin.modelPricing?.providers ?? {})) policies.set(provider, {
		external: policy.external !== false,
		authoritative: MODEL_PRICING_SOURCES.some(({ id, authoritative }) => authoritative && Boolean(policy[id])),
		passthroughSources: MODEL_PRICING_SOURCES.flatMap(({ id }) => {
			const source = policy[id];
			return source && source.passthroughProviderModel ? [id] : [];
		})
	});
	const hosted = snapshot ? getRemoteModelCatalogPricing(config) ?? {} : {};
	const upstream = snapshot ? getRemoteModelCatalogUpstreamPricing(config) ?? {} : {};
	const policyFree = [...Object.entries(hosted), ...Object.entries(upstream).flatMap(([key, { rates, passthroughOnly }]) => passthroughOnly || !rates[0] ? [] : [[key, {
		cost: rates[0].cost,
		explicit: false
	}]])];
	const normalizedHosted = /* @__PURE__ */ new Map();
	for (const [key, pricing] of policyFree.toSorted(([a], [b]) => a.localeCompare(b))) {
		const normalized = normalizedHostedKey(key, normalizeKey);
		if (normalized && normalized !== key && rowKeys.has(normalized)) continue;
		if (normalized && !normalizedHosted.has(normalized)) normalizedHosted.set(normalized, pricing);
	}
	return {
		config,
		normalizeKey,
		catalog,
		hosted,
		upstream,
		normalizedHosted,
		policies,
		fingerprint: JSON.stringify({
			catalog: [...catalog.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			hosted: Object.entries(hosted).toSorted(([a], [b]) => a.localeCompare(b)),
			upstream: Object.entries(upstream).toSorted(([a], [b]) => a.localeCompare(b)),
			normalizedHosted: [...normalizedHosted.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			policies: [...policies.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
			normalization: [...snapshot?.owners.modelIdNormalizationPolicies ?? []].toSorted(([a], [b]) => a.localeCompare(b))
		})
	};
}
/** Reuses policy and prices for the config's exact accepted catalog generation. */
function resolveModelPricingContext(config = EMPTY_CONFIG) {
	const existing = readPricingContext(config, getActiveRemoteModelCatalog(config, false));
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
	retainPricingContext(config, getActiveRemoteModelCatalog(config, false), context);
	return context;
}
/** Prepare the existing config-owned context before synchronous per-record pricing. */
async function prepareModelPricingContext(config = EMPTY_CONFIG) {
	if (readPricingContext(config, getActiveRemoteModelCatalog(config, false))) return;
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
			const catalog = getActiveRemoteModelCatalog(config, false);
			if (!readPricingContext(config, catalog)) {
				const context = buildPricingContext(config, snapshot);
				assertCurrent();
				retainPricingContext(config, catalog, context);
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
		const vendorKey = policy?.passthroughSources.length ? pricingKey.slice(provider.length + 1) : void 0;
		const vendorRow = vendorKey ? context.catalog.get(vendorKey) : void 0;
		const passthrough = vendorRow && hasKnownPricing(vendorRow) ? vendorRow : vendorKey ? context.upstream[vendorKey]?.rates.find(({ source }) => policy?.passthroughSources.includes(source))?.cost : void 0;
		const hosted = context.hosted[pricingKey] ?? (policy ? passthrough && {
			cost: passthrough,
			explicit: false
		} : context.normalizedHosted.get(pricingKey));
		if (hosted && (!hosted.explicit || catalog) && (hasKnownPricing(hosted.cost) || hosted.explicit || policy?.authoritative)) return hosted.cost;
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
		policyVersion: 3,
		pricing: context.fingerprint,
		configuredEndpoints
	});
}
//#endregion
export { resolveModelPricingContext as i, prepareModelPricingContext as n, resolveModelPricing as r, modelCatalogPricingFingerprint as t };
