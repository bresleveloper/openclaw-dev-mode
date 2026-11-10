import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { d as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readNativeHookRelayBridgeRow, t as readNativeHookRelayBridgeRecordRow } from "./native-hook-relay-bridge-record-Dvw-xPUN.mjs";
//#region src/agents/harness/native-hook-relay-store.kernel.ts
function readNativeHookRelayBridgeRecordFromDatabase(params) {
	return readNativeHookRelayBridgeRecordRow(readNativeHookRelayBridgeRow(params.database.db, params.relayId));
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
	const { relay_id, ...fields } = nativeHookRelayBridgeRow(params);
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
		relay_id,
		...fields
	}).onConflict((conflict) => conflict.column("relay_id").doUpdateSet(fields).where("native_hook_relay_bridges.pid", "=", params.record.pid).where("native_hook_relay_bridges.token", "=", params.record.token))).numAffectedRows === 1n;
}
function deleteNativeHookRelayBridgeRecordIfOwnedInDatabase(database, params) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", params.relayId).where("pid", "=", params.pid).where("token", "=", params.token)).numAffectedRows === 1n;
}
function listNativeHookRelayBridgeRecordsInDatabase(database) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("native_hook_relay_bridges").selectAll()).rows.flatMap((row) => {
		const record = readNativeHookRelayBridgeRecordRow(row);
		return record ? [record] : [];
	});
}
function pruneNativeHookRelayBridgeRecordsInDatabase(database, candidates, nowMs) {
	const db = getNodeSqliteKysely(database.db);
	const pruned = [];
	for (const candidate of candidates) {
		const { record } = candidate;
		let deletion = db.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", record.relayId).where("pid", "=", record.pid).where("token", "=", record.token);
		if (candidate.reason === "expired") deletion = deletion.where("expires_at_ms", "<", nowMs);
		if (executeSqliteQuerySync(database.db, deletion).numAffectedRows === 1n) pruned.push({
			relayId: record.relayId,
			pid: record.pid,
			reason: candidate.reason
		});
	}
	return pruned;
}
//#endregion
//#region src/agents/harness/native-hook-relay-store.worker.ts
function relayMutation(mutate, requiresAdmission = false) {
	return (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => {
		if (requiresAdmission) requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		return mutate(database, input);
	}, {
		database: open(),
		...stateOptions()
	});
}
const nativeHookRelayOperations = {
	"nativeHookRelay.read": (input, { stateOptions }) => withOpenClawStateDatabaseReadOnly((database) => readNativeHookRelayBridgeRecordFromDatabase({
		database,
		relayId: input.relayId
	}), stateOptions()),
	"nativeHookRelay.listRecords": (_input, { open }) => listNativeHookRelayBridgeRecordsInDatabase(open()),
	"nativeHookRelay.write": relayMutation(writeNativeHookRelayBridgeRecordInDatabase, true),
	"nativeHookRelay.renew": relayMutation(renewOrRestoreNativeHookRelayBridgeRecordInDatabase, true),
	"nativeHookRelay.deleteOwned": relayMutation(deleteNativeHookRelayBridgeRecordIfOwnedInDatabase),
	"nativeHookRelay.prune": relayMutation((database, input) => pruneNativeHookRelayBridgeRecordsInDatabase(database, input.candidates, input.nowMs))
};
//#endregion
export { nativeHookRelayOperations };
