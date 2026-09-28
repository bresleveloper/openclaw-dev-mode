import { c as resolveSharedAuthStorePath } from "./path-resolve-Bm8Ih2d_.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, h as resolveAuthProfileDatabasePath, l as readPersistedAuthProfileStateRaw } from "./sqlite-BIg_k8qE.mjs";
import { i as coercePersistedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-CWZ_V0ds.mjs";
import { _ as hasRuntimeAuthProfileStoreSource, d as getRuntimeAuthProfileStoreSnapshotCore, h as hasAnyRuntimeAuthProfileStoreSource } from "./runtime-snapshots-CBozwlR0.mjs";
import { s as hasLegacyAuthProfileCredentialSource } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
//#region src/agents/auth-profiles/source-check.ts
/**
* Auth-profile source probes for runtime and persisted stores.
* These checks intentionally avoid loading secret-bearing credential payloads.
*/
function normalizeProvider(provider) {
	return provider.trim().toLowerCase();
}
function isAuthProfileCredential(value) {
	if (!value || typeof value !== "object") return false;
	const credential = value;
	const type = credential.type;
	return typeof credential.provider === "string" && (type === "api_key" || type === "token" || type === "oauth");
}
function isEligibleProviderCredential(rawCredential, expectedProvider) {
	if (!isAuthProfileCredential(rawCredential)) return false;
	return normalizeProvider(rawCredential.provider) === expectedProvider && evaluateStoredCredentialEligibility({ credential: rawCredential }).eligible;
}
function coerceRawStoreProfiles(raw) {
	return coercePersistedAuthProfileStore(raw)?.profiles ?? null;
}
function rawStoreHasProviderProfile(raw, provider, profileIds) {
	const profiles = coerceRawStoreProfiles(raw);
	if (!profiles) return false;
	const expected = normalizeProvider(provider);
	const credentials = profileIds?.map((profileId) => profiles[profileId]) ?? Object.values(profiles);
	for (const rawCredential of credentials) if (isEligibleProviderCredential(rawCredential, expected)) return true;
	return false;
}
function runtimeStoreHasProviderProfile(store, provider, profileIds) {
	return rawStoreHasProviderProfile(store, provider, profileIds);
}
function canonicalStoreOwnsProviderRoute(agentDir, provider, profileIds) {
	const inspection = inspectPersistedAuthProfileStoreRaw(agentDir);
	if (inspection.status === "missing") return false;
	if (inspection.status === "unreadable" || !coercePersistedAuthProfileStore(inspection.raw)) return true;
	return rawStoreHasProviderProfile(inspection.raw, provider, profileIds);
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
	if (runtimeStoreHasProviderProfile(getRuntimeAuthProfileStoreSnapshotCore(agentDir), provider, profileIds)) return true;
	if (hasLegacyAuthProfileCredentialSource(agentDir)) return true;
	if (canonicalStoreOwnsProviderRoute(agentDir, provider, profileIds)) return true;
	if (!agentDir) return false;
	if (runtimeStoreHasProviderProfile(getRuntimeAuthProfileStoreSnapshotCore(), provider, profileIds)) return true;
	if (hasLegacyAuthProfileCredentialSource()) return true;
	return canonicalStoreOwnsProviderRoute(void 0, provider, profileIds);
}
//#endregion
export { hasAuthProfileStoreSourceForProvider as n, hasLocalAuthProfileStoreSource as r, hasAnyAuthProfileStoreSource as t };
