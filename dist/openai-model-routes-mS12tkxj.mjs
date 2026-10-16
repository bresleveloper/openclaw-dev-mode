import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-C5LPYz3z.mjs";
import { i as resolveProviderModelPolicySurface, n as createProviderModelRoutesResolver, r as resolveProviderModelCatalogId } from "./provider-model-routes-BXIDiDZZ.mjs";
import { o as selectProviderModelRouteAuth } from "./provider-model-route-auth-Cbwct-ZM.mjs";
import { n as resolveModelRouteIntent } from "./model-runtime-policy-Bz7NzEHI.mjs";
import { n as createProviderModelCatalogRoutePolicy } from "./provider-model-route-BpciAISP.mjs";
//#region src/agents/openai-model-routes.ts
const OPENAI_PROVIDER_ID = "openai";
function createOpenAIModelRoutesResolver(params) {
	const resolveRoutes = createProviderModelRoutesResolver({
		provider: OPENAI_PROVIDER_ID,
		config: params.config,
		env: params.env,
		requestTransportOverrides: params.requestTransportOverrides
	});
	return (observed) => {
		const routeIntent = observed.routeIntent ?? resolveModelRouteIntent({
			config: params.config,
			provider: OPENAI_PROVIDER_ID,
			modelId: observed.modelId,
			agentId: params.agentId,
			primaryModel: params.primaryModel,
			resolveProfileAuthMode: params.resolveProfileAuthMode,
			resolveProfileAuthFlow: params.resolveProfileAuthFlow
		});
		return resolveRoutes({
			modelId: observed.modelId ? splitTrailingAuthProfile(observed.modelId).model : void 0,
			routeIntent: routeIntent?.source === "inherited" && routeIntent.authRequirement && observed.pinnedAuthRequirement && routeIntent.authRequirement !== observed.pinnedAuthRequirement ? {
				...routeIntent,
				authRequirement: observed.pinnedAuthRequirement,
				source: "explicit"
			} : routeIntent,
			observedRoutes: observed.observedRoutes ?? (observed.api != null || observed.baseUrl !== void 0 && observed.baseUrl !== null ? [{
				api: observed.api,
				baseUrl: observed.baseUrl
			}] : void 0)
		});
	};
}
/** Returns the authored OpenAI provider auth mode, if one exists. */
function resolveConfiguredOpenAIAuthMode(config) {
	return resolveMergedModelProviderConfig(config, OPENAI_PROVIDER_ID)?.auth;
}
function selectOpenAIModelRouteAuth(params) {
	return selectProviderModelRouteAuth({
		provider: OPENAI_PROVIDER_ID,
		...params
	});
}
const openAIModelCatalogRoutePolicy = createProviderModelCatalogRoutePolicy(OPENAI_PROVIDER_ID);
/** Canonical catalog identity without ambiguity between provider and model segments. */
function resolveModelCatalogIdentityKey(entry) {
	return resolveModelCatalogIdentityKeyWithPolicies(entry);
}
/** Reuses each provider policy only for one synchronous catalog operation. */
function createModelCatalogIdentityKeyResolver() {
	const policies = /* @__PURE__ */ new Map();
	return (entry) => resolveModelCatalogIdentityKeyWithPolicies(entry, policies);
}
function resolveModelCatalogIdentityKeyWithPolicies(entry, policies) {
	const provider = normalizeProviderId(entry.provider);
	const modelId = splitTrailingAuthProfile(entry.id).model;
	let surface = policies?.get(provider);
	if (policies && surface === void 0) {
		surface = resolveProviderModelPolicySurface(provider);
		policies.set(provider, surface);
	}
	const id = resolveProviderModelCatalogId({
		provider,
		modelId,
		surface
	}) ?? entry.id;
	return JSON.stringify([provider, id]);
}
/** Resolves provider-owned OpenAI route state without loading the full provider runtime. */
function resolveOpenAIModelRoutes(params) {
	if (normalizeProviderId(params.provider ?? "") !== OPENAI_PROVIDER_ID) return null;
	return createOpenAIModelRoutesResolver({
		config: params.config,
		agentId: params.agentId,
		primaryModel: params.primaryModel,
		resolveProfileAuthMode: params.resolveProfileAuthMode,
		resolveProfileAuthFlow: params.resolveProfileAuthFlow,
		env: params.env,
		requestTransportOverrides: params.requestTransportOverrides
	})({
		modelId: params.modelId,
		api: params.api,
		baseUrl: params.baseUrl,
		routeIntent: params.routeIntent,
		pinnedAuthRequirement: params.pinnedAuthRequirement
	});
}
//#endregion
export { resolveModelCatalogIdentityKey as a, resolveConfiguredOpenAIAuthMode as i, createOpenAIModelRoutesResolver as n, resolveOpenAIModelRoutes as o, openAIModelCatalogRoutePolicy as r, selectOpenAIModelRouteAuth as s, createModelCatalogIdentityKeyResolver as t };
