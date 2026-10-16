import { a as trimEndWhitespaceGraphemes, i as skipWhitespaceGraphemes, n as findGraphemeChunkEnd, r as firstGraphemeClusterLength } from "./grapheme-SpAWfax1.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-CvUeKYli.mjs";
import { t as scanParenAwareBreakpoints } from "./text-breakpoints-Ts9vbS9m.mjs";
import { C as resolveChannelStreamingChunkMode } from "./streaming-CHnBADiw.mjs";
import { n as normalizeChunkLimit, t as chunkTextByBreakResolver } from "./text-chunking-DOhNiXVV.mjs";
//#region packages/markdown-core/src/fences.ts
const FENCE_LINE_RE = /(?:^|\n)( {0,3})(`{3,}|~{3,})([^\r\n\u2028\u2029]*)\r?(?=\n|$)/g;
const SINGLE_LINE_FENCE_RE = new RegExp(FENCE_LINE_RE, "gy");
/** Scans fenced-code spans incrementally so chunking can carry an open fence forward. */
function scanFenceSpans(buffer, state) {
	const spans = [];
	const startsAtLineStart = state?.atLineStart ?? true;
	let open = state?.open ? {
		...state.open,
		start: 0
	} : void 0;
	const pattern = buffer.includes("\n") ? FENCE_LINE_RE : SINGLE_LINE_FENCE_RE;
	for (const match of buffer.matchAll(pattern)) {
		const [, indent, marker, trailing] = match;
		if (indent === void 0 || marker === void 0 || trailing === void 0) continue;
		const start = match.index + (match[0].startsWith("\n") ? 1 : 0);
		if (start === 0 && !startsAtLineStart) continue;
		const markerChar = marker.charAt(0);
		const markerLen = marker.length;
		if (!open) open = {
			start,
			markerChar,
			markerLen,
			openLine: `${indent}${marker}${trailing}`,
			marker,
			indent
		};
		else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(trailing)) {
			spans.push({
				start: open.start,
				end: match.index + match[0].length,
				openLine: open.openLine,
				marker: open.marker,
				indent: open.indent
			});
			open = void 0;
		}
	}
	if (open) spans.push({
		start: open.start,
		end: buffer.length,
		openLine: open.openLine,
		marker: open.marker,
		indent: open.indent
	});
	return {
		spans,
		state: {
			atLineStart: buffer.length === 0 ? startsAtLineStart : buffer.endsWith("\n"),
			...open ? { open: {
				markerChar: open.markerChar,
				markerLen: open.markerLen,
				openLine: open.openLine,
				marker: open.marker,
				indent: open.indent
			} } : {}
		}
	};
}
/** Parses all fenced-code spans in a complete markdown buffer. */
function parseFenceSpans(buffer) {
	return scanFenceSpans(buffer).spans;
}
/** Looks up the span containing an offset; spans must be sorted by start offset. */
function findFenceSpanAt(spans, index) {
	let low = 0;
	let high = spans.length - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const span = spans[mid];
		if (!span) break;
		if (index <= span.start) {
			high = mid - 1;
			continue;
		}
		if (index >= span.end) {
			low = mid + 1;
			continue;
		}
		return span;
	}
}
/** True when a chunk boundary would not split any of the given spans. */
function isSafeFenceBreak(spans, index) {
	return !findFenceSpanAt(spans, index);
}
//#endregion
//#region src/auto-reply/chunk.ts
const DEFAULT_CHUNK_LIMIT = 4e3;
const DEFAULT_CHUNK_MODE = "length";
function resolveChunkConfig(cfg, provider, accountId) {
	if (!provider || provider === "webchat") return {};
	const channel = (cfg?.channels)?.[provider];
	const accounts = channel?.accounts;
	return {
		channel,
		account: accounts && typeof accounts === "object" ? resolveChannelAccountEntry(accounts, normalizeAccountId(accountId), provider) : void 0
	};
}
function resolveTextChunkLimit(cfg, provider, accountId, opts) {
	const fallback = typeof opts?.fallbackLimit === "number" && opts.fallbackLimit > 0 ? opts.fallbackLimit : DEFAULT_CHUNK_LIMIT;
	const { channel, account } = resolveChunkConfig(cfg, provider, accountId);
	const providerOverride = typeof account?.textChunkLimit === "number" ? account.textChunkLimit : channel?.textChunkLimit;
	if (typeof providerOverride === "number" && providerOverride > 0) return providerOverride;
	return fallback;
}
function resolveChunkMode(cfg, provider, accountId) {
	const { channel, account } = resolveChunkConfig(cfg, provider, accountId);
	return resolveChannelStreamingChunkMode(account) ?? resolveChannelStreamingChunkMode(channel) ?? DEFAULT_CHUNK_MODE;
}
/**
* Split text on newlines, trimming line whitespace.
* Blank lines are folded into the next non-empty line as leading "\n" prefixes.
* Leading and trailing blank lines are capped to the available UTF-16 space.
* Long lines can be split by length (default) or kept intact via splitLongLines:false.
*/
function chunkByNewline(text, maxLineLength, opts) {
	if (!text) return [];
	const lineLimit = normalizeChunkLimit(maxLineLength);
	if (lineLimit <= 0) return text.trim() ? [text] : [];
	const splitLongLines = opts?.splitLongLines !== false;
	const trimLines = opts?.trimLines !== false;
	const lines = splitByNewline(text, opts?.isSafeBreak);
	const chunks = [];
	let pendingBlankLines = 0;
	for (const line of lines) {
		const trimmed = trimEndWhitespaceGraphemes(line.slice(skipWhitespaceGraphemes(line)));
		if (!trimmed) {
			pendingBlankLines += 1;
			continue;
		}
		const lineValue = trimLines ? trimmed : line;
		const maxPrefix = pendingBlankLines ? Math.max(0, lineLimit - firstGraphemeClusterLength(lineValue)) : 0;
		const prefix = "\n".repeat(Math.min(pendingBlankLines, maxPrefix));
		pendingBlankLines = 0;
		if (!splitLongLines || lineValue.length + prefix.length <= lineLimit) {
			chunks.push(prefix + lineValue);
			continue;
		}
		const rawLimit = Math.max(1, lineLimit - prefix.length);
		const firstLimit = findGraphemeChunkEnd(lineValue, 0, rawLimit);
		const first = lineValue.slice(0, firstLimit);
		chunks.push(prefix + first);
		const remaining = lineValue.slice(firstLimit);
		if (remaining) chunks.push(...chunkText(remaining, lineLimit));
	}
	const lastChunk = chunks.at(-1);
	if (pendingBlankLines > 0 && lastChunk !== void 0) {
		const trailingLines = Math.min(pendingBlankLines, Math.max(0, lineLimit - lastChunk.length));
		chunks[chunks.length - 1] = lastChunk + "\n".repeat(trailingLines);
	}
	return chunks;
}
/**
* Split text into chunks on paragraph boundaries (blank lines), preserving lists and
* single-newline line wraps inside paragraphs.
*
* - Only breaks at paragraph separators ("\n\n" or more, allowing whitespace on blank lines)
* - Packs multiple paragraphs into a single chunk up to `limit`
* - Falls back to length-based splitting when a single paragraph exceeds `limit`
*   (unless `splitLongParagraphs` is disabled)
*/
function chunkByParagraph(text, limit, opts) {
	if (!text) return [];
	if (limit <= 0) return [text];
	const splitLongParagraphs = opts?.splitLongParagraphs !== false;
	let normalizationCodeRegions;
	const paragraphNormalized = text.replace(/\u2029/g, (separator, index) => isInsideCode(index, normalizationCodeRegions ??= findCodeRegions(text)) ? separator : "\n\n");
	if (paragraphNormalized !== text) normalizationCodeRegions = void 0;
	const normalized = paragraphNormalized.replace(/\r\n?|\u2028/g, (separator, index) => separator === "\u2028" && isInsideCode(index, normalizationCodeRegions ??= findCodeRegions(paragraphNormalized)) ? separator : "\n");
	if (!/\n[\t ]*\n+/.test(normalized)) {
		if (normalized.length <= limit || !splitLongParagraphs) return [normalized];
		return chunkText(normalized, limit);
	}
	const codeRegions = normalized === paragraphNormalized && normalizationCodeRegions ? normalizationCodeRegions : findCodeRegions(normalized);
	const parts = [];
	const separators = [];
	const re = /\n[\t ]*\n+/g;
	let lastIndex = 0;
	for (const match of normalized.matchAll(re)) {
		const idx = match.index ?? 0;
		if (isInsideCode(idx, codeRegions)) continue;
		parts.push(normalized.slice(lastIndex, idx));
		separators.push(match[0]);
		lastIndex = idx + match[0].length;
	}
	parts.push(normalized.slice(lastIndex));
	const chunks = [];
	let currentChunk = "";
	for (const [index, part] of parts.entries()) {
		const paragraph = trimEndWhitespaceGraphemes(part);
		if (!paragraph) continue;
		if (currentChunk) {
			const candidate = `${currentChunk}${separators[index - 1] ?? "\n\n"}${paragraph}`;
			if (candidate.length <= limit) {
				currentChunk = candidate;
				continue;
			}
			chunks.push(currentChunk);
			currentChunk = "";
		}
		if (paragraph.length <= limit) currentChunk = paragraph;
		else chunks.push(...splitLongParagraphs ? chunkText(paragraph, limit) : [paragraph]);
	}
	if (currentChunk) chunks.push(currentChunk);
	return chunks;
}
function chunkTextWithMode(text, limit, mode) {
	if (mode === "newline") return chunkByParagraph(text, limit);
	return chunkText(text, limit);
}
function chunkMarkdownTextWithMode(text, limit, mode) {
	const normalizedLimit = normalizeChunkLimit(limit);
	if (mode === "newline") return chunkByParagraph(text, normalizedLimit, { splitLongParagraphs: false }).flatMap((chunk) => chunkMarkdownText(chunk, normalizedLimit));
	return chunkMarkdownText(text, normalizedLimit);
}
function splitByNewline(text, isSafeBreak = () => true) {
	const lines = [];
	let start = 0;
	for (let i = 0; i < text.length; i++) if (text[i] === "\n" && isSafeBreak(i)) {
		lines.push(text.slice(start, i));
		start = i + 1;
	}
	lines.push(text.slice(start));
	return lines;
}
function chunkText(text, limit) {
	return chunkTextByBreakResolver(text, limit, (window) => {
		const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(window, 0, window.length);
		return lastNewline > 0 ? lastNewline : lastWhitespace;
	});
}
function chunkMarkdownText(text, limit) {
	const normalizedLimit = normalizeChunkLimit(limit);
	if (!text) return [];
	if (normalizedLimit <= 0 || text.length <= normalizedLimit) return [text];
	const chunks = [];
	const spans = parseFenceSpans(text);
	let start = 0;
	let reopenFence;
	while (start < text.length) {
		const reopenLine = reopenFence ? resolveFenceReopenLine(reopenFence, normalizedLimit) : "";
		const reopenPrefix = reopenLine ? `${reopenLine}\n` : "";
		const contentLimit = Math.max(1, normalizedLimit - reopenPrefix.length);
		if (text.length - start <= contentLimit) {
			const finalChunk = `${reopenPrefix}${text.slice(start)}`;
			if (finalChunk.length > 0) chunks.push(finalChunk);
			break;
		}
		reopenFence = void 0;
		const windowEnd = Math.min(text.length, start + contentLimit);
		const softBreak = pickSafeBreakIndex(text, start, windowEnd, spans);
		let breakIdx = findGraphemeChunkEnd(text, start, windowEnd, softBreak);
		const initialFence = findFenceSpanAt(spans, breakIdx);
		let fenceToSplit = initialFence;
		if (initialFence) {
			const closeLine = `${initialFence.indent}${initialFence.marker}`;
			if (!resolveFenceReopenLine(initialFence, normalizedLimit)) {
				breakIdx = findGraphemeChunkEnd(text, start, windowEnd);
				fenceToSplit = void 0;
			} else {
				const maxIdxIfNeedNewline = start + (contentLimit - (closeLine.length + 1));
				const minProgressIdx = Math.min(text.length, reopenPrefix ? start + 1 : Math.max(start + 1, initialFence.start + initialFence.openLine.length + 2));
				const maxIdxIfAlreadyNewline = start + (contentLimit - closeLine.length);
				let pickedNewline = false;
				let lastNewline = text.lastIndexOf("\n", Math.max(start, maxIdxIfAlreadyNewline - 1));
				while (lastNewline >= start) {
					const candidateBreak = lastNewline + 1;
					if (candidateBreak < minProgressIdx) break;
					const candidateFence = findFenceSpanAt(spans, candidateBreak);
					if (candidateFence && candidateFence.start === initialFence.start) {
						breakIdx = candidateBreak;
						pickedNewline = true;
						break;
					}
					lastNewline = text.lastIndexOf("\n", lastNewline - 1);
				}
				if (!pickedNewline && minProgressIdx >= maxIdxIfAlreadyNewline) {
					breakIdx = findGraphemeChunkEnd(text, start, windowEnd);
					fenceToSplit = void 0;
					reopenFence = initialFence;
				} else {
					breakIdx = findGraphemeChunkEnd(text, start, pickedNewline ? maxIdxIfAlreadyNewline : maxIdxIfNeedNewline, pickedNewline ? breakIdx : maxIdxIfNeedNewline);
					const fenceAtBreak = findFenceSpanAt(spans, breakIdx);
					fenceToSplit = fenceAtBreak && fenceAtBreak.start === initialFence.start ? fenceAtBreak : void 0;
				}
			}
		}
		const rawContent = text.slice(start, breakIdx);
		if (!rawContent) break;
		let rawChunk = `${reopenPrefix}${rawContent}`;
		let nextStart = breakIdx;
		if (fenceToSplit) {
			const closeLine = `${fenceToSplit.indent}${fenceToSplit.marker}`;
			rawChunk = rawChunk.endsWith("\n") ? `${rawChunk}${closeLine}` : `${rawChunk}\n${closeLine}`;
			reopenFence = fenceToSplit;
		} else if (!initialFence) {
			nextStart = skipWhitespaceGraphemes(text, breakIdx, 1);
			nextStart = skipLeadingNewlines(text, nextStart);
		}
		chunks.push(rawChunk);
		start = nextStart;
	}
	return chunks;
}
function resolveFenceReopenLine(fence, limit) {
	const markerLine = `${fence.indent}${fence.marker}`;
	if (fence.openLine.length + markerLine.length + 3 <= limit) return fence.openLine;
	return markerLine.length * 2 + 3 <= limit ? markerLine : "";
}
function skipLeadingNewlines(value, start = 0) {
	let i = value[start] === "\n" ? skipWhitespaceGraphemes(value, start, 1) : start;
	if (i === start) return start;
	while (i < value.length && value[i] === "\n") i++;
	return i;
}
function pickSafeBreakIndex(text, start, end, spans) {
	let fenceIndex = 0;
	let high = spans.length;
	while (fenceIndex < high) {
		const mid = Math.floor((fenceIndex + high) / 2);
		const span = spans[mid];
		if (span && span.end <= start) fenceIndex = mid + 1;
		else high = mid;
	}
	let fence = fenceIndex < spans.length ? spans[fenceIndex] : void 0;
	const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(text, start, end, spans.length > 0 ? (index) => {
		while (fence && fence.end <= index) {
			fenceIndex += 1;
			fence = fenceIndex < spans.length ? spans[fenceIndex] : void 0;
		}
		return fence && index > fence.start ? fence.end : void 0;
	} : void 0);
	if (lastNewline > start) return lastNewline;
	if (lastWhitespace > start) return lastWhitespace;
	return -1;
}
//#endregion
export { chunkText as a, resolveTextChunkLimit as c, parseFenceSpans as d, scanFenceSpans as f, chunkMarkdownTextWithMode as i, findFenceSpanAt as l, chunkByParagraph as n, chunkTextWithMode as o, chunkMarkdownText as r, resolveChunkMode as s, chunkByNewline as t, isSafeFenceBreak as u };
