import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { a as resolveMergedModelProviderConfig, n as createModelProviderRouteOverrideResolver, s as resolveMergedModelProviderModels } from "./model-provider-config-BbSyhfVf.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { t as getCurrentPluginMetadataSnapshotRequiredRuntime } from "./plugin-metadata-snapshot-required-CtdqzvuE.mjs";
import { r as resolveDirectBundledProviderPolicySurface } from "./provider-policy-surface-BIpBUrmO.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
//#region src/plugins/provider-model-routes.ts
/** Generic adapter for provider-owned model route public artifacts. */
/** Resolves policy through the bundled or selected trusted installed owner. */
function resolveProviderModelPolicySurface(providerId, metadataSnapshot) {
	const provider = normalizeProviderId(providerId);
	const bundled = resolveDirectBundledProviderPolicySurface(provider);
	if (bundled) return bundled;
	const metadata = metadataSnapshot ?? getCurrentPluginMetadataSnapshotRequiredRuntime({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	return metadata ? resolveProviderPolicySurface(provider, {
		manifestRegistry: metadata,
		directSurface: bundled
	}) : null;
}
/** Binds one provider's identity facts for an authored-row lookup. */
function createProviderModelCatalogIdNormalizer(providerId, metadataSnapshot) {
	const provider = normalizeProviderId(providerId);
	const surface = provider ? resolveProviderModelPolicySurface(provider, metadataSnapshot) : null;
	return (modelId) => resolveProviderModelCatalogId({
		provider,
		modelId,
		surface
	}) ?? modelId;
}
/** Resolves provider-owned catalog id equivalence without loading its runtime. */
function resolveProviderModelCatalogId(params) {
	const provider = normalizeProviderId(params.provider);
	const normalized = (params.surface === void 0 ? resolveProviderModelPolicySurface(provider, params.metadataSnapshot) : params.surface)?.normalizeModelCatalogId?.({
		provider,
		modelId: params.modelId
	});
	return typeof normalized === "string" && normalized.trim() ? normalized.trim() : null;
}
function normalizeModelId(provider, modelId, surface) {
	const trimmed = modelId?.trim();
	if (!trimmed) return;
	const canonical = surface?.normalizeModelCatalogId?.({
		provider,
		modelId: trimmed
	});
	return typeof canonical === "string" && canonical.trim() ? canonical.trim() : trimmed;
}
function projectConfiguredModelRoute(model) {
	return {
		...Object.hasOwn(model, "api") ? { api: model.api } : {},
		...Object.hasOwn(model, "baseUrl") ? { baseUrl: model.baseUrl } : {}
	};
}
/** Captures one provider artifact and config view for repeated row resolution. */
function createProviderModelRoutesResolver(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return () => null;
	const surface = params.surface === void 0 ? resolveProviderModelPolicySurface(provider) : params.surface;
	const resolveModelRoutes = surface?.resolveModelRoutes;
	if (!resolveModelRoutes) return () => null;
	const providerConfig = resolveMergedModelProviderConfig(params.config, provider);
	const authoredConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	const configuredProvider = providerConfig ? {
		api: providerConfig.api,
		baseUrl: providerConfig.baseUrl
	} : void 0;
	const providerRuntimeId = providerConfig?.agentRuntime?.id?.trim();
	const canonicalizeModelId = (modelId) => normalizeModelId(provider, modelId, surface) ?? modelId.trim();
	const configuredModels = /* @__PURE__ */ new Map();
	for (const [modelId, model] of resolveMergedModelProviderModels({
		models: providerConfig?.models,
		normalizeModelId: canonicalizeModelId
	})) configuredModels.set(modelId, {
		route: projectConfiguredModelRoute(model),
		runtimeId: model.agentRuntime?.id?.trim()
	});
	const resolveRouteOverridePresence = params.requestTransportOverrides === "present" ? () => "present" : createModelProviderRouteOverrideResolver({
		provider,
		authoredConfig,
		canonicalizeModelId
	});
	const providerRouteOverridePresence = resolveRouteOverridePresence();
	const routeOverridePresenceByModel = /* @__PURE__ */ new Map();
	for (const modelId of configuredModels.keys()) routeOverridePresenceByModel.set(modelId, resolveRouteOverridePresence(modelId));
	const env = params.env ?? process.env;
	return (observed) => {
		const modelId = normalizeModelId(provider, observed?.modelId, surface);
		const configuredModel = modelId ? configuredModels.get(modelId) : void 0;
		const configuredRuntimeId = normalizeOptionalAgentRuntimeId(configuredModel?.runtimeId || providerRuntimeId);
		const preparedIntent = observed?.routeIntent ?? params.routeIntent;
		const routeIntent = preparedIntent?.source === "explicit" ? preparedIntent : configuredRuntimeId && !isDefaultAgentRuntimeId(configuredRuntimeId) ? {
			runtimeId: configuredRuntimeId,
			source: "explicit"
		} : preparedIntent;
		const requestTransportOverrides = modelId ? routeOverridePresenceByModel.get(modelId) ?? providerRouteOverridePresence : providerRouteOverridePresence;
		const observedRoutes = observed?.observedRoutes?.filter((route) => route.api != null || route.baseUrl !== void 0 && route.baseUrl !== null);
		return resolveModelRoutes({
			provider,
			...modelId ? { modelId } : {},
			requestTransportOverrides,
			...configuredModel ? { configuredModel: configuredModel.route } : {},
			...configuredProvider ? { configuredProvider } : {},
			...routeIntent ? { routeIntent } : {},
			env,
			...observedRoutes && observedRoutes.length > 0 ? { observedRoutes } : {}
		}) ?? null;
	};
}
/** Resolves one model route through its bundled provider public artifact. */
function resolveProviderModelRoutes(params) {
	return createProviderModelRoutesResolver(params)({
		modelId: params.modelId,
		observedRoutes: params.api != null || params.baseUrl !== void 0 && params.baseUrl !== null ? [{
			api: params.api,
			baseUrl: params.baseUrl
		}] : void 0
	});
}
//#endregion
export { resolveProviderModelRoutes as a, resolveProviderModelPolicySurface as i, createProviderModelRoutesResolver as n, resolveProviderModelCatalogId as r, createProviderModelCatalogIdNormalizer as t };
