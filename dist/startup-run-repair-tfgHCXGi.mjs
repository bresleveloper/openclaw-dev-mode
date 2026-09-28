import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { At as cronRunStatusToTaskStatus, Mt as cronTaskRecordToRunLogEntry, Nt as cronTaskRecordToScriptRunResult, Ot as cronQuietTriggerTaskDetail, Pt as cronTaskRecordToTriggerEval, Rt as resolveCronTaskRecordTimestamp, Xt as resolveCronCompletionStatus, Yt as resolveAdmittedCronCompletionStatus, jt as cronTaskRecordStoreKey, kt as cronRunLogEntryToTaskDetail, tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as loadCronRows, g as cronSchedulingInputsEqual, o as loadedCronStoreFromRows } from "./row-codec-mXerryYi.mjs";
import { a as createCronStreamSourceIdentity } from "./normalize-_k1oAXPq.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { n as resolvePacedNextRunAtMs } from "./pacing-DuamEQSm.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { i as isRetainedExecutionOwnerBinding, n as createExecutionStartedOwnerBinding, r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-C2u1SaeA.mjs";
import { c as listTaskRecordsByRuntimeSourceIdInDatabase } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { t as bindTaskFlowExecution } from "./task-flow-registry.store.sqlite-DM-mfTLX.mjs";
import { t as bindTaskRunExecution } from "./task-registry.store.sqlite-nRmuK0pg.mjs";
import { v as CRON_TASK_KIND } from "./task-registry-D10gtSrV.mjs";
import { c as finalizeTaskRunById, f as recordTaskRunProgressByRunIdCore, l as finalizeTaskRunByRunIdCore, o as createRunningTaskRunCore, u as findTaskByRunId } from "./task-executor-CsmgS3DT.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { _ as noteActiveCronJobMessageActionAuthorityMutation, b as noteActiveCronJobScheduleMutation, h as markCronJobActive, p as isCronSelfRemovalCurrent, v as noteActiveCronJobMessageSourceAuthorityMutation } from "./active-jobs-BdNx3YyC.mjs";
import { i as normalizeCronRunErrorText } from "./execution-errors-BJ-OuMcK.mjs";
import { t as computeNextRunAtMs } from "./schedule-hP3FjCPW.mjs";
import { C as trackCronRunReceiptSettlement, _ as isCronRunReceiptSettlementPending, a as adjudicateActiveCronRunReceiptInDatabase, b as prepareCronRunReceiptClaim, c as assertCronRunReceiptOwnedInDatabase, h as finishCronRunReceiptInDatabase, i as activateCronRunReceiptInDatabase, m as finishCronRunReceipt, o as assertCronRunReceiptCurrent, p as findActiveCronRunReceiptInDatabase, r as CronRunReceiptRevisionError, s as assertCronRunReceiptCurrentInDatabase, u as claimCronRunReceiptInDatabase, w as describeUnavailableCronAgent, x as readCronRunReceiptCurrentJob, y as prepareCronRunReceiptAdjudication } from "./run-receipt-store-DXbr_IpT.mjs";
import { E as resolveManualOneShotOccurrenceAtMs, O as autoDisableCronJob, i as errorBackoffMs, k as maybeAutoDisableCronJobAfterRunFailure, l as isJobEnabled, n as computeJobNextRunAtMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, v as recordScheduleComputeError } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { a as normalizeCronRunDiagnostics, o as summarizeCronRunDiagnostics } from "./run-diagnostics-8UzUPz88.mjs";
import { n as resolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-DfuNKDxM.mjs";
import { t as toPublicCronJob } from "./public-job-C0Jx9vVK.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-D6XdUIQv.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-ChqH9VhN.mjs";
import { a as resolveFailureAlert, i as maybeEmitFailureRecovery, n as finalizeCronFailureNotifications, r as maybeEmitFailureAlert, t as failureNotificationDeliveryFromJobState } from "./failure-alerts-CkiIl5s6.mjs";
import { c as resolveCronJobMessageToolAuthorityInputs, s as resolveCronJobMessageActionAuthorityInputs } from "./jobs-tool-policy-DBCUJ2uk.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/cron/service/state.ts
/** Builds event context only when a closed notification fact exists. */
function cronFailureNotificationEventContext(failureNotificationDetail) {
	return failureNotificationDetail ? { failureNotificationDetail } : void 0;
}
/** Creates mutable cron service state with a concrete clock dependency. */
function createCronServiceState(deps) {
	const defaultAgentId = deps.defaultAgentId ?? (deps.resolveDefaultAgentId ? void 0 : "main");
	return {
		deps: {
			...deps,
			defaultAgentId,
			nowMs: deps.nowMs ?? (() => Date.now())
		},
		store: null,
		durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
		timer: null,
		running: false,
		activeTimerTicks: 0,
		stopped: false,
		lifecycleGeneration: 0,
		schedulingPaused: false,
		schedulerStarted: false,
		activeManualRunJobIds: /* @__PURE__ */ new Set(),
		manualSetupTimeoutNotified: false,
		runAdmission: {
			active: 0,
			waiters: [],
			capacityListener: null
		},
		queuedRunReservationsByJobId: /* @__PURE__ */ new Map(),
		op: Promise.resolve(),
		warnedDisabled: false,
		warnedInvalidPersistedJobKeys: /* @__PURE__ */ new Set(),
		pendingQuarantineConfigJobs: [],
		lastQuarantineFailureWarnKey: null,
		storeLoadedAtMs: null
	};
}
/** Dispatches a cron event without letting subscriber errors escape scheduler work. */
function emit(state, evt, context) {
	try {
		const publicEvent = evt.job ? {
			...evt,
			job: toPublicCronJob(evt.job)
		} : evt;
		if (context) state.deps.onEvent?.(publicEvent, context);
		else state.deps.onEvent?.(publicEvent);
	} catch {}
}
function isImmediateCronRunMode(mode) {
	return mode === "force" || mode === "if-enabled";
}
//#endregion
//#region src/cron/store/run-receipt-execution-binding.ts
/** Binds the exact admitted execution without changing the receipt lifecycle. */
async function bindCronRunReceiptExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	const context = params.context ?? captureOpenClawStateWorkerContext(params.options);
	const input = {
		handle: { ...params.handle },
		binding
	};
	const assertOwnerCurrent = params.assertCurrent;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwnerCurrent?.();
	};
	const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-BgU7tLf5.mjs"), import("./sqlite-worker-store-ID7IGMTW.mjs")]);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.bindReceiptExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/cron/task-run-event-codec.ts
/** Write-side cron codec: converts a finished service event into a run-history entry.
* Kept separate from task-run-detail.ts so the read/history codec stays free of the
* agents failover tree (which transitively pulls the sandbox module graph). */
/** Uses execution timing for one timestamp shared by ledger and legacy dual-write paths. */
function resolveCronRunEndedAt(event, fallbackTs) {
	if (typeof event.runAtMs === "number" && Number.isFinite(event.runAtMs) && typeof event.durationMs === "number" && Number.isFinite(event.durationMs)) return event.runAtMs + event.durationMs;
	return fallbackTs;
}
/** Builds the legacy run-history record from one finished service event. */
function cronRunLogEntryFromEvent(event, fallbackTs, errorClassification) {
	const errorReason = resolveCronRunErrorReason(event.error, event.provider, errorClassification);
	return {
		ts: resolveCronRunEndedAt(event, fallbackTs),
		jobId: event.jobId,
		action: "finished",
		status: event.status,
		completionStatus: event.completionStatus,
		error: event.error,
		errorReason,
		summary: event.summary,
		diagnostics: event.diagnostics,
		delivered: event.delivered,
		deliveryStatus: event.deliveryStatus,
		deliveryError: event.deliveryError,
		deliverySuppressionReason: event.deliverySuppressionReason,
		failureNotificationDelivery: event.failureNotificationDelivery,
		delivery: event.delivery,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		runId: event.runId,
		runAtMs: event.runAtMs,
		durationMs: event.durationMs,
		nextRunAtMs: event.nextRunAtMs,
		triggerFired: event.triggerFired,
		model: event.model,
		provider: event.provider,
		usage: event.usage
	};
}
//#endregion
//#region src/cron/service/task-ledger.ts
/** Progress summary shown while a detached task ledger row represents an active automation run. */
const CRON_TASK_RUNNING_PROGRESS_SUMMARY = "Running automation.";
//#endregion
//#region src/cron/service/task-runs.ts
/** Detached task-ledger integration for cron runs. */
function requireCronAgentId(agentId) {
	if (!agentId?.trim()) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return normalizeAgentId(agentId);
}
function resolveCurrentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
/** Carries exact admission into the first post-admission owner lifecycle phase. */
function createCronOwnerExecutionIdentityAdmission(params) {
	const ownerBinding = createExecutionStartedOwnerBinding(async (admitted) => {
		const { taskId, flowId } = params;
		try {
			if (!admitted.executionIdentityToken) return;
			const assertCurrent = resolveAdmittedRunActiveAssertion(admitted);
			if (!assertCurrent) throw new Error("Cron execution authority closed before owner binding");
			const context = captureOpenClawStateWorkerContext();
			const receiptResult = await bindCronRunReceiptExecution({
				admitted,
				handle: params.runReceipt,
				context,
				assertCurrent
			});
			const taskResult = taskId ? isRetainedExecutionOwnerBinding(receiptResult) ? await bindTaskRunExecution({
				admitted,
				taskId,
				context,
				assertCurrent
			}) : receiptResult : void 0;
			const flowParentResult = taskId ? taskResult : receiptResult;
			const flowResult = flowId ? isRetainedExecutionOwnerBinding(receiptResult) && isRetainedExecutionOwnerBinding(flowParentResult) ? await bindTaskFlowExecution({
				admitted,
				flowId,
				context,
				assertCurrent
			}) : flowParentResult : void 0;
			if ([
				receiptResult,
				taskResult,
				flowResult
			].some((result) => result === "mismatch" || result === "missing")) params.state.deps.log.warn({
				receiptResult,
				taskResult,
				flowResult
			}, "cron: exact execution identity binding was not retained");
		} catch (error) {
			params.state.deps.log.warn({ error }, "cron: failed to retain exact execution identity binding");
		}
	});
	return {
		ingress: {
			kind: "schedule",
			boundary: "cron.isolated-agent",
			state: "present"
		},
		onPostAdmission: ownerBinding.onPostAdmission,
		onExecutionStarted: ownerBinding.onExecutionStarted
	};
}
/** Updates an active cron task with the exact transcript identity reported by its runner. */
function tryUpdateCronTaskRunSession(state, taskRunId, sessionKey) {
	const childSessionKey = sessionKey?.trim();
	if (!taskRunId || !childSessionKey) return;
	try {
		if (recordTaskRunProgressByRunIdCore({
			runId: taskRunId,
			runtime: "cron",
			childSessionKey
		}).length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger session was not updated");
	} catch (error) {
		state.deps.log.warn({
			runId: taskRunId,
			error
		}, "cron: failed to update task ledger session");
	}
}
function tryCreateCronTaskRunHandle(params) {
	const runId = createCronTaskRunId(params.job.id, params.startedAt, params.runReceipt?.receiptId, params.publicRunId);
	return tryCreateCronTaskRunRecord({
		state: params.state,
		job: params.job,
		jobId: params.job.id,
		startedAt: params.startedAt,
		runId
	}) ?? { runId };
}
function createCronTaskRunId(jobId, startedAt, receiptId, publicRunId) {
	const receipt = receiptId?.trim();
	const publicId = publicRunId?.trim();
	const discriminator = receipt || publicId || randomUUID();
	const publicSuffix = publicId && publicId !== discriminator ? `:${publicId}` : "";
	return `${createCronExecutionId(jobId, startedAt)}:${discriminator}${publicSuffix}`;
}
function receiptIdFromCronTaskRunId(taskRunId, jobId, startedAt) {
	const prefix = `${createCronExecutionId(jobId, startedAt)}:`;
	if (!taskRunId?.startsWith(prefix)) return;
	return taskRunId.slice(prefix.length).split(":", 1)[0] || void 0;
}
function findLatestCronTaskRunForRecoveryFromRecords(records, jobId, startedAt, storeKey, receiptId) {
	const executionRunId = createCronExecutionId(jobId, startedAt);
	const prefix = `${executionRunId}:`;
	const receiptRunId = receiptId ? `${prefix}${receiptId}` : void 0;
	return records.filter((task) => {
		if (task.runtime !== "cron" || task.sourceId !== jobId) return false;
		const taskStoreKey = cronTaskRecordStoreKey(task);
		if (receiptRunId) return taskStoreKey === storeKey && (task.runId === receiptRunId || task.runId?.startsWith(`${receiptRunId}:`));
		if (taskStoreKey === void 0) return task.runId === executionRunId;
		return taskStoreKey === storeKey && (task.runId === executionRunId || task.runId?.startsWith(prefix));
	}).toSorted((left, right) => Number(left.endedAt !== void 0) - Number(right.endedAt !== void 0) || resolveCronTaskRecordTimestamp(right) - resolveCronTaskRecordTimestamp(left) || right.createdAt - left.createdAt || right.taskId.localeCompare(left.taskId))[0];
}
function finalizedCronTaskRun(task, jobId) {
	if (task?.runtime !== "cron" || task.sourceId !== jobId || task.endedAt === void 0) return;
	const triggerEval = cronTaskRecordToTriggerEval(task);
	const entry = cronTaskRecordToRunLogEntry(task) ?? (task.status === "succeeded" && triggerEval?.fired === false ? {
		ts: task.endedAt,
		jobId,
		action: "finished",
		status: "ok",
		...task.startedAt === void 0 ? {} : {
			runAtMs: task.startedAt,
			durationMs: Math.max(0, task.endedAt - task.startedAt)
		}
	} : void 0);
	if (!entry?.status) return;
	const scriptResult = cronTaskRecordToScriptRunResult(task);
	return {
		entry: {
			...entry,
			status: entry.status
		},
		...scriptResult ? { scriptResult } : {},
		...triggerEval ? { triggerEval } : {}
	};
}
/** Re-reads task recovery facts on the caller's exact SQLite transaction. */
function findCronTaskRunRecoveryInDatabase(params) {
	const task = findLatestCronTaskRunForRecoveryFromRecords(listTaskRecordsByRuntimeSourceIdInDatabase(params.database, "cron", params.jobId), params.jobId, params.startedAt, params.storeKey, params.receiptId);
	const finalized = finalizedCronTaskRun(task, params.jobId);
	const receiptId = receiptIdFromCronTaskRunId(task?.runId, params.jobId, params.startedAt);
	return {
		...task?.runId ? { taskRunId: task.runId } : {},
		...receiptId ? { receiptId } : {},
		...finalized ? { finalized } : {}
	};
}
function tryCreateCronTaskRunRecord(params) {
	try {
		const childSessionKey = params.childSessionKey;
		const agentId = params.ownerlessRun ? void 0 : params.job ? resolveCronJobEffectiveAgentId(params.job, resolveCurrentDefaultAgentId(params.state)) : childSessionKey ? resolveAgentIdFromSessionKey(childSessionKey, resolveCurrentDefaultAgentId(params.state)) : requireCronAgentId(resolveCurrentDefaultAgentId(params.state));
		const task = createRunningTaskRunCore({
			runtime: "cron",
			taskKind: CRON_TASK_KIND,
			sourceId: params.jobId,
			ownerKey: "",
			scopeKind: "system",
			childSessionKey,
			agentId,
			runId: params.runId,
			label: params.job?.name,
			task: params.job?.name || params.jobId,
			deliveryStatus: "not_applicable",
			notifyPolicy: "silent",
			startedAt: params.startedAt,
			lastEventAt: params.startedAt,
			progressSummary: CRON_TASK_RUNNING_PROGRESS_SUMMARY,
			detail: { storeKey: cronStoreKey(params.state.deps.storePath) }
		});
		if (!task) {
			params.state.deps.log.warn({ jobId: params.jobId }, "cron: task ledger record was not persisted");
			return;
		}
		return {
			runId: params.runId,
			taskId: task.taskId,
			...task.parentFlowId ? { flowId: task.parentFlowId } : {}
		};
	} catch (error) {
		params.state.deps.log.warn({
			jobId: params.jobId,
			error
		}, "cron: failed to create task ledger record");
		return;
	}
}
/** Finalizes executions that intentionally do not produce a run-history row. */
function tryFinishCronTaskRunWithoutHistory(state, result) {
	if (!result.taskRunId) return;
	const error = result.status !== "ok" && result.error !== void 0 ? normalizeCronRunErrorText(result.error) : void 0;
	const quietTriggerEval = result.triggerEval?.fired === false ? {
		...result.triggerEval,
		fired: false
	} : void 0;
	try {
		finalizeTaskRunByRunIdCore({
			runId: result.taskRunId,
			runtime: "cron",
			status: cronRunStatusToTaskStatus({
				status: result.status,
				completionStatus: quietTriggerEval ? "succeeded" : result.completionStatus,
				error
			}),
			endedAt: result.endedAt,
			lastEventAt: result.endedAt,
			error,
			terminalSummary: result.summary,
			childSessionKey: result.childSessionKey ?? result.sessionKey ?? null,
			...quietTriggerEval ? { detail: cronQuietTriggerTaskDetail(cronStoreKey(state.deps.storePath), quietTriggerEval) } : {}
		});
	} catch (cause) {
		state.deps.log.warn({
			runId: result.taskRunId,
			jobStatus: result.status,
			error: cause
		}, "cron: failed to update task ledger record");
	}
}
/** Finalizes the authoritative task row, creating one for terminal-only cron events. */
function tryFinishCronTaskRun(state, result) {
	const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs(), result.errorClassification);
	const startedAt = entry.runAtMs ?? entry.ts;
	const candidateRunId = result.taskRunId ?? createCronTaskRunId(entry.jobId, startedAt, entry.runId);
	try {
		const existingCandidate = findTaskByRunId(candidateRunId);
		const created = existingCandidate?.runtime === "cron" ? void 0 : tryCreateCronTaskRunRecord({
			state,
			job: result.job ?? result.event.job,
			jobId: entry.jobId,
			startedAt,
			runId: candidateRunId,
			childSessionKey: entry.sessionKey,
			ownerlessRun: result.ownerlessRun
		});
		const taskRunId = existingCandidate?.runtime === "cron" ? candidateRunId : created?.runId;
		if (!taskRunId) return;
		const storeKey = cronStoreKey(state.deps.storePath);
		const legacyRecoveryRunId = createCronExecutionId(entry.jobId, startedAt);
		const detail = cronRunLogEntryToTaskDetail(entry, {
			storeKey,
			...result.scriptResult ? { scriptResult: result.scriptResult } : {},
			...result.triggerEval ? { triggerEval: result.triggerEval } : {}
		});
		const finalize = (runId, status = cronRunStatusToTaskStatus(entry)) => finalizeTaskRunByRunIdCore({
			runId,
			runtime: "cron",
			status,
			endedAt: entry.ts,
			lastEventAt: entry.ts,
			...status === "cancelled" ? {} : {
				error: entry.error,
				clearError: entry.error === void 0,
				terminalSummary: entry.summary ?? null,
				preserveTerminalSummary: true
			},
			childSessionKey: entry.sessionKey ?? null,
			detail
		});
		let updated = finalize(taskRunId);
		if (updated.length === 0) {
			const existing = findTaskByRunId(taskRunId);
			if (existing?.runtime === "cron" && existing.status === "cancelled") updated = finalize(taskRunId, "cancelled");
			else if (existing?.runtime === "cron" && (existing.status === "lost" || cronTaskRecordStoreKey(existing) === storeKey && cronTaskRecordToRunLogEntry(existing) === null || existing.detail === void 0 && existing.runId === legacyRecoveryRunId)) {
				const recovered = finalizeTaskRunById({
					taskId: existing.taskId,
					status: cronRunStatusToTaskStatus(entry),
					childSessionKey: entry.sessionKey ?? null,
					endedAt: entry.ts,
					lastEventAt: entry.ts,
					error: entry.error,
					terminalSummary: entry.summary ?? null,
					preserveTerminalSummary: true,
					detail
				});
				updated = recovered ? [recovered] : [];
			} else if (existing?.runtime === "cron") updated = finalize(taskRunId);
			else {
				const recreated = tryCreateCronTaskRunRecord({
					state,
					job: result.job ?? result.event.job,
					jobId: entry.jobId,
					startedAt,
					runId: taskRunId,
					childSessionKey: entry.sessionKey,
					ownerlessRun: result.ownerlessRun
				});
				if (recreated) updated = finalize(recreated.runId);
			}
		}
		if (updated.length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger record was not finalized");
	} catch (error) {
		state.deps.log.warn({
			runId: candidateRunId,
			jobStatus: entry.status,
			error
		}, "cron: failed to update task ledger record");
	}
}
//#endregion
//#region src/cron/service/timer-execution-timeout.ts
const MAX_CRON_TIMER_DELAY_MS = 6e4;
/**
* Minimum gap between consecutive fires of the same cron job.  This is a
* safety net that prevents spin-loops when `computeJobNextRunAtMs` returns
* a value within the same second as the just-completed run.  The guard
* is intentionally generous (2 s) so it never masks a legitimate schedule
* but always breaks an infinite re-trigger cycle.  (See #17821)
*/
const MIN_REFIRE_GAP_MS = 2e3;
const DEFAULT_MISSED_JOB_STAGGER_MS = 5e3;
const DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS = 12e4;
/** Payloads that execute outside the main session own cancellable task-run state. */
function runsDetachedFromMainSession(job) {
	return job.sessionTarget !== "main" || job.payload.kind === "script";
}
function resolveMainSessionCronDeliveryContext(state, job) {
	const targetSessionKey = job.sessionKey?.trim();
	if (!targetSessionKey) return;
	const explicitAgentId = job.agentId?.trim();
	const agentId = normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(targetSessionKey, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId));
	const storePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
	if (!storePath) return;
	try {
		const sessionEntry = loadSessionEntryReadOnly({
			agentId,
			sessionKey: targetSessionKey,
			storePath
		});
		return deliveryContextFromSession(sessionEntry);
	} catch {
		return;
	}
}
//#endregion
//#region src/cron/service/timer-outcome-events.ts
/** Records a terminal task/event fact before the fallible runtime-row commit. */
function emitCronOutcomeForJob(state, job, result) {
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) return;
	recordCronOutcomeForJob(state, job, result);
	emitCronOutcomeEventForJob(state, job, result);
}
function createCronOutcomeEvent(job, result) {
	return {
		jobId: job.id,
		action: "finished",
		job,
		status: result.status,
		completionStatus: result.completionStatus,
		error: result.error,
		summary: result.summary,
		diagnostics: result.diagnostics,
		delivered: job.state.lastDelivered,
		deliveryStatus: job.state.lastDeliveryStatus,
		deliveryError: job.state.lastDeliveryError,
		deliverySuppressionReason: job.state.deliverySuppressionReason,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
		delivery: result.delivery,
		sessionId: result.sessionId,
		sessionKey: result.sessionKey,
		runAtMs: result.startedAt,
		durationMs: job.state.lastDurationMs,
		nextRunAtMs: job.state.nextRunAtMs,
		...result.triggerEval?.fired ? { triggerFired: true } : {},
		model: result.model,
		provider: result.provider,
		usage: result.usage
	};
}
function recordCronOutcomeForJob(state, job, result) {
	const event = createCronOutcomeEvent(job, result);
	tryFinishCronTaskRun(state, {
		taskRunId: result.taskRunId,
		job,
		event,
		errorClassification: result.errorClassification,
		scriptResult: {
			scriptStateChanged: result.scriptStateChanged,
			scriptState: result.scriptState
		},
		...result.triggerEval ? { triggerEval: result.triggerEval } : {}
	});
}
function emitCronOutcomeEventForJob(state, job, result) {
	emit(state, createCronOutcomeEvent(job, result), cronFailureNotificationEventContext(result.failureNotificationDetail));
}
//#endregion
//#region src/cron/retry-hint.ts
const SERVER_ERROR_PATTERN = /\b(?:https?|status(?:[ _]code)?|response(?:[ _]code)?|http(?:[ _]status)?)\b[\s:=#"']{0,4}5\d{2}\b|\b5\d{2}\b[\s:)\].,-]*(?:internal server error|server error|bad gateway|service unavailable|gateway time-?out)\b|\binternal server error\b|\bbad gateway\b|\bservice unavailable\b|\bgateway time-?out\b|\b5xx\b|^\s*5\d{2}\s*$/i;
const RATE_LIMIT_PATTERN = /\b(?:https?(?:\/\d(?:\.\d)?)?|status(?:[ _-]?code)?|response(?:[ _-]?code)?|http(?:[ _-]?status)?)\b[\s:=#"'(]{0,6}429\b|\b(?:provider\s+)?api[ _-]?error\b[\s:=#"'(]{0,6}429\b|\b(?:requested\s+)?url\s+returned\s+error\b[\s:=#"'(]{0,6}429\b|\b429\b[\s:)\].,-]*(?:rate[_ -]?limit(?:ed|ing)?(?:[_ -](?:error|exceeded|reached))?|too many requests|resource has been exhausted|quota(?:\s+(?:exceeded|exhausted|depleted|reached))?)\b|\brate[_ -]?limit(?:ed|ing)?(?:[_ -](?:error|exceeded|reached))?\b|\btoo many requests\b|\bresource has been exhausted\b|\btokens per day\b|^\s*429\s*$/i;
const SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN = /^(?:(?:CronSessionLifecycleClaimError|Error): )?Session "[^"\n]+" (?:changed|was deleted) while starting work\. Retry\.$/;
const TRANSIENT_PATTERNS = {
	rate_limit: RATE_LIMIT_PATTERN,
	overloaded: /^\s*529(?:\s*$|[\s:)\].,-]*(?:api\b.*\bbusy\b|(?:please\s+)?try\s+again\b))|\b(?:https?(?:\/\d(?:\.\d)?)?|status(?:[ _-]?code)?|response(?:[ _-]?code)?|http(?:[ _-]?status)?|(?:provider\s+)?api[ _-]?error|(?:requested\s+)?url\s+returned\s+error)\b[\s:=#"'(]{0,6}529\b|\boverloaded(?:_error)?\b|high demand|temporar(?:ily|y) overloaded|capacity exceeded/i,
	network: /(network|fetch failed|socket|econnreset|econnrefused|eai_again|enetdown|ehostunreach|ehostdown|enetreset|enetunreach|epipe)/i,
	timeout: /(timeout|timed out|stalled before execution start|etimedout)/i,
	server_error: SERVER_ERROR_PATTERN
};
/** Classifies cron execution errors against the configured retryable transient categories. */
function resolveCronExecutionRetryHint(input) {
	const { error, retryOn, classifiedReason, executionStarted } = input;
	if (!error || typeof error !== "string") return { retryable: false };
	if (SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN.test(error)) return { retryable: executionStarted !== true };
	const keys = retryOn?.length ? retryOn : Object.keys(TRANSIENT_PATTERNS);
	const classified = classifiedReason ?? void 0;
	if (classified) return keys.includes(classified) ? {
		retryable: true,
		category: classified
	} : { retryable: false };
	for (const key of keys) if (TRANSIENT_PATTERNS[key]?.test(error)) return {
		retryable: true,
		category: key
	};
	return { retryable: false };
}
//#endregion
//#region src/cron/service/timer-trigger.ts
/** Default max retries for cron jobs on transient errors (#24355). */
const DEFAULT_MAX_TRANSIENT_RETRIES = 3;
/** Rejects outcome-generated schedule timestamps before they can persist or arm a timer. */
function resolveNextRunAtMsOrDisable(params) {
	const nextRunAtMs = asDateTimestampMs(params.candidate);
	if (nextRunAtMs !== void 0 && nextRunAtMs > 0) return nextRunAtMs;
	autoDisableCronJob({
		job: params.job,
		reason: "schedule-errors",
		atMs: params.state.deps.nowMs(),
		consecutiveErrors: 1,
		deferredNotifications: params.deferredNotifications
	});
}
/** Persists non-busy trigger evaluation state without touching payload-run history. */
function applyTriggerEvaluationState(job, triggerEval, evaluatedAtMs) {
	if (triggerEval.busy) return;
	job.state.lastTriggerEvalAtMs = evaluatedAtMs;
	job.state.triggerEvalCount = (job.state.triggerEvalCount ?? 0) + 1;
	if (triggerEval.stateChanged) job.state.triggerState = triggerEval.state;
	if (triggerEval.fired) job.state.lastTriggerFireAtMs = evaluatedAtMs;
}
/** Persists fired/error trigger metadata and disarms successful once triggers. */
function applyTriggerRunResult(job, result, opts) {
	if (!result.triggerEval || opts?.triggerOwnership === "stale") return;
	applyTriggerEvaluationState(job, result.status === "ok" ? result.triggerEval : {
		...result.triggerEval,
		stateChanged: false,
		state: void 0
	}, result.endedAt);
	if (opts?.scheduleOwnership !== "stale" && result.triggerEval.fired && job.trigger?.once === true && result.status === "ok") {
		if (job.schedule.kind === "stream") job.state.streamSourceIdentity = createCronStreamSourceIdentity();
		job.enabled = false;
		job.state.nextRunAtMs = void 0;
	}
}
function resolveCronNextRunWithLowerBound(params) {
	if (params.naturalNext === void 0) {
		params.state.deps.log.warn({
			jobId: params.job.id,
			jobName: params.job.name
		}, "cron: next run unresolved; clearing schedule to avoid a refire loop");
		return;
	}
	return resolveNextRunAtMsOrDisable({
		state: params.state,
		job: params.job,
		candidate: Math.max(params.naturalNext, params.lowerBoundMs),
		deferredNotifications: params.deferredNotifications
	});
}
function resolveTransientCronRetryDecision(params) {
	if (params.errorClassification?.kind === "permanent") return {
		retryable: false,
		consecutiveErrors: params.consecutiveErrors ?? 0,
		reason: "permanent error"
	};
	const retryHint = resolveCronExecutionRetryHint({
		error: params.error,
		retryOn: void 0,
		classifiedReason: params.errorClassification?.kind === "reason" ? params.errorClassification.reason : params.lastErrorReason,
		executionStarted: params.executionStarted
	});
	const consecutiveErrors = params.consecutiveErrors ?? 0;
	if (!retryHint.retryable) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "permanent error"
	};
	if (consecutiveErrors > DEFAULT_MAX_TRANSIENT_RETRIES) return {
		retryable: false,
		consecutiveErrors,
		retryCategory: retryHint.category,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveErrors,
		retryCategory: retryHint.category,
		backoffMs: errorBackoffMs(consecutiveErrors, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, DEFAULT_MAX_TRANSIENT_RETRIES)),
		reason: "transient retry"
	};
}
function resolveDisabledHeartbeatOneShotRetryDecision(params) {
	const consecutiveSkipped = params.consecutiveSkipped ?? 0;
	if (consecutiveSkipped > DEFAULT_MAX_TRANSIENT_RETRIES) return {
		retryable: false,
		consecutiveSkipped,
		reason: "max retries exhausted"
	};
	return {
		retryable: true,
		consecutiveSkipped,
		backoffMs: errorBackoffMs(consecutiveSkipped, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, DEFAULT_MAX_TRANSIENT_RETRIES)),
		reason: "disabled heartbeat retry"
	};
}
function normalizeQueuedSystemEventHandle(result) {
	if (typeof result === "boolean") return { accepted: result };
	if (result && typeof result === "object") return {
		accepted: result.accepted !== false,
		...result.remove ? { remove: result.remove } : {}
	};
	return { accepted: true };
}
function removeQueuedSystemEventHandle(state, job, queued) {
	if (!queued.accepted || !queued.remove) return;
	try {
		queued.remove();
	} catch (err) {
		state.deps.log.warn({
			jobId: job.id,
			jobName: job.name,
			err
		}, "cron: failed to remove undelivered main-session system event");
	}
}
function shouldRetryDisabledHeartbeatOneShot(job, result) {
	return job.schedule.kind === "at" && job.sessionTarget === "main" && job.wakeMode === "now" && result.status === "skipped" && result.error === "disabled";
}
function isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun) {
	if (!isJobEnabled(job) || typeof nextRun !== "number" || typeof lastRun !== "number" || nextRun <= lastRun) return false;
	if (lastRunStatus === "error") return true;
	return lastRunStatus === "skipped" && job.sessionTarget === "main" && job.wakeMode === "now" && job.state.lastError === "disabled";
}
function resolveDeliveryState(params) {
	const primaryDeliveryPlan = resolveCronDeliveryPlan(params.job);
	const primaryDeliveryRequested = primaryDeliveryPlan.requested;
	const noFailureNotification = { status: "not-requested" };
	if (params.delivered === true && (params.runStatus !== "error" || params.delivery?.delivered === true)) return {
		delivered: true,
		status: "delivered",
		failureNotification: noFailureNotification
	};
	if (!primaryDeliveryRequested) {
		if (primaryDeliveryPlan.mode === "webhook" && params.deliveryAttempted === true) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			failureNotification: noFailureNotification
		};
		return {
			status: "not-requested",
			failureNotification: noFailureNotification
		};
	}
	if (params.runStatus === "error") {
		if (params.delivered !== void 0) return {
			delivered: false,
			status: "not-delivered",
			error: params.error,
			deliverySuppressionReason: params.deliverySuppressionReason,
			failureNotification: noFailureNotification
		};
		return {
			status: "unknown",
			error: params.error,
			failureNotification: noFailureNotification
		};
	}
	if (params.delivered === false) return {
		delivered: false,
		status: "not-delivered",
		error: params.error,
		deliverySuppressionReason: params.deliverySuppressionReason,
		failureNotification: { status: "not-requested" }
	};
	return {
		status: "unknown",
		failureNotification: { status: "not-requested" }
	};
}
//#endregion
//#region src/cron/service/timer-outcomes.ts
/** Checks both the admitted schedule and edits that may have returned to its original value. */
function resolveCronRunScheduleOwnership(params) {
	return typeof params.currentJob.state.runningScheduleChangeId === "string" || params.activeJobMarker?.scheduleMutated === true || !cronSchedulingInputsEqual(params.admittedJob, params.currentJob) ? "stale" : "current";
}
/** Keeps trigger state owned by the exact script/once definition that evaluated it. */
function resolveCronRunTriggerOwnership(params) {
	return params.activeJobMarker?.triggerMutated === true || params.admittedJob.trigger?.script !== params.currentJob.trigger?.script || params.admittedJob.trigger?.once !== params.currentJob.trigger?.once ? "stale" : "current";
}
function assignNextRunAtMs(params) {
	const nextRunAtMs = resolveNextRunAtMsOrDisable(params);
	params.job.state.nextRunAtMs = nextRunAtMs;
	return nextRunAtMs;
}
/** Applies run outcome state, delivery state, backoff/next-run scheduling, and delete-after-run policy. */
function applyJobResult(state, job, result, opts) {
	const scheduleNextRun = (candidate) => assignNextRunAtMs({
		state,
		job,
		candidate,
		deferredNotifications: opts.deferredNotifications
	});
	const previousScheduleState = {
		enabled: job.enabled,
		nextRunAtMs: job.state.nextRunAtMs,
		pacedNextRunAtMs: job.state.pacedNextRunAtMs,
		forcePreservedNextRunAtMs: job.state.forcePreservedNextRunAtMs
	};
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	job.state.lastRunAtMs = result.startedAt;
	job.state.lastRunStatus = result.status;
	job.state.lastStatus = result.status;
	job.state.lastDurationMs = Math.max(0, result.endedAt - result.startedAt);
	job.state.lastError = result.error;
	job.state.lastDiagnostics = normalizeCronRunDiagnostics(result.diagnostics);
	job.state.lastDiagnosticSummary = summarizeCronRunDiagnostics(job.state.lastDiagnostics);
	job.state.lastErrorReason = result.status === "error" && typeof result.error === "string" ? resolveCronRunErrorReason(result.error, result.provider, result.errorClassification) : void 0;
	if (result.status === "error") state.deps.log.warn({
		jobId: job.id,
		jobName: job.name,
		error: result.error,
		diagnosticsSummary: job.state.lastDiagnosticSummary
	}, "cron: job run returned error status");
	const deliveryState = result.deliveryState ?? resolveDeliveryState({
		job,
		runStatus: result.status,
		delivery: result.delivery,
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		error: result.deliveryError ?? result.error,
		deliverySuppressionReason: result.deliverySuppressionReason
	});
	job.state.lastDelivered = deliveryState.delivered;
	job.state.lastDeliveryStatus = deliveryState.status;
	job.state.deliverySuppressionReason = deliveryState.deliverySuppressionReason;
	job.state.lastDeliveryError = deliveryState.error;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "not-requested";
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.updatedAtMs = result.endedAt;
	const completionStatus = result.completionStatus ?? resolveAdmittedCronCompletionStatus(job, result.status, deliveryState.status, deliveryState.deliverySuppressionReason);
	const previousConsecutiveErrors = job.state.consecutiveErrors ?? 0;
	const computeNaturalNext = (restartInterval) => {
		try {
			return restartInterval && job.schedule.kind === "every" ? computeNextRunAtMs(job.schedule, result.endedAt) : computeJobNextRunAtMs(job, result.endedAt);
		} catch (err) {
			recordScheduleComputeError({
				state,
				job,
				err,
				deferredNotifications: opts.deferredNotifications
			});
			return;
		}
	};
	const alertConfig = resolveFailureAlert(state, job);
	if (result.status === "error") {
		job.state.consecutiveErrors = (job.state.consecutiveErrors ?? 0) + 1;
		job.state.consecutiveSkipped = 0;
	} else if (result.status === "skipped") {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = (job.state.consecutiveSkipped ?? 0) + 1;
		if (alertConfig?.includeSkipped && !opts.replay) maybeEmitFailureAlert(state, {
			job,
			alertConfig,
			status: "skipped",
			error: result.error,
			runAtMs: result.startedAt,
			consecutiveCount: job.state.consecutiveSkipped,
			deferredNotifications: opts.deferredNotifications
		});
	} else {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = 0;
		if (completionStatus === "succeeded") job.state.lastFailureAlertAtMs = void 0;
	}
	const scheduleOwnershipAtMs = opts.scheduleOwnershipAtMs ?? result.startedAt;
	const oneShotOccurrenceAtMs = resolveManualOneShotOccurrenceAtMs(job, scheduleOwnershipAtMs);
	const preserveOneShotSchedule = opts.scheduleMode === "preserve" && oneShotOccurrenceAtMs !== void 0;
	const ownsSchedule = opts.scheduleOwnership !== "stale";
	const isOneShotSchedule = job.schedule.kind === "at" || job.schedule.kind === "on-exit";
	const shouldDelete = ownsSchedule && isOneShotSchedule && !preserveOneShotSchedule && job.deleteAfterRun === true && completionStatus === "succeeded";
	let autoDisableNotificationOwnsFailure = false;
	const applyReplaySchedule = () => {
		const nextRunAtMs = job.state.autoDisabled ? void 0 : opts.replaySchedule?.nextRunAtMs;
		job.state.nextRunAtMs = nextRunAtMs === void 0 ? void 0 : scheduleNextRun(nextRunAtMs);
	};
	const finish = () => {
		if (opts.replaySchedule && job.schedule.kind !== "at") applyReplaySchedule();
		finalizeCronFailureNotifications(state, {
			job,
			alertConfig,
			result,
			completionStatus,
			autoDisableNotificationOwnsFailure,
			replay: opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
		return shouldDelete;
	};
	if (!ownsSchedule) {
		job.enabled = previousScheduleState.enabled;
		job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
		job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = previousScheduleState.forcePreservedNextRunAtMs;
	} else if (!shouldDelete) {
		if (preserveOneShotSchedule) {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = oneShotOccurrenceAtMs;
		} else if (opts.replaySchedule && job.schedule.kind === "at") {
			applyReplaySchedule();
			job.enabled = job.state.nextRunAtMs !== void 0;
		} else if (job.schedule.kind === "at" && isJobEnabled(job)) {
			if (shouldRetryDisabledHeartbeatOneShot(job, result)) {
				const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({
					cronConfig: state.deps.cronConfig,
					consecutiveSkipped: job.state.consecutiveSkipped
				});
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) state.deps.log.info({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						backoffMs: retryDecision.backoffMs,
						nextRunAtMs: job.state.nextRunAtMs
					}, "cron: scheduling one-shot retry after disabled heartbeat");
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						reason: retryDecision.reason
					}, "cron: disabling one-shot job after disabled heartbeat retries");
				}
			} else if (result.status === "ok" || result.status === "skipped") {
				job.enabled = false;
				job.state.nextRunAtMs = void 0;
			} else if (result.status === "error") {
				const retryDecision = resolveTransientCronRetryDecision({
					cronConfig: state.deps.cronConfig,
					error: result.error,
					errorClassification: result.errorClassification,
					lastErrorReason: job.state.lastErrorReason,
					executionStarted: result.executionStarted,
					consecutiveErrors: job.state.consecutiveErrors
				});
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) state.deps.log.info({
						jobId: job.id,
						jobName: job.name,
						consecutiveErrors: retryDecision.consecutiveErrors,
						backoffMs: retryDecision.backoffMs,
						nextRunAtMs: job.state.nextRunAtMs,
						retryCategory: retryDecision.retryCategory
					}, "cron: scheduling one-shot retry after transient error");
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveErrors: retryDecision.consecutiveErrors,
						error: result.error,
						reason: retryDecision.reason,
						retryCategory: retryDecision.retryCategory
					}, "cron: disabling one-shot job after error");
				}
			}
		} else if (opts.scheduleMode === "preserve") {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = previousScheduleState.nextRunAtMs;
		} else if (result.status === "error" && isJobEnabled(job) && maybeAutoDisableCronJobAfterRunFailure({
			job,
			atMs: result.endedAt,
			deferredNotifications: opts.deferredNotifications
		})) {
			autoDisableNotificationOwnsFailure = true;
			state.deps.log.error({
				jobId: job.id,
				name: job.name,
				consecutiveErrors: job.state.consecutiveErrors,
				error: result.error
			}, "cron: auto-disabled job after consecutive run failures");
		} else if (result.status === "error" && isJobEnabled(job)) {
			const retryDecision = resolveTransientCronRetryDecision({
				cronConfig: state.deps.cronConfig,
				error: result.error,
				errorClassification: result.errorClassification,
				lastErrorReason: job.state.lastErrorReason,
				executionStarted: result.executionStarted,
				consecutiveErrors: job.state.consecutiveErrors
			});
			let normalNext;
			let normalNextComputed = false;
			const computeNormalNext = () => {
				if (!normalNextComputed) {
					normalNext = computeNaturalNext(retryDecision.retryable || previousConsecutiveErrors > 0);
					normalNextComputed = true;
				}
				return normalNext;
			};
			if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
				normalNext = computeNormalNext();
				if (normalNext === void 0) {} else {
					const retryNextRunAtMs = scheduleNextRun(result.endedAt + retryDecision.backoffMs);
					if (retryNextRunAtMs === void 0) return finish();
					if (retryNextRunAtMs < normalNext) {
						state.deps.log.info({
							jobId: job.id,
							jobName: job.name,
							consecutiveErrors: retryDecision.consecutiveErrors,
							backoffMs: retryDecision.backoffMs,
							nextRunAtMs: job.state.nextRunAtMs,
							normalNextRunAtMs: normalNext,
							retryCategory: retryDecision.retryCategory
						}, "cron: scheduling recurring retry after transient error");
						return finish();
					}
				}
			}
			const backoff = errorBackoffMs(job.state.consecutiveErrors ?? 1, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			normalNext = computeNormalNext();
			if (normalNext === void 0 && job.schedule.kind === "every") {
				scheduleNextRun(void 0);
				return finish();
			}
			const backoffNext = scheduleNextRun(result.endedAt + backoff);
			if (backoffNext === void 0) return finish();
			job.state.nextRunAtMs = job.schedule.kind === "cron" ? resolveCronNextRunWithLowerBound({
				state,
				job,
				naturalNext: normalNext,
				lowerBoundMs: backoffNext,
				deferredNotifications: opts.deferredNotifications
			}) : normalNext !== void 0 ? Math.max(normalNext, backoffNext) : backoffNext;
			state.deps.log.info({
				jobId: job.id,
				consecutiveErrors: job.state.consecutiveErrors,
				backoffMs: backoff,
				nextRunAtMs: job.state.nextRunAtMs
			}, "cron: applying error backoff");
		} else if (isJobEnabled(job) && result.status === "ok" && job.pacing !== void 0 && result.nextCheck !== void 0) {
			const pacedNextRunAtMs = resolvePacedNextRunAtMs({
				nowMs: result.endedAt,
				delayMs: result.nextCheck.delayMs,
				pacing: job.pacing
			});
			const nextRunAtMs = scheduleNextRun(job.trigger ? Math.max(pacedNextRunAtMs ?? NaN, result.endedAt + Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs())) : pacedNextRunAtMs);
			job.state.pacedNextRunAtMs = nextRunAtMs;
		} else if (isJobEnabled(job)) {
			const naturalNext = computeNaturalNext(previousConsecutiveErrors > 0);
			if (job.schedule.kind === "cron") {
				const minNext = result.endedAt + Math.max(MIN_REFIRE_GAP_MS, job.trigger ? resolveCronTriggerMinIntervalMs() : 0);
				job.state.nextRunAtMs = resolveCronNextRunWithLowerBound({
					state,
					job,
					naturalNext,
					lowerBoundMs: minNext,
					deferredNotifications: opts.deferredNotifications
				});
			} else {
				const triggerNext = naturalNext !== void 0 && job.trigger ? Math.max(naturalNext, result.endedAt + resolveCronTriggerMinIntervalMs()) : naturalNext;
				job.state.nextRunAtMs = triggerNext;
				if (triggerNext !== void 0 || job.schedule.kind === "every") scheduleNextRun(triggerNext);
			}
		} else job.state.nextRunAtMs = void 0;
	}
	return finish();
}
/** Commits payload-script state only after the complete cron run succeeds. */
function applyScriptRunResult(job, result, opts) {
	if (opts?.triggerOwnership !== "stale" && result.status === "ok" && result.scriptStateChanged === true) job.state.triggerState = result.scriptState;
}
/** Applies a quiet trigger tick without mutating normal run-history state. */
function applyTriggerNoFireResult(state, job, result, opts) {
	const previousNextRunAtMs = job.state.nextRunAtMs;
	const previousPacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const previousForcePreservedNextRunAtMs = job.state.forcePreservedNextRunAtMs;
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.updatedAtMs = result.endedAt;
	if (!result.triggerEval.busy && opts.triggerOwnership !== "stale") {
		job.state.consecutiveErrors = 0;
		job.state.scheduleErrorCount = 0;
		applyTriggerEvaluationState(job, result.triggerEval, result.endedAt);
		maybeEmitFailureRecovery({
			job,
			alertConfig: resolveFailureAlert(state, job),
			triggerOnly: true,
			replay: opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
	}
	if (opts.scheduleMode === "immediate-preserve" || opts.scheduleMode === "stale-preserve") {
		job.state.nextRunAtMs = previousNextRunAtMs;
		job.state.pacedNextRunAtMs = previousPacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = opts.scheduleMode === "immediate-preserve" ? previousNextRunAtMs : previousForcePreservedNextRunAtMs;
		return;
	}
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	try {
		const naturalNext = computeJobNextRunAtMs(job, result.endedAt);
		const floorMs = Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs());
		job.state.nextRunAtMs = naturalNext;
		if (naturalNext !== void 0 || job.schedule.kind === "every") assignNextRunAtMs({
			state,
			job,
			candidate: naturalNext === void 0 ? void 0 : Math.max(naturalNext, result.endedAt + floorMs),
			deferredNotifications: opts.deferredNotifications
		});
	} catch (err) {
		recordScheduleComputeError({
			state,
			job,
			err,
			deferredNotifications: opts.deferredNotifications
		});
	}
}
function applyOutcomeToStoredJob(state, result, opts) {
	const store = state.store;
	if (!store) {
		tryFinishCronTaskRunWithoutHistory(state, result);
		return;
	}
	const jobs = store.jobs;
	const job = jobs.find((entry) => entry.id === result.jobId);
	if (!job || result.activeJobMarker?.jobRemoved === true) {
		if (result.status === "ok" && result.triggerEval?.fired === false) {
			tryFinishCronTaskRunWithoutHistory(state, result);
			return;
		}
		applyJobResult(state, result.job, result, {
			scheduleOwnership: "stale",
			deferredNotifications: opts.deferredNotifications
		});
		emitCronOutcomeForJob(state, result.job, result);
		state.deps.log.info({
			jobId: result.jobId,
			status: result.status
		}, "cron: finalized run after job was removed during execution");
		return;
	}
	if (applyOutcomeToAuthoritativeJob(state, job, result, opts)) {
		store.jobs = jobs.filter((entry) => entry.id !== job.id);
		return job;
	}
}
/** Applies one outcome to a row already re-read under the runtime write transaction. */
function applyOutcomeToAuthoritativeJob(state, job, result, opts) {
	const scheduleOwnership = resolveCronRunScheduleOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	const triggerOwnership = opts.triggerStateRetired ? "stale" : resolveCronRunTriggerOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) {
		applyTriggerNoFireResult(state, job, {
			startedAt: result.startedAt,
			endedAt: result.endedAt,
			triggerEval: result.triggerEval
		}, {
			scheduleMode: scheduleOwnership === "stale" ? "stale-preserve" : opts.request?.preserveCadence ? "immediate-preserve" : "advance",
			triggerOwnership,
			deferredNotifications: opts.deferredNotifications
		});
		if (!opts.request) job.state.startupCatchupAtMs = void 0;
		if (!opts.request && scheduleOwnership === "current") job.state.pacedNextRunAtMs = void 0;
		return false;
	}
	const shouldDelete = applyJobResult(state, job, result, {
		scheduleMode: opts.request?.preserveCadence && scheduleOwnership === "current" ? "preserve" : "advance",
		scheduleOwnership,
		scheduleOwnershipAtMs: opts.request?.scheduleOwnershipAtMs,
		deferredNotifications: opts.deferredNotifications
	});
	applyTriggerRunResult(job, result, {
		scheduleOwnership,
		triggerOwnership
	});
	applyScriptRunResult(job, result, { triggerOwnership });
	if (opts.request) {
		if (job.schedule.kind === "stream") job.state.nextRunAtMs = void 0;
	} else job.state.startupCatchupAtMs = void 0;
	if (opts.emit !== false) emitCronOutcomeForJob(state, job, result);
	return shouldDelete;
}
//#endregion
//#region src/cron/store/run-receipt-trigger-state.ts
const RETIREMENTS_TABLE = "cron_run_trigger_state_retirements";
function query(database) {
	return getNodeSqliteKysely(database);
}
function stateWriterQuery(database, handle) {
	return query(database).selectFrom("cron_run_receipts").where("cron_run_receipts.receipt_id", "=", handle.receiptId).where("cron_run_receipts.store_key", "=", handle.storeKey).where("cron_run_receipts.job_id", "=", handle.jobId).where("cron_run_receipts.started_at_ms", "=", handle.startedAtMs);
}
function ensureRetirementsTable(database) {
	if (tableExists(database, RETIREMENTS_TABLE)) return;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${RETIREMENTS_TABLE} (`);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start);
	if (start < 0 || end < start) throw new Error("OpenClaw cron run trigger-state retirement schema is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10));
}
/** Retires the exact pending state writer in the acknowledged edit's transaction. */
function retireCronRunTriggerStateInDatabase(params) {
	const { database, handle } = params;
	const receipt = executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).select(["receipt_id", "started_at_ms"]));
	if (!receipt) return;
	const job = loadedCronStoreFromRows(loadCronRows(database, handle.storeKey, /* @__PURE__ */ new Set([handle.jobId]))).store.jobs[0];
	if (job?.state.runningAtMs !== receipt.started_at_ms || job.state.runningReceiptId !== void 0 && job.state.runningReceiptId !== receipt.receipt_id) return;
	ensureRetirementsTable(database);
	executeSqliteQuerySync(database, query(database).insertInto(RETIREMENTS_TABLE).values({ receipt_id: receipt.receipt_id }).onConflict((conflict) => conflict.column("receipt_id").doNothing()));
}
/** Reads retirement after write admission without changing execution authority. */
function isCronRunTriggerStateRetiredInDatabase(params) {
	const { database, handle } = params;
	if (!tableExists(database, RETIREMENTS_TABLE)) return false;
	return executeSqliteQueryTakeFirstSync(database, stateWriterQuery(database, handle).innerJoin(RETIREMENTS_TABLE, `${RETIREMENTS_TABLE}.receipt_id`, "cron_run_receipts.receipt_id").select("cron_run_receipts.receipt_id")) !== void 0;
}
//#endregion
//#region src/cron/service/run-receipts.ts
function currentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
function resolveCronRunReceiptAgentId(state, job) {
	return resolveCronJobEffectiveAgentId(job, currentDefaultAgentId(state));
}
function resolveAgentId(state) {
	return (job) => resolveCronRunReceiptAgentId(state, job);
}
/** Both admission paths bind message permissions from the same canonical occurrence. */
function markServiceCronJobActive(state, job, runReceipt) {
	return markCronJobActive(job.id, {
		agentId: runReceipt.agentId,
		declarationKey: job.declarationKey,
		preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(job),
		isMessageActionAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageToolAuthorityInputs
		}),
		isMessageSourceAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageActionAuthorityInputs
		})
	});
}
/** Retains admission's permission facts while consulting the existing canonical receipt owner. */
function createServiceCronRunMessageAuthorityChecker(params) {
	const expected = params.resolveInputs(params.job);
	if (!expected) return;
	const { state, handle } = params;
	const admittedEnabled = isJobEnabled(params.job);
	return () => {
		let current;
		try {
			current = readCronRunReceiptCurrentJob({
				handle,
				resolveAgentId: resolveAgentId(state),
				isAgentAvailable: state.deps.isAgentAvailable
			});
		} catch (error) {
			if (error instanceof CronRunReceiptRevisionError) return false;
			throw error;
		}
		return current !== void 0 && (!admittedEnabled || isJobEnabled(current)) && isDeepStrictEqual(expected, params.resolveInputs(current));
	};
}
function prepareServiceCronRunReceiptClaim(params) {
	return prepareCronRunReceiptClaim({
		storePath: params.state.deps.storePath,
		job: params.job,
		agentId: resolveCronRunReceiptAgentId(params.state, params.job),
		startedAtMs: params.startedAtMs,
		requestRunId: params.requestRunId
	});
}
function claimServiceCronRunReceiptInDatabase(state, database, prepared) {
	return claimCronRunReceiptInDatabase({
		database,
		prepared,
		resolveAgentId: resolveAgentId(state)
	});
}
function activateServiceCronRunReceiptInDatabase(state, database, handle, startedAtMs) {
	return activateCronRunReceiptInDatabase({
		database,
		handle,
		startedAtMs,
		resolveAgentId: resolveAgentId(state)
	});
}
function cronRunReceiptOwnerMutationHooks(params) {
	const prepared = prepareCronRunReceiptAdjudication({
		storePath: params.state.deps.storePath,
		jobId: params.jobId,
		nowMs: params.state.deps.nowMs()
	});
	return { beforeWrite: (database) => {
		adjudicateActiveCronRunReceiptInDatabase({
			database,
			jobId: params.jobId,
			prepared,
			finishedAtMs: params.state.deps.nowMs()
		});
	} };
}
function cronRunReceiptMutationHooks(params) {
	const ownerHooks = params.ownerChanged ? cronRunReceiptOwnerMutationHooks(params) : void 0;
	if (!ownerHooks && !params.triggerStateChanged && !params.scheduleChangedJob && !params.messageActionAuthorityChanged && !params.messageSourceAuthorityChanged) return;
	return {
		...ownerHooks,
		beforeWrite: (database) => {
			if (params.scheduleChangedJob) {
				if (loadedCronStoreFromRows(loadCronRows(database, cronStoreKey(params.state.deps.storePath), /* @__PURE__ */ new Set([params.jobId]))).store.jobs[0]?.state.runningAtMs !== void 0) params.scheduleChangedJob.state.runningScheduleChangeId = randomUUID();
				else delete params.scheduleChangedJob.state.runningScheduleChangeId;
			}
			if (params.triggerStateChanged) retireServiceCronRunTriggerStateInDatabase({
				...params,
				database
			});
			ownerHooks?.beforeWrite?.(database);
		},
		afterCommit: () => {
			ownerHooks?.afterCommit?.();
			if (params.messageActionAuthorityChanged) noteActiveCronJobMessageActionAuthorityMutation(params.jobId);
			if (params.messageSourceAuthorityChanged) noteActiveCronJobMessageSourceAuthorityMutation(params.jobId);
			if (params.scheduleChangedJob) noteActiveCronJobScheduleMutation(params.jobId);
		}
	};
}
function retireServiceCronRunTriggerStateInDatabase(params) {
	const { database, jobId } = params;
	const storePath = params.state.deps.storePath;
	const active = findActiveCronRunReceiptInDatabase({
		database,
		storePath,
		jobId
	});
	if (active) {
		retireCronRunTriggerStateInDatabase({
			database,
			handle: active
		});
		return;
	}
	const storeKey = cronStoreKey(storePath);
	const job = loadedCronStoreFromRows(loadCronRows(database, storeKey, /* @__PURE__ */ new Set([jobId]))).store.jobs[0];
	const startedAtMs = job?.state.runningAtMs;
	if (!job || startedAtMs === void 0) return;
	const receiptId = job.state.runningReceiptId ?? findCronTaskRunRecoveryInDatabase({
		database,
		jobId,
		storeKey,
		startedAt: startedAtMs
	}).receiptId;
	if (receiptId) retireCronRunTriggerStateInDatabase({
		database,
		handle: {
			receiptId,
			storeKey,
			jobId,
			startedAtMs
		}
	});
}
function assertServiceCronRunReceiptCurrent(state, handle, activeJobMarker) {
	assertCronRunReceiptCurrent({
		handle,
		resolveAgentId: resolveAgentId(state),
		isAgentAvailable: state.deps.isAgentAvailable,
		allowMissingJob: activeJobMarker?.jobId === handle.jobId && isCronSelfRemovalCurrent(activeJobMarker)
	});
}
function resolveCronRunReceiptTerminalStatus(status, triggerFired) {
	if (status === "ok") return triggerFired === false ? "skipped" : "ok";
	return status === "skipped" ? "skipped" : "error";
}
function logReceiptFinishError(state, handle, error) {
	state.deps.log.warn({
		jobId: handle.jobId,
		err: String(error)
	}, "cron: failed to finalize run receipt after execution settlement");
}
function finishReceiptAfterCommit(state, terminal) {
	try {
		finishCronRunReceipt(terminal);
	} catch (error) {
		logReceiptFinishError(state, terminal.handle, error);
	}
}
function trackServiceCronRunReceiptSettlement(params) {
	trackCronRunReceiptSettlement({
		handle: params.handle,
		settlement: params.settlement,
		onFinishError: (error) => logReceiptFinishError(params.state, params.handle, error)
	});
}
function cronRunReceiptPersistHooks(params) {
	const terminal = params.terminal ? {
		handle: params.handle,
		status: resolveCronRunReceiptTerminalStatus(params.terminal.status, params.terminal.triggerFired),
		finishedAtMs: params.terminal.finishedAtMs,
		error: params.terminal.error
	} : void 0;
	const deferTerminal = terminal && isCronRunReceiptSettlementPending(params.handle);
	return {
		beforeWrite: (database) => {
			const unavailableError = describeUnavailableCronAgent(params.handle.agentId);
			const recordsUnavailableGuard = terminal?.status === "error" && params.terminal?.disposition === "owner-unavailable";
			if (params.state.deps.isAgentAvailable?.(params.handle.agentId) === false && !recordsUnavailableGuard) throw new CronRunReceiptRevisionError(params.handle.receiptId, unavailableError, "owner-unavailable");
			if (params.allowMissingJob) assertCronRunReceiptOwnedInDatabase({
				database,
				handle: params.handle
			});
			else assertCronRunReceiptCurrentInDatabase({
				database,
				handle: params.handle,
				resolveAgentId: resolveAgentId(params.state)
			});
		},
		...terminal && !deferTerminal ? { afterWrite: (database) => {
			finishCronRunReceiptInDatabase({
				database,
				...terminal
			});
		} } : {},
		...terminal && deferTerminal ? { afterCommit: () => finishReceiptAfterCommit(params.state, terminal) } : {}
	};
}
function cronRunReceiptSupersedeHooks(params) {
	const terminal = {
		handle: params.handle,
		status: "superseded",
		finishedAtMs: params.finishedAtMs,
		error: params.error
	};
	if (isCronRunReceiptSettlementPending(params.handle)) return { afterCommit: () => finishReceiptAfterCommit(params.state, terminal) };
	return { afterWrite: (database) => {
		finishCronRunReceiptInDatabase({
			database,
			...terminal
		});
	} };
}
function supersedeServiceCronRunReceipt(handle, finishedAtMs, error) {
	finishCronRunReceipt({
		handle,
		status: "superseded",
		finishedAtMs,
		error
	});
}
//#endregion
//#region src/cron/service/startup-run-repair.ts
/** Repairs interrupted and finalized cron runs while the service starts. */
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
function resolveOneShotReplacementAtMs(job, runningAtMs) {
	if (job.schedule.kind !== "at" || !job.enabled) return;
	const nextRunAtMs = job.state.nextRunAtMs;
	if (typeof nextRunAtMs !== "number" || nextRunAtMs <= runningAtMs) return;
	return parseAbsoluteTimeMs(job.schedule.at) === nextRunAtMs ? nextRunAtMs : void 0;
}
function markInterruptedStartupRun(params) {
	const { job, runningAtMs, nowMs } = params;
	const replacementAtMs = resolveOneShotReplacementAtMs(job, runningAtMs);
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
	finalizeCronFailureNotifications(params.state, {
		job,
		alertConfig,
		result: {
			status: "error",
			error: STARTUP_INTERRUPTED_ERROR,
			startedAt: runningAtMs
		},
		completionStatus: "failed",
		autoDisableNotificationOwnsFailure,
		deferredNotifications: params.deferredNotifications
	});
	if (job.schedule.kind === "at" && replacementAtMs === void 0 && !params.recoverInterruptedOneShot) job.enabled = false;
	return {
		jobId: job.id,
		...params.taskRunId ? { taskRunId: params.taskRunId } : {},
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
	const replacementAtMs = resolveOneShotReplacementAtMs(job, startedAt);
	const persistedNextRunAtMs = asDateTimestampMs(job.state.nextRunAtMs);
	const scheduleOwnership = typeof job.state.runningScheduleChangeId === "string" || job.schedule.kind === "at" && (!job.enabled || persistedNextRunAtMs !== void 0 && persistedNextRunAtMs > startedAt) ? "stale" : "current";
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
	}, "cron: restored finalized task-ledger run on startup");
	return {
		shouldDelete,
		...replacementAtMs === void 0 ? {} : { replacementAtMs }
	};
}
//#endregion
export { MIN_REFIRE_GAP_MS as A, cronFailureNotificationEventContext as B, resolveNextRunAtMsOrDisable as C, DEFAULT_MISSED_JOB_STAGGER_MS as D, recordCronOutcomeForJob as E, tryCreateCronTaskRunHandle as F, isImmediateCronRunMode as H, tryFinishCronTaskRun as I, tryFinishCronTaskRunWithoutHistory as L, runsDetachedFromMainSession as M, createCronOwnerExecutionIdentityAdmission as N, DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS as O, findCronTaskRunRecoveryInDatabase as P, tryUpdateCronTaskRunSession as R, resolveDeliveryState as S, emitCronOutcomeEventForJob as T, emit as V, applyOutcomeToAuthoritativeJob as _, assertServiceCronRunReceiptCurrent as a, normalizeQueuedSystemEventHandle as b, cronRunReceiptPersistHooks as c, prepareServiceCronRunReceiptClaim as d, resolveCronRunReceiptTerminalStatus as f, applyJobResult as g, isCronRunTriggerStateRetiredInDatabase as h, activateServiceCronRunReceiptInDatabase as i, resolveMainSessionCronDeliveryContext as j, MAX_CRON_TIMER_DELAY_MS as k, cronRunReceiptSupersedeHooks as l, trackServiceCronRunReceiptSettlement as m, markInterruptedStartupRun as n, claimServiceCronRunReceiptInDatabase as o, supersedeServiceCronRunReceipt as p, restoreFinalizedStartupRun as r, cronRunReceiptMutationHooks as s, STARTUP_INTERRUPTED_ERROR as t, markServiceCronJobActive as u, applyOutcomeToStoredJob as v, createCronOutcomeEvent as w, removeQueuedSystemEventHandle as x, isScheduledTerminalOneShotRetry as y, createCronServiceState as z };
