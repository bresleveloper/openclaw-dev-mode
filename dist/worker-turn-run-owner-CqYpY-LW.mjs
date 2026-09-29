import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { g as setActiveEmbeddedRunLifecycleGeneration } from "./run-state-CTlPY590.mjs";
import { d as markDiagnosticRunProgress, n as closeDiagnosticEmbeddedRunOwner, r as createDiagnosticEmbeddedRunOwner, u as markDiagnosticOwnedToolActivity } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { N as setActiveEmbeddedRun, i as clearActiveEmbeddedRun } from "./runs-Cjzxx3Pg.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
//#region src/gateway/worker-environments/worker-turn-run-owner.ts
const activeOwners = /* @__PURE__ */ new Map();
function createWorkerTurnRunOwner(params) {
	const { claim, turn, sessionKey } = params;
	const controller = new AbortController();
	const signal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, controller.signal]) : controller.signal;
	let closed = false;
	const lifecycleGeneration = turn.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	const startedAtMs = Date.now();
	const deadlineAtMs = startedAtMs + turn.timeoutMs;
	const diagnosticOwner = createDiagnosticEmbeddedRunOwner({
		sessionId: claim.sessionId,
		sessionKey,
		runId: claim.runId
	});
	const cancel = (reason) => {
		controller.abort(reason === "restart" ? createAgentRunRestartAbortError() : reason === "superseded" ? createAgentRunSupersededAbortError() : void 0);
	};
	const isCurrent = () => activeOwners.get(claim.sessionId) === owner && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && params.placements.validateTurnClaim(claim);
	const owner = {
		claim,
		isCancelled: () => signal.aborted && isCurrent(),
		record: (event) => {
			if (signal.aborted || !isCurrent()) return;
			if (event.kind === "tool" && event.payload.phase !== "update") markDiagnosticOwnedToolActivity(diagnosticOwner, {
				toolName: event.payload.name,
				toolCallId: event.payload.toolCallId,
				phase: event.payload.phase === "start" ? "start" : "end",
				deadlineAtMs
			});
			else markDiagnosticRunProgress({
				sessionId: claim.sessionId,
				sessionKey,
				runId: claim.runId,
				reason: `worker:${event.kind}`
			});
		}
	};
	const queueMessage = async () => {
		throw new Error("Cloud worker turns do not support message injection");
	};
	const handle = {
		kind: "embedded",
		runId: claim.runId,
		startedAtMs,
		diagnosticOwner,
		closeDiagnostics: () => {
			closed = true;
			closeDiagnosticEmbeddedRunOwner(diagnosticOwner);
			if (activeOwners.get(claim.sessionId) === owner) activeOwners.delete(claim.sessionId);
		},
		queueMessage,
		messageInjection: {
			isAvailable: () => false,
			queueMessage
		},
		isStreaming: () => false,
		isStopped: () => closed || signal.aborted,
		isAborted: () => signal.aborted,
		isAbortable: () => !closed && !signal.aborted,
		isCompacting: () => false,
		cancel,
		abort: cancel
	};
	setActiveEmbeddedRunLifecycleGeneration(handle, lifecycleGeneration);
	turn.replyOperation?.attachBackend(handle);
	setActiveEmbeddedRun(claim.sessionId, handle, sessionKey, turn.sessionFile, turn.agentId);
	if (!signal.aborted) activeOwners.set(claim.sessionId, owner);
	return {
		claim,
		sessionKey,
		signal,
		dispose: () => {
			turn.replyOperation?.detachBackend(handle);
			clearActiveEmbeddedRun(claim.sessionId, handle, sessionKey, turn.sessionFile);
		}
	};
}
function captureWorkerTurnLiveEventOwner(identity) {
	const owner = identity.sessionId ? activeOwners.get(identity.sessionId) : void 0;
	return owner && identity.turnClaim?.owner.kind === "worker" && sameWorkerSessionTurnClaim(owner.claim, identity.turnClaim) ? owner : void 0;
}
//#endregion
export { createWorkerTurnRunOwner as n, captureWorkerTurnLiveEventOwner as t };
