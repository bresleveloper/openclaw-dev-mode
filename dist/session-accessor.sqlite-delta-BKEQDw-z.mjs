import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as normalizeRawDeltaLimits } from "./session-transcript-raw-cursor-fGQxJVDh.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-LkTRNCnP.mjs";
import { t as readRawDeltaInTransaction } from "./session-accessor.sqlite-raw-delta-read-D_J6L0BJ.mjs";
//#region src/config/sessions/session-accessor.sqlite-delta.ts
/** Read one generation-consistent raw transcript page without parsing excluded payload rows. */
function readTranscriptRawDelta(scope, limits = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return readTranscriptRawDeltaInDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved, limits);
}
function readTranscriptRawDeltaInDatabase(database, resolved, limits) {
	const { maxEvents, maxBytes } = normalizeRawDeltaLimits(limits);
	const readSnapshot = () => {
		const watermark = readSessionTranscriptHotWatermark(database, resolved.sessionId, { requireHot: true });
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		return readRawDeltaInTransaction(database.db, resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq, {
			generation: watermark.generation ?? void 0,
			indexedSeq: watermark.maxSeq ?? -1
		});
	};
	return database.db.isTransaction ? readSnapshot() : runSqliteDeferredTransactionSync(database.db, readSnapshot, {
		databaseLabel: database.path,
		operationLabel: "session transcript raw delta"
	});
}
//#endregion
export { readTranscriptRawDeltaInDatabase as n, readTranscriptRawDelta as t };
