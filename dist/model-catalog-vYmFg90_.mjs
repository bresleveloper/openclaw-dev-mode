import { t as createConfiguredProviderCatalogModelIdNormalizer } from "./model-ref-shared-BRJ3VRZV.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { r as buildConfiguredModelCatalog, x as overlayCatalogMetadata } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { r as modelSupportsInput } from "./model-catalog-lookup-BJKolYfz.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-xL-mNZoa.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-Ag5B94I6.mjs";
import { u as resolveClaudeFable5ModelIdentity } from "./anthropic-B3HirzdP.mjs";
import "./src-D3H6pm7W.mjs";
import { t as augmentModelCatalogWithProviderPlugins } from "./provider-runtime.runtime.js";
import { r as modelCatalogRowToEntry } from "./model-catalog-entry-BWd5zbsm.mjs";
import { t as buildEffectiveManifestProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import { n as compareModelCatalogEntries, t as assignProviderModelOrder } from "./model-catalog-order-DpA_fmrU.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
//#region src/agents/model-catalog-manifest.ts
function resolveEligibleManifestCatalogPlugins(snapshot, config) {
	let normalizedConfig;
	return snapshot.plugins.filter((plugin) => plugin.modelCatalog && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config,
		normalizedConfig: config.plugins && (normalizedConfig ??= normalizePluginsConfig(config.plugins))
	}));
}
/**
* Known manifest inventory for the caller's admitted providers. Captured publications show it
* until live discovery replaces that provider's rows.
*/
function loadManifestModelProviderConfigs(params) {
	if (params.config.models?.mode === "replace" || params.providerIds.length === 0) return {};
	const { rows } = planEffectiveModelCatalogRows({
		registry: { plugins: resolveEligibleManifestCatalogPlugins(params.metadataSnapshot, params.config) },
		config: params.config,
		providerFilters: params.providerIds
	});
	const rowsByProvider = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const providerRows = rowsByProvider.get(row.provider) ?? [];
		providerRows.push(row);
		rowsByProvider.set(row.provider, providerRows);
	}
	const providers = {};
	for (const [provider, providerRows] of rowsByProvider) {
		const providerConfig = buildEffectiveManifestProviderConfig(providerRows);
		if (providerConfig) providers[provider] = providerConfig;
	}
	return providers;
}
//#endregion
//#region src/agents/model-catalog.ts
/**
* Loads bundled, manifest, and discovered model catalog entries.
*/
const log = createSubsystemLogger("model-catalog");
let hasLoggedModelCatalogError = false;
let manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
const loadModelSuppression = createLazyPromise(() => import("./model-suppression-9YlfHq8V.mjs"));
const loadProviderApiKeyResolver = createLazyPromise(() => import("./models-config.providers.secrets-D1ZB8NqT.mjs"));
function resetModelCatalogBuilderCacheForTest() {
	manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
	hasLoggedModelCatalogError = false;
}
if (process.env.VITEST || false) Reflect.set(globalThis, Symbol.for("openclaw.modelCatalogTestApi"), { resetModelCatalogBuilderCacheForTest });
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
	const identityKeyOf = createModelCatalogIdentityKeyResolver();
	const keyOf = options?.routeVariantIndex ? (entry) => catalogRouteVariantKey(entry, identityKeyOf(entry)) : identityKeyOf;
	const indexByKey = options?.routeVariantIndex ?? new Map(models.map((entry, index) => [keyOf(entry), index]));
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
		const entries = params.models;
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
		mergeCatalogEntries(routeVariants.entries, orderedRegistryModels, { routeVariantIndex: routeVariants.indexByKey });
		const dynamicManifestKeys = new Set(manifestPlan.entries.flatMap((entry) => entry.discovery === "runtime" || entry.discovery === "refreshable" ? entry.rows.map((row) => buildModelCatalogMergeKey(row.provider, row.id)) : []));
		const runtimeDiscoveryProviders = /* @__PURE__ */ new Set([...observedProviders, ...manifestPlan.entries.flatMap((entry) => entry.discovery === "runtime" || entry.discovery === "refreshable" ? [normalizeProviderId(entry.provider)] : [])]);
		const manifestKeyOf = createModelCatalogIdentityKeyResolver();
		const discoveredKeys = new Set(models.map(manifestKeyOf));
		const manifestModels = declaredManifestModels.filter((entry) => (params.includeProviderPluginAugmentation === false || !dynamicManifestKeys.has(buildModelCatalogMergeKey(entry.provider, entry.id))) && (!observedProviders.has(entry.provider) || discoveredKeys.has(manifestKeyOf(entry))));
		mergeCatalogEntries(routeVariants.entries, manifestModels, { routeVariantIndex: routeVariants.indexByKey });
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
				mergeCatalogEntries(routeVariants.entries, orderedSupplemental, { routeVariantIndex: routeVariants.indexByKey });
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
			mergeCatalogEntries(routeVariants.entries, configuredOverrides, {
				routeVariantIndex: routeVariants.indexByKey,
				preserveBaseCompat: true
			});
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
export { loadManifestModelProviderConfigs as a, overlayConfiguredModelCatalog as i, loadManifestModelCatalog as n, modelSupportsVision as r, buildPreparedModelCatalogSnapshot as t };
