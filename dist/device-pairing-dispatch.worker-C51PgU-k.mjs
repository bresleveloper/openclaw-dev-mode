import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { A as withDevicePairingStoreDatabase, I as withDevicePairingMutationAdmission, O as readPairedDevicePairingSnapshotFromDatabase, l as resolveNodePairingState } from "./device-pairing-identity-BRtdqCdi.mjs";
//#region src/infra/device-pairing-binding.ts
function prepareDevicePairingBinding(deviceId, device) {
	const state = resolveNodePairingState(device);
	return {
		deviceId,
		binding: state ? {
			identity: state.identity.key,
			...state.generation ? { generation: state.generation.key } : {}
		} : null
	};
}
//#endregion
//#region src/infra/device-pairing-dispatch.worker.ts
function devicePairingMutation(operation, { publishPairing = true } = {}) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(() => withDevicePairingMutationAdmission(() => {
			const snapshot = publishPairing ? readPairedDevicePairingSnapshotFromDatabase(database.db) : void 0;
			const before = snapshot?.pairedByDeviceId;
			const after = before ? structuredClone(before) : void 0;
			const revision = { value: snapshot?.revision ?? "0" };
			return withDevicePairingStoreDatabase(database, () => {
				let tokensReplaced;
				let workerEnvironment;
				let nodeApproval;
				const result = operation(input, {
					database,
					recordTokenReplacement: (facts) => {
						tokensReplaced = facts;
					},
					recordWorkerEnvironment: (facts) => {
						workerEnvironment = facts;
					},
					recordNodeApproval: (facts) => {
						nodeApproval = facts;
					}
				});
				if (!before || !after) return result;
				const changed = [];
				for (const deviceId of /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])) if (JSON.stringify(before[deviceId]) !== JSON.stringify(after[deviceId])) changed.push(prepareDevicePairingBinding(deviceId, after[deviceId] ?? null));
				deferSqliteWorkerCommitReceipt(database.db, {
					kind: "devicePairing",
					beforeRevision: snapshot.revision,
					revision: revision.value,
					changed,
					...tokensReplaced ? { tokensReplaced } : {},
					...workerEnvironment ? { workerEnvironment } : {},
					...nodeApproval ? { nodeApproval } : {}
				});
				return result;
			}, after, revision);
		}), {
			database,
			env: getSqliteWorkerStateContext().environment
		});
	};
}
//#endregion
export { devicePairingMutation as t };
