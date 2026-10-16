import { c as resolveSharedAuthStorePath } from "./path-resolve-CIRhdX6A.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, g as resolveAuthProfileDatabasePath, u as readPersistedAuthProfileStateRaw } from "./sqlite-CW8wNN4G.mjs";
import { n as coercePersistedAuthProfileStore } from "./persisted-BVyWmvfF.mjs";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-WXO5HScp.mjs";
import { _ as hasRuntimeAuthProfileStoreSource, d as getRuntimeAuthProfileStoreSnapshotCore, h as hasAnyRuntimeAuthProfileStoreSource } from "./runtime-snapshots-CSLjByUx.mjs";
import { s as hasLegacyAuthProfileCredentialSource } from "./legacy-source-diagnostic-Bj7ByR_x.mjs";
//#region src/agents/auth-profiles/source-check.ts
/**
* Auth-profile source probes for runtime and persisted stores.
* These checks intentionally avoid loading secret-bearing credential payloads.
*/
function normalizeProvider(provider) {
	return provider.trim().toLowerCase();
}
function storeHasProviderProfile(store, provider, profileIds) {
	const profiles = store?.profiles;
	if (!profiles) return false;
	const expected = normalizeProvider(provider);
	return (profileIds?.map((profileId) => profiles[profileId]) ?? Object.values(profiles)).some((credential) => credential !== void 0 && normalizeProvider(credential.provider) === expected && evaluateStoredCredentialEligibility({ credential }).eligible);
}
function canonicalStoreOwnsProviderRoute(agentDir, provider, profileIds) {
	const inspection = inspectPersistedAuthProfileStoreRaw(agentDir);
	if (inspection.status === "missing") return false;
	const store = inspection.status === "readable" ? coercePersistedAuthProfileStore(inspection.raw) : null;
	if (!store) return true;
	return storeHasProviderProfile(store, provider, profileIds);
}
/** Returns true when any local/runtime/main auth profile source exists. */
function hasAnyAuthProfileStoreSource(agentDir) {
	if (hasLocalAuthProfileStoreSource(agentDir)) return true;
	if (hasAnyRuntimeAuthProfileStoreSource(agentDir)) return true;
	const authPath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = resolveSharedAuthStorePath();
	if (agentDir && authPath !== mainAuthPath && (hasLegacyAuthProfileCredentialSource(void 0) || inspectPersistedAuthProfileStoreRaw(void 0).status !== "missing" || readPersistedAuthProfileStateRaw(void 0))) return true;
	return false;
}
/** Returns true when the requested agent dir has a local auth profile source. */
function hasLocalAuthProfileStoreSource(agentDir) {
	if (hasRuntimeAuthProfileStoreSource(agentDir)) return true;
	if (hasLegacyAuthProfileCredentialSource(agentDir)) return true;
	if (inspectPersistedAuthProfileStoreRaw(agentDir).status !== "missing") return true;
	return Boolean(readPersistedAuthProfileStateRaw(agentDir));
}
/** Returns true when a read-only auth-profile source contains a profile for a provider. */
function hasAuthProfileStoreSourceForProvider(provider, agentDir, options) {
	if (!normalizeProvider(provider)) return false;
	const profileIds = options?.profileIds;
	if (profileIds?.length === 0) return false;
	const localRuntimeStore = getRuntimeAuthProfileStoreSnapshotCore(agentDir);
	if (storeHasProviderProfile(coercePersistedAuthProfileStore(localRuntimeStore), provider, profileIds)) return true;
	if (hasLegacyAuthProfileCredentialSource(agentDir)) return true;
	if (canonicalStoreOwnsProviderRoute(agentDir, provider, profileIds)) return true;
	if (!agentDir) return false;
	const mainRuntimeStore = getRuntimeAuthProfileStoreSnapshotCore();
	if (storeHasProviderProfile(coercePersistedAuthProfileStore(mainRuntimeStore), provider, profileIds)) return true;
	if (hasLegacyAuthProfileCredentialSource()) return true;
	return canonicalStoreOwnsProviderRoute(void 0, provider, profileIds);
}
//#endregion
export { hasAuthProfileStoreSourceForProvider as n, hasLocalAuthProfileStoreSource as r, hasAnyAuthProfileStoreSource as t };
