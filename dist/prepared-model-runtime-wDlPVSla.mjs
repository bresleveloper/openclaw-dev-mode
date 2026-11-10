import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as createPreparedModelRuntimeReplacement, c as retirePreparedModelRuntimeGeneration, i as createPreparedModelRuntimePluginDrain, n as capturePreparedModelRuntimeLifetime, o as registerPreparedModelRuntimeClose, r as closePreparedModelRuntimeSnapshots, t as capturePreparedModelRuntimeGeneration } from "./prepared-model-runtime.lifecycle-wUGazXvM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as readOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { j as hashRuntimeConfigValue, o as getRuntimeConfigSnapshot, s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { c as readRemoteModelCatalogUpdate, l as runOutsideRemoteModelCatalogSnapshot, n as captureRemoteModelCatalogStartupSnapshot, s as publishRemoteModelCatalogSnapshot, u as withRemoteModelCatalogSnapshot } from "./remote-overlay-ClWDV070.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as currentPluginWorkHoldsPendingReplacement } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { A as normalizeAgentDirRegistryPath, O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { s as settlePluginNativeAdmissions } from "./plugin-native-admission-state-COqSwm4O.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as mergeAuthProfileStores, f as removeRuntimeExternalProfileReferences } from "./persisted-DbIYEoQ3.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
import { n as getPreparedSharedAuthStoreOwnership, o as prepareSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { F as registerRuntimeAuthMaterializationMutationListener, K as runtimeAuthMetadataState, N as getPreparedRuntimeAuthMaterializations, T as registerRuntimeAuthProfileStoreMutationListener, i as createPreparedRuntimeAuthProfileUsageReader } from "./runtime-snapshots-HRosak4u.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-VI3Psdyr.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { i as collectRegistryInvocationInstances } from "./registry-inspection-resources-COvkPmap.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { p as prepareModelCatalogThinkingPolicies } from "./thinking-BCNoGfZ5.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { n as modelCatalogRouteVariantKey, r as modelCatalogRowToEntry } from "./model-catalog-entry-BWd5zbsm.mjs";
import { n as compareModelCatalogEntries } from "./model-catalog-order-DpA_fmrU.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
import { c as hasSamePreparedModelCatalogAuth, i as getPreparedModelFullCatalogAuth, n as copyPreparedModelFullCatalogAuth, r as copyPreparedModelRuntimeAuthBindings, t as bindPreparedModelRuntimeAuth, u as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { r as resolvePublishedModelCatalogOwner, t as preparePublishedModelCatalogOwnerIdentity } from "./prepared-model-catalog-owner-CyNDDKq6.mjs";
import { n as prepareModelPricingContext } from "./pricing-Cw2OErus.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-C-QBCzx4.mjs";
import { n as PreparedModelRuntimeRecoveryError, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
import { g as resolveProviderConfigSecretInput } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { t as runAbortableTimeout } from "./with-timeout-BD1Rfbmo.mjs";
import { a as assertPreparedModelRuntimeInputCurrent, i as assertPreparedModelRuntimeCandidatesCurrent, o as isPreparedModelRuntimeMissingOwnerError, r as PreparedModelRuntimePublicationSupersededError, s as isPreparedModelRuntimePluginLifecycleFailure } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { u as withPreparedAuthStorePathForDisplay } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { n as getPreparedModelRuntimePluginGeneration, r as runOutsidePreparedModelRuntimePluginGenerationScope, t as getPreparedModelRuntimeBorrowedSnapshot } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { t as listManifestSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { a as releasePreparedPluginPublication, c as PreparedModelRuntimeBuildResources, d as prepareAmbientAgentCredentialsForDiscovery, h as resolveUsableAgentCredentialModes, i as registerPreparedPluginLifetime, l as closeEphemeralPreparedModelRuntimeResources, m as resolveAgentCredentialMapFromStore, o as retainPreparedPluginGeneration, r as publishPreparedPluginGeneration, s as retainPreparedPluginRegistry, t as discardPreparedPluginGeneration } from "./prepared-model-runtime.plugin-lifetime-Ck5dh_-n.mjs";
import { i as preparedPluginGenerationSupportsSelections, r as preparedPluginGenerationReusesBase } from "./prepared-model-runtime.plugin-generation-DCZXy8Yr.mjs";
import { t as collectConfiguredCatalogModels } from "./configured-model-entries-BnlVcGcZ.mjs";
import { i as listConfiguredOwnerInputs } from "./prepared-model-runtime.configured-B8Q2qHyF.mjs";
import { n as augmentPreparedModelCatalogWithAgentHarness, r as isPreparedNativeModelCatalogReady } from "./model-catalog-DOoxeZxV.mjs";
import { s as resolveSelectedAgentHarnessRuntime } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import { a as prepareFullCatalogFacts, i as materializePreparedModelCatalog, n as isPreparedModelCatalogFull, r as markPreparedModelCatalogFull, t as createPreparedModelRuntimeSnapshot } from "./prepared-model-runtime.full-catalog-CcPwbyRw.mjs";
import { i as preparedSyntheticAuthProviderScope, o as fingerprintPreparedRuntimeFacts } from "./prepared-model-runtime.synthetic-auth-DP743ZrF.mjs";
import { t as createPreparedModelCatalogWorker } from "./prepared-model-catalog-worker-DyLW3Jvn.mjs";
import { n as prepareModelCatalogAuthLabels } from "./model-catalog-auth-labels-BDvpEt70.mjs";
import { n as projectClaudeCliNativeCatalog } from "./model-catalog-cli-wildcard-WhUtL_u4.mjs";
import { a as createPreparedInboundRegistryLoader, c as prepareConfiguredModelFacts, i as preparedModelInventoryKey, l as prepareConfiguredRuntimeFacts, n as prepareConfiguredRuntimeFactsBatch, r as prepareWorkspaceBuildGroup, s as preparedModelRuntimeWorkspaceFactsKey } from "./prepared-model-runtime.facts-CzFaKVAV.mjs";
import { n as notifyPreparedModelCatalogPublication, r as notifyPreparedModelRuntimePublication, t as createCatalogAttemptReporter } from "./prepared-model-runtime.publication-events-cMcm_IYL.mjs";
import { t as prepareAgentCatalogSource } from "./prepared-model-runtime.scoped-catalog-Bdoub6A5.mjs";
import { n as setPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
import pLimit from "p-limit";
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
function mergePreparedNativeCatalog(native, providers) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	return {
		...providers,
		nativeProviderOutcomes: native.nativeProviderOutcomes,
		nativeHostRows: native.nativeHostRows,
		entries: dedupeByKey([...native.entries.filter((entry) => entry.nativeRuntime), ...[...providers.entries, ...providers.routeVariants].filter((entry) => !entry.nativeRuntime)], keyOf),
		routeVariants: dedupeByKey([...native.routeVariants.filter((entry) => entry.nativeRuntime), ...providers.routeVariants.filter((entry) => !entry.nativeRuntime)], (entry) => modelCatalogRouteVariantKey(entry, keyOf(entry)))
	};
}
function filterNativeModelCatalogScopes(scopes, includesProvider) {
	return scopes && Object.fromEntries(Object.entries(scopes).map(([runtime, rows]) => [runtime, rows.filter(({ provider }) => includesProvider(provider))]));
}
function filterPreparedProviderCatalog(catalog, includesProvider) {
	const includes = (entry) => includesProvider(entry.provider);
	return {
		...catalog,
		entries: catalog.entries.filter(includes),
		routeVariants: catalog.routeVariants.filter(includes),
		staticEntries: catalog.staticEntries?.filter(includes),
		acceptedDiscoveryOrigins: catalog.acceptedDiscoveryOrigins?.filter(({ provider }) => includesProvider(provider)),
		providerOutcomes: catalog.providerOutcomes?.filter(includes),
		nativeProviderOutcomes: filterNativeModelCatalogScopes(catalog.nativeProviderOutcomes, includesProvider),
		nativeHostRows: filterNativeModelCatalogScopes(catalog.nativeHostRows, includesProvider)
	};
}
function selectPreparedModelCatalogInventory(inventory, includesProvider) {
	return {
		...inventory,
		catalog: filterPreparedProviderCatalog(inventory.catalog, includesProvider),
		runtimeModels: new Map([...inventory.runtimeModels].filter(([provider]) => includesProvider(provider))),
		providers: new Map([...inventory.providers].filter(([provider]) => includesProvider(provider))),
		discoveryOrigins: inventory.discoveryOrigins.filter(({ provider }) => includesProvider(provider))
	};
}
function mergePreparedModelCatalogInventory(previous, discovered, providers, normalize) {
	const retained = previous && selectPreparedModelCatalogInventory(previous, (provider) => !providers.has(normalize(provider)));
	const catalog = discovered.catalog;
	const before = retained?.catalog;
	const outcomes = [...before?.providerOutcomes ?? [], ...catalog.providerOutcomes ?? []];
	return {
		...discovered,
		catalog: {
			...catalog,
			entries: [...before?.entries ?? [], ...catalog.entries],
			routeVariants: [...before?.routeVariants ?? [], ...catalog.routeVariants],
			staticEntries: [...before?.staticEntries ?? [], ...catalog.staticEntries ?? []],
			providerOutcomes: outcomes,
			acceptedDiscoveryOrigins: [...retained?.discoveryOrigins ?? [], ...discovered.discoveryOrigins],
			authoritative: outcomes.every((outcome) => outcome.status === "ready")
		},
		runtimeModels: new Map([...retained?.runtimeModels ?? [], ...discovered.runtimeModels]),
		providers: new Map([...retained?.providers ?? [], ...discovered.providers]),
		discoveryOrigins: [...retained?.discoveryOrigins ?? [], ...discovered.discoveryOrigins]
	};
}
function prepareModelCatalogPublication(discovered, runtimeModels, inventory, auth, normalizeProvider, hookRows) {
	const catalog = {
		...discovered,
		entries: dedupeByKey([...discovered.entries, ...discovered.routeVariants].filter((entry) => !entry.nativeRuntime), createModelCatalogIdentityKeyResolver()),
		routeVariants: discovered.routeVariants.filter((entry) => !entry.nativeRuntime)
	};
	setPreparedModelFullCatalogAuth(catalog, auth);
	const failed = catalog.providerOutcomes?.filter((outcome) => outcome.status !== "ready") ?? [];
	const discoveryOrigins = (catalog.providerOutcomes ?? []).filter((outcome) => outcome.status === "ready").map(({ provider, profileId }) => ({
		provider: normalizeProvider(provider),
		profileId
	}));
	const identityKey = createModelCatalogIdentityKeyResolver();
	const rowKey = (entry) => modelCatalogRouteVariantKey(entry, identityKey({
		provider: normalizeProvider(entry.provider),
		id: entry.id
	}));
	const acceptedRows = /* @__PURE__ */ new Map();
	for (const [owner, keys] of hookRows) {
		const provider = normalizeProvider(owner);
		acceptedRows.set(provider, /* @__PURE__ */ new Set([...acceptedRows.get(provider) ?? [], ...keys]));
	}
	const outcomeProviders = new Set(catalog.providerOutcomes?.map((outcome) => normalizeProvider(outcome.provider)));
	const legacyRows = /* @__PURE__ */ new Map();
	for (const entry of [...catalog.entries, ...catalog.routeVariants]) {
		const provider = normalizeProvider(entry.provider);
		const key = rowKey(entry);
		if (outcomeProviders.has(provider) || !acceptedRows.get(provider)?.has(key)) continue;
		const keys = legacyRows.get(provider) ?? /* @__PURE__ */ new Set();
		keys.add(key);
		legacyRows.set(provider, keys);
	}
	if (failed.length === 0) {
		catalog.acceptedDiscoveryOrigins = discoveryOrigins;
		return {
			catalog,
			discoveryOrigins,
			runtimeModels,
			legacyRows
		};
	}
	const previous = inventory?.catalog;
	const previousAuth = previous && getPreparedModelFullCatalogAuth(previous);
	const previousLegacyRows = /* @__PURE__ */ new Map();
	for (const entry of [...previous?.entries ?? [], ...previous?.routeVariants ?? []]) {
		const provider = normalizeProvider(entry.provider);
		const key = rowKey(entry);
		if (!entry.nativeRuntime && inventory?.providers.get(provider)?.legacyRows?.has(key)) {
			const keys = previousLegacyRows.get(provider) ?? /* @__PURE__ */ new Set();
			keys.add(key);
			previousLegacyRows.set(provider, keys);
		}
	}
	const starterProviders = new Set(failed.map(({ provider }) => normalizeProvider(provider)).filter((provider) => !discoveryOrigins.some((origin) => origin.provider === provider)));
	const starters = (catalog.staticEntries ?? []).filter((entry) => !entry.nativeRuntime && starterProviders.has(normalizeProvider(entry.provider)));
	const retainedProviders = new Set(failed.flatMap((outcome) => {
		const provider = normalizeProvider(outcome.provider);
		const previousOrigins = inventory?.discoveryOrigins.filter((candidate) => normalizeProvider(candidate.provider) === provider);
		const hasLegacyInventory = Boolean(previousLegacyRows.get(provider)?.size);
		if (discoveryOrigins.some((origin) => origin.provider === provider) || !previousOrigins?.length && !hasLegacyInventory || !previousAuth || !previousAuth.credentials || !auth.credentials || outcome.profileId !== void 0 && !previousOrigins?.some((candidate) => candidate.profileId === outcome.profileId) || previousAuth.authModes[provider] !== auth.authModes[provider]) return [];
		return hasSamePreparedModelCatalogAuth(previousAuth, auth, (candidate) => normalizeProvider(candidate) === provider) ? [provider] : [];
	}));
	const discoveredRetainedProviders = new Set([...retainedProviders].filter((provider) => inventory?.discoveryOrigins.some((origin) => normalizeProvider(origin.provider) === provider)));
	for (const [provider, keys] of previousLegacyRows) if (retainedProviders.has(provider) && !discoveredRetainedProviders.has(provider)) legacyRows.set(provider, keys);
	const retain = (current, retained, key = createModelCatalogIdentityKeyResolver()) => dedupeByKey([
		...current.filter((entry) => !discoveredRetainedProviders.has(normalizeProvider(entry.provider)) && !(retainedProviders.has(normalizeProvider(entry.provider)) && legacyRows.get(normalizeProvider(entry.provider))?.has(rowKey(entry)))),
		...starters.filter((entry) => !retainedProviders.has(normalizeProvider(entry.provider))).map((entry) => Object.assign({}, entry, { contextCapacitySource: "unaccepted-starter" })),
		...retained.filter((entry) => !entry.nativeRuntime && retainedProviders.has(normalizeProvider(entry.provider)) && (discoveredRetainedProviders.has(normalizeProvider(entry.provider)) || legacyRows.get(normalizeProvider(entry.provider))?.has(rowKey(entry))))
	], key).toSorted(compareModelCatalogEntries);
	const routeKeyOf = createModelCatalogIdentityKeyResolver();
	const providerOutcomes = [];
	for (const outcome of catalog.providerOutcomes ?? []) {
		const accepted = previous?.providerOutcomes?.find((candidate) => candidate.provider === outcome.provider);
		providerOutcomes.push(outcome.status !== "ready" && retainedProviders.has(normalizeProvider(outcome.provider)) && accepted?.listedModelIds !== void 0 ? {
			...outcome,
			listedModelIds: accepted.listedModelIds
		} : outcome);
	}
	const published = {
		...catalog,
		providerOutcomes,
		entries: retain(catalog.entries, previous?.entries ?? []),
		routeVariants: retain(catalog.routeVariants, previous?.routeVariants ?? [], (entry) => JSON.stringify([
			routeKeyOf(entry),
			entry.api,
			entry.baseUrl,
			entry.nativeRuntime
		])),
		authoritative: false
	};
	setPreparedModelFullCatalogAuth(published, auth);
	const publishedRuntimeModels = new Map([...runtimeModels].filter(([provider]) => !discoveredRetainedProviders.has(normalizeProvider(provider))));
	for (const [provider, models] of inventory?.runtimeModels ?? []) {
		const normalized = normalizeProvider(provider);
		if (discoveredRetainedProviders.has(normalized)) publishedRuntimeModels.set(provider, models);
		else if (retainedProviders.has(normalized)) publishedRuntimeModels.set(provider, dedupeByKey([...(publishedRuntimeModels.get(provider) ?? []).filter((model) => !legacyRows.get(normalized)?.has(rowKey(modelCatalogRowToEntry(model)))), ...models.filter((model) => legacyRows.get(normalized)?.has(rowKey(modelCatalogRowToEntry(model))))], (model) => rowKey(modelCatalogRowToEntry(model))));
	}
	published.acceptedDiscoveryOrigins = [...discoveryOrigins, ...(inventory?.discoveryOrigins ?? []).filter((origin) => retainedProviders.has(normalizeProvider(origin.provider)))];
	return {
		catalog: published,
		runtimeModels: publishedRuntimeModels,
		legacyRows,
		discoveryOrigins: published.acceptedDiscoveryOrigins
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.capture.ts
const catalogCaptures = /* @__PURE__ */ new WeakMap();
const admittedCatalogs = /* @__PURE__ */ new WeakMap();
const admittedPublishedCatalogs = /* @__PURE__ */ new WeakMap();
/** Passive inventory captured at admission; the caller must hold the matching turn lease. */
function readCapturedPreparedModelRuntimeCatalog(snapshot) {
	return admittedCatalogs.get(snapshot);
}
/** Exact catalog the picker read at admission; route evidence for native-owned models. */
function readAdmittedPublishedModelCatalog(snapshot) {
	return admittedPublishedCatalogs.get(snapshot);
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
	admittedPublishedCatalogs.set(capturedNative, cached.catalog ?? snapshot.modelCatalog);
	if (!models?.size) {
		if (capturedNative !== snapshot) copyPreparedModelRuntimeAuthBindings(snapshot, capturedNative);
		return capturedNative;
	}
	const captured = Object.freeze({
		...capturedNative,
		readPublishedModels: () => models,
		routeModelResolutionMemo: cached.memo,
		createStores: () => {
			const { authStorage, modelRegistry } = snapshot.createStores();
			return {
				authStorage,
				modelRegistry: modelRegistry.fork(authStorage, models)
			};
		}
	});
	copyPreparedModelRuntimeAuthBindings(snapshot, captured);
	admittedCatalogs.set(captured, cached.admittedCatalog);
	admittedPublishedCatalogs.set(captured, cached.catalog ?? snapshot.modelCatalog);
	return captured;
}
//#endregion
//#region src/agents/prepared-model-runtime-admission.ts
/** A reload cannot wait for plugin work that is itself waiting for that reload. */
function assertPreparedModelRuntimeAdmissionCanWait(owner) {
	if (owner && (!owner.snapshot && !owner.refreshError || !owner.needsRefresh)) return;
	const generation = getPreparedModelRuntimePluginGeneration();
	const holdsReloadingInstance = generation && getPreparedModelRuntimeBorrowedSnapshot(generation) && [generation.pluginRegistry, generation.inboundPluginRegistry].some((registry) => registry && Array.from(collectRegistryInvocationInstances(registry)).some((instance) => instance.replacementPending));
	if (currentPluginWorkHoldsPendingReplacement() || holdsReloadingInstance) throw new PreparedModelRuntimeOwnerNotPublishedError("Model runtime replacement is in progress; admitted plugin work cannot wait for the reload. Retry after the plugin reload completes.", { admissionBlocked: true });
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-auth.ts
const NATIVE_LOGIN_RECHECK_MS = 6e4;
const SERVICE_TIER_OBSERVATION_TTL_MS = 3e5;
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
function createPreparedAccountCatalogAccess(isCurrent, retirementSignal, config = {}, onChanged) {
	const ownerIsCurrent = () => !retirementSignal?.aborted && isCurrent();
	const accounts = /* @__PURE__ */ new Map();
	let expiryTimer;
	const scheduleExpiry = () => {
		clearTimeout(expiryTimer);
		expiryTimer = void 0;
		if (!onChanged || !ownerIsCurrent()) return;
		let nextExpiry = Infinity;
		for (const account of accounts.values()) for (const observation of account.serviceTierObservations ?? []) nextExpiry = Math.min(nextExpiry, observation.expiresAt);
		if (nextExpiry === Infinity) return;
		expiryTimer = setTimeout(() => {
			expiryTimer = void 0;
			if (!ownerIsCurrent()) return;
			const now = Date.now();
			let changed = false;
			for (const account of accounts.values()) {
				const previous = account.serviceTierObservations;
				account.serviceTierObservations = previous?.filter(({ expiresAt }) => expiresAt > now);
				changed ||= account.serviceTierObservations?.length !== previous?.length;
			}
			scheduleExpiry();
			if (changed) onChanged();
		}, Math.max(0, nextExpiry - Date.now()));
		expiryTimer.unref();
	};
	const deleteAccount = (identityKey) => {
		const observed = accounts.get(identityKey)?.serviceTierObservations?.length;
		if (accounts.delete(identityKey)) {
			scheduleExpiry();
			if (observed) onChanged?.();
		}
	};
	const readAccount = (identityKey, credential) => {
		const account = accounts.get(identityKey);
		if (account && !isDeepStrictEqual(account.credential, credential)) {
			deleteAccount(identityKey);
			return;
		}
		return account;
	};
	const createAccount = (identityKey, credential) => {
		const account = structuredClone(credential);
		accounts.set(identityKey, account);
		for (const key of accounts.keys()) {
			if (accounts.size <= 64) break;
			deleteAccount(key);
		}
		return account;
	};
	retirementSignal?.addEventListener("abort", () => {
		accounts.clear();
		clearTimeout(expiryTimer);
		expiryTimer = void 0;
	}, { once: true });
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
				if ((includesProvider(account.credential.provider) || profileIds?.includes(profileId)) && !isDeepStrictEqual(account.credential, credential)) deleteAccount(identityKey);
			}
		},
		readServiceTierObservation(params) {
			if (!ownerIsCurrent()) return;
			const route = {
				...params,
				baseUrl: normalizeCatalogRouteBaseUrl(params.baseUrl) ?? params.baseUrl
			};
			let account = accounts.get(params.identityKey);
			if (account?.source === "direct") account = readAccount(params.identityKey, readDirectBinding(config, account.provider));
			const observation = account?.serviceTierObservations?.find((candidate) => matchesServiceTierRoute(candidate, route));
			return observation && observation.expiresAt > Date.now() ? {
				requestedTier: observation.requestedTier,
				responseTier: observation.responseTier
			} : void 0;
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
				const now = Date.now();
				const previous = captured.serviceTierObservations?.find((candidate) => candidate.expiresAt > now && matchesServiceTierRoute(candidate, route));
				let changed = false;
				captured.serviceTierObservations = (captured.serviceTierObservations ?? []).filter((candidate) => {
					if (candidate.expiresAt <= now) {
						changed = true;
						return false;
					}
					return !matchesServiceTierRoute(candidate, route);
				});
				const matched = observation.requestedTier === observation.responseTier;
				if (!matched) captured.serviceTierObservations = [...captured.serviceTierObservations.slice(-127), {
					...route,
					expiresAt: now + SERVICE_TIER_OBSERVATION_TTL_MS
				}];
				changed ||= matched ? Boolean(previous) : previous?.requestedTier !== observation.requestedTier || previous?.responseTier !== observation.responseTier;
				scheduleExpiry();
				if (changed) onChanged?.();
				return changed;
			};
		},
		async acquire(params) {
			if (!ownerIsCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
			const identityKey = `profile:${params.profileId}`;
			let observation = readAccount(identityKey, params.credential);
			if (!observation) {
				if (!params.allowDiscovery) return {
					outcomes: [],
					isCurrent: () => ownerIsCurrent() && !accounts.has(identityKey)
				};
				observation = createAccount(identityKey, {
					source: "profile",
					credential: params.credential
				});
			}
			const current = (account) => ownerIsCurrent() && accounts.get(identityKey) === account;
			const assertCurrent = (account) => {
				if (!current(account)) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
			};
			const needsDiscovery = params.allowDiscovery && (params.refresh || !observation.outcomes);
			if (needsDiscovery && !observation.pending) {
				const captured = observation;
				const pending = {
					refresh: false,
					promise: Promise.resolve().then(async () => {
						assertCurrent(captured);
						const outcomes = await params.load();
						assertCurrent(captured);
						captured.pending = void 0;
						const published = pending.refresh ? createAccount(identityKey, {
							source: "profile",
							credential: params.credential
						}) : captured;
						published.outcomes = outcomes;
						if (pending.refresh && captured.serviceTierObservations?.length) {
							scheduleExpiry();
							onChanged?.();
						}
						return published;
					}).finally(() => {
						if (captured.pending === pending) captured.pending = void 0;
					})
				};
				captured.pending = pending;
			}
			if (needsDiscovery) {
				observation.pending.refresh ||= params.refresh === true;
				observation = await observation.pending.promise;
			}
			const published = observation;
			assertCurrent(published);
			const outcomes = published.outcomes;
			return {
				outcomes: outcomes ?? [],
				isCurrent: () => current(published) && published.outcomes === outcomes
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
async function refreshScopedModelCatalogAuth(owner, { providerIds, profileIds }) {
	try {
		var _usingCtx$4 = _usingCtx();
		owner.assertCurrent();
		_usingCtx$4.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(owner.pluginGeneration) });
		const refreshed = await owner.refreshAuth({
			providerIds,
			...profileIds?.length ? { profileIds } : {}
		});
		owner.assertCurrent();
		const scope = preparedSyntheticAuthProviderScope(providerIds.map(owner.normalizeProvider));
		const includesProvider = (provider) => scope.has(owner.normalizeProvider(provider));
		owner.accountCatalog.reconcileAuth(refreshed.authStore, includesProvider, profileIds);
		return replacePreparedModelCatalogAuth(owner.readAuth(), refreshed, includesProvider);
	} catch (_) {
		_usingCtx$4.e = _;
	} finally {
		await _usingCtx$4.d();
	}
}
/** Refreshes scoped auth and merges it over the owner's current catalog auth. */
async function loadScopedModelCatalogAuth(owner, scope) {
	const { authStore, authModes } = await refreshScopedModelCatalogAuth(owner, scope);
	return {
		authStore,
		authModes: Object.freeze(authModes)
	};
}
/** Rechecks CLI backend logins on demand and publishes only a changed result. */
function createNativeLoginRecheck(owner, params, eligibleProviders, publish) {
	const { owners, index } = owner.pluginGeneration.pluginMetadataSnapshot;
	const refs = new Set(listManifestSyntheticAuthProviderRefs(index).map(owner.normalizeProvider));
	const providerIds = eligibleProviders.filter((provider) => owners.cliBackends.has(provider) && refs.has(provider));
	let checkedAt = Date.now();
	let pending;
	const recheck = async () => {
		try {
			var _usingCtx3 = _usingCtx();
			owner.assertCurrent();
			_usingCtx3.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(owner.pluginGeneration) });
			const { input, env } = params.agentFacts;
			const signal = AbortSignal.any([params.retirementSignal, AbortSignal.timeout(18e4)]);
			await withPluginRuntimeGenerationScope({
				metadataSnapshot: owner.pluginGeneration.pluginMetadataSnapshot,
				pluginRegistry: owner.pluginGeneration.pluginRegistry
			}, async () => {
				const credentials = await prepareAmbientAgentCredentialsForDiscovery({
					config: input.config,
					env,
					workspaceDir: input.workspaceDir,
					authoritativeSyntheticAuthProviderRefs: providerIds,
					syntheticAuthProviderRefs: providerIds,
					preparationOwner: {},
					signal
				});
				signal.throwIfAborted();
				owner.assertCurrent();
				const current = owner.readAuth();
				Object.assign(credentials, resolveAgentCredentialMapFromStore(current.authStore, { config: input.config }));
				const auth = replacePreparedModelCatalogAuth(current, {
					authStore: current.authStore,
					credentials,
					authModes: resolveUsableAgentCredentialModes(credentials)
				}, (provider) => providerIds.includes(owner.normalizeProvider(provider)));
				owner.assertCurrent();
				if (!isDeepStrictEqual(current.authModes, auth.authModes)) publish(auth);
			});
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			await _usingCtx3.d();
		}
	};
	return (options) => {
		const now = Date.now();
		if (pending) return pending;
		if (!providerIds.length || !options?.force && now - checkedAt < NATIVE_LOGIN_RECHECK_MS) return;
		checkedAt = now;
		pending = recheck().catch(() => void 0).finally(() => {
			pending = void 0;
		});
		return pending;
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.catalog-projection.ts
/** Composes retained discovery with current configured metadata and runtime capabilities. */
function createPreparedModelCatalogProjection(params) {
	const configuredModels = collectConfiguredCatalogModels(params.agentFacts.input.config);
	const providers = [...params.pluginGeneration.preparedStaticProviderCatalog?.providers ?? [], ...params.pluginGeneration.pluginRegistry?.providers.map(({ provider }) => provider) ?? []];
	const project = (inventory, configuredRuntimeModels = params.catalogFacts.configuredRuntimeModels) => {
		const { catalog, discoveryOrigins = [], providers: acquiredProviders } = inventory;
		let sourceCatalog = catalog;
		if (acquiredProviders) {
			const unacquired = (entries) => entries.filter((entry) => !entry.nativeRuntime && !acquiredProviders.has(params.normalizeProvider(entry.provider)));
			sourceCatalog = {
				...catalog,
				entries: [...catalog.entries, ...unacquired(params.catalogFacts.modelCatalog.entries)],
				routeVariants: [...catalog.routeVariants, ...unacquired(params.catalogFacts.modelCatalog.routeVariants)]
			};
		}
		const configured = prepareConfiguredRuntimeFacts({
			agentFacts: params.agentFacts,
			workspaceFacts: params.pluginGeneration,
			templateModelRegistry: params.catalogFacts.templateModelRegistry,
			configuredRuntimeModels
		}).modelCatalog;
		const current = materializePreparedModelCatalog(configured, params.agentFacts.runtimeCapabilityModels);
		const nativeCatalog = projectClaudeCliNativeCatalog(sourceCatalog, !(getPreparedModelFullCatalogAuth(catalog)?.credentials ?? params.agentFacts.credentials).anthropic);
		const projected = materializePreparedModelCatalog(nativeCatalog, params.agentFacts.runtimeCapabilityModels, current.staticEntries, new Set(discoveryOrigins.map(({ provider }) => params.normalizeProvider(provider))));
		projected.acceptedDiscoveryOrigins = discoveryOrigins;
		const apiProviders = new Set(projected.providerOutcomes?.map(({ provider }) => params.normalizeProvider(provider)));
		const nativeOutcomes = Object.values(catalog.nativeProviderOutcomes ?? {}).flat().filter(({ provider }) => !apiProviders.has(params.normalizeProvider(provider)));
		if (nativeOutcomes.length) projected.providerOutcomes = [...projected.providerOutcomes ?? [], ...nativeOutcomes];
		projected.providerOutcomes = projected.providerOutcomes?.map((outcome) => {
			const listing = outcome.status === "ready" ? outcome.modelIdCatalog : void 0;
			if (!listing) return outcome;
			const provider = params.normalizeProvider(outcome.provider);
			const references = configuredModels.filter((model) => params.normalizeProvider(model.provider) === provider).map((model) => Object.assign({}, model, { provider }));
			const match = providers.find((candidate) => matchesProviderPluginRef(candidate, provider) && candidate.catalog?.getUnlistedConfiguredModelIds)?.catalog?.getUnlistedConfiguredModelIds;
			const unlistedConfiguredModelIds = match ? match(listing, references) : references.filter((model) => (!model.baseUrl || model.baseUrl.replace(/\/+$/, "") === listing.baseUrl.replace(/\/+$/, "")) && !listing.modelIds.includes(model.modelId.trim())).map((model) => model.modelId);
			return {
				...outcome,
				unlistedConfiguredModelIds
			};
		});
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
	return (...args) => withPluginRuntimeGenerationScope({
		metadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: params.pluginGeneration.pluginRegistry
	}, () => project(...args));
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
	const providerSources = new Map([.../* @__PURE__ */ new Set([...eligibleProviders, ...inventory?.providers.keys() ?? []])].map((provider) => [provider, providerSource(provider)]));
	const previousAuth = inventory && getPreparedModelFullCatalogAuth(inventory.catalog);
	const retainedProviders = new Set([...providerSources.keys()].filter((provider) => inventory?.pluginFingerprint === pluginFingerprint && inventory.providers.get(provider)?.source === providerSources.get(provider) && hasSamePreparedModelCatalogAuth(previousAuth, facts, (id) => normalizeProvider(id) === provider)));
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
	const unretainedProviders = [...inventory?.providers.keys() ?? []].filter((provider) => !retainedProviders.has(provider));
	/** Providers a changed-only pass reacquires: changed source or credentials, or dropped rows. */
	const listChangedProviders = (published, candidates = [...Object.keys(facts.credentials), ...unretainedProviders.filter((provider) => !published?.providers.has(provider))]) => [...new Set(candidates.map(normalizeProvider))].filter((provider) => published?.providers.get(provider)?.source !== providerSources.get(provider) || published?.providers.get(provider)?.credentials !== preparedProviderCatalogCredentials(facts, provider, normalizeProvider));
	return {
		providerSource,
		retainedInventory,
		listChangedProviders
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.discovery-retry.ts
const FAILED_DISCOVERY_RETRY_MS = 3e4;
const FAILED_DISCOVERY_RETRY_MAX_MS = 18e5;
const MODEL_CATALOG_FOREGROUND_WAIT_MS = 5e3;
function waitForDiscovery(discovery, readPublished, wait = false) {
	return wait ? discovery : raceWithTimeout(discovery, MODEL_CATALOG_FOREGROUND_WAIT_MS, readPublished, { ref: false });
}
function failedDiscoveryFacts(previous) {
	const discoveryFailures = (previous?.discoveryFailures ?? 0) + 1;
	const delay = FAILED_DISCOVERY_RETRY_MS * 2 ** (discoveryFailures - 1);
	return {
		discoveryFailures,
		expiresAt: Date.now() + Math.min(delay, FAILED_DISCOVERY_RETRY_MAX_MS)
	};
}
/** A successful discovery keeps its cache deadline; a failed one gets a backed-off retry deadline. */
function discoveryDeadline(failed, expiresAt, previous) {
	if (failed) return failedDiscoveryFacts(previous);
	return expiresAt === void 0 ? {} : { expiresAt };
}
/** Failed renewal retains rows, but replaces a successful deadline with its retry deadline. */
function recordFailedDiscovery(inventory, providerIds = inventory.providers.keys()) {
	const providers = new Map(inventory.providers);
	for (const provider of providerIds) {
		const facts = providers.get(provider);
		if (facts) providers.set(provider, {
			...facts,
			...failedDiscoveryFacts(facts)
		});
	}
	return {
		...inventory,
		providers
	};
}
/**
* Keeps one timer at the earliest failed-provider deadline of the current catalog owner.
* Every settled acquisition re-arms it, so a retry never joins the acquisition that failed.
* `readIdleInventory` returns nothing while an acquisition is pending.
*/
function createFailedDiscoveryRetry(retirementSignal, readIdleInventory, acquire) {
	let timer;
	const failedDeadlines = () => [...readIdleInventory()?.providers ?? []].flatMap(([provider, facts]) => facts.discoveryFailures && facts.expiresAt !== void 0 ? [{
		provider,
		expiresAt: facts.expiresAt
	}] : []);
	const arm = () => {
		clearTimeout(timer);
		const failed = failedDeadlines();
		if (retirementSignal.aborted || !failed.length) return;
		const due = Math.min(...failed.map(({ expiresAt }) => expiresAt));
		timer = setTimeout(() => {
			const now = Date.now();
			const providerIds = failedDeadlines().filter(({ expiresAt }) => expiresAt <= now).map(({ provider }) => provider);
			if (retirementSignal.aborted || !providerIds.length) {
				arm();
				return;
			}
			acquire({
				providerIds,
				refresh: true
			}).catch(() => void 0);
		}, Math.max(0, due - Date.now())).unref();
	};
	retirementSignal.addEventListener("abort", () => clearTimeout(timer), { once: true });
	arm();
	return arm;
}
const limitFullModelCatalogBuild = pLimit(1);
async function createFullModelCatalogAccess(params, assertBuildCurrent) {
	assertBuildCurrent();
	const normalizeProvider = createPreparedModelCatalogProviderNormalizer(params.pluginGeneration.pluginMetadataSnapshot, params.agentFacts.input.config, params.agentFacts.env);
	const eligibleProviders = [...new Set([...params.agentFacts.providerIds, ...Object.keys(params.agentFacts.credentials)].map(normalizeProvider))].toSorted();
	const currentAuth = await prepareInitialModelCatalogAuth(params, eligibleProviders, assertBuildCurrent);
	assertBuildCurrent();
	const accountCatalog = createPreparedAccountCatalogAccess(params.isCurrent, params.retirementSignal, params.agentFacts.input.config, () => {
		if (params.catalogOwner && params.isPublished?.() !== false) notifyPreparedModelRuntimePublication({
			phase: "catalog-observation",
			modelFactsChanged: false,
			agentId: params.catalogOwner.agentId
		});
	});
	const readUsage = createPreparedRuntimeAuthProfileUsageReader(params.agentFacts.input.agentDir, params.agentFacts.input.inheritedAuthDir);
	const readCurrentUsage = (store) => params.isCurrent() ? readUsage(store) : store;
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
			published = {
				...published,
				inventory: recordFailedDiscovery(published.inventory, pending?.providers)
			};
			params.inventoryOwner.catalogInventory = published.inventory;
		}
	}, params.isPublished);
	const { providerSource, retainedInventory, listChangedProviders } = prepareRetainedProviderCatalog(params, normalizeProvider, eligibleProviders, pluginFingerprint, nativeSource);
	if (retainedInventory) setCatalogAuth(retainedInventory.catalog, currentAuth);
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
		catalog.authoritative = acquiredNative && !catalog.refreshFailed && catalog.authoritative;
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
	const acquireProviderCatalog = async (requestedProviderIds, refresh) => {
		const providerIds = requestedProviderIds ? [...preparedSyntheticAuthProviderScope(requestedProviderIds)] : void 0;
		return limitFullModelCatalogBuild(async () => {
			assertCurrent();
			const providers = providerIds ?? eligibleProviders;
			const { modelCatalog: workerCatalog, configuredRuntimeModels, runtimeModels, providerExpiries, hookRows } = await worker.loadCatalog(providerIds, (error) => attempt.failed(error, providers, "provider"), refresh);
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
					...discoveryDeadline(failed, expiresAt, retained?.providers.get(provider)),
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
	};
	const acquireNativeCatalog = (providerIds, selection, refresh = false) => {
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
			const ready = !refresh && isPreparedNativeModelCatalogReady({
				input,
				pluginGeneration: params.pluginGeneration,
				snapshot,
				selection,
				catalogAcquired: published.nativeCatalogAcquired
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
				if (!params.isCurrent()) {
					if (!completed && failures.length) throw failures[0].error;
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
				const acquiredNative = latest.nativeCatalogAcquired || !selection && !providerIds;
				const nextInventory = completed || failures.length ? {
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
				if (!completed && failures.length && (selection || refresh)) {
					failedProviders = failures.flatMap((failure) => failure.providers ?? []);
					throw failures[0].error;
				}
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
	const authOwner = {
		pluginGeneration: params.pluginGeneration,
		accountCatalog,
		normalizeProvider,
		assertCurrent,
		readAuth: () => getPreparedModelFullCatalogAuth(published.catalog ?? staticCatalog) ?? currentAuth,
		refreshAuth: worker.loadAuth
	};
	const recheckNativeLogin = createNativeLoginRecheck(authOwner, params, eligibleProviders, (auth) => {
		const inventory = {
			runtimeModels: /* @__PURE__ */ new Map(),
			providers: /* @__PURE__ */ new Map(),
			discoveryOrigins: [],
			...published.inventory,
			key: inventoryKey,
			pluginFingerprint,
			nativeSource,
			catalog: { ...published.inventory?.catalog ?? params.catalogFacts.modelCatalog }
		};
		setCatalogAuth(inventory.catalog, auth);
		const change = publishCatalog({
			...published,
			inventory
		}, "native");
		notifyPreparedModelCatalogPublication(params.isPublished?.() === false ? void 0 : change);
	});
	const refreshExpiredModelCatalog = () => {
		assertCurrent();
		recheckNativeLogin();
		if (pending || !published.inventory) return;
		const now = Date.now();
		const providers = [...published.inventory.providers].filter(([, { expiresAt }]) => expiresAt !== void 0 && expiresAt <= now).map(([provider]) => provider);
		if (providers.length) acquireCatalog({
			providerIds: providers,
			refresh: true
		}, "expiry").catch(() => void 0);
	};
	const acquireCatalog = async (options = {}, trigger = "request") => {
		assertCurrent();
		const refreshResponses = options.refresh === true && trigger === "request";
		if (!options.refresh && !options.changedOnly && published.catalog && eligibleProviders.every((provider) => published.inventory?.providers.has(provider))) {
			refreshExpiredModelCatalog();
			return await acquireNativeCatalog();
		}
		const requestedProviders = [...new Set((options.providerIds ?? eligibleProviders).map(normalizeProvider))];
		const providers = options.changedOnly ? listChangedProviders(published.inventory, options.providerIds) : requestedProviders;
		const fullRefresh = !options.providerIds && (!options.changedOnly || !published.inventory?.providers.size);
		const includeNative = trigger === "request" && hasNativeCatalog && !options.changedOnly;
		const nativeScope = options.providerIds ? requestedProviders : void 0;
		const nativeProviders = includeNative ? nativeScope : [];
		if (!providers.length && !includeNative && !fullRefresh) return published.catalog ?? staticCatalog;
		if (pending) {
			const current = pending;
			const coversProviders = current.providers === void 0 || !fullRefresh && providers.every((provider) => current.providers.includes(provider));
			const coversNative = !includeNative || current.nativeProviders === void 0 || nativeProviders !== void 0 && nativeProviders.every((provider) => current.nativeProviders.includes(provider));
			if (coversProviders && coversNative && (!refreshResponses || current.refresh)) return current.promise;
			await current.promise.catch(() => void 0);
			return acquireCatalog(options, trigger);
		}
		attempt.setPending(fullRefresh || providers.length ? providers : void 0);
		const providerIds = fullRefresh ? void 0 : providers;
		const promise = (async () => {
			try {
				var _usingCtx3 = _usingCtx();
				_usingCtx3.a({ [Symbol.asyncDispose]: retainPreparedPluginGeneration(params.pluginGeneration) });
				if (fullRefresh || providers.length) {
					const candidate = await acquireProviderCatalog(providerIds, refreshResponses).catch((error) => {
						attempt.failed(error, providers, "provider");
						throw error;
					});
					attempt.published(providerIds, "provider", () => publishCatalog(candidate, "provider"));
				}
				if (includeNative) return await acquireNativeCatalog(nativeScope, void 0, options.refresh);
				return published.catalog ?? staticCatalog;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				await _usingCtx3.d();
			}
		})().finally(() => {
			pending = void 0;
			retryFailedDiscovery();
		});
		pending = {
			providers: providerIds,
			nativeProviders,
			refresh: refreshResponses,
			promise
		};
		return promise;
	};
	const retryFailedDiscovery = createFailedDiscoveryRetry(params.retirementSignal, () => pending ? void 0 : published.inventory, (options) => acquireCatalog(options, "expiry"));
	const loadNativeModelCatalog = async (selection) => await waitForDiscovery(acquireNativeCatalog(selection ? [normalizeProvider(selection.provider)] : void 0, selection), () => published.catalog ?? staticCatalog, Boolean(selection));
	return {
		accountCatalog,
		initialAuth: currentAuth,
		readUsage: readCurrentUsage,
		isCurrent: params.isCurrent,
		withRefreshStatus: attempt.withRefreshStatus,
		loadAuth: (scope) => loadScopedModelCatalogAuth(authOwner, scope),
		readFullModelCatalog: () => {
			assertCurrent();
			return published.catalog;
		},
		refreshExpiredModelCatalog,
		recheckNativeLogin,
		readPublishedModels: () => {
			assertCurrent();
			return published.inventory?.runtimeModels;
		},
		loadNativeModelCatalog,
		loadFullModelCatalog: (options) => waitForDiscovery(acquireCatalog(options), () => published.catalog ?? staticCatalog, options?.refresh && (options.wait || params.inventoryOwner.provenance === "standalone"))
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
async function buildSnapshotBatch(requestedCandidates, registryResources, catalogMode, pluginMetadataSnapshot, onBuildStats, includeCredentialProviders = catalogMode === "live", onStage, onPrepared, signal, providerDiscoveryTimeoutMs) {
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
			catalogOwner: candidate.catalogOwner,
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
						const catalogSource = await prepareAgentCatalogSource(agentFacts, pluginGeneration, catalogMode, true, { providerDiscoveryTimeoutMs });
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
function startSerializedSnapshotBuildBatch(candidates, agentBuildCompletions, buildTimeoutMs, catalogMode = "live", onBuildStats, pluginMetadataSnapshot, includeCredentialProviders = catalogMode === "live", progress, acquisitionSignal, providerDiscoveryTimeoutMs) {
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
			} : void 0, signal, providerDiscoveryTimeoutMs);
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
		for (const [oldestKey, oldestOwner] of this.#retained) {
			if (this.#retained.size <= this.maxSize) break;
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
		return modelRuntimeConfigFingerprint(left) === modelRuntimeConfigFingerprint(right);
	} catch {
		return false;
	}
}
function modelRuntimeConfigFingerprint(config) {
	const published = config === getRuntimeConfigSnapshot() && getRuntimeConfigSnapshotMetadata();
	return published ? published.fingerprint : hashRuntimeConfigValue(config);
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
async function prepareModelRuntimeInput(input) {
	await prepareSharedAuthStoreOwnership(input.env);
	return normalizePreparedModelRuntimeInput(input);
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
		runtimePluginPurpose: input.runtimePluginPurpose,
		skipCredentials: input.skipCredentials === true,
		workspaceDir: input.workspaceDir,
		env: environmentFingerprint(input.env),
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections,
		config: input.readOnly ? modelRuntimeConfigFingerprint(input.config) : void 0
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
	const candidates = [...configuredOwnerCandidates(owners, input.agentId)].filter((owner) => owner.provenance === "configured" && (input.agentId === void 0 || owner.input.agentId === input.agentId) && owner.input.agentDir === input.agentDir && owner.input.inheritedAuthDir === input.inheritedAuthDir && owner.input.readOnly === input.readOnly && owner.input.loadRuntimePlugins === input.loadRuntimePlugins && owner.input.runtimePluginPurpose === input.runtimePluginPurpose && owner.input.skipCredentials === input.skipCredentials && (input.allowGatewaySubagentBinding === void 0 || owner.input.allowGatewaySubagentBinding === input.allowGatewaySubagentBinding) && (input.runtimePluginSelections === void 0 || JSON.stringify(owner.input.runtimePluginSelections) === JSON.stringify(input.runtimePluginSelections)) && (input.env === void 0 || owner.environmentFingerprint === environmentFingerprint(input.env)) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
	return candidates.length === 1 ? candidates[0] : void 0;
}
/** Reads an already-published generation without admitting discovery. */
function readPublishedModelRuntimeSnapshot(owners, rawInput) {
	if (!getPreparedSharedAuthStoreOwnership(rawInput.env ?? process.env)) return;
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const owner = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
	if (!owner?.snapshot || owner.needsRefresh || owner.pending) return;
	if (input.readOnly && !preparedModelRuntimeConfigsMatch(owner.input.config, input.config)) return;
	return owner.snapshot;
}
function hasSameLifecycleInput(left, right) {
	return left.config === right.config && left.agentId === right.agentId && left.inheritedAuthDir === right.inheritedAuthDir && left.readOnly === right.readOnly && left.loadRuntimePlugins === right.loadRuntimePlugins && left.runtimePluginPurpose === right.runtimePluginPurpose && left.skipCredentials === right.skipCredentials && left.workspaceDir === right.workspaceDir && environmentFingerprint(left.env) === environmentFingerprint(right.env) && left.preserveWorkspaceDirOnRefresh === right.preserveWorkspaceDirOnRefresh && left.allowGatewaySubagentBinding === right.allowGatewaySubagentBinding && JSON.stringify(left.runtimePluginSelections) === JSON.stringify(right.runtimePluginSelections);
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
				} : void 0, params.acquisitionSignal, params.providerDiscoveryTimeoutMs);
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
				if (candidate.owner.provenance === "configured" && !(refreshError instanceof PreparedModelRuntimePublicationSupersededError)) {
					candidate.owner.catalogRecovery ??= {
						error: refreshError,
						scheduledAttempted: false,
						retryAfter: 0
					};
					candidate.owner.catalogRecovery.error = refreshError;
				}
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
async function publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, buildTimeoutMs, existing, provenance = "explicit", catalogMode = existing?.catalogMode ?? "live", reusablePluginGeneration, pluginMetadataSnapshot, providerDiscoveryTimeoutMs) {
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
		pluginMetadataSnapshot,
		providerDiscoveryTimeoutMs
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
		if (!transaction.adoptedBy && transaction.ownerGates.size > 0) return false;
		this.#transaction = void 0;
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
		}).flatMap(({ owner, gate }) => {
			const published = owners.get(ownerKey(owner.input)) ?? resolveConfiguredOwner(owners, owner.input);
			return published?.snapshot && !published.needsRefresh && (!published.pending || published.pending === gate.promise) ? [{
				owner,
				gate,
				published,
				snapshot: published.snapshot
			}] : [];
		});
		for (const { owner, gate, published } of completed) {
			if (owner.pending === gate.promise) owner.pending = void 0;
			if (published.pending === gate.promise) published.pending = void 0;
		}
		try {
			if (completed.length > 0) publishOwners(completed.map(({ published }) => published));
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
				const retries = Math.max(0, ...gates.map((gate) => gate.retries ?? 0));
				const retrying = retries > 0;
				for (const gate of gates) gate.retries = retries;
				try {
					if (owners.length > 0) {
						const publish = async () => {
							try {
								await params.publish(owners, this.#transaction?.profileSetChanged === true, !retrying);
							} catch (error) {
								const transaction = this.#transaction;
								if (!(error instanceof PreparedModelRuntimePublicationSupersededError) || !transaction || transaction.adoptedBy) throw error;
								const authGates = new Set([...transaction.ownerGates.values()].map((gate) => gate.promise));
								const replacements = componentOwners.flatMap((owner) => {
									const published = params.owners.get(ownerKey(owner.input)) ?? resolveConfiguredOwner(params.owners, owner.input);
									const gate = transaction.ownerGates.get(owner);
									if (!published || !gate) return [];
									if (published.pending && !authGates.has(published.pending)) return [published.pending];
									return published.snapshot && !published.needsRefresh ? [Promise.resolve(published.snapshot)] : [];
								});
								if (replacements.length !== componentOwners.length) throw error;
								await Promise.all(replacements);
							}
						};
						await (retrying ? runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(publish)) : publish());
					}
					const transaction = this.#transaction;
					if (transaction) this.settleComponent(transaction, componentOwners, params.owners, params.publishOwners);
				} catch (error) {
					if (this.#transaction?.adoptedBy) {
						if (error instanceof PreparedModelRuntimePublicationSupersededError && this.#events.some((event) => event.some((owner) => componentOwners.includes(owner)))) {
							this.#events.push(componentOwners);
							continue;
						}
						throw error;
					}
					const transaction = this.#transaction;
					const currentOwners = owners.filter((owner) => owner.pending !== void 0 && params.owners.get(ownerKey(owner.input)) === owner && transaction?.ownerGates.get(owner)?.promise === owner.pending);
					const superseded = error instanceof PreparedModelRuntimePublicationSupersededError;
					if (transaction && retries < (superseded ? 2 : 1) && isPreparedModelRuntimePluginLifecycleFailure(error) && currentOwners.some((owner) => superseded || reusedOwners.has(owner))) {
						for (const owner of currentOwners) transaction.ownerGates.get(owner).retries = retries + 1;
						this.#events.push(componentOwners);
						continue;
					}
					const failure = retrying ? new (superseded ? PreparedModelRuntimePublicationSupersededError : Error)(`Auth-triggered model runtime refresh failed after ${retries} fresh-generation ${retries === 1 ? "retry" : "retries"}: ${toStringifiedError(error).message}${superseded ? "; retry the request" : ""}`, { cause: error }) : error;
					if (transaction && this.rejectComponentOwners(transaction, componentOwners, failure, true) > 0) params.onOwnerFailure?.(failure);
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
		const recovery = error instanceof PreparedModelRuntimePublicationSupersededError ? {
			error,
			scheduledAttempted: false,
			retryAfter: 0
		} : void 0;
		for (const owner of componentOwners) {
			if (queuedOwners.has(owner)) continue;
			const gate = transaction.ownerGates.get(owner);
			if (!gate) continue;
			if (owner.pending === gate.promise) {
				owner.pending = void 0;
				if (recordRefreshError) {
					owner.refreshError = error instanceof Error ? error : toStringifiedError(error);
					owner.needsRefresh = true;
					if (owner.provenance === "configured") owner.catalogRecovery = recovery ?? {
						error: owner.refreshError,
						scheduledAttempted: false,
						retryAfter: 0
					};
				}
			}
			transaction.ownerGates.delete(owner);
			gate.reject(error);
			rejected += 1;
		}
		return rejected;
	}
};
function invalidatePreparedModelRuntimeOwnersForAuthMutation(owners, event) {
	if (event.availabilityOnly) return {
		invalidatedOwners: [],
		invalidatedConfiguredAgentIds: /* @__PURE__ */ new Set()
	};
	const agentDir = normalizeOptionalDir(event.agentDir);
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after auth mutation");
	const invalidatedOwners = [];
	const invalidatedConfiguredAgentIds = /* @__PURE__ */ new Set();
	for (const owner of owners.values()) {
		if (!owner.snapshot && owner.buildCompletion && !owner.authCaptureStarted && !owner.refreshError && owner.input.inheritedAuthDir === normalizeOptionalDir(resolveLegacyInheritedAuthDir(owner.input.config, owner.input.env)) || !event.affectsInheritedStores && owner.input.agentDir !== agentDir && owner.input.inheritedAuthDir !== agentDir) continue;
		invalidatedOwners.push(owner);
		owner.generation += 1;
		retirePreparedModelRuntimeGeneration(owner);
		owner.needsRefresh = true;
		owner.refreshError = staleError;
		if (event.profileSetChanged) owner.catalogStale = true;
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
	const acquire = () => acquirePreparedModelRuntimeLeaseAttempt(rawInput, provenance, context, options, assertAdmission);
	for (let attempt = 0;; attempt += 1) try {
		return await (attempt === 0 ? acquire() : runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(acquire)));
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimePublicationSupersededError) || provenance !== "run" || options.pluginGeneration || getPreparedModelRuntimePluginGeneration()) throw error;
		assertAdmission();
		if (attempt === 1) throw new PreparedModelRuntimePublicationSupersededError("Model runtime changed during both preparation attempts; retry the request", { cause: error });
	}
}
async function acquirePreparedModelRuntimeLeaseAttempt(rawInput, provenance, context, options, assertAdmission) {
	assertAdmission();
	if (!getPreparedSharedAuthStoreOwnership(rawInput.env ?? process.env)) await prepareSharedAuthStoreOwnership(rawInput.env);
	assertAdmission();
	let replacement = context.getPendingReplacement(rawInput);
	for (let waits = 0; replacement && waits < 3; waits += 1) {
		assertPreparedModelRuntimeAdmissionCanWait();
		await racePromiseWithAbortSignal(replacement.promise, options.abortSignal);
		assertAdmission();
		replacement = context.getPendingReplacement(rawInput);
	}
	if (replacement) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime lease admission made no publication progress for ${rawInput.agentDir}; retry the request`);
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	if (provenance === "run" && context.getGatewayLifecycleActive()) {
		const configured = resolveConfiguredOwner(context.owners, input);
		if (configured?.pending) {
			assertPreparedModelRuntimeAdmissionCanWait(configured);
			await racePromiseWithAbortSignal(configured.pending, options.abortSignal);
			assertAdmission();
		}
	}
	if (provenance === "run" && !options.pluginGeneration && context.getGatewayLifecycleActive()) try {
		input = rebindInputToCommittedConfiguredOwner(context.owners, input);
	} catch (error) {
		if (!isPreparedModelRuntimeMissingOwnerError(error)) throw error;
		const existing = context.owners.get(ownerKey(input));
		const reservedSetup = input.agentId !== void 0 && isReservedSystemAgentId(input.agentId);
		if (!existing && !reservedSetup) throw error;
	}
	let pluginMetadataSnapshot = options.pluginMetadataSnapshot;
	if (options.deriveRuntimePluginSelections) {
		pluginMetadataSnapshot = options.pluginGeneration?.pluginMetadataSnapshot ?? pluginMetadataSnapshot ?? await resolvePluginMetadataSnapshotAsync({
			config: input.config,
			env: input.env,
			workspaceDir: input.workspaceDir,
			allowWorkspaceScopedCurrent: true
		});
		const metadataSnapshot = pluginMetadataSnapshot;
		const deriveSelections = options.deriveRuntimePluginSelections;
		input = withPluginMetadataSnapshotScope(pluginMetadataSnapshot, () => normalizePreparedModelRuntimeInput({
			...input,
			runtimePluginSelections: [...rawInput.runtimePluginSelections ?? [], ...deriveSelections({
				config: input.config,
				metadataSnapshot
			})]
		}), { trustConfigIdentity: true });
	}
	const key = ownerKey(input);
	const admission = createPreparedModelRuntimeAdmissionClaim(context);
	try {
		let owner = context.owners.get(key);
		const configuredOwner = resolveConfiguredOwner(context.owners, input);
		if (provenance === "run" && context.getGatewayLifecycleActive() && options.pluginGeneration && configuredOwner && (configuredOwner.needsRefresh || configuredOwner.pluginGeneration !== options.pluginGeneration)) {
			const borrowed = getPreparedModelRuntimeBorrowedSnapshot(options.pluginGeneration);
			if (!configuredOwner.needsRefresh && borrowed && borrowed.metadataSnapshot === options.pluginGeneration.pluginMetadataSnapshot && preparedModelRuntimeConfigsMatch(borrowed.config, input.config) && borrowed.agentId === input.agentId && borrowed.agentDir === input.agentDir && borrowed.inheritedAuthDir === input.inheritedAuthDir && borrowed.workspaceDir === input.workspaceDir && (!input.allowGatewaySubagentBinding || borrowed.allowGatewaySubagentBinding) && !input.readOnly && !input.loadRuntimePlugins && !input.skipCredentials && !input.env && preparedPluginGenerationSupportsSelections(options.pluginGeneration, input)) {
				assertAdmission();
				return {
					snapshot: borrowed,
					pluginGeneration: options.pluginGeneration,
					[Symbol.asyncDispose]: retainPreparedPluginGeneration(options.pluginGeneration)
				};
			}
			throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime plugin generation was superseded for ${input.agentDir}`);
		}
		const inventoryInput = context.getGatewayLifecycleActive() ? {
			...input,
			workspaceDir: configuredOwner?.input.workspaceDir
		} : input;
		if (provenance === "run" && context.getGatewayLifecycleActive() && options.catalogMode === "static" && !options.pluginGeneration && !options.pluginMetadataSnapshot && !input.readOnly && !input.loadRuntimePlugins && !input.skipCredentials && configuredOwner?.snapshot && configuredOwner.pluginGeneration && !configuredOwner.pending && !configuredOwner.needsRefresh && !configuredOwner.refreshError && configuredOwner.snapshot.config === input.config && ownerKey({
			...configuredOwner.input,
			runtimePluginSelections: void 0
		}) === ownerKey({
			...inventoryInput,
			runtimePluginSelections: void 0
		}) && preparedPluginGenerationSupportsSelections(configuredOwner.pluginGeneration, inventoryInput)) owner = configuredOwner;
		const ownerGenerationChanged = () => options.pluginGeneration !== void 0 && !preparedPluginGenerationReusesBase(owner?.pending ? owner.pendingPluginGeneration : owner?.pluginGeneration, options.pluginGeneration) || options.catalogMode === "live" && owner?.catalogMode === "static";
		if (owner?.pending) {
			assertPreparedModelRuntimeAdmissionCanWait(owner);
			admission.claim(key, owner);
			await racePromiseWithAbortSignal(owner.pending, options.abortSignal);
			assertAdmission();
		}
		let snapshot;
		const staleDynamicOwner = owner?.needsRefresh && (owner.provenance === "run" || owner.provenance === "ephemeral");
		if (!owner || staleDynamicOwner || ownerGenerationChanged()) {
			const publication = publishModelRuntimeSnapshot(input, context.owners, context.agentBuildCompletions, context.getBuildTimeoutMs(), void 0, provenance, options.catalogMode, options.pluginGeneration, pluginMetadataSnapshot);
			owner = context.owners.get(key);
			if (!owner) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
			admission.claim(key, owner);
			snapshot = await racePromiseWithAbortSignal(publication, options.abortSignal);
		} else {
			if (owner.needsRefresh) throw owner.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
			if (!owner.snapshot || input.readOnly && !preparedModelRuntimeConfigsMatch(owner.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
			snapshot = owner.snapshot;
		}
		assertAdmission();
		if (owner.needsRefresh || owner.snapshot !== snapshot) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
		const catalogOwner = configuredOwner && ownerKey({
			...configuredOwner.input,
			loadRuntimePlugins: false,
			runtimePluginPurpose: void 0,
			runtimePluginSelections: void 0
		}) === ownerKey({
			...inventoryInput,
			loadRuntimePlugins: false,
			runtimePluginPurpose: void 0,
			runtimePluginSelections: void 0
		}) ? configuredOwner : owner;
		snapshot = capturePreparedModelRuntimeCatalog(snapshot, catalogOwner.snapshot);
		const pluginGeneration = owner.pluginGeneration;
		if (owner.provenance !== provenance) return {
			snapshot,
			pluginGeneration,
			[Symbol.asyncDispose]: retainPreparedPluginGeneration(pluginGeneration)
		};
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
const CATALOG_RECOVERY_DEMAND_COOLDOWN_MS = 5e3;
const log$1 = createSubsystemLogger("agents/prepared-model-runtime");
function refreshCommittedProviderCatalogs(owners) {
	for (const owner of owners) {
		if (owner.provenance !== "configured" || owner.pending || owner.needsRefresh) continue;
		owner.catalogRecovery = void 0;
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
/** Includes unfinished or changed owners without replacing unrelated prepared generations. */
function resolveSafeRefreshAgentIds(config, options, owners) {
	if (!options.agentIds) return;
	const agentIds = new Set(options.agentIds);
	const inputs = new Map(listConfiguredRefreshInputs(config, options, owners).flatMap((input) => input.agentId ? [[input.agentId, input]] : []));
	for (const owner of owners.values()) {
		if (owner.provenance !== "configured" || !owner.input.agentId) continue;
		const input = inputs.get(owner.input.agentId);
		inputs.delete(owner.input.agentId);
		if (!input || !owner.snapshot || owner.needsRefresh || owner.catalogMode !== (options.catalogMode ?? "live") || options.pluginMetadataSnapshot && owner.snapshot.metadataSnapshot !== options.pluginMetadataSnapshot || ownerKey({
			...owner.input,
			config: input.config
		}) !== ownerKey(input)) agentIds.add(owner.input.agentId);
	}
	for (const agentId of inputs.keys()) agentIds.add(agentId);
	return agentIds;
}
/** Recovery operations share configured owners and the lifecycle's existing publication barrier. */
function createPreparedModelRuntimeRecovery(host) {
	const { owners, publish } = host;
	function recoverPlugin(owner) {
		if (!host.canRecover() || host.getReplacement() || owner.provenance !== "configured" || owner.pending || owners.get(ownerKey(owner.input)) !== owner) return;
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
	}
	async function recoverCatalog(borrowers) {
		const failed = new Map(borrowers.filter((borrower) => borrower.isCurrent()).map((borrower) => [borrower.agentDir, borrower]));
		const affected = [...owners.values()].filter((owner) => owner.provenance === "configured" && !owner.needsRefresh && !owner.pending && owner.input.agentId && owner.snapshot && failed.get(owner.input.agentDir)?.isCurrent());
		const first = affected[0];
		if (!first?.snapshot) return;
		try {
			await publish(first.input.config, {
				catalogMode: "static",
				allowGatewaySubagentBinding: true,
				agentIds: new Set(affected.flatMap((owner) => owner.input.agentId ? [owner.input.agentId] : [])),
				pluginMetadataSnapshot: first.snapshot.metadataSnapshot
			});
		} catch (error) {
			if (error instanceof Error && !(error instanceof PreparedModelRuntimePublicationSupersededError)) {
				const recovery = {
					error,
					scheduledAttempted: false,
					retryAfter: 0
				};
				for (const owner of affected) if (owners.get(ownerKey(owner.input)) === owner && owner.refreshError === error) owner.catalogRecovery = recovery;
			}
			throw error;
		}
	}
	/** Rechecks failed publications using the existing publication barrier. */
	async function ensureGatewayPreparedModelRuntimeReady({ agentId, demand = "interactive", abortSignal }) {
		if (abortSignal?.aborted) throw createAbortError("Prepared reply dispatch admission aborted", { cause: abortSignal.reason });
		if (!host.canRecover()) return;
		const owner = resolveConfiguredOwner(host.owners, {
			agentId,
			agentDir: ".",
			config: {}
		});
		const recovery = owner?.catalogRecovery;
		if (!owner || !recovery) return;
		const assertLifetime = host.captureLifetime();
		if (recovery.pending) {
			assertPreparedModelRuntimeAdmissionCanWait();
			if (demand === "scheduled") recovery.scheduledAttempted = true;
			await racePromiseWithAbortSignal(recovery.pending, abortSignal);
			assertLifetime();
			return;
		}
		const replacement = host.getAdmissionReplacement();
		if (replacement && !replacement.degraded) {
			assertPreparedModelRuntimeAdmissionCanWait();
			const joinsRecovery = recovery.replacementGateId === replacement.gateId;
			if (demand === "scheduled" && joinsRecovery) recovery.scheduledAttempted = true;
			await racePromiseWithAbortSignal(replacement.promise, abortSignal);
			assertLifetime();
			if (joinsRecovery) return;
			return await ensureGatewayPreparedModelRuntimeReady({
				agentId,
				demand,
				abortSignal
			});
		}
		if (!owner.needsRefresh || owner.refreshError !== recovery.error || demand === "scheduled" && recovery.scheduledAttempted) return;
		if (Date.now() < recovery.retryAfter) throw new PreparedModelRuntimeRecoveryError(agentId, "backoff", recovery.retryAfter, { cause: recovery.error });
		assertPreparedModelRuntimeAdmissionCanWait(owner);
		if (demand === "scheduled") recovery.scheduledAttempted = true;
		const affected = [...host.owners.values()].filter((candidate) => candidate.catalogRecovery === recovery);
		const recoveryClaim = {};
		const publication = host.publish(owner.input.config, {
			catalogMode: owner.catalogMode,
			allowGatewaySubagentBinding: owner.input.allowGatewaySubagentBinding,
			agentIds: new Set(affected.flatMap((candidate) => candidate.input.agentId ?? [])),
			pluginMetadataSnapshot: owner.snapshot?.metadataSnapshot,
			isPublicationCurrent: () => host.canRecover() && (host.owners.get(ownerKey(owner.input)) === owner || recoveryClaim.gateId !== void 0 && host.getReplacement()?.gateId === recoveryClaim.gateId)
		}).catch((error) => {
			if (error instanceof Error && !(error instanceof PreparedModelRuntimePublicationSupersededError) && host.owners.get(ownerKey(owner.input)) === owner && owner.catalogRecovery === recovery && owner.refreshError === error) {
				recovery.error = error;
				recovery.retryAfter = Date.now() + CATALOG_RECOVERY_DEMAND_COOLDOWN_MS;
				throw new PreparedModelRuntimeRecoveryError(agentId, "attempt-failed", recovery.retryAfter, { cause: error });
			}
			throw error;
		}).finally(() => {
			if (recovery.pending === publication) recovery.pending = void 0;
		});
		recovery.pending = publication;
		recoveryClaim.gateId = host.getReplacement()?.gateId;
		recovery.replacementGateId = recoveryClaim.gateId;
		await racePromiseWithAbortSignal(publication, abortSignal);
		assertLifetime();
	}
	return {
		ensureReady: ensureGatewayPreparedModelRuntimeReady,
		recoverCatalog,
		recoverPlugin
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-refresh.ts
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
	for (const owner of host.owners.values()) if (!owner.input.readOnly) advancePreparedModelRuntimeOwnerConfig(owner, config);
	host.replyDispatchPublication.advanceConfig(config);
}
/** Downloads become visible only after an independently prepared rows/pricing generation commits. */
function applyRemoteModelCatalogUpdateNow(host, getConfig, signal) {
	signal?.throwIfAborted();
	const assertLifetime = host.captureLifetime();
	const completion = host.publicationQueue.track(runOutsideRemoteModelCatalogSnapshot(async () => {
		const config = getConfig();
		const update = await readRemoteModelCatalogUpdate(config);
		assertLifetime();
		const replacement = update ? host.getPendingReplacement() : void 0;
		if (replacement) {
			await replacement;
			assertLifetime();
		}
		if (!update) return "unchanged";
		const catalog = update;
		const previous = captureRemoteModelCatalogStartupSnapshot();
		if (previous?.sourceUrl === catalog.sourceUrl) {
			if (previous.revision === catalog.revision) return "unchanged";
			if (previous.generatedAt > catalog.generatedAt) return "superseded";
		}
		const pending = host.pending;
		if (pending?.catalog.sourceUrl === catalog.sourceUrl) {
			if (pending.catalog.revision === catalog.revision && !pending.controller.signal.aborted) return await pending.completion;
			if (pending.catalog.generatedAt > catalog.generatedAt) return "superseded";
		}
		pending?.controller.abort(new PreparedModelRuntimePublicationSupersededError("A newer remote catalog was accepted"));
		const controller = new AbortController();
		const adoption = {
			catalog,
			controller,
			completion
		};
		host.pending = adoption;
		try {
			if (!await withRemoteModelCatalogSnapshot(catalog, () => publishPreparedModelRuntimeCatalogReplacement(host, catalog, previous, controller.signal))) return "superseded";
			notifyPreparedModelRuntimePublication({ phase: "published" });
			return "published";
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError || controller.signal.aborted || host.getCancellationSignal().aborted) return "superseded";
			throw error;
		} finally {
			if (host.pending === adoption) host.pending = void 0;
		}
	}));
	return racePromiseWithAbortSignal(completion, signal);
}
/** Rebuilds active owners after config/plugin runtime publication. */
async function refreshPreparedModelRuntimeSnapshotsNow(config, options, context) {
	await prepareSharedAuthStoreOwnership();
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
/** Builds privately; only the final serialized commit replaces request-visible owners. */
async function publishPreparedModelRuntimeCatalogReplacement(host, catalog, previous, adoptionSignal) {
	const claims = [...host.owners.values()].filter((owner) => owner.provenance === "configured").map((owner) => ({
		owner,
		generation: owner.generation,
		input: owner.input
	}));
	if (!claims.length || claims.some(({ owner }) => !owner.snapshot || owner.needsRefresh || owner.pending !== void 0)) return false;
	const signal = AbortSignal.any([adoptionSignal, host.getCancellationSignal()]);
	const buildTimeoutMs = host.getBuildTimeoutMs();
	const staged = /* @__PURE__ */ new Map();
	let committed = false;
	const candidates = claims.map(({ input, generation }) => {
		const candidate = prepareModelRuntimeOwner(input, "configured", "static");
		candidate.generation = generation;
		candidate.onPluginGenerationRetired = () => {
			if (committed) host.onPluginGenerationRetired(candidate);
		};
		return candidate;
	});
	const retireCandidates = () => {
		for (const owner of candidates) {
			owner.generation += 1;
			retirePreparedModelRuntimeGeneration(owner);
		}
	};
	signal.addEventListener("abort", retireCandidates, { once: true });
	try {
		await publishPreparedModelRuntimeOwnerBatch({
			ownersToPublish: candidates,
			owners: staged,
			agentBuildCompletions: host.agentBuildCompletions,
			buildTimeoutMs,
			registerEntriesAfterBuildStart: true,
			acquisitionSignal: signal,
			isPublicationCurrent: () => committed || !signal.aborted,
			isOwnerRegistered: (key, owner) => (committed ? host.owners : staged).get(key) === owner,
			isOwnerPublished: (key, owner) => committed && host.owners.get(key) === owner
		});
		const pricingSignal = AbortSignal.any([signal, AbortSignal.timeout(buildTimeoutMs)]);
		for (const config of new Set(candidates.map((owner) => owner.input.config))) await racePromiseWithAbortSignal(prepareModelPricingContext(config), pricingSignal);
		await racePromiseWithAbortSignal(Promise.allSettled(candidates.map(async (owner) => await owner.snapshot?.loadFullModelCatalog?.({
			refresh: true,
			changedOnly: true,
			wait: true
		}))), signal);
		await host.publicationQueue.enqueue(async () => {
			signal.throwIfAborted();
			if (claims.some(({ owner, generation, input }) => host.owners.get(ownerKey(input)) !== owner || owner.generation !== generation || owner.needsRefresh || owner.pending !== void 0) || candidates.some((owner) => owner.needsRefresh || !owner.pluginGeneration)) throw new PreparedModelRuntimePublicationSupersededError("A remote catalog owner retired before publication");
			for (const [index, candidate] of candidates.entries()) advancePreparedModelRuntimeOwnerConfig(candidate, claims[index].owner.input.config);
			const commitDispatch = host.replyDispatchPublication.stage(candidates);
			if (!publishRemoteModelCatalogSnapshot(catalog, previous)) throw new PreparedModelRuntimePublicationSupersededError("Remote catalog publication lost its accepted predecessor");
			commitDispatch();
			for (const owner of candidates) host.owners.set(ownerKey(owner.input), owner);
			committed = true;
			signal.removeEventListener("abort", retireCandidates);
			for (const owner of host.owners.values()) if (owner.provenance !== "configured") owner.needsRefresh = true;
			for (const { owner } of claims) {
				owner.generation += 1;
				retirePreparedModelRuntimeGeneration(owner);
				releasePreparedPluginPublication(owner);
			}
			staged.clear();
		});
		return true;
	} finally {
		signal.removeEventListener("abort", retireCandidates);
		if (!committed) {
			retireCandidates();
			await Promise.all(candidates.map(async (owner) => {
				releasePreparedPluginPublication(owner);
				if (owner.pluginGeneration) await discardPreparedPluginGeneration(owner.pluginGeneration);
			}));
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
	admit(completion, isCurrent) {
		const refresh = {
			completion,
			isCurrent
		};
		this.#latestRefresh = refresh;
		return refresh;
	}
	complete(publication, isCurrent, options, startup) {
		const assertLifetime = capturePreparedModelRuntimeLifetime();
		const refresh = this.admit(publication, isCurrent);
		const completion = options.joinSupersedingPublication ? (async () => {
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
		})() : publication;
		return startup ? startup.wait(completion) : completion;
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
	const catalog = await snapshot.loadFullModelCatalog({
		...options,
		refresh
	});
	if (owner.catalogStale && !catalog.pendingProviders?.length) owner.catalogStale = false;
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
	if (!getPreparedSharedAuthStoreOwnership(rawInput.env ?? process.env)) await prepareSharedAuthStoreOwnership(rawInput.env);
	assertLifetime();
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	assertLifetime();
	const replacement = context.getPendingReplacement(input);
	if (replacement) {
		assertPreparedModelRuntimeAdmissionCanWait();
		await replacement.promise;
		assertLifetime();
		input = rebindInputToCommittedConfiguredOwner(context.owners, input);
	}
	try {
		return await projectPublishedModelRuntimeOwner(input, context, project);
	} catch (error) {
		if (!isPreparedModelRuntimeMissingOwnerError(error)) throw error;
	}
	await activateStandalone(input);
	return await projectPublishedModelRuntimeOwner(input, context, project);
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
	if (!getPreparedSharedAuthStoreOwnership(rawInput.env ?? process.env)) await prepareSharedAuthStoreOwnership(rawInput.env);
	assertLifetime();
	const input = normalizePreparedModelRuntimeInput(rawInput);
	for (;;) {
		let replacement = context.getPendingReplacement(input);
		while (replacement) {
			assertPreparedModelRuntimeAdmissionCanWait();
			await replacement.promise;
			assertLifetime();
			replacement = context.getPendingReplacement(input);
		}
		const existing = resolvePublishedOwner(context.owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
		if (input.readOnly && existing && !preparedModelRuntimeConfigsMatch(existing.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared read-only model runtime owner was not published for the requested config (${input.agentDir})`);
		if (existing?.pending) {
			assertPreparedModelRuntimeAdmissionCanWait(existing);
			try {
				await existing.pending;
			} catch {}
			assertLifetime();
			continue;
		}
		if (existing?.needsRefresh) throw existing.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
		if (existing?.snapshot) return project(existing, existing.snapshot);
		throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
	}
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
/** Reads an immutable dispatch generation after the lifecycle's demand preparation. */
var PreparedReplyDispatchPublicationOwner = class {
	#publication;
	#changed;
	constructor(host) {
		this.host = host;
		this.#publication = EMPTY_REPLY_DISPATCH_PUBLICATION;
		this.#changed = createDeferredCore();
		this.load = async (params) => {
			const { agentId, abortSignal, onRuntimeLease } = params;
			let demandPrepared = false;
			for (;;) {
				if (abortSignal?.aborted) throw createAbortError("Prepared reply dispatch admission aborted", { cause: abortSignal.reason });
				if (!this.host.isGatewayLifecycleActive()) return;
				const replacement = this.host.getPendingReplacement(agentId);
				const pendingOwner = replacement ? void 0 : this.host.getConfiguredOwner(agentId);
				if (replacement) assertPreparedModelRuntimeAdmissionCanWait();
				else if (pendingOwner?.pending) assertPreparedModelRuntimeAdmissionCanWait(pendingOwner);
				if (!demandPrepared) {
					await this.host.ensureReady(params);
					demandPrepared = true;
					continue;
				}
				const pending = replacement ?? pendingOwner?.pending;
				if (pending) {
					await racePromiseWithAbortSignal(pending, abortSignal);
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
		this.stage(owners)();
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
const getBlockingReplacement = (input) => {
	const replacement = pendingModelRuntimeReplacement;
	if (replacement?.degraded) return;
	const agentIds = replacement?.agentIds;
	const owner = agentIds && input && !input.readOnly ? resolveConfiguredOwner(owners, input) : void 0;
	return agentIds && owner?.input.agentId && !agentIds.has(owner.input.agentId) && owner.snapshot && !owner.needsRefresh && !owner.pending ? void 0 : replacement;
};
const getAdmissionReplacement = (input) => modelRuntimeDrain.pending ?? getBlockingReplacement(input);
const replyDispatchPublication = new PreparedReplyDispatchPublicationOwner({
	retainOwner: retainPublishedModelRuntimeOwner,
	isGatewayLifecycleActive: () => gatewayLifecycleActive,
	getConfiguredOwner: (agentId) => resolveConfiguredOwner(owners, {
		agentId,
		agentDir: ".",
		config: {}
	}),
	getPendingReplacement: (agentId) => getAdmissionReplacement({
		agentId,
		agentDir: ".",
		config: {}
	})?.promise,
	isStartupPending: () => pendingModelRuntimeReplacement?.degraded === true,
	ensureReady: (params) => ensureGatewayPreparedModelRuntimeReady(params)
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
	return getBlockingReplacement(rawInput) ? void 0 : readPublishedModelRuntimeSnapshot(owners, rawInput);
}
/** Reads the owner-held publication barrier without starting catalog acquisition. */
function getPendingPreparedModelRuntimeReplacement() {
	return getBlockingReplacement()?.promise;
}
/** Fence new execution while plugin work drains, without withdrawing the active catalog. */
const beginPreparedModelRuntimePluginDrain = modelRuntimeDrain.begin;
/** Publishes one owner from an explicit startup/activation lifecycle boundary. */
async function publishPreparedModelRuntimeSnapshot(rawInput, options = {}) {
	const assertLifetime = captureModelRuntimeLifetime();
	const acquisitionSignal = refreshCancellation.signal;
	const input = getPreparedSharedAuthStoreOwnership(rawInput.env ?? process.env) ? normalizePreparedModelRuntimeInput(rawInput) : await prepareModelRuntimeInput(rawInput);
	assertLifetime();
	acquisitionSignal.throwIfAborted();
	const existing = owners.get(ownerKey(input));
	if (existing?.buildCompletion && !existing.pending) throw existing.refreshError ?? /* @__PURE__ */ new Error(`prepared model runtime build is still settling for ${input.agentDir}`);
	if (existing && !options.force && hasSameLifecycleInput(existing.input, input)) {
		if (existing.pending) {
			assertPreparedModelRuntimeAdmissionCanWait(existing);
			return await existing.pending;
		}
		if (existing.snapshot && !existing.needsRefresh) return existing.snapshot;
	}
	return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, options.providerDiscoveryTimeoutMs === void 0 ? modelRuntimeBuildTimeoutMs : modelRuntimeBuildTimeoutMs + options.providerDiscoveryTimeoutMs, existing, options.provenance, options.catalogMode, void 0, void 0, options.providerDiscoveryTimeoutMs);
}
/** Activates lifecycle publication for direct embedded runtimes without a gateway startup. */
async function activateStandalonePreparedModelRuntime(rawInput, options = {}) {
	const assertLifetime = captureModelRuntimeLifetime();
	const input = await prepareModelRuntimeInput(rawInput);
	assertLifetime();
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
	if (options.agentIds) replyDispatchPublication.remove(options.agentIds);
	else replyDispatchPublication.clear();
	const requestEpoch = ++refreshRequestEpoch;
	if (options.waitForReplacement) {
		const superseded = pendingModelRuntimeReplacement;
		const replacement = createPreparedModelRuntimeReplacement(options.agentIds);
		pendingModelRuntimeReplacement = replacement;
		publicationQueue.admit(replacement.promise, () => requestEpoch === refreshRequestEpoch);
		authPublication.adopt(replacement.gateId);
		superseded?.resolve();
	} else if (!options.preserveReplacementWait && pendingModelRuntimeReplacement) {
		const cancelled = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = void 0;
		cancelled.resolve();
	}
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
const modelRuntimeRecovery = createPreparedModelRuntimeRecovery({
	owners,
	canRecover: () => gatewayLifecycleActive && !refreshCancellation.signal.aborted,
	getReplacement: () => pendingModelRuntimeReplacement,
	getAdmissionReplacement: () => modelRuntimeDrain.pending ?? pendingModelRuntimeReplacement,
	captureLifetime: captureModelRuntimeLifetime,
	publish: refreshPreparedModelRuntimeSnapshots
});
const recoverPreparedModelRuntimeCatalogWorker = modelRuntimeRecovery.recoverCatalog;
const ensureGatewayPreparedModelRuntimeReady = modelRuntimeRecovery.ensureReady;
const remoteCatalogPublication = createRemoteCatalogPublication({
	...preparedModelRuntimeLeaseContext,
	publicationQueue,
	replyDispatchPublication,
	getCancellationSignal: () => refreshCancellation.signal,
	getPendingReplacement: () => (modelRuntimeDrain.pending ?? pendingModelRuntimeReplacement)?.promise,
	onPluginGenerationRetired: modelRuntimeRecovery.recoverPlugin
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
	gatewayLifecycleActive ||= options.gatewayLifecycle === true;
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
				if (isPublicationCurrent()) await drainPendingAuthMutations(publish, options);
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
			onPluginGenerationRetired: modelRuntimeRecovery.recoverPlugin
		});
		if (!isPublicationCurrent()) return;
		const drain = () => drainPendingAuthMutations(commitReplacement, options);
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
async function drainPendingAuthMutations(commit, options = {}) {
	await authPublication.drain({
		owners,
		publish: async (ownersToPublish, includeCredentialProviders, reuseGenerations) => await publishPreparedModelRuntimeOwnerBatch({
			ownersToPublish,
			owners,
			agentBuildCompletions,
			buildTimeoutMs: modelRuntimeBuildTimeoutMs,
			pluginMetadataSnapshot: options.pluginMetadataSnapshot,
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
	const { invalidatedOwners, invalidatedConfiguredAgentIds } = invalidatePreparedModelRuntimeOwnersForAuthMutation(owners, event);
	if (invalidatedOwners.length === 0) return;
	replyDispatchPublication.remove(invalidatedConfiguredAgentIds);
	const transaction = authPublication.enqueue(invalidatedOwners, event.profileSetChanged);
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
	const publication = readOnlyWorkerScope.exit(() => modelRuntimeDrain.runAfter(publicationQueue, publish));
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
export { retirePreparedModelRuntimeAgent as C, readCapturedPreparedModelRuntimeCatalog as D, readAdmittedPublishedModelCatalog as E, rejectPendingPreparedModelRuntimeReplacement as S, withPreparedModelRuntimeReadBatch as T, prepareModelRuntimeSnapshot as _, acquireReadOnlyPreparedModelRuntime as a, refreshPreparedModelRuntimeCatalog as b, applyRemoteModelCatalogUpdate as c, ensureGatewayPreparedModelRuntimeReady as d, getPendingPreparedModelRuntimeReplacement as f, markPreparedModelRuntimeSnapshotsStale as g, loadPublishedGatewayReplyDispatchRuntime as h, acquirePublishedPreparedModelRuntime as i, beginPreparedModelRuntimePluginDrain as l, loadPreparedModelRuntimeSnapshot as m, acquireAgentRuntimeCleanupRegistries as n, activateStandalonePreparedModelRuntime as o, getPreparedModelRuntimeSnapshot as p, acquirePreparedModelRuntimeSnapshot as r, advancePreparedModelRuntimeConfig as s, acquireAgentRunPreparedModelRuntime as t, cancelPreparedModelRuntimeRefresh as u, publishPreparedModelRuntimeSnapshot as v, preparedModelRuntimeConfigsMatch as w, refreshPreparedModelRuntimeSnapshots as x, recoverPreparedModelRuntimeCatalogWorker as y };
