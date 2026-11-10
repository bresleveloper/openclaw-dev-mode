import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { d as hasOidcRegistration, f as isSafeToCopyOAuthIdentity, l as cloneAuthProfileStore, o as isSafeToAdoptMainStoreOAuthIdentity, u as hasOAuthIdentity } from "./oauth-shared-CiaJlx_D.mjs";
import { F as serializeAuthProfileCredential, W as isUserModelAuthProfileId, g as coercePersistedAuthProfileStore, v as coerceAuthProfileState } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as copyAuthProfileAuthorizationInheritance } from "./authorization-lifetime-CLdd1God.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { f as readPersistedAuthProfileStateRaw, h as readPersistedSharedAuthProfileStoreRaw, m as readPersistedSharedAuthProfileStateRaw, p as readPersistedAuthProfileStoreRaw, r as inspectAuthProfileJsonCellReadOnly } from "./sqlite-BlFpr2YD.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/runtime-external-profile-references.ts
function removeRuntimeExternalProfileReferences(params) {
	if (params.profileIds.size === 0) return params.store;
	const next = cloneAuthProfileStore(params.store);
	const runtimeNext = next;
	for (const profileId of params.profileIds) {
		delete next.profiles[profileId];
		delete runtimeNext.runtimeCredentialSources?.[profileId];
		delete next.usageStats?.[profileId];
	}
	if (next.order) {
		const order = Object.fromEntries(Object.entries(next.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => !params.profileIds.has(profileId))]).filter(([, profileIds]) => profileIds.length > 0));
		next.order = Object.keys(order).length > 0 ? order : void 0;
	}
	if (next.lastGood) {
		const lastGood = Object.fromEntries(Object.entries(next.lastGood).filter(([, profileId]) => !params.profileIds.has(profileId)));
		next.lastGood = Object.keys(lastGood).length > 0 ? lastGood : void 0;
	}
	if (next.usageStats && Object.keys(next.usageStats).length === 0) next.usageStats = void 0;
	next.runtimePersistedProfileIds = next.runtimePersistedProfileIds?.filter((profileId) => !params.profileIds.has(profileId));
	if (next.runtimePersistedProfileIds?.length === 0) next.runtimePersistedProfileIds = void 0;
	const localIds = [...new Set(runtimeNext.runtimeLocalProfileIds ?? [])].filter((profileId) => !params.profileIds.has(profileId) && next.profiles[profileId]).toSorted();
	runtimeNext.runtimeLocalProfileIds = localIds.length > 0 ? localIds : void 0;
	next.runtimeExternalProfileIds = next.runtimeExternalProfileIds?.filter((profileId) => !params.profileIds.has(profileId));
	if (next.runtimeExternalProfileIds?.length === 0 && next.runtimeExternalProfileIdsAuthoritative !== true) next.runtimeExternalProfileIds = void 0;
	return next;
}
/** Shared persistence and snapshots never retain a turn's selected personal account. */
function removePersonalAuthProfileReferences(store) {
	const runtimeStore = store;
	return removeRuntimeExternalProfileReferences({
		store,
		profileIds: new Set([
			...Object.keys(store.profiles),
			...Object.keys(store.usageStats ?? {}),
			...Object.values(store.order ?? {}).flat(),
			...Object.values(store.lastGood ?? {}),
			...store.runtimePersistedProfileIds ?? [],
			...store.runtimeExternalProfileIds ?? [],
			...runtimeStore.runtimeLocalProfileIds ?? []
		].filter(isUserModelAuthProfileId))
	});
}
/** Carries lifecycle-owned external profiles across a durable-store refresh. */
function mergeRuntimeExternalProfileReferences(params) {
	const runtimeExternalProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	const externalRefresh = params.externalRefresh === true && runtimeExternalProfileIds.size > 0;
	if (!externalRefresh && params.next.runtimeExternalProfileIdsAuthoritative === true) return params.next;
	if (runtimeExternalProfileIds.size === 0 && params.existing.runtimeExternalProfileIdsAuthoritative !== true) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeExternalProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const retainedStateProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of runtimeExternalProfileIds) {
		const existingCredential = params.existing.profiles[profileId];
		const nextCredential = merged.profiles[profileId];
		if (externalRefresh && (!existingCredential || params.next.runtimeExternalProfileIdsAuthoritative === true && !mergedRuntimeExternalProfileIds.has(profileId))) continue;
		if (nextCredential) {
			if (!mergedRuntimeExternalProfileIds.has(profileId) && (!existingCredential || !isDeepStrictEqual(nextCredential, existingCredential))) continue;
		} else if (existingCredential) merged.profiles[profileId] = existingCredential;
		else continue;
		mergedRuntimeExternalProfileIds.add(profileId);
		if (externalRefresh || !nextCredential) retainedStateProfileIds.add(profileId);
	}
	if (externalRefresh && retainedStateProfileIds.size === 0) return params.next;
	for (const profileId of retainedStateProfileIds) if (params.existing.usageStats?.[profileId]) merged.usageStats = {
		...merged.usageStats,
		[profileId]: params.existing.usageStats[profileId]
	};
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => retainedStateProfileIds.has(profileId));
		if (externalProfileIds.length === 0 || merged.order?.[provider]) continue;
		merged.order = {
			...merged.order,
			[provider]: externalProfileIds
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!retainedStateProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	const profileIds = [...mergedRuntimeExternalProfileIds].toSorted();
	merged.runtimeExternalProfileIds = profileIds.length > 0 || params.existing.runtimeExternalProfileIdsAuthoritative === true ? profileIds : void 0;
	merged.runtimeExternalProfileIdsAuthoritative = params.existing.runtimeExternalProfileIdsAuthoritative === true ? true : void 0;
	return merged;
}
//#endregion
//#region src/agents/auth-profiles/state.ts
/**
* Runtime-state normalization and persistence for auth profile selection.
* This state tracks order, last-good profile, and cooldown/failure metadata
* separately from secret-bearing credentials.
*/
/** Merges auth profile runtime state, with override records winning per key. */
function mergeAuthProfileState(base, override) {
	const mergeRecord = (left, right) => {
		if (!left && !right) return;
		return {
			...left,
			...right
		};
	};
	return {
		order: mergeRecord(base.order, override.order),
		lastGood: mergeRecord(base.lastGood, override.lastGood),
		usageStats: mergeRecord(base.usageStats, override.usageStats)
	};
}
/** Loads persisted auth profile runtime state from SQLite. */
function loadPersistedAuthProfileState(agentDir, database) {
	return coerceAuthProfileState(readPersistedAuthProfileStateRaw(agentDir, database));
}
/** Builds the persisted auth profile runtime state payload. */
function buildPersistedAuthProfileState(store) {
	const state = coerceAuthProfileState(store);
	if (!state.order && !state.lastGood && !state.usageStats) return null;
	return {
		version: 1,
		...state.order ? { order: state.order } : {},
		...state.lastGood ? { lastGood: state.lastGood } : {},
		...state.usageStats ? { usageStats: state.usageStats } : {}
	};
}
//#endregion
//#region src/agents/auth-profiles/persisted.ts
/**
* Canonical persisted auth profile loading, runtime metadata, and store merging.
*/
function groupProfileIdsByProvider(profiles) {
	const grouped = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(profiles)) {
		const providerKey = normalizeProviderId(credential.provider);
		const profileIds = grouped.get(providerKey) ?? [];
		profileIds.push(profileId);
		grouped.set(providerKey, profileIds);
	}
	return grouped;
}
function findOrderEntryKey(order, providerKey) {
	return Object.keys(order ?? {}).find((key) => normalizeProviderId(key) === providerKey);
}
function mergeProfileOrderWithOverridePrecedence(params) {
	const { mergedOrder } = params;
	if (!mergedOrder) return;
	for (const [providerKey, overrideProfileIds] of groupProfileIdsByProvider(params.overrideProfiles)) {
		const baseOrderKey = findOrderEntryKey(params.baseOrder, providerKey);
		const overrideOrderKey = findOrderEntryKey(params.overrideOrder, providerKey);
		const mergedOrderKey = overrideOrderKey ?? baseOrderKey;
		if (!mergedOrderKey) continue;
		for (const provider of Object.keys(mergedOrder)) if (provider !== mergedOrderKey && normalizeProviderId(provider) === providerKey) delete mergedOrder[provider];
		if (overrideOrderKey) {
			mergedOrder[mergedOrderKey] = uniqueStrings(params.overrideOrder?.[overrideOrderKey] ?? []);
			continue;
		}
		const baseOrderIds = baseOrderKey ? params.baseOrder?.[baseOrderKey] ?? [] : [];
		mergedOrder[mergedOrderKey] = uniqueStrings([
			...overrideProfileIds,
			...baseOrderIds,
			...mergedOrder[mergedOrderKey] ?? []
		]);
	}
	return mergedOrder;
}
function hasComparableOAuthIdentityConflict(existing, candidate) {
	if (hasOidcRegistration(existing) || hasOidcRegistration(candidate)) return !isSafeToCopyOAuthIdentity(existing, candidate);
	const existingAccountId = normalizeOptionalString(existing.accountId);
	const candidateAccountId = normalizeOptionalString(candidate.accountId);
	if (existingAccountId !== void 0 && candidateAccountId !== void 0 && existingAccountId !== candidateAccountId) return true;
	const existingEmail = normalizeOptionalLowercaseString(existing.email);
	const candidateEmail = normalizeOptionalLowercaseString(candidate.email);
	return existingEmail !== void 0 && candidateEmail !== void 0 && existingEmail !== candidateEmail;
}
function isLegacyDefaultOAuthProfile(profileId, credential) {
	return profileId === `${normalizeProviderId(credential.provider)}:default`;
}
function isNewerUsableOAuthCredential(existing, candidate) {
	if (!hasUsableOAuthCredential(candidate)) return false;
	if (!hasUsableOAuthCredential(existing)) return true;
	return candidate.expires > existing.expires;
}
function findMainStoreOAuthReplacement(params) {
	const providerKey = normalizeProviderId(params.legacyCredential.provider);
	const candidates = Object.entries(params.base.profiles).flatMap(([profileId, credential]) => {
		if (profileId === params.legacyProfileId || credential.type !== "oauth" || credential.setup?.replacement || normalizeProviderId(credential.provider) !== providerKey) return [];
		return [[profileId, credential]];
	}).filter(([, credential]) => isNewerUsableOAuthCredential(params.legacyCredential, credential)).toSorted(([leftId, leftCredential], [rightId, rightCredential]) => {
		const leftExpires = Number.isFinite(leftCredential.expires) ? leftCredential.expires : 0;
		const rightExpires = Number.isFinite(rightCredential.expires) ? rightCredential.expires : 0;
		if (rightExpires !== leftExpires) return rightExpires - leftExpires;
		return leftId.localeCompare(rightId);
	});
	const exactIdentityCandidates = candidates.filter(([, credential]) => isSafeToAdoptMainStoreOAuthIdentity(params.legacyCredential, credential));
	if (exactIdentityCandidates.length > 0) {
		if (!hasOAuthIdentity(params.legacyCredential) && exactIdentityCandidates.length > 1) return;
		return exactIdentityCandidates[0]?.[0];
	}
	if (hasUsableOAuthCredential(params.legacyCredential)) return;
	const fallbackCandidates = candidates.filter(([, credential]) => !hasComparableOAuthIdentityConflict(params.legacyCredential, credential));
	if (fallbackCandidates.length !== 1) return;
	return fallbackCandidates[0]?.[0];
}
function replaceMergedProfileReferences(params) {
	const { store, base, replacements } = params;
	if (replacements.size === 0) return store;
	const profiles = { ...store.profiles };
	for (const [legacyProfileId, replacementProfileId] of replacements) {
		const baseCredential = base.profiles[legacyProfileId];
		if (baseCredential) profiles[legacyProfileId] = baseCredential;
		else delete profiles[legacyProfileId];
		const replacementBaseCredential = base.profiles[replacementProfileId];
		const replacementCredential = profiles[replacementProfileId];
		if (replacementBaseCredential && (!replacementCredential || replacementCredential.type === "oauth" && replacementBaseCredential.type === "oauth" && isNewerUsableOAuthCredential(replacementCredential, replacementBaseCredential))) profiles[replacementProfileId] = replacementBaseCredential;
	}
	const order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, uniqueStrings(profileIds.map((profileId) => replacements.get(profileId) ?? profileId))])) : void 0;
	const lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).map(([provider, profileId]) => [provider, replacements.get(profileId) ?? profileId])) : void 0;
	const usageStats = store.usageStats ? { ...store.usageStats } : void 0;
	if (usageStats) for (const legacyProfileId of replacements.keys()) {
		const baseStats = base.usageStats?.[legacyProfileId];
		if (baseStats) usageStats[legacyProfileId] = baseStats;
		else delete usageStats[legacyProfileId];
	}
	return {
		...store,
		profiles,
		order: order && Object.keys(order).length > 0 ? order : void 0,
		lastGood: lastGood && Object.keys(lastGood).length > 0 ? lastGood : void 0,
		usageStats: usageStats && Object.keys(usageStats).length > 0 ? usageStats : void 0
	};
}
function reconcileMainStoreOAuthProfileDrift(params) {
	const replacements = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(params.override.profiles)) {
		if (credential.type !== "oauth") continue;
		const replacementProfileId = isLegacyDefaultOAuthProfile(profileId, credential) ? findMainStoreOAuthReplacement({
			base: params.base,
			legacyProfileId: profileId,
			legacyCredential: credential
		}) : void 0;
		if (replacementProfileId) replacements.set(profileId, replacementProfileId);
	}
	return replaceMergedProfileReferences({
		store: params.merged,
		base: params.base,
		replacements
	});
}
/** Merges two auth profile stores, preserving valid runtime external profile metadata. */
function mergeAuthProfileStores(base, override, options) {
	if (Object.keys(override.profiles).length === 0 && !override.order && !override.lastGood && !override.usageStats && override.runtimePersistedProfileIds === void 0 && override.runtimeLocalProfileIds === void 0 && override.runtimeHasLocalOAuthProfiles === void 0 && override.runtimeLocalOrderProviderIds === void 0 && override.runtimeInheritsMainState === void 0 && override.runtimeExternalProfileIds === void 0 && override.runtimeExternalProfileIdsAuthoritative !== true) return base;
	const overrideProfileIds = new Set(Object.keys(override.profiles));
	const overrideRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIds ?? []);
	const removedRuntimeExternalProfileIds = new Set(override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? (base.runtimeExternalProfileIds ?? []).filter((profileId) => !overrideRuntimeExternalProfileIds.has(profileId) && !overrideProfileIds.has(profileId)) : []);
	const profiles = Object.fromEntries([...Object.entries(override.profiles), ...Object.entries(base.profiles).filter(([profileId]) => !overrideProfileIds.has(profileId))]);
	for (const profileId of removedRuntimeExternalProfileIds) delete profiles[profileId];
	const mergedState = mergeAuthProfileState(base, override);
	const mergedOrder = mergeProfileOrderWithOverridePrecedence({
		baseOrder: base.order,
		overrideOrder: override.order,
		overrideProfiles: override.profiles,
		mergedOrder: mergedState.order
	});
	const order = mergedOrder ? Object.fromEntries(Object.entries(mergedOrder).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => profiles[profileId] || !removedRuntimeExternalProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	const lastGood = mergedState.lastGood ? Object.fromEntries(Object.entries(mergedState.lastGood).filter(([, profileId]) => profiles[profileId])) : void 0;
	const usageStats = mergedState.usageStats ? Object.fromEntries(Object.entries(mergedState.usageStats).filter(([profileId]) => profiles[profileId] || profileId.startsWith("inline-api-key:"))) : void 0;
	const merged = {
		version: Math.max(base.version, override.version ?? base.version),
		profiles,
		order,
		lastGood,
		usageStats
	};
	const mergeRuntimeProfileIds = (baseIds = [], overrideIds = []) => [...baseIds.filter((profileId) => !overrideProfileIds.has(profileId)), ...overrideIds].filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimePersistedProfileIds = mergeRuntimeProfileIds(base.runtimePersistedProfileIds, override.runtimePersistedProfileIds);
	const runtimeLocalProfileIds = override.runtimeLocalProfileIds?.filter((profileId) => merged.profiles[profileId]).toSorted();
	const runtimeExternalProfileIds = mergeRuntimeProfileIds(override.runtimeExternalProfileIdsAuthoritative === true && options?.preserveBaseRuntimeExternalProfiles !== true ? [] : base.runtimeExternalProfileIds, override.runtimeExternalProfileIds);
	const runtimeExternalProfileIdsAuthoritative = base.runtimeExternalProfileIdsAuthoritative === true || override.runtimeExternalProfileIdsAuthoritative === true;
	const runtimeExternalProfileMetadata = runtimeExternalProfileIds.length > 0 || runtimeExternalProfileIdsAuthoritative ? {
		runtimeExternalProfileIds: [...new Set(runtimeExternalProfileIds)],
		...runtimeExternalProfileIdsAuthoritative ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : {};
	const result = reconcileMainStoreOAuthProfileDrift({
		base,
		override,
		merged: {
			...merged,
			...runtimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: [...new Set(runtimePersistedProfileIds)] } : {},
			...runtimeLocalProfileIds ? { runtimeLocalProfileIds } : {},
			...override.runtimeHasLocalOAuthProfiles !== void 0 ? { runtimeHasLocalOAuthProfiles: override.runtimeHasLocalOAuthProfiles } : {},
			...override.runtimeLocalOrderProviderIds !== void 0 ? { runtimeLocalOrderProviderIds: [...override.runtimeLocalOrderProviderIds] } : {},
			...override.runtimeInheritsMainState !== void 0 ? { runtimeInheritsMainState: override.runtimeInheritsMainState } : {},
			...runtimeExternalProfileMetadata
		}
	});
	if (base.runtimeCredentialSources || override.runtimeCredentialSources) result.runtimeCredentialSources = Object.fromEntries(Object.entries(result.profiles).flatMap(([profileId, credential]) => {
		const source = credential === override.profiles[profileId] ? override.runtimeCredentialSources?.[profileId] : credential === base.profiles[profileId] ? base.runtimeCredentialSources?.[profileId] : void 0;
		return source ? [[profileId, source]] : [];
	}));
	return result;
}
/** Builds the persisted secrets store, stripping resolved literals when refs exist. */
function buildPersistedAuthProfileSecretsStore(store, shouldPersistProfile) {
	const profiles = { ...store.profiles };
	for (const [profileId, credential] of Object.entries(profiles)) if (isUserModelAuthProfileId(profileId) || shouldPersistProfile && !shouldPersistProfile({
		profileId,
		credential
	})) delete profiles[profileId];
	else profiles[profileId] = serializeAuthProfileCredential(credential);
	copyAuthProfileAuthorizationInheritance(store.profiles, profiles);
	return {
		version: 1,
		profiles
	};
}
function mergePersistedAuthProfileState(raw, readState) {
	const store = coercePersistedAuthProfileStore(raw);
	if (!store) return null;
	return removePersonalAuthProfileReferences({
		...store,
		...mergeAuthProfileState(store, coerceAuthProfileState(readState()))
	});
}
/** Loads the persisted auth profile store and merges runtime state. */
function loadPersistedAuthProfileStore(agentDir, options) {
	return mergePersistedAuthProfileState(readPersistedAuthProfileStoreRaw(agentDir, options?.database), () => readPersistedAuthProfileStateRaw(agentDir, options?.database));
}
/** Read an already selected owner without rediscovering an environment or opening a writer. */
function loadPersistedAuthProfileStoreAtDatabasePath(databasePath, kind) {
	const target = {
		path: databasePath,
		kind
	};
	const credentials = inspectAuthProfileJsonCellReadOnly(target, "store");
	if (credentials.status === "missing") return null;
	if (credentials.status === "unreadable") throw new AuthProfileStoreUnreadableError(databasePath);
	const state = inspectAuthProfileJsonCellReadOnly(target, "state");
	const store = mergePersistedAuthProfileState(credentials.raw, () => state.status === "readable" ? state.raw : null);
	if (!store) throw new AuthProfileStoreUnreadableError(databasePath);
	return store;
}
/** Load the shared auth store from an explicit state root. */
function loadPersistedSharedAuthProfileStore(env) {
	return mergePersistedAuthProfileState(readPersistedSharedAuthProfileStoreRaw(env), () => readPersistedSharedAuthProfileStateRaw(env));
}
//#endregion
export { mergeAuthProfileStores as a, loadPersistedAuthProfileState as c, removePersonalAuthProfileReferences as d, removeRuntimeExternalProfileReferences as f, loadPersistedSharedAuthProfileStore as i, mergeAuthProfileState as l, loadPersistedAuthProfileStore as n, mergePersistedAuthProfileState as o, loadPersistedAuthProfileStoreAtDatabasePath as r, buildPersistedAuthProfileState as s, buildPersistedAuthProfileSecretsStore as t, mergeRuntimeExternalProfileReferences as u };
