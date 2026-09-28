import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-CWZ_V0ds.mjs";
//#region src/agents/auth-profiles/oauth-identity.ts
/**
* OAuth identity comparison and mirroring decisions.
* Guards cross-agent credential copy/adoption so refreshed credentials cannot
* overwrite a different account's local auth state.
*/
/** Normalize account-id style identity tokens for exact comparison. */
function normalizeAuthIdentityToken(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
/** Normalize email identity tokens for case-insensitive comparison. */
function normalizeAuthEmailToken(value) {
	return normalizeAuthIdentityToken(value)?.toLowerCase();
}
/**
* One-sided copy gate for both directions:
* - mirror: sub-agent refresh -> main-agent store
* - adopt: main-agent store -> sub-agent store
*/
function isSafeToCopyOAuthIdentity(existing, incoming) {
	const aAcct = normalizeAuthIdentityToken(existing.accountId);
	const bAcct = normalizeAuthIdentityToken(incoming.accountId);
	const aEmail = normalizeAuthEmailToken(existing.email);
	const bEmail = normalizeAuthEmailToken(incoming.email);
	if (aAcct !== void 0 && bAcct !== void 0) return aAcct === bAcct;
	if (aEmail !== void 0 && bEmail !== void 0) return aEmail === bEmail;
	if (aAcct !== void 0 || aEmail !== void 0) return false;
	return true;
}
/** Decide whether a refreshed OAuth credential should mirror into another store. */
function shouldMirrorRefreshedOAuthCredential(params) {
	const { existing, refreshed } = params;
	if (!existing) return {
		shouldMirror: true,
		reason: "no-existing-credential"
	};
	if (existing.type !== "oauth") return {
		shouldMirror: false,
		reason: "non-oauth-existing-credential"
	};
	if (existing.provider !== refreshed.provider) return {
		shouldMirror: false,
		reason: "provider-mismatch"
	};
	if (!isSafeToCopyOAuthIdentity(existing, refreshed)) return {
		shouldMirror: false,
		reason: "identity-mismatch-or-regression"
	};
	const refreshedExpires = asDateTimestampMs(refreshed.expires);
	if (refreshedExpires === void 0) return {
		shouldMirror: false,
		reason: "incoming-not-fresher"
	};
	const existingExpires = asDateTimestampMs(existing.expires);
	if (existingExpires !== void 0 && existingExpires >= refreshedExpires) return {
		shouldMirror: false,
		reason: "incoming-not-fresher"
	};
	return {
		shouldMirror: true,
		reason: "incoming-fresher"
	};
}
//#endregion
//#region src/agents/auth-profiles/clone.ts
/** Deep-clones an auth profile store and rejects non-JSON values. */
function cloneAuthProfileStore(store) {
	return JSON.parse(JSON.stringify(store, (_key, value) => {
		if (typeof value === "bigint" || typeof value === "function" || typeof value === "symbol") throw new TypeError(`AuthProfileStore contains non-JSON value: ${typeof value}`);
		return value;
	}));
}
//#endregion
//#region src/agents/auth-profiles/oauth-shared.ts
/**
* Shared OAuth credential identity policy.
* Used by manager, external CLI overlays, and persistence paths to decide when
* incoming runtime credentials may bootstrap or settle stored profiles.
*/
/** Returns true when two OAuth credentials contain the same token/identity data. */
function areOAuthCredentialsEquivalent(a, b) {
	if (!a || a.type !== "oauth") return false;
	return a.provider === b.provider && a.access === b.access && a.refresh === b.refresh && a.expires === b.expires && a.email === b.email && a.enterpriseUrl === b.enterpriseUrl && a.projectId === b.projectId && a.accountId === b.accountId && a.idToken === b.idToken;
}
/** Returns true when an OAuth credential has account or email identity. */
function hasOAuthIdentity(credential) {
	return normalizeAuthIdentityToken(credential.accountId) !== void 0 || normalizeAuthEmailToken(credential.email) !== void 0;
}
/** Returns true when OAuth identity fields match by account id or email. */
function hasMatchingOAuthIdentity(existing, incoming) {
	return hasOAuthIdentity(existing) && isSafeToCopyOAuthIdentity(existing, incoming);
}
/** Returns true when the current owner accepts its provider refresh result. */
function isSafeOAuthOwnerRefreshResult(claimed, refreshed) {
	return claimed.provider === refreshed.provider && isSafeToCopyOAuthIdentity(claimed, refreshed);
}
/** Returns true when a claimed generation may settle with a live credential. */
function isSafeOAuthPostClaimSettlement(claimedGeneration, candidate) {
	return candidate?.type === "oauth" && candidate.provider === claimedGeneration.provider && hasUsableOAuthCredential(candidate) && hasMatchingOAuthIdentity(claimedGeneration, candidate);
}
function isSafeOAuthIdentityTransition(existing, incoming, policy) {
	if (!existing || existing.type !== "oauth") return policy.whenExistingCredentialMissing;
	if (existing.provider !== incoming.provider) return false;
	if (areOAuthCredentialsEquivalent(existing, incoming)) return true;
	if (!hasOAuthIdentity(existing)) return policy.whenExistingIdentityMissing;
	return hasMatchingOAuthIdentity(existing, incoming);
}
/** Returns true when bootstrap may adopt an external OAuth identity. */
function isSafeToAdoptBootstrapOAuthIdentity(existing, incoming) {
	return isSafeOAuthIdentityTransition(existing, incoming, {
		whenExistingCredentialMissing: true,
		whenExistingIdentityMissing: true
	});
}
/** Returns true when agent-local state may adopt a main-store OAuth identity. */
function isSafeToAdoptMainStoreOAuthIdentity(existing, incoming) {
	return isSafeOAuthIdentityTransition(existing, incoming, {
		whenExistingCredentialMissing: false,
		whenExistingIdentityMissing: true
	});
}
/** Returns true when an external CLI credential should bootstrap stored OAuth. */
function shouldBootstrapFromExternalCliCredential(params) {
	const now = params.now ?? Date.now();
	if (hasUsableOAuthCredential(params.existing, { now })) return false;
	return hasUsableOAuthCredential(params.imported, { now });
}
/** Overlays runtime external OAuth profiles on a cloned store. */
function overlayRuntimeExternalOAuthProfiles(store, profiles, options) {
	const externalProfiles = Array.from(profiles);
	const next = cloneAuthProfileStore(store);
	const overlaidProfileIds = new Set(externalProfiles.map((profile) => profile.profileId));
	for (const profile of externalProfiles) {
		next.profiles[profile.profileId] = profile.credential;
		delete next.runtimeCredentialSources?.[profile.profileId];
	}
	next.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => next.profiles[profileId] && !overlaidProfileIds.has(profileId)).toSorted();
	if (next.runtimePersistedProfileIds?.length === 0) next.runtimePersistedProfileIds = void 0;
	const runtimeOnlyProfileIds = new Set(externalProfiles.filter((profile) => profile.persistence !== "persisted").map((profile) => profile.profileId));
	for (const profileId of store.runtimeExternalProfileIds ?? []) if (next.profiles[profileId]) runtimeOnlyProfileIds.add(profileId);
	next.runtimeExternalProfileIds = runtimeOnlyProfileIds.size > 0 || options?.runtimeExternalProfileIdsAuthoritative === true ? [...runtimeOnlyProfileIds].toSorted() : void 0;
	next.runtimeExternalProfileIdsAuthoritative = options?.runtimeExternalProfileIdsAuthoritative === true ? true : void 0;
	return next;
}
/** Returns true when a runtime external OAuth profile should be persisted. */
function shouldPersistRuntimeExternalOAuthProfile(params) {
	for (const profile of params.profiles) {
		if (profile.profileId !== params.profileId) continue;
		if (profile.persistence === "persisted") return true;
		return !areOAuthCredentialsEquivalent(profile.credential, params.credential);
	}
	return true;
}
//#endregion
export { isSafeOAuthPostClaimSettlement as a, overlayRuntimeExternalOAuthProfiles as c, cloneAuthProfileStore as d, isSafeToCopyOAuthIdentity as f, shouldMirrorRefreshedOAuthCredential as h, isSafeOAuthOwnerRefreshResult as i, shouldBootstrapFromExternalCliCredential as l, normalizeAuthIdentityToken as m, hasMatchingOAuthIdentity as n, isSafeToAdoptBootstrapOAuthIdentity as o, normalizeAuthEmailToken as p, hasOAuthIdentity as r, isSafeToAdoptMainStoreOAuthIdentity as s, areOAuthCredentialsEquivalent as t, shouldPersistRuntimeExternalOAuthProfile as u };
