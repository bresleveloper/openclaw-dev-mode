import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { E as withDevicePairingStoreDatabase, M as withDevicePairingMutationAdmission, k as resolveDevicePairingStoreRevision, w as readPairedDevicePairingRecordsFromDatabase } from "./device-pairing-identity-f0QUXRJo.mjs";
import { t as prepareDevicePairingBinding } from "./device-pairing-binding-CABhM8EO.mjs";
//#region src/infra/device-pairing-dispatch.worker.ts
function devicePairingMutation(operation) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(() => withDevicePairingStoreDatabase(database, () => withDevicePairingMutationAdmission(() => {
			const before = readPairedDevicePairingRecordsFromDatabase(database.db);
			let tokensReplaced;
			let workerEnvironment;
			const result = operation(input, {
				database,
				recordTokenReplacement: (facts) => {
					tokensReplaced = facts;
				},
				recordWorkerEnvironment: (facts) => {
					workerEnvironment = facts;
				}
			});
			const after = readPairedDevicePairingRecordsFromDatabase(database.db);
			const changed = [];
			for (const deviceId of /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])) if (JSON.stringify(before[deviceId]) !== JSON.stringify(after[deviceId])) changed.push(prepareDevicePairingBinding(deviceId, after[deviceId] ?? null));
			deferSqliteWorkerCommitReceipt(database.db, {
				kind: "devicePairing",
				beforeRevision: resolveDevicePairingStoreRevision(before),
				revision: resolveDevicePairingStoreRevision(after),
				changed,
				...tokensReplaced ? { tokensReplaced } : {},
				...workerEnvironment ? { workerEnvironment } : {}
			});
			return result;
		})), {
			database,
			env: getSqliteWorkerStateContext().environment
		});
	};
}
//#endregion
export { devicePairingMutation as t };
