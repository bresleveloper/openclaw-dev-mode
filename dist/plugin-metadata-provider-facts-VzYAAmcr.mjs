import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import { t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { t as official_external_provider_catalog_default } from "./official-external-provider-catalog-BqzTj1tM.mjs";
//#region src/plugins/official-external-provider-endpoints.ts
/**
* Provider endpoint metadata for officially externalized provider plugins.
*
* Endpoint classification (SSRF, attribution, payload-compat policy) keys off
* base URLs and must keep working when the owning plugin is not installed:
* dist packages exclude externalized plugins, so their manifests are invisible
* to bundled discovery. Only the repo-bundled catalog JSON feeds this table;
* hosted marketplace feeds must never influence endpoint classification.
* Kept separate from official-external-plugin-catalog.ts so provider
* transports do not pull the ClawHub install/marketplace module graph.
*/
/**
* Lists manifest-shaped catalog metadata blocks that declare provider endpoints.
*
* The catalog mirrors manifests faithfully, including endpoint classes core
* does not (yet) recognize (e.g. deepinfra-native, gmi-native). The endpoint
* reader filters unknown classes exactly as it does for installed manifests,
* so they stay inert instead of complicating the mirror contract.
*/
function listOfficialExternalProviderEndpointManifests() {
	const entries = official_external_provider_catalog_default.entries;
	if (!Array.isArray(entries)) return [];
	const manifests = [];
	for (const entry of entries) {
		if (!isRecord(entry)) continue;
		const manifest = entry[MANIFEST_KEY];
		if (isRecord(manifest) && Array.isArray(manifest.providerEndpoints)) manifests.push(manifest);
	}
	return manifests;
}
//#endregion
//#region src/plugins/setup-descriptors.ts
/** Lists setup provider ids and auth aliases owned by one plugin manifest. */
function listSetupProviderIds(record) {
	const providerIds = record.setup?.providers?.map((entry) => entry.id) ?? record.providers;
	const normalizedProviderIds = new Set(providerIds.map(normalizeProviderId));
	const aliases = Object.entries(record.providerAuthAliases ?? {}).filter(([, target]) => typeof target === "string" && normalizedProviderIds.has(normalizeProviderId(target))).map(([alias]) => alias);
	return [...providerIds, ...aliases];
}
/** Lists setup CLI backend ids from setup metadata or manifest contribution ids. */
function listSetupCliBackendIds(record) {
	return record.setup?.cliBackends ?? record.cliBackends;
}
//#endregion
//#region src/plugins/plugin-metadata-provider-facts.ts
const PROVIDER_ENDPOINT_CLASSES = new Set("anthropic-public cerebras-native chutes-native deepseek-native github-copilot-native groq-native meta-native mistral-public minimax-native moonshot-native modelstudio-native nvidia-native openai-public openai opencode-native opencode-go-native azure-openai openrouter xai-native xiaomi-native zai-native google-generative-ai google-vertex".split(" "));
function normalizeProviderHosts(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string").map((entry) => entry.trim().toLowerCase()).filter(Boolean) : [];
}
function normalizePluginProviderBaseUrl(value) {
	const trimmed = normalizeOptionalString(value);
	const schemeless = trimmed && /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed);
	const url = trimmed ? URL.parse(schemeless ? `https://${trimmed}` : trimmed) : null;
	if (!url || url.protocol !== "http:" && url.protocol !== "https:") return;
	url.hash = "";
	url.search = "";
	return normalizeOptionalLowercaseString(url.toString().replace(/\/+$/, ""));
}
function hostMatchesSuffix(host, suffix) {
	if (!suffix) return false;
	return suffix.startsWith(".") || suffix.startsWith("-") ? host.endsWith(suffix) : host === suffix || host.endsWith(`.${suffix}`);
}
/** Shares declared endpoint matching between request classification and catalog eligibility. */
function matchesPluginProviderEndpoint(endpoint, params) {
	return (endpoint.hosts ?? []).includes(params.host) || (endpoint.hostSuffixes ?? []).some((suffix) => hostMatchesSuffix(params.host, suffix)) || Boolean(params.normalizedBaseUrl && (endpoint.baseUrls ?? []).some((baseUrl) => baseUrl === params.normalizedBaseUrl || normalizePluginProviderBaseUrl(baseUrl) === params.normalizedBaseUrl));
}
function prepareProviderEndpoints(value) {
	if (!Array.isArray(value)) return [];
	const endpoints = [];
	for (const endpoint of value) {
		if (!isRecord(endpoint)) continue;
		const endpointClass = normalizeOptionalString(endpoint.endpointClass);
		if (!endpointClass || !PROVIDER_ENDPOINT_CLASSES.has(endpointClass)) continue;
		const googleVertexRegion = normalizeOptionalString(endpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(endpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		endpoints.push({
			endpointClass,
			hosts: normalizeProviderHosts(endpoint.hosts),
			hostSuffixes: normalizeProviderHosts(endpoint.hostSuffixes),
			baseUrls: normalizeProviderHosts(endpoint.baseUrls).map(normalizePluginProviderBaseUrl).filter((baseUrl) => baseUrl !== void 0),
			...googleVertexRegion ? { googleVertexRegion } : {},
			...googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {}
		});
	}
	return endpoints;
}
const PROVIDER_AUTH_ALIAS_ORIGIN_PRIORITY = {
	config: 0,
	bundled: 1,
	global: 2,
	workspace: 3
};
/** Prepares package alias candidates without capturing current workspace trust. */
function buildPluginMetadataProviderAuthAliases(plugins) {
	const aliases = /* @__PURE__ */ new Map();
	let order = 0;
	for (const plugin of plugins) {
		const entries = [...Object.entries(plugin.providerAuthAliases ?? {}).toSorted(([left], [right]) => left.localeCompare(right)), ...(plugin.providerAuthChoices ?? []).flatMap((choice) => (choice.deprecatedChoiceIds ?? []).map((alias) => [alias, choice.provider]))];
		for (const [rawAlias, rawTarget] of entries) {
			const alias = normalizeProviderId(rawAlias);
			const target = normalizeProviderId(typeof rawTarget === "string" ? rawTarget : rawTarget.provider);
			if (!alias || !target) continue;
			const candidates = aliases.get(alias) ?? [];
			candidates.push({
				plugin,
				target,
				...typeof rawTarget === "string" ? {} : { baseUrls: rawTarget.baseUrls },
				order: order++
			});
			aliases.set(alias, candidates);
		}
	}
	for (const candidates of aliases.values()) candidates.sort((left, right) => (PROVIDER_AUTH_ALIAS_ORIGIN_PRIORITY[left.plugin.origin] ?? Number.MAX_SAFE_INTEGER) - (PROVIDER_AUTH_ALIAS_ORIGIN_PRIORITY[right.plugin.origin] ?? Number.MAX_SAFE_INTEGER));
	return aliases;
}
function buildPluginMetadataProviderFacts(plugins) {
	const providerEndpoints = plugins.flatMap((plugin) => prepareProviderEndpoints(plugin.providerEndpoints));
	const providerRequests = /* @__PURE__ */ new Map();
	const providerAuthContributions = [];
	for (const plugin of plugins) {
		const envProviders = (plugin.setup?.providers ?? []).filter((provider) => provider.envVars?.length);
		const evidenceProviders = (plugin.setup?.providers ?? []).filter((provider) => provider.authEvidence?.length);
		const fallbackProviderRefs = plugin.setup?.requiresRuntime !== false ? listSetupProviderIds(plugin).map(normalizeProviderId).filter(Boolean) : [];
		if (envProviders.length || evidenceProviders.length || fallbackProviderRefs.length) providerAuthContributions.push({
			plugin,
			envProviders,
			evidenceProviders,
			fallbackProviderRefs
		});
		const requests = isRecord(plugin.providerRequest?.providers) ? plugin.providerRequest.providers : {};
		for (const [rawProvider, request] of Object.entries(requests)) {
			if (!isRecord(request)) continue;
			const provider = normalizeLowercaseStringOrEmpty(rawProvider);
			if (!provider) continue;
			const supportsStreamingUsage = isRecord(request.openAICompletions) ? request.openAICompletions.supportsStreamingUsage : void 0;
			providerRequests.set(provider, {
				...normalizeOptionalString(request.family) ? { family: normalizeOptionalString(request.family) } : {},
				...normalizeOptionalString(request.compatibilityFamily) === "moonshot" ? { compatibilityFamily: "moonshot" } : {},
				...typeof supportsStreamingUsage === "boolean" ? { openAICompletions: { supportsStreamingUsage } } : {}
			});
		}
	}
	for (const manifest of listOfficialExternalProviderEndpointManifests()) providerEndpoints.push(...prepareProviderEndpoints(manifest.providerEndpoints));
	return {
		providerEndpoints,
		providerRequests,
		providerAuthContributions,
		modelIdNormalizationPolicies: collectManifestModelIdNormalizationPolicies(plugins),
		providerAuthAliases: buildPluginMetadataProviderAuthAliases(plugins)
	};
}
//#endregion
export { listSetupCliBackendIds as a, normalizePluginProviderBaseUrl as i, buildPluginMetadataProviderFacts as n, listSetupProviderIds as o, matchesPluginProviderEndpoint as r, buildPluginMetadataProviderAuthAliases as t };
