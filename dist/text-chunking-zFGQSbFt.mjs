import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import "./safe-text-CBmKtmbt.mjs";
import "./code-regions-NxEObIZm.mjs";
import "./directive-tags-D9uZSb5h.mjs";
import { t as findGraphemeChunkEnd } from "./grapheme-CS7DlGGi.mjs";
import "./assistant-visible-text-CVgfl6Gk.mjs";
import { r as splitLongTextLine, t as chunkTextByBreakResolver } from "./text-chunking-BmoQ_S_D.mjs";
import { d as annotateAssistantTranscriptRoleMessageBoundary, f as copyMarkdownLinkSpan, g as mergeStyleSpans, h as mergeAnnotationSpans, l as sliceMarkdownIR, m as isAutoLinkedMarkdownLink, t as appendMarkdownIR, u as sliceMarkdownIRRanges } from "./ir-CdrgmCrl.mjs";
import "./tables-COj_oUWP.mjs";
import { n as applyConstructFallbacks } from "./strip-markdown-B0Wv9_X8.mjs";
import "./auto-linked-file-ref-BHX9Hf63.mjs";
//#region packages/markdown-core/src/format-capabilities.ts
const NATIVE_FORMAT_CONSTRUCTS = {
	bold: "native",
	italic: "native",
	underline: "native",
	strikethrough: "native",
	spoiler: "native",
	codeInline: "native",
	codeBlock: "native",
	codeLanguage: "native",
	linkLabel: "native",
	heading: "native",
	bulletList: "native",
	orderedList: "native",
	taskList: "native",
	table: "native",
	blockquote: "native",
	image: "native",
	mention: "native"
};
/** Defines a channel profile with native support as the default for each construct. */
function defineFormatProfile(profile) {
	return {
		...profile,
		constructs: {
			...NATIVE_FORMAT_CONSTRUCTS,
			...profile.constructs
		}
	};
}
/** Runtime helpers for defining static channel formatting capabilities. */
const FormatCapabilityProfile = { define: defineFormatProfile };
//#endregion
//#region packages/markdown-core/src/render-aware-chunking.ts
function prepareChunkForMessageBoundary(options, chunk) {
	return options.assistantTranscriptRoleMessageBoundaries === true ? annotateAssistantTranscriptRoleMessageBoundary(chunk) : chunk;
}
function renderCandidate(options, rawSource) {
	const source = prepareChunkForMessageBoundary(options, rawSource);
	return {
		rawSource,
		output: {
			source,
			rendered: options.renderChunk(source)
		}
	};
}
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
function renderMarkdownIRChunksWithinLimit(options) {
	if (!options.ir.text) return [];
	if (options.limit === Number.POSITIVE_INFINITY) {
		const source = prepareChunkForMessageBoundary(options, options.ir);
		return [{
			source,
			rendered: options.renderChunk(source)
		}];
	}
	const normalizedLimit = resolveIntegerOption(options.limit, 1, { min: 1 });
	const renderResolver = {
		measureRendered: options.measureRendered,
		renderChunk: (chunk) => options.renderChunk(prepareChunkForMessageBoundary(options, chunk))
	};
	const pending = splitMarkdownIRPreserveWhitespace(options.ir, normalizedLimit).toReversed();
	const finalized = [];
	while (pending.length > 0) {
		const chunk = pending.pop();
		if (!chunk) continue;
		const candidate = renderCandidate(options, chunk);
		if (options.measureRendered(candidate.output.rendered) <= normalizedLimit || chunk.text.length <= 1) {
			finalized.push(candidate);
			continue;
		}
		const split = splitMarkdownIRByRenderedLimit(chunk, normalizedLimit, renderResolver);
		if (split.length <= 1) {
			finalized.push(candidate);
			continue;
		}
		for (let index = split.length - 1; index >= 0; index -= 1) {
			const next = split[index];
			if (next) pending.push(next);
		}
	}
	return coalesceWhitespaceOnlyMarkdownIRChunks(finalized, normalizedLimit, options).map((chunk) => chunk.output);
}
function splitMarkdownIRByRenderedLimit(chunk, renderedLimit, options) {
	const currentTextLength = chunk.text.length;
	const splitLimit = findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options);
	if (splitLimit <= 0) return [chunk];
	const split = splitMarkdownIRPreserveWhitespace(chunk, splitLimit);
	const firstChunk = split[0];
	if (firstChunk && options.measureRendered(options.renderChunk(firstChunk)) <= renderedLimit) return split;
	return [sliceMarkdownIR(chunk, 0, splitLimit), sliceMarkdownIR(chunk, splitLimit, currentTextLength)];
}
function findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options) {
	const currentTextLength = chunk.text.length;
	for (let candidateLength = currentTextLength - 1; candidateLength >= 1; candidateLength -= 1) {
		const safeCandidateLength = findGraphemeChunkEnd(chunk.text, 0, candidateLength);
		const candidate = sliceMarkdownIR(chunk, 0, safeCandidateLength);
		const rendered = options.renderChunk(candidate);
		if (options.measureRendered(rendered) <= renderedLimit) return safeCandidateLength;
		candidateLength = Math.min(candidateLength, safeCandidateLength);
	}
	return 0;
}
function findMarkdownIRPreservedSplitIndex(text, start, limit) {
	const maxEnd = Math.min(text.length, start + limit);
	if (maxEnd >= text.length) return text.length;
	let lastOutsideParenNewlineBreak = -1;
	let lastOutsideParenWhitespaceBreak = -1;
	let lastOutsideParenWhitespaceRunStart = -1;
	let lastAnyNewlineBreak = -1;
	let lastAnyWhitespaceBreak = -1;
	let lastAnyWhitespaceRunStart = -1;
	let parenDepth = 0;
	let sawNonWhitespace = false;
	for (let index = start; index < maxEnd; index += 1) {
		const char = text.charAt(index);
		if (char === "(") {
			sawNonWhitespace = true;
			parenDepth += 1;
			continue;
		}
		if (char === ")" && parenDepth > 0) {
			sawNonWhitespace = true;
			parenDepth -= 1;
			continue;
		}
		if (!/\s/.test(char)) {
			sawNonWhitespace = true;
			continue;
		}
		if (!sawNonWhitespace) continue;
		if (char === "\n") {
			lastAnyNewlineBreak = index + 1;
			if (parenDepth === 0) lastOutsideParenNewlineBreak = index + 1;
			continue;
		}
		const whitespaceRunStart = index === start || !/\s/.test(text[index - 1] ?? "") ? index : lastAnyWhitespaceRunStart;
		lastAnyWhitespaceBreak = index + 1;
		lastAnyWhitespaceRunStart = whitespaceRunStart;
		if (parenDepth === 0) {
			lastOutsideParenWhitespaceBreak = index + 1;
			lastOutsideParenWhitespaceRunStart = whitespaceRunStart;
		}
	}
	const resolveWhitespaceBreak = (breakIndex, runStart) => {
		if (breakIndex <= start) return breakIndex;
		if (runStart <= start) return breakIndex;
		return /\s/.test(text[breakIndex] ?? "") ? runStart : breakIndex;
	};
	if (lastOutsideParenNewlineBreak > start) return lastOutsideParenNewlineBreak;
	if (lastOutsideParenWhitespaceBreak > start) return resolveWhitespaceBreak(lastOutsideParenWhitespaceBreak, lastOutsideParenWhitespaceRunStart);
	if (lastAnyNewlineBreak > start) return lastAnyNewlineBreak;
	if (lastAnyWhitespaceBreak > start) return resolveWhitespaceBreak(lastAnyWhitespaceBreak, lastAnyWhitespaceRunStart);
	return maxEnd;
}
function splitMarkdownIRPreserveWhitespace(ir, limit) {
	if (!ir.text) return [];
	const normalizedLimit = resolveIntegerOption(limit, 1, { min: 1 });
	if (normalizedLimit <= 0 || ir.text.length <= normalizedLimit) return [ir];
	const codeSpans = ir.styles.filter((span) => span.style === "code" || span.style === "code_block").toSorted((left, right) => left.start - right.start);
	let codeIndex = 0;
	const ranges = [];
	let cursor = 0;
	while (cursor < ir.text.length) {
		const maxEnd = Math.min(ir.text.length, cursor + normalizedLimit);
		let preferredEnd = findMarkdownIRPreservedSplitIndex(ir.text, cursor, normalizedLimit);
		let code = codeSpans[codeIndex];
		while (code && code.end <= preferredEnd) code = codeSpans[++codeIndex];
		if (code && code.start < preferredEnd && preferredEnd < code.end) {
			let codeEnd = maxEnd;
			while (codeEnd > cursor && (/\s/u.test(ir.text[codeEnd - 1] ?? "") || /\s/u.test(ir.text[codeEnd] ?? ""))) codeEnd -= 1;
			codeEnd = findGraphemeChunkEnd(ir.text, cursor, codeEnd, codeEnd, false);
			let nextContent = maxEnd;
			const nextMaxEnd = Math.min(ir.text.length, codeEnd + normalizedLimit);
			while (nextContent < nextMaxEnd && /\s/u.test(ir.text[nextContent] ?? "")) nextContent += 1;
			if (codeEnd > cursor && findGraphemeChunkEnd(ir.text, codeEnd, nextMaxEnd, void 0, false) > nextContent) preferredEnd = codeEnd;
		}
		const end = findGraphemeChunkEnd(ir.text, cursor, maxEnd, preferredEnd);
		ranges.push({
			start: cursor,
			end
		});
		cursor = end;
	}
	return sliceMarkdownIRRanges(ir, ranges);
}
function coalesceWhitespaceOnlyMarkdownIRChunks(chunks, renderedLimit, options) {
	let offset = 0;
	const pending = chunks.map((chunk) => {
		const start = offset;
		offset += chunk.rawSource.text.length;
		return {
			...chunk,
			start,
			end: offset
		};
	});
	const coalesced = [];
	pending.forEach((chunk, index) => {
		const currentRange = {
			start: chunk.start,
			end: chunk.end
		};
		const current = {
			...chunk,
			ranges: [currentRange]
		};
		if (chunk.rawSource.text.trim().length > 0) {
			coalesced.push(current);
			return;
		}
		const prev = coalesced.at(-1);
		const next = pending[index + 1];
		const chunkLength = chunk.rawSource.text.length;
		const renderIfFits = (ranges) => {
			const retained = [];
			for (const range of ranges) {
				const last = retained.at(-1);
				if (last?.end === range.start) last.end = range.end;
				else retained.push({ ...range });
			}
			const source = {
				text: "",
				styles: [],
				links: []
			};
			for (const range of retained) appendMarkdownIR(source, sliceMarkdownIR(options.ir, range.start, range.end));
			source.styles = mergeStyleSpans(source.styles);
			if (source.annotations) source.annotations = mergeAnnotationSpans(source.annotations);
			const candidate = renderCandidate(options, source);
			return options.measureRendered(candidate.output.rendered) <= renderedLimit ? {
				...candidate,
				ranges: retained
			} : void 0;
		};
		if (prev) {
			const mergedPrev = renderIfFits([...prev.ranges, currentRange]);
			if (mergedPrev) {
				coalesced[coalesced.length - 1] = mergedPrev;
				return;
			}
		}
		if (next) {
			const mergedNext = renderIfFits([{
				start: chunk.start,
				end: next.end
			}]);
			if (mergedNext) {
				pending[index + 1] = {
					...mergedNext,
					start: chunk.start,
					end: next.end
				};
				return;
			}
		}
		if (prev && next) for (let prefixLength = chunkLength - 1; prefixLength > 0; prefixLength -= 1) {
			prefixLength = findGraphemeChunkEnd(chunk.rawSource.text, 0, prefixLength, prefixLength, false);
			if (prefixLength === 0) break;
			const boundary = chunk.start + prefixLength;
			const mergedPrev = renderIfFits([...prev.ranges, {
				start: chunk.start,
				end: boundary
			}]);
			const mergedNext = mergedPrev && renderIfFits([{
				start: boundary,
				end: next.end
			}]);
			if (mergedPrev && mergedNext) {
				coalesced[coalesced.length - 1] = mergedPrev;
				pending[index + 1] = {
					...mergedNext,
					start: boundary,
					end: next.end
				};
				return;
			}
		}
		if (options.measureRendered(chunk.output.rendered) > 0 && (chunk.rawSource.styles.length > 0 || chunk.rawSource.links.length > 0 || chunk.rawSource.annotations?.length || chunk.rawSource.listItems?.length)) coalesced.push(current);
	});
	return coalesced;
}
//#endregion
//#region packages/markdown-core/src/render-attributed.ts
/** Renders Markdown IR into text plus UTF-16 style ranges for attributed-text targets. */
function renderMarkdownWithAttributedRanges(ir, options, profile) {
	const projected = profile ? applyConstructFallbacks(ir, profile) : ir;
	const text = projected.text ?? "";
	const insertions = [];
	let rendered = text;
	if (options.renderLink) {
		rendered = "";
		let cursor = 0;
		for (const link of projected.links.toSorted((a, b) => a.start - b.start)) {
			if (link.start < cursor) continue;
			rendered += text.slice(cursor, link.end);
			const origin = isAutoLinkedMarkdownLink(link) ? "linkify" : "authored";
			const suffix = options.renderLink(link, text, { origin });
			rendered += suffix;
			if (suffix) insertions.push({
				pos: link.end,
				length: suffix.length
			});
			cursor = link.end;
		}
		rendered += text.slice(cursor);
	}
	rendered = options.trimEnd ? rendered.trimEnd() : rendered;
	const ranges = [];
	const appendRange = (offset, end, style) => {
		const start = Math.max(0, Math.min(offset, rendered.length));
		const length = Math.min(end, rendered.length) - start;
		if (length > 0) ranges.push({
			start,
			length,
			style
		});
	};
	const appendSpan = (span, style) => {
		if (style === void 0) return;
		let cursor = span.start;
		let shift = 0;
		for (const insertion of insertions) if (insertion.pos <= cursor) shift += insertion.length;
		else if (insertion.pos >= span.end) break;
		else {
			appendRange(cursor + shift, insertion.pos + shift, style);
			cursor = insertion.pos;
			shift += insertion.length;
		}
		appendRange(cursor + shift, span.end + shift, style);
	};
	projected.styles.forEach((span) => appendSpan(span, options.styleMap[span.style]));
	for (const annotation of projected.annotations ?? []) appendSpan(annotation, options.annotationStyleMap?.[annotation.type]);
	ranges.sort((a, b) => a.start - b.start || a.length - b.length || a.style.localeCompare(b.style));
	let retained = 0;
	for (const range of ranges) {
		const previous = ranges[retained - 1];
		if (previous && previous.style === range.style && range.start <= previous.start + previous.length) previous.length = Math.max(previous.start + previous.length, range.start + range.length) - previous.start;
		else {
			ranges[retained] = range;
			retained += 1;
		}
	}
	ranges.length = retained;
	return {
		text: rendered,
		ranges
	};
}
//#endregion
//#region packages/markdown-core/src/render.ts
function getMarkdownLinkOrigin(link) {
	return isAutoLinkedMarkdownLink(link) ? "linkify" : "authored";
}
const STYLE_RANK = new Map([
	"blockquote",
	"code_block",
	"code",
	"heading_1",
	"heading_2",
	"heading_3",
	"heading_4",
	"heading_5",
	"heading_6",
	"bold",
	"italic",
	"underline",
	"strikethrough",
	"spoiler"
].map((style, index) => [style, index]));
const STRUCTURAL_STYLES = /* @__PURE__ */ new Set([
	"blockquote",
	"heading_1",
	"heading_2",
	"heading_3",
	"heading_4",
	"heading_5",
	"heading_6"
]);
function addSpanStart(starts, boundaries, span) {
	boundaries.add(span.start);
	boundaries.add(span.end);
	const bucket = starts.get(span.start);
	if (bucket) bucket.push(span);
	else starts.set(span.start, [span]);
}
function mergeRanges(ranges) {
	const merged = [];
	for (const range of [...ranges].toSorted((a, b) => a.start - b.start || a.end - b.end)) {
		const previous = merged.at(-1);
		if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
		else merged.push({ ...range });
	}
	return merged;
}
function firstOverlappingRangeIndex(ranges, start) {
	let low = 0;
	let high = ranges.length;
	while (low < high) {
		const middle = low + Math.floor((high - low) / 2);
		const range = ranges[middle];
		if (range && range.end <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function subtractRanges(span, ranges) {
	const firstOverlap = firstOverlappingRangeIndex(ranges, span.start);
	const firstRange = ranges[firstOverlap];
	if (!firstRange || firstRange.start >= span.end) return [span];
	const pieces = [];
	let cursor = span.start;
	for (let index = firstOverlap; index < ranges.length; index += 1) {
		const range = ranges[index];
		if (!range || range.start >= span.end) break;
		const rangeStart = Math.max(span.start, range.start);
		const rangeEnd = Math.min(span.end, range.end);
		if (rangeStart > cursor) pieces.push({
			...span,
			start: cursor,
			end: rangeStart
		});
		cursor = Math.max(cursor, rangeEnd);
	}
	if (cursor < span.end) pieces.push({
		...span,
		start: cursor,
		end: span.end
	});
	return pieces;
}
function splitAtBoundaries(span, boundaries) {
	let low = 0;
	let high = boundaries.length;
	while (low < high) {
		const middle = low + Math.floor((high - low) / 2);
		if ((boundaries[middle] ?? Number.POSITIVE_INFINITY) <= span.start) low = middle + 1;
		else high = middle;
	}
	if ((boundaries[low] ?? Number.POSITIVE_INFINITY) >= span.end) return [span];
	const pieces = [];
	let cursor = span.start;
	for (let index = low; index < boundaries.length; index += 1) {
		const boundary = boundaries[index];
		if (boundary === void 0 || boundary >= span.end) break;
		pieces.push({
			...span,
			start: cursor,
			end: boundary
		});
		cursor = boundary;
	}
	pieces.push({
		...span,
		start: cursor,
		end: span.end
	});
	return pieces;
}
function sortAnnotationSpans(spans) {
	return [...spans].toSorted((a, b) => a.start - b.start || b.end - a.end);
}
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
function renderMarkdownWithMarkers(ir, options, profile) {
	const projected = profile ? applyConstructFallbacks(ir, profile) : ir;
	const text = projected.text ?? "";
	if (!text) return "";
	const styleMarkers = options.styleMarkers;
	const annotationMarkers = options.annotationMarkers ?? {};
	const annotated = sortAnnotationSpans((projected.annotations ?? []).filter((span) => Boolean(annotationMarkers[span.type])));
	const dominantAnnotationRanges = mergeRanges(annotated.filter((span) => annotationMarkers[span.type]?.suppressNestedFormatting === true));
	const annotationBoundaries = [...new Set(annotated.flatMap((span) => [span.start, span.end]))].toSorted((a, b) => a - b);
	const boundaries = /* @__PURE__ */ new Set();
	boundaries.add(0);
	boundaries.add(text.length);
	const startsAt = /* @__PURE__ */ new Map();
	for (const span of projected.styles) {
		if (!styleMarkers[span.style]) continue;
		const pieces = annotated.length === 0 || STRUCTURAL_STYLES.has(span.style) ? [span] : subtractRanges(span, dominantAnnotationRanges).flatMap((piece) => splitAtBoundaries(piece, annotationBoundaries));
		for (const piece of pieces) {
			if (piece.start === piece.end) continue;
			addSpanStart(startsAt, boundaries, piece);
		}
	}
	for (const spans of startsAt.values()) spans.sort((a, b) => {
		if (a.end !== b.end) return b.end - a.end;
		return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
	});
	const annotationStarts = /* @__PURE__ */ new Map();
	for (const span of annotated) {
		if (span.start === span.end) continue;
		addSpanStart(annotationStarts, boundaries, span);
	}
	const linkStarts = /* @__PURE__ */ new Map();
	if (options.buildLink) {
		const links = annotated.length === 0 ? projected.links.map((span) => copyMarkdownLinkSpan(span, {
			start: span.start,
			end: span.end,
			href: span.href
		})) : projected.links.flatMap((span) => subtractRanges(span, dominantAnnotationRanges).flatMap((piece) => splitAtBoundaries(piece, annotationBoundaries)).map((piece) => copyMarkdownLinkSpan(span, {
			start: piece.start,
			end: piece.end,
			href: piece.href
		})));
		for (const link of links) {
			if (link.start === link.end) continue;
			const rendered = options.buildLink(link, text, { origin: getMarkdownLinkOrigin(link) });
			if (!rendered) continue;
			addSpanStart(linkStarts, boundaries, rendered);
		}
	}
	const points = [...boundaries].toSorted((a, b) => a - b);
	const stack = [];
	let out = "";
	for (const [i, pos] of points.entries()) {
		const firstClosingIndex = stack.findIndex((item) => item.end === pos);
		if (firstClosingIndex !== -1) {
			const closing = stack.splice(firstClosingIndex);
			for (const item of closing.toReversed()) out += item.close;
			for (const item of closing) if (item.end > pos) {
				out += item.open;
				stack.push(item);
			}
		}
		const openingItems = [];
		const openingAnnotations = annotationStarts.get(pos);
		if (openingAnnotations) for (const span of openingAnnotations) {
			const marker = annotationMarkers[span.type];
			if (!marker) continue;
			openingItems.push({
				end: span.end,
				open: typeof marker.open === "function" ? marker.open(span) : marker.open,
				close: marker.close,
				kind: "annotation"
			});
		}
		const openingLinks = linkStarts.get(pos);
		if (openingLinks && openingLinks.length > 0) for (const link of openingLinks) {
			if (link.start === link.end) {
				out += link.open + link.close;
				continue;
			}
			openingItems.push({
				end: link.end,
				open: link.open,
				close: link.close,
				kind: "link"
			});
		}
		const openingStyles = startsAt.get(pos);
		if (openingStyles) for (const span of openingStyles) {
			const marker = styleMarkers[span.style];
			if (!marker) continue;
			openingItems.push({
				end: span.end,
				open: typeof marker.open === "function" ? marker.open(span) : marker.open,
				close: marker.close,
				kind: "style",
				style: span.style
			});
		}
		if (openingItems.length > 0) {
			openingItems.sort((a, b) => {
				if (a.end !== b.end) return b.end - a.end;
				const aStructural = a.kind === "style" && STRUCTURAL_STYLES.has(a.style);
				const bStructural = b.kind === "style" && STRUCTURAL_STYLES.has(b.style);
				if (aStructural !== bStructural || a.kind !== b.kind) {
					const kindRank = {
						annotation: 0,
						link: 1,
						style: 2
					};
					return (aStructural ? -1 : kindRank[a.kind]) - (bStructural ? -1 : kindRank[b.kind]);
				}
				if (a.kind === "style" && b.kind === "style") return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
				return 0;
			});
			for (const item of openingItems) {
				out += item.open;
				stack.push({
					open: item.open,
					close: item.close,
					end: item.end
				});
			}
		}
		const next = points.at(i + 1);
		if (next === void 0) break;
		if (next > pos) out += options.escapeText(text.slice(pos, next));
	}
	return out;
}
//#endregion
//#region src/plugin-sdk/text-chunking.ts
/**
* Splits outbound channel text into chunks no longer than the requested limit.
* Newline boundaries win over spaces; text without usable separators falls back
* to a hard character split so channel senders always receive bounded strings.
*/
function chunkTextForOutbound(text, limit, options) {
	if (options?.preserveWhitespace !== void 0) return splitLongTextLine(text, limit, { preserveWhitespace: options.preserveWhitespace });
	return chunkTextByBreakResolver(text, limit, (window) => {
		const lastNewline = window.lastIndexOf("\n");
		const lastSpace = window.lastIndexOf(" ");
		return lastNewline > 0 ? lastNewline : lastSpace;
	});
}
//#endregion
export { FormatCapabilityProfile as a, renderMarkdownIRChunksWithinLimit as i, renderMarkdownWithMarkers as n, renderMarkdownWithAttributedRanges as r, chunkTextForOutbound as t };
