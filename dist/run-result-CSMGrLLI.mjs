import { H as cronRunLogEntryToDetail, V as cronQuietTriggerDetail, q as cronRunStorageStatus } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { t as failureNotificationDeliveryFromJobState } from "./failure-alerts-Cgi3Ds94.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-D_A9m8Ck.mjs";
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
//#region src/cron/store/run-result.ts
/** The persisted terminal fact and the published event describe the same result. */
function cronRunResultEvent(job, result) {
	const quiet = result.status === "ok" && result.triggerEval?.fired === false;
	return {
		jobId: job.id,
		action: "finished",
		job,
		status: quiet ? "skipped" : result.status,
		completionStatus: quiet ? "failed" : result.completionStatus,
		error: quiet ? "queued manual run skipped: trigger condition not met" : result.error,
		summary: quiet ? void 0 : result.summary,
		diagnostics: result.diagnostics,
		delivered: result.deliveryState.delivered,
		deliveryStatus: result.deliveryState.status,
		deliveryError: result.deliveryState.error,
		deliverySuppressionReason: result.deliveryState.deliverySuppressionReason,
		failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
		delivery: result.delivery,
		sessionId: result.sessionId,
		sessionKey: result.sessionKey,
		runId: result.request?.runId,
		runAtMs: result.startedAt,
		durationMs: Math.max(0, result.endedAt - result.startedAt),
		nextRunAtMs: job.state.nextRunAtMs,
		...result.triggerEval?.fired ? { triggerFired: true } : {},
		model: result.model,
		provider: result.provider,
		usage: result.usage
	};
}
function cronRunResultHistory(storeKey, job, result, defaultAgentId) {
	const quiet = result.status === "ok" && result.triggerEval?.fired === false;
	const entry = cronRunLogEntryFromEvent(cronRunResultEvent(job, result), result.endedAt, result.errorClassification);
	return {
		storeKey,
		jobId: result.jobId,
		runId: result.taskRunId ?? `${createCronExecutionId(result.jobId, result.startedAt)}:${result.runReceipt?.receiptId ?? result.request?.runId ?? "terminal"}`,
		agentId: result.runReceipt?.agentId ?? tryResolveCronJobEffectiveAgentId(result.job, defaultAgentId),
		startedAt: result.startedAt,
		endedAt: result.endedAt,
		sessionKey: result.sessionKey,
		status: quiet && !result.request?.runId ? "succeeded" : cronRunStorageStatus(entry),
		error: quiet && !result.request?.runId ? void 0 : entry.error,
		summary: entry.summary,
		detail: quiet && !result.request?.runId && result.triggerEval ? cronQuietTriggerDetail(storeKey, {
			...result.triggerEval,
			fired: false
		}) : cronRunLogEntryToDetail(entry, {
			storeKey,
			scriptResult: result,
			triggerEval: result.triggerEval
		})
	};
}
//#endregion
export { cronRunResultHistory as n, cronRunLogEntryFromEvent as r, cronRunResultEvent as t };
