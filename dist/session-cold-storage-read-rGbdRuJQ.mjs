import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
//#region src/config/sessions/session-cold-storage-read.ts
/** The cold marker and hot rows must belong to one snapshot, including cached statement lookups. */
function readHotSessionTranscriptSnapshot(database, sessionId, purpose, read) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, sessionId);
		return read();
	}, { operationLabel: `session transcript ${purpose} read` });
}
/** A peer can archive after restoration settles but before the read completes. */
async function readRestoredSessionTranscript(scope, read, options) {
	options?.signal?.throwIfAborted();
	options?.assertCurrent?.();
	if (options?.readOnly) return read();
	for (let restorations = 0;; restorations++) {
		options?.signal?.throwIfAborted();
		options?.assertCurrent?.();
		try {
			return await read();
		} catch (error) {
			if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== scope.sessionId || restorations === 2) throw error;
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-DmgpAWjS.mjs");
			await restoreSessionColdTranscript(scope, options?.assertCurrent, options?.coldRead, void 0, options?.signal);
		}
	}
}
//#endregion
export { readRestoredSessionTranscript as n, readHotSessionTranscriptSnapshot as t };
