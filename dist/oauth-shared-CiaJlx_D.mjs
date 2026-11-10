import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as copyAuthProfileAuthorizationIntent, r as copyAuthProfileAuthorizationInheritance } from "./authorization-lifetime-CLdd1God.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, t as MissingPublicSurfaceError } from "./facade-loader-CcsJkVh8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isBigIntObject, isBooleanObject, isNumberObject, isStringObject } from "node:util/types";
//#region src/agents/auth-profiles/clone-value.ts
/** Keep immutable credential strings in place while detaching their JSON containers. */
function cloneAuthProfileJsonValue(input) {
	const ancestors = /* @__PURE__ */ new Set();
	const clone = (current, key) => {
		let value = current;
		if (value !== null && (typeof value === "object" || typeof value === "bigint")) {
			const toJSON = Reflect.get(Object(value), "toJSON");
			if (typeof toJSON === "function") value = Reflect.apply(toJSON, value, [key]);
		}
		if (typeof value === "bigint" || typeof value === "function" || typeof value === "symbol") throw new TypeError(`AuthProfileStore contains non-JSON value: ${typeof value}`);
		if (isNumberObject(value)) value = Number(value);
		else if (isStringObject(value)) value = String(value);
		else if (isBooleanObject(value)) value = Boolean.prototype.valueOf.call(value);
		else if (isBigIntObject(value)) throw new TypeError("AuthProfileStore contains non-JSON value: bigint");
		if (typeof value === "number") return Number.isFinite(value) ? value === 0 ? 0 : value : null;
		if (value === null || typeof value !== "object") return value;
		if (ancestors.has(value)) throw new TypeError("AuthProfileStore contains a circular JSON value");
		ancestors.add(value);
		try {
			if (Array.isArray(value)) return Array.from({ length: value.length }, (_, index) => clone(value[index], `${index}`) ?? null);
			return Object.fromEntries(Object.keys(value).flatMap((property) => {
				const copied = clone(Reflect.get(value, property), property);
				return copied === void 0 ? [] : [[property, copied]];
			}));
		} finally {
			ancestors.delete(value);
		}
	};
	return clone(input, "");
}
//#endregion
//#region src/agents/auth-profiles/credential-observation.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.canonicalAuthCredentialObservation"), () => ({
	scope: new AsyncLocalStorage(),
	origins: /* @__PURE__ */ new WeakMap()
}));
function matchesCanonicalCredential(origin, credential) {
	const equal = (left, right) => {
		if (left === right) return true;
		if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
		if (Array.isArray(left) !== Array.isArray(right)) return false;
		const keys = Object.keys(left);
		const otherKeys = Object.keys(right);
		return keys.length === otherKeys.length && keys.every((key, index) => key === otherKeys[index] && equal(Reflect.get(left, key), Reflect.get(right, key)));
	};
	return equal(origin.credential, cloneAuthProfileJsonValue(credential));
}
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
			profiles: cloneAuthProfileJsonValue(profiles)
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
			credential: cloneAuthProfileJsonValue(credential)
		}]);
	}
	publish(databasePath, profiles);
}
/** Cloning preserves evidence only for the exact credential bytes the owner observed. */
function copyCanonicalAuthProfileCredentialObservations(source, target) {
	for (const [profileId, credential] of Object.entries(target)) {
		const original = source[profileId];
		if (!original) continue;
		const origins = state.origins.get(original)?.filter((origin) => origin.profileId === profileId && matchesCanonicalCredential(origin, credential));
		if (origins?.length) state.origins.set(credential, origins);
	}
}
/** Cached reads replay producer facts, not profile IDs or inferred directory ownership. */
function observeCachedCanonicalAuthProfileCredentials(profiles) {
	if (!state.scope.getStore()?.observer) return;
	const byOwner = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(profiles)) for (const origin of state.origins.get(credential) ?? []) {
		if (origin.profileId !== profileId || !matchesCanonicalCredential(origin, credential)) continue;
		const owned = byOwner.get(origin.databasePath) ?? /* @__PURE__ */ new Map();
		owned.set(profileId, credential);
		byOwner.set(origin.databasePath, owned);
	}
	for (const [databasePath, owned] of byOwner) publish(databasePath, Object.fromEntries(owned));
}
//#endregion
//#region src/agents/auth-profiles/oauth-identity.ts
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
function hasOidcRegistration(credential) {
	return credential.issuer !== void 0 && credential.clientId !== void 0;
}
/** Identity evidence includes OIDC registration, even when its subject is unavailable. */
function hasOAuthIdentity(credential) {
	return hasOidcRegistration(credential) || normalizeOptionalString(credential.accountId) !== void 0 || normalizeOptionalLowercaseString(credential.email) !== void 0;
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
	const aAcct = normalizeOptionalString(existing.accountId);
	const bAcct = normalizeOptionalString(incoming.accountId);
	if (hasOidcRegistration(existing) || hasOidcRegistration(incoming)) return existing.issuer === incoming.issuer && existing.clientId === incoming.clientId && aAcct !== void 0 && aAcct === bAcct;
	const aEmail = normalizeOptionalLowercaseString(existing.email);
	const bEmail = normalizeOptionalLowercaseString(incoming.email);
	if (aAcct !== void 0 && bAcct !== void 0) return aAcct === bAcct;
	if (aEmail !== void 0 && bEmail !== void 0) return aEmail === bEmail;
	if (aAcct !== void 0 || aEmail !== void 0) return false;
	return true;
}
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
/**
* Auth profile store cloning helpers.
* Keeps store snapshots JSON-serializable before callers mutate or persist
* profile state.
*/
/** Deep-clones an auth profile store and rejects non-JSON values. */
function cloneAuthProfileStore(store) {
	const cloned = cloneAuthProfileJsonValue(store);
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		const target = cloned.profiles[profileId];
		if (target) copyAuthProfileAuthorizationIntent(credential, target);
	}
	copyAuthProfileAuthorizationInheritance(store.profiles, cloned.profiles);
	copyCanonicalAuthProfileCredentialObservations(store.profiles, cloned.profiles);
	return cloned;
}
//#endregion
//#region src/agents/auth-profiles/oauth-shared.ts
function areOAuthCredentialsEquivalent(a, b) {
	if (!a || a.type !== "oauth") return false;
	return a.provider === b.provider && a.access === b.access && a.refresh === b.refresh && a.expires === b.expires && a.email === b.email && a.enterpriseUrl === b.enterpriseUrl && a.projectId === b.projectId && a.accountId === b.accountId && a.idToken === b.idToken;
}
function hasMatchingOAuthIdentity(existing, incoming) {
	return hasOAuthIdentity(existing) && isSafeToCopyOAuthIdentity(existing, incoming);
}
function isSafeOAuthOwnerRefreshResult(claimed, refreshed) {
	return claimed.provider === refreshed.provider && isSafeToCopyOAuthIdentity(claimed, refreshed);
}
function isSafeOAuthPostClaimSettlement(claimedGeneration, candidate) {
	return candidate?.type === "oauth" && candidate.provider === claimedGeneration.provider && hasUsableOAuthCredential(candidate) && hasMatchingOAuthIdentity(claimedGeneration, candidate);
}
function isSafeToAdoptBootstrapOAuthIdentity(existing, incoming) {
	return !existing || existing.type !== "oauth" || isSafeOAuthOwnerRefreshResult(existing, incoming);
}
function isSafeToAdoptMainStoreOAuthIdentity(existing, incoming) {
	return existing?.type === "oauth" && isSafeOAuthOwnerRefreshResult(existing, incoming);
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
function shouldPersistRuntimeExternalOAuthProfile(params) {
	for (const profile of params.profiles) {
		if (profile.profileId !== params.profileId) continue;
		if (profile.persistence === "persisted") return true;
		return !areOAuthCredentialsEquivalent(profile.credential, params.credential);
	}
	return true;
}
//#endregion
export { observeCanonicalAuthProfileCredentials as _, isSafeToAdoptBootstrapOAuthIdentity as a, shouldPersistRuntimeExternalOAuthProfile as c, hasOidcRegistration as d, isSafeToCopyOAuthIdentity as f, observeCachedCanonicalAuthProfileCredentials as g, copyCanonicalAuthProfileCredentialObservations as h, isSafeOAuthPostClaimSettlement as i, cloneAuthProfileStore as l, shouldMirrorRefreshedOAuthCredential as m, hasMatchingOAuthIdentity as n, isSafeToAdoptMainStoreOAuthIdentity as o, isSafeToCopyOAuthRoutingScope as p, isSafeOAuthOwnerRefreshResult as r, overlayRuntimeExternalOAuthProfiles as s, areOAuthCredentialsEquivalent as t, hasOAuthIdentity as u, withCanonicalAuthProfileCredentialObserver as v, cloneAuthProfileJsonValue as y };
