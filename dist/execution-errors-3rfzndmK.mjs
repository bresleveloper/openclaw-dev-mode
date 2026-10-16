import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { n as formatErrorMessageWithCode } from "./errors-O33D01XW.mjs";
import { et as CRON_JOB_EXECUTION_TIMEOUT_ERROR, nt as CRON_SETUP_TIMEOUT_ERROR, rt as isCronTimeoutErrorText, tt as CRON_PRE_EXECUTION_TIMEOUT_ERROR } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
//#region src/agents/embedded-agent-runner/execution-phase.ts
/**
* Ordered execution milestones reported by the embedded runner while a turn starts up.
*
* Keep labels stable: external status surfaces and diagnostics consume the formatted values.
*/
const EMBEDDED_AGENT_EXECUTION_PHASE_LABELS = {
	runner_entered: "runner-entered",
	workspace: "workspace",
	runtime_plugins: "runtime-plugins",
	before_agent_reply: "before-agent-reply",
	model_resolution: "model-resolution",
	auth: "auth",
	context_engine: "context-engine",
	attempt_dispatch: "attempt-dispatch",
	context_assembled: "context-assembled",
	turn_accepted: "turn-accepted",
	process_spawned: "process-spawned",
	tool_execution_started: "tool-execution-started",
	assistant_output_started: "assistant-output-started",
	model_call_started: "model-call-started"
};
function formatEmbeddedAgentExecutionPhase(phase) {
	return phase ? EMBEDDED_AGENT_EXECUTION_PHASE_LABELS[phase] : void 0;
}
//#endregion
//#region src/cron/service/execution-errors.ts
/** Formats stable cron timeout and execution error messages. */
function formatCronTimeoutMessage(message, execution) {
	const phase = formatEmbeddedAgentExecutionPhase(execution?.phase);
	return phase ? `${message} (last phase: ${phase})` : message;
}
function isCronTerminalAbortReasonText(error) {
	return isCronTimeoutErrorText(error);
}
/** Formats the generic cron execution timeout message with last-known phase context when available. */
function timeoutErrorMessage(execution) {
	return formatCronTimeoutMessage(CRON_JOB_EXECUTION_TIMEOUT_ERROR, execution);
}
/** Formats timeout text for runs that stalled before the isolated runner started. */
function setupTimeoutErrorMessage(execution) {
	return formatCronTimeoutMessage(CRON_SETUP_TIMEOUT_ERROR, execution);
}
/** Returns true for the setup-timeout class that fires before the isolated runner starts. */
function isSetupTimeoutErrorText(error) {
	return error === "cron: isolated agent setup timed out before runner start" || error.startsWith("cron: isolated agent setup timed out before runner start ");
}
/** Formats timeout text for runs that stalled after setup but before execution start. */
function preExecutionTimeoutErrorMessage(execution) {
	return formatCronTimeoutMessage(CRON_PRE_EXECUTION_TIMEOUT_ERROR, execution);
}
/** Extracts a human timeout/abort reason, falling back to the canonical cron timeout text. */
function resolveCronAbortReasonText(reason) {
	if (typeof reason === "string" && reason.trim()) return reason.trim();
	if (reason instanceof Error) {
		const message = reason.message.trim();
		if (extractErrorCode(reason) === void 0 && (!message || message === timeoutErrorMessage())) return;
		return formatErrorMessageWithCode(reason);
	}
}
/** Extracts a human timeout/abort reason, falling back to the canonical cron timeout text. */
function abortErrorMessage(signal) {
	return resolveCronAbortReasonText(signal?.reason) ?? timeoutErrorMessage();
}
/** Normalizes thrown cron run failures into stable log/run-history text. */
function normalizeCronRunErrorText(err) {
	if (err instanceof Error && (err.name === "AbortError" || err.message.trim() === timeoutErrorMessage())) return resolveCronAbortReasonText(err) ?? timeoutErrorMessage();
	return formatErrorMessageWithCode(err);
}
//#endregion
export { preExecutionTimeoutErrorMessage as a, timeoutErrorMessage as c, normalizeCronRunErrorText as i, isCronTerminalAbortReasonText as n, resolveCronAbortReasonText as o, isSetupTimeoutErrorText as r, setupTimeoutErrorMessage as s, abortErrorMessage as t };
