//#region packages/ai/src/utils/sanitize-unicode.ts
/** Remove unpaired surrogates rejected by providers; preserve valid Unicode pairs. */
function sanitizeSurrogates(text) {
	if (text.isWellFormed()) return text;
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}
//#endregion
export { sanitizeSurrogates as t };
