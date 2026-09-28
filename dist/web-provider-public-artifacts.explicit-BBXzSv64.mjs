import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as loadBundledPublicArtifactEntries } from "./public-artifact-factories-Dpb70kPS.mjs";
//#region src/plugins/web-provider-public-artifacts.explicit.ts
const WEB_SEARCH_ARTIFACT_CANDIDATES = [
	"web-search-contract-api.js",
	"web-search-provider.js",
	"web-search.js"
];
const WEB_FETCH_ARTIFACT_CANDIDATES = [
	"web-fetch-contract-api.js",
	"web-fetch-provider.js",
	"web-fetch.js"
];
const WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES = ["web-fetch-provider.js", "web-fetch.js"];
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWebProviderPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && typeof value.hint === "string" && isStringArray(value.envVars) && typeof value.placeholder === "string" && typeof value.signupUrl === "string" && typeof value.credentialPath === "string" && typeof value.getCredentialValue === "function" && typeof value.setCredentialValue === "function" && typeof value.createTool === "function";
}
function resolveBundledExplicitProviders(params) {
	const providers = [];
	const owners = params.manifestRecords && new Map(params.manifestRecords.map((record) => [record.id, record]));
	for (const pluginId of sortUniqueStrings(params.onlyPluginIds)) {
		const owner = owners?.get(pluginId);
		if (owners && owner?.origin !== "bundled") return null;
		const loadedProviders = loadBundledPublicArtifactEntries({
			...params,
			dirName: pluginId,
			pluginId,
			owner,
			partialFailureLabel: "web providers"
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		artifactCandidates: WEB_SEARCH_ARTIFACT_CANDIDATES,
		suffix: "WebSearchProvider",
		isArtifact: (value) => isWebProviderPlugin(value)
	});
}
function resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		artifactCandidates: WEB_FETCH_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isArtifact: (value) => isWebProviderPlugin(value)
	});
}
function resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		artifactCandidates: WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isArtifact: (value) => isWebProviderPlugin(value)
	});
}
//#endregion
export { resolveBundledExplicitWebFetchProvidersFromPublicArtifacts as n, resolveBundledExplicitWebSearchProvidersFromPublicArtifacts as r, resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts as t };
