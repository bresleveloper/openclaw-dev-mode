import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as upsertConfigSnapshotAuditRecordInDatabase } from "./config-journal-snapshot.kernel-CJlXipwF.mjs";
//#region src/config/config-journal-snapshot.worker.ts
const configSnapshotOperations = { "config.snapshot.upsert": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => upsertConfigSnapshotAuditRecordInDatabase(db, input), {
	...stateOptions(),
	database: open()
}) };
//#endregion
export { configSnapshotOperations };
