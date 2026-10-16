import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as normalizePluginProviderBaseUrl, r as matchesPluginProviderEndpoint } from "./plugin-metadata-provider-facts-Bs366hg9.mjs";
//#region src/plugins/provider-config-owner.ts
function hasConfiguredModelProvider(params) {
	return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
/** Limits implicit catalogs to endpoints declared by their provider owner. */
function isProviderCatalogSourceAllowed(params) {
	const configuredBaseUrl = findNormalizedProviderValue(params.config?.models?.providers, params.provider)?.baseUrl;
	if (!configuredBaseUrl || !params.plugin) return true;
	const catalog = params.plugin.modelCatalog;
	const alias = findNormalizedProviderValue(catalog?.aliases, params.provider);
	const provider = findNormalizedProviderValue(catalog?.providers, alias?.provider ?? params.provider);
	const baseUrls = [
		alias?.baseUrl,
		provider?.baseUrl,
		...(provider?.models ?? []).map((model) => model.baseUrl)
	].filter((baseUrl) => Boolean(baseUrl));
	const endpoints = params.plugin.providerEndpoints ?? [];
	if (baseUrls.length === 0 && endpoints.length === 0) return true;
	const normalizedBaseUrl = normalizePluginProviderBaseUrl(configuredBaseUrl);
	if (!normalizedBaseUrl) return false;
	const host = new URL(normalizedBaseUrl).hostname;
	return baseUrls.some((baseUrl) => normalizePluginProviderBaseUrl(baseUrl) === normalizedBaseUrl) || endpoints.some((endpoint) => matchesPluginProviderEndpoint(endpoint, {
		host,
		normalizedBaseUrl
	}));
}
/** Core built-in model API ids that do not imply plugin ownership of a provider config. */
const CORE_BUILT_IN_MODEL_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"azure-openai-responses",
	"google-generative-ai",
	"google-interactions",
	"google-vertex",
	"mistral-conversations",
	"openai-chatgpt-responses",
	"openai-completions",
	"openai-responses"
]);
/** Returns the plugin API id that owns a provider config when it is not core built-in. */
function resolveProviderConfigApiOwnerHint(params) {
	const providers = params.config?.models?.providers;
	if (!providers) return;
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return;
	const providerConfig = providers[params.provider] ?? findNormalizedProviderValue(providers, normalizedProvider);
	const api = typeof providerConfig?.api === "string" ? normalizeProviderId(providerConfig.api) : "";
	if (!api || api === normalizedProvider || CORE_BUILT_IN_MODEL_APIS.has(api)) return;
	return api;
}
/** Resolves provider/model refs used to scope model catalog discovery. */
function resolveModelCatalogScope(params) {
	const provider = params.provider.trim();
	const model = params.model.trim();
	const providerConfig = findNormalizedProviderValue(params.cfg?.models?.providers, provider);
	const qualifiedModel = provider && model ? `${provider}/${model}` : model;
	const modelRefs = model && providerConfig?.models?.some((candidate) => candidate.id?.trim() === model) ? [qualifiedModel] : [qualifiedModel, model];
	return {
		providerRefs: normalizeUniqueSingleOrTrimmedStringList([provider, providerConfig?.api]),
		modelRefs: normalizeUniqueSingleOrTrimmedStringList(modelRefs)
	};
}
//#endregion
export { resolveProviderConfigApiOwnerHint as a, resolveModelCatalogScope as i, hasConfiguredModelProvider as n, isProviderCatalogSourceAllowed as r, CORE_BUILT_IN_MODEL_APIS as t };
