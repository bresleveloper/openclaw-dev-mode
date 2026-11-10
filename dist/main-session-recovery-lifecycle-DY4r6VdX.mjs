import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { it as removeMainSessionRecoveryForegroundClaim, nt as buildMainSessionRecoveryClearPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { m as resolveAgentRunErrorLifecycleFields } from "./run-termination-Dwf1ksjA.mjs";
import { w as mergeRestartRecoveryTerminalRunIds } from "./store-maintenance-BqMt1Twc.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as isAgentRunResumableToolTimeout } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
//#region src/agents/agent-lifecycle-parent-state.ts
function isAgentLifecycleYieldedWaiting(event) {
	return event.phase === "end" && event.yielded === true && event.livenessState === "paused" && event.stopReason === "end_turn" && event.aborted !== true && event.status !== "cancelled" && event.status !== "timed_out" && event.timeoutPhase == null && event.error == null;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-lifecycle.ts
const MAIN_SESSION_RECOVERY_RETRY_DELAY_MS = 1e3;
const MAIN_SESSION_RECOVERY_RETRY_MAX_DELAY_MS = 3e4;
async function retryMainSessionRecoveryMutation(mutation) {
	return await retryAsync(mutation, 3, 25);
}
/** Retries now, then leaves an exact idempotent repair queued after transient failure. */
async function repairMainSessionRecoveryMutation(params) {
	try {
		return await retryMainSessionRecoveryMutation(params.mutation);
	} catch (error) {
		params.onError(error);
		scheduleMainSessionRecoveryMutation({
			mutation: () => retryMainSessionRecoveryMutation(params.mutation),
			onSuccess: params.onDeferredSuccess
		});
		return;
	}
}
/** Keeps an idempotent durable-state repair alive until it succeeds or restart retires it. */
function scheduleMainSessionRecoveryMutation(params) {
	const delayMs = params.delayMs ?? MAIN_SESSION_RECOVERY_RETRY_DELAY_MS;
	setTimeout(() => {
		params.mutation().then(params.onSuccess, (error) => {
			params.onError?.(error);
			scheduleMainSessionRecoveryMutation({
				...params,
				delayMs: Math.min(delayMs * 2, MAIN_SESSION_RECOVERY_RETRY_MAX_DELAY_MS)
			});
		});
	}, delayMs).unref?.();
}
function inspectMainSessionRecoveryLifecycleEvent(params) {
	const runId = params.event.runId?.trim();
	const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
	const phase = params.event.data?.phase;
	const terminal = phase === "end" || phase === "error" ? buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data: {
			...params.event.data,
			...resolveAgentRunErrorLifecycleFields(params.event.data?.error, params.abortSignal)
		}
	}) : void 0;
	const matchesFence = Boolean(runId && lifecycleGeneration && params.entry?.restartRecoveryRuns?.some((run) => run.runId === runId && (run.lifecycleGeneration === lifecycleGeneration || terminal && lifecycleGeneration === params.currentLifecycleGeneration && params.entry?.lifecycleRunId === runId)));
	const interrupted = terminal?.reason === "cancelled" && terminal.stopReason === "restart" || isAgentRunResumableToolTimeout(terminal);
	return {
		runId,
		lifecycleGeneration,
		terminal,
		matchesFence,
		interrupted,
		suppress: matchesFence && (phase === "start" && (params.entry?.abortedLastRun === true || lifecycleGeneration !== params.currentLifecycleGeneration) || interrupted && lifecycleGeneration !== params.currentLifecycleGeneration)
	};
}
function settleForegroundOwner(entry, runId, lifecycleGeneration, currentLifecycleGeneration) {
	const state = entry.mainRestartRecovery;
	const claims = state?.foregroundClaims;
	const claimId = lifecycleGeneration === currentLifecycleGeneration && claims?.lifecycleGeneration === lifecycleGeneration ? claims.tokens.find((token) => claims.runIdsByClaimId?.[token] === runId) : void 0;
	if (!state || !claims || !claimId) return { hasCurrentOwner: Boolean(claims?.lifecycleGeneration === currentLifecycleGeneration && claims.tokens.length) || state?.reservation?.lifecycleGeneration === currentLifecycleGeneration };
	const foregroundClaims = removeMainSessionRecoveryForegroundClaim(claims, claimId);
	return {
		claimId,
		state: {
			...state,
			revision: state.revision + 1,
			foregroundClaims
		},
		hasCurrentOwner: Boolean(foregroundClaims) || state.reservation?.lifecycleGeneration === currentLifecycleGeneration
	};
}
function projectMainSessionRecoveryLifecycle(params) {
	const apply = (patch) => ({
		action: "apply",
		patch
	});
	const { runId, lifecycleGeneration, terminal, matchesFence, suppress, interrupted } = inspectMainSessionRecoveryLifecycleEvent(params);
	if (suppress) return { action: "suppress" };
	if (params.entry?.mainRestartRecovery?.tombstone) return apply({
		...params.snapshotPatch,
		abortedLastRun: params.entry.abortedLastRun,
		restartRecoveryRuns: params.entry.restartRecoveryRuns,
		mainRestartRecovery: params.entry.mainRestartRecovery
	});
	const patch = { ...params.snapshotPatch };
	if (interrupted || isAgentLifecycleYieldedWaiting(params.event.data ?? {})) return lifecycleGeneration && lifecycleGeneration !== params.currentLifecycleGeneration ? { action: "suppress" } : apply(patch);
	const runs = params.entry?.restartRecoveryRuns;
	const remaining = matchesFence ? runs?.filter((run) => run.runId !== runId || lifecycleGeneration !== params.currentLifecycleGeneration && run.lifecycleGeneration !== lifecycleGeneration) : runs;
	if (terminal) {
		if (!matchesFence || !runId || !lifecycleGeneration) return params.entry?.mainRestartRecovery || runs?.length ? { action: "suppress" } : apply(patch);
		if (lifecycleGeneration !== params.currentLifecycleGeneration && remaining?.some((run) => run.runId === runId && run.lifecycleGeneration === params.currentLifecycleGeneration)) return apply({ restartRecoveryRuns: remaining });
		const foreground = settleForegroundOwner(params.entry ?? {}, runId, lifecycleGeneration, params.currentLifecycleGeneration);
		if (params.entry?.abortedLastRun === true && !foreground.claimId && !foreground.hasCurrentOwner && terminal.reason !== "hard_timeout") return apply({ restartRecoveryRuns: remaining?.length ? remaining : void 0 });
		if (foreground.hasCurrentOwner) return apply({
			restartRecoveryRuns: remaining?.length ? remaining : void 0,
			restartRecoveryTerminalRunIds: mergeRestartRecoveryTerminalRunIds(params.entry?.restartRecoveryTerminalRunIds, [runId]),
			...foreground.claimId ? { mainRestartRecovery: foreground.state } : {}
		});
		const recoveryDeliveryRunId = typeof params.entry?.restartRecoveryDeliveryRunId === "string" ? params.entry.restartRecoveryDeliveryRunId.trim() : void 0;
		if (!foreground.claimId && (remaining?.length ?? 0) > 0 && recoveryDeliveryRunId !== runId) {
			patch.abortedLastRun = false;
			patch.restartRecoveryRuns = remaining;
			patch.mainRestartRecovery = params.entry?.mainRestartRecovery;
			return apply(patch);
		}
		Object.assign(patch, buildMainSessionRecoveryClearPatch(params.entry));
		patch.abortedLastRun = params.snapshotPatch.abortedLastRun ?? false;
		return apply(patch);
	}
	return apply(patch);
}
//#endregion
export { scheduleMainSessionRecoveryMutation as a, retryMainSessionRecoveryMutation as i, projectMainSessionRecoveryLifecycle as n, isAgentLifecycleYieldedWaiting as o, repairMainSessionRecoveryMutation as r, inspectMainSessionRecoveryLifecycleEvent as t };
