import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as recordHookInstall, r as restoreHookInstallIfCurrent } from "./installs-BiGZLUOT.mjs";
//#region src/hooks/install-record-transaction.ts
/** Retain hook record and payload compensation until their config owner commits. */
async function stageHookInstall(params) {
	const { lease, payloadTransaction } = params;
	const storeOptions = { path: lease.databasePath };
	let receipt;
	try {
		receipt = runOpenClawStateWriteTransaction((database) => {
			lease.assertOwnedInTransaction(database.db);
			params.beforePersistentApply?.();
			return recordHookInstall(params.update, { database });
		}, storeOptions);
	} catch (error) {
		if (payloadTransaction) try {
			lease.assertOwned();
			await payloadTransaction.rollback();
		} catch (rollbackError) {
			throw new AggregateError([error, rollbackError], "Hook install payload rollback failed", { cause: rollbackError });
		}
		throw error;
	}
	let settled = false;
	return {
		async commit() {
			if (settled) return;
			settled = true;
			try {
				lease.assertOwned();
				await payloadTransaction?.commit();
			} catch (error) {
				throw new Error("Hook install committed, but payload backup cleanup failed", { cause: error });
			}
		},
		async rollback() {
			if (settled) return;
			settled = true;
			if (!runOpenClawStateWriteTransaction((database) => {
				lease.assertOwnedInTransaction(database.db);
				return restoreHookInstallIfCurrent(receipt, { database });
			}, storeOptions)) throw new Error("Hook install changed before rollback; newer record and payload retained");
			lease.assertOwned();
			await payloadTransaction?.rollback();
		}
	};
}
//#endregion
export { stageHookInstall as t };
