import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { h as updateCronRuntimeRow, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-kOMa-5fA.mjs";
import { n as planCronRunHistoryMaintenance, r as readCronRunRecordsInDatabase, t as applyCronRunHistoryMaintenanceInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-u-R2z7LI.mjs";
import { h as recomputeSingleJobForMaintenance } from "./jobs-scheduling-sefIqbJ3.mjs";
import { t as readActiveCronRunReceiptsInDatabase } from "./run-receipt-read-DF1n0U0f.mjs";
import { o as listActiveCronRunReceiptJobIdsInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-Wco-UUgE.mjs";
//#region src/cron/store/runtime-maintenance.worker.ts
function maintainCronRunHistoryInWorker(database, input) {
	const records = readCronRunRecordsInDatabase(database.db, void 0, void 0, { planningOnly: true });
	const jobIds = [...new Set(records.flatMap((row) => (row.status === "queued" || row.status === "running" || row.status === "lost" && row.error?.trim().toLowerCase().includes("backing session missing")) && row.jobId?.trim() ? [row.jobId.trim()] : []))];
	const receipts = jobIds.length > 0 && tableExists(database.db, "cron_run_receipts") ? readActiveCronRunReceiptsInDatabase(database.db, void 0, jobIds) : [];
	const { nowMs, protectedJobIds } = input.snapshot;
	const protectedJobs = /* @__PURE__ */ new Set([...protectedJobIds, ...receipts.map((receipt) => receipt.jobId)]);
	const plan = planCronRunHistoryMaintenance(withReconciliationPayloads(database.db, records, nowMs, protectedJobs), nowMs, protectedJobs);
	if (plan.reconciliations.length === 0 && !plan.prune) return { outcome: {
		reconciled: 0,
		pruned: 0,
		nextSweepAtMs: plan.nextSweepAtMs
	} };
	return runOpenClawStateWriteTransaction(({ db }) => ({ outcome: {
		...applyCronRunHistoryMaintenanceInDatabase(db, plan, nowMs, prepareCronRunReceiptWriteSchema(db)),
		nextSweepAtMs: plan.nextSweepAtMs
	} }), {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.history-maintenance" });
}
/**
* Reconciliation copies the reconciled row's own payload, or that of its recovery candidate, which
* shares the row's exact job and run identity. Load full payloads for exactly those rows, by task
* id, and replan on them; every other row keeps its planning projection.
*/
function withReconciliationPayloads(db, records, nowMs, protectedJobs) {
	const draft = planCronRunHistoryMaintenance(records, nowMs, protectedJobs);
	if (draft.reconciliations.length === 0) return records;
	const runKey = (row) => JSON.stringify([row.jobId, row.runId]);
	const reconciledRuns = new Set(draft.reconciliations.flatMap((row) => row.jobId?.trim() && row.runId?.trim() ? [runKey(row)] : []));
	const reconciledIds = new Set(draft.reconciliations.map((row) => row.id));
	const taskIds = records.flatMap((row) => reconciledIds.has(row.id) || reconciledRuns.has(runKey(row)) ? [row.id] : []);
	const payloads = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < taskIds.length; offset += 500) for (const row of readCronRunRecordsInDatabase(db, void 0, void 0, { taskIds: taskIds.slice(offset, offset + 500) })) payloads.set(row.id, row);
	return records.map((row) => {
		const full = payloads.get(row.id);
		return full === void 0 ? row : {
			...row,
			summary: full.summary,
			detail: full.detail
		};
	});
}
function scheduleUnownedCronJobsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const rows = loadCronRows(db, input.storeKey);
		const decoded = loadedCronStoreFromRows(rows).store.jobs;
		const activeJobIds = listActiveCronRunReceiptJobIdsInDatabase(db, input.storeKey);
		const jobsById = new Map(decoded.map((job) => [job.id, job]));
		const policy = input.snapshot;
		const outcome = {
			changed: false,
			jobs: [],
			notifications: [],
			logs: []
		};
		const state = { deps: {
			nowMs: () => policy.nowMs,
			log: createCronMutationLogger(outcome.logs)
		} };
		for (const row of rows) {
			const job = jobsById.get(row.job_id);
			if (!job || activeJobIds.has(row.job_id) || input.options?.preserveExpiredPacedNextRunJobId === row.job_id && !job.enabled) continue;
			const previousEnabled = job.enabled ?? true;
			if (recomputeSingleJobForMaintenance(state, job, {
				...input.options,
				nowMs: policy.nowMs,
				deferredNotifications: outcome.notifications
			}, {
				reservations: /* @__PURE__ */ new Map(),
				isJobActive: () => false
			})) {
				updateCronRuntimeRow(db, input.storeKey, job, previousEnabled);
				outcome.jobs.push(job);
				outcome.changed = true;
			}
		}
		return { outcome };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.schedule-unowned" });
}
function recordCronFailureAlertOutcomeInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const row = loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([input.jobId]))[0];
		const job = row ? loadedCronStoreFromRows([row]).store.jobs[0] : void 0;
		const jobs = job ? [job] : [];
		const { repairJobIds } = loadCronRuntimeAuthorities({
			db,
			storeKey: input.storeKey,
			jobs
		});
		if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
			db,
			storeKey: input.storeKey,
			jobs,
			jobIds: repairJobIds
		});
		const ownsCycle = job !== void 0 && job.state.lastRunAtMs === input.runAtMs && job.state.lastFailureAlertAtMs === input.alertAtMs && job.state.lastFailureNotificationId === input.notificationId && job.state.lastFailureNotificationDeliveryStatus === "unknown";
		if (job && row && ownsCycle) {
			job.state.lastFailureNotificationDelivered = input.outcome.delivered;
			job.state.lastFailureNotificationDeliveryStatus = input.outcome.status;
			job.state.lastFailureNotificationDeliveryError = input.outcome.error;
			updateCronRuntimeRow(db, input.storeKey, job);
		}
		return { outcome: { job: ownsCycle ? job : void 0 } };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.failure-alert-outcome" });
}
function recordCronFailureRepairSettlementInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		return { outcome: mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds: /* @__PURE__ */ new Set([input.jobId]),
			mutate({ jobs }) {
				const job = jobs.get(input.jobId);
				const repair = job?.state.failureAlertIncident?.repair;
				if (!job || !repair || repair.alerted || repair.atMs !== input.repairAtMs || job.state.lastFailureNotificationId !== input.repairId) return { value: {} };
				repair.settledAtMs = input.settledAtMs;
				return {
					upsertJobIds: [job.id],
					value: { job }
				};
			}
		}).value };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.failure-repair-settlement" });
}
//#endregion
export { scheduleUnownedCronJobsInWorker as i, recordCronFailureAlertOutcomeInWorker as n, recordCronFailureRepairSettlementInWorker as r, maintainCronRunHistoryInWorker as t };
