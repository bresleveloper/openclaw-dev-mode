import { c as asFiniteNumberInRange, d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { f as getCachedLiveProviderModelRows } from "./provider-catalog-live-runtime-BAhXMc_e.mjs";
//#region extensions/clawrouter/provider-catalog.ts
const CLAWROUTER_DEFAULT_BASE_URL = "https://clawrouter.openclaw.ai";
const PROVIDER_ID = "clawrouter";
const CATALOG_CACHE_TTL_MS = 6e4;
const ROUTE_METADATA_KEY = "clawrouterRoute";
const DEFAULT_CONTEXT_WINDOW = 2e5;
const DEFAULT_MAX_TOKENS = 32768;
const DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const CLAWROUTER_REASONING_EFFORT_LEVELS = [
	["none", "off"],
	["minimal", "minimal"],
	["low", "low"],
	["medium", "medium"],
	["high", "high"],
	["xhigh", "xhigh"],
	["max", "max"]
];
function readStringArray(value) {
	return Array.isArray(value) ? value.map(normalizeOptionalString).filter((entry) => Boolean(entry)) : [];
}
function normalizeClawRouterReasoningEfforts(value) {
	if (!Array.isArray(value) || value.length > CLAWROUTER_REASONING_EFFORT_LEVELS.length) return;
	const advertised = new Set(value);
	const efforts = CLAWROUTER_REASONING_EFFORT_LEVELS.filter(([effort]) => advertised.has(effort)).map(([effort]) => effort);
	return efforts.length > 0 ? efforts : void 0;
}
function readCatalogRows(body) {
	const providers = asOptionalRecord(body)?.providers;
	if (!Array.isArray(providers)) throw new Error("ClawRouter catalog response must contain providers[]");
	return providers;
}
function parseCatalogRoute(value) {
	const row = asOptionalRecord(value);
	const path = normalizeOptionalString(row?.path);
	const requestFormat = normalizeOptionalString(row?.requestFormat);
	if (!path || !requestFormat) return;
	return {
		path,
		requestFormat,
		methods: readStringArray(row?.methods).map((method) => method.toUpperCase())
	};
}
function parseCatalogPricing(value) {
	const row = asOptionalRecord(value);
	if (!row) return;
	return {
		inputMicrosPerMillion: asFiniteNumberInRange(row.inputMicrosPerMillion, { min: 0 }),
		outputMicrosPerMillion: asFiniteNumberInRange(row.outputMicrosPerMillion, { min: 0 }),
		cachedInputMicrosPerMillion: asFiniteNumberInRange(row.cachedInputMicrosPerMillion, { min: 0 }),
		cacheWrite5mInputMicrosPerMillion: asFiniteNumberInRange(row.cacheWrite5mInputMicrosPerMillion, { min: 0 }),
		cacheWrite1hInputMicrosPerMillion: asFiniteNumberInRange(row.cacheWrite1hInputMicrosPerMillion, { min: 0 }),
		maxInputTokens: asPositiveSafeInteger(row.maxInputTokens),
		defaultMaxOutputTokens: asPositiveSafeInteger(row.defaultMaxOutputTokens)
	};
}
function parseCatalogModel(value) {
	const row = asOptionalRecord(value);
	const id = normalizeOptionalString(row?.id);
	const upstream = normalizeOptionalString(row?.upstream);
	if (!id || !upstream) return;
	return {
		id,
		displayName: normalizeOptionalString(row?.displayName),
		upstream,
		capabilities: readStringArray(row?.capabilities),
		supportedReasoningEfforts: normalizeClawRouterReasoningEfforts(row?.supportedReasoningEfforts),
		pricing: parseCatalogPricing(row?.pricing)
	};
}
function parseCatalogProvider(value) {
	const row = asOptionalRecord(value);
	const id = normalizeOptionalString(row?.id);
	const nativeBaseUrl = normalizeOptionalString(row?.nativeBaseUrl);
	if (!id || !nativeBaseUrl || !nativeBaseUrl.startsWith("/v1/native/")) return;
	return {
		id,
		displayName: normalizeOptionalString(row?.displayName) ?? id,
		openaiCompatible: row?.openaiCompatible === true,
		nativeBaseUrl,
		routes: Array.isArray(row?.routes) ? row.routes.map(parseCatalogRoute).filter((route) => Boolean(route)) : [],
		models: Array.isArray(row?.models) ? row.models.map(parseCatalogModel).filter((model) => Boolean(model)) : []
	};
}
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function normalizeClawRouterRootUrl(baseUrl) {
	const normalized = trimTrailingSlashes(baseUrl?.trim() || CLAWROUTER_DEFAULT_BASE_URL);
	return normalized.endsWith("/v1") ? normalized.slice(0, -3) : normalized;
}
function normalizeClawRouterApiBaseUrl(baseUrl) {
	return `${normalizeClawRouterRootUrl(baseUrl)}/v1`;
}
function supportsCapability(model, ...capabilities) {
	return capabilities.some((capability) => model.capabilities.includes(capability));
}
function findNativeRoute(provider, requestFormat) {
	return provider.routes.find((route) => route.methods.includes("POST") && route.requestFormat === requestFormat);
}
function googleNativeBaseUrl(rootUrl, provider, route) {
	const modelPathIndex = route.path.indexOf("/models/${model}");
	if (modelPathIndex <= 0) return;
	return `${rootUrl}${provider.nativeBaseUrl}${route.path.slice(0, modelPathIndex)}`;
}
function inferReasoning(providerId, modelId) {
	const id = `${providerId}/${modelId}`.toLowerCase();
	return /(?:claude-|gemini-|gpt-5|gpt-oss|deepseek-v|reasoner|glm-5|grok-4|minimax-m)/u.test(id);
}
function inferInput(providerId, modelId) {
	const id = `${providerId}/${modelId}`.toLowerCase();
	return /(?:claude-|gemini-|gpt-4o|gpt-5)/u.test(id) ? ["text", "image"] : ["text"];
}
function microsPerMillionToCost(value) {
	return value === void 0 ? 0 : value / 1e6;
}
function modelCost(pricing) {
	if (!pricing) return DEFAULT_COST;
	return {
		input: microsPerMillionToCost(pricing.inputMicrosPerMillion),
		output: microsPerMillionToCost(pricing.outputMicrosPerMillion),
		cacheRead: microsPerMillionToCost(pricing.cachedInputMicrosPerMillion),
		cacheWrite: microsPerMillionToCost(pricing.cacheWrite5mInputMicrosPerMillion ?? pricing.cacheWrite1hInputMicrosPerMillion)
	};
}
function buildThinkingLevelMap(efforts) {
	const supported = new Set(efforts);
	const levelMap = {};
	for (const [effort, level] of CLAWROUTER_REASONING_EFFORT_LEVELS) levelMap[level] = supported.has(effort) ? effort : null;
	return levelMap;
}
function buildRoutedModel(rootUrl, provider, model) {
	let api;
	let baseUrl;
	let upstreamModel;
	if (provider.openaiCompatible && supportsCapability(model, "llm.responses")) {
		api = "openai-responses";
		baseUrl = `${rootUrl}/v1`;
	} else if (provider.openaiCompatible && supportsCapability(model, "llm.chat")) {
		api = "openai-completions";
		baseUrl = `${rootUrl}/v1`;
	} else if (supportsCapability(model, "llm.messages") && findNativeRoute(provider, "anthropic.messages")) {
		api = "anthropic-messages";
		baseUrl = `${rootUrl}${provider.nativeBaseUrl}`;
		upstreamModel = model.upstream;
	} else {
		const googleRoute = supportsCapability(model, "llm.stream") && provider.routes.find((route) => route.methods.includes("POST") && route.requestFormat === "google.generate_content" && route.path.includes(":streamGenerateContent"));
		const googleBaseUrl = googleRoute ? googleNativeBaseUrl(rootUrl, provider, googleRoute) : void 0;
		if (!googleBaseUrl) return;
		api = "google-generative-ai";
		baseUrl = googleBaseUrl;
		upstreamModel = model.upstream;
	}
	const providerPrefix = `${provider.id}/`;
	const modelLabel = model.id.startsWith(providerPrefix) ? model.id.slice(providerPrefix.length) : model.id;
	return {
		id: model.id,
		name: model.displayName ?? `${provider.displayName} · ${modelLabel}`,
		api,
		baseUrl,
		reasoning: model.supportedReasoningEfforts !== void 0 || inferReasoning(provider.id, model.id),
		...model.supportedReasoningEfforts ? {
			thinkingLevelMap: buildThinkingLevelMap(model.supportedReasoningEfforts),
			compat: {
				supportsReasoningEffort: true,
				supportedReasoningEfforts: model.supportedReasoningEfforts
			}
		} : {},
		input: inferInput(provider.id, model.id),
		cost: modelCost(model.pricing),
		contextWindow: model.pricing?.maxInputTokens ?? DEFAULT_CONTEXT_WINDOW,
		maxTokens: model.pricing?.defaultMaxOutputTokens ?? DEFAULT_MAX_TOKENS,
		params: { [ROUTE_METADATA_KEY]: {
			api,
			baseUrl,
			...upstreamModel ? { upstreamModel } : {}
		} }
	};
}
function buildDiscoveredModels(rootUrl, providers) {
	const models = /* @__PURE__ */ new Map();
	for (const provider of providers) for (const model of provider.models) {
		const routed = buildRoutedModel(rootUrl, provider, model);
		if (!routed || models.has(routed.id)) continue;
		models.set(routed.id, routed);
	}
	return [...models.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
async function buildClawRouterProviderConfig(params) {
	const rootUrl = normalizeClawRouterRootUrl(params.baseUrl);
	const providers = (await getCachedLiveProviderModelRows({
		providerId: PROVIDER_ID,
		endpoint: `${rootUrl}/v1/catalog`,
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		readRows: readCatalogRows,
		ttlMs: CATALOG_CACHE_TTL_MS,
		shouldCacheRows: (providers) => providers.length > 0,
		auditContext: "clawrouter-model-discovery"
	})).map(parseCatalogProvider).filter((provider) => Boolean(provider));
	return {
		baseUrl: `${rootUrl}/v1`,
		api: "openai-responses",
		apiKey: params.apiKey,
		models: buildDiscoveredModels(rootUrl, providers)
	};
}
function readRouteMetadata(params) {
	const row = asOptionalRecord(params?.[ROUTE_METADATA_KEY]);
	const baseUrl = normalizeOptionalString(row?.baseUrl);
	const api = normalizeOptionalString(row?.api);
	if (!baseUrl || api !== "openai-responses" && api !== "openai-completions" && api !== "anthropic-messages" && api !== "google-generative-ai") return;
	const upstreamModel = normalizeOptionalString(row?.upstreamModel);
	return {
		api,
		baseUrl,
		...upstreamModel ? { upstreamModel } : {}
	};
}
function stripRouteMetadata(params) {
	if (!params || !(ROUTE_METADATA_KEY in params)) return params;
	const { [ROUTE_METADATA_KEY]: _routeMetadata, ...remaining } = params;
	return Object.keys(remaining).length > 0 ? remaining : void 0;
}
function normalizeClawRouterResolvedModel(model) {
	const route = readRouteMetadata(model.params);
	if (!route) return;
	return {
		...model,
		api: route.api,
		baseUrl: route.baseUrl
	};
}
function prepareClawRouterRequestModel(model) {
	const route = readRouteMetadata(model.params);
	if (!route) return model;
	return {
		...model,
		params: stripRouteMetadata(model.params),
		...route.upstreamModel && route.upstreamModel !== model.id ? { id: route.upstreamModel } : {}
	};
}
//#endregion
export { normalizeClawRouterResolvedModel as a, normalizeClawRouterReasoningEfforts as i, buildClawRouterProviderConfig as n, normalizeClawRouterRootUrl as o, normalizeClawRouterApiBaseUrl as r, prepareClawRouterRequestModel as s, CLAWROUTER_REASONING_EFFORT_LEVELS as t };
