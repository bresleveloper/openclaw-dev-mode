import { r as findCodeRegions } from "./code-regions-CvUeKYli.mjs";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-CkC-YR_M.mjs";
//#region src/infra/outbound/sanitize-text.ts
const HTML_TAG_RE = /<\/?[a-z][a-z0-9_.:-]*(?=[\s/>])[^>]*>/gi;
const COMPARISON_PROSE_RE = /^<([a-z][a-z0-9_]*\.?)\s+[^<>=/"'\s][^<>=/"']*>$/i;
const COMPARISON_LEFT_OPERAND_RE = /(?:\p{L}|\p{N}|_|\p{S})$/u;
const COMPARISON_CLAUSE_RE = /\b(?:and|or)\s|[.!?;:]\s|且/iu;
const HTML_ELEMENT_NAME_RE = /^(?:a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h[1-6]|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|picture|pre|progress|q|rp|rt|ruby|s|samp|script|search|section|select|selectedcontent|slot|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)$/i;
const LABELED_ANGLE_LINK_RE = /<(?:https?:\/\/|mailto:)[^<>\s|]+\|([^<>\r\n|]*[^<>\s|][^<>\r\n|]*)>/gi;
const MAY_CONTAIN_MARKDOWN_CODE_RE = /[`~]|\t| {4}/;
const CODE_ESCAPE = "\0e";
const CODE_PLACEHOLDER = "\0p";
const CONVERTIBLE_HTML_OPEN_TAG_RE = /<(b|strong|i|em|s|strike|del|code|h[1-6]|li|p|div)(?=\s|>)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
const EMPTY_HTML_ELEMENT_RE = /<((?!(?:br|p|div)(?=[\s>]))[a-z][a-z0-9_.:-]*)(?=[\s>])(?:[^"'<>]|"[^"]*"|'[^']*')*>(?:[^\S\r\n\u2028\u2029]|<(?!\/?(?:br|p|div)(?=[\s/>]))\/?[a-z][a-z0-9_.:-]*(?=[\s/>])(?:[^"'<>]|"[^"]*"|'[^']*')*>)*<\/\1\s*>/gi;
function removeMatchesUntilStable(text, pattern, replacement) {
	let previous;
	let current = text;
	do {
		previous = current;
		current = replacement ? current.replace(pattern, replacement) : current.replace(pattern, "");
	} while (current !== previous);
	return current;
}
function stripHtmlTagUnlessComparison(tag, offset, source, closingTagNames) {
	const rightOperand = source.charCodeAt(offset + tag.length);
	if (!(rightOperand >= 48 && rightOperand <= 57) || !COMPARISON_LEFT_OPERAND_RE.test(source.slice(Math.max(0, offset - 2), offset))) return "";
	const comparisonName = COMPARISON_PROSE_RE.exec(tag)?.[1];
	return comparisonName !== void 0 && !HTML_ELEMENT_NAME_RE.test(comparisonName) && COMPARISON_CLAUSE_RE.test(tag) && !closingTagNames.has(comparisonName.toLowerCase()) ? tag : "";
}
function convertHtmlOutsideCode(text, options) {
	const boldMarker = options.style === "markdown" ? "**" : "*";
	const strikeMarker = options.style === "markdown" ? "~~" : "~";
	const converted = removeMatchesUntilStable(text.replace(/<((?:https?:\/\/|mailto:)[^<>\s|]+)>/gi, "$1").replace(LABELED_ANGLE_LINK_RE, "$1").replace(CONVERTIBLE_HTML_OPEN_TAG_RE, "<$1>"), EMPTY_HTML_ELEMENT_RE).replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(p|div)>/gi, "\n").replace(/<(b|strong)>(.*?)<\/\1>/gi, `${boldMarker}$2${boldMarker}`).replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_").replace(/<(s|strike|del)>(.*?)<\/\1>/gi, `${strikeMarker}$2${strikeMarker}`).replace(/<code>(.*?)<\/code>/gi, "`$1`").replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, `\n${boldMarker}$1${boldMarker}\n`).replace(/<li>(.*?)<\/li>/gi, "• $1\n");
	const closingTagNames = /* @__PURE__ */ new Set();
	for (const tag of converted.matchAll(/<\/[a-z][a-z0-9_.:-]*\s*>/gi)) closingTagNames.add(tag[0].slice(2, -1).trim().toLowerCase());
	return removeMatchesUntilStable(converted, HTML_TAG_RE, (tag, offset, source) => stripHtmlTagUnlessComparison(tag, offset, source, closingTagNames)).replace(/\n{3,}/g, "\n\n");
}
/**
* Convert common HTML tags to their plain-text/lightweight-markup equivalents
* and strip anything that remains.
*
* The function is intentionally conservative — it only targets tags that models
* are known to produce and avoids false positives on angle brackets in normal
* prose (e.g. `a < b`), in fenced blocks, and in inline code spans.
*/
function sanitizeForPlainText(text, options = {}) {
	const prepared = flattenMarkdownDetails(stripInternalRuntimeScaffolding(text));
	if (!prepared.includes("<") && !prepared.includes("\n\n\n")) return prepared;
	const codeRegions = MAY_CONTAIN_MARKDOWN_CODE_RE.test(prepared) ? findCodeRegions(prepared) : [];
	if (codeRegions.length === 0) return convertHtmlOutsideCode(prepared, options);
	const preservedText = /* @__PURE__ */ new Map([[CODE_ESCAPE, "\0"]]);
	let masked = "";
	let cursor = 0;
	for (const region of codeRegions) {
		masked += prepared.slice(cursor, region.start).replaceAll("\0", CODE_ESCAPE);
		const placeholder = `${CODE_PLACEHOLDER}${preservedText.size};`;
		masked += placeholder;
		preservedText.set(placeholder, prepared.slice(region.start, region.end));
		cursor = region.end;
	}
	masked += prepared.slice(cursor).replaceAll("\0", CODE_ESCAPE);
	return convertHtmlOutsideCode(masked, options).replace(/\u0000(?:e|p\d+;)/g, (marker) => preservedText.get(marker) ?? marker);
}
//#endregion
export { sanitizeForPlainText as t };
