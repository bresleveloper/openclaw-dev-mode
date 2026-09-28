import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { s as mergeRestartRecoveryTerminalRunIds } from "./restart-recovery-state-CVOwSXMV.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.mjs";
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
function lifecyclePhase(event) {
	const phase = event.data?.phase;
	return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
function isRestartCancellation(event) {
	const phase = lifecyclePhase(event);
	if (phase !== "end" && phase !== "error") return false;
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data: event.data
	});
	return outcome.reason === "cancelled" && outcome.stopReason === "restart";
}
function isMainSessionRecoveryLifecycleEvent(params) {
	const runId = params.event.runId?.trim();
	const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
	const phase = lifecyclePhase(params.event);
	const interrupted = isRestartCancellation(params.event);
	return Boolean(runId && lifecycleGeneration && params.entry?.restartRecoveryRuns?.some((run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration)) && (phase === "start" || (phase === "end" || phase === "error") && interrupted);
}
function settleForegroundOwner(entry, runId, lifecycleGeneration, currentLifecycleGeneration) {
	const state = entry.mainRestartRecovery;
	const claims = state?.foregroundClaims;
	const claimId = lifecycleGeneration === currentLifecycleGeneration && claims?.lifecycleGeneration === lifecycleGeneration ? claims.tokens.find((token) => claims.runIdsByClaimId?.[token] === runId) : void 0;
	if (!state || !claims || !claimId) return { hasCurrentOwner: Boolean(claims?.lifecycleGeneration === currentLifecycleGeneration && claims.tokens.length) || state?.reservation?.lifecycleGeneration === currentLifecycleGeneration };
	const tokens = claims.tokens.filter((token) => token !== claimId);
	const runIdsByClaimId = Object.fromEntries(Object.entries(claims.runIdsByClaimId ?? {}).filter(([token]) => token !== claimId));
	const foregroundClaims = tokens.length ? {
		lifecycleGeneration: claims.lifecycleGeneration,
		tokens,
		...Object.keys(runIdsByClaimId).length ? { runIdsByClaimId } : {}
	} : void 0;
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
	if (isMainSessionRecoveryLifecycleEvent(params)) return { action: "suppress" };
	if (params.entry?.mainRestartRecovery?.tombstone) return apply({
		...params.snapshotPatch,
		abortedLastRun: params.entry.abortedLastRun,
		restartRecoveryRuns: params.entry.restartRecoveryRuns,
		mainRestartRecovery: params.entry.mainRestartRecovery
	});
	const phase = lifecyclePhase(params.event);
	const settlesRecovery = (phase === "end" || phase === "error") && !isRestartCancellation(params.event);
	const patch = { ...params.snapshotPatch };
	const runId = params.event.runId?.trim();
	const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
	const runs = params.entry?.restartRecoveryRuns;
	const matchesFence = Boolean(runId && lifecycleGeneration && runs?.some((run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration));
	const remaining = matchesFence ? runs?.filter((run) => run.runId !== runId || lifecycleGeneration !== params.currentLifecycleGeneration && run.lifecycleGeneration !== lifecycleGeneration) : runs;
	if (settlesRecovery) {
		if (!matchesFence || !runId || !lifecycleGeneration) return params.entry?.mainRestartRecovery || runs?.length ? { action: "suppress" } : apply(patch);
		if (lifecycleGeneration !== params.currentLifecycleGeneration && remaining?.some((run) => run.runId === runId && run.lifecycleGeneration === params.currentLifecycleGeneration)) return apply({ restartRecoveryRuns: remaining });
		const foreground = settleForegroundOwner(params.entry ?? {}, runId, lifecycleGeneration, params.currentLifecycleGeneration);
		if (params.entry?.abortedLastRun === true && !foreground.claimId && !foreground.hasCurrentOwner && buildAgentRunTerminalOutcomeFromLifecycleEvent({
			phase,
			data: params.event.data
		}).reason !== "hard_timeout") return apply({ restartRecoveryRuns: remaining?.length ? remaining : void 0 });
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
		return apply(patch);
	}
	if (phase === "start" || !matchesFence || !remaining) return apply(patch);
	if (params.entry?.abortedLastRun === true && remaining.length > 0) return apply({ restartRecoveryRuns: remaining });
	patch.restartRecoveryRuns = remaining.length > 0 ? remaining : void 0;
	return apply(patch);
}
//#endregion
export { scheduleMainSessionRecoveryMutation as a, retryMainSessionRecoveryMutation as i, projectMainSessionRecoveryLifecycle as n, repairMainSessionRecoveryMutation as r, isMainSessionRecoveryLifecycleEvent as t };
