import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as ensureMessageToolRunOutcomeSchema } from "../openclaw-agent-message-tool-outcome-schema-r9u1KU-x.mjs";
import { t as recordMessageToolRunOutcomeInDatabase } from "../message-tool-run-outcome-store.kernel-1mHPPSQz.mjs";
//#region src/infra/message-tool-run-outcome-store.worker.ts
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			try {
				if (command.type === "prepare") {
					ensureMessageToolRunOutcomeSchema(db, (stage) => context.admit(stage));
					return {
						ok: true,
						value: void 0
					};
				}
				runSqliteImmediateTransactionSync(db, () => {
					context.admit("transaction");
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
