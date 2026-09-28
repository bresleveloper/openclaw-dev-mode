import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/infra/push-apns-store-transaction.ts
/** Advances a registration/tombstone version without reusing an observed owner version. */
function nextApnsRegistrationVersion(nodeId, previousVersions, nowMs = Date.now()) {
	let latest = -1;
	for (const version of previousVersions) {
		if (!Number.isSafeInteger(version) || version < 0) throw new Error(`invalid APNs registration version for node ${nodeId}`);
		latest = Math.max(latest, version);
	}
	if (latest === Number.MAX_SAFE_INTEGER) throw new Error(`APNs registration version exhausted for node ${nodeId}`);
	return Math.max(nowMs, latest + 1);
}
/** Tombstones and deletes one APNs owner inside the caller's shared-state transaction. */
function clearApnsRegistrationFromDatabase(db, nodeId) {
	const normalizedNodeId = nodeId.trim();
	if (!normalizedNodeId) return false;
	const stateDb = getNodeSqliteKysely(db);
	const currentRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").select("updated_at_ms").where("node_id", "=", normalizedNodeId));
	const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("deleted_at_ms").where("node_id", "=", normalizedNodeId));
	const deletedAtMs = nextApnsRegistrationVersion(normalizedNodeId, [currentRow?.updated_at_ms, tombstone?.deleted_at_ms].filter((version) => version !== void 0));
	executeSqliteQuerySync(db, stateDb.insertInto("apns_registration_tombstones").values({
		node_id: normalizedNodeId,
		deleted_at_ms: deletedAtMs
	}).onConflict((conflict) => conflict.column("node_id").doUpdateSet({ deleted_at_ms: deletedAtMs })));
	executeSqliteQuerySync(db, stateDb.deleteFrom("apns_registrations").where("node_id", "=", normalizedNodeId));
	return currentRow !== void 0;
}
//#endregion
export { nextApnsRegistrationVersion as n, clearApnsRegistrationFromDatabase as t };
