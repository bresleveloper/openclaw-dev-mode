import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { s as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { a as resolveMergedModelProviderConfig, n as createModelProviderRouteOverrideResolver, t as createConfiguredProviderModelResolver } from "./model-provider-config-BbSyhfVf.mjs";
import { i as resolveProviderModelPolicySurface, r as resolveProviderModelCatalogId } from "./provider-model-routes-CNgNpH_2.mjs";
import { n as dedupeByKey, t as PREPARED_THINKING_POLICY } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-0uvJbX1M.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { d as resolveModelCatalogIdentityKey, l as openAIModelCatalogRoutePolicy, s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-BJQs6MZV.mjs";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-CDH5BTTD.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-Doz1rFpm.mjs";
//#region src/agents/model-catalog-browse.ts
/** Source-authored provider rows for inventory UIs, independent of picker allowlists. */
function buildProviderConfigModelCatalogForBrowse(params) {
	return buildConfiguredModelCatalog(params).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}
//#endregion
//#region src/agents/model-catalog-route.ts
/** Projects one physical donor into separate public and private runtime metadata. */
/** Prepares configured-row indexes for one stable catalog config and policy projection. */
function createConfiguredModelCatalogOverridesResolver(params) {
	const modelsByProvider = /* @__PURE__ */ new Map();
	return (entry) => {
		const providerId = entry.provider;
		let findModel = modelsByProvider.get(providerId);
		if (!findModel) {
			const provider = normalizeProviderId(providerId);
			const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
			if (!providerConfig?.models?.length) return;
			const surface = resolveProviderModelPolicySurface(provider);
			const normalizeConfiguredModelId = (modelId) => params.policy?.resolveIdentity({
				provider: providerId,
				id: modelId
			})?.id ?? resolveProviderModelCatalogId({
				provider,
				modelId,
				surface
			}) ?? modelId.trim();
			const resolveModel = createConfiguredProviderModelResolver(providerConfig, provider, normalizeConfiguredModelId);
			findModel = (modelId) => resolveModel(normalizeConfiguredModelId(modelId));
			modelsByProvider.set(providerId, findModel);
		}
		const model = findModel(entry.id);
		const overrides = {
			...model?.name ? { name: model.name } : {},
			...model?.contextWindow !== void 0 ? { contextWindow: model.contextWindow } : {},
			...model?.contextTokens !== void 0 ? { contextTokens: model.contextTokens } : {},
			...model?.reasoning !== void 0 ? { reasoning: model.reasoning } : {},
			...model?.reasoning !== void 0 ? { configuredReasoning: model.reasoning } : {},
			...model?.thinkingLevelMap ? { thinkingLevelMap: model.thinkingLevelMap } : {},
			...model?.input !== void 0 ? { input: model.input } : {}
		};
		return Object.keys(overrides).length > 0 ? overrides : void 0;
	};
}
function sameLogicalModel(a, identity, policy) {
	return policy.resolveIdentity(a)?.key === identity.key;
}
function logicalIdentity(entry, id, name, lifecycleEntry = entry) {
	return {
		id,
		name: name ?? id,
		provider: entry.provider,
		...entry.alias ? { alias: entry.alias } : {},
		...lifecycleEntry.providerOrder !== void 0 ? { providerOrder: lifecycleEntry.providerOrder } : {},
		...lifecycleEntry.status ? { status: lifecycleEntry.status } : {},
		...lifecycleEntry.statusReason ? { statusReason: lifecycleEntry.statusReason } : {},
		...lifecycleEntry.replaces ? { replaces: lifecycleEntry.replaces } : {},
		...lifecycleEntry.replacedBy ? { replacedBy: lifecycleEntry.replacedBy } : {}
	};
}
function applyLogicalOverrides(entry, overrides) {
	return overrides ? {
		...entry,
		...overrides
	} : entry;
}
/** Finds the exact physical row that supplied a selected provider route. */
function findModelCatalogRouteDonor(params) {
	const identity = params.policy.resolveIdentity(params.entry);
	const physicalDonor = identity ? params.catalog?.find((candidate) => sameLogicalModel(candidate, identity, params.policy) && params.policy.matchesRoute(candidate, params.route)) : void 0;
	if (physicalDonor) return physicalDonor;
	return params.policy.matchesRoute(params.entry, params.route) ? params.entry : void 0;
}
/**
* Builds public and private runtime rows from one selected physical donor.
*
* Selected-route capabilities come only from a physical row accepted by the
* provider-owned matcher. Unresolved managed routes expose identity only.
* Auth, runtime, request overrides, and other private transport facts never
* enter the public catalog shape.
*/
function projectModelCatalogEntryForRoute(params) {
	if (params.projection.kind === "unmanaged") {
		const provider = normalizeProviderId(params.entry.provider);
		const surface = resolveProviderModelPolicySurface(provider);
		const id = surface?.resolveModelRoutes ? null : resolveProviderModelCatalogId({
			provider,
			modelId: params.entry.id,
			surface
		});
		const entry = applyLogicalOverrides(id && id !== params.entry.id ? {
			...params.entry,
			id
		} : params.entry, params.overrides);
		return {
			entry,
			runtimeEntry: entry
		};
	}
	const id = params.projection.policy.resolveIdentity(params.entry)?.id ?? splitTrailingAuthProfile(params.entry.id).model;
	if (params.projection.kind === "unresolved") {
		const entry = applyLogicalOverrides(logicalIdentity(params.entry, id, params.entry.name), params.overrides);
		return {
			entry,
			runtimeEntry: entry
		};
	}
	const { policy, route } = params.projection;
	const donor = findModelCatalogRouteDonor({
		entry: params.entry,
		route,
		policy,
		catalog: params.catalog
	});
	const projected = logicalIdentity(params.entry, id, donor?.name ?? params.entry.name, donor ?? params.entry);
	const thinkingPolicy = donor?.[PREPARED_THINKING_POLICY];
	const entry = applyLogicalOverrides({
		...projected,
		api: route.api,
		baseUrl: route.baseUrl,
		...donor?.contextWindow !== void 0 ? { contextWindow: donor.contextWindow } : {},
		...donor?.contextTokens !== void 0 ? { contextTokens: donor.contextTokens } : {},
		...donor?.contextWindows !== void 0 ? { contextWindows: donor.contextWindows } : {},
		...donor?.contextWindowDefault !== void 0 ? { contextWindowDefault: donor.contextWindowDefault } : {},
		...donor?.reasoning !== void 0 ? { reasoning: donor.reasoning } : {},
		...donor?.thinkingLevelMap ? { thinkingLevelMap: donor.thinkingLevelMap } : {},
		...donor?.thinkingPolicyProvider ? { thinkingPolicyProvider: donor.thinkingPolicyProvider } : {},
		...thinkingPolicy !== void 0 ? { [PREPARED_THINKING_POLICY]: thinkingPolicy } : {},
		...donor?.input !== void 0 ? { input: donor.input } : {}
	}, params.overrides);
	return {
		entry,
		runtimeEntry: donor ? {
			...entry,
			...Object.hasOwn(donor, "compat") ? { compat: donor.compat } : {},
			...Object.hasOwn(donor, "params") ? { params: donor.params } : {}
		} : entry
	};
}
/** Returns true for loopback, wildcard, and mDNS local base URLs. */
const isLocalBaseUrl = (baseUrl) => {
	try {
		const url = new URL(baseUrl);
		const host = normalizeLowercaseStringOrEmpty(url.hostname).replace(/^\[|\]$/g, "");
		return host === "localhost" || isCanonicalDottedDecimalIPv4(host) && isLoopbackIpAddress(host) || host === "0.0.0.0" || host === "::" || host === "::1" || host.endsWith(".local");
	} catch {
		return false;
	}
};
//#endregion
//#region src/agents/model-catalog-view.ts
/** Keeps public and private runtime projections on the same captured catalog. */
/** Keep capability donors bound to one model and runtime without merging sibling metadata. */
function selectModelCatalogRuntimeEntry(params) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const key = keyOf(params.entry);
	const observed = params.routeVariants.filter((variant) => keyOf(variant) === key);
	const variants = (observed.length ? observed : [params.entry]).filter((variant) => !variant.nativeRuntime || variant.nativeRuntime === params.runtimeId).toSorted((a, b) => Number(b.nativeRuntime === params.runtimeId) - Number(a.nativeRuntime === params.runtimeId));
	return {
		variants,
		entry: variants[0] ?? {
			id: params.entry.id,
			name: params.entry.name,
			provider: params.entry.provider
		}
	};
}
/** Indexes physical variants for paired logical catalog projection. */
function createModelCatalogView(params) {
	const keyOf = params.keyOf ?? createModelCatalogIdentityKeyResolver();
	const variantsByKey = /* @__PURE__ */ new Map();
	for (const entry of params.routeVariants ?? params.catalog) {
		const key = keyOf(entry);
		const variants = variantsByKey.get(key) ?? [];
		variants.push(entry);
		variantsByKey.set(key, variants);
	}
	const variantsOf = (entry, key = resolveModelCatalogIdentityKey(entry)) => variantsByKey.get(key);
	const routePolicy = params.routePolicy ?? openAIModelCatalogRoutePolicy;
	const resolveOverrides = createConfiguredModelCatalogOverridesResolver({
		cfg: params.cfg,
		policy: routePolicy
	});
	const projectRoute = (entry, projection, overrides, variants) => projectModelCatalogEntryForRoute({
		entry,
		projection,
		catalog: variants,
		overrides
	});
	const projections = /* @__PURE__ */ new WeakMap();
	return {
		logicalEntries: dedupeByKey(params.catalog, keyOf),
		variantsOf,
		readProjection(entry, projection, identityKey) {
			let cached = projections.get(entry);
			if (!cached) {
				cached = {
					overrides: resolveOverrides(entry),
					rows: /* @__PURE__ */ new Map()
				};
				projections.set(entry, cached);
			}
			const key = projection.kind === "selected" ? projection.route : projection.kind;
			let row = cached.rows.get(key);
			if (!row) {
				row = projectRoute(entry, projection, cached.overrides, variantsOf(entry, identityKey));
				cached.rows.set(key, row);
			}
			return row;
		},
		implicitNativeRuntime(entry) {
			const variants = variantsOf(entry);
			const runtime = variants?.[0]?.nativeRuntime;
			return runtime && variants?.every((variant) => variant.nativeRuntime === runtime) ? runtime : void 0;
		},
		project(entry, evaluation, routeVariants) {
			const projection = evaluation.routeResolution === null ? { kind: "unmanaged" } : evaluation.selectedRoute ? {
				kind: "selected",
				route: evaluation.selectedRoute,
				policy: routePolicy
			} : {
				kind: "unresolved",
				policy: routePolicy
			};
			return projectRoute(entry, projection, resolveOverrides(entry), routeVariants ?? variantsOf(entry));
		}
	};
}
/** Projects captured catalog facts while keeping native observations revocable. */
function prepareModelCatalogView(params) {
	const defaultModel = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, params.agentId);
	const catalog = [...params.snapshot.entries];
	if ((params.view === "configured" || params.view === "default") && params.snapshot.staticEntries?.length) {
		const policy = createModelVisibilityPolicy({
			cfg: params.cfg,
			catalog,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel,
			agentId: params.agentId,
			...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
			manifestPlugins: params.metadataSnapshot
		});
		const keyOf = createModelCatalogIdentityKeyResolver();
		const seen = new Set(catalog.map(keyOf));
		const retainedKey = params.retainedModel ? keyOf({
			provider: params.retainedModel.provider,
			id: params.retainedModel.model
		}) : void 0;
		for (const entry of params.snapshot.staticEntries) {
			const key = keyOf(entry);
			const include = params.view === "configured" ? policy.configuredKeys.has(key) || key === retainedKey : policy.allows({
				provider: entry.provider,
				model: entry.id
			});
			if (!seen.has(key) && include) {
				seen.add(key);
				catalog.push(entry);
			}
		}
	}
	const isCurrent = () => params.isCurrent?.() ?? params.observationConfig === void 0;
	const routes = createModelCatalogView({
		cfg: params.cfg,
		catalog,
		routeVariants: params.snapshot.routeVariants
	});
	const providerEndpoints = /* @__PURE__ */ new Map();
	for (const [id, configured] of Object.entries(params.cfg.models?.providers ?? {})) {
		const provider = normalizeProviderId(id);
		if (!providerEndpoints.has(provider)) providerEndpoints.set(provider, {
			endpoint: normalizeOptionalString(configured.baseUrl),
			api: normalizeOptionalString(configured.api)
		});
	}
	return {
		providerEndpoints,
		snapshot: params.snapshot,
		catalog,
		defaultModel,
		isCurrent,
		evaluateNative: (entry, host, runtimeId) => {
			const policy = resolveAgentHarnessPolicy({
				provider: entry.provider,
				modelId: entry.id,
				modelApi: entry.api,
				modelBaseUrl: entry.baseUrl,
				config: params.cfg,
				agentId: params.agentId
			});
			const runtime = runtimeId ?? host.requestedRuntimeId ?? (!policy.forcedByEnvironment && policy.runtimeSource === "implicit" ? routes.implicitNativeRuntime(entry) ?? policy.runtime : policy.runtime);
			if (runtime === "auto" || runtime === "openclaw") return host;
			const observedNative = entry.nativeRuntime === runtime || routes.variantsOf(entry)?.some((variant) => variant.nativeRuntime === runtime) === true;
			const provider = normalizeProviderId(entry.provider);
			const sameProvider = !params.profileProvider || normalizeProviderId(params.profileProvider) === provider;
			const configured = resolveMergedModelProviderConfig(params.cfg, provider);
			const modelKey = (id) => stripSelfProviderModelPrefix(provider, splitTrailingAuthProfile(id).model.trim()).trim();
			if (sameProvider && params.preferredProfileId || sameProvider && params.pinnedProfileId || host.selectedAuthMode && (host.evidence !== "runtime" || !observedNative) || configured?.api || configured?.baseUrl || configured?.apiKey || configured?.auth || configured?.models?.some((model) => modelKey(model.id) === modelKey(entry.id) && (model.api || model.baseUrl)) || Object.keys(params.cfg.auth?.order ?? {}).some((id) => normalizeProviderId(id) === provider) || Object.values(params.cfg.auth?.profiles ?? {}).some((profile) => normalizeProviderId(profile.provider) === provider) || createModelProviderRouteOverrideResolver({
				authoredConfig: params.cfg,
				provider
			})(entry.id) === "present" || hasAuthoredProviderRequestParams({
				config: params.cfg,
				provider,
				modelId: entry.id,
				agentId: params.agentId
			})) return host;
			const resolveRegistry = () => params.observationConfig ? params.pluginRegistry : params.pluginRegistry ?? getActivePluginRegistry();
			const registry = resolveRegistry();
			const harness = registry?.agentHarnesses.find((registration) => registration.harness.id === runtime)?.harness;
			if (!harness?.readModelCatalogReadiness && !observedNative && !(harness?.authBootstrap === "harness" && harness.loadModelCatalog)) return host;
			let ready;
			let authMode;
			try {
				ready = isCurrent() && harness?.authBootstrap === "harness" && harness.supports({
					provider,
					modelId: entry.id,
					requestedRuntime: runtime,
					modelProvider: {
						preparedAuth: { source: "harness" },
						endpointOverrides: "none",
						requestTransportOverrides: "none"
					}
				}).supported && isCurrent() && resolveRegistry() === registry;
				const observation = ready ? harness?.readModelCatalogReadiness?.({
					config: params.observationConfig ?? params.cfg,
					agentId: params.agentId,
					agentDir,
					workspaceDir: params.workspaceDir,
					provider,
					modelId: entry.id
				}) : void 0;
				ready = ready && (!harness?.readModelCatalogReadiness || observation !== void 0) && isCurrent() && resolveRegistry() === registry;
				authMode = ready ? observation?.authMode : void 0;
			} catch {
				ready = false;
				authMode = void 0;
			}
			return {
				availability: ready && !harness?.readModelCatalogReadiness && !observedNative ? void 0 : ready,
				availabilityAuthoritative: true,
				routeResolution: null,
				...host.requestedRuntimeId ? { requestedRuntimeId: host.requestedRuntimeId } : {},
				runtimeAuth: {
					id: runtime,
					source: "native"
				},
				...authMode ? { selectedAuthMode: authMode } : {}
			};
		},
		providerInventory(sourceConfig, canonicalEntries) {
			const keyOf = createModelCatalogIdentityKeyResolver();
			const dynamicProviders = new Set(params.metadataSnapshot.plugins.flatMap((plugin) => Object.entries(plugin.modelCatalog?.discovery ?? {}).flatMap(([provider, mode]) => mode === "runtime" || mode === "refreshable" ? [normalizeProviderId(provider)] : [])));
			const discoveryOnlyProviders = new Set(Object.entries(sourceConfig.models?.providers ?? {}).flatMap(([provider, config]) => {
				const id = normalizeProviderId(provider);
				return dynamicProviders.has(id) && !Array.isArray(config?.models) ? [id] : [];
			}));
			const canonicalByKey = /* @__PURE__ */ new Map();
			for (const entry of canonicalEntries) {
				const key = keyOf(entry);
				if (!canonicalByKey.has(key)) canonicalByKey.set(key, entry);
			}
			const authored = buildProviderConfigModelCatalogForBrowse({
				cfg: sourceConfig,
				workspaceDir: params.workspaceDir
			}).map((entry) => canonicalByKey.get(keyOf(entry)) ?? entry);
			return dedupeByKey([...authored, ...canonicalEntries.filter((entry) => discoveryOnlyProviders.has(normalizeProviderId(entry.provider)))], keyOf);
		}
	};
}
/** Acquires requested catalog facts before constructing a local view. */
async function loadPreparedModelCatalogView(params) {
	if (params.kind === "status") {
		const { getPublishedPreparedModelCatalogOwnerSnapshot, loadPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CHKgcpJj.mjs");
		const { getPreparedModelRuntimeAuthLabels, getPreparedModelRuntimeAuthStore } = await import("./prepared-model-runtime-auth-KanpF77O.mjs");
		const { formatModelCatalogAuthLabel } = await import("./model-catalog-auth-labels-lcPG2KRn.mjs");
		const { resolveSessionRuntimeOverrideForProvider } = await import("./session-runtime-compat-CatwgFV2.mjs");
		const { buildAgentRuntimeAuthPlan } = await import("./auth-BYuEjCio.mjs");
		const owner = materializePreparedModelCatalogOwner(getPublishedPreparedModelCatalogOwnerSnapshot(params) ?? await loadPreparedModelCatalogOwnerSnapshot({
			...params,
			readOnly: true
		}));
		const capturedLabels = getPreparedModelRuntimeAuthLabels(owner);
		const store = getPreparedModelRuntimeAuthStore(owner);
		if (!store) throw new Error("Prepared model runtime omitted auth display facts");
		const authContext = {
			cfg: owner.config,
			store,
			metadataSnapshot: owner.metadataSnapshot
		};
		const providerAuthLabels = /* @__PURE__ */ new Map();
		for (const entry of params.entries) {
			const provider = normalizeProviderId(entry.provider);
			if (providerAuthLabels.has(provider)) continue;
			const runtime = resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: params.sessionEntry,
				cfg: owner.config
			}) ?? resolveAgentHarnessPolicy({
				provider,
				modelId: entry.id,
				config: owner.config,
				agentId: params.agentId
			}).runtime;
			const labels = capturedLabels.get(provider);
			let label = formatModelCatalogAuthLabel((provider === "openai" && runtime !== "codex" ? labels?.apiKey : labels?.all) ?? "missing", authContext);
			if (label === "missing") {
				const authProvider = buildAgentRuntimeAuthPlan({
					provider,
					config: owner.config,
					workspaceDir: owner.workspaceDir,
					metadataSnapshot: owner.metadataSnapshot,
					harnessRuntime: runtime
				}).harnessAuthProvider;
				const runtimeLabel = formatModelCatalogAuthLabel((authProvider && authProvider !== provider ? capturedLabels.get(authProvider)?.all : void 0) ?? "missing", authContext);
				if (runtimeLabel !== "missing") label = `via ${runtime} runtime / ${authProvider} ${runtimeLabel}`;
			}
			providerAuthLabels.set(provider, label);
		}
		return {
			...prepareModelCatalogView({
				cfg: owner.config,
				agentId: params.agentId,
				agentDir: owner.agentDir,
				workspaceDir: owner.workspaceDir ?? params.workspaceDir ?? resolveAgentWorkspaceDir(owner.config, params.agentId),
				snapshot: owner.modelCatalog,
				metadataSnapshot: owner.metadataSnapshot,
				isCurrent: owner.isCurrent
			}),
			providerAuthLabels
		};
	}
	const view = await acquirePickerModelCatalogView(params);
	const includeConfiguredProvider = params.includeConfiguredProvider;
	if (!includeConfiguredProvider) return view;
	const { buildConfiguredModelCatalog } = await import("./model-selection-shared-u8Cbd95_.mjs");
	let catalog = view.snapshot.entries;
	let configured = buildConfiguredModelCatalog({ cfg: params.config }).filter((entry) => includeConfiguredProvider(entry.provider));
	if (params.preferredProvider && params.providerScoped && catalog.length > 0) {
		const { loadStaticManifestCatalogRowsForList } = await import("./list.manifest-catalog-TMNg-N-W.mjs");
		const staticRows = loadStaticManifestCatalogRowsForList({
			cfg: params.config,
			providerFilter: params.preferredProvider,
			...params.env !== void 0 ? { env: params.env } : {}
		});
		const keyOf = (entry) => modelKey(entry.provider, entry.id);
		const staticKeys = new Set(staticRows.map(keyOf));
		const deprecatedKeys = new Set(staticRows.filter((entry) => entry.status === "deprecated").map(keyOf));
		catalog = catalog.filter((entry) => !deprecatedKeys.has(keyOf(entry)));
		configured = configured.filter((entry) => !staticKeys.has(keyOf(entry)));
	}
	const entries = [...catalog];
	const seen = new Set(catalog.map((entry) => modelKey(entry.provider, entry.id)));
	for (const entry of configured) {
		const key = modelKey(entry.provider, entry.id);
		if (!seen.has(key)) {
			seen.add(key);
			entries.push(entry);
		}
	}
	return { snapshot: {
		...view.snapshot,
		get refreshFailed() {
			return view.snapshot.refreshFailed;
		},
		entries
	} };
}
async function acquirePickerModelCatalogView(params) {
	const cfg = params.config;
	const fromEntries = (entries) => ({ snapshot: {
		entries,
		routeVariants: entries
	} });
	if (cfg.models?.mode === "replace") {
		const { buildConfiguredModelCatalog } = await import("./model-selection-shared-u8Cbd95_.mjs");
		return fromEntries(buildConfiguredModelCatalog({ cfg }));
	}
	const { loadPreparedModelCatalogSnapshot } = await import("./prepared-model-catalog-CHKgcpJj.mjs");
	if (params.preferredProvider) {
		if (params.preferLiveProviderCatalog) {
			const { resolveDefaultAgentDir } = await import("./agent-scope-C4CYkKyC.mjs");
			const { resolvePluginMetadataSnapshot } = await import("./plugin-metadata-snapshot-AIcOW-fO.mjs");
			const { createPreparedModelCatalogProviderNormalizer } = await import("./model-catalog-provider-normalizer-C7PRCcV2.mjs");
			const requestedProvider = normalizeProviderId(params.preferredProvider);
			if (requestedProvider) {
				const env = params.env ?? process.env;
				const provider = createPreparedModelCatalogProviderNormalizer(resolvePluginMetadataSnapshot({
					config: cfg,
					env,
					...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
				}), cfg, env)(requestedProvider);
				const acquired = await loadPreparedModelCatalogSnapshot({
					config: cfg,
					agentDir: params.agentDir ?? resolveDefaultAgentDir(cfg, params.env),
					...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
					...params.env ? { env: params.env } : {},
					readOnly: true,
					providerDiscoveryProviderIds: [provider],
					scopedLiveProviderDiscovery: true
				});
				const matchesProvider = (entry) => normalizeProviderId(entry.provider) === provider;
				const entries = acquired.entries.filter(matchesProvider);
				if (entries.length > 0) return { snapshot: {
					...acquired,
					get refreshFailed() {
						return acquired.refreshFailed;
					},
					entries,
					routeVariants: acquired.routeVariants.filter(matchesProvider),
					...acquired.staticEntries ? { staticEntries: acquired.staticEntries.filter(matchesProvider) } : {},
					...acquired.providerOutcomes ? { providerOutcomes: acquired.providerOutcomes.filter(matchesProvider) } : {}
				} };
			}
		}
		if (!params.preferLiveProviderCatalog || params.allowStaticFallbackCatalog !== false) {
			const { loadStaticManifestCatalogRowsForList } = await import("./list.manifest-catalog-TMNg-N-W.mjs");
			const rows = loadStaticManifestCatalogRowsForList({
				cfg,
				providerFilter: params.preferredProvider,
				...params.env !== void 0 ? { env: params.env } : {}
			});
			if (rows.length > 0) return fromEntries(rows.map((row) => ({
				id: row.id,
				name: row.name,
				provider: row.provider,
				api: row.api,
				baseUrl: row.baseUrl,
				contextWindow: row.contextWindow,
				reasoning: row.reasoning,
				input: row.input
			})));
		}
		if (params.providerScoped) return fromEntries([]);
	}
	return { snapshot: await loadPreparedModelCatalogSnapshot({ config: cfg }) };
}
//#endregion
export { isLocalBaseUrl as a, selectModelCatalogRuntimeEntry as i, loadPreparedModelCatalogView as n, prepareModelCatalogView as r, createModelCatalogView as t };
