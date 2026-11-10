import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { at as CRON_SETUP_TIMEOUT_ERROR, it as CRON_PRE_EXECUTION_TIMEOUT_ERROR, rt as CRON_JOB_EXECUTION_TIMEOUT_ERROR, st as isCronTimeoutErrorText } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
//#region src/agents/embedded-agent-runner/execution-phase.ts
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
/** The controller owns whether an interruption was a watchdog timeout or a cancellation. */
function cronAbortErrorClassification(signal) {
	return !signal || signal.reason instanceof Error && signal.reason.name === "TimeoutError" ? {
		kind: "reason",
		reason: "timeout"
	} : { kind: "aborted" };
}
/** Normalizes thrown cron run failures into stable log/run-history text. */
function normalizeCronRunErrorText(err) {
	if (err instanceof Error && (err.name === "AbortError" || err.message.trim() === timeoutErrorMessage())) return resolveCronAbortReasonText(err) ?? timeoutErrorMessage();
	return formatErrorMessageWithCode(err);
}
//#endregion
export { normalizeCronRunErrorText as a, setupTimeoutErrorMessage as c, isSetupTimeoutErrorText as i, timeoutErrorMessage as l, cronAbortErrorClassification as n, preExecutionTimeoutErrorMessage as o, isCronTerminalAbortReasonText as r, resolveCronAbortReasonText as s, abortErrorMessage as t };
