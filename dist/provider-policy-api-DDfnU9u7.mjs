import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as normalizeOpenAIServiceTier, r as supportsOpenAIResponsesFastMode } from "./minimax-fast-mode-DJ9Z9buZ.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
import { i as classifyOpenAIBaseUrl, n as OPENAI_CODEX_RESPONSES_BASE_URL, o as isOpenAICodexBaseUrl, t as OPENAI_API_BASE_URL } from "./base-url-CsNC9nJ8.mjs";
import { S as normalizeOpenAIModelRouteId, b as isOpenAIPlatformOnlyRouteModelId, x as isOpenAISubscriptionOnlyRouteModelId, y as isOpenAIDualRouteModelId } from "./model-route-contract-B0eTJHEC.mjs";
import { n as resolveUnifiedOpenAIThinkingProfile } from "./thinking-policy-WM6JmYSi.mjs";
import { i as isOpenAIGptLiveModel, o as isSupportedOpenAIGptLiveModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import "./native-web-search-policy-BdFH5ZP4.mjs";
//#region extensions/openai/provider-policy-api.ts
function resolveFastModeSupport(ctx) {
	if (!ctx.api || !ctx.baseUrl || ctx.runtimeId !== "openclaw") return;
	return normalizeOpenAIServiceTier(ctx.params?.serviceTier ?? ctx.params?.service_tier) === void 0 && supportsOpenAIResponsesFastMode(ctx);
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
function isResponseModelEquivalent(params) {
	return params.provider.trim().toLowerCase() === OPENAI_PROVIDER_ID && params.requestedModelId === "gpt-5.6" && params.responseModelId === "gpt-5.6-sol";
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
		clientHints: { gatewayRelaySupported: ctx.config.consultRouting !== "force-agent-consult" && !normalizeOptionalString(ctx.providerConfig.azureEndpoint) && !normalizeOptionalString(ctx.providerConfig.azureDeployment) }
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
function resolveOpenAIEnvironmentBaseUrl(context) {
	return (context.env ?? process.env).OPENAI_BASE_URL;
}
function isHttpBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string") return false;
	try {
		return new URL(baseUrl.trim()).protocol === "http:";
	} catch {
		return false;
	}
}
function codexCanReproduceRoute(candidate, sourceBaseUrl = candidate.baseUrl) {
	if (isHttpBaseUrl(sourceBaseUrl) || candidate.requestTransportOverrides === "present") return false;
	const endpointKind = classifyOpenAIBaseUrl(candidate.baseUrl);
	return candidate.api === OPENAI_RESPONSES_API && endpointKind === "platform" || candidate.api === OPENAI_CHATGPT_RESPONSES_API && endpointKind === "chatgpt";
}
function withRuntimePolicy(candidate, sourceBaseUrl = candidate.baseUrl) {
	return {
		...candidate,
		runtimePolicy: { compatibleIds: codexCanReproduceRoute(candidate, sourceBaseUrl) ? CODEX_RUNTIME_COMPATIBLE_IDS : OPENCLAW_RUNTIME_COMPATIBLE_IDS }
	};
}
function defaultRuntimeIdForRoute(candidate, sourceBaseUrl = candidate.baseUrl) {
	return codexCanReproduceRoute(candidate, sourceBaseUrl) ? CODEX_AGENT_RUNTIME_ID : OPENAI_AGENT_RUNTIME_ID;
}
function route(candidate, sourceBaseUrl) {
	const compatibleCandidate = withRuntimePolicy(candidate, sourceBaseUrl);
	return {
		kind: "routes",
		routes: [compatibleCandidate],
		defaultRuntimeId: defaultRuntimeIdForRoute(compatibleCandidate, sourceBaseUrl)
	};
}
/**
* Resolves OpenAI transport policy in provider-default order.
*
* Candidate order is not credential order. Callers must honor a locked profile,
* provider auth, then auth.order before choosing a compatible candidate. Unknown
* models without route facts remain indeterminate until a catalog row is observed.
*/
function resolveSingleObservedModelRoute(context) {
	if (context.provider.trim().toLowerCase() !== "openai") return {
		kind: "incompatible",
		code: "openai-route-provider-mismatch",
		message: `OpenAI route policy cannot resolve provider ${context.provider || "(empty)"}.`
	};
	const modelApi = normalizeOptionalRouteApi(context.configuredModel?.api);
	const requestTransportOverrides = context.requestTransportOverrides ?? "none";
	const providerApi = normalizeOptionalRouteApi(context.configuredProvider?.api);
	const modelBaseUrl = firstRouteBaseUrl(context.configuredModel?.baseUrl);
	const providerBaseUrl = firstRouteBaseUrl(context.configuredProvider?.baseUrl);
	const environmentBaseUrl = firstRouteBaseUrl(resolveOpenAIEnvironmentBaseUrl(context));
	const observedApi = normalizeOptionalRouteApi(context.observed?.api);
	const observedBaseUrl = firstRouteBaseUrl(context.observed?.baseUrl);
	const hasObservedRoute = observedApi !== void 0 || observedBaseUrl !== void 0;
	let effectiveApi;
	let effectiveBaseUrl;
	let configuredRoute = false;
	let customDefaultApi = OPENAI_COMPLETIONS_API;
	if (modelApi !== void 0 || modelBaseUrl !== void 0) {
		configuredRoute = true;
		effectiveApi = modelApi ?? providerApi;
		effectiveBaseUrl = modelBaseUrl;
		if (modelBaseUrl === void 0) {
			const lowerBaseUrl = providerBaseUrl ?? environmentBaseUrl;
			const lowerEndpointKind = classifyOpenAIBaseUrl(lowerBaseUrl);
			effectiveBaseUrl = lowerEndpointKind === "custom" || lowerEndpointKind === "invalid" ? lowerBaseUrl : void 0;
		}
	} else if (providerApi !== void 0 || providerBaseUrl !== void 0) {
		configuredRoute = true;
		effectiveApi = providerApi;
		effectiveBaseUrl = providerBaseUrl;
		if (providerBaseUrl === void 0) {
			const environmentEndpointKind = classifyOpenAIBaseUrl(environmentBaseUrl);
			if (environmentEndpointKind === "custom" || environmentEndpointKind === "invalid") effectiveBaseUrl = environmentBaseUrl;
		}
	} else if (environmentBaseUrl !== void 0) {
		configuredRoute = true;
		effectiveBaseUrl = environmentBaseUrl;
		customDefaultApi = OPENAI_RESPONSES_API;
	} else {
		effectiveApi = observedApi;
		effectiveBaseUrl = observedBaseUrl;
	}
	const endpointKind = classifyOpenAIBaseUrl(effectiveBaseUrl);
	if (endpointKind === "invalid") return {
		kind: "incompatible",
		code: "invalid-openai-base-url",
		message: "OpenAI model route baseUrl must be a non-empty URL string."
	};
	const chatGPTApi = effectiveApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API;
	const authoredChatGPTApi = modelApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API || providerApi?.toLowerCase() === OPENAI_CHATGPT_RESPONSES_API;
	if (endpointKind === "custom") {
		if (chatGPTApi && !authoredChatGPTApi) return {
			kind: "incompatible",
			code: "custom-chatgpt-relay-requires-configuration",
			message: "Custom ChatGPT relays require an explicitly configured ChatGPT adapter."
		};
		const customApi = effectiveApi ?? (observedApi === OPENAI_RESPONSES_API || observedApi === OPENAI_COMPLETIONS_API ? observedApi : void 0) ?? customDefaultApi;
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
		}, effectiveBaseUrl);
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
	const modelId = normalizeOpenAIModelRouteId(context.modelId);
	const sourceBaseUrl = effectiveBaseUrl;
	const platformRoute = withRuntimePolicy({
		api: configuredRoute && effectiveApi === OPENAI_COMPLETIONS_API ? OPENAI_COMPLETIONS_API : OPENAI_RESPONSES_API,
		baseUrl: classifyOpenAIBaseUrl(sourceBaseUrl) === "platform" && isHttpBaseUrl(sourceBaseUrl) ? concreteBaseUrl(sourceBaseUrl, OPENAI_API_BASE_URL) : OPENAI_API_BASE_URL,
		authRequirement: "api-key",
		requestTransportOverrides
	}, sourceBaseUrl);
	const chatGPTRoute = withRuntimePolicy({
		api: OPENAI_CHATGPT_RESPONSES_API,
		baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
		authRequirement: "subscription",
		requestTransportOverrides
	}, sourceBaseUrl);
	const platformOnly = isOpenAIPlatformOnlyRouteModelId(modelId);
	const subscriptionOnly = isOpenAISubscriptionOnlyRouteModelId(modelId);
	if (isOpenAIDualRouteModelId(modelId) && (!configuredRoute || effectiveApi === OPENAI_COMPLETIONS_API && requestTransportOverrides === "none")) return {
		kind: "routes",
		defaultRuntimeId: defaultRuntimeIdForRoute(platformRoute, sourceBaseUrl),
		routes: [platformRoute, chatGPTRoute]
	};
	if (!configuredRoute) {
		if (subscriptionOnly) return route(chatGPTRoute, sourceBaseUrl);
		if (platformOnly) return route(platformRoute, sourceBaseUrl);
	}
	if (endpointKind === "chatgpt" || chatGPTApi) {
		if (platformOnly) return {
			kind: "incompatible",
			code: "platform-only-model-on-chatgpt",
			message: `${modelId} is available only through OpenAI Platform API-key authentication.`
		};
		return route(chatGPTRoute, sourceBaseUrl);
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
	return route(platformRoute, sourceBaseUrl);
}
function hasAuthoredRouteFacts(context) {
	return normalizeOptionalRouteApi(context.configuredModel?.api) !== void 0 || firstRouteBaseUrl(context.configuredModel?.baseUrl) !== void 0 || normalizeOptionalRouteApi(context.configuredProvider?.api) !== void 0 || firstRouteBaseUrl(context.configuredProvider?.baseUrl) !== void 0 || firstRouteBaseUrl(resolveOpenAIEnvironmentBaseUrl(context)) !== void 0;
}
function authoredRouteNeedsObservedPlatformApi(context) {
	if (normalizeOptionalRouteApi(context.configuredModel?.api) !== void 0 || normalizeOptionalRouteApi(context.configuredProvider?.api) !== void 0) return false;
	const authoredBaseUrl = firstRouteBaseUrl(context.configuredModel?.baseUrl, context.configuredProvider?.baseUrl, resolveOpenAIEnvironmentBaseUrl(context));
	return classifyOpenAIBaseUrl(authoredBaseUrl) === "custom";
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
			resolution: {
				kind: "incompatible",
				code: "unsupported-custom-openai-api",
				message: `${api} is not an OpenAI-compatible model adapter.`
			}
		};
		platformApis.add(api);
	}
	if (platformApis.size > 1) return {
		kind: "incompatible",
		resolution: ambiguousObservedRouteGroup("Observed OpenAI routes disagree on the Platform adapter for an authored endpoint.")
	};
	const api = [...platformApis][0];
	return {
		kind: "observed",
		...api ? { route: { api } } : {}
	};
}
/** Resolves every physical row for one logical OpenAI model in provider order. */
function resolveModelRouteCandidates(context) {
	const observedRoutes = (context.observedRoutes ?? []).filter((observed) => observed.api != null || observed.baseUrl != null);
	if (hasAuthoredRouteFacts(context)) {
		if (authoredRouteNeedsObservedPlatformApi(context)) {
			const fallback = resolveAuthoredObservedFallback(observedRoutes);
			if (fallback.kind === "incompatible") return fallback.resolution;
			return resolveSingleObservedModelRoute({
				...context,
				observed: fallback.route
			});
		}
		return resolveSingleObservedModelRoute(context);
	}
	if (observedRoutes.length <= 1) return resolveSingleObservedModelRoute({
		...context,
		observed: observedRoutes[0]
	});
	const resolutions = observedRoutes.map((observed) => resolveSingleObservedModelRoute({
		...context,
		observed
	}));
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
	if (!firstRoute) return resolveSingleObservedModelRoute(context);
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
export { projectRealtimeVoicePublicProjection as a, resolveModelRoutes as c, projectConfiguredModelRow as i, resolveThinkingProfile as l, normalizeConfig as n, resolveAuthoredOpenAIProviderConfig as o, normalizeModelCatalogId as r, resolveFastModeSupport as s, isResponseModelEquivalent as t };
