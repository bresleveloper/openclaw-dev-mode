import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { a as resolveAgentDir, b as resolveNativeModelPrimary, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as captureUserProfileModelAccountLinksAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { o as dedupeModelCatalogEntries } from "./model-selection-shared-CVU_V2PQ.mjs";
import { r as openAIModelCatalogRoutePolicy, t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as buildAgentHarnessSupportContext, o as resolveAutoAgentHarnessId } from "./support-CqB31PZB.mjs";
import { t as resolveAgentHarnessAvailabilityDecision } from "./availability-CUqXgij4.mjs";
import { r as listCliRuntimeModelBackendBindings } from "./cli-backends-BzVT3JSM.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { a as prepareModelCatalogView, o as selectModelCatalogRuntimeEntry, r as listModelCatalogObservedRoutes, t as createModelCatalogSnapshotView } from "./model-catalog-view-UkLRAY5C.mjs";
import { n as loadManifestModelCatalog } from "./model-catalog-vYmFg90_.mjs";
import { T as materializePreparedPersonalAuthProfile } from "./store-BPXZsh12.mjs";
import { h as resolveAuthStoreReadOnlyValidUntil } from "./loader-runtime-load-DzFljQbT.mjs";
import { a as resolveExternalCliAuthScopeFromConfig } from "./external-cli-discovery-kYfv_bUN.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { n as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-CcPwbyRw.mjs";
import { t as createUnlistedClaudeCliWildcardCheck } from "./model-catalog-cli-wildcard-WhUtL_u4.mjs";
import { n as withCurrentReadAuthority } from "./current-read-authority-CySCga_Z.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-BPF9Xw78.mjs";
//#region src/agents/model-catalog-decision-runtime.ts
/** Public runtime and thinking consume this same route/account decision. */
function resolveCatalogDecisionRuntime(params) {
	const route = params.evaluation.selectedRoute;
	const context = {
		config: params.cfg,
		agentId: params.agentId,
		provider: params.entry.provider,
		modelId: params.entry.id,
		modelProvider: {
			api: route?.api ?? params.entry.api,
			baseUrl: route?.baseUrl ?? params.entry.baseUrl,
			requestTransportOverrides: route?.requestTransportOverrides,
			runtimePolicy: route?.runtimePolicy,
			preparedAuth: params.evaluation.selectedCredential
		},
		preparedModelProvider: true
	};
	const select = () => {
		const { policy } = resolveAgentHarnessAvailabilityDecision({
			...context,
			mode: "projection",
			agentHarnessRuntimeOverride: params.evaluation.requestedRuntimeId
		});
		return {
			policy,
			runtime: policy.runtime === "auto" ? resolveAutoAgentHarnessId(context) ?? "openclaw" : policy.runtime
		};
	};
	const selected = params.pluginRegistry ? withPluginRuntimeRegistryScope(params.pluginRegistry, select) : (() => {
		const policy = resolveAgentHarnessPolicy({
			...context,
			modelApi: context.modelProvider.api,
			modelBaseUrl: context.modelProvider.baseUrl,
			requestTransportOverrides: context.modelProvider.requestTransportOverrides
		});
		return {
			policy,
			runtime: params.evaluation.requestedRuntimeId ?? (policy.runtime === "auto" ? "openclaw" : policy.runtime)
		};
	})();
	const runtime = selected.policy.runtimeSource === "implicit" && !selected.policy.forcedByEnvironment && isDefaultAgentRuntimeId(params.evaluation.requestedRuntimeId) ? params.evaluation.runtimeAuth?.id ?? selected.runtime : selected.runtime;
	if (selected.policy.runtime === "auto" && runtime === "openclaw" && !params.evaluation.requestedRuntimeId) return;
	return {
		id: runtime,
		source: selected.policy.runtimeSource ?? "implicit"
	};
}
//#endregion
//#region src/agents/model-catalog-decisions.ts
/** Prepare private records once under the caller's retained credential authority. */
async function prepareModelCatalogDecisions(params, authority) {
	const selection = params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId) ? { profileId: params.preferredProfileId } : !params.preferredProfileId && params.requesterProfileId ? { requesterProfileId: params.requesterProfileId } : void 0;
	if (!selection || params.preparedPersonalCatalog) return withCurrentReadAuthority(authority, () => createModelCatalogDecisions(params));
	const context = captureOpenClawStateReadWorkerContext();
	const linksAreCurrent = "requesterProfileId" in selection ? captureUserProfileModelAccountLinksAuthority(context.admission, selection.requesterProfileId) : void 0;
	const isCurrent = () => {
		try {
			context.admission.assertCurrent();
			return linksAreCurrent?.() !== false;
		} catch {
			return false;
		}
	};
	const assertPreparedCurrent = () => {
		if (!isCurrent() || params.isCurrent?.() === false) throw new PreparedModelRuntimePublicationSupersededError("Personal model accounts changed while preparing the catalog");
	};
	const { readPersonalCatalogProfiles } = await import("./sqlite-read-D4hjtcjU.mjs");
	const profiles = await withCurrentReadAuthority(authority, () => {
		assertPreparedCurrent();
		if ("requesterProfileId" in selection && getActiveOpenClawStateDatabaseReadSnapshot()) throw new PreparedModelRuntimePublicationSupersededError("Default account selection requires current link authority");
		return readPersonalCatalogProfiles(selection, context);
	});
	return withCurrentReadAuthority(authority, () => {
		assertPreparedCurrent();
		return createModelCatalogDecisions({
			...params,
			preparedPersonalCatalog: {
				...profiles,
				isCurrent
			}
		});
	});
}
/** Builds requester/session auth views without changing shared catalog or credential snapshots. */
function createModelCatalogDecisions(params) {
	const metadataSnapshot = params.metadataSnapshot;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const configuredProfileId = splitTrailingAuthProfile(resolveNativeModelPrimary(params.cfg, params.agentId) ?? "").profile;
	const primary = resolveDefaultModelForAgent({
		...params,
		manifestPlugins: metadataSnapshot
	});
	const primaryEntry = {
		provider: primary.provider,
		id: primary.model
	};
	const modelKeyOf = createModelCatalogIdentityKeyResolver();
	const primaryKey = modelKeyOf(primaryEntry);
	const configuredPinForEntry = (entry) => modelKeyOf(entry) === primaryKey ? configuredProfileId : void 0;
	const cliRuntimeBindings = params.pluginRegistry ? withPluginRuntimeRegistryScope(params.pluginRegistry, () => listCliRuntimeModelBackendBindings()) : listCliRuntimeModelBackendBindings();
	let authStore = params.preparedAuthStore;
	const preferredProfilesByProvider = /* @__PURE__ */ new Map();
	const personalProviders = /* @__PURE__ */ new Set();
	const personalCatalog = params.preparedPersonalCatalog;
	if (!personalCatalog && (params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId) || !params.preferredProfileId && params.requesterProfileId)) throw new Error("Personal model catalog records require asynchronous preparation");
	if (params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId)) {
		authStore = materializePreparedPersonalAuthProfile(authStore, params.preferredProfileId, personalCatalog?.profiles[params.preferredProfileId]);
		const provider = authStore.profiles[params.preferredProfileId]?.provider;
		if (provider) personalProviders.add(normalizeProviderId(provider));
	} else if (!params.preferredProfileId && params.requesterProfileId) for (const link of personalCatalog?.links ?? []) {
		const selected = isUserModelAuthProfileId(link.authProfileId) ? materializePreparedPersonalAuthProfile(authStore, link.authProfileId, personalCatalog?.profiles[link.authProfileId]) : authStore;
		const provider = selected.profiles[link.authProfileId]?.provider ?? params.cfg.auth?.profiles?.[link.authProfileId]?.provider;
		if (!provider || normalizeProviderId(provider) !== link.provider) continue;
		authStore = selected;
		preferredProfilesByProvider.set(link.provider, link.authProfileId);
		if (isUserModelAuthProfileId(link.authProfileId)) personalProviders.add(link.provider);
	}
	const personalStaticEntries = personalProviders.size ? [...params.snapshot.staticEntries ?? [], ...loadManifestModelCatalog({
		config: params.cfg,
		metadataSnapshot
	})].filter((entry) => personalProviders.has(normalizeProviderId(entry.provider))) : [];
	let snapshot = personalStaticEntries.length ? {
		...params.snapshot,
		entries: dedupeModelCatalogEntries([...params.snapshot.entries, ...personalStaticEntries]),
		routeVariants: [...params.snapshot.routeVariants.length ? params.snapshot.routeVariants : params.snapshot.entries, ...personalStaticEntries]
	} : params.snapshot;
	const selectedProfileId = params.preferredProfileId ?? params.pinnedProfileId;
	const profileProvider = params.profileProvider ?? (selectedProfileId ? authStore.profiles[selectedProfileId]?.provider ?? params.cfg.auth?.profiles?.[selectedProfileId]?.provider : void 0);
	if (snapshot.pendingProviders?.length && (selectedProfileId || preferredProfilesByProvider.size)) {
		const authProvider = (provider) => resolveProviderIdForAuth(provider, {
			config: params.cfg,
			metadataSnapshot
		});
		snapshot = {
			...snapshot,
			pendingProviders: snapshot.pendingProviders.filter((provider) => !preferredProfilesByProvider.has(normalizeProviderId(provider)) && (!selectedProfileId || profileProvider && authProvider(provider) !== authProvider(profileProvider)))
		};
	}
	const providerOutcomes = [...snapshot.providerOutcomes ?? []];
	const statusSource = snapshot;
	snapshot = {
		...snapshot,
		providerOutcomes,
		get refreshFailed() {
			return statusSource.refreshFailed;
		},
		get pendingProviders() {
			return statusSource.pendingProviders;
		}
	};
	const nativeEvaluator = prepareModelCatalogView({
		...params,
		snapshot,
		workspaceDir,
		profileProvider
	}).evaluateNative;
	const evaluateNative = (entry, host, runtimeId) => preferredProfilesByProvider.has(normalizeProviderId(entry.provider)) || configuredPinForEntry(entry) ? host : nativeEvaluator(entry, host, runtimeId);
	const authValidUntil = resolveAuthStoreReadOnlyValidUntil(authStore, Date.now());
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	let normalizedPlugins;
	const authResolver = createModelAuthAvailabilityResolver({
		cfg: params.cfg,
		agentId: params.agentId,
		authStore,
		agentDir,
		preparedCliRuntimeAuthDirectories: {
			agentDir,
			inheritedAuthDir: resolveLegacyInheritedAuthDir(params.cfg)
		},
		env: process.env,
		metadataSnapshot,
		preparedRuntimeAuthModes: params.preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations: params.preparedRuntimeAuthMaterializations,
		preparedSyntheticAuthComplete: params.preparedSyntheticAuthComplete ?? isPreparedModelCatalogFull(params.snapshot),
		workspaceDir,
		syntheticAuthProviderRefs: metadataSnapshot.plugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
			snapshot: metadataSnapshot,
			plugin,
			config: params.cfg,
			normalizedConfig: params.cfg.plugins && (normalizedPlugins ??= normalizePluginsConfig(params.cfg.plugins))
		})).flatMap((plugin) => plugin.syntheticAuthRefs ?? []),
		externalCliProviderIds: resolveExternalCliAuthScopeFromConfig(params.cfg)?.providerIds ?? [],
		preparedRuntimeAuthStore: authStore,
		routeResolverFactory: params.routeResolverFactory,
		accountListedModelIds: (provider, profileId) => {
			let listed;
			for (const outcome of providerOutcomes) if (outcome.status === "ready" && outcome.listedModelIds && outcome.profileId === profileId && normalizeProviderId(outcome.provider) === provider) {
				listed ??= /* @__PURE__ */ new Set();
				for (const id of outcome.listedModelIds) listed.add(normalizeLowercaseStringOrEmpty(id));
			}
			return listed;
		}
	});
	const evaluations = /* @__PURE__ */ new Map();
	const preferredProfileIdForCatalog = params.preferredProfileId || void 0;
	const pinnedProfileIdForCatalog = params.pinnedProfileId || void 0;
	const runtimeOverride = params.runtimeOverride;
	const normalizeAuthProvider = (provider) => resolveProviderIdForAuth(provider, {
		config: params.cfg,
		metadataSnapshot
	});
	const isSelectedProvider = (provider) => !profileProvider || normalizeAuthProvider(profileProvider) === normalizeAuthProvider(provider);
	const pinnedProfileForEntry = (entry) => (isSelectedProvider(entry.provider) ? pinnedProfileIdForCatalog : void 0) ?? preferredProfilesByProvider.get(normalizeProviderId(entry.provider)) ?? configuredPinForEntry(entry);
	const isUnlistedWildcardCliModel = createUnlistedClaudeCliWildcardCheck({
		cfg: params.cfg,
		agentId: params.agentId,
		outcomes: () => snapshot.providerOutcomes
	});
	const evaluateStoredEntry = (entry, routeVariants, runtimeId) => {
		const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
		const observedRoutes = listModelCatalogObservedRoutes(routeVariants ?? [entry]);
		const cacheKey = JSON.stringify([
			modelKeyOf(entry),
			runtimeId,
			entry.api,
			entry.baseUrl,
			observedRoutes
		]);
		const cached = evaluations.get(cacheKey);
		if (cached) return cached;
		const defaultProfileId = preferredProfilesByProvider.get(normalizeProviderId(entry.provider));
		const sameProvider = isSelectedProvider(entry.provider);
		const preferredProfileId = (sameProvider ? preferredProfileIdForCatalog : void 0) ?? defaultProfileId;
		const pinnedProfileId = pinnedProfileForEntry(entry);
		const requestedRuntimeId = runtimeId ?? (sameProvider && profileProvider ? runtimeOverride : void 0);
		const resolved = {
			...authResolver.evaluateRuntimeModelAuth(entry.provider, {
				modelId: identity?.id ?? entry.id,
				runtimeId: requestedRuntimeId,
				...normalizeProviderId(entry.provider) === "openai" ? {} : {
					api: entry.api,
					baseUrl: entry.baseUrl
				},
				...preferredProfileId ? { preferredProfileId } : {},
				...pinnedProfileId ? { pinnedProfileId } : {},
				observedRoutes
			}),
			...requestedRuntimeId ? { requestedRuntimeId } : {}
		};
		const provider = normalizeProviderId(entry.provider);
		const listed = !requestedRuntimeId && resolved.availability === true && resolved.evidence === "runtime" && isUnlistedWildcardCliModel(provider, identity?.id ?? entry.id) ? {
			...resolved,
			availability: false
		} : resolved;
		const evaluation = providerOutcomes.some((outcome) => outcome.status === "auth-rejected" && outcome.rejectionScope !== "catalog" && normalizeProviderId(outcome.provider) === provider && (outcome.profileId === void 0 || outcome.profileId === resolved.selectedProfileId)) ? {
			...resolved,
			availability: false,
			unavailableReason: "auth-failed",
			unavailableUntil: void 0
		} : listed;
		evaluations.set(cacheKey, evaluation);
		return evaluation;
	};
	const evaluateEntry = Boolean(params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId) && !authStore.profiles[params.preferredProfileId]) ? (entry, variants, runtimeId) => profileProvider && normalizeProviderId(profileProvider) !== normalizeProviderId(entry.provider) ? evaluateStoredEntry(entry, variants, runtimeId) : {
		availability: false,
		unavailableReason: "missing-auth",
		routeResolution: null
	} : evaluateStoredEntry;
	const accountObservations = [];
	const isCurrent = () => Date.now() < authValidUntil && personalCatalog?.isCurrent() !== false && (params.isCurrent?.() ?? params.observationConfig === void 0) && accountObservations.every((current) => current());
	const prepareSelectedAccountCatalog = async (assertCurrent, options) => {
		const accountCatalog = params.accountCatalog;
		if (!accountCatalog) return;
		const authority = {
			assertCurrent,
			withCurrent: options.withCurrent
		};
		const selections = new Map([...preferredProfilesByProvider].map(([provider, profile]) => [profile, provider]));
		if (selectedProfileId && profileProvider) selections.set(selectedProfileId, normalizeProviderId(profileProvider));
		if (configuredProfileId && pinnedProfileForEntry(primaryEntry) === configuredProfileId) selections.set(configuredProfileId, normalizeProviderId(primary.provider));
		for (const [profileId, providerId] of selections) {
			const credential = await withCurrentReadAuthority(authority, () => authStore.profiles[profileId]);
			if (!credential) continue;
			const request = {
				profileId,
				credential,
				...options,
				allowDiscovery: options.refresh === true,
				load: async () => {
					assertCurrent();
					const provider = params.pluginRegistry?.providers.find(({ provider: candidate }) => normalizeProviderId(candidate.id) === providerId)?.provider;
					if (!provider?.catalog) return [];
					const { loadSelectedProviderAccountCatalog } = await import("./models-config.providers.catalog-context-36TZ0RFs.mjs");
					assertCurrent();
					const selectedRequest = {
						provider,
						providerId,
						profileId,
						authStore,
						config: params.cfg,
						agentDir: params.agentDir ?? resolveAgentDir(params.cfg, params.agentId),
						workspaceDir,
						isCurrent,
						assertCurrent,
						withCurrent: options.withCurrent,
						beforeRequest: options.beforeRequest
					};
					return withCurrentReadAuthority(authority, () => loadSelectedProviderAccountCatalog(selectedRequest));
				}
			};
			const acquired = await withCurrentReadAuthority(authority, () => accountCatalog.acquire(request));
			await withCurrentReadAuthority(authority, () => {
				accountObservations.push(acquired.isCurrent);
				providerOutcomes.splice(0, providerOutcomes.length, ...providerOutcomes.filter((outcome) => normalizeProviderId(outcome.provider) !== providerId || outcome.profileId !== profileId), ...acquired.outcomes);
			});
		}
	};
	let projectedCatalog;
	return {
		preparedPersonalCatalog: personalCatalog,
		projectCatalog: (authority) => withCurrentReadAuthority(authority, () => {
			if (projectedCatalog) return projectedCatalog;
			const view = createModelCatalogSnapshotView(params.cfg, snapshot);
			const projection = view.logicalEntries.map((entry) => {
				const routeVariants = view.variantsOf(entry) ?? [entry];
				const host = evaluateEntry(entry, routeVariants);
				const evaluation = evaluateNative(entry, host);
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
			});
			if (!authority) projectedCatalog = projection;
			return projection;
		}),
		accountCatalog: params.accountCatalog,
		prepareSelectedAccountCatalog,
		evaluateEntry,
		evaluateNative,
		snapshot,
		metadataSnapshot,
		authStore,
		authModes: params.preparedRuntimeAuthModes,
		runtimeChoices(entry, variants = [entry]) {
			const initial = evaluateEntry(entry, variants);
			const selected = resolveCatalogDecisionRuntime({
				cfg: params.cfg,
				agentId: params.agentId,
				entry,
				evaluation: initial,
				pluginRegistry: params.pluginRegistry
			});
			const candidates = /* @__PURE__ */ new Set([
				selected?.id ?? "openclaw",
				"openclaw",
				...variants.flatMap((variant) => variant.nativeRuntime ? [variant.nativeRuntime] : []),
				...initial.routeResolution?.kind === "routes" ? initial.routeResolution.routes.flatMap((route) => route.runtimePolicy?.compatibleIds ?? []) : [],
				...cliRuntimeBindings.filter((binding) => normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider)).map((binding) => binding.runtime)
			]);
			const choices = [];
			let unknown = false;
			for (const runtimeId of candidates) {
				const host = evaluateEntry(entry, variants, runtimeId);
				const evaluation = evaluateNative(entry, host, runtimeId);
				if (evaluation.availability === void 0) unknown = true;
				if (evaluation.availability !== true) continue;
				const route = evaluation.selectedRoute;
				const policy = resolveAgentHarnessPolicy({
					config: params.cfg,
					agentId: params.agentId,
					provider: entry.provider,
					modelId: entry.id,
					modelApi: route?.api ?? entry.api,
					modelBaseUrl: route?.baseUrl ?? entry.baseUrl,
					requestTransportOverrides: route?.requestTransportOverrides
				});
				if (policy.forcedByEnvironment && policy.runtime !== runtimeId) continue;
				const compatible = evaluation.selectedRoute?.runtimePolicy?.compatibleIds;
				if (compatible && !compatible.includes(runtimeId)) continue;
				if (evaluation.runtimeAuth && evaluation.runtimeAuth.id !== runtimeId) continue;
				if (runtimeId !== "openclaw" && !cliRuntimeBindings.some((binding) => binding.runtime === runtimeId && normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider))) {
					const harness = params.pluginRegistry?.agentHarnesses.find((registration) => registration.harness.id === runtimeId)?.harness;
					if (!harness) {
						unknown ||= params.pluginRegistry === void 0;
						continue;
					}
					if (!harness.supports(buildAgentHarnessSupportContext({
						config: params.cfg,
						agentId: params.agentId,
						provider: entry.provider,
						modelId: entry.id,
						requestedRuntime: runtimeId,
						contextManagement: harness.contextManagement,
						modelProvider: {
							api: route?.api ?? entry.api,
							baseUrl: route?.baseUrl ?? entry.baseUrl,
							runtimePolicy: route?.runtimePolicy,
							requestTransportOverrides: route?.requestTransportOverrides,
							preparedAuth: evaluation.selectedCredential
						}
					})).supported) continue;
				}
				choices.push(runtimeId);
			}
			if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Model catalog changed while selecting runtimes");
			return choices.length === 0 && unknown ? void 0 : choices;
		},
		authMaterializations: params.preparedRuntimeAuthMaterializations,
		cliRuntimeBindings,
		pluginRegistry: params.pluginRegistry,
		isCurrent,
		observationConfig: params.observationConfig
	};
}
//#endregion
export { prepareModelCatalogDecisions as n, resolveCatalogDecisionRuntime as r, createModelCatalogDecisions as t };
