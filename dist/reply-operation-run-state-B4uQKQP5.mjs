import { t as GatewayDrainingError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError, l as isAgentRunDirectAbortReason, m as resolveAgentRunErrorLifecycleFields, p as resolveAgentRunAbortLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { t as CommandLaneClearedError } from "./command-queue-Dvag6gVL.mjs";
import { r as isFallbackSummaryError } from "./model-fallback-attempt-C__ppyFv.mjs";
//#region src/auto-reply/reply/agent-runner-execution-status.ts
/** Projects closed execution independently of later reply delivery. */
function resolveAgentTurnExecutionStatus(outcome) {
	if (outcome?.kind === "settled") return outcome.status;
	return outcome?.kind === "aborted" ? "cancelled" : "failed";
}
//#endregion
//#region src/auto-reply/reply/reply-operation-abort.ts
function buildRestartLifecycleReplyText() {
	return "⚠️ Gateway is restarting. Please wait a few seconds and try again.";
}
function resolveSignalAbortReason(signal) {
	const stopReason = resolveAgentRunAbortLifecycleFields(signal).stopReason;
	if (stopReason === "restart" || stopReason === "superseded") return stopReason;
	return stopReason && !isSessionPlacementSettlementClosedError(signal?.reason) ? "user" : void 0;
}
function isReplyOperationUserAbort(replyOperation) {
	return replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_by_user" || resolveSignalAbortReason(replyOperation?.abortSignal) === "user";
}
function hasReplyOperationAbort(replyOperation, code, matchesReason) {
	return replyOperation?.result?.kind === "aborted" && replyOperation.result.code === code || replyOperation?.abortSignal?.aborted === true && matchesReason(replyOperation.abortSignal.reason);
}
function resolveReplyOperationTerminationFields(error, signal, replyOperation) {
	const ownerReason = resolveReplyOperationAbortReason(replyOperation);
	return {
		...resolveAgentRunErrorLifecycleFields(error, signal),
		...ownerReason === "restart" || ownerReason === "superseded" ? {
			aborted: true,
			stopReason: ownerReason
		} : {}
	};
}
function isReplyOperationSuperseded(replyOperation) {
	return hasReplyOperationAbort(replyOperation, "aborted_for_supersession", isAgentRunSupersededAbortReason);
}
function resolveReplyOperationAbortReason(replyOperation, error, signal = replyOperation?.abortSignal) {
	const errorStopReason = resolveAgentRunErrorLifecycleFields(error, void 0).stopReason;
	return hasReplyOperationAbort(replyOperation, "aborted_for_restart", isAgentRunRestartAbortReason) ? "restart" : isReplyOperationSuperseded(replyOperation) ? "superseded" : resolveSignalAbortReason(signal) ?? (errorStopReason === "restart" ? "restart" : errorStopReason === "superseded" ? "superseded" : isAgentRunDirectAbortReason(error) || isReplyOperationUserAbort(replyOperation) ? "user" : void 0);
}
function resolveRestartLifecycleError(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of pending) {
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		if (candidate instanceof GatewayDrainingError || candidate instanceof CommandLaneClearedError) return candidate;
		if (isFallbackSummaryError(candidate)) pending.push(...candidate.attempts.map((attempt) => attempt.error));
		if (candidate instanceof Error && "cause" in candidate) pending.push(candidate.cause);
	}
}
//#endregion
//#region src/auto-reply/reply/reply-operation-run-state.ts
const REPLY_OPERATION_RUN_STATE = Symbol("openclaw.replyOperationRunState");
function resolveReplyOperationRunState(options) {
	return options?.[REPLY_OPERATION_RUN_STATE];
}
/** Either source owner can prevent its retained background work from adding delivery. */
function resolveReplySessionEventDelivery(options, run) {
	return run.internalEventExecution?.deliver === false || resolveReplyOperationRunState(options)?.sessionEventDelivery === false ? false : void 0;
}
function recordReplyOperationAgentTurn(states, owner, outcome) {
	for (const state of states ?? []) {
		state.agentTurn = resolveAgentTurnExecutionStatus(outcome ?? (owner?.result?.kind === "aborted" ? owner.result : void 0));
		if (outcome?.kind === "settled") {
			state.messagingToolSentTargets = outcome.result.messagingToolSentTargets?.slice();
			state.backgroundWorkStarted = Boolean(outcome.result.asyncWorkStarted || outcome.result.acceptedSessionSpawns?.length);
		} else if (!owner || state.agentTurnOwner !== owner) {
			state.messagingToolSentTargets = void 0;
			state.backgroundWorkStarted = false;
		}
		state.agentTurnOwner = owner;
	}
}
function recordReplyPreRunRejection(state, rejection) {
	if (state && rejection) state.preRunRejection ??= rejection;
}
function resolveReplyOperationAgentTurn(state) {
	return isReplyOperationSuperseded(state?.agentTurnOwner) ? "superseded" : state?.agentTurn;
}
//#endregion
export { resolveReplyOperationRunState as a, isReplyOperationSuperseded as c, resolveRestartLifecycleError as d, resolveAgentTurnExecutionStatus as f, resolveReplyOperationAgentTurn as i, resolveReplyOperationAbortReason as l, recordReplyOperationAgentTurn as n, resolveReplySessionEventDelivery as o, recordReplyPreRunRejection as r, buildRestartLifecycleReplyText as s, REPLY_OPERATION_RUN_STATE as t, resolveReplyOperationTerminationFields as u };
