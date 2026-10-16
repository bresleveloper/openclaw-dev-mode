//#region packages/normalization-core/src/code-points.ts
/** Truncates to a nonnegative code-point budget; grapheme clusters may be split. */
function truncateCodePoints(text, maxCodePoints) {
	const limit = Math.max(0, Math.trunc(maxCodePoints) || 0);
	if (text.length <= limit) return text;
	const prefix = [];
	for (const codePoint of text) {
		if (prefix.length >= limit) break;
		prefix.push(codePoint);
	}
	return prefix.join("");
}
//#endregion
export { truncateCodePoints as t };
