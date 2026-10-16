import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { h as updateCronRuntimeRow, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
import { n as readCronRunRecordsInDatabase, r as reconcileCronRunHistoryInDatabase, t as pruneCronRunHistoryInDatabase } from "./run-history.kernel-DBs5pEGz.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
import { T as readActiveCronRunReceiptsInDatabase, v as listActiveCronRunReceiptJobIdsInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
import { _ as recomputeSingleJobForMaintenance } from "./jobs-scheduling-CBskypsm.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome, t as createCronMutationLogger } from "./runtime-mutation.worker-Cxvhz87W.mjs";
//#region src/cron/store/runtime-maintenance.worker.ts
function maintainCronRunHistoryInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const schema = prepareCronRunReceiptWriteSchema(db);
		const records = readCronRunRecordsInDatabase(db);
		const jobIds = [...new Set(records.flatMap((row) => (row.status === "queued" || row.status === "running" || row.status === "lost" && row.error?.trim().toLowerCase().includes("backing session missing")) && row.jobId?.trim() ? [row.jobId.trim()] : []))];
		const receipts = schema.cronRunReceipts ? readActiveCronRunReceiptsInDatabase(db, void 0, jobIds) : [];
		const preparation = prepareCronRuntimeMutation("cron.maintainHistory", input.nonce, {
			jobIds,
			receipts
		});
		const reconciled = reconcileCronRunHistoryInDatabase(db, records, preparation.nowMs, new Set(preparation.protectedJobIds));
		const pruned = pruneCronRunHistoryInDatabase(db, preparation.nowMs, schema, records.filter((row) => !reconciled.has(row.id)));
		return retainCronRuntimeMutationOutcome("cron.maintainHistory", db, input.nonce, {
			reconciled: reconciled.size,
			pruned
		});
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.history-maintenance" });
}
function scheduleUnownedCronJobsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const rows = loadCronRows(db, input.storeKey);
		const decoded = loadedCronStoreFromRows(rows).store.jobs;
		const activeJobIds = listActiveCronRunReceiptJobIdsInDatabase(db, input.storeKey);
		const jobsById = new Map(decoded.map((job) => [job.id, job]));
		const preparation = prepareCronRuntimeMutation("cron.scheduleUnowned", input.nonce, { jobIds: decoded.map((job) => job.id) });
		const reservations = new Map(preparation.ownership.flatMap((owner) => owner.reservation ? [[owner.jobId, owner.reservation]] : []));
		const active = new Set(preparation.ownership.filter((owner) => owner.active).map((owner) => owner.jobId));
		const outcome = {
			changed: false,
			jobs: [],
			notifications: [],
			logs: []
		};
		const state = { deps: {
			nowMs: () => preparation.nowMs,
			log: createCronMutationLogger(outcome.logs)
		} };
		for (const row of rows) {
			const job = jobsById.get(row.job_id);
			if (!job || activeJobIds.has(row.job_id)) continue;
			const previousEnabled = job.enabled ?? true;
			if (recomputeSingleJobForMaintenance(state, job, {
				...input.options,
				nowMs: preparation.nowMs,
				deferredNotifications: outcome.notifications
			}, {
				reservations,
				isJobActive: (jobId) => active.has(jobId)
			})) {
				updateCronRuntimeRow(db, input.storeKey, job, previousEnabled);
				outcome.jobs.push(job);
				outcome.changed = true;
			}
		}
		return retainCronRuntimeMutationOutcome("cron.scheduleUnowned", db, input.nonce, outcome);
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
		prepareCronRuntimeMutation("cron.recordFailureAlertOutcome", input.nonce, { ownsCycle });
		if (job && row && ownsCycle) {
			job.state.lastFailureNotificationDelivered = input.outcome.delivered;
			job.state.lastFailureNotificationDeliveryStatus = input.outcome.status;
			job.state.lastFailureNotificationDeliveryError = input.outcome.error;
			updateCronRuntimeRow(db, input.storeKey, job);
		}
		return retainCronRuntimeMutationOutcome("cron.recordFailureAlertOutcome", db, input.nonce, { job: ownsCycle ? job : void 0 });
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.failure-alert-outcome" });
}
//#endregion
export { maintainCronRunHistoryInWorker, recordCronFailureAlertOutcomeInWorker, scheduleUnownedCronJobsInWorker };
