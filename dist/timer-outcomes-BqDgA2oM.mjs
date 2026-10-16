import { R as cronQuietTriggerDetail, W as cronRunStorageStatus, at as resolveCronCompletionStatus, it as resolveAdmittedCronCompletionStatus, z as cronRunLogEntryToDetail } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { h as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { v as cronSchedulingInputsEqual } from "./row-codec-DgIrj0Uv.mjs";
import { o as createCronStreamSourceIdentity } from "./normalize-Lu86QQtC.mjs";
import { n as resolvePacedNextRunAtMs } from "./pacing-BQDaWZD6.mjs";
import { a as hasCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { t as computeNextRunAtMs } from "./schedule-jzo1nALJ.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { n as createExecutionStartedOwnerBinding, r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-B_XQzuKd.mjs";
import { E as resolveManualOneShotOccurrenceAtMs, O as maybeAutoDisableCronJobAfterRunFailure, S as resolveNextRunAtMsOrDisable, a as errorBackoffMs, l as isJobEnabled, r as computeJobNextRunAtMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, v as recordScheduleComputeError } from "./jobs-scheduling-CBskypsm.mjs";
import { a as normalizeCronRunDiagnostics, o as summarizeCronRunDiagnostics } from "./run-diagnostics-D1nl-AS_.mjs";
import { t as toPublicCronJob } from "./public-job-C0Jx9vVK.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-1uq0obi_.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-BJwVIjPg.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as recordCronRun } from "./run-history-ctEZG5QO.mjs";
import { a as resolveFailureIncident, i as resolveFailureAlert, n as finalizeCronFailureNotifications, r as maybeEmitFailureAlert, t as failureNotificationDeliveryFromJobState } from "./failure-alerts-DGUv78dt.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/service/state.ts
function cronFailureNotificationEventContext(failureNotificationDetail) {
	return failureNotificationDetail ? { failureNotificationDetail } : void 0;
}
function createCronServiceState(deps) {
	const defaultAgentId = deps.defaultAgentId ?? (deps.resolveDefaultAgentId ? void 0 : "main");
	return {
		deps: {
			...deps,
			defaultAgentId,
			nowMs: deps.nowMs ?? (() => deps.scheduler.now())
		},
		store: null,
		durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
		timer: null,
		schedulerScope: deps.scheduler.scope(),
		schedulerDrain: Promise.resolve(),
		running: false,
		activeTimerTicks: 0,
		stopped: false,
		lifecycleGeneration: 0,
		schedulingPaused: false,
		schedulerStarted: false,
		activeManualRunJobIds: /* @__PURE__ */ new Set(),
		queuedManualRuns: /* @__PURE__ */ new Map(),
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
//#region src/cron/run-event-codec.ts
/** Write-side cron codec: converts a finished service event into a run-history entry.
* Kept separate from run-history-detail.ts so the read/history codec stays free of the
* agents failover tree (which transitively pulls the sandbox module graph). */
/** Uses execution timing for the timestamp shared by history and runtime state. */
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
	const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-RW5P1VzC.mjs"), import("./sqlite-worker-store-d0f4y8qR.mjs")]);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.bindReceiptExecution",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/cron/service/run-history.ts
/** Cron receipts own running work; history records only durable outcomes. */
/** Carries exact admission into the first post-admission owner lifecycle phase. */
function createCronOwnerExecutionIdentityAdmission(params) {
	const ownerBinding = createExecutionStartedOwnerBinding(async (admitted) => {
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
			if (receiptResult === "mismatch" || receiptResult === "missing") params.state.deps.log.warn({ receiptResult }, "cron: exact execution identity binding was not retained");
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
function createCronHistoryRunId(jobId, startedAt, receiptId, publicRunId) {
	const receipt = receiptId?.trim();
	const publicId = publicRunId?.trim();
	const discriminator = receipt || publicId || randomUUID();
	const publicSuffix = publicId && publicId !== discriminator ? `:${publicId}` : "";
	return `${createCronExecutionId(jobId, startedAt)}:${discriminator}${publicSuffix}`;
}
function createCronRunHandle(params) {
	return { runId: createCronHistoryRunId(params.job.id, params.startedAt, params.runReceipt?.receiptId, params.publicRunId) };
}
/** Quiet evaluations retain recovery state without appearing in cron.runs. */
async function recordQuietCronEvaluation(state, result) {
	if (!result.taskRunId || result.triggerEval?.fired !== false) return;
	if (!result.jobId || result.startedAt === void 0) throw new Error("Quiet cron outcome has no execution identity");
	const storeKey = cronStoreKey(state.deps.storePath);
	await persistCronOutcome(state, {
		storeKey,
		jobId: result.jobId,
		runId: result.taskRunId,
		startedAt: result.startedAt,
		endedAt: result.endedAt,
		agentId: result.job ? tryResolveCronJobEffectiveAgentId(result.job, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId) : void 0,
		sessionKey: result.childSessionKey ?? result.sessionKey,
		status: "succeeded",
		detail: cronQuietTriggerDetail(storeKey, {
			...result.triggerEval,
			fired: false
		})
	});
}
/** Join history persistence before settlement; a storage failure cannot strand a running receipt. */
async function finishCronRun(state, result) {
	const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs(), result.errorClassification);
	const startedAt = entry.runAtMs ?? entry.ts;
	const job = result.job ?? result.event.job;
	const source = result.historySource;
	source?.assertCurrent();
	const storeKey = source?.storeKey ?? cronStoreKey(state.deps.storePath);
	await persistCronOutcome(state, {
		storeKey,
		jobId: entry.jobId,
		runId: result.taskRunId ?? createCronHistoryRunId(entry.jobId, startedAt, void 0, entry.runId),
		agentId: !result.ownerlessRun && job ? tryResolveCronJobEffectiveAgentId(job, source ? source.defaultAgentId : state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId) : void 0,
		startedAt,
		endedAt: entry.ts,
		status: cronRunStorageStatus(entry),
		sessionKey: entry.sessionKey,
		error: entry.error,
		summary: entry.summary,
		detail: cronRunLogEntryToDetail(entry, {
			storeKey,
			scriptResult: result.scriptResult,
			triggerEval: result.triggerEval
		})
	}, source);
}
async function persistCronOutcome(state, input, source) {
	try {
		await recordCronRun(input, source);
	} catch (error) {
		state.deps.log.warn({
			jobId: input.jobId,
			runId: input.runId,
			error
		}, "cron: failed to persist run history");
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
function resolveDeliveryState(params) {
	const noFailureNotification = { status: "not-requested" };
	if (params.delivered === true && (params.runStatus !== "error" || params.delivery?.delivered === true)) return {
		delivered: true,
		status: "delivered",
		failureNotification: noFailureNotification
	};
	if (!hasCanonicalCronDeliveryMode(params.job.delivery)) return {
		status: "unknown",
		error: CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE,
		failureNotification: noFailureNotification
	};
	const primaryDeliveryPlan = resolveCronDeliveryPlan(params.job);
	if (!primaryDeliveryPlan.requested) {
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
//#region src/cron/service/timer-outcome-events.ts
/** Records a terminal task/event fact before the fallible runtime-row commit. */
async function emitCronOutcomeForJob(state, job, result) {
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) return;
	await recordCronOutcomeForJob(state, job, result);
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
		...result.request ? { runId: result.request.runId } : {},
		runAtMs: result.startedAt,
		durationMs: job.state.lastDurationMs,
		nextRunAtMs: job.state.nextRunAtMs,
		...result.triggerEval?.fired ? { triggerFired: true } : {},
		model: result.model,
		provider: result.provider,
		usage: result.usage
	};
}
async function recordCronOutcomeForJob(state, job, result) {
	const event = createCronOutcomeEvent(job, result);
	await finishCronRun(state, {
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
	if (result.request?.terminalTracker) result.request.terminalTracker.emitted = true;
}
async function emitCronRunFinished(state, evt, tracker, taskRunId, details) {
	const event = {
		...evt,
		completionStatus: evt.completionStatus ?? resolveCronCompletionStatus({
			status: evt.status,
			deliveryStatus: evt.deliveryStatus
		})
	};
	await finishCronRun(state, {
		taskRunId,
		job: evt.job,
		event,
		historySource: details?.historySource,
		errorClassification: details?.errorClassification,
		...details?.scriptResult ? { scriptResult: details.scriptResult } : {},
		...details?.triggerEval ? { triggerEval: details.triggerEval } : {}
	});
	details?.historySource?.assertCurrent();
	emit(state, event, cronFailureNotificationEventContext(details?.failureNotificationDetail));
	if (tracker) tracker.emitted = true;
}
/** Queued requests need an acknowledgement even when no payload outcome is published. */
async function emitMissingRequestedCronRunTerminal(state, result, required = false) {
	const request = result.request;
	if (!request || !request.terminalTracker && !required || request.terminalTracker?.emitted) return;
	const quiet = result.status === "ok" && result.triggerEval?.fired === false;
	const job = result.activeJobMarker?.jobRemoved === true ? request.executionJob : state.store?.jobs.find((entry) => entry.id === result.jobId);
	await emitCronRunFinished(state, {
		jobId: result.jobId,
		action: "finished",
		job,
		status: quiet ? "skipped" : result.status,
		completionStatus: quiet ? "failed" : result.completionStatus,
		error: quiet ? "queued manual run skipped: trigger condition not met" : result.error,
		deliveryError: result.deliveryState.error,
		deliverySuppressionReason: result.deliveryState.deliverySuppressionReason,
		summary: quiet ? void 0 : result.summary,
		diagnostics: result.diagnostics,
		delivered: result.deliveryState.delivered,
		deliveryStatus: result.deliveryState.status,
		delivery: result.delivery,
		sessionId: result.sessionId,
		sessionKey: result.sessionKey,
		runId: request.runId,
		runAtMs: result.startedAt,
		durationMs: Math.max(0, result.endedAt - result.startedAt),
		nextRunAtMs: job?.state.nextRunAtMs,
		model: result.model,
		provider: result.provider,
		usage: result.usage
	}, request.terminalTracker, result.taskRunId, {
		errorClassification: quiet ? void 0 : result.errorClassification,
		failureNotificationDetail: quiet ? void 0 : result.failureNotificationDetail
	});
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
	const silentReportedFailure = result.status === "error" && result.errorClassification?.kind === "permanent" && result.errorClassification.reportedByAgent === true && alertConfig === null && resolveCronDeliveryPlan(job).mode === "none";
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
		if (shouldDelete) job.state.nextRunAtMs = void 0;
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
				const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({ consecutiveSkipped: job.state.consecutiveSkipped });
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
		} else if (result.status === "error" && isJobEnabled(job) && !silentReportedFailure && maybeAutoDisableCronJobAfterRunFailure({
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
		resolveFailureIncident(job, { triggerOnly: true });
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
async function applyOutcomeToStoredJob(state, result, opts) {
	const store = state.store;
	if (!store) {
		if (result.status === "ok" && result.triggerEval?.fired === false) await recordQuietCronEvaluation(state, result);
		return;
	}
	const jobs = store.jobs;
	const job = jobs.find((entry) => entry.id === result.jobId);
	if (!job || result.activeJobMarker?.jobRemoved === true) {
		if (result.status === "ok" && result.triggerEval?.fired === false) {
			await recordQuietCronEvaluation(state, result);
			return;
		}
		applyJobResult(state, result.job, result, {
			scheduleOwnership: "stale",
			deferredNotifications: opts.deferredNotifications
		});
		await emitCronOutcomeForJob(state, result.job, result);
		state.deps.log.info({
			jobId: result.jobId,
			status: result.status
		}, "cron: finalized run after job was removed during execution");
		return;
	}
	const shouldDelete = applyOutcomeToAuthoritativeJob(state, job, result, opts);
	await emitCronOutcomeForJob(state, job, result);
	if (shouldDelete) {
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
	return shouldDelete;
}
//#endregion
export { finishCronRun as C, isImmediateCronRunMode as D, emit as E, createCronRunHandle as S, createCronServiceState as T, MAX_CRON_TIMER_DELAY_MS as _, applyTriggerNoFireResult as a, runsDetachedFromMainSession as b, emitCronRunFinished as c, applyTriggerRunResult as d, normalizeQueuedSystemEventHandle as f, DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS as g, DEFAULT_MISSED_JOB_STAGGER_MS as h, applyScriptRunResult as i, emitMissingRequestedCronRunTerminal as l, resolveDeliveryState as m, applyOutcomeToAuthoritativeJob as n, emitCronOutcomeEventForJob as o, removeQueuedSystemEventHandle as p, applyOutcomeToStoredJob as r, emitCronOutcomeForJob as s, applyJobResult as t, recordCronOutcomeForJob as u, MIN_REFIRE_GAP_MS as v, recordQuietCronEvaluation as w, createCronOwnerExecutionIdentityAdmission as x, resolveMainSessionCronDeliveryContext as y };
