import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { h as readAgentDeletionJournalInDatabase } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
//#region src/cron/store/run-receipt-read.ts
function isReceiptStatus(value) {
	return value === "running" || value === "ok" || value === "error" || value === "skipped" || value === "interrupted" || value === "superseded";
}
function receiptFromRow(row) {
	if (!isReceiptStatus(row.status)) throw new Error(`invalid cron run receipt status ${row.status}`);
	return {
		receiptId: row.receipt_id,
		storeKey: row.store_key,
		jobId: row.job_id,
		configRevision: row.config_revision,
		agentId: row.agent_id,
		...row.request_run_id ? { requestRunId: row.request_run_id } : {},
		status: row.status,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		startedAtMs: row.started_at_ms,
		finishedAtMs: row.finished_at_ms,
		...row.error_text ? { error: row.error_text } : {}
	};
}
function receiptHandle(receipt) {
	return {
		receiptId: receipt.receiptId,
		storeKey: receipt.storeKey,
		jobId: receipt.jobId,
		configRevision: receipt.configRevision,
		agentId: receipt.agentId,
		ownerPid: receipt.ownerPid,
		ownerStartTime: receipt.ownerStartTime,
		startedAtMs: receipt.startedAtMs
	};
}
function matchesCronRunReceiptOwner(current, expected) {
	return current !== void 0 && current.receiptId === expected.receiptId && current.ownerPid === expected.ownerPid && current.ownerStartTime === expected.ownerStartTime;
}
/** Current receipt, definition and deletion facts share one native read snapshot. */
function readCronRunReceiptCurrentFactsInDatabase(database, command) {
	return runSqliteDeferredTransactionSync(database, () => {
		const { handle } = command;
		const deletionBlocked = command.includeAvailability && Boolean(readAgentDeletionJournalInDatabase({ db: database }, handle.agentId, "runtime"));
		let receipt;
		try {
			receipt = readActiveCronRunReceiptsInDatabase(database, handle.storeKey, [handle.jobId])[0];
		} catch (error) {
			if (!(error instanceof Error) || error.message !== "no such table: cron_run_receipts") throw error;
		}
		const job = command.includeJob && matchesCronRunReceiptOwner(receipt, handle) ? loadedCronStoreFromRows(loadCronRows(database, handle.storeKey, /* @__PURE__ */ new Set([handle.jobId]))).store.jobs[0] : void 0;
		return {
			receipt,
			job: job ? {
				agentId: job.agentId,
				sessionKey: job.sessionKey,
				hasCanonicalDeliveryMode: hasCanonicalCronDeliveryMode(job.delivery)
			} : void 0,
			deletionBlocked
		};
	});
}
/** Observe existing receipts without the writable owner's first-use initialization. */
function readActiveCronRunReceiptsInDatabase(database, storeKey, jobIds) {
	let query = getNodeSqliteKysely(database).selectFrom("cron_run_receipts").selectAll().where("status", "=", "running").where("job_id", "in", sqliteStringSet(jobIds));
	if (storeKey !== void 0) query = query.where("store_key", "=", storeKey);
	const rows = executeSqliteQuerySync(database, query).rows;
	const selected = new Set(jobIds);
	return rows.filter((row) => selected.has(row.job_id)).map((row) => receiptHandle(receiptFromRow(row)));
}
//#endregion
export { receiptHandle as i, readCronRunReceiptCurrentFactsInDatabase as n, receiptFromRow as r, readActiveCronRunReceiptsInDatabase as t };
