import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
//#region packages/model-catalog-core/src/model-catalog-refs.ts
function parseModelSourceSuffix(modelRef) {
	const sourceSeparator = modelRef.lastIndexOf(":");
	if (sourceSeparator < 0) return;
	const source = modelRef.slice(sourceSeparator + 1);
	if (source === "cloud" || source === "local") return {
		base: modelRef.slice(0, sourceSeparator),
		source
	};
	if (!source.includes("/") && source.endsWith("-cloud")) return {
		base: modelRef.slice(0, -6),
		source: "cloud"
	};
}
/** Recognizes one unambiguous hosted source suffix on a bare or qualified model ref. */
function isCloudModelRef(modelRef) {
	const normalized = modelRef?.trim().toLowerCase();
	if (!normalized) return false;
	const source = parseModelSourceSuffix(normalized);
	return source?.source === "cloud" && parseModelSourceSuffix(source.base) === void 0;
}
/** Build a provider/model catalog reference. */
function buildModelCatalogRef(provider, modelId) {
	return `${normalizeProviderId(provider)}/${modelId}`;
}
/** Parse a strict provider/model reference without normalizing either segment. */
function parseProviderModelRef(value) {
	const trimmed = value.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) return null;
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	return provider && model ? {
		provider,
		model
	} : null;
}
/** Parse a strict provider/model catalog reference. */
function parseModelCatalogRef(value) {
	const parsed = parseProviderModelRef(value);
	if (!parsed) return null;
	return {
		provider: normalizeProviderId(parsed.provider),
		modelId: parsed.model
	};
}
/** Build a case-insensitive merge key for provider/model rows. */
function buildModelCatalogMergeKey(provider, modelId) {
	return `${normalizeProviderId(provider)}::${normalizeLowercaseStringOrEmpty(modelId)}`;
}
//#endregion
export { parseProviderModelRef as a, parseModelCatalogRef as i, buildModelCatalogRef as n, isCloudModelRef as r, buildModelCatalogMergeKey as t };
