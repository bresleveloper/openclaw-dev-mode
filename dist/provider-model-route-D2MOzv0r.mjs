import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveMergedModelProviderConfig, i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { h as listProviderPolicyOwners } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as getCurrentPluginMetadataSnapshotRequiredRuntime } from "./plugin-metadata-snapshot-required-ylXiwW1c.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { a as resolveProviderModelRoutes, i as resolveProviderModelPolicySurface, r as resolveProviderModelCatalogId } from "./provider-model-routes-CmpBxrCV.mjs";
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
/** Provider and authored custom-row equivalence do not change the selected OpenClaw route. */
function isProviderModelRerouted(requested, effective, config) {
	const provider = normalizeProviderId(requested.provider);
	if (provider !== normalizeProviderId(effective.provider)) return true;
	const surface = provider ? resolveProviderModelPolicySurface(provider) : null;
	const canonicalize = (modelId) => resolveProviderModelCatalogId({
		provider,
		modelId,
		surface
	}) ?? modelId;
	const model = canonicalize(requested.model);
	if (canonicalize(effective.model) !== model) return true;
	const responseModel = effective.responseModel;
	if (responseModel === void 0 || canonicalize(responseModel) === model) return false;
	if (surface?.isResponseModelEquivalent?.({
		provider,
		requestedModelId: requested.model,
		responseModelId: responseModel
	}) === true) return false;
	if (surface || !config) return true;
	const source = projectConfigOntoRuntimeSourceSnapshot(config);
	const row = findConfiguredProviderModel(resolveMergedModelProviderConfig(source, provider), provider, requested.model, canonicalize);
	if (row?.responseModelEquivalent !== true || row.metadataSource === "models-add") return true;
	const metadata = getCurrentPluginMetadataSnapshotRequiredRuntime({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	if (!metadata) return false;
	return listProviderPolicyOwners(provider, metadata).length > 0 || (metadata.owners.modelCatalogProviders.get(provider) ?? []).some((pluginId) => {
		const owner = metadata.byPluginId.get(pluginId);
		return owner?.origin === "bundled" || owner?.trustedOfficialInstall === true;
	});
}
function routeTupleMatches(source, route) {
	return source.api === route.api && typeof source.baseUrl === "string" && (normalizeCatalogRouteBaseUrl(source.baseUrl) ?? "") === (normalizeCatalogRouteBaseUrl(route.baseUrl) ?? "");
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
