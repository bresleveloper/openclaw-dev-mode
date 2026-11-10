import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { c as registerAgentDatabaseReaderCloser } from "./agent-database-readers-DSwi8tar.mjs";
import { _ as observeCanonicalAuthProfileCredentials, g as observeCachedCanonicalAuthProfileCredentials, l as cloneAuthProfileStore, o as isSafeToAdoptMainStoreOAuthIdentity, p as isSafeToCopyOAuthRoutingScope } from "./oauth-shared-CiaJlx_D.mjs";
import { a as noteAuthProfileFileWrite, c as registerAuthProfileFileChangeListener, o as readAuthProfileDatabaseIdentity, s as refreshAuthProfileFileState, t as admitAuthProfileLegacySources } from "./file-state-CTXmtyL_.mjs";
import { U as reportCommittedInlineAuthFailure } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as isSameOAuthRefreshGeneration } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { a as mergeAuthProfileStores, d as removePersonalAuthProfileReferences, r as loadPersistedAuthProfileStoreAtDatabasePath, t as buildPersistedAuthProfileSecretsStore } from "./persisted-DbIYEoQ3.mjs";
import { L as resolveLegacyAuthProfileSourceCandidates, P as registerFreshSharedAuthStoreHandoff, v as resolveAuthProfileDatabasePath, z as prepareSharedAuthStoreOwnershipForNative } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, l as resolveSharedAuthStoreOwnership, n as getPreparedSharedAuthStoreOwnership, o as prepareSharedAuthStoreOwnership, t as captureAuthProfileOwnerScope } from "./path-resolve-21Orzn6B.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { o as recordRuntimeAuthProfileStorePersistedMutation, r as getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath, s as resolveRuntimeStoreKey, t as runtimeAuthProfileRowsCache } from "./runtime-persisted-rows-B3SUt7CF.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/ownership.ts
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (!isSafeToCopyOAuthRoutingScope(params.local, params.main)) return false;
	if (isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.local,
		right: params.main
	})) return true;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	const mainExpires = asDateTimestampMs(params.main.expires);
	if (mainExpires === void 0) return false;
	const localExpires = asDateTimestampMs(params.local.expires);
	return localExpires === void 0 || mainExpires >= localExpires;
}
function isInheritedMainOAuthCredentialFromStores(params) {
	if (params.persistedStores.isMainStore || params.credential.type !== "oauth") return false;
	if (params.persistedStores.localStore?.profiles[params.profileId]) return false;
	const mainCredential = params.persistedStores.mainStore?.profiles[params.profileId];
	return mainCredential?.type === "oauth" && (isDeepStrictEqual(mainCredential, params.credential) || shouldUseMainOwnerForLocalOAuthCredential({
		profileId: params.profileId,
		local: params.credential,
		main: mainCredential
	}));
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-owner.ts
/** Canonical owner identity and nonpublishing auth snapshot composition. */
function createEmptyAuthProfileStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function stripRuntimeExternalProfileMetadata(store) {
	const stripped = { ...store };
	delete stripped.runtimeExternalProfileIds;
	delete stripped.runtimeExternalProfileIdsAuthoritative;
	return stripped;
}
function markRuntimePersistedProfiles(store, persistedStore = store) {
	const profileIds = Object.entries(persistedStore.profiles).flatMap(([profileId, credential]) => isDeepStrictEqual(store.profiles[profileId], credential) ? [profileId] : []).toSorted();
	return {
		...store,
		runtimePersistedProfileIds: profileIds.length > 0 ? profileIds : void 0,
		runtimeLocalOrderProviderIds: Object.keys(persistedStore.order ?? {}).toSorted()
	};
}
function setRuntimeLocalProfileMetadata(store, localProfileIds, runtimeInheritsMainState = false, localStore) {
	return {
		...store,
		runtimeLocalProfileIds: [...new Set(localProfileIds)].toSorted(),
		...runtimeInheritsMainState ? { runtimeInheritsMainState: true } : {},
		...localStore ? { runtimeHasLocalOAuthProfiles: Object.values(localStore.profiles).some((credential) => credential.type === "oauth") } : {}
	};
}
function runtimeStoreInheritsMainState(store, localStore) {
	const state = ({ order, lastGood, usageStats }) => ({
		order,
		lastGood,
		usageStats
	});
	return !isDeepStrictEqual(state(store), state(localStore));
}
function listRuntimeLocalProfileIds(store, mainStore) {
	if (store.runtimeLocalProfileIds) return store.runtimeLocalProfileIds;
	return Object.entries(store.profiles).flatMap(([profileId, credential]) => mainStore && shouldUseMainOwnerForLocalOAuthCredential({
		profileId,
		local: credential,
		main: mainStore.profiles[profileId]
	}) ? [] : [profileId]);
}
function mergeLocalAuthProfileStoreWithInheritedStore(localStore, inheritedStore) {
	const merged = inheritedStore ? mergeAuthProfileStores(inheritedStore, localStore, { preserveBaseRuntimeExternalProfiles: true }) : localStore;
	return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(merged), listRuntimeLocalProfileIds(localStore, inheritedStore), runtimeStoreInheritsMainState(merged, localStore), localStore);
}
/** Unchanged local rows and selection state need only the committed shared credentials. */
function updateRuntimeAuthProfileStoreInheritedCredentials(store, inherited, mutation) {
	if (store.runtimeHasLocalOAuthProfiles !== false || !store.runtimeLocalProfileIds || mutation.stateChanged || mutation.profileSetChanged) return;
	const local = new Set(store.runtimeLocalProfileIds);
	return replaceRuntimeAuthProfileStoreCredentials(store, inherited, [...mutation.profileIds].filter((id) => !local.has(id)));
}
/** Replace only admitted credential identities, retaining the host's same-ref materializations. */
function replaceRuntimeAuthProfileStoreCredentials(store, committed, changed) {
	if (changed.length === 0) return store;
	const profiles = { ...store.profiles };
	const external = new Set(store.runtimeExternalProfileIds);
	for (const id of changed) {
		const next = committed.profiles[id];
		const credential = next && preserveResolvedCredential(next, profiles[id]);
		if (!profiles[id] || !credential) return;
		if (!isDeepStrictEqual(profiles[id], credential)) external.delete(id);
		profiles[id] = credential;
	}
	return {
		...store,
		version: Math.max(store.version, committed.version),
		profiles,
		runtimePersistedProfileIds: [.../* @__PURE__ */ new Set([...store.runtimePersistedProfileIds ?? [], ...changed])].toSorted(),
		runtimeExternalProfileIds: external.size > 0 || store.runtimeExternalProfileIdsAuthoritative ? [...external].toSorted() : void 0
	};
}
/** Compose the selected durable owner without publishing or discovering an ambient environment. */
function loadRuntimeAuthProfileOwnerSnapshot(owner, options = {}) {
	if (options.candidates) admitAuthProfileLegacySources([...options.candidates.local, ...options.candidates.shared].map((source) => source.path));
	assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath);
	assertAuthProfileMigrationStateAtDatabasePath(owner.sharedDatabasePath);
	const isShared = owner.databasePath === owner.sharedDatabasePath;
	const sharedKind = owner.location === "state-db" ? "shared-state" : "agent";
	const sharedStore = isShared ? void 0 : options.inheritedStore ?? markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, sharedKind) ?? createEmptyAuthProfileStore());
	if (sharedStore && !options.inheritedStore) observeCanonicalAuthProfileCredentials(owner.sharedDatabasePath, sharedStore.profiles);
	if (options.candidates && sharedStore) assertAuthProfileMigrationCandidates({
		databasePath: owner.sharedDatabasePath,
		candidates: options.candidates.shared,
		hasCredentials: () => Object.keys(sharedStore.profiles).length > 0
	});
	const localStore = markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.databasePath, isShared ? sharedKind : "agent") ?? createEmptyAuthProfileStore());
	observeCanonicalAuthProfileCredentials(owner.databasePath, localStore.profiles);
	if (options.candidates) assertAuthProfileMigrationCandidates({
		databasePath: owner.databasePath,
		candidates: isShared ? options.candidates.shared : options.candidates.local,
		hasCredentials: () => Object.keys(localStore.profiles).length > 0
	});
	return sharedStore ? mergeLocalAuthProfileStoreWithInheritedStore(localStore, sharedStore) : setRuntimeLocalProfileMetadata(localStore, listRuntimeLocalProfileIds(localStore));
}
/** Diagnostic source facts never participate in canonical ownership decisions. */
function captureRuntimeAuthProfileLegacyCandidates(agentDir, env = process.env) {
	return {
		local: resolveLegacyAuthProfileSourceCandidates({
			agentDir,
			env
		}),
		shared: resolveLegacyAuthProfileSourceCandidates({ env })
	};
}
function cloneRuntimeAuthProfileLegacyCandidates(candidates) {
	return candidates && {
		local: candidates.local.map((source) => ({ ...source })),
		shared: candidates.shared.map((source) => ({ ...source }))
	};
}
function prepareRuntimeAuthProfileStoreSnapshots(entries, env = process.env) {
	if (entries.length === 0) return [];
	const owner = captureRuntimeAuthSharedOwner(env);
	return entries.map((entry) => {
		const databasePath = entry.databasePath ?? (entry.agentDir ? resolveAuthProfileDatabasePath(entry.agentDir) : owner.sharedDatabasePath);
		return {
			databasePath,
			agentDir: path.dirname(databasePath),
			store: cloneAuthProfileStore(entry.store),
			owner: cloneRuntimeAuthSharedOwner(owner),
			legacyCandidates: captureRuntimeAuthProfileLegacyCandidates(databasePath === owner.sharedDatabasePath ? void 0 : entry.agentDir ?? path.dirname(databasePath), env)
		};
	});
}
function cloneRuntimeAuthSharedOwner(owner) {
	return owner.kind === "unresolved" ? {
		...owner,
		scope: { ...owner.scope }
	} : { ...owner };
}
function captureRuntimeAuthSharedOwner(env = process.env) {
	return {
		kind: "resolved",
		sharedDatabasePath: resolveSharedAuthStorePath(env),
		location: resolveSharedAuthStoreOwnership(env).location
	};
}
function runtimeAuthProfileSnapshotSharesOwner(snapshot, owner) {
	return resolveRuntimeAuthSharedOwnerPath(snapshot, owner.location) === owner.sharedDatabasePath;
}
/** Resolve a captured owner's path without opening a cold scope or consulting ambient state. */
function resolveRuntimeAuthSharedOwnerPath(snapshot, location) {
	if (snapshot.kind === "resolved") return snapshot.sharedDatabasePath;
	return location === "state-db" ? resolveOpenClawStateSqlitePath({ OPENCLAW_STATE_DIR: snapshot.scope.stateDir }) : path.join(snapshot.scope.sharedMainDir, "openclaw-agent.sqlite");
}
function runtimeAuthSharedOwnerRebound(previous, next) {
	return next.kind === "resolved" ? !runtimeAuthProfileSnapshotSharesOwner(previous, next) : !isDeepStrictEqual(previous, next);
}
/** Model metadata follows credentials and availability, never rotation bookkeeping. */
function runtimeAuthMetadataState(store, includeAvailability = true) {
	return {
		order: store.order,
		profiles: store.profiles,
		runtimePersistedProfileIds: store.runtimePersistedProfileIds,
		runtimeExternalProfileIds: store.runtimeExternalProfileIds,
		runtimeExternalProfileIdsAuthoritative: store.runtimeExternalProfileIdsAuthoritative,
		runtimeLocalProfileIds: store.runtimeLocalProfileIds,
		runtimeLocalOrderProviderIds: store.runtimeLocalOrderProviderIds,
		availability: includeAvailability ? Object.fromEntries(Object.entries(store.usageStats ?? {}).flatMap(([profileId, stats]) => {
			if (!store.profiles[profileId] && !profileId.startsWith("inline-api-key:")) return [];
			const availability = {
				blockedUntil: stats.blockedUntil,
				blockedModel: stats.blockedModel,
				blockedScope: stats.blockedScope,
				cooldownUntil: stats.cooldownUntil,
				cooldownReason: stats.cooldownReason,
				cooldownModel: stats.cooldownModel,
				disabledUntil: stats.disabledUntil,
				disabledReason: stats.disabledReason
			};
			return Object.values(availability).some((value) => value !== void 0) ? [[profileId, availability]] : [];
		})) : void 0
	};
}
/** Composed ownership and catalog facts must match before a mutation can preserve plugins. */
function classifyRuntimeAuthProfileSnapshotChange(previous, next) {
	const metadata = (entry, includeAvailability = true) => entry && {
		state: runtimeAuthMetadataState(entry.store, includeAvailability),
		owner: entry.owner,
		legacyCandidates: entry.legacyCandidates
	};
	if (isDeepStrictEqual(metadata(previous), metadata(next))) return "unchanged";
	return isDeepStrictEqual(metadata(previous, false), metadata(next, false)) ? "availability" : "catalog";
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	if (store.runtimeCredentialSources) store.runtimeCredentialSources = Object.fromEntries(Object.entries(store.runtimeCredentialSources).filter(([profileId]) => keptProfileIds.has(profileId)));
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId) || profileId.startsWith("inline-api-key:"))) : void 0;
	for (const field of [
		"runtimePersistedProfileIds",
		"runtimeLocalProfileIds",
		"runtimeExternalProfileIds"
	]) store[field] = store[field]?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function preserveResolvedSecretBackedCredentials(params) {
	const next = cloneAuthProfileStore(params.next);
	for (const [profileId, credential] of Object.entries(next.profiles)) next.profiles[profileId] = preserveResolvedCredential(credential, params.existing.profiles[profileId]);
	return next;
}
function preserveResolvedCredential(credential, existing) {
	if (credential.type === "api_key" && existing?.type === "api_key" && credential.key === void 0 && existing.key !== void 0 && isSecretRef(credential.keyRef) && isDeepStrictEqual(credential.keyRef, existing.keyRef)) return {
		...credential,
		key: existing.key
	};
	if (credential.type === "token" && existing?.type === "token" && credential.token === void 0 && existing.token !== void 0 && isSecretRef(credential.tokenRef) && isDeepStrictEqual(credential.tokenRef, existing.tokenRef)) return {
		...credential,
		token: existing.token
	};
	return credential;
}
//#endregion
//#region src/agents/auth-profiles/runtime-file-observation.ts
/** Observe persisted sources while snapshot publication stays with its existing owner. */
function createRuntimeAuthProfileFileObservation({ snapshots, rowsCache, invalidatePaths }) {
	let refreshExternalAuth;
	let externalRefresh;
	let externalRefreshRevision = 0;
	const externalChanges = /* @__PURE__ */ new Map();
	/** Only canonical reads and committed local stores establish file-backed source provenance. */
	function recordRuntimeAuthProfilePersistedStore(databasePath, store) {
		if (isArtifactPreservingStateRead() || getOpenClawDatabaseMaintenanceScope()) return;
		const identity = readAuthProfileDatabaseIdentity(databasePath);
		if (!identity || !isMainThread) return;
		rowsCache.recordSource(databasePath, `${identity.key}:${identity.birthtime ?? ""}`, store);
	}
	/** Explicit refresh retires cached rows; the next owner read reloads persisted facts. */
	async function refreshRuntimeAuthProfileStoreSources() {
		await refreshAuthProfileFileState();
		rowsCache.invalidateRows();
	}
	registerAgentDatabaseReaderCloser((candidates, retainedPaths) => {
		rowsCache.retire(candidates, retainedPaths);
	});
	/** Secrets activation remains the owner of resolved credential publications. */
	function registerRuntimeAuthProfileExternalRefresh(refresh) {
		refreshExternalAuth = refresh;
	}
	function refreshExternalAuthPaths(paths) {
		if (paths.length) {
			const expected = new Map(snapshots);
			for (const pathname of paths) externalChanges.set(pathname, expected);
		}
		if (externalRefresh || !externalChanges.size) return;
		externalRefresh = (async () => {
			const revision = externalRefreshRevision;
			while (externalChanges.size) {
				if (revision !== externalRefreshRevision) break;
				const pending = [...externalChanges];
				externalChanges.clear();
				const invalidateCurrent = () => {
					for (const [pathname, captured] of pending) invalidatePaths([pathname], (target) => snapshots.get(target) === captured.get(target));
				};
				try {
					if (!await refreshExternalAuth?.(pending.map(([pathname]) => pathname)) && revision === externalRefreshRevision) invalidateCurrent();
				} catch (error) {
					if (revision !== externalRefreshRevision) return;
					invalidateCurrent();
					reportCommittedInlineAuthFailure("Auth file observation refresh failed", error);
				}
			}
		})().finally(() => {
			externalRefresh = void 0;
			refreshExternalAuthPaths([]);
		});
	}
	registerAuthProfileFileChangeListener(({ directory, identityChanged, sourcesChanged, createdPaths }) => {
		const unprovenCreation = createdPaths.some((pathname) => !rowsCache.hasSource(pathname));
		if (!identityChanged && !sourcesChanged && !unprovenCreation) return;
		const paths = [...snapshots].flatMap(([key, entry]) => {
			const candidates = entry.legacyCandidates;
			return path.dirname(key) === directory || entry.owner.kind === "resolved" && path.dirname(entry.owner.sharedDatabasePath) === directory || sourcesChanged && candidates && [...candidates.local, ...candidates.shared].some((source) => path.dirname(source.path) === directory) ? [key] : [];
		});
		invalidatePaths(paths);
		refreshExternalAuthPaths(paths);
	});
	return {
		recordRuntimeAuthProfilePersistedStore,
		refreshRuntimeAuthProfileStoreSources,
		registerRuntimeAuthProfileExternalRefresh,
		reset() {
			externalRefreshRevision += 1;
			externalChanges.clear();
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-materializations.ts
const materializations = /* @__PURE__ */ new Map();
const listeners = /* @__PURE__ */ new Set();
function notify(agentDir) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0
	};
	for (const listener of listeners) listener(event);
}
function registerRuntimeAuthMaterializationMutationListener(listener) {
	return registerListener(listeners, listener);
}
/** Records successful auth at the boundary that proved one exact runtime route. */
function recordRuntimeAuthMaterialization(params) {
	const fact = {
		provider: normalizeProviderId(params.provider),
		modelId: params.modelId.trim(),
		modelApi: params.modelApi.trim().toLowerCase(),
		modelBaseUrl: params.modelBaseUrl.trim(),
		requestTransportOverrides: params.requestTransportOverrides,
		authMode: params.authMode.trim().toLowerCase(),
		runtimeOwnerId: params.runtimeOwnerId.trim().toLowerCase(),
		...params.authProfileId?.trim() ? { authProfileId: params.authProfileId.trim() } : {}
	};
	if (Object.values(fact).some((value) => !value)) return false;
	const key = resolveRuntimeStoreKey(params.agentDir);
	const existing = materializations.get(key) ?? [];
	if (existing.some((candidate) => isDeepStrictEqual(candidate, fact))) return false;
	materializations.set(key, [...existing, fact].slice(-64));
	notify(params.agentDir);
	return true;
}
/** Revokes all facts backed by one runtime owner after a classified auth failure. */
function revokeRuntimeAuthMaterializations(params) {
	const key = resolveRuntimeStoreKey(params.agentDir);
	const provider = normalizeProviderId(params.provider);
	const runtimeOwnerId = params.runtimeOwnerId.trim().toLowerCase();
	const existing = materializations.get(key);
	if (!provider || !runtimeOwnerId || !existing) return false;
	const next = existing.filter((fact) => fact.provider !== provider || fact.runtimeOwnerId !== runtimeOwnerId);
	if (next.length === existing.length) return false;
	if (next.length) materializations.set(key, next);
	else materializations.delete(key);
	notify(params.agentDir);
	return true;
}
function getPreparedRuntimeAuthMaterializations(agentDir) {
	return materializations.get(resolveRuntimeStoreKey(agentDir)) ?? [];
}
/** Clears materializations for an already resolved canonical auth database owner. */
function clearRuntimeAuthMaterializationsAtDatabasePath(databasePath) {
	materializations.delete(databasePath);
}
function clearAllRuntimeAuthMaterializations() {
	materializations.clear();
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-selection.ts
/** Retain overlays while preparing snapshots for the acknowledged shared-owner handoff. */
function prepareRuntimeAuthProfileSharedOwnerHandoff(entries, { previousSharedDatabasePath, sharedDatabasePath, env }) {
	let rebound = false;
	for (const entry of entries) {
		if (entry.owner.kind === "resolved" && entry.owner.location !== "legacy-main" || !runtimeAuthProfileSnapshotSharesOwner(entry.owner, {
			sharedDatabasePath: previousSharedDatabasePath,
			location: "legacy-main"
		})) continue;
		rebound = true;
		entry.owner = {
			kind: "resolved",
			sharedDatabasePath,
			location: "state-db"
		};
		entry.legacyCandidates = captureRuntimeAuthProfileLegacyCandidates(entry.agentDir, env);
	}
	return rebound ? entries : void 0;
}
function sharedMutationAffectsSnapshot(mutation) {
	if (!mutation || mutation.stateChanged) return () => true;
	if (!mutation.credentialsChanged && !mutation.profileSetChanged) return () => false;
	const changedProfileIds = [...mutation.profileIds];
	return (store) => {
		if (store.runtimeHasLocalOAuthProfiles !== false || !store.runtimeLocalProfileIds || changedProfileIds.length === 0) return true;
		const localIds = new Set(store.runtimeLocalProfileIds);
		return changedProfileIds.some((id) => !localIds.has(id));
	};
}
function cloneOwnedRuntimeAuthProfileStoreSnapshot(databasePath, entry) {
	return {
		databasePath,
		agentDir: path.dirname(databasePath),
		store: cloneAuthProfileStore(entry.store),
		owner: cloneRuntimeAuthSharedOwner(entry.owner),
		legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(entry.legacyCandidates)
	};
}
/** Borrow the snapshot owner's map; selection never retains or mutates credential state. */
function createRuntimeAuthProfileSnapshotSelection(snapshots, invalidate) {
	/** Select producer-owned identities before copying any credential bodies. */
	function listRuntimeAuthProfileStoreSnapshotTargetsForSharedOwner(owner, mutation) {
		const affected = sharedMutationAffectsSnapshot(mutation);
		return Array.from(snapshots).filter(([databasePath, entry]) => databasePath !== owner.sharedDatabasePath && runtimeAuthProfileSnapshotSharesOwner(entry.owner, owner) && affected(entry.store)).map(([databasePath]) => ({
			databasePath,
			agentDir: path.dirname(databasePath)
		}));
	}
	/** Captures the published owners once; catalog reads refresh usage without opening storage. */
	function createPreparedRuntimeAuthProfileUsageReader(agentDir, inheritedAuthDir) {
		const requestedKey = resolveRuntimeStoreKey(agentDir);
		const requestedOwner = snapshots.get(requestedKey)?.owner;
		const inheritedKey = inheritedAuthDir ? resolveRuntimeStoreKey(inheritedAuthDir) : requestedOwner?.kind === "resolved" ? requestedOwner.sharedDatabasePath : requestedKey;
		const owners = [.../* @__PURE__ */ new Set([inheritedKey, requestedKey])].flatMap((key) => {
			const entry = snapshots.get(key);
			return entry ? [{
				key,
				owner: entry.owner
			}] : [];
		});
		return (store) => {
			const current = /* @__PURE__ */ new Map();
			for (const { key, owner } of owners) {
				const entry = snapshots.get(key);
				if (!entry || runtimeAuthSharedOwnerRebound(owner, entry.owner)) return store;
				current.set(key, entry.store);
			}
			const inherited = current.get(inheritedKey);
			const requested = current.get(requestedKey);
			const published = inherited && requested && inheritedKey !== requestedKey ? mergeAuthProfileStores(inherited, requested, { preserveBaseRuntimeExternalProfiles: true }) : requested ?? inherited;
			if (!published) return store;
			const workerProfiles = buildPersistedAuthProfileSecretsStore(store).profiles;
			const publishedProfiles = buildPersistedAuthProfileSecretsStore(published).profiles;
			let usageStats;
			const profileIds = /* @__PURE__ */ new Set([
				...Object.keys(workerProfiles),
				...Object.keys(store.usageStats ?? {}).filter((id) => id.startsWith("inline-api-key:")),
				...Object.keys(published.usageStats ?? {}).filter((id) => id.startsWith("inline-api-key:"))
			]);
			for (const profileId of profileIds) {
				if (!isDeepStrictEqual(workerProfiles[profileId], publishedProfiles[profileId])) continue;
				const usageOwner = published.profiles[profileId] === requested?.profiles[profileId] ? requested : inherited;
				const usage = profileId.startsWith("inline-api-key:") ? published.usageStats?.[profileId] : usageOwner?.usageStats?.[profileId];
				if (isDeepStrictEqual(store.usageStats?.[profileId], usage)) continue;
				usageStats ??= { ...store.usageStats };
				if (usage === void 0) delete usageStats[profileId];
				else usageStats[profileId] = usage;
			}
			return usageStats ? {
				...store,
				usageStats: cloneAuthProfileStore({
					version: store.version,
					profiles: {},
					usageStats
				}).usageStats
			} : store;
		};
	}
	/** Reads a cloned runtime auth profile store snapshot for an agent dir. */
	function getRuntimeAuthProfileStoreSnapshotCore(agentDir) {
		if (!agentDir && !getPreparedSharedAuthStoreOwnership(process.env)) return;
		return getRuntimeAuthProfileStoreSnapshotAtDatabasePath(resolveRuntimeStoreKey(agentDir));
	}
	function getRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath) {
		const store = snapshots.get(databasePath)?.store;
		if (store) observeCachedCanonicalAuthProfileCredentials(store.profiles);
		return store ? cloneAuthProfileStore(store) : void 0;
	}
	/**
	* Reads the effective prepared auth store without falling back to persisted storage.
	* Lifecycle consumers use this after auth publication so request paths never reopen SQLite.
	*/
	function getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir, env) {
		if ((!agentDir || !inheritedAuthDir) && !getPreparedSharedAuthStoreOwnership(env ?? process.env)) return;
		const inheritedKey = resolveRuntimeStoreKey(inheritedAuthDir, env);
		const requestedKey = resolveRuntimeStoreKey(agentDir, env);
		const inherited = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(inheritedKey);
		if (requestedKey === inheritedKey) return inherited;
		const requested = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(requestedKey);
		if (agentDir && inherited && requested) return mergeAuthProfileStores(inherited, requested, { preserveBaseRuntimeExternalProfiles: true });
		if (agentDir && !requested && inherited) return {
			...inherited,
			runtimeLocalOrderProviderIds: []
		};
		return requested ?? inherited;
	}
	/** Checks the owned profile keys without copying private credential data out of the owner. */
	function hasRuntimeAuthProfileStoreSource(agentDir, env) {
		const store = snapshots.get(resolveRuntimeStoreKey(agentDir, env))?.store;
		return Boolean(store && Object.keys(store.profiles).length > 0);
	}
	/** Returns true when requested or main runtime snapshots contain profiles. */
	function hasAnyRuntimeAuthProfileStoreSource(agentDir) {
		return hasRuntimeAuthProfileStoreSource(agentDir) || Boolean(agentDir) && hasRuntimeAuthProfileStoreSource();
	}
	return {
		/** Newer incremental views can still omit this write; discard matching owner views on failure. */
		invalidateRuntimeAuthProfileStoreSnapshotsForOwner: (owner, isCurrent) => {
			const targets = [{
				databasePath: owner.databasePath,
				agentDir: owner.databasePath === owner.sharedDatabasePath ? void 0 : path.dirname(owner.databasePath)
			}, ...owner.databasePath === owner.sharedDatabasePath ? listRuntimeAuthProfileStoreSnapshotTargetsForSharedOwner(owner) : []];
			for (const target of targets) try {
				if (isCurrent && !isCurrent(target.databasePath)) continue;
				const entry = snapshots.get(target.databasePath);
				if (!entry || runtimeAuthProfileSnapshotSharesOwner(entry.owner, owner)) invalidate(target.databasePath, target.agentDir);
			} catch (error) {
				reportCommittedInlineAuthFailure("Auth snapshot invalidation observer failed", error);
			}
		},
		createPreparedRuntimeAuthProfileUsageReader,
		getRuntimeAuthProfileStoreSnapshotCore,
		getRuntimeAuthProfileStoreSnapshotAtDatabasePath,
		getPreparedRuntimeAuthProfileStoreSnapshotCore,
		hasRuntimeAuthProfileStoreSource,
		hasAnyRuntimeAuthProfileStoreSource,
		getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath: (databasePath) => {
			const entry = snapshots.get(databasePath);
			if (entry) observeCachedCanonicalAuthProfileCredentials(entry.store.profiles);
			return entry && cloneOwnedRuntimeAuthProfileStoreSnapshot(databasePath, entry);
		},
		listOwnedRuntimeAuthProfileStoreSnapshots: () => Array.from(snapshots, ([databasePath, entry]) => cloneOwnedRuntimeAuthProfileStoreSnapshot(databasePath, entry)),
		listRuntimeAuthProfileStoreSnapshotsForSharedOwner: (owner, mutation) => listRuntimeAuthProfileStoreSnapshotTargetsForSharedOwner(owner, mutation).map(({ databasePath }) => cloneOwnedRuntimeAuthProfileStoreSnapshot(databasePath, snapshots.get(databasePath)))
	};
}
/** Prepare replacements without publishing or recopying unchanged private snapshots. */
function prepareRuntimeAuthProfileSharedCredentialSnapshots(snapshots, owner, committed, mutation) {
	const profileIds = [...mutation.profileIds];
	const prepared = /* @__PURE__ */ new Map();
	const deferred = [];
	const affected = sharedMutationAffectsSnapshot({
		...mutation,
		profileIds
	});
	for (const [key, entry] of snapshots) {
		if (!runtimeAuthProfileSnapshotSharesOwner(entry.owner, owner) || key !== owner.databasePath && !affected(entry.store)) continue;
		let store;
		try {
			assertAuthProfileMigrationStateAtDatabasePath(key);
			assertAuthProfileMigrationStateAtDatabasePath(owner.sharedDatabasePath);
			store = key === owner.databasePath ? replaceRuntimeAuthProfileStoreCredentials(entry.store, committed, profileIds) : updateRuntimeAuthProfileStoreInheritedCredentials(entry.store, committed, {
				...mutation,
				profileIds
			});
		} catch {}
		if (store) prepared.set(key, {
			...entry,
			store
		});
		else deferred.push(cloneOwnedRuntimeAuthProfileStoreSnapshot(key, entry));
	}
	return {
		prepared,
		deferred
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshots.ts
/**
* Process-local auth profile snapshots used by prepared runtimes and tests.
* Snapshots are cloned at boundaries so callers cannot mutate shared state.
*/
const runtimeAuthStoreSnapshots = /* @__PURE__ */ new Map();
const { invalidateRuntimeAuthProfileStoreSnapshotsForOwner, createPreparedRuntimeAuthProfileUsageReader, getRuntimeAuthProfileStoreSnapshotCore, getRuntimeAuthProfileStoreSnapshotAtDatabasePath, getPreparedRuntimeAuthProfileStoreSnapshotCore, hasRuntimeAuthProfileStoreSource, hasAnyRuntimeAuthProfileStoreSource, getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath, listOwnedRuntimeAuthProfileStoreSnapshots, listRuntimeAuthProfileStoreSnapshotsForSharedOwner } = createRuntimeAuthProfileSnapshotSelection(runtimeAuthStoreSnapshots, clearRuntimeAuthProfileStoreSnapshotAtDatabasePath);
const runtimeAuthStoreMutationListeners = /* @__PURE__ */ new Set();
let pendingSnapshotNotifications;
let runtimeAuthStoreCredentialsRevision = 0;
let runtimeAuthStoreSnapshotsRevision = 0;
const runtimeAuthStoreSnapshotRevisions = /* @__PURE__ */ new Map();
const runtimeAuthStoreDeletedSnapshotRevisions = /* @__PURE__ */ new Map();
function createMetadataRevisions(fallbackLatest = false) {
	let revision = 0;
	let floor = 0;
	const revisions = /* @__PURE__ */ new Map();
	return {
		advance(key) {
			revisions.delete(key);
			revisions.set(key, ++revision);
			while (revisions.size > 256) {
				const [oldestKey, oldestRevision] = revisions.entries().next().value;
				revisions.delete(oldestKey);
				floor = Math.max(floor, oldestRevision);
			}
		},
		clear() {
			floor = ++revision;
			revisions.clear();
		},
		get: (key) => revisions.get(key) ?? (fallbackLatest ? revision : floor)
	};
}
const metadataRevisions = createMetadataRevisions(true);
const catalogRevisions = createMetadataRevisions();
const runtimeAuthFileObservation = createRuntimeAuthProfileFileObservation({
	snapshots: runtimeAuthStoreSnapshots,
	rowsCache: runtimeAuthProfileRowsCache,
	invalidatePaths: invalidateExternalAuthPaths
});
const { recordRuntimeAuthProfilePersistedStore, refreshRuntimeAuthProfileStoreSources, registerRuntimeAuthProfileExternalRefresh } = runtimeAuthFileObservation;
function invalidateExternalAuthPaths(paths, isCurrent) {
	for (const databasePath of paths) {
		const entry = runtimeAuthStoreSnapshots.get(databasePath);
		const shared = [...runtimeAuthStoreSnapshots.values()].find(({ owner }) => owner.kind === "resolved" && owner.sharedDatabasePath === databasePath);
		if (!isCurrent) runtimeAuthProfileRowsCache.clear(databasePath);
		if (shared?.owner.kind === "resolved") invalidateRuntimeAuthProfileStoreSnapshotsForOwner({
			databasePath,
			...shared.owner
		}, isCurrent);
		else if (entry?.owner.kind === "resolved") invalidateRuntimeAuthProfileStoreSnapshotsForOwner({
			databasePath,
			...entry.owner
		}, isCurrent);
		else if (!isCurrent || isCurrent(databasePath)) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath);
	}
}
registerFreshSharedAuthStoreHandoff((handoff) => {
	if (!handoff.sourceStillCurrent) {
		invalidateRuntimeAuthProfileStoreSnapshotsForOwner({
			databasePath: handoff.previousSharedDatabasePath,
			sharedDatabasePath: handoff.previousSharedDatabasePath,
			location: "legacy-main"
		});
		return;
	}
	const entries = prepareRuntimeAuthProfileSharedOwnerHandoff(listOwnedRuntimeAuthProfileStoreSnapshots(), handoff);
	if (entries) replaceOwnedRuntimeAuthProfileStoreSnapshots(entries);
});
function recordDeletedSnapshotRevision(key) {
	runtimeAuthStoreSnapshotRevisions.delete(key);
	runtimeAuthStoreDeletedSnapshotRevisions.delete(key);
	runtimeAuthStoreDeletedSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
	while (runtimeAuthStoreDeletedSnapshotRevisions.size > 256) runtimeAuthStoreDeletedSnapshotRevisions.delete(runtimeAuthStoreDeletedSnapshotRevisions.keys().next().value);
}
function advanceRuntimeAuthStoreMetadataRevision(key, availabilityOnly = false) {
	if (!availabilityOnly) catalogRevisions.advance(key);
	metadataRevisions.advance(key);
}
function recordMetadataRevision(key, previous, next) {
	const change = classifyRuntimeAuthProfileSnapshotChange(previous, next);
	if (change !== "unchanged") advanceRuntimeAuthStoreMetadataRevision(key, change === "availability");
	return change;
}
function recordChangedSnapshotRevisions(next) {
	const keys = /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()]);
	const mutations = [];
	for (const key of keys) {
		const previous = runtimeAuthStoreSnapshots.get(key);
		const candidate = next.get(key);
		if (isDeepStrictEqual(previous, candidate)) continue;
		const change = recordMetadataRevision(key, previous, candidate);
		if (change !== "unchanged") {
			const shared = [previous, candidate].some((entry) => entry && ["state-db", "legacy-main"].some((location) => resolveRuntimeAuthSharedOwnerPath(entry.owner, location) === key));
			mutations.push({
				agentDir: shared ? void 0 : path.dirname(key),
				profileSetChanged: authProfileSetChanged(previous?.store, candidate?.store),
				availabilityOnly: change === "availability"
			});
		}
		runtimeAuthStoreSnapshotsRevision += 1;
		if (next.has(key)) {
			runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
			runtimeAuthStoreDeletedSnapshotRevisions.delete(key);
		} else {
			closeAuthProfileReadPool({
				kind: "database",
				databasePath: key
			});
			recordDeletedSnapshotRevision(key);
		}
	}
	return mutations;
}
function notifyRuntimeAuthStoreMutation(agentDir, profileSetChanged = false, availabilityOnly = false) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0,
		profileSetChanged,
		availabilityOnly
	};
	const notify = () => {
		for (const listener of runtimeAuthStoreMutationListeners) listener(event);
	};
	if (pendingSnapshotNotifications) pendingSnapshotNotifications.push(notify);
	else notify();
}
function authProfilesChanged(previous, next) {
	return !isDeepStrictEqual(previous?.profiles ?? {}, next?.profiles ?? {});
}
function authProfileSetChanged(previous, next) {
	return !isDeepStrictEqual(Object.keys(previous?.profiles ?? {}).toSorted(), Object.keys(next?.profiles ?? {}).toSorted());
}
/** Observes credential, ownership, and availability changes, excluding usage bookkeeping. */
function registerRuntimeAuthProfileStoreMutationListener(listener) {
	return registerListener(runtimeAuthStoreMutationListeners, listener);
}
/** @deprecated Use replaceRuntimeAuthProfileStoreSnapshotsAsync. Final compatibility day: 2026-12-31. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "replaceRuntimeAuthProfileStoreSnapshots",
		replacement: "replaceRuntimeAuthProfileStoreSnapshotsAsync"
	});
	if (entries.some((entry) => !entry.databasePath && !entry.agentDir)) prepareSharedAuthStoreOwnershipForNative();
	replaceRuntimeAuthProfileStoreSnapshotEntries(entries);
}
/** Resolve a default owner off-thread before publishing the supplied snapshot facts. */
async function replaceRuntimeAuthProfileStoreSnapshotsAsync(entries) {
	if (entries.some((entry) => !entry.databasePath && !entry.agentDir)) await prepareSharedAuthStoreOwnership();
	replaceRuntimeAuthProfileStoreSnapshotEntries(entries);
}
function replaceRuntimeAuthProfileStoreSnapshotEntries(entries) {
	replaceOwnedRuntimeAuthProfileStoreSnapshots(entries.map((entry) => {
		const databasePath = entry.databasePath ?? resolveRuntimeStoreKey(entry.agentDir);
		return {
			databasePath,
			agentDir: path.dirname(databasePath),
			store: cloneAuthProfileStore(entry.store),
			owner: cloneRuntimeAuthSharedOwner(runtimeAuthStoreSnapshots.get(databasePath)?.owner ?? {
				kind: "unresolved",
				scope: captureAuthProfileOwnerScope()
			}),
			legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(runtimeAuthStoreSnapshots.get(databasePath)?.legacyCandidates ?? captureRuntimeAuthProfileLegacyCandidates(entry.agentDir ?? (entry.databasePath ? path.dirname(databasePath) : void 0)))
		};
	}));
}
function replaceOwnedRuntimeAuthProfileStoreSnapshots(entries) {
	const sharedEntries = entries.map((entry) => ({
		...entry,
		store: removePersonalAuthProfileReferences(entry.store)
	}));
	for (const entry of sharedEntries) {
		readAuthProfileDatabaseIdentity(entry.databasePath);
		if (entry.owner.kind === "resolved") readAuthProfileDatabaseIdentity(entry.owner.sharedDatabasePath);
	}
	const next = new Map(sharedEntries.map(({ databasePath, store, owner, legacyCandidates }) => [databasePath, {
		store: cloneAuthProfileStore(store),
		owner: cloneRuntimeAuthSharedOwner(owner),
		legacyCandidates: cloneRuntimeAuthProfileLegacyCandidates(legacyCandidates)
	}]));
	const reboundKeys = new Set(sharedEntries.filter((entry) => {
		const previous = runtimeAuthStoreSnapshots.get(entry.databasePath);
		return previous && runtimeAuthSharedOwnerRebound(previous.owner, entry.owner);
	}).map((entry) => entry.databasePath));
	const keys = /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()]);
	if (reboundKeys.size > 0 || [...keys].some((key) => authProfilesChanged(runtimeAuthStoreSnapshots.get(key)?.store, next.get(key)?.store))) runtimeAuthStoreCredentialsRevision += 1;
	for (const key of keys) if (reboundKeys.has(key) || authProfilesChanged(runtimeAuthStoreSnapshots.get(key)?.store, next.get(key)?.store)) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	const mutations = recordChangedSnapshotRevisions(next);
	runtimeAuthStoreSnapshots.clear();
	for (const [key, entry] of next) runtimeAuthStoreSnapshots.set(key, entry);
	const sourcePaths = /* @__PURE__ */ new Set();
	for (const entry of sharedEntries) {
		sourcePaths.add(entry.databasePath);
		if (entry.owner.kind === "resolved") sourcePaths.add(entry.owner.sharedDatabasePath);
	}
	runtimeAuthProfileRowsCache.publishSnapshots(sourcePaths);
	if (mutations.some(({ agentDir }) => agentDir === void 0)) notifyRuntimeAuthStoreMutation(void 0, mutations.some(({ profileSetChanged }) => profileSetChanged), mutations.every(({ availabilityOnly }) => availabilityOnly));
	else for (const { agentDir, profileSetChanged, availabilityOnly } of mutations) notifyRuntimeAuthStoreMutation(agentDir, profileSetChanged, availabilityOnly);
}
/** Clears all runtime auth profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
	runtimeAuthFileObservation.reset();
	closeAuthProfileReadPool();
	const snapshotsChanged = runtimeAuthStoreSnapshots.size > 0;
	const credentialsChanged = [...runtimeAuthStoreSnapshots.values()].some(({ store }) => Object.keys(store.profiles).length > 0);
	if (credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	runtimeAuthStoreSnapshotsRevision += 1;
	runtimeAuthProfileRowsCache.clear();
	metadataRevisions.clear();
	catalogRevisions.clear();
	runtimeAuthStoreSnapshots.clear();
	clearAllRuntimeAuthMaterializations();
	runtimeAuthStoreSnapshotRevisions.clear();
	runtimeAuthStoreDeletedSnapshotRevisions.clear();
	if (snapshotsChanged) notifyRuntimeAuthStoreMutation(void 0, credentialsChanged);
}
/** Clears one runtime auth-profile snapshot without disturbing other active agents. */
function clearRuntimeAuthProfileStoreSnapshotCore(agentDir) {
	return clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(resolveRuntimeStoreKey(agentDir), agentDir);
}
function clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(key, agentDir) {
	closeAuthProfileReadPool({
		kind: "database",
		databasePath: key
	});
	runtimeAuthProfileRowsCache.invalidateRows(key);
	const store = runtimeAuthStoreSnapshots.get(key)?.store;
	if (!store) {
		advanceRuntimeAuthStoreMetadataRevision(key);
		runtimeAuthStoreSnapshotsRevision += 1;
		recordDeletedSnapshotRevision(key);
		return false;
	}
	if (Object.keys(store.profiles).length > 0) runtimeAuthStoreCredentialsRevision += 1;
	runtimeAuthStoreSnapshotsRevision += 1;
	recordMetadataRevision(key, runtimeAuthStoreSnapshots.get(key), void 0);
	runtimeAuthStoreSnapshots.delete(key);
	clearRuntimeAuthMaterializationsAtDatabasePath(key);
	recordDeletedSnapshotRevision(key);
	notifyRuntimeAuthStoreMutation(agentDir, Object.keys(store.profiles).length > 0);
	return true;
}
/** Inputs are detached at public boundaries; private publications retain owned immutable facts. */
function setRuntimeAuthProfileStoreSnapshotAtKey(store, key, agentDir, owner, legacyCandidates) {
	const previous = runtimeAuthStoreSnapshots.get(key);
	const credentialsChanged = authProfilesChanged(previous?.store, store);
	const sharedOwnerRebound = previous && runtimeAuthSharedOwnerRebound(previous.owner, owner);
	if (credentialsChanged || sharedOwnerRebound) runtimeAuthStoreCredentialsRevision += 1;
	const previousStore = previous?.store;
	const profileSetChanged = credentialsChanged && authProfileSetChanged(previousStore, store);
	if (sharedOwnerRebound || credentialsChanged) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	const changedMetadata = recordMetadataRevision(key, previous, {
		store,
		owner,
		legacyCandidates
	});
	if (changedMetadata !== "unchanged" || !isDeepStrictEqual(previousStore, store)) {
		runtimeAuthStoreSnapshotsRevision += 1;
		runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
		runtimeAuthStoreDeletedSnapshotRevisions.delete(key);
	}
	runtimeAuthStoreSnapshots.set(key, {
		store,
		owner,
		legacyCandidates
	});
	if (changedMetadata !== "unchanged") notifyRuntimeAuthStoreMutation(agentDir, profileSetChanged, changedMetadata === "availability");
}
/** Stores a cloned runtime auth profile snapshot for an agent dir. */
function setRuntimeAuthProfileStoreSnapshot(store, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(cloneAuthProfileStore(removePersonalAuthProfileReferences(store)), resolveRuntimeStoreKey(agentDir), agentDir, captureRuntimeAuthSharedOwner(), captureRuntimeAuthProfileLegacyCandidates(agentDir));
}
/** Restore the captured runtime owner independently of the persistence transaction. */
function restoreOwnedRuntimeAuthProfileStoreSnapshot(entry, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(cloneAuthProfileStore(removePersonalAuthProfileReferences(entry.store)), entry.databasePath, agentDir, cloneRuntimeAuthSharedOwner(entry.owner), cloneRuntimeAuthProfileLegacyCandidates(entry.legacyCandidates));
}
/** Materialization changes contents, not the existing producer's shared ownership. */
function updateRuntimeAuthProfileStoreSnapshot(store, agentDir) {
	const key = resolveRuntimeStoreKey(agentDir);
	const owner = runtimeAuthStoreSnapshots.get(key)?.owner ?? captureRuntimeAuthSharedOwner();
	setRuntimeAuthProfileStoreSnapshotAtKey(cloneAuthProfileStore(removePersonalAuthProfileReferences(store)), key, agentDir, owner, runtimeAuthStoreSnapshots.get(key)?.legacyCandidates ?? captureRuntimeAuthProfileLegacyCandidates(agentDir));
}
/** Stores a cloned snapshot under an already resolved canonical database owner. */
function setRuntimeAuthProfileStoreSnapshotAtDatabasePath(store, databasePath, agentDir, owner, legacyCandidates) {
	const existing = runtimeAuthStoreSnapshots.get(databasePath);
	const candidates = "env" in owner ? captureRuntimeAuthProfileLegacyCandidates(databasePath === owner.sharedDatabasePath ? void 0 : agentDir, owner.env) : legacyCandidates ?? (existing && runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner) ? existing.legacyCandidates : void 0);
	setRuntimeAuthProfileStoreSnapshotAtKey(cloneAuthProfileStore(removePersonalAuthProfileReferences(store)), databasePath, agentDir, {
		kind: "resolved",
		sharedDatabasePath: owner.sharedDatabasePath,
		location: owner.location
	}, cloneRuntimeAuthProfileLegacyCandidates(candidates));
}
/**
* Invalidates prepared credential ownership after a persisted owner-store write.
* Main-store credentials are inherited by custom-agent snapshots, so those
* derived snapshots must be dropped even when no exact main snapshot exists.
* State-only saves refresh them in the publisher without changing credential ownership.
*/
function noteRuntimeAuthProfileStorePersistedMutation(agentDir, mutation, owner, prepared, persisted) {
	const ownerKey = owner?.databasePath ?? resolveRuntimeStoreKey(agentDir);
	noteAuthProfileFileWrite(ownerKey);
	if (!mutation.credentialsChanged && !mutation.profileSetChanged && !mutation.stateChanged) return getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(ownerKey);
	const changedProfileIds = [...mutation.profileIds];
	if (mutation.credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	runtimeAuthProfileRowsCache.invalidateRows(ownerKey);
	if (mutation.selectionChanged) advanceRuntimeAuthStoreMetadataRevision(ownerKey, true);
	if (mutation.credentialsChanged || mutation.profileSetChanged) clearRuntimeAuthMaterializationsAtDatabasePath(ownerKey);
	recordRuntimeAuthProfileStorePersistedMutation(ownerKey, {
		...mutation,
		profileIds: changedProfileIds
	});
	if (persisted) recordRuntimeAuthProfilePersistedStore(ownerKey, persisted.store);
	else runtimeAuthProfileRowsCache.rebase(ownerKey);
	const revision = getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(ownerKey);
	const mainKey = owner?.sharedDatabasePath ?? resolveRuntimeStoreKey(void 0);
	if (ownerKey === mainKey && (mutation.credentialsChanged || mutation.profileSetChanged)) {
		const sharedOwner = owner ?? captureRuntimeAuthSharedOwner();
		const affected = sharedMutationAffectsSnapshot({
			...mutation,
			profileIds: changedProfileIds
		});
		for (const [key, entry] of runtimeAuthStoreSnapshots) if (key !== mainKey && !prepared?.has(key) && runtimeAuthProfileSnapshotSharesOwner(entry.owner, sharedOwner) && affected(entry.store)) {
			runtimeAuthStoreSnapshotsRevision += 1;
			recordMetadataRevision(key, entry, void 0);
			runtimeAuthStoreSnapshots.delete(key);
			recordDeletedSnapshotRevision(key);
		}
	}
	if (mutation.credentialsChanged || mutation.profileSetChanged) notifyRuntimeAuthStoreMutation(agentDir, mutation.profileSetChanged === true);
	return revision;
}
/** Install one committed shared generation before listeners can observe any affected owner. */
function publishRuntimeAuthProfileSharedCredentialMutation(owner, committedStore, mutation) {
	if (owner.databasePath !== owner.sharedDatabasePath || mutation.stateChanged || mutation.profileSetChanged) return;
	const committed = cloneAuthProfileStore(committedStore);
	observeCanonicalAuthProfileCredentials(owner.databasePath, committed.profiles);
	const profileIds = [...mutation.profileIds];
	const { prepared, deferred } = prepareRuntimeAuthProfileSharedCredentialSnapshots(runtimeAuthStoreSnapshots, owner, committed, {
		...mutation,
		profileIds
	});
	const previousNotifications = pendingSnapshotNotifications;
	const notifications = [];
	pendingSnapshotNotifications = notifications;
	let publication;
	try {
		const revision = noteRuntimeAuthProfileStorePersistedMutation(void 0, {
			...mutation,
			profileIds
		}, owner, prepared, {
			store: committedStore,
			env: owner.env
		});
		for (const [key, entry] of prepared) setRuntimeAuthProfileStoreSnapshotAtKey(entry.store, key, key === owner.databasePath ? void 0 : path.dirname(key), entry.owner, entry.legacyCandidates);
		if (deferred.some((entry) => entry.databasePath === owner.databasePath)) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath);
		publication = {
			entries: deferred,
			revision,
			snapshots: new Map(deferred.map((entry) => [entry.databasePath, getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath)])),
			mutations: new Map(deferred.map((entry) => [entry.databasePath, getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(entry.databasePath)]))
		};
	} finally {
		pendingSnapshotNotifications = previousNotifications;
		if (previousNotifications) previousNotifications.push(...notifications);
		else for (const notify of notifications) notify();
	}
	return publication;
}
/** Stable token for credential ownership without coupling to usage bookkeeping. */
const getRuntimeAuthProfileStoreCredentialsRevision = () => runtimeAuthStoreCredentialsRevision;
/** Metadata generation; full snapshot revisions separately fence bookkeeping and rollback. */
function getRuntimeAuthProfileStoreMetadataRevision(agentDir) {
	return metadataRevisions.get(resolveRuntimeStoreKey(agentDir));
}
/** Catalog identity excludes live cooldowns but includes credentials, order, and ownership. */
function getRuntimeAuthProfileStoreCatalogRevision(agentDir) {
	return catalogRevisions.get(resolveRuntimeStoreKey(agentDir));
}
function getRuntimeAuthProfileStoreSnapshotsRevision() {
	return runtimeAuthStoreSnapshotsRevision;
}
/** Process-local generation for one exact runtime snapshot rollback owner. */
function getRuntimeAuthProfileStoreSnapshotRevision(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(resolveRuntimeStoreKey(agentDir));
}
/** Process-local generation for an already resolved canonical snapshot owner. */
function getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath) {
	return runtimeAuthStoreSnapshotRevisions.get(databasePath) ?? runtimeAuthStoreDeletedSnapshotRevisions.get(databasePath) ?? runtimeAuthStoreSnapshotsRevision;
}
//#endregion
export { shouldUseMainOwnerForLocalOAuthCredential as $, setRuntimeAuthProfileStoreSnapshot as A, loadRuntimeAuthProfileOwnerSnapshot as B, refreshRuntimeAuthProfileStoreSources as C, replaceRuntimeAuthProfileStoreSnapshots as D, replaceOwnedRuntimeAuthProfileStoreSnapshots as E, registerRuntimeAuthMaterializationMutationListener as F, pruneAuthProfileStoreReferences as G, mergeLocalAuthProfileStoreWithInheritedStore as H, revokeRuntimeAuthMaterializations as I, runtimeStoreInheritsMainState as J, runtimeAuthMetadataState as K, captureRuntimeAuthProfileLegacyCandidates as L, updateRuntimeAuthProfileStoreSnapshot as M, getPreparedRuntimeAuthMaterializations as N, replaceRuntimeAuthProfileStoreSnapshotsAsync as O, recordRuntimeAuthMaterialization as P, isInheritedMainOAuthCredentialFromStores as Q, createEmptyAuthProfileStore as R, recordRuntimeAuthProfilePersistedStore as S, registerRuntimeAuthProfileStoreMutationListener as T, prepareRuntimeAuthProfileStoreSnapshots as U, markRuntimePersistedProfiles as V, preserveResolvedSecretBackedCredentials as W, stripRuntimeExternalProfileMetadata as X, setRuntimeLocalProfileMetadata as Y, updateRuntimeAuthProfileStoreInheritedCredentials as Z, invalidateRuntimeAuthProfileStoreSnapshotsForOwner as _, getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath as a, noteRuntimeAuthProfileStorePersistedMutation as b, getRuntimeAuthProfileStoreCredentialsRevision as c, getRuntimeAuthProfileStoreSnapshotCore as d, getRuntimeAuthProfileStoreSnapshotRevision as f, hasRuntimeAuthProfileStoreSource as g, hasAnyRuntimeAuthProfileStoreSource as h, createPreparedRuntimeAuthProfileUsageReader as i, setRuntimeAuthProfileStoreSnapshotAtDatabasePath as j, restoreOwnedRuntimeAuthProfileStoreSnapshot as k, getRuntimeAuthProfileStoreMetadataRevision as l, getRuntimeAuthProfileStoreSnapshotsRevision as m, clearRuntimeAuthProfileStoreSnapshotCore as n, getPreparedRuntimeAuthProfileStoreSnapshotCore as o, getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath as p, runtimeAuthProfileSnapshotSharesOwner as q, clearRuntimeAuthProfileStoreSnapshots as r, getRuntimeAuthProfileStoreCatalogRevision as s, clearRuntimeAuthProfileStoreSnapshotAtDatabasePath as t, getRuntimeAuthProfileStoreSnapshotAtDatabasePath as u, listOwnedRuntimeAuthProfileStoreSnapshots as v, registerRuntimeAuthProfileExternalRefresh as w, publishRuntimeAuthProfileSharedCredentialMutation as x, listRuntimeAuthProfileStoreSnapshotsForSharedOwner as y, listRuntimeLocalProfileIds as z };
