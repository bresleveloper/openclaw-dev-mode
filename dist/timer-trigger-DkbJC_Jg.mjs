import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { st as isCronTimeoutErrorText } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as createCronSourceIdentity } from "./source-schedule-49zenZxx.mjs";
import { a as hasCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { a as errorBackoffMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, x as resolveNextRunAtMsOrDisable } from "./jobs-scheduling-sefIqbJ3.mjs";
import { t as resolveCronDeliveryPlan } from "./delivery-plan-BCh_72BD.mjs";
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
async function resolveMainSessionCronDeliveryContext(state, job) {
	const targetSessionKey = job.sessionKey?.trim();
	if (!targetSessionKey) return;
	const explicitAgentId = job.agentId?.trim();
	const agentId = normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(targetSessionKey, state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId));
	const storePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
	if (!storePath) return;
	try {
		const sessionEntry = await readSessionEntryReadOnlyInWorker({
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
		if (job.schedule.kind === "stream") job.state.streamSourceIdentity = createCronSourceIdentity();
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
/**
* True when a scheduled quick re-run targets a provider outage, so the failure alert and
* owner repair wait for it. Provider transport failures (DNS, refused connections, request
* timeouts) classify as `timeout`. Failures the job owns are not held: its scripts, command
* payloads, and cron's own execution watchdog usually need the owner repair promptly.
*/
function holdsFailureNotificationForRetry(job, result, category) {
	if (category === void 0 || result.failureNotificationDetail?.kind === "script-failure") return false;
	return category !== "timeout" || job.payload.kind !== "command" && !isCronTimeoutErrorText(result.error);
}
function resolveTransientCronRetryDecision(params) {
	if (params.errorClassification?.kind === "aborted") return {
		retryable: false,
		consecutiveErrors: params.consecutiveErrors ?? 0,
		reason: "aborted"
	};
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
export { removeQueuedSystemEventHandle as a, resolveDisabledHeartbeatOneShotRetryDecision as c, DEFAULT_MISSED_JOB_STAGGER_MS as d, DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS as f, runsDetachedFromMainSession as g, resolveMainSessionCronDeliveryContext as h, normalizeQueuedSystemEventHandle as i, resolveTransientCronRetryDecision as l, MIN_REFIRE_GAP_MS as m, applyTriggerRunResult as n, resolveCronNextRunWithLowerBound as o, MAX_CRON_TIMER_DELAY_MS as p, holdsFailureNotificationForRetry as r, resolveDeliveryState as s, applyTriggerEvaluationState as t, shouldRetryDisabledHeartbeatOneShot as u };
