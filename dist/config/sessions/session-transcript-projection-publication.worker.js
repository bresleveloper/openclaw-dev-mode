import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "../../kysely-sync-K7ftY-g4.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { o as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { _ as finalizePreparedSessionTranscriptProjectionInTransaction, c as listSessionsNeedingTranscriptIndexReconcile, g as deletePreparedSessionTranscriptProjectionChunkInTransaction, h as claimPreparedSessionTranscriptProjectionInTransaction, i as deleteOrphanedTranscriptIndexRowsInTransaction, m as appendPreparedSessionTranscriptProjectionChunkInTransaction } from "../../session-transcript-index-FbEuN6S5.mjs";
//#region src/config/sessions/session-transcript-projection-publication.worker.ts
/** The canonical agent executor lends its connection for each bounded publication. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			return runSqliteWorkerTransactionSync(context, () => {
				switch (command.type) {
					case "preflight":
						deleteOrphanedTranscriptIndexRowsInTransaction(db);
						return listSessionsNeedingTranscriptIndexReconcile(db).length > 0;
					case "claim": return claimPreparedSessionTranscriptProjectionInTransaction(db, command.input.plan, command.input.claimId);
					case "deleteChunk": return deletePreparedSessionTranscriptProjectionChunkInTransaction(db, command.input);
					case "appendChunk": return appendPreparedSessionTranscriptProjectionChunkInTransaction(db, command.input);
					case "finalize": {
						const finalized = finalizePreparedSessionTranscriptProjectionInTransaction(db, command.input.plan, command.input.claimId);
						const session = finalized ? executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("session_windows").select("session_key").where("session_id", "=", command.input.plan.sessionId)) : void 0;
						return {
							finalized,
							...session ? { sessionKey: session.session_key } : {}
						};
					}
					case "sweep":
						deleteOrphanedTranscriptIndexRowsInTransaction(db);
						return null;
				}
				throw new Error("Unknown transcript projection publication operation");
			}, {
				operationLabel: `sessions.transcript-index.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath
			});
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Transcript projection publication did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
