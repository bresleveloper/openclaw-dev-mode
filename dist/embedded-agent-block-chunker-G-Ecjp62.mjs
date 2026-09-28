import { n as sliceUtf16Safe, t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { n as findCodeOwnership } from "./code-regions-NxEObIZm.mjs";
import { d as scanFenceSpans, l as findFenceSpanAt, u as isSafeFenceBreak } from "./chunk-D0NagiTt.mjs";
//#region src/agents/embedded-agent-block-chunker.code.ts
/** Project parser-owned code into the chunker's existing balanced-fence path. */
function prepareIndentedCode(source, context, force, maxChars) {
	const parsed = context + source;
	let ownership = /\t| {4}/u.test(parsed) ? findCodeOwnership(parsed, { includeIndentedSource: true }) : void 0;
	const replacements = [];
	const parts = [];
	let cursor = 0;
	let length = 0;
	if (ownership) for (const region of ownership.regions) {
		const code = region.indentedSource;
		if (!code || code.nested || region.end <= context.length) continue;
		const from = Math.max(0, region.start - context.length);
		const to = region.end - context.length;
		const valueStart = code.offsets[Math.max(0, context.length - region.start)] ?? 0;
		const value = code.value.slice(valueStart);
		const framed = formatFencedCodeBlock(value);
		const openerLength = framed.indexOf("\n") + 1;
		const bodyBudget = maxChars - openerLength * 2;
		if (bodyBudget < 1 || bodyBudget === 1 && /[\u{10000}-\u{10ffff}]/u.test(value) || code.offsets.some((offset, index) => offset - (code.offsets[index - 1] ?? 0) > bodyBudget)) continue;
		const open = !source.slice(to).trim();
		const rendered = open && !force ? framed.slice(0, openerLength + value.length) : framed;
		const prefix = source.slice(cursor, from);
		parts.push(prefix, rendered);
		length += prefix.length;
		replacements.push({
			from,
			to,
			start: length,
			end: length + rendered.length,
			bodyStart: length + openerLength,
			bodyEnd: length + openerLength + value.length,
			valueStart,
			regionStart: region.start - context.length,
			code,
			open
		});
		length += rendered.length;
		cursor = to;
		if (open && !force) break;
	}
	if (!replacements.at(-1)?.open || force) parts.push(source.slice(cursor));
	const text = replacements.length ? parts.join("") : source;
	const sourceIndex = (replacement, valueIndex) => {
		const offsets = replacement.code.offsets;
		let low = 0;
		let high = offsets.length;
		while (low < high) {
			const middle = low + high >>> 1;
			if (offsets[middle] <= valueIndex) low = middle + 1;
			else high = middle;
		}
		return Math.max(0, low - 1);
	};
	return {
		text,
		startsWithCode: replacements[0]?.from === 0,
		toSource(index) {
			let delta = 0;
			for (const replacement of replacements) {
				if (index < replacement.start) break;
				if (index <= replacement.end) {
					if (index <= replacement.bodyStart) return replacement.from;
					if (index >= replacement.bodyEnd) return replacement.to;
					return replacement.regionStart + sourceIndex(replacement, replacement.valueStart + index - replacement.bodyStart);
				}
				delta += replacement.end - replacement.start - (replacement.to - replacement.from);
			}
			return index - delta;
		},
		codeBoundary(index, minimum) {
			const replacement = replacements.find((entry) => entry.bodyStart < index && index < entry.bodyEnd);
			if (!replacement) return index;
			const start = Math.max(minimum - 1, replacement.bodyStart);
			let at = index;
			while (at > start + 1 && (/\s/u.test(text.charAt(at)) || /\s/u.test(text.charAt(at - 1)))) at -= 1;
			at = avoidTrailingHighSurrogateBreak(text, start, at);
			if (/\s/u.test(text.charAt(at)) || /\s/u.test(text.charAt(at - 1))) at = index;
			const mapped = sourceIndex(replacement, replacement.valueStart + at - replacement.bodyStart);
			return avoidTrailingHighSurrogateBreak(text, start, replacement.bodyStart + replacement.code.offsets[mapped] - replacement.valueStart);
		},
		contextAt(index) {
			const replacement = replacements.find((entry) => entry.from < index && (index < entry.to || entry.open && index === entry.to));
			if (replacement) return `${replacement.code.context}x${source.charAt(index - 1) === "\n" ? "\n" : ""}`;
			const at = context.length + index;
			const currentOwnership = ownership ??= findCodeOwnership(parsed, { includeIndentedSource: true });
			for (const region of currentOwnership.regions) {
				const code = region.indentedSource;
				if (code?.nested && code.ownerStart < at && at <= region.end) {
					const prefixLength = code.context.length;
					return at < code.ownerStart + prefixLength ? code.context.slice(0, at - code.ownerStart) : `${code.context}x${source.charAt(index - 1) === "\n" ? "\n" : ""}`;
				}
			}
			const paragraph = currentOwnership.paragraphs?.find((entry) => entry.start < at && (at <= entry.end || !parsed.slice(entry.end, at).trim()));
			if (!paragraph) return "";
			return `x${at > paragraph.end ? parsed.slice(paragraph.end, at) : source.charAt(index - 1) === "\n" ? "\n" : ""}`;
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-block-chunker.ts
/**
* Splits streamed embedded-agent replies into Markdown-safe message chunks.
*/
function findSafeSentenceBreakIndex(text, fenceSpans, minChars, offset = 0, openFence) {
	const matches = text.matchAll(/[.!?](?=\s|$)/g);
	let sentenceIdx = -1;
	for (const match of matches) {
		const at = match.index ?? -1;
		if (at < minChars) continue;
		const candidate = at + 1;
		if (offset + candidate !== openFence?.end && isSafeFenceBreak(fenceSpans, offset + candidate)) sentenceIdx = candidate;
	}
	return sentenceIdx >= minChars ? sentenceIdx : -1;
}
function findSafeParagraphBreakIndex(params) {
	const { text, fenceSpans, minChars, reverse, offset = 0 } = params;
	let paragraphIdx = reverse ? text.lastIndexOf("\n\n") : text.indexOf("\n\n");
	while (reverse ? paragraphIdx >= minChars : paragraphIdx !== -1) {
		const candidates = [paragraphIdx, paragraphIdx + 1];
		for (const candidate of candidates) {
			if (candidate < minChars) continue;
			if (candidate < 0 || candidate >= text.length) continue;
			if (isSafeFenceBreak(fenceSpans, offset + candidate)) return candidate;
		}
		paragraphIdx = reverse ? text.lastIndexOf("\n\n", paragraphIdx - 1) : text.indexOf("\n\n", paragraphIdx + 2);
	}
	return -1;
}
function findSafeNewlineBreakIndex(params) {
	const { text, fenceSpans, minChars, reverse, offset = 0 } = params;
	let newlineIdx = reverse ? text.lastIndexOf("\n") : text.indexOf("\n");
	while (reverse ? newlineIdx >= minChars : newlineIdx !== -1) {
		if (newlineIdx >= minChars && isSafeFenceBreak(fenceSpans, offset + newlineIdx)) return newlineIdx;
		newlineIdx = reverse ? text.lastIndexOf("\n", newlineIdx - 1) : text.indexOf("\n", newlineIdx + 1);
	}
	return -1;
}
function findFenceCloseLineStart(buffer, fence, offset = 0) {
	const relativeFenceEnd = Math.min(buffer.length, Math.max(0, fence.end - offset));
	if (relativeFenceEnd <= 0) return -1;
	const lastNewline = buffer.lastIndexOf("\n", relativeFenceEnd - 1);
	if (lastNewline < 0) return -1;
	const closingMarker = buffer.slice(lastNewline + 1, relativeFenceEnd).match(/^ {0,3}(`{3,}|~{3,})[ \t]*\r?$/)?.[1];
	return closingMarker && closingMarker.charAt(0) === fence.marker.charAt(0) && closingMarker.length >= fence.marker.length ? lastNewline + 1 : -1;
}
function resolveFenceReopenLine(fence, maxChars) {
	const bareMarker = `${fence.indent}${fence.marker}`;
	if (bareMarker.length * 2 + 3 > maxChars) return;
	return fence.openLine.length + bareMarker.length + 3 <= maxChars ? fence.openLine : bareMarker;
}
var EmbeddedBlockChunker = class {
	#buffer = "";
	#reopenPrefix = "";
	#consumedLength = 0;
	#preparedSourceBreaks = [];
	#sourceBreaks = [];
	#sourceGeneration = 0;
	#sourceOffset = 0;
	#nextSourceBreak = 0;
	#bufferStartsAtLineStart = true;
	#codeContext = "";
	#chunking;
	constructor(chunking) {
		this.#chunking = chunking;
	}
	/** Add streamed text to the pending chunk buffer. */
	append(text) {
		if (!text) return;
		this.#buffer += text;
	}
	/** Start a new source scope without emitting pending text. */
	reset(sourceBreaks = [], sourceOffset = 0) {
		this.#buffer = "";
		this.#reopenPrefix = "";
		this.#consumedLength = 0;
		this.#preparedSourceBreaks = [];
		this.#sourceBreaks = sourceBreaks;
		this.#sourceGeneration += 1;
		this.#sourceOffset = sourceOffset;
		this.#nextSourceBreak = 0;
		this.#bufferStartsAtLineStart = true;
		this.#codeContext = "";
	}
	/** UTF-16 source positions exclude synthetic fences and include skipped whitespace. */
	get consumedLength() {
		return this.#consumedLength;
	}
	/** Prepared source boundaries are not evidence that a recipient received a chunk. */
	get preparedSourceBreaks() {
		return this.#preparedSourceBreaks;
	}
	get sourceLength() {
		return this.#consumedLength + this.#buffer.length;
	}
	/** Replace pending source; the snapshot owner can attest that the consumed prefix is unchanged. */
	replace(text, sourceOffset = 0, prefixRetained = false) {
		const pendingOffset = sourceOffset - this.#consumedLength;
		const next = this.#buffer.slice(0, Math.max(0, pendingOffset)) + text.slice(Math.max(0, -pendingOffset));
		const changed = next !== this.#buffer;
		if (!next.startsWith(this.#buffer) || sourceOffset + text.length < this.#consumedLength) {
			this.#sourceBreaks = [];
			this.#nextSourceBreak = 0;
		}
		this.#buffer = next;
		if (sourceOffset === 0 && text.length < this.#consumedLength) {
			const { spans, state } = scanFenceSpans(text);
			const fence = state.open ? spans.at(-1) : void 0;
			const maxChars = Math.max(1, Math.floor(this.#chunking?.minChars ?? 1), Math.floor(this.#chunking?.maxChars ?? Infinity));
			const reopenLine = fence && this.#chunking ? resolveFenceReopenLine(fence, maxChars) : void 0;
			this.#reopenPrefix = reopenLine ? `${reopenLine}\n` : "";
			this.#codeContext = prepareIndentedCode(text, "", true, maxChars).contextAt(text.length);
		}
		const consumedLength = Math.min(this.#consumedLength, sourceOffset + text.length);
		if (!prefixRetained && sourceOffset === 0 && this.#codeContext && consumedLength > 0) {
			const maxChars = Math.max(1, Math.floor(this.#chunking?.minChars ?? 1), Math.floor(this.#chunking?.maxChars ?? Infinity));
			this.#codeContext = prepareIndentedCode(text, "", true, maxChars).contextAt(consumedLength);
		}
		if (consumedLength === 0) {
			this.#bufferStartsAtLineStart = true;
			this.#codeContext = "";
		} else if (consumedLength > sourceOffset) this.#bufferStartsAtLineStart = text.charAt(consumedLength - sourceOffset - 1) === "\n";
		else if (consumedLength < this.#consumedLength) this.#bufferStartsAtLineStart = false;
		this.#consumedLength = consumedLength;
		while ((this.#preparedSourceBreaks.at(-1) ?? 0) > this.#consumedLength) this.#preparedSourceBreaks.pop();
		return changed;
	}
	/** Return the currently buffered text for tests and flush logic. */
	get bufferedText() {
		return this.#buffer ? `${this.#reopenPrefix}${this.#buffer}` : "";
	}
	/** Return true when there is pending text to drain. */
	hasBuffered() {
		return this.#buffer.length > 0;
	}
	/** Emit safe chunks according to size and Markdown fence constraints. */
	drain(params) {
		const sourceBreaks = this.#sourceBreaks;
		while (this.#nextSourceBreak < sourceBreaks.length) {
			const length = sourceBreaks[this.#nextSourceBreak] - this.#consumedLength;
			if (length <= 0) {
				this.#nextSourceBreak += 1;
				continue;
			}
			if (length > this.#buffer.length) break;
			const availableLength = this.bufferedText.length;
			const tail = this.#buffer.slice(length);
			this.#buffer = this.#buffer.slice(0, length);
			this.#drainBuffer(params, availableLength, true);
			if (this.#sourceBreaks !== sourceBreaks) return;
			const reachedBreak = this.#buffer.length === 0;
			this.#buffer += tail;
			if (!reachedBreak) return;
			this.#nextSourceBreak += 1;
		}
		this.#drainBuffer(params);
	}
	#drainBuffer(params, availableLength = 0, reconciledSourceBreak = false) {
		const { emit } = params;
		const sourceStart = this.#consumedLength;
		const preparedSourceBreaks = this.#preparedSourceBreaks;
		const chunking = this.#chunking;
		if (!this.#buffer || !params.force && !chunking) return;
		if (!chunking) {
			preparedSourceBreaks.push(sourceStart + this.#buffer.length);
			emit(this.bufferedText, {
				sourceText: this.#buffer,
				sourceGeneration: this.#sourceGeneration,
				reconciledSourceBreak: reconciledSourceBreak || void 0,
				sourceStart: this.#sourceOffset + this.#consumedLength,
				sourceEnd: this.#sourceOffset + this.#consumedLength + this.#buffer.length,
				startsAtLineStart: Boolean(this.#reopenPrefix) || this.#bufferStartsAtLineStart
			});
			this.#bufferStartsAtLineStart = this.#buffer.endsWith("\n");
			this.#consumedLength += this.#buffer.length;
			this.#buffer = "";
			this.#reopenPrefix = "";
			this.#codeContext = "";
			return;
		}
		const minChars = Math.max(1, Math.floor(chunking?.minChars ?? 1));
		const maxChars = Math.max(minChars, Math.floor(chunking?.maxChars ?? Infinity));
		const force = params.force || availableLength >= maxChars;
		const originalSource = this.bufferedText;
		if (originalSource.length < minChars && !force) return;
		const indentedCode = prepareIndentedCode(originalSource, this.#codeContext, force, maxChars);
		let source = indentedCode.text;
		const startsAtLineStart = Boolean(this.#reopenPrefix) || indentedCode.startsWithCode || this.#bufferStartsAtLineStart;
		if (source.length < minChars && !force) return;
		if (force && source.length <= maxChars && !this.#reopenPrefix) {
			if (source.trim().length > 0) {
				preparedSourceBreaks.push(sourceStart + this.#buffer.length);
				emit(source, {
					sourceText: this.#buffer,
					sourceGeneration: this.#sourceGeneration,
					reconciledSourceBreak: reconciledSourceBreak || void 0,
					sourceStart: this.#sourceOffset + this.#consumedLength,
					sourceEnd: this.#sourceOffset + this.#consumedLength + this.#buffer.length,
					startsAtLineStart
				});
			}
			this.#bufferStartsAtLineStart = this.#buffer.endsWith("\n");
			this.#codeContext = indentedCode.contextAt(originalSource.length);
			this.#consumedLength += this.#buffer.length;
			this.#buffer = "";
			this.#reopenPrefix = "";
			return;
		}
		const { spans: fenceSpans, state: fenceState } = scanFenceSpans(source, { atLineStart: startsAtLineStart });
		const openFence = fenceState.open ? fenceSpans.at(-1) : void 0;
		const removedFenceInfo = [];
		let removedFenceInfoLength = 0;
		for (const fence of fenceSpans) {
			fence.start -= removedFenceInfoLength;
			fence.end -= removedFenceInfoLength;
			const reopenFenceLine = resolveFenceReopenLine(fence, maxChars);
			if (!reopenFenceLine || reopenFenceLine === fence.openLine || fence.end - fence.start <= maxChars) continue;
			source = source.slice(0, fence.start) + reopenFenceLine + source.slice(fence.start + fence.openLine.length);
			const removedLength = fence.openLine.length - reopenFenceLine.length;
			removedFenceInfo.push({
				at: fence.start + reopenFenceLine.length,
				length: removedLength
			});
			fence.openLine = reopenFenceLine;
			fence.end -= removedLength;
			removedFenceInfoLength += removedLength;
		}
		const originalIndex = (index) => removedFenceInfo.reduce((offset, removed) => offset + (removed.at <= index ? removed.length : 0), index);
		const sourceOffset = (index) => Math.max(0, indentedCode.toSource(originalIndex(index)) - this.#reopenPrefix.length);
		let start = 0;
		let reopenFence;
		const emitSourceChunk = (chunk, from, to) => {
			preparedSourceBreaks.push(sourceStart + sourceOffset(to));
			emit(chunk, {
				sourceText: this.#buffer.slice(sourceOffset(from), sourceOffset(to)),
				sourceGeneration: this.#sourceGeneration,
				reconciledSourceBreak: reconciledSourceBreak || void 0,
				sourceStart: this.#sourceOffset + this.#consumedLength + sourceOffset(from),
				sourceEnd: this.#sourceOffset + this.#consumedLength + sourceOffset(to),
				startsAtLineStart: Boolean(reopenFence) || (from === 0 ? startsAtLineStart : source.charAt(from - 1) === "\n")
			});
		};
		const resumedFence = this.#reopenPrefix ? fenceSpans[0] : void 0;
		if (resumedFence) {
			const closeStart = findFenceCloseLineStart(source, resumedFence);
			if (closeStart >= this.#reopenPrefix.length && !source.slice(this.#reopenPrefix.length, closeStart).trim()) start = skipLeadingNewlines(source, resumedFence.end);
		}
		while (start < source.length) {
			const reopenPrefix = reopenFence ? `${reopenFence.reopenFenceLine}\n` : "";
			const remainingLength = reopenPrefix.length + (source.length - start);
			if (!force && remainingLength < minChars) break;
			if (chunking.flushOnParagraph && !force) {
				const paragraphBreak = findNextParagraphBreak(source, fenceSpans, start, minChars);
				const paragraphLimit = Math.max(1, maxChars - reopenPrefix.length);
				if (paragraphBreak && paragraphBreak.index - start <= paragraphLimit) {
					const chunk = `${reopenPrefix}${source.slice(start, paragraphBreak.index)}`;
					const nextStart = skipLeadingNewlines(source, paragraphBreak.index + paragraphBreak.length);
					if (chunk.trim().length > 0) emitSourceChunk(chunk, start, nextStart);
					start = nextStart;
					reopenFence = void 0;
					continue;
				}
				if (remainingLength < maxChars) break;
			}
			const view = source.slice(start);
			const breakResult = force && remainingLength <= maxChars ? this.#pickPreferredBreakIndex(view, fenceSpans, chunking, false, 1, start, openFence) : this.#pickBreakIndex(view, fenceSpans, chunking, force ? 1 : void 0, start, maxChars - reopenPrefix.length, openFence);
			if (breakResult.index <= 0) {
				if (force) {
					emitSourceChunk(`${reopenPrefix}${source.slice(start)}`, start, source.length);
					start = source.length;
					reopenFence = void 0;
				}
				break;
			}
			if (breakResult.fenceSplit) {
				const boundary = indentedCode.codeBoundary(originalIndex(start + breakResult.index), originalIndex(start + 1));
				let removedLength = 0;
				for (const removed of removedFenceInfo) if (removed.at + removedLength <= boundary) removedLength += removed.length;
				breakResult.index = sliceUtf16Safe(view, 0, boundary - removedLength - start).length;
			}
			const consumed = this.#resolveBreakResult({
				breakResult,
				reopenPrefix,
				source,
				start
			});
			if (consumed === null) continue;
			if (consumed.chunk) emitSourceChunk(consumed.chunk, start, consumed.start);
			start = consumed.start;
			reopenFence = consumed.reopenFence;
			const nextLength = (reopenFence ? `${reopenFence.reopenFenceLine}\n`.length : 0) + (source.length - start);
			if (nextLength < minChars && !force) break;
			if (nextLength < maxChars && !force && !chunking.flushOnParagraph) break;
		}
		if (!reopenFence) start = skipLeadingNewlines(source, start);
		if (start === 0) return;
		const consumed = sourceOffset(start);
		if (consumed > 0) this.#bufferStartsAtLineStart = this.#buffer.charAt(consumed - 1) === "\n";
		this.#codeContext = indentedCode.contextAt(consumed + this.#reopenPrefix.length);
		this.#consumedLength += consumed;
		this.#buffer = this.#buffer.slice(consumed);
		this.#reopenPrefix = !this.#codeContext && reopenFence ? `${reopenFence.reopenFenceLine}\n` : "";
	}
	#resolveBreakResult(params) {
		const { breakResult, reopenPrefix, source, start } = params;
		const breakIdx = breakResult.index;
		if (breakIdx <= 0) return null;
		const absoluteBreakIdx = start + breakIdx;
		let rawChunk = `${reopenPrefix}${source.slice(start, absoluteBreakIdx)}`;
		if (rawChunk.trim().length === 0) return {
			start: skipLeadingNewlines(source, absoluteBreakIdx),
			reopenFence: void 0
		};
		const fenceSplit = breakResult.fenceSplit;
		if (fenceSplit) {
			const closeFence = rawChunk.endsWith("\n") ? fenceSplit.closeFenceLine : `\n${fenceSplit.closeFenceLine}`;
			rawChunk = `${rawChunk}${closeFence}`;
		}
		if (fenceSplit) {
			if (absoluteBreakIdx === findFenceCloseLineStart(source, fenceSplit.fence)) return {
				chunk: rawChunk,
				start: skipLeadingNewlines(source, fenceSplit.fence.end)
			};
			return {
				chunk: rawChunk,
				start: absoluteBreakIdx,
				reopenFence: fenceSplit
			};
		}
		const nextStart = absoluteBreakIdx < source.length && /\s/.test(source.charAt(absoluteBreakIdx)) ? absoluteBreakIdx + 1 : absoluteBreakIdx;
		return {
			chunk: rawChunk,
			start: skipLeadingNewlines(source, nextStart),
			reopenFence: void 0
		};
	}
	#pickPreferredBreakIndex(buffer, fenceSpans, chunking, reverse, minCharsOverride, offset = 0, openFence) {
		const minChars = Math.max(1, Math.floor(minCharsOverride ?? chunking.minChars));
		if (buffer.length < minChars) return { index: -1 };
		const preference = chunking.breakPreference ?? "paragraph";
		if (preference === "paragraph") {
			const paragraphIdx = findSafeParagraphBreakIndex({
				text: buffer,
				fenceSpans,
				minChars,
				reverse,
				offset
			});
			if (paragraphIdx !== -1) return { index: paragraphIdx };
		}
		if (preference === "paragraph" || preference === "newline") {
			const newlineIdx = findSafeNewlineBreakIndex({
				text: buffer,
				fenceSpans,
				minChars,
				reverse,
				offset
			});
			if (newlineIdx !== -1) return { index: newlineIdx };
		}
		if (preference !== "newline") {
			const sentenceIdx = findSafeSentenceBreakIndex(buffer, fenceSpans, minChars, offset, openFence);
			if (sentenceIdx !== -1) return { index: sentenceIdx };
		}
		return { index: -1 };
	}
	#pickBreakIndex(buffer, fenceSpans, chunking, minCharsOverride, offset = 0, maxCharsOverride, openFence) {
		const minChars = Math.max(1, Math.floor(minCharsOverride ?? chunking.minChars));
		const maxChars = Math.max(1, Math.floor(maxCharsOverride ?? chunking.maxChars));
		if (buffer.length < minChars) return { index: -1 };
		const window = buffer.slice(0, Math.min(maxChars, buffer.length));
		const preferred = this.#pickPreferredBreakIndex(window, fenceSpans, chunking, true, minChars, offset, openFence);
		if (preferred.index !== -1) return preferred;
		if (buffer.length < maxChars) return { index: -1 };
		for (let i = window.length - 1; i >= minChars; i--) if (/\s/.test(window.charAt(i)) && isSafeFenceBreak(fenceSpans, offset + i)) return { index: i };
		if (buffer.length >= maxChars) {
			const firstCodePointWidth = (buffer.codePointAt(0) ?? 0) > 65535 ? 2 : 1;
			const forcedBreakIndex = sliceUtf16Safe(buffer, 0, Math.max(maxChars, firstCodePointWidth)).length;
			const absoluteBreakIndex = offset + forcedBreakIndex;
			const fence = findFenceSpanAt(fenceSpans, absoluteBreakIndex) ?? (openFence?.end === absoluteBreakIndex ? openFence : void 0);
			if (fence) {
				const reopenFenceLine = resolveFenceReopenLine(fence, chunking.maxChars);
				if (!reopenFenceLine) return { index: forcedBreakIndex };
				const closeFenceLine = `${fence.indent}${fence.marker}`;
				const fenceBreakIndex = sliceUtf16Safe(buffer, 0, Math.max(1, maxChars - closeFenceLine.length - 1)).length;
				if (fenceBreakIndex <= 0) return { index: forcedBreakIndex };
				const closeFenceStart = findFenceCloseLineStart(buffer, fence, offset);
				return {
					index: closeFenceStart >= minChars && closeFenceStart <= fenceBreakIndex ? closeFenceStart : fenceBreakIndex,
					fenceSplit: {
						closeFenceLine,
						reopenFenceLine,
						fence
					}
				};
			}
			return { index: forcedBreakIndex };
		}
		return { index: -1 };
	}
};
function skipLeadingNewlines(value, start = 0) {
	let i = start;
	while (i < value.length && value[i] === "\n") i++;
	return i;
}
function findNextParagraphBreak(buffer, fenceSpans, startIndex = 0, minCharsFromStart = 1) {
	if (startIndex < 0) return null;
	const re = /\n[\t ]*\n+/g;
	re.lastIndex = startIndex;
	let match;
	while ((match = re.exec(buffer)) !== null) {
		const index = match.index ?? -1;
		if (index < 0) continue;
		if (index - startIndex < minCharsFromStart) continue;
		const fence = findFenceSpanAt(fenceSpans, index);
		if (fence) {
			re.lastIndex = fence.end;
			continue;
		}
		return {
			index,
			length: match[0].length
		};
	}
	return null;
}
//#endregion
export { EmbeddedBlockChunker as t };
