import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
//#region packages/normalization-core/src/agent-run-terminal-outcome.ts
const AGENT_RUN_ABORTED_STOP_REASON = "aborted";
const AGENT_RUN_RESTART_ABORT_STOP_REASON = "restart";
const AGENT_RUN_SUPERSEDED_STOP_REASON = "superseded";
const AGENT_RUN_TIMEOUT_PHASES = [
	"queue",
	"preflight",
	"provider",
	"post_turn",
	"gateway_draining"
];
const HARD_TIMEOUT_PHASES = /* @__PURE__ */ new Set([
	"preflight",
	"provider",
	"post_turn"
]);
const AGENT_RUN_TERMINAL_CLASSIFICATION = {
	completed: "success",
	hard_timeout: "timeout",
	timed_out: "timeout",
	superseded: "cancellation",
	cancelled: "cancellation",
	aborted: "cancellation",
	blocked: "failure",
	abandoned: "failure",
	failed: "failure"
};
function normalizeAgentRunTimeoutPhase(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	return AGENT_RUN_TIMEOUT_PHASES.find((phase) => phase === normalized);
}
function normalizeProviderStarted(value) {
	return typeof value === "boolean" ? value : void 0;
}
function isAbortedAgentStopReason(value) {
	return value === "aborted" || value === "restart";
}
function classifyAgentRunTerminalOutcome(outcome) {
	return AGENT_RUN_TERMINAL_CLASSIFICATION[outcome.reason];
}
function isCancellationStopReason(value) {
	return value === "rpc" || value === "stop";
}
/** Interprets terminal metadata without runtime abort, error formatting, or storage ownership. */
function resolveAgentRunTerminalFacts(input) {
	const stopReason = readNonBlankString(input.stopReason);
	const livenessState = readNonBlankString(input.livenessState);
	const timeoutPhase = normalizeAgentRunTimeoutPhase(input.timeoutPhase);
	const providerStarted = normalizeProviderStarted(input.providerStarted);
	const restartCancelled = stopReason === AGENT_RUN_RESTART_ABORT_STOP_REASON;
	const hardTimeout = timeoutPhase !== void 0 && HARD_TIMEOUT_PHASES.has(timeoutPhase) || !restartCancelled && input.status === "timeout" && providerStarted === true;
	const cancelled = restartCancelled || input.status !== "ok" && isCancellationStopReason(stopReason);
	const normalizedLiveness = livenessState?.trim().toLowerCase();
	const reason = hardTimeout ? "hard_timeout" : stopReason === "superseded" ? "superseded" : normalizedLiveness === "blocked" ? "blocked" : isAbortedAgentStopReason(stopReason) && !restartCancelled ? "aborted" : cancelled ? "cancelled" : normalizedLiveness === "abandoned" ? "abandoned" : input.status === "timeout" ? "timed_out" : input.status === "error" ? "failed" : "completed";
	return {
		reason,
		status: reason === "completed" ? "ok" : reason === "hard_timeout" || reason === "timed_out" ? "timeout" : "error",
		...stopReason ? { stopReason } : {},
		...livenessState ? { livenessState } : {},
		...timeoutPhase ? { timeoutPhase } : {},
		...providerStarted !== void 0 ? { providerStarted } : {}
	};
}
/** Applies lifecycle flags before interpreting the same canonical terminal metadata. */
function resolveAgentRunLifecycleTerminalFacts(input) {
	const { data, abortFields } = input;
	const stopReason = readNonBlankString(data?.stopReason) ?? abortFields?.stopReason;
	const timeoutPhase = normalizeAgentRunTimeoutPhase(data?.timeoutPhase);
	const lifecycleStatus = readNonBlankString(data?.status)?.toLowerCase();
	const timedOut = stopReason === "timeout" || timeoutPhase !== void 0 || lifecycleStatus === "timeout" || lifecycleStatus === "timed_out";
	const aborted = data?.aborted === true || abortFields?.aborted === true || lifecycleStatus === "aborted";
	const cancellationStatus = lifecycleStatus === "cancelled" || lifecycleStatus === "canceled" || lifecycleStatus === "aborted" || lifecycleStatus === "superseded";
	const cancelled = cancellationStatus || aborted;
	const failed = input.phase === "error" || lifecycleStatus === "error" || lifecycleStatus === "failed" || stopReason === "error";
	const normalizedStopReason = !timedOut && cancelled && !isAbortedAgentStopReason(stopReason) && !isCancellationStopReason(stopReason) && stopReason !== "superseded" && (stopReason === void 0 || cancellationStatus) ? aborted ? AGENT_RUN_ABORTED_STOP_REASON : "stop" : stopReason;
	const facts = resolveAgentRunTerminalFacts({
		status: timedOut ? "timeout" : cancelled || failed ? "error" : "ok",
		stopReason: normalizedStopReason,
		livenessState: data?.livenessState,
		timeoutPhase,
		providerStarted: data?.providerStarted
	});
	return stopReason && facts.stopReason !== stopReason ? {
		...facts,
		stopReason
	} : facts;
}
/** Reads reduced terminal wait snapshots; pending/deadline admission belongs to the caller. */
function resolveAgentRunWaitTerminalFacts(input) {
	const status = input.status;
	if (status !== "ok" && status !== "error" && status !== "timeout") return;
	const facts = resolveAgentRunTerminalFacts({
		...input,
		status
	});
	return status !== "ok" && facts.stopReason === "auth-revoked" && (facts.reason === "failed" || facts.reason === "timed_out" || facts.reason === "abandoned") ? {
		...facts,
		reason: "aborted",
		status: "error"
	} : facts;
}
/** Reads the execution owner's publication fact; it grants no runtime authority. */
function hasExecutionSettlement(data) {
	return data?.executionSettled === true;
}
/** Distinguishes terminal outcomes from errors that can still be followed by a retry. */
function isDefinitiveRunLifecycle(input) {
	if (input.phase === "end") return true;
	if (input.phase !== "error") return false;
	const facts = resolveAgentRunLifecycleTerminalFacts({
		phase: "error",
		data: input.data
	});
	return hasExecutionSettlement(input.data) || input.data?.fallbackExhaustedFailure === true || facts.reason !== "failed";
}
//#endregion
export { hasExecutionSettlement as a, normalizeAgentRunTimeoutPhase as c, resolveAgentRunTerminalFacts as d, resolveAgentRunWaitTerminalFacts as f, classifyAgentRunTerminalOutcome as i, normalizeProviderStarted as l, AGENT_RUN_RESTART_ABORT_STOP_REASON as n, isAbortedAgentStopReason as o, AGENT_RUN_SUPERSEDED_STOP_REASON as r, isDefinitiveRunLifecycle as s, AGENT_RUN_ABORTED_STOP_REASON as t, resolveAgentRunLifecycleTerminalFacts as u };
