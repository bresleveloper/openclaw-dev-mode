import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { m as isGoogleGemini3ThinkingLevelModel, p as isGoogleGemini3ProModel } from "./provider-stream-shared-CDfVnM8B.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as normalizeGoogleModelId, t as normalizeAntigravityModelId } from "./model-id-BCw7D6_O.js";
import "./thinking-api-ChY9wdi1.js";
//#region extensions/google/provider-policy.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GOOGLE_MODEL_ID_PROVIDERS = new Set([
	"google",
	"google-gemini-cli",
	"google-vertex"
]);
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function isCanonicalGoogleApiOriginShorthand(value) {
	return /^https:\/\/generativelanguage\.googleapis\.com\/?$/i.test(value);
}
function isGoogleGenerativeAiUrl(url) {
	return url.protocol === "https:" && url.hostname.toLowerCase() === "generativelanguage.googleapis.com";
}
function stripUrlUserInfo(url) {
	url.username = "";
	url.password = "";
}
const GOOGLE_VERTEX_HOST = "aiplatform.googleapis.com";
const GOOGLE_VERTEX_REGION_HOST_SUFFIX = "-aiplatform.googleapis.com";
const GOOGLE_VERTEX_MULTI_REGION_HOSTS = new Set(["aiplatform.eu.rep.googleapis.com", "aiplatform.us.rep.googleapis.com"]);
function isGoogleVertexHostname(hostname) {
	const normalized = hostname.toLowerCase();
	return normalized === GOOGLE_VERTEX_HOST || normalized.endsWith(GOOGLE_VERTEX_REGION_HOST_SUFFIX) || GOOGLE_VERTEX_MULTI_REGION_HOSTS.has(normalized);
}
function isGoogleVertexBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl);
	if (!raw) return false;
	try {
		return isGoogleVertexHostname(new URL(raw).hostname);
	} catch {
		return false;
	}
}
function normalizeGoogleApiBaseUrl(baseUrl) {
	const raw = trimTrailingSlashes(normalizeOptionalString(baseUrl) || "https://generativelanguage.googleapis.com/v1beta");
	try {
		const url = new URL(raw);
		url.hash = "";
		url.search = "";
		stripUrlUserInfo(url);
		if (isGoogleGenerativeAiUrl(url)) url.pathname = trimTrailingSlashes(url.pathname || "") || "/v1beta";
		return trimTrailingSlashes(url.toString());
	} catch {
		if (isCanonicalGoogleApiOriginShorthand(raw)) return DEFAULT_GOOGLE_API_BASE_URL;
		return raw;
	}
}
function isGoogleGenerativeAiApi(api) {
	return api === "google-generative-ai";
}
function normalizeGoogleGenerativeAiBaseUrl(baseUrl) {
	if (!baseUrl) return baseUrl;
	const normalized = normalizeGoogleApiBaseUrl(baseUrl);
	try {
		const url = new URL(normalized);
		stripUrlUserInfo(url);
		if (isGoogleGenerativeAiUrl(url)) {
			url.pathname = trimTrailingSlashes(url.pathname || "").replace(/\/openai$/i, "") || "/v1beta";
			return trimTrailingSlashes(url.toString());
		}
	} catch {}
	return normalized;
}
function resolveGoogleGenerativeAiTransport(params) {
	const api = params.api ?? (params.provider === "google-vertex" && isGoogleVertexBaseUrl(params.baseUrl) ? "google-vertex" : void 0) ?? (params.provider === "google" && params.baseUrl ? "google-generative-ai" : params.api);
	return {
		api,
		baseUrl: isGoogleGenerativeAiApi(api) ? normalizeGoogleGenerativeAiBaseUrl(params.baseUrl) : params.baseUrl
	};
}
function resolveGoogleGenerativeAiApiOrigin(baseUrl) {
	return (normalizeGoogleGenerativeAiBaseUrl(baseUrl) ?? normalizeGoogleApiBaseUrl(baseUrl)).replace(/\/v1beta$/i, "");
}
function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider) {
	if (providerKey === "google-vertex" && isGoogleVertexBaseUrl(provider.baseUrl)) return false;
	if (isGoogleGenerativeAiApi(provider.api)) return true;
	if (provider.models?.some((model) => isGoogleGenerativeAiApi(model?.api)) ?? false) return true;
	if (providerKey !== "google" && providerKey !== "google-vertex") return false;
	return !(normalizeOptionalString(provider.api) !== void 0);
}
function shouldNormalizeGoogleProviderConfig(providerKey, provider) {
	return providerKey === "google-antigravity" || shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider);
}
function normalizeProviderModels(provider, normalizeId) {
	const models = provider.models;
	if (!Array.isArray(models) || models.length === 0) return provider;
	let mutated = false;
	const nextModels = models.map((model) => {
		const nextId = normalizeId(model.id);
		if (nextId === model.id) return model;
		mutated = true;
		return Object.assign({}, model, { id: nextId });
	});
	return mutated ? {
		...provider,
		models: nextModels
	} : provider;
}
function normalizeGoogleProviderConfig(providerKey, provider) {
	let nextProvider = provider;
	if (GOOGLE_MODEL_ID_PROVIDERS.has(providerKey)) {
		const modelNormalized = normalizeProviderModels(nextProvider, normalizeGoogleModelId);
		if (shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, modelNormalized)) {
			const normalizedBaseUrl = normalizeGoogleGenerativeAiBaseUrl(modelNormalized.baseUrl);
			nextProvider = normalizedBaseUrl !== modelNormalized.baseUrl ? {
				...modelNormalized,
				baseUrl: normalizedBaseUrl ?? modelNormalized.baseUrl
			} : modelNormalized;
		} else nextProvider = modelNormalized;
	}
	if (providerKey === "google-antigravity") nextProvider = normalizeProviderModels(nextProvider, normalizeAntigravityModelId);
	return nextProvider;
}
function resolveGoogleThinkingProfile({ modelId, reasoning }) {
	const normalizedModelId = normalizeGoogleModelId(modelId);
	const isGemini3ThinkingModel = isGoogleGemini3ThinkingLevelModel(normalizedModelId);
	if (reasoning === false && !isGemini3ThinkingModel) return;
	return {
		levels: isGoogleGemini3ProModel(normalizedModelId) ? [
			{ id: "off" },
			{ id: "low" },
			{ id: "adaptive" },
			{ id: "high" }
		] : [
			{ id: "off" },
			{ id: "minimal" },
			{ id: "low" },
			{ id: "medium" },
			{ id: "adaptive" },
			{ id: "high" }
		],
		...isGemini3ThinkingModel ? { preserveWhenCatalogReasoningFalse: true } : {}
	};
}
//#endregion
export { normalizeGoogleApiBaseUrl as a, resolveGoogleGenerativeAiApiOrigin as c, shouldNormalizeGoogleGenerativeAiProviderConfig as d, shouldNormalizeGoogleProviderConfig as f, isGoogleVertexHostname as i, resolveGoogleGenerativeAiTransport as l, isGoogleGenerativeAiApi as n, normalizeGoogleGenerativeAiBaseUrl as o, isGoogleVertexBaseUrl as r, normalizeGoogleProviderConfig as s, DEFAULT_GOOGLE_API_BASE_URL as t, resolveGoogleThinkingProfile as u };
