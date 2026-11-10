import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/config/sessions/model-override-provenance.ts
/** Detects model overrides created by automatic fallback provenance. */
function hasSessionAutoModelFallbackProvenance(entry) {
	const hasActiveOverride = Boolean(normalizeOptionalString(entry?.providerOverride) || normalizeOptionalString(entry?.modelOverride));
	return Boolean(hasActiveOverride && normalizeOptionalString(entry?.modelOverrideFallbackOriginProvider) && normalizeOptionalString(entry?.modelOverrideFallbackOriginModel));
}
/** Detects a model selection explicitly pinned by the user. */
function hasUserPinnedModelSelection(entry) {
	if (!entry?.modelOverride) return false;
	if (entry.modelOverrideSource === "user") return true;
	if (entry.modelOverrideSource !== void 0) return false;
	return !hasSessionAutoModelFallbackProvenance(entry);
}
/** Resolves override source while normalizing entries written before source tracking. */
function resolveSessionModelOverrideSource(entry) {
	if (entry?.modelOverrideSource === "default") return null;
	if (!normalizeOptionalString(entry?.modelOverride)) return null;
	if (entry?.modelOverrideSource === "user" || entry?.modelOverrideSource === "auto") return entry.modelOverrideSource;
	return hasUserPinnedModelSelection(entry) ? "user" : "auto";
}
/** Retains automatic execution selections only when their stored origin is complete. */
function hasSessionAutoModelSelection(entry) {
	return resolveSessionModelOverrideSource(entry) === "auto" && hasSessionAutoModelFallbackProvenance(entry);
}
/** Resolves persisted route provenance, including fallback pins from before the marker existed. */
function resolveSessionModelOverrideRouteResolution(entry) {
	return entry?.modelOverrideRouteResolution ?? (hasSessionAutoModelFallbackProvenance(entry) ? "resolved" : "raw");
}
/** Detects an active automatic fallback rather than a self-origin configured selection. */
function hasSessionActiveAutoModelFallback(entry) {
	if (!entry) return false;
	if (!hasSessionAutoModelFallbackProvenance(entry) || entry.modelOverrideSource !== void 0 && entry.modelOverrideSource !== "auto") return false;
	const originProvider = normalizeOptionalString(entry.modelOverrideFallbackOriginProvider);
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	const overrideProvider = normalizeOptionalString(entry.providerOverride) ?? originProvider;
	const overrideModel = normalizeOptionalString(entry.modelOverride) ?? originModel;
	return overrideProvider !== originProvider || overrideModel !== originModel;
}
//#endregion
export { resolveSessionModelOverrideRouteResolution as a, hasUserPinnedModelSelection as i, hasSessionAutoModelFallbackProvenance as n, resolveSessionModelOverrideSource as o, hasSessionAutoModelSelection as r, hasSessionActiveAutoModelFallback as t };
