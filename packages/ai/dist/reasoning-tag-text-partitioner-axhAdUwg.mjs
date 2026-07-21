//#region packages/markdown-core/src/fences.ts
/** Scans fenced-code spans incrementally so chunking can carry an open fence forward. */
function scanFenceSpans(buffer, state) {
	const spans = [];
	const startsAtLineStart = state?.atLineStart ?? true;
	let open = state?.open ? {
		...state.open,
		start: 0
	} : void 0;
	let offset = 0;
	while (offset <= buffer.length) {
		const nextNewline = buffer.indexOf("\n", offset);
		const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
		const line = buffer.slice(offset, lineEnd).replace(/\r$/, "");
		const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
		if (match && (offset > 0 || startsAtLineStart)) {
			const indent = match[1];
			const marker = match[2];
			const markerChar = marker[0];
			const markerLen = marker.length;
			if (!open) open = {
				start: offset,
				markerChar,
				markerLen,
				openLine: line,
				marker,
				indent
			};
			else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(match[3])) {
				const end = lineEnd;
				spans.push({
					start: open.start,
					end,
					openLine: open.openLine,
					marker: open.marker,
					indent: open.indent
				});
				open = void 0;
			}
		}
		if (nextNewline === -1) break;
		offset = nextNewline + 1;
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
//#endregion
//#region packages/markdown-core/src/code-spans.ts
/** Creates the carry-forward state used when scanning inline code across chunks. */
function createInlineCodeState() {
	return {
		open: false,
		ticks: 0
	};
}
/** Builds a lookup for fenced and inline code spans while preserving scanner state. */
function buildCodeSpanIndex(text, inlineState, fenceState) {
	const { spans: fenceSpans, state: nextFenceState } = scanFenceSpans(text, fenceState);
	const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(text, fenceSpans, inlineState ? {
		open: inlineState.open,
		ticks: inlineState.ticks
	} : createInlineCodeState());
	return {
		inlineState: nextInlineState,
		fenceState: nextFenceState,
		isInside: (index) => isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans)
	};
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
	const spans = [];
	let open = initialState.open;
	let ticks = initialState.ticks;
	let openStart = open ? 0 : -1;
	let i = 0;
	while (i < text.length) {
		const fence = findFenceSpanAtInclusive(fenceSpans, i);
		if (fence) {
			i = fence.end;
			continue;
		}
		if (text[i] !== "`") {
			i += 1;
			continue;
		}
		const runStart = i;
		let runLength = 0;
		while (i < text.length && text[i] === "`") {
			runLength += 1;
			i += 1;
		}
		if (!open) {
			open = true;
			ticks = runLength;
			openStart = runStart;
			continue;
		}
		if (runLength === ticks) {
			spans.push([openStart, i]);
			open = false;
			ticks = 0;
			openStart = -1;
		}
	}
	if (open) spans.push([openStart, text.length]);
	return {
		spans,
		state: {
			open,
			ticks
		}
	};
}
function findFenceSpanAtInclusive(spans, index) {
	return spans.find((span) => index >= span.start && index < span.end);
}
function isInsideFenceSpan(index, spans) {
	return spans.some((span) => index >= span.start && index < span.end);
}
function isInsideInlineSpan(index, spans) {
	return spans.some(([start, end]) => index >= start && index < end);
}
//#endregion
//#region packages/ai/src/utils/reasoning-tag-text-partitioner.ts
const REASONING_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought|reasoning)|antthinking)\b[^<>]*>/gi;
const REASONING_TAG_NAMES = [
	"think",
	"thinking",
	"thought",
	"reasoning",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"antml:reasoning",
	"mm:think",
	"mm:thinking",
	"mm:thought",
	"mm:reasoning"
];
function createReasoningTagTextPartitioner() {
	let buffer = "";
	let reasoningDepth = 0;
	let strictMode = false;
	let emittedVisibleText = false;
	let inlineCodeState = createInlineCodeState();
	let fenceState;
	let hiddenInlineCodeState = createInlineCodeState();
	let hiddenFenceState;
	let recoverableOpenTagText;
	const consume = (final, recoverFullUnclosed) => {
		const output = [];
		const emit = (kind, text) => {
			if (!text) return;
			if (kind === "text" && text.trim().length > 0) emittedVisibleText = true;
			if (kind === "text") {
				const nextCode = buildCodeSpanIndex(text, inlineCodeState, fenceState);
				inlineCodeState = nextCode.inlineState;
				fenceState = nextCode.fenceState;
			} else {
				const nextCode = buildCodeSpanIndex(text, hiddenInlineCodeState, hiddenFenceState);
				hiddenInlineCodeState = nextCode.inlineState;
				hiddenFenceState = nextCode.fenceState;
			}
			const previous = output[output.length - 1];
			if (previous?.kind === kind) {
				previous.text += text;
				return;
			}
			output.push({
				kind,
				text
			});
		};
		while (buffer) {
			const activeInlineCodeState = reasoningDepth === 0 ? inlineCodeState : hiddenInlineCodeState;
			const activeFenceState = reasoningDepth === 0 ? fenceState : hiddenFenceState;
			const codeSpans = buildCodeSpanIndex(buffer, activeInlineCodeState, activeFenceState);
			const hasUnclosedCode = reasoningDepth === 0 && Boolean(codeSpans.inlineState.open || codeSpans.fenceState.open);
			const hasRawReasoning = hasRawReasoningTag(buffer);
			const tag = findNextReasoningTag(buffer, (index) => final && hasUnclosedCode && hasRawReasoning ? false : codeSpans.isInside(index));
			if (!tag) {
				if (final) {
					const recoverAsText = reasoningDepth > 0 && recoverFullUnclosed && !hasRawReasoningCloseTag(buffer);
					const recoveredText = recoverAsText && recoverableOpenTagText ? recoverableOpenTagText + buffer : buffer;
					emit(reasoningDepth > 0 && !recoverAsText ? "thinking" : "text", recoveredText);
					buffer = "";
					reasoningDepth = 0;
					recoverableOpenTagText = void 0;
					return output;
				}
				if (reasoningDepth > 0 && recoverFullUnclosed && (!emittedVisibleText || recoverableOpenTagText)) return output;
				if (hasUnclosedCode && hasRawReasoning) {
					const openCodeIndex = inlineCodeState.open || fenceState?.open ? 0 : findOpenCodeContextStart(buffer);
					if (openCodeIndex !== -1) {
						emit("text", buffer.slice(0, openCodeIndex));
						buffer = buffer.slice(openCodeIndex);
						return output;
					}
				}
				const trailingFenceStart = findTrailingFenceFragmentStart(buffer, activeInlineCodeState, activeFenceState);
				if (trailingFenceStart !== -1) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, trailingFenceStart));
					buffer = buffer.slice(trailingFenceStart);
					return output;
				}
				const keepFrom = reasoningTagPrefixSuffixIndex(buffer, (index) => codeSpans.isInside(index));
				if (keepFrom === -1) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer);
					buffer = "";
					return output;
				}
				if (reasoningDepth === 0 && keepFrom > 0 && buffer.slice(0, keepFrom).trim().length > 0 && isReasoningCloseTagPrefix(buffer.slice(keepFrom))) return output;
				if (keepFrom > 0) {
					emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, keepFrom));
					buffer = buffer.slice(keepFrom);
				}
				return output;
			}
			const beforeTag = buffer.slice(0, tag.index);
			const afterTag = buffer.slice(tag.index + tag.text.length);
			if (tag.isClose && reasoningDepth === 0) {
				if (recoverFullUnclosed && beforeTag.trim().length > 0 && afterTag.trim().length > 0) {
					emit("text", beforeTag + tag.text);
					buffer = afterTag;
					continue;
				}
				if (beforeTag.trim().length > 0 && afterTag.trim().length === 0 && !final) return output;
				if (beforeTag.trim().length === 0 || afterTag.trim().length === 0) emit("text", beforeTag);
				buffer = afterTag;
				continue;
			}
			emit(reasoningDepth > 0 ? "thinking" : "text", buffer.slice(0, tag.index));
			buffer = afterTag;
			if (tag.isClose) {
				reasoningDepth = Math.max(0, reasoningDepth - 1);
				if (reasoningDepth === 0) {
					recoverableOpenTagText = void 0;
					hiddenInlineCodeState = createInlineCodeState();
					hiddenFenceState = void 0;
				}
			} else {
				if (reasoningDepth === 0) {
					recoverableOpenTagText = recoverFullUnclosed && emittedVisibleText ? tag.text : void 0;
					hiddenInlineCodeState = createInlineCodeState();
					hiddenFenceState = void 0;
				}
				reasoningDepth += 1;
			}
		}
		return output;
	};
	return {
		markStrict() {
			strictMode = true;
		},
		push(chunk) {
			strictMode = true;
			buffer += chunk;
			return consume(false, false);
		},
		pushVisible(chunk) {
			buffer += chunk;
			return consume(false, true);
		},
		flush() {
			return consume(true, !strictMode);
		},
		hasPending() {
			return buffer.length > 0 || reasoningDepth > 0;
		},
		isInsideReasoning() {
			return reasoningDepth > 0;
		}
	};
}
function hasRawReasoningTag(text) {
	REASONING_TAG_RE.lastIndex = 0;
	return REASONING_TAG_RE.test(text);
}
function hasRawReasoningCloseTag(text) {
	REASONING_TAG_RE.lastIndex = 0;
	for (;;) {
		const match = REASONING_TAG_RE.exec(text);
		if (!match) return false;
		if (match[1] === "/") return true;
	}
}
function findNextReasoningTag(text, isIndexInsideCode) {
	REASONING_TAG_RE.lastIndex = 0;
	for (;;) {
		const match = REASONING_TAG_RE.exec(text);
		if (!match) return null;
		if (!isIndexInsideCode(match.index)) return {
			index: match.index,
			text: match[0],
			isClose: match[1] === "/"
		};
	}
}
function reasoningTagPrefixSuffixIndex(text, isIndexInsideCode) {
	for (let index = text.lastIndexOf("<"); index >= 0;) {
		if (!isIndexInsideCode(index) && isReasoningTagPrefix(text.slice(index))) return index;
		if (index === 0) break;
		index = text.lastIndexOf("<", index - 1);
	}
	return -1;
}
function isReasoningTagPrefix(text) {
	const name = normalizeReasoningTagPrefixName(text);
	return REASONING_TAG_NAMES.some((tagName) => {
		if (tagName.startsWith(name)) return true;
		if (!name.startsWith(tagName)) return false;
		const rest = name.slice(tagName.length);
		return rest.length === 0 || /^[\s/>]/.test(rest);
	});
}
function isReasoningCloseTagPrefix(text) {
	return text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase().startsWith("</") && isReasoningTagPrefix(text);
}
function normalizeReasoningTagPrefixName(text) {
	const normalized = text.replace(/^<\s*/, "<").replace(/^<\s*\//, "</").replace(/^<\/\s*/, "</").toLowerCase();
	return (normalized.startsWith("</") ? normalized.slice(2) : normalized.slice(1)).trimStart();
}
function findOpenCodeContextStart(text) {
	const fence = findOpenFenceStart(text);
	const inline = findOpenInlineCodeStart(text);
	if (fence === -1) return inline;
	if (inline === -1) return fence;
	return Math.min(fence, inline);
}
function findOpenInlineCodeStart(text) {
	let openStart = -1;
	let openTicks = 0;
	let index = 0;
	while (index < text.length) {
		if (text[index] !== "`") {
			index += 1;
			continue;
		}
		const runStart = index;
		let runLength = 0;
		while (index < text.length && text[index] === "`") {
			runLength += 1;
			index += 1;
		}
		if (openStart === -1) {
			openStart = runStart;
			openTicks = runLength;
		} else if (runLength === openTicks) {
			openStart = -1;
			openTicks = 0;
		}
	}
	return openStart;
}
function findOpenFenceStart(text) {
	const fenceRe = /(^|\n)(```|~~~)[^\n]*(?:\n|$)/g;
	let open = null;
	for (const match of text.matchAll(fenceRe)) {
		const index = (match.index ?? 0) + match[1].length;
		const marker = match[2] ?? "";
		if (open !== null && open.marker === marker) open = null;
		else if (!open) open = {
			marker,
			index
		};
	}
	return open?.index ?? -1;
}
function findTrailingFenceFragmentStart(text, inlineState, fenceState) {
	if (inlineState.open || fenceState?.open) return -1;
	const lineStart = Math.max(text.lastIndexOf("\n") + 1, 0);
	return text.slice(lineStart).match(/^( {0,3})(`{1,2}|~{1,2})$/) ? lineStart : -1;
}
//#endregion
export { createReasoningTagTextPartitioner as t };
