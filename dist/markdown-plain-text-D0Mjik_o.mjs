//#region packages/normalization-core/src/markdown-plain-text.ts
/**
* Flattens Markdown into a single line of readable plain text.
*
* For one-line surfaces that render text verbatim — session-list previews,
* sidebar narration — where unrendered syntax like `[title](url)` would leak
* to the user. Lossy by design: it drops fenced code entirely and keeps only
* link/image text, so it must not be used where the Markdown is rendered.
*/
function flattenMarkdownToPlainText(text) {
	return stripInlineLinks(text.replace(/```[\s\S]*?```/g, " ").replace(/```/g, " ").replace(/`([^`]*)`/g, "$1")).replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, "").replace(/(\*{1,2})(?=\S)([\s\S]*?\S)\1/g, "$2").replace(/(^|[^\p{L}\p{N}])(_{1,2})(?=\S)([\s\S]*?\S)\2(?![\p{L}\p{N}])/gu, "$1$3").replace(/~~(?=\S)([\s\S]*?\S)~~/g, "$1").replace(/\s+/g, " ").trim();
}
/** CommonMark link syntax only breaks on ASCII; U+00A0 and other Unicode spaces belong to the destination. */
const ASCII_WHITESPACE = /[\t\n\v\f\r ]/;
function isAsciiSpaceOrControl(char) {
	return char <= " " || char === "";
}
/** Maps each `(` to its balanced `)` within the same whitespace-free run, skipping escapes. */
function matchParens(text) {
	const closers = /* @__PURE__ */ new Map();
	const parens = [];
	for (let index = 0; index < text.length; index += 1) {
		const char = text.charAt(index);
		if (char === "\\") index += 1;
		else if (isAsciiSpaceOrControl(char)) parens.length = 0;
		else if (char === "(") parens.push(index);
		else if (char === ")") {
			const opener = parens.pop();
			if (opener !== void 0) closers.set(opener, index);
		}
	}
	return closers;
}
const TITLE_CLOSERS = {
	"\"": "\"",
	"'": "'",
	"(": ")"
};
function skipSpaces(text, start) {
	let index = start;
	while (index < text.length && ASCII_WHITESPACE.test(text.charAt(index))) index += 1;
	return index;
}
/** Returns the index of the `)` closing `(destination "title")` opened at `open`. */
function findDestinationEnd(text, open, parenClosers) {
	let index = skipSpaces(text, open + 1);
	if (text.charAt(index) === "<") {
		index += 1;
		while (index < text.length && !"<>\n".includes(text.charAt(index))) index += text.charAt(index) === "\\" ? 2 : 1;
		if (text.charAt(index) !== ">") return;
		index += 1;
	} else while (index < text.length && text.charAt(index) !== ")" && !isAsciiSpaceOrControl(text.charAt(index))) if (text.charAt(index) === "(") {
		const closer = parenClosers.get(index);
		if (closer === void 0) return;
		index = closer + 1;
	} else index += text.charAt(index) === "\\" ? 2 : 1;
	const titleStart = skipSpaces(text, index);
	const titleCloser = TITLE_CLOSERS[text.charAt(titleStart)];
	if (titleStart > index && titleCloser) {
		index = titleStart + 1;
		while (index < text.length && text.charAt(index) !== titleCloser) {
			if (titleCloser === ")" && text.charAt(index) === "(") return;
			index += text.charAt(index) === "\\" ? 2 : 1;
		}
		index = skipSpaces(text, index + 1);
	} else index = titleStart;
	return text.charAt(index) === ")" ? index : void 0;
}
/**
* Maps each link label's `[` to its `]` and that `]` to the end of the `(destination "title")`
* that follows it, skipping backslash-escaped characters. Brackets inside a destination or title
* are not labels, so they never pair with a label bracket.
*/
function matchLinks(text) {
	const labelEnds = /* @__PURE__ */ new Map();
	const destinationEnds = /* @__PURE__ */ new Map();
	const parenClosers = matchParens(text);
	const brackets = [];
	for (let index = 0; index < text.length; index += 1) {
		const char = text.charAt(index);
		if (char === "\\") index += 1;
		else if (char === "[") brackets.push(index);
		else if (char === "]") {
			const opener = brackets.pop();
			if (opener === void 0) continue;
			labelEnds.set(opener, index);
			const destinationEnd = text.charAt(index + 1) === "(" ? findDestinationEnd(text, index + 1, parenClosers) : void 0;
			if (destinationEnd !== void 0) {
				destinationEnds.set(index, destinationEnd);
				index = destinationEnd;
			}
		}
	}
	return {
		labelEnds,
		destinationEnds
	};
}
/** Strips inline link destinations, retaining nested labels and optionally omitting images entirely. */
function stripInlineLinks(text, options = {}) {
	const { labelEnds, destinationEnds } = matchLinks(text);
	const suffixEnds = /* @__PURE__ */ new Map();
	let output = "";
	let cursor = 0;
	for (let index = 0; index < text.length; index += 1) {
		const suffixEnd = suffixEnds.get(index);
		if (suffixEnd !== void 0) {
			output += text.slice(cursor, index);
			cursor = suffixEnd;
			index = suffixEnd - 1;
			continue;
		}
		const labelEnd = text[index] === "[" ? labelEnds.get(index) : void 0;
		const destinationEnd = labelEnd === void 0 ? void 0 : destinationEnds.get(labelEnd);
		if (labelEnd === void 0 || destinationEnd === void 0) continue;
		const isImage = index > cursor && text[index - 1] === "!";
		if (!isImage && labelEnd === index + 1) continue;
		output += text.slice(cursor, isImage ? index - 1 : index);
		if (isImage && options.images === "omit") {
			cursor = destinationEnd + 1;
			index = destinationEnd;
			continue;
		}
		cursor = index + 1;
		suffixEnds.set(labelEnd, destinationEnd + 1);
	}
	return output + text.slice(cursor);
}
//#endregion
export { stripInlineLinks as n, flattenMarkdownToPlainText as t };
