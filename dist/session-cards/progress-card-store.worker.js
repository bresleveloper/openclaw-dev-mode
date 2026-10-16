import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { o as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { u as isSqliteWorkerError } from "../sqlite-worker-contract-C51cJHzg.mjs";
import { i as writePreparedSessionProgressCard, n as prepareSessionProgressCardWrite } from "../progress-card-store-CRs-FKxG.mjs";
//#region src/session-cards/progress-card-store.worker.ts
/** Borrows the canonical agent writer connection; reset and incognito share its row kernel. */
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
