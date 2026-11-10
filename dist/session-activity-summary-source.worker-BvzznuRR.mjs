import { r as readActivePathEntryRelationFromProjection } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
import { n as selectActivitySummaryBatch, t as ACTIVITY_SUMMARY_MAX_BYTES } from "./session-activity-summary-batch-vjX2KiJO.mjs";
//#region src/gateway/session-activity-summary-source.worker.ts
/** Only byte-bounded bodies leave the transcript worker. */
function readActivitySummaryBatch(params) {
	return withCurrentProjectionSnapshot(params.scope, (projection) => {
		const snapshot = readSessionTranscriptBoundedMessageTailPageFromProjection(projection, {
			maxBytes: 0,
			maxMessages: 0,
			offset: 0
		});
		return selectActivitySummaryBatch({
			previous: params.previous,
			snapshot,
			watermark: {
				generation: projection.version.generation,
				maxSeq: projection.version.rawSeq
			},
			isOnActivePath: (entryId) => readActivePathEntryRelationFromProjection(projection, entryId) !== "off-path",
			readPage: (start, count, includeEarlier = false) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, {
				maxBytes: ACTIVITY_SUMMARY_MAX_BYTES,
				maxMessages: count,
				offset: snapshot.totalMessages - start - count,
				oversizedMessageCheck: {
					roles: ["user", "assistant"],
					includeEarlier
				}
			})
		});
	}, { readOnly: true });
}
//#endregion
export { readActivitySummaryBatch };
