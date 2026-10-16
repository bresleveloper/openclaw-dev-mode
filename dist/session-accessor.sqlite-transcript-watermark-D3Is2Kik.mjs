import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as readSessionColdTranscript } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CRApP3Oa.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark.ts
/** Read hot generation and retained cold position on the caller's admitted snapshot. */
function readSessionTranscriptWatermarkInDatabase(database, sessionId) {
	const watermark = readSessionTranscriptHotWatermark(database, sessionId);
	const cold = readSessionColdTranscript(database.db, sessionId);
	return {
		...watermark,
		maxSeq: cold?.last_seq ?? watermark.maxSeq
	};
}
/** Reads the append and rewrite tokens that validate transcript-derived caches. */
function readSessionTranscriptWatermark(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => readSessionTranscriptWatermarkInDatabase(database, resolved.sessionId), {
		databaseLabel: database.path,
		operationLabel: "session transcript watermark read"
	}), toDatabaseOptions(resolved));
	return result.found ? result.value : {
		generation: null,
		maxSeq: null
	};
}
//#endregion
export { readSessionTranscriptWatermarkInDatabase as n, readSessionTranscriptWatermark as t };
