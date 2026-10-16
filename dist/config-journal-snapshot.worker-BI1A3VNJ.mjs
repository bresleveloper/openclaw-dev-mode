import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as upsertConfigSnapshotAuditRecordInDatabase } from "./config-journal-snapshot.kernel-WY2QEkzC.mjs";
//#region src/config/config-journal-snapshot.worker.ts
const configSnapshotOperations = { "config.snapshot.upsert": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => upsertConfigSnapshotAuditRecordInDatabase(db, input), {
	...stateOptions(),
	database: open()
}) };
//#endregion
export { configSnapshotOperations };
