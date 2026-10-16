//#region src/sessions/transcript-anchor-page.ts
function resolveTranscriptPageEnd(totalMessages, options) {
	const boundary = options.beforeSeq === void 0 || !Number.isFinite(options.beforeSeq) ? totalMessages : Math.min(totalMessages, Math.max(0, Math.floor(options.beforeSeq) - 1));
	const offset = options.offset ?? 0;
	return Math.max(0, boundary - Math.max(0, Math.floor(Number.isFinite(offset) ? offset : 0)));
}
function resolveHistoryAnchorPageRange(totalMessages, anchorPosition, { maxMessages, direction }) {
	const pageSize = Math.max(1, Math.floor(Number.isFinite(maxMessages) ? maxMessages : 1));
	if (direction) {
		const endExclusive = direction === "older" ? anchorPosition + 1 : Math.min(totalMessages, anchorPosition + pageSize);
		return {
			readStart: direction === "older" ? Math.max(0, endExclusive - pageSize) : anchorPosition,
			endExclusive,
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
//#endregion
export { resolveTranscriptPageEnd as n, resolveHistoryAnchorPageRange as t };
