import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as ownsCronSource, n as cronSourceIdentity, s as setCronSourceIdentity } from "./source-schedule-49zenZxx.mjs";
import { r as resolveFailureAlert } from "./failure-alerts-Cgi3Ds94.mjs";
import { t as applyJobResult } from "./timer-outcomes-CW21cqxl.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-Wco-UUgE.mjs";
//#region src/cron/store/external-state.worker.ts
function mutateCronExternalStateInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		return { outcome: mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds: /* @__PURE__ */ new Set([input.jobId]),
			mutate({ jobs }) {
				const job = jobs.get(input.jobId);
				const policy = input.snapshot;
				const outcome = {
					nowMs: policy.nowMs,
					notifications: [],
					logs: []
				};
				if (!job) return { value: outcome };
				const { change } = input;
				if (change.kind !== "counters" && change.source && !ownsCronSource(job, change.source.scheduleKey, change.source.identity)) return { value: outcome };
				switch (change.kind) {
					case "state":
					case "failure": {
						const sourceIdentity = cronSourceIdentity(job);
						Object.assign(job.state, change.statePatch);
						setCronSourceIdentity(job, sourceIdentity);
						if (change.kind === "failure") {
							const { nowMs, cronConfig } = policy;
							const state = {
								deps: {
									nowMs: () => nowMs,
									cronConfig,
									log: createCronMutationLogger(outcome.logs)
								},
								preparedFailureAlert: {
									jobId: input.jobId,
									value: resolveFailureAlert({ deps: { cronConfig } }, job)
								}
							};
							job.state.consecutiveErrors = Math.max(job.state.consecutiveErrors ?? 0, 4);
							applyJobResult(state, job, {
								status: "error",
								error: change.error,
								executionStarted: false,
								startedAt: nowMs,
								endedAt: nowMs
							}, { deferredNotifications: outcome.notifications });
							job.state.nextRunAtMs = void 0;
						}
						break;
					}
					case "retire":
						setCronSourceIdentity(job, change.nextIdentity);
						break;
					case "counters":
						if (job.schedule.kind !== "stream") return { value: outcome };
						job.state.streamDroppedBatches = Math.max(job.state.streamDroppedBatches ?? 0, change.counters.streamDroppedBatches ?? 0);
						job.state.streamCoalescedBatches = Math.max(job.state.streamCoalescedBatches ?? 0, change.counters.streamCoalescedBatches ?? 0);
				}
				outcome.job = job;
				return {
					upsertJobIds: [job.id],
					value: outcome
				};
			}
		}).value };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: {
		state: "cron.external-state",
		retire: "cron.retire-stream-source",
		counters: "cron.external-counters",
		failure: "cron.external-failure"
	}[input.change.kind] });
}
//#endregion
export { mutateCronExternalStateInWorker };
