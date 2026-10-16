import { P as createSqliteAuditRecordKernel } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
//#region src/config/config-journal-snapshot.kernel.ts
const CONFIG_SNAPSHOT_SCOPE = "config-snapshot";
const CONFIG_SNAPSHOT_KEY = "latest";
function upsertConfigSnapshotAuditRecordInDatabase(database, input) {
	const store = createSqliteAuditRecordKernel(database, {
		scope: CONFIG_SNAPSHOT_SCOPE,
		maxEntries: 1
	});
	if (input.expectedPayloadJson !== void 0) return store.compareAndSet(CONFIG_SNAPSHOT_KEY, input.expectedPayloadJson, input.record);
	if (input.record) store.upsert(input.record);
	else store.delete(CONFIG_SNAPSHOT_KEY);
	return true;
}
//#endregion
export { CONFIG_SNAPSHOT_SCOPE as n, upsertConfigSnapshotAuditRecordInDatabase as r, CONFIG_SNAPSHOT_KEY as t };
