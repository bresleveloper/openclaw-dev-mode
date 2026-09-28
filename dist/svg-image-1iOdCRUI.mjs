//#region packages/gateway-protocol/src/svg-image.ts
const SVG_PROLOGUE_WHITESPACE_RE = /\s*/y;
function skipSvgPrologueWhitespace(text, index) {
	SVG_PROLOGUE_WHITESPACE_RE.lastIndex = index;
	SVG_PROLOGUE_WHITESPACE_RE.exec(text);
	return SVG_PROLOGUE_WHITESPACE_RE.lastIndex;
}
function startsWithToken(text, index, token) {
	return text.slice(index, index + token.length).toLowerCase() === token;
}
/**
* Recognizes an SVG root element after an optional XML declaration and comments.
*
* An index scan rather than a regex on purpose: the equivalent
* `(?:<!--[\s\S]*?-->\s*)*<svg` backtracks exponentially on comment-like bytes that
* never reach a root element, and these bytes arrive from remote icon and
* link-favicon responses on the Gateway's single event loop, so one crafted
* response would stall every session. A comment ends at its first `-->`, so text
* between a closed comment and the root element is rejected, not absorbed.
*/
function startsWithSvgRootElement(text) {
	let index = skipSvgPrologueWhitespace(text, 0);
	if (startsWithToken(text, index, "<?xml")) {
		const declarationEnd = text.indexOf(">", index);
		if (declarationEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, declarationEnd + 1);
	}
	while (startsWithToken(text, index, "<!--")) {
		const commentEnd = text.indexOf("-->", index + 4);
		if (commentEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, commentEnd + 3);
	}
	if (!startsWithToken(text, index, "<svg")) return false;
	const delimiter = text[index + 4];
	return delimiter === ">" || delimiter === "/" && text[index + 5] === ">" || delimiter !== void 0 && /\s/u.test(delimiter);
}
/**
* SVG images stay self-contained: no script, document expansion, embedded
* documents, or outbound fetches can reach the browser through an image route.
*/
function isSelfContainedSvg(text) {
	return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && !/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(text) && !/\b(?:href|xlink:href|src)\s*=/iu.test(text) && startsWithSvgRootElement(text);
}
//#endregion
export { startsWithSvgRootElement as n, isSelfContainedSvg as t };
