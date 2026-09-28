import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { i as trimEndWhitespaceGraphemes, n as firstGraphemeClusterLength, r as skipWhitespaceGraphemes, t as findGraphemeChunkEnd } from "./grapheme-CS7DlGGi.mjs";
import { w as resolveChannelStreamingChunkMode } from "./streaming-BRWehz40.mjs";
import { n as normalizeChunkLimit, t as chunkTextByBreakResolver } from "./text-chunking-BmoQ_S_D.mjs";
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
/** Looks up the fence containing an offset; spans must be sorted by start offset. */
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
/** True when a chunk boundary would not split a fenced-code block. */
function isSafeFenceBreak(spans, index) {
	return !findFenceSpanAt(spans, index);
}
//#endregion
//#region src/auto-reply/chunk.ts
const DEFAULT_CHUNK_LIMIT = 4e3;
const DEFAULT_CHUNK_MODE = "length";
function resolveChunkLimitForProvider(cfgSection, provider, accountId) {
	if (!cfgSection) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = cfgSection.accounts;
	if (accounts && typeof accounts === "object") {
		const direct = resolveChannelAccountEntry(accounts, normalizedAccountId, provider);
		if (typeof direct?.textChunkLimit === "number") return direct.textChunkLimit;
	}
	return cfgSection.textChunkLimit;
}
function resolveTextChunkLimit(cfg, provider, accountId, opts) {
	const fallback = typeof opts?.fallbackLimit === "number" && opts.fallbackLimit > 0 ? opts.fallbackLimit : DEFAULT_CHUNK_LIMIT;
	const providerOverride = (() => {
		if (!provider || provider === "webchat") return;
		const providerConfig = (cfg?.channels)?.[provider];
		return resolveChunkLimitForProvider(providerConfig, provider, accountId);
	})();
	if (typeof providerOverride === "number" && providerOverride > 0) return providerOverride;
	return fallback;
}
function resolveChunkModeForProvider(cfgSection, provider, accountId) {
	if (!cfgSection) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = cfgSection.accounts;
	if (accounts && typeof accounts === "object") {
		const direct = resolveChannelAccountEntry(accounts, normalizedAccountId, provider);
		const directMode = resolveChannelStreamingChunkMode(direct);
		if (directMode) return directMode;
	}
	return resolveChannelStreamingChunkMode(cfgSection);
}
function resolveChunkMode(cfg, provider, accountId) {
	if (!provider || provider === "webchat") return DEFAULT_CHUNK_MODE;
	const providerConfig = (cfg?.channels)?.[provider];
	return resolveChunkModeForProvider(providerConfig, provider, accountId) ?? DEFAULT_CHUNK_MODE;
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
	const normalized = text.replace(/\u2029/g, "\n\n").replace(/\r\n?|\u2028/g, "\n");
	if (!/\n[\t ]*\n+/.test(normalized)) {
		if (normalized.length <= limit) return [normalized];
		if (!splitLongParagraphs) return [normalized];
		return chunkText(normalized, limit);
	}
	const codeRegions = findCodeRegions(normalized);
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
	const pushParagraph = (paragraph, separatorBefore) => {
		if (!currentChunk) {
			if (paragraph.length <= limit) {
				currentChunk = paragraph;
				return;
			}
			if (!splitLongParagraphs) {
				chunks.push(paragraph);
				return;
			}
			chunks.push(...chunkText(paragraph, limit));
			return;
		}
		const candidate = `${currentChunk}${separatorBefore ?? "\n\n"}${paragraph}`;
		if (candidate.length <= limit) {
			currentChunk = candidate;
			return;
		}
		chunks.push(currentChunk);
		currentChunk = "";
		pushParagraph(paragraph);
	};
	for (const [index, part] of parts.entries()) {
		const paragraph = trimEndWhitespaceGraphemes(part);
		if (!paragraph) continue;
		pushParagraph(paragraph, separators[index - 1]);
	}
	if (currentChunk) chunks.push(currentChunk);
	return chunks;
}
/**
* Unified chunking function that dispatches based on mode.
*/
function chunkTextWithMode(text, limit, mode) {
	if (mode === "newline") return chunkByParagraph(text, limit);
	return chunkText(text, limit);
}
function chunkMarkdownTextWithMode(text, limit, mode) {
	const normalizedLimit = normalizeChunkLimit(limit);
	if (mode === "newline") {
		const paragraphChunks = chunkByParagraph(text, normalizedLimit, { splitLongParagraphs: false });
		const out = [];
		for (const chunk of paragraphChunks.flatMap((paragraphChunk) => paragraphChunk.length > normalizedLimit ? splitPackedFenceParagraphChunk(paragraphChunk) : paragraphChunk)) out.push(...chunkMarkdownText(chunk, normalizedLimit));
		return out;
	}
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
function splitPackedFenceParagraphChunk(chunk) {
	const chunks = [];
	let start = 0;
	for (const span of parseFenceSpans(chunk)) {
		if (span.end <= start) continue;
		const separator = chunk.slice(span.end).match(/^\n[\t ]*\n+/)?.[0];
		if (!separator) continue;
		if (!chunk.slice(span.end + separator.length).trim()) continue;
		chunks.push(chunk.slice(start, span.end));
		start = span.end + separator.length;
	}
	if (chunks.length === 0) return [chunk];
	const tail = chunk.slice(start);
	if (tail) chunks.push(tail);
	return chunks;
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
function scanParenAwareBreakpoints(text, start, end, skipTo) {
	let lastNewline = -1;
	let lastWhitespace = -1;
	if (!skipTo) {
		const window = text.slice(start, end);
		if (!window.includes("(")) {
			const newline = window.lastIndexOf("\n");
			lastNewline = newline < 0 ? -1 : start + newline;
			const whitespace = window.search(/[^\S\n][\S\n]*$/);
			lastWhitespace = whitespace < 0 ? -1 : start + whitespace;
			return {
				lastNewline,
				lastWhitespace
			};
		}
	}
	let depth = 0;
	for (let i = start; i < end; i++) {
		const skippedEnd = skipTo?.(i);
		if (skippedEnd !== void 0) {
			i = skippedEnd - 1;
			continue;
		}
		const char = text.charAt(i);
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")" && depth > 0) {
			depth -= 1;
			continue;
		}
		if (depth !== 0) continue;
		if (char === "\n") lastNewline = i;
		else if (/\s/.test(char)) lastWhitespace = i;
	}
	return {
		lastNewline,
		lastWhitespace
	};
}
//#endregion
export { chunkText as a, resolveTextChunkLimit as c, scanFenceSpans as d, chunkMarkdownTextWithMode as i, findFenceSpanAt as l, chunkByParagraph as n, chunkTextWithMode as o, chunkMarkdownText as r, resolveChunkMode as s, chunkByNewline as t, isSafeFenceBreak as u };
