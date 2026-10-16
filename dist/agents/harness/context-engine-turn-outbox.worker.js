import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { o as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { z as recordContextEngineTurnOutboxSchemaCommitted } from "../../openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as executeContextEngineTurnOutboxCommand } from "../../context-engine-turn-outbox-CI4iO3YG.mjs";
//#region src/agents/harness/context-engine-turn-outbox.worker.ts
/** Borrows the canonical agent connection for one admitted outbox operation. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			return runSqliteWorkerTransactionSync(context, () => executeContextEngineTurnOutboxCommand(db, command), {
				operationLabel: `context-engine.turn-outbox.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath,
				withCommit(commit) {
					commit();
					recordContextEngineTurnOutboxSchemaCommitted(db);
				}
			});
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Context-engine turn outbox transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
