import { d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as normalizePluginProviderBaseUrl, r as matchesPluginProviderEndpoint } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { r as planManifestModelCatalogSuppressions } from "./manifest-planner-LLbsmVKX.mjs";
import { i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import "./model-catalog-BFaZ221R.mjs";
//#region src/plugins/manifest-model-suppression.ts
function listManifestModelCatalogSuppressions(params) {
	const snapshot = params.snapshot;
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	const registry = {
		diagnostics: snapshot.diagnostics,
		plugins: snapshot.plugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.config,
			normalizedConfig
		}))
	};
	const planned = planManifestModelCatalogSuppressions({ registry });
	return {
		plugins: registry.plugins,
		suppressions: planned.suppressions
	};
}
function prepareNativeCatalogOwners(plugins) {
	const owners = /* @__PURE__ */ new Map();
	for (const plugin of plugins) for (const [provider, catalog] of Object.entries(plugin.modelCatalog?.providers ?? {})) {
		const normalizedBaseUrl = catalog.baseUrl && normalizePluginProviderBaseUrl(catalog.baseUrl);
		if (!normalizedBaseUrl) continue;
		const host = normalizeSuppressionHost(new URL(normalizedBaseUrl).hostname);
		const owner = {
			pluginId: plugin.id,
			provider: normalizeLowercaseStringOrEmpty(provider),
			native: (plugin.providerEndpoints ?? []).some((endpoint) => endpoint.endpointClass !== "custom" && endpoint.endpointClass !== "local" && matchesPluginProviderEndpoint(endpoint, {
				host,
				normalizedBaseUrl
			}))
		};
		const previous = owners.get(host);
		if (previous === void 0) owners.set(host, owner);
		else if (previous && previous.pluginId === owner.pluginId && previous.provider === owner.provider) owners.set(host, {
			...owner,
			native: previous.native || owner.native
		});
		else owners.set(host, null);
	}
	return owners;
}
function buildManifestSuppressionError(params) {
	const ref = `${params.provider}/${params.modelId}`;
	return params.reason ? `Unknown model: ${ref}. ${params.reason}` : `Unknown model: ${ref}.`;
}
function normalizeBaseUrlHost(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return "";
	try {
		return normalizeSuppressionHost(new URL(trimmed).hostname);
	} catch {
		return "";
	}
}
function normalizeSuppressionHost(host) {
	return normalizeLowercaseStringOrEmpty(host).replace(/\.+$/, "");
}
function resolveConfiguredProviderValue(params) {
	const providers = params.config?.models?.providers;
	if (!providers) return;
	for (const [providerId, entry] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== params.provider) continue;
		return entry;
	}
}
function manifestSuppressionMatchesConditions(params) {
	const { entry, allowedApis, allowedHosts } = params.suppression;
	if (!entry.when) return true;
	if (entry.retirement && allowedHosts && !params.baseUrl) return false;
	const configuredProvider = resolveConfiguredProviderValue({
		provider: params.provider,
		config: params.config
	});
	if (allowedApis) {
		const effectiveApi = params.api !== void 0 ? normalizeLowercaseStringOrEmpty(params.api) : configuredProvider ? normalizeLowercaseStringOrEmpty(configuredProvider.api) : params.provider;
		if (!effectiveApi || !allowedApis.has(effectiveApi)) return false;
	}
	if (allowedHosts) {
		const baseUrlHost = normalizeBaseUrlHost(params.baseUrl ?? configuredProvider?.baseUrl);
		if (!baseUrlHost && !params.baseUrl && !configuredProvider?.baseUrl) return true;
		if (!baseUrlHost) return false;
		if (!allowedHosts.has(baseUrlHost)) return false;
	}
	return true;
}
function buildManifestBuiltInModelSuppressionResolver(params) {
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot(params);
	const cache = getPluginMetadataSnapshotCache(snapshot).metadata.modelSuppressionResolvers;
	let compiled = cache.get(snapshot);
	if (!compiled) {
		compiled = { byConfig: /* @__PURE__ */ new WeakMap() };
		cache.set(snapshot, compiled);
	}
	const cached = params.config ? compiled.byConfig.get(params.config) : compiled.unconfigured;
	if (cached) return cached;
	const plan = listManifestModelCatalogSuppressions({
		snapshot,
		config: params.config
	});
	const declaredProviders = new Set(plan.plugins.flatMap((plugin) => [
		...plugin.providers ?? [],
		...Object.keys(plugin.modelCatalog?.providers ?? {}),
		...Object.keys(plugin.modelCatalog?.aliases ?? {})
	].map(normalizeLowercaseStringOrEmpty)));
	const nativeOwners = prepareNativeCatalogOwners(plan.plugins);
	const suppressions = /* @__PURE__ */ new Map();
	for (const entry of plan.suppressions) {
		const allowedHosts = entry.when?.baseUrlHosts?.length ? new Set(entry.when.baseUrlHosts.map(normalizeSuppressionHost)) : void 0;
		const prepared = {
			entry,
			allowedApis: entry.when?.providerConfigApiIn?.length ? new Set(entry.when.providerConfigApiIn.map(normalizeLowercaseStringOrEmpty)) : void 0,
			allowedHosts,
			nativeHosts: entry.retirement && allowedHosts ? new Set([...allowedHosts].filter((host) => {
				const owner = nativeOwners.get(host);
				return owner?.native && owner.pluginId === entry.pluginId && owner.provider === entry.provider;
			})) : void 0
		};
		const rules = suppressions.get(entry.model);
		if (rules) rules.push(prepared);
		else suppressions.set(entry.model, [prepared]);
	}
	const physicalRetirement = (provider, id, baseUrl, config, api) => {
		if (!baseUrl || declaredProviders.has(provider)) return;
		const host = normalizeBaseUrlHost(baseUrl);
		return suppressions.get(id)?.find((prepared) => prepared.nativeHosts?.has(host) && manifestSuppressionMatchesConditions({
			suppression: prepared,
			provider,
			baseUrl,
			config,
			api
		}));
	};
	const resolve = (input) => {
		const provider = normalizeLowercaseStringOrEmpty(input.provider);
		const modelId = normalizeLowercaseStringOrEmpty(input.id);
		if (!provider || !modelId) return;
		const candidates = suppressions.get(modelId);
		if (!candidates) return;
		const matches = (prepared) => (!input.unconditionalOnly || !prepared.entry.when) && manifestSuppressionMatchesConditions({
			suppression: prepared,
			provider,
			baseUrl: input.baseUrl,
			config: params.config,
			api: input.api
		});
		const direct = candidates.find((prepared) => prepared.entry.provider === provider && matches(prepared));
		const physical = !direct && !input.unconditionalOnly ? physicalRetirement(provider, modelId, input.baseUrl, params.config, input.api) : void 0;
		const suppression = (direct ?? physical)?.entry;
		if (!suppression) return;
		return {
			suppress: true,
			errorMessage: buildManifestSuppressionError({
				provider,
				modelId,
				reason: suppression.retirement ? `${suppression.reason ?? "This model has retired."} Run \`openclaw doctor --fix\` to ${suppression.retirement.replacedBy ? `replace it with ${suppression.retirement.replacedBy}` : "clear the retired override and use the default model"}.` : suppression.reason
			}),
			...suppression.retirement ? { retirement: suppression.retirement } : {}
		};
	};
	const resolver = Object.assign(resolve, { hasRetirementCandidate(input) {
		const provider = normalizeLowercaseStringOrEmpty(input.provider);
		const id = normalizeLowercaseStringOrEmpty(input.id);
		const candidates = suppressions.get(id);
		if (!candidates) return false;
		if (candidates.some((rule) => rule.entry.provider === provider && rule.entry.retirement)) return true;
		if (declaredProviders.has(provider)) return false;
		const configured = resolveConfiguredProviderValue({
			provider,
			config: params.config
		});
		const model = findConfiguredProviderModel(configured, provider, id, normalizeLowercaseStringOrEmpty);
		const baseUrl = model?.baseUrl ?? configured?.baseUrl;
		if (!baseUrl) return false;
		const config = projectModelProviderConfig(params.config, provider, {
			api: model?.api ?? configured?.api,
			baseUrl
		});
		return Boolean(physicalRetirement(provider, id, baseUrl, config));
	} });
	if (params.config) compiled.byConfig.set(params.config, resolver);
	else compiled.unconfigured = resolver;
	return resolver;
}
//#endregion
export { buildManifestBuiltInModelSuppressionResolver as t };
