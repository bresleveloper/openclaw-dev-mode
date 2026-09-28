import { r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-C7X678hv.mjs";
//#region src/infra/outbound/sanitize-text.ts
const HTML_TAG_RE = /<\/?[a-z][a-z0-9_.:-]*(?=[\s/>])[^>]*>/gi;
const LABELED_ANGLE_LINK_RE = /<(?:https?:\/\/|mailto:)[^<>\s|]+\|([^<>\r\n|]*[^<>\s|][^<>\r\n|]*)>/gi;
const MAY_CONTAIN_MARKDOWN_CODE_RE = /[`~]|\t| {4}/;
const CODE_ESCAPE = "\0e";
const CODE_PLACEHOLDER = "\0p";
const CONVERTIBLE_HTML_OPEN_TAG_RE = /<(b|strong|i|em|s|strike|del|code|h[1-6]|li|p|div)(?=\s|>)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
const EMPTY_HTML_ELEMENT_RE = /<((?!(?:br|p|div)(?=[\s>]))[a-z][a-z0-9_.:-]*)(?=[\s>])(?:[^"'<>]|"[^"]*"|'[^']*')*>(?:[^\S\r\n\u2028\u2029]|<(?!\/?(?:br|p|div)(?=[\s/>]))\/?[a-z][a-z0-9_.:-]*(?=[\s/>])(?:[^"'<>]|"[^"]*"|'[^']*')*>)*<\/\1\s*>/gi;
function removeMatchesUntilStable(text, pattern) {
	let previous;
	let current = text;
	do {
		previous = current;
		current = current.replace(pattern, "");
	} while (current !== previous);
	return current;
}
function convertHtmlOutsideCode(text, options) {
	const boldMarker = options.style === "markdown" ? "**" : "*";
	const strikeMarker = options.style === "markdown" ? "~~" : "~";
	return removeMatchesUntilStable(removeMatchesUntilStable(text.replace(/<((?:https?:\/\/|mailto:)[^<>\s|]+)>/gi, "$1").replace(LABELED_ANGLE_LINK_RE, "$1").replace(CONVERTIBLE_HTML_OPEN_TAG_RE, "<$1>"), EMPTY_HTML_ELEMENT_RE).replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(p|div)>/gi, "\n").replace(/<(b|strong)>(.*?)<\/\1>/gi, `${boldMarker}$2${boldMarker}`).replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_").replace(/<(s|strike|del)>(.*?)<\/\1>/gi, `${strikeMarker}$2${strikeMarker}`).replace(/<code>(.*?)<\/code>/gi, "`$1`").replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, `\n${boldMarker}$1${boldMarker}\n`).replace(/<li>(.*?)<\/li>/gi, "• $1\n"), HTML_TAG_RE).replace(/\n{3,}/g, "\n\n");
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
