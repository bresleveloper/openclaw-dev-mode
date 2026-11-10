import { B as compareCronRunRecordsNewestFirst, G as cronRunRecordToScriptRunResult, K as cronRunRecordToTriggerEval, U as cronRunRecordStoreKey, W as cronRunRecordToRunLogEntry } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { r as readCronRunRecordsInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
//#region src/cron/service/run-history-recovery.ts
function receiptIdFromCronRunId(taskRunId, jobId, startedAt) {
	const prefix = `${createCronExecutionId(jobId, startedAt)}:`;
	if (!taskRunId?.startsWith(prefix)) return;
	return taskRunId.slice(prefix.length).split(":", 1)[0] || void 0;
}
function findLatestCronRunForRecovery(records, jobId, startedAt, storeKey, receiptId) {
	const executionRunId = createCronExecutionId(jobId, startedAt);
	const prefix = `${executionRunId}:`;
	const receiptRunId = receiptId ? `${prefix}${receiptId}` : void 0;
	return records.filter((record) => {
		if (record.jobId !== jobId) return false;
		const taskStoreKey = cronRunRecordStoreKey(record);
		if (receiptRunId) return taskStoreKey === storeKey && (record.runId === receiptRunId || record.runId?.startsWith(`${receiptRunId}:`));
		if (taskStoreKey === void 0) return record.runId === executionRunId;
		return taskStoreKey === storeKey && (record.runId === executionRunId || record.runId?.startsWith(prefix));
	}).toSorted((left, right) => Number(left.endedAt !== void 0) - Number(right.endedAt !== void 0) || compareCronRunRecordsNewestFirst(left, right))[0];
}
function finalizedCronRun(record, jobId) {
	if (!record || record.jobId !== jobId || record.endedAt === void 0) return;
	const triggerEval = cronRunRecordToTriggerEval(record);
	const entry = cronRunRecordToRunLogEntry(record) ?? (record.status === "succeeded" && triggerEval?.fired === false ? {
		ts: record.endedAt,
		jobId,
		action: "finished",
		status: "ok",
		...record.startedAt === void 0 ? {} : {
			runAtMs: record.startedAt,
			durationMs: Math.max(0, record.endedAt - record.startedAt)
		}
	} : void 0);
	if (!entry?.status) return;
	const scriptResult = cronRunRecordToScriptRunResult(record);
	return {
		entry: {
			...entry,
			status: entry.status
		},
		...scriptResult ? { scriptResult } : {},
		...triggerEval ? { triggerEval } : {}
	};
}
/** Re-reads record recovery facts on the caller's exact SQLite transaction. */
function findCronRunRecoveryInDatabase(params) {
	const candidate = findLatestCronRunForRecovery(readCronRunRecordsInDatabase(params.database, params.jobId, void 0, { planningOnly: true }), params.jobId, params.startedAt, params.storeKey, params.receiptId);
	const record = candidate ? readCronRunRecordsInDatabase(params.database, params.jobId, void 0, { taskIds: [candidate.id] })[0] : void 0;
	const finalized = finalizedCronRun(record, params.jobId);
	const runId = record?.runId ?? (params.receiptId ? `${createCronExecutionId(params.jobId, params.startedAt)}:${params.receiptId}` : void 0);
	const receiptId = receiptIdFromCronRunId(runId, params.jobId, params.startedAt);
	return {
		...runId ? { taskRunId: runId } : {},
		...receiptId ? { receiptId } : {},
		...finalized ? { finalized } : {}
	};
}
//#endregion
export { findCronRunRecoveryInDatabase as t };
