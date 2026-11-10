import { d as asPositiveSafeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { g as readRuntimeConfig, l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, f as resolveAgentWorkspaceDir, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { r as resolveProviderModelCatalogId } from "./provider-model-routes-CmpBxrCV.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { i as listAvailableManifestContractPlugins } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { b as readUtilityModelSetting, o as dedupeModelCatalogEntries } from "./model-selection-shared-CVU_V2PQ.mjs";
import { i as modelMatchesProviderModelRoute } from "./provider-model-route-D2MOzv0r.mjs";
import { a as resolveModelCatalogIdentityKey, r as openAIModelCatalogRoutePolicy, t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { i as resolveModelExtraParamSources } from "./model-extra-params-HwiZgNCH.mjs";
import "./config-B3oiWDlr.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-pIK04Peo.mjs";
import { n as prepareOperatorModelPolicy } from "./operator-model-policy-3pT6BgLA.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { t as createThinkingCatalogResolver } from "./thinking-BCNoGfZ5.mjs";
import { r as listCliRuntimeModelBackendBindings } from "./cli-backends-BzVT3JSM.mjs";
import { l as resolveCliRuntimeTwinRoute, s as omitCliRuntimeAliasTwins } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { a as prepareModelCatalogView, n as createModelCatalogView, o as selectModelCatalogRuntimeEntry, s as isLocalBaseUrl } from "./model-catalog-view-UkLRAY5C.mjs";
import { r as createModelPickerRecommendationRank } from "./model-catalog-order-DpA_fmrU.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-CyNDDKq6.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-CaRixRbi.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-Bx2gzKtO.mjs";
import { i as resolveProviderFastModeRequestCapabilities } from "./provider-attribution-Dr21G8q1.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
import { r as supportsOpenAIResponsesFastMode } from "./openai-fast-mode-B_jae6aY.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { a as resolveUtilityModelRefForAgent, t as resolveAutomaticUtilityModelRef } from "./utility-model-nsnbR10X.mjs";
import "./workspace-3xrXOvoY.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { n as resolveConfiguredModelEntries } from "./configured-model-entries-BnlVcGcZ.mjs";
import { n as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-CcPwbyRw.mjs";
import { w as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-wDlPVSla.mjs";
import { n as withCurrentReadAuthority } from "./current-read-authority-CySCga_Z.mjs";
import { n as prepareModelCatalogDecisions, r as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-B-_jc7Z2.mjs";
import { n as resolveLogicalModelCatalogEntryState, t as prepareLogicalVisibleModelCatalog } from "./model-catalog-visibility-Ck3zj3mW.mjs";
import { c as prepareChatAccountSelection, o as resolveSessionCatalogProfiles } from "./chat-metadata-session-projection-CYKasMCP.mjs";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-BXrqxlSK.mjs";
import { supportsNativeOpenAIResponsesEndpoint } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/agents/model-fast-mode.ts
/** Capture light policy with the private catalog owner; published row reads cannot load plugins. */
function createModelSpeedPolicyResolver(params) {
	const policies = withPluginCache(getPluginMetadataSnapshotCache(params.metadataSnapshot), () => new Map([...new Set(params.catalog.map((entry) => normalizeProviderId(entry.provider)))].map((provider) => {
		const registered = params.pluginRegistry?.providers.find(({ provider: candidate }) => matchesProviderPluginRef(candidate, provider))?.provider;
		const policy = resolveProviderPolicySurface(provider, { manifestRegistry: params.metadataSnapshot.manifestRegistry });
		return [provider, {
			resolveFastModeSupport: registered?.resolveFastModeSupport ?? policy?.resolveFastModeSupport,
			resolveServiceTiers: registered?.resolveServiceTiers ?? policy?.resolveServiceTiers
		}];
	})));
	return (entry, evaluation, runtimeId) => {
		const policy = policies.get(normalizeProviderId(entry.provider));
		if (!policy || evaluation.routeResolution !== null && !evaluation.selectedRoute) return {};
		const route = evaluation.selectedRoute ?? entry;
		const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
			config: params.cfg,
			provider: entry.provider,
			modelId: entry.id,
			agentId: params.agentId
		});
		const context = {
			provider: entry.provider,
			modelId: entry.id,
			api: route.api,
			baseUrl: route.baseUrl,
			authMode: evaluation.selectedAuthMode,
			runtimeId: runtimeId ?? entry.nativeRuntime,
			modelParams: entry.params,
			params: Object.assign({}, defaultParams, modelParams, agentModelParams, agentParams),
			requestCapabilities: resolveProviderFastModeRequestCapabilities({
				provider: entry.provider,
				api: route.api,
				baseUrl: route.baseUrl,
				providerMetadataOwners: params.metadataSnapshot.owners
			})
		};
		return {
			supportsFastMode: policy.resolveFastModeSupport?.(context),
			serviceTiers: policy.resolveServiceTiers?.(context),
			supportsServiceTierRecovery: context.runtimeId === "openclaw" && supportsNativeOpenAIResponsesEndpoint({
				provider: entry.provider,
				api: route.api ?? "",
				baseUrl: route.baseUrl
			})
		};
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-capabilities.ts
var UnknownModelCatalogProviderError = class extends Error {};
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
		].map(normalizeProvider)).has(providerFilter)) throw new UnknownModelCatalogProviderError(`Unknown model catalog provider ${JSON.stringify(params.provider)}. Run openclaw models list --all to list models and their provider IDs.`);
	}
	return {
		normalizeProvider,
		providerFilter,
		matchesProvider: (entry) => !providerFilter || normalizeProvider(entry.provider) === providerFilter
	};
}
//#endregion
//#region src/agents/model-catalog-service-tiers.ts
/** Account observations are never model metadata donors or native-login readiness. */
function resolveModelCatalogServiceTiers(params) {
	const { snapshot, entry, evaluation, runtimeId } = params;
	const route = evaluation.selectedRoute;
	const credential = evaluation.selectedCredential;
	if (!params.isCurrent() || evaluation.availability !== true || !credential || credential.source === "harness" || !route || !runtimeId) return;
	if (runtimeId === "openclaw" && normalizeProviderId(entry.provider) === "openai" && credential.requirement === "api-key" && route.authRequirement === "api-key" && route.api === "openai-responses" && supportsOpenAIResponsesFastMode({
		provider: "openai",
		...route
	})) return [...params.modelServiceTiers ?? ["priority", "ultrafast"]];
	if (credential.source !== "profile" || route.requestTransportOverrides === "present" || snapshot.refreshFailed || snapshot.pendingProviders?.some((provider) => normalizeProviderId(provider) === normalizeProviderId(entry.provider))) return;
	const outcome = snapshot.providerOutcomes?.find((candidate) => normalizeProviderId(candidate.provider) === normalizeProviderId(entry.provider) && candidate.profileId === credential.profileId);
	if (outcome?.status !== "ready") return;
	const observation = outcome.modelServiceTiers?.find((candidate) => candidate.modelId === entry.id && candidate.runtimeId === runtimeId && modelMatchesProviderModelRoute({
		provider: entry.provider,
		api: candidate.api,
		baseUrl: candidate.baseUrl,
		route
	}));
	return observation ? [...observation.serviceTiers] : void 0;
}
//#endregion
//#region src/gateway/server-methods/models-list-public-projection.ts
/** Harness policy can remove tiers from account/route evidence, never grant new ones. */
function projectModelServiceTiers(params) {
	const serviceTiers = resolveModelCatalogServiceTiers(params);
	if (serviceTiers === void 0) return;
	const harness = params.pluginRegistry?.agentHarnesses.find((registration) => registration.harness.id === params.runtimeId)?.harness;
	if (!harness?.filterModelServiceTiers) return serviceTiers;
	const allowedTiers = new Set(harness.filterModelServiceTiers({
		config: params.config,
		agentId: params.agentId,
		provider: params.entry.provider,
		modelId: params.entry.id,
		serviceTiers
	}));
	return serviceTiers.filter((tier) => allowedTiers.has(tier));
}
/** Keeps concrete route, auth, cost, and provider parameters out of public model rows. */
function buildPublicModelProjection(entry, options = {}) {
	const contextWindow = asPositiveSafeInteger(entry.contextWindow);
	const contextTokens = asPositiveSafeInteger(entry.contextTokens);
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
	return outcomes?.map(({ provider, profileId, status, unlistedConfiguredModelIds }) => ({
		provider,
		...profileId ? { profileId } : {},
		status,
		...status === "ready" && unlistedConfiguredModelIds?.length ? { unlistedConfiguredModelIds: [...unlistedConfiguredModelIds] } : {}
	}));
}
//#endregion
//#region src/gateway/server-methods/models-list-result.default-models.ts
/**
* Auto utility preview from agents.defaults.model, plus the route the utility
* model in effect (automatic or explicit) runs on.
*/
async function resolveDefaultModelsPreview(params) {
	const { cfg, metadataSnapshot } = params;
	const automaticUtilityModel = resolveAutomaticUtilityModelRef({
		cfg,
		primaryProvider: resolveDefaultModelForAgent({
			cfg,
			manifestPlugins: metadataSnapshot,
			allowPluginNormalization: false
		}).provider,
		primaryModelRef: resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model),
		metadataSnapshot
	}) ?? null;
	const agentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const defaults = readUtilityModelSetting(cfg);
	const effective = agentId ? readUtilityModelSetting(cfg, agentId) : void 0;
	if (!agentId || agentId !== params.agentId || !effective || effective.kind !== defaults.kind || effective.kind === "disabled" || effective.kind === "explicit" && defaults.kind === "explicit" && effective.modelRef !== defaults.modelRef || effective.kind === "auto" && (!automaticUtilityModel || resolveUtilityModelRefForAgent({
		cfg,
		agentId,
		metadataSnapshot
	}) !== automaticUtilityModel)) return { automaticUtilityModel };
	const { resolveUtilityCompletionRuntimeForAgent } = await import("./utility-completion-C4U_M02w.mjs");
	const utilityRuntime = await resolveUtilityCompletionRuntimeForAgent({
		...params,
		agentId
	});
	return {
		automaticUtilityModel,
		...utilityRuntime ? { utilityRuntime } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-result.owner.ts
async function resolveModelsListOwner({ preparationAuthority, ...params }) {
	const { source } = params;
	const scope = params.readScope;
	const publicationScope = params.publicationScope ?? scope;
	const draft = scope?.draftAccountSelection;
	const authority = preparationAuthority ?? (draft ? {
		withCurrent: publicationScope?.withCurrent,
		assertCurrent: () => {
			draft.assertCurrent();
			publicationScope?.assertCurrent?.();
		}
	} : publicationScope);
	const sessionEntry = draft ? {
		authProfileOverride: draft.authProfileId,
		authProfileOverrideSource: "user"
	} : scope?.sessionEntry;
	const useRequesterDefaults = !scope?.sessionKey && !scope?.sessionEntry;
	draft?.assertCurrent();
	const currentConfig = source.kind === "gateway" ? source.context.getRuntimeConfig : source.getConfig ?? readRuntimeConfig;
	const publishedOwner = source.kind === "published" ? source.owner : void 0;
	const requestConfig = currentConfig();
	const initialConfig = publishedOwner?.config ?? requestConfig;
	const initialAgentId = resolveAmbientOwnerAgentId(initialConfig, params.agentId);
	const profiles = resolveSessionCatalogProfiles(sessionEntry, initialConfig, initialAgentId);
	const view = params.params.view ?? "default";
	const refresh = params.params.refresh === true;
	const preloadedCatalog = params.preloadedCatalog?.agentId === initialAgentId && preparedModelRuntimeConfigsMatch(params.preloadedCatalog.config, initialConfig) ? params.preloadedCatalog : void 0;
	const usedPreloadedCatalog = preloadedCatalog !== void 0 && params.catalogProjector !== void 0;
	if (source.kind === "gateway" && refresh && !params.preloadedOnly) {
		await loadDeferredCatalog(source.context, initialAgentId, {
			readOnly: false,
			refreshFullCatalog: true,
			...params.params.provider ? { providerDiscoveryProviderIds: [params.params.provider] } : {}
		});
		await withCurrentReadAuthority(authority, () => {});
	}
	const ownerSnapshot = source.kind === "gateway" && !usedPreloadedCatalog ? await readPreparedCatalog(source.context, initialAgentId) : void 0;
	await withCurrentReadAuthority(authority, () => {});
	if (!publishedOwner && !usedPreloadedCatalog && !ownerSnapshot) throw new PreparedModelRuntimeOwnerNotPublishedError("Model catalog is not ready. Retry after Gateway startup or refresh finishes.");
	if (ownerSnapshot && params.agentId !== void 0 && !publishedModelCatalogOwnerMatchesAgent(ownerSnapshot, initialAgentId)) return;
	const snapshot = publishedOwner?.modelCatalog ?? (usedPreloadedCatalog ? preloadedCatalog.snapshot : ownerSnapshot);
	if (!snapshot) throw new Error("Model catalog omitted its published snapshot");
	const sourceOwner = publishedOwner ?? ownerSnapshot;
	const cfg = captureRuntimeConfig(sourceOwner?.config ?? initialConfig);
	const agentId = sourceOwner?.agentId ?? initialAgentId;
	const workspaceDir = sourceOwner?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const preparedProjectionOwner = sourceOwner ?? params.catalogProjector;
	return {
		params,
		scope,
		publicationScope,
		draft,
		authority,
		sessionEntry,
		useRequesterDefaults,
		publishedOwner,
		profiles,
		view,
		refresh,
		usedPreloadedCatalog,
		ownerSnapshot,
		snapshot,
		sourceOwner,
		cfg,
		agentId,
		workspaceDir,
		preparedProjectionOwner,
		metadataSnapshot: preparedProjectionOwner?.metadataSnapshot,
		preparedAuthStore: preparedProjectionOwner?.authStore,
		preparedPluginRegistry: preparedProjectionOwner?.pluginRegistry
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-runtime-choices.ts
/** Captures alternative runtime metadata while readiness stays with the prepared catalog owner. */
function prepareModelPickerRuntimeChoices(params) {
	const { cfg, agentId, entry, variants, requestedRuntimes, baseEvaluation, decisions, evaluateNative, projectPublic } = params;
	const selected = resolveCatalogDecisionRuntime({
		cfg,
		agentId,
		entry,
		evaluation: baseEvaluation,
		pluginRegistry: decisions.pluginRegistry
	});
	const alternatives = requestedRuntimes.filter((runtimeId) => runtimeId !== (selected?.id ?? "openclaw")).map((runtimeId) => {
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
		const runtimeHost = decisions.evaluateEntry(runtimeEntry, variants, runtimeId);
		const runtimeRegistered = runtimeId === "openclaw" || decisions.pluginRegistry?.agentHarnesses.some(({ harness }) => harness.id === runtimeId) || listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === runtimeId && normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider));
		return (availableRuntimes) => {
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
	});
	return () => {
		const availableRuntimes = decisions.runtimeChoices(entry, variants);
		return alternatives.map((read) => read(availableRuntimes));
	};
}
//#endregion
//#region src/gateway/server-methods/models-list-result.ts
async function buildModelsListResult(params) {
	const prepared = await prepareModelsListResult(params);
	if (!prepared.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Model catalog changed while preparing this result. Retry the request.");
	params.readScope?.draftAccountSelection?.assertCurrent();
	return prepared.read();
}
/** Prepares catalog work once; the returned reader revalidates native readiness without I/O. */
async function prepareModelsListResult(params) {
	const owner = await resolveModelsListOwner(params);
	if (!owner) return {
		read: () => ({ models: [] }),
		isCurrent: () => true
	};
	return withPluginRuntimeRegistryScope(owner.preparedPluginRegistry, () => prepareOwnedModelsListResult(owner));
}
async function prepareOwnedModelsListResult({ params, scope, publicationScope, draft, authority, sessionEntry, useRequesterDefaults, publishedOwner, profiles, view, refresh, usedPreloadedCatalog, ownerSnapshot, snapshot, sourceOwner, cfg, agentId, workspaceDir, preparedProjectionOwner, metadataSnapshot, preparedAuthStore, preparedPluginRegistry }) {
	const preparedOwnerIsCurrent = preparedProjectionOwner?.isCurrent;
	const isCurrent = () => preparedOwnerIsCurrent?.() === true && publicationScope?.isCurrent?.() !== false;
	if (!metadataSnapshot || !preparedAuthStore) throw new Error("Gateway model catalog owner omitted prepared metadata or auth state");
	const availableDecisionModels = listDecisionModels({
		config: cfg,
		snapshot: metadataSnapshot
	});
	const selectedModel = resolveSessionModelRef(cfg, scope?.sessionEntry, agentId, { allowPluginNormalization: false });
	const retainedModel = params.includeManualSelection && view === "configured" && scope?.sessionEntry ? selectedModel : void 0;
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
	const decisionOwner = () => ({
		cfg,
		agentId,
		metadataSnapshot,
		preparedAuthStore,
		accountCatalog: preparedProjectionOwner?.accountCatalog,
		preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations,
		pluginRegistry: preparedPluginRegistry,
		isCurrent,
		observationConfig: preparedProjectionOwner?.observationConfig
	});
	const projectorParams = {
		...decisionOwner(),
		agentDir: sourceOwner?.agentDir,
		workspaceDir,
		snapshot: {
			...snapshot,
			entries: preparedCatalog.catalog,
			get pendingProviders() {
				return snapshot.pendingProviders;
			},
			get refreshFailed() {
				return snapshot.refreshFailed;
			}
		},
		preparedSyntheticAuthComplete: publishedOwner ? isPreparedModelCatalogFull(publishedOwner.modelCatalog) : ownerSnapshot?.catalogComplete === true,
		requesterProfileId: view === "provider-config" || !useRequesterDefaults ? void 0 : draft?.owner ?? params.requesterProfileId,
		...view === "provider-config" ? {} : profiles,
		routeResolverFactory: params.routeResolverFactory
	};
	const preloadedProjector = usedPreloadedCatalog ? params.catalogProjector : void 0;
	const projector = preloadedProjector ? await withCurrentReadAuthority(authority, () => preloadedProjector) : await prepareModelCatalogDecisions(projectorParams, authority);
	if (view !== "provider-config") await projector.prepareSelectedAccountCatalog(() => {
		draft?.assertCurrent();
		publicationScope?.assertCurrent?.();
		if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
	}, {
		refresh: refresh && !params.preloadedOnly && !params.params.preparedOnly,
		withCurrent: authority?.withCurrent,
		beforeRequest: publicationScope?.beforeRequest
	});
	await withCurrentReadAuthority(authority, () => {});
	const catalog = dedupeModelCatalogEntries([...preparedCatalog.catalog, ...projector.snapshot.entries]);
	const { evaluateNative } = projector;
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
	draft?.assertCurrent();
	const defaultModels = params.params.includeDefaultModels ?? (view === "configured" && !params.params.sessionKey && !params.params.authProfileId) ? await resolveDefaultModelsPreview({
		cfg,
		agentId,
		agentDir: sourceOwner?.agentDir,
		workspaceDir,
		metadataSnapshot,
		preparedAuthStore,
		preparedRuntimeAuthModes: preparedProjectionOwner?.authModes,
		preparedRuntimeAuthMaterializations: preparedProjectionOwner?.authMaterializations,
		pluginRegistry: preparedPluginRegistry,
		snapshot,
		isCurrent
	}) : void 0;
	draft?.assertCurrent();
	const outcomeProjection = {
		...defaultModels ? { defaultModels } : {},
		...publicProviderOutcomes?.length ? { providerOutcomes: publicProviderOutcomes } : {}
	};
	const readAccountSelection = view === "provider-config" || !scope && !params.requesterProfileId ? void 0 : await withCurrentReadAuthority(authority, () => prepareChatAccountSelection({
		authStore: projector.authStore,
		sessionEntry,
		requesterProfileId: draft?.owner ?? scope?.requesterProfileId ?? params.requesterProfileId
	}));
	await withCurrentReadAuthority(authority, () => {});
	const readOutcomeProjection = () => {
		const accountSelection = readAccountSelection?.();
		const pendingProviders = projector.snapshot.pendingProviders?.filter((provider) => (!providerFilter || normalizeProvider(provider) === providerFilter) && (view === "all" || view === "provider-config" || visibilityPolicy.allowAny || [...visibilityPolicy.allowedKeys].some((key) => key.startsWith(`${provider}/`))));
		return {
			...pendingProviders?.length ? { pendingProviders } : {},
			...outcomeProjection,
			...snapshot.refreshFailed ? { refreshFailed: true } : {},
			...accountSelection ? { accountSelection } : {},
			...decisionModels.length ? { decisionModels } : {}
		};
	};
	const capableProviders = params.params.includeProviderCapabilities === true ? resolveModelProviderCapabilities({
		config: cfg,
		metadataSnapshot,
		workspaceDir
	}) : void 0;
	const apiKeyProviders = new Map(capableProviders?.capabilities.map(({ provider, apiKeySupported }) => [provider, apiKeySupported]));
	const manualSelectionAllowed = params.includeManualSelection ? visibilityPolicy.allows : void 0;
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
	const createPublicProjector = (decisions, modelCatalog) => {
		const projectionSnapshot = decisions.snapshot;
		const accountCatalog = preparedProjectionOwner?.accountCatalog;
		const includeDetails = params.params.includeDetails;
		const preserveUnknownAvailability = view === "provider-config" || includeDetails;
		const projectionIsCurrent = view === "provider-config" ? isCurrent : () => isCurrent() && decisions.isCurrent();
		const fastMode = createModelSpeedPolicyResolver({
			cfg,
			agentId,
			catalog: modelCatalog,
			metadataSnapshot,
			pluginRegistry: preparedPluginRegistry
		});
		const catalogResolver = createThinkingCatalogResolver(catalog);
		const prepared = /* @__PURE__ */ new WeakMap();
		return (entry, evaluation, runtimeChoice) => {
			const runtimeKey = runtimeChoice ?? "";
			let preparedEntry = prepared.get(entry)?.get(runtimeKey);
			if (!preparedEntry) {
				const configuredEntry = configuredEntriesByKey.get(modelKey(entry.provider, entry.id));
				const alias = configuredEntry?.aliases.at(-1);
				const publicEntry = configuredEntry?.aliasDisabled ? Object.assign({}, entry, { alias: void 0 }) : alias && alias !== entry.alias ? Object.assign({}, entry, { alias }) : entry;
				const capabilityProvider = capableProviders?.resolveProvider(entry.provider);
				const selectedRuntime = runtimeChoice ? {
					id: runtimeChoice,
					source: "model"
				} : resolveCatalogDecisionRuntime({
					cfg,
					agentId,
					entry,
					evaluation,
					pluginRegistry: preparedPluginRegistry
				});
				const agentRuntime = selectedRuntime ? preparedPluginRegistry ? withPluginRuntimeRegistryScope(preparedPluginRegistry, () => projectWorkerPlacementAgentRuntime(selectedRuntime)) : projectWorkerPlacementAgentRuntime(selectedRuntime) : void 0;
				const thinkingProfile = typeof publicEntry.reasoning !== "boolean" ? void 0 : resolveGatewayModelThinkingProfile({
					cfg,
					agentId,
					provider: entry.provider,
					model: entry.id,
					agentRuntime: selectedRuntime?.id ?? "openclaw",
					modelCatalog: runtimeChoice ? [entry] : catalog,
					catalogResolver: runtimeChoice ? createThinkingCatalogResolver([entry]) : catalogResolver,
					configuredReasoning: publicEntry.configuredReasoning ?? publicEntry.reasoning,
					thinkingPolicyProvider: publicEntry.thinkingPolicyProvider
				});
				const fastModeState = resolveFastModeState({
					cfg,
					agentId,
					provider: entry.provider,
					model: entry.id
				});
				preparedEntry = {
					...buildPublicModelProjection(publicEntry, { includeDetails }),
					...manualSelectionAllowed ? { manualSelectionAllowed: manualSelectionAllowed({
						provider: entry.provider,
						model: entry.id
					}) } : {},
					...configuredEntry?.tags.size ? { tags: [...configuredEntry.tags] } : {},
					...agentRuntime ? { agentRuntime } : {},
					...thinkingProfile,
					...fastModeState.source === "default" ? {} : { effectiveFastMode: fastModeState.mode },
					...capabilityProvider && apiKeyProviders.has(capabilityProvider) ? { apiKeySupported: apiKeyProviders.get(capabilityProvider) === true } : {},
					...view === "provider-config" && entry.input?.length ? { input: entry.input } : {}
				};
				const entries = prepared.get(entry) ?? /* @__PURE__ */ new Map();
				entries.set(runtimeKey, preparedEntry);
				prepared.set(entry, entries);
			}
			const projectedAvailability = preserveUnknownAvailability || evaluation.runtimeAuth?.source === "native" ? evaluation.availability : evaluation.availability ?? false;
			const speedPolicy = fastMode(entry, evaluation, preparedEntry.agentRuntime?.id);
			const supportsFastMode = speedPolicy.supportsFastMode;
			const serviceTiers = projectModelServiceTiers({
				config: cfg,
				agentId,
				pluginRegistry: preparedPluginRegistry,
				snapshot: projectionSnapshot,
				entry,
				evaluation,
				runtimeId: preparedEntry.agentRuntime?.id ?? "openclaw",
				modelServiceTiers: speedPolicy.serviceTiers,
				isCurrent: projectionIsCurrent
			});
			const credential = evaluation.selectedCredential;
			const route = evaluation.selectedRoute;
			const serviceTierObservation = projectionIsCurrent() && evaluation.availability === true && speedPolicy.supportsServiceTierRecovery && credential && credential.source !== "harness" && route ? accountCatalog?.readServiceTierObservation({
				identityKey: credential.identityKey,
				modelId: entry.id,
				runtimeId: preparedEntry.agentRuntime?.id ?? "openclaw",
				api: route.api,
				baseUrl: route.baseUrl
			}) : void 0;
			return {
				...preparedEntry,
				...supportsFastMode === void 0 ? {} : { supportsFastMode },
				...speedPolicy.supportsServiceTierRecovery === true ? { supportsServiceTierRecovery: true } : {},
				...serviceTiers === void 0 ? {} : { serviceTiers },
				...serviceTierObservation ? { serviceTierObservation } : {},
				...projectedAvailability === void 0 ? {} : { available: projectedAvailability },
				...projectedAvailability === false && evaluation.unavailableReason ? {
					unavailableReason: evaluation.unavailableReason,
					...evaluation.unavailableUntil !== void 0 ? { unavailableUntil: evaluation.unavailableUntil } : {}
				} : {}
			};
		};
	};
	if (view === "provider-config") {
		const sourceConfig = getRuntimeConfigSourceSnapshot() ?? cfg;
		const inventorySnapshot = {
			entries: preparedCatalog.providerInventory(sourceConfig, catalog),
			routeVariants,
			...providerOutcomes?.length ? { providerOutcomes } : {}
		};
		const inventoryProjector = createModelCatalogDecisions({
			...decisionOwner(),
			snapshot: inventorySnapshot,
			...params.routeResolverFactory ? { routeResolverFactory: params.routeResolverFactory } : {}
		});
		const inventory = await inventoryProjector.projectCatalog(authority);
		const entries = await withCurrentReadAuthority(authority, () => inventory.map((entry) => ({
			entry,
			host: inventoryProjector.evaluateEntry(entry)
		})));
		const projectPublic = createPublicProjector(inventoryProjector, inventory);
		return {
			isCurrent: () => isCurrent() && inventoryProjector.isCurrent(),
			read: () => ({
				models: entries.filter(({ entry }) => matchesProvider(entry)).map(({ entry, host }) => projectPublic(entry, evaluateNative(entry, host))),
				...readOutcomeProjection()
			})
		};
	}
	const { evaluateEntry } = projector;
	const evaluations = /* @__PURE__ */ new Map();
	const runtimeChoiceReaders = /* @__PURE__ */ new Map();
	const twinRoutes = /* @__PURE__ */ new Map();
	const selectionPolicies = view === "all" ? [] : [visibilityPolicy, ...Object.values(cfg.gateway?.roles?.definitions ?? {}).flatMap(({ modelPolicy }) => prepareOperatorModelPolicy({
		cfg,
		policy: modelPolicy,
		manifestPlugins: metadataSnapshot
	}) ?? [])];
	const projectPublic = createPublicProjector(projector, catalog);
	const readCatalog = await withCurrentReadAuthority(authority, () => prepareLogicalVisibleModelCatalog({
		cfg,
		isCurrent: () => isCurrent() && projector.isCurrent(),
		metadataSnapshot,
		catalog,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel,
		agentId,
		workspaceDir,
		view,
		policy: visibilityPolicy,
		retainedModel,
		selectedModel,
		routePolicy: openAIModelCatalogRoutePolicy,
		routeVariants,
		prepareEntry: (entry, variants) => {
			const key = resolveModelCatalogIdentityKey(entry);
			const twin = view === "all" ? void 0 : resolveCliRuntimeTwinRoute(entry, {
				config: cfg,
				agentId,
				cliRuntimeBindings: projector.cliRuntimeBindings
			});
			if (twin) twinRoutes.set(key, twin);
			const requestedRuntimes = configuredEntriesByKey.get(modelKey(entry.provider, entry.id))?.pickerRuntimes;
			const baseRuntime = requestedRuntimes?.length ? resolveAgentHarnessPolicy({
				config: cfg,
				agentId,
				provider: entry.provider,
				modelId: entry.id,
				modelApi: entry.api,
				modelBaseUrl: entry.baseUrl
			}).runtime : void 0;
			const preparedHost = evaluateEntry(entry, variants, baseRuntime);
			const host = baseRuntime ? {
				...preparedHost,
				requestedRuntimeId: void 0
			} : preparedHost;
			if (requestedRuntimes?.length) runtimeChoiceReaders.set(key, prepareModelPickerRuntimeChoices({
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
				evaluations.set(key, evaluation);
				const syntheticLocal = !(evaluation.routeResolution !== null) && normalizeProviderId(entry.provider) !== "openai" && evaluation.availability === void 0 && evaluation.evidence === "synthetic";
				return resolveLogicalModelCatalogEntryState({
					evaluation,
					authBacked: evaluation.availability === true || syntheticLocal,
					routePolicy: openAIModelCatalogRoutePolicy
				});
			};
		}
	}));
	return {
		isCurrent: () => isCurrent() && projector.isCurrent(),
		read: () => {
			const currentCatalog = readCatalog();
			const keyOf = createModelCatalogIdentityKeyResolver();
			const recommendationRank = createModelPickerRecommendationRank(cfg);
			return {
				models: omitCliRuntimeAliasTwins(currentCatalog.filter(matchesProvider).map((entry) => {
					const key = keyOf(entry);
					const evaluation = evaluations.get(key);
					if (!evaluation) throw new Error("Model catalog publication omitted prepared auth evaluation");
					const runtimeChoices = runtimeChoiceReaders.get(key)?.();
					const projected = projectPublic(entry, evaluation);
					if (runtimeChoices?.length) projected.runtimeChoices = runtimeChoices;
					if (recommendationRank(entry) !== void 0) projected.recommended = true;
					return {
						row: projected,
						twin: twinRoutes.get(key)
					};
				}), selectionPolicies),
				...readOutcomeProjection()
			};
		}
	};
}
//#endregion
export { prepareModelsListResult as n, UnknownModelCatalogProviderError as r, buildModelsListResult as t };
