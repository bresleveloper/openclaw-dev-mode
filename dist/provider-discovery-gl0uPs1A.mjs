import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as copyProviderCatalogResultProjection, t as copyProviderCatalogOutcomes } from "./provider-catalog-result-Bk2YBOpa.mjs";
//#region src/plugins/provider-discovery.ts
/** Control-plane provider discovery helpers that keep runtime imports lazy until catalog hooks run. */
const DISCOVERY_ORDER = [
	"simple",
	"profile",
	"paired",
	"late"
];
const DANGEROUS_PROVIDER_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const providerRuntimeLoader = createLazyImportLoader(() => import("./plugins/provider-discovery.runtime.js"));
function loadProviderRuntime() {
	return providerRuntimeLoader.load();
}
function resolveProviderCatalogHook(provider) {
	return provider.catalog;
}
function resolveProviderCatalogOrderHook(provider) {
	return resolveProviderCatalogHook(provider) ?? provider.staticCatalog;
}
function createProviderConfigRecord() {
	return Object.create(null);
}
function isSafeProviderConfigKey(value) {
	return value !== "" && !DANGEROUS_PROVIDER_KEYS.has(value);
}
async function planRuntimePluginDiscovery(params) {
	return (await loadProviderRuntime()).planPluginDiscoveryRuntime(params);
}
/** Loads provider runtime discovery and filters to providers that can produce catalog order entries. */
async function resolveRuntimePluginDiscoveryProviders(params) {
	return (await loadProviderRuntime()).resolvePluginDiscoveryProvidersRuntime(params).filter((provider) => resolveProviderCatalogOrderHook(provider) || params.includeSyntheticAuthProviders === true && (typeof provider.resolveSyntheticAuth === "function" || typeof provider.prepareSyntheticAuth === "function"));
}
/** Groups plugin providers into stable discovery phases for catalog probing. */
function groupPluginDiscoveryProvidersByOrder(providers) {
	const grouped = {
		simple: [],
		profile: [],
		paired: [],
		late: []
	};
	for (const provider of providers) grouped[resolveProviderCatalogOrderHook(provider)?.order ?? "late"].push(provider);
	for (const order of DISCOVERY_ORDER) grouped[order].sort((a, b) => a.label.localeCompare(b.label));
	return grouped;
}
/** Normalizes a plugin discovery response into safe provider-config keys. */
function normalizePluginDiscoveryResult(params) {
	const result = params.result;
	if (!result) return {};
	const projection = copyProviderCatalogResultProjection(result);
	if (projection.kind === "provider") {
		const normalized = createProviderConfigRecord();
		for (const providerId of [
			params.provider.id,
			...params.provider.aliases ?? [],
			...params.provider.hookAliases ?? []
		]) {
			const normalizedKey = normalizeProviderId(providerId);
			if (!isSafeProviderConfigKey(normalizedKey)) continue;
			normalized[normalizedKey] = projection.provider;
		}
		return normalized;
	}
	const normalized = createProviderConfigRecord();
	if (projection.kind !== "providers") return normalized;
	for (const [key, value] of projection.providers) {
		const normalizedKey = normalizeProviderId(key);
		if (!isSafeProviderConfigKey(normalizedKey) || !value) continue;
		normalized[normalizedKey] = value;
	}
	return normalized;
}
async function runProviderCatalog(params) {
	const hook = resolveProviderCatalogHook(params.provider);
	if (!hook) return;
	const result = await hook.run({
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.providerIds !== void 0 ? { providerIds: params.providerIds } : {},
		resolveProviderApiKey: params.resolveProviderApiKey,
		resolveProviderAuth: params.resolveProviderAuth
	});
	if (params.isActive?.() === false) return;
	for (const outcome of copyProviderCatalogOutcomes(result)) {
		if (params.providerIds !== void 0 && !params.providerIds.some((providerId) => normalizeProviderId(providerId) === normalizeProviderId(outcome.provider))) continue;
		params.reportCatalogOutcome?.(outcome);
	}
	return result;
}
function runProviderStaticCatalog(params) {
	params.signal?.throwIfAborted();
	return params.provider.staticCatalog?.run({
		...params.signal ? { signal: params.signal } : {},
		config: {},
		env: {},
		resolveProviderApiKey: () => ({ apiKey: void 0 }),
		resolveProviderAuth: () => ({
			apiKey: void 0,
			mode: "none",
			source: "none"
		})
	});
}
/**
* Runs sterile provider catalogs once so lifecycle owners can reuse the immutable results.
* Providers remain attached to their plugin identity for later agent-specific scope filtering.
*/
async function prepareProviderStaticCatalog(params) {
	const entries = [];
	const byOrder = groupPluginDiscoveryProvidersByOrder([...params.providers]);
	for (const order of DISCOVERY_ORDER) for (const provider of byOrder[order]) {
		if (!provider.staticCatalog) continue;
		const result = await runProviderStaticCatalog({
			provider,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		entries.push(Object.freeze({
			provider,
			result,
			providerConfigs: normalizePluginDiscoveryResult({
				provider,
				result
			})
		}));
	}
	return Object.freeze({
		providers: Object.freeze([...params.providers]),
		entries: Object.freeze(entries)
	});
}
function resolvePreparedProviderStaticConfigs(prepared) {
	const providers = {};
	for (const entry of prepared?.entries ?? []) Object.assign(providers, entry.providerConfigs);
	return providers;
}
//#endregion
export { resolvePreparedProviderStaticConfigs as a, runProviderStaticCatalog as c, prepareProviderStaticCatalog as i, normalizePluginDiscoveryResult as n, resolveRuntimePluginDiscoveryProviders as o, planRuntimePluginDiscovery as r, runProviderCatalog as s, groupPluginDiscoveryProvidersByOrder as t };
