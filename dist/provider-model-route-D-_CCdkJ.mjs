import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { i as projectModelProviderConfig } from "./model-provider-config-BbSyhfVf.mjs";
import { a as resolveProviderModelRoutes, r as resolveProviderModelCatalogId } from "./provider-model-routes-CNgNpH_2.mjs";
//#region src/agents/provider-model-route.ts
/** Generic core consumers for provider-owned model route facts. */
/** Canonicalizes a model id only when its provider owns catalog equivalence. */
function canonicalizeProviderModelId(providerId, modelId) {
	const provider = normalizeProviderId(providerId);
	return provider && resolveProviderModelCatalogId({
		provider,
		modelId
	}) || modelId;
}
/** Wire-id normalization is not a switch to another provider-owned model. */
function isProviderModelRerouted(requested, effective) {
	const provider = normalizeProviderId(requested.provider);
	if (provider !== normalizeProviderId(effective.provider)) return true;
	const model = canonicalizeProviderModelId(provider, requested.model);
	return canonicalizeProviderModelId(provider, effective.model) !== model || effective.responseModel !== void 0 && canonicalizeProviderModelId(provider, effective.responseModel) !== model;
}
function normalizeRouteBaseUrl(value) {
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.replace(/\/+$/u, "");
	}
}
function routeTupleMatches(source, route) {
	return source.api === route.api && typeof source.baseUrl === "string" && normalizeRouteBaseUrl(source.baseUrl) === normalizeRouteBaseUrl(route.baseUrl);
}
/** True when materialized model metadata belongs to the selected provider route. */
function modelMatchesProviderModelRoute(params) {
	if (routeTupleMatches(params, params.route)) return true;
	if (typeof params.api !== "string" || !params.api.trim() || params.api !== params.route.api || typeof params.baseUrl !== "string" || !params.baseUrl.trim()) return false;
	const configuredProvider = {
		api: params.api,
		baseUrl: params.baseUrl,
		models: []
	};
	const provider = normalizeProviderId(params.provider);
	const resolution = resolveProviderModelRoutes({
		provider,
		config: { models: { providers: { [provider]: configuredProvider } } }
	});
	return resolution?.kind === "routes" && resolution.routes.some((candidate) => candidate.authRequirement === params.route.authRequirement && routeTupleMatches(candidate, params.route));
}
/** Creates catalog equivalence and physical-route matching from provider facts. */
function createProviderModelCatalogRoutePolicy(providerId) {
	const provider = normalizeProviderId(providerId);
	return {
		resolveIdentity: (entry) => {
			if (normalizeProviderId(entry.provider) !== provider) return null;
			const id = resolveProviderModelCatalogId({
				provider,
				modelId: splitTrailingAuthProfile(entry.id).model
			});
			return id ? {
				id,
				key: `${provider}/${id}`
			} : null;
		},
		matchesRoute: (entry, route) => normalizeProviderId(entry.provider) === provider && modelMatchesProviderModelRoute({
			provider,
			api: entry.api,
			baseUrl: entry.baseUrl,
			route
		})
	};
}
/** Projects a selected route onto transient config used only for model materialization. */
function projectProviderModelRouteConfig(params) {
	return projectModelProviderConfig(params.config, params.provider, {
		auth: params.route.authRequirement === "subscription" ? "oauth" : "api-key",
		api: params.route.api,
		baseUrl: params.route.baseUrl
	});
}
//#endregion
export { projectProviderModelRouteConfig as a, modelMatchesProviderModelRoute as i, createProviderModelCatalogRoutePolicy as n, isProviderModelRerouted as r, canonicalizeProviderModelId as t };
