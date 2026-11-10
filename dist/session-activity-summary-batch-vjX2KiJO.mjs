import "./activity-summary-CfqWjwl5.mjs";
//#region src/gateway/session-activity-summary-batch.ts
const ACTIVITY_SUMMARY_MAX_BYTES = 131072;
/** The worker and complete actor replica apply the same incremental summary policy. */
function selectActivitySummaryBatch(params) {
	const { snapshot, watermark } = params;
	let previous = params.previous;
	if (previous && (previous.generation !== (snapshot.snapshot.generation ?? null) || previous.coveredMessages > snapshot.totalMessages || previous.leafEntryId && !params.isOnActivePath(previous.leafEntryId))) previous = void 0;
	const covered = previous?.coveredMessages ?? 0;
	let batchSize = Math.min(64, snapshot.totalMessages - covered);
	const earlierOmission = previous?.omittedContent && (previous.formatRevision === 3 || params.readPage(covered, 0, true).hasOversizedMessages);
	let page = params.readPage(covered, batchSize);
	while (batchSize > 1 && page.events.length < page.scannedMessages) {
		batchSize = Math.max(1, Math.floor(batchSize / 2));
		page = params.readPage(covered, batchSize);
	}
	return {
		previous,
		snapshot,
		watermark,
		covered,
		page,
		omitted: earlierOmission === true || page.hasOversizedMessages === true
	};
}
//#endregion
export { selectActivitySummaryBatch as n, ACTIVITY_SUMMARY_MAX_BYTES as t };
