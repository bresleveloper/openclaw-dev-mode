import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as readNativeHookRelayBridgeRow, t as readNativeHookRelayBridgeRecordRow } from "./native-hook-relay-bridge-record-DEqslTZw.mjs";
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
function nativeHookRelayBridgeRow({ record, updatedAtMs }) {
	return {
		relay_id: record.relayId,
		pid: record.pid,
		hostname: record.hostname,
		port: record.port,
		token: record.token,
		expires_at_ms: record.expiresAtMs,
		updated_at_ms: updatedAtMs
	};
}
function writeNativeHookRelayBridgeRecordInDatabase(database, params) {
	const { relay_id, ...fields } = nativeHookRelayBridgeRow(params);
	const db = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
		relay_id,
		...fields
	}).onConflict((conflict) => conflict.column("relay_id").doUpdateSet(fields)));
}
function renewOrRestoreNativeHookRelayBridgeRecordInDatabase(database, params) {
	const { record, updatedAtMs } = params;
	const { token } = record;
	const db = getNodeSqliteKysely(database.db);
	const current = readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: record.relayId
	});
	if (!current) return executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values(nativeHookRelayBridgeRow(params)).onConflict((conflict) => conflict.column("relay_id").doNothing())).numAffectedRows === 1n;
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
