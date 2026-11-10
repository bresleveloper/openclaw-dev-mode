import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { h as updateCronRuntimeRow, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { c as hasScheduledNextRunAtMs, d as needsCronTimerMaintenance, i as computeJobPreviousRunAtOrBeforeMs, l as isJobEnabled, m as recomputeJobNextRunAtMs, s as hasActiveCronRun, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, u as isTimeScheduledJob, v as resolveJobErrorBackoffUntilMs, x as resolveNextRunAtMsOrDisable } from "./jobs-scheduling-sefIqbJ3.mjs";
import { t as readActiveCronRunReceiptsInDatabase } from "./run-receipt-read-DF1n0U0f.mjs";
import { o as listActiveCronRunReceiptJobIdsInDatabase } from "./run-receipt-store-Bik3uOzB.mjs";
import { m as MIN_REFIRE_GAP_MS, p as MAX_CRON_TIMER_DELAY_MS } from "./timer-trigger-DkbJC_Jg.mjs";
import { n as isHeartbeatTaskCronJob } from "./heartbeat-task-Ds7Wgs5C.mjs";
import { n as isRunnableJob, t as hasMissedCronSlotSinceLastRun } from "./timer-runnable-CxUwSYOC.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-Wco-UUgE.mjs";
import { n as installCronSchedulerSnapshot, r as removeCronSchedulerSnapshot, t as getCronSchedulerSnapshot } from "./scheduler-config.worker-wXyNtMh_.mjs";
import { r as requestAndDrainCronRunsInWorker } from "./run-queue.worker-BBwXjrol.mjs";
import { t as createCronScheduledRunId } from "./run-request-id-CacI55qK.mjs";
import { i as scheduleUnownedCronJobsInWorker } from "./runtime-maintenance.worker-LOhH2YOm.mjs";
import { t as recordSkippedCronRunsInWorker } from "./scheduler-state.worker-CdZGfzap.mjs";
import { BroadcastChannel } from "node:worker_threads";
//#region src/cron/store/scheduler-actor.worker.ts
const actors = /* @__PURE__ */ new Map();
function emptyResult() {
	return {
		jobs: [],
		ownerless: [],
		accepted: [],
		rejected: [],
		launches: [],
		skipped: [],
		notifications: [],
		logs: []
	};
}
function readJobs(database, storeKey) {
	return loadedCronStoreFromRows(loadCronRows(database.db, storeKey, void 0, { includeGrantDefinitionProjection: true })).store.jobs;
}
function waitsForStartupBatch(actor, job) {
	const pending = actor.startupBatch?.overflow.get(job.id);
	return pending !== void 0 && job.state.nextRunAtMs === pending.catchupAtMs && job.state.startupCatchupAtMs === pending.catchupAtMs && job.state.lastRunAtMs === pending.lastRunAtMs;
}
/** Overflow starts after the immediate batch settles, including completion in another service. */
function settleCronStartupBatchInWorker(database, storeKey, nowMs) {
	const actor = actors.get(JSON.stringify([database.path, storeKey]));
	const batch = actor?.startupBatch;
	const result = emptyResult();
	if (!actor || !batch) return result;
	if (readActiveCronRunReceiptsInDatabase(database.db, storeKey, [...batch.immediateReceiptIds.values()]).some((receipt) => batch.immediateReceiptIds.has(receipt.receiptId))) return result;
	const state = { deps: {
		nowMs: () => nowMs,
		log: createCronMutationLogger(result.logs)
	} };
	runOpenClawStateWriteTransaction(({ db }) => {
		const jobs = loadedCronStoreFromRows(loadCronRows(db, storeKey, new Set(batch.overflow.keys()))).store.jobs;
		for (const job of jobs) {
			const pending = batch.overflow.get(job.id);
			if (!pending || job.state.nextRunAtMs !== pending.catchupAtMs || job.state.startupCatchupAtMs !== pending.catchupAtMs) continue;
			const previousEnabled = job.enabled ?? true;
			if (job.state.lastRunAtMs !== pending.lastRunAtMs) job.state.startupCatchupAtMs = void 0;
			else {
				job.state.nextRunAtMs = resolveNextRunAtMsOrDisable({
					state,
					job,
					candidate: nowMs + pending.delayMs,
					deferredNotifications: result.notifications
				});
				job.state.startupCatchupAtMs = job.state.nextRunAtMs;
			}
			updateCronRuntimeRow(db, storeKey, job, previousEnabled);
			result.jobs.push(job);
		}
		deferSqlitePostCommitPublication(db, () => {
			actor.startupBatch = void 0;
		});
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.startup-batch-settlement" });
	for (const notification of result.notifications) notification.routing = { defaultAgentId: getCronSchedulerSnapshot(storeKey, database.path)?.config.defaultAgentId };
	return result;
}
function collectChanges(result, change) {
	result.jobs.push(...change.jobs);
	result.notifications.push(...change.notifications);
	result.logs.push(...change.logs);
}
function scheduleWake(storeKey, actor, delayMs, deadlineAtMs) {
	actor.timer = setTimeout(() => {
		actor.timer = void 0;
		if (deadlineAtMs !== void 0 && Date.now() < deadlineAtMs) {
			scheduleWake(storeKey, actor, Math.min(deadlineAtMs - Date.now(), MAX_CRON_TIMER_DELAY_MS), deadlineAtMs);
			return;
		}
		const wake = {
			type: "cron.schedulerWake",
			storeKey
		};
		for (const { channel } of actor.channels.values()) channel.postMessage.bind(channel)(wake);
		scheduleWake(storeKey, actor, MAX_CRON_TIMER_DELAY_MS);
	}, delayMs);
	actor.timer.unref();
}
function armActor(storeKey, actor, snapshot, jobs, nowMs) {
	clearTimeout(actor.timer);
	actor.timer = void 0;
	actor.wakeAtMs = void 0;
	if (!snapshot.config.cronEnabled || ![...actor.channels.values()].some(({ paused }) => !paused)) return;
	let nextWakeAtMs;
	let enabled = false;
	for (const job of jobs) {
		if (!isJobEnabled(job) || !isTimeScheduledJob(job) || !hasCanonicalCronDeliveryMode(job.delivery)) continue;
		enabled = true;
		if (!hasActiveCronRun(job, false) && !waitsForStartupBatch(actor, job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs)) nextWakeAtMs = Math.min(nextWakeAtMs ?? Infinity, job.state.nextRunAtMs);
	}
	if (!enabled) return;
	const delay = nextWakeAtMs === void 0 ? MAX_CRON_TIMER_DELAY_MS : Math.max(0, nextWakeAtMs - nowMs);
	const wakeAtMs = nowMs + (delay === 0 ? MIN_REFIRE_GAP_MS : delay);
	actor.wakeAtMs = wakeAtMs;
	scheduleWake(storeKey, actor, Math.min(wakeAtMs - nowMs, MAX_CRON_TIMER_DELAY_MS), wakeAtMs);
	return nextWakeAtMs ?? wakeAtMs;
}
function isAgentWork(job) {
	return job.payload.kind === "agentTurn" || job.payload.kind === "heartbeat" || isHeartbeatTaskCronJob(job) || job.sessionTarget === "main" && job.payload.kind === "systemEvent" && job.wakeMode === "now";
}
function boundedCatchup(database, actor, storeKey, snapshot, nowMs, result, options) {
	const { config } = snapshot;
	const maxImmediate = Math.max(0, config.maxMissedJobsPerRestart ?? 5);
	const staggerMs = Math.max(0, config.missedJobStaggerMs ?? 5e3);
	const agentDelayMs = Math.max(0, config.startupDeferredMissedAgentJobDelayMs ?? 12e4);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const active = listActiveCronRunReceiptJobIdsInDatabase(db, storeKey);
		const skipped = new Set(options?.skipJobIds);
		return mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey,
			jobIds: new Set(loadCronRows(db, storeKey).map((row) => row.job_id)),
			mutate({ jobs }) {
				const changed = [];
				const notifications = [];
				const state = { deps: {
					nowMs: () => nowMs,
					log: createCronMutationLogger(result.logs)
				} };
				const missed = [];
				for (const job of jobs.values()) {
					if (!isJobEnabled(job) || skipped.has(job.id) || waitsForStartupBatch(actor, job) || active.has(job.id) || hasActiveCronRun(job, false)) continue;
					const backoff = job.schedule.kind === "cron" ? resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) : void 0;
					if (backoff !== void 0 && nowMs < backoff && hasMissedCronSlotSinceLastRun(job, nowMs) && job.state.nextRunAtMs !== backoff) {
						job.state.nextRunAtMs = backoff;
						changed.push(job);
						continue;
					}
					if (!isRunnableJob({
						job,
						nowMs,
						skipAtIfAlreadyRan: true,
						allowCronMissedRunByLastRun: true,
						activeInProcess: false
					})) continue;
					if (config.cronConfig?.skipMissedJobs && (job.schedule.kind === "cron" || job.schedule.kind === "every")) {
						if (recomputeJobNextRunAtMs({
							state,
							job,
							nowMs,
							deferredNotifications: notifications
						})) changed.push(job);
					} else missed.push(job);
				}
				missed.sort((left, right) => (left.state.nextRunAtMs ?? 0) - (right.state.nextRunAtMs ?? 0));
				const deferAgentWork = (job) => options?.deferAgentWork === true && isAgentWork(job) && !(options.liveSinceMs !== void 0 && (job.state.nextRunAtMs ?? 0) >= options.liveSinceMs);
				const eligible = missed.filter((job) => !deferAgentWork(job));
				const immediate = eligible.slice(0, maxImmediate);
				const deferred = [...eligible.slice(maxImmediate).map((job) => ({
					job,
					delayMs: void 0
				})), ...missed.filter(deferAgentWork).map((job) => ({
					job,
					delayMs: agentDelayMs
				}))];
				const overflow = /* @__PURE__ */ new Map();
				for (const [index, { job, delayMs }] of deferred.entries()) {
					const candidate = nowMs + (delayMs ?? staggerMs) + index * staggerMs;
					job.state.nextRunAtMs = resolveNextRunAtMsOrDisable({
						state,
						job,
						candidate,
						deferredNotifications: notifications
					});
					job.state.startupCatchupAtMs = job.state.nextRunAtMs;
					if (delayMs === void 0 && job.state.nextRunAtMs !== void 0) overflow.set(job.id, {
						catchupAtMs: job.state.nextRunAtMs,
						delayMs: (index + 1) * staggerMs,
						lastRunAtMs: job.state.lastRunAtMs
					});
					changed.push(job);
				}
				if (deferred.length > 0) result.logs.push({
					level: "info",
					fields: {
						immediateCount: immediate.length,
						deferredCount: deferred.length,
						totalMissed: missed.length
					},
					message: "cron: staggering missed jobs to prevent gateway overload"
				});
				for (const notification of notifications) notification.routing = { defaultAgentId: config.defaultAgentId };
				result.jobs.push(...changed);
				result.notifications.push(...notifications);
				return {
					upsertJobIds: changed.map((job) => job.id),
					value: {
						immediate,
						overflow
					}
				};
			}
		}).value;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.scheduler-catchup" });
}
function runCronSchedulerInWorker(database, command) {
	const { input } = command;
	const key = JSON.stringify([database.path, input.storeKey]);
	let actor = actors.get(key);
	const starting = !actor && command.type === "cron.schedulerStart";
	if (!actor && command.type !== "cron.schedulerStart") return emptyResult();
	if (!actor) {
		actor = {
			storeKey: input.storeKey,
			databasePath: database.path,
			channels: /* @__PURE__ */ new Map()
		};
		actors.set(key, actor);
	}
	if (command.type === "cron.schedulerStart" && !actor.channels.has(command.input.channelName)) {
		const channel = new BroadcastChannel(command.input.channelName);
		channel.unref();
		actor.channels.set(command.input.channelName, {
			channel,
			paused: command.input.paused ?? false
		});
	}
	if (command.type !== "cron.schedulerStart" && command.input.channelName) {
		const subscriber = actor.channels.get(command.input.channelName);
		if (subscriber && command.input.paused !== void 0) subscriber.paused = command.input.paused;
	}
	const snapshot = input.snapshot ? installCronSchedulerSnapshot(input.storeKey, input.snapshot, database.path) : getCronSchedulerSnapshot(input.storeKey, database.path);
	if (!snapshot) throw new Error("Cron scheduler requires a configuration snapshot");
	const nowMs = input.nowMs ?? (command.type === "cron.schedulerRefresh" ? command.input.options?.nowMs : void 0) ?? Date.now();
	const monotonicMs = input.monotonicMs ?? performance.now();
	const elapsedWallMs = actor.lastWallMs === void 0 ? 0 : nowMs - actor.lastWallMs;
	const elapsedMonotonicMs = actor.lastMonotonicMs === void 0 ? 0 : monotonicMs - actor.lastMonotonicMs;
	actor.catchupNeeded ||= elapsedWallMs - elapsedMonotonicMs > 2e3 || actor.wakeAtMs !== void 0 && nowMs > actor.wakeAtMs + 2e3;
	const forwardJump = actor.catchupNeeded;
	const result = emptyResult();
	collectChanges(result, settleCronStartupBatchInWorker(database, input.storeKey, nowMs));
	const jobs = new Map(readJobs(database, input.storeKey).map((job) => [job.id, job]));
	const currentJobs = () => {
		for (const job of result.jobs) jobs.set(job.id, job);
		return [...jobs.values()];
	};
	if (snapshot.config.cronEnabled && (command.type === "cron.schedulerRefresh" || [...actor.channels.values()].some(({ paused }) => !paused))) {
		let candidates = [];
		let overflow = /* @__PURE__ */ new Map();
		if (starting || command.type === "cron.schedulerTick" && forwardJump) {
			const catchup = boundedCatchup(database, actor, input.storeKey, snapshot, nowMs, result, command.type === "cron.schedulerStart" ? command.input : void 0);
			candidates = catchup.immediate;
			overflow = catchup.overflow;
			for (const job of candidates) jobs.set(job.id, job);
		} else if (command.type !== "cron.schedulerRefresh") {
			const allowCronMissedRunByLastRun = snapshot.config.cronConfig?.skipMissedJobs !== true;
			candidates = currentJobs().filter((job) => !waitsForStartupBatch(actor, job) && isRunnableJob({
				job,
				nowMs,
				allowCronMissedRunByLastRun,
				activeInProcess: false
			}));
		}
		const ownerless = candidates.filter((job) => !tryResolveCronJobEffectiveAgentId(job, snapshot.config.defaultAgentId));
		if (ownerless.length > 0) {
			const skipped = recordSkippedCronRunsInWorker(database, {
				storeKey: input.storeKey,
				change: {
					kind: "ownerless",
					proposals: ownerless.map((job) => ({
						jobId: job.id,
						enabled: job.enabled,
						configRevision: resolveCronJobConfigRevision(job),
						nextRunAtMs: job.state.nextRunAtMs,
						lastRunAtMs: job.state.lastRunAtMs,
						lastRunStatus: job.state.lastRunStatus
					}))
				},
				snapshot: {
					nowMs,
					defaultAgentId: snapshot.config.defaultAgentId,
					cronConfig: snapshot.config.cronConfig,
					notificationRouting: { defaultAgentId: snapshot.config.defaultAgentId },
					ownership: []
				}
			}, { recordHistory: true }).outcome;
			collectChanges(result, skipped);
			result.ownerless.push(...skipped.jobs);
		}
		const owned = candidates.filter((job) => !ownerless.includes(job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs));
		if (command.type !== "cron.schedulerRefresh" && (owned.length > 0 || (input.requests?.length ?? 0) > 0 || currentJobs().some((job) => job.state.queuedAtMs !== void 0))) {
			currentJobs();
			for (const job of owned) if (job.state.nextRunAtMs !== void 0 && job.state.nextRunAtMs > nowMs) job.state.nextRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
			const requested = requestAndDrainCronRunsInWorker(database, {
				storeKey: input.storeKey,
				nowMs,
				defaultAgentId: snapshot.config.defaultAgentId,
				requests: owned.map((job) => ({
					mode: "scheduled",
					jobId: job.id,
					configRevision: resolveCronJobConfigRevision(job),
					scheduledSlotMs: job.state.nextRunAtMs,
					receiptId: createCronScheduledRunId(input.storeKey, job.id, job.state.nextRunAtMs)
				}))
			}, {
				requests: input.requests ?? [],
				maxConcurrentRuns: 8,
				schedulingPaused: input.paused
			}, jobs);
			result.accepted.push(...requested.accepted);
			result.rejected.push(...requested.rejected);
			result.launches.push(...requested.launches);
			result.skipped.push(...requested.skipped);
			result.jobs.push(...requested.accepted.map((entry) => entry.job));
			result.jobs.push(...requested.launches.map((entry) => entry.job));
			result.jobs.push(...requested.skipped.flatMap((entry) => entry.job ? [entry.job] : []));
		}
		if (overflow.size > 0 && (actor.startupBatch || result.accepted.length > 0)) {
			actor.startupBatch ??= {
				immediateReceiptIds: /* @__PURE__ */ new Map(),
				overflow: /* @__PURE__ */ new Map()
			};
			for (const entry of result.accepted) actor.startupBatch.immediateReceiptIds.set(entry.runReceipt.receiptId, entry.job.id);
			for (const [id, pending] of overflow) actor.startupBatch.overflow.set(id, pending);
		}
		const options = {
			recomputeExpired: command.type !== "cron.schedulerRefresh",
			repairFutureCronNextRunAtMs: command.type !== "cron.schedulerRefresh" && elapsedWallMs >= 0,
			...command.type === "cron.schedulerRefresh" ? command.input.options : void 0
		};
		if (currentJobs().some((job) => needsCronTimerMaintenance(job, nowMs, options))) collectChanges(result, scheduleUnownedCronJobsInWorker(database, {
			storeKey: input.storeKey,
			options,
			snapshot: { nowMs }
		}).outcome);
	}
	result.jobs = [...new Map(result.jobs.map((job) => [job.id, job])).values()];
	result.nextWakeAtMs = armActor(input.storeKey, actor, snapshot, currentJobs(), nowMs);
	if (command.type !== "cron.schedulerRefresh") {
		actor.catchupNeeded = false;
		actor.lastWallMs = nowMs;
		actor.lastMonotonicMs = monotonicMs;
	}
	return result;
}
function stopCronSchedulerInWorker(input) {
	const entry = [...actors].find(([, actor]) => actor.storeKey === input.storeKey && actor.channels.has(input.channelName));
	if (!entry) return;
	const [key, actor] = entry;
	actor.channels.get(input.channelName)?.channel.close();
	actor.channels.delete(input.channelName);
	if (actor.channels.size === 0) {
		clearTimeout(actor.timer);
		actors.delete(key);
		removeCronSchedulerSnapshot(input.storeKey, actor.databasePath);
	}
}
//#endregion
export { settleCronStartupBatchInWorker as n, stopCronSchedulerInWorker as r, runCronSchedulerInWorker as t };
