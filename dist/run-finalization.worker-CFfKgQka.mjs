import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as recordCronRunInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { h as recomputeSingleJobForMaintenance } from "./jobs-scheduling-sefIqbJ3.mjs";
import { a as finishCronRunReceiptInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { n as cronRunResultHistory } from "./run-result-CSMGrLLI.mjs";
import { n as applyOutcomeToAuthoritativeJob } from "./timer-outcomes-CW21cqxl.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-Wco-UUgE.mjs";
import { t as isCronRunTriggerStateRetiredInDatabase } from "./run-receipt-trigger-state-EpH_d8bo.mjs";
import { n as settleCronStartupBatchInWorker } from "./scheduler-actor.worker-B5V8JsjW.mjs";
//#region src/cron/store/run-finalization.worker.ts
/** Execution, primary delivery, job state, and history finish in one worker transaction. */
function finalizeCronRunsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const policy = input.snapshot;
		const committed = mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds: new Set(policy.outcomes.map((completed) => completed.jobId)),
			mutate({ jobs, receiptSchema }) {
				const outcome = {
					changed: false,
					upsertedJobs: [],
					removedJobs: [],
					eventPlans: [],
					notifications: [],
					logs: []
				};
				const state = { deps: {
					nowMs: () => policy.nowMs,
					cronConfig: policy.cronConfig,
					failureRepairTimeoutMs: policy.failureRepairTimeoutMs,
					log: createCronMutationLogger(outcome.logs)
				} };
				for (const [outcomeIndex, completed] of policy.outcomes.entries()) {
					const receipt = completed.runReceipt;
					const storedJob = jobs.get(completed.jobId);
					const pendingReceiptId = storedJob?.state.runningAtMs === void 0 ? void 0 : storedJob.state.runningReceiptId;
					const triggerStateRetired = receipt && isCronRunTriggerStateRetiredInDatabase({
						database: db,
						handle: receipt
					});
					if (receipt && !finishCronRunReceiptInDatabase({
						database: db,
						receiptSchema,
						handle: receipt,
						pendingReceiptId,
						status: completed.status === "ok" && completed.triggerEval?.fired === false ? "skipped" : completed.status,
						finishedAtMs: completed.endedAt,
						error: completed.error
					})) continue;
					const currentJob = completed.activeJobMarker?.jobRemoved ? void 0 : storedJob;
					const ownsRunningMarker = !receipt || !currentJob?.state.runningReceiptId || currentJob.state.runningReceiptId === receipt.receiptId;
					const job = currentJob && ownsRunningMarker ? currentJob : structuredClone(completed.job);
					const shouldDelete = applyOutcomeToAuthoritativeJob(state, job, completed, {
						request: completed.request,
						deferredNotifications: currentJob && ownsRunningMarker ? outcome.notifications : [],
						triggerStateRetired
					});
					if (currentJob && ownsRunningMarker) {
						if (shouldDelete) outcome.removedJobs.push(job);
						else {
							if (!(completed.request?.preserveCadence && !job.enabled)) recomputeSingleJobForMaintenance(state, job, {
								nowMs: policy.nowMs,
								recomputeExpired: Boolean(completed.request),
								...completed.request?.preserveCadence ? { preserveExpiredPacedNextRunJobId: job.id } : {},
								deferredNotifications: outcome.notifications
							}, {
								reservations: /* @__PURE__ */ new Map(),
								isJobActive: () => false
							});
							outcome.upsertedJobs.push(job);
						}
					}
					recordCronRunInDatabase(db, cronRunResultHistory(input.storeKey, job, completed, policy.defaultAgentId));
					outcome.eventPlans.push({
						outcomeIndex,
						job
					});
				}
				outcome.changed = outcome.upsertedJobs.length > 0 || outcome.removedJobs.length > 0;
				return {
					deleteJobIds: outcome.removedJobs.map((job) => job.id),
					upsertJobIds: outcome.upsertedJobs.map((job) => job.id),
					value: outcome
				};
			}
		});
		const settled = settleCronStartupBatchInWorker(database, input.storeKey, policy.nowMs);
		committed.value.upsertedJobs.push(...settled.jobs);
		committed.value.notifications.push(...settled.notifications);
		committed.value.logs.push(...settled.logs);
		committed.value.changed ||= settled.jobs.length > 0;
		return { outcome: committed.value };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-finalization" });
}
//#endregion
export { finalizeCronRunsInWorker };
