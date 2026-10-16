import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, t as MissingPublicSurfaceError } from "./facade-loader-B-X-HqBc.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-WXO5HScp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/auth-profiles/credential-observation.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.canonicalAuthCredentialObservation"), () => ({
	scope: new AsyncLocalStorage(),
	origins: /* @__PURE__ */ new WeakMap()
}));
async function withCanonicalAuthProfileCredentialObserver(observer, run) {
	const scope = {
		observer,
		parent: state.scope.getStore()
	};
	try {
		return await state.scope.run(scope, run);
	} finally {
		scope.observer = void 0;
	}
}
function publish(databasePath, profiles) {
	let scope = state.scope.getStore();
	if (!scope?.observer || Object.keys(profiles).length === 0) return;
	while (scope) {
		scope.observer?.({
			databasePath,
			profiles: structuredClone(profiles)
		});
		scope = scope.parent;
	}
}
/** Observe an existing canonical read or committed credential, never a runtime overlay. */
function observeCanonicalAuthProfileCredentials(databasePath, profiles) {
	for (const [profileId, credential] of Object.entries(profiles)) {
		const previous = state.origins.get(credential) ?? [];
		state.origins.set(credential, [...previous.filter((origin) => origin.databasePath !== databasePath || origin.profileId !== profileId), {
			databasePath,
			profileId,
			serialized: JSON.stringify(credential)
		}]);
	}
	publish(databasePath, profiles);
}
/** Cloning preserves evidence only for the exact credential bytes the owner observed. */
function copyCanonicalAuthProfileCredentialObservations(source, target) {
	for (const [profileId, credential] of Object.entries(target)) {
		const original = source[profileId];
		if (!original) continue;
		const origins = state.origins.get(original)?.filter((origin) => origin.profileId === profileId && origin.serialized === JSON.stringify(credential));
		if (origins?.length) state.origins.set(credential, origins);
	}
}
/** Cached reads replay producer facts, not profile IDs or inferred directory ownership. */
function observeCachedCanonicalAuthProfileCredentials(profiles) {
	if (!state.scope.getStore()?.observer) return;
	const byOwner = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(profiles)) for (const origin of state.origins.get(credential) ?? []) {
		if (origin.profileId !== profileId || origin.serialized !== JSON.stringify(credential)) continue;
		const owned = byOwner.get(origin.databasePath) ?? /* @__PURE__ */ new Map();
		owned.set(profileId, credential);
		byOwner.set(origin.databasePath, owned);
	}
	for (const [databasePath, owned] of byOwner) publish(databasePath, Object.fromEntries(owned));
}
//#endregion
//#region src/agents/auth-profiles/clone.ts
/**
* Auth profile store cloning helpers.
* Keeps store snapshots JSON-serializable before callers mutate or persist
* profile state.
*/
/** Deep-clones an auth profile store and rejects non-JSON values. */
function cloneAuthProfileStore(store) {
	const cloned = JSON.parse(JSON.stringify(store, (_key, value) => {
		if (typeof value === "bigint" || typeof value === "function" || typeof value === "symbol") throw new TypeError(`AuthProfileStore contains non-JSON value: ${typeof value}`);
		return value;
	}));
	copyCanonicalAuthProfileCredentialObservations(store.profiles, cloned.profiles);
	return cloned;
}
//#endregion
//#region src/agents/auth-profiles/oauth-identity.ts
/**
* OAuth identity comparison and mirroring decisions.
* Guards cross-agent credential copy/adoption so refreshed credentials cannot
* overwrite a different account's local auth state.
*/
/** Returns whether OAuth credentials target the same provider-owned tenant. */
function isSafeToCopyOAuthRoutingScope(existing, incoming) {
	if (existing.provider !== incoming.provider) return false;
	if (existing.provider !== "github-copilot") return true;
	let surface;
	try {
		surface = loadBundledPluginPublicSurfaceModuleSyncCore({
			dirName: "github-copilot",
			artifactBasename: "api.js",
			env: {}
		});
	} catch (error) {
		if (error instanceof MissingPublicSurfaceError) return false;
		throw error;
	}
	const { normalizeGithubCopilotOAuthScope } = surface;
	const existingScope = normalizeGithubCopilotOAuthScope(existing.enterpriseUrl);
	const incomingScope = normalizeGithubCopilotOAuthScope(incoming.enterpriseUrl);
	return existingScope !== void 0 && existingScope === incomingScope;
}
/** Normalize account-id style identity tokens for exact comparison. */
function normalizeAuthIdentityToken(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
/** Normalize email identity tokens for case-insensitive comparison. */
function normalizeAuthEmailToken(value) {
	return normalizeAuthIdentityToken(value)?.toLowerCase();
}
function hasOidcRegistration(credential) {
	return credential.issuer !== void 0 && credential.clientId !== void 0;
}
/** Identity evidence includes OIDC registration, even when its subject is unavailable. */
function hasOAuthIdentity(credential) {
	return hasOidcRegistration(credential) || normalizeAuthIdentityToken(credential.accountId) !== void 0 || normalizeAuthEmailToken(credential.email) !== void 0;
}
/**
* One-sided copy gate for both directions:
* - mirror: sub-agent refresh -> main-agent store
* - adopt: main-agent store -> sub-agent store
*/
function isSafeToCopyOAuthIdentity(existing, incoming) {
	if (existing.provider !== void 0 && incoming.provider !== void 0 && !isSafeToCopyOAuthRoutingScope({
		provider: existing.provider,
		enterpriseUrl: existing.enterpriseUrl
	}, {
		provider: incoming.provider,
		enterpriseUrl: incoming.enterpriseUrl
	})) return false;
	const aAcct = normalizeAuthIdentityToken(existing.accountId);
	const bAcct = normalizeAuthIdentityToken(incoming.accountId);
	if (hasOidcRegistration(existing) || hasOidcRegistration(incoming)) return existing.issuer === incoming.issuer && existing.clientId === incoming.clientId && aAcct !== void 0 && aAcct === bAcct;
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
/** Returns true when both credentials describe the same registered identity. */
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
/** Returns true when bootstrap may adopt an external OAuth identity. */
function isSafeToAdoptBootstrapOAuthIdentity(existing, incoming) {
	return !existing || existing.type !== "oauth" || isSafeOAuthOwnerRefreshResult(existing, incoming);
}
/** Returns true when agent-local state may adopt a main-store OAuth identity. */
function isSafeToAdoptMainStoreOAuthIdentity(existing, incoming) {
	return existing?.type === "oauth" && isSafeOAuthOwnerRefreshResult(existing, incoming);
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
export { cloneAuthProfileStore as _, isSafeToAdoptBootstrapOAuthIdentity as a, observeCanonicalAuthProfileCredentials as b, shouldBootstrapFromExternalCliCredential as c, hasOidcRegistration as d, isSafeToCopyOAuthIdentity as f, shouldMirrorRefreshedOAuthCredential as g, normalizeAuthIdentityToken as h, isSafeOAuthPostClaimSettlement as i, shouldPersistRuntimeExternalOAuthProfile as l, normalizeAuthEmailToken as m, hasMatchingOAuthIdentity as n, isSafeToAdoptMainStoreOAuthIdentity as o, isSafeToCopyOAuthRoutingScope as p, isSafeOAuthOwnerRefreshResult as r, overlayRuntimeExternalOAuthProfiles as s, areOAuthCredentialsEquivalent as t, hasOAuthIdentity as u, copyCanonicalAuthProfileCredentialObservations as v, withCanonicalAuthProfileCredentialObserver as x, observeCachedCanonicalAuthProfileCredentials as y };
