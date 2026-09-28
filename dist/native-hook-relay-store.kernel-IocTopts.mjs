import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/agents/harness/native-hook-relay-bridge-query.ts
function readNativeHookRelayBridgeRow(database, relayId) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("native_hook_relay_bridges").selectAll().where("relay_id", "=", relayId));
}
//#endregion
//#region src/agents/harness/native-hook-relay-bridge-record.ts
/** Validate and convert a persisted native relay locator row. */
function readNativeHookRelayBridgeRecordRow(row) {
	if (!row || typeof row.relay_id !== "string" || row.relay_id.length === 0 || !Number.isSafeInteger(row.pid) || row.hostname !== "127.0.0.1" || !Number.isSafeInteger(row.port) || Number(row.port) <= 0 || Number(row.port) > 65535 || typeof row.token !== "string" || row.token.length === 0 || !Number.isSafeInteger(row.expires_at_ms)) return;
	return {
		relayId: row.relay_id,
		pid: Number(row.pid),
		hostname: row.hostname,
		port: Number(row.port),
		token: row.token,
		expiresAtMs: Number(row.expires_at_ms)
	};
}
//#endregion
//#region src/agents/harness/native-hook-relay-store.kernel.ts
function readNativeHookRelayBridgeSnapshot(row) {
	const record = readNativeHookRelayBridgeRecordRow(row);
	if (!record || !row || !Number.isSafeInteger(row.updated_at_ms)) return;
	return {
		record,
		updatedAtMs: row.updated_at_ms
	};
}
function readNativeHookRelayBridgeSnapshotFromDatabase(params) {
	return readNativeHookRelayBridgeSnapshot(readNativeHookRelayBridgeRow(params.database.db, params.relayId));
}
function sameNativeHookRelayBridgeSnapshot(left, right) {
	return left.updatedAtMs === right.updatedAtMs && left.record.relayId === right.record.relayId && left.record.pid === right.record.pid && left.record.hostname === right.record.hostname && left.record.port === right.record.port && left.record.token === right.record.token && left.record.expiresAtMs === right.record.expiresAtMs;
}
function writeNativeHookRelayBridgeRecordInDatabase(database, params) {
	const { record, updatedAtMs } = params;
	const { token } = record;
	const db = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
		relay_id: record.relayId,
		pid: record.pid,
		hostname: record.hostname,
		port: record.port,
		token,
		expires_at_ms: record.expiresAtMs,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("relay_id").doUpdateSet({
		pid: record.pid,
		hostname: record.hostname,
		port: record.port,
		token,
		expires_at_ms: record.expiresAtMs,
		updated_at_ms: updatedAtMs
	})));
}
function renewOrRestoreNativeHookRelayBridgeRecordInDatabase(database, params) {
	const { record, updatedAtMs } = params;
	const { token } = record;
	const db = getNodeSqliteKysely(database.db);
	const current = readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: record.relayId
	});
	if (!current) return executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
		relay_id: record.relayId,
		pid: record.pid,
		hostname: record.hostname,
		port: record.port,
		token,
		expires_at_ms: record.expiresAtMs,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("relay_id").doNothing())).numAffectedRows === 1n;
	if (current.record.pid !== record.pid || current.record.token !== token) return false;
	return executeSqliteQuerySync(database.db, db.updateTable("native_hook_relay_bridges").set({
		hostname: record.hostname,
		port: record.port,
		expires_at_ms: record.expiresAtMs,
		updated_at_ms: updatedAtMs
	}).where("relay_id", "=", record.relayId).where("pid", "=", record.pid).where("token", "=", token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n;
}
function deleteNativeHookRelayBridgeRecordIfOwnedInDatabase(database, params) {
	const current = readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: params.relayId
	});
	if (!current || current.record.pid !== params.pid || current.record.token !== params.token) return false;
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", params.relayId).where("pid", "=", params.pid).where("token", "=", params.token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n;
}
function listNativeHookRelayBridgeSnapshotsInDatabase(database) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("native_hook_relay_bridges").selectAll()).rows.flatMap((row) => {
		const snapshot = readNativeHookRelayBridgeSnapshot(row);
		return snapshot ? [snapshot] : [];
	});
}
function pruneNativeHookRelayBridgeRecordsInDatabase(database, candidates, nowMs) {
	const db = getNodeSqliteKysely(database.db);
	const pruned = [];
	for (const candidate of candidates) {
		const current = readNativeHookRelayBridgeSnapshotFromDatabase({
			database,
			relayId: candidate.snapshot.record.relayId
		});
		if (!current || !sameNativeHookRelayBridgeSnapshot(current, candidate.snapshot) || candidate.reason === "expired" && nowMs <= current.record.expiresAtMs) continue;
		if (executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", current.record.relayId).where("token", "=", current.record.token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n) pruned.push({
			relayId: current.record.relayId,
			pid: current.record.pid,
			reason: candidate.reason
		});
	}
	return pruned;
}
function clearNativeHookRelayBridgeRecordsInDatabase(database) {
	const db = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges"));
}
//#endregion
export { readNativeHookRelayBridgeSnapshotFromDatabase as a, pruneNativeHookRelayBridgeRecordsInDatabase as i, deleteNativeHookRelayBridgeRecordIfOwnedInDatabase as n, renewOrRestoreNativeHookRelayBridgeRecordInDatabase as o, listNativeHookRelayBridgeSnapshotsInDatabase as r, writeNativeHookRelayBridgeRecordInDatabase as s, clearNativeHookRelayBridgeRecordsInDatabase as t };
