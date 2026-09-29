import { _ as readLiveModelCatalogPositiveSafeIntegerField, g as readLiveModelCatalogBooleanField, t as buildLiveModelProviderConfig, v as readLiveModelCatalogStringField } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import { c as buildXaiCatalogModels, d as resolveXaiCatalogEntry, o as XAI_IMAGE_MODELS, s as XAI_UNKNOWN_MODEL_COST, t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
//#region extensions/xai/provider-catalog.ts
const PROVIDER_ID = "xai";
const XAI_MODELS_ENDPOINT = `${XAI_BASE_URL}/models`;
const XAI_GROK_OAUTH_BASE_URL = "https://cli-chat-proxy.grok.com/v1";
const XAI_GROK_OAUTH_MODELS_ENDPOINT = `${XAI_GROK_OAUTH_BASE_URL}/models`;
const XAI_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["grok-composer-2.5-fast"]);
function isXaiGrokProxyBaseUrl(baseUrl) {
	if (!baseUrl) return false;
	try {
		return new URL(baseUrl).href.replace(/\/+$/u, "") === XAI_GROK_OAUTH_BASE_URL;
	} catch {
		return false;
	}
}
function buildXaiProvider(api = "openai-responses", authMode) {
	return {
		baseUrl: authMode ? XAI_GROK_OAUTH_BASE_URL : XAI_BASE_URL,
		api: authMode ? "openai-responses" : api,
		...authMode ? { auth: authMode } : {},
		models: buildXaiCatalogModels()
	};
}
async function buildLiveXaiProvider(params) {
	return await buildLiveModelProviderConfig({
		discoveryMode: "strict",
		providerId: PROVIDER_ID,
		endpoint: XAI_MODELS_ENDPOINT,
		providerConfig: {
			baseUrl: XAI_BASE_URL,
			api: "openai-responses"
		},
		models: buildXaiCatalogModels(),
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		ttlMs: XAI_MODELS_CACHE_TTL_MS,
		auditContext: "xai-model-discovery"
	});
}
function resolveXaiOauthMetadataFallback(modelId) {
	if (modelId === "grok-build") return resolveXaiCatalogEntry("grok-build-0.1");
	return resolveXaiCatalogEntry(modelId);
}
function isXaiOAuthResponsesModel(row, fallback) {
	const modelId = readLiveModelCatalogStringField(row, "id") ?? readLiveModelCatalogStringField(row, "model");
	if (modelId && XAI_IMAGE_MODELS.includes(modelId)) return false;
	const backend = readLiveModelCatalogStringField(row, "api_backend") ?? readLiveModelCatalogStringField(row, "apiBackend") ?? readLiveModelCatalogStringField(row, "backend");
	if (backend) {
		const normalizedBackend = backend.toLowerCase();
		return normalizedBackend === "responses" || normalizedBackend === "chat" || normalizedBackend === "language";
	}
	return Boolean(fallback);
}
function buildXaiOauthModelFromLiveRow(row) {
	const modelId = readLiveModelCatalogStringField(row, "id") ?? readLiveModelCatalogStringField(row, "model");
	if (!modelId) return;
	const fallback = resolveXaiOauthMetadataFallback(modelId);
	if (!isXaiOAuthResponsesModel(row, fallback)) return;
	const contextWindow = readLiveModelCatalogPositiveSafeIntegerField(row, ["context_window", "contextWindow"]) ?? fallback?.contextWindow ?? 1e6;
	const maxTokens = readLiveModelCatalogPositiveSafeIntegerField(row, ["max_completion_tokens", "maxCompletionTokens"]) ?? fallback?.maxTokens ?? 64e3;
	const reasoning = (readLiveModelCatalogBooleanField(row, "supports_reasoning_effort") ?? readLiveModelCatalogBooleanField(row, "supportsReasoningEffort")) === true || fallback?.reasoning === true || XAI_GROK_OAUTH_REASONING_MODEL_IDS.has(modelId);
	return {
		id: modelId,
		name: readLiveModelCatalogStringField(row, "name") ?? fallback?.name ?? modelId,
		api: "openai-responses",
		baseUrl: XAI_GROK_OAUTH_BASE_URL,
		reasoning,
		input: fallback?.input ?? ["text"],
		cost: fallback?.cost ?? XAI_UNKNOWN_MODEL_COST,
		contextWindow,
		maxTokens,
		...fallback?.compat ? { compat: fallback.compat } : {},
		...fallback?.thinkingLevelMap ? { thinkingLevelMap: fallback.thinkingLevelMap } : {}
	};
}
async function buildLiveXaiOAuthProvider(params) {
	const { models, ...providerConfig } = buildXaiProvider("openai-responses", params.authMode ?? "oauth");
	return await buildLiveModelProviderConfig({
		discoveryMode: "strict",
		providerId: PROVIDER_ID,
		endpoint: XAI_GROK_OAUTH_MODELS_ENDPOINT,
		providerConfig,
		models,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		ttlMs: XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS,
		auditContext: "xai-grok-oauth-model-discovery",
		cacheKeyParts: [
			PROVIDER_ID,
			"grok-oauth-model-rows",
			XAI_GROK_OAUTH_MODELS_ENDPOINT,
			params.discoveryApiKey
		],
		projectRows: (rows) => rows.map(buildXaiOauthModelFromLiveRow).filter((model) => Boolean(model))
	});
}
//#endregion
export { isXaiGrokProxyBaseUrl as i, buildLiveXaiProvider as n, buildXaiProvider as r, buildLiveXaiOAuthProvider as t };
