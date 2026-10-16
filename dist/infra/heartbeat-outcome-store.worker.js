import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { o as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { n as persistHeartbeatOutcomeInDatabase, t as claimHeartbeatOutcomeRowInDatabase } from "../heartbeat-outcome-store.kernel-8XNnuON1.mjs";
//#region src/infra/heartbeat-outcome-store.worker.ts
/** Borrows the canonical agent connection for one admitted outcome operation. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			return runSqliteWorkerTransactionSync(context, () => command.type === "persist" ? persistHeartbeatOutcomeInDatabase(db, command.input) : claimHeartbeatOutcomeRowInDatabase(db, command.input), {
				operationLabel: `heartbeat.outcome.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath
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
