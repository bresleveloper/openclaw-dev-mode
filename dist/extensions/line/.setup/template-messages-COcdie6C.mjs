import { C as fitsLineFlexBubble, S as uriAction, b as postbackAction, h as cardText, l as createReceiptCard, m as cardBox, v as messageAction, w as toFlexMessage } from "./send-retry-Dzbkz5wG.mjs";
import { markdownToIRWithMeta, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/line/src/markdown-to-line.ts
const LINE_MARKDOWN_OPTIONS = {
	assistantTranscriptRoleHeaders: true,
	autolink: false,
	blockquotePrefix: "",
	headingStyle: "none",
	horizontalRuleText: "",
	linkify: false,
	preserveSourceBlockSpacing: true
};
const TRANSCRIPT_ROLE_PREFIX = "[assistant-authored transcript] ";
const LINE_FLEX_CODE_CARD_MAX_CHARS = 2e3;
function parseLineMarkdown(text, tableMode = "block") {
	return markdownToIRWithMeta(text, {
		...LINE_MARKDOWN_OPTIONS,
		tableMode
	});
}
function toCodeBlock(ir, span) {
	return {
		...span.language ? { language: span.language } : {},
		code: ir.text.slice(span.start, span.end).trimEnd()
	};
}
function rangesOverlap(left, right) {
	return left.start < right.end && right.start < left.end;
}
function projectPlainText(ir, omitted = [], additionalInsertions = [], onSegment) {
	const insertions = [...additionalInsertions];
	for (const link of ir.links) {
		if (omitted.some((range) => rangesOverlap(range, link))) continue;
		const href = link.href.trim();
		const label = ir.text.slice(link.start, link.end).trim();
		const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
		if (href && label && label !== href && label !== comparableHref) insertions.push({
			position: link.end,
			text: ` (${href})`
		});
	}
	for (const annotation of ir.annotations ?? []) if (annotation.type === "assistant_transcript_role" && !omitted.some((range) => rangesOverlap(range, annotation))) insertions.push({
		position: annotation.start,
		text: TRANSCRIPT_ROLE_PREFIX
	});
	const inlineCodeSpans = ir.styles.filter((span) => span.style === "code" && !omitted.some((range) => rangesOverlap(range, span)));
	for (const span of inlineCodeSpans) {
		const code = ir.text.slice(span.start, span.end);
		if (stripMarkdown(code, { assistantTranscriptRoleHeaders: true }).startsWith(TRANSCRIPT_ROLE_PREFIX)) insertions.push({
			position: span.start,
			text: TRANSCRIPT_ROLE_PREFIX
		});
	}
	insertions.sort((left, right) => left.position - right.position);
	const underlineTags = [...ir.text.matchAll(/<\/?u>/gi)].map((match) => ({
		start: match.index,
		end: match.index + match[0].length
	})).filter((tag) => !inlineCodeSpans.some((span) => rangesOverlap(tag, span)) && !omitted.some((span) => rangesOverlap(tag, span)));
	const removed = [...omitted, ...underlineTags].toSorted((left, right) => left.start - right.start);
	let output = "";
	let segmentStart = 0;
	let cursor = 0;
	let insertionIndex = 0;
	const appendRange = (end) => {
		while (insertionIndex < insertions.length) {
			const insertion = insertions[insertionIndex];
			if (!insertion || insertion.position > end) break;
			if (insertion.position >= cursor) {
				output += ir.text.slice(cursor, insertion.position);
				if ("text" in insertion) output += insertion.text;
				else if (onSegment) {
					const precedingText = output.slice(segmentStart).trim();
					if (precedingText) onSegment({
						type: "text",
						text: precedingText
					});
					onSegment({
						type: "flex",
						message: insertion.message
					});
					segmentStart = output.length;
				}
				cursor = insertion.position;
			}
			insertionIndex += 1;
		}
		output += ir.text.slice(cursor, end);
		cursor = end;
	};
	for (const range of removed) {
		appendRange(range.start);
		cursor = Math.max(cursor, range.end);
		while (insertionIndex < insertions.length && (insertions[insertionIndex]?.position ?? cursor) < cursor) insertionIndex += 1;
	}
	appendRange(ir.text.length);
	if (onSegment) {
		const trailingText = output.slice(segmentStart).trim();
		if (trailingText) onSegment({
			type: "text",
			text: trailingText
		});
	}
	return output.trim();
}
function formatOversizedTableAsBullets(table) {
	const markdownCell = (cell) => projectPlainText(cell).replace(/[\\|`*_[\]~<>&]/gu, "\\$&").replace(/\r?\n/gu, " ");
	const markdownRow = (cells) => `| ${cells.map(markdownCell).join(" | ")} |`;
	return projectPlainText(parseLineMarkdown([
		markdownRow(table.headerCells),
		`| ${table.headerCells.map(() => "---").join(" | ")} |`,
		...table.rowCells.map(markdownRow)
	].join("\n"), "bullets").ir);
}
function sameSpanStyle(left, right) {
	return left.weight === right.weight && left.style === right.style && left.decoration === right.decoration;
}
function renderTableCell(cell) {
	if (!cell.text.trim()) return {
		text: "-",
		hasMarkup: false
	};
	const codeSpans = cell.styles.filter((span) => span.style === "code");
	const tags = [...cell.text.matchAll(/<\/?u>/gi)].map((match) => ({
		start: match.index,
		end: match.index + match[0].length,
		closing: match[0][1] === "/"
	})).filter((tag) => !codeSpans.some((span) => rangesOverlap(tag, span)));
	const boundaries = /* @__PURE__ */ new Set([0, cell.text.length]);
	for (const style of cell.styles) {
		boundaries.add(style.start);
		boundaries.add(style.end);
	}
	for (const link of cell.links) boundaries.add(link.end);
	for (const tag of tags) {
		boundaries.add(tag.start);
		boundaries.add(tag.end);
	}
	const sortedBoundaries = [...boundaries].toSorted((left, right) => left - right);
	const spans = [];
	let underlineDepth = 0;
	let hasMarkup = false;
	const appendSpan = (span) => {
		const previous = spans.at(-1);
		if (previous && sameSpanStyle(previous, span)) previous.text = `${previous.text ?? ""}${span.text ?? ""}`;
		else spans.push(span);
	};
	for (let index = 0; index < sortedBoundaries.length - 1; index += 1) {
		const start = sortedBoundaries[index];
		const end = sortedBoundaries[index + 1];
		if (start === void 0 || end === void 0) continue;
		const tag = tags.find((candidate) => candidate.start === start);
		if (tag) {
			underlineDepth += tag.closing ? -1 : 1;
			hasMarkup = true;
			continue;
		}
		const text = cell.text.slice(start, end);
		if (text) {
			const active = new Set(cell.styles.filter((style) => style.start <= start && style.end >= end).map((style) => style.style));
			const weight = active.has("bold") ? "bold" : void 0;
			const style = active.has("italic") ? "italic" : void 0;
			const decoration = active.has("strikethrough") ? "line-through" : underlineDepth > 0 ? "underline" : void 0;
			hasMarkup ||= weight !== void 0 || style !== void 0 || decoration !== void 0;
			appendSpan({
				type: "span",
				text,
				weight,
				style,
				decoration
			});
		}
		for (const link of cell.links.filter((candidate) => candidate.end === end)) {
			const href = link.href.trim();
			const label = cell.text.slice(link.start, link.end).trim();
			if (href && label && label !== href) {
				appendSpan({
					type: "span",
					text: ` (${href})`
				});
				hasMarkup = true;
			}
		}
	}
	return {
		text: spans.map((span) => span.text ?? "").join("").trim() || "-",
		...hasMarkup ? { contents: spans } : {},
		hasMarkup
	};
}
function convertTableToFlexBubble(table) {
	const requiresPlainCells = table.rowCells.length > 10;
	if (requiresPlainCells && (table.headers.length !== 2 || table.rowCells.length > 12)) return;
	let hasInlineMarkup = false;
	const renderCells = (cells) => {
		const rendered = [];
		for (const cell of cells) {
			const prepared = renderTableCell(cell);
			if (requiresPlainCells && prepared.hasMarkup) return;
			hasInlineMarkup ||= prepared.hasMarkup;
			rendered.push(prepared);
		}
		return rendered;
	};
	const headerCells = renderCells(table.headerCells);
	if (!headerCells) return;
	const rowCells = [];
	for (const row of table.rowCells) {
		const cells = renderCells(row);
		if (!cells) return;
		rowCells.push(cells);
	}
	if (table.headers.length === 2 && !hasInlineMarkup) return createReceiptCard({
		title: headerCells.map((cell) => cell.text).join(" / "),
		items: rowCells.map((row) => ({
			name: row[0]?.text ?? "-",
			value: row[1]?.text ?? "-"
		}))
	});
	const renderRow = (cells, textStyle, rowStyle) => cardBox("horizontal", cells.map((cell) => cardText(cell.text, {
		contents: cell.contents,
		...textStyle,
		size: "sm",
		flex: 1,
		wrap: true
	})), rowStyle);
	const headerRow = renderRow(headerCells, {
		weight: "bold",
		color: "#333333"
	}, { paddingBottom: "sm" });
	const dataRows = rowCells.map((row, rowIndex) => renderRow(table.headers.map((_, colIndex) => row[colIndex] ?? {
		text: "-",
		hasMarkup: false
	}), { color: "#666666" }, { margin: rowIndex === 0 ? "md" : "sm" }));
	return {
		type: "bubble",
		body: cardBox("vertical", [
			headerRow,
			{
				type: "separator",
				margin: "sm"
			},
			...dataRows
		], { paddingAll: "lg" })
	};
}
function convertCodeBlockToFlexBubble(block) {
	const titleText = block.language ? `Code (${block.language})` : "Code";
	return {
		type: "bubble",
		body: cardBox("vertical", [cardText(titleText, {
			weight: "bold",
			size: "sm",
			color: "#666666"
		}), cardBox("vertical", [cardText(block.code, {
			size: "xs",
			color: "#333333",
			wrap: true
		})], {
			backgroundColor: "#F5F5F5",
			paddingAll: "md",
			cornerRadius: "md",
			margin: "sm"
		})], { paddingAll: "lg" })
	};
}
/** Parse once, route existing block surfaces to Flex, and project the remainder as plain text. */
function processLineMessage(text) {
	const { ir, tables } = parseLineMarkdown(text);
	const codeSpans = ir.styles.filter((span) => span.style === "code_block");
	const plainTextInsertions = [];
	for (const table of tables) {
		const bubble = convertTableToFlexBubble(table);
		if (!bubble || !fitsLineFlexBubble(bubble)) {
			plainTextInsertions.push({
				position: table.placeholderOffset,
				text: `\n\n${formatOversizedTableAsBullets(table)}\n\n`
			});
			continue;
		}
		const message = toFlexMessage("Table", bubble);
		plainTextInsertions.push({
			position: table.placeholderOffset,
			message
		});
	}
	for (const span of codeSpans) {
		const block = toCodeBlock(ir, span);
		if (!block.code.trim()) continue;
		if (block.code.length > LINE_FLEX_CODE_CARD_MAX_CHARS) {
			plainTextInsertions.push({
				position: span.start,
				text: `\n\n${block.code}\n\n`
			});
			continue;
		}
		plainTextInsertions.push({
			position: span.start,
			message: toFlexMessage("Code", convertCodeBlockToFlexBubble(block))
		});
	}
	const segments = [];
	projectPlainText(ir, codeSpans, plainTextInsertions, (segment) => segments.push(segment));
	return segments;
}
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Moves a chunk boundary away from the middle of a UTF-16 surrogate pair. */
function avoidTrailingHighSurrogateBreak(text, start, end) {
	if (end <= start || end >= text.length || !isHighSurrogate(text.charCodeAt(end - 1)) || !isLowSurrogate(text.charCodeAt(end))) return end;
	const adjusted = end - 1;
	return adjusted > start ? adjusted : end + 1;
}
//#endregion
//#region packages/normalization-core/src/grapheme.ts
let graphemeSegmenter;
function getGraphemeSegmenter() {
	graphemeSegmenter ??= new Intl.Segmenter(void 0, { granularity: "grapheme" });
	return graphemeSegmenter;
}
/**
* Chooses a whole-grapheme cut within the hard budget, honoring a usable preference.
* If no whole grapheme fits, allowPartial permits a surrogate-safe progress cut;
* a leading surrogate pair can exceed maxEnd by one code unit.
*/
function findGraphemeChunkEnd(text, start, maxEnd, preferredEnd = maxEnd, allowPartial = true) {
	const hardEnd = Math.min(maxEnd, text.length);
	if (hardEnd <= start) return start;
	const preferred = Number.isInteger(preferredEnd) && preferredEnd > start && preferredEnd <= hardEnd ? preferredEnd : hardEnd;
	if (preferred === text.length) return preferred;
	const before = text.charCodeAt(preferred - 1);
	const after = text.charCodeAt(preferred);
	if (Number.isInteger(preferred) && before <= 127 && after <= 127 && !(before === 13 && after === 10)) return preferred;
	const segments = getGraphemeSegmenter().segment(text);
	let end = segments.containing(preferred)?.index ?? preferred;
	if (end <= start && preferred < hardEnd) end = hardEnd === text.length ? hardEnd : segments.containing(hardEnd)?.index ?? hardEnd;
	return end > start ? end : allowPartial ? avoidTrailingHighSurrogateBreak(text, start, hardEnd) : start;
}
//#endregion
//#region extensions/line/src/template-messages.ts
const COMPACT_TEMPLATE_TEXT_LIMIT = 60;
const TEMPLATE_ALT_TEXT_LIMIT = 1500;
function buildTemplatePayloadAction(action) {
	if (action.type === "uri" && action.uri) return uriAction(action.label, action.uri);
	if (action.type === "postback" && action.data) return postbackAction(action.label, action.data, action.label);
	return messageAction(action.label, action.data ?? action.label);
}
function buildInferredTemplateAction(label, data) {
	return data.startsWith("http") ? uriAction(label, data) : data.includes("=") ? postbackAction(label, data, label) : messageAction(label, data);
}
function resolveTemplateTextLimit(title, thumbnailImageUrl, textOnlyLimit) {
	return title !== void 0 || thumbnailImageUrl !== void 0 ? COMPACT_TEMPLATE_TEXT_LIMIT : textOnlyLimit;
}
function truncateTemplateText(text, limit) {
	const end = findGraphemeChunkEnd(text, 0, limit, limit, false);
	return end > 0 ? text.slice(0, end) : truncateUtf16Safe(text, limit);
}
function resolveTemplateAltText(value, fallback) {
	return truncateTemplateText(value ?? fallback, TEMPLATE_ALT_TEXT_LIMIT);
}
/** Convert portable template payloads at the LINE provider boundary. */
function buildTemplateMessageFromPayload(payload) {
	switch (payload.type) {
		case "confirm": return {
			type: "template",
			altText: resolveTemplateAltText(payload.altText, payload.text),
			template: {
				type: "confirm",
				text: truncateTemplateText(payload.text, 240),
				actions: [buildInferredTemplateAction(payload.confirmLabel, payload.confirmData), buildInferredTemplateAction(payload.cancelLabel, payload.cancelData)]
			}
		};
		case "buttons": {
			const title = payload.title || void 0;
			const textLimit = resolveTemplateTextLimit(title, payload.thumbnailImageUrl, 160);
			return {
				type: "template",
				altText: resolveTemplateAltText(payload.altText, title ? `${title}: ${payload.text}` : payload.text),
				template: {
					type: "buttons",
					...title ? { title: truncateTemplateText(title, 40) } : {},
					text: truncateTemplateText(payload.text, textLimit),
					actions: payload.actions.slice(0, 4).map(buildTemplatePayloadAction),
					thumbnailImageUrl: payload.thumbnailImageUrl,
					imageAspectRatio: "rectangle",
					imageSize: "cover",
					imageBackgroundColor: void 0,
					defaultAction: void 0
				}
			};
		}
		case "carousel": {
			const visibleColumns = payload.columns.map((column) => {
				const title = column.title || void 0;
				const textLimit = resolveTemplateTextLimit(title, column.thumbnailImageUrl, 120);
				return {
					title: title === void 0 ? void 0 : truncateTemplateText(title, 40),
					text: truncateTemplateText(column.text, textLimit),
					actions: column.actions.map(buildTemplatePayloadAction).filter((action) => action.label !== void 0 && action.label !== "").slice(0, 3),
					thumbnailImageUrl: column.thumbnailImageUrl,
					imageBackgroundColor: void 0,
					defaultAction: void 0
				};
			}).slice(0, 10);
			const first = visibleColumns[0];
			if (!first || visibleColumns.some((column) => column.text === "" || column.actions.length === 0 || column.title === void 0 !== (first.title === void 0) || column.actions.length !== first.actions.length)) {
				const text = [...payload.altText ? [truncateTemplateText(payload.altText, TEMPLATE_ALT_TEXT_LIMIT)] : [], ...visibleColumns.map((column) => {
					const body = column.title ? `${column.title}: ${column.text}` : column.text;
					const labels = column.actions.map((action) => action.label).filter((label) => label !== void 0 && label !== "");
					return labels.length > 0 ? `${body} (${labels.join(" / ")})` : body;
				}).filter((line) => line !== "")].join("\n");
				return text ? {
					type: "text",
					text
				} : null;
			}
			return {
				type: "template",
				altText: resolveTemplateAltText(payload.altText, "View carousel"),
				template: {
					type: "carousel",
					columns: visibleColumns,
					imageAspectRatio: "rectangle",
					imageSize: "cover"
				}
			};
		}
		default: return null;
	}
}
//#endregion
export { processLineMessage as n, buildTemplateMessageFromPayload as t };
