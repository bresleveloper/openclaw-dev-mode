import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { n as applyAgentDefaultModelPrimary } from "./provider-onboard-CF3Sw4qH.mjs";
//#region extensions/google/onboard.ts
const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
const RETIRED_GOOGLE_GEMINI_MODEL_REFS = /* @__PURE__ */ new Set([
	"gemini-3-pro",
	"gemini-3-pro-preview",
	"google/gemini-3-pro",
	"google/gemini-3-pro-preview"
]);
function isRetiredGeminiModelRef(value) {
	if (typeof value !== "string") return false;
	const modelRef = value.trim();
	if (RETIRED_GOOGLE_GEMINI_MODEL_REFS.has(modelRef)) return true;
	return modelRef.endsWith("/gemini-3-pro") || modelRef.endsWith("/gemini-3-pro-preview");
}
function hasRetiredGeminiDefaultModelRefs(cfg) {
	const defaults = cfg.agents?.defaults;
	if (resolveAgentModelFallbackValues(defaults?.model).some(isRetiredGeminiModelRef)) return true;
	const models = defaults?.models;
	if (models && typeof models === "object" && Object.keys(models).some((modelRef) => isRetiredGeminiModelRef(modelRef))) return true;
	const providerConfigs = cfg.models?.providers;
	if (!providerConfigs) return false;
	return Object.values(providerConfigs).some((providerConfig) => Array.isArray(providerConfig.models) ? providerConfig.models.some((providerModel) => isRetiredGeminiModelRef(providerModel.id)) : false);
}
function applyGoogleGeminiModelDefault(cfg) {
	if (resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) === "google/gemini-3.1-pro-preview" && !hasRetiredGeminiDefaultModelRefs(cfg)) return {
		next: cfg,
		changed: false
	};
	return {
		next: applyAgentDefaultModelPrimary(cfg, GOOGLE_GEMINI_DEFAULT_MODEL),
		changed: true
	};
}
//#endregion
export { applyGoogleGeminiModelDefault as n, GOOGLE_GEMINI_DEFAULT_MODEL as t };
