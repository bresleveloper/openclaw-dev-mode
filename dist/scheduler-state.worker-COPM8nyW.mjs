import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-uYw1RFJQ.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { m as findActiveCronRunReceiptInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
import { s as hasActiveCronRun } from "./jobs-scheduling-CBskypsm.mjs";
import { t as applyJobResult } from "./timer-outcomes-BqDgA2oM.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome, t as createCronMutationLogger } from "./runtime-mutation.worker-Cxvhz87W.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-BTIrsXI5.mjs";
//#region src/cron/store/scheduler-state.worker.ts
function recordSkippedCronRunsInWorker(database, input) {
	const { change } = input;
	const proposals = new Map(change.kind === "ownerless" ? change.proposals.map((proposal) => [proposal.jobId, proposal]) : []);
	const jobIds = change.kind === "ownerless" ? new Set(proposals.keys()) : /* @__PURE__ */ new Set([change.jobId]);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const committed = mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds,
			mutate({ jobs }) {
				const preparation = prepareCronRuntimeMutation("cron.recordSkippedRuns", input.nonce, { jobs: [...jobs.values()].map(({ id, delivery, failureAlert }) => ({
					id,
					delivery,
					failureAlert
				})) });
				const outcome = {
					jobs: [],
					rejected: [],
					nowMs: preparation.nowMs,
					notifications: [],
					logs: []
				};
				const ownership = new Map(preparation.ownership.map((owner) => [owner.jobId, owner]));
				const failureAlerts = new Map(preparation.failureAlerts.map((alert) => [alert.jobId, alert]));
				for (const job of jobs.values()) {
					if (change.kind === "ownerless") {
						const planned = proposals.get(job.id);
						const owner = ownership.get(job.id);
						if (!owner) throw new Error("Cron ownerless skip has no prepared process ownership");
						if (!planned || job.enabled !== planned.enabled || job.state.nextRunAtMs !== planned.nextRunAtMs || job.state.lastRunAtMs !== planned.lastRunAtMs || job.state.lastRunStatus !== planned.lastRunStatus || resolveCronJobConfigRevision(job) !== planned.configRevision || hasActiveCronRun(job, owner.active) || findActiveCronRunReceiptInDatabase({
							database: db,
							storePath: input.storeKey,
							jobId: job.id
						}) || tryResolveCronJobEffectiveAgentId(job, preparation.defaultAgentId)) {
							if (planned) outcome.rejected.push(job);
							continue;
						}
					} else if (resolveCronJobConfigRevision(job) !== change.configRevision) continue;
					const failureAlert = failureAlerts.get(job.id);
					if (!failureAlert) throw new Error("Cron skipped run has no prepared failure-alert policy");
					const state = {
						deps: {
							nowMs: () => preparation.nowMs,
							cronConfig: preparation.cronConfig,
							log: createCronMutationLogger(outcome.logs)
						},
						preparedFailureAlert: {
							jobId: job.id,
							value: failureAlert.value
						}
					};
					applyJobResult(state, job, {
						status: "skipped",
						completionStatus: "failed",
						error: change.kind === "ownerless" ? CRON_AGENT_SELECTION_REQUIRED_MESSAGE : change.error,
						...change.kind === "ownerless" ? { executionStarted: false } : { diagnostics: change.diagnostics },
						startedAt: preparation.nowMs,
						endedAt: preparation.nowMs
					}, {
						deferredNotifications: outcome.notifications,
						scheduleMode: change.scheduleMode,
						...change.kind === "ownerless" ? { scheduleOwnershipAtMs: change.scheduleOwnershipAtMs } : {}
					});
					outcome.jobs.push(job);
				}
				for (const notification of outcome.notifications) notification.routing = preparation.notificationRouting;
				return {
					upsertJobIds: outcome.jobs.map((job) => job.id),
					value: outcome
				};
			}
		});
		return retainCronRuntimeMutationOutcome("cron.recordSkippedRuns", db, input.nonce, committed.value);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: change.kind === "ownerless" ? "cron.unresolved-owner" : "cron.invalid-manual-run" });
}
//#endregion
export { recordSkippedCronRunsInWorker };
