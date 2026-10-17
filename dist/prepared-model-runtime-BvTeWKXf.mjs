import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { D as withAgentRosterFactsBatch, k as normalizeAgentDirRegistryPath } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-DPS9EUx6.mjs";
import { o as settlePluginNativeAdmissions } from "./plugin-native-admission-state-D3dxXEX2.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { t as currentPluginWorkHoldsPendingReplacement } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { d as hashRuntimeConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-CVmOODN3.mjs";
import { c as publishRemoteModelCatalogSnapshot, d as withRemoteModelCatalogSnapshot, l as readRemoteModelCatalogUpdate, n as captureRemoteModelCatalogStartupSnapshot, u as runOutsideRemoteModelCatalogSnapshot } from "./remote-overlay-C3A-3o4_.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { x as isReservedSystemAgentId } from "./agent-database-admission-dWNS6Rcs.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { o as mergeAuthProfileStores, v as removeRuntimeExternalProfileReferences } from "./persisted-BVyWmvfF.mjs";
import { x as withPreparedAuthStorePathForDisplay } from "./profiles-Dk53jI-3.mjs";
import { A as getPreparedRuntimeAuthMaterializations, M as registerRuntimeAuthMaterializationMutationListener, a as createPreparedRuntimeAuthProfileUsageReader, x as registerRuntimeAuthProfileStoreMutationListener } from "./runtime-snapshots-CSLjByUx.mjs";
import { h as runtimeAuthMetadataState } from "./runtime-snapshot-owner-Dm2mqUH2.mjs";
import { i as collectRegistryInvocationInstances } from "./registry-inspection-resources-sGFtXeo5.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-BeDiKDjp.mjs";
import { _ as resolveProviderConfigSecretInput } from "./model-auth-provider-config-s9IgFbYq.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { c as hasSamePreparedModelCatalogAuth, i as getPreparedModelFullCatalogAuth, n as copyPreparedModelFullCatalogAuth, r as copyPreparedModelRuntimeAuthBindings, t as bindPreparedModelRuntimeAuth, u as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import { r as resolvePublishedModelCatalogOwner, t as preparePublishedModelCatalogOwnerIdentity } from "./prepared-model-catalog-owner-lSB2_Cf6.mjs";
import { n as getPreparedModelRuntimePluginGeneration, r as runOutsidePreparedModelRuntimePluginGenerationScope, t as getPreparedModelRuntimeBorrowedSnapshot } from "./prepared-model-runtime-generation-scope-B18pp3-E.mjs";
import { p as prepareModelCatalogThinkingPolicies } from "./thinking-NbdrO8vA.mjs";
import { R as resolveUsableAgentCredentialModes, a as preparedPluginGenerationSupportsSelections, d as releasePreparedPluginPublication, f as retainPreparedPluginGeneration, h as closeEphemeralPreparedModelRuntimeResources, i as preparedPluginGenerationReusesBase, l as publishPreparedPluginGeneration, m as PreparedModelRuntimeBuildResources, o as configuredPreparedPluginGenerations, p as retainPreparedPluginRegistry, s as discardPreparedPluginGeneration, u as registerPreparedPluginLifetime } from "./prepared-model-runtime.plugin-generation-i7pfklM1.mjs";
import { i as AuthStorage } from "./model-registry-DKSOyLSb.mjs";
import { i as listConfiguredOwnerInputs } from "./prepared-model-runtime.configured-Bnr_MHor.mjs";
import { n as augmentPreparedModelCatalogWithAgentHarness, r as isPreparedNativeModelCatalogReady } from "./model-catalog-tPwG-g7t.mjs";
import { s as resolveSelectedAgentHarnessRuntime } from "./runtime-plugin-load-plan-BskuqEHm.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-ByP944Cg.mjs";
import { a as assertPreparedModelRuntimeInputCurrent, i as assertPreparedModelRuntimeCandidatesCurrent, o as isPreparedModelRuntimeMissingOwnerError, r as PreparedModelRuntimePublicationSupersededError, s as isPreparedModelRuntimePluginLifecycleFailure, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { a as createPreparedModelRuntimeReplacement, c as retirePreparedModelRuntimeGeneration, i as createPreparedModelRuntimePluginDrain, n as capturePreparedModelRuntimeLifetime, o as registerPreparedModelRuntimeClose, r as closePreparedModelRuntimeSnapshots, t as capturePreparedModelRuntimeGeneration } from "./prepared-model-runtime.lifecycle-ADHVLWEn.mjs";
import { a as markPreparedModelCatalogFull, c as mergePreparedNativeCatalog, d as selectPreparedModelCatalogInventory, i as isPreparedModelCatalogFull, l as prepareFullCatalogFacts, n as filterNativeModelCatalogScopes, o as materializePreparedModelCatalog, r as filterPreparedProviderCatalog, s as mergePreparedModelCatalogInventory, t as createPreparedModelRuntimeSnapshot, u as prepareModelCatalogPublication } from "./prepared-model-runtime.full-catalog-DdS97WBs.mjs";
import { t as runAbortableTimeout } from "./with-timeout-CdvCydMF.mjs";
import { n as createPreparedModelCatalogWorker } from "./prepared-model-catalog-worker-B-zIZ-R7.mjs";
import { a as prepareWorkspaceBuildGroup, c as preparedSyntheticAuthProviderScope, f as preparedModelRuntimeWorkspaceFactsKey, i as prepareConfiguredRuntimeFactsBatch, m as prepareConfiguredRuntimeFacts, n as fingerprintPreparedRuntimeFacts, o as preparedModelInventoryKey, r as prepareConfiguredModelFacts, u as createPreparedInboundRegistryLoader } from "./prepared-model-runtime.facts-Uvb82TTa.mjs";
import { n as prepareModelCatalogAuthLabels } from "./model-catalog-auth-labels-DHCJ-sP2.mjs";
import { a as resetPreparedModelRuntimePublicationListenersForTest, n as notifyPreparedModelCatalogPublication, r as notifyPreparedModelRuntimePublication, t as createCatalogAttemptReporter } from "./prepared-model-runtime.publication-events-BgGkJc_Y.mjs";
import { t as prepareAgentCatalogSource } from "./prepared-model-runtime.scoped-catalog-D-6JXaJ3.mjs";
import { n as prepareModelPricingContext } from "./pricing-Bwenqzdn.mjs";
import { n as setPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
import pLimit from "p-limit";
//#region src/agents/prepared-model-runtime.capture.ts
const catalogCaptures = /* @__PURE__ */ new WeakMap();
const admittedCatalogs = /* @__PURE__ */ new WeakMap();
/** Passive inventory captured at admission; the caller must hold the matching turn lease. */
function readCapturedPreparedModelRuntimeCatalog(snapshot) {
	return admittedCatalogs.get(snapshot);
}
/** Captures published executable and native model facts without changing any open lease. */
function capturePreparedModelRuntimeCatalog(snapshot, source) {
	const models = source?.readPublishedModels?.();
	const catalog = source?.readFullModelCatalog?.();
	let cached = catalogCaptures.get(snapshot);
	if (!cached || cached.models !== models || cached.catalog !== catalog) {
		const nativeCatalog = catalog && (catalog.entries.some((entry) => entry.nativeRuntime) || catalog.routeVariants.some((entry) => entry.nativeRuntime));
		const hasCatalogFacts = catalog && (catalog.entries.length > 0 || catalog.routeVariants.length > 0 || snapshot.modelCatalog.entries.length > 0 || snapshot.modelCatalog.routeVariants.length > 0);
		cached = {
			models,
			catalog,
			admittedCatalog: nativeCatalog ? mergePreparedNativeCatalog(catalog, {
				...catalog,
				entries: [...catalog.entries, ...snapshot.modelCatalog.entries],
				routeVariants: [...catalog.routeVariants, ...snapshot.modelCatalog.routeVariants]
			}) : catalog ?? snapshot.modelCatalog,
			capturedSnapshot: hasCatalogFacts ? Object.freeze({
				...snapshot,
				...nativeCatalog ? { modelCatalog: mergePreparedNativeCatalog(catalog, snapshot.modelCatalog) } : {}
			}) : snapshot,
			memo: cached && cached.models === models ? cached.memo : /* @__PURE__ */ new Map()
		};
		catalogCaptures.set(snapshot, cached);
	}
	const capturedNative = cached.capturedSnapshot;
	admittedCatalogs.set(capturedNative, cached.admittedCatalog);
	if (!models?.size) {
		if (capturedNative !== snapshot) copyPreparedModelRuntimeAuthBindings(snapshot, capturedNative);
		return capturedNative;
	}
	const stores = snapshot.createStores();
	const credentials = stores.authStorage.getAll();
	const registry = stores.modelRegistry.fork(stores.authStorage, models);
	const captured = Object.freeze({
		...capturedNative,
		readPublishedModels: () => models,
		routeModelResolutionMemo: cached.memo,
		createStores: () => {
			const authStorage = AuthStorage.inMemory(credentials);
			return {
				authStorage,
				modelRegistry: registry.fork(authStorage)
			};
		}
	});
	copyPreparedModelRuntimeAuthBindings(snapshot, captured);
	admittedCatalogs.set(captured, cached.admittedCatalog);
	return captured;
}
//#endregion
//#region src/agents/prepared-model-runtime-admission.ts
function turnLeaseHoldsPendingReplacement(generation) {
	if (!generation || !getPreparedModelRuntimeBorrowedSnapshot(generation)) return false;
	return [generation.pluginRegistry, generation.inboundPluginRegistry].some((registry) => registry !== void 0 && [...collectRegistryInvocationInstances(registry)].some((instance) => instance.replacementPending));
}
/** Refuses replacement waits only from work the pending reload drain is itself joining. */
function assertPreparedModelRuntimeAdmissionCanWait(owner) {
	if (owner && (!owner.snapshot && !owner.refreshError || !owner.needsRefresh)) return;
	if (currentPluginWorkHoldsPendingReplacement() || turnLeaseHoldsPendingReplacement(getPreparedModelRuntimePluginGeneration())) throw new PreparedModelRuntimeOwnerNotPublishedError("Model runtime replacement is in progress; admitted plugin work cannot wait for the reload. Retry after the plugin reload completes.", { admissionBlocked: true });
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-auth.ts
function readDirectBinding(config, provider) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(config, provider);
	return {
		apiKey: ref ?? providerConfig?.apiKey,
		auth: providerConfig?.auth
	};
}
function matchesServiceTierRoute(observation, route) {
	return observation.modelId === route.modelId && observation.runtimeId === route.runtimeId && observation.api === route.api && observation.baseUrl === route.baseUrl;
}
/** The existing catalog generation owns selected-account initialization and explicit refresh. */
function createPreparedAccountCatalogAccess(isCurrent, retirementSignal, config = {}) {
	const ownerIsCurrent = () => !retirementSignal?.aborted && isCurrent();
	const accounts = /* @__PURE__ */ new Map();
	const readAccount = (identityKey, credential) => {
		const account = accounts.get(identityKey);
		if (account && !isDeepStrictEqual(account.credential, credential)) {
			accounts.delete(identityKey);
			return;
		}
		return account;
	};
	const createAccount = (identityKey, credential) => {
		const account = structuredClone(credential);
		accounts.set(identityKey, account);
		pruneMapToMaxSize(accounts, 64);
		return account;
	};
	retirementSignal?.addEventListener("abort", () => accounts.clear(), { once: true });
	return {
		reconcileAuth(authStore, includesProvider, profileIds) {
			if (!ownerIsCurrent()) return;
			for (const [identityKey, account] of accounts) {
				if (account.source === "direct") {
					if (includesProvider(account.provider)) readAccount(identityKey, readDirectBinding(config, account.provider));
					continue;
				}
				const profileId = identityKey.slice(8);
				const credential = authStore.profiles[profileId];
				if (!credential && isUserModelAuthProfileId(profileId)) continue;
				if ((includesProvider(account.credential.provider) || profileIds?.includes(profileId)) && !isDeepStrictEqual(account.credential, credential)) accounts.delete(identityKey);
			}
		},
		readServiceTiers(params) {
			if (!ownerIsCurrent()) return;
			const route = {
				...params,
				baseUrl: normalizeCatalogRouteBaseUrl(params.baseUrl) ?? params.baseUrl
			};
			let account = accounts.get(params.identityKey);
			if (account?.source === "direct") account = readAccount(params.identityKey, readDirectBinding(config, account.provider));
			const observation = account?.modelServiceTiers?.find((candidate) => matchesServiceTierRoute(candidate, route));
			return observation && [...observation.serviceTiers];
		},
		prepareServiceTierObserver(params) {
			const selected = params.selectedCredential;
			if (!ownerIsCurrent() || selected.source === "harness") return () => false;
			let captured;
			if (selected.source === "profile") {
				if (!params.credential) return () => false;
				captured = readAccount(selected.identityKey, params.credential) ?? createAccount(selected.identityKey, {
					source: "profile",
					credential: params.credential
				});
			} else {
				const credential = readDirectBinding(config, selected.provider);
				captured = readAccount(selected.identityKey, credential) ?? createAccount(selected.identityKey, {
					source: "direct",
					provider: selected.provider,
					credential
				});
			}
			return (observation) => {
				if (!ownerIsCurrent() || accounts.get(selected.identityKey) !== captured || captured.source === "direct" && readAccount(selected.identityKey, readDirectBinding(config, captured.provider)) !== captured) return false;
				const route = {
					...observation,
					baseUrl: normalizeCatalogRouteBaseUrl(observation.baseUrl) ?? observation.baseUrl
				};
				const previous = captured.modelServiceTiers?.find((candidate) => matchesServiceTierRoute(candidate, route));
				if (isDeepStrictEqual(previous?.serviceTiers, observation.serviceTiers)) return false;
				captured.modelServiceTiers = [...(captured.modelServiceTiers ?? []).filter((candidate) => !matchesServiceTierRoute(candidate, route)).slice(-127), {
					...route,
					serviceTiers: [...observation.serviceTiers]
				}];
				return true;
			};
		},
		async acquire(params) {
			if (!ownerIsCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
			if (params.allowDiscovery && params.refresh) accounts.delete(`profile:${params.profileId}`);
			const identityKey = `profile:${params.profileId}`;
			let observation = readAccount(identityKey, params.credential);
			if (!observation) {
				if (!params.allowDiscovery) return {
					outcomes: [],
					isCurrent: ownerIsCurrent
				};
				observation = createAccount(identityKey, {
					source: "profile",
					credential: params.credential
				});
			}
			if (params.allowDiscovery && !observation.result) observation.result = Promise.resolve().then(params.load);
			const result = observation.result;
			if (!result || !params.allowDiscovery && !observation.outcomes) return {
				outcomes: [],
				isCurrent: ownerIsCurrent
			};
			const captured = observation;
			const current = () => ownerIsCurrent() && accounts.get(`profile:${params.profileId}`) === captured;
			let outcomes;
			try {
				outcomes = captured.outcomes ?? await result;
			} catch (error) {
				if (current()) {
					if (captured.modelServiceTiers?.length) captured.result = void 0;
					else accounts.delete(`profile:${params.profileId}`);
				}
				throw error;
			}
			if (!current()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
			captured.outcomes = outcomes;
			return {
				outcomes,
				isCurrent: current
			};
		}
	};
}
function replacePreparedModelCatalogAuth(previous, next, includesProvider) {
	const keep = ([provider]) => !includesProvider(provider);
	const take = ([provider]) => includesProvider(provider);
	const replace = (before, after) => Object.fromEntries([...Object.entries(before ?? {}).filter(keep), ...Object.entries(after ?? {}).filter(take)]);
	const selectStore = (store, selected) => {
		const scoped = removeRuntimeExternalProfileReferences({
			store,
			profileIds: new Set(Object.entries(store.profiles).filter(([, profile]) => includesProvider(profile.provider) !== selected).map(([id]) => id))
		});
		return {
			...scoped,
			order: scoped.order && Object.fromEntries(Object.entries(scoped.order).filter(selected ? take : keep)),
			lastGood: scoped.lastGood && Object.fromEntries(Object.entries(scoped.lastGood).filter(selected ? take : keep)),
			runtimeLocalOrderProviderIds: store.runtimeLocalOrderProviderIds?.filter((provider) => includesProvider(provider) === selected)
		};
	};
	const retained = selectStore(previous.authStore, false);
	const refreshed = selectStore(next.authStore, true);
	for (const key of ["runtimeLocalProfileIds", "runtimeLocalOrderProviderIds"]) if (retained[key] || refreshed[key]) refreshed[key] = [.../* @__PURE__ */ new Set([...retained[key] ?? [], ...refreshed[key] ?? []])];
	return {
		authStore: mergeAuthProfileStores(retained, refreshed, { preserveBaseRuntimeExternalProfiles: true }),
		credentials: replace(previous.credentials, next.credentials),
		authModes: replace(previous.authModes, next.authModes),
		providerAuthLabels: next.providerAuthLabels ? new Map([...previous.providerAuthLabels].filter(keep).concat([...next.providerAuthLabels].filter(take))) : previous.providerAuthLabels
	};
}
async function prepareInitialModelCatalogAuth({ agentFacts, catalogFacts, pluginGeneration }, eligibleProviders, assertCurrent) {
	assertCurrent();
	const providers = [
		...eligibleProviders,
		...catalogFacts.modelCatalog.entries.map((entry) => entry.provider),
		...Object.values(agentFacts.authStore.profiles).map((profile) => profile.provider)
	];
	const providerAuthLabels = providers.length === 0 ? /* @__PURE__ */ new Map() : await withPreparedAuthStorePathForDisplay(agentFacts.input.agentDir, agentFacts.env, assertCurrent, (authStorePath) => withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => prepareModelCatalogAuthLabels({
		...agentFacts.input,
		env: agentFacts.env,
		authStorePath,
		store: agentFacts.authStore,
		providers
	})));
	assertCurrent();
	return {
		authStore: agentFacts.authStore,
		credentials: agentFacts.credentials,
		authModes: resolveUsableAgentCredentialModes(agentFacts.credentials),
		providerAuthLabels
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-projection.ts
/** Composes retained discovery with current configured metadata and runtime capabilities. */
function createPreparedModelCatalogProjection(params) {
	return (inventory, configuredRuntimeModels = params.catalogFacts.configuredRuntimeModels) => {
		const { catalog, discoveryOrigins = [] } = inventory;
		const configured = prepareConfiguredRuntimeFacts({
			agentFacts: params.agentFacts,
			workspaceFacts: params.pluginGeneration,
			templateModelRegistry: params.catalogFacts.templateModelRegistry,
			configuredRuntimeModels
		}).modelCatalog;
		const current = materializePreparedModelCatalog(configured, params.agentFacts.runtimeCapabilityModels);
		const projected = materializePreparedModelCatalog(catalog, params.agentFacts.runtimeCapabilityModels, current.staticEntries, new Set(discoveryOrigins.map(({ provider }) => params.normalizeProvider(provider))));
		projected.acceptedDiscoveryOrigins = discoveryOrigins;
		const apiProviders = new Set(projected.providerOutcomes?.map(({ provider }) => params.normalizeProvider(provider)));
		const nativeOutcomes = Object.values(catalog.nativeProviderOutcomes ?? {}).flat().filter(({ provider }) => !apiProviders.has(params.normalizeProvider(provider)));
		if (nativeOutcomes.length) projected.providerOutcomes = [...projected.providerOutcomes ?? [], ...nativeOutcomes];
		const keyOf = createModelCatalogIdentityKeyResolver();
		projected.entries = dedupeByKey([...projected.entries, ...current.entries], keyOf);
		projected.routeVariants = dedupeByKey([...projected.routeVariants, ...current.routeVariants], (entry) => JSON.stringify([
			keyOf(entry),
			entry.api,
			entry.baseUrl,
			entry.nativeRuntime
		]));
		prepareModelCatalogThinkingPolicies({
			catalog: projected,
			metadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
			pluginRegistry: params.pluginGeneration.pluginRegistry
		});
		return projected;
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-publication.ts
function catalogPublicationContent(catalog) {
	const { pendingProviders: _pending, refreshFailed: _failed, ...inventory } = catalog;
	const byProvider = (rows = []) => rows.toSorted((left, right) => left.provider.localeCompare(right.provider));
	const byRuntime = (scopes) => scopes && Object.fromEntries(Object.entries(scopes).map(([runtime, rows]) => [runtime, byProvider(rows)]));
	const auth = getPreparedModelFullCatalogAuth(catalog);
	return {
		...inventory,
		entries: byProvider(catalog.entries),
		routeVariants: byProvider(catalog.routeVariants),
		staticEntries: byProvider(catalog.staticEntries),
		providerOutcomes: byProvider(catalog.providerOutcomes),
		acceptedDiscoveryOrigins: catalog.acceptedDiscoveryOrigins?.toSorted((left, right) => left.provider.localeCompare(right.provider) || (left.profileId ?? "").localeCompare(right.profileId ?? "")),
		nativeProviderOutcomes: byRuntime(catalog.nativeProviderOutcomes),
		nativeHostRows: byRuntime(catalog.nativeHostRows),
		authoritative: catalog.authoritative !== false,
		full: isPreparedModelCatalogFull(catalog),
		auth: auth && {
			modes: auth.authModes,
			labels: auth.providerAuthLabels,
			metadata: runtimeAuthMetadataState(auth.authStore)
		}
	};
}
/** Keep inventory identity stable across renewals while adopting the latest private auth. */
function retainPreparedModelCatalogPublication(catalog, previous) {
	if (!catalog || !previous || !isDeepStrictEqual(catalogPublicationContent(catalog), catalogPublicationContent(previous))) return catalog;
	copyPreparedModelFullCatalogAuth(catalog, previous);
	return previous;
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-source.ts
function preparedProviderCatalogSource(facts, generation, provider, normalize) {
	const { config } = facts.input;
	const pluginIds = generation.pluginMetadataSnapshot.owners.providers.get(provider) ?? [];
	const providerEntries = (entries) => Object.fromEntries(Object.entries(entries ?? {}).filter(([id]) => normalize(id) === provider));
	return fingerprintPreparedRuntimeFacts({
		remoteCatalogSource: generation.remoteCatalog?.sourceUrl,
		remoteCatalogRevision: generation.remoteCatalog?.revision,
		models: {
			...config.models,
			providers: providerEntries(config.models?.providers)
		},
		auth: {
			profiles: Object.fromEntries(Object.entries(config.auth?.profiles ?? {}).filter(([, profile]) => normalize(profile.provider) === provider)),
			order: providerEntries(config.auth?.order)
		},
		plugins: {
			...config.plugins,
			allow: config.plugins?.allow?.filter((id) => pluginIds.includes(id)),
			deny: config.plugins?.deny?.filter((id) => pluginIds.includes(id)),
			entries: Object.fromEntries(pluginIds.map((id) => [id, config.plugins?.entries?.[id]]))
		},
		env: {
			config: config.env,
			runtime: facts.env
		}
	});
}
function preparedProviderCatalogCredentials(source, provider, normalize) {
	const { authStore, credentials } = source;
	return fingerprintPreparedRuntimeFacts({
		profiles: Object.fromEntries(Object.entries(authStore.profiles).filter(([, profile]) => normalize(profile.provider) === provider)),
		credentials: Object.fromEntries(Object.entries(credentials ?? {}).filter(([id]) => normalize(id) === provider)),
		order: Object.fromEntries(Object.entries(authStore.order ?? {}).filter(([id]) => normalize(id) === provider))
	});
}
/** Reuse only catalog rows whose provider identity and credentials survived publication. */
function prepareRetainedProviderCatalog(params, normalizeProvider, eligibleProviders, pluginFingerprint, nativeSource) {
	const facts = params.agentFacts;
	const inventory = params.inventoryOwner.catalogInventory;
	const providerSource = (provider) => preparedProviderCatalogSource(params.agentFacts, params.pluginGeneration, provider, normalizeProvider);
	const providerSources = new Map(eligibleProviders.map((provider) => [provider, providerSource(provider)]));
	const previousAuth = inventory && getPreparedModelFullCatalogAuth(inventory.catalog);
	const retainedProviders = new Set(eligibleProviders.filter((provider) => inventory?.pluginFingerprint === pluginFingerprint && inventory.providers.get(provider)?.source === providerSources.get(provider) && hasSamePreparedModelCatalogAuth(previousAuth, facts, (id) => normalizeProvider(id) === provider)));
	const retainedInventory = inventory && retainedProviders.size ? {
		...selectPreparedModelCatalogInventory(inventory, (provider) => retainedProviders.has(normalizeProvider(provider))),
		nativeSource
	} : void 0;
	if (retainedInventory) {
		const identifiedNativeProviders = new Set(inventory?.nativeSource === nativeSource ? Object.entries(facts.credentials).flatMap(([provider, credential]) => credential.type === "api_key" && credential.nativeAuth ? [] : [normalizeProvider(provider)]) : []);
		const retain = (entry) => !entry.nativeRuntime || identifiedNativeProviders.has(normalizeProvider(entry.provider));
		retainedInventory.catalog.entries = retainedInventory.catalog.entries.filter(retain);
		retainedInventory.catalog.routeVariants = retainedInventory.catalog.routeVariants.filter(retain);
		const includesNativeProvider = (provider) => identifiedNativeProviders.has(normalizeProvider(provider));
		retainedInventory.catalog.nativeProviderOutcomes = filterNativeModelCatalogScopes(retainedInventory.catalog.nativeProviderOutcomes, includesNativeProvider);
		retainedInventory.catalog.nativeHostRows = void 0;
	}
	return {
		providerSource,
		providerSources,
		retainedInventory,
		previousAuth
	};
}
const limitFullModelCatalogBuild = pLimit(1);
const MODEL_CATALOG_FOREGROUND_WAIT_MS = 5e3;
async function createFullModelCatalogAccess(params, assertBuildCurrent) {
	assertBuildCurrent();
	const normalizeProvider = createPreparedModelCatalogProviderNormalizer(params.pluginGeneration.pluginMetadataSnapshot, params.agentFacts.input.config, params.agentFacts.env);
	const eligibleProviders = [...new Set([...params.agentFacts.providerIds, ...Object.keys(params.agentFacts.credentials)].map(normalizeProvider))].toSorted();
	const currentAuth = await prepareInitialModelCatalogAuth(params, eligibleProviders, assertBuildCurrent);
	assertBuildCurrent();
	const accountCatalog = createPreparedAccountCatalogAccess(params.isCurrent, params.retirementSignal, params.agentFacts.input.config);
	const readUsage = createPreparedRuntimeAuthProfileUsageReader(params.agentFacts.input.agentDir, params.agentFacts.input.inheritedAuthDir);
	const setCatalogAuth = (catalog, auth) => setPreparedModelFullCatalogAuth(catalog, auth, (store) => params.isCurrent() ? readUsage(store) : store);
	const projectInventory = createPreparedModelCatalogProjection({
		...params,
		normalizeProvider
	});
	const project = (...args) => attempt.withRefreshStatus(projectInventory(...args));
	const inventoryKey = preparedModelInventoryKey(params.agentFacts.input);
	const nativeSource = fingerprintPreparedRuntimeFacts({
		runtimePluginSelections: params.agentFacts.input.runtimePluginSelections,
		config: params.nativeConfigFingerprint,
		configuredModelRefs: params.agentFacts.configuredModelRefs
	});
	const pluginFingerprint = resolveInstalledManifestRegistryIndexFingerprint(params.pluginGeneration.pluginMetadataSnapshot.index);
	const attempt = createCatalogAttemptReporter(params.inventoryOwner, {
		key: inventoryKey,
		pluginFingerprint,
		credentials: params.agentFacts.credentials
	}, params.isCurrent, () => {
		if (published.inventory) {
			const providers = new Map(published.inventory.providers);
			for (const provider of pending?.providers ?? providers.keys()) {
				const facts = providers.get(provider);
				if (facts) {
					const { expiresAt: _expiresAt, ...retained } = facts;
					providers.set(provider, retained);
				}
			}
			published = {
				...published,
				inventory: {
					...published.inventory,
					providers
				}
			};
			params.inventoryOwner.catalogInventory = published.inventory;
		}
	}, params.isPublished);
	const { providerSource, providerSources, retainedInventory, previousAuth } = prepareRetainedProviderCatalog(params, normalizeProvider, eligibleProviders, pluginFingerprint, nativeSource);
	if (retainedInventory && previousAuth) setCatalogAuth(retainedInventory.catalog, currentAuth);
	const hasNativeCatalog = params.pluginGeneration.pluginRegistry?.agentHarnesses.some(({ harness }) => typeof harness.loadModelCatalog === "function");
	let published = {
		catalog: void 0,
		inventory: retainedInventory,
		configuredRuntimeModels: params.catalogFacts.configuredRuntimeModels,
		nativeCatalogAcquired: !hasNativeCatalog
	};
	let pending;
	let nativePending;
	const assertCurrent = () => assertPreparedModelRuntimeInputCurrent(params.agentFacts.input, params.isCurrent);
	const worker = withRemoteModelCatalogSnapshot(params.pluginGeneration.remoteCatalog, () => createPreparedModelCatalogWorker({
		pluginRegistry: params.pluginGeneration.pluginRegistry,
		agentFacts: params.agentFacts,
		pluginMetadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
		preferBuiltPluginArtifacts: params.pluginGeneration.preferBuiltPluginArtifacts,
		isCurrent: params.isCurrent,
		retirementSignal: params.retirementSignal
	}));
	const staticCatalog = project({ catalog: params.catalogFacts.modelCatalog });
	if (hasNativeCatalog) staticCatalog.authoritative = false;
	setCatalogAuth(staticCatalog, currentAuth);
	const preparePublication = (nextInventory, configuredRuntimeModels, acquiredNative) => {
		const catalog = project(nextInventory, configuredRuntimeModels);
		setCatalogAuth(catalog, getPreparedModelFullCatalogAuth(nextInventory.catalog) ?? currentAuth);
		catalog.authoritative = acquiredNative && !catalog.refreshFailed ? catalog.authoritative : false;
		if (acquiredNative && eligibleProviders.every((provider) => nextInventory.providers.has(provider))) markPreparedModelCatalogFull(catalog);
		return {
			catalog,
			inventory: nextInventory,
			configuredRuntimeModels,
			nativeCatalogAcquired: acquiredNative
		};
	};
	if (retainedInventory) published = preparePublication(retainedInventory, published.configuredRuntimeModels, published.nativeCatalogAcquired);
	const publishCatalog = (candidate, source) => {
		assertCurrent();
		const previous = published;
		let next = {
			...candidate,
			catalog: previous.catalog
		};
		if (candidate.inventory) {
			const providers = source === "provider" ? candidate.inventory : previous.inventory ?? candidate.inventory;
			const native = source === "native" ? candidate.inventory.catalog : previous.inventory?.catalog;
			const apiCatalog = source === "native" && !previous.inventory ? params.catalogFacts.modelCatalog : providers.catalog;
			const inventory = {
				...providers,
				catalog: native ? mergePreparedNativeCatalog(native, apiCatalog) : apiCatalog
			};
			setCatalogAuth(inventory.catalog, getPreparedModelFullCatalogAuth(candidate.inventory.catalog) ?? currentAuth);
			const baseline = source === "native" ? previous.catalog ?? staticCatalog : void 0;
			next = preparePublication(inventory, source === "native" ? previous.configuredRuntimeModels : candidate.configuredRuntimeModels, source === "provider" ? previous.nativeCatalogAcquired : candidate.nativeCatalogAcquired);
			assertCurrent();
			if (baseline && next.catalog) {
				baseline.authoritative = next.catalog.authoritative;
				if (isPreparedModelCatalogFull(next.catalog)) markPreparedModelCatalogFull(baseline);
				next.catalog = retainPreparedModelCatalogPublication(next.catalog, baseline);
			}
		}
		published = {
			...next,
			catalog: retainPreparedModelCatalogPublication(next.catalog, previous.catalog)
		};
		params.inventoryOwner.catalogInventory = published.inventory;
		return {
			previous,
			current: published,
			staticCatalog
		};
	};
	const acquireProviderCatalog = async (providerIds, providers) => limitFullModelCatalogBuild(async () => {
		assertCurrent();
		const { modelCatalog: workerCatalog, configuredRuntimeModels, runtimeModels, providerExpiries, hookRows } = await worker.loadCatalog(providerIds, (error) => attempt.failed(error, providerIds ?? providers, "provider"));
		assertCurrent();
		const scope = new Set((providerIds ?? [
			...eligibleProviders,
			...workerCatalog.entries.map((entry) => entry.provider),
			...(workerCatalog.providerOutcomes ?? []).map((outcome) => outcome.provider)
		]).map(normalizeProvider));
		const discoveredAuth = getPreparedModelFullCatalogAuth(workerCatalog);
		if (!discoveredAuth) throw new Error("prepared model catalog worker omitted its auth generation");
		const retained = published.inventory;
		const retainedAuth = getPreparedModelFullCatalogAuth(published.catalog ?? staticCatalog) ?? currentAuth;
		const auth = providerIds ? replacePreparedModelCatalogAuth(retainedAuth, discoveredAuth, (provider) => scope.has(normalizeProvider(provider))) : discoveredAuth;
		const { legacyRows, ...publication } = prepareModelCatalogPublication(providerIds ? filterPreparedProviderCatalog(workerCatalog, (provider) => scope.has(normalizeProvider(provider))) : workerCatalog, new Map([...runtimeModels].filter(([provider]) => scope.has(normalizeProvider(provider)))), retained, auth, normalizeProvider, hookRows);
		const completedProviders = new Map([...scope].map((provider) => {
			const expiresAt = providerExpiries.get(provider);
			const failed = workerCatalog.providerOutcomes?.some((outcome) => normalizeProvider(outcome.provider) === provider && outcome.status !== "ready");
			return [provider, {
				source: providerSource(provider),
				credentials: preparedProviderCatalogCredentials(auth, provider, normalizeProvider),
				...!failed && expiresAt !== void 0 ? { expiresAt } : {},
				...legacyRows.get(provider)?.size ? { legacyRows: legacyRows.get(provider) } : {}
			}];
		}));
		const acquired = {
			...publication,
			key: inventoryKey,
			pluginFingerprint,
			nativeSource,
			providers: completedProviders
		};
		const inventory = providerIds ? mergePreparedModelCatalogInventory(retained, acquired, scope, normalizeProvider) : acquired;
		accountCatalog.reconcileAuth(discoveredAuth.authStore, (provider) => scope.has(normalizeProvider(provider)));
		setCatalogAuth(inventory.catalog, auth);
		return {
			inventory,
			configuredRuntimeModels,
			nativeCatalogAcquired: published.nativeCatalogAcquired
		};
	});
	const acquireNativeCatalog = (providerIds, selection) => {
		const captured = selection ? getPreparedModelRuntimeBorrowedSnapshot(params.pluginGeneration) : void 0;
		const borrowed = captured?.loadNativeModelCatalog === loadNativeModelCatalog ? captured : void 0;
		const assertLifetime = capturePreparedModelRuntimeLifetime();
		const isObservationCurrent = () => {
			assertLifetime();
			return borrowed ? getPreparedModelRuntimeBorrowedSnapshot(params.pluginGeneration) === borrowed : params.isCurrent();
		};
		const input = borrowed ? {
			...params.agentFacts.input,
			config: borrowed.config
		} : params.agentFacts.input;
		const capturedCatalog = borrowed ? readCapturedPreparedModelRuntimeCatalog(borrowed) ?? borrowed.modelCatalog : void 0;
		const readCatalog = () => (!params.isCurrent() ? capturedCatalog : void 0) ?? published.catalog ?? staticCatalog;
		const assertObservationCurrent = () => assertPreparedModelRuntimeInputCurrent(input, isObservationCurrent);
		const readReadyCatalog = () => {
			assertObservationCurrent();
			const snapshot = readCatalog();
			const ready = selection && isPreparedNativeModelCatalogReady({
				input,
				pluginGeneration: params.pluginGeneration,
				snapshot,
				selection
			});
			assertObservationCurrent();
			return ready ? snapshot : void 0;
		};
		const readyCatalog = readReadyCatalog();
		if (readyCatalog) return Promise.resolve(readyCatalog);
		const previousNative = nativePending;
		let failedProviders;
		const promise = (async () => {
			try {
				var _usingCtx$3 = _usingCtx();
				await previousNative?.catch(() => void 0);
				const settledCatalog = readReadyCatalog();
				if (settledCatalog) return settledCatalog;
				_usingCtx$3.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(params.pluginGeneration) });
				if (params.isCurrent()) attempt.setPending([], "native");
				let discoveredProviders = [];
				let completed = false;
				const failures = [];
				const startupProviders = new Set(params.agentFacts.providerIds.map(normalizeProvider));
				const rawCatalog = await augmentPreparedModelCatalogWithAgentHarness({
					input,
					nativeSelection: selection,
					snapshot: params.isCurrent() ? published.inventory?.catalog ?? params.catalogFacts.modelCatalog : readCatalog(),
					normalizeProvider,
					preparedSnapshot: readCatalog(),
					pluginRegistry: params.pluginGeneration.pluginRegistry,
					isCurrent: isObservationCurrent,
					includesProvider: providerIds ? (provider) => providerIds.includes(normalizeProvider(provider)) : void 0,
					onDiscoveryStarted: (provider) => {
						if (params.isCurrent()) attempt.setPending([normalizeProvider(provider)], "native");
					},
					onError: (error, failedProviderIds) => {
						failures.push({
							error,
							providers: failedProviderIds?.map(normalizeProvider)
						});
					},
					onDiscoveryCompleted: (rows) => {
						completed = true;
						discoveredProviders = [...new Set(rows.map((entry) => normalizeProvider(entry.provider)).filter((provider) => !startupProviders.has(provider)))];
					}
				});
				assertObservationCurrent();
				if (!completed && failures.length) {
					failedProviders = failures.flatMap((failure) => failure.providers ?? []);
					throw failures[0].error;
				}
				if (!params.isCurrent()) {
					const catalog = projectInventory({
						catalog: rawCatalog,
						discoveryOrigins: capturedCatalog?.acceptedDiscoveryOrigins ?? []
					}, params.catalogFacts.configuredRuntimeModels);
					setCatalogAuth(catalog, getPreparedModelFullCatalogAuth(capturedCatalog ?? staticCatalog) ?? currentAuth);
					assertObservationCurrent();
					return catalog;
				}
				const nativeAuth = !selection && completed && discoveredProviders.length ? await worker.loadAuth({ providerIds: discoveredProviders }) : void 0;
				assertCurrent();
				const latest = published;
				const latestInventory = latest.inventory;
				const auth = getPreparedModelFullCatalogAuth(latest.inventory?.catalog ?? staticCatalog) ?? currentAuth;
				const nativeScope = preparedSyntheticAuthProviderScope(discoveredProviders);
				const catalogAuth = nativeAuth ? replacePreparedModelCatalogAuth(auth, nativeAuth, (provider) => nativeScope.has(normalizeProvider(provider))) : auth;
				const acquiredNative = latest.nativeCatalogAcquired || !selection && (!providerIds || completed);
				const nextInventory = completed ? {
					catalog: {
						...rawCatalog,
						authoritative: (latestInventory?.catalog ?? params.catalogFacts.modelCatalog).authoritative
					},
					runtimeModels: latestInventory?.runtimeModels ?? /* @__PURE__ */ new Map(),
					key: inventoryKey,
					pluginFingerprint,
					nativeSource,
					providers: latestInventory?.providers ?? /* @__PURE__ */ new Map(),
					discoveryOrigins: latestInventory?.discoveryOrigins ?? []
				} : latestInventory;
				if (nextInventory) {
					if (nativeAuth) accountCatalog.reconcileAuth(nativeAuth.authStore, (provider) => nativeScope.has(normalizeProvider(provider)));
					setCatalogAuth(nextInventory.catalog, catalogAuth);
				}
				if (completed) attempt.published(providerIds, "native");
				else attempt.setPending(void 0, "native");
				for (const failure of failures) attempt.failed(failure.error, failure.providers, "native");
				const change = publishCatalog({
					...latest,
					inventory: nextInventory,
					nativeCatalogAcquired: acquiredNative
				}, "native");
				if (params.isPublished?.() !== false) notifyPreparedModelCatalogPublication(change);
				return published.catalog ?? staticCatalog;
			} catch (_) {
				_usingCtx$3.e = _;
			} finally {
				await _usingCtx$3.d();
			}
		})().catch((error) => {
			attempt.failed(error, failedProviders ?? providerIds, "native");
			if (params.isCurrent() && published.catalog) attempt.withRefreshStatus(published.catalog);
			throw error;
		}).finally(() => {
			if (nativePending === promise) nativePending = void 0;
		});
		nativePending = promise;
		return promise;
	};
	const refreshExpiredModelCatalog = () => {
		assertCurrent();
		if (pending || !published.inventory) return;
		const now = Date.now();
		const providers = [...published.inventory.providers].filter(([, { expiresAt }]) => expiresAt !== void 0 && expiresAt <= now).map(([provider]) => provider);
		if (providers.length) acquireCatalog({
			providerIds: providers,
			refresh: true
		}, false).catch(() => void 0);
	};
	const acquireCatalog = async (options = {}, acquireNative = true) => {
		assertCurrent();
		if (!options.refresh && !options.changedOnly && published.catalog && isPreparedModelCatalogFull(published.catalog)) {
			refreshExpiredModelCatalog();
			return published.catalog;
		}
		const requestedProviders = [...new Set((options.providerIds ?? (options.changedOnly ? Object.keys(params.agentFacts.credentials) : eligibleProviders)).map(normalizeProvider))];
		const providers = requestedProviders.filter((provider) => !options.changedOnly || published.inventory?.providers.get(provider)?.source !== providerSources.get(provider) || published.inventory?.providers.get(provider)?.credentials !== preparedProviderCatalogCredentials(params.agentFacts, provider, normalizeProvider));
		const fullRefresh = !options.changedOnly && !options.providerIds;
		const includeNative = acquireNative && hasNativeCatalog && (!options.changedOnly || !published.nativeCatalogAcquired);
		const nativeProviders = includeNative ? options.providerIds ? requestedProviders : void 0 : [];
		if (!providers.length && !includeNative && !fullRefresh) return published.catalog ?? staticCatalog;
		if (pending) {
			const current = pending;
			const coversProviders = current.providers === void 0 || !fullRefresh && providers.every((provider) => current.providers.includes(provider));
			const coversNative = !includeNative || current.nativeProviders === void 0 || nativeProviders !== void 0 && nativeProviders.every((provider) => current.nativeProviders.includes(provider));
			if (coversProviders && coversNative) return current.promise;
			await current.promise.catch(() => void 0);
			return acquireCatalog(options, acquireNative);
		}
		attempt.setPending(fullRefresh || providers.length ? providers : void 0);
		const promise = (async () => {
			try {
				var _usingCtx3 = _usingCtx();
				_usingCtx3.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(params.pluginGeneration) });
				if (fullRefresh || providers.length) {
					const candidate = await acquireProviderCatalog(fullRefresh ? void 0 : providers, providers).catch((error) => {
						attempt.failed(error, providers, "provider");
						throw error;
					});
					attempt.published(fullRefresh ? void 0 : providers, "provider", () => publishCatalog(candidate, "provider"));
				}
				if (includeNative) return await acquireNativeCatalog(options.providerIds ? requestedProviders : void 0);
				return published.catalog ?? staticCatalog;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				await _usingCtx3.d();
			}
		})().finally(() => {
			pending = void 0;
		});
		pending = {
			providers: fullRefresh ? void 0 : providers,
			nativeProviders,
			promise
		};
		return promise;
	};
	const loadNativeModelCatalog = async (selection) => await acquireNativeCatalog([normalizeProvider(selection.provider)], selection);
	return {
		accountCatalog,
		initialAuth: currentAuth,
		isCurrent: params.isCurrent,
		withRefreshStatus: attempt.withRefreshStatus,
		loadAuth: async ({ providerIds, profileIds }) => {
			try {
				var _usingCtx4 = _usingCtx();
				assertCurrent();
				_usingCtx4.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(params.pluginGeneration) });
				const refreshed = await worker.loadAuth({
					providerIds,
					...profileIds?.length ? { profileIds } : {}
				});
				assertCurrent();
				const previous = getPreparedModelFullCatalogAuth(published.catalog ?? staticCatalog) ?? currentAuth;
				const scope = preparedSyntheticAuthProviderScope(providerIds.map(normalizeProvider));
				const { authStore, authModes } = replacePreparedModelCatalogAuth(previous, refreshed, (provider) => scope.has(normalizeProvider(provider)));
				accountCatalog.reconcileAuth(refreshed.authStore, (provider) => scope.has(normalizeProvider(provider)), profileIds);
				return {
					authStore,
					authModes: Object.freeze(authModes)
				};
			} catch (_) {
				_usingCtx4.e = _;
			} finally {
				await _usingCtx4.d();
			}
		},
		readFullModelCatalog: () => {
			assertCurrent();
			return published.catalog;
		},
		refreshExpiredModelCatalog,
		readPublishedModels: () => {
			assertCurrent();
			return published.inventory?.runtimeModels;
		},
		loadNativeModelCatalog,
		loadFullModelCatalog: async (options) => {
			if (options?.refresh && params.inventoryOwner.provenance === "standalone") return await acquireCatalog(options);
			return await raceWithTimeout(acquireCatalog(options), MODEL_CATALOG_FOREGROUND_WAIT_MS, () => published.catalog ?? staticCatalog, { ref: false });
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.build.ts
const MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS = 2;
function groupBuildCandidates(candidates, keyOf) {
	const groups = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const key = keyOf(candidate);
		const group = groups.get(key) ?? [];
		group.push(candidate);
		groups.set(key, group);
	}
	return groups;
}
async function buildSnapshotBatch(requestedCandidates, registryResources, catalogMode, pluginMetadataSnapshot, onBuildStats, includeCredentialProviders = catalogMode === "live", onStage, onPrepared, signal) {
	const configs = /* @__PURE__ */ new Map();
	const candidates = requestedCandidates.map((candidate) => {
		const source = candidate.input.config;
		let shared = configs.get(source);
		if (!shared) {
			const config = captureRuntimeConfig(source);
			shared = {
				config,
				nativeConfigFingerprint: fingerprintPreparedRuntimeFacts({
					agents: config.agents,
					plugins: config.plugins
				})
			};
			configs.set(source, shared);
		}
		return {
			...candidate,
			requestedInput: candidate.input,
			input: {
				...candidate.input,
				config: shared.config
			},
			nativeConfigFingerprint: shared.nativeConfigFingerprint
		};
	});
	const candidateByInput = new Map(candidates.map((candidate) => [candidate.input, candidate]));
	const results = /* @__PURE__ */ new Map();
	const prepareSnapshot = async (candidate, agentFacts, pluginGeneration, catalogFacts) => {
		const catalogAccess = await createFullModelCatalogAccess({
			agentFacts,
			nativeConfigFingerprint: candidate.nativeConfigFingerprint,
			catalogFacts,
			pluginGeneration,
			isCurrent: candidate.isGenerationCurrent ?? (() => false),
			isPublished: candidate.isPublished,
			retirementSignal: candidate.retirementSignal,
			inventoryOwner: candidate.inventoryOwner ?? {}
		}, () => assertBuildCurrent(candidate.input));
		assertBuildCurrent(candidate.input);
		const result = {
			snapshot: createPreparedModelRuntimeSnapshot(candidate.catalogOwner, agentFacts, pluginGeneration, catalogFacts, catalogAccess, candidate.requestedInput.config),
			pluginGeneration
		};
		results.set(candidate.input, result);
		onPrepared?.(candidate.requestedInput, result);
	};
	const assertBuildCurrent = (input) => assertPreparedModelRuntimeInputCurrent(input, candidateByInput.get(input).isBuildCurrent);
	const preparedGenerations = /* @__PURE__ */ new Set();
	try {
		const generations = groupBuildCandidates(candidates, (candidate) => candidate.pluginGeneration);
		const fresh = generations.get(void 0) ?? [];
		generations.delete(void 0);
		generations.set(void 0, fresh);
		const groups = [...generations].flatMap(([pluginGeneration, generationCandidates]) => [...groupBuildCandidates(generationCandidates, (candidate) => {
			const workspace = preparedModelRuntimeWorkspaceFactsKey(candidate.input);
			if (candidate.inspectRegistry) return `inspection\0${workspace}`;
			const kind = candidate.prepareInboundPluginRegistry ? "configured" : "dynamic";
			return pluginGeneration ? workspace : `${kind}\0${workspace}`;
		}).values()].map((groupCandidates) => ({
			groupCandidates,
			pluginGeneration
		})));
		const preparedInputs = /* @__PURE__ */ new Map();
		const requirePreparedInput = (input) => {
			const prepared = preparedInputs.get(input);
			if (!prepared) throw new Error(`prepared model runtime facts missing for ${input.agentDir}`);
			return prepared;
		};
		const loadInboundPluginRegistry = createPreparedInboundRegistryLoader();
		const configuredModelRegistries = /* @__PURE__ */ new Map();
		const configuredHarnessRuntimesByConfig = /* @__PURE__ */ new Map();
		const configuredModelFactsByConfig = /* @__PURE__ */ new Map();
		const getConfiguredModelFacts = (config, metadata) => {
			let factsByMetadata = configuredModelFactsByConfig.get(config);
			if (!factsByMetadata) {
				factsByMetadata = /* @__PURE__ */ new Map();
				configuredModelFactsByConfig.set(config, factsByMetadata);
			}
			let facts = factsByMetadata.get(metadata);
			if (!facts) {
				facts = prepareConfiguredModelFacts(config, metadata);
				factsByMetadata.set(metadata, facts);
			}
			return facts;
		};
		let runtimePluginMs = 0;
		let pluginMetadataMs = 0;
		let staticProviderCatalogMs = 0;
		let ambientCredentialsMs = 0;
		let agentFactsMs = 0;
		let configuredProjectionMs = 0;
		let runtimeRegistryCount = 0;
		let registryMs = 0;
		const preparedCatalogs = /* @__PURE__ */ new Map();
		const workspaceFactsStartedAt = performance.now();
		for (const { groupCandidates, pluginGeneration } of groups) {
			await setImmediate();
			for (const candidate of groupCandidates) assertBuildCurrent(candidate.input);
			const prepareInboundPluginRegistry = groupCandidates.some((candidate) => candidate.prepareInboundPluginRegistry);
			const preferBuiltPluginArtifacts = pluginGeneration?.preferBuiltPluginArtifacts ?? prepareInboundPluginRegistry;
			const getConfiguredHarnessRuntimes = () => {
				const config = groupCandidates[0].input.config;
				let runtimes = configuredHarnessRuntimesByConfig.get(config);
				if (!runtimes) {
					runtimes = collectConfiguredAgentHarnessRuntimes(config);
					configuredHarnessRuntimesByConfig.set(config, runtimes);
				}
				return runtimes;
			};
			const prepared = await prepareWorkspaceBuildGroup(groupCandidates.map(({ input }) => input), catalogMode, {
				preferBuiltPluginArtifacts,
				includeCredentialProviders,
				getConfiguredHarnessRuntimes,
				getConfiguredModelFacts,
				assertCurrent: assertBuildCurrent,
				onBeforeAuthCapture: (input) => candidateByInput.get(input).onBeforeAuthCapture?.(),
				onStage,
				signal,
				registryResources,
				...groupCandidates.some((candidate) => candidate.inspectRegistry) ? { loadRuntimeRegistry: registryResources.load.bind(registryResources) } : {}
			}, prepareInboundPluginRegistry ? loadInboundPluginRegistry : void 0, pluginGeneration, pluginMetadataSnapshot);
			preparedGenerations.add(prepared.pluginGeneration);
			assertPreparedModelRuntimeCandidatesCurrent(groupCandidates);
			runtimePluginMs += prepared.buildStats.runtimePluginMs;
			pluginMetadataMs += prepared.buildStats.pluginMetadataMs;
			staticProviderCatalogMs += prepared.buildStats.staticProviderCatalogMs;
			ambientCredentialsMs += prepared.buildStats.ambientCredentialsMs;
			agentFactsMs += prepared.buildStats.agentFactsMs;
			configuredProjectionMs += prepared.buildStats.configuredProjectionMs;
			for (const agentFacts of prepared.agentFacts) preparedInputs.set(agentFacts.input, {
				agentFacts,
				pluginGeneration: prepared.pluginGeneration
			});
			if (catalogMode === "static") {
				const startedAt = performance.now();
				const batch = await prepareConfiguredRuntimeFactsBatch({
					agentFacts: prepared.agentFacts,
					pluginGeneration: prepared.pluginGeneration,
					assertCurrent: assertBuildCurrent,
					registries: configuredModelRegistries
				});
				runtimeRegistryCount += batch.registryCount;
				registryMs += performance.now() - startedAt;
				for (const candidate of groupCandidates) {
					await setImmediate();
					assertBuildCurrent(candidate.input);
					const facts = batch.catalogs.get(candidate.input);
					preparedCatalogs.set(candidate.input, facts);
					await prepareSnapshot(candidate, requirePreparedInput(candidate.input).agentFacts, prepared.pluginGeneration, facts);
				}
			}
			await settlePluginNativeAdmissions(getPluginMetadataSnapshotCache(prepared.pluginGeneration.pluginMetadataSnapshot));
			assertPreparedModelRuntimeCandidatesCurrent(groupCandidates);
		}
		const workspaceFactsMs = performance.now() - workspaceFactsStartedAt;
		const catalogSourceStartedAt = performance.now();
		onStage?.("agent catalog sources");
		const catalogSources = /* @__PURE__ */ new Map();
		if (catalogMode === "live") {
			const sourceCandidatesByAgentDir = groupBuildCandidates(candidates, ({ input }) => input.agentDir);
			const sourceErrors = [];
			const sourceBuild = await runTasksWithConcurrency({
				limit: MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS,
				errorMode: "stop",
				onTaskError: (error) => {
					sourceErrors.push(error);
				},
				tasks: [...sourceCandidatesByAgentDir.values()].map((sourceCandidates) => async () => {
					for (const candidate of sourceCandidates) {
						await setImmediate();
						const { input } = candidate;
						const { agentFacts, pluginGeneration } = requirePreparedInput(input);
						assertPreparedModelRuntimeInputCurrent(input, candidate.isBuildCurrent);
						const catalogSource = await prepareAgentCatalogSource(agentFacts, pluginGeneration, catalogMode);
						assertPreparedModelRuntimeInputCurrent(input, candidate.isBuildCurrent);
						catalogSources.set(input, catalogSource);
					}
				})
			});
			if (sourceBuild.hasError) throw toStringifiedError(sourceErrors.find((error) => !(error instanceof PreparedModelRuntimePublicationSupersededError)) ?? sourceBuild.firstError);
		}
		const catalogSourceMs = performance.now() - catalogSourceStartedAt;
		const registryStartedAt = performance.now();
		onStage?.("model registries");
		if (catalogMode === "live") for (const candidate of candidates) {
			await setImmediate();
			const { input } = candidate;
			const { agentFacts, pluginGeneration } = requirePreparedInput(input);
			const catalogSource = catalogSources.get(input);
			if (!catalogSource) throw new Error(`prepared model runtime catalog source missing for ${input.agentDir}`);
			assertPreparedModelRuntimeInputCurrent(input, candidate.isBuildCurrent);
			preparedCatalogs.set(input, await prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource));
			assertPreparedModelRuntimeInputCurrent(input, candidate.isBuildCurrent);
			runtimeRegistryCount += 1;
		}
		registryMs += performance.now() - registryStartedAt;
		const preparedAgentFacts = [...preparedInputs.values()].map(({ agentFacts }) => agentFacts);
		const configuredRuntimeModelCount = [...preparedCatalogs.values()].reduce((count, facts) => count + facts.configuredRuntimeModels.length, 0);
		const generatedCatalogPluginCount = new Set(preparedAgentFacts.flatMap((facts) => facts.configuredGeneratedCatalogPluginIds)).size;
		const generatedCatalogReadCount = preparedAgentFacts.reduce((count, facts) => count + facts.configuredGeneratedCatalogPluginIds.length, 0);
		onBuildStats?.({
			agentCount: candidates.length,
			workspaceGroupCount: groups.length,
			configuredFactsGroupCount: groups.length,
			catalogSourceCount: catalogMode === "live" ? preparedAgentFacts.filter(({ input }) => !input.readOnly).length : 0,
			credentialGroupCount: new Set(preparedAgentFacts.map(({ credentials }) => fingerprintPreparedRuntimeFacts(credentials))).size,
			catalogGroupCount: catalogMode === "live" ? candidates.length : 0,
			runtimeRegistryCount,
			configuredRuntimeModelCount,
			generatedCatalogPluginCount,
			generatedCatalogReadCount,
			workspaceFactsMs,
			runtimePluginMs,
			pluginMetadataMs,
			staticProviderCatalogMs,
			ambientCredentialsMs,
			agentFactsMs,
			configuredProjectionMs,
			catalogSourceMs,
			registryMs,
			sourceConcurrencyLimit: MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS,
			fullCatalogConcurrencyLimit: 1
		});
		assertPreparedModelRuntimeCandidatesCurrent(candidates);
		for (const candidate of candidates) {
			if (results.has(candidate.input)) continue;
			await setImmediate();
			const { input } = candidate;
			assertBuildCurrent(input);
			const { agentFacts, pluginGeneration } = requirePreparedInput(input);
			const catalogFacts = preparedCatalogs.get(input);
			if (!catalogFacts) throw new Error(`prepared model runtime snapshot facts missing for ${input.agentDir}`);
			await prepareSnapshot(candidate, agentFacts, pluginGeneration, catalogFacts);
		}
		assertPreparedModelRuntimeCandidatesCurrent(candidates);
		return candidates.map(({ input }) => results.get(input));
	} catch (error) {
		const failures = (await Promise.allSettled([...preparedGenerations].map(discardPreparedPluginGeneration))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError([error, ...failures], "Prepared model build and cleanup failed", { cause: error });
		throw error;
	}
}
function startSerializedSnapshotBuildBatch(candidates, agentBuildCompletions, buildTimeoutMs, catalogMode = "live", onBuildStats, pluginMetadataSnapshot, includeCredentialProviders = catalogMode === "live", progress, acquisitionSignal) {
	const cancellation = new AbortController();
	const signal = acquisitionSignal ? AbortSignal.any([acquisitionSignal, cancellation.signal]) : cancellation.signal;
	const finished = createDeferredCore();
	const unregisterClose = registerPreparedModelRuntimeClose(async (error) => {
		cancellation.abort(error);
		await finished.promise;
	});
	const agentDirs = [...new Set(candidates.map(({ input }) => input.agentDir))];
	let stage = "previous generation completion";
	const previousBuildCompletions = agentDirs.map((agentDir) => agentBuildCompletions.get(agentDir)).filter((completion) => completion !== void 0);
	const agentCompletions = progress ? new Map(agentDirs.map((agentDir) => [agentDir, createDeferredCore()])) : void 0;
	const remainingByAgent = new Map(agentDirs.map((agentDir) => [agentDir, candidates.filter(({ input }) => input.agentDir === agentDir).length]));
	const startBuild = (async () => {
		try {
			var _usingCtx$2 = _usingCtx();
			registerPreparedPluginLifetime();
			const registryResources = _usingCtx$2.a(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry));
			if (previousBuildCompletions.length > 0) {
				await Promise.all(previousBuildCompletions);
				assertPreparedModelRuntimeCandidatesCurrent(candidates);
			}
			signal.throwIfAborted();
			return await buildSnapshotBatch(candidates, registryResources, catalogMode, pluginMetadataSnapshot, onBuildStats, includeCredentialProviders, (nextStage) => {
				stage = nextStage;
				progress?.onStage(nextStage);
			}, progress ? (input, result) => {
				progress.onPrepared(input, result);
				const remaining = remainingByAgent.get(input.agentDir) - 1;
				remainingByAgent.set(input.agentDir, remaining);
				if (remaining === 0) agentCompletions.get(input.agentDir).resolve();
			} : void 0, signal);
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			await _usingCtx$2.d();
		}
	})();
	let abandoned = false;
	const pending = runAbortableTimeout(() => startBuild, buildTimeoutMs, () => `prepared model runtime publication (${stage})`).catch((error) => {
		abandoned = true;
		throw error;
	});
	const completion = startBuild.then(async (results) => {
		if (abandoned) await Promise.all(results.map(({ pluginGeneration }) => discardPreparedPluginGeneration(pluginGeneration)));
	}, () => {}).then(() => {}, () => {});
	for (const agentDir of agentDirs) {
		const agentCompletion = agentCompletions?.get(agentDir);
		if (agentCompletion) completion.then(() => agentCompletion.resolve());
		const ownedCompletion = agentCompletion?.promise ?? completion;
		agentBuildCompletions.set(agentDir, ownedCompletion);
		ownedCompletion.then(() => {
			if (agentBuildCompletions.get(agentDir) === ownedCompletion) agentBuildCompletions.delete(agentDir);
		});
	}
	completion.then(() => {
		unregisterClose();
		finished.resolve();
	});
	return {
		pending,
		completion
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.retention.ts
async function retirePreparedModelRuntimeAgentOwners(target, context) {
	const targetId = normalizeAgentId(target.agentId);
	const targetDirs = new Set(target.agentDirs.map((agentDir) => normalizeAgentDirRegistryPath(agentDir)));
	const retiredAgentDirs = /* @__PURE__ */ new Set();
	const configuredAgentIds = /* @__PURE__ */ new Set();
	for (const [key, owner] of context.owners) {
		if (!owner.input.agentId || normalizeAgentId(owner.input.agentId) !== targetId || !targetDirs.has(normalizeAgentDirRegistryPath(owner.input.agentDir, owner.input.env))) continue;
		context.owners.delete(key);
		owner.generation += 1;
		retirePreparedModelRuntimeGeneration(owner);
		releasePreparedPluginPublication(owner);
		retiredAgentDirs.add(owner.input.agentDir);
		if (owner.provenance === "configured") configuredAgentIds.add(targetId);
	}
	context.replyDispatchPublication.remove(configuredAgentIds);
	const pendingBuilds = [...retiredAgentDirs].map((agentDir) => context.agentBuildCompletions.get(agentDir)).filter((completion) => completion !== void 0);
	await Promise.all(pendingBuilds);
}
function retirePreparedModelRuntimeOwnerIfUnused(owners, key, owner, retained = false) {
	if ((owner.provenance === "run" || owner.provenance === "ephemeral") && (owner.admissionCount ?? 0) === 0 && (owner.leaseCount ?? 0) === 0 && !retained) {
		if (owners.get(key) === owner) owners.delete(key);
		retirePreparedModelRuntimeGeneration(owner);
		releasePreparedPluginPublication(owner);
	}
}
var PreparedModelRuntimeOwnerRetention = class {
	#retained = /* @__PURE__ */ new Map();
	constructor(maxSize) {
		this.maxSize = maxSize;
	}
	clear(owners) {
		for (const [key, owner] of this.#retained) retirePreparedModelRuntimeOwnerIfUnused(owners, key, owner);
		this.#retained.clear();
	}
	has(key, owner) {
		return this.#retained.get(key) === owner;
	}
	retain(key, owner, owners) {
		if (owner.provenance !== "run") return;
		this.#retained.delete(key);
		this.#retained.set(key, owner);
		while (this.#retained.size > this.maxSize) {
			const oldest = this.#retained.entries().next().value;
			if (!oldest) return;
			const [oldestKey, oldestOwner] = oldest;
			this.#retained.delete(oldestKey);
			retirePreparedModelRuntimeOwnerIfUnused(owners, oldestKey, oldestOwner);
		}
	}
};
async function acquireRetainedAgentRuntimeCleanupRegistries(agentDir, context) {
	const registries = /* @__PURE__ */ new Set();
	const releases = [];
	try {
		for (const [key, owner] of context.owners) {
			const generation = owner.pluginGeneration;
			const registry = generation?.pluginRegistry;
			if (owner.input.agentDir !== agentDir || owner.input.readOnly || owner.provenance === "ephemeral" || !generation || !registry || registries.has(registry) || owner.provenance === "run" && !owner.leaseCount && !context.retainedGatewayRunOwners.has(key, owner) && !context.retainedDirectRunOwners.has(key, owner)) continue;
			releases.push(retainPreparedPluginGeneration(generation));
			registries.add(registry);
		}
	} catch (error) {
		await Promise.allSettled(releases.map((release) => release()));
		throw error;
	}
	return {
		registries: [...registries],
		async [Symbol.asyncDispose]() {
			await Promise.all(releases.map((release) => release()));
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.owner.ts
const ownersBySnapshot = /* @__PURE__ */ new WeakMap();
function resolvePreparedModelRuntimeOwnerBySnapshot(snapshot) {
	return ownersBySnapshot.get(snapshot);
}
function publishPreparedModelRuntimeOwnerSnapshot(owner, snapshot) {
	const published = stampPreparedModelRuntimeSnapshotConfig(snapshot, owner.input.config);
	if (owner.snapshot) ownersBySnapshot.delete(owner.snapshot);
	owner.snapshot = published;
	ownersBySnapshot.set(published, owner);
	return published;
}
function prepareModelRuntimeOwner(input, provenance, catalogMode = "live", existing) {
	return Object.assign(existing ?? {
		generation: 0,
		needsRefresh: true,
		catalogStale: false
	}, {
		input,
		catalogOwner: preparePublishedModelCatalogOwnerIdentity(input),
		environmentFingerprint: effectiveEnvironmentFingerprint(input),
		catalogMode,
		provenance
	});
}
function findConfiguredOwnerCandidates(owners, input) {
	const configured = [...owners.values()].filter((owner) => owner.provenance === "configured");
	const identityCandidates = input.agentId === void 0 ? [] : configured.filter((owner) => owner.input.agentId === input.agentId);
	const exactCandidates = identityCandidates.filter((owner) => owner.input.agentDir === input.agentDir);
	const directoryCandidates = configured.filter((owner) => owner.input.agentDir === input.agentDir);
	const canRebindByDirectory = input.agentId === void 0 || isReservedSystemAgentId(input.agentId);
	return exactCandidates.length > 0 ? exactCandidates : canRebindByDirectory && directoryCandidates.length > 0 ? directoryCandidates : identityCandidates;
}
function resolveConfiguredOwnerPublication(owners, rawInput) {
	const candidates = findConfiguredOwnerCandidates(owners, normalizePreparedModelRuntimeInput(rawInput));
	return {
		matches: candidates.length > 0,
		pending: candidates.length === 1 ? candidates[0]?.pending : void 0
	};
}
function resolveConfiguredOwner(owners, rawInput) {
	const candidates = findConfiguredOwnerCandidates(owners, normalizePreparedModelRuntimeInput(rawInput));
	return candidates.length === 1 ? candidates[0] : void 0;
}
function rebindInputToCommittedConfiguredOwner(owners, rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const candidates = findConfiguredOwnerCandidates(owners, input).filter((owner) => owner.snapshot && !owner.needsRefresh && !owner.pending);
	const owner = candidates.length === 1 ? candidates[0] : void 0;
	if (!owner) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not committed after replacement for ${input.agentDir}`);
	const preserveWorkspaceDir = input.preserveWorkspaceDirOnRefresh === true && input.workspaceDir !== void 0;
	const agentId = input.agentId ?? owner.input.agentId;
	return normalizePreparedModelRuntimeInput({
		...input,
		...agentId ? { agentId } : {},
		agentDir: owner.input.agentDir,
		config: owner.input.config,
		inheritedAuthDir: owner.input.inheritedAuthDir,
		env: owner.input.env,
		workspaceDir: preserveWorkspaceDir ? input.workspaceDir : owner.input.workspaceDir,
		preserveWorkspaceDirOnRefresh: preserveWorkspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding ?? owner.input.allowGatewaySubagentBinding,
		runtimePluginSelections: input.runtimePluginSelections ?? owner.input.runtimePluginSelections
	});
}
/** Accepts canonical config clones without weakening projected-config isolation. */
function preparedModelRuntimeConfigsMatch(left, right) {
	if (left === right) return true;
	try {
		return hashRuntimeConfigValue(left) === hashRuntimeConfigValue(right);
	} catch {
		return false;
	}
}
function stampPreparedModelRuntimeSnapshotConfig(snapshot, config) {
	if (snapshot.config === config) return snapshot;
	const stamped = Object.freeze({
		...snapshot,
		config
	});
	copyPreparedModelRuntimeAuthBindings(snapshot, stamped);
	return stamped;
}
function advancePreparedModelRuntimeOwnerConfig(owner, config) {
	owner.input = {
		...owner.input,
		config
	};
	if (owner.snapshot) publishPreparedModelRuntimeOwnerSnapshot(owner, owner.snapshot);
}
function normalizeOptionalDir(dirname) {
	return dirname ? path.resolve(dirname) : void 0;
}
function normalizePreparedModelRuntimeInput(input) {
	const { inheritedAuthDir: _inheritedAuthDir, readOnly, runtimePluginSelections: _runtimePluginSelections, skipCredentials, workspaceDir: _workspaceDir, ...rest } = input;
	const inheritedAuthDir = normalizeOptionalDir(input.inheritedAuthDir ?? resolveLegacyInheritedAuthDir(input.config, input.env));
	const workspaceDir = normalizeOptionalDir(input.workspaceDir);
	const env = input.env ? Object.freeze({ ...input.env }) : void 0;
	const selections = /* @__PURE__ */ new Map();
	for (const selection of input.runtimePluginSelections ?? []) {
		const runtime = resolveSelectedAgentHarnessRuntime({
			...selection,
			agentId: selection.agentId ?? input.agentId
		}, input.config);
		const { agentId: _agentId, ...normalized } = selection;
		const entry = Object.freeze({
			...normalized,
			runtime: runtime === "auto" ? "openclaw" : runtime
		});
		selections.set(JSON.stringify(entry), entry);
	}
	const runtimePluginSelections = Object.freeze([...selections].toSorted(([left], [right]) => left.localeCompare(right)).map(([, entry]) => entry));
	return {
		...rest,
		agentDir: path.resolve(input.agentDir),
		...inheritedAuthDir ? { inheritedAuthDir } : {},
		...readOnly === true ? { readOnly: true } : {},
		...skipCredentials === true ? { skipCredentials: true } : {},
		...workspaceDir ? { workspaceDir } : {},
		...env ? { env } : {},
		...input.allowGatewaySubagentBinding === true ? { allowGatewaySubagentBinding: true } : {},
		...runtimePluginSelections?.length ? { runtimePluginSelections } : {}
	};
}
function environmentFingerprint(env) {
	return env ? hashRuntimeConfigValue(env) : void 0;
}
function effectiveEnvironmentFingerprint(input) {
	return hashRuntimeConfigValue(input.env ?? process.env);
}
function ownerKey(input) {
	return JSON.stringify({
		agentId: input.agentId,
		agentDir: input.agentDir,
		inheritedAuthDir: input.inheritedAuthDir,
		readOnly: input.readOnly === true,
		loadRuntimePlugins: input.loadRuntimePlugins === true,
		skipCredentials: input.skipCredentials === true,
		workspaceDir: input.workspaceDir,
		env: environmentFingerprint(input.env),
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections,
		config: input.readOnly ? hashRuntimeConfigValue(input.config) : void 0
	});
}
let activePreparedModelRuntimeReadBatch;
/** Reuse configured candidates only during synchronous reads; never publish or yield here. */
function withPreparedModelRuntimeReadBatch(read) {
	const parent = activePreparedModelRuntimeReadBatch;
	activePreparedModelRuntimeReadBatch = /* @__PURE__ */ new WeakMap();
	try {
		return read();
	} finally {
		activePreparedModelRuntimeReadBatch = parent;
	}
}
function configuredOwnerCandidates(owners, agentId) {
	const batch = activePreparedModelRuntimeReadBatch;
	if (!batch || agentId === void 0) return owners.values();
	let byAgent = batch.get(owners);
	if (!byAgent) {
		byAgent = /* @__PURE__ */ new Map();
		for (const owner of owners.values()) {
			if (owner.provenance !== "configured" || owner.input.agentId === void 0) continue;
			const matches = byAgent.get(owner.input.agentId);
			if (matches) matches.push(owner);
			else byAgent.set(owner.input.agentId, [owner]);
		}
		batch.set(owners, byAgent);
	}
	return byAgent.get(agentId) ?? [];
}
function resolvePublishedOwner(owners, input, options = {}) {
	const exact = owners.get(ownerKey(input));
	if (exact) return exact;
	if (!options.allowConfiguredWorkspaceFallback) return;
	const candidates = [...configuredOwnerCandidates(owners, input.agentId)].filter((owner) => owner.provenance === "configured" && (input.agentId === void 0 || owner.input.agentId === input.agentId) && owner.input.agentDir === input.agentDir && owner.input.inheritedAuthDir === input.inheritedAuthDir && owner.input.readOnly === input.readOnly && owner.input.loadRuntimePlugins === input.loadRuntimePlugins && owner.input.skipCredentials === input.skipCredentials && (input.allowGatewaySubagentBinding === void 0 || owner.input.allowGatewaySubagentBinding === input.allowGatewaySubagentBinding) && (input.runtimePluginSelections === void 0 || JSON.stringify(owner.input.runtimePluginSelections) === JSON.stringify(input.runtimePluginSelections)) && (input.env === void 0 || owner.environmentFingerprint === environmentFingerprint(input.env)) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
	return candidates.length === 1 ? candidates[0] : void 0;
}
/** Reads an already-published generation without admitting discovery. */
function readPublishedModelRuntimeSnapshot(owners, rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const owner = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
	if (!owner?.snapshot || owner.needsRefresh || owner.pending) return;
	if (input.readOnly && !preparedModelRuntimeConfigsMatch(owner.input.config, input.config)) return;
	return owner.snapshot;
}
function hasSameLifecycleInput(left, right) {
	return left.config === right.config && left.agentId === right.agentId && left.inheritedAuthDir === right.inheritedAuthDir && left.readOnly === right.readOnly && left.loadRuntimePlugins === right.loadRuntimePlugins && left.skipCredentials === right.skipCredentials && left.workspaceDir === right.workspaceDir && environmentFingerprint(left.env) === environmentFingerprint(right.env) && left.preserveWorkspaceDirOnRefresh === right.preserveWorkspaceDirOnRefresh && left.allowGatewaySubagentBinding === right.allowGatewaySubagentBinding && JSON.stringify(left.runtimePluginSelections) === JSON.stringify(right.runtimePluginSelections);
}
async function publishPreparedModelRuntimeOwnerBatch(params, settleSingleOwner) {
	try {
		var _usingCtx$1 = _usingCtx();
		const catalogGeneration = captureRemoteModelCatalogStartupSnapshot();
		const candidates = params.ownersToPublish.map((owner) => {
			const input = owner.input;
			owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
			owner.generation += 1;
			retirePreparedModelRuntimeGeneration(owner);
			owner.authCaptureStarted = false;
			owner.needsRefresh = true;
			owner.refreshError = void 0;
			owner.pendingPluginGeneration = params.selectPluginGeneration?.(owner);
			const generation = owner.generation;
			const key = ownerKey(input);
			let registered = params.owners.get(key) === owner;
			const isGenerationCurrent = () => owner.generation === generation && (params.isOwnerRegistered?.(key, owner) ?? params.owners.get(key) === owner);
			const isCurrent = () => (params.isPublicationCurrent?.() ?? true) && isGenerationCurrent();
			const isPublished = params.isOwnerPublished;
			return {
				catalogMode: owner.catalogMode,
				input,
				catalogOwner: owner.catalogOwner,
				inventoryOwner: owner,
				pluginGeneration: owner.pendingPluginGeneration,
				prepareInboundPluginRegistry: owner.provenance === "configured",
				inspectRegistry: owner.provenance === "run" || owner.provenance === "ephemeral" && input.readOnly === true,
				isPublished: isPublished ? () => isPublished(key, owner) : void 0,
				isGenerationCurrent,
				retirementSignal: capturePreparedModelRuntimeGeneration(owner),
				isBuildCurrent: params.isBuildCurrent ?? isCurrent,
				onBeforeAuthCapture: () => {
					if (owner.generation === generation) owner.authCaptureStarted = true;
				},
				isEligible: () => (params.isPublicationCurrent?.() ?? true) && owner.generation === generation && (registered ? params.owners.get(key) === owner : params.registerEntriesAfterBuildStart === true),
				isCurrent,
				key,
				generation,
				markRegistered: () => {
					registered = true;
				},
				owner
			};
		});
		const groups = groupBuildCandidates(candidates, (candidate) => candidate.catalogMode);
		const results = /* @__PURE__ */ new Map();
		const publishCandidate = (candidate) => {
			if (!candidate.isCurrent()) return;
			const result = results.get(candidate.owner);
			if (!result || candidate.owner.snapshot === result.snapshot) return;
			if (captureRemoteModelCatalogStartupSnapshot() !== catalogGeneration) throw new PreparedModelRuntimePublicationSupersededError("Accepted model catalog changed during runtime preparation");
			publishPreparedPluginGeneration(candidate.owner, result.pluginGeneration);
			const snapshot = publishPreparedModelRuntimeOwnerSnapshot(candidate.owner, result.snapshot);
			results.set(candidate.owner, {
				...result,
				snapshot
			});
			candidate.owner.pluginGeneration = result.pluginGeneration;
			candidate.owner.needsRefresh = false;
		};
		_usingCtx$1.a({ [Symbol.asyncDispose]: async () => {
			const failures = (await Promise.allSettled([...results.values()].map((result) => discardPreparedPluginGeneration(result.pluginGeneration)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) {
				if (settleSingleOwner) throw failures[0];
				throw new AggregateError(failures, "Prepared publication cleanup failed");
			}
		} });
		try {
			while (true) {
				const attempt = candidates.filter((candidate) => candidate.isEligible() && !results.has(candidate.owner));
				if (attempt.length === 0) break;
				try {
					for (const [catalogMode, group] of groups) {
						const currentGroup = group.filter((candidate) => candidate.isEligible() && !results.has(candidate.owner));
						if (currentGroup.length === 0) continue;
						const build = startSerializedSnapshotBuildBatch(currentGroup, params.agentBuildCompletions, params.buildTimeoutMs, catalogMode, params.onBuildStats, params.pluginMetadataSnapshot, params.includeCredentialProviders, params.progress ? {
							onStage: params.progress.onStage,
							onPrepared: (input, result) => {
								const candidate = currentGroup.find((entry) => entry.input === input);
								results.set(candidate.owner, result);
								publishCandidate(candidate);
								params.progress.onPublished();
							}
						} : void 0, params.acquisitionSignal);
						for (const candidate of currentGroup) {
							if (params.registerEntriesAfterBuildStart === true) {
								const previous = params.owners.get(candidate.key);
								params.owners.set(candidate.key, candidate.owner);
								if (previous && previous !== candidate.owner) {
									retirePreparedModelRuntimeGeneration(previous);
									releasePreparedPluginPublication(previous);
								}
								candidate.markRegistered();
							}
							const completion = params.agentBuildCompletions.get(candidate.input.agentDir);
							candidate.owner.buildCompletion = completion;
							completion.then(() => {
								if (candidate.owner.buildCompletion === completion) candidate.owner.buildCompletion = void 0;
							});
						}
						const built = await build.pending;
						for (const [index, candidate] of currentGroup.entries()) if (!results.has(candidate.owner)) results.set(candidate.owner, built[index]);
					}
					break;
				} catch (error) {
					const refreshError = toStringifiedError(error);
					const lostCandidate = attempt.some((candidate) => !candidate.isCurrent());
					if (settleSingleOwner || !(refreshError instanceof PreparedModelRuntimePublicationSupersededError) || !(params.isPublicationCurrent?.() ?? true) || !lostCandidate) throw refreshError;
				}
			}
			for (const candidate of candidates) {
				if (!settleSingleOwner && candidate.owner.generation === candidate.generation) candidate.owner.pendingPluginGeneration = void 0;
				if (!candidate.isCurrent()) continue;
				if (!results.get(candidate.owner)) throw new Error(`prepared model runtime snapshot missing after auth refresh for ${candidate.input.agentDir}`);
				publishCandidate(candidate);
			}
			settleSingleOwner?.published(candidates[0].isCurrent);
		} catch (error) {
			const refreshError = toStringifiedError(error);
			for (const candidate of candidates) {
				if (candidate.owner.generation === candidate.generation) candidate.owner.pendingPluginGeneration = void 0;
				if (!candidate.isCurrent()) continue;
				if (params.progress && candidate.owner.snapshot && !candidate.owner.needsRefresh) continue;
				candidate.owner.needsRefresh = true;
				candidate.owner.refreshError = refreshError;
			}
			settleSingleOwner?.failed(refreshError, candidates[0].isCurrent);
			throw refreshError;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, buildTimeoutMs, existing, provenance = "explicit", catalogMode = existing?.catalogMode ?? "live", reusablePluginGeneration, pluginMetadataSnapshot) {
	const key = ownerKey(input);
	const owner = prepareModelRuntimeOwner(input, provenance, catalogMode, existing);
	owner.pluginGeneration = void 0;
	const publication = createDeferredCore();
	owner.pending = publication.promise;
	let snapshot;
	publishPreparedModelRuntimeOwnerBatch({
		ownersToPublish: [owner],
		owners,
		agentBuildCompletions,
		buildTimeoutMs,
		registerEntriesAfterBuildStart: true,
		selectPluginGeneration: () => reusablePluginGeneration,
		pluginMetadataSnapshot
	}, {
		published: (isGenerationCurrent) => {
			assertPreparedModelRuntimeInputCurrent(input, isGenerationCurrent);
			snapshot = owner.snapshot;
			owner.pendingPluginGeneration = void 0;
			owner.pending = void 0;
		},
		failed: (refreshError, isGenerationCurrent) => {
			if (isGenerationCurrent()) {
				owner.pending = void 0;
				if (!owner.snapshot) retirePreparedModelRuntimeOwnerIfUnused(owners, key, owner);
			} else if (isPreparedModelRuntimePluginLifecycleFailure(refreshError)) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`, { cause: refreshError });
		}
	}).then(() => publication.resolve(snapshot), publication.reject);
	return await publication.promise;
}
//#endregion
//#region src/agents/prepared-model-runtime-auth-publication.ts
function partitionAuthMutationOwners(mutations) {
	const components = [];
	for (const invalidatedOwners of mutations) {
		const target = new Set(invalidatedOwners);
		let insertAt = components.length;
		for (let index = components.length - 1; index >= 0; index -= 1) {
			if (![...target].some((owner) => components[index].has(owner))) continue;
			insertAt = index;
			for (const owner of components[index]) target.add(owner);
			components.splice(index, 1);
		}
		components.splice(insertAt, 0, target);
	}
	return components.map((component) => Array.from(component));
}
var PreparedModelRuntimeAuthPublicationOwner = class {
	#events = [];
	#transaction;
	#drainTail = Promise.resolve();
	get hasPendingPublication() {
		return this.#transaction !== void 0;
	}
	enqueue(invalidatedOwners, profileSetChanged = false) {
		this.#events.push([...invalidatedOwners]);
		const transaction = this.#transaction ?? (this.#transaction = {
			ownerGates: /* @__PURE__ */ new Map(),
			publicationQueued: false,
			profileSetChanged: false
		});
		transaction.profileSetChanged ||= profileSetChanged;
		for (const owner of invalidatedOwners) {
			let gate = transaction.ownerGates.get(owner);
			if (!gate) {
				gate = createDeferredCore();
				transaction.ownerGates.set(owner, gate);
				gate.promise.catch(() => void 0);
			}
			owner.pending = gate.promise;
		}
		return transaction;
	}
	claimPublication(transaction) {
		if (transaction.publicationQueued) return false;
		transaction.publicationQueued = true;
		return true;
	}
	isCurrent(transaction) {
		return this.#transaction === transaction;
	}
	adopt(gateId) {
		if (this.#transaction) this.#transaction.adoptedBy = gateId;
	}
	adoptTransaction(transaction, gateId) {
		if (this.#transaction === transaction) transaction.adoptedBy = gateId;
	}
	prepareAdoptedCommit(gateId) {
		const transaction = this.#transaction;
		if (transaction?.adoptedBy !== gateId) return;
		this.clearOwnerGates(transaction);
		return transaction;
	}
	releaseAdopted(gateId) {
		if (this.#transaction?.adoptedBy === gateId) this.#transaction.adoptedBy = void 0;
	}
	resolve(transaction, owners) {
		if (this.#transaction !== transaction) return false;
		if (transaction.adoptedBy) this.#transaction = void 0;
		else if (transaction.ownerGates.size === 0) {
			this.#transaction = void 0;
			return true;
		} else return false;
		this.clearOwnerGates(transaction);
		for (const [owner, gate] of transaction.ownerGates) {
			const published = owners.get(ownerKey(owner.input)) ?? resolveConfiguredOwner(owners, owner.input);
			if (published?.snapshot && !published.needsRefresh && !published.pending) gate.resolve(published.snapshot);
			else gate.reject(new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${owner.input.agentDir}`));
		}
		return true;
	}
	settleComponent(transaction, componentOwners, owners, publishOwners) {
		if (this.#transaction !== transaction || transaction.adoptedBy) return;
		const queuedOwners = new Set(this.#events.flat());
		const completed = componentOwners.flatMap((owner) => {
			const gate = transaction.ownerGates.get(owner);
			return gate && !queuedOwners.has(owner) ? [{
				owner,
				gate
			}] : [];
		}).flatMap(({ owner, gate }) => owner.pending === gate.promise && owners.get(ownerKey(owner.input)) === owner && owner.snapshot && !owner.needsRefresh ? [{
			owner,
			gate,
			snapshot: owner.snapshot
		}] : []);
		for (const { owner } of completed) owner.pending = void 0;
		try {
			if (completed.length > 0) publishOwners(completed.map(({ owner }) => owner));
		} catch (error) {
			for (const { owner, gate } of completed) if (transaction.ownerGates.get(owner) === gate && owner.pending === void 0) owner.pending = gate.promise;
			throw error;
		}
		for (const { owner, gate, snapshot } of completed) {
			transaction.ownerGates.delete(owner);
			gate.resolve(snapshot);
		}
		this.rejectComponentOwners(transaction, componentOwners, new PreparedModelRuntimePublicationSupersededError("prepared model runtime auth publication owner was superseded"));
	}
	reject(transaction, error) {
		if (this.#transaction === transaction) this.#transaction = void 0;
		this.clearOwnerGates(transaction);
		for (const gate of transaction.ownerGates.values()) gate.reject(error);
	}
	rejectAdopted(gateId, error) {
		if (this.#transaction?.adoptedBy === gateId) this.reject(this.#transaction, error);
	}
	async drain(params) {
		const pending = this.#drainTail.then(() => this.drainNow(params));
		this.#drainTail = pending.then(() => void 0, () => void 0);
		await pending;
	}
	async drainNow(params) {
		while (this.#events.length > 0) {
			const components = partitionAuthMutationOwners(this.#events.splice(0));
			for (const componentOwners of components) {
				const owners = componentOwners.filter((owner) => params.owners.get(ownerKey(owner.input)) === owner);
				const reusedOwners = new Set(owners.filter((owner) => owner.pluginGeneration !== void 0));
				const gates = owners.flatMap((owner) => this.#transaction?.ownerGates.get(owner) ?? []);
				const retrying = gates.some((gate) => gate.retried);
				for (const gate of gates) gate.retried = retrying;
				try {
					if (owners.length > 0) {
						const publish = () => params.publish(owners, this.#transaction?.profileSetChanged === true, !retrying);
						await (retrying ? runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(publish)) : publish());
					}
					const transaction = this.#transaction;
					if (transaction) this.settleComponent(transaction, componentOwners, params.owners, params.publishOwners);
				} catch (error) {
					if (this.#transaction?.adoptedBy) throw error;
					const transaction = this.#transaction;
					const currentOwners = owners.filter((owner) => owner.pending !== void 0 && params.owners.get(ownerKey(owner.input)) === owner && transaction?.ownerGates.get(owner)?.promise === owner.pending);
					if (transaction && !retrying && isPreparedModelRuntimePluginLifecycleFailure(error) && currentOwners.some((owner) => reusedOwners.has(owner))) {
						for (const owner of currentOwners) transaction.ownerGates.get(owner).retried = true;
						this.#events.push(componentOwners);
						continue;
					}
					const failure = retrying ? new Error(`Auth-triggered model runtime refresh failed after 1 fresh-generation retry: ${toStringifiedError(error).message}`, { cause: error }) : error;
					if (transaction && this.rejectComponentOwners(transaction, componentOwners, failure, retrying) > 0) params.onOwnerFailure?.(failure);
				}
			}
		}
		params.commit?.();
	}
	reset(error) {
		if (this.#transaction) this.reject(this.#transaction, error);
		this.#events.length = 0;
	}
	clearOwnerGates(transaction) {
		for (const [owner, gate] of transaction.ownerGates) if (owner.pending === gate.promise) owner.pending = void 0;
	}
	rejectComponentOwners(transaction, componentOwners, error, recordRefreshError = false) {
		const queuedOwners = new Set(this.#events.flat());
		let rejected = 0;
		for (const owner of componentOwners) {
			if (queuedOwners.has(owner)) continue;
			const gate = transaction.ownerGates.get(owner);
			if (!gate) continue;
			if (owner.pending === gate.promise) {
				owner.pending = void 0;
				if (recordRefreshError && owner.needsRefresh) owner.refreshError = toStringifiedError(error);
			}
			transaction.ownerGates.delete(owner);
			gate.reject(error);
			rejected += 1;
		}
		return rejected;
	}
};
function invalidatePreparedModelRuntimeOwnersForAuthMutation(owners, normalizedEvent) {
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after auth mutation");
	const invalidatedOwners = [];
	const invalidatedConfiguredAgentIds = /* @__PURE__ */ new Set();
	for (const owner of owners.values()) {
		if (!owner.snapshot && owner.buildCompletion && !owner.authCaptureStarted && !owner.refreshError && owner.input.inheritedAuthDir === normalizeOptionalDir(resolveLegacyInheritedAuthDir(owner.input.config, owner.input.env)) || !normalizedEvent.affectsInheritedStores && owner.input.agentDir !== normalizedEvent.agentDir && owner.input.inheritedAuthDir !== normalizedEvent.agentDir) continue;
		invalidatedOwners.push(owner);
		owner.generation += 1;
		retirePreparedModelRuntimeGeneration(owner);
		owner.needsRefresh = true;
		owner.refreshError = staleError;
		if (normalizedEvent.profileSetChanged) owner.catalogStale = true;
		if (owner.provenance === "configured" && owner.input.agentId) invalidatedConfiguredAgentIds.add(owner.input.agentId);
	}
	for (const owner of invalidatedOwners) {
		if (owner.provenance !== "configured") continue;
		const inheritedAuthDir = normalizeOptionalDir(resolveLegacyInheritedAuthDir(owner.input.config, owner.input.env));
		if (owner.input.inheritedAuthDir === inheritedAuthDir) continue;
		const previousKey = ownerKey(owner.input);
		const input = normalizePreparedModelRuntimeInput({
			...owner.input,
			inheritedAuthDir
		});
		prepareModelRuntimeOwner(input, "configured", owner.catalogMode, owner);
		owners.delete(previousKey);
		const key = ownerKey(input);
		const previous = owners.get(key);
		owners.set(key, owner);
		if (previous && previous !== owner) retirePreparedModelRuntimeGeneration(previous);
	}
	return {
		invalidatedOwners,
		invalidatedConfiguredAgentIds
	};
}
//#endregion
//#region src/agents/prepared-model-runtime-lease.ts
/** Agent-run lease admission for lifecycle-owned prepared model runtimes. */
function createPreparedModelRuntimeAdmissionClaim(context) {
	let claimed;
	const release = () => {
		if (!claimed) return;
		const { key, owner } = claimed;
		claimed = void 0;
		owner.admissionCount = Math.max(0, (owner.admissionCount ?? 1) - 1);
		retirePreparedModelRuntimeOwnerIfUnused(context.owners, key, owner, context.retainedDirectRunOwners.has(key, owner) || context.retainedGatewayRunOwners.has(key, owner));
	};
	return {
		claim: (key, owner) => {
			if (claimed?.key === key && claimed.owner === owner) return;
			release();
			if (owner.provenance !== "run" && owner.provenance !== "ephemeral" || context.owners.get(key) !== owner) return;
			owner.admissionCount = (owner.admissionCount ?? 0) + 1;
			claimed = {
				key,
				owner
			};
		},
		release
	};
}
async function acquirePreparedModelRuntimeLeaseFromOwners(rawInput, provenance, context, options = {}) {
	const assertLifetime = context.captureLifetime();
	const assertAdmission = () => {
		assertLifetime();
		if (options.abortSignal?.aborted) throw createAbortError("Prepared model runtime lease admission aborted", { cause: options.abortSignal.reason });
	};
	let admittedGeneration = options.pluginGeneration;
	const deriveSelections = options.deriveRuntimePluginSelections;
	const requestedSelections = deriveSelections ? structuredClone(rawInput.runtimePluginSelections ?? []) : [];
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	let key = ownerKey(input);
	let owner;
	let snapshot;
	const admission = createPreparedModelRuntimeAdmissionClaim(context);
	let lastExternalPublication;
	let previousAttempt;
	let supersededPublication;
	for (;;) {
		admission.release();
		assertAdmission();
		const replacement = context.getPendingReplacement();
		const currentOwner = context.owners.get(key);
		const configuredCatalog = resolveConfiguredOwner(context.owners, input)?.pluginGeneration?.remoteCatalog;
		const attempt = [
			key,
			replacement,
			currentOwner,
			currentOwner?.generation,
			currentOwner?.snapshot,
			currentOwner?.pending,
			currentOwner?.needsRefresh,
			configuredCatalog,
			lastExternalPublication,
			admittedGeneration
		];
		if (previousAttempt?.every((value, index) => value === attempt[index])) throw supersededPublication ?? new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime lease admission made no publication progress for ${input.agentDir}; retry the request`);
		previousAttempt = attempt;
		supersededPublication = void 0;
		if (replacement) {
			lastExternalPublication = replacement.promise;
			assertPreparedModelRuntimeAdmissionCanWait();
			await racePromiseWithAbortSignal(replacement.promise, options.abortSignal);
			if (context.getPendingReplacement()) continue;
			assertAdmission();
		}
		if (provenance === "run" && !admittedGeneration && (replacement || context.getGatewayLifecycleActive())) try {
			input = rebindInputToCommittedConfiguredOwner(context.owners, input);
		} catch (error) {
			if (replacement || !isPreparedModelRuntimeMissingOwnerError(error)) throw error;
			const existing = context.owners.get(ownerKey(input));
			const staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
			if (!existing || staleDynamicOwner) {
				const canActivateConfiglessSetup = input.agentId !== void 0 && isReservedSystemAgentId(input.agentId);
				const configuredOwner = resolveConfiguredOwnerPublication(context.owners, input);
				if (configuredOwner.matches || !canActivateConfiglessSetup) {
					if (configuredOwner.pending) {
						assertPreparedModelRuntimeAdmissionCanWait(resolveConfiguredOwner(context.owners, input));
						lastExternalPublication = configuredOwner.pending;
						await racePromiseWithAbortSignal(configuredOwner.pending, options.abortSignal);
						continue;
					}
					throw error;
				}
			}
		}
		let pluginMetadataSnapshot = options.pluginMetadataSnapshot;
		if (deriveSelections) {
			pluginMetadataSnapshot = admittedGeneration?.pluginMetadataSnapshot ?? pluginMetadataSnapshot ?? resolvePluginMetadataSnapshot({
				config: input.config,
				env: input.env,
				workspaceDir: input.workspaceDir,
				allowWorkspaceScopedCurrent: true
			});
			const metadataSnapshot = pluginMetadataSnapshot;
			input = withPluginMetadataSnapshotScope(metadataSnapshot, () => {
				const derived = deriveSelections({
					config: input.config,
					metadataSnapshot
				});
				return normalizePreparedModelRuntimeInput({
					...input,
					runtimePluginSelections: [...requestedSelections, ...derived]
				});
			}, { trustConfigIdentity: true });
		}
		key = ownerKey(input);
		if (provenance === "run" && context.getGatewayLifecycleActive() && admittedGeneration) {
			const configuredOwner = resolveConfiguredOwner(context.owners, input);
			if (configuredOwner?.pending) {
				assertPreparedModelRuntimeAdmissionCanWait(configuredOwner);
				lastExternalPublication = configuredOwner.pending;
				await racePromiseWithAbortSignal(configuredOwner.pending.catch(() => void 0), options.abortSignal);
				continue;
			}
			if (configuredOwner && (configuredOwner.needsRefresh || configuredOwner.pluginGeneration !== admittedGeneration)) {
				const borrowed = getPreparedModelRuntimeBorrowedSnapshot(admittedGeneration);
				if (!configuredOwner.needsRefresh && borrowed && borrowed.metadataSnapshot === admittedGeneration.pluginMetadataSnapshot && preparedModelRuntimeConfigsMatch(borrowed.config, input.config) && borrowed.agentId === input.agentId && borrowed.agentDir === input.agentDir && borrowed.inheritedAuthDir === input.inheritedAuthDir && borrowed.workspaceDir === input.workspaceDir && (!input.allowGatewaySubagentBinding || borrowed.allowGatewaySubagentBinding) && !input.readOnly && !input.loadRuntimePlugins && !input.skipCredentials && !input.env) {
					if (preparedPluginGenerationSupportsSelections(admittedGeneration, input)) {
						assertAdmission();
						return {
							snapshot: borrowed,
							pluginGeneration: admittedGeneration,
							[Symbol.asyncDispose]: retainPreparedPluginGeneration(admittedGeneration)
						};
					}
					if (configuredOwner.pluginGeneration && configuredPreparedPluginGenerations.has(admittedGeneration)) {
						admittedGeneration = configuredOwner.pluginGeneration;
						continue;
					}
				}
				throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime plugin generation was superseded for ${input.agentDir}`);
			}
		}
		if (provenance === "run" && context.getGatewayLifecycleActive() && options.catalogMode === "static" && !admittedGeneration && !options.pluginMetadataSnapshot && !input.readOnly && !input.loadRuntimePlugins && !input.skipCredentials) {
			const configuredOwner = resolveConfiguredOwner(context.owners, input);
			const configuredSnapshot = configuredOwner?.snapshot;
			const generation = configuredOwner?.pluginGeneration;
			if (configuredOwner && configuredSnapshot && generation && !configuredOwner.pending && !configuredOwner.needsRefresh && !configuredOwner.refreshError && configuredSnapshot.isCurrent() && configuredSnapshot.config === input.config && ownerKey({
				...configuredOwner.input,
				runtimePluginSelections: void 0
			}) === ownerKey({
				...input,
				runtimePluginSelections: void 0
			}) && (!pluginMetadataSnapshot || pluginMetadataSnapshot === generation.pluginMetadataSnapshot) && preparedPluginGenerationSupportsSelections(generation, input)) {
				owner = configuredOwner;
				snapshot = configuredSnapshot;
				break;
			}
		}
		const existing = context.owners.get(key);
		const staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
		const ownerGenerationChanged = admittedGeneration !== void 0 && !preparedPluginGenerationReusesBase(existing?.pending ? existing.pendingPluginGeneration : existing?.pluginGeneration, admittedGeneration) || options.catalogMode === "live" && existing?.catalogMode === "static";
		if (existing?.pending && ownerGenerationChanged) {
			assertPreparedModelRuntimeAdmissionCanWait(existing);
			lastExternalPublication = existing.pending;
			await racePromiseWithAbortSignal(existing.pending.catch(() => void 0), options.abortSignal);
			continue;
		}
		try {
			if (existing?.pending && !ownerGenerationChanged) {
				assertPreparedModelRuntimeAdmissionCanWait(existing);
				admission.claim(key, existing);
				lastExternalPublication = existing.pending;
				snapshot = await racePromiseWithAbortSignal(existing.pending, options.abortSignal);
				if (existing.snapshot !== snapshot || existing.needsRefresh) continue;
				owner = existing;
				break;
			}
			if (existing && !staleDynamicOwner && !ownerGenerationChanged) {
				if (existing.needsRefresh) throw existing.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
				if (!existing.snapshot || input.readOnly && !preparedModelRuntimeConfigsMatch(existing.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
				snapshot = existing.snapshot;
			} else {
				const publication = publishModelRuntimeSnapshot(input, context.owners, context.agentBuildCompletions, context.getBuildTimeoutMs(), void 0, provenance, options.catalogMode, admittedGeneration, pluginMetadataSnapshot);
				const publishingOwner = context.owners.get(key);
				if (publishingOwner) admission.claim(key, publishingOwner);
				snapshot = await racePromiseWithAbortSignal(publication, options.abortSignal);
			}
		} catch (error) {
			admission.release();
			if (error instanceof PreparedModelRuntimePublicationSupersededError) {
				supersededPublication = error;
				continue;
			}
			if (context.getPendingReplacement() && isPreparedModelRuntimePluginLifecycleFailure(error)) continue;
			throw error;
		}
		const published = context.owners.get(key);
		if (context.getPendingReplacement() || !published || published.snapshot !== snapshot || published.needsRefresh || published.pending) continue;
		admission.claim(key, published);
		owner = published;
		break;
	}
	try {
		assertAdmission();
		const configuredOwner = resolveConfiguredOwner(context.owners, input);
		const catalogOwner = configuredOwner && ownerKey({
			...configuredOwner.input,
			loadRuntimePlugins: false,
			runtimePluginSelections: void 0
		}) === ownerKey({
			...input,
			loadRuntimePlugins: false,
			runtimePluginSelections: void 0
		}) ? configuredOwner : owner;
		snapshot = capturePreparedModelRuntimeCatalog(snapshot, catalogOwner.snapshot);
		const pluginGeneration = owner.pluginGeneration;
		if (owner.provenance !== provenance) return {
			snapshot,
			pluginGeneration,
			[Symbol.asyncDispose]: retainPreparedPluginGeneration(pluginGeneration)
		};
		assertAdmission();
		if (provenance === "run" && options.retainIdleRunOwner) context.retainedDirectRunOwners.retain(key, owner, context.owners);
		else if (provenance === "run" && context.getGatewayLifecycleActive()) context.retainedGatewayRunOwners.retain(key, owner, context.owners);
		const releaseGeneration = retainPreparedPluginGeneration(pluginGeneration);
		owner.leaseCount = (owner.leaseCount ?? 0) + 1;
		admission.release();
		let released = false;
		return {
			snapshot,
			pluginGeneration,
			[Symbol.asyncDispose]: async () => {
				if (released) return;
				released = true;
				owner.leaseCount = Math.max(0, (owner.leaseCount ?? 1) - 1);
				retirePreparedModelRuntimeOwnerIfUnused(context.owners, key, owner, context.retainedDirectRunOwners.has(key, owner) || context.retainedGatewayRunOwners.has(key, owner));
				await releaseGeneration();
			}
		};
	} finally {
		admission.release();
	}
}
//#endregion
//#region src/agents/prepared-model-runtime-materializations.ts
function configuredOwnersAreRequestVisible(owners) {
	for (const owner of owners.values()) {
		if (owner.provenance !== "configured") continue;
		if (!owner.snapshot || owner.needsRefresh || owner.pending) return false;
	}
	return true;
}
function registerPreparedRuntimeAuthMaterializationPublisher(owners, notify) {
	return registerRuntimeAuthMaterializationMutationListener((event) => {
		const agentDir = normalizeOptionalDir(event.agentDir);
		const affectedOwners = [...owners.values()].flatMap((owner) => {
			return (event.affectsInheritedStores || owner.input.agentDir === agentDir || owner.input.inheritedAuthDir === agentDir) && owner.snapshot && !owner.pending && !owner.needsRefresh ? [{
				owner,
				snapshot: owner.snapshot
			}] : [];
		});
		if (affectedOwners.length === 0) return;
		for (const { owner, snapshot } of affectedOwners) bindPreparedModelRuntimeAuth(snapshot, { materializations: Object.freeze([...getPreparedRuntimeAuthMaterializations(owner.input.agentDir)]) });
		if (!configuredOwnersAreRequestVisible(owners)) return;
		notify({
			phase: "invalidated",
			modelFactsChanged: false
		});
		notify({
			phase: "published",
			modelFactsChanged: false
		});
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.refresh-scope.ts
const log$1 = createSubsystemLogger("agents/prepared-model-runtime");
function refreshCommittedProviderCatalogs(owners) {
	for (const owner of owners) {
		if (owner.provenance !== "configured" || owner.pending || owner.needsRefresh) continue;
		owner.snapshot?.loadFullModelCatalog?.({ changedOnly: true }).catch((error) => {
			if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) log$1.warn(`provider catalog refresh failed: ${formatErrorMessage(error)}`);
		});
	}
}
/** Retains provider inventory across runtime selection; rebuilds check its source and auth. */
function collectPreparedModelRuntimeInventories(owners) {
	const inventories = /* @__PURE__ */ new Map();
	for (const owner of owners) if (owner.provenance === "configured" && owner.catalogInventory) inventories.set(ownerKey({
		...owner.input,
		runtimePluginSelections: void 0
	}), owner.catalogInventory);
	return inventories;
}
/** Whether a refresh scope must replace this owner rather than retain it. */
function isPreparedModelRuntimeOwnerInRefreshScope(owner, agentIds) {
	if (!agentIds) return true;
	if (owner.input.readOnly || owner.provenance !== "configured" && owner.provenance !== "run") return true;
	return !owner.input.agentId || agentIds.has(owner.input.agentId);
}
/** Builds configured inputs while preserving the startup-selected default workspace. */
function listConfiguredRefreshInputs(config, options, owners) {
	const preservedWorkspaceByAgentDir = /* @__PURE__ */ new Map();
	for (const owner of owners.values()) {
		const { agentDir, agentId, preserveWorkspaceDirOnRefresh, workspaceDir } = owner.input;
		if (owner.provenance !== "configured" || !agentId || !preserveWorkspaceDirOnRefresh || !workspaceDir) continue;
		let workspacesByDir = preservedWorkspaceByAgentDir.get(agentId);
		if (!workspacesByDir) {
			workspacesByDir = /* @__PURE__ */ new Map();
			preservedWorkspaceByAgentDir.set(agentId, workspacesByDir);
		}
		if (!workspacesByDir.has(agentDir)) workspacesByDir.set(agentDir, workspaceDir);
	}
	return withAgentRosterFactsBatch(config, () => listConfiguredOwnerInputs(config, options.defaultWorkspaceDir, options.allowGatewaySubagentBinding, preservedWorkspaceByAgentDir).map(normalizePreparedModelRuntimeInput));
}
/** Invalidates scoped owners and optionally advances retained owners to a new config stamp. */
function updateOwnersForScopedRefresh(owners, agentIds, staleError, options = {}) {
	const retiredPublications = [];
	for (const [key, owner] of owners) {
		if (!isPreparedModelRuntimeOwnerInRefreshScope(owner, agentIds)) {
			if (options.retainedConfig) advancePreparedModelRuntimeOwnerConfig(owner, options.retainedConfig);
			continue;
		}
		if (options.retireStandalone && owner.provenance === "standalone") {
			owner.generation += 1;
			owners.delete(key);
			retirePreparedModelRuntimeGeneration(owner);
			retiredPublications.push(owner);
			continue;
		}
		owner.generation += 1;
		retirePreparedModelRuntimeGeneration(owner);
		owner.needsRefresh = true;
		owner.refreshError = staleError;
		if (options.clearPending) owner.pending = void 0;
		if (options.resetPluginGeneration) {
			owner.pluginGeneration = void 0;
			retiredPublications.push(owner);
		}
	}
	retiredPublications.forEach(releasePreparedPluginPublication);
}
/** Keeps a requested scope only when every retained owner has identical prepared dependencies. */
function resolveSafeRefreshAgentIds(config, options, owners) {
	const requested = options.agentIds;
	if (!requested) return;
	const inputs = new Map(listConfiguredRefreshInputs(config, options, owners).flatMap((input) => input.agentId ? [[input.agentId, input]] : []));
	for (const owner of owners.values()) {
		if (owner.provenance !== "configured" || !owner.input.agentId || requested.has(owner.input.agentId)) continue;
		const input = inputs.get(owner.input.agentId);
		if (!input || !owner.snapshot || owner.needsRefresh || owner.catalogMode !== (options.catalogMode ?? "live") || options.pluginMetadataSnapshot && owner.snapshot.metadataSnapshot !== options.pluginMetadataSnapshot || ownerKey({
			...owner.input,
			config: input.config
		}) !== ownerKey(input)) return;
	}
	return requested;
}
/** A retired Gateway lender cannot leave a live configured publication without a successor. */
function createPreparedModelRuntimePluginRecovery(owners, canRecover, publish) {
	return (owner) => {
		if (!canRecover() || owner.provenance !== "configured" || owner.pending || owners.get(ownerKey(owner.input)) !== owner) return;
		runInDetachedAsyncContext(async () => {
			try {
				await publish(() => owner.input.config, {
					catalogMode: "static",
					allowGatewaySubagentBinding: true
				});
			} catch (error) {
				if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) log$1.warn(`retired plugin generation refresh failed: ${formatErrorMessage(error)}`);
			}
		});
	};
}
/** A failed shared catalog isolate retires its borrowers through the publication owner. */
function createPreparedModelRuntimeCatalogRecovery(owners, publish) {
	return async (borrowers) => {
		const failed = new Map(borrowers.filter((borrower) => borrower.isCurrent()).map((borrower) => [borrower.agentDir, borrower]));
		const affected = [...owners.values()].filter((owner) => owner.provenance === "configured" && !owner.needsRefresh && !owner.pending && owner.input.agentId && owner.snapshot && failed.get(owner.input.agentDir)?.isCurrent());
		const first = affected[0];
		if (!first?.snapshot) return;
		await publish(first.input.config, {
			catalogMode: "static",
			allowGatewaySubagentBinding: true,
			agentIds: new Set(affected.flatMap((owner) => owner.input.agentId ? [owner.input.agentId] : [])),
			pluginMetadataSnapshot: first.snapshot.metadataSnapshot
		});
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-refresh.ts
const MAX_REMOTE_CATALOG_ADOPTION_ATTEMPTS = 3;
/** Binds the prepared runtime's publication host to the catalog adoption operations. */
function createRemoteCatalogPublication(host) {
	return {
		applyRemoteModelCatalogUpdate: applyRemoteModelCatalogUpdateNow.bind(null, host),
		advancePreparedModelRuntimeConfig: advancePreparedModelRuntimeConfigNow.bind(null, host),
		/** Runtime close ends a pending adoption, including preparation still awaiting I/O. */
		cancel: (reason) => {
			host.pending?.controller.abort(reason);
			host.pending = void 0;
		}
	};
}
/** Advances model-neutral config identity without rebuilding prepared generation artifacts. */
function advancePreparedModelRuntimeConfigNow(host, config) {
	const pending = host.pending;
	if (pending?.attempt && !pending.attempt.signal.aborted && captureRemoteModelCatalogStartupSnapshot() !== pending.catalog) pending.attempt.abort(new PreparedModelRuntimePublicationSupersededError("Config changed during remote catalog preparation"));
	for (const owner of host.owners.values()) if (!owner.input.readOnly) advancePreparedModelRuntimeOwnerConfig(owner, config);
	host.replyDispatchPublication.advanceConfig(config);
}
/** Downloads become visible only after an independently prepared rows/pricing generation commits. */
function applyRemoteModelCatalogUpdateNow(host, getConfig, signal) {
	signal?.throwIfAborted();
	const assertLifetime = host.captureLifetime();
	const completion = host.publicationQueue.track(runOutsideRemoteModelCatalogSnapshot(async () => {
		let config;
		let update;
		do {
			config = getConfig();
			update = await readRemoteModelCatalogUpdate(config);
			assertLifetime();
			const replacement = update ? host.getPendingReplacement() : void 0;
			if (replacement) {
				await replacement;
				assertLifetime();
			}
		} while (!preparedModelRuntimeConfigsMatch(config, getConfig()));
		if (!update) return "unchanged";
		const catalog = update;
		let previous = captureRemoteModelCatalogStartupSnapshot();
		if (previous?.sourceUrl === catalog.sourceUrl) {
			if (previous.revision === catalog.revision) return "unchanged";
			if (previous.generatedAt > catalog.generatedAt) return "superseded";
		}
		const pending = host.pending;
		if (pending?.catalog.sourceUrl === catalog.sourceUrl) {
			if (pending.catalog.revision === catalog.revision && pending.isCurrent()) return await pending.completion;
			if (pending.catalog.generatedAt > catalog.generatedAt) return "superseded";
		}
		if (pending?.isCurrent()) pending.controller.abort(new PreparedModelRuntimePublicationSupersededError("A newer remote catalog was accepted"));
		const controller = new AbortController();
		const isCurrent = () => !controller.signal.aborted && host.pending?.controller === controller && captureRemoteModelCatalogStartupSnapshot() === previous;
		const adoption = {
			catalog,
			controller,
			completion,
			isCurrent
		};
		host.pending = adoption;
		const publishAttempt = async (attemptConfig) => {
			const attempt = new AbortController();
			const abortAttempt = () => attempt.abort(controller.signal.reason);
			controller.signal.addEventListener("abort", abortAttempt, { once: true });
			adoption.attempt = attempt;
			const epoch = host.getEpoch();
			try {
				return await withRemoteModelCatalogSnapshot(catalog, () => publishPreparedModelRuntimeCatalogReplacement({
					owners: host.owners,
					agentBuildCompletions: host.agentBuildCompletions,
					buildTimeoutMs: host.getBuildTimeoutMs(),
					onPluginGenerationRetired: host.onPluginGenerationRetired,
					controller: attempt,
					signal: host.getCancellationSignal(),
					isPublicationCurrent: () => isCurrent() && !host.getPendingReplacement() && !attempt.signal.aborted && host.getEpoch() === epoch && preparedModelRuntimeConfigsMatch(attemptConfig, getConfig()),
					prepareCommit: (candidates) => {
						const commitDispatch = host.replyDispatchPublication.stage(candidates);
						return () => {
							if (!publishRemoteModelCatalogSnapshot(catalog, previous)) throw new PreparedModelRuntimePublicationSupersededError("Remote catalog publication lost its accepted predecessor");
							previous = null;
							commitDispatch();
						};
					},
					commit: (publish) => host.publicationQueue.enqueue(async () => {
						assertLifetime();
						publish();
					})
				}));
			} catch (error) {
				if (error instanceof PreparedModelRuntimePublicationSupersededError || attempt.signal.aborted || host.getEpoch() !== epoch) return false;
				throw error;
			} finally {
				controller.signal.removeEventListener("abort", abortAttempt);
				if (adoption.attempt === attempt) adoption.attempt = void 0;
			}
		};
		try {
			for (let attempt = 1;; attempt += 1) {
				if (await publishAttempt(config)) {
					notifyPreparedModelRuntimePublication({ phase: "published" });
					return "published";
				}
				const settlements = isCurrent() && attempt < MAX_REMOTE_CATALOG_ADOPTION_ATTEMPTS ? configuredOwnerSettlements(host) : void 0;
				if (!settlements) return "superseded";
				await racePromiseWithAbortSignal(Promise.allSettled(settlements), controller.signal);
				assertLifetime();
				config = getConfig();
				const latest = await readRemoteModelCatalogUpdate(config);
				assertLifetime();
				if (latest?.revision !== catalog.revision || !isCurrent()) return "superseded";
			}
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError || !isCurrent()) return "superseded";
			throw error;
		} finally {
			if (host.pending === adoption) host.pending = void 0;
		}
	}));
	return racePromiseWithAbortSignal(completion, signal);
}
/** Rebuilds active owners after config/plugin runtime publication. */
async function refreshPreparedModelRuntimeSnapshotsNow(config, options, context) {
	const { owners, agentBuildCompletions, gatewayLifecycleActive, isPublicationCurrent, progress } = context;
	const catalogMode = options.catalogMode ?? "live";
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after config publication");
	const inventories = collectPreparedModelRuntimeInventories(owners.values());
	updateOwnersForScopedRefresh(owners, options.agentIds, staleError, { retainedConfig: config });
	const entries = [];
	const knownKeys = /* @__PURE__ */ new Set();
	for (const input of listConfiguredRefreshInputs(config, options, owners)) {
		if (options.agentIds && input.agentId && !options.agentIds.has(input.agentId)) continue;
		const key = ownerKey(input);
		if (knownKeys.has(key)) continue;
		knownKeys.add(key);
		const owner = owners.get(key);
		entries.push({
			owner,
			input
		});
	}
	for (const [key, owner] of owners) {
		if (!isPreparedModelRuntimeOwnerInRefreshScope(owner, options.agentIds)) continue;
		if (!knownKeys.has(key) && (gatewayLifecycleActive || owner.provenance === "configured")) {
			owners.delete(key);
			retirePreparedModelRuntimeGeneration(owner);
			releasePreparedPluginPublication(owner);
		}
	}
	await publishPreparedModelRuntimeOwnerBatch({
		ownersToPublish: entries.map(({ owner: existing, input }) => {
			const owner = prepareModelRuntimeOwner(input, "configured", catalogMode, existing?.provenance === "configured" ? existing : void 0);
			owner.onPluginGenerationRetired = () => context.onPluginGenerationRetired(owner);
			owner.catalogInventory = inventories.get(ownerKey({
				...input,
				runtimePluginSelections: void 0
			}));
			return owner;
		}),
		owners,
		agentBuildCompletions,
		buildTimeoutMs: progress ? void 0 : context.buildTimeoutMs,
		isPublicationCurrent,
		isBuildCurrent: isPublicationCurrent,
		onBuildStats: options.onBuildStats,
		pluginMetadataSnapshot: options.pluginMetadataSnapshot,
		registerEntriesAfterBuildStart: true,
		progress,
		acquisitionSignal: context.acquisitionSignal
	});
}
/**
* Publication gates whose settlement can make every configured owner claimable again.
* Replacement and owner gates settle when their publication commits, fails, or times out;
* a raw build completion can outlive a timed-out build, so an owner without a gate
* (including a failed build) cannot progress until its next admission and ends this adoption.
*/
function configuredOwnerSettlements(host) {
	const replacement = host.getPendingReplacement();
	if (replacement) return [replacement];
	const settlements = [];
	let configured = false;
	for (const owner of host.owners.values()) {
		if (owner.provenance !== "configured") continue;
		configured = true;
		if (owner.pending) settlements.push(owner.pending);
		else if (!owner.snapshot || owner.needsRefresh) return;
	}
	return configured ? settlements : void 0;
}
/** Builds privately; only the final serialized commit replaces request-visible owners. */
async function publishPreparedModelRuntimeCatalogReplacement(params) {
	const claims = [...params.owners.values()].filter((owner) => owner.provenance === "configured").map((owner) => ({
		owner,
		generation: owner.generation,
		input: owner.input
	}));
	if (!claims.length || claims.some(({ owner }) => !owner.snapshot || owner.needsRefresh || owner.pending !== void 0)) return false;
	const controller = params.controller;
	let parentSignals = [params.signal, ...claims.map(({ owner }) => capturePreparedModelRuntimeGeneration(owner))];
	const abortPreparation = () => {
		if (!controller.signal.aborted) controller.abort(new PreparedModelRuntimePublicationSupersededError("A captured model owner retired during remote catalog preparation"));
	};
	const stopWatchingParents = () => {
		for (const signal of parentSignals) signal.removeEventListener("abort", abortPreparation);
		parentSignals = [];
	};
	for (const signal of parentSignals) signal.addEventListener("abort", abortPreparation, { once: true });
	if (parentSignals.some((signal) => signal.aborted)) abortPreparation();
	const staged = /* @__PURE__ */ new Map();
	let committed = false;
	const isCurrent = () => !controller.signal.aborted && params.isPublicationCurrent() && claims.every(({ owner, generation, input }) => params.owners.get(ownerKey(input)) === owner && owner.generation === generation && owner.input === input && !owner.needsRefresh && !owner.pending);
	const assertCurrent = () => {
		if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("remote catalog publication was superseded");
	};
	const candidates = claims.map(({ input, generation }) => {
		const candidate = prepareModelRuntimeOwner(input, "configured", "static");
		candidate.generation = generation;
		candidate.onPluginGenerationRetired = () => {
			if (committed) params.onPluginGenerationRetired(candidate);
			else abortPreparation();
		};
		return candidate;
	});
	const retireCandidates = () => {
		for (const owner of candidates) {
			owner.generation += 1;
			retirePreparedModelRuntimeGeneration(owner);
		}
	};
	controller.signal.addEventListener("abort", retireCandidates, { once: true });
	try {
		assertCurrent();
		await publishPreparedModelRuntimeOwnerBatch({
			ownersToPublish: candidates,
			owners: staged,
			agentBuildCompletions: params.agentBuildCompletions,
			buildTimeoutMs: params.buildTimeoutMs,
			registerEntriesAfterBuildStart: true,
			acquisitionSignal: controller.signal,
			isPublicationCurrent: () => committed || isCurrent(),
			isOwnerRegistered: (key, owner) => (committed ? params.owners : staged).get(key) === owner,
			isOwnerPublished: (key, owner) => committed && params.owners.get(key) === owner
		});
		const pricingSignal = AbortSignal.any([controller.signal, AbortSignal.timeout(params.buildTimeoutMs)]);
		for (const config of new Set(candidates.map((owner) => owner.input.config))) await racePromiseWithAbortSignal(prepareModelPricingContext(config), pricingSignal);
		await params.commit(() => {
			assertCurrent();
			if (candidates.some((owner) => owner.needsRefresh || !owner.pluginGeneration)) throw new PreparedModelRuntimePublicationSupersededError("A remote catalog candidate's plugin generation retired before publication");
			const commit = params.prepareCommit(candidates);
			assertCurrent();
			commit();
			for (const owner of candidates) params.owners.set(ownerKey(owner.input), owner);
			committed = true;
			stopWatchingParents();
			controller.signal.removeEventListener("abort", retireCandidates);
			for (const owner of params.owners.values()) if (owner.provenance !== "configured") owner.needsRefresh = true;
			for (const { owner } of claims) {
				owner.generation += 1;
				retirePreparedModelRuntimeGeneration(owner);
				releasePreparedPluginPublication(owner);
			}
			claims.length = 0;
			staged.clear();
		});
		for (const owner of candidates) owner.snapshot?.loadFullModelCatalog?.({ refresh: true }).catch(() => void 0);
		return true;
	} catch (error) {
		if (!committed && !(error instanceof PreparedModelRuntimePublicationSupersededError) && !isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Remote catalog preparation lost its captured owners", { cause: error });
		throw error;
	} finally {
		stopWatchingParents();
		controller.signal.removeEventListener("abort", retireCandidates);
		if (!committed) {
			retireCandidates();
			for (const owner of candidates) releasePreparedPluginPublication(owner);
			const discarded = [];
			for (const owner of candidates) if (owner.pluginGeneration) discarded.push(discardPreparedPluginGeneration(owner.pluginGeneration));
			await Promise.all(discarded);
		}
	}
}
//#endregion
//#region src/agents/prepared-model-runtime.publication-queue.ts
/** Publication scheduling may finish before acquisition; shutdown joins both. */
var PreparedModelRuntimePublicationQueue = class {
	#tail = Promise.resolve();
	#pending = /* @__PURE__ */ new Set();
	#latestRefresh;
	track(work) {
		this.#pending.add(work);
		const settled = () => {
			this.#pending.delete(work);
		};
		work.then(settled, settled);
		return work;
	}
	enqueue(task, release) {
		const previous = this.#tail;
		const publication = this.track(previous.then(() => runOutsideRemoteModelCatalogSnapshot(task)));
		this.#tail = (release ? previous.then(() => Promise.race([publication, release])) : publication).then(() => void 0, () => void 0);
		return publication;
	}
	complete(publication, isCurrent, options, startup) {
		const assertLifetime = capturePreparedModelRuntimeLifetime();
		const refresh = {
			completion: publication,
			isCurrent
		};
		this.#latestRefresh = refresh;
		if (!options.joinSupersedingPublication) return startup ? startup.wait(publication) : publication;
		return (async () => {
			let current = refresh;
			for (;;) {
				assertLifetime();
				try {
					await current.completion;
				} catch (error) {
					if (!(error instanceof PreparedModelRuntimePublicationSupersededError) || !this.#latestRefresh || this.#latestRefresh === current) throw error;
				}
				assertLifetime();
				if (this.#latestRefresh && this.#latestRefresh !== current) {
					current = this.#latestRefresh;
					continue;
				}
				if (!current.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("prepared model runtime publication was superseded without a current replacement refresh");
				return;
			}
		})();
	}
	async settle() {
		this.#latestRefresh = void 0;
		await Promise.allSettled(this.#pending);
	}
};
//#endregion
//#region src/agents/prepared-model-runtime.published-owner.ts
async function refreshPublishedModelRuntimeCatalog(snapshot, owners, options) {
	const owner = resolvePreparedModelRuntimeOwnerBySnapshot(snapshot);
	if (!owner || owners.get(ownerKey(owner.input)) !== owner || !snapshot.loadFullModelCatalog) return;
	const currentCatalog = snapshot.readFullModelCatalog?.() ?? snapshot.modelCatalog;
	const refresh = options.refresh === true || owner.catalogStale;
	if (!refresh && !options.providerIds && !options.changedOnly && isPreparedModelCatalogFull(currentCatalog)) return;
	const generation = owner.generation;
	const catalog = await snapshot.loadFullModelCatalog({
		...options,
		refresh
	});
	if (owner.catalogStale && !catalog.pendingProviders?.length && owner.generation === generation && owners.get(ownerKey(owner.input)) === owner) owner.catalogStale = false;
	return catalog;
}
function retainPublishedModelRuntimeOwner(owner, snapshot) {
	const pluginGeneration = owner.pluginGeneration;
	if (!pluginGeneration) throw new Error("Published model runtime has no plugin generation");
	return {
		snapshot: capturePreparedModelRuntimeCatalog(snapshot, snapshot),
		pluginGeneration,
		[Symbol.asyncDispose]: retainPreparedPluginGeneration(pluginGeneration)
	};
}
/** Loads a published owner or delegates missing-owner activation to its lifecycle boundary. */
async function loadPreparedModelRuntimeOwner(rawInput, context, activateStandalone, project) {
	const assertLifetime = context.captureLifetime();
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	for (;;) {
		assertLifetime();
		const replacement = context.getPendingReplacement();
		if (replacement) {
			assertPreparedModelRuntimeAdmissionCanWait();
			await replacement.promise;
			if (context.getPendingReplacement()) continue;
			input = rebindInputToCommittedConfiguredOwner(context.owners, input);
			continue;
		}
		try {
			return await projectPublishedModelRuntimeOwner(input, context, project);
		} catch (error) {
			if (!isPreparedModelRuntimeMissingOwnerError(error)) throw error;
		}
		if (context.getPendingReplacement()) continue;
		assertLifetime();
		const activated = await activateStandalone(input);
		if (context.getPendingReplacement()) continue;
		try {
			return await projectPublishedModelRuntimeOwner(input, context, project);
		} catch (error) {
			if (!activated || !isPreparedModelRuntimeMissingOwnerError(error)) throw error;
		}
	}
}
/** Bind passive reads and retained acquisitions to the same publication owner. */
function createPublishedModelRuntimeAccess(context, getPublishedReplacement) {
	const readContext = {
		...context,
		getPendingReplacement: getPublishedReplacement
	};
	return {
		acquire: (input) => projectPublishedModelRuntimeOwner(input, context, retainPublishedModelRuntimeOwner),
		prepare: (input, options = {}) => projectPublishedModelRuntimeOwner(input, options.readPublished ? readContext : context, (_owner, snapshot) => snapshot)
	};
}
/** Project or retain the exact published owner before its snapshot crosses an await. */
async function projectPublishedModelRuntimeOwner(rawInput, context, project) {
	const assertLifetime = context.captureLifetime();
	const replacement = context.getPendingReplacement();
	if (replacement) {
		assertPreparedModelRuntimeAdmissionCanWait();
		await replacement.promise;
		assertLifetime();
		return await projectPublishedModelRuntimeOwner(rawInput, context, project);
	}
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = resolvePublishedOwner(context.owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
	if (input.readOnly && existing && !preparedModelRuntimeConfigsMatch(existing.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared read-only model runtime owner was not published for the requested config (${input.agentDir})`);
	if (existing?.pending) {
		assertPreparedModelRuntimeAdmissionCanWait(existing);
		try {
			await existing.pending;
		} catch {}
		assertLifetime();
		return await projectPublishedModelRuntimeOwner(rawInput, context, project);
	}
	if (existing?.needsRefresh) throw existing.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
	if (existing?.snapshot) return project(existing, existing.snapshot);
	throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
}
//#endregion
//#region src/agents/prepared-model-runtime.startup.ts
/** The startup wait is bounded; each published agent still owns complete runtime/auth facts. */
var PreparedModelRuntimeStartup = class {
	#foreground;
	#stage;
	constructor(host) {
		this.host = host;
		this.#foreground = createDeferredCore();
		this.#stage = "previous generation completion";
		this.release = this.#foreground.promise;
		this.progress = {
			onStage: (stage) => {
				this.#stage = stage;
				this.update();
			},
			onPublished: () => this.update(true)
		};
	}
	update(publish = false) {
		if (!this.host.isCurrent()) return;
		const configured = [...this.host.owners()].filter((owner) => owner.provenance === "configured");
		setPreparedModelRuntimeStartupStatus({
			degraded: this.host.replacement.degraded === true,
			pendingAgents: configured.flatMap((owner) => owner.needsRefresh || !owner.snapshot || owner.pending ? [owner.input.agentId ?? owner.input.agentDir] : []),
			stage: this.#stage
		});
		if (publish && this.host.replacement.degraded) this.host.publish(configured.filter((owner) => owner.snapshot && !owner.needsRefresh && !owner.pending));
	}
	complete() {
		setPreparedModelRuntimeStartupStatus({
			degraded: false,
			pendingAgents: []
		});
	}
	wait(publication) {
		const timer = setTimeout(() => {
			if (this.host.isCurrent()) {
				this.host.replacement.degraded = true;
				this.host.onDegraded(() => this.update(true));
				this.update(true);
				const pending = [...this.host.owners()].filter((owner) => owner.needsRefresh || !owner.snapshot);
				this.host.warn(`prepared model runtime startup degraded after ${this.host.timeoutMs}ms (${this.#stage}); still acquiring agents: ${pending.map((owner) => owner.input.agentId ?? owner.input.agentDir).join(", ")}; acquisition continues in the background`);
				this.host.replacement.resolve();
			}
			this.#foreground.resolve();
		}, this.host.timeoutMs);
		timer.unref?.();
		publication.catch((error) => {
			if (this.host.replacement.degraded) this.host.warn(`background model runtime publication failed: ${String(error)}`);
		});
		return Promise.race([publication, this.release]).finally(() => clearTimeout(timer));
	}
};
//#endregion
//#region src/agents/prepared-reply-dispatch-runtime.ts
const EMPTY_REPLY_DISPATCH_PUBLICATION = Object.freeze([]);
function createReplyDispatchRuntime(runtimeOwner) {
	const snapshot = runtimeOwner.snapshot;
	const owner = resolvePublishedModelCatalogOwner(snapshot);
	const pluginGeneration = runtimeOwner.pluginGeneration;
	const inboundPluginRegistry = pluginGeneration?.inboundPluginRegistry;
	if (!pluginGeneration || !inboundPluginRegistry) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared inbound plugin registry was not published for ${snapshot.agentDir}`);
	return Object.freeze({
		agentId: owner.agentId,
		agentDir: owner.agentDir,
		workspaceDir: owner.workspaceDir,
		config: owner.config,
		modelCatalog: owner.modelCatalog,
		readFullModelCatalog: snapshot.readFullModelCatalog,
		inboundPluginRegistry,
		pluginGeneration
	});
}
function buildReplyDispatchPublication(owners) {
	const runtimes = [...owners].filter((owner) => owner.provenance === "configured").map((owner) => {
		if (!owner.snapshot || owner.needsRefresh || owner.pending) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared reply dispatch runtime owner was not published for ${owner.input.agentId ?? owner.input.agentDir}`);
		return createReplyDispatchRuntime(owner);
	}).toSorted((left, right) => left.agentId.localeCompare(right.agentId));
	if (new Set(runtimes.map((runtime) => runtime.agentId)).size !== runtimes.length) throw new PreparedModelRuntimeOwnerNotPublishedError("prepared reply dispatch runtime publication contains duplicate configured agents");
	return Object.freeze(runtimes);
}
/** Reads one immutable configured Gateway dispatch generation without activating an owner. */
var PreparedReplyDispatchPublicationOwner = class {
	#publication;
	#changed;
	constructor(host) {
		this.host = host;
		this.#publication = EMPTY_REPLY_DISPATCH_PUBLICATION;
		this.#changed = createDeferredCore();
		this.load = async ({ agentId, abortSignal, onRuntimeLease }) => {
			for (;;) {
				if (abortSignal?.aborted) throw createAbortError("Prepared reply dispatch admission aborted", { cause: abortSignal.reason });
				if (!this.host.isGatewayLifecycleActive()) return;
				const replacement = this.host.getPendingReplacement();
				if (replacement) {
					assertPreparedModelRuntimeAdmissionCanWait();
					await racePromiseWithAbortSignal(replacement, abortSignal);
					continue;
				}
				const pendingOwner = this.host.getConfiguredOwner(agentId);
				if (pendingOwner?.pending) {
					assertPreparedModelRuntimeAdmissionCanWait(pendingOwner);
					await racePromiseWithAbortSignal(pendingOwner.pending, abortSignal);
					continue;
				}
				const runtime = this.#publication.find((candidate) => candidate.agentId === agentId);
				if (!runtime) {
					if (this.host.isStartupPending()) {
						assertPreparedModelRuntimeAdmissionCanWait();
						await racePromiseWithAbortSignal(this.#changed.promise, abortSignal);
						continue;
					}
					throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared reply dispatch runtime owner was not published for ${agentId}`);
				}
				if (onRuntimeLease) {
					if (!pendingOwner?.snapshot || pendingOwner.needsRefresh || pendingOwner.pluginGeneration !== runtime.pluginGeneration) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared reply dispatch runtime owner was not published for ${agentId}`);
					const lease = this.host.retainOwner(pendingOwner, pendingOwner.snapshot);
					try {
						onRuntimeLease(lease);
						const catalog = readCapturedPreparedModelRuntimeCatalog(lease.snapshot);
						return Object.freeze({
							...runtime,
							readFullModelCatalog: () => catalog
						});
					} catch (error) {
						await lease[Symbol.asyncDispose]();
						throw error;
					}
				}
				return runtime;
			}
		};
	}
	#publish(publication) {
		this.#publication = publication;
		const changed = this.#changed;
		this.#changed = createDeferredCore();
		changed.resolve();
	}
	clear() {
		this.#publish(EMPTY_REPLY_DISPATCH_PUBLICATION);
	}
	advanceConfig(config) {
		this.#publish(Object.freeze(this.#publication.map((runtime) => Object.freeze({
			...runtime,
			config
		}))));
	}
	rebuild(owners) {
		this.#publish(this.host.isGatewayLifecycleActive() ? buildReplyDispatchPublication(owners) : EMPTY_REPLY_DISPATCH_PUBLICATION);
	}
	stage(owners) {
		const publication = this.host.isGatewayLifecycleActive() ? buildReplyDispatchPublication(owners) : EMPTY_REPLY_DISPATCH_PUBLICATION;
		return () => {
			this.#publish(publication);
		};
	}
	remove(agentIds) {
		if (agentIds.size > 0) this.#publish(Object.freeze(this.#publication.filter((runtime) => !agentIds.has(runtime.agentId))));
	}
	replace(owners) {
		const replacements = buildReplyDispatchPublication(owners);
		const agentIds = new Set(replacements.map((runtime) => runtime.agentId));
		this.#publish(Object.freeze([...this.#publication.filter((runtime) => !agentIds.has(runtime.agentId)), ...replacements].toSorted((left, right) => left.agentId.localeCompare(right.agentId))));
	}
};
//#endregion
//#region src/agents/prepared-model-runtime.ts
/** Lifecycle-owned auth/model discovery snapshots for agent runs. */
const log = createSubsystemLogger("agents/prepared-model-runtime");
const DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS = 12e4;
let modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
const owners = /* @__PURE__ */ new Map();
const agentBuildCompletions = /* @__PURE__ */ new Map();
const standaloneActivationTails = /* @__PURE__ */ new Map();
const retainedDirectRunOwners = new PreparedModelRuntimeOwnerRetention(1);
const retainedGatewayRunOwners = new PreparedModelRuntimeOwnerRetention(8);
let gatewayLifecycleActive = false;
const publicationQueue = new PreparedModelRuntimePublicationQueue();
let refreshRequestEpoch = 0;
let refreshCancellation = new AbortController();
let pendingModelRuntimeReplacement;
const modelRuntimeDrain = createPreparedModelRuntimePluginDrain(() => {
	captureModelRuntimeLifetime();
	return refreshCancellation.signal;
}, () => pendingModelRuntimeReplacement !== void 0 || authPublication.hasPendingPublication);
const authPublication = new PreparedModelRuntimeAuthPublicationOwner();
const getBlockingReplacement = () => pendingModelRuntimeReplacement?.degraded ? void 0 : pendingModelRuntimeReplacement;
const getAdmissionReplacement = () => modelRuntimeDrain.pending ?? getBlockingReplacement();
const replyDispatchPublication = new PreparedReplyDispatchPublicationOwner({
	retainOwner: retainPublishedModelRuntimeOwner,
	isGatewayLifecycleActive: () => gatewayLifecycleActive,
	getConfiguredOwner: (agentId) => resolveConfiguredOwner(owners, {
		agentId,
		agentDir: ".",
		config: {}
	}),
	getPendingReplacement: () => getAdmissionReplacement()?.promise,
	isStartupPending: () => pendingModelRuntimeReplacement?.degraded === true
});
const loadPublishedGatewayReplyDispatchRuntime = replyDispatchPublication.load;
let releaseProcessLifetime;
function captureModelRuntimeLifetime() {
	const assertCurrent = capturePreparedModelRuntimeLifetime();
	if (!releaseProcessLifetime) {
		refreshCancellation = new AbortController();
		releaseProcessLifetime = registerPreparedModelRuntimeClose(closeModelRuntime);
	}
	return assertCurrent;
}
/** Seal refresh admission and cancel acquisition after every Gateway fences admission. */
function cancelPreparedModelRuntimeRefresh() {
	if (releaseProcessLifetime && refreshCancellation.signal.aborted) return;
	captureModelRuntimeLifetime();
	refreshRequestEpoch += 1;
	refreshCancellation.abort(/* @__PURE__ */ new Error("prepared model runtime acquisition stopped for shutdown"));
}
async function closeModelRuntime(error) {
	refreshRequestEpoch += 1;
	remoteCatalogPublication.cancel(error);
	authPublication.reset(error);
	pendingModelRuntimeReplacement?.reject(error);
	pendingModelRuntimeReplacement = void 0;
	setPreparedModelRuntimeStartupStatus(void 0);
	closeEphemeralPreparedModelRuntimeResources().catch(() => {});
	const closingOwners = [...owners.values()];
	owners.clear();
	closingOwners.forEach(retirePreparedModelRuntimeGeneration);
	retainedDirectRunOwners.clear(owners);
	retainedGatewayRunOwners.clear(owners);
	gatewayLifecycleActive = false;
	replyDispatchPublication.clear();
	refreshCancellation.abort(error);
	const results = await Promise.allSettled([
		publicationQueue.settle(),
		...agentBuildCompletions.values(),
		...standaloneActivationTails.values()
	]);
	closingOwners.forEach(releasePreparedPluginPublication);
	releaseProcessLifetime?.();
	releaseProcessLifetime = void 0;
	const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length) throw new AggregateError(failures, "Prepared model work failed to close");
}
/** Retire deleted-agent publications before closing readers that their builds can reopen. */
async function retirePreparedModelRuntimeAgent(target) {
	await retirePreparedModelRuntimeAgentOwners(target, preparedModelRuntimeLeaseContext);
}
/** Resolves a published owner or activates a standalone lifecycle owner. */
async function loadPreparedModelRuntimeSnapshot(rawInput) {
	return await loadPreparedModelRuntimeOwner(rawInput, preparedModelRuntimeLeaseContext, activateStandalonePreparedModelRuntime, (_owner, snapshot) => snapshot);
}
/** Borrows the selected publication without changing its activation or retention policy. */
async function acquirePublishedPreparedModelRuntime(rawInput) {
	return await loadPreparedModelRuntimeOwner(rawInput, preparedModelRuntimeLeaseContext, activateStandalonePreparedModelRuntime, retainPublishedModelRuntimeOwner);
}
/** Retains existing execution owners, including switched-away models, without loading plugins. */
async function acquireAgentRuntimeCleanupRegistries(agentDir) {
	return await acquireRetainedAgentRuntimeCleanupRegistries(normalizeOptionalDir(agentDir), preparedModelRuntimeLeaseContext);
}
/** Returns an already-published generation without starting discovery. */
function getPreparedModelRuntimeSnapshot(rawInput) {
	return getBlockingReplacement() ? void 0 : readPublishedModelRuntimeSnapshot(owners, rawInput);
}
/** Reads the owner-held publication barrier without starting catalog acquisition. */
function getPendingPreparedModelRuntimeReplacement() {
	return getBlockingReplacement()?.promise;
}
/** Fence new execution while plugin work drains, without withdrawing the active catalog. */
const beginPreparedModelRuntimePluginDrain = modelRuntimeDrain.begin;
/** Publishes one owner from an explicit startup/activation lifecycle boundary. */
async function publishPreparedModelRuntimeSnapshot(rawInput, options = {}) {
	captureModelRuntimeLifetime();
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = owners.get(ownerKey(input));
	if (existing?.pending) {
		if (!options.force && hasSameLifecycleInput(existing.input, input)) {
			assertPreparedModelRuntimeAdmissionCanWait(existing);
			return await existing.pending;
		}
	} else {
		if (existing?.buildCompletion) throw existing.refreshError ?? /* @__PURE__ */ new Error(`prepared model runtime build is still settling for ${input.agentDir}`);
		if (existing?.snapshot && !existing.needsRefresh && !options.force && hasSameLifecycleInput(existing.input, input)) return existing.snapshot;
	}
	return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, existing, options.provenance, options.catalogMode);
}
/** Activates lifecycle publication for direct embedded runtimes without a gateway startup. */
async function activateStandalonePreparedModelRuntime(rawInput, options = {}) {
	const assertLifetime = captureModelRuntimeLifetime();
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const key = ownerKey(input);
	const activation = (standaloneActivationTails.get(key) ?? Promise.resolve()).then(async () => await activateStandalonePreparedModelRuntimeNow(input, assertLifetime, options));
	const tail = activation.then(() => void 0, () => void 0);
	standaloneActivationTails.set(key, tail);
	try {
		return await activation;
	} finally {
		if (standaloneActivationTails.get(key) === tail) standaloneActivationTails.delete(key);
	}
}
async function activateStandalonePreparedModelRuntimeNow(input, assertLifetime, options) {
	for (;;) {
		assertLifetime();
		const overlapsConfiguredOwner = [...owners.values()].some((owner) => owner.provenance === "configured" && owner.input.agentDir === input.agentDir && (input.agentId === void 0 || owner.input.agentId === input.agentId) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
		if (gatewayLifecycleActive && (!input.readOnly || overlapsConfiguredOwner)) return;
		try {
			return await publishPreparedModelRuntimeSnapshot({
				...input,
				preserveWorkspaceDirOnRefresh: input.workspaceDir !== void 0
			}, {
				...options,
				provenance: "standalone"
			});
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) throw error;
			const replacement = pendingModelRuntimeReplacement;
			if (replacement) {
				assertPreparedModelRuntimeAdmissionCanWait();
				await replacement.promise;
			}
		}
	}
}
const preparedModelRuntimeLeaseContext = {
	captureLifetime: captureModelRuntimeLifetime,
	owners,
	agentBuildCompletions,
	retainedDirectRunOwners,
	retainedGatewayRunOwners,
	replyDispatchPublication,
	getBuildTimeoutMs: () => modelRuntimeBuildTimeoutMs,
	getGatewayLifecycleActive: () => gatewayLifecycleActive,
	getPendingReplacement: getAdmissionReplacement
};
const publishedModelRuntime = createPublishedModelRuntimeAccess(preparedModelRuntimeLeaseContext, getBlockingReplacement);
/** Retains the selected publication without activating an unpublished owner. */
const acquirePreparedModelRuntimeSnapshot = publishedModelRuntime.acquire;
/** Returns the published snapshot; only passive catalog reads may bypass execution drainage. */
const prepareModelRuntimeSnapshot = publishedModelRuntime.prepare;
/** Acquires a run generation from configured facts; full catalog discovery is explicit. */
async function acquireAgentRunPreparedModelRuntime(rawInput, options = {}) {
	return await acquirePreparedModelRuntimeLeaseFromOwners(rawInput, "run", preparedModelRuntimeLeaseContext, {
		...options,
		catalogMode: options.catalogMode ?? "static"
	});
}
/** Acquires an exact read-only generation scoped to the returned lease. */
async function acquireReadOnlyPreparedModelRuntime(rawInput, options = {}) {
	return await acquirePreparedModelRuntimeLeaseFromOwners({
		...rawInput,
		readOnly: true
	}, "ephemeral", preparedModelRuntimeLeaseContext, {
		...options,
		catalogMode: options.catalogMode ?? "live"
	});
}
/** Initializes or refreshes inventory on catalog demand; turn admission remains static. */
async function refreshPreparedModelRuntimeCatalog(snapshot, options = {}) {
	return await refreshPublishedModelRuntimeCatalog(snapshot, owners, options);
}
/** Invalidates every published generation before config/plugin runtime replacement. */
function markPreparedModelRuntimeSnapshotsStale(reason = "prepared model runtime owner is stale after config publication", options = {}) {
	captureModelRuntimeLifetime();
	refreshCancellation.signal.throwIfAborted();
	const previousCancellation = refreshCancellation;
	refreshCancellation = new AbortController();
	setPreparedModelRuntimeStartupStatus(void 0);
	replyDispatchPublication.clear();
	if (options.waitForReplacement) {
		const superseded = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = createPreparedModelRuntimeReplacement();
		authPublication.adopt(pendingModelRuntimeReplacement.gateId);
		superseded?.resolve();
	} else if (!options.preserveReplacementWait && pendingModelRuntimeReplacement) {
		const cancelled = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = void 0;
		cancelled.resolve();
	}
	refreshRequestEpoch += 1;
	const staleError = new Error(reason);
	updateOwnersForScopedRefresh(owners, options.agentIds, staleError, {
		retireStandalone: true,
		resetPluginGeneration: true
	});
	previousCancellation.abort(new PreparedModelRuntimePublicationSupersededError(reason));
	const replacement = getBlockingReplacement();
	notifyPreparedModelRuntimePublication({
		phase: "invalidated",
		...replacement ? { replacement: replacement.promise } : {}
	});
	if (!pendingModelRuntimeReplacement) notifyPreparedModelRuntimePublication({
		phase: "failed",
		error: staleError
	});
	return pendingModelRuntimeReplacement?.gateId;
}
/** Rejects readers waiting for a replacement when its owning reload cannot continue. */
function rejectPendingPreparedModelRuntimeReplacement(gateId, error) {
	const replacement = pendingModelRuntimeReplacement;
	if (!replacement || !gateId || replacement.gateId !== gateId) return;
	pendingModelRuntimeReplacement = void 0;
	const replacementError = toStringifiedError(error);
	authPublication.rejectAdopted(replacement.gateId, replacementError);
	replacement.reject(replacementError);
	notifyPreparedModelRuntimePublication({
		phase: "failed",
		error: replacementError
	});
}
const recoverPreparedModelRuntimeCatalogWorker = createPreparedModelRuntimeCatalogRecovery(owners, refreshPreparedModelRuntimeSnapshots);
const recoverRetiredConfiguredPluginGeneration = createPreparedModelRuntimePluginRecovery(owners, () => gatewayLifecycleActive && !refreshCancellation.signal.aborted && !pendingModelRuntimeReplacement, refreshPreparedModelRuntimeSnapshots);
const remoteCatalogPublication = createRemoteCatalogPublication({
	...preparedModelRuntimeLeaseContext,
	publicationQueue,
	replyDispatchPublication,
	getEpoch: () => refreshRequestEpoch,
	getCancellationSignal: () => refreshCancellation.signal,
	getPendingReplacement: () => (modelRuntimeDrain.pending ?? pendingModelRuntimeReplacement)?.promise,
	onPluginGenerationRetired: recoverRetiredConfiguredPluginGeneration
});
const { applyRemoteModelCatalogUpdate, advancePreparedModelRuntimeConfig } = remoteCatalogPublication;
/** Serializes config/plugin publications so only the latest completed refresh retires owners. */
function refreshPreparedModelRuntimeSnapshots(config, options = {}) {
	if (options.isPublicationCurrent?.() === false) return Promise.resolve();
	const requestedScopedRefresh = options.agentIds !== void 0;
	const initialAgentIds = typeof config === "function" ? void 0 : resolveSafeRefreshAgentIds(config, options, owners);
	const forceFullRefresh = requestedScopedRefresh && initialAgentIds === void 0;
	markPreparedModelRuntimeSnapshotsStale(void 0, {
		waitForReplacement: true,
		agentIds: initialAgentIds
	});
	const requestEpoch = refreshRequestEpoch;
	const acquisitionSignal = refreshCancellation.signal;
	const replacement = pendingModelRuntimeReplacement;
	let publicationAgentIds = initialAgentIds;
	const isPublicationCurrent = () => requestEpoch === refreshRequestEpoch && options.isPublicationCurrent?.() !== false;
	const startup = options.startup === true && options.catalogMode === "static" && replacement ? new PreparedModelRuntimeStartup({
		replacement,
		owners: () => owners.values(),
		isCurrent: () => pendingModelRuntimeReplacement === replacement && isPublicationCurrent(),
		timeoutMs: modelRuntimeBuildTimeoutMs,
		warn: (message) => log.warn(message),
		publish: (readyOwners) => {
			replyDispatchPublication.rebuild(readyOwners);
			notifyPreparedModelRuntimePublication({ phase: "published" });
		},
		onDegraded: (publish) => {
			authPublication.releaseAdopted(replacement.gateId);
			publicationQueue.enqueue(async () => {
				if (isPublicationCurrent()) await drainPendingAuthMutations(publish);
			}).catch((error) => log.warn(`startup auth refresh failed: ${String(error)}`));
		}
	}) : void 0;
	const rejectReplacement = (error) => {
		if (requestEpoch === refreshRequestEpoch) updateOwnersForScopedRefresh(owners, publicationAgentIds, error, {
			clearPending: true,
			resetPluginGeneration: true
		});
		rejectPendingPreparedModelRuntimeReplacement(replacement?.gateId, error);
	};
	const commitReplacement = () => {
		if (!replacement || pendingModelRuntimeReplacement !== replacement) return;
		if (!isPublicationCurrent()) {
			rejectReplacement(new PreparedModelRuntimePublicationSupersededError("prepared model runtime publication was superseded"));
			return;
		}
		const adoptedAuthTransaction = authPublication.prepareAdoptedCommit(replacement.gateId);
		replyDispatchPublication.rebuild(owners.values());
		pendingModelRuntimeReplacement = void 0;
		startup?.complete();
		if (adoptedAuthTransaction) authPublication.resolve(adoptedAuthTransaction, owners);
		replacement.resolve();
		notifyPreparedModelRuntimePublication({ phase: "published" });
		refreshCommittedProviderCatalogs(owners.values());
	};
	const publication = publicationQueue.enqueue(async () => {
		if (!isPublicationCurrent()) return;
		const currentConfig = typeof config === "function" ? await config() : config;
		if (!isPublicationCurrent()) return;
		publicationAgentIds = forceFullRefresh ? void 0 : resolveSafeRefreshAgentIds(currentConfig, options, owners);
		retainedGatewayRunOwners.clear(owners);
		gatewayLifecycleActive ||= options.gatewayLifecycle === true;
		await refreshPreparedModelRuntimeSnapshotsNow(currentConfig, {
			...options,
			agentIds: publicationAgentIds
		}, {
			owners,
			agentBuildCompletions,
			gatewayLifecycleActive,
			isPublicationCurrent,
			buildTimeoutMs: modelRuntimeBuildTimeoutMs,
			progress: startup?.progress,
			acquisitionSignal,
			onPluginGenerationRetired: recoverRetiredConfiguredPluginGeneration
		});
		if (!isPublicationCurrent()) return;
		const drain = () => drainPendingAuthMutations(commitReplacement);
		if (replacement?.degraded) await publicationQueue.enqueue(drain);
		else await drain();
	}, startup?.release).then(commitReplacement, (error) => {
		const refreshError = toStringifiedError(error);
		if (replacement?.degraded && isPublicationCurrent()) {
			startup?.update(true);
			if (pendingModelRuntimeReplacement === replacement) pendingModelRuntimeReplacement = void 0;
		} else rejectReplacement(refreshError);
		throw refreshError;
	});
	return publicationQueue.complete(publication, isPublicationCurrent, options, startup);
}
async function drainPendingAuthMutations(commit) {
	await authPublication.drain({
		owners,
		publish: async (ownersToPublish, includeCredentialProviders, reuseGenerations) => await publishPreparedModelRuntimeOwnerBatch({
			ownersToPublish,
			owners,
			agentBuildCompletions,
			buildTimeoutMs: modelRuntimeBuildTimeoutMs,
			...includeCredentialProviders ? { includeCredentialProviders: true } : {},
			selectPluginGeneration: reuseGenerations ? (owner) => owner.pluginGeneration : void 0
		}),
		publishOwners: (publishedOwners) => replyDispatchPublication.replace(publishedOwners),
		commit,
		onOwnerFailure: (error) => {
			const refreshError = toStringifiedError(error);
			notifyPreparedModelRuntimePublication({
				phase: "failed",
				error: refreshError
			});
			log.warn(`auth-triggered model runtime refresh failed: ${String(refreshError)}`);
		}
	});
}
function invalidateForAuthMutation(event) {
	const normalizedEvent = {
		...event,
		agentDir: normalizeOptionalDir(event.agentDir)
	};
	const { invalidatedOwners, invalidatedConfiguredAgentIds } = invalidatePreparedModelRuntimeOwnersForAuthMutation(owners, normalizedEvent);
	if (invalidatedOwners.length === 0) return;
	replyDispatchPublication.remove(invalidatedConfiguredAgentIds);
	const transaction = authPublication.enqueue(invalidatedOwners, normalizedEvent.profileSetChanged);
	if (getBlockingReplacement()) {
		authPublication.adoptTransaction(transaction, getBlockingReplacement().gateId);
		notifyPreparedModelRuntimePublication({ phase: "invalidated" });
		return;
	}
	if (!authPublication.claimPublication(transaction)) {
		notifyPreparedModelRuntimePublication({ phase: "invalidated" });
		return;
	}
	const publish = async () => {
		if (getBlockingReplacement()) {
			authPublication.adoptTransaction(transaction, getBlockingReplacement().gateId);
			return;
		}
		await drainPendingAuthMutations(() => {
			if (getBlockingReplacement()) {
				authPublication.adoptTransaction(transaction, getBlockingReplacement().gateId);
				return;
			}
			if (!authPublication.resolve(transaction, owners)) return;
			if (pendingModelRuntimeReplacement?.degraded || configuredOwnersAreRequestVisible(owners)) {
				notifyPreparedModelRuntimePublication({ phase: "published" });
				refreshCommittedProviderCatalogs(owners.values());
			}
		});
	};
	const publication = modelRuntimeDrain.runAfter(publicationQueue, publish);
	notifyPreparedModelRuntimePublication({ phase: "invalidated" });
	publication.catch((error) => {
		if (!authPublication.isCurrent(transaction)) return;
		if (getBlockingReplacement()) {
			authPublication.adoptTransaction(transaction, getBlockingReplacement().gateId);
			return;
		}
		if (error instanceof PreparedModelRuntimePublicationSupersededError) return;
		const refreshError = toStringifiedError(error);
		authPublication.reject(transaction, refreshError);
		notifyPreparedModelRuntimePublication({
			phase: "failed",
			error: refreshError
		});
		log.warn(`auth-triggered model runtime refresh failed: ${String(refreshError)}`);
	});
}
registerRuntimeAuthProfileStoreMutationListener(invalidateForAuthMutation);
registerPreparedRuntimeAuthMaterializationPublisher(owners, notifyPreparedModelRuntimePublication);
async function resetPreparedModelRuntimeSnapshotsForTest() {
	await closePreparedModelRuntimeSnapshots();
	resetPreparedModelRuntimePublicationListenersForTest();
	modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.preparedModelRuntimeTestApi")] = {
	resetPreparedModelRuntimeSnapshotsForTest,
	getPreparedModelRuntimeOwnerCountForTest: () => owners.size,
	setModelRuntimeBuildTimeoutMsForTest: (timeoutMs) => {
		modelRuntimeBuildTimeoutMs = timeoutMs;
	}
};
//#endregion
export { preparedModelRuntimeConfigsMatch as C, retirePreparedModelRuntimeAgent as S, readCapturedPreparedModelRuntimeCatalog as T, publishPreparedModelRuntimeSnapshot as _, acquireReadOnlyPreparedModelRuntime as a, refreshPreparedModelRuntimeSnapshots as b, applyRemoteModelCatalogUpdate as c, getPendingPreparedModelRuntimeReplacement as d, getPreparedModelRuntimeSnapshot as f, prepareModelRuntimeSnapshot as g, markPreparedModelRuntimeSnapshotsStale as h, acquirePublishedPreparedModelRuntime as i, beginPreparedModelRuntimePluginDrain as l, loadPublishedGatewayReplyDispatchRuntime as m, acquireAgentRuntimeCleanupRegistries as n, activateStandalonePreparedModelRuntime as o, loadPreparedModelRuntimeSnapshot as p, acquirePreparedModelRuntimeSnapshot as r, advancePreparedModelRuntimeConfig as s, acquireAgentRunPreparedModelRuntime as t, cancelPreparedModelRuntimeRefresh as u, recoverPreparedModelRuntimeCatalogWorker as v, withPreparedModelRuntimeReadBatch as w, rejectPendingPreparedModelRuntimeReplacement as x, refreshPreparedModelRuntimeCatalog as y };
