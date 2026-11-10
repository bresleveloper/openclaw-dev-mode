import { i as scanFenceSpans } from "./fences-SIDHlQ9D.mjs";
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
	const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(text, fenceSpans, inlineState ?? createInlineCodeState());
	return {
		inlineState: nextInlineState,
		fenceState: nextFenceState,
		isInside: (index) => isInsideSpan(index, fenceSpans) || isInsideSpan(index, inlineSpans)
	};
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
	const spans = [];
	let open = initialState.open;
	let ticks = initialState.ticks;
	let openStart = open ? 0 : -1;
	let i = 0;
	let fenceIndex = 0;
	while (i < text.length) {
		const fence = fenceSpans[fenceIndex];
		if (fence && i >= fence.start) {
			i = fence.end;
			fenceIndex += 1;
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
			spans.push({
				start: openStart,
				end: i
			});
			open = false;
			ticks = 0;
			openStart = -1;
		}
	}
	if (open) spans.push({
		start: openStart,
		end: text.length
	});
	return {
		spans,
		state: {
			open,
			ticks
		}
	};
}
function isInsideSpan(index, spans) {
	let low = 0;
	let high = spans.length;
	while (low < high) {
		const middle = Math.floor((low + high) / 2);
		const span = spans[middle];
		if (!span) return false;
		if (index >= span.end) low = middle + 1;
		else high = middle;
	}
	const span = spans[low];
	return span !== void 0 && index >= span.start && index < span.end;
}
//#endregion
export { createInlineCodeState as n, buildCodeSpanIndex as t };
