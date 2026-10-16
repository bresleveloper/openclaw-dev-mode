//#region packages/model-catalog-core/src/provider-model-id-normalize.ts
const ANTIGRAVITY_BARE_PRO_IDS = /* @__PURE__ */ new Set([
	"gemini-3-pro",
	"gemini-3.1-pro",
	"gemini-3-1-pro"
]);
const GOOGLE_PROVIDER_PREFIX = "google/";
const GOOGLE_MODEL_ALIASES = /* @__PURE__ */ new Map([
	["gemini-3-pro", "gemini-3.1-pro-preview"],
	["gemini-3-pro-preview", "gemini-3.1-pro-preview"],
	["gemini-3-flash", "gemini-3-flash-preview"],
	["gemini-3.1-pro", "gemini-3.1-pro-preview"],
	["gemini-3.1-flash-lite-preview", "gemini-3.1-flash-lite"],
	["gemini-3.1-flash", "gemini-3-flash-preview"],
	["gemini-3.1-flash-preview", "gemini-3-flash-preview"],
	["gemma-4-26b", "gemma-4-26b-a4b-it"]
]);
function normalizeGooglePreviewModelId(id) {
	if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
		const modelId = id.slice(7);
		const normalizedModelId = normalizeGooglePreviewModelId(modelId);
		return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
	}
	return GOOGLE_MODEL_ALIASES.get(id) ?? id;
}
function normalizeTogetherModelId(id) {
	return id === "moonshotai/Kimi-K2.5" ? "moonshotai/Kimi-K2.6" : id;
}
function normalizeAntigravityPreviewModelId(id) {
	if (ANTIGRAVITY_BARE_PRO_IDS.has(id)) return `${id}-low`;
	return id;
}
//#endregion
export { normalizeGooglePreviewModelId as n, normalizeTogetherModelId as r, normalizeAntigravityPreviewModelId as t };
