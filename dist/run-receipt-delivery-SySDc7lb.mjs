import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { o as loadCronRows } from "./row-codec-DgIrj0Uv.mjs";
import { c as assertCronRunReceiptOwnedInDatabase, s as assertCronRunReceiptCurrentInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
//#region src/cron/store/run-receipt-delivery.ts
/** Recovery reads the referenced receipt, including retained terminal receipts, in its write snapshot. */
function readCronDeliveryAttemptStateInDatabase(params) {
	if (!params.receiptId) return "unknown";
	const row = executeSqliteQueryTakeFirstSync(params.database, getNodeSqliteKysely(params.database).selectFrom("cron_run_receipts").select("delivery_attempt_state").where("receipt_id", "=", params.receiptId).where("store_key", "=", params.storeKey).where("job_id", "=", params.jobId).where("started_at_ms", "=", params.startedAtMs));
	return row?.delivery_attempt_state === "not-started" || row?.delivery_attempt_state === "started" ? row.delivery_attempt_state : "unknown";
}
/** An exact live receipt owns the monotonic possible-delivery fact; this is not a success verdict. */
function markCronDeliveryStartedInDatabase(params) {
	if (params.allowMissingJob && loadCronRows(params.database, params.handle.storeKey, /* @__PURE__ */ new Set([params.handle.jobId])).length === 0) assertCronRunReceiptOwnedInDatabase(params);
	else assertCronRunReceiptCurrentInDatabase(params);
	executeSqliteQuerySync(params.database, getNodeSqliteKysely(params.database).updateTable("cron_run_receipts").set({ delivery_attempt_state: "started" }).where("receipt_id", "=", params.handle.receiptId).where("delivery_attempt_state", "!=", "started"));
}
//#endregion
export { readCronDeliveryAttemptStateInDatabase as n, markCronDeliveryStartedInDatabase as t };
