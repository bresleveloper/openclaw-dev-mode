import { i as truncateWithMarker, n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/shared/text-truncate.ts
function truncateUtf16WithEllipsis(value, maxLength) {
	if (value.length <= maxLength) return value;
	if (maxLength <= 1) return truncateUtf16Safe(value, maxLength);
	return truncateWithMarker(value, maxLength, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
}
/** Compacts normalized text; callers can reuse their bounded character prefix. */
function compactProgressText(text, maxChars, chars = Array.from(sliceUtf16Safe(text, 0, (Math.max(0, maxChars) + 1) * 2))) {
	if (chars.length <= maxChars) return text;
	if (maxChars <= 1) return "…";
	const head = chars.slice(0, maxChars - 1).join("").trimEnd();
	const boundary = head.search(/\s+\S*$/u);
	if (boundary > Math.floor(maxChars * .6)) return `${head.slice(0, boundary).trimEnd()}…`;
	return `${head}…`;
}
//#endregion
export { truncateUtf16WithEllipsis as n, compactProgressText as t };
