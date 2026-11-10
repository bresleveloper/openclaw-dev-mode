import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { s as SqliteWorkerAdmissionTimeoutError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { p as currentSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
//#region src/infra/sqlite-worker-admission-retry.ts
const SQLITE_WORKER_ADMISSION_DEADLINE_MS = 1e3;
/** The operation must finish rollback before a timed-out attempt can be replayed. */
function retrySqliteWorkerAdmission(operation, { maxAttempts, database, exhaustedMessage }) {
	for (let attempt = 1;; attempt += 1) try {
		return operation();
	} catch (error) {
		if (!(error instanceof SqliteWorkerAdmissionTimeoutError)) throw error;
		if (database) {
			assertTransactionUsable(database);
			if (!database.isOpen || database.isTransaction) throw error;
		}
		if (attempt >= maxAttempts) throw exhaustedMessage ? new Error(exhaustedMessage, { cause: error }) : error;
		const owner = currentSqliteWorkerOperationAdmission.getStore()?.owner;
		if (owner?.refusal === error) delete owner.refusal;
	}
}
//#endregion
export { retrySqliteWorkerAdmission as n, SQLITE_WORKER_ADMISSION_DEADLINE_MS as t };
