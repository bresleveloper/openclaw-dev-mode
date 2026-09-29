import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { r as resolveProviderModelCatalogId } from "./provider-model-routes-CNgNpH_2.mjs";
import { i as listAvailableManifestContractPlugins } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { o as dedupeModelCatalogEntries } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as resolveModelCatalogIdentityKey, l as openAIModelCatalogRoutePolicy, s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { r as resolveModelExtraParamSources } from "./model-extra-params-BJQs6MZV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-DUtJJsHV.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-CGngP_UC.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-BNwmHYLR.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-BIljybvR.mjs";
import { t as createThinkingCatalogResolver } from "./thinking-B1p5pEC8.mjs";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-Bm-hrIsj.mjs";
import { n as listCliRuntimeModelBackendBindings } from "./cli-backends-SxX34tmf.mjs";
import { t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-DmCrQjUt.mjs";
import "./workspace-mlzi3k1x.mjs";
import { i as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-4oGnFFN5.mjs";
import { n as PreparedModelRuntimePublicationSupersededError, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { v as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { t as resolveAutomaticUtilityModelRef } from "./utility-model-DZ4XRwmc.mjs";
import { a as isLocalBaseUrl, i as selectModelCatalogRuntimeEntry, r as prepareModelCatalogView, t as createModelCatalogView } from "./model-catalog-view-Be2xmOuQ.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-Doz1rFpm.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-SEjvmv7N.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-Bv9Ac0tS.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { n as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-CsGXi9Al.mjs";
import { n as resolveLogicalModelCatalogEntryState, t as prepareLogicalVisibleModelCatalog } from "./model-catalog-visibility-ruAALrZv.mjs";
import { a as resolveSessionCatalogProfiles, s as resolveChatAccountSelection } from "./chat-metadata-session-projection-CWI8MG-_.mjs";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-O7xy79Lo.mjs";
//#region src/agents/model-fast-mode.ts
/** Capture light policy with the private catalog owner; published row reads cannot load plugins. */
function createModelFastModeResolver(params) {
	const policies = withPluginCache(getPluginMetadataSnapshotCache(params.metadataSnapshot), () => new Map([...new Set(params.catalog.map((entry) => normalizeProviderId(entry.provider)))].map((provider) => [provider, params.pluginRegistry?.providers.find(({ provider: candidate }) => matchesProviderPluginRef(candidate, provider))?.provider.resolveFastModeSupport ?? resolveProviderPolicySurface(provider, { manifestRegistry: params.metadataSnapshot.manifestRegistry })?.resolveFastModeSupport])));
	return (entry, evaluation, runtimeId) => {
		const policy = policies.get(normalizeProviderId(entry.provider));
		if (!policy || evaluation.routeResolution !== null && !evaluation.selectedRoute) return;
		const route = evaluation.selectedRoute ?? entry;
		const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
			config: params.cfg,
			provider: entry.provider,
			modelId: entry.id,
			agentId: params.agentId
		});
		return policy({
			provider: entry.provider,
			modelId: entry.id,
			api: route.api,
			baseUrl: route.baseUrl,
			authMode: evaluation.selectedAuthMode,
			runtimeId: runtimeId ?? entry.nativeRuntime,
			modelParams: entry.params,
			params: Object.assign({}, defaultParams, modelParams, agentModelParams, agentParams),
			requestCapabilities: resolveProviderRequestCapabilities({
				provider: entry.provider,
				modelId: entry.id,
				api: route.api,
				baseUrl: route.baseUrl,
				providerMetadataOwners: params.metadataSnapshot.owners
			})
		});
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-capabilities.ts
function apiKeyProviderCapabilities(params) {
	const { capabilities, resolveProvider } = resolveModelProviderCapabilities({
		config: params.cfg,
		metadataSnapshot: params.metadataSnapshot,
		workspaceDir: params.workspaceDir
	});
	return {
		providers: new Map(capabilities.map(({ provider, apiKeySupported }) => [provider, apiKeySupported])),
		resolveProvider
	};
}
function listDecisionModels({ config, snapshot }) {
	const decisionModels = [];
	if (config.plugins?.enabled !== false) {
		const seen = /* @__PURE__ */ new Set();
		for (const plugin of listAvailableManifestContractPlugins({
			snapshot,
			config,
			contract: "decisionProviders"
		})) for (const model of plugin.decisionModels ?? []) {
			const key = `${model.provider}/${model.id}`;
			if (!seen.has(key)) {
				decisionModels.push({
					...model,
					pluginId: plugin.id
				});
				seen.add(key);
			}
		}
	}
	return decisionModels;
}
function createModelsListProviderFilter(params) {
	const { config, metadataSnapshot, catalog } = params;
	const normalizeProvider = createPreparedModelCatalogProviderNormalizer(metadataSnapshot, config);
	const providerFilter = params.provider ? normalizeProvider(params.provider) : void 0;
	if (providerFilter) {
		const decisionProviderIds = (metadataSnapshot.owners.contracts.get("decisionProviders") ?? []).flatMap((pluginId) => metadataSnapshot.byPluginId.get(pluginId)?.contracts?.decisionProviders ?? []);
		if (!new Set([
			...metadataSnapshot.owners.providers.keys(),
			...metadataSnapshot.owners.modelCatalogProviders.keys(),
			...decisionProviderIds,
			...Object.keys(config.models?.providers ?? {}),
			...catalog.map((entry) => entry.provider)
		].map(normalizeProvider)).has(providerFilter)) throw new Error("Unknown model catalog provider. Use a provider id from the installed plugins or configured providers.");
	}
	return {
		normalizeProvider,
		providerFilter,
		matchesProvider: (entry) => !providerFilter || normalizeProvider(entry.provider) === providerFilter
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-public-projection.ts
/** Keeps concrete route, auth, cost, and provider parameters out of public model rows. */
function buildPublicModelProjection(entry, options = {}) {
	const contextWindow = asPositiveSafeInteger(entry.contextWindow);
	const contextTokens = options.includeDetails ? asPositiveSafeInteger(entry.contextTokens) : void 0;
	return {
		id: entry.id,
		name: entry.name,
		provider: entry.provider,
		...entry.alias ? { alias: entry.alias } : {},
		...contextWindow ? { contextWindow } : {},
		...contextTokens ? { contextTokens } : {},
		...options.includeDetails && entry.baseUrl ? { local: isLocalBaseUrl(entry.baseUrl) } : {},
		...options.includeDetails && entry.input?.length ? { input: entry.input } : {},
		...entry.contextWindows ? { contextWindows: entry.contextWindows } : {},
		...entry.contextWindowDefault ? { contextWindowDefault: entry.contextWindowDefault } : {},
		...typeof entry.reasoning === "boolean" ? { reasoning: entry.reasoning } : {},
		...typeof entry.compat?.supportsTools === "boolean" ? { supportsTools: entry.compat.supportsTools } : {}
	};
}
function projectProviderCatalogOutcomes(outcomes) {
	return outcomes?.map(({ provider, profileId, status }) => ({
		provider,
		...profileId ? { profileId } : {},
		status
	}));
}
//#endregion
//#region src/gateway/server-methods/models-list-runtime-choices.ts
/** Captures alternative runtime metadata while readiness stays with the prepared catalog owner. */
async function prepareModelPickerRuntimeChoices(params) {
	const { cfg, agentId, entry, variants, requestedRuntimes, baseEvaluation, decisions, evaluateNative, projectPublic } = params;
	const selected = resolveCatalogDecisionRuntime({
		cfg,
		agentId,
		entry,
		evaluation: baseEvaluation,
		pluginRegistry: decisions.pluginRegistry
	});
	const availableRuntimes = await decisions.runtimeChoices(entry, variants);
	const alternatives = await Promise.all(requestedRuntimes.filter((runtimeId) => runtimeId !== (selected?.id ?? "openclaw")).map(async (runtimeId) => {
		const selectable = resolveCompatibleAgentRuntimeForProvider({
			provider: entry.provider,
			runtime: runtimeId,
			cfg
		}) === runtimeId;
		const { entry: runtimeEntry, variants: runtimeVariants } = selectModelCatalogRuntimeEntry({
			entry,
			routeVariants: variants,
			runtimeId
		});
		const runtimeView = createModelCatalogView({
			cfg,
			catalog: [runtimeEntry],
			routeVariants: runtimeVariants
		});
		const runtimeHost = await decisions.evaluateEntry(runtimeEntry, variants, runtimeId);
		const runtimeRegistered = runtimeId === "openclaw" || decisions.pluginRegistry?.agentHarnesses.some(({ harness }) => harness.id === runtimeId) || listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === runtimeId && normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider));
		return () => {
			const evaluation = evaluateNative(runtimeEntry, runtimeHost, runtimeId);
			const projected = runtimeView.readProjection(runtimeEntry, resolveLogicalModelCatalogEntryState({
				evaluation,
				routePolicy: openAIModelCatalogRoutePolicy
			}).routeProjection).runtimeEntry;
			const { id: _id, name: _name, provider: _provider, alias: _alias, tags: _tags, apiKeySupported: _apiKeySupported, runtimeChoices: _runtimeChoices, agentRuntime, ...capabilities } = projectPublic(projected, evaluation, runtimeId);
			const runtime = {
				id: runtimeId,
				source: "model",
				...agentRuntime
			};
			if (!selectable || availableRuntimes?.includes(runtimeId) !== true) {
				const compatibleRuntimes = evaluation.selectedRoute?.runtimePolicy?.compatibleIds;
				const unavailableReason = !selectable || decisions.pluginRegistry !== void 0 && !runtimeRegistered || compatibleRuntimes !== void 0 && !compatibleRuntimes.includes(runtimeId) ? "unsupported-runtime" : evaluation.unavailableReason;
				return {
					agentRuntime: runtime,
					available: false,
					...unavailableReason ? { unavailableReason } : {},
					...evaluation.unavailableUntil === void 0 ? {} : { unavailableUntil: evaluation.unavailableUntil }
				};
			}
			return {
				...capabilities,
				agentRuntime: runtime,
				available: evaluation.availability === true
			};
		};
	}));
	return () => alternatives.map((read) => read());
}
//#endregion
//#region src/gateway/server-methods/models-list-result.ts
function resolveModelsListView(params) {
	const view = params.view;
	return view === "configured" || view === "provider-config" || view === "all" ? view : "default";
}
/** Builds one per-agent, snapshot-scoped route projection for Gateway thinking metadata. */
function createGatewayAgentModelCatalogProjector(params) {
	const authProjection = createModelCatalogDecisions(params);
	const { evaluateEntry, evaluateNative, snapshot } = authProjection;
	let projectedCatalog;
	return {
		...authProjection,
		projectCatalog: () => {
			if (projectedCatalog) return projectedCatalog;
			const view = createModelCatalogView({
				cfg: params.cfg,
				catalog: snapshot.entries,
				routeVariants: snapshot.routeVariants.length > 0 ? snapshot.routeVariants : snapshot.entries
			});
			return projectedCatalog = Promise.all(view.logicalEntries.map(async (entry) => {
				const routeVariants = view.variantsOf(entry) ?? [entry];
				const evaluation = evaluateNative(entry, await evaluateEntry(entry, routeVariants));
				const runtimeId = resolveCatalogDecisionRuntime({
					cfg: params.cfg,
					agentId: params.agentId,
					entry,
					evaluation,
					pluginRegistry: params.pluginRegistry
				})?.id ?? "openclaw";
				const selected = selectModelCatalogRuntimeEntry({
					entry,
					routeVariants,
					runtimeId
				});
				return view.project(selected.entry, evaluation, selected.variants).runtimeEntry;
			}));
		}
	};
}
function createPublicModelsListProjector(params) {
	const catalogResolver = createThinkingCatalogResolver(params.thinkingCatalog);
	const prepared = /* @__PURE__ */ new WeakMap();
	return (entry, evaluation, runtimeChoice) => {
		const runtimeKey = runtimeChoice ?? "";
		let preparedEntry = prepared.get(entry)?.get(runtimeKey);
		if (!preparedEntry) {
			const configuredEntry = params.configuredEntriesByKey.get(modelKey(entry.provider, entry.id));
			const alias = configuredEntry?.aliases.at(-1);
			const publicEntry = configuredEntry?.aliasDisabled ? Object.assign({}, entry, { alias: void 0 }) : alias && alias !== entry.alias ? Object.assign({}, entry, { alias }) : entry;
			const capabilityProvider = params.apiKeyCapabilities?.resolveProvider(entry.provider);
			const selectedRuntime = runtimeChoice ? {
				id: runtimeChoice,
				source: "model"
			} : resolveCatalogDecisionRuntime({
				cfg: params.cfg,
				agentId: params.agentId,
				entry,
				evaluation,
				pluginRegistry: params.pluginRegistry
			});
			const agentRuntime = selectedRuntime ? params.pluginRegistry ? withPluginRuntimeRegistryScope(params.pluginRegistry, () => projectWorkerPlacementAgentRuntime(selectedRuntime)) : projectWorkerPlacementAgentRuntime(selectedRuntime) : void 0;
			const thinkingProfile = typeof publicEntry.reasoning !== "boolean" ? void 0 : resolveGatewayModelThinkingProfile({
				cfg: params.cfg,
				agentId: params.agentId,
				provider: entry.provider,
				model: entry.id,
				agentRuntime: selectedRuntime?.id ?? "openclaw",
				modelCatalog: runtimeChoice ? [entry] : params.thinkingCatalog,
				catalogResolver: runtimeChoice ? createThinkingCatalogResolver([entry]) : catalogResolver,
				configuredReasoning: publicEntry.configuredReasoning ?? publicEntry.reasoning,
				thinkingPolicyProvider: publicEntry.thinkingPolicyProvider
			});
			const fastModeState = resolveFastModeState({
				cfg: params.cfg,
				agentId: params.agentId,
				provider: entry.provider,
				model: entry.id
			});
			preparedEntry = {
				...buildPublicModelProjection(publicEntry, { includeDetails: params.includeDetails }),
				...configuredEntry?.tags.size ? { tags: [...configuredEntry.tags] } : {},
				...agentRuntime ? { agentRuntime } : {},
				...thinkingProfile,
				...fastModeState.source === "default" ? {} : { effectiveFastMode: fastModeState.mode },
				...capabilityProvider && params.apiKeyCapabilities?.providers.has(capabilityProvider) ? { apiKeySupported: params.apiKeyCapabilities.providers.get(capabilityProvider) === true } : {},
				...params.includeInput && entry.input?.length ? { input: entry.input } : {}
			};
			const entries = prepared.get(entry) ?? /* @__PURE__ */ new Map();
			entries.set(runtimeKey, preparedEntry);
			prepared.set(entry, entries);
		}
		const projectedAvailability = params.preserveUnknownAvailability ? evaluation.availability : evaluation.availability ?? false;
		const supportsFastMode = params.fastMode(entry, evaluation, preparedEntry.agentRuntime?.id);
		return Object.assign({}, preparedEntry, params.manualSelectionAllowed ? { manualSelectionAllowed: params.manualSelectionAllowed({
			provider: entry.provider,
			model: entry.id
		}) } : {}, supportsFastMode === void 0 ? {} : { supportsFastMode }, projectedAvailability === void 0 ? {} : { available: projectedAvailability }, projectedAvailability === false && evaluation.unavailableReason ? {
			unavailableReason: evaluation.unavailableReason,
			...evaluation.unavailableUntil !== void 0 ? { unavailableUntil: evaluation.unavailableUntil } : {}
		} : {});
	};
}
async function buildModelsListResult(params) {
	const prepared = await prepareModelsListResult(params);
	if (!prepared.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Model catalog changed while preparing this result. Retry the request.");
	params.readScope?.draftAccountSelection?.assertCurrent();
	return prepared.read();
}
/** Prepares catalog work once; the returned reader revalidates native readiness without I/O. */
async function prepareModelsListResult(params) {
	const { source } = params;
	const scope = params.readScope;
	const draft = scope?.draftAccountSelection;
	const sessionEntry = draft ? {
		authProfileOverride: draft.authProfileId,
		authProfileOverrideSource: "user"
	} : scope?.sessionEntry;
	const useRequesterDefaults = !scope?.sessionKey && !scope?.sessionEntry;
	draft?.assertCurrent();
	const currentConfig = source.kind === "gateway" ? source.context.getRuntimeConfig : getRuntimeConfig;
	const publishedOwner = source.kind === "published" ? source.owner : void 0;
	const requestConfig = currentConfig();
	const initialConfig = publishedOwner?.config ?? requestConfig;
	const initialAgentId = normalizeAgentId(params.agentId ?? resolveDefaultAgentId(initialConfig));
	const profiles = resolveSessionCatalogProfiles(sessionEntry, initialConfig, initialAgentId);
	const view = resolveModelsListView(params.params);
	const refresh = params.params.refresh === true;
	const preloadedCatalog = params.preloadedCatalog?.agentId === initialAgentId && preparedModelRuntimeConfigsMatch(params.preloadedCatalog.config, initialConfig) ? params.preloadedCatalog : void 0;
	const usedPreloadedCatalog = preloadedCatalog !== void 0 && params.catalogProjector !== void 0;
	if (source.kind === "gateway" && refresh && !params.preloadedOnly) await loadDeferredCatalog(source.context, initialAgentId, {
		readOnly: false,
		refreshFullCatalog: true,
		...params.params.provider ? { providerDiscoveryProviderIds: [params.params.provider] } : {}
	});
	const ownerSnapshot = source.kind === "gateway" && !usedPreloadedCatalog ? await readPreparedCatalog(source.context, initialAgentId) : void 0;
	if (!publishedOwner && !usedPreloadedCatalog && !ownerSnapshot) throw new PreparedModelRuntimeOwnerNotPublishedError("Model catalog is not ready. Retry after Gateway startup or refresh finishes.");
	if (ownerSnapshot && params.agentId !== void 0 && !publishedModelCatalogOwnerMatchesAgent(ownerSnapshot, initialAgentId)) return {
		read: () => ({ models: [] }),
		isCurrent: () => true
	};
	const snapshot = publishedOwner?.modelCatalog ?? (usedPreloadedCatalog ? preloadedCatalog.snapshot : ownerSnapshot);
	if (!snapshot) throw new Error("Model catalog omitted its published snapshot");
	const sourceOwner = publishedOwner ?? ownerSnapshot;
	const cfg = sourceOwner?.config ?? initialConfig;
	const agentId = sourceOwner?.agentId ?? initialAgentId;
	const workspaceDir = sourceOwner?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const preparedProjectionOwner = sourceOwner ?? params.catalogProjector;
	const metadataSnapshot = preparedProjectionOwner?.metadataSnapshot;
	const preparedAuthStore = preparedProjectionOwner?.authStore;
	const preparedPluginRegistry = preparedProjectionOwner?.pluginRegistry;
	const preparedOwnerIsCurrent = preparedProjectionOwner?.isCurrent;
	const isCurrent = () => currentConfig() === requestConfig && preparedOwnerIsCurrent?.() === true && scope?.isCurrent?.() !== false;
	if (!metadataSnapshot || !preparedAuthStore) throw new Error("Gateway model catalog owner omitted prepared metadata or auth state");
	const availableDecisionModels = listDecisionModels({
		config: cfg,
		snapshot: metadataSnapshot
	});
	const retainedModel = params.includeManualSelection && view === "configured" && scope?.sessionEntry ? resolveSessionModelRef(cfg, scope.sessionEntry, agentId, { allowPluginNormalization: false }) : void 0;
	const preparedCatalog = prepareModelCatalogView({
		cfg,
		agentId,
		agentDir: sourceOwner?.agentDir,
		workspaceDir,
		snapshot,
		view,
		retainedModel,
		metadataSnapshot,
		pluginRegistry: preparedPluginRegistry,
		isCurrent,
		observationConfig: preparedProjectionOwner?.observationConfig
	});
	const { defaultModel } = preparedCatalog;
	const preparedRuntimeAuthModes = preparedProjectionOwner?.authModes;
	const preparedRuntimeAuthMaterializations = preparedProjectionOwner?.authMaterializations;
	draft?.assertCurrent();
	const projector = (usedPreloadedCatalog ? params.catalogProjector : void 0) ?? createGatewayAgentModelCatalogProjector({
		cfg,
		agentId,
		agentDir: sourceOwner?.agentDir,
		workspaceDir,
		snapshot: {
			...snapshot,
			entries: preparedCatalog.catalog
		},
		metadataSnapshot,
		preparedAuthStore,
		preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations,
		preparedSyntheticAuthComplete: publishedOwner ? isPreparedModelCatalogFull(publishedOwner.modelCatalog) : ownerSnapshot?.catalogComplete === true,
		requesterProfileId: view === "provider-config" || !useRequesterDefaults ? void 0 : draft?.owner ?? params.requesterProfileId,
		...view === "provider-config" ? {} : profiles,
		routeResolverFactory: params.routeResolverFactory,
		pluginRegistry: preparedPluginRegistry,
		isCurrent,
		observationConfig: preparedProjectionOwner?.observationConfig
	});
	const catalog = dedupeModelCatalogEntries([...preparedCatalog.catalog, ...projector.snapshot.entries]);
	const evaluateNative = (entry, host, runtimeId) => {
		const native = projector.evaluateNative(entry, host, runtimeId);
		return native !== host && currentConfig() !== requestConfig ? {
			...native,
			availability: false
		} : native;
	};
	const { normalizeProvider, providerFilter, matchesProvider } = createModelsListProviderFilter({
		config: cfg,
		metadataSnapshot,
		catalog,
		provider: params.params.provider
	});
	const decisionModels = availableDecisionModels.filter(matchesProvider);
	const { routeVariants, providerOutcomes } = projector.snapshot;
	const publicProviderOutcomes = projectProviderCatalogOutcomes(providerOutcomes);
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: metadataSnapshot
	});
	const pendingProviders = projector.snapshot.pendingProviders?.filter((provider) => (!providerFilter || normalizeProvider(provider) === providerFilter) && (view === "all" || view === "provider-config" || visibilityPolicy.allowAny || [...visibilityPolicy.allowedKeys].some((key) => key.startsWith(`${provider}/`))));
	draft?.assertCurrent();
	const outcomeProjection = {
		...pendingProviders?.length ? { pendingProviders } : {},
		...params.params.includeDefaultModels ?? (view === "configured" && !params.params.sessionKey && !params.params.authProfileId) ? { defaultModels: { automaticUtilityModel: resolveAutomaticUtilityModelRef({
			cfg,
			primaryProvider: resolveDefaultModelForAgent({
				cfg,
				manifestPlugins: metadataSnapshot,
				allowPluginNormalization: false
			}).provider,
			primaryModelRef: resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model),
			metadataSnapshot
		}) ?? null } } : {},
		...publicProviderOutcomes?.length ? { providerOutcomes: publicProviderOutcomes } : {},
		...snapshot.refreshFailed ? { refreshFailed: true } : {},
		...view === "provider-config" || !scope && !params.requesterProfileId ? {} : { accountSelection: resolveChatAccountSelection({
			authStore: projector.authStore,
			sessionEntry,
			requesterProfileId: draft?.owner ?? scope?.requesterProfileId ?? params.requesterProfileId
		}) }
	};
	const capableProviders = params.params.includeProviderCapabilities === true ? apiKeyProviderCapabilities({
		cfg,
		metadataSnapshot,
		workspaceDir
	}) : void 0;
	const configuredEntriesByKey = resolveConfiguredModelEntries({
		cfg,
		agentId,
		defaultModel,
		canonicalizeRef: (ref) => ({
			...ref,
			model: resolveProviderModelCatalogId({
				provider: ref.provider,
				modelId: ref.model
			}) ?? ref.model
		}),
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: metadataSnapshot
	}).byKey;
	if (view === "provider-config") {
		const sourceConfig = getRuntimeConfigSourceSnapshot() ?? cfg;
		const inventoryProjector = createGatewayAgentModelCatalogProjector({
			cfg,
			agentId,
			snapshot: {
				entries: preparedCatalog.providerInventory(sourceConfig, catalog),
				routeVariants,
				...providerOutcomes?.length ? { providerOutcomes } : {}
			},
			metadataSnapshot,
			preparedAuthStore,
			preparedRuntimeAuthModes,
			preparedRuntimeAuthMaterializations,
			pluginRegistry: preparedPluginRegistry,
			isCurrent,
			observationConfig: preparedProjectionOwner?.observationConfig,
			...params.routeResolverFactory ? { routeResolverFactory: params.routeResolverFactory } : {}
		});
		const inventory = await inventoryProjector.projectCatalog();
		const entries = await Promise.all(inventory.map(async (entry) => ({
			entry,
			host: await inventoryProjector.evaluateEntry(entry)
		})));
		const projectPublic = createPublicModelsListProjector({
			pluginRegistry: preparedPluginRegistry,
			thinkingCatalog: catalog,
			fastMode: createModelFastModeResolver({
				cfg,
				agentId,
				catalog: inventory,
				metadataSnapshot,
				pluginRegistry: preparedPluginRegistry
			}),
			cfg,
			agentId,
			configuredEntriesByKey,
			...params.includeManualSelection ? { manualSelectionAllowed: visibilityPolicy.allows } : {},
			includeInput: true,
			includeDetails: params.params.includeDetails,
			preserveUnknownAvailability: true,
			...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
		});
		return {
			isCurrent: () => isCurrent() && inventoryProjector.isCurrent(),
			read: () => ({
				models: entries.filter(({ entry }) => matchesProvider(entry)).map(({ entry, host }) => projectPublic(entry, evaluateNative(entry, host))),
				...outcomeProjection,
				...decisionModels.length ? { decisionModels } : {}
			})
		};
	}
	const { evaluateEntry } = projector;
	const evaluations = /* @__PURE__ */ new Map();
	const runtimeChoiceReaders = /* @__PURE__ */ new Map();
	const projectPublic = createPublicModelsListProjector({
		pluginRegistry: preparedPluginRegistry,
		thinkingCatalog: catalog,
		fastMode: createModelFastModeResolver({
			cfg,
			agentId,
			catalog,
			metadataSnapshot,
			pluginRegistry: preparedPluginRegistry
		}),
		cfg,
		agentId,
		configuredEntriesByKey,
		...params.includeManualSelection ? { manualSelectionAllowed: visibilityPolicy.allows } : {},
		includeDetails: params.params.includeDetails,
		preserveUnknownAvailability: params.params.includeDetails,
		...capableProviders ? { apiKeyCapabilities: capableProviders } : {}
	});
	const readCatalog = await prepareLogicalVisibleModelCatalog({
		cfg,
		metadataSnapshot,
		catalog,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId,
		workspaceDir,
		view,
		policy: visibilityPolicy,
		retainedModel,
		routePolicy: openAIModelCatalogRoutePolicy,
		routeVariants,
		prepareEntry: async (entry, variants) => {
			const key = resolveModelCatalogIdentityKey(entry);
			const requestedRuntimes = configuredEntriesByKey.get(modelKey(entry.provider, entry.id))?.pickerRuntimes;
			const baseRuntime = requestedRuntimes?.length ? resolveAgentHarnessPolicy({
				config: cfg,
				agentId,
				provider: entry.provider,
				modelId: entry.id,
				modelApi: entry.api,
				modelBaseUrl: entry.baseUrl
			}).runtime : void 0;
			const preparedHost = await evaluateEntry(entry, variants, baseRuntime);
			const host = baseRuntime ? {
				...preparedHost,
				requestedRuntimeId: void 0
			} : preparedHost;
			if (requestedRuntimes?.length) runtimeChoiceReaders.set(key, await prepareModelPickerRuntimeChoices({
				cfg,
				agentId,
				entry,
				variants,
				requestedRuntimes,
				baseEvaluation: evaluateNative(entry, host),
				decisions: projector,
				evaluateNative,
				projectPublic
			}));
			return () => {
				const evaluation = evaluateNative(entry, host);
				evaluations.set(resolveModelCatalogIdentityKey(entry), evaluation);
				const syntheticLocal = !(evaluation.routeResolution !== null) && normalizeProviderId(entry.provider) !== "openai" && evaluation.availability === void 0 && evaluation.evidence === "synthetic";
				return resolveLogicalModelCatalogEntryState({
					evaluation,
					authBacked: evaluation.availability === true || syntheticLocal,
					routePolicy: openAIModelCatalogRoutePolicy
				});
			};
		}
	});
	return {
		isCurrent: () => isCurrent() && projector.isCurrent(),
		read: () => {
			const currentCatalog = readCatalog();
			const keyOf = createModelCatalogIdentityKeyResolver();
			return {
				models: currentCatalog.filter(matchesProvider).map((entry) => {
					const key = keyOf(entry);
					const evaluation = evaluations.get(key);
					if (!evaluation) throw new Error("Model catalog publication omitted prepared auth evaluation");
					const runtimeChoices = runtimeChoiceReaders.get(key)?.();
					const projected = projectPublic(entry, evaluation);
					if (runtimeChoices?.length) projected.runtimeChoices = runtimeChoices;
					return projected;
				}),
				...outcomeProjection,
				...decisionModels.length ? { decisionModels } : {}
			};
		}
	};
}
//#endregion
export { createGatewayAgentModelCatalogProjector as n, prepareModelsListResult as r, buildModelsListResult as t };
