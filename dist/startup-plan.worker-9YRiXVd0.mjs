import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { m as findActiveCronRunReceiptInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
import { M as resolveCronNotificationQueueOwner, b as resolveJobErrorBackoffUntilMs, h as recomputeJobNextRunAtMs, l as isJobEnabled, s as hasActiveCronRun, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS } from "./jobs-scheduling-CBskypsm.mjs";
import { n as hasMissedCronSlotSinceLastRun, r as isRunnableJob } from "./timer-runnable-BUn4x3Nq.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome, t as createCronMutationLogger } from "./runtime-mutation.worker-Cxvhz87W.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-BTIrsXI5.mjs";
//#region src/cron/store/startup-plan.worker.ts
function planCronStartupInWorker(database, input) {
	const skipped = new Set(input.skipJobIds);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const committed = mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds: new Set(input.jobIds),
			mutate({ jobs }) {
				const preparation = prepareCronRuntimeMutation("cron.planStartup", input.nonce, {
					jobIds: [...jobs.keys()],
					notificationNeedsDefault: [...jobs.values()].some((job) => isJobEnabled(job) && !skipped.has(job.id) && !hasActiveCronRun(job, false) && (job.schedule.kind === "cron" || job.schedule.kind === "every") && !resolveCronNotificationQueueOwner(job, "auto-disabled").agentId)
				});
				const outcome = {
					jobs: [],
					missed: [],
					skippedJobIds: [],
					notifications: [],
					logs: []
				};
				const state = { deps: {
					nowMs: () => preparation.nowMs,
					log: createCronMutationLogger(outcome.logs)
				} };
				const ownership = new Map(preparation.ownership.map((owner) => [owner.jobId, owner]));
				for (const job of jobs.values()) {
					const owner = ownership.get(job.id);
					if (!owner) throw new Error("Cron startup planning has no prepared process ownership");
					if (!isJobEnabled(job) || skipped.has(job.id) || hasActiveCronRun(job, owner.active) || findActiveCronRunReceiptInDatabase({
						database: db,
						storePath: input.storeKey,
						jobId: job.id
					})) continue;
					const backoffUntilMs = job.schedule.kind === "cron" ? resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) : void 0;
					if (backoffUntilMs !== void 0 && preparation.nowMs < backoffUntilMs && hasMissedCronSlotSinceLastRun(job, preparation.nowMs) && job.state.nextRunAtMs !== backoffUntilMs) {
						job.state.nextRunAtMs = backoffUntilMs;
						outcome.jobs.push(job);
						continue;
					}
					if (!isRunnableJob({
						job,
						nowMs: preparation.nowMs,
						skipAtIfAlreadyRan: true,
						allowCronMissedRunByLastRun: true,
						activeInProcess: owner.active
					})) continue;
					if (preparation.skipMissedJobs && (job.schedule.kind === "cron" || job.schedule.kind === "every")) {
						if (recomputeJobNextRunAtMs({
							state,
							job,
							nowMs: preparation.nowMs,
							deferredNotifications: outcome.notifications
						})) outcome.jobs.push(job);
						outcome.skippedJobIds.push(job.id);
					} else outcome.missed.push(job);
				}
				for (const notification of outcome.notifications) notification.routing = preparation.notificationRouting;
				return {
					upsertJobIds: outcome.jobs.map((job) => job.id),
					value: outcome
				};
			}
		});
		return retainCronRuntimeMutationOutcome("cron.planStartup", db, input.nonce, committed.value);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.startup-schedules" });
}
//#endregion
export { planCronStartupInWorker };
