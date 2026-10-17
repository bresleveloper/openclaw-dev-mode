import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { l as ownsStreamSource } from "./normalize-Lu86QQtC.mjs";
import { t as applyJobResult } from "./timer-outcomes-dVyXb9lb.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome, t as createCronMutationLogger } from "./runtime-mutation.worker-Cxvhz87W.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-BTIrsXI5.mjs";
//#region src/cron/store/external-state.worker.ts
function mutateCronExternalStateInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const committed = mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds: /* @__PURE__ */ new Set([input.jobId]),
			mutate({ jobs }) {
				const job = jobs.get(input.jobId);
				const preparation = prepareCronRuntimeMutation("cron.mutateExternalState", input.nonce, {
					id: input.jobId,
					delivery: job?.delivery,
					failureAlert: job?.failureAlert
				});
				const outcome = {
					nowMs: preparation.nowMs,
					notifications: [],
					logs: []
				};
				if (!job) return { value: outcome };
				const { change } = input;
				if (change.kind !== "counters" && change.source && !ownsStreamSource(job, change.source.scheduleKey, change.source.identity)) return { value: outcome };
				switch (change.kind) {
					case "state":
					case "failure": {
						const sourceIdentity = job.state.streamSourceIdentity;
						Object.assign(job.state, change.statePatch);
						job.state.streamSourceIdentity = sourceIdentity;
						if (change.kind === "failure") {
							const { nowMs, cronConfig, failureAlert } = preparation;
							const state = {
								deps: {
									nowMs: () => nowMs,
									cronConfig,
									log: createCronMutationLogger(outcome.logs)
								},
								preparedFailureAlert: {
									jobId: input.jobId,
									value: failureAlert
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
						job.state.streamSourceIdentity = change.nextIdentity;
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
		});
		return retainCronRuntimeMutationOutcome("cron.mutateExternalState", db, input.nonce, committed.value);
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
