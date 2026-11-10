import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as supportsOpenAIResponsesFastMode } from "./openai-fast-mode-B_jae6aY.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { i as classifyOpenAIBaseUrl, n as OPENAI_CODEX_RESPONSES_BASE_URL, o as isOpenAICodexBaseUrl, t as OPENAI_API_BASE_URL } from "./base-url-Baro1bPi.mjs";
import { C as isOpenAIPlatformOnlyRouteModelId, S as isOpenAIDualRouteModelId, T as normalizeOpenAIModelRouteId, w as isOpenAISubscriptionOnlyRouteModelId } from "./model-route-contract-Fecaqw2C.mjs";
import { i as isOpenAIGptLiveModel, o as isSupportedOpenAIGptLiveModel } from "./realtime-quicksilver-dKvDt3kO.mjs";
import { t as resolveOpenAIModelServiceTiers } from "./service-tier-policy-CETGWqsV.mjs";
import { t as resolveUnifiedOpenAIThinkingProfile } from "./thinking-policy-D8447AxL.mjs";
import "./model-auth-policy-AxSWlgS0.mjs";
import "./native-web-search-policy-Cfd1Zg5f.mjs";
//#region extensions/openai/provider-policy-api.ts
function resolveServiceTiers(ctx) {
	return ctx.runtimeId === "openclaw" ? resolveOpenAIModelServiceTiers(ctx) : void 0;
}
function resolveFastModeSupport(ctx) {
	if (!ctx.api || !ctx.baseUrl || ctx.runtimeId !== "openclaw") return;
	return (resolveOpenAIModelServiceTiers(ctx)?.includes("priority") ?? true) && supportsOpenAIResponsesFastMode(ctx);
}
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_COMPLETIONS_API = "openai-completions";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_AGENT_RUNTIME_ID = "openclaw";
const CODEX_AGENT_RUNTIME_ID = "codex";
const OPENCLAW_RUNTIME_COMPATIBLE_IDS = [OPENAI_AGENT_RUNTIME_ID];
const CODEX_RUNTIME_COMPATIBLE_IDS = [OPENAI_AGENT_RUNTIME_ID, CODEX_AGENT_RUNTIME_ID];
function normalizeOptionalRouteApi(value) {
	return normalizeOptionalString(value);
}
/** Canonical logical id for OpenAI catalog projection. */
function normalizeModelCatalogId(params) {
	return params.provider.trim().toLowerCase() === OPENAI_PROVIDER_ID ? normalizeOpenAIModelRouteId(params.modelId) : null;
}
const OPENAI_RELEASE_DATE_SUFFIX = /-(?:\d{8}|\d{4}-\d{2}-\d{2})$/;
function isResponseModelEquivalent(params) {
	if (params.provider.trim().toLowerCase() !== OPENAI_PROVIDER_ID) return false;
	const responseRoute = params.responseModelId.replace(OPENAI_RELEASE_DATE_SUFFIX, "");
	return responseRoute === params.requestedModelId || params.requestedModelId === "gpt-5.6" && responseRoute === "gpt-5.6-sol";
}
/** Resolves authored OpenAI provider config without activating the runtime plugin. */
function resolveAuthoredOpenAIProviderConfig(params) {
	if (params.provider.trim().toLowerCase() !== OPENAI_PROVIDER_ID) return;
	const providers = Object.entries(params.config?.models?.providers ?? {});
	const requestedProvider = params.provider.trim();
	const providerKey = providers.find(([providerId]) => providerId.trim() === requestedProvider)?.[0].trim() ?? providers.find(([providerId]) => providerId.trim().toLowerCase() === OPENAI_PROVIDER_ID)?.[0].trim();
	let providerConfig;
	for (const [providerId, candidate] of providers) {
		if (providerId.trim() !== providerKey || !candidate) continue;
		providerConfig = providerConfig ? {
			...providerConfig,
			...candidate,
			models: candidate.models ?? providerConfig.models
		} : candidate;
	}
	return providerConfig;
}
/**
* Skips full runtime loading only when OpenAI normalization is provably a no-op.
* Transport-sensitive routes and legacy model aliases still use the runtime hook.
*/
function projectConfiguredModelRow(ctx) {
	if (ctx.provider.trim().toLowerCase() !== OPENAI_PROVIDER_ID) return;
	const configuredApi = normalizeOptionalRouteApi(resolveAuthoredOpenAIProviderConfig(ctx)?.api);
	const modelId = ctx.model.id;
	const canonicalModelId = normalizeOpenAIModelRouteId(modelId);
	const canonicalRouteId = normalizeOpenAIModelRouteId(ctx.modelId);
	if (configuredApi !== void 0 && configuredApi !== OPENAI_RESPONSES_API || ctx.model.api !== OPENAI_RESPONSES_API || isOpenAICodexBaseUrl(ctx.model.baseUrl) || canonicalModelId !== modelId || canonicalRouteId !== ctx.modelId) return;
	return null;
}
function projectRealtimeVoicePublicProjection(ctx) {
	const model = normalizeOptionalString(ctx.config.model) ?? ctx.providerConfig.model;
	const modelId = typeof model === "string" ? model : void 0;
	if (!isOpenAIGptLiveModel(modelId)) return { config: ctx.config };
	if (isSupportedOpenAIGptLiveModel(modelId)) return {
		config: ctx.config,
		clientHints: { gatewayRelaySupported: ctx.config.consultRouting !== "force-agent-consult" && !normalizeOptionalString(ctx.providerConfig.baseUrl) && !normalizeOptionalString(ctx.providerConfig.azureEndpoint) && !normalizeOptionalString(ctx.providerConfig.azureDeployment) }
	};
	const { model: _model, ...publicConfig } = ctx.config;
	return {
		config: publicConfig,
		clientHints: {
			modelSource: "gateway",
			gatewayRelaySupported: false
		}
	};
}
function firstRouteBaseUrl(...values) {
	for (const value of values) {
		if (typeof value === "string") {
			if (value.trim()) return value.trim();
			continue;
		}
		if (value !== void 0 && value !== null) return value;
	}
}
function concreteBaseUrl(value, fallback) {
	return normalizeOptionalString(value) ?? fallback;
}
function codexCanReproduceRoute(candidate) {
	if (candidate.requestTransportOverrides === "present") return false;
	const endpointKind = classifyOpenAIBaseUrl(candidate.baseUrl);
	return candidate.api === OPENAI_RESPONSES_API && endpointKind === "platform" || candidate.api === OPENAI_CHATGPT_RESPONSES_API && endpointKind === "chatgpt";
}
function withRuntimePolicy(candidate) {
	return {
		...candidate,
		runtimePolicy: { compatibleIds: codexCanReproduceRoute(candidate) ? candidate.authRequirement === "api-key" ? [...CODEX_RUNTIME_COMPATIBLE_IDS, "agentsapi"] : CODEX_RUNTIME_COMPATIBLE_IDS : OPENCLAW_RUNTIME_COMPATIBLE_IDS }
	};
}
function defaultRuntimeIdForRoute(candidate) {
	return codexCanReproduceRoute(candidate) ? CODEX_AGENT_RUNTIME_ID : OPENAI_AGENT_RUNTIME_ID;
}
function route(candidate) {
	const compatibleCandidate = candidate.runtimePolicy ? candidate : withRuntimePolicy(candidate);
	return {
		kind: "routes",
		routes: [compatibleCandidate],
		defaultRuntimeId: defaultRuntimeIdForRoute(compatibleCandidate)
	};
}
function resolveAuthoredModelRoute(context) {
	const modelApi = normalizeOptionalRouteApi(context.configuredModel?.api);
	const providerApi = normalizeOptionalRouteApi(context.configuredProvider?.api);
	const modelBaseUrl = firstRouteBaseUrl(context.configuredModel?.baseUrl);
	const providerBaseUrl = firstRouteBaseUrl(context.configuredProvider?.baseUrl);
	const environmentBaseUrl = firstRouteBaseUrl((context.env ?? process.env).OPENAI_BASE_URL);
	const hasModelRoute = modelApi !== void 0 || modelBaseUrl !== void 0;
	const hasProviderRoute = providerApi !== void 0 || providerBaseUrl !== void 0;
	if (!hasModelRoute && !hasProviderRoute && environmentBaseUrl === void 0) return;
	const api = modelApi ?? providerApi;
	let baseUrl = hasModelRoute ? modelBaseUrl : hasProviderRoute ? providerBaseUrl : environmentBaseUrl;
	if (baseUrl === void 0) {
		const lowerBaseUrl = hasModelRoute ? providerBaseUrl ?? environmentBaseUrl : environmentBaseUrl;
		const lowerEndpointKind = classifyOpenAIBaseUrl(lowerBaseUrl);
		if (lowerEndpointKind === "custom" || lowerEndpointKind === "invalid") baseUrl = lowerBaseUrl;
	}
	return {
		api,
		baseUrl,
		chatGPTApi: modelApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API || providerApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API,
		customDefaultApi: hasModelRoute || hasProviderRoute ? OPENAI_COMPLETIONS_API : OPENAI_RESPONSES_API
	};
}
/**
* Resolves OpenAI transport policy in provider-default order.
*
* Candidate order is not credential order. Callers must honor a locked profile,
* provider auth, then auth.order before choosing a compatible candidate. Unknown
* models without route facts remain indeterminate until a catalog row is observed.
*/
function resolveSingleObservedModelRoute(context, authored, observed) {
	if (context.provider.trim().toLowerCase() !== "openai") return {
		kind: "incompatible",
		code: "openai-route-provider-mismatch",
		message: `OpenAI route policy cannot resolve provider ${context.provider || "(empty)"}.`
	};
	const requestTransportOverrides = context.requestTransportOverrides ?? "none";
	const observedApi = normalizeOptionalRouteApi(observed?.api);
	const observedBaseUrl = firstRouteBaseUrl(observed?.baseUrl);
	const hasObservedRoute = observedApi !== void 0 || observedBaseUrl !== void 0;
	const configuredRoute = authored !== void 0;
	const effectiveApi = authored ? authored.api : observedApi;
	const effectiveBaseUrl = authored ? authored.baseUrl : observedBaseUrl;
	const endpointKind = classifyOpenAIBaseUrl(effectiveBaseUrl);
	if (endpointKind === "invalid") return {
		kind: "incompatible",
		code: "invalid-openai-base-url",
		message: "OpenAI model route baseUrl must be a non-empty URL string."
	};
	const chatGPTApi = effectiveApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API;
	const modelId = normalizeOpenAIModelRouteId(context.modelId);
	const knownRouteContract = isOpenAIDualRouteModelId(modelId) || isOpenAIPlatformOnlyRouteModelId(modelId) || isOpenAISubscriptionOnlyRouteModelId(modelId);
	const staleCustomChatGPTCatalog = endpointKind === "custom" && chatGPTApi && !authored?.chatGPTApi && !configuredRoute && knownRouteContract;
	if (endpointKind === "custom" && !staleCustomChatGPTCatalog) {
		if (chatGPTApi && !authored?.chatGPTApi) return {
			kind: "incompatible",
			code: "custom-chatgpt-relay-requires-configuration",
			message: "Custom ChatGPT relays require an explicitly configured ChatGPT adapter."
		};
		const customApi = effectiveApi ?? (observedApi === OPENAI_RESPONSES_API || observedApi === OPENAI_COMPLETIONS_API ? observedApi : void 0) ?? authored?.customDefaultApi ?? OPENAI_COMPLETIONS_API;
		if (customApi !== OPENAI_RESPONSES_API && customApi !== OPENAI_COMPLETIONS_API && customApi !== OPENAI_CHATGPT_RESPONSES_API) return {
			kind: "incompatible",
			code: "unsupported-custom-openai-api",
			message: `${customApi} is not an OpenAI-compatible model adapter.`
		};
		const customAuthRequirement = customApi.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API ? "subscription" : "api-key";
		return route({
			api: customApi,
			baseUrl: concreteBaseUrl(effectiveBaseUrl, OPENAI_API_BASE_URL),
			authRequirement: customAuthRequirement,
			requestTransportOverrides
		});
	}
	if (endpointKind === "platform" && chatGPTApi || endpointKind === "chatgpt" && effectiveApi !== void 0 && !chatGPTApi) return {
		kind: "incompatible",
		code: "conflicting-official-openai-route",
		message: "OpenAI model API and baseUrl select different official transports."
	};
	if (effectiveApi !== void 0 && effectiveApi !== OPENAI_RESPONSES_API && effectiveApi !== OPENAI_COMPLETIONS_API && effectiveApi !== OPENAI_CHATGPT_RESPONSES_API) return {
		kind: "incompatible",
		code: "unsupported-official-openai-api",
		message: `${effectiveApi} is not an OpenAI Platform model adapter.`
	};
	const platformRoute = withRuntimePolicy({
		api: configuredRoute && effectiveApi === OPENAI_COMPLETIONS_API ? OPENAI_COMPLETIONS_API : OPENAI_RESPONSES_API,
		baseUrl: OPENAI_API_BASE_URL,
		authRequirement: "api-key",
		requestTransportOverrides
	});
	const chatGPTRoute = withRuntimePolicy({
		api: OPENAI_CHATGPT_RESPONSES_API,
		baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
		authRequirement: "subscription",
		requestTransportOverrides
	});
	const platformOnly = isOpenAIPlatformOnlyRouteModelId(modelId);
	const subscriptionOnly = isOpenAISubscriptionOnlyRouteModelId(modelId);
	if (isOpenAIDualRouteModelId(modelId) && (!configuredRoute || effectiveApi === OPENAI_COMPLETIONS_API && requestTransportOverrides === "none")) return {
		kind: "routes",
		defaultRuntimeId: defaultRuntimeIdForRoute(platformRoute),
		routes: [platformRoute, chatGPTRoute]
	};
	if (!configuredRoute) {
		if (subscriptionOnly) return route(chatGPTRoute);
		if (platformOnly) return route(platformRoute);
	}
	if (endpointKind === "chatgpt" || chatGPTApi) {
		if (platformOnly) return {
			kind: "incompatible",
			code: "platform-only-model-on-chatgpt",
			message: `${modelId} is available only through OpenAI Platform API-key authentication.`
		};
		return route(chatGPTRoute);
	}
	if (subscriptionOnly) return {
		kind: "incompatible",
		code: "subscription-only-model-on-platform",
		message: `${modelId} is available only through ChatGPT subscription authentication.`
	};
	if (!configuredRoute && !hasObservedRoute) return {
		kind: "indeterminate",
		defaultRuntimeId: requestTransportOverrides === "present" ? OPENAI_AGENT_RUNTIME_ID : CODEX_AGENT_RUNTIME_ID
	};
	return route(platformRoute);
}
function canonicalRouteCandidateBaseUrl(baseUrl) {
	try {
		const url = new URL(baseUrl);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return baseUrl;
	}
}
function routeCandidateKey(candidate) {
	return [
		candidate.api,
		canonicalRouteCandidateBaseUrl(candidate.baseUrl),
		candidate.authRequirement,
		candidate.requestTransportOverrides,
		...candidate.runtimePolicy?.compatibleIds ?? []
	].join("\0");
}
function compareRouteCandidates(a, b) {
	const authOrder = (candidate) => candidate.authRequirement === "api-key" ? 0 : 1;
	return authOrder(a) - authOrder(b) || a.api.localeCompare(b.api) || a.baseUrl.localeCompare(b.baseUrl);
}
function ambiguousObservedRouteGroup(message) {
	return {
		kind: "incompatible",
		code: "ambiguous-openai-route-group",
		message
	};
}
function resolveAuthoredObservedFallback(observedRoutes) {
	const platformApis = /* @__PURE__ */ new Set();
	for (const observed of observedRoutes) {
		const api = normalizeOptionalRouteApi(observed.api);
		if (!api || api === OPENAI_CHATGPT_RESPONSES_API) continue;
		if (api !== OPENAI_RESPONSES_API && api !== OPENAI_COMPLETIONS_API) return {
			kind: "incompatible",
			code: "unsupported-custom-openai-api",
			message: `${api} is not an OpenAI-compatible model adapter.`
		};
		platformApis.add(api);
	}
	if (platformApis.size > 1) return ambiguousObservedRouteGroup("Observed OpenAI routes disagree on the Platform adapter for an authored endpoint.");
	const api = [...platformApis][0];
	return {
		kind: "observed",
		...api ? { route: { api } } : {}
	};
}
/** Resolves every physical row for one logical OpenAI model in provider order. */
function resolveModelRouteCandidates(context) {
	const observedRoutes = (context.observedRoutes ?? []).filter((observed) => observed.api != null || observed.baseUrl != null);
	const authored = resolveAuthoredModelRoute(context);
	if (authored) {
		if (authored.api === void 0 && classifyOpenAIBaseUrl(authored.baseUrl) === "custom") {
			const fallback = resolveAuthoredObservedFallback(observedRoutes);
			if (fallback.kind === "incompatible") return fallback;
			return resolveSingleObservedModelRoute(context, authored, fallback.route);
		}
		return resolveSingleObservedModelRoute(context, authored);
	}
	if (observedRoutes.length <= 1) return resolveSingleObservedModelRoute(context, authored, observedRoutes[0]);
	const resolutions = observedRoutes.map((observed) => resolveSingleObservedModelRoute(context, authored, observed));
	const incompatible = resolutions.filter((resolution) => resolution.kind === "incompatible").toSorted((a, b) => a.code.localeCompare(b.code) || a.message.localeCompare(b.message))[0];
	if (incompatible) return incompatible;
	const routesByKey = /* @__PURE__ */ new Map();
	for (const resolution of resolutions) {
		if (resolution.kind !== "routes") continue;
		for (const candidate of resolution.routes) {
			const key = routeCandidateKey(candidate);
			const existing = routesByKey.get(key);
			if (!existing || candidate.baseUrl.localeCompare(existing.baseUrl) < 0) routesByKey.set(key, candidate);
		}
	}
	const routes = [...routesByKey.values()].toSorted(compareRouteCandidates);
	const authRequirements = new Set(routes.map((candidate) => candidate.authRequirement));
	if (routes.length > authRequirements.size) return ambiguousObservedRouteGroup("Observed OpenAI routes contain multiple endpoints for the same authentication class.");
	const firstRoute = routes[0];
	if (!firstRoute) return resolveSingleObservedModelRoute(context, authored);
	return {
		kind: "routes",
		routes,
		defaultRuntimeId: resolutions.some((resolution) => resolution.kind === "routes" && resolution.defaultRuntimeId === "openclaw") ? OPENAI_AGENT_RUNTIME_ID : defaultRuntimeIdForRoute(firstRoute)
	};
}
/** Apply billing intent independently of which runtimes can execute each candidate. */
function resolveModelRoutes(context) {
	const resolution = resolveModelRouteCandidates(context);
	if (resolution.kind !== "routes" || resolution.routes.length < 2) return resolution;
	const intent = context.routeIntent;
	const requirement = intent?.authRequirement;
	if (requirement && intent.source === "explicit") {
		const selected = resolution.routes.find((candidate) => candidate.authRequirement === requirement);
		if (selected) return route(selected);
	}
	const explicitRuntimeId = intent?.source === "explicit" ? intent.runtimeId?.trim().toLowerCase() : void 0;
	if (explicitRuntimeId) {
		const compatible = resolution.routes.filter((candidate) => candidate.runtimePolicy?.compatibleIds.includes(explicitRuntimeId));
		const [first, ...rest] = compatible;
		if (first && compatible.length < resolution.routes.length) return {
			kind: "routes",
			routes: [first, ...rest],
			defaultRuntimeId: explicitRuntimeId
		};
	}
	const preferredAuthRequirement = requirement ?? (intent?.runtimeId === OPENAI_AGENT_RUNTIME_ID ? "api-key" : "subscription");
	return {
		...resolution,
		preferredAuthRequirement
	};
}
function normalizeConfig(params) {
	return params.providerConfig;
}
function resolveThinkingProfile(params) {
	switch (params.provider.trim().toLowerCase()) {
		case "openai": return resolveUnifiedOpenAIThinkingProfile(params.modelId, params.agentRuntime, params.compat, params.api, params.thinkingLevelMap);
		default: return null;
	}
}
//#endregion
export { projectRealtimeVoicePublicProjection as a, resolveModelRoutes as c, projectConfiguredModelRow as i, resolveServiceTiers as l, normalizeConfig as n, resolveAuthoredOpenAIProviderConfig as o, normalizeModelCatalogId as r, resolveFastModeSupport as s, isResponseModelEquivalent as t, resolveThinkingProfile as u };
