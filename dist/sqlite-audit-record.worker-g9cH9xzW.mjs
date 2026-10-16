import { P as createSqliteAuditRecordKernel } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
//#region src/infra/sqlite-audit-record.worker.ts
const diagnosticOperations = { "diagnostic.register": (input, { open, stateOptions }) => {
	const database = open();
	return runOpenClawStateWriteTransaction(({ db }) => {
		createSqliteAuditRecordKernel(db, input).register(input.record);
	}, {
		database,
		...stateOptions()
	});
} };
//#endregion
export { diagnosticOperations };
