import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { H as cronRunLogEntryToDetail, lt as resolveCronCompletionStatus, ot as STARTUP_INTERRUPTED_ERROR } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { h as updateCronRuntimeRow, n as deleteCronJobRowInDatabase, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { a as recordSkippedCronRequestInDatabase, i as recordCronRunInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-u-R2z7LI.mjs";
import { l as isJobEnabled, m as recomputeJobNextRunAtMs, w as maybeAutoDisableCronJobAfterRunFailure } from "./jobs-scheduling-sefIqbJ3.mjs";
import { i as resolveForcePreservedOneShotAtMs } from "./one-shot-schedule-DiK2ivJ0.mjs";
import { r as receiptFromRow } from "./run-receipt-read-DF1n0U0f.mjs";
import { a as finishCronRunReceiptInDatabase, r as ensureCronRunReceiptSchema } from "./run-receipt-store-Bik3uOzB.mjs";
import { n as applyTriggerRunResult } from "./timer-trigger-DkbJC_Jg.mjs";
import { r as resolveCronRunReceiptTerminalStatus } from "./run-receipts-DN1bseg1.mjs";
import { n as finalizeCronFailureNotifications, r as resolveFailureAlert, t as failureNotificationDeliveryFromJobState } from "./failure-alerts-Cgi3Ds94.mjs";
import { i as applyTriggerNoFireResult, r as applyScriptRunResult, t as applyJobResult } from "./timer-outcomes-CW21cqxl.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { t as findCronRunRecoveryInDatabase } from "./run-history-recovery-BhC_KZut.mjs";
import { t as isCronRunTriggerStateRetiredInDatabase } from "./run-receipt-trigger-state-EpH_d8bo.mjs";
import { n as parseCronScheduledRunId } from "./run-request-id-CacI55qK.mjs";
//#region src/cron/service/startup-run-repair.ts
/** Repairs interrupted and finalized cron runs while the service starts. */
function resolveOneShotReplacementAtMs(job, runningAtMs) {
	if (job.schedule.kind !== "at" || !job.enabled) return;
	const nextRunAtMs = job.state.nextRunAtMs;
	if (typeof nextRunAtMs !== "number" || nextRunAtMs <= runningAtMs) return;
	return parseAbsoluteTimeMs(job.schedule.at) === nextRunAtMs ? nextRunAtMs : void 0;
}
function markInterruptedStartupRun(params) {
	const { job, runningAtMs, nowMs } = params;
	const replacementAtMs = params.preservedOccurrenceAtMs ?? resolveOneShotReplacementAtMs(job, runningAtMs);
	const previousErrors = typeof job.state.consecutiveErrors === "number" && Number.isFinite(job.state.consecutiveErrors) ? Math.max(0, Math.floor(job.state.consecutiveErrors)) : 0;
	params.state.deps.log.warn({
		jobId: job.id,
		runningAtMs
	}, "cron: marking interrupted running job failed on startup");
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.state.lastRunAtMs = runningAtMs;
	job.state.lastRunStatus = "error";
	job.state.lastStatus = "error";
	job.state.lastError = STARTUP_INTERRUPTED_ERROR;
	job.state.lastErrorReason = void 0;
	job.state.lastDurationMs = Math.max(0, nowMs - runningAtMs);
	job.state.consecutiveErrors = previousErrors + 1;
	job.state.lastDelivered = false;
	job.state.lastDeliveryStatus = "unknown";
	job.state.lastDeliveryError = STARTUP_INTERRUPTED_ERROR;
	job.state.deliverySuppressionReason = void 0;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "not-requested";
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.state.nextRunAtMs = replacementAtMs;
	job.state.startupCatchupAtMs = void 0;
	job.updatedAtMs = nowMs;
	const alertConfig = resolveFailureAlert(params.state, job);
	const autoDisableNotificationOwnsFailure = maybeAutoDisableCronJobAfterRunFailure({
		job,
		atMs: nowMs,
		deferredNotifications: params.deferredNotifications
	});
	if (autoDisableNotificationOwnsFailure) params.state.deps.log.error({
		jobId: job.id,
		name: job.name,
		consecutiveErrors: job.state.consecutiveErrors
	}, "cron: auto-disabled interrupted job after consecutive run failures");
	if (job.schedule.kind === "at" && replacementAtMs === void 0) job.enabled = false;
	finalizeCronFailureNotifications(params.state, {
		job,
		alertConfig,
		result: {
			status: "error",
			error: STARTUP_INTERRUPTED_ERROR,
			errorClassification: { kind: "aborted" },
			startedAt: runningAtMs
		},
		completionStatus: "failed",
		autoDisableNotificationOwnsFailure,
		deferredNotifications: params.deferredNotifications
	});
	return {
		jobId: job.id,
		...replacementAtMs === void 0 ? {} : { replacementAtMs },
		runAtMs: runningAtMs,
		durationMs: job.state.lastDurationMs
	};
}
function restoreFinalizedStartupRun(params) {
	const { state, job, runningAtMs, entry } = params;
	const triggerOwnership = params.triggerStateRetired ? "stale" : "current";
	const startedAt = asDateTimestampMs(entry.runAtMs ?? runningAtMs);
	const endedAt = asDateTimestampMs(entry.ts);
	if (startedAt === void 0 || startedAt < 0 || endedAt === void 0 || endedAt < 0) {
		state.deps.log.warn({ jobId: job.id }, "cron: ignoring finalized startup run with an invalid timestamp envelope");
		return;
	}
	const replacementAtMs = (entry.nextRunAtMs === params.preservedOccurrenceAtMs ? params.preservedOccurrenceAtMs : void 0) ?? resolveOneShotReplacementAtMs(job, startedAt);
	const persistedNextRunAtMs = asDateTimestampMs(job.state.nextRunAtMs);
	const scheduleOwnership = typeof job.state.runningScheduleChangeId === "string" || job.schedule.kind === "at" && (!job.enabled || replacementAtMs !== void 0 || persistedNextRunAtMs !== void 0 && persistedNextRunAtMs > startedAt) ? "stale" : "current";
	const retiredTriggerStoppedSchedule = params.triggerStateRetired && params.triggerEval?.fired === true && entry.status === "ok" && entry.nextRunAtMs === void 0;
	job.state.startupCatchupAtMs = void 0;
	if (params.triggerEval?.fired === false) {
		applyTriggerNoFireResult(state, job, {
			startedAt,
			endedAt,
			triggerEval: params.triggerEval
		}, {
			scheduleMode: scheduleOwnership === "stale" ? "stale-preserve" : "advance",
			triggerOwnership,
			replay: true,
			deferredNotifications: params.deferredNotifications
		});
		return {
			shouldDelete: false,
			...replacementAtMs === void 0 ? {} : { replacementAtMs }
		};
	}
	const completionStatus = entry.completionStatus ?? resolveCronCompletionStatus({
		status: entry.status,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus
	});
	const shouldDelete = applyJobResult(state, job, {
		...entry,
		completionStatus,
		deliveryState: {
			delivered: entry.delivered,
			status: entry.deliveryStatus ?? "unknown",
			error: entry.deliveryError,
			deliverySuppressionReason: entry.deliverySuppressionReason,
			failureNotification: entry.failureNotificationDelivery ?? { status: "not-requested" }
		},
		startedAt,
		endedAt
	}, {
		replay: true,
		scheduleOwnership,
		...scheduleOwnership === "current" && !retiredTriggerStoppedSchedule ? { replaySchedule: { nextRunAtMs: entry.nextRunAtMs } } : {},
		deferredNotifications: params.deferredNotifications
	});
	job.state.lastDurationMs = entry.durationMs ?? Math.max(0, endedAt - startedAt);
	job.state.lastErrorReason = entry.errorReason;
	if (entry.failureNotificationDelivery) {
		job.state.lastFailureNotificationDelivered = entry.failureNotificationDelivery.delivered;
		job.state.lastFailureNotificationDeliveryStatus = entry.failureNotificationDelivery.status;
		job.state.lastFailureNotificationDeliveryError = entry.failureNotificationDelivery.error;
		const lastAlert = job.state.lastFailureAlertAtMs;
		if (entry.failureNotificationDelivery.status !== "not-requested" && completionStatus !== "succeeded" && (lastAlert === void 0 || lastAlert < endedAt || lastAlert > state.deps.nowMs())) job.state.lastFailureAlertAtMs = endedAt;
	}
	if (params.triggerEval) applyTriggerRunResult(job, {
		status: entry.status,
		endedAt,
		triggerEval: params.triggerEval
	}, {
		scheduleOwnership,
		triggerOwnership
	});
	if (params.scriptResult) applyScriptRunResult(job, {
		status: entry.status,
		...params.scriptResult
	}, { triggerOwnership });
	state.deps.log.info({
		jobId: job.id,
		runningAtMs,
		status: entry.status
	}, "cron: restored finalized run history on startup");
	return {
		shouldDelete,
		...replacementAtMs === void 0 ? {} : { replacementAtMs }
	};
}
//#endregion
//#region src/cron/store/run-recovery.kernel.ts
function recordInterruptedRun(params) {
	const { database, storeKey, job, receipt, nowMs } = params;
	const publicRunId = receipt?.requestRunId?.trim();
	const interrupted = {
		...params.interrupted,
		...publicRunId ? { runId: publicRunId } : {}
	};
	const prefix = createCronExecutionId(interrupted.jobId, interrupted.runAtMs);
	const runId = params.taskRunId ?? `${prefix}:${receipt?.receiptId ?? "interrupted"}`;
	recordCronRunInDatabase(database, {
		storeKey,
		jobId: interrupted.jobId,
		runId,
		agentId: receipt?.agentId ?? job?.agentId,
		startedAt: interrupted.runAtMs,
		endedAt: nowMs,
		status: "failed",
		error: STARTUP_INTERRUPTED_ERROR,
		detail: cronRunLogEntryToDetail({
			ts: nowMs,
			jobId: interrupted.jobId,
			action: "finished",
			status: "error",
			completionStatus: "failed",
			error: STARTUP_INTERRUPTED_ERROR,
			delivered: false,
			deliveryStatus: "unknown",
			deliveryError: STARTUP_INTERRUPTED_ERROR,
			failureNotificationDelivery: job ? failureNotificationDeliveryFromJobState(job) : void 0,
			runId: interrupted.runId,
			runAtMs: interrupted.runAtMs,
			durationMs: interrupted.durationMs,
			nextRunAtMs: job?.state.nextRunAtMs
		}, { storeKey })
	});
	return interrupted;
}
/** Startup owns abandoned rows; there is no live foreign Cron owner to negotiate with. */
function recoverCronJobInDatabase(params) {
	const { state, database, storeKey, job, receipt, notifications } = params;
	const nowMs = state.deps.nowMs();
	const pendingReceiptId = job?.state.runningAtMs === void 0 ? void 0 : job.state.runningReceiptId;
	const finishReceipt = (status, atMs, error) => {
		if (receipt) finishCronRunReceiptInDatabase({
			database: database.db,
			receiptSchema: params.receiptSchema,
			handle: receipt,
			pendingReceiptId,
			status,
			finishedAtMs: atMs,
			error
		});
	};
	if (!job) {
		const task = findCronRunRecoveryInDatabase({
			database: database.db,
			storeKey,
			jobId: receipt.jobId,
			startedAt: receipt.startedAtMs,
			receiptId: receipt.receiptId
		});
		if (task.finalized) {
			finishReceipt(resolveCronRunReceiptTerminalStatus(task.finalized.entry.status, task.finalized.triggerEval?.fired), task.finalized.entry.ts, task.finalized.entry.error);
			return {};
		}
		const interrupted = recordInterruptedRun({
			database: database.db,
			storeKey,
			receipt,
			taskRunId: task.taskRunId,
			nowMs,
			interrupted: {
				jobId: receipt.jobId,
				runAtMs: receipt.startedAtMs,
				durationMs: Math.max(0, nowMs - receipt.startedAtMs)
			}
		});
		finishReceipt("interrupted", nowMs, STARTUP_INTERRUPTED_ERROR);
		return { interrupted };
	}
	const previousEnabled = job.enabled ?? true;
	const runningAtMs = job.state.runningAtMs;
	if (runningAtMs === void 0) {
		if (job.state.queuedAtMs !== void 0) {
			const timed = receipt && parseCronScheduledRunId(receipt.receiptId);
			if (timed && timed.storeKey === storeKey && timed.jobId === job.id && isJobEnabled(job)) return {};
			const error = "cron: queued request lost its launch context";
			recordSkippedCronRequestInDatabase(database.db, {
				storeKey,
				jobId: job.id,
				receiptId: receipt?.receiptId,
				agentId: receipt?.agentId,
				startedAt: job.state.queuedAtMs,
				endedAt: nowMs,
				error,
				nextRunAtMs: job.state.nextRunAtMs
			});
			delete job.state.queuedAtMs;
			finishReceipt("skipped", nowMs, error);
			updateCronRuntimeRow(database.db, storeKey, job, previousEnabled);
		} else finishReceipt("interrupted", nowMs, "cron: owner unavailable after run marker retirement");
		return {};
	}
	const task = findCronRunRecoveryInDatabase({
		database: database.db,
		jobId: job.id,
		startedAt: runningAtMs,
		storeKey,
		receiptId: job.state.runningReceiptId ?? receipt?.receiptId
	});
	const receiptId = job.state.runningReceiptId ?? receipt?.receiptId ?? task.receiptId;
	const preservedOccurrenceAtMs = receipt?.receiptId === pendingReceiptId && receipt?.startedAtMs === runningAtMs && !parseCronScheduledRunId(receipt.receiptId) ? resolveForcePreservedOneShotAtMs(job) : void 0;
	const finalized = task.finalized;
	const restored = finalized ? restoreFinalizedStartupRun({
		state,
		job,
		runningAtMs,
		preservedOccurrenceAtMs,
		entry: finalized.entry,
		triggerStateRetired: receiptId ? isCronRunTriggerStateRetiredInDatabase({
			database: database.db,
			handle: {
				receiptId,
				storeKey,
				jobId: job.id,
				startedAtMs: runningAtMs
			}
		}) : false,
		scriptResult: finalized.scriptResult,
		triggerEval: finalized.triggerEval,
		deferredNotifications: notifications
	}) : void 0;
	let interrupted;
	if (!restored) {
		interrupted = markInterruptedStartupRun({
			state,
			job,
			runningAtMs,
			preservedOccurrenceAtMs,
			nowMs,
			deferredNotifications: notifications
		});
		if (job.enabled && job.state.nextRunAtMs === void 0) recomputeJobNextRunAtMs({
			state,
			job,
			nowMs,
			deferredNotifications: notifications
		});
		interrupted = recordInterruptedRun({
			database: database.db,
			storeKey,
			job,
			receipt,
			taskRunId: task.taskRunId,
			interrupted,
			nowMs
		});
	}
	finishReceipt(restored && finalized ? resolveCronRunReceiptTerminalStatus(finalized.entry.status, finalized.triggerEval?.fired) : "interrupted", restored && finalized ? finalized.entry.ts : nowMs, restored && finalized ? finalized.entry.error : STARTUP_INTERRUPTED_ERROR);
	if (restored?.shouldDelete) {
		deleteCronJobRowInDatabase(database.db, storeKey, job.id);
		return {
			removed: true,
			skipStartupCatchup: true
		};
	}
	updateCronRuntimeRow(database.db, storeKey, job, previousEnabled);
	return {
		...interrupted ? { interrupted } : {},
		...restored?.replacementAtMs === void 0 && interrupted?.replacementAtMs === void 0 ? { skipStartupCatchup: true } : {}
	};
}
//#endregion
//#region src/cron/store/run-recovery.worker.ts
/** One startup command restores committed outcomes before scheduling can dispatch work. */
function recoverCronRunsInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureCronRunReceiptSchema(db);
		const receiptSchema = prepareCronRunReceiptWriteSchema(db);
		const jobs = loadedCronStoreFromRows(loadCronRows(db, input.storeKey)).store.jobs;
		const receipts = new Map(executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cron_run_receipts").selectAll().where("store_key", "=", input.storeKey).where("status", "=", "running")).rows.map((row) => [row.job_id, receiptFromRow(row)]));
		const outcome = {
			jobs: [],
			removedJobIds: [],
			interruptedRuns: [],
			notifications: [],
			skipJobIds: [],
			logs: []
		};
		const state = { deps: {
			nowMs: () => input.nowMs,
			cronConfig: input.cronConfig,
			failureRepairTimeoutMs: input.failureRepairTimeoutMs,
			log: createCronMutationLogger(outcome.logs)
		} };
		for (const job of jobs) {
			const result = recoverCronJobInDatabase({
				database,
				receiptSchema,
				job,
				receipt: receipts.get(job.id),
				state,
				storeKey: input.storeKey,
				notifications: outcome.notifications
			});
			receipts.delete(job.id);
			if (result.removed) outcome.removedJobIds.push(job.id);
			else outcome.jobs.push(job);
			if (result.interrupted) outcome.interruptedRuns.push(result.interrupted);
			if (result.skipStartupCatchup) outcome.skipJobIds.push(job.id);
		}
		for (const receipt of receipts.values()) {
			const result = recoverCronJobInDatabase({
				database,
				receiptSchema,
				receipt,
				state,
				storeKey: input.storeKey,
				notifications: outcome.notifications
			});
			if (result.interrupted) outcome.interruptedRuns.push(result.interrupted);
		}
		return outcome;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-recovery" });
}
//#endregion
export { recoverCronRunsInWorker };
