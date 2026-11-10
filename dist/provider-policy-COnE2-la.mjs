import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeGooglePreviewModelId, t as normalizeAntigravityPreviewModelId } from "./provider-model-id-normalize-DjenOxD2.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as isGoogleGemini3ProModel, r as isGoogleGemini3ThinkingLevelModel } from "./provider-thinking-runtime-DlkIARoV.mjs";
import "./model-id-B1FKGbAg.mjs";
import { n as isGoogleGenerativeAiApi, o as normalizeGoogleApiBaseUrl, r as isGoogleVertexBaseUrl, s as normalizeGoogleGenerativeAiBaseUrl } from "./google-api-base-url-BSKc6KBi.mjs";
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
export { shouldNormalizeGoogleGenerativeAiProviderConfig as a, resolveGoogleThinkingProfile as i, resolveGoogleGenerativeAiApiOrigin as n, shouldNormalizeGoogleProviderConfig as o, resolveGoogleGenerativeAiTransport as r, normalizeGoogleProviderConfig as t };
