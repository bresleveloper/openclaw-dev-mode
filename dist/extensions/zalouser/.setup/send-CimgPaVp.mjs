import { A as UNICODE_SEPARATOR_PATTERN, D as sliceTextStyles, E as restoreTrailingNewlines, F as TextStyle, M as normalizeCodeBlockLeadingWhitespace, N as projectOffset, O as LOCAL_TAG_PATTERN, P as createZalouserSendReceipt, T as collectStructuralStyles, g as sendZaloReaction, j as ZALOUSER_STYLE_MAP, k as TAG_STYLE_MAP, v as sendZaloTextMessage, w as applyTextEdits } from "./zalo-js-Cmhsqtom.mjs";
import { chunkTextRanges, markdownToIR, renderMarkdownWithAttributedRanges } from "openclaw/plugin-sdk/text-chunking";
import { randomUUID } from "node:crypto";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
//#region extensions/zalouser/src/text-styles-source-spans.ts
function sourceContainerProjection(line, lineIndex, ir, sourceLineStarts, sourceLines, blockquoteDepth) {
	const quotePrefix = sourceBlockquotePrefixLength(line, blockquoteDepth);
	const quoteResidual = blockquoteTabResidual(line.slice(0, quotePrefix));
	const listProjection = (ir.listItems ?? []).reduce((projection, item) => {
		if (item.sourceContent === void 0 || item.sourceStartLine === void 0 || item.sourceEndLine === void 0 || lineIndex < item.sourceStartLine || lineIndex >= item.sourceEndLine) return projection;
		const itemColumn = item.sourceContent.start - (sourceLineStarts[item.sourceStartLine] ?? 0);
		if (lineIndex === item.sourceStartLine) return itemColumn > projection.offset ? {
			offset: itemColumn,
			residual: 0
		} : projection;
		const itemQuotePrefix = sourceBlockquotePrefixLength(sourceLines[item.sourceStartLine] ?? "", blockquoteDepth);
		const itemLineStart = sourceLineStarts[item.sourceStartLine] ?? 0;
		const markerEndColumn = item.sourceMarker?.end ? item.sourceMarker.end - itemLineStart : itemColumn;
		const quoteColumn = markdownSourceColumn((sourceLines[item.sourceStartLine] ?? "").slice(0, itemQuotePrefix));
		const listIndent = item.sourceIndent !== void 0 ? item.sourceIndent - quoteColumn : markdownSourceColumn((sourceLines[item.sourceStartLine] ?? "").slice(itemQuotePrefix, item.markerOnly ? markerEndColumn : itemColumn), quoteColumn) - quoteColumn + (item.markerOnly ? 1 : 0);
		const consumed = consumeMarkdownIndentProjection(line.slice(quotePrefix), listIndent, markdownSourceColumn(line.slice(0, quotePrefix)));
		const offset = quotePrefix + consumed.offset;
		return offset > projection.offset ? {
			offset,
			residual: consumed.residual
		} : projection;
	}, {
		offset: 0,
		residual: 0
	});
	const consumedQuoteDepth = line.slice(0, listProjection.offset).match(/>/gu)?.length ?? 0;
	const trailingQuotePrefix = sourceBlockquotePrefixLength(line.slice(listProjection.offset), Math.max(0, blockquoteDepth - consumedQuoteDepth));
	const trailingQuoteResidual = blockquoteTabResidual(line.slice(listProjection.offset, listProjection.offset + trailingQuotePrefix), markdownSourceColumn(line.slice(0, listProjection.offset)));
	return {
		offset: Math.max(listProjection.offset + trailingQuotePrefix, quotePrefix),
		residual: listProjection.offset > 0 && trailingQuotePrefix > 0 ? trailingQuoteResidual : listProjection.offset > 0 ? listProjection.residual : quoteResidual
	};
}
function sourceListItemContent(source, ir, sourceLineStarts, sourceLines, item) {
	if (item.sourceContent === void 0 || item.sourceStartLine === void 0 || item.sourceEndLine === void 0) return "";
	const blockquoteDepth = (ir.blocks ?? []).filter((block) => block.kind === "blockquote" && (block.sourceStartLine ?? 0) <= item.sourceStartLine && (block.sourceEndLine ?? 0) >= item.sourceEndLine).reduce((depth, block) => Math.max(depth, block.blockquoteDepth ?? 0), 0);
	const contentLines = [];
	for (let lineIndex = item.sourceStartLine; lineIndex < item.sourceEndLine; lineIndex += 1) {
		const lineStart = sourceLineStarts[lineIndex] ?? 0;
		const lineEnd = lineIndex + 1 < sourceLineStarts.length ? Math.max(lineStart, (sourceLineStarts[lineIndex + 1] ?? source.length) - 1) : source.length;
		const contentStart = Math.max(item.sourceContent.start, lineStart);
		const contentEnd = Math.min(item.sourceContent.end, lineEnd);
		const projectedStart = Math.max(contentStart, lineStart + sourceContainerProjection(sourceLines[lineIndex] ?? "", lineIndex, ir, sourceLineStarts, sourceLines, blockquoteDepth).offset);
		contentLines.push(source.slice(Math.min(projectedStart, contentEnd), contentEnd).replace(/\r$/u, ""));
	}
	return contentLines.join("\n").replace(/^\n+|[ \t\r\n]+$/gu, "");
}
function sourceBlockquotePrefixLength(line, maxDepth = Number.POSITIVE_INFINITY) {
	let cursor = 0;
	let depth = 0;
	while (cursor < line.length && depth < maxDepth) {
		let marker = cursor;
		while (marker < line.length && marker - cursor < 3 && line[marker] === " ") marker += 1;
		if (line[marker] !== ">") break;
		cursor = marker + 1;
		depth += 1;
		if (line[cursor] === " " || line[cursor] === "	") cursor += 1;
	}
	return cursor;
}
function markdownSourceColumn(text, initialColumn = 0) {
	let column = initialColumn;
	for (const character of text) column += character === "	" ? 4 - column % 4 : 1;
	return column;
}
function blockquoteTabResidual(prefix, initialColumn = 0) {
	let column = initialColumn;
	let residual = 0;
	for (let index = 0; index < prefix.length; index += 1) {
		const character = prefix[index];
		if (character !== "	") {
			if (character === ">") residual = 0;
			column += 1;
			continue;
		}
		const width = 4 - column % 4;
		if (prefix[index - 1] === ">") residual = Math.max(0, width - 1);
		column += width;
	}
	return residual;
}
function consumeMarkdownIndentProjection(text, requiredColumns, initialColumn = 0) {
	let column = initialColumn;
	let consumedColumns = 0;
	let cursor = 0;
	while (cursor < text.length && consumedColumns < requiredColumns && /[ \t]/u.test(text[cursor] ?? "")) {
		const width = text[cursor] === "	" ? 4 - column % 4 : 1;
		column += width;
		consumedColumns += width;
		cursor += 1;
	}
	return {
		offset: cursor,
		residual: Math.max(0, consumedColumns - requiredColumns)
	};
}
//#endregion
//#region extensions/zalouser/src/text-styles-inline.ts
function protectLocalInlineSyntax(text, registry, preservedOpenBrackets = /* @__PURE__ */ new Set(), preserveTrailingWhitespace = false) {
	const bracketsProtected = replaceValidMatches(text, /`([^`\n]+)`/g, (match) => protectLiteral(registry, match[0])).replace(/\\([!-/:-@[-`{-~])/g, (match, character) => "*_~#\\{}>+-`".includes(character) ? match : protectLiteral(registry, match)).replace(/\\[ \t]+(?=\n|$)/g, (match) => protectLiteral(registry, match)).replace(/\\(?=\n|$)/g, (match) => protectLiteral(registry, match)).replace(/<\/?(?:u|ins)\b[^>]*>/gi, (tag) => protectLiteral(registry, tag)).replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi, (entity) => protectLiteral(registry, entity)).replace(/\[/g, (character, index) => preservedOpenBrackets.has(index) ? character : protectLiteral(registry, character));
	return replaceValidMatches((preserveTrailingWhitespace ? bracketsProtected : bracketsProtected.replace(/[ \t]+(?=\n|$)/g, (whitespace) => protectLiteral(registry, whitespace))).replace(/`/g, (marker, index, source) => isEscaped(source, index) ? marker : `\\${marker}`), LOCAL_TAG_PATTERN, (match) => {
		const tag = expectDefined(match[1], "tag name capture");
		const body = protectLocalInlineSyntax(expectDefined(match[2], "tag body capture"), registry);
		const style = TAG_STYLE_MAP[tag] ?? null;
		if (style === TextStyle.Underline) return `<u>${body}</u>`;
		const id = registry.tokens.size;
		return `${addToken(registry, {
			kind: "tag-open",
			id,
			style
		})} ${body} ${addToken(registry, {
			kind: "tag-close",
			id
		})}`;
	});
}
function replaceValidMatches(text, pattern, replace) {
	const regex = new RegExp(pattern.source, pattern.flags);
	let output = "";
	let cursor = 0;
	for (let match = regex.exec(text); match; match = regex.exec(text)) {
		if (isEscaped(text, match.index)) {
			regex.lastIndex = match.index + 1;
			continue;
		}
		output += text.slice(cursor, match.index) + replace(match);
		cursor = match.index + match[0].length;
	}
	return output + text.slice(cursor);
}
function isEscaped(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function protectLiteral(registry, text) {
	return addToken(registry, {
		kind: "literal",
		text
	});
}
function addToken(registry, token) {
	const value = `${registry.prefix}${registry.nextId}>`;
	registry.nextId += 1;
	registry.tokens.set(value, token);
	return value;
}
function projectLocalTokens(rendered, registry) {
	const offsets = Array.from({ length: rendered.text.length + 1 }, () => 0);
	const openTags = /* @__PURE__ */ new Map();
	const orderedStyles = [];
	let text = "";
	for (let index = 0; index < rendered.text.length; index += 1) {
		offsets[index] = text.length;
		const character = rendered.text[index] ?? "";
		const match = findLocalToken(rendered.text, index, registry);
		if ((character === " " ? findLocalToken(rendered.text, index + 1, registry) : null)?.token.kind === "tag-close") {
			offsets[index + 1] = text.length;
			continue;
		}
		if (!match) {
			text += character;
			offsets[index + 1] = text.length;
			continue;
		}
		const { token } = match;
		const tokenStart = text.length;
		for (let cursor = index + 1; cursor < match.end; cursor += 1) offsets[cursor] = tokenStart;
		if (token.kind === "literal") text += token.text;
		else if (token.kind === "tag-open") openTags.set(token.id, {
			start: text.length,
			rawStart: index,
			style: token.style
		});
		else if (token.kind === "tag-close") {
			const open = openTags.get(token.id);
			if (open?.style && text.length > open.start) orderedStyles.push({
				start: open.start,
				len: text.length - open.start,
				st: open.style,
				rawStart: open.rawStart,
				rawEnd: index
			});
			openTags.delete(token.id);
		}
		let consumedEnd = match.end;
		if (token.kind === "tag-open" && rendered.text[consumedEnd] === " ") {
			offsets[consumedEnd] = text.length;
			consumedEnd += 1;
		}
		offsets[consumedEnd] = text.length;
		index = consumedEnd - 1;
	}
	orderedStyles.push(...rendered.ranges.map((range) => ({
		start: offsets[range.start] ?? text.length,
		len: (offsets[range.start + range.length] ?? text.length) - (offsets[range.start] ?? text.length),
		st: range.style,
		rawStart: range.start,
		rawEnd: range.start + range.length
	})));
	return {
		text,
		offsets,
		styles: orderedStyles.filter((style) => style.len > 0).toSorted((left, right) => left.rawStart - right.rawStart || right.rawEnd - left.rawEnd).map(({ rawStart: _rawStart, rawEnd: _rawEnd, ...style }) => style)
	};
}
function findLocalToken(text, index, registry) {
	if (!text.startsWith(registry.prefix, index)) return null;
	const end = text.indexOf(">", index + registry.prefix.length);
	if (end === -1) return null;
	const token = registry.tokens.get(text.slice(index, end + 1));
	return token ? {
		end: end + 1,
		token
	} : null;
}
//#endregion
//#region extensions/zalouser/src/text-styles-source.ts
function restoreLeadingBlankLines(rendered, source) {
	let sourceLeading = 0;
	const sourceLines = source.split("\n");
	for (const [lineIndex, line] of sourceLines.entries()) {
		if (lineIndex === sourceLines.length - 1) break;
		if (/^[ \t]*$/u.test(line) || /^(?: {0,3}>[ \t]?)+[ \t]*$/u.test(line)) sourceLeading += 1;
		else break;
	}
	const renderedLeading = rendered.text.match(/^\n*/u)?.[0].length ?? 0;
	const missing = Math.max(0, sourceLeading - renderedLeading);
	return missing === 0 ? rendered : {
		text: `${"\n".repeat(missing)}${rendered.text}`,
		styles: rendered.styles.map((style) => ({
			...style,
			start: style.start + missing
		}))
	};
}
function stripUnsupportedHeadingStyles(ir, sourceIR, source) {
	const sourceLines = source.split("\n");
	const unsupportedLines = new Set((sourceIR.blocks ?? []).flatMap((block) => block.kind === "heading" && (block.headingOrigin === "setext" || (block.headingLevel ?? 0) > 4 || block.start === block.end && sourceAtxIsMarkerOnly(sourceLines[block.sourceStartLine ?? 0] ?? "", block.headingLevel ?? 1) && !sourceAtxHasClosingRun(sourceLines[block.sourceStartLine ?? 0] ?? "", block.headingLevel ?? 1)) ? [block.sourceStartLine] : []));
	const unsupportedBlocks = (ir.blocks ?? []).filter((block) => block.kind === "heading" && unsupportedLines.has(block.sourceStartLine));
	ir.styles = ir.styles.filter((span) => !span.style.startsWith("heading_") || !unsupportedBlocks.some((block) => block.start === span.start && block.end === span.end));
}
function sourceAtxIsMarkerOnly(line, level) {
	const marker = "#".repeat(level);
	const markerOffset = line.indexOf(marker);
	const remainder = line.slice(Math.max(0, markerOffset) + marker.length).replace(/[ \t]/gu, "");
	return !remainder || /^#+$/u.test(remainder);
}
function sourceAtxHasClosingRun(line, level) {
	const marker = "#".repeat(level);
	const markerOffset = line.indexOf(marker);
	return /^[ \t]+#+[ \t]*$/u.test(line.slice(Math.max(0, markerOffset) + marker.length));
}
function parseSharedIR(source) {
	return markdownToIR(source, {
		autolink: false,
		enableHtmlUnderline: true,
		enableTaskLists: true,
		headingStyle: "rich",
		linkify: false,
		preserveSourceBlockSpacing: true,
		tableMode: "off"
	});
}
function protectInlineSyntaxOutsideCode(source, ir, registry) {
	const sourceLines = source.split("\n");
	const sourceLineStarts = sourceLines.reduce((starts, _line, index) => {
		starts.push(index === 0 ? 0 : (starts[index - 1] ?? 0) + (sourceLines[index - 1]?.length ?? 0) + 1);
		return starts;
	}, []);
	const codeLines = /* @__PURE__ */ new Set();
	const thematicBreakLines = /* @__PURE__ */ new Set();
	const structuralPaddingLines = /* @__PURE__ */ new Set();
	const emptyAtxMarkers = /* @__PURE__ */ new Map();
	const closingAtxLines = /* @__PURE__ */ new Set();
	const atxHeadingLines = /* @__PURE__ */ new Set();
	const blockquoteDepthByLine = /* @__PURE__ */ new Map();
	for (const block of ir.blocks ?? []) {
		if (block.kind === "blockquote") for (let line = block.sourceStartLine ?? 0; line < (block.sourceEndLine ?? 0); line += 1) blockquoteDepthByLine.set(line, Math.max(blockquoteDepthByLine.get(line) ?? 0, block.blockquoteDepth ?? 0));
		if (block.kind === "heading" && block.headingOrigin === "atx") atxHeadingLines.add(block.sourceStartLine ?? 0);
		if (block.kind === "heading" && block.headingOrigin === "atx" && block.start === block.end) {
			const lineIndex = block.sourceStartLine ?? 0;
			const marker = "#".repeat(block.headingLevel ?? 1);
			if (sourceAtxIsMarkerOnly(sourceLines[lineIndex] ?? "", block.headingLevel ?? 1)) emptyAtxMarkers.set(lineIndex, marker);
			else closingAtxLines.add(lineIndex);
		} else if (block.kind === "heading" && block.headingOrigin === "atx") closingAtxLines.add(block.sourceStartLine ?? 0);
		if (block.kind === "thematic_break") {
			thematicBreakLines.add(block.sourceStartLine ?? 0);
			structuralPaddingLines.add(block.sourceStartLine ?? 0);
		} else if (block.kind === "heading" && block.headingOrigin === "setext") structuralPaddingLines.add((block.sourceEndLine ?? 1) - 1);
		if (block.kind !== "code_block") continue;
		for (let line = block.sourceStartLine ?? 0; line < (block.sourceEndLine ?? 0); line += 1) codeLines.add(line);
	}
	const listLines = /* @__PURE__ */ new Set();
	const listMarkerColumns = /* @__PURE__ */ new Map();
	const taskBrackets = /* @__PURE__ */ new Map();
	for (const item of ir.listItems ?? []) {
		for (let line = item.sourceStartLine ?? 0; line < (item.sourceEndLine ?? 0); line += 1) listLines.add(line);
		if (item.sourceMarker && item.sourceStartLine !== void 0) {
			const markers = listMarkerColumns.get(item.sourceStartLine) ?? /* @__PURE__ */ new Set();
			markers.add(item.sourceMarker.start - (sourceLineStarts[item.sourceStartLine] ?? 0));
			listMarkerColumns.set(item.sourceStartLine, markers);
		}
		if (item.markerOnly && item.sourceStartLine !== void 0) structuralPaddingLines.add(item.sourceStartLine);
		if (item.task && item.sourceStartLine !== void 0 && item.sourceEndLine !== void 0) for (let lineIndex = item.sourceStartLine; lineIndex < item.sourceEndLine; lineIndex += 1) {
			const line = sourceLines[lineIndex] ?? "";
			const match = /\[[ xX]\](?:[ \t]|$)/u.exec(line);
			if (!match) continue;
			const brackets = taskBrackets.get(lineIndex) ?? /* @__PURE__ */ new Set();
			brackets.add(match.index);
			taskBrackets.set(lineIndex, brackets);
			break;
		}
	}
	return sourceLines.map((rawLine, lineIndex) => {
		if (codeLines.has(lineIndex)) return rawLine;
		if (/^[ \t]+$/u.test(rawLine)) return "";
		let line = rawLine;
		const emptyMarker = emptyAtxMarkers.get(lineIndex);
		if (emptyMarker) {
			const heading = (ir.blocks ?? []).find((block) => block.kind === "heading" && block.sourceStartLine === lineIndex);
			const projection = sourceContainerProjection(rawLine, lineIndex, ir, sourceLineStarts, sourceLines, heading?.blockquoteDepth ?? 0);
			const markerOffset = rawLine.indexOf(emptyMarker, projection.offset);
			const literalPadding = `${" ".repeat(projection.residual)}${rawLine.slice(projection.offset, markerOffset)}`;
			const closingMarker = /^[ \t]+(#+)[ \t]*$/u.exec(rawLine.slice(markerOffset + emptyMarker.length))?.[1];
			const literal = emptyMarker.length > 4 ? `${literalPadding}${rawLine.slice(markerOffset)}` : closingMarker ?? `${literalPadding}${emptyMarker}`;
			line = `${rawLine.slice(0, markerOffset)}${emptyMarker} ${protectLiteral(registry, literal)}`;
		}
		if (closingAtxLines.has(lineIndex)) line = line.replace(/([ \t]+)(#+)(?=[ \t]*$)/u, (_match, spacing, marker) => `${spacing}${protectLiteral(registry, marker)}`);
		if (!listLines.has(lineIndex) && sourceBlockquotePrefixLength(rawLine) === 0 && /^( {1,3})(?=\S)/u.test(line) && !/^ {0,3}(?:#{1,6}(?:[ \t]|$)|>|[-*+][ \t]|(?:=+|-+)[ \t]*$|(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})$)/u.test(line)) line = line.replace(/^( {1,3})/u, (padding) => protectLiteral(registry, padding));
		line = protectLocalInlineSyntax(line, registry, taskBrackets.get(lineIndex), structuralPaddingLines.has(lineIndex) || /^(?: {0,3}>[ \t]?)+[ \t]*$/u.test(rawLine));
		line = protectResidualBlockPadding(line, registry, atxHeadingLines.has(lineIndex), !listLines.has(lineIndex), blockquoteDepthByLine.get(lineIndex) ?? 0);
		return thematicBreakLines.has(lineIndex) ? line : protectUnpairedDelimiterRuns(line, registry, listMarkerColumns.get(lineIndex));
	}).join("\n");
}
function protectResidualBlockPadding(line, registry, atxHeading, protectQuotePadding, blockquoteDepth) {
	let protectedLine = line;
	let cursor = 0;
	let consumedBlockquotes = 0;
	if (protectQuotePadding) while (cursor < protectedLine.length) {
		let marker = cursor;
		while (marker < protectedLine.length && marker - cursor < 3 && protectedLine[marker] === " ") marker += 1;
		if (protectedLine[marker] !== ">") break;
		consumedBlockquotes += 1;
		const whitespaceStart = marker + 1;
		const whitespace = /^[ \t]+/u.exec(protectedLine.slice(whitespaceStart))?.[0] ?? "";
		const remainingContent = protectedLine.slice(whitespaceStart + whitespace.length);
		if (!(atxHeading || consumedBlockquotes < blockquoteDepth) && whitespace.length > 1 && remainingContent) {
			protectedLine = `${protectedLine.slice(0, whitespaceStart + 1)}${protectLiteral(registry, whitespace.slice(1))}${protectedLine.slice(whitespaceStart + whitespace.length)}`;
			break;
		}
		cursor = whitespaceStart + whitespace.length;
	}
	if (atxHeading) protectedLine = protectedLine.replace(/(#{1,6})([ \t]+)/u, (_match, marker, whitespace) => whitespace.length > 1 ? `${marker} ${protectLiteral(registry, whitespace.slice(1))}` : `${marker}${whitespace}`);
	return protectedLine;
}
function protectUnpairedDelimiterRuns(line, registry, preservedOffsets = /* @__PURE__ */ new Set()) {
	const original = line;
	let protectedLine = line;
	const replacements = [];
	for (const marker of [
		"*",
		"_",
		"~"
	]) {
		const pattern = new RegExp(`${marker === "*" ? "\\*" : marker}+`, "gu");
		const matches = [...original.matchAll(pattern)].filter((match) => !preservedOffsets.has(match.index) && !isEscaped(original, match.index));
		const remaining = new Map(matches.map((match) => [match, match[0].length]));
		const opens = /* @__PURE__ */ new Map();
		const both = /* @__PURE__ */ new Map();
		const closingConsumed = /* @__PURE__ */ new Map();
		const stack = [];
		for (const match of matches) {
			const previous = original[match.index - 1] ?? "";
			const next = original[match.index + match[0].length] ?? "";
			const previousWhitespace = !previous || /\s/u.test(previous);
			const nextWhitespace = !next || /\s/u.test(next);
			const previousPunctuation = /[\p{P}\p{S}]/u.test(previous);
			const nextPunctuation = /[\p{P}\p{S}]/u.test(next);
			const leftFlanking = !nextWhitespace && (!nextPunctuation || previousWhitespace || previousPunctuation);
			const rightFlanking = !previousWhitespace && (!previousPunctuation || nextWhitespace || nextPunctuation);
			const canOpen = marker === "_" ? leftFlanking && (!rightFlanking || previousPunctuation) : leftFlanking;
			const canClose = marker === "_" ? rightFlanking && (!leftFlanking || nextPunctuation) : rightFlanking;
			opens.set(match, canOpen);
			both.set(match, canOpen && canClose);
			if (canClose) {
				let closing = remaining.get(match) ?? 0;
				while (closing > 0 && stack.length > 0) {
					const openingIndex = stack.findLastIndex((candidate) => !((both.get(candidate) || both.get(match)) && (candidate[0].length + match[0].length) % 3 === 0 && candidate[0].length % 3 !== 0 && match[0].length % 3 !== 0));
					const opening = stack[openingIndex];
					if (!opening) break;
					const matched = Math.min(closing, remaining.get(opening) ?? 0);
					closingConsumed.set(match, (closingConsumed.get(match) ?? 0) + matched);
					closing -= matched;
					remaining.set(match, closing);
					remaining.set(opening, (remaining.get(opening) ?? 0) - matched);
					if ((remaining.get(opening) ?? 0) === 0) stack.splice(openingIndex, 1);
				}
			}
			if (canOpen && (remaining.get(match) ?? 0) > 0) stack.push(match);
		}
		for (const match of matches.toReversed()) {
			const unmatched = remaining.get(match) ?? 0;
			if (unmatched === 0) continue;
			replacements.push({
				start: match.index,
				end: match.index + match[0].length,
				literal: marker.repeat(unmatched),
				literalFirst: opens.get(match) === true && (closingConsumed.get(match) ?? 0) === 0,
				matched: marker.repeat(match[0].length - unmatched)
			});
		}
	}
	for (const replacement of replacements.toSorted((left, right) => right.start - left.start)) {
		const literal = protectLiteral(registry, replacement.literal);
		const text = replacement.literalFirst ? `${literal}${replacement.matched}` : `${replacement.matched}${literal}`;
		protectedLine = `${protectedLine.slice(0, replacement.start)}${text}${protectedLine.slice(replacement.end)}`;
	}
	return protectedLine;
}
//#endregion
//#region extensions/zalouser/src/text-styles-compile.ts
function collectBlockEdits(ir, sourceIR, offsets, projectedText, source) {
	const edits = [];
	const sourceLines = source.split("\n");
	const sourceLineStarts = sourceLines.reduce((starts, _line, index) => {
		starts.push(index === 0 ? 0 : (starts[index - 1] ?? 0) + (sourceLines[index - 1]?.length ?? 0) + 1);
		return starts;
	}, []);
	for (const [itemIndex, item] of (ir.listItems ?? []).entries()) {
		if (!item.listMarker) continue;
		const nestedStarts = (ir.listItems ?? []).filter((candidate) => candidate.parentListId === item.listId && candidate.start !== void 0 && candidate.start < (item.contentStart ?? item.listMarker.end)).map((candidate) => candidate.start);
		const nestedStart = nestedStarts.length > 0 ? Math.min(...nestedStarts) : item.listMarker.end;
		const materializedBlock = (ir.blocks ?? []).some((block) => block.kind !== "blockquote" && item.start !== void 0 && item.end !== void 0 && block.start >= item.start && block.end <= item.end);
		const sourceItem = sourceIR.listItems?.[itemIndex];
		const sourceContent = sourceItem ? sourceListItemContent(source, sourceIR, sourceLineStarts, sourceLines, sourceItem) : "";
		const hasRenderedContent = item.contentStart !== void 0 && item.contentEnd !== void 0 && item.contentEnd > item.contentStart;
		const unicodeContent = !hasRenderedContent && !materializedBlock && UNICODE_SEPARATOR_PATTERN.test(sourceContent) ? sourceContent : "";
		const literalMarker = unicodeContent || (!hasRenderedContent && !materializedBlock && sourceItem?.sourceMarker ? source.slice(sourceItem.sourceMarker.start, sourceItem.sourceMarker.end) : "");
		const markerQuoteDepth = (ir.blocks ?? []).filter((block) => block.kind === "blockquote" && item.start !== void 0 && item.end !== void 0 && block.start >= item.start && block.end <= item.end).reduce((depth, block) => Math.max(depth, block.blockquoteDepth ?? 0), 0);
		const existingQuoteIndent = (ir.blocks ?? []).filter((block) => block.kind === "blockquote" && block.start < block.end && item.start !== void 0 && item.end !== void 0 && block.start <= item.start && block.end >= item.end).reduce((depth, block) => Math.max(depth, block.depth), 0);
		const markerIndent = Math.max(0, (item.depth ?? 0) + markerQuoteDepth - existingQuoteIndent);
		edits.push({
			start: projectOffset(offsets, item.start ?? item.listMarker.start),
			end: projectOffset(offsets, Math.max(item.listMarker.end, nestedStart)),
			text: literalMarker,
			...literalMarker && markerIndent > 0 ? { indentSize: Math.min(5, markerIndent) } : {},
			...unicodeContent && !item.task ? { listStyle: item.kind === "ordered" ? TextStyle.OrderedList : TextStyle.UnorderedList } : {}
		});
	}
	for (const block of ir.blocks ?? []) {
		if (block.kind !== "code_block") continue;
		const start = projectOffset(offsets, block.start);
		const end = projectOffset(offsets, block.end);
		const sourceBlock = (sourceIR.blocks ?? []).find((candidate) => candidate.kind === "code_block" && candidate.sourceStartLine === block.sourceStartLine);
		const normalized = normalizeCodeBlock(ir.text.slice(block.start, block.end), block.codeOrigin, !source.endsWith("\n") && block.sourceEndLine === sourceLines.length, sourceIR, sourceLines, sourceLineStarts, block.sourceStartLine, block.blockquoteDepth ?? 0);
		const sourceHasNbsp = sourceLines.slice((block.sourceStartLine ?? 0) + (block.codeOrigin === "fenced" ? 1 : 0), block.sourceEndLine ?? 0).some((line) => line.includes("\xA0"));
		const listOwnsBlock = (Boolean(normalized.replace(/[ \t\r\n\u00A0]/gu, "")) || sourceHasNbsp) && (ir.listItems ?? []).some((item) => item.contentStart !== void 0 && item.contentEnd !== void 0 && item.contentEnd > item.contentStart && item.end !== void 0 && item.contentStart <= block.start && item.end >= block.end);
		edits.push({
			start,
			end,
			text: block.codeOrigin === "fenced" && block.codeClosed === false && sourceBlock ? renderUnclosedCodeBlock(sourceBlock, sourceIR, sourceLines, sourceLineStarts, normalized) : normalized,
			...!listOwnsBlock && (block.codeOrigin === "fenced" && block.codeClosed === false || block.codeOrigin === "indented") && block.depth > 1 ? { indentSize: Math.min(5, (block.blockquoteDepth ?? 0) + Math.max(0, block.depth - 2 - (block.blockquoteDepth ?? 0))) } : {}
		});
	}
	for (const block of ir.blocks ?? []) {
		const sourceBlock = (sourceIR.blocks ?? []).find((candidate) => candidate.kind === block.kind && candidate.sourceStartLine === block.sourceStartLine && candidate.depth === block.depth && candidate.blockquoteDepth === block.blockquoteDepth);
		if (!sourceBlock) continue;
		if (block.kind === "blockquote" && block.start === block.end) {
			const containsClosedCode = (sourceIR.blocks ?? []).some((candidate) => candidate.kind === "code_block" && candidate.codeClosed === true && (candidate.sourceStartLine ?? 0) >= (sourceBlock.sourceStartLine ?? 0) && (candidate.sourceEndLine ?? 0) <= (sourceBlock.sourceEndLine ?? 0));
			const hasNestedQuote = (sourceIR.blocks ?? []).some((candidate) => candidate.kind === "blockquote" && candidate.sourceStartLine === sourceBlock.sourceStartLine && (candidate.blockquoteDepth ?? 0) > (sourceBlock.blockquoteDepth ?? 0));
			if (containsClosedCode || hasNestedQuote) continue;
			const content = sourceLines.slice(sourceBlock.sourceStartLine ?? 0, sourceBlock.sourceEndLine ?? 0).map((line) => sourceContainerContent(line)).join("\n").replace(/[ \t\r\n]+$/gu, "");
			if (content.replace(/[ \t\r\n]/gu, "")) {
				const position = projectOffset(offsets, block.start);
				edits.push({
					start: position,
					end: position,
					text: content,
					indentSize: Math.min(5, sourceBlock.blockquoteDepth ?? 1)
				});
			}
			continue;
		}
		if (sourceBlock.start === sourceBlock.end && !(block.kind === "heading" && (sourceBlock.headingOrigin === "setext" || sourceBlock.headingOrigin === "atx" && (sourceBlock.headingLevel ?? 0) > 4 && !sourceAtxIsMarkerOnly(sourceLines[sourceBlock.sourceStartLine ?? 0] ?? "", sourceBlock.headingLevel ?? 1)))) continue;
		if (block.kind === "heading" && sourceBlock.headingOrigin === "atx" && (sourceBlock.headingLevel ?? 0) > 4) {
			const lineIndex = sourceBlock.sourceStartLine ?? 0;
			const line = sourceLines[lineIndex] ?? "";
			const projection = sourceContainerProjection(line, lineIndex, sourceIR, sourceLineStarts, sourceLines, sourceBlock.blockquoteDepth ?? 0);
			const markerMatch = /^( {0,3}#{5,6}[ \t]+)/u.exec(line.slice(projection.offset))?.[0] ?? "";
			const marker = `${" ".repeat(projection.residual)}${markerMatch}`;
			if (marker) {
				const offset = projectOffset(offsets, block.start);
				edits.push({
					start: offset,
					end: offset,
					text: marker
				});
			}
		} else if (block.kind === "heading" && sourceBlock.headingOrigin === "setext" || block.kind === "thematic_break") {
			const isHeading = block.kind === "heading";
			const lineIndex = isHeading ? (sourceBlock.sourceEndLine ?? 1) - 1 : sourceBlock.sourceStartLine ?? 0;
			const line = sourceLines[lineIndex] ?? "";
			const projection = sourceContainerProjection(line, lineIndex, sourceIR, sourceLineStarts, sourceLines, sourceBlock.blockquoteDepth ?? 0);
			edits.push({
				start: projectOffset(offsets, isHeading ? block.end : block.start),
				end: projectOffset(offsets, block.end),
				text: `${isHeading ? "\n" : ""}${" ".repeat(projection.residual)}${line.slice(projection.offset)}`
			});
		}
	}
	edits.push(...collectSourceSpacingEdits(ir, sourceIR, offsets, projectedText, sourceLines, sourceLineStarts).filter((spacingEdit) => !edits.some((edit) => spacingEdit.start < edit.end && spacingEdit.end > edit.start)));
	return edits.toSorted((left, right) => left.start - right.start || left.end - right.end || Number(right.text.startsWith("\n")) - Number(left.text.startsWith("\n"))).filter((edit, index, all) => !all.slice(0, index).some((other) => other.start === edit.start && other.end === edit.end && other.text === edit.text));
}
function renderUnclosedCodeBlock(block, sourceIR, sourceLines, sourceLineStarts, payload) {
	const sourceStartLine = block.sourceStartLine ?? 0;
	const openingLine = sourceLines[sourceStartLine] ?? "";
	const projection = sourceContainerProjection(openingLine, sourceStartLine, sourceIR, sourceLineStarts, sourceLines, block.blockquoteDepth ?? 0);
	const opening = block.depth > 1 ? `${" ".repeat(projection.residual)}${openingLine.slice(projection.offset)}` : openingLine;
	if ((block.sourceEndLine ?? 0) - (block.sourceStartLine ?? 0) <= 1) return `${opening}${payload.endsWith("\n") ? "\n" : ""}`;
	return payload ? `${opening}\n${payload}` : opening;
}
function collectSourceSpacingEdits(ir, sourceIR, offsets, text, sourceLines, sourceLineStarts) {
	const boundaries = [...(ir.blocks ?? []).map((block) => Object.assign({}, block, { sameLineNested: (sourceIR.listItems ?? []).some((item) => item.sourceStartLine === block.sourceStartLine) })), ...(ir.listItems ?? []).flatMap((item, itemIndex) => item.start !== void 0 && item.end !== void 0 && item.sourceStartLine !== void 0 && item.sourceEndLine !== void 0 ? [{
		start: item.start,
		end: item.end,
		sourceStartLine: item.sourceStartLine,
		sourceEndLine: item.sourceEndLine,
		sameLineNested: (() => {
			const sourceItem = sourceIR.listItems?.[itemIndex];
			if (!sourceItem?.sourceMarker || sourceItem.sourceStartLine === void 0) return false;
			const lineStart = sourceLineStarts[sourceItem.sourceStartLine] ?? 0;
			const firstMarker = (sourceIR.listItems ?? []).filter((candidate) => candidate.sourceStartLine === sourceItem.sourceStartLine).reduce((first, candidate) => Math.min(first, candidate.sourceMarker?.start ?? first), Number.POSITIVE_INFINITY);
			return sourceItem.sourceMarker.start > Math.max(lineStart, firstMarker);
		})()
	}] : [])];
	const edits = [];
	const sourceLineHasContent = (lineIndex) => (sourceIR.blocks ?? []).some((block) => block.kind === "thematic_break" && block.sourceStartLine === lineIndex) || Boolean(sourceContainerContent(sourceLines[lineIndex] ?? "").replace(/[ \t\r\n]/gu, ""));
	for (const boundary of boundaries) {
		const start = projectOffset(offsets, boundary.start);
		if (boundary.sourceStartLine !== void 0 && boundary.sourceStartLine > 0 && !boundary.sameLineNested && sourceLineHasContent(boundary.sourceStartLine - 1)) {
			if (start > 0 && text[start - 1] !== "\n") edits.push({
				start,
				end: start,
				text: "\n"
			});
			else if (text.slice(Math.max(0, start - 2), start) === "\n\n") edits.push({
				start: start - 1,
				end: start,
				text: ""
			});
		}
		const end = projectOffset(offsets, boundary.end);
		if (boundary.sourceEndLine !== void 0 && boundary.sourceEndLine < sourceLines.length && (boundary.sourceEndLine === 0 || sourceLineHasContent(boundary.sourceEndLine - 1)) && sourceLineHasContent(boundary.sourceEndLine)) {
			let newlineStart = end;
			while (newlineStart > 0 && text[newlineStart - 1] === "\n") newlineStart -= 1;
			let newlineEnd = end;
			while (newlineEnd < text.length && text[newlineEnd] === "\n") newlineEnd += 1;
			if (newlineEnd - newlineStart > 1) edits.push({
				start: newlineEnd - 1,
				end: newlineEnd,
				text: ""
			});
		}
	}
	return edits;
}
function sourceContainerContent(line) {
	let cursor = 0;
	while (cursor < line.length) {
		let marker = cursor;
		while (marker < line.length && marker - cursor < 3 && line[marker] === " ") marker += 1;
		if (line[marker] === ">") {
			cursor = marker + 1;
			if (line[cursor] === " " || line[cursor] === "	") cursor += 1;
			continue;
		}
		const listMarker = /^(?:[-*+]|\d{1,9}[.)])(?:[ \t]+|$)/u.exec(line.slice(marker));
		if (listMarker) {
			cursor = marker + listMarker[0].length;
			continue;
		}
		break;
	}
	return line.slice(cursor);
}
function normalizeCodeBlock(text, origin, trimTerminalNewline, ir, sourceLines, sourceLineStarts, sourceStartLine, blockquoteDepth) {
	const indent = origin === "indented" ? "\xA0".repeat(4) : "";
	const normalized = text.split("\n").map((line, index) => {
		if (line) return indent + normalizeCodeBlockLeadingWhitespace(line);
		if (origin !== "indented" || sourceStartLine === void 0) return line;
		const lineIndex = sourceStartLine + index;
		const rawLine = sourceLines[lineIndex] ?? "";
		const prefixLength = sourceContainerProjection(rawLine, lineIndex, ir, sourceLineStarts, sourceLines, blockquoteDepth).offset;
		const sourceContent = rawLine.slice(prefixLength);
		return /^[ \t]+$/u.test(sourceContent) ? normalizeCodeBlockLeadingWhitespace(sourceContent) : line;
	}).join("\n");
	return trimTerminalNewline && normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
}
//#endregion
//#region extensions/zalouser/src/text-styles.ts
function parseZalouserTextStyles(input) {
	const source = input.replace(/\r\n?/g, "\n");
	const registry = {
		nextId: 0,
		prefix: `<zalouser-${randomUUID()}-`,
		tokens: /* @__PURE__ */ new Map()
	};
	const sourceIR = parseSharedIR(source);
	const protectedSource = protectInlineSyntaxOutsideCode(source, sourceIR, registry);
	const ir = protectedSource === source ? sourceIR : parseSharedIR(protectedSource);
	stripUnsupportedHeadingStyles(ir, sourceIR, source);
	const projected = projectLocalTokens(renderMarkdownWithAttributedRanges(ir, { styleMap: ZALOUSER_STYLE_MAP }), registry);
	const edits = collectBlockEdits(ir, sourceIR, projected.offsets, projected.text, source);
	const structuralStyles = collectStructuralStyles(ir, projected.offsets, projected.text);
	const withLeadingLines = restoreLeadingBlankLines(applyTextEdits(projected.text, projected.styles, structuralStyles, edits), source);
	return {
		text: restoreTrailingNewlines(withLeadingLines.text, source, sourceIR),
		styles: withLeadingLines.styles
	};
}
//#endregion
//#region extensions/zalouser/src/send.ts
const ZALO_TEXT_LIMIT = 2e3;
async function sendMessageZalouser(threadId, text, options = {}) {
	const { onDeliveryResult, ...transportOptions } = options;
	const prepared = transportOptions.textMode === "markdown" ? parseZalouserTextStyles(text) : {
		text,
		styles: transportOptions.textStyles
	};
	const textChunkLimit = transportOptions.textChunkLimit ?? ZALO_TEXT_LIMIT;
	const chunks = splitStyledText(prepared.text, (prepared.styles?.length ?? 0) > 0 ? prepared.styles : void 0, textChunkLimit, transportOptions.textChunkMode);
	let lastResult = null;
	for (const [index, chunk] of chunks.entries()) {
		const chunkOptions = index === 0 ? {
			...transportOptions,
			textStyles: chunk.styles
		} : {
			...transportOptions,
			caption: void 0,
			mediaLocalRoots: void 0,
			mediaUrl: void 0,
			textStyles: chunk.styles
		};
		const result = await sendZaloTextMessage(threadId, chunk.text, chunkOptions, onDeliveryResult);
		if (!result.ok) {
			const error = new Error(result.error || "Failed to send Zalouser message");
			if (result.receipt.platformMessageIds.length > 0) throw createChannelPartialDeliveryError(error, {
				messageIds: result.receipt.platformMessageIds,
				receipt: result.receipt,
				visibleReplySent: true
			});
			throw error;
		}
		await onDeliveryResult?.(result);
		lastResult = result;
	}
	return lastResult ?? {
		ok: false,
		error: "No message content provided",
		receipt: createZalouserSendReceipt({
			threadId,
			kind: "text"
		})
	};
}
async function sendImageZalouser(threadId, imageUrl, options = {}) {
	return await sendMessageZalouser(threadId, options.caption ?? "", {
		...options,
		caption: void 0,
		mediaUrl: imageUrl
	});
}
async function sendReactionZalouser(params) {
	const result = await sendZaloReaction(params);
	return {
		ok: result.ok,
		error: result.error,
		receipt: createZalouserSendReceipt({
			threadId: params.threadId,
			kind: "unknown"
		})
	};
}
function splitStyledText(text, styles, limit, mode) {
	if (text.length === 0) return [{
		text,
		styles: void 0
	}];
	return chunkTextRanges(text, {
		limit,
		mode: mode === "newline" ? "preferred" : "hard"
	}).map(({ start, end }) => ({
		text: text.slice(start, end),
		styles: sliceTextStyles(styles, start, end)
	}));
}
//#endregion
export { sendMessageZalouser as n, sendReactionZalouser as r, sendImageZalouser as t };
