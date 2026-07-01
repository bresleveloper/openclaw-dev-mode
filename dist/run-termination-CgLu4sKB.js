//#region src/agents/run-termination.ts
/**
* Shared agent run termination constants.
*
* Runtime and stream consumers use these stable literals to recognize user or
* controller aborts without matching free-form error text.
*/
/** Stop reason emitted when an agent run is aborted. */
const AGENT_RUN_ABORTED_STOP_REASON = "aborted";
/** Error text used for aborted agent runs. */
const AGENT_RUN_ABORTED_ERROR = "agent run aborted";
const AGENT_RUN_RESTART_ABORT_STOP_REASON = "restart";
const AGENT_RUN_RESTART_ABORT_ERROR_CODE = "OPENCLAW_RESTART_ABORT";
function createAgentRunRestartAbortError() {
	const error = /* @__PURE__ */ new Error("agent run aborted for restart");
	error.name = "AbortError";
	error.code = AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunRestartAbortReason(value) {
	return value instanceof Error && "code" in value && value.code === AGENT_RUN_RESTART_ABORT_ERROR_CODE;
}
function resolveAgentRunAbortLifecycleFields(signal) {
	if (!signal?.aborted) return {};
	return {
		aborted: true,
		stopReason: isAgentRunRestartAbortReason(signal.reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : signal.reason && typeof signal.reason === "object" && "name" in signal.reason && signal.reason.name === "TimeoutError" ? "timeout" : AGENT_RUN_ABORTED_STOP_REASON
	};
}
/** Returns whether a stop reason is the stable aborted-run reason. */
function isAbortedAgentStopReason(value) {
	return value === AGENT_RUN_ABORTED_STOP_REASON || value === "restart";
}
//#endregion
export { isAgentRunRestartAbortReason as a, isAbortedAgentStopReason as i, AGENT_RUN_RESTART_ABORT_STOP_REASON as n, resolveAgentRunAbortLifecycleFields as o, createAgentRunRestartAbortError as r, AGENT_RUN_ABORTED_ERROR as t };
