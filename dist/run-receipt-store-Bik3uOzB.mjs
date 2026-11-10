import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { n as deleteExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-ulOGPisZ.mjs";
import { i as receiptHandle, r as receiptFromRow } from "./run-receipt-read-DF1n0U0f.mjs";
import { toUSVString } from "node:util";
//#region src/cron/store/run-receipt-store.ts
const CRON_RUN_RECEIPT_TERMINAL_RETENTION = 64;
const CRON_RUN_RECEIPT_DELETE_BATCH_SIZE = 500;
const ensureCronRunReceiptSchema = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("cron_run_receipts", {
	endMarker: "ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);",
	errorMessage: "OpenClaw cron run receipt schema marker is missing."
}), {
	tables: ["cron_run_receipts"],
	indexes: ["idx_cron_run_receipts_active_job", "idx_cron_run_receipts_job_history"]
});
function query(database) {
	return getNodeSqliteKysely(database);
}
function activeRow(db, key, jobId) {
	const find = () => {
		const active = query(db).selectFrom("cron_run_receipts").where("store_key", "=", key).where("status", "=", "running");
		return jobId === void 0 ? executeSqliteQuerySync(db, active.select("job_id")).rows : executeSqliteQueryTakeFirstSync(db, active.selectAll().where("job_id", "=", jobId));
	};
	try {
		return find();
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "no such table: cron_run_receipts") throw error;
		ensureCronRunReceiptSchema(db);
		return find();
	}
}
function pruneTerminalReceipts(database, storeKey, jobId, pendingReceiptId, receiptSchema) {
	let terminalQuery = query(database).selectFrom("cron_run_receipts").select("receipt_id").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running");
	if (typeof pendingReceiptId === "string" && toUSVString(pendingReceiptId) === pendingReceiptId) terminalQuery = terminalQuery.orderBy((eb) => eb.case().when("receipt_id", "=", pendingReceiptId).then(1).else(0).end(), "desc");
	const terminalIds = executeSqliteQuerySync(database, terminalQuery.orderBy("finished_at_ms", "desc").orderBy("started_at_ms", "desc").orderBy("receipt_id", "desc").limit(Number.MAX_SAFE_INTEGER).offset(CRON_RUN_RECEIPT_TERMINAL_RETENTION)).rows;
	for (let index = 0; index < terminalIds.length; index += CRON_RUN_RECEIPT_DELETE_BATCH_SIZE) {
		const receiptIds = terminalIds.slice(index, index + CRON_RUN_RECEIPT_DELETE_BATCH_SIZE).map((row) => row.receipt_id);
		deleteExecutionOwnerLifecycleMetadata({
			db: database,
			ownerKind: "cron",
			ownerIds: receiptIds,
			executionOwnerLifecycleBindings: receiptSchema.executionOwnerLifecycleBindings
		});
		executeSqliteQuerySync(database, query(database).deleteFrom("cron_run_receipts").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running").where("receipt_id", "in", receiptIds));
	}
}
/** The receipt key and active-job unique index arbitrate claims in one write. */
function claimCronRunReceiptInDatabase(params) {
	const { handle } = params;
	return executeSqliteQueryTakeFirstSync(params.database, query(params.database).insertInto("cron_run_receipts").values((eb) => ({
		cursor_id: eb.selectFrom("cron_run_receipts").select((inner) => inner(inner.fn.coalesce(inner.fn.max("cursor_id"), inner.val(0)), "+", 1).as("cursor_id")),
		receipt_id: handle.receiptId,
		store_key: handle.storeKey,
		job_id: handle.jobId,
		config_revision: handle.configRevision,
		agent_id: handle.agentId,
		request_run_id: params.requestRunId ?? null,
		delivery_attempt_state: "not-started",
		status: "running",
		owner_pid: handle.ownerPid,
		owner_start_time: handle.ownerStartTime,
		started_at_ms: handle.startedAtMs,
		finished_at_ms: null,
		error_text: null
	})).onConflict((conflict) => conflict.doNothing()).returning("receipt_id")) ? handle : void 0;
}
function findActiveCronRunReceiptInDatabase(params) {
	const row = activeRow(params.database, cronStoreKey(params.storePath), params.jobId);
	return row ? receiptHandle(receiptFromRow(row)) : void 0;
}
function listActiveCronRunReceiptJobIdsInDatabase(database, storePath) {
	return new Set(activeRow(database, cronStoreKey(storePath)).map((row) => row.job_id));
}
/** Advances a queued request to its execution start inside the marker transaction. */
function activateCronRunReceiptInDatabase(params) {
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
		config_revision: params.handle.configRevision,
		agent_id: params.handle.agentId,
		owner_pid: params.handle.ownerPid,
		owner_start_time: params.handle.ownerStartTime,
		started_at_ms: params.startedAtMs
	}).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running"));
	return {
		...params.handle,
		startedAtMs: params.startedAtMs
	};
}
/** Completes the exact active receipt inside its caller's cron-state transaction. */
function finishCronRunReceiptInDatabase(params) {
	if (!executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
		status: params.status,
		finished_at_ms: params.finishedAtMs,
		error_text: params.error ?? null
	}).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running")).numAffectedRows) return false;
	pruneTerminalReceipts(params.database, params.handle.storeKey, params.handle.jobId, params.pendingReceiptId, params.receiptSchema);
	return true;
}
//#endregion
export { finishCronRunReceiptInDatabase as a, findActiveCronRunReceiptInDatabase as i, claimCronRunReceiptInDatabase as n, listActiveCronRunReceiptJobIdsInDatabase as o, ensureCronRunReceiptSchema as r, activateCronRunReceiptInDatabase as t };
