import { ARCEE_BASE_URL, ARCEE_MODEL_CATALOG, buildArceeModelDefinition } from "./models.js";
//#region extensions/arcee/provider-catalog.ts
/** Canonical OpenRouter API base URL for Arcee-routed models. */
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_LEGACY_BASE_URL = "https://openrouter.ai/v1";
const ARCEE_OPENROUTER_MODEL_IDS = /* @__PURE__ */ new Set(["trinity-large-preview", "trinity-large-thinking"]);
function normalizeBaseUrl(baseUrl) {
	return (baseUrl ?? "").trim().replace(/\/+$/, "");
}
/** Normalize OpenRouter base URLs accepted for Arcee model routing. */
function normalizeArceeOpenRouterBaseUrl(baseUrl) {
	const normalized = normalizeBaseUrl(baseUrl);
	if (!normalized) return;
	if (normalized === "https://openrouter.ai/api/v1" || normalized === OPENROUTER_LEGACY_BASE_URL) return OPENROUTER_BASE_URL;
}
/** Convert a bare or legacy Arcee model id to OpenRouter's `arcee-ai/*` id. */
function toArceeOpenRouterModelId(modelId) {
	const normalized = modelId.trim();
	if (!normalized || normalized.startsWith("arcee-ai/")) return normalized;
	return `arcee-ai/${normalized.startsWith("arcee/") ? normalized.slice(6) : normalized}`;
}
/** Build direct Arcee catalog models. */
function buildArceeCatalogModels() {
	return ARCEE_MODEL_CATALOG.map(buildArceeModelDefinition);
}
/** Build OpenRouter-routed Arcee catalog models. */
function buildArceeOpenRouterCatalogModels() {
	return buildArceeCatalogModels().filter((model) => ARCEE_OPENROUTER_MODEL_IDS.has(model.id)).map((model) => Object.assign({}, model, { id: toArceeOpenRouterModelId(model.id) }));
}
/** Build the direct Arcee provider config. */
function buildArceeProvider() {
	return {
		baseUrl: ARCEE_BASE_URL,
		api: "openai-completions",
		models: buildArceeCatalogModels()
	};
}
/** Build the OpenRouter-backed Arcee provider config. */
function buildArceeOpenRouterProvider() {
	return {
		baseUrl: OPENROUTER_BASE_URL,
		api: "openai-completions",
		models: buildArceeOpenRouterCatalogModels()
	};
}
//#endregion
export { OPENROUTER_BASE_URL, buildArceeCatalogModels, buildArceeOpenRouterCatalogModels, buildArceeOpenRouterProvider, buildArceeProvider, normalizeArceeOpenRouterBaseUrl, toArceeOpenRouterModelId };
