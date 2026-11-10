import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as createSessionPlacementSettlementClosedAbortError, o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { y as setActiveEmbeddedRunLifecycleGeneration } from "./run-state-DZ4Vfz1J.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { F as registerReplyOperationSuccessorBarrier } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { d as markDiagnosticOwnedToolActivity, f as markDiagnosticRunProgress, i as createDiagnosticEmbeddedRunOwner, r as closeDiagnosticEmbeddedRunOwner } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { r as withSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-Buc-FlZv.mjs";
import { M as setActiveEmbeddedRun, a as clearActiveEmbeddedRun } from "./runs-Czr-I6_B.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort--EyODQgV.mjs";
//#region src/gateway/worker-environments/worker-turn-run-owner.ts
const activeOwners = /* @__PURE__ */ new Map();
async function prepareWorkerTurnReplyDelivery(previous, turn) {
	if (previous?.isReplyDelivered() && previous.claim.runId !== turn.runId) await raceNodeWorkerOperation(previous.settled, turn.abortSignal);
	const reply = createDeferredCore();
	let delivered = false;
	return {
		isDelivered: () => delivered,
		deliver(result) {
			delivered = true;
			reply.resolve(result);
		},
		wait(execution) {
			execution.catch((error) => {
				if (delivered) logWarn(`Cloud worker background settlement failed: ${boundedWorkerError(error)}`);
			});
			return Promise.race([reply.promise, execution]);
		}
	};
}
async function createWorkerTurnRunOwner(params) {
	const { claim: requestedClaim, turn, sessionKey } = params;
	const lifecycleGeneration = turn.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	const claimAuthority = await params.placements.prepareTurnClaimAuthority(requestedClaim);
	const claim = claimAuthority.claim;
	let cleanup = () => claimAuthority.release();
	try {
		const assertCurrent = () => {
			params.assertCurrent?.();
			turn.abortSignal?.throwIfAborted();
			if (!isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) || !claimAuthority.isCurrent()) throw new Error("Worker turn authority changed while preparing its run owner");
		};
		assertCurrent();
		const controller = new AbortController();
		const signal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, controller.signal]) : controller.signal;
		let closed = false;
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
		const restartSignal = getGatewayRestartDrainSignal();
		const onRestart = () => cancel("restart");
		const isCurrent = () => activeOwners.get(claim.sessionId) === owner && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && claimAuthority.isCurrent();
		const owner = {
			claim,
			isCancelled: () => signal.aborted && isCurrent(),
			isCancelledFinishing: (request) => owner.isCancelled() && request.runId === claim.runId && request.runEpoch === claim.owner.ownerEpoch && request.event.kind === "lifecycle" && request.event.payload.phase === "finishing" && request.event.payload.aborted === true,
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
				if (closed) return;
				restartSignal.removeEventListener("abort", onRestart);
				closed = true;
				claimAuthority.release();
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
		const completion = createDeferredCore();
		const settle = async () => {
			cancel();
			await completion.promise;
		};
		let disposed = false;
		cleanup = () => {
			if (disposed) return;
			disposed = true;
			turn.replyOperation?.detachBackend(handle);
			try {
				clearActiveEmbeddedRun(claim.sessionId, handle, sessionKey, turn.sessionFile);
			} finally {
				try {
					handle.closeDiagnostics();
				} finally {
					completion.resolve();
				}
			}
		};
		if (restartSignal.aborted) onRestart();
		else restartSignal.addEventListener("abort", onRestart, { once: true });
		setActiveEmbeddedRunLifecycleGeneration(handle, lifecycleGeneration);
		signal.throwIfAborted();
		turn.replyOperation?.attachBackend(handle);
		assertCurrent();
		signal.throwIfAborted();
		withSessionPlacementForcedTerminalSettlement(settle, () => {
			params.assertCurrent?.();
			if (!isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) || !claimAuthority.isCurrent()) throw createSessionPlacementSettlementClosedAbortError();
			signal.throwIfAborted();
		}, () => setActiveEmbeddedRun(claim.sessionId, handle, sessionKey, turn.sessionFile, turn.agentId));
		if (turn.replyOperation) registerReplyOperationSuccessorBarrier({
			operation: turn.replyOperation,
			sessionId: claim.sessionId,
			sessionKeys: [sessionKey],
			start: settle
		});
		assertCurrent();
		signal.throwIfAborted();
		activeOwners.set(claim.sessionId, owner);
		return {
			claim,
			sessionKey,
			signal,
			settled: completion.promise,
			isReplyDelivered: params.isReplyDelivered,
			dispose: cleanup
		};
	} catch (error) {
		cleanup();
		throw error;
	}
}
function captureWorkerTurnLiveEventOwner(identity) {
	const owner = identity.sessionId ? activeOwners.get(identity.sessionId) : void 0;
	return owner && identity.turnClaim?.owner.kind === "worker" && sameWorkerSessionTurnClaim(owner.claim, identity.turnClaim) ? owner : void 0;
}
//#endregion
export { createWorkerTurnRunOwner as n, prepareWorkerTurnReplyDelivery as r, captureWorkerTurnLiveEventOwner as t };
