import { o as isFailoverError } from "./error-Bcp4ZyOv.mjs";
import { r as formatErrorMessageForDisplay } from "./error-diagnostics-Cgksm9ND.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { o as isCliSessionInvalidatingFailoverReason } from "./cli-session-CBCjrsL6.mjs";
import { n as cliBackendLog } from "./log-wVbGxCir.mjs";
//#region src/agents/cli-runner/cli-run-recovery.ts
function resolveCliSessionId(reusableCliSession) {
	return reusableCliSession.mode === "reuse" || reusableCliSession.mode === "reuse-with-drift" ? reusableCliSession.sessionId : void 0;
}
const FRESH_SESSION_RECOVERY_CODES = {
	unknown: "cli_unknown_empty_failure",
	empty_response: "cli_unknown_empty_failure",
	format: "cli_synthetic_no_response",
	timeout: "cli_no_output_timeout",
	context_overflow: "cli_context_overflow"
};
function shouldRetryFreshCliSessionAfterFailover(params) {
	if (!params.hasHistoryPrompt) return false;
	if (params.recoveryPolicy === "invalidated-only" && !isCliSessionInvalidatingFailoverReason(params.error.reason)) return false;
	const code = FRESH_SESSION_RECOVERY_CODES[params.error.reason];
	return params.error.reason === "session_expired" || code !== void 0 && params.error.code === code;
}
/**
* Remaining retry budget measured against the run's monotonic anchor. Elapsed
* monotonic time is fractional, so the result is floored to a whole millisecond:
* this keeps the retry within the operator-configured budget and satisfies the
* paired-node remote decoder's `Number.isInteger` timeout contract.
*/
function remainingCliRecoveryBudgetMs(timeoutMs, startedMonotonicMs) {
	return Math.floor(timeoutMs - (performance.now() - startedMonotonicMs));
}
async function runCliRecovery(params) {
	const { context } = params;
	const runParams = context.params;
	const reusableCliSessionId = resolveCliSessionId(context.reusableCliSession);
	const resumeCheckpointId = runParams.cliSessionBinding?.resumeCheckpointId;
	let retryableSessionId = reusableCliSessionId;
	const onForkSuccessorPersisted = (sessionId) => {
		retryableSessionId = sessionId;
	};
	const failTerminal = async (error) => {
		cliBackendLog.warn(`cli terminal failure: provider=${runParams.provider} model=${context.modelId} durationMs=${Date.now() - context.started} runId=${runParams.runId} error=${formatErrorMessageForDisplay(error)}`);
		await params.onTerminalFailure(error);
		throw error;
	};
	try {
		return await params.finishAttempt(await params.executeAttempt(reusableCliSessionId, runParams.forkCliSessionOnResume ? { onForkSuccessorPersisted } : void 0), reusableCliSessionId);
	} catch (err) {
		const deliveredFailure = await params.finishDeliveredFailure(err, retryableSessionId !== reusableCliSessionId);
		if (deliveredFailure) return deliveredFailure;
		runParams.assertCurrent?.();
		let recoveryError = err;
		for (const forkResume of [true, false]) {
			if (!isFailoverError(recoveryError) || !retryableSessionId || !runParams.sessionKey) break;
			const prepareRetry = forkResume ? runParams.onBeforeForkedCliSessionRetry : runParams.onBeforeFreshCliSessionRetry;
			if (!(forkResume ? !runParams.forkCliSessionOnResume && recoveryError.reason === "timeout" && recoveryError.code === "cli_no_output_timeout" && resumeCheckpointId && context.preparedBackend.backend.forkArg && context.preparedBackend.backend.resumeAtArg && prepareRetry : shouldRetryFreshCliSessionAfterFailover({
				error: recoveryError,
				hasHistoryPrompt: Boolean(context.openClawHistoryPrompt),
				recoveryPolicy: context.preparedBackend.backend.freshSessionRecovery
			}))) continue;
			try {
				const retryTimeoutMs = remainingCliRecoveryBudgetMs(runParams.timeoutMs, context.startedMonotonicMs);
				if (retryTimeoutMs <= 0) throw recoveryError;
				if (prepareRetry && !await prepareRetry.call(runParams, {
					provider: runParams.provider,
					reason: recoveryError.reason,
					sessionId: retryableSessionId
				})) throw recoveryError;
				cliBackendLog.warn(`cli session recovery ${forkResume ? "fork" : "retry"}: provider=${runParams.provider} reason=${recoveryError.reason} sessionKey=${runParams.sessionKey}`);
				return await params.finishAttempt(await params.executeAttempt(forkResume ? retryableSessionId : void 0, {
					timeoutMs: retryTimeoutMs,
					forkCliSessionOnResume: forkResume,
					...forkResume ? {
						resumeAt: resumeCheckpointId,
						onForkSuccessorPersisted
					} : {}
				}));
			} catch (retryError) {
				const deliveredRetryFailure = await params.finishDeliveredFailure(retryError, retryableSessionId !== reusableCliSessionId);
				if (deliveredRetryFailure) return deliveredRetryFailure;
				if (!forkResume) return await failTerminal(retryError);
				runParams.assertCurrent?.();
				recoveryError = isFailoverError(retryError) && retryError.code === "cli_resume_at_unsupported" ? err : retryError;
			}
		}
		return await failTerminal(recoveryError);
	}
}
//#endregion
export { runCliRecovery as n, resolveCliSessionId as t };
