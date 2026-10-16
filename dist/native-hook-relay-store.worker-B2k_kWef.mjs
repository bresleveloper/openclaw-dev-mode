import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { p as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as readNativeHookRelayBridgeSnapshotFromDatabase, i as pruneNativeHookRelayBridgeRecordsInDatabase, n as deleteNativeHookRelayBridgeRecordIfOwnedInDatabase, o as renewOrRestoreNativeHookRelayBridgeRecordInDatabase, r as listNativeHookRelayBridgeSnapshotsInDatabase, s as writeNativeHookRelayBridgeRecordInDatabase } from "./native-hook-relay-store.kernel-BZG-f8eC.mjs";
//#region src/agents/harness/native-hook-relay-store.worker.ts
const nativeHookRelayOperations = {
	"nativeHookRelay.read": (input, { stateOptions }) => withOpenClawStateDatabaseReadOnly((database) => readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: input.relayId
	})?.record, stateOptions()),
	"nativeHookRelay.listSnapshots": (_input, { open }) => listNativeHookRelayBridgeSnapshotsInDatabase(open()),
	"nativeHookRelay.write": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		return writeNativeHookRelayBridgeRecordInDatabase(database, input);
	}, {
		database: open(),
		...stateOptions()
	}),
	"nativeHookRelay.renew": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		return renewOrRestoreNativeHookRelayBridgeRecordInDatabase(database, input);
	}, {
		database: open(),
		...stateOptions()
	}),
	"nativeHookRelay.deleteOwned": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => deleteNativeHookRelayBridgeRecordIfOwnedInDatabase(database, input), {
		database: open(),
		...stateOptions()
	}),
	"nativeHookRelay.prune": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => pruneNativeHookRelayBridgeRecordsInDatabase(database, input.candidates, input.nowMs), {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { nativeHookRelayOperations };
