import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-NlcA0RRK.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { t as createConfiguredProviderCatalogModelIdNormalizer } from "./model-ref-shared-KBg0y299.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { b as overlayCatalogMetadata, r as buildConfiguredModelCatalog } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-CVmOODN3.mjs";
import { r as modelSupportsInput } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-2NQ6j_Jm.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-ChjLpeN0.mjs";
import { u as resolveClaudeFable5ModelIdentity } from "./anthropic-D-i5CCnY.mjs";
import "./src-UF9QYDzr.mjs";
import { t as augmentModelCatalogWithProviderPlugins } from "./provider-runtime.runtime.js";
import { r as modelCatalogRowToEntry } from "./model-catalog-entry-BfooR5F2.mjs";
import { n as compareModelCatalogEntries, t as assignProviderModelOrder } from "./model-catalog-order-Cq-GKb0A.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-ByP944Cg.mjs";
//#region src/agents/model-catalog.ts
/**
* Loads bundled, manifest, and discovered model catalog entries.
*/
const log = createSubsystemLogger("model-catalog");
let hasLoggedModelCatalogError = false;
let manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
const loadModelSuppression = createLazyPromise(() => import("./model-suppression-BY3k69HS.mjs"));
const loadProviderApiKeyResolver = createLazyPromise(() => import("./models-config.providers.secrets-136AMxH5.mjs"));
function resetModelCatalogBuilderCacheForTest() {
	manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
	hasLoggedModelCatalogError = false;
}
function normalizeCatalogEntryContract(entry) {
	if (entry.api === "anthropic-messages" && resolveClaudeFable5ModelIdentity({
		id: entry.id,
		params: entry.params
	})) return {
		...entry,
		reasoning: true
	};
	return entry;
}
function mergeCatalogEntries(models, entries, options) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const indexByKey = new Map(models.map((entry, index) => [keyOf(entry), index]));
	for (const entry of entries) {
		const key = keyOf(entry);
		const existingIndex = indexByKey.get(key);
		if (existingIndex === void 0) {
			models.push(entry);
			indexByKey.set(key, models.length - 1);
			continue;
		}
		const existing = models.at(existingIndex);
		if (existing) {
			const routes = options?.catalogRoutes;
			const routeIndex = options?.preserveBaseCompat ? routes?.indexByKey.get(catalogRouteVariantKey(entry, key)) : void 0;
			const catalogRoute = routeIndex === void 0 ? void 0 : routes?.entries[routeIndex];
			models[existingIndex] = overlayCatalogMetadata(catalogRoute ?? existing, entry, options);
		}
	}
}
function catalogRouteVariantKey(entry, identityKey) {
	return [
		identityKey,
		entry.api ?? "",
		normalizeCatalogRouteBaseUrl(entry.baseUrl) ?? ""
	].join("\0");
}
function mergeCatalogRouteVariants(collector, entries, options) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	for (const entry of entries) {
		const key = catalogRouteVariantKey(entry, keyOf(entry));
		const existingIndex = collector.indexByKey.get(key);
		if (existingIndex === void 0) {
			collector.entries.push(entry);
			collector.indexByKey.set(key, collector.entries.length - 1);
			continue;
		}
		const existingEntry = collector.entries[existingIndex];
		if (existingEntry === void 0) continue;
		collector.entries[existingIndex] = overlayCatalogMetadata(existingEntry, entry, options);
	}
}
function createModelCatalogSnapshot(entries, routeVariants, providerOutcomes) {
	return {
		entries: sortModelCatalogEntries(applyReadyCatalogModelOrder(entries, providerOutcomes)),
		routeVariants: sortModelCatalogEntries(applyReadyCatalogModelOrder(routeVariants.entries, providerOutcomes))
	};
}
function applyReadyCatalogModelOrder(entries, outcomes) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const orders = /* @__PURE__ */ new Map();
	for (const outcome of outcomes ?? []) {
		if (outcome.status !== "ready" || !outcome.modelOrder?.length) continue;
		const provider = normalizeProviderId(outcome.provider);
		const order = /* @__PURE__ */ new Map();
		for (const id of outcome.modelOrder) {
			const key = keyOf({
				provider,
				id
			});
			if (!order.has(key)) order.set(key, order.size);
		}
		orders.set(provider, order);
	}
	if (orders.size === 0) return entries;
	return entries.map((entry) => {
		const order = orders.get(normalizeProviderId(entry.provider));
		if (!order) return entry;
		const rank = order.get(keyOf(entry));
		return {
			...entry,
			providerOrder: rank ?? (entry.providerOrder === void 0 ? void 0 : order.size + entry.providerOrder)
		};
	});
}
function resolveEligibleManifestCatalogPlugins(snapshot, config) {
	let normalizedConfig;
	return snapshot.plugins.filter((plugin) => plugin.modelCatalog && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config,
		normalizedConfig: config.plugins && (normalizedConfig ??= normalizePluginsConfig(config.plugins))
	}));
}
function loadManifestModelCatalog(params) {
	if (params.config.models?.mode === "replace") return [];
	const resolvedSnapshot = params.metadataSnapshot ?? (params.fallbackToMetadataScan === false ? getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		...params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {}
	}) : resolvePluginMetadataSnapshot({
		config: params.config,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		env: params.env ?? process.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0
	}));
	return resolvedSnapshot ? loadManifestModelCatalogRows(params.config, resolvedSnapshot) : [];
}
/** Overlays configured capabilities on a copy of the captured catalog. */
function overlayConfiguredModelCatalog(params) {
	const models = params.config.models?.mode === "replace" ? [] : [...params.catalog];
	mergeCatalogEntries(models, buildConfiguredModelCatalog({
		cfg: params.config,
		catalog: models,
		workspaceDir: params.workspaceDir
	}), { preserveBaseCompat: true });
	return models;
}
function loadManifestModelCatalogRows(config, snapshot, preparedPlan) {
	if (config.models?.mode === "replace") return [];
	const cached = manifestModelCatalogCache.get(config);
	if (cached?.snapshot === snapshot) return cached.rows;
	const plugins = resolveEligibleManifestCatalogPlugins(snapshot, config);
	const plan = preparedPlan ?? planEffectiveModelCatalogRows({
		registry: { plugins },
		config
	});
	const providerOrderByKey = /* @__PURE__ */ new Map();
	for (const plugin of plugins) for (const [provider, providerCatalog] of Object.entries(plugin.modelCatalog?.providers ?? {})) providerCatalog.models.forEach((model, providerOrder) => {
		const key = buildModelCatalogMergeKey(provider, model.id);
		if (!providerOrderByKey.has(key)) providerOrderByKey.set(key, providerOrder);
	});
	const rows = plan.rows.map((row) => {
		const entry = modelCatalogRowToEntry(row);
		const providerOrder = providerOrderByKey.get(buildModelCatalogMergeKey(row.provider, row.id));
		if (providerOrder !== void 0) entry.providerOrder = providerOrder;
		return entry;
	});
	manifestModelCatalogCache.set(config, {
		snapshot,
		rows
	});
	return rows;
}
function sortModelCatalogEntries(entries) {
	return entries.map(normalizeCatalogEntryContract).toSorted(compareModelCatalogEntries);
}
/** Builds the catalog once for a lifecycle generation. No request-time discovery or cache IO. */
async function buildPreparedModelCatalogSnapshot(params) {
	const models = [];
	const routeVariants = {
		entries: [],
		indexByKey: /* @__PURE__ */ new Map()
	};
	const cfg = params.config;
	const env = params.env ?? process.env;
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		log.info(`model-catalog stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	try {
		const workspaceDir = params.workspaceDir;
		const manifestMetadataSnapshot = params.metadataSnapshot;
		const normalizeModelId = createConfiguredProviderCatalogModelIdNormalizer({ manifestPlugins: manifestMetadataSnapshot });
		const normalizeProvider = createPreparedModelCatalogProviderNormalizer(manifestMetadataSnapshot, cfg, env);
		const observedProviders = new Set(params.providerOutcomes?.map((outcome) => normalizeProvider(outcome.provider)));
		const { buildShouldSuppressBuiltInModelCore } = await loadModelSuppression();
		logStage("catalog-deps-ready");
		const entries = params.modelRegistry.getAll();
		const manifestPlan = planEffectiveModelCatalogRows({
			registry: { plugins: resolveEligibleManifestCatalogPlugins(manifestMetadataSnapshot, cfg) },
			config: cfg
		});
		const declaredManifestModels = loadManifestModelCatalogRows(cfg, manifestMetadataSnapshot, manifestPlan);
		logStage("registry-read", `entries=${entries.length}`);
		const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModelCore({ config: cfg });
		logStage("suppress-resolver-ready");
		for (const entry of entries) {
			const id = entry.id.trim();
			if (!id) continue;
			const rawProvider = entry.provider.trim();
			if (!rawProvider) continue;
			const provider = normalizeProvider(rawProvider);
			const baseUrl = entry.baseUrl?.trim();
			if (shouldSuppressBuiltInModel({
				provider,
				id,
				baseUrl
			})) continue;
			const model = modelCatalogRowToEntry({
				...entry,
				id,
				name: entry.name.trim() || id,
				provider,
				baseUrl
			});
			models.push(model);
		}
		const orderedRegistryModels = assignProviderModelOrder(models, declaredManifestModels, { appendUnknown: false });
		models.splice(0, models.length, ...orderedRegistryModels);
		mergeCatalogRouteVariants(routeVariants, orderedRegistryModels);
		const dynamicManifestKeys = new Set(manifestPlan.entries.flatMap((entry) => entry.discovery === "runtime" || entry.discovery === "refreshable" ? entry.rows.map((row) => buildModelCatalogMergeKey(row.provider, row.id)) : []));
		const runtimeDiscoveryProviders = /* @__PURE__ */ new Set([...observedProviders, ...manifestPlan.entries.flatMap((entry) => entry.discovery === "runtime" || entry.discovery === "refreshable" ? [normalizeProviderId(entry.provider)] : [])]);
		const manifestKeyOf = createModelCatalogIdentityKeyResolver();
		const discoveredKeys = new Set(models.map(manifestKeyOf));
		const manifestModels = declaredManifestModels.filter((entry) => (params.includeProviderPluginAugmentation === false || !dynamicManifestKeys.has(buildModelCatalogMergeKey(entry.provider, entry.id))) && (!observedProviders.has(entry.provider) || discoveredKeys.has(manifestKeyOf(entry))));
		mergeCatalogRouteVariants(routeVariants, manifestModels);
		mergeCatalogEntries(models, manifestModels);
		logStage("manifest-models-merged", `entries=${models.length}`);
		const configuredCatalogParams = {
			cfg,
			catalog: orderedRegistryModels,
			manifestPlugins: manifestMetadataSnapshot
		};
		const configuredModels = buildConfiguredModelCatalog(configuredCatalogParams);
		logStage("configured-models-prepared", `entries=${models.length}`);
		if (cfg.models?.mode !== "replace" && !params.readOnly && params.includeProviderPluginAugmentation !== false) {
			const augmentEntries = [...models];
			if (configuredModels.length > 0) mergeCatalogEntries(augmentEntries, configuredModels, {
				catalogRoutes: routeVariants,
				preserveBaseCompat: true
			});
			const { createProviderApiKeyResolverFromPreparedCredentials } = await loadProviderApiKeyResolver();
			const resolveProviderApiKeyForProvider = createProviderApiKeyResolverFromPreparedCredentials(env, params.authCredentials, cfg, workspaceDir);
			const resolveProviderApiKey = (providerId) => providerId?.trim() ? resolveProviderApiKeyForProvider(providerId) : {
				apiKey: void 0,
				discoveryApiKey: void 0
			};
			const supplemental = await augmentModelCatalogWithProviderPlugins({
				providerIds: params.providerIds,
				config: cfg,
				workspaceDir,
				env,
				metadataSnapshot: manifestMetadataSnapshot,
				context: {
					config: cfg,
					agentDir: params.agentDir,
					workspaceDir,
					env,
					resolveProviderApiKey,
					entries: augmentEntries
				}
			});
			if (supplemental.length > 0) {
				const keyOf = createModelCatalogIdentityKeyResolver();
				const accountVisibleModelKeys = new Set([...models, ...configuredModels].map(keyOf));
				const normalizedSupplemental = [];
				for (const entry of supplemental) {
					const provider = normalizeProvider(entry.provider);
					const owners = manifestMetadataSnapshot.owners;
					const pluginIds = owners.modelCatalogProviders.get(provider) ?? owners.providers.get(provider);
					const pluginId = pluginIds?.length === 1 ? pluginIds[0] : void 0;
					const plugin = pluginId ? manifestMetadataSnapshot.byPluginId.get(pluginId) : void 0;
					if (!isProviderCatalogSourceAllowed({
						provider,
						config: cfg,
						plugin
					})) continue;
					const id = normalizeModelId(provider, entry.id);
					if (runtimeDiscoveryProviders.has(normalizeProviderId(provider)) && !accountVisibleModelKeys.has(keyOf({
						provider,
						id
					}))) continue;
					normalizedSupplemental.push({
						...entry,
						provider,
						id
					});
				}
				const orderedSupplemental = assignProviderModelOrder(normalizedSupplemental, [...declaredManifestModels, ...models]);
				mergeCatalogRouteVariants(routeVariants, orderedSupplemental);
				mergeCatalogEntries(models, orderedSupplemental);
			}
		}
		logStage("plugin-models-merged", `entries=${models.length}`);
		if (configuredModels.length > 0) {
			const configuredOverrides = buildConfiguredModelCatalog(configuredCatalogParams);
			routeVariants.indexByKey.clear();
			const keyOf = createModelCatalogIdentityKeyResolver();
			routeVariants.entries.forEach((entry, index) => {
				const key = catalogRouteVariantKey(entry, keyOf(entry));
				if (!routeVariants.indexByKey.has(key)) routeVariants.indexByKey.set(key, index);
			});
			mergeCatalogEntries(models, configuredOverrides, {
				catalogRoutes: routeVariants,
				preserveBaseCompat: true
			});
			mergeCatalogRouteVariants(routeVariants, configuredOverrides, { preserveBaseCompat: true });
		}
		logStage("configured-models-finalized", `entries=${models.length}`);
		const snapshot = createModelCatalogSnapshot(models, routeVariants, params.providerOutcomes);
		logStage("complete", `entries=${snapshot.entries.length}`);
		return params.providerOutcomes ? {
			...snapshot,
			authoritative: params.providerOutcomes.every((outcome) => outcome.status === "ready")
		} : snapshot;
	} catch (error) {
		if (!hasLoggedModelCatalogError) {
			hasLoggedModelCatalogError = true;
			log.warn(`Failed to load model catalog: ${String(error)}`);
		}
		throw error;
	}
}
/**
* Check if a model supports image input based on its catalog entry.
*/
function modelSupportsVision(entry) {
	return modelSupportsInput(entry, "image");
}
//#endregion
export { resetModelCatalogBuilderCacheForTest as a, overlayConfiguredModelCatalog as i, loadManifestModelCatalog as n, modelSupportsVision as r, buildPreparedModelCatalogSnapshot as t };
