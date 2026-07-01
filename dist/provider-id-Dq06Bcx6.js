//#region packages/model-catalog-core/src/provider-id.ts
function normalizeLowercaseStringOrEmpty(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
/** Normalize provider ID before manifest-owned auth alias lookup. */
function normalizeProviderIdForAuth(provider) {
	return normalizeProviderId(provider);
}
function findNormalizedProviderValue(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	for (const [key, value] of Object.entries(entries)) if (normalizeProviderId(key) === providerKey) return value;
}
function findNormalizedProviderKey(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
//#endregion
export { normalizeProviderIdForAuth as a, normalizeProviderId as i, findNormalizedProviderValue as n, normalizeLowercaseStringOrEmpty as r, findNormalizedProviderKey as t };
