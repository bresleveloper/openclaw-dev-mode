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
		if (!open) {
			if (markerChar === "`" && trailing.includes("`")) continue;
			open = {
				start,
				markerChar,
				markerLen,
				openLine: `${indent}${marker}${trailing}`,
				marker,
				indent
			};
		} else if (open.markerChar === markerChar && markerLen >= open.markerLen && /^[ \t]*$/.test(trailing)) {
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
export { scanFenceSpans as i, isSafeFenceBreak as n, parseFenceSpans as r, findFenceSpanAt as t };
