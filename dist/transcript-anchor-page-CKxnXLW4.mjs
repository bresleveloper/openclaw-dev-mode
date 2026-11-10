//#region src/sessions/transcript-anchor-page.ts
function resolveTranscriptPageEnd(totalMessages, options) {
	const boundary = options.beforeSeq === void 0 || !Number.isFinite(options.beforeSeq) ? totalMessages : Math.min(totalMessages, Math.max(0, Math.floor(options.beforeSeq) - 1));
	const offset = options.offset ?? 0;
	return Math.max(0, boundary - Math.max(0, Math.floor(Number.isFinite(offset) ? offset : 0)));
}
function resolveHistoryAnchorPageRange(totalMessages, anchorPosition, { maxMessages, direction, excludeAnchor }) {
	const pageSize = Math.max(1, Math.floor(Number.isFinite(maxMessages) ? maxMessages : 1));
	if (direction) {
		const endExclusive = direction === "older" ? anchorPosition + 1 : Math.min(totalMessages, anchorPosition + pageSize);
		return {
			readStart: (direction === "older" ? Math.max(0, endExclusive - pageSize) : anchorPosition) + (excludeAnchor && direction === "newer" ? 1 : 0),
			endExclusive: endExclusive - (excludeAnchor && direction === "older" ? 1 : 0),
			hasOverreadContext: false,
			offset: totalMessages - endExclusive
		};
	}
	const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
	const latestStart = Math.max(0, totalMessages - pageSize);
	const start = Math.min(Math.max(0, anchorPosition - olderMessages), latestStart);
	const endExclusive = Math.min(totalMessages, start + pageSize);
	const readStart = Math.max(0, start - 1);
	return {
		readStart,
		endExclusive,
		hasOverreadContext: readStart < start,
		offset: totalMessages - endExclusive
	};
}
/** Admit a contiguous range around the anchor before loading any payloads. */
function boundHistoryAnchorPageRange(range, anchorPosition, maxBytes, byteSize, rejectOversized = false) {
	let start = Math.min(Math.max(anchorPosition, range.readStart), range.endExclusive);
	let endExclusive = start;
	let bytes = 2;
	const include = (position) => {
		const size = byteSize(position, maxBytes - bytes);
		if (bytes + size > maxBytes) {
			if (rejectOversized && start === endExclusive) throw new Error(`Transcript history message exceeds the ${maxBytes}-byte page limit`);
			return false;
		}
		bytes += size;
		return true;
	};
	if (start < range.endExclusive) {
		if (!include(start)) return {
			start,
			endExclusive
		};
		endExclusive++;
	}
	while (start > range.readStart && include(start - 1)) start--;
	while (endExclusive < range.endExclusive && include(endExclusive)) endExclusive++;
	return {
		start,
		endExclusive
	};
}
//#endregion
export { resolveHistoryAnchorPageRange as n, resolveTranscriptPageEnd as r, boundHistoryAnchorPageRange as t };
