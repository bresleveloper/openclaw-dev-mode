//#region src/agents/utils/html.ts
function decodeCodePoint(codePoint) {
	if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 1114111 || codePoint >= 55296 && codePoint <= 57343) return;
	return String.fromCodePoint(codePoint);
}
/** Decodes a named or numeric HTML entity without the surrounding `&`/`;`. */
function decodeHtmlEntity(entity) {
	switch (entity.toLowerCase()) {
		case "amp": return "&";
		case "lt": return "<";
		case "gt": return ">";
		case "quot": return "\"";
		case "apos": return "'";
	}
	if (entity.startsWith("#x") || entity.startsWith("#X")) {
		const hex = entity.slice(2);
		return /^[0-9a-fA-F]+$/.test(hex) ? decodeCodePoint(Number.parseInt(hex, 16)) : void 0;
	}
	if (entity.startsWith("#")) {
		const dec = entity.slice(1);
		return /^[0-9]+$/.test(dec) ? decodeCodePoint(Number.parseInt(dec, 10)) : void 0;
	}
}
/** Decodes an entity starting at `index` in an HTML string. */
function decodeHtmlEntityAt(html, index) {
	const semicolonIndex = html.indexOf(";", index + 1);
	if (semicolonIndex === -1 || semicolonIndex - index > 16) return;
	const decoded = decodeHtmlEntity(html.slice(index + 1, semicolonIndex));
	if (decoded === void 0) return;
	return {
		text: decoded,
		length: semicolonIndex - index + 1
	};
}
//#endregion
export { decodeHtmlEntityAt as t };
