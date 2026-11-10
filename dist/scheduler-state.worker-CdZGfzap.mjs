import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-C6uS-TyD.mjs";
import { a as recordSkippedCronRequestInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { s as hasActiveCronRun } from "./jobs-scheduling-sefIqbJ3.mjs";
import { i as findActiveCronRunReceiptInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { r as resolveFailureAlert } from "./failure-alerts-Cgi3Ds94.mjs";
import { t as applyJobResult } from "./timer-outcomes-CW21cqxl.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-Wco-UUgE.mjs";
//#region src/cron/store/scheduler-state.worker.ts
function recordSkippedCronRunsInWorker(database, input, options) {
	const { change } = input;
	const proposals = new Map(change.kind === "ownerless" ? change.proposals.map((proposal) => [proposal.jobId, proposal]) : []);
	const jobIds = change.kind === "ownerless" ? new Set(proposals.keys()) : /* @__PURE__ */ new Set([change.jobId]);
	return runOpenClawStateWriteTransaction(({ db }) => {
		return { outcome: mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds,
			mutate({ jobs }) {
				const policy = input.snapshot;
				const outcome = {
					jobs: [],
					rejected: [],
					nowMs: policy.nowMs,
					notifications: [],
					logs: []
				};
				const ownership = new Map(policy.ownership.map((owner) => [owner.jobId, owner]));
				for (const job of jobs.values()) {
					if (change.kind === "ownerless") {
						const planned = proposals.get(job.id);
						const owner = ownership.get(job.id);
						if (!planned || job.enabled !== planned.enabled || job.state.nextRunAtMs !== planned.nextRunAtMs || job.state.lastRunAtMs !== planned.lastRunAtMs || job.state.lastRunStatus !== planned.lastRunStatus || resolveCronJobConfigRevision(job) !== planned.configRevision || hasActiveCronRun(job, owner?.active ?? false) || findActiveCronRunReceiptInDatabase({
							database: db,
							storePath: input.storeKey,
							jobId: job.id
						}) || tryResolveCronJobEffectiveAgentId(job, policy.defaultAgentId)) {
							if (planned) outcome.rejected.push(job);
							continue;
						}
					} else if (resolveCronJobConfigRevision(job) !== change.configRevision) continue;
					const state = {
						deps: {
							nowMs: () => policy.nowMs,
							cronConfig: policy.cronConfig,
							failureRepairTimeoutMs: policy.failureRepairTimeoutMs,
							log: createCronMutationLogger(outcome.logs)
						},
						preparedFailureAlert: {
							jobId: job.id,
							value: resolveFailureAlert({ deps: { cronConfig: policy.cronConfig } }, job)
						}
					};
					applyJobResult(state, job, {
						status: "skipped",
						completionStatus: "failed",
						error: change.kind === "ownerless" ? CRON_AGENT_SELECTION_REQUIRED_MESSAGE : change.error,
						...change.kind === "ownerless" ? { executionStarted: false } : { diagnostics: change.diagnostics },
						startedAt: policy.nowMs,
						endedAt: policy.nowMs
					}, {
						deferredNotifications: outcome.notifications,
						scheduleMode: change.scheduleMode,
						...change.kind === "ownerless" ? { scheduleOwnershipAtMs: change.scheduleOwnershipAtMs } : {}
					});
					outcome.jobs.push(job);
					if (options?.recordHistory) recordSkippedCronRequestInDatabase(db, {
						storeKey: input.storeKey,
						jobId: job.id,
						startedAt: policy.nowMs,
						endedAt: policy.nowMs,
						error: change.kind === "ownerless" ? CRON_AGENT_SELECTION_REQUIRED_MESSAGE : change.error,
						nextRunAtMs: job.state.nextRunAtMs
					});
				}
				for (const notification of outcome.notifications) notification.routing = policy.notificationRouting;
				return {
					upsertJobIds: outcome.jobs.map((job) => job.id),
					value: outcome
				};
			}
		}).value };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: change.kind === "ownerless" ? "cron.unresolved-owner" : "cron.invalid-manual-run" });
}
//#endregion
export { recordSkippedCronRunsInWorker as t };
