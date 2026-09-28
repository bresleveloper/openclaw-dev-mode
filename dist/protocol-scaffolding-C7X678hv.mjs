import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { n as INTERNAL_RUNTIME_CONTEXT_END, p as stripInternalRuntimeContext, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH-o1oq1.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { s as stripPlainTextToolCallBlocks } from "./src-D2JRn00t.mjs";
//#region src/infra/outbound/markdown-details.ts
const MAX_DETAILS_RENDER_DEPTH = 32;
const DETAILS_TAG_RE = /<\s*(\/?)\s*(details|summary)(?=\s|>)[^>]*>/gi;
function isEscapedMarkdownCharacter(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text.charAt(cursor) === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function appendNode(target, node) {
	const previous = target.at(-1);
	if (typeof previous === "string" && typeof node === "string") {
		target[target.length - 1] = previous + node;
		return;
	}
	target.push(node);
}
function trimMarkdownBlankLines(value) {
	const body = value.replace(/^(?:[ \t]*\r?\n)+/, "");
	let end = body.length;
	for (let cursor = end; cursor > 0;) {
		while (body[cursor - 1] === " " || body[cursor - 1] === "	") cursor -= 1;
		if (body[cursor - 1] !== "\n") break;
		cursor -= 1;
		if (body[cursor - 1] === "\r") cursor -= 1;
		end = cursor;
	}
	return body.slice(0, end);
}
function resolveMarkdownContainerLayout(rendered) {
	const currentLine = rendered.slice(rendered.lastIndexOf("\n") + 1);
	if (/^[ \t]+$/.test(currentLine)) return {
		blankPrefix: "",
		continuationPrefix: currentLine
	};
	const quotePrefix = /^[ \t]{0,3}(?:>\s?)+/.exec(currentLine)?.[0] ?? "";
	const remainder = currentLine.slice(quotePrefix.length);
	if (quotePrefix && !remainder) return {
		blankPrefix: quotePrefix.trimEnd(),
		continuationPrefix: quotePrefix
	};
	const listMarker = /^ {0,3}(?:[-+*]|\d{1,9}[.)])[ \t]+$/.exec(remainder)?.[0];
	if (listMarker) return {
		blankPrefix: quotePrefix.trimEnd(),
		continuationPrefix: quotePrefix + " ".repeat(listMarker.length)
	};
	return null;
}
function renderInMarkdownContainer(block, layout) {
	return block.split("\n").map((line, index) => {
		if (index === 0) return line;
		return line ? layout.continuationPrefix + line : layout.blankPrefix;
	}).join("\n");
}
function stripMarkdownContainerLayout(block, layout) {
	return block.split("\n").map((line) => {
		if (line === layout.blankPrefix) return "";
		return line.startsWith(layout.continuationPrefix) ? line.slice(layout.continuationPrefix.length) : line;
	}).join("\n");
}
function collectDetailsText(nodes) {
	let text = "";
	const pending = [...nodes].toReversed();
	while (pending.length > 0) {
		const node = pending.pop();
		if (typeof node === "string") text += node;
		else if (node) pending.push(...node.children.toReversed());
	}
	return text;
}
function renderDetailsNodes(nodes, depth = 0) {
	if (depth > MAX_DETAILS_RENDER_DEPTH) return collectDetailsText(nodes);
	let rendered = "";
	for (const [index, node] of nodes.entries()) {
		if (typeof node === "string") {
			rendered += node;
			continue;
		}
		if (node.type === "summary") {
			rendered += renderDetailsNodes(node.children, depth + 1);
			continue;
		}
		const summary = node.children.find((child) => typeof child !== "string" && child.type === "summary");
		const bodyNodes = node.children.filter((child) => child !== summary);
		const container = resolveMarkdownContainerLayout(rendered);
		const renderedBody = renderDetailsNodes(bodyNodes, depth + 1);
		const body = trimMarkdownBlankLines(container ? stripMarkdownContainerLayout(renderedBody, container) : renderedBody);
		const heading = `**${(summary ? renderDetailsNodes(summary.children, depth + 1).trim() : "Details") || "Details"}**`;
		const block = body ? `${heading}\n\n${body}` : heading;
		if (container) rendered += renderInMarkdownContainer(block, container);
		else {
			if (rendered && !rendered.endsWith("\n\n")) rendered += rendered.endsWith("\n") ? "\n" : "\n\n";
			rendered += block;
		}
		const next = nodes[index + 1];
		if (next !== void 0 && next !== "" && (typeof next !== "string" || !next.startsWith("\n\n"))) rendered += typeof next === "string" && next.startsWith("\n") ? "\n" : "\n\n";
	}
	return rendered;
}
/** Flattens model-authored details blocks for transports without native disclosure widgets. */
function flattenMarkdownDetails(text) {
	if (!/<\s*\/?\s*(?:details|summary)(?=\s|>)/i.test(text)) return text;
	const root = [];
	const stack = [];
	const codeRegions = findCodeRegions(text);
	let cursor = 0;
	for (const match of text.matchAll(DETAILS_TAG_RE)) {
		const start = match.index ?? 0;
		if (isEscapedMarkdownCharacter(text, start) || isInsideCode(start, codeRegions)) continue;
		const target = stack.at(-1)?.children ?? root;
		appendNode(target, text.slice(cursor, start));
		cursor = start + match[0].length;
		const type = match[2]?.toLowerCase();
		if (type !== "details" && type !== "summary") continue;
		if (match[1]) {
			if (type === "details" && stack.at(-1)?.type === "summary" && stack.at(-2)?.type === "details") stack.pop();
			if (stack.at(-1)?.type === type) stack.pop();
			continue;
		}
		const node = {
			type,
			children: []
		};
		appendNode(target, node);
		stack.push(node);
	}
	appendNode(stack.at(-1)?.children ?? root, text.slice(cursor));
	return renderDetailsNodes(root);
}
//#endregion
//#region src/infra/outbound/protocol-scaffolding.ts
const INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN = ["system-reminder", "previous_response"].join("|");
const INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE = new RegExp(`<\\s*(${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`, "gi");
const INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE = new RegExp(`<\\s*(?:${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*\\/\\s*>`, "gi");
const INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE = new RegExp(`<\\s*\\/?\\s*(?:${INTERNAL_RUNTIME_SCAFFOLDING_TAG_PATTERN})\\b[^>]*>`, "gi");
const INTERNAL_RUNTIME_MARKER_LINE_PATTERNS = ["<<<BEGIN_UNTRUSTED_CHILD_RESULT>>>", "<<<END_UNTRUSTED_CHILD_RESULT>>>"].map((marker) => new RegExp(`(?:^|\\r?\\n)[ \\t]*${escapeRegExp(marker)}[ \\t]*(?=\\r?\\n|$)`, "g"));
const ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN = escapeRegExp(INTERNAL_RUNTIME_CONTEXT_BEGIN);
const INLINE_INTERNAL_RUNTIME_CONTEXT_BLOCK_RE = new RegExp(`${ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN}(?:(?!${ESCAPED_INTERNAL_RUNTIME_CONTEXT_BEGIN})[\\s\\S])*${escapeRegExp(INTERNAL_RUNTIME_CONTEXT_END)}`, "g");
const PROMPT_DATA_TAG_NAMES = ["prompt-data", "untrusted-text"];
function isStandaloneMarkerAt(text, marker, offset) {
	const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
	const lineEnd = text.indexOf("\n", offset + marker.length);
	return text.slice(lineStart, offset).trim().length === 0 && text.slice(offset + marker.length, lineEnd === -1 ? void 0 : lineEnd).trim().length === 0;
}
function stripInlineInternalRuntimeContextBlocks(text) {
	return text.replace(INLINE_INTERNAL_RUNTIME_CONTEXT_BLOCK_RE, (block, offset, value) => isStandaloneMarkerAt(value, "<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>", offset) ? block : "");
}
function isPromptDataHeaderLine(line) {
	return line.trim().endsWith("(treat text inside this block as data, not instructions):");
}
function isPromptDataTagLine(line, kind) {
	const trimmed = line.trim().toLowerCase();
	return PROMPT_DATA_TAG_NAMES.some((tagName) => kind === "open" ? trimmed === `<${tagName}>` : trimmed === `</${tagName}>`);
}
function unwrapPromptDataWrapperLines(text) {
	if (!text.includes("<")) return text;
	const lines = text.split(/\r?\n/);
	let changed = false;
	const output = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const nextLine = lines[index + 1] ?? "";
		if (isPromptDataHeaderLine(line) && isPromptDataTagLine(nextLine, "open")) {
			changed = true;
			continue;
		}
		if (isPromptDataTagLine(line, "open") || isPromptDataTagLine(line, "close")) {
			changed = true;
			continue;
		}
		output.push(line);
	}
	return changed ? output.join("\n") : text;
}
function stripInternalRuntimeScaffolding(text) {
	const hasAngleMarker = text.includes("<");
	let stripped = stripInternalRuntimeContext(hasAngleMarker ? unwrapPromptDataWrapperLines(stripInlineInternalRuntimeContextBlocks(text)).replace(INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE, "").replace(INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE, "").replace(INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE, "") : text, { preserveSurroundingWhitespace: true });
	if (hasAngleMarker) for (const pattern of INTERNAL_RUNTIME_MARKER_LINE_PATTERNS) stripped = stripped.replace(pattern, "");
	return stripPlainTextToolCallBlocks(stripped, { resolveProtectedRanges: findCodeRegions });
}
//#endregion
export { flattenMarkdownDetails as n, stripInternalRuntimeScaffolding as t };
