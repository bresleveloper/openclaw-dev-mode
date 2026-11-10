import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "../kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as ensureMessageToolRunOutcomeSchema } from "../openclaw-agent-message-tool-outcome-schema-D6vAotVz.mjs";
//#region src/infra/message-tool-run-outcome-store.kernel.ts
const MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS = 1e4;
/** Shared by the durable worker and the process-held incognito owner. */
function recordMessageToolRunOutcomeInDatabase(db, values) {
	const agentDb = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, agentDb.insertInto("message_tool_run_outcomes").values(values));
	executeSqliteQuerySync(db, agentDb.deleteFrom("message_tool_run_outcomes").where("id", "in", agentDb.selectFrom("message_tool_run_outcomes").select("id").orderBy("occurred_at", "desc").orderBy("id", "desc").limit(2147483647).offset(MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS)));
}
//#endregion
//#region src/infra/message-tool-run-outcome-store.worker.ts
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			try {
				runSqliteImmediateTransactionSync(db, () => {
					context.admit("transaction");
					ensureMessageToolRunOutcomeSchema(db);
					recordMessageToolRunOutcomeInDatabase(db, command.input);
				}, {
					operationLabel: "message-tool.run-outcome.record",
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
				assertTransactionUsable(db);
				if (!db.isOpen || db.isTransaction) throw error;
				const failure = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
				if (!failure) throw error;
				return {
					ok: false,
					error: failure
				};
			}
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Message-tool outcome transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
