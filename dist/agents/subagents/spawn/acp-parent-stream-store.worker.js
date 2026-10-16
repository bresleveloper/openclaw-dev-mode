import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "../../../kysely-sync-K7ftY-g4.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../../../sqlite-transaction-DsZ3X6nD.mjs";
import { t as coerceRequiredSqliteNumber } from "../../../sqlite-number-DZt1m75H.mjs";
import { t as encodeOpenClawStateWorkerError } from "../../../openclaw-state-worker-error-Cmtk9G4_.mjs";
//#region src/agents/subagents/spawn/acp-parent-stream-store.worker.ts
function bindSqliteWorkerBackend(_input, context) {
	const database = context.database;
	const db = getNodeSqliteKysely(database);
	return {
		execute({ input }) {
			try {
				runSqliteImmediateTransactionSync(database, () => {
					context.admit("transaction");
					const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("acp_parent_stream_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", input.sessionId).where("run_id", "=", input.runId));
					const firstSeq = row?.max_seq == null ? 0 : coerceRequiredSqliteNumber(row.max_seq) + 1;
					executeSqliteQuerySync(database, db.insertInto("acp_parent_stream_events").values(input.events.map((entry, index) => ({
						session_id: input.sessionId,
						run_id: input.runId,
						seq: firstSeq + index,
						event_json: entry.eventJson,
						created_at: entry.createdAt
					}))));
				}, {
					operationLabel: "acp.parent-stream.record",
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: context.databasePath,
					withCommit(commit) {
						context.admit("commit");
						commit();
					}
				});
				return {
					ok: true,
					value: void 0
				};
			} catch (error) {
				assertTransactionUsable(database);
				if (!database.isOpen || database.isTransaction) throw error;
				const failure = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
				if (!failure) throw error;
				return {
					ok: false,
					error: failure
				};
			}
		},
		assertSettled() {
			assertTransactionUsable(database);
			if (database.isTransaction) throw new Error("ACP parent-stream transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
