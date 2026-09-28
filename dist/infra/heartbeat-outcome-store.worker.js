import { o as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DKSXLQhb.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-dESpOAuZ.mjs";
import { n as persistHeartbeatOutcomeInDatabase, t as claimHeartbeatOutcomeRowInDatabase } from "../heartbeat-outcome-store.kernel-CWEx1mID.mjs";
//#region src/infra/heartbeat-outcome-store.worker.ts
/** Borrows the canonical agent connection for one admitted outcome operation. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			return runSqliteImmediateTransactionSync(db, () => {
				context.admit("transaction");
				return command.type === "persist" ? persistHeartbeatOutcomeInDatabase(db, command.input) : claimHeartbeatOutcomeRowInDatabase(db, command.input);
			}, {
				operationLabel: `heartbeat.outcome.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath,
				withCommit(commit) {
					context.admit("commit");
					commit();
				}
			});
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Heartbeat outcome transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
