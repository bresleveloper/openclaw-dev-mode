import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { M as nextApnsRegistrationVersion, N as readApnsRegistrationVersions, S as loadPairedDevicePairingStoreRecordFromDatabase, c as resolveNodePairingGeneration, j as clearApnsRegistrationFromDatabase } from "./device-pairing-identity-BRtdqCdi.mjs";
import { g as apnsRegistrationToRow, m as readApnsRegistrationsFromDatabase, p as readApnsRegistrationFromDatabase } from "./push-apns-store-D7QEuLwt.mjs";
//#region src/infra/push-apns-store.worker.ts
function apnsRegistrationsEqual(left, right) {
	if (left.nodeId !== right.nodeId || left.transport !== right.transport || left.topic !== right.topic || left.environment !== right.environment || left.updatedAtMs !== right.updatedAtMs) return false;
	if (left.transport === "direct" && right.transport === "direct") return left.token === right.token;
	return left.transport === "relay" && right.transport === "relay" && left.relayHandle === right.relayHandle && left.sendGrant === right.sendGrant && left.installationId === right.installationId && left.distribution === right.distribution && left.relayOrigin === right.relayOrigin && left.tokenDebugSuffix === right.tokenDebugSuffix;
}
function registerApnsRegistrationInDatabase(database, input) {
	const { candidate } = input;
	const { nodeId } = candidate;
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (input.expectedPairingGeneration) {
			if (resolveNodePairingGeneration(loadPairedDevicePairingStoreRecordFromDatabase(db, nodeId))?.key !== input.expectedPairingGeneration) return { status: "pairing-changed" };
		}
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const stateDb = getNodeSqliteKysely(db);
		const { previousVersions } = readApnsRegistrationVersions(db, nodeId);
		const next = {
			...candidate,
			updatedAtMs: nextApnsRegistrationVersion(nodeId, previousVersions, input.nowMs)
		};
		const row = apnsRegistrationToRow(next);
		const { node_id: _nodeId, ...updates } = row;
		executeSqliteQuerySync(db, stateDb.insertInto("apns_registrations").values(row).onConflict((conflict) => conflict.column("node_id").doUpdateSet(updates)));
		executeSqliteQuerySync(db, stateDb.deleteFrom("apns_registration_tombstones").where("node_id", "=", nodeId));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return {
			status: "registered",
			registration: next
		};
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	});
}
const apnsOperations = {
	"apns.registration.register": (input, { open }) => registerApnsRegistrationInDatabase(open(), input),
	"apns.registration.clearIfCurrent": (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			const { nodeId, registration, nowMs } = input;
			const current = readApnsRegistrationFromDatabase(db, nodeId);
			return Boolean(current && apnsRegistrationsEqual(current, registration) && clearApnsRegistrationFromDatabase(db, nodeId, nowMs));
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		});
	},
	"apns.registration.read": (input, { open }) => readApnsRegistrationFromDatabase(open().db, input),
	"apns.registrations.read": (input, { open }) => readApnsRegistrationsFromDatabase(open().db, input)
};
//#endregion
export { apnsOperations };
