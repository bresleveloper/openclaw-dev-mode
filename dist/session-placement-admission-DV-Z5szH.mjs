import { a as addTimerTimeoutGraceMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { O as retainQueuedAgentRunContext, l as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { r as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { _ as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-h1ULFETN.mjs";
import { c as createSessionPlacementSettlementClosedAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { m as withoutGatewayToolCallerIdentity, o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./config-B3oiWDlr.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { t as DEFAULT_AGENT_TIMEOUT_MS } from "./timeout-BBs3o51w.mjs";
import { F as registerReplyOperationSuccessorBarrier } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { i as withoutSessionPlacementForcedTerminalSettlement, n as resolveSessionPlacementTurnSettlementAssertion, t as resolveSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-Buc-FlZv.mjs";
import { n as registerAgentRunCapacityWait } from "./agent-run-capacity-wait-DbnNjNgr.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { i as enqueueCommandInLane, l as isCommandLaneTaskMarkerCurrent } from "./command-queue-Dvag6gVL.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-CAtNkN-G.mjs";
import { j as settleRequesterAfterSessionSpawns, v as markRequesterTurnYielded } from "./subagent-registry-CfK3_UcO.mjs";
import { r as assertRequiredWorkerLocalExecution } from "./required-worker-profile-B0DIhkdC.mjs";
import { n as hasCompletionMessageSessionSpawn, r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
function resolveEmbeddedRunSessionLanePolicy(trigger, inputProvenance) {
	const triggerPriority = trigger === "user" || trigger === "manual" ? "foreground" : [
		"cron",
		"heartbeat",
		"memory",
		"overflow"
	].includes(trigger ?? "") ? "background" : "normal";
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
async function settleFailedRequesterRun(params, error, assertCurrent) {
	const instance = params.admittedRunContext?.operationalRunInstance ?? params.preparedRunAdmission?.operationalRunInstance;
	if (!instance || params.abortSignal?.aborted || error instanceof Error && error.name === "AbortError" || typeof error === "object" && error !== null && settlementFailures.has(error) || getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) return error;
	try {
		assertCurrent?.();
	} catch {
		return error;
	}
	if (params.abortSignal?.aborted || getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) return error;
	try {
		await settleRequesterRun(params, { meta: { durationMs: 0 } }, () => {
			assertCurrent?.();
			params.preparedRunAdmission?.assertSourceCurrent();
		});
	} catch (settlementError) {
		const failure = new AggregateError([error, settlementError], "Agent run failed and requester child settlement failed", { cause: error });
		settlementFailures.add(failure);
		recordModelFallbackStop(failure);
		return failure;
	}
	return error;
}
/** Transfers the complete logical run's children only after retries have finished. */
async function settleRequesterRun(params, result, assertCurrent) {
	const instance = params.admittedRunContext?.operationalRunInstance ?? params.preparedRunAdmission?.operationalRunInstance;
	if (instance) {
		const accepted = mergeAcceptedSessionSpawnsForRun(instance, result.acceptedSessionSpawns);
		if (accepted.length > 0) result.acceptedSessionSpawns = accepted;
	}
	if (!params.sessionKey || !hasCompletionMessageSessionSpawn(result.acceptedSessionSpawns) || params.abortSignal?.aborted || result.meta.aborted || result.requesterContinuationSettled === true) return;
	const requester = {
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		requesterTurnRunId: params.runId,
		assertCurrent: () => {
			assertCurrent();
			params.abortSignal?.throwIfAborted();
			if (instance && getActiveAgentRunDelegatedAuthority(instance)?.operationalRunInstance !== instance) throw createSessionPlacementSettlementClosedAbortError();
		}
	};
	requester.assertCurrent();
	try {
		if (result.meta.continuationPending) {
			if (await markRequesterTurnYielded(requester) === 0) throw new Error("accepted continuation children were not durably registered");
			return;
		}
		const settled = await settleRequesterAfterSessionSpawns({
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
async function resolveSessionPlacementRuntimeOverride(identity) {
	const provider = state.provider;
	const runtime = await provider?.resolveRuntimeOverride?.(identity);
	if (state.provider !== provider) throw createAbortError("session placement owner changed during runtime selection");
	return runtime;
}
const requiredPlacementScope = resolveGlobalSingleton(Symbol.for("openclaw.requiredSessionPlacementScope"), () => new AsyncLocalStorage());
/** Nested entry points consume this run's owner-held admission, never a cached permission. */
async function withRequiredSessionPlacement(identity, options, task) {
	const inherited = requiredPlacementScope.getStore();
	if (inherited && inherited.identity.sessionId === identity.sessionId && inherited.identity.agentId === identity.agentId && inherited.identity.sessionKey === identity.sessionKey) {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		if (state.provider !== inherited.provider) throw createAbortError("session placement owner changed during required worker preparation");
		inherited.assertPlacementCurrent();
		return await task();
	}
	if (!(readRuntimeConfig().cloudWorkers?.requiredProfile ?? options.config?.cloudWorkers?.requiredProfile)) return await task();
	const provider = state.provider;
	if (!identity.sessionKey?.trim() || !provider?.withRequiredSession) throw new Error("Required worker execution needs a real session and an available Gateway placement owner; sessionless model helpers are unsupported.");
	const assertCurrent = composeSessionSourceAssertion([options.assertCurrent], (assertSource) => {
		options.signal?.throwIfAborted();
		assertSource();
		if (state.provider !== provider) throw createAbortError("session placement owner changed during required worker preparation");
	});
	assertCurrent();
	return await provider.withRequiredSession(identity, async (assertPlacementCurrent) => {
		assertCurrent();
		assertPlacementCurrent();
		return await requiredPlacementScope.run({
			identity: { ...identity },
			provider,
			assertPlacementCurrent
		}, task);
	}, assertCurrent, options.signal);
}
async function sessionPlacementUsesWorkerInference(identity) {
	return await state.provider?.usesWorkerInference?.(identity) === true;
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
	return instance && getGatewayToolCallerIdentity()?.operationalRunInstance === instance ? task() : withoutGatewayToolCallerIdentity(() => runWithoutOwnedSessionTranscriptWrites(task));
}
async function withSessionPlacementTurnAdmission(claim, params, task, onAdmitted) {
	const { sessionAgentId } = resolveSessionAgentIds({
		config: params.config ?? readRuntimeConfig(),
		sessionKey: claim.sessionKey,
		agentId: claim.agentId
	});
	const interrupted = new AbortController();
	const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, interrupted.signal]) : interrupted.signal;
	const admission = await beginSessionWorkAdmission({
		agentId: sessionAgentId,
		scope: `agent:${sessionAgentId}`,
		identities: [
			claim.sessionKey,
			claim.sessionId,
			claim.runId
		],
		signal,
		assertAllowed: () => signal.throwIfAborted(),
		onInterrupt: (reason) => interrupted.abort(reason)
	});
	try {
		return await admission.run(() => executeAdmittedSessionPlacementTurn(claim, {
			...params,
			abortSignal: signal
		}, () => task(signal), onAdmitted));
	} finally {
		admission.release();
	}
}
async function executeAdmittedSessionPlacementTurn(claim, params, task, onAdmitted) {
	let admitted = false;
	const admitTurn = () => {
		if (admitted) return;
		admitted = true;
		onAdmitted?.();
	};
	const runAdmittedLocalTurn = async () => {
		assertRequiredWorkerLocalExecution(readRuntimeConfig(), "Gateway");
		assertRequiredWorkerLocalExecution(params.config ?? {}, "Gateway");
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
	const assertCurrent = composeSessionSourceAssertion([params.preparedRunAdmission?.assertSourceCurrent, assertAdmittedRunCurrent], (assertSources) => {
		params.abortSignal?.throwIfAborted();
		assertSources();
		if (params.admittedRunContext && !assertAdmittedRunCurrent) throw createAbortError("admitted run authority is no longer active");
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		if (state.provider !== provider) throw createAbortError("session placement owner changed during turn admission");
	});
	const result = await withPlacementTurnCallerScope(params, () => withoutSessionPlacementForcedTerminalSettlement(() => provider ? provider.executeTurn(claim, params, runAdmittedLocalTurn, admitTurn, assertCurrent) : runAdmittedLocalTurn()));
	if (result.meta.executionTrace?.runner === "cli" && params.isFinalFallbackAttempt === void 0) await settleRequesterRun({
		...params,
		...claim
	}, result, assertCurrent);
	return result;
}
/** Serializes direct CLI turns with every runtime before acquiring placement ownership. */
async function withLocalSessionPlacementTurnSettlement(claim, task, options = {}) {
	const assertLocalAllowed = () => {
		assertRequiredWorkerLocalExecution(readRuntimeConfig(), "Local CLI");
	};
	assertLocalAllowed();
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
				assertLocalAllowed();
				assertCurrent();
				const assertClaimCurrent = resolveSessionPlacementTurnSettlementAssertion();
				let open = true;
				const assertSettlementCurrent = composeSessionSourceAssertion([assertClaimCurrent], (assertSource) => {
					if (!open || !isCommandLaneTaskMarkerCurrent(taskMarker)) throw createSessionPlacementSettlementClosedAbortError();
					assertOwnerCurrent();
					assertSource();
				});
				try {
					assertSettlementCurrent();
					releaseCapacityWait?.();
					releaseQueuedContext?.("admitted");
					return await task(assertSettlementCurrent);
				} finally {
					open = false;
				}
			};
			const result = await withPlacementTurnCallerScope(options, () => withoutSessionPlacementForcedTerminalSettlement(() => provider ? provider.executeLocalTurn(claim, runLocal, assertCurrent) : runLocal()));
			if (options.isFinalFallbackAttempt === void 0) await settleRequesterRun({
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
			abortSignal: options.abortSignal,
			sessionTarget: claim,
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
/** Retains the selected placement owner, including absence, until its consumer settles. */
async function prepareSessionPlacementSandbox(params) {
	const provider = state.provider;
	const prepared = await provider?.prepareSandbox?.(params);
	let released = false;
	const assertCurrent = () => {
		if (released || state.provider !== provider) throw createAbortError("session placement owner changed during sandbox use");
		prepared?.assertCurrent();
	};
	try {
		assertCurrent();
		return {
			sandbox: prepared?.sandbox ?? null,
			assertCurrent,
			[Symbol.dispose]() {
				released = true;
				prepared?.[Symbol.dispose]();
			}
		};
	} catch (error) {
		prepared?.[Symbol.dispose]();
		throw error;
	}
}
/** The current placement owner alone can settle a proven terminal worker turn. */
async function recoverTerminalSessionPlacementTurn(session, assertCurrent) {
	const provider = state.provider;
	return await provider?.recoverTerminalTurn?.(session, () => {
		assertCurrent?.();
		if (state.provider !== provider) throw new Error("session placement owner changed during terminal recovery");
	});
}
//#endregion
export { resolveSessionPlacementRuntimeOverride as a, withRequiredSessionPlacement as c, settleRequesterRun as d, EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS as f, shouldNoteLaneWait as h, recoverTerminalSessionPlacementTurn as i, withSessionPlacementTurnAdmission as l, resolveEmbeddedRunSessionLanePolicy as m, installSessionPlacementAdmissionProvider as n, sessionPlacementUsesWorkerInference as o, resolveEmbeddedRunLaneTimeoutMs as p, prepareSessionPlacementSandbox as r, withLocalSessionPlacementTurnSettlement as s, captureSessionPlacementCompactionSuccessorAssertion as t, settleFailedRequesterRun as u };
