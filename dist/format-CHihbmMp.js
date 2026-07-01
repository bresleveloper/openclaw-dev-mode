import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as markdownToIRWithMeta, i as markdownToIR, n as renderMarkdownWithMarkers, o as sliceMarkdownIR } from "./tables-CNojwOtD.js";
import { r as renderMarkdownIRChunksWithinLimit } from "./chunk-items-DgQ9mA4n.js";
import { n as isAutoLinkedFileRef, t as FILE_REF_EXTENSIONS_WITH_TLD } from "./auto-linked-file-ref-SPenUvZ7.js";
import "./text-chunking-nijjGL3g.js";
//#region extensions/telegram/src/format.ts
function escapeTelegramHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeHtml(text) {
	return escapeTelegramHtml(text);
}
function escapeHtmlAttr(text) {
	return escapeHtml(text).replace(/"/g, "&quot;");
}
function isTelegramRichLinkHref(href) {
	return /^(?:https?:\/\/|tg:\/\/|mailto:|tel:|#)/i.test(href);
}
/**
* File extensions that share TLDs and commonly appear in code/documentation.
* These are wrapped in <code> tags to prevent Telegram from generating
* spurious domain registrar previews.
*
* Only includes extensions that are:
* 1. Commonly used as file extensions in code/docs
* 2. Rarely used as intentional domain references
*
* Excluded: .ai, .io, .tv, .fm (popular domain TLDs like x.ai, vercel.io, github.io)
*/
function buildTelegramLink(link, text) {
	const href = link.href.trim();
	if (!href) return null;
	if (link.start === link.end) return null;
	if (!isTelegramRichLinkHref(href)) return null;
	if (isAutoLinkedFileRef(href, text.slice(link.start, link.end))) return null;
	const safeHref = escapeHtmlAttr(href);
	return {
		start: link.start,
		end: link.end,
		open: `<a href="${safeHref}">`,
		close: "</a>"
	};
}
function buildTelegramCodeBlockOpen(span) {
	if (!span.language) return "<pre><code>";
	return `<pre><code class="language-${escapeHtmlAttr(span.language)}">`;
}
function renderTelegramHtml(ir) {
	return renderMarkdownWithMarkers(ir, {
		styleMarkers: {
			bold: {
				open: "<b>",
				close: "</b>"
			},
			italic: {
				open: "<i>",
				close: "</i>"
			},
			strikethrough: {
				open: "<s>",
				close: "</s>"
			},
			code: {
				open: "<code>",
				close: "</code>"
			},
			code_block: {
				open: buildTelegramCodeBlockOpen,
				close: "</code></pre>"
			},
			spoiler: {
				open: "<tg-spoiler>",
				close: "</tg-spoiler>"
			},
			blockquote: {
				open: "<blockquote>",
				close: "</blockquote>"
			},
			heading_1: {
				open: "<h1>",
				close: "</h1>"
			},
			heading_2: {
				open: "<h2>",
				close: "</h2>"
			},
			heading_3: {
				open: "<h3>",
				close: "</h3>"
			},
			heading_4: {
				open: "<h4>",
				close: "</h4>"
			},
			heading_5: {
				open: "<h5>",
				close: "</h5>"
			},
			heading_6: {
				open: "<h6>",
				close: "</h6>"
			}
		},
		escapeText: escapeHtml,
		buildLink: buildTelegramLink
	});
}
function leadingWhitespaceLength(line) {
	let length = 0;
	while (line[length] === " " || line[length] === "	") length++;
	return length;
}
function isTelegramBulletLine(line) {
	return /^[ \t]*(?:[•*+-])[ \t]+\S/.test(line);
}
function isTelegramListBoundaryLine(line) {
	return /^[ \t]*(?:\d+\.|#{1,6})[ \t]+\S/.test(line);
}
function isMarkdownIndentedCodeLine(line) {
	return /^(?: {4}|\t)/.test(line);
}
function shouldPreserveTelegramListBoundarySpacing(previous, next) {
	return !isMarkdownIndentedCodeLine(previous) && !isMarkdownIndentedCodeLine(next) && isTelegramBulletLine(previous) && isTelegramListBoundaryLine(next) && leadingWhitespaceLength(next) <= leadingWhitespaceLength(previous);
}
function preserveTelegramListBoundarySpacing(markdown) {
	const lines = markdown.split("\n");
	const out = [];
	let inFence = false;
	let previousLine = "";
	for (const line of lines) {
		const normalizedLine = line.replace(/\r$/, "");
		const isFenceLine = /^[ \t]*(?:```|~~~)/.test(normalizedLine);
		if (!inFence && shouldPreserveTelegramListBoundarySpacing(previousLine, normalizedLine)) out.push("");
		out.push(line);
		if (isFenceLine) inFence = !inFence;
		previousLine = normalizedLine;
	}
	return out.join("\n");
}
function markdownToTelegramHtml(markdown, options = {}) {
	const tableMode = options.tableMode === "block" ? "code" : options.tableMode;
	const telegramHtml = preserveSupportedTelegramHtmlTags(renderTelegramHtml(markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
		linkify: true,
		enableSpoilers: true,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode
	})));
	if (options.wrapFileRefs !== false) return wrapFileReferencesInHtml(telegramHtml);
	return telegramHtml;
}
/**
* Wraps standalone file references (with TLD extensions) in <code> tags.
* This prevents Telegram from treating them as URLs and generating
* irrelevant domain registrar previews.
*
* Runs AFTER markdown→HTML conversion to avoid modifying HTML attributes.
* Skips content inside <code>, <pre>, and <a> tags to avoid nesting issues.
*/
/** Escape regex metacharacters in a string */
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const AUTO_LINKED_ANCHOR_PATTERN = /<a\s+href="https?:\/\/([^"]+)"[^>]*>\1<\/a>/gi;
const HTML_TAG_PATTERN = /(<\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?>/gi;
const HTML_MODE_TAG_PATTERN = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>$/;
const ESCAPED_HTML_TAG_PATTERN = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)&gt;/g;
const TELEGRAM_HTML_ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const TELEGRAM_HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const TELEGRAM_HTML_ENTITY_PATTERN = /&(#x[0-9A-Fa-f]+|#\d+|amp|lt|gt|quot|apos);/g;
const TELEGRAM_HTML_TAG_PATTERN = /<[^>]*>/g;
const TELEGRAM_RICH_MEDIA_BLOCK_PATTERN = /[^\S\r\n]*(?:<figure\b[^>]*>[\s\S]*?<\/figure>|<tg-collage\b[^>]*>[\s\S]*?<\/tg-collage>|<tg-slideshow\b[^>]*>[\s\S]*?<\/tg-slideshow>|<img\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*\/?>|<video\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*(?:\/>|>[\s\S]*?<\/video>)|<audio\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*(?:\/>|>[\s\S]*?<\/audio>)|<tg-map\b[^>]*\/?>)[^\S\r\n]*/gi;
const TELEGRAM_RICH_HTML_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const TELEGRAM_HTML_CAPTION_PATTERN = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i;
const TELEGRAM_HTML_COLSPAN_PATTERN = /\bcolspan\s*=\s*(?:"(\d+)"|'(\d+)'|(\d+))/i;
const TELEGRAM_MARKDOWN_MEDIA_BLOCK_PATTERN = /^([ \t]*)!\[([^\]\n]*)\]\((https?:\/\/[^\s)"]+)(?:\s+"([^"\n]*)")?\)[ \t]*$/;
const TELEGRAM_MARKDOWN_INLINE_IMAGE_PATTERN = /!\[([^\]\n]*)\]\(([^)\n]+)\)/g;
const TELEGRAM_MARKDOWN_REFERENCE_IMAGE_PATTERN = /!\[([^\]\n]*)\]\[([^\]\n]+)\]/g;
const TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_PREFIX = "telegram-media:";
const TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_SUFFIX = "";
const TELEGRAM_SIMPLE_HTML_TAGS = new Set([
	"b",
	"strong",
	"i",
	"em",
	"u",
	"ins",
	"s",
	"strike",
	"del",
	"code",
	"pre",
	"tg-spoiler"
]);
const TELEGRAM_ATTR_HTML_TAG_PATTERNS = new Map([
	["a", /^\s+href="[^"]+"\s*$/],
	["span", /^\s+class="tg-spoiler"\s*$/],
	["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
	["tg-time", /^\s+datetime="[^"]+"\s*$/],
	["blockquote", /^(\s+expandable)?\s*$/]
]);
const TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN = /^\s+class="language-[^"]+"\s*$/;
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const TELEGRAM_VOID_HTML_TAGS = new Set([
	"br",
	"hr",
	"img",
	"input",
	"tg-map"
]);
const TELEGRAM_RICH_BLOCK_HTML_TAGS = new Set([
	"aside",
	"audio",
	"blockquote",
	"details",
	"figure",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"table",
	"tg-collage",
	"tg-map",
	"tg-math-block",
	"tg-slideshow",
	"tr",
	"ul",
	"video"
]);
const TELEGRAM_RICH_MEDIA_HTML_TAGS = new Set([
	"audio",
	"img",
	"video"
]);
const TELEGRAM_RICH_SIMPLE_HTML_TAGS = new Set([
	...TELEGRAM_SIMPLE_HTML_TAGS,
	"a",
	"aside",
	"audio",
	"blockquote",
	"br",
	"caption",
	"cite",
	"details",
	"figcaption",
	"figure",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"li",
	"mark",
	"ol",
	"p",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"tg-collage",
	"tg-math",
	"tg-math-block",
	"tg-slideshow",
	"th",
	"thead",
	"tr",
	"ul",
	"video"
]);
const TELEGRAM_RICH_ATTR_HTML_TAG_PATTERNS = new Map([
	...TELEGRAM_ATTR_HTML_TAG_PATTERNS,
	["a", /^\s+(?:href|name)="[^"]+"\s*$/],
	["audio", /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+title="[^"]*")*\s*\/?\s*$/],
	["details", /^\s+open\s*$/],
	["figure", /^\s+tg-spoiler\s*$/],
	["img", /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+(?:alt|title)="[^"]*"|\s+tg-spoiler)*\s*\/?\s*$/],
	["input", /^\s+type="checkbox"(?:\s+checked)?\s*\/?\s*$/],
	["li", /^(?:\s+(?:value|type)="[^"]*")*\s*$/],
	["ol", /^(?:\s+(?:start|type)="[^"]*"|\s+reversed)*\s*$/],
	["table", /^(?:\s+(?:bordered|striped))*\s*$/],
	["td", /^(?:\s+(?:colspan|rowspan)="[1-9]\d*"|\s+align="(?:left|center|right)"|\s+valign="(?:top|middle|bottom)")*\s*$/],
	["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
	["tg-map", /^\s+lat="[^"]+"\s+long="[^"]+"(?:\s+zoom="[^"]+")?\s*\/?\s*$/],
	["tg-reference", /^\s+name="[^"]+"\s*$/],
	["tg-time", /^\s+unix="[^"]+"(?:\s+format="[^"]+")?\s*$/],
	["th", /^(?:\s+(?:colspan|rowspan)="[1-9]\d*"|\s+align="(?:left|center|right)"|\s+valign="(?:top|middle|bottom)")*\s*$/],
	["video", /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+title="[^"]*"|\s+tg-spoiler)*\s*\/?\s*$/]
]);
let fileReferencePattern;
let orphanedTldPattern;
const TELEGRAM_LEGACY_HTML_TAG_SUPPORT = {
	simpleTags: TELEGRAM_SIMPLE_HTML_TAGS,
	attrPatterns: TELEGRAM_ATTR_HTML_TAG_PATTERNS
};
const TELEGRAM_RICH_HTML_TAG_SUPPORT = {
	simpleTags: TELEGRAM_RICH_SIMPLE_HTML_TAGS,
	attrPatterns: TELEGRAM_RICH_ATTR_HTML_TAG_PATTERNS
};
function popLastTagName(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index] === name) {
		tags.splice(index, 1);
		return true;
	}
	return false;
}
function isSupportedTelegramHtmlTag(rawTag, support) {
	const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
	if (!match) return false;
	const closing = match[1] === "/";
	const name = normalizeLowercaseStringOrEmpty(match[2]);
	const attrs = match[3] ?? "";
	if (closing) return attrs.trim() === "" && (support.simpleTags.has(name) || support.attrPatterns.has(name));
	if (name === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) return true;
	if (support.attrPatterns.get(name)?.test(attrs)) return true;
	return support.simpleTags.has(name) && attrs.trim() === "";
}
function hasOpenTelegramHtmlTag(tags, name) {
	return tags.includes(name);
}
function preserveTelegramHtmlTag(rawTag, openTags, escapeTag, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
	if (!match) return escapeTag(rawTag);
	const closing = match[1] === "/";
	const tagName = normalizeLowercaseStringOrEmpty(match[2]);
	const attrs = match[3] ?? "";
	if (!closing && tagName === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) {
		openTags.push(tagName);
		if (hasOpenTelegramHtmlTag(openTags, "pre")) return rawTag;
		return "<code>";
	}
	if (!isSupportedTelegramHtmlTag(rawTag, support)) return escapeTag(rawTag);
	if (closing) return popLastTagName(openTags, tagName) ? rawTag : escapeTag(rawTag);
	if (TELEGRAM_VOID_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>")) return rawTag;
	openTags.push(tagName);
	return rawTag;
}
function escapeUnsupportedTelegramHtml(text, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	let result = "";
	let index = 0;
	const openTags = [];
	while (index < text.length) {
		const char = text[index];
		if (char === "&") {
			const entityEnd = findTelegramHtmlEntityEnd(text, index);
			if (entityEnd !== -1) {
				result += text.slice(index, entityEnd + 1);
				index = entityEnd + 1;
			} else {
				result += "&amp;";
				index += 1;
			}
			continue;
		}
		if (char === "<") {
			const end = text.indexOf(">", index + 1);
			if (end !== -1) {
				const rawTag = text.slice(index, end + 1);
				result += preserveTelegramHtmlTag(rawTag, openTags, escapeHtml, support);
				index = end + 1;
			} else {
				result += "&lt;";
				index += 1;
			}
			continue;
		}
		if (char === ">") {
			result += "&gt;";
			index += 1;
			continue;
		}
		result += char;
		index += 1;
	}
	return result;
}
function decodeTelegramHtmlEntity(entity, fallback) {
	if (entity.startsWith("#x") || entity.startsWith("#X")) {
		const codePoint = Number.parseInt(entity.slice(2), 16);
		return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 1114111 ? String.fromCodePoint(codePoint) : fallback;
	}
	if (entity.startsWith("#")) {
		const codePoint = Number.parseInt(entity.slice(1), 10);
		return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 1114111 ? String.fromCodePoint(codePoint) : fallback;
	}
	switch (entity) {
		case "amp": return "&";
		case "lt": return "<";
		case "gt": return ">";
		case "quot": return "\"";
		case "apos": return "'";
		default: return fallback;
	}
}
function decodeTelegramHtmlEntities(text) {
	return text.replace(TELEGRAM_HTML_ENTITY_PATTERN, (match, entity) => decodeTelegramHtmlEntity(entity, match));
}
function stripTelegramHtmlForPlainText(html) {
	return decodeTelegramHtmlEntities(html.replace(TELEGRAM_HTML_BREAK_PATTERN, "\n").replace(TELEGRAM_HTML_TAG_PATTERN, ""));
}
function encodePlainTextForTelegramHtmlStrip(text) {
	return text.replace(/[&<>]/g, (char) => {
		switch (char) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return char;
		}
	});
}
function telegramHtmlToPlainTextFallback(html) {
	const withPlainTables = html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
		return parseTelegramRichHtmlTableRows(tableHtml).map((row) => row.join(" | ")).join("\n");
	});
	TELEGRAM_HTML_ANCHOR_PATTERN.lastIndex = 0;
	return stripTelegramHtmlForPlainText(withPlainTables.replace(TELEGRAM_HTML_ANCHOR_PATTERN, (_match, doubleQuotedHref, singleQuotedHref, unquotedHref, labelHtml) => {
		const href = decodeTelegramHtmlEntities(doubleQuotedHref ?? singleQuotedHref ?? unquotedHref ?? "").trim();
		const label = stripTelegramHtmlForPlainText(labelHtml).trim();
		if (!href) return encodePlainTextForTelegramHtmlStrip(label);
		return encodePlainTextForTelegramHtmlStrip(!label || label === href ? href : `${label} (${href})`);
	}));
}
function promoteEscapedSupportedTelegramTags(text, openTags, support) {
	ESCAPED_HTML_TAG_PATTERN.lastIndex = 0;
	return text.replace(ESCAPED_HTML_TAG_PATTERN, (match, closing, name, attrs) => preserveTelegramHtmlTag(`<${closing}${name}${attrs}>`, openTags, () => match, support));
}
function preserveSupportedTelegramHtmlTags(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	let codeDepth = 0;
	let preDepth = 0;
	let result = "";
	let lastIndex = 0;
	const openEscapedTags = [];
	HTML_TAG_PATTERN.lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(html)) !== null) {
		const tagStart = match.index;
		const tagEnd = HTML_TAG_PATTERN.lastIndex;
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		const isClosing = match[1] === "</";
		const textBefore = html.slice(lastIndex, tagStart);
		result += codeDepth > 0 || preDepth > 0 ? textBefore : promoteEscapedSupportedTelegramTags(textBefore, openEscapedTags, support);
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		result += html.slice(tagStart, tagEnd);
		lastIndex = tagEnd;
	}
	const remainingText = html.slice(lastIndex);
	result += codeDepth > 0 || preDepth > 0 ? remainingText : promoteEscapedSupportedTelegramTags(remainingText, openEscapedTags, support);
	return result;
}
function getFileReferencePattern() {
	if (fileReferencePattern) return fileReferencePattern;
	const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
	fileReferencePattern = new RegExp(`(^|[^a-zA-Z0-9_\\-/])([a-zA-Z0-9_.\\-./]+\\.(?:${fileExtensionsPattern}))(?=$|[^a-zA-Z0-9_\\-/])`, "gi");
	return fileReferencePattern;
}
function getOrphanedTldPattern() {
	if (orphanedTldPattern) return orphanedTldPattern;
	const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
	orphanedTldPattern = new RegExp(`([^a-zA-Z0-9]|^)([A-Za-z]\\.(?:${fileExtensionsPattern}))(?=[^a-zA-Z0-9/]|$)`, "g");
	return orphanedTldPattern;
}
function wrapStandaloneFileRef(match, prefix, filename) {
	if (filename.startsWith("//")) return match;
	if (/https?:\/\/$/i.test(prefix)) return match;
	return `${prefix}<code>${escapeHtml(filename)}</code>`;
}
function wrapSegmentFileRefs(text, codeDepth, preDepth, anchorDepth) {
	if (!text || codeDepth > 0 || preDepth > 0 || anchorDepth > 0) return text;
	return text.replace(getFileReferencePattern(), wrapStandaloneFileRef).replace(getOrphanedTldPattern(), (match, prefix, tld) => prefix === ">" ? match : `${prefix}<code>${escapeHtml(tld)}</code>`);
}
function wrapFileReferencesInHtml(html) {
	AUTO_LINKED_ANCHOR_PATTERN.lastIndex = 0;
	const deLinkified = html.replace(AUTO_LINKED_ANCHOR_PATTERN, (_match, label) => {
		if (!isAutoLinkedFileRef(`http://${label}`, label)) return _match;
		return `<code>${escapeHtml(label)}</code>`;
	});
	let codeDepth = 0;
	let preDepth = 0;
	let anchorDepth = 0;
	let result = "";
	let lastIndex = 0;
	HTML_TAG_PATTERN.lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(deLinkified)) !== null) {
		const tagStart = match.index;
		const tagEnd = HTML_TAG_PATTERN.lastIndex;
		const isClosing = match[1] === "</";
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		const textBefore = deLinkified.slice(lastIndex, tagStart);
		result += wrapSegmentFileRefs(textBefore, codeDepth, preDepth, anchorDepth);
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		else if (tagName === "a") anchorDepth = isClosing ? Math.max(0, anchorDepth - 1) : anchorDepth + 1;
		result += deLinkified.slice(tagStart, tagEnd);
		lastIndex = tagEnd;
	}
	const remainingText = deLinkified.slice(lastIndex);
	result += wrapSegmentFileRefs(remainingText, codeDepth, preDepth, anchorDepth);
	return result;
}
function renderTelegramHtmlText(text, options = {}) {
	if ((options.textMode ?? "markdown") === "html") return escapeUnsupportedTelegramHtmlWithTableFallback(text);
	return markdownToTelegramHtml(text, { tableMode: options.tableMode });
}
function sanitizeTelegramRichHtml(html) {
	return isolateTelegramRichMediaBlocks(normalizeWideTelegramRichHtmlTables(escapeUnsupportedTelegramHtml(html, TELEGRAM_RICH_HTML_TAG_SUPPORT)));
}
function escapeUnsupportedTelegramHtmlWithTableFallback(html) {
	return escapeUnsupportedTelegramHtml(normalizeTelegramLegacyHtmlTables(html), TELEGRAM_LEGACY_HTML_TAG_SUPPORT);
}
function isInsideTelegramHtmlCodeContext(html, offset) {
	let codeDepth = 0;
	let preDepth = 0;
	HTML_TAG_PATTERN.lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(html)) !== null && match.index < offset) {
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		if (tagName !== "code" && tagName !== "pre") continue;
		const isClosing = match[1] === "</";
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
	}
	return codeDepth > 0 || preDepth > 0;
}
function normalizeTelegramLegacyHtmlTables(html) {
	TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
	return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml, offset) => {
		if (isInsideTelegramHtmlCodeContext(html, offset)) return tableHtml;
		const rows = parseTelegramRichHtmlTableRows(tableHtml);
		return rows.length ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
	});
}
function limitTelegramRichHtmlNesting(html, maxDepth) {
	const normalizedMaxDepth = Math.max(1, Math.floor(maxDepth));
	const stack = [];
	let keptDepth = 0;
	let output = "";
	let lastIndex = 0;
	HTML_TAG_PATTERN.lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(html)) !== null) {
		output += html.slice(lastIndex, match.index);
		const rawTag = match[0];
		const isClosing = match[1] === "</";
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		const isSelfClosing = !isClosing && (TELEGRAM_VOID_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>"));
		if (isClosing) {
			const entryIndex = stack.findLastIndex((entry) => entry.name === tagName);
			if (entryIndex >= 0) {
				const [entry] = stack.splice(entryIndex, 1);
				if (entry?.kept) {
					keptDepth = Math.max(0, keptDepth - 1);
					output += rawTag;
				}
			}
		} else if (isSelfClosing) {
			if (tagName === "br" || keptDepth < normalizedMaxDepth) output += rawTag;
		} else {
			const kept = keptDepth < normalizedMaxDepth;
			stack.push({
				name: tagName,
				kept
			});
			if (kept) {
				keptDepth += 1;
				output += rawTag;
			}
		}
		lastIndex = HTML_TAG_PATTERN.lastIndex;
	}
	return output + html.slice(lastIndex);
}
function normalizeTelegramRichMediaBlock(block) {
	const normalized = block.trim().replace(/<img\b([^>]*?)(\s*)>/gi, (_match, attrs, trailing) => attrs.trimEnd().endsWith("/") ? `<img${attrs}${trailing}>` : `<img${attrs}${trailing}/>`);
	return /^<(?:img|video|audio)\b/i.test(normalized) ? `<figure>${normalized}</figure>` : normalized;
}
function isolateTelegramRichMediaBlocks(html) {
	return html.replace(TELEGRAM_RICH_MEDIA_BLOCK_PATTERN, (match) => `\n\n${normalizeTelegramRichMediaBlock(match)}\n\n`).replace(/\n{3,}/g, "\n\n").trim();
}
function parseTelegramHtmlColspan(attrs) {
	const raw = TELEGRAM_HTML_COLSPAN_PATTERN.exec(attrs)?.slice(1).find(Boolean);
	const value = raw ? Number.parseInt(raw, 10) : 1;
	return Number.isFinite(value) && value > 1 ? Math.min(value, 21) : 1;
}
function parseTelegramRichHtmlTableRows(tableHtml) {
	const rows = [];
	TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
	let rowMatch;
	while ((rowMatch = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)) !== null) {
		const rowHtml = rowMatch[1] ?? "";
		const row = [];
		TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
		let cellMatch;
		while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(rowHtml)) !== null) {
			const attrs = cellMatch[2] ?? "";
			const text = telegramHtmlToPlainTextFallback(cellMatch[3] ?? "").replace(/\s+/g, " ").trim();
			row.push(text, ...Array.from({ length: parseTelegramHtmlColspan(attrs) - 1 }, () => ""));
		}
		if (row.length) rows.push(row);
	}
	return rows;
}
function renderTelegramRichHtmlRawTableFallback(tableHtml, rows) {
	const columnCount = Math.max(...rows.map((row) => row.length), 0);
	const widths = Array.from({ length: columnCount }, () => 3);
	for (const row of rows) for (let index = 0; index < columnCount; index += 1) widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
	return `<pre><code>${escapeHtml([telegramHtmlToPlainTextFallback(TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "").trim(), rows.map((row) => `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`).join("\n")].filter(Boolean).join("\n"))}</code></pre>\n\n`;
}
function normalizeWideTelegramRichHtmlTables(html) {
	TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
	return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
		const rows = parseTelegramRichHtmlTableRows(tableHtml);
		return Math.max(...rows.map((row) => row.length), 0) > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
	});
}
function buildTelegramRichMarkdownMediaPlaceholder(index) {
	return `${TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_PREFIX}${index}${TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_SUFFIX}`;
}
function replaceTelegramRichMarkdownMediaPlaceholders(html, mediaBlocks) {
	let result = html;
	for (const [index, block] of mediaBlocks.entries()) result = result.replaceAll(buildTelegramRichMarkdownMediaPlaceholder(index), block);
	return result;
}
function normalizeTelegramRichMarkdownMedia(markdown) {
	const lines = markdown.split("\n");
	const out = [];
	const mediaBlocks = [];
	let inFence = false;
	for (const line of lines) {
		if (/^[ \t]*(?:```|~~~)/.test(line)) {
			inFence = !inFence;
			out.push(line);
			continue;
		}
		const match = inFence ? null : TELEGRAM_MARKDOWN_MEDIA_BLOCK_PATTERN.exec(line);
		if (inFence) {
			out.push(line);
			continue;
		}
		if (!match) {
			out.push(line.replace(TELEGRAM_MARKDOWN_INLINE_IMAGE_PATTERN, "[$1]($2)").replace(TELEGRAM_MARKDOWN_REFERENCE_IMAGE_PATTERN, "[$1][$2]"));
			continue;
		}
		const [, indent, alt, src, caption] = match;
		const img = `<img src="${escapeHtmlAttr(src)}"${alt ? ` alt="${escapeHtmlAttr(alt)}"` : ""}/>`;
		const figcaption = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
		const placeholder = buildTelegramRichMarkdownMediaPlaceholder(mediaBlocks.length);
		mediaBlocks.push(`<figure>${img}${figcaption}</figure>`);
		out.push(`${indent}${placeholder}`);
	}
	return {
		markdown: out.join("\n"),
		mediaBlocks
	};
}
function renderTelegramRichHtmlTableFallback(table) {
	const rows = [table.headers, ...table.rows];
	const columnCount = Math.max(...rows.map((row) => row.length), 0);
	const widths = Array.from({ length: columnCount }, () => 3);
	for (const row of rows) for (let index = 0; index < columnCount; index += 1) widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
	const renderRow = (row) => `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`;
	const divider = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
	return `<pre><code>${escapeHtml([
		renderRow(table.headers),
		divider,
		...table.rows.map(renderRow)
	].join("\n"))}</code></pre>\n\n`;
}
function renderTelegramRichHtmlTable(table) {
	const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
	if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT) return renderTelegramRichHtmlTableFallback(table);
	const renderCellValue = (cell) => cell ? renderTelegramHtml(cell) : "";
	const renderCell = (tag, value) => `<${tag}>${renderCellValue(value)}</${tag}>`;
	const head = table.headers.length ? `<thead><tr>${table.headerCells.map((cell) => renderCell("th", cell)).join("")}</tr></thead>` : "";
	const bodyRows = table.rowCells.map((row) => `<tr>${Array.from({ length: columnCount }, (_value, index) => renderCell("td", row[index])).join("")}</tr>`).join("");
	return `<table>${head}${bodyRows ? `<tbody>${bodyRows}</tbody>` : ""}</table>\n\n`;
}
function renderTelegramRichHtmlDocument(ir, tables) {
	if (!tables.length) return isolateTelegramRichMediaBlocks(wrapFileReferencesInHtml(preserveSupportedTelegramHtmlTags(renderTelegramHtml(ir), TELEGRAM_RICH_HTML_TAG_SUPPORT)));
	let cursor = 0;
	let html = "";
	for (const table of [...tables].toSorted((left, right) => left.placeholderOffset - right.placeholderOffset)) {
		const offset = Math.max(cursor, Math.min(table.placeholderOffset, ir.text.length));
		html += renderTelegramHtml(sliceMarkdownIR(ir, cursor, offset));
		html += renderTelegramRichHtmlTable(table);
		cursor = offset;
	}
	html += renderTelegramHtml(sliceMarkdownIR(ir, cursor, ir.text.length));
	return isolateTelegramRichMediaBlocks(wrapFileReferencesInHtml(preserveSupportedTelegramHtmlTags(html, TELEGRAM_RICH_HTML_TAG_SUPPORT)));
}
function convertTelegramRichSegmentNewlines(segment, prevStructural, nextStructural) {
	if (!segment.includes("\n")) return segment;
	return segment.replace(/\n+/g, (run, offset) => {
		const hugsPrev = offset === 0 && prevStructural;
		const hugsNext = offset + run.length === segment.length && nextStructural;
		return hugsPrev || hugsNext ? run : "<br>".repeat(run.length);
	});
}
const TELEGRAM_RICH_LITERAL_WHITESPACE_TAGS = new Set([
	"code",
	"pre",
	"tg-math",
	"tg-math-block"
]);
const TELEGRAM_RICH_LINE_BREAK_STRUCTURAL_TAGS = new Set([
	...TELEGRAM_RICH_BLOCK_HTML_TAGS,
	"caption",
	"col",
	"colgroup",
	"figcaption",
	"summary",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead"
]);
function isTelegramRichLineBreakStructuralTag(rawTag, tagName) {
	return TELEGRAM_RICH_LINE_BREAK_STRUCTURAL_TAGS.has(tagName) || tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function materializeTelegramRichHtmlLineBreaks(html) {
	if (!html.includes("\n")) return html;
	let result = "";
	let lastIndex = 0;
	let literalDepth = 0;
	let prevStructural = false;
	HTML_TAG_PATTERN.lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(html)) !== null) {
		const tagStart = match.index;
		const tagEnd = HTML_TAG_PATTERN.lastIndex;
		const rawTag = match[0];
		const isClosing = match[1] === "</";
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		const tagIsStructural = tagName === "br" || isTelegramRichLineBreakStructuralTag(rawTag, tagName);
		const segment = html.slice(lastIndex, tagStart);
		result += literalDepth > 0 ? segment : convertTelegramRichSegmentNewlines(segment, prevStructural, tagIsStructural);
		if (TELEGRAM_RICH_LITERAL_WHITESPACE_TAGS.has(tagName) && !rawTag.trimEnd().endsWith("/>")) literalDepth = isClosing ? Math.max(0, literalDepth - 1) : literalDepth + 1;
		result += rawTag;
		lastIndex = tagEnd;
		prevStructural = tagIsStructural;
	}
	const tail = html.slice(lastIndex);
	result += literalDepth > 0 ? tail : convertTelegramRichSegmentNewlines(tail, prevStructural, false);
	return result;
}
function markdownToTelegramRichHtml(markdown, options = {}) {
	const tableMode = options.tableMode ?? "block";
	const normalized = normalizeTelegramRichMarkdownMedia(markdown ?? "");
	const { ir, tables } = markdownToIRWithMeta(preserveTelegramListBoundarySpacing(normalized.markdown), {
		linkify: options.skipEntityDetection !== true,
		enableSpoilers: true,
		headingStyle: "rich",
		blockquotePrefix: "",
		tableMode
	});
	return isolateTelegramRichMediaBlocks(replaceTelegramRichMarkdownMediaPlaceholders(renderTelegramRichHtmlDocument(ir, tables), normalized.mediaBlocks));
}
const TELEGRAM_SELF_CLOSING_HTML_TAGS = TELEGRAM_VOID_HTML_TAGS;
function buildTelegramHtmlOpenPrefix(tags) {
	return tags.map((tag) => tag.openTag).join("");
}
function buildTelegramHtmlCloseSuffix(tags) {
	return tags.slice().toReversed().map((tag) => tag.closeTag).join("");
}
function buildTelegramHtmlCloseSuffixLength(tags) {
	return tags.reduce((total, tag) => total + tag.closeTag.length, 0);
}
function isTelegramRichBlockHtmlTag(rawTag, tagName) {
	return TELEGRAM_RICH_BLOCK_HTML_TAGS.has(tagName) || tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function findTelegramHtmlEntityEnd(text, start) {
	if (text[start] !== "&") return -1;
	let index = start + 1;
	if (index >= text.length) return -1;
	if (text[index] === "#") {
		index += 1;
		if (index >= text.length) return -1;
		if (text[index] === "x" || text[index] === "X") {
			index += 1;
			const hexStart = index;
			while (/[0-9A-Fa-f]/.test(text[index] ?? "")) index += 1;
			if (index === hexStart) return -1;
		} else {
			const digitStart = index;
			while (/[0-9]/.test(text[index] ?? "")) index += 1;
			if (index === digitStart) return -1;
		}
	} else {
		const nameStart = index;
		while (/[A-Za-z0-9]/.test(text[index] ?? "")) index += 1;
		if (index === nameStart) return -1;
	}
	return text[index] === ";" ? index : -1;
}
function clampToSurrogateBoundary(text, index) {
	const high = text.charCodeAt(index - 1);
	const low = text.charCodeAt(index);
	if (!(index > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return index;
	return index > 1 ? index - 1 : index + 1;
}
function findTelegramHtmlSafeSplitIndex(text, maxLength) {
	if (text.length <= maxLength) return text.length;
	return clampToSurrogateBoundary(text, findTelegramHtmlEntitySafeSplitIndex(text, Math.max(1, Math.floor(maxLength))));
}
function findTelegramHtmlEntitySafeSplitIndex(text, normalizedMaxLength) {
	const lastAmpersand = text.lastIndexOf("&", normalizedMaxLength - 1);
	if (lastAmpersand === -1) return normalizedMaxLength;
	if (lastAmpersand < text.lastIndexOf(";", normalizedMaxLength - 1)) return normalizedMaxLength;
	const entityEnd = findTelegramHtmlEntityEnd(text, lastAmpersand);
	if (entityEnd === -1 || entityEnd < normalizedMaxLength) return normalizedMaxLength;
	return lastAmpersand;
}
function popTelegramHtmlTag(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index]?.name === name) {
		tags.splice(index, 1);
		return;
	}
}
function splitTelegramHtmlChunks(html, limit, options = {}) {
	if (!html) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const blockLimit = options.blockLimit == null ? void 0 : Math.max(1, Math.floor(options.blockLimit));
	const mediaLimit = options.mediaLimit == null ? void 0 : Math.max(1, Math.floor(options.mediaLimit));
	if (html.length <= normalizedLimit && blockLimit === void 0 && mediaLimit === void 0) return [html];
	const chunks = [];
	const openTags = [];
	let current = "";
	let currentBlockCount = 0;
	let currentMediaCount = 0;
	let chunkHasPayload = false;
	const resetCurrent = () => {
		current = buildTelegramHtmlOpenPrefix(openTags);
		currentBlockCount = openTags.filter((tag) => tag.richBlock).length;
		currentMediaCount = openTags.filter((tag) => tag.richMedia).length;
		chunkHasPayload = false;
	};
	const flushCurrent = () => {
		if (!chunkHasPayload) return;
		chunks.push(`${current}${buildTelegramHtmlCloseSuffix(openTags)}`);
		resetCurrent();
	};
	const appendText = (segment) => {
		let remaining = segment;
		while (remaining.length > 0) {
			const available = normalizedLimit - current.length - buildTelegramHtmlCloseSuffixLength(openTags);
			if (available <= 0) {
				if (!chunkHasPayload) throw new Error(`Telegram HTML chunk limit exceeded by tag overhead (limit=${normalizedLimit})`);
				flushCurrent();
				continue;
			}
			if (remaining.length <= available) {
				current += remaining;
				chunkHasPayload = true;
				break;
			}
			const splitAt = findTelegramHtmlSafeSplitIndex(remaining, available);
			if (splitAt <= 0) {
				if (!chunkHasPayload) throw new Error(`Telegram HTML chunk limit exceeded by leading entity (limit=${normalizedLimit})`);
				flushCurrent();
				continue;
			}
			current += remaining.slice(0, splitAt);
			chunkHasPayload = true;
			remaining = remaining.slice(splitAt);
			flushCurrent();
		}
	};
	resetCurrent();
	HTML_TAG_PATTERN.lastIndex = 0;
	let lastIndex = 0;
	let match;
	while ((match = HTML_TAG_PATTERN.exec(html)) !== null) {
		const tagStart = match.index;
		const tagEnd = HTML_TAG_PATTERN.lastIndex;
		appendText(html.slice(lastIndex, tagStart));
		const rawTag = match[0];
		const isClosing = match[1] === "</";
		const tagName = normalizeLowercaseStringOrEmpty(match[2]);
		const isSelfClosing = !isClosing && (TELEGRAM_SELF_CLOSING_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>"));
		const isRichBlock = !isClosing && isTelegramRichBlockHtmlTag(rawTag, tagName);
		const isRichMedia = !isClosing && (tagName === "figure" || TELEGRAM_RICH_MEDIA_HTML_TAGS.has(tagName) && !openTags.some((tag) => tag.name === "figure"));
		if (!isClosing) {
			const nextCloseLength = isSelfClosing ? 0 : `</${tagName}>`.length;
			if (chunkHasPayload && (blockLimit !== void 0 && isRichBlock && currentBlockCount >= blockLimit || mediaLimit !== void 0 && isRichMedia && currentMediaCount >= mediaLimit || current.length + rawTag.length + buildTelegramHtmlCloseSuffixLength(openTags) + nextCloseLength > normalizedLimit)) flushCurrent();
		}
		current += rawTag;
		if (isSelfClosing) chunkHasPayload = true;
		if (isRichBlock) currentBlockCount += 1;
		if (isRichMedia) currentMediaCount += 1;
		if (isClosing) popTelegramHtmlTag(openTags, tagName);
		else if (!isSelfClosing) openTags.push({
			name: tagName,
			openTag: rawTag,
			closeTag: `</${tagName}>`,
			richBlock: isRichBlock,
			richMedia: isRichMedia
		});
		lastIndex = tagEnd;
	}
	appendText(html.slice(lastIndex));
	flushCurrent();
	return chunks.length > 0 ? chunks : [html];
}
function renderTelegramChunkHtml(ir) {
	return wrapFileReferencesInHtml(preserveSupportedTelegramHtmlTags(renderTelegramHtml(ir)));
}
function renderTelegramChunksWithinHtmlLimit(ir, limit) {
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit,
		renderChunk: renderTelegramChunkHtml,
		measureRendered: (html) => html.length
	}).map(({ source, rendered }) => ({
		html: rendered,
		text: source.text
	}));
}
function markdownToTelegramChunks(markdown, limit, options = {}) {
	return renderTelegramChunksWithinHtmlLimit(markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
		linkify: true,
		enableSpoilers: true,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode: options.tableMode
	}), limit);
}
function markdownToTelegramHtmlChunks(markdown, limit, options = {}) {
	return markdownToTelegramChunks(markdown, limit, options).map((chunk) => chunk.html);
}
//#endregion
export { markdownToTelegramHtmlChunks as a, renderTelegramHtmlText as c, telegramHtmlToPlainTextFallback as d, wrapFileReferencesInHtml as f, markdownToTelegramHtml as i, sanitizeTelegramRichHtml as l, limitTelegramRichHtmlNesting as n, markdownToTelegramRichHtml as o, markdownToTelegramChunks as r, materializeTelegramRichHtmlLineBreaks as s, escapeTelegramHtml as t, splitTelegramHtmlChunks as u };
