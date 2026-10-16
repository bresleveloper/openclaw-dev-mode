import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeGooglePreviewModelId, t as normalizeAntigravityPreviewModelId } from "./provider-model-id-normalize-Bx8UgVVS.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as isGoogleGemini3ProModel, r as isGoogleGemini3ThinkingLevelModel } from "./provider-thinking-runtime-BNgUzSXa.mjs";
import "./model-id-CPDOOOMu.mjs";
//#region extensions/google/src/google-api-base-url.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function isGoogleGenerativeAiUrl(url) {
	return url.protocol === "https:" && url.hostname.toLowerCase() === "generativelanguage.googleapis.com";
}
/** Exact official AI Studio request root eligible for native provider behavior. */
function isOfficialGoogleAiStudioBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl) ?? "https://generativelanguage.googleapis.com/v1beta";
	const url = URL.parse(raw);
	const href = url ? trimTrailingSlashes(url.href) : void 0;
	return href === "https://generativelanguage.googleapis.com" || href === "https://generativelanguage.googleapis.com/v1beta";
}
const GOOGLE_VERTEX_HOST = "aiplatform.googleapis.com";
const GOOGLE_VERTEX_REGION_HOST_SUFFIX = "-aiplatform.googleapis.com";
const GOOGLE_VERTEX_MULTI_REGION_HOSTS = /* @__PURE__ */ new Set(["aiplatform.eu.rep.googleapis.com", "aiplatform.us.rep.googleapis.com"]);
function isGoogleVertexHostname(hostname) {
	const normalized = hostname.toLowerCase();
	return normalized === GOOGLE_VERTEX_HOST || normalized.endsWith(GOOGLE_VERTEX_REGION_HOST_SUFFIX) || GOOGLE_VERTEX_MULTI_REGION_HOSTS.has(normalized);
}
function isGoogleVertexBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl);
	if (!raw) return false;
	const url = URL.parse(raw);
	return url !== null && isGoogleVertexHostname(url.hostname);
}
function normalizeGoogleApiBaseUrl(baseUrl) {
	const raw = trimTrailingSlashes(normalizeOptionalString(baseUrl) || "https://generativelanguage.googleapis.com/v1beta");
	const url = URL.parse(raw);
	if (!url) return raw;
	url.hash = "";
	url.search = "";
	url.username = "";
	url.password = "";
	if (isGoogleGenerativeAiUrl(url)) url.pathname = trimTrailingSlashes(url.pathname || "") || "/v1beta";
	return trimTrailingSlashes(url.toString());
}
function isGoogleGenerativeAiApi(api) {
	return api === "google-generative-ai";
}
function normalizeGoogleGenerativeAiBaseUrl(baseUrl) {
	const raw = normalizeOptionalString(baseUrl);
	if (!raw) return;
	const normalized = normalizeGoogleApiBaseUrl(raw);
	const url = URL.parse(normalized);
	if (url) {
		if (isGoogleGenerativeAiUrl(url)) {
			url.pathname = trimTrailingSlashes(url.pathname || "").replace(/\/openai$/i, "") || "/v1beta";
			return trimTrailingSlashes(url.toString());
		}
	}
	return normalized;
}
//#endregion
//#region extensions/google/provider-policy.ts
const GOOGLE_MODEL_ID_PROVIDERS = /* @__PURE__ */ new Set([
	"google",
	"google-gemini-cli",
	"google-vertex"
]);
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
	if (providerKey === "google-antigravity") return normalizeProviderModels(provider, normalizeAntigravityPreviewModelId);
	if (!GOOGLE_MODEL_ID_PROVIDERS.has(providerKey)) return provider;
	const normalized = normalizeProviderModels(provider, normalizeGooglePreviewModelId);
	if (!shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, normalized)) return normalized;
	const baseUrl = normalizeGoogleGenerativeAiBaseUrl(normalized.baseUrl);
	return baseUrl !== normalized.baseUrl ? {
		...normalized,
		baseUrl: baseUrl ?? normalized.baseUrl
	} : normalized;
}
function resolveGoogleThinkingProfile({ modelId, reasoning }) {
	const normalizedModelId = normalizeGooglePreviewModelId(modelId);
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
export { shouldNormalizeGoogleGenerativeAiProviderConfig as a, isGoogleGenerativeAiApi as c, isOfficialGoogleAiStudioBaseUrl as d, normalizeGoogleApiBaseUrl as f, resolveGoogleThinkingProfile as i, isGoogleVertexBaseUrl as l, resolveGoogleGenerativeAiApiOrigin as n, shouldNormalizeGoogleProviderConfig as o, normalizeGoogleGenerativeAiBaseUrl as p, resolveGoogleGenerativeAiTransport as r, DEFAULT_GOOGLE_API_BASE_URL as s, normalizeGoogleProviderConfig as t, isGoogleVertexHostname as u };
