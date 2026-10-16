import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
//#region src/cron/store/run-receipt-write-admission.ts
/** Capture optional storage once at the owning write transaction's admission. */
function prepareCronRunReceiptWriteSchema(db) {
	if (!db.isTransaction) throw new Error("Cron receipt schema admission requires the owning write transaction");
	return {
		executionOwnerLifecycleBindings: tableExists(db, "execution_owner_lifecycle_bindings"),
		cronRunReceipts: tableExists(db, "cron_run_receipts")
	};
}
//#endregion
export { prepareCronRunReceiptWriteSchema as t };
