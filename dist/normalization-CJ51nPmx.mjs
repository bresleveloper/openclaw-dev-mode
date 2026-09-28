//#region packages/media-generation-core/src/normalization.ts
/** True when a normalization entry contains any user-visible normalization metadata. */
function hasMediaNormalizationEntry(entry) {
	return Boolean(entry && (entry.requested !== void 0 || entry.applied !== void 0 || entry.derivedFrom !== void 0 || (entry.supportedValues?.length ?? 0) > 0));
}
//#endregion
export { hasMediaNormalizationEntry as t };
