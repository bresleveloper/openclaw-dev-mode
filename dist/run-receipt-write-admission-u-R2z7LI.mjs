import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
//#region src/cron/store/run-receipt-write-admission.ts
/** Reuse admitted schema facts for the owning write transaction. */
function prepareCronRunReceiptWriteSchema(db) {
	if (!db.isTransaction) throw new Error("Cron receipt schema admission requires the owning write transaction");
	return {
		executionOwnerLifecycleBindings: tableExists(db, "execution_owner_lifecycle_bindings"),
		cronRunReceipts: tableExists(db, "cron_run_receipts")
	};
}
//#endregion
export { prepareCronRunReceiptWriteSchema as t };
