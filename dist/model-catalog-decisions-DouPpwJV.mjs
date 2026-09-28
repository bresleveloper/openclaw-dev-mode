import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { o as dedupeModelCatalogEntries } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as resolveModelCatalogIdentityKey, l as openAIModelCatalogRoutePolicy } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { x as materializePersonalAuthProfile } from "./store-CTvq6MSF.mjs";
import { a as listUserProfileAuthLinks } from "./user-model-accounts-C87WCnZM.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { a as resolveExternalCliAuthScopeFromConfig } from "./external-cli-discovery-BbOBKQM3.mjs";
import { n as loadManifestModelCatalog } from "./model-catalog-Dt2JkTIv.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { i as buildAgentHarnessSupportContext, l as resolveAutoAgentHarnessId, t as resolveAgentHarnessAvailabilityDecision } from "./availability-q42mVdu4.mjs";
import { n as listCliRuntimeModelBackendBindings } from "./cli-backends-CNff5-1q.mjs";
import "./workspace-mlzi3k1x.mjs";
import { i as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-C4SB6kN4.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { r as prepareModelCatalogView } from "./model-catalog-view-DWAQHc1p.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-DgxB_kPc.mjs";
//#region src/agents/model-catalog-decisions.ts
function listEnabledSyntheticAuthProviderRefs(metadataSnapshot, config) {
	let normalizedConfig;
	return metadataSnapshot.plugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
		snapshot: metadataSnapshot,
		plugin,
		config,
		normalizedConfig: config.plugins && (normalizedConfig ??= normalizePluginsConfig(config.plugins))
	})).flatMap((plugin) => plugin.syntheticAuthRefs ?? []);
}
function createModelsListAuthResolver(params) {
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	return createModelAuthAvailabilityResolver({
		cfg: params.cfg,
		agentId: params.agentId,
		authStore: params.preparedAuthStore,
		agentDir,
		preparedCliRuntimeAuthDirectories: {
			agentDir,
			inheritedAuthDir: resolveLegacyInheritedAuthDir(params.cfg)
		},
		workspaceDir: params.workspaceDir,
		env: process.env,
		metadataSnapshot: params.metadataSnapshot,
		preparedRuntimeAuthModes: params.preparedRuntimeAuthModes,
		preparedRuntimeAuthMaterializations: params.preparedRuntimeAuthMaterializations,
		preparedSyntheticAuthComplete: params.preparedSyntheticAuthComplete,
		skipSetupProviderFallback: true,
		syntheticAuthProviderRefs: listEnabledSyntheticAuthProviderRefs(params.metadataSnapshot, params.cfg),
		externalCliProviderIds: resolveExternalCliAuthScopeFromConfig(params.cfg)?.providerIds ?? [],
		preparedRuntimeAuthStore: params.preparedAuthStore,
		routeResolverFactory: params.routeResolverFactory
	});
}
function createModelsListEntryEvaluator(params) {
	const pending = /* @__PURE__ */ new Map();
	return (entry, routeVariants, runtimeId) => {
		const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
		const observedRoutes = (routeVariants ?? [entry]).map(({ api, baseUrl }) => ({
			api,
			baseUrl
		}));
		const cacheKey = JSON.stringify([
			resolveModelCatalogIdentityKey(entry),
			runtimeId,
			entry.api,
			entry.baseUrl,
			observedRoutes
		]);
		const cached = pending.get(cacheKey);
		if (cached) return cached;
		const next = Promise.resolve().then(() => {
			const defaultProfileId = params.preferredProfilesByProvider?.get(normalizeProviderId(entry.provider));
			const sameProvider = !params.profileProvider || params.normalizeAuthProvider(params.profileProvider) === params.normalizeAuthProvider(entry.provider);
			const preferredProfileId = (sameProvider ? params.preferredProfileId : void 0) ?? defaultProfileId;
			const pinnedProfileId = (sameProvider ? params.pinnedProfileId : void 0) ?? defaultProfileId;
			const requestedRuntimeId = runtimeId ?? (sameProvider && params.profileProvider ? params.runtimeOverride : void 0);
			const resolved = {
				...params.authResolver.evaluateRuntimeModelAuth(entry.provider, {
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
			return params.providerOutcomes?.some((outcome) => outcome.status === "auth-rejected" && outcome.rejectionScope !== "catalog" && normalizeProviderId(outcome.provider) === provider && (outcome.profileId === void 0 || outcome.profileId === resolved.selectedProfileId)) ? {
				...resolved,
				availability: false,
				unavailableReason: "auth-failed",
				unavailableUntil: void 0
			} : resolved;
		});
		pending.set(cacheKey, next);
		return next;
	};
}
/** Builds requester/session auth views without changing shared catalog or credential snapshots. */
function createModelCatalogDecisions(params) {
	const metadataSnapshot = params.metadataSnapshot;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, params.agentId) ?? resolveDefaultAgentWorkspaceDir();
	let authStore = params.preparedAuthStore;
	const preferredProfilesByProvider = /* @__PURE__ */ new Map();
	const personalProviders = /* @__PURE__ */ new Set();
	if (params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId)) {
		authStore = materializePersonalAuthProfile(authStore, params.preferredProfileId);
		const provider = authStore.profiles[params.preferredProfileId]?.provider;
		if (provider) personalProviders.add(normalizeProviderId(provider));
	} else if (!params.preferredProfileId && params.requesterProfileId) for (const link of listUserProfileAuthLinks(params.requesterProfileId)) {
		const selected = isUserModelAuthProfileId(link.authProfileId) ? materializePersonalAuthProfile(authStore, link.authProfileId) : authStore;
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
	const nativeEvaluator = prepareModelCatalogView({
		...params,
		snapshot,
		workspaceDir,
		profileProvider
	}).evaluateNative;
	const evaluateNative = (entry, host, runtimeId) => preferredProfilesByProvider.has(normalizeProviderId(entry.provider)) ? host : nativeEvaluator(entry, host, runtimeId);
	const preparedAt = Date.now();
	const authValidUntil = Math.min(...[...Object.values(authStore.profiles).map((profile) => profile.type === "token" ? profile.expires : void 0), ...Object.values(authStore.usageStats ?? {}).flatMap((stats) => [
		stats.blockedUntil,
		stats.cooldownUntil,
		stats.disabledUntil
	])].filter((deadline) => deadline !== void 0 && deadline > preparedAt));
	const evaluateStoredEntry = createModelsListEntryEvaluator({
		authResolver: createModelsListAuthResolver({
			cfg: params.cfg,
			agentId: params.agentId,
			metadataSnapshot,
			preparedAuthStore: authStore,
			preparedRuntimeAuthModes: params.preparedRuntimeAuthModes,
			preparedRuntimeAuthMaterializations: params.preparedRuntimeAuthMaterializations,
			preparedSyntheticAuthComplete: params.preparedSyntheticAuthComplete ?? isPreparedModelCatalogFull(params.snapshot),
			workspaceDir,
			routeResolverFactory: params.routeResolverFactory
		}),
		providerOutcomes: params.snapshot.providerOutcomes,
		preferredProfilesByProvider,
		runtimeOverride: params.runtimeOverride,
		normalizeAuthProvider: (provider) => resolveProviderIdForAuth(provider, {
			config: params.cfg,
			metadataSnapshot
		}),
		...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
		...params.pinnedProfileId ? { pinnedProfileId: params.pinnedProfileId } : {},
		profileProvider
	});
	const evaluateEntry = Boolean(params.preferredProfileId && isUserModelAuthProfileId(params.preferredProfileId) && !authStore.profiles[params.preferredProfileId]) ? async (entry, variants, runtimeId) => profileProvider && normalizeProviderId(profileProvider) !== normalizeProviderId(entry.provider) ? evaluateStoredEntry(entry, variants, runtimeId) : {
		availability: false,
		unavailableReason: "missing-auth",
		routeResolution: null
	} : evaluateStoredEntry;
	const isCurrent = () => Date.now() < authValidUntil && (params.isCurrent?.() ?? params.observationConfig === void 0);
	return {
		evaluateEntry,
		evaluateNative,
		snapshot,
		metadataSnapshot,
		authStore,
		authModes: params.preparedRuntimeAuthModes,
		async runtimeChoices(entry, variants = [entry]) {
			const initial = await evaluateEntry(entry, variants);
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
				...listCliRuntimeModelBackendBindings().filter((binding) => normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider)).map((binding) => binding.runtime)
			]);
			const choices = [];
			let unknown = false;
			for (const runtimeId of candidates) {
				const host = await evaluateEntry(entry, variants, runtimeId);
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
				if (runtimeId !== "openclaw" && !listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === runtimeId && normalizeProviderId(binding.provider) === normalizeProviderId(entry.provider))) {
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
						modelProvider: {
							api: route?.api ?? entry.api,
							baseUrl: route?.baseUrl ?? entry.baseUrl,
							runtimePolicy: route?.runtimePolicy,
							requestTransportOverrides: route?.requestTransportOverrides,
							preparedAuth: evaluation.runtimeAuth ? { source: "harness" } : {
								source: evaluation.selectedProfileId ? "profile" : "direct",
								mode: evaluation.selectedAuthMode,
								requirement: route?.authRequirement
							}
						}
					})).supported) continue;
				}
				choices.push(runtimeId);
			}
			if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Model catalog changed while selecting runtimes");
			return choices.length === 0 && unknown ? void 0 : choices;
		},
		authMaterializations: params.preparedRuntimeAuthMaterializations,
		pluginRegistry: params.pluginRegistry,
		isCurrent,
		observationConfig: params.observationConfig
	};
}
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
			preparedAuth: {
				source: params.evaluation.runtimeAuth ? "harness" : params.evaluation.selectedProfileId ? "profile" : "direct",
				mode: params.evaluation.selectedAuthMode,
				requirement: route?.authRequirement
			}
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
export { resolveCatalogDecisionRuntime as n, createModelCatalogDecisions as t };
