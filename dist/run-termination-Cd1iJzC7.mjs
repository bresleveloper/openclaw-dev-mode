import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { a as isFailoverError, n as findErrorProperty, o as isSignalTimeoutReason } from "./error-ON38hPhx.mjs";
import { c as normalizeAgentRunTimeoutPhase, l as normalizeProviderStarted, n as AGENT_RUN_RESTART_ABORT_STOP_REASON, r as AGENT_RUN_SUPERSEDED_STOP_REASON, t as AGENT_RUN_ABORTED_STOP_REASON } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
//#region src/agents/run-termination.ts
/**
* Shared agent run termination constants.
*
* Runtime and stream consumers use these stable literals to recognize user or
* controller aborts without matching free-form error text.
*/
/** Error text used for aborted agent runs. */
const AGENT_RUN_ABORTED_ERROR = "agent run aborted";
/** Error text used for agent runs aborted by a gateway restart. */
const AGENT_RUN_RESTART_ABORT_ERROR = "agent run aborted for restart";
const AGENT_RUN_SUPERSEDED_ERROR = "agent run superseded by a newer session writer";
/**
* Transports copy this code onto the persisted assistant message via
* `errorCode`, so restart recovery can recognize its own abort without matching
* free-form provider error text.
*/
const AGENT_RUN_RESTART_ABORT_ERROR_CODE = "OPENCLAW_RESTART_ABORT";
const AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE = "AGENT_RUN_SUPERSEDED_ABORT";
const AGENT_RUN_DIRECT_ABORT_ERROR_CODE = "OPENCLAW_DIRECT_ABORT";
function createAgentRunDirectAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_ABORTED_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_DIRECT_ABORT_ERROR_CODE;
	return error;
}
function hasAgentRunAbortCode(value, code) {
	try {
		return value instanceof Error && "code" in value && value.code === code;
	} catch {
		return false;
	}
}
function isAgentRunDirectAbortReason(value) {
	return hasAgentRunAbortCode(value, AGENT_RUN_DIRECT_ABORT_ERROR_CODE);
}
function createAgentRunRestartAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_RESTART_ABORT_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	return error;
}
function createAgentRunSupersededAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_SUPERSEDED_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunRestartAbortReason(value) {
	return hasAgentRunAbortCode(value, AGENT_RUN_RESTART_ABORT_ERROR_CODE);
}
function isAgentRunSupersededAbortReason(value) {
	return collectNestedErrorCandidates(value).some((candidate) => hasAgentRunAbortCode(candidate, AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE));
}
function throwAgentRunRestartAbortReason(value) {
	if (isAgentRunRestartAbortReason(value)) throw value;
}
const SESSION_PLACEMENT_TURN_SETTLEMENT_CLOSED_ERROR_CODE = "SESSION_PLACEMENT_TURN_SETTLEMENT_CLOSED";
/** Mark loss of the turn's settlement lifetime without asserting a successor exists. */
function createSessionPlacementSettlementClosedAbortError() {
	return Object.assign(/* @__PURE__ */ new Error("session placement turn settlement is closed"), {
		name: "AbortError",
		code: SESSION_PLACEMENT_TURN_SETTLEMENT_CLOSED_ERROR_CODE
	});
}
/** Recognize the owner's typed marker through error wrappers, never display text. */
function isSessionPlacementSettlementClosedError(value) {
	return collectNestedErrorCandidates(value).some((candidate) => hasAgentRunAbortCode(candidate, SESSION_PLACEMENT_TURN_SETTLEMENT_CLOSED_ERROR_CODE));
}
function resolveAgentRunAbortLifecycleFields(signal) {
	if (!signal?.aborted) return {};
	return {
		aborted: true,
		stopReason: isAgentRunRestartAbortReason(signal.reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : isAgentRunSupersededAbortReason(signal.reason) ? AGENT_RUN_SUPERSEDED_STOP_REASON : isSignalTimeoutReason(signal.reason) ? "timeout" : AGENT_RUN_ABORTED_STOP_REASON
	};
}
function resolveRunErrorTimeout(error) {
	try {
		const timeout = findErrorProperty(error, (candidate) => isFailoverError(candidate) ? candidate.timeout : isSignalTimeoutReason(candidate) ? { timeoutPhase: "provider" } : void 0);
		if (!timeout) return;
		const timeoutPhase = normalizeAgentRunTimeoutPhase(timeout.timeoutPhase);
		const providerStarted = normalizeProviderStarted(timeout.providerStarted);
		return {
			...timeoutPhase ? { timeoutPhase } : {},
			...providerStarted !== void 0 ? { providerStarted } : {}
		};
	} catch {
		return;
	}
}
/** Preserve recorded run timeouts when no caller abort signal was raised. */
function resolveAgentRunErrorLifecycleFields(error, signal) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	if (isAgentRunDirectAbortReason(error)) return {
		aborted: true,
		stopReason: "aborted"
	};
	if (isAgentRunRestartAbortReason(error)) return {
		aborted: true,
		stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
	};
	if (isAgentRunSupersededAbortReason(error)) return {
		aborted: true,
		stopReason: AGENT_RUN_SUPERSEDED_STOP_REASON
	};
	const timeout = resolveRunErrorTimeout(error);
	return timeout ? {
		stopReason: "timeout",
		...timeout
	} : {};
}
/**
* CLI tool terminal reason for one-shot and live runners.
* Abort-signal lifecycle is authoritative so a timeout abort stays timed_out
* even when the delivered error is a generic AbortError.
*/
function resolveCliToolTerminalReason(params) {
	const terminal = resolveAgentRunErrorLifecycleFields(params.error, params.abortSignal);
	if (terminal.stopReason === "timeout") return "timed_out";
	if (terminal.aborted) return "cancelled";
	const { error } = params;
	try {
		if (error instanceof Error && error.name === "AbortError") return "cancelled";
	} catch {}
	return "failed";
}
//#endregion
export { createAgentRunDirectAbortError as a, createSessionPlacementSettlementClosedAbortError as c, isAgentRunSupersededAbortReason as d, isSessionPlacementSettlementClosedError as f, throwAgentRunRestartAbortReason as g, resolveCliToolTerminalReason as h, AGENT_RUN_SUPERSEDED_ERROR as i, isAgentRunDirectAbortReason as l, resolveAgentRunErrorLifecycleFields as m, AGENT_RUN_RESTART_ABORT_ERROR as n, createAgentRunRestartAbortError as o, resolveAgentRunAbortLifecycleFields as p, AGENT_RUN_RESTART_ABORT_ERROR_CODE as r, createAgentRunSupersededAbortError as s, AGENT_RUN_ABORTED_ERROR as t, isAgentRunRestartAbortReason as u };
