import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-QlwTsE6j.mjs";
import { l as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import { d as isSqliteWorkerError } from "../sqlite-worker-contract-DhDutMia.mjs";
import { i as writePreparedSessionProgressCard, n as prepareSessionProgressCardWrite } from "../progress-card-store-BAskGyMI.mjs";
//#region src/session-cards/progress-card-store.worker.ts
/** Borrows the canonical agent writer connection; reset shares its row kernel. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			const input = prepareSessionProgressCardWrite(command.input);
			try {
				return {
					ok: true,
					value: runSqliteWorkerTransactionSync(context, () => writePreparedSessionProgressCard(db, command.input.sessionKey, input), {
						databaseLabel: context.databasePath,
						operationLabel: "progress-card.put",
						busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
					})
				};
			} catch (error) {
				if (isSqliteWorkerError(error, "closed")) throw error;
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
			if (db.isTransaction) throw new Error("Progress-card transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
