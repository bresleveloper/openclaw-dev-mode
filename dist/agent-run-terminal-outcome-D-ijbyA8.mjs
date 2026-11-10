import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { d as resolveAgentRunTerminalFacts, f as resolveAgentRunWaitTerminalFacts, u as resolveAgentRunLifecycleTerminalFacts } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { d as isAgentRunSupersededAbortReason, p as resolveAgentRunAbortLifecycleFields, t as AGENT_RUN_ABORTED_ERROR, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
//#region src/shared/agent-liveness.ts
function isBlockedLivenessState(livenessState) {
	return typeof livenessState === "string" && livenessState.trim().toLowerCase() === "blocked";
}
function isAbandonedLivenessState(livenessState) {
	return typeof livenessState === "string" && livenessState.trim().toLowerCase() === "abandoned";
}
function formatBlockedLivenessError(error) {
	return (typeof error === "string" ? error.trim() : "") || "Agent run blocked before producing a usable result.";
}
function formatAbandonedLivenessError(error) {
	return (typeof error === "string" ? error.trim() : "") || "Agent run ended before producing a complete result.";
}
/** Coerce any blocked liveness state into an error status while preserving other statuses. */
function normalizeBlockedLivenessWaitStatus(params) {
	const error = typeof params.error === "string" ? params.error : void 0;
	if (!isBlockedLivenessState(params.livenessState)) return {
		status: params.status,
		error
	};
	return {
		status: "error",
		error: formatBlockedLivenessError(error)
	};
}
//#endregion
//#region src/agents/agent-run-terminal-outcome.ts
const ATTEMPT_TIMEOUT_PHASE_RANK = {
	prompt: 0,
	tool_execution: 1,
	compaction: 2
};
const ATTEMPT_TIMEOUT_SOURCE_RANK = {
	observation: 0,
	runtime: 1,
	idle: 2,
	run_budget: 3,
	external: 4
};
const ATTEMPT_ABORT_SOURCE_RANK = {
	yield_cleanup: 0,
	runtime: 1,
	external: 2
};
function mergeAgentRunAttemptTimeoutPhase(phase, observation) {
	return observation && ATTEMPT_TIMEOUT_PHASE_RANK[observation] > ATTEMPT_TIMEOUT_PHASE_RANK[phase] ? observation : phase;
}
function getAgentRunAttemptFailure(terminal) {
	return terminal.kind === "failed" ? {
		source: terminal.source,
		error: terminal.error
	} : terminal.kind === "ok" ? void 0 : terminal.failure;
}
function withAgentRunAttemptFailure(terminal, failure) {
	if (!failure || terminal.kind === "ok") return terminal;
	if (terminal.kind === "failed") return {
		...terminal,
		...failure
	};
	return {
		...terminal,
		failure
	};
}
function withAgentRunAttemptTimeoutObservation(terminal, phase) {
	const timeoutObservation = terminal.timeoutObservation === "compaction" || phase === "compaction" ? "compaction" : "tool_execution";
	return {
		...terminal,
		timeoutObservation
	};
}
function hasAgentRunAttemptTimeoutAbort(terminal) {
	return terminal.kind === "timeout" && terminal.source !== "observation" && terminal.aborted === true;
}
function mergeAgentRunAttemptTimeoutInterruption(timeout, interruption) {
	if (timeout.source === "observation") return withAgentRunAttemptTimeoutObservation(interruption, timeout.phase);
	return {
		...timeout,
		phase: mergeAgentRunAttemptTimeoutPhase(timeout.phase, interruption.timeoutObservation),
		source: interruption.kind === "aborted" && interruption.source === "external" ? "external" : timeout.source,
		...(interruption.kind === "aborted" && interruption.source !== "yield_cleanup" || timeout.aborted === true) && { aborted: true }
	};
}
/** Replaces attempt failure detail without changing a stronger interruption. */
function setAgentRunAttemptTerminalFailure(terminal, failure) {
	if (!failure) {
		if (terminal.kind === "failed") return terminal.timeoutObservation ? {
			kind: "timeout",
			phase: terminal.timeoutObservation,
			source: "observation"
		} : { kind: "ok" };
		if (terminal.kind === "aborted" || terminal.kind === "timeout") {
			const { failure: _failure, ...withoutFailure } = terminal;
			return withoutFailure;
		}
		return terminal;
	}
	if (terminal.kind === "timeout" && terminal.source === "observation") return {
		kind: "failed",
		...failure,
		timeoutObservation: terminal.phase
	};
	if (terminal.kind === "failed" || terminal.kind === "ok") return {
		kind: "failed",
		...failure,
		...terminal.kind === "failed" && terminal.timeoutObservation && { timeoutObservation: terminal.timeoutObservation }
	};
	return {
		...terminal,
		failure
	};
}
/** Merges attempt observations while keeping terminal precedence in one owner. */
function mergeAgentRunAttemptTerminal(current, incoming) {
	if (incoming.kind === "ok") return current.kind === "ok" && !current.settlementWarning ? incoming : current;
	const failure = getAgentRunAttemptFailure(incoming) ?? getAgentRunAttemptFailure(current);
	let merged = incoming;
	if (current.kind === "timeout" && incoming.kind === "timeout") {
		const phase = mergeAgentRunAttemptTimeoutPhase(current.phase, incoming.phase);
		const selected = ATTEMPT_TIMEOUT_SOURCE_RANK[incoming.source] > ATTEMPT_TIMEOUT_SOURCE_RANK[current.source] ? incoming : current;
		if (selected.source === "observation") merged = {
			kind: "timeout",
			phase: current.phase === "compaction" || incoming.phase === "compaction" ? "compaction" : "tool_execution",
			source: "observation"
		};
		else merged = {
			kind: "timeout",
			phase,
			source: selected.source,
			...(hasAgentRunAttemptTimeoutAbort(current) || hasAgentRunAttemptTimeoutAbort(incoming)) && { aborted: true }
		};
	} else if ((current.kind === "aborted" || current.kind === "failed") && incoming.kind === "timeout") merged = mergeAgentRunAttemptTimeoutInterruption(incoming, current);
	else if (current.kind === "timeout" && (incoming.kind === "aborted" || incoming.kind === "failed")) merged = mergeAgentRunAttemptTimeoutInterruption(current, incoming);
	else if ((current.kind === "aborted" || current.kind === "failed") && (incoming.kind === "aborted" || incoming.kind === "failed")) {
		let selected;
		if (current.kind === "aborted" && incoming.kind === "aborted") selected = {
			kind: "aborted",
			source: ATTEMPT_ABORT_SOURCE_RANK[incoming.source] > ATTEMPT_ABORT_SOURCE_RANK[current.source] ? incoming.source : current.source
		};
		else selected = current.kind === "aborted" ? current : incoming;
		for (const observation of [current.timeoutObservation, incoming.timeoutObservation]) if (observation) selected = withAgentRunAttemptTimeoutObservation(selected, observation);
		merged = selected;
	}
	return withAgentRunAttemptFailure(merged, failure);
}
/** Normalizes the shipped harness result shape at the Plugin SDK boundary. */
function normalizeAgentRunAttemptTerminal(input) {
	let terminal = {
		kind: "ok",
		...input.settlementWarning && { settlementWarning: input.settlementWarning }
	};
	if (input.aborted || input.externalAbort) terminal = mergeAgentRunAttemptTerminal(terminal, {
		kind: "aborted",
		source: input.externalAbort ? "external" : "runtime"
	});
	if (input.timedOut || input.idleTimedOut || input.timedOutByRunBudget) terminal = mergeAgentRunAttemptTerminal(terminal, {
		kind: "timeout",
		phase: input.timedOutDuringCompaction ? "compaction" : input.timedOutDuringToolExecution ? "tool_execution" : "prompt",
		source: input.externalAbort ? "external" : input.timedOutByRunBudget ? "run_budget" : input.idleTimedOut ? "idle" : "runtime",
		...(input.aborted || input.externalAbort) && { aborted: true }
	});
	else if (input.timedOutDuringCompaction || input.timedOutDuringToolExecution) terminal = mergeAgentRunAttemptTerminal(terminal, {
		kind: "timeout",
		phase: input.timedOutDuringCompaction ? "compaction" : "tool_execution",
		source: "observation"
	});
	if (input.promptError !== null && input.promptError !== void 0) terminal = setAgentRunAttemptTerminalFailure(terminal, {
		error: input.promptError,
		source: input.promptErrorSource ?? "prompt"
	});
	return terminal;
}
/** Projects the closed attempt terminal into legacy event/meta fields. */
function projectAgentRunAttemptTerminal(terminal) {
	const failure = getAgentRunAttemptFailure(terminal);
	const externalAbort = (terminal.kind === "aborted" || terminal.kind === "timeout") && terminal.source === "external";
	const timedOut = terminal.kind === "timeout" && terminal.source !== "observation";
	const timeoutPhase = terminal.kind === "timeout" ? terminal.phase : terminal.kind === "ok" ? void 0 : terminal.timeoutObservation;
	return {
		...terminal.kind === "ok" && terminal.settlementWarning && { settlementWarning: terminal.settlementWarning },
		aborted: terminal.kind === "aborted" && terminal.source !== "yield_cleanup" || hasAgentRunAttemptTimeoutAbort(terminal),
		cleanupYieldAborted: terminal.kind === "aborted" && terminal.source === "yield_cleanup",
		externalAbort,
		failed: failure !== void 0,
		idleTimedOut: terminal.kind === "timeout" && terminal.source === "idle",
		interrupted: externalAbort || timedOut,
		promptError: failure ? failure.error : null,
		promptErrorSource: failure?.source ?? null,
		timedOut,
		timedOutByRunBudget: terminal.kind === "timeout" && terminal.source === "run_budget",
		timedOutDuringCompaction: timeoutPhase === "compaction",
		timedOutDuringToolExecution: timeoutPhase === "tool_execution"
	};
}
/** Shared grace window for terminal observations that may still be followed by a retry. */
const AGENT_RUN_TERMINAL_RETRY_GRACE_MS = 15e3;
/** True when an outcome should not be overwritten by ordinary later status. */
function isStickyAgentRunTerminalOutcome(outcome) {
	return outcome?.reason === "hard_timeout" || outcome?.reason === "superseded" || outcome?.reason === "cancelled";
}
function formatAgentRunTerminalOutcome(facts, input) {
	const { reason, status, ...metadata } = facts;
	const startedAt = asFiniteNumber(input.startedAt);
	const endedAt = asFiniteNumber(input.endedAt);
	const rawError = input.error == null ? void 0 : readNonBlankString(formatErrorMessage(input.error));
	const error = reason === "hard_timeout" ? rawError : isBlockedLivenessState(facts.livenessState) ? formatBlockedLivenessError(rawError) : reason === "aborted" && !rawError ? AGENT_RUN_ABORTED_ERROR : reason === "superseded" || reason === "aborted" || reason === "cancelled" ? rawError : isAbandonedLivenessState(facts.livenessState) ? formatAbandonedLivenessError(rawError) : rawError;
	return {
		reason,
		status,
		...error ? { error } : {},
		...metadata,
		...startedAt !== void 0 ? { startedAt } : {},
		...endedAt !== void 0 ? { endedAt } : {}
	};
}
function buildAgentRunTerminalOutcome(input) {
	return formatAgentRunTerminalOutcome(resolveAgentRunTerminalFacts(input), input);
}
function buildAgentRunTerminalOutcomeFromLifecycleEvent(input) {
	const data = input.data;
	const abortFields = typeof data?.aborted === "boolean" ? {} : resolveAgentRunAbortLifecycleFields(input.abortSignal);
	return formatAgentRunTerminalOutcome(resolveAgentRunLifecycleTerminalFacts({
		phase: input.phase,
		data,
		abortFields
	}), {
		error: data?.error,
		startedAt: input.startedAt ?? data?.startedAt,
		endedAt: input.endedAt ?? data?.endedAt
	});
}
function hasNestedAbortReason(value, matches) {
	let candidate = value;
	for (let depth = 0; depth < 3; depth += 1) {
		if (matches(candidate)) return true;
		if (!(candidate instanceof Error)) return false;
		try {
			if (candidate.cause === void 0) return false;
			candidate = candidate.cause;
		} catch {
			return false;
		}
	}
	return false;
}
function buildAgentRunTerminalOutcomeFromAttempt(input) {
	const projected = projectAgentRunAttemptTerminal(input.terminal);
	const assistant = projected.cleanupYieldAborted ? void 0 : input.assistant;
	const abortFields = resolveAgentRunAbortLifecycleFields(input.abortSignal);
	const timedOut = projected.timedOut || abortFields.stopReason === "timeout";
	const attemptTimeoutPhase = projected.timedOut && input.terminal.kind === "timeout" ? input.terminal.phase : void 0;
	const timedOutDuringPrompt = attemptTimeoutPhase === "prompt";
	const timeoutPhase = input.promptTimeoutOutcome?.timeoutPhase ?? (attemptTimeoutPhase === "tool_execution" ? "tool_execution" : timedOutDuringPrompt ? "provider" : void 0);
	const providerStarted = input.promptTimeoutOutcome?.providerStarted ?? (timedOutDuringPrompt ? true : void 0);
	const restartAborted = hasNestedAbortReason(projected.promptError, isAgentRunRestartAbortReason);
	const superseded = hasNestedAbortReason(projected.promptError, isAgentRunSupersededAbortReason);
	const assistantStopReason = projected.promptErrorSource !== null ? void 0 : assistant?.stopReason;
	const stopReason = projected.timedOut && timeoutPhase === void 0 && providerStarted !== true ? void 0 : (superseded ? "superseded" : void 0) ?? abortFields.stopReason ?? (restartAborted ? "restart" : void 0) ?? (!timedOut && projected.aborted ? "aborted" : void 0) ?? (!timedOut ? assistantStopReason : void 0);
	return buildAgentRunTerminalOutcome({
		status: timedOut ? "timeout" : abortFields.aborted || projected.aborted || projected.promptErrorSource !== null || assistantStopReason === "error" ? "error" : "ok",
		error: projected.promptErrorSource !== null ? projected.promptError : assistant?.errorMessage,
		stopReason,
		livenessState: input.promptTimeoutOutcome?.livenessState,
		timeoutPhase,
		providerStarted
	});
}
/** Tool execution deadlines preserve an unknown-effect checkpoint for safe continuation. */
function isAgentRunResumableToolTimeout(outcome) {
	return outcome?.reason === "hard_timeout" && outcome.timeoutPhase === "tool_execution";
}
/** Builds a terminal outcome from wait paths where status may still be pending/unknown. */
function buildAgentRunTerminalOutcomeFromWaitResult(wait) {
	if (!wait) return;
	const facts = resolveAgentRunWaitTerminalFacts(wait);
	return facts ? formatAgentRunTerminalOutcome(facts, wait) : void 0;
}
//#endregion
export { buildAgentRunTerminalOutcomeFromWaitResult as a, mergeAgentRunAttemptTerminal as c, setAgentRunAttemptTerminalFailure as d, normalizeBlockedLivenessWaitStatus as f, buildAgentRunTerminalOutcomeFromLifecycleEvent as i, normalizeAgentRunAttemptTerminal as l, buildAgentRunTerminalOutcome as n, isAgentRunResumableToolTimeout as o, buildAgentRunTerminalOutcomeFromAttempt as r, isStickyAgentRunTerminalOutcome as s, AGENT_RUN_TERMINAL_RETRY_GRACE_MS as t, projectAgentRunAttemptTerminal as u };
