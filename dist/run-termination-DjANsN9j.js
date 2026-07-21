import { o as isFailoverError } from "./failover-error-B2zFYEnG.js";
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
const AGENT_RUN_DIRECT_ABORT_ERROR_CODE = "OPENCLAW_DIRECT_ABORT";
function createAgentRunDirectAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_ABORTED_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_DIRECT_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunDirectAbortReason(value) {
	return value instanceof Error && "code" in value && value.code === AGENT_RUN_DIRECT_ABORT_ERROR_CODE;
}
function createAgentRunRestartAbortError() {
	const error = /* @__PURE__ */ new Error("agent run aborted for restart");
	error.name = "AbortError";
	error.code = AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunRestartAbortReason(value) {
	try {
		return value instanceof Error && "code" in value && value.code === AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	} catch {
		return false;
	}
}
function isAgentRunTimeoutAbortReason(value) {
	if (!value || typeof value !== "object") return false;
	try {
		return "name" in value && value.name === "TimeoutError";
	} catch {
		return false;
	}
}
function resolveAgentRunAbortLifecycleFields(signal) {
	if (!signal?.aborted) return {};
	return {
		aborted: true,
		stopReason: isAgentRunRestartAbortReason(signal.reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : isAgentRunTimeoutAbortReason(signal.reason) ? "timeout" : AGENT_RUN_ABORTED_STOP_REASON
	};
}
function isProviderTimeoutError(error) {
	try {
		const candidate = isFailoverError(error) ? error : error instanceof Error ? error.cause : void 0;
		return isFailoverError(candidate) && candidate.reason === "timeout";
	} catch {
		return false;
	}
}
/** Preserve structured provider watchdog timeouts when no abort signal was raised. */
function resolveAgentRunErrorLifecycleFields(error, signal) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	if (!isProviderTimeoutError(error)) return {};
	return {
		stopReason: "timeout",
		timeoutPhase: "provider"
	};
}
/** Returns whether a stop reason is the stable aborted-run reason. */
function isAbortedAgentStopReason(value) {
	return value === AGENT_RUN_ABORTED_STOP_REASON || value === "restart";
}
//#endregion
export { isAbortedAgentStopReason as a, resolveAgentRunAbortLifecycleFields as c, createAgentRunRestartAbortError as i, resolveAgentRunErrorLifecycleFields as l, AGENT_RUN_RESTART_ABORT_STOP_REASON as n, isAgentRunDirectAbortReason as o, createAgentRunDirectAbortError as r, isAgentRunRestartAbortReason as s, AGENT_RUN_ABORTED_ERROR as t };
