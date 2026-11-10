import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as isAgentDeletionBlocked } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { r as deleteStaleCronJobFamilyRows } from "./row-codec-Cnnqjh5r.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-u-R2z7LI.mjs";
import { r as ensureExecutionOwnerLifecycleBindingSchema, t as bindExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-ulOGPisZ.mjs";
import { t as CronRunReceiptRevisionError } from "./run-receipt.types-B4cYMMc0.mjs";
import "./run-receipt-store-Bik3uOzB.mjs";
//#region src/cron/store/run-receipt-delivery.ts
/** Record possible delivery for restart diagnostics without deciding effect permissions. */
function markCronDeliveryStartedInDatabase(params) {
	executeSqliteQuerySync(params.database, getNodeSqliteKysely(params.database).updateTable("cron_run_receipts").set({ delivery_attempt_state: "started" }).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running").where("delivery_attempt_state", "!=", "started"));
}
//#endregion
//#region src/cron/store/run-receipt.worker.ts
function bindCronRunReceiptExecutionInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (!executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("cron_run_receipts").select("receipt_id").where("receipt_id", "=", input.receiptId))) return false;
		if (!prepareCronRunReceiptWriteSchema(db).executionOwnerLifecycleBindings) ensureExecutionOwnerLifecycleBindingSchema(db);
		return bindExecutionOwnerLifecycleMetadata({
			db,
			ownerKind: "cron",
			ownerId: input.receiptId,
			binding: input.binding
		}) !== "mismatch";
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-receipt.execution-binding" });
}
function markCronDeliveryStartedInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (input.storeKey !== input.handle.storeKey) throw new CronRunReceiptRevisionError(input.handle.receiptId);
		if (isAgentDeletionBlocked(input.handle.agentId, {}, db)) throw new CronRunReceiptRevisionError(input.handle.receiptId, "cron agent is unavailable", "owner-unavailable");
		markCronDeliveryStartedInDatabase({
			database: db,
			handle: input.handle
		});
		return { outcome: {} };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-receipt.mark-delivery-started" });
}
function removeStaleCronFamilyInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		return { outcome: { removed: deleteStaleCronJobFamilyRows(db, input.storeKey, input.family) } };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.job-family-adoption" });
}
//#endregion
export { bindCronRunReceiptExecutionInWorker, markCronDeliveryStartedInWorker, removeStaleCronFamilyInWorker };
