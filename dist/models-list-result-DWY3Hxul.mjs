import { d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-KmWrvvig.mjs";
import { r as resolveProviderModelCatalogId } from "./provider-model-routes-BXIDiDZZ.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { i as listAvailableManifestContractPlugins } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { o as dedupeModelCatalogEntries, y as readUtilityModelSetting } from "./model-selection-shared-BZeDVoch.mjs";
import { i as modelMatchesProviderModelRoute } from "./provider-model-route-BpciAISP.mjs";
import { a as resolveModelCatalogIdentityKey, r as openAIModelCatalogRoutePolicy, t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-mS12tkxj.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { i as resolveModelExtraParamSources } from "./model-extra-params-C1g6s41K.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DCsKu1Yv.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BJNC949_.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-lSB2_Cf6.mjs";
import { t as createThinkingCatalogResolver } from "./thinking-DK1cFezU.mjs";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-CmPcCOdA.mjs";
import { r as listCliRuntimeModelBackendBindings } from "./cli-backends-CEoVwGbW.mjs";
import { t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-BI3cB4bq.mjs";
import "./workspace-7iuzSwDh.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-ByP944Cg.mjs";
import { r as PreparedModelRuntimePublicationSupersededError, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { i as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-BjPyMW0v.mjs";
import { C as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-B8unFFC9.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-0e9R_Y2U.mjs";
import { a as isLocalBaseUrl, i as selectModelCatalogRuntimeEntry, r as prepareModelCatalogView, t as createModelCatalogView } from "./model-catalog-view-B5SlLDbh.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-C9Xz8Ynt.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-BzD1ZGAq.mjs";
import { a as resolveUtilityModelRefForAgent, t as resolveAutomaticUtilityModelRef } from "./utility-model-T3nTQ8n8.mjs";
import { r as supportsOpenAIResponsesFastMode } from "./openai-fast-mode-B8-SEg6R.mjs";
import { n as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-BcFXF2w-.mjs";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { n as resolveLogicalModelCatalogEntryState, t as prepareLogicalVisibleModelCatalog } from "./model-catalog-visibility-BfrtjaPz.mjs";
import { a as resolveSessionCatalogProfiles, s as resolveChatAccountSelection } from "./chat-metadata-session-projection-D6fB6baF.mjs";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-C6-cG1Ha.mjs";
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
var UnknownModelCatalogProviderError = class extends Error {};
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
	})) return [...params.accountCatalog?.readServiceTiers({
		identityKey: credential.identityKey,
		modelId: entry.id,
		runtimeId,
		api: route.api,
		baseUrl: route.baseUrl
	}) ?? ["priority", "ultrafast"]];
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
	const { resolveUtilityCompletionRuntimeForAgent } = await import("./utility-completion-Csml8si8.mjs");
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
		const serviceTiers = projectModelServiceTiers({
			config: params.cfg,
			agentId: params.agentId,
			pluginRegistry: params.pluginRegistry,
			snapshot: params.snapshot,
			entry,
			evaluation,
			runtimeId: preparedEntry.agentRuntime?.id ?? "openclaw",
			accountCatalog: params.accountCatalog,
			isCurrent: params.isCurrent
		});
		return Object.assign({}, preparedEntry, params.manualSelectionAllowed ? { manualSelectionAllowed: params.manualSelectionAllowed({
			provider: entry.provider,
			model: entry.id
		}) } : {}, supportsFastMode === void 0 ? {} : { supportsFastMode }, serviceTiers === void 0 ? {} : { serviceTiers }, projectedAvailability === void 0 ? {} : { available: projectedAvailability }, projectedAvailability === false && evaluation.unavailableReason ? {
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
	const publicationScope = params.publicationScope ?? scope;
	const draft = scope?.draftAccountSelection;
	const sessionEntry = draft ? {
		authProfileOverride: draft.authProfileId,
		authProfileOverrideSource: "user"
	} : scope?.sessionEntry;
	const useRequesterDefaults = !scope?.sessionKey && !scope?.sessionEntry;
	draft?.assertCurrent();
	const currentConfig = source.kind === "gateway" ? source.context.getRuntimeConfig : source.getConfig ?? getRuntimeConfig;
	const publishedOwner = source.kind === "published" ? source.owner : void 0;
	const requestConfig = currentConfig();
	const initialConfig = publishedOwner?.config ?? requestConfig;
	const initialAgentId = resolveAmbientOwnerAgentId(initialConfig, params.agentId);
	const profiles = resolveSessionCatalogProfiles(sessionEntry, initialConfig, initialAgentId);
	const view = params.params.view ?? "default";
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
	const isCurrent = () => currentConfig() === requestConfig && preparedOwnerIsCurrent?.() === true && publicationScope?.isCurrent?.() !== false;
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
	const projector = (usedPreloadedCatalog ? params.catalogProjector : void 0) ?? createGatewayAgentModelCatalogProjector({
		cfg,
		agentId,
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
		metadataSnapshot,
		preparedAuthStore,
		accountCatalog: preparedProjectionOwner?.accountCatalog,
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
	if (view !== "provider-config") await projector.prepareSelectedAccountCatalog(() => {
		draft?.assertCurrent();
		publicationScope?.assertCurrent?.();
		if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
	}, {
		allowDiscovery: !params.preloadedOnly && !params.params.preparedOnly,
		refresh
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
	const accountSelection = view === "provider-config" || !scope && !params.requesterProfileId ? void 0 : resolveChatAccountSelection({
		authStore: projector.authStore,
		sessionEntry,
		requesterProfileId: draft?.owner ?? scope?.requesterProfileId ?? params.requesterProfileId
	});
	const readOutcomeProjection = () => {
		const pendingProviders = projector.snapshot.pendingProviders?.filter((provider) => (!providerFilter || normalizeProvider(provider) === providerFilter) && (view === "all" || view === "provider-config" || visibilityPolicy.allowAny || [...visibilityPolicy.allowedKeys].some((key) => key.startsWith(`${provider}/`))));
		return {
			...pendingProviders?.length ? { pendingProviders } : {},
			...outcomeProjection,
			...snapshot.refreshFailed ? { refreshFailed: true } : {},
			...accountSelection ? { accountSelection } : {}
		};
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
			accountCatalog: preparedProjectionOwner?.accountCatalog,
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
			snapshot: inventoryProjector.snapshot,
			accountCatalog: preparedProjectionOwner?.accountCatalog,
			isCurrent,
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
				...readOutcomeProjection(),
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
		snapshot: projector.snapshot,
		accountCatalog: preparedProjectionOwner?.accountCatalog,
		isCurrent: () => isCurrent() && projector.isCurrent(),
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
				...readOutcomeProjection(),
				...decisionModels.length ? { decisionModels } : {}
			};
		}
	};
}
//#endregion
export { UnknownModelCatalogProviderError as i, createGatewayAgentModelCatalogProjector as n, prepareModelsListResult as r, buildModelsListResult as t };
