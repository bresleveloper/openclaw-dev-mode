import { a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { T as retainQueuedAgentRunContext, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { c as createSessionPlacementSettlementClosedAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { t as DEFAULT_AGENT_TIMEOUT_MS } from "./timeout-Bjg7ga80.mjs";
import { A as registerReplyOperationSuccessorBarrier } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import "./reply-run-registry-Cpef_Ljt.mjs";
import { i as withoutSessionPlacementForcedTerminalSettlement, n as resolveSessionPlacementTurnSettlementAssertion, t as resolveSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-C1lJojrj.mjs";
import { i as getGatewayToolCallerIdentity, s as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { c as isCommandLaneTaskMarkerCurrent, r as enqueueCommandInLane } from "./command-queue-CaY517ob.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import "./failover-error-BwAkMLuL.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-KBr1fVd6.mjs";
import { n as registerAgentRunCapacityWait } from "./agent-run-capacity-wait-CbVGA6gD.mjs";
import { D as settleRequesterAfterSessionSpawns, h as markRequesterTurnYielded } from "./subagent-registry-CM5uFXla.mjs";
import { n as hasCompletionMessageSessionSpawn, r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-4qfWSWlu.mjs";
import { r as resolveSessionLane } from "./lanes-CVttd5qX.mjs";
//#region src/agents/embedded-agent-runner/run/lane-runtime.ts
const EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS = 3e4;
function shouldNoteLaneWait(snapshot) {
	return snapshot.queuedCount > 0 || snapshot.activeCount >= snapshot.maxConcurrent || snapshot.blockedBy != null;
}
function resolveEmbeddedRunLaneTimeoutMs(timeoutMs) {
	const defaultLaneTimeoutMs = DEFAULT_AGENT_TIMEOUT_MS + EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS;
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs >= 2147e6) return defaultLaneTimeoutMs;
	return addTimerTimeoutGraceMs(Math.floor(timeoutMs), 3e4) ?? defaultLaneTimeoutMs;
}
function withEmbeddedRunLaneTimeout(opts, laneTaskTimeoutMs) {
	if (opts?.taskTimeoutMs !== void 0) return opts;
	return {
		...opts,
		taskTimeoutMs: laneTaskTimeoutMs
	};
}
function resolveEmbeddedRunSessionLanePolicy(trigger, inputProvenance) {
	let triggerPriority;
	switch (trigger) {
		case "user":
		case "manual":
			triggerPriority = "foreground";
			break;
		case "cron":
		case "heartbeat":
		case "memory":
		case "overflow":
			triggerPriority = "background";
			break;
		default: triggerPriority = "normal";
	}
	const isRestartRecovery = isMainSessionRestartRecoveryInputProvenance(inputProvenance);
	return {
		priority: isRestartRecovery || inputProvenance?.kind === "inter_session" ? "background" : triggerPriority,
		canResumeAcrossRotation: !isRestartRecovery && triggerPriority === "foreground"
	};
}
//#endregion
//#region src/agents/requester-run-settlement.ts
const settlementFailures = resolveGlobalSingleton(Symbol.for("openclaw.requesterSettlementFailures"), () => /* @__PURE__ */ new WeakSet());
/** Failure cleanup belongs to the whole fallback chain, while its admission is still live. */
function settleFailedRequesterRun(params, error, assertCurrent) {
	const instance = params.admittedRunContext?.operationalRunInstance ?? params.preparedRunAdmission?.operationalRunInstance;
	if (!instance || params.abortSignal?.aborted || error instanceof Error && error.name === "AbortError" || typeof error === "object" && error !== null && settlementFailures.has(error) || getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) return error;
	try {
		assertCurrent?.();
	} catch {
		return error;
	}
	if (params.abortSignal?.aborted || getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) return error;
	try {
		settleRequesterRun(params, { meta: { durationMs: 0 } }, () => {});
	} catch (settlementError) {
		const failure = new AggregateError([error, settlementError], "Agent run failed and requester child settlement failed", { cause: error });
		settlementFailures.add(failure);
		recordModelFallbackStop(failure);
		return failure;
	}
	return error;
}
/** Transfers the complete logical run's children only after retries have finished. */
function settleRequesterRun(params, result, assertCurrent) {
	const instance = params.admittedRunContext?.operationalRunInstance ?? params.preparedRunAdmission?.operationalRunInstance;
	if (instance) {
		const accepted = mergeAcceptedSessionSpawnsForRun(instance, result.acceptedSessionSpawns);
		if (accepted.length > 0) result.acceptedSessionSpawns = accepted;
	}
	if (!params.sessionKey || !hasCompletionMessageSessionSpawn(result.acceptedSessionSpawns) || params.abortSignal?.aborted || result.meta.aborted || result.requesterContinuationSettled === true) return;
	const requester = {
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		requesterTurnRunId: params.runId
	};
	assertCurrent();
	params.abortSignal?.throwIfAborted();
	if (instance && getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) throw createSessionPlacementSettlementClosedAbortError();
	try {
		if (result.meta.continuationPending) {
			if (markRequesterTurnYielded(requester) === 0) throw new Error("accepted continuation children were not durably registered");
			return;
		}
		const settled = settleRequesterAfterSessionSpawns({
			...requester,
			requesterYielded: result.meta.yielded === true,
			acceptedSessionSpawns: result.acceptedSessionSpawns ?? []
		});
		if (result.meta.yielded) {
			if (!settled) throw new Error("accepted continuation children could not transfer terminal delivery");
			result.requesterContinuationSettled = true;
		}
	} catch (error) {
		if (typeof error === "object" && error !== null) settlementFailures.add(error);
		if (error instanceof Error) recordModelFallbackStop(error);
		throw error;
	}
}
//#endregion
//#region src/agents/session-placement-admission.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementAdmissionState"), () => ({}));
function installSessionPlacementAdmissionProvider(provider) {
	state.provider = provider;
	return () => {
		if (state.provider === provider) state.provider = void 0;
	};
}
/** Carries placement-owned runtime selection into candidate preparation and execution. */
function resolveSessionPlacementRuntimeOverride(identity) {
	return state.provider?.resolveRuntimeOverride?.(identity);
}
/** Captures the exact placement owner, including standalone absence, before awaited work. */
function captureSessionPlacementCompactionSuccessorAssertion() {
	const provider = state.provider;
	return (params) => {
		if (state.provider !== provider) throw new Error("session placement owner changed during compaction successor acceptance");
		provider?.assertCompactionSuccessorAllowed(params);
	};
}
function withPlacementTurnCallerScope(params, task) {
	const instance = params.admittedRunContext?.operationalRunInstance ?? params.preparedRunAdmission?.operationalRunInstance;
	return instance && getGatewayToolCallerIdentity()?.operationalRunInstance === instance ? task() : withoutGatewayToolCallerIdentity(task);
}
async function withSessionPlacementTurnAdmission(claim, params, task, onAdmitted) {
	let admitted = false;
	const admitTurn = () => {
		if (admitted) return;
		admitted = true;
		onAdmitted?.();
	};
	const runAdmittedLocalTurn = async () => {
		const settle = resolveSessionPlacementForcedTerminalSettlement();
		const assertCurrent = resolveSessionPlacementTurnSettlementAssertion();
		if (params.replyOperation && settle) registerReplyOperationSuccessorBarrier({
			operation: params.replyOperation,
			sessionId: claim.sessionId,
			sessionKeys: [params.replyOperation.key],
			start: settle
		});
		assertCurrent?.();
		admitTurn();
		assertCurrent?.();
		const result = await task();
		assertCurrent?.();
		return result;
	};
	const provider = state.provider;
	const lifecycleGeneration = params.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(claim.runId);
	const assertAdmittedRunCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	const assertCurrent = () => {
		params.abortSignal?.throwIfAborted();
		params.preparedRunAdmission?.assertSourceCurrent();
		if (params.admittedRunContext && !assertAdmittedRunCurrent) throw createAbortError("admitted run authority is no longer active");
		assertAdmittedRunCurrent?.();
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		if (state.provider !== provider) throw createAbortError("session placement owner changed during turn admission");
	};
	const result = await withPlacementTurnCallerScope(params, () => withoutSessionPlacementForcedTerminalSettlement(() => provider ? provider.executeTurn(claim, params, runAdmittedLocalTurn, admitTurn, assertCurrent) : runAdmittedLocalTurn()));
	if (result.meta.executionTrace?.runner === "cli" && params.isFinalFallbackAttempt === void 0) settleRequesterRun({
		...params,
		...claim
	}, result, assertCurrent);
	return result;
}
/** Serializes direct CLI turns with every runtime before acquiring placement ownership. */
async function withLocalSessionPlacementTurnSettlement(claim, task, options = {}) {
	const provider = state.provider;
	const lifecycleGeneration = options.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(claim.runId);
	const assertAdmittedRunCurrent = options.admittedRunContext ? resolveAdmittedRunActiveAssertion(options.admittedRunContext, options.abortSignal) : void 0;
	const assertOwnerCurrent = () => {
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		if (state.provider !== provider) throw createAbortError("session placement owner changed during turn admission");
	};
	const assertCurrent = () => {
		if (options.abortSignal?.aborted) throw options.abortSignal.reason instanceof Error ? options.abortSignal.reason : createAbortError("Operation aborted", { cause: options.abortSignal.reason });
		assertOwnerCurrent();
	};
	assertCurrent();
	const releaseForeground = resolveEmbeddedRunSessionLanePolicy(options.trigger, options.inputProvenance).priority === "foreground" ? await beginForegroundSessionMaintenance(claim.sessionKey ?? claim.sessionId) : void 0;
	const releaseQueuedContext = retainQueuedAgentRunContext(claim.runId, lifecycleGeneration);
	let releaseCapacityWait;
	try {
		return await enqueueCommandInLane(resolveSessionLane(claim.sessionKey?.trim() || claim.sessionId), async (taskMarker) => {
			assertCurrent();
			const runLocal = async () => {
				assertCurrent();
				const assertClaimCurrent = resolveSessionPlacementTurnSettlementAssertion();
				let open = true;
				const assertSettlementCurrent = () => {
					if (!open || !isCommandLaneTaskMarkerCurrent(taskMarker)) throw createSessionPlacementSettlementClosedAbortError();
					assertOwnerCurrent();
					assertClaimCurrent?.();
				};
				try {
					assertSettlementCurrent();
					releaseCapacityWait?.();
					releaseQueuedContext?.("admitted");
					return await task(assertSettlementCurrent);
				} finally {
					open = false;
				}
			};
			const result = await withPlacementTurnCallerScope(options, () => withoutSessionPlacementForcedTerminalSettlement(() => provider ? provider.executeLocalTurn(claim, runLocal) : runLocal()));
			if (options.isFinalFallbackAttempt === void 0) settleRequesterRun({
				...options,
				...claim
			}, result, () => {
				assertCurrent();
				options.preparedRunAdmission?.assertSourceCurrent();
				if (options.admittedRunContext && !assertAdmittedRunCurrent) throw createAbortError("admitted run authority is no longer active");
				assertAdmittedRunCurrent?.();
				if (!isCommandLaneTaskMarkerCurrent(taskMarker)) throw createSessionPlacementSettlementClosedAbortError();
			});
			return result;
		}, {
			priority: resolveEmbeddedRunSessionLanePolicy(options.trigger, options.inputProvenance).priority,
			onQueued: () => {
				releaseCapacityWait = registerAgentRunCapacityWait(claim.runId, lifecycleGeneration);
			}
		});
	} finally {
		releaseForeground?.();
		releaseCapacityWait?.();
		releaseQueuedContext?.("abandoned");
	}
}
/** Resolves an authoritative sandbox only when the live placement owns remote execution. */
async function resolveSessionPlacementSandbox(params) {
	return await state.provider?.resolveSandbox?.(params) ?? null;
}
/** The current placement owner alone can settle a proven terminal worker turn. */
function recoverTerminalSessionPlacementTurn(session) {
	return state.provider?.recoverTerminalTurn?.(session);
}
//#endregion
export { resolveSessionPlacementSandbox as a, settleFailedRequesterRun as c, resolveEmbeddedRunLaneTimeoutMs as d, resolveEmbeddedRunSessionLanePolicy as f, resolveSessionPlacementRuntimeOverride as i, settleRequesterRun as l, withEmbeddedRunLaneTimeout as m, installSessionPlacementAdmissionProvider as n, withLocalSessionPlacementTurnSettlement as o, shouldNoteLaneWait as p, recoverTerminalSessionPlacementTurn as r, withSessionPlacementTurnAdmission as s, captureSessionPlacementCompactionSuccessorAssertion as t, EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS as u };
