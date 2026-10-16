import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
//#region src/cron/store/run-receipt-trigger-state.ts
const RETIREMENTS_TABLE = "cron_run_trigger_state_retirements";
function query(database) {
	return getNodeSqliteKysely(database);
}
function stateWriterQuery(database, handle) {
	return query(database).selectFrom("cron_run_receipts").where("cron_run_receipts.receipt_id", "=", handle.receiptId).where("cron_run_receipts.store_key", "=", handle.storeKey).where("cron_run_receipts.job_id", "=", handle.jobId).where("cron_run_receipts.started_at_ms", "=", handle.startedAtMs);
}
function ensureRetirementsTable(database) {
	if (tableExists(database, RETIREMENTS_TABLE)) return;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${RETIREMENTS_TABLE} (`);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start);
	if (start < 0 || end < start) throw new Error("OpenClaw cron run trigger-state retirement schema is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10));
}
/** Retires the exact pending state writer in the acknowledged edit's transaction. */
function retireCronRunTriggerStateInDatabase(params) {
	const { database, handle } = params;
	const receipt = executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).select(["receipt_id", "started_at_ms"]));
	if (!receipt) return;
	const job = loadedCronStoreFromRows(loadCronRows(database, handle.storeKey, /* @__PURE__ */ new Set([handle.jobId]))).store.jobs[0];
	if (job?.state.runningAtMs !== receipt.started_at_ms || job.state.runningReceiptId !== void 0 && job.state.runningReceiptId !== receipt.receipt_id) return;
	ensureRetirementsTable(database);
	executeSqliteQuerySync(database, query(database).insertInto(RETIREMENTS_TABLE).values({ receipt_id: receipt.receipt_id }).onConflict((conflict) => conflict.column("receipt_id").doNothing()));
}
/** Reads retirement after write admission without changing execution authority. */
function isCronRunTriggerStateRetiredInDatabase(params) {
	const { database, handle } = params;
	if (!tableExists(database, RETIREMENTS_TABLE)) return false;
	return executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).innerJoin(RETIREMENTS_TABLE, `${RETIREMENTS_TABLE}.receipt_id`, "cron_run_receipts.receipt_id").select("cron_run_receipts.receipt_id")) !== void 0;
}
//#endregion
export { retireCronRunTriggerStateInDatabase as n, isCronRunTriggerStateRetiredInDatabase as t };
