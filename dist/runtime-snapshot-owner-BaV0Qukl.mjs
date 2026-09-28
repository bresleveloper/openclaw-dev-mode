import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { h as resolveAuthProfileDatabasePath, k as resolveLegacyAuthProfileSourceCandidates } from "./sqlite-BIg_k8qE.mjs";
import { _ as getRuntimeExternalCliProfileIds, c as mergeAuthProfileStores, o as loadPersistedAuthProfileStoreAtDatabasePath, x as setRuntimeExternalCliProfileIds } from "./persisted-B486xwB_.mjs";
import { d as isSameOAuthRefreshGeneration } from "./credential-state-CWZ_V0ds.mjs";
import { d as cloneAuthProfileStore, s as isSafeToAdoptMainStoreOAuthIdentity } from "./oauth-shared-CVbJLd-k.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/agents/auth-profiles/ownership.ts
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (isSameOAuthRefreshGeneration({
		profileId: params.profileId,
		left: params.local,
		right: params.main
	})) return true;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	if (isDeepStrictEqual(params.local, params.main)) return true;
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
	setRuntimeExternalCliProfileIds(stripped, []);
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
function setRuntimeLocalProfileMetadata(store, localProfileIds, runtimeInheritsMainState = false) {
	return {
		...store,
		runtimeLocalProfileIds: [...new Set(localProfileIds)].toSorted(),
		...runtimeInheritsMainState ? { runtimeInheritsMainState: true } : {}
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
	return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(merged), listRuntimeLocalProfileIds(localStore, inheritedStore), runtimeStoreInheritsMainState(merged, localStore));
}
/** Compose the selected durable owner without publishing or discovering an ambient environment. */
function loadRuntimeAuthProfileOwnerSnapshot(owner, options = {}) {
	assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath);
	assertAuthProfileMigrationStateAtDatabasePath(owner.sharedDatabasePath);
	const isShared = owner.databasePath === owner.sharedDatabasePath;
	const sharedKind = owner.location === "state-db" ? "shared-state" : "agent";
	const sharedStore = isShared ? void 0 : options.inheritedStore ?? markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, sharedKind) ?? createEmptyAuthProfileStore());
	if (options.candidates && sharedStore) assertAuthProfileMigrationCandidates({
		databasePath: owner.sharedDatabasePath,
		candidates: options.candidates.shared,
		hasCredentials: () => Object.keys(sharedStore.profiles).length > 0
	});
	const localStore = markRuntimePersistedProfiles(loadPersistedAuthProfileStoreAtDatabasePath(owner.databasePath, isShared ? sharedKind : "agent") ?? createEmptyAuthProfileStore());
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
function runtimeAuthCredentialState(entries) {
	return Array.from(entries).filter(([, store]) => Object.keys(store.profiles).length > 0).map(([key, store]) => [key, store.profiles]).toSorted(([left], [right]) => left.localeCompare(right));
}
/** Model metadata follows credentials and availability, never rotation bookkeeping. */
function runtimeAuthMetadataState(store) {
	return {
		order: store.order,
		profiles: store.profiles,
		runtimePersistedProfileIds: store.runtimePersistedProfileIds,
		runtimeExternalProfileIds: store.runtimeExternalProfileIds,
		runtimeExternalProfileIdsAuthoritative: store.runtimeExternalProfileIdsAuthoritative,
		runtimeExternalCliProfileIds: store.runtimeExternalCliProfileIds,
		runtimeLocalProfileIds: store.runtimeLocalProfileIds,
		runtimeLocalOrderProviderIds: store.runtimeLocalOrderProviderIds,
		availability: Object.fromEntries(Object.entries(store.usageStats ?? {}).flatMap(([profileId, stats]) => {
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
		}))
	};
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	if (store.runtimeCredentialSources) store.runtimeCredentialSources = Object.fromEntries(Object.entries(store.runtimeCredentialSources).filter(([profileId]) => keptProfileIds.has(profileId)));
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId) || profileId.startsWith("inline-api-key:"))) : void 0;
	store.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	store.runtimeLocalProfileIds = store.runtimeLocalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	store.runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	setRuntimeExternalCliProfileIds(store, getRuntimeExternalCliProfileIds(store).filter((profileId) => keptProfileIds.has(profileId)));
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function preserveResolvedSecretBackedCredentials(params) {
	const next = cloneAuthProfileStore(params.next);
	for (const [profileId, credential] of Object.entries(next.profiles)) {
		const existing = params.existing.profiles[profileId];
		if (credential.type === "api_key" && existing?.type === "api_key" && credential.key === void 0 && existing.key !== void 0 && isSecretRef(credential.keyRef) && isDeepStrictEqual(credential.keyRef, existing.keyRef)) next.profiles[profileId] = {
			...credential,
			key: existing.key
		};
		else if (credential.type === "token" && existing?.type === "token" && credential.token === void 0 && existing.token !== void 0 && isSecretRef(credential.tokenRef) && isDeepStrictEqual(credential.tokenRef, existing.tokenRef)) next.profiles[profileId] = {
			...credential,
			token: existing.token
		};
	}
	return next;
}
//#endregion
export { shouldUseMainOwnerForLocalOAuthCredential as S, runtimeAuthSharedOwnerRebound as _, createEmptyAuthProfileStore as a, stripRuntimeExternalProfileMetadata as b, markRuntimePersistedProfiles as c, preserveResolvedSecretBackedCredentials as d, pruneAuthProfileStoreReferences as f, runtimeAuthProfileSnapshotSharesOwner as g, runtimeAuthMetadataState as h, cloneRuntimeAuthSharedOwner as i, mergeLocalAuthProfileStoreWithInheritedStore as l, runtimeAuthCredentialState as m, captureRuntimeAuthSharedOwner as n, listRuntimeLocalProfileIds as o, resolveRuntimeAuthSharedOwnerPath as p, cloneRuntimeAuthProfileLegacyCandidates as r, loadRuntimeAuthProfileOwnerSnapshot as s, captureRuntimeAuthProfileLegacyCandidates as t, prepareRuntimeAuthProfileStoreSnapshots as u, runtimeStoreInheritsMainState as v, isInheritedMainOAuthCredentialFromStores as x, setRuntimeLocalProfileMetadata as y };
