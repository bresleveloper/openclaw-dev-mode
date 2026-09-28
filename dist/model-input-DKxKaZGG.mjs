import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { n as normalizeGooglePreviewModelId, r as normalizeTogetherModelId } from "./provider-model-id-normalize-DODOj1rv.mjs";
//#region src/config/model-input.ts
/** Returns the primary model ref from either string or object-style agent model config. */
function resolveAgentModelPrimaryValue(model) {
	return resolvePrimaryStringValue(model);
}
/** Returns configured fallback model refs, preserving their configured order. */
function resolveAgentModelFallbackValues(model) {
	if (!model || typeof model !== "object") return [];
	return Array.isArray(model.fallbacks) ? model.fallbacks : [];
}
/** Returns a positive finite tool timeout rounded down to whole milliseconds. */
function resolveAgentModelTimeoutMsValue(model) {
	if (!model || typeof model !== "object") return;
	return typeof model.timeoutMs === "number" && Number.isFinite(model.timeoutMs) && model.timeoutMs > 0 ? Math.floor(model.timeoutMs) : void 0;
}
/** Converts legacy string model config into the object shape used by model patch helpers. */
function toAgentModelListLike(model) {
	if (typeof model === "string") {
		const primary = normalizeOptionalString(model);
		return primary ? { primary } : void 0;
	}
	if (!model || typeof model !== "object") return;
	return model;
}
const GOOGLE_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"google",
	"google-gemini-cli",
	"google-vertex"
]);
/** Applies existing Google/Together model fixes while preserving literal catalog namespaces. */
function normalizeProviderCatalogModelIdForConfig(provider, model) {
	if (GOOGLE_PROVIDER_IDS.has(provider) || model.startsWith("google/")) return normalizeGooglePreviewModelId(model);
	return provider === "together" ? normalizeTogetherModelId(model) : model;
}
/** Canonicalizes provider/model refs before they are persisted to config. */
function normalizeAgentModelRefForConfig(model) {
	const trimmed = model.trim();
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return trimmed;
	const { provider, modelId: modelSuffix } = parsed;
	return `${provider}/${normalizeProviderCatalogModelIdForConfig(provider, modelSuffix)}`;
}
/** Normalizes primary/fallback refs without replacing unchanged config values. */
function normalizeAgentModelSelectionForConfig(value) {
	if (typeof value === "string") return normalizeAgentModelRefForConfig(value);
	if (!isRecord(value)) return value;
	let next = value;
	const assign = (key, candidate) => {
		if (candidate !== next[key]) next = {
			...next,
			[key]: candidate
		};
	};
	if (typeof value.primary === "string") assign("primary", normalizeAgentModelRefForConfig(value.primary));
	if (Array.isArray(value.fallbacks)) {
		const originalFallbacks = value.fallbacks;
		const fallbacks = originalFallbacks.map((fallback) => typeof fallback === "string" ? normalizeAgentModelRefForConfig(fallback) : fallback);
		if (fallbacks.some((fallback, index) => fallback !== originalFallbacks[index])) assign("fallbacks", fallbacks);
	}
	return next;
}
function mergeAgentModelEntryForConfig(existing, incoming) {
	if (!isRecord(existing) || !isRecord(incoming)) return incoming;
	const existingParams = isRecord(existing.params) ? existing.params : void 0;
	const incomingParams = isRecord(incoming.params) ? incoming.params : void 0;
	return {
		...existing,
		...incoming,
		...existingParams || incomingParams ? { params: {
			...existingParams,
			...incomingParams
		} } : void 0
	};
}
/** Normalizes model map keys and merges entries that collapse to the same canonical ref. */
function normalizeAgentModelMapForConfig(models) {
	let mutated = false;
	const next = {};
	for (const [key, entry] of Object.entries(models)) {
		const normalizedKey = normalizeAgentModelRefForConfig(key);
		if (normalizedKey !== key || Object.hasOwn(next, normalizedKey)) mutated = true;
		next[normalizedKey] = mergeAgentModelEntryForConfig(next[normalizedKey], entry);
	}
	return mutated ? next : models;
}
//#endregion
export { normalizeProviderCatalogModelIdForConfig as a, resolveAgentModelTimeoutMsValue as c, normalizeAgentModelSelectionForConfig as i, toAgentModelListLike as l, normalizeAgentModelMapForConfig as n, resolveAgentModelFallbackValues as o, normalizeAgentModelRefForConfig as r, resolveAgentModelPrimaryValue as s, mergeAgentModelEntryForConfig as t };
