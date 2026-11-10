import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-DDhSj356.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { d as readSessionTranscriptTerminalModel } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as preserveSessionEntryCacheAcrossWrite } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { n as SESSION_ROW_TRANSCRIPT_TERMINAL_MAX_BYTES, t as SESSION_ROW_TRANSCRIPT_PREVIEW_MAX_BYTES } from "./session-row-transcript-preview-D_omQ8Ci.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
//#region src/gateway/session-row-transcript-backfill.worker.ts
/** Read and persist bounded derived facts in the existing writer's transaction. */
function backfillSessionRowTranscriptFieldsInDatabase(database, params) {
	const transcriptScope = {
		...params,
		agentId: params.storeAgentId ?? params.agentId
	};
	try {
		return withCurrentProjectionSnapshot(transcriptScope, (projection) => {
			const tail = readSessionTranscriptBoundedMessageTailPageFromProjection(projection, {
				maxMessages: 20,
				maxBytes: SESSION_ROW_TRANSCRIPT_PREVIEW_MAX_BYTES,
				offset: 0
			});
			const terminalEvent = tail.newestContiguousEventCount ? tail.events.at(-1)?.event : tail.totalMessages ? readSessionTranscriptBoundedMessageTailPageFromProjection(projection, {
				maxMessages: 1,
				maxBytes: SESSION_ROW_TRANSCRIPT_TERMINAL_MAX_BYTES,
				offset: 0
			}).events[0]?.event : void 0;
			const fields = {
				lastMessagePreview: null,
				terminalModel: readSessionTranscriptTerminalModel(terminalEvent),
				indexedSeq: projection.state.indexedSeq < 0 ? null : projection.state.indexedSeq
			};
			const events = tail.newestContiguousEventCount ? tail.events.slice(-tail.newestContiguousEventCount) : [];
			for (const event of events.toReversed()) {
				const projected = projectSessionDisplayMessage(sqliteMessageEventWithSeq(event), { flattenMarkdown: true });
				if (projected) {
					fields.lastMessagePreview = Buffer.from(projected.text, "utf16le").toString("utf16le");
					break;
				}
			}
			preserveSessionEntryCacheAcrossWrite(database, () => {
				executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_windows").set({
					row_transcript_json: JSON.stringify(fields),
					row_transcript_updated_at: projection.version.updatedAt
				}).where("session_id", "=", params.sessionId));
			});
			return fields;
		}, { transaction: database });
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error) || error instanceof SessionTranscriptStorageUnavailableError || error instanceof SessionTranscriptColdError) return;
		throw error;
	}
}
//#endregion
export { backfillSessionRowTranscriptFieldsInDatabase };
