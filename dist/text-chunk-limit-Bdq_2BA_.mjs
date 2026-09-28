import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { n as firstDefined } from "./allow-from-Dq2DvsNl.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as findGraphemeChunkEnd } from "./grapheme-CS7DlGGi.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import { f as resolveToolsBySender, t as resolveChannelGroupPolicy } from "./group-policy-CsBeuTe8.mjs";
import { c as resolveTextChunkLimit } from "./chunk-D0NagiTt.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-DO7ZNLRi.mjs";
import { a as markdownToIR, b as tokenizeHtmlTags, l as sliceMarkdownIR, o as markdownToIRWithMeta } from "./ir-CdrgmCrl.mjs";
import "./reply-chunking-DVKHfn6G.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { a as FormatCapabilityProfile, i as renderMarkdownIRChunksWithinLimit, n as renderMarkdownWithMarkers, t as chunkTextForOutbound } from "./text-chunking-zFGQSbFt.mjs";
import { n as isAutoLinkedFileRef, t as FILE_REF_EXTENSIONS_WITH_TLD } from "./auto-linked-file-ref-BHX9Hf63.mjs";
import "./channel-policy-DjBYx8KH.mjs";
import "./access-groups-Brlf3mfl.mjs";
import { a as resolveDefaultTelegramAccountId } from "./accounts-ByNW1Cs3.mjs";
import { a as normalizeTelegramLookupTarget, s as parseTelegramTarget } from "./topic-conversation-BlxRQJEK.mjs";
//#region extensions/telegram/src/group-config-helpers.ts
function resolveTelegramScopedGroupConfig(telegramCfg, chatId, messageThreadId) {
	const resolveTopicConfig = (scopedConfig) => {
		if (!scopedConfig || messageThreadId == null) return;
		const defaultConfig = scopedConfig.topics?.["*"];
		const exactConfig = scopedConfig.topics?.[String(messageThreadId)];
		if (defaultConfig && exactConfig) return {
			...defaultConfig,
			...exactConfig
		};
		return exactConfig ?? defaultConfig;
	};
	const chatIdStr = String(chatId);
	const scopedConfigs = chatIdStr.startsWith("-") ? telegramCfg.groups : telegramCfg.direct;
	const tree = { scopes: scopedConfigs ?? {} };
	const groupKey = Object.hasOwn(tree.scopes, chatIdStr) ? chatIdStr : Object.hasOwn(tree.scopes, "*") ? "*" : void 0;
	const matchKey = (groupKey ? [groupKey] : [])[0];
	const groupConfig = matchKey ? scopedConfigs?.[matchKey] : void 0;
	return {
		groupConfig,
		topicConfig: resolveTopicConfig(groupConfig)
	};
}
function resolveTelegramGroupIngestEnabled(params) {
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy({
		cfg: params.cfg,
		channel: "telegram",
		groupId: String(params.chatId),
		accountId: params.accountId
	});
	return (params.topicConfig?.ingest ?? groupConfig?.ingest ?? defaultConfig?.ingest) === true;
}
function resolveTelegramGroupPromptSettings(params) {
	const skillFilter = firstDefined(params.topicConfig?.skills, params.groupConfig?.skills);
	const systemPromptParts = [params.groupConfig?.systemPrompt?.trim() || null, params.topicConfig?.systemPrompt?.trim() || null].filter((entry) => Boolean(entry));
	return {
		skillFilter,
		groupSystemPrompt: systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : void 0
	};
}
function resolveTelegramDirectToolPolicy(params) {
	return resolveToolsBySender({
		toolsBySender: params.directConfig?.toolsBySender,
		messageProvider: "telegram",
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername
	}) ?? params.directConfig?.tools;
}
//#endregion
//#region extensions/telegram/src/normalize.ts
const TELEGRAM_PREFIX_RE = /^(telegram|tg):/i;
function normalizeTelegramTargetBody(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const prefixStripped = trimmed.replace(TELEGRAM_PREFIX_RE, "").trim();
	if (!prefixStripped) return;
	const identity = resolveTelegramTargetIdentity(trimmed);
	if (!identity) return;
	const keepLegacyGroupPrefix = /^group:/i.test(prefixStripped);
	const hasTopicSuffix = /:topic:\d+$/i.test(prefixStripped);
	const chatSegment = keepLegacyGroupPrefix ? `group:${identity.chatId}` : identity.chatId;
	if (identity.directMessagesTopicId != null) return `${chatSegment}:direct-topic:${identity.directMessagesTopicId}`;
	if (identity.messageThreadId == null) return chatSegment;
	return `${chatSegment}${hasTopicSuffix ? `:topic:${identity.messageThreadId}` : `:${identity.messageThreadId}`}`;
}
function resolveTelegramTargetIdentity(raw) {
	const parsed = parseTelegramTarget(raw);
	const chatId = normalizeTelegramLookupTarget(parsed.chatId);
	if (!chatId) return;
	return {
		chatId: normalizeLowercaseStringOrEmpty(chatId),
		messageThreadId: parsed.messageThreadId,
		directMessagesTopicId: parsed.directMessagesTopicId
	};
}
function normalizeTelegramMessagingTarget(raw) {
	const normalizedBody = normalizeTelegramTargetBody(raw);
	if (!normalizedBody) return;
	return normalizeLowercaseStringOrEmpty(`telegram:${normalizedBody}`);
}
function looksLikeTelegramTargetId(raw) {
	return normalizeTelegramTargetBody(raw) !== void 0;
}
function telegramMessagingTargetsMatch(target, currentTarget) {
	const targetIdentity = resolveTelegramTargetIdentity(target);
	const currentIdentity = resolveTelegramTargetIdentity(currentTarget);
	return targetIdentity !== void 0 && currentIdentity !== void 0 && targetIdentity.chatId === currentIdentity.chatId && targetIdentity.messageThreadId === currentIdentity.messageThreadId && targetIdentity.directMessagesTopicId === currentIdentity.directMessagesTopicId;
}
//#endregion
//#region extensions/telegram/src/format-html.ts
function escapeTelegramHtml(text) {
	if (!/[&<>]/.test(text)) return text;
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeTelegramHtmlAttr(text) {
	return escapeTelegramHtml(text).replace(/"/g, "&quot;");
}
const TELEGRAM_HTML_ENTITY_PATTERN = /&(#(?:[xX][0-9A-Fa-f]+|\d+)|[A-Za-z0-9]+);/g;
const TELEGRAM_HTML_ENTITY_AT = new RegExp(TELEGRAM_HTML_ENTITY_PATTERN.source, "y");
const TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS = /* @__PURE__ */ new Set([
	"aside",
	"audio",
	"blockquote",
	"caption",
	"col",
	"colgroup",
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
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tg-collage",
	"tg-map",
	"tg-math-block",
	"tg-slideshow",
	"tr",
	"ul",
	"video"
]);
function isTelegramRichLineBreakStructuralTag(rawTag, tagName) {
	return TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS.has(tagName) || tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function isValidTelegramHtmlEntityCodePoint(codePoint) {
	return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 1114111 && !(codePoint >= 55296 && codePoint <= 57343);
}
function decodeTelegramHtmlEntity(entity, fallback) {
	if (entity.startsWith("#x") || entity.startsWith("#X")) {
		const codePoint = Number.parseInt(entity.slice(2), 16);
		return isValidTelegramHtmlEntityCodePoint(codePoint) ? String.fromCodePoint(codePoint) : fallback;
	}
	if (entity.startsWith("#")) {
		const codePoint = Number.parseInt(entity.slice(1), 10);
		return isValidTelegramHtmlEntityCodePoint(codePoint) ? String.fromCodePoint(codePoint) : fallback;
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
function findTelegramHtmlEntityEnd(text, start) {
	TELEGRAM_HTML_ENTITY_AT.lastIndex = start;
	return TELEGRAM_HTML_ENTITY_AT.exec(text)?.index === start ? TELEGRAM_HTML_ENTITY_AT.lastIndex - 1 : -1;
}
function mapTelegramHtmlTextOffset(entities, offset, to) {
	let low = 0;
	let high = entities.length;
	while (low < high) {
		const middle = low + high >>> 1;
		const candidate = expectDefined(entities[middle], "Telegram HTML entity binary-search midpoint");
		if ((to === "source" ? candidate.decodedStart : candidate.sourceStart) <= offset) low = middle + 1;
		else high = middle;
	}
	const entity = entities[low - 1];
	if (!entity) return offset;
	const fromEnd = to === "source" ? entity.decodedEnd : entity.sourceEnd;
	const toStart = to === "source" ? entity.sourceStart : entity.decodedStart;
	const toEnd = to === "source" ? entity.sourceEnd : entity.decodedEnd;
	return offset < fromEnd ? toStart : toEnd + offset - fromEnd;
}
function findTelegramHtmlWordSafeSplitIndex(text, start, end) {
	let lastNewline = start;
	let lastWhitespace = start;
	for (let index = start + 1; index < end; index += 1) {
		const char = text[index];
		if (char === "\n") lastNewline = index + 1;
		else if (char !== void 0 && /\s/.test(char)) lastWhitespace = index + 1;
	}
	return lastNewline > start ? lastNewline : lastWhitespace;
}
/** Prepares one text segment; returned cuts are offsets in its original HTML spelling. */
function prepareTelegramHtmlTextSplitter(source) {
	const entities = [];
	const parts = [];
	let sourceOffset = 0;
	let decodedLength = 0;
	for (const match of source.matchAll(TELEGRAM_HTML_ENTITY_PATTERN)) {
		const sourceEnd = match.index + match[0].length;
		const prefix = source.slice(sourceOffset, match.index);
		const decodedEntity = decodeTelegramHtmlEntity(match[0].slice(1, -1), "&");
		parts.push(prefix, decodedEntity);
		decodedLength += prefix.length;
		entities.push({
			sourceStart: match.index,
			sourceEnd,
			decodedStart: decodedLength,
			decodedEnd: decodedLength + decodedEntity.length
		});
		decodedLength += decodedEntity.length;
		sourceOffset = sourceEnd;
	}
	parts.push(source.slice(sourceOffset));
	const decoded = entities.length > 0 ? parts.join("") : source;
	return (start, maxLength, allowPartialGrapheme) => {
		const sourceEnd = start + maxLength;
		const preferredEnd = findTelegramHtmlWordSafeSplitIndex(source, start, sourceEnd);
		return mapTelegramHtmlTextOffset(entities, findGraphemeChunkEnd(decoded, mapTelegramHtmlTextOffset(entities, start, "decoded"), mapTelegramHtmlTextOffset(entities, sourceEnd, "decoded"), mapTelegramHtmlTextOffset(entities, preferredEnd, "decoded"), allowPartialGrapheme), "source");
	};
}
//#endregion
//#region extensions/telegram/src/format-assistant-transcript.ts
const TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX = "<code>Assistant:</code> ";
function maskTelegramExcludedText(text) {
	return text.split("\n").map((line) => line.trim() ? `x${" ".repeat(Math.max(0, line.length - 1))}` : " ".repeat(line.length)).join("\n");
}
function maskTelegramExcludedRanges(projection) {
	let masked = "";
	let cursor = 0;
	for (const range of projection.excludedRanges) {
		masked += projection.text.slice(cursor, range.start);
		masked += maskTelegramExcludedText(projection.text.slice(range.start, range.end));
		cursor = range.end;
	}
	return masked + projection.text.slice(cursor);
}
function telegramProjectionHasRoleHeader(projection) {
	if (!projection.text.includes("[") && !projection.text.includes("<") && !projection.text.includes("&")) return false;
	return Boolean(markdownToIR(maskTelegramExcludedRanges(projection), {
		assistantTranscriptRoleHeaders: true,
		autolink: false,
		blockquotePrefix: "",
		headingStyle: "none",
		linkify: false,
		tableMode: "off"
	}).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"));
}
function appendTelegramHtmlVisibleValue(projection, value, excluded) {
	if (!value) return;
	const start = projection.text.length;
	projection.text += value;
	if (!excluded) return;
	const previous = projection.excludedRanges.at(-1);
	if (previous?.end === start) previous.end = projection.text.length;
	else projection.excludedRanges.push({
		start,
		end: projection.text.length
	});
}
function appendTelegramHtmlVisibleSegment(projection, segment, excluded) {
	appendTelegramHtmlVisibleValue(projection, decodeTelegramHtmlEntities(segment), excluded);
}
function projectTelegramHtmlVisibleText(html) {
	const projection = {
		text: "",
		excludedRanges: []
	};
	let codeDepth = 0;
	let preDepth = 0;
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		appendTelegramHtmlVisibleSegment(projection, html.slice(lastIndex, tagStart), codeDepth > 0 || preDepth > 0);
		const rawTag = tag.raw;
		const tagName = tag.name;
		const isClosing = tag.closing;
		const isSelfClosing = tag.selfClosing;
		if (isTelegramRichLineBreakStructuralTag(rawTag, tagName) && projection.text && !projection.text.endsWith("\n")) appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
		if (tagName === "br" && !isClosing) appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
		if (!isSelfClosing && tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (!isSelfClosing && tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		lastIndex = tagEnd;
	}
	appendTelegramHtmlVisibleSegment(projection, html.slice(lastIndex), codeDepth > 0 || preDepth > 0);
	return projection;
}
function protectTelegramAssistantTranscriptRoleHeaders(html) {
	if (html.startsWith("<code>Assistant:</code> ")) return html;
	if (!telegramProjectionHasRoleHeader(projectTelegramHtmlVisibleText(html))) return html;
	return `${TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX}${html}`;
}
//#endregion
//#region extensions/telegram/src/format-render.ts
function renderTelegramMarkdownIR(ir, options) {
	return renderMarkdownWithMarkers(ir, {
		annotationMarkers: { assistant_transcript_role: {
			open: "<code>",
			close: "</code>",
			suppressNestedFormatting: true
		} },
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
				open: options.buildCodeBlockOpen,
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
		escapeText: options.escapeText,
		buildLink: options.buildLink
	});
}
//#endregion
//#region extensions/telegram/src/text-width.ts
const TELEGRAM_GRAPHEME_SEGMENTER = new Intl.Segmenter(void 0, { granularity: "grapheme" });
const TELEGRAM_WIDE_CODE_POINT_PATTERN = /[\u1100-\u115F\u2E80-\u9FFF\uA000-\uA4FF\uAC00-\uD7AF\uF900-\uFAFF\uFE30-\uFE4F\uFF01-\uFF60\uFFE0-\uFFE6\u{20000}-\u{2FA1F}]/u;
const EMOJI_PRESENTATION_PATTERN = /\p{Emoji_Presentation}/u;
const EXTENDED_PICTOGRAPHIC_PATTERN = /\p{Extended_Pictographic}/u;
const NON_PRINTING_ONLY_PATTERN = /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Format}|\p{Mark})+$/u;
const EMOJI_PRESENTATION_SELECTOR = "️";
const KEYCAP_COMBINING_MARK = "⃣";
function telegramMonospaceGraphemeWidth(grapheme) {
	if (grapheme.includes(KEYCAP_COMBINING_MARK) || EMOJI_PRESENTATION_PATTERN.test(grapheme) || grapheme.includes(EMOJI_PRESENTATION_SELECTOR) && EXTENDED_PICTOGRAPHIC_PATTERN.test(grapheme)) return 2;
	if (TELEGRAM_WIDE_CODE_POINT_PATTERN.test(grapheme)) return 2;
	return NON_PRINTING_ONLY_PATTERN.test(grapheme) ? 0 : 1;
}
function telegramMonospaceWidth(text) {
	let width = 0;
	for (const { segment } of TELEGRAM_GRAPHEME_SEGMENTER.segment(text)) width += telegramMonospaceGraphemeWidth(segment);
	return width;
}
function padTelegramMonospaceCell(text, width) {
	return `${text}${" ".repeat(Math.max(0, width - telegramMonospaceWidth(text)))}`;
}
function renderTelegramMonospaceGrid(rows, options = {}) {
	const columnCount = Math.max(...rows.map((row) => row.length), 0);
	const widths = Array.from({ length: columnCount }, () => 3);
	for (const row of rows) for (let index = 0; index < columnCount; index += 1) widths[index] = Math.max(widths[index] ?? 3, telegramMonospaceWidth(row[index] ?? ""));
	const renderRow = (row) => `| ${widths.map((width, index) => padTelegramMonospaceCell(row[index] ?? "", width)).join(" | ")} |`;
	const lines = rows.map(renderRow);
	if (options.headerSeparator && lines.length > 0) lines.splice(1, 0, `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`);
	return lines.join("\n");
}
//#endregion
//#region extensions/telegram/src/format.ts
function isTelegramRichLinkHref$1(href) {
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
function buildTelegramLink(link, text, context) {
	const href = link.href.trim();
	if (!href) return null;
	if (link.start === link.end) return null;
	if (!isTelegramRichLinkHref$1(href)) return null;
	const label = text.slice(link.start, link.end);
	if (context.origin === "linkify" && isAutoLinkedFileRef(href, label)) return null;
	const safeHref = escapeTelegramHtmlAttr(href);
	return {
		start: link.start,
		end: link.end,
		open: `<a href="${safeHref}">`,
		close: "</a>"
	};
}
function buildTelegramCodeBlockOpen(span) {
	if (!span.language) return "<pre><code>";
	return `<pre><code class="language-${escapeTelegramHtmlAttr(span.language)}">`;
}
function renderTelegramHtml(ir) {
	return renderTelegramMarkdownIR(ir, {
		escapeText: escapeTelegramHtml,
		buildLink: buildTelegramLink,
		buildCodeBlockOpen: buildTelegramCodeBlockOpen
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
function shouldPreserveTelegramListBoundarySpacing(previous, next) {
	return isTelegramBulletLine(previous) && isTelegramListBoundaryLine(next) && leadingWhitespaceLength(next) <= leadingWhitespaceLength(previous);
}
function preserveTelegramListBoundarySpacing(markdown) {
	let codeRegions;
	let previousLine = "";
	let previousOffset = 0;
	let offset = 0;
	return markdown.split("\n").map((line) => {
		const normalizedLine = line.replace(/\r$/, "");
		const insertBoundary = shouldPreserveTelegramListBoundarySpacing(previousLine, normalizedLine) && !isInsideCode(previousOffset, codeRegions ??= findCodeRegions(markdown)) && !isInsideCode(offset, codeRegions);
		previousLine = normalizedLine;
		previousOffset = offset;
		offset += line.length + 1;
		return insertBoundary ? `\n${line}` : line;
	}).join("\n");
}
function parseTelegramLegacyMarkdown(markdown, tableMode) {
	return markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
		assistantTranscriptRoleHeaders: true,
		linkify: true,
		enableSpoilers: true,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode: tableMode === "block" ? "code" : tableMode
	});
}
function markdownToTelegramHtml(markdown, options = {}) {
	const telegramHtml = renderSupportedTelegramHtml(renderTelegramHtml(parseTelegramLegacyMarkdown(markdown, options.tableMode)));
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
const HTML_MODE_TAG_PATTERN = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>$/;
const ESCAPED_HTML_TAG_PATTERN = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)&gt;/g;
const TELEGRAM_HTML_ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const TELEGRAM_HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const TELEGRAM_HTML_TAG_PATTERN = /<[^>]*>/g;
const TELEGRAM_RICH_HTML_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const TELEGRAM_HTML_CAPTION_PATTERN = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i;
const TELEGRAM_HTML_COLSPAN_PATTERN = /(?:^|\s)colspan\s*=\s*(['"]?)\s*(\d+)\s*\1(?=\s|$)/i;
const TELEGRAM_SIMPLE_HTML_TAGS = /* @__PURE__ */ new Set([
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
const TELEGRAM_ATTR_HTML_TAG_PATTERNS = /* @__PURE__ */ new Map([
	["a", /^\s+href="[^"]+"\s*$/],
	["span", /^\s+class="tg-spoiler"\s*$/],
	["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
	["tg-time", /^\s+unix="[1-9]\d*"(?:\s+format="(?:r|w?[dD]?[tT]?)")?\s*$/],
	["blockquote", /^(\s+expandable)?\s*$/]
]);
const TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN = /^\s+class="language-[^"]+"\s*$/;
const TELEGRAM_LEGACY_HTML_TAG_SUPPORT = {
	simpleTags: TELEGRAM_SIMPLE_HTML_TAGS,
	attrPatterns: TELEGRAM_ATTR_HTML_TAG_PATTERNS
};
let fileReferencePattern;
let orphanedTldPattern;
function popLastTagName(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index] === name) {
		tags.splice(index, 1);
		return true;
	}
	return false;
}
function isSupportedTelegramHtmlTag(closing, name, attrs, support) {
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
	if (!isSupportedTelegramHtmlTag(closing, tagName, attrs, support)) return escapeTag(rawTag);
	if (closing) return popLastTagName(openTags, tagName) ? rawTag : escapeTag(rawTag);
	if (rawTag.trimEnd().endsWith("/>")) return rawTag;
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
				result += preserveTelegramHtmlTag(rawTag, openTags, escapeTelegramHtml, support);
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
function stripTelegramHtmlForPlainText(html) {
	return decodeTelegramHtmlEntities(html.replace(TELEGRAM_HTML_BREAK_PATTERN, "\n").replace(TELEGRAM_HTML_TAG_PATTERN, ""));
}
function countTelegramHtmlVisibleCharacters(html) {
	return stripTelegramHtmlForPlainText(html).length;
}
function resolveTelegramHtmlVisibleText(html) {
	return stripTelegramHtmlForPlainText(html);
}
function telegramHtmlToPlainTextFallback(html) {
	const withPlainTables = html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
		return parseTelegramRichHtmlTableRows(tableHtml).map((row) => row.join(" | ")).join("\n");
	});
	TELEGRAM_HTML_ANCHOR_PATTERN.lastIndex = 0;
	return stripTelegramHtmlForPlainText(withPlainTables.replace(TELEGRAM_HTML_ANCHOR_PATTERN, (_match, doubleQuotedHref, singleQuotedHref, unquotedHref, labelHtml) => {
		const href = decodeTelegramHtmlEntities(doubleQuotedHref ?? singleQuotedHref ?? unquotedHref ?? "").trim();
		const label = stripTelegramHtmlForPlainText(labelHtml).trim();
		if (!href) return escapeTelegramHtml(label);
		return escapeTelegramHtml(!label || label === href ? href : `${label} (${href})`);
	}));
}
function promoteEscapedSupportedTelegramTags(text, openTags, support) {
	ESCAPED_HTML_TAG_PATTERN.lastIndex = 0;
	return text.replace(ESCAPED_HTML_TAG_PATTERN, (match, closing, name, attrs) => preserveTelegramHtmlTag(`<${closing}${name}${attrs}>`, openTags, () => match, support));
}
function preserveSupportedTelegramHtmlTags(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	if (!html.includes("&lt;")) return html;
	let codeDepth = 0;
	let preDepth = 0;
	let result = "";
	let lastIndex = 0;
	const openEscapedTags = [];
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		const tagName = tag.name;
		const isClosing = tag.closing;
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
function renderSupportedTelegramHtml(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	return protectTelegramAssistantTranscriptRoleHeaders(preserveSupportedTelegramHtmlTags(html, support));
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
	return `${prefix}<code>${escapeTelegramHtml(filename)}</code>`;
}
function wrapSegmentFileRefs(text, codeDepth, preDepth, anchorDepth) {
	if (codeDepth > 0 || preDepth > 0 || anchorDepth > 0 || !text.includes(".")) return text;
	return text.replace(getFileReferencePattern(), wrapStandaloneFileRef).replace(getOrphanedTldPattern(), (match, prefix, tld) => prefix === ">" ? match : `${prefix}<code>${escapeTelegramHtml(tld)}</code>`);
}
function wrapFileReferencesInHtml(html) {
	let codeDepth = 0;
	let preDepth = 0;
	let anchorDepth = 0;
	let result = "";
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		const isClosing = tag.closing;
		const tagName = tag.name;
		const textBefore = html.slice(lastIndex, tagStart);
		result += wrapSegmentFileRefs(textBefore, codeDepth, preDepth, anchorDepth);
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		else if (tagName === "a") anchorDepth = isClosing ? Math.max(0, anchorDepth - 1) : anchorDepth + 1;
		result += html.slice(tagStart, tagEnd);
		lastIndex = tagEnd;
	}
	const remainingText = html.slice(lastIndex);
	result += wrapSegmentFileRefs(remainingText, codeDepth, preDepth, anchorDepth);
	return result;
}
function renderTelegramHtmlText(text, options = {}) {
	if ((options.textMode ?? "markdown") === "html") return escapeUnsupportedTelegramHtmlWithTableFallback(text);
	return markdownToTelegramHtml(text, { tableMode: options.tableMode });
}
function escapeUnsupportedTelegramHtmlWithTableFallback(html) {
	return escapeUnsupportedTelegramHtml(normalizeTelegramLegacyHtmlTables(html), TELEGRAM_LEGACY_HTML_TAG_SUPPORT);
}
function normalizeTelegramLegacyHtmlTables(html) {
	const tags = tokenizeHtmlTags(html);
	const depth = {
		code: 0,
		pre: 0
	};
	let nextTag;
	TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
	return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml, offset) => {
		nextTag ??= tags.next();
		while (!nextTag.done && nextTag.value.start < offset) {
			const { name, closing } = nextTag.value;
			if (name === "code" || name === "pre") depth[name] = closing ? Math.max(0, depth[name] - 1) : depth[name] + 1;
			nextTag = tags.next();
		}
		if (depth.code > 0 || depth.pre > 0) return tableHtml;
		const rows = parseTelegramRichHtmlTableRows(tableHtml);
		return rows.length ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
	});
}
function parseTelegramHtmlColspan(attrs) {
	const raw = TELEGRAM_HTML_COLSPAN_PATTERN.exec(attrs)?.[2];
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
	return `<pre><code>${escapeTelegramHtml([rows.length > 0 ? telegramHtmlToPlainTextFallback(TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "").trim() : "", rows.length > 0 ? renderTelegramMonospaceGrid(rows) : stripTelegramHtmlForPlainText(tableHtml).trim()].filter(Boolean).join("\n"))}</code></pre>\n\n`;
}
function buildTelegramHtmlOpenPrefix(tags) {
	return tags.map((tag) => tag.openTag).join("");
}
function buildTelegramHtmlCloseSuffix(tags) {
	return tags.slice().toReversed().map((tag) => tag.closeTag).join("");
}
function buildTelegramHtmlCloseSuffixLength(tags) {
	return tags.reduce((total, tag) => total + tag.closeTag.length, 0);
}
function popTelegramHtmlTag(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index]?.name === name) {
		tags.splice(index, 1);
		return;
	}
}
function splitTelegramHtmlChunksRaw(html, normalizedLimit) {
	if (!html) return [];
	if (html.length <= normalizedLimit) return [html];
	const chunks = [];
	const openTags = [];
	const suppressedTagNames = [];
	let current = "";
	let chunkHasPayload = false;
	const resetCurrent = () => {
		current = buildTelegramHtmlOpenPrefix(openTags);
		chunkHasPayload = false;
	};
	const flushCurrent = () => {
		if (!chunkHasPayload) return;
		chunks.push(`${current}${buildTelegramHtmlCloseSuffix(openTags)}`);
		resetCurrent();
	};
	const appendText = (segment) => {
		let findSplitIndex;
		let start = 0;
		while (start < segment.length) {
			const available = normalizedLimit - current.length - buildTelegramHtmlCloseSuffixLength(openTags);
			let splitAt = start;
			if (available > 0) {
				if (segment.length - start <= available) splitAt = segment.length;
				else {
					findSplitIndex ??= prepareTelegramHtmlTextSplitter(segment);
					splitAt = findSplitIndex(start, available, current.length === 0);
				}
			}
			if (chunkHasPayload && splitAt <= start) {
				flushCurrent();
				continue;
			}
			if (current.length > 0 && (splitAt <= start || splitAt - start > available)) {
				suppressedTagNames.push(...openTags.map((tag) => tag.name));
				openTags.length = 0;
				resetCurrent();
				continue;
			}
			if (splitAt <= start) throw new Error(`Telegram HTML chunk limit exceeded by leading entity (limit=${normalizedLimit})`);
			current += segment.slice(start, splitAt);
			chunkHasPayload = true;
			start = splitAt;
			if (start < segment.length) flushCurrent();
		}
	};
	resetCurrent();
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		appendText(html.slice(lastIndex, tagStart));
		const rawTag = tag.raw;
		const isClosing = tag.closing;
		const tagName = tag.name;
		const isSelfClosing = !isClosing && rawTag.trimEnd().endsWith("/>");
		if (!isClosing) {
			const nextCloseLength = isSelfClosing ? 0 : `</${tagName}>`.length;
			if (chunkHasPayload && current.length + rawTag.length + buildTelegramHtmlCloseSuffixLength(openTags) + nextCloseLength > normalizedLimit) flushCurrent();
		}
		const closesOpenTag = isClosing && openTags.some((openTag) => openTag.name === tagName);
		if (!(isClosing && !closesOpenTag && popLastTagName(suppressedTagNames, tagName))) current += rawTag;
		if (isSelfClosing) chunkHasPayload = true;
		if (isClosing) popTelegramHtmlTag(openTags, tagName);
		else if (!isSelfClosing) openTags.push({
			name: tagName,
			openTag: rawTag,
			closeTag: `</${tagName}>`
		});
		lastIndex = tagEnd;
	}
	appendText(html.slice(lastIndex));
	flushCurrent();
	return chunks.length > 0 ? chunks : [html];
}
function splitTelegramHtmlChunks(html, limit) {
	const normalizedLimit = Math.max(1, Math.floor(limit));
	if (Number.isNaN(normalizedLimit)) throw new TypeError("Telegram HTML chunk limit must be numeric");
	const chunks = splitTelegramHtmlChunksRaw(html, normalizedLimit);
	if (chunks.every((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk) === chunk)) return chunks;
	const protectedContentLimit = normalizedLimit - 24;
	if (protectedContentLimit < 1) throw new Error(`Telegram HTML chunk limit cannot fit assistant transcript marker (limit=${normalizedLimit})`);
	return splitTelegramHtmlChunksRaw(html, protectedContentLimit).map((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk));
}
function renderTelegramChunkHtml(ir) {
	return wrapFileReferencesInHtml(renderSupportedTelegramHtml(renderTelegramHtml(ir)));
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
	return renderTelegramChunksWithinHtmlLimit(parseTelegramLegacyMarkdown(markdown, options.tableMode), limit);
}
function markdownToTelegramHtmlChunks(markdown, limit, options = {}) {
	return markdownToTelegramChunks(markdown, limit, options).map((chunk) => chunk.html);
}
//#endregion
//#region extensions/telegram/src/caption.ts
const TELEGRAM_MAX_CAPTION_LENGTH = 1024;
const telegramCaptionDeliveryMetadata = /* @__PURE__ */ new WeakSet();
function splitTelegramCaption(text, renderedHtml) {
	const trimmed = text?.trim() ?? "";
	if (!trimmed) return {
		caption: void 0,
		followUpText: void 0
	};
	if ((renderedHtml === void 0 ? trimmed.length : countTelegramHtmlVisibleCharacters(renderedHtml)) > 1024) return {
		caption: void 0,
		followUpText: trimmed
	};
	return {
		caption: trimmed,
		followUpText: void 0
	};
}
function resolveTelegramPlainCaption(caption, renderedHtml) {
	if (caption === void 0 || caption.length <= 1024 || renderedHtml === void 0) return caption;
	return resolveTelegramHtmlVisibleText(renderedHtml);
}
//#endregion
//#region extensions/telegram/src/inline-keyboard.ts
function toInlineKeyboardButton(button) {
	if (!button?.text) return;
	if (button.url) return button.style ? {
		text: button.text,
		url: button.url,
		style: button.style
	} : {
		text: button.text,
		url: button.url
	};
	if (button.callback_data) return button.style ? {
		text: button.text,
		callback_data: button.callback_data,
		style: button.style
	} : {
		text: button.text,
		callback_data: button.callback_data
	};
	if (button.web_app?.url) return button.style ? {
		text: button.text,
		web_app: { url: button.web_app.url },
		style: button.style
	} : {
		text: button.text,
		web_app: { url: button.web_app.url }
	};
}
function buildInlineKeyboard(buttons) {
	if (!buttons?.length) return;
	const rows = buttons.map((row) => row.map(toInlineKeyboardButton).filter((button) => Boolean(button))).filter((row) => row.length > 0);
	if (rows.length === 0) return;
	return { inline_keyboard: rows };
}
//#endregion
//#region extensions/telegram/src/prompt-context-projection.ts
function parseTranscriptMessageId(value) {
	const id = isRecord(value) ? value.transcriptMessageId : void 0;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function resolveTelegramPromptContextDeliverySignature(payload) {
	const parts = resolveSendableOutboundReplyParts(payload);
	const spokenText = payload.spokenText ?? "";
	return JSON.stringify([
		parts.text,
		parts.mediaUrls,
		payload.audioAsVoice === true,
		spokenText
	]);
}
function parseTelegramPromptContextProjection(value) {
	const transcriptMessageId = parseTranscriptMessageId(value);
	if (!transcriptMessageId || !isRecord(value)) return;
	const { partIndex, finalPart } = value;
	return typeof partIndex === "number" && Number.isSafeInteger(partIndex) && partIndex >= 0 && typeof finalPart === "boolean" ? {
		kind: "valid",
		projection: {
			transcriptMessageId,
			partIndex,
			finalPart
		}
	} : {
		kind: "invalid",
		transcriptMessageId
	};
}
function resolveTelegramPromptContextSource(payload) {
	const telegram = payload.channelData?.telegram;
	const taggedSource = isRecord(telegram) ? telegram.promptContextSource : void 0;
	const transcriptMessageId = parseTranscriptMessageId(taggedSource);
	const deliverySignature = isRecord(taggedSource) ? taggedSource.deliverySignature : void 0;
	return transcriptMessageId && deliverySignature === resolveTelegramPromptContextDeliverySignature(payload) ? { transcriptMessageId } : void 0;
}
function withTelegramPromptContextSource(payload, source) {
	if (!source) return payload;
	const telegram = payload.channelData?.telegram;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		channelData: {
			...payload.channelData,
			telegram: {
				...isRecord(telegram) ? telegram : {},
				promptContextSource: {
					...source,
					deliverySignature: resolveTelegramPromptContextDeliverySignature(payload)
				}
			}
		}
	});
}
function createTelegramPromptContextProjectionCursor(source) {
	return {
		source,
		nextPartIndex: 0,
		complete: true,
		invalidate() {
			this.complete = false;
		},
		take(finalPart) {
			return {
				...this.source,
				partIndex: this.nextPartIndex++,
				finalPart: this.complete && finalPart
			};
		}
	};
}
function createTelegramPromptContextProjectionSequence(params) {
	let cursor = params.source ? createTelegramPromptContextProjectionCursor(params.source) : void 0;
	let pending;
	let started = false;
	const invalidate = () => cursor?.invalidate();
	const flush = async (finalPart) => {
		if (!pending) return;
		const record = pending;
		pending = void 0;
		const projection = cursor?.take(finalPart);
		if (!await params.record({
			...record,
			...projection ? { projection } : {}
		})) invalidate();
	};
	return {
		get source() {
			return cursor?.source;
		},
		isFresh: () => !started && (cursor?.complete ?? true),
		async accept(record) {
			started = true;
			await flush(false);
			pending = record;
		},
		finish: () => flush(true),
		invalidate,
		detach() {
			invalidate();
			cursor = void 0;
		},
		async fail() {
			invalidate();
			await flush(false);
		}
	};
}
function resolveCompleteTelegramPromptContextProjectionIds(markers) {
	const grouped = /* @__PURE__ */ new Map();
	for (const marker of markers) {
		if (!marker) continue;
		const id = marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId;
		if (marker.kind === "invalid") grouped.set(id, void 0);
		else if (grouped.get(id) !== void 0 || !grouped.has(id)) grouped.set(id, [...grouped.get(id) ?? [], marker.projection]);
	}
	const complete = /* @__PURE__ */ new Set();
	for (const [id, parts] of grouped) {
		const ordered = parts?.toSorted((left, right) => left.partIndex - right.partIndex);
		if (ordered?.every((part, index) => part.partIndex === index && part.finalPart === (index === ordered.length - 1))) complete.add(id);
	}
	return complete;
}
//#endregion
//#region extensions/telegram/src/rich-block-model.ts
function normalizeRichText(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		const flattened = [];
		for (const item of value) {
			const normalized = normalizeRichText(item);
			if (normalized === "") continue;
			if (Array.isArray(normalized)) flattened.push(...normalized);
			else flattened.push(normalized);
		}
		if (flattened.length === 0) return "";
		if (flattened.length === 1) return flattened[0] ?? "";
		return flattened;
	}
	if (value.type === "mathematical_expression" || value.type === "custom_emoji") return value;
	return {
		...value,
		text: normalizeRichText(value.text)
	};
}
function countRichTextChars(text) {
	if (typeof text === "string") return text.length;
	if (Array.isArray(text)) return text.reduce((total, part) => total + countRichTextChars(part), 0);
	if (text.type === "mathematical_expression") return text.expression.length;
	if (text.type === "custom_emoji") return text.alternative_text.length;
	return countRichTextChars(text.text);
}
function measureRichBlockText(text, size, depth) {
	if (typeof text === "string") size.chars += text.length;
	else if (Array.isArray(text)) for (const part of text) measureRichBlockText(part, size, depth);
	else if (text.type === "mathematical_expression") size.chars += text.expression.length;
	else if (text.type === "custom_emoji") size.chars += text.alternative_text.length;
	else {
		if (depth >= size.nesting) size.nesting = depth + 1;
		measureRichBlockText(text.text, size, depth + 1);
	}
}
function measureRichBlockCaption(caption, size, depth) {
	if (caption) {
		if (depth > size.nesting) size.nesting = depth;
		measureRichBlockText(caption.text, size, depth);
		if (caption.credit) measureRichBlockText(caption.credit, size, depth);
	}
}
function measureRichBlockChildren(children, size, depth) {
	if (depth > size.nesting) size.nesting = depth;
	for (const block of children) {
		size.blocks += 1;
		switch (block.type) {
			case "paragraph":
			case "heading":
			case "footer":
				measureRichBlockText(block.text, size, depth);
				break;
			case "pre":
				size.chars += block.text.length;
				break;
			case "mathematical_expression":
				size.chars += block.expression.length;
				break;
			case "pullquote":
				measureRichBlockText(block.text, size, depth);
				if (block.credit) measureRichBlockText(block.credit, size, depth);
				break;
			case "blockquote":
				measureRichBlockChildren(block.blocks, size, depth + 1);
				if (block.credit) measureRichBlockText(block.credit, size, depth + 1);
				break;
			case "details":
				measureRichBlockChildren(block.blocks, size, depth + 1);
				measureRichBlockText(block.summary, size, depth + 1);
				break;
			case "collage":
			case "slideshow":
				measureRichBlockChildren(block.blocks, size, depth + 1);
				measureRichBlockCaption(block.caption, size, depth + 1);
				break;
			case "list":
				size.blocks += block.items.length;
				if (depth >= size.nesting) size.nesting = depth + 1;
				for (const item of block.items) measureRichBlockChildren(item.blocks, size, depth + 1);
				break;
			case "table":
				size.blocks += block.cells.length;
				if (depth >= size.nesting) size.nesting = depth + 1;
				if (block.caption) measureRichBlockText(block.caption, size, depth + 1);
				for (const row of block.cells) for (const cell of row) {
					const text = cell.text;
					if (text) measureRichBlockText(text, size, depth + 1);
				}
				break;
			case "photo":
			case "video":
			case "audio":
			case "animation":
			case "voice_note":
				size.media += 1;
				measureRichBlockCaption(block.caption, size, depth + 1);
				break;
			case "map": measureRichBlockCaption(block.caption, size, depth + 1);
		}
	}
}
/** Bot API budgets: UTF-16 text, nested blocks/items/rows, media, and formatting edges. */
function measureInputRichBlocks(blocks) {
	const size = {
		chars: 0,
		blocks: 0,
		media: 0,
		nesting: 0
	};
	measureRichBlockChildren(blocks, size, 0);
	return size;
}
function richTextToPlainString(text) {
	if (typeof text === "string") return text;
	if (Array.isArray(text)) return text.map(richTextToPlainString).join("");
	if (text.type === "mathematical_expression") return text.expression;
	if (text.type === "custom_emoji") return text.alternative_text;
	return richTextToPlainString(text.text);
}
function captionToPlainText(caption) {
	if (!caption) return "";
	const credit = caption.credit ? ` — ${richTextToPlainString(caption.credit)}` : "";
	return `${richTextToPlainString(caption.text)}${credit}`.trim();
}
function inputRichBlocksToPlainTextAtDepth(blocks, listDepth) {
	const parts = [];
	const push = (value) => {
		if (value) parts.push(value);
	};
	for (const block of blocks) switch (block.type) {
		case "paragraph":
		case "heading":
		case "footer":
			push(richTextToPlainString(block.text));
			break;
		case "pre":
			push(block.text);
			break;
		case "mathematical_expression":
			push(block.expression);
			break;
		case "pullquote":
			push(block.credit ? `${richTextToPlainString(block.text)} — ${richTextToPlainString(block.credit)}` : richTextToPlainString(block.text));
			break;
		case "blockquote":
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			if (block.credit) push(`— ${richTextToPlainString(block.credit)}`);
			break;
		case "collage":
		case "slideshow":
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			push(captionToPlainText(block.caption));
			break;
		case "details":
			push(richTextToPlainString(block.summary));
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			break;
		case "list":
			for (const item of block.items) {
				const markerText = item.has_checkbox ? item.is_checked ? "[x] " : "[ ] " : item.value !== void 0 ? `${item.value}. ` : "• ";
				push(`${`${"  ".repeat(listDepth)}${markerText}`}${inputRichBlocksToPlainTextAtDepth(item.blocks, listDepth + 1)}`);
			}
			break;
		case "table":
			if (block.caption !== void 0) push(richTextToPlainString(block.caption));
			for (const row of block.cells) push(row.map((cell) => richTextToPlainString(cell.text ?? "")).join(" | "));
			break;
		case "photo":
			push(`${captionToPlainText(block.caption)} ${block.photo.media}`.trim());
			break;
		case "video":
			push(`${captionToPlainText(block.caption)} ${block.video.media}`.trim());
			break;
		case "audio":
			push(`${captionToPlainText(block.caption)} ${block.audio.media}`.trim());
			break;
		case "animation":
			push(`${captionToPlainText(block.caption)} ${block.animation.media}`.trim());
			break;
		case "voice_note":
			push(`${captionToPlainText(block.caption)} ${block.voice_note.media}`.trim());
			break;
		case "map": push(`${captionToPlainText(block.caption)} ${block.location.latitude},${block.location.longitude}`.trim());
	}
	return parts.join("\n");
}
function inputRichBlocksToPlainText(blocks) {
	return inputRichBlocksToPlainTextAtDepth(blocks, 0);
}
function boldRichText(text) {
	return {
		type: "bold",
		text
	};
}
function italicRichText(text) {
	return {
		type: "italic",
		text
	};
}
function paragraphBlock(text) {
	return {
		type: "paragraph",
		text
	};
}
//#endregion
//#region extensions/telegram/src/rich-plain-fallback.ts
const RICH_ENTITY_INVALID_RE = /RICH_MESSAGE_[A-Z_]+_INVALID/i;
const RICH_CONTENT_REQUIRED_RE = /RICH_MESSAGE_CONTENT_REQUIRED|rich message must be non-empty/i;
const EMPTY_TEXT_RE = /message text is empty|text must be non-empty/i;
const RICH_STRUCTURE_INVALID_RE = /RICH_MESSAGE_(?:BLOCKS_TOO_MANY|DEPTH_INVALID|TEXT_TOO_LONG|MEDIA_TOO_MANY|TABLE_COLS_TOO_MANY)/i;
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity|can't parse InputRichBlock/i;
function isTelegramRichEntityInvalidError(err) {
	return RICH_ENTITY_INVALID_RE.test(formatErrorMessage(err));
}
function isTelegramHtmlParseError(err) {
	return PARSE_ERR_RE.test(formatErrorMessage(err));
}
function isTelegramEmptyContentError(err) {
	const message = formatErrorMessage(err);
	return EMPTY_TEXT_RE.test(message) || RICH_CONTENT_REQUIRED_RE.test(message);
}
function getTelegramPlainFallbackTrigger(err) {
	if (isTelegramRichEntityInvalidError(err)) return "rich-entity-invalid";
	if (RICH_CONTENT_REQUIRED_RE.test(formatErrorMessage(err))) return "rich-content-required";
	if (RICH_STRUCTURE_INVALID_RE.test(formatErrorMessage(err))) return "rich-structure-invalid";
	if (isTelegramHtmlParseError(err)) return "html-parse";
}
function surrogateSafeChunkEnd(text, end, start) {
	const high = text.charCodeAt(end - 1);
	const low = text.charCodeAt(end);
	if (!(end > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return end;
	const clamped = end - 1;
	return clamped > start ? clamped : start + 2;
}
function splitTelegramPlainTextChunks(text, limit) {
	if (!text) return [];
	return chunkTextForOutbound(text, Math.max(1, Math.floor(limit)), { preserveWhitespace: true });
}
function splitTelegramPlainTextFallback(text, chunkCount, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const fixedChunks = splitTelegramPlainTextChunks(text, normalizedLimit);
	if (chunkCount <= 1 || fixedChunks.length >= chunkCount) return fixedChunks;
	const chunks = [];
	let offset = 0;
	for (let index = 0; index < chunkCount; index += 1) {
		const remainingChars = text.length - offset;
		const remainingChunks = chunkCount - index;
		const nextChunkLength = remainingChunks === 1 ? remainingChars : Math.min(normalizedLimit, Math.ceil(remainingChars / remainingChunks));
		const end = surrogateSafeChunkEnd(text, offset + nextChunkLength, offset);
		chunks.push(text.slice(offset, end));
		offset = end;
	}
	return chunks;
}
async function withTelegramPlainFallback(params) {
	try {
		return await params.sendFormatted();
	} catch (err) {
		const trigger = params.kind === "rich" ? getTelegramPlainFallbackTrigger(err) : isTelegramHtmlParseError(err) ? "html-parse" : isTelegramEmptyContentError(err) ? "empty-content" : void 0;
		if (!trigger || !params.plainText.trim()) throw err;
		params.warn(`telegram ${params.context} degrade=plain-fallback:${trigger}: ${formatErrorMessage(err)}`);
		const limit = params.limit ?? 4e3;
		const chunks = params.chunkCount === void 0 ? splitTelegramPlainTextChunks(params.plainText, limit) : splitTelegramPlainTextFallback(params.plainText, params.chunkCount, limit);
		return await params.sendPlain({
			plainText: params.plainText,
			chunks
		}, `${params.context}-plain`);
	}
}
function warnTelegramRichBlocksDegradations(params) {
	for (const reason of new Set(params.reasons)) params.warn(`telegram ${params.context} rich-degrade=${reason}`);
}
//#endregion
//#region extensions/telegram/src/rich-block-split.ts
const TELEGRAM_RICH_MEDIA_LIMIT = 50;
function addRichBlockBudget(left, right) {
	return {
		chars: left.chars + right.chars,
		blocks: left.blocks + right.blocks,
		media: left.media + right.media
	};
}
function exceedsRichBlockLimits(size, limits) {
	return size.chars > limits.textLimit || size.blocks > limits.blockLimit || size.media > TELEGRAM_RICH_MEDIA_LIMIT;
}
function wrapRichTextFragment(fragment, wrappers) {
	let node = fragment;
	for (let index = wrappers.length - 1; index >= 0; index -= 1) {
		const wrapper = wrappers[index];
		if (!wrapper) continue;
		node = wrapper.type === "url" ? {
			type: "url",
			text: node,
			url: wrapper.url
		} : wrapper.type === "anchor_link" ? {
			type: "anchor_link",
			text: node,
			anchor_name: wrapper.anchor_name
		} : {
			type: wrapper.type,
			text: node
		};
	}
	return node;
}
function splitRichTextByChars(text, limit) {
	const pieces = [];
	let current = [];
	let chars = 0;
	const flush = () => {
		if (current.length > 0) {
			pieces.push(normalizeRichText(current));
			current = [];
			chars = 0;
		}
	};
	const visit = (node, wrappers) => {
		if (typeof node === "string") {
			let offset = 0;
			while (offset < node.length) {
				if (chars >= limit) flush();
				const budget = limit - chars;
				const end = surrogateSafeChunkEnd(node, Math.min(node.length, offset + budget), offset);
				const fragment = node.slice(offset, end);
				current.push(wrapRichTextFragment(fragment, wrappers));
				chars += fragment.length;
				offset = end;
			}
			return;
		}
		if (Array.isArray(node)) {
			for (const child of node) visit(child, wrappers);
			return;
		}
		if (node.type === "mathematical_expression" || node.type === "custom_emoji") {
			const atomicChars = countRichTextChars(node);
			if (chars > 0 && chars + atomicChars > limit) flush();
			current.push(wrapRichTextFragment(node, wrappers));
			chars += atomicChars;
			return;
		}
		const wrapper = node.type === "url" ? {
			type: "url",
			url: node.url
		} : node.type === "anchor_link" ? {
			type: "anchor_link",
			anchor_name: node.anchor_name
		} : { type: node.type };
		visit(node.text, [...wrappers, wrapper]);
	};
	visit(text, []);
	flush();
	return pieces;
}
function splitOversizedRichBlock(block, limits) {
	const { textLimit, blockLimit } = limits;
	if (!exceedsRichBlockLimits(measureInputRichBlocks([block]), limits)) return [block];
	if (block.type === "pre") {
		const language = block.language;
		return splitTelegramPlainTextChunks(block.text, textLimit).map((piece) => language ? {
			type: "pre",
			text: piece,
			language
		} : {
			type: "pre",
			text: piece
		});
	}
	if (block.type === "paragraph" || block.type === "heading") return splitRichTextByChars(block.text, textLimit).map((piece) => block.type === "heading" ? {
		type: "heading",
		text: piece,
		size: block.size
	} : {
		type: "paragraph",
		text: piece
	});
	if (block.type === "blockquote" || block.type === "details" || block.type === "collage" || block.type === "slideshow") {
		const remainingText = textLimit - (block.type === "blockquote" ? countRichTextChars(block.credit ?? "") : block.type === "details" ? countRichTextChars(block.summary) : countRichTextChars(block.caption?.text ?? "") + countRichTextChars(block.caption?.credit ?? ""));
		if (block.blocks.length === 0 || remainingText < 0 || remainingText === 0 && measureInputRichBlocks(block.blocks).chars > 0) return [block];
		const pieces = splitTelegramRichBlocks(block.blocks, {
			textLimit: Math.max(1, remainingText),
			blockLimit: Math.max(1, blockLimit - 1)
		});
		if (block.type === "blockquote") return pieces.map((inner, index) => index === pieces.length - 1 && block.credit !== void 0 ? {
			type: "blockquote",
			blocks: inner,
			credit: block.credit
		} : {
			type: "blockquote",
			blocks: inner
		});
		if (block.type === "details") return pieces.map((inner) => ({
			...block,
			blocks: inner
		}));
		const { caption, ...album } = block;
		const albumPieces = [];
		for (const [index, inner] of pieces.entries()) albumPieces.push(index === 0 && caption !== void 0 ? {
			...album,
			blocks: inner,
			caption
		} : {
			...album,
			blocks: inner
		});
		return albumPieces;
	}
	if (block.type === "table") {
		if (block.cells.some((row) => row.some((cell) => (cell.rowspan ?? 1) > 1))) return [block];
		const { caption, ...tableRest } = block;
		const pieces = [];
		const pushPiece = (pieceRows) => {
			pieces.push(pieces.length === 0 && caption !== void 0 ? {
				...tableRest,
				cells: pieceRows,
				caption
			} : {
				...tableRest,
				cells: pieceRows
			});
		};
		let rows = [];
		let chars = countRichTextChars(caption ?? "");
		for (const row of block.cells) {
			const rowChars = row.reduce((total, cell) => total + countRichTextChars(cell.text ?? ""), 0);
			if (rows.length > 0 && (chars + rowChars > textLimit || rows.length + 2 > blockLimit)) {
				pushPiece(rows);
				rows = [];
				chars = 0;
			}
			rows.push(row);
			chars += rowChars;
		}
		if (rows.length > 0) pushPiece(rows);
		return pieces;
	}
	if (block.type === "list") {
		const pieces = [];
		let items = [];
		let size = {
			chars: 0,
			blocks: 1,
			media: 0
		};
		for (const item of block.items) {
			const measured = measureInputRichBlocks(item.blocks);
			const itemSize = {
				...measured,
				blocks: measured.blocks + 1
			};
			const nextSize = addRichBlockBudget(size, itemSize);
			if (items.length > 0 && exceedsRichBlockLimits(nextSize, limits)) {
				pieces.push({
					type: "list",
					items
				});
				items = [];
				size = {
					chars: 0,
					blocks: 1,
					media: 0
				};
			}
			items.push(item);
			size = addRichBlockBudget(size, itemSize);
		}
		if (items.length > 0) pieces.push({
			type: "list",
			items
		});
		return pieces;
	}
	return [block];
}
function splitTelegramRichBlocks(blocks, options = {}) {
	const blockLimit = Math.max(1, Math.floor(options.blockLimit ?? 500));
	const textLimit = Math.max(1, Math.floor(options.textLimit ?? 32768));
	if (blocks.length === 0) return [];
	const limits = {
		textLimit,
		blockLimit
	};
	const expanded = blocks.flatMap((block) => splitOversizedRichBlock(block, limits));
	const chunks = [];
	let current = [];
	let size = {
		chars: 0,
		blocks: 0,
		media: 0
	};
	const flush = () => {
		if (current.length > 0) {
			chunks.push(current);
			current = [];
			size = {
				chars: 0,
				blocks: 0,
				media: 0
			};
		}
	};
	for (const block of expanded) {
		const blockSize = measureInputRichBlocks([block]);
		if (current.length > 0 && exceedsRichBlockLimits(addRichBlockBudget(size, blockSize), limits)) flush();
		current.push(block);
		size = addRichBlockBudget(size, blockSize);
	}
	flush();
	return chunks;
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html.ts
const VOID_TAGS = /* @__PURE__ */ new Set([
	"br",
	"hr",
	"img",
	"input",
	"tg-map"
]);
const INLINE_STYLE_TAGS = {
	b: "bold",
	strong: "bold",
	i: "italic",
	em: "italic",
	u: "underline",
	ins: "underline",
	s: "strikethrough",
	del: "strikethrough",
	strike: "strikethrough",
	code: "code",
	"tg-spoiler": "spoiler",
	mark: "marked",
	sub: "subscript",
	sup: "superscript"
};
const HTML_ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
function parseHtmlAttrs(raw) {
	const attrs = /* @__PURE__ */ new Map();
	const inner = raw.replace(/^<\/?[a-zA-Z][a-zA-Z0-9-]*/, "").replace(/\/?>$/, "");
	for (const match of inner.matchAll(HTML_ATTR_RE)) {
		const name = match[1]?.toLowerCase();
		if (name) attrs.set(name, decodeTelegramHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ""));
	}
	return attrs;
}
/** Parse an HTML fragment into a light node tree; unmatched tags stay text. */
function parseHtmlFragment(ir) {
	const text = ir.text;
	const literalRanges = [...ir.styles.filter((span) => span.style === "code" || span.style === "code_block"), ...ir.annotations ?? []];
	const root = [];
	const stack = [];
	const childrenOf = () => stack.length > 0 ? stack[stack.length - 1].node.children : root;
	let cursor = 0;
	const pushText = (from, to) => {
		if (to > from) childrenOf().push({
			kind: "text",
			text: text.slice(from, to),
			start: from,
			end: to
		});
	};
	for (const tag of ir.htmlTags ?? []) {
		const parent = stack.at(-1);
		if (literalRanges.some((range) => tag.start >= range.start && tag.start < range.end) || (parent?.name === "code" || parent?.name === "pre") && !(tag.closing && tag.name === parent.name)) continue;
		pushText(cursor, tag.start);
		cursor = tag.end;
		if (tag.closing) {
			const openIndex = stack.findLastIndex((entry) => entry.name === tag.name);
			if (openIndex >= 0) {
				for (let depth = openIndex; depth < stack.length; depth += 1) {
					stack[depth].node.closed = depth === openIndex;
					stack[depth].node.end = depth === openIndex ? tag.end : tag.start;
				}
				stack.length = openIndex;
			} else childrenOf().push({
				kind: "text",
				text: tag.raw,
				start: tag.start,
				end: tag.end
			});
			continue;
		}
		const selfContained = tag.selfClosing || VOID_TAGS.has(tag.name);
		const element = {
			kind: "element",
			name: tag.name,
			raw: tag.raw,
			children: [],
			closed: selfContained,
			start: tag.start,
			end: selfContained ? tag.end : text.length
		};
		childrenOf().push(element);
		if (!selfContained) stack.push({
			name: tag.name,
			node: element
		});
	}
	pushText(cursor, text.length);
	return root;
}
function nodeText(nodes) {
	return nodes.map((node) => node.kind === "text" ? decodeTelegramHtmlEntities(node.text) : `${node.closed ? "" : decodeTelegramHtmlEntities(node.raw)}${nodeText(node.children)}`).join("");
}
function normalizeIslandText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function serializeHtmlNodes(nodes) {
	return nodes.map((node) => {
		if (node.kind === "text") return node.text;
		return VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>") ? node.raw : `${node.raw}${serializeHtmlNodes(node.children)}${node.closed ? `</${node.name}>` : ""}`;
	}).join("");
}
const defaultHtmlRenderer = {
	text: (node) => decodeTelegramHtmlEntities(node.text.replace(/\s+/g, " ")),
	literal: (_range, serialize) => serialize(),
	wrap: (_range, wrap, children) => wrap(children()),
	atom: (_range, value) => value
};
/** The same tag mapping serves standalone HTML and Markdown source-range composition. */
function htmlNodesToRichText(nodes, renderer = defaultHtmlRenderer) {
	const parts = [];
	for (const node of nodes) {
		if (node.kind === "text") {
			const value = renderer.text(node);
			if (value) parts.push(value);
			continue;
		}
		const children = () => htmlNodesToRichText(node.children, renderer);
		const emit = (build) => node.closed ? build() : [renderer.atom({
			start: node.start,
			end: node.start + node.raw.length
		}, node.raw), children()];
		const wrap = (build) => emit(() => renderer.wrap(node, build, children));
		const atom = (value) => emit(() => renderer.atom(node, value));
		const style = Object.hasOwn(INLINE_STYLE_TAGS, node.name) && INLINE_STYLE_TAGS[node.name];
		if (style) {
			parts.push(wrap((text) => ({
				type: style,
				text
			})));
			continue;
		}
		if (node.name === "a") {
			const href = parseHtmlAttrs(node.raw).get("href");
			if (href?.startsWith("#")) parts.push(wrap((text) => ({
				type: "anchor_link",
				text,
				anchor_name: href.slice(1)
			})));
			else parts.push(href ? wrap((text) => ({
				type: "url",
				text,
				url: href
			})) : emit(children));
			continue;
		}
		if (node.name === "tg-math") {
			parts.push(atom({
				type: "mathematical_expression",
				expression: nodeText(node.children)
			}));
			continue;
		}
		if (node.name === "tg-emoji") {
			const emojiId = parseHtmlAttrs(node.raw).get("emoji-id");
			const alternative = normalizeIslandText(nodeText(node.children));
			if (emojiId && /^\d+$/.test(emojiId) && alternative) {
				parts.push(atom({
					type: "custom_emoji",
					custom_emoji_id: emojiId,
					alternative_text: alternative
				}));
				continue;
			}
			parts.push(atom(alternative));
			continue;
		}
		if (node.name === "br") {
			parts.push(atom("\n"));
			continue;
		}
		if (node.name === "p" || node.name === "span" || node.name === "div") {
			parts.push(emit(children));
			continue;
		}
		parts.push(renderer.literal(node, () => serializeHtmlNodes([node])));
	}
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0] ?? "";
	return parts;
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html-map.ts
const BLOCK_ISLAND_TAGS = /* @__PURE__ */ new Set([
	"details",
	"p",
	"table",
	"ul",
	"ol",
	"figure",
	"img",
	"video",
	"audio",
	"blockquote",
	"aside",
	"footer",
	"hr",
	"tg-math-block",
	"tg-map",
	"tg-collage",
	"tg-slideshow",
	"a"
]);
const MEDIA_SRC_RE = /^https:\/\//i;
function hasStrayContent(nodes, allowed) {
	return nodes.some((node) => node.kind === "text" ? node.text.trim() !== "" : !node.closed || !allowed.has(node.name));
}
function mediaBlockFromElement(node, caption) {
	const src = parseHtmlAttrs(node.raw).get("src") ?? "";
	const hasBody = node.children.some((child) => child.kind === "text" ? child.text.trim() !== "" : true);
	if (!MEDIA_SRC_RE.test(src) || hasBody) return;
	const withCaption = caption ? { caption } : {};
	const isGif = /\.gif(?:[?#]|$)/i.test(src);
	if (node.name === "img" || node.name === "video") {
		if (isGif) return {
			type: "animation",
			animation: {
				type: "animation",
				media: src
			},
			...withCaption
		};
		return node.name === "img" ? {
			type: "photo",
			photo: {
				type: "photo",
				media: src
			},
			...withCaption
		} : {
			type: "video",
			video: {
				type: "video",
				media: src
			},
			...withCaption
		};
	}
	if (node.name === "audio") {
		if (/\.(?:ogg|opus|oga)(?:[?#]|$)/i.test(src)) return {
			type: "voice_note",
			voice_note: {
				type: "voice_note",
				media: src
			},
			...withCaption
		};
		return {
			type: "audio",
			audio: {
				type: "audio",
				media: src
			},
			...withCaption
		};
	}
}
function countChildren(nodes, name) {
	return nodes.filter((node) => node.kind === "element" && node.name === name).length;
}
function captionFromFigcaption(nodes) {
	const figcaption = nodes.find((node) => node.kind === "element" && node.name === "figcaption");
	if (!figcaption) return;
	const cite = figcaption.children.find((node) => node.kind === "element" && node.closed && node.name === "cite");
	const text = htmlNodesToRichText(figcaption.children.filter((node) => node !== cite));
	if (text === "" && !cite) return;
	return {
		text,
		...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
	};
}
const FIGURE_CHILDREN = /* @__PURE__ */ new Set([
	"img",
	"video",
	"audio",
	"tg-map",
	"figcaption"
]);
function figureToBlock(node) {
	if (hasStrayContent(node.children, FIGURE_CHILDREN)) return;
	if (node.children.filter((child) => child.kind === "element" && child.name !== "figcaption").length > 1 || countChildren(node.children, "figcaption") > 1) return;
	const media = node.children.find((child) => child.kind === "element" && (child.name === "img" || child.name === "video" || child.name === "audio" || child.name === "tg-map"));
	if (!media) return;
	const caption = captionFromFigcaption(node.children);
	if (media.name === "tg-map") {
		const map = mapToBlock(media);
		if (map?.type === "map" && caption) return {
			...map,
			caption
		};
		return map;
	}
	return mediaBlockFromElement(media, caption);
}
const LIST_CHILDREN = /* @__PURE__ */ new Set(["li"]);
function listToBlock(node, renderContent) {
	if (hasStrayContent(node.children, LIST_CHILDREN)) return;
	const items = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name !== "li") continue;
		const checkbox = child.children.find((grandchild) => grandchild.kind === "element" && grandchild.name === "input" && parseHtmlAttrs(grandchild.raw).get("type") === "checkbox");
		const blocks = renderContent(child.children.filter((grandchild) => grandchild !== checkbox));
		const item = { blocks: blocks.length > 0 ? blocks : [{
			type: "paragraph",
			text: ""
		}] };
		if (checkbox) {
			item.has_checkbox = true;
			if (parseHtmlAttrs(checkbox.raw).has("checked")) item.is_checked = true;
		}
		items.push(item);
	}
	if (items.length === 0) return;
	return {
		type: "list",
		items: node.name === "ol" ? items.map((item, index) => ({
			...item,
			value: index + 1
		})) : items
	};
}
function resolveTableCellAlign(value) {
	return value === "center" || value === "right" ? value : "left";
}
function resolveTableCellValign(value) {
	return value === "top" || value === "bottom" ? value : "middle";
}
function tableCellFromElement(node, inHeader) {
	const attrs = parseHtmlAttrs(node.raw);
	const text = htmlNodesToRichText(node.children);
	const colspan = strictNumber(attrs.get("colspan"), /^\d+$/u) ?? NaN;
	const rowspan = strictNumber(attrs.get("rowspan"), /^\d+$/u) ?? NaN;
	const align = attrs.get("align")?.toLowerCase();
	const valign = attrs.get("valign")?.toLowerCase();
	return {
		align: resolveTableCellAlign(align),
		valign: resolveTableCellValign(valign),
		...text !== "" ? { text } : {},
		...node.name === "th" || inHeader ? { is_header: true } : {},
		...Number.isSafeInteger(colspan) && colspan > 1 ? { colspan } : {},
		...Number.isSafeInteger(rowspan) && rowspan > 1 ? { rowspan } : {}
	};
}
const TABLE_COLUMN_LIMIT = 20;
function tableColumnCount(cells) {
	let carryover = [];
	let max = 0;
	for (const row of cells) {
		const carried = carryover.reduce((total, cell) => total + cell.span, 0);
		const own = row.reduce((total, cell) => total + (cell.colspan ?? 1), 0);
		max = Math.max(max, carried + own);
		carryover = [...carryover.map((cell) => ({
			span: cell.span,
			rows: cell.rows - 1
		})).filter((cell) => cell.rows > 0), ...row.filter((cell) => (cell.rowspan ?? 1) > 1).map((cell) => ({
			span: cell.colspan ?? 1,
			rows: (cell.rowspan ?? 1) - 1
		}))];
	}
	return max;
}
const TABLE_CHILDREN = /* @__PURE__ */ new Set([
	"caption",
	"thead",
	"tbody",
	"tfoot",
	"tr"
]);
const TABLE_ROW_CHILDREN = /* @__PURE__ */ new Set(["td", "th"]);
function tableToBlock(node) {
	if (hasStrayContent(node.children, TABLE_CHILDREN)) return;
	const cells = [];
	let caption;
	let stray = false;
	const visitRows = (parent, inHeader) => {
		for (const child of parent.children) {
			if (child.kind !== "element") {
				stray ||= child.text.trim() !== "";
				continue;
			}
			if (!child.closed) {
				stray = true;
				continue;
			}
			if (child.name === "caption") {
				const text = htmlNodesToRichText(child.children);
				if (text !== "") {
					stray ||= caption !== void 0;
					caption = text;
				}
				continue;
			}
			if (child.name === "thead" || child.name === "tbody" || child.name === "tfoot") {
				visitRows(child, child.name === "thead");
				continue;
			}
			if (child.name === "tr") {
				if (hasStrayContent(child.children, TABLE_ROW_CHILDREN)) {
					stray = true;
					continue;
				}
				const row = child.children.filter((cell) => cell.kind === "element" && (cell.name === "td" || cell.name === "th")).map((cell) => tableCellFromElement(cell, inHeader));
				if (row.length > 0) cells.push(row);
				continue;
			}
			stray = true;
		}
	};
	visitRows(node, false);
	if (stray || cells.length === 0) return;
	if (tableColumnCount(cells) > TABLE_COLUMN_LIMIT) {
		const grid = renderTelegramMonospaceGrid(cells.map((row) => row.flatMap((cell) => Array.from({ length: Math.min(cell.colspan ?? 1, 21) }, (_value, index) => index === 0 ? richTextToPlainString(cell.text ?? "") : ""))));
		return {
			type: "pre",
			text: caption !== void 0 ? `${richTextToPlainString(caption)}\n${grid}` : grid
		};
	}
	return {
		type: "table",
		cells,
		is_bordered: true,
		is_striped: true,
		...caption !== void 0 ? { caption } : {}
	};
}
function strictNumber(value, token = /^-?\d+(?:\.\d+)?$/) {
	if (value === void 0 || !token.test(value.trim())) return;
	return Number.parseFloat(value);
}
function mapToBlock(node) {
	const attrs = parseHtmlAttrs(node.raw);
	const latitude = strictNumber(attrs.get("lat"));
	const longitude = strictNumber(attrs.get("long"));
	if (!(latitude !== void 0 && longitude !== void 0 && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)) return;
	const zoom = strictNumber(attrs.get("zoom")) ?? NaN;
	return {
		type: "map",
		location: {
			latitude,
			longitude
		},
		zoom: Number.isFinite(zoom) ? Math.min(24, Math.max(0, Math.round(zoom))) : 14,
		width: 800,
		height: 450
	};
}
const COLLAGE_CHILDREN = /* @__PURE__ */ new Set([
	"figure",
	"img",
	"video",
	"audio",
	"figcaption"
]);
function collageToBlock(node) {
	if (hasStrayContent(node.children, COLLAGE_CHILDREN) || countChildren(node.children, "figcaption") > 1) return;
	const blocks = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name === "figcaption") continue;
		const media = child.name === "figure" ? figureToBlock(child) : mediaBlockFromElement(child);
		if (!media) return;
		blocks.push(media);
	}
	if (blocks.length === 0) return;
	const caption = captionFromFigcaption(node.children);
	return {
		type: node.name === "tg-slideshow" ? "slideshow" : "collage",
		blocks,
		...caption ? { caption } : {}
	};
}
function elementToBlock(node, renderContent) {
	if (!node.closed) return;
	switch (node.name) {
		case "hr": return { type: "divider" };
		case "details": {
			const summary = node.children.find((child) => child.kind === "element" && child.closed && child.name === "summary");
			const blocks = renderContent(node.children.filter((child) => child !== summary));
			return {
				type: "details",
				summary: summary ? htmlNodesToRichText(summary.children) : "Details",
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...parseHtmlAttrs(node.raw).has("open") ? { is_open: true } : {}
			};
		}
		case "ul":
		case "ol": return listToBlock(node, renderContent);
		case "table": return tableToBlock(node);
		case "figure": return figureToBlock(node);
		case "img":
		case "video":
		case "audio": return mediaBlockFromElement(node);
		case "blockquote": {
			const cite = node.children.find((child) => child.kind === "element" && child.closed && child.name === "cite");
			const blocks = renderContent(node.children.filter((child) => child !== cite));
			if (blocks.length === 0) return;
			const credit = cite ? htmlNodesToRichText(cite.children) : "";
			return credit !== "" ? {
				type: "blockquote",
				blocks,
				credit
			} : {
				type: "blockquote",
				blocks
			};
		}
		case "aside": {
			const cite = node.children.find((child) => child.kind === "element" && child.closed && child.name === "cite");
			const text = htmlNodesToRichText(node.children.filter((child) => child !== cite));
			if (text === "") return;
			return {
				type: "pullquote",
				text,
				...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
			};
		}
		case "footer": {
			const text = htmlNodesToRichText(node.children);
			return text === "" ? void 0 : {
				type: "footer",
				text
			};
		}
		case "tg-math-block": {
			const expression = nodeText(node.children).trim();
			return expression ? {
				type: "mathematical_expression",
				expression
			} : void 0;
		}
		case "tg-map": return mapToBlock(node);
		case "tg-collage":
		case "tg-slideshow": return collageToBlock(node);
		case "a": {
			const attrs = parseHtmlAttrs(node.raw);
			const name = attrs.get("name");
			if (name && !attrs.get("href") && nodeText(node.children).trim() === "") return {
				type: "anchor",
				name
			};
			return;
		}
		default: return;
	}
}
function renderTelegramHtmlIsland(node, renderContent) {
	if (node.name === "p") return renderContent(node.children);
	const block = elementToBlock(node, renderContent);
	return block ? [block] : [{
		type: "paragraph",
		text: htmlNodesToRichText([node])
	}];
}
/** Select whole authored islands; unsupported and unmatched parents stay literal. */
function findTelegramHtmlIslands(nodes) {
	return nodes.filter((node) => {
		if (node.kind !== "element" || !node.closed || !BLOCK_ISLAND_TAGS.has(node.name)) return false;
		if (node.name !== "a") return true;
		const attrs = parseHtmlAttrs(node.raw);
		return attrs.has("name") && !attrs.has("href") && node.children.every((child) => child.kind === "text" && !child.text.trim());
	});
}
//#endregion
//#region extensions/telegram/src/rich-blocks-list.ts
/** Groups exact parser-owned item spans by list identity without reparsing Markdown. */
function collectMarkdownRichListSources(ir) {
	const byListId = /* @__PURE__ */ new Map();
	for (const item of ir.listItems ?? []) {
		if (!item.listMarker || item.listId === void 0 || item.start === void 0 || item.end === void 0) continue;
		const markerText = ir.text.slice(item.listMarker.start, item.listMarker.end);
		const taskText = item.taskMarker ? ir.text.slice(item.taskMarker.start, item.taskMarker.end) : "";
		const value = item.kind === "ordered" ? Number.parseInt(markerText, 10) : void 0;
		const source = {
			kind: item.kind,
			start: item.start,
			end: item.end,
			contentStart: item.taskMarker?.end ?? item.listMarker.end,
			task: item.task === true,
			checked: /^\[[xX]\]/u.test(taskText),
			...value !== void 0 && Number.isFinite(value) ? { value } : {}
		};
		const list = byListId.get(item.listId) ?? [];
		list.push(source);
		byListId.set(item.listId, list);
	}
	return [...byListId.values()].map((items) => {
		items.sort((left, right) => left.start - right.start);
		return {
			start: Math.min(...items.map((item) => item.start)),
			end: Math.max(...items.map((item) => item.end)),
			items
		};
	});
}
/** Renders one parser list; nested containers arrive through renderRange. */
function renderMarkdownRichListSource(source, renderRange) {
	const kind = source.items[0]?.kind;
	if (!kind || source.items.some((item) => item.kind !== kind)) return;
	return [{
		type: "list",
		items: source.items.map((item) => {
			const blocks = renderRange(item.contentStart, item.end);
			return {
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...item.task ? { has_checkbox: true } : {},
				...item.checked ? { is_checked: true } : {},
				...kind === "ordered" && item.value !== void 0 ? { value: item.value } : {}
			};
		})
	}];
}
//#endregion
//#region extensions/telegram/src/rich-blocks.ts
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const TELEGRAM_RICH_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "blocks",
	chunk: {
		limit: 32768,
		unit: "chars"
	}
});
const INLINE_STYLE_RANK = {
	spoiler: 0,
	bold: 1,
	italic: 2,
	strikethrough: 3,
	code: 4
};
const TELEGRAM_RICH_LINK_HREF_RE = /^(?:https?:\/\/|tg:\/\/|mailto:|tel:)/i;
function isTelegramRichLinkHref(href) {
	return TELEGRAM_RICH_LINK_HREF_RE.test(href);
}
function resolveHeadingSize(style) {
	switch (style) {
		case "heading_1": return 1;
		case "heading_2": return 2;
		case "heading_3": return 3;
		case "heading_4": return 4;
		case "heading_5": return 5;
		case "heading_6": return 6;
		default: return;
	}
}
function isInlineStyle(style) {
	return style === "bold" || style === "italic" || style === "strikethrough" || style === "code" || style === "spoiler";
}
function resolveTelegramLinkAction(link, source, context) {
	const href = link.href.trim();
	if (!href || link.start === link.end) return null;
	const label = source.slice(link.start, link.end);
	if (context.origin === "linkify") return isAutoLinkedFileRef(href, label) ? { kind: "code" } : null;
	if (href.startsWith("#")) return {
		kind: "anchor",
		name: href.slice(1)
	};
	if (!isTelegramRichLinkHref(href)) return null;
	return {
		kind: "url",
		href
	};
}
function collectTelegramLinkActions(ir) {
	if (ir.links.length === 0) return [];
	const links = [];
	renderMarkdownWithMarkers(ir, {
		styleMarkers: {},
		escapeText: (text) => text,
		buildLink: (link, source, context) => {
			const action = resolveTelegramLinkAction(link, source, context);
			if (action) links.push({
				start: link.start,
				end: link.end,
				action
			});
			return null;
		}
	}, TELEGRAM_RICH_FORMAT_PROFILE);
	return links;
}
/**
* Build nested RichText from IR spans over [rangeStart, rangeEnd).
* Spans that partially overlap are split at shared boundaries (IR contract).
*/
function irRangeToRichText(ir, rangeStart, rangeEnd) {
	const slice = sliceMarkdownIR(ir, rangeStart, rangeEnd);
	const text = slice.text;
	if (!text) return "";
	const spans = [];
	for (const span of slice.styles) if (isInlineStyle(span.style)) spans.push({
		start: span.start,
		end: span.end,
		kind: "style",
		style: span.style
	});
	for (const span of slice.annotations ?? []) spans.push({
		start: span.start,
		end: span.end,
		kind: "annotation"
	});
	for (const link of collectTelegramLinkActions(slice)) spans.push(link.action.kind === "code" ? {
		start: link.start,
		end: link.end,
		kind: "style",
		style: "code"
	} : {
		start: link.start,
		end: link.end,
		kind: "link",
		target: link.action
	});
	const leaves = [];
	const nodes = text.includes("<") ? parseHtmlFragment(slice) : [];
	const hasElement = (children) => children.some((node) => node.kind === "element" && (node.closed || hasElement(node.children)));
	if (hasElement(nodes)) {
		const recordText = ({ start, end }) => {
			leaves.push({
				kind: "text",
				start,
				end
			});
			return "";
		};
		htmlNodesToRichText(nodes, {
			text: recordText,
			literal: recordText,
			wrap: ({ start, end }, wrap, children) => {
				spans.push({
					kind: "html",
					start,
					end,
					wrap
				});
				return children();
			},
			atom: ({ start, end }, value) => {
				const annotated = slice.annotations?.some((span) => span.start < end && span.end > start);
				leaves.push(annotated ? {
					kind: "text",
					start,
					end
				} : {
					kind: "atom",
					start,
					end,
					value
				});
				return "";
			}
		});
	} else leaves.push({
		kind: "text",
		start: 0,
		end: text.length
	});
	const rank = (span) => span.kind === "style" ? INLINE_STYLE_RANK[span.style] : span.kind === "annotation" ? 0 : 50;
	spans.sort((left, right) => left.start - right.start || right.end - left.end || rank(left) - rank(right));
	const points = [...new Set([...spans, ...leaves].flatMap((span) => [span.start, span.end]))].toSorted((left, right) => left - right);
	const stack = [];
	const root = [];
	const frameStack = [root];
	let leafIndex = 0;
	let nextSpanIndex = 0;
	let pendingSpans = [];
	for (let i = 0; i < points.length - 1; i += 1) {
		const start = points[i] ?? 0;
		while (leafIndex < leaves.length && leaves[leafIndex].end <= start) leafIndex += 1;
		const leaf = leaves[leafIndex];
		if (!leaf || leaf.start > start || leaf.kind === "atom" && leaf.start !== start) continue;
		const end = leaf.kind === "atom" ? leaf.end : points[i + 1] ?? start;
		while (nextSpanIndex < spans.length && spans[nextSpanIndex].start <= start) pendingSpans.push(spans[nextSpanIndex++]);
		pendingSpans = pendingSpans.filter((span) => span.end > start);
		const covering = pendingSpans.filter((span) => span.end >= end);
		const annotation = covering.find((span) => span.kind === "annotation");
		const active = annotation ? [annotation] : covering;
		let shared = 0;
		while (shared < stack.length && stack[shared] === active[shared]) shared += 1;
		stack.length = shared;
		frameStack.length = shared + 1;
		for (const item of active.slice(shared)) {
			const container = [];
			const node = item.kind === "html" ? item.wrap(container) : item.kind === "link" ? item.target.kind === "url" ? {
				type: "url",
				text: container,
				url: item.target.href
			} : {
				type: "anchor_link",
				text: container,
				anchor_name: item.target.name
			} : {
				type: item.kind === "annotation" ? "code" : item.style,
				text: container
			};
			frameStack.at(-1)?.push(node);
			stack.push(item);
			frameStack.push(container);
		}
		if (end > start) frameStack.at(-1)?.push(leaf.kind === "atom" ? leaf.value : text.slice(start, end));
	}
	return normalizeRichText(root);
}
function pushParagraph(paragraphs, ir, rangeStart, rangeEnd) {
	const raw = ir.text.slice(rangeStart, rangeEnd);
	const leading = raw.length - raw.trimStart().length;
	const trailing = raw.length - raw.trimEnd().length;
	const absStart = rangeStart + leading;
	const absEnd = rangeEnd - trailing;
	if (absEnd <= absStart) return;
	const text = irRangeToRichText(ir, absStart, absEnd);
	if (text !== "") paragraphs.push({
		type: "paragraph",
		text
	});
}
function splitParagraphs(ir, start, end) {
	if (end <= start) return [];
	const text = ir.text.slice(start, end);
	const paragraphs = [];
	const blankLine = /\n[ \t]*\n+/g;
	let last = 0;
	let match;
	while ((match = blankLine.exec(text)) !== null) {
		pushParagraph(paragraphs, ir, start + last, start + match.index);
		last = match.index + match[0].length;
	}
	pushParagraph(paragraphs, ir, start + last, end);
	return paragraphs;
}
function renderAsciiTableGrid(table) {
	return renderTelegramMonospaceGrid([table.headers, ...table.rows], { headerSeparator: true });
}
function cellToRichText(cell) {
	if (!cell?.text) return;
	const rich = irRangeToRichText(cell, 0, cell.text.length);
	return rich === "" ? void 0 : rich;
}
function renderTableBlock(table) {
	const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
	if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT) return {
		block: {
			type: "pre",
			text: renderAsciiTableGrid(table)
		},
		degradation: "table-ascii"
	};
	const headerRow = table.headerCells.map((cell, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(cell);
		return {
			is_header: true,
			align: align ?? "left",
			valign: "middle",
			...text !== void 0 ? { text } : {}
		};
	});
	const bodyRows = table.rowCells.map((row) => Array.from({ length: columnCount }, (_value, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(row[index]);
		return {
			align: align ?? "left",
			valign: "middle",
			...text !== void 0 ? { text } : {}
		};
	}));
	return { block: {
		type: "table",
		cells: headerRow.length > 0 ? [headerRow, ...bodyRows] : bodyRows,
		is_bordered: true,
		is_striped: true
	} };
}
function collectStructuralSegments(ir, tables, htmlNodes) {
	const segments = [];
	const htmlIslands = findTelegramHtmlIslands(htmlNodes);
	for (const span of ir.styles) {
		if (span.end <= span.start) continue;
		const headingSize = resolveHeadingSize(span.style);
		if (headingSize) {
			segments.push({
				kind: "heading",
				start: span.start,
				end: span.end,
				size: headingSize
			});
			continue;
		}
		if (span.style === "code_block") {
			segments.push({
				kind: "code_block",
				start: span.start,
				end: span.end,
				...span.language ? { language: span.language } : {}
			});
			continue;
		}
		if (span.style === "blockquote") segments.push({
			kind: "blockquote",
			start: span.start,
			end: span.end
		});
	}
	for (const table of tables) {
		const offset = Math.max(0, Math.min(table.placeholderOffset, ir.text.length));
		segments.push({
			kind: "table",
			start: offset,
			end: offset,
			table
		});
	}
	for (const source of collectMarkdownRichListSources(ir)) {
		if (htmlIslands.some((island) => source.start >= island.start && source.end <= island.end)) continue;
		segments.push({
			kind: "list",
			start: source.start,
			end: source.end,
			source
		});
	}
	return segments;
}
function preserveLiteralHtmlOwners(ir, segments, htmlNodes) {
	const islands = new Set(findTelegramHtmlIslands(htmlNodes));
	const owners = [];
	htmlNodesToRichText(htmlNodes.filter((node) => !islands.has(node)), {
		text: () => "",
		literal: (range) => {
			owners.push(range);
			return "";
		},
		wrap: (_range, _wrap, children) => children(),
		atom: () => ""
	});
	if (!owners.length) return;
	ir.htmlTags = ir.htmlTags?.filter((tag) => !owners.some((owner) => tag.start >= owner.start && tag.end <= owner.end));
	for (const segment of segments) {
		if (segment.kind !== "table" || !owners.some((owner) => segment.start > owner.start && segment.start < owner.end)) continue;
		for (const row of [segment.table.headerCells, ...segment.table.rowCells]) for (const cell of row) if (cell.htmlTags) cell.htmlTags = [];
	}
}
function emitSegments(ir, segments, rangeStart, rangeEnd, degradationReasons, htmlNodes = []) {
	preserveLiteralHtmlOwners(ir, segments, htmlNodes);
	const containerRank = (segment) => segment.kind === "blockquote" ? 0 : segment.kind === "list" ? 1 : 2;
	const orderedSegments = [...segments, ...findTelegramHtmlIslands(htmlNodes).map((node) => ({
		kind: "html",
		start: node.start,
		end: node.end,
		node
	}))].toSorted((left, right) => {
		if (left.start !== right.start) return left.start - right.start;
		const ownsTable = (segment) => segment.kind === "blockquote" || segment.kind === "list";
		if (left.kind === "table" && right.kind !== "table" && !ownsTable(right)) return -1;
		if (right.kind === "table" && left.kind !== "table" && !ownsTable(left)) return 1;
		return right.end - left.end || containerRank(left) - containerRank(right);
	});
	const blocks = [];
	let cursor = rangeStart;
	let index = 0;
	while (index < orderedSegments.length) {
		const segment = orderedSegments[index];
		if (!segment) break;
		if (segment.start > cursor) blocks.push(...splitParagraphs(ir, cursor, segment.start));
		let next = index + 1;
		while (next < orderedSegments.length && (orderedSegments[next]?.start ?? rangeEnd) < segment.end) next += 1;
		const children = orderedSegments.slice(index + 1, next);
		switch (segment.kind) {
			case "html":
				blocks.push(...renderTelegramHtmlIsland(segment.node, (nodes) => {
					const content = [];
					let first = 0;
					for (let last = 0; last < nodes.length; last += 1) {
						if (nodes[last + 1]?.start === nodes[last].end) continue;
						const start = nodes[first].start;
						const end = nodes[last].end;
						content.push(...emitSegments(ir, children.filter((child) => child.start >= start && child.end <= end), start, end, degradationReasons, nodes.slice(first, last + 1)));
						first = last + 1;
					}
					return content;
				}));
				break;
			case "heading": {
				const text = irRangeToRichText(ir, segment.start, segment.end);
				if (text !== "") blocks.push({
					type: "heading",
					text,
					size: segment.size
				});
				break;
			}
			case "code_block": {
				const text = ir.text.slice(segment.start, segment.end).replace(/\n$/, "");
				blocks.push({
					type: "pre",
					text,
					...segment.language ? { language: segment.language } : {}
				});
				break;
			}
			case "blockquote": {
				const inner = emitSegments(ir, children, segment.start, segment.end, degradationReasons);
				if (inner.length > 0) blocks.push({
					type: "blockquote",
					blocks: inner
				});
				break;
			}
			case "list": {
				const rendered = renderMarkdownRichListSource(segment.source, (start, end) => emitSegments(ir, children.filter((child) => child.start >= start && child.end <= end), start, end, degradationReasons));
				if (rendered) blocks.push(...rendered);
				else {
					degradationReasons.add("list-limit");
					blocks.push(...emitSegments(ir, children.filter((child) => child.kind !== "list"), segment.start, segment.end, degradationReasons));
				}
				break;
			}
			case "table": {
				const rendered = renderTableBlock(segment.table);
				if (rendered.degradation) degradationReasons.add(rendered.degradation);
				blocks.push(rendered.block);
				break;
			}
		}
		cursor = Math.max(cursor, segment.end);
		index = next;
	}
	if (cursor < rangeEnd) blocks.push(...splitParagraphs(ir, cursor, rangeEnd));
	return blocks;
}
function markdownToTelegramRichBlocks(markdown, options = {}) {
	const tableMode = options.tableMode ?? "block";
	const { ir, tables } = markdownToIRWithMeta(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: options.skipEntityDetection !== true,
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		blockquotePrefix: "",
		tableMode
	});
	let degradationReasons = /* @__PURE__ */ new Set();
	const htmlNodes = parseHtmlFragment(ir);
	const segments = collectStructuralSegments(ir, tables, htmlNodes);
	const hasMarkdownLists = segments.some((segment) => segment.kind === "list");
	const flattenedSegments = segments.filter((segment) => segment.kind !== "list");
	let blocks = emitSegments(ir, segments, 0, ir.text.length, degradationReasons, htmlNodes);
	if (hasMarkdownLists && measureInputRichBlocks(blocks).nesting > 16) {
		degradationReasons = /* @__PURE__ */ new Set();
		degradationReasons.add("list-limit");
		blocks = emitSegments(ir, flattenedSegments, 0, ir.text.length, degradationReasons, htmlNodes);
	}
	if (blocks.length === 0 && ir.text.trim()) blocks.push({
		type: "paragraph",
		text: ir.text
	});
	const plainBlocks = hasMarkdownLists ? emitSegments(ir, flattenedSegments, 0, ir.text.length, /* @__PURE__ */ new Set(), htmlNodes) : blocks;
	return {
		blocks,
		plainText: inputRichBlocksToPlainText(plainBlocks),
		degradationReasons: [...degradationReasons]
	};
}
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
const TELEGRAM_RICH_BLOCK_LIMIT = 500;
const TELEGRAM_RICH_EMAIL_TOKEN_RE = /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/iu;
function shouldSkipTelegramRichEntityDetection(text, options) {
	return options?.skipEntityDetection === true || TELEGRAM_RICH_EMAIL_TOKEN_RE.test(text);
}
function finiteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
	if (!value || typeof value !== "object") return false;
	return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
	const richParams = {};
	const directMessagesTopicId = finiteInteger(params?.direct_messages_topic_id);
	if (directMessagesTopicId !== void 0) richParams.direct_messages_topic_id = directMessagesTopicId;
	else {
		const messageThreadId = finiteInteger(params?.message_thread_id);
		if (messageThreadId !== void 0) richParams.message_thread_id = messageThreadId;
	}
	if (params?.disable_notification === true) richParams.disable_notification = true;
	if (isReplyParameters(params?.reply_parameters)) {
		richParams.reply_parameters = params.reply_parameters;
		return richParams;
	}
	const replyToMessageId = finiteInteger(params?.reply_to_message_id);
	if (replyToMessageId !== void 0) richParams.reply_parameters = {
		message_id: replyToMessageId,
		allow_sending_without_reply: true
	};
	return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
	const richParams = toTelegramRichMessageContextParams(params);
	if (!richParams.reply_parameters) return richParams;
	const { quote: _quote, quote_entities: _quoteEntities, quote_parse_mode: _quoteParseMode, quote_position: _quotePosition, ...replyParameters } = richParams.reply_parameters;
	return {
		...richParams,
		reply_parameters: replyParameters
	};
}
function toRichMessage(blocks, plainText, options) {
	return shouldSkipTelegramRichEntityDetection(plainText, options) ? {
		blocks,
		skip_entity_detection: true
	} : { blocks };
}
function buildTelegramRichMarkdownPlan(markdown, options) {
	const skipEntityDetection = shouldSkipTelegramRichEntityDetection(markdown, options);
	const rendered = markdownToTelegramRichBlocks(markdown, {
		tableMode: options?.tableMode,
		skipEntityDetection
	});
	return {
		richMessage: toRichMessage(rendered.blocks, rendered.plainText, {
			...options,
			skipEntityDetection
		}),
		plainText: rendered.plainText,
		degradationReasons: rendered.degradationReasons
	};
}
function buildTelegramRichMarkdown(markdown, options) {
	return buildTelegramRichMarkdownPlan(markdown, options).richMessage;
}
function buildTelegramRichBlocksPlan(blocks, options) {
	const plainText = inputRichBlocksToPlainText(blocks);
	return {
		richMessage: toRichMessage(blocks, plainText, options),
		plainText,
		degradationReasons: []
	};
}
function splitTelegramRichMessageTextChunks(params) {
	const { plan } = params;
	const chunkOptions = { skipEntityDetection: plan.richMessage.skip_entity_detection === true };
	return splitTelegramRichBlocks(plan.richMessage.blocks, {
		blockLimit: TELEGRAM_RICH_BLOCK_LIMIT,
		textLimit: params.textLimit
	}).map((blocks, index) => {
		const plainText = inputRichBlocksToPlainText(blocks);
		return {
			richMessage: toRichMessage(blocks, plainText, chunkOptions),
			plainText,
			degradationReasons: index === 0 ? plan.degradationReasons : []
		};
	});
}
//#endregion
//#region extensions/telegram/src/text-chunk-limit.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
function resolveTelegramTextChunkLimit(params) {
	const platformLimit = mergeTelegramAccountConfig(params.cfg, params.accountId ?? resolveDefaultTelegramAccountId(params.cfg)).richMessages === true && params.formatting?.parseMode !== "HTML" ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	return Math.min(resolveTextChunkLimit(params.cfg, "telegram", params.accountId ?? void 0, { fallbackLimit: platformLimit }), platformLimit);
}
//#endregion
export { splitTelegramCaption as A, looksLikeTelegramTargetId as B, resolveCompleteTelegramPromptContextProjectionIds as C, buildInlineKeyboard as D, withTelegramPromptContextSource as E, renderTelegramHtmlText as F, resolveTelegramGroupPromptSettings as G, telegramMessagingTargetsMatch as H, splitTelegramHtmlChunks as I, resolveTelegramScopedGroupConfig as K, telegramHtmlToPlainTextFallback as L, markdownToTelegramChunks as M, markdownToTelegramHtml as N, TELEGRAM_MAX_CAPTION_LENGTH as O, markdownToTelegramHtmlChunks as P, wrapFileReferencesInHtml as R, parseTelegramPromptContextProjection as S, resolveTelegramPromptContextSource as T, resolveTelegramDirectToolPolicy as U, normalizeTelegramMessagingTarget as V, resolveTelegramGroupIngestEnabled as W, boldRichText as _, buildTelegramRichMarkdown as a, createTelegramPromptContextProjectionCursor as b, splitTelegramRichMessageTextChunks as c, splitTelegramRichBlocks as d, isTelegramEmptyContentError as f, withTelegramPlainFallback as g, warnTelegramRichBlocksDegradations as h, buildTelegramRichBlocksPlan as i, telegramCaptionDeliveryMetadata as j, resolveTelegramPlainCaption as k, toTelegramRichMessageContextParams as l, splitTelegramPlainTextChunks as m, resolveTelegramTextChunkLimit as n, buildTelegramRichMarkdownPlan as o, isTelegramHtmlParseError as p, TELEGRAM_RICH_TEXT_LIMIT as r, removeTelegramRichNativeQuoteParam as s, TELEGRAM_TEXT_CHUNK_LIMIT as t, markdownToTelegramRichBlocks as u, italicRichText as v, resolveTelegramPromptContextDeliverySignature as w, createTelegramPromptContextProjectionSequence as x, paragraphBlock as y, escapeTelegramHtml as z };
