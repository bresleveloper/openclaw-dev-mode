import { it as removeMainSessionRecoveryForegroundClaim, nt as buildMainSessionRecoveryClearPatch, rt as buildMainSessionRecoverySettlementPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { O as recordLifecycleFence, S as isRetryableUnadoptedChatClaim, b as hasRestartRecoveryTerminalRun, v as hasMainSessionRecoveryClaim, x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import { r as sanitizePendingFinalDeliveryText, t as PENDING_FINAL_DELIVERY_CLEAR_PATCH } from "./pending-final-delivery-state-BbiRPEt1.mjs";
import { o as resolveRestartRecoveryTerminalClientRunId, r as isKilledMainSessionRecoveryFenceOnly } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-empty-aggregate.ts
function isMainRestartRecoveryAggregateEmptyAndUnowned(entry) {
	const state = entry.mainRestartRecovery;
	return entry.abortedLastRun !== true && state !== void 0 && state.chargedAttempts === 0 && state.startedAttempt === void 0 && state.executionIdentity === void 0 && state.reservation === void 0 && state.foregroundClaims === void 0 && state.tombstone === void 0 && entry.restartRecoveryRuns === void 0 && entry.restartRecoveryDeliveryRunId === void 0 && entry.pendingFinalDelivery === void 0;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-state.ts
function updateRecoveryState(entry, state, patch) {
	return entry.mainRestartRecovery = {
		...state,
		revision: state.revision + 1,
		...patch
	};
}
function createCycle(cycleId) {
	return {
		cycleId,
		revision: 1,
		chargedAttempts: 0
	};
}
function getMainSessionRecoveryRetryCount(state) {
	return state ? state.chargedAttempts - (state.startedAttempt ?? 0) : 0;
}
function matchesObservation(entry, observation) {
	if (entry.sessionId !== observation.sessionId) return "session_replaced";
	if (entry.mainRestartRecovery?.cycleId !== observation.cycleId) return "stale_cycle";
	return entry.mainRestartRecovery.revision === observation.revision ? null : "stale_revision";
}
function hasCurrentForegroundClaim(state, lifecycleGeneration) {
	return state.foregroundClaims?.lifecycleGeneration === lifecycleGeneration && state.foregroundClaims.tokens.length > 0;
}
function ownsForegroundClaim(state, claim) {
	return state?.cycleId === claim.cycleId && state.foregroundClaims?.lifecycleGeneration === claim.lifecycleGeneration && state.foregroundClaims.tokens.includes(claim.claimId);
}
function validateRecoveryAdmission(entry, command) {
	const state = entry.mainRestartRecovery;
	if (entry.sessionId !== command.sessionId) return "session_replaced";
	if (entry.abortedLastRun !== true || !state) return "not_interrupted";
	if (state.reservation?.runId !== command.runId || state.reservation.lifecycleGeneration !== command.lifecycleGeneration) return "stale_reservation";
	return hasCurrentForegroundClaim(state, command.lifecycleGeneration) ? "foreground_active" : null;
}
function isMainSessionRecoveryPending(entry, sessionKey) {
	const state = entry.mainRestartRecovery;
	return hasMainSessionRecoveryClaim(entry) && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, sessionKey) && !state?.foregroundClaims && !state?.reservation && !state?.tombstone;
}
/** Select reconciliation before new input adds custody; the store owner checks run liveness. */
function isMainSessionRecoveryReconciliationCandidate(entry) {
	return (isKilledMainSessionRecoveryFenceOnly(entry) || (entry.status === void 0 || entry.status === "failed" || isMainRestartRecoveryTerminalOnly(entry)) && entry.abortedLastRun !== true) && hasMainSessionRecoveryClaim(entry) && !isRetryableUnadoptedChatClaim(entry) && !entry.mainRestartRecovery?.tombstone;
}
/** A later foreground outcome cannot settle a different run's recovery fence. */
function hasCompletedMainSessionRecoveryOutcome(entry) {
	return isTerminalSessionStatus(entry.status) && entry.status !== "interrupted" && !isRetryableUnadoptedChatClaim(entry) && !entry.pendingFinalDelivery && !entry.restartRecoveryHarnessCompletion && (entry.restartRecoveryRuns ?? []).every((run) => hasRestartRecoveryTerminalRun(entry, run.runId));
}
function inspectMainRestartRecoveryRolloverEligibility(entry) {
	if (!entry.mainRestartRecovery?.tombstone) return {
		eligible: false,
		reason: "not_tombstoned"
	};
	const recoveredSessionId = entry.mainRestartRecovery.tombstone.recoveredSessionId;
	const recoveredSessionKey = entry.mainRestartRecovery.tombstone.recoveredSessionKey;
	if (recoveredSessionId || recoveredSessionKey) return {
		eligible: false,
		reason: "already_recovered",
		...recoveredSessionId ? { recoveredSessionId } : {},
		...recoveredSessionKey ? { recoveredSessionKey } : {}
	};
	return { eligible: true };
}
function isMainRestartRecoveryTerminalOnly(entry) {
	const state = entry.mainRestartRecovery;
	if (state?.tombstone || state?.reservation || state?.foregroundClaims) return false;
	if (entry.restartRecoveryDeliveryRunId !== void 0 || entry.pendingFinalDelivery) return false;
	const runs = entry.restartRecoveryRuns;
	return runs !== void 0 && runs.length > 0 && runs.every((run) => hasRestartRecoveryTerminalRun(entry, run.runId));
}
function inspectMainSessionRecovery(params) {
	const { entry } = params;
	const state = entry.mainRestartRecovery;
	if (state?.tombstone) return { status: "tombstoned" };
	if (state && hasCurrentForegroundClaim(state, params.lifecycleGeneration)) return { status: "blocked" };
	if (entry.abortedLastRun !== true && state && entry.restartRecoveryRuns?.some((run) => run.lifecycleGeneration === params.lifecycleGeneration)) return { status: "blocked" };
	if (entry.abortedLastRun !== true || !isMainRestartRecoveryCandidate(entry, params.sessionKey) || !state) return { status: "inactive" };
	const observation = {
		sessionId: entry.sessionId,
		cycleId: state.cycleId,
		revision: state.revision
	};
	if (state.reservation) return { status: "blocked" };
	const retryCount = getMainSessionRecoveryRetryCount(state);
	if (retryCount >= 3) return {
		status: "exhausted",
		observation,
		reason: `main-session restart recovery blocked after ${retryCount} automatic attempts without a started runtime turn; inspect the failed main session and use /new or reset to start a replacement session`
	};
	return {
		status: "recoverable",
		observation,
		nextAttempt: state.chargedAttempts + 1
	};
}
function inspectMainSessionRecoveryForAdmission(params) {
	if (params.entry.abortedLastRun !== true && params.entry.mainRestartRecovery && params.entry.restartRecoveryRuns?.length && !isMainRestartRecoveryTerminalOnly(params.entry)) return { status: "blocked" };
	if (hasMainSessionRecoveryClaim(params.entry) && params.entry.abortedLastRun === true && isMainRestartRecoveryCandidate(params.entry, params.sessionKey) && !params.entry.mainRestartRecovery) return { status: "blocked" };
	return inspectMainSessionRecovery(params);
}
function transitionMainSessionRecovery(entry, command) {
	switch (command.kind) {
		case "mark_interrupted": {
			const startedAt = entry.lifecycleRunId ? entry.startedAt : void 0;
			const preserveOutcome = entry.status === void 0 && entry.endedAt !== void 0 || isTerminalSessionStatus(entry.status) && entry.status !== "interrupted" && Boolean(entry.restartRecoveryDeliveryRunId || entry.pendingFinalDelivery);
			entry.restartRecoveryDeliverySourceRunId ??= entry.restartRecoveryDeliveryRunId ?? entry.lifecycleRunId;
			const state = entry.mainRestartRecovery;
			if (!state) entry.mainRestartRecovery = createCycle(command.cycleId);
			else if (state.foregroundClaims || state.reservation) updateRecoveryState(entry, state, {
				foregroundClaims: void 0,
				reservation: void 0
			});
			entry.activeWriterRunId = void 0;
			entry.lifecycleRunId = void 0;
			entry.abortedLastRun = true;
			if (!preserveOutcome) {
				entry.status = "interrupted";
				entry.lastRunId = void 0;
				entry.startedAt = startedAt;
				entry.endedAt = command.now;
				entry.runtimeMs = typeof entry.startedAt === "number" ? Math.max(0, command.now - entry.startedAt) : void 0;
				entry.lastRunError = "Run interrupted by Gateway restart or loss.";
			}
			for (const run of command.runs ?? []) recordLifecycleFence(entry, run);
			entry.updatedAt = command.now;
			return { kind: "applied" };
		}
		case "inspect": return {
			kind: "observed",
			view: inspectMainSessionRecoveryForAdmission({
				entry,
				lifecycleGeneration: command.lifecycleGeneration,
				sessionKey: command.sessionKey
			})
		};
		case "observe": {
			if (hasMainSessionRecoveryClaim(entry) && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, command.sessionKey) && !entry.mainRestartRecovery) entry.mainRestartRecovery = createCycle(command.cycleId);
			let state = entry.mainRestartRecovery;
			if (state?.foregroundClaims && state.foregroundClaims.lifecycleGeneration !== command.lifecycleGeneration) {
				if (entry.abortedLastRun !== true) {
					Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
					state = void 0;
				} else state = updateRecoveryState(entry, state, { foregroundClaims: void 0 });
			}
			if (state?.reservation && state.reservation.lifecycleGeneration !== command.lifecycleGeneration) state = updateRecoveryState(entry, state, { reservation: void 0 });
			if (isMainRestartRecoveryAggregateEmptyAndUnowned(entry) || isMainRestartRecoveryTerminalOnly(entry) || hasCompletedMainSessionRecoveryOutcome(entry) && !state?.tombstone && !state?.reservation && !(state && hasCurrentForegroundClaim(state, command.lifecycleGeneration))) Object.assign(entry, buildMainSessionRecoverySettlementPatch({
				entry,
				recordTerminalSource: true
			}));
			return {
				kind: "observed",
				view: inspectMainSessionRecovery({
					entry,
					lifecycleGeneration: command.lifecycleGeneration,
					sessionKey: command.sessionKey
				})
			};
		}
		case "prepare_attempt": {
			const conflict = matchesObservation(entry, command.observation);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			const state = entry.mainRestartRecovery;
			if (entry.abortedLastRun !== true) return {
				kind: "rejected",
				reason: "not_interrupted"
			};
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			if (state.reservation) return {
				kind: "rejected",
				reason: "reservation_active"
			};
			if (command.attempt !== state.chargedAttempts + 1) return {
				kind: "rejected",
				reason: "stale_revision"
			};
			updateRecoveryState(entry, state, {
				executionIdentity: command.executionIdentity.state === "enabled" && state.executionIdentity ? state.executionIdentity : void 0,
				chargedAttempts: command.attempt,
				reservation: {
					runId: command.runId,
					attempt: command.attempt,
					lifecycleGeneration: command.lifecycleGeneration
				}
			});
			entry.updatedAt = command.now;
			return {
				kind: "reserved",
				reservation: {
					sessionId: entry.sessionId,
					cycleId: state.cycleId,
					lifecycleGeneration: command.lifecycleGeneration,
					runId: command.runId,
					attempt: command.attempt
				}
			};
		}
		case "bind_admitted_execution_identity":
		case "register_recovery_turn": {
			const state = entry.mainRestartRecovery;
			if (!state || state.cycleId !== command.cycleId || state.chargedAttempts !== command.attempt || entry.sessionId !== command.sessionId || entry.lifecycleRunId !== command.runId || !entry.restartRecoveryRuns?.some((run) => run.runId === command.runId && run.lifecycleGeneration === command.lifecycleGeneration)) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			if (command.kind === "register_recovery_turn") {
				if (state.startedAttempt === command.attempt) return { kind: "no_change" };
				updateRecoveryState(entry, state, { startedAttempt: command.attempt });
			} else {
				if (state.executionIdentity) return JSON.stringify(state.executionIdentity) === JSON.stringify(command.token) ? { kind: "no_change" } : {
					kind: "rejected",
					reason: "stale_reservation"
				};
				if (command.token.runId !== command.runId) return {
					kind: "rejected",
					reason: "stale_reservation"
				};
				updateRecoveryState(entry, state, { executionIdentity: command.token });
			}
			return { kind: "applied" };
		}
		case "cancel_reservation":
		case "abandon_reservation": {
			const state = entry.mainRestartRecovery;
			const reserved = state?.reservation;
			if (!state || entry.sessionId !== command.reservation.sessionId || state.cycleId !== command.reservation.cycleId || reserved?.runId !== command.reservation.runId || reserved.attempt !== command.reservation.attempt || reserved.lifecycleGeneration !== command.reservation.lifecycleGeneration) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			updateRecoveryState(entry, state, {
				chargedAttempts: command.kind === "cancel_reservation" ? Math.max(0, command.reservation.attempt - 1) : state.chargedAttempts,
				reservation: void 0
			});
			if (isMainRestartRecoveryAggregateEmptyAndUnowned(entry)) Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
			return { kind: "applied" };
		}
		case "validate_recovery":
		case "admit_recovery": {
			const conflict = validateRecoveryAdmission(entry, command);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			if (command.kind === "validate_recovery") return { kind: "recovery_validated" };
			const state = entry.mainRestartRecovery;
			updateRecoveryState(entry, state, {
				reservation: void 0,
				foregroundClaims: void 0
			});
			entry.abortedLastRun = false;
			entry.status = void 0;
			entry.endedAt = void 0;
			entry.runtimeMs = void 0;
			entry.lastRunError = void 0;
			entry.lifecycleRunId = command.runId;
			entry.lastRunId = void 0;
			recordLifecycleFence(entry, {
				runId: command.runId,
				lifecycleGeneration: command.lifecycleGeneration
			});
			if (entry.pendingFinalDelivery?.kind === "replayable") {
				const pendingText = sanitizePendingFinalDeliveryText(entry.pendingFinalDelivery.text);
				if (pendingText) entry.pendingFinalDelivery = {
					...entry.pendingFinalDelivery,
					text: pendingText
				};
				else Object.assign(entry, PENDING_FINAL_DELIVERY_CLEAR_PATCH);
			}
			return {
				kind: "admitted_recovery",
				admission: {
					cycleId: state.cycleId,
					attempt: state.chargedAttempts,
					lifecycleGeneration: command.lifecycleGeneration,
					runId: command.runId,
					sessionId: command.sessionId
				}
			};
		}
		case "mark_admitted_recovery_interrupted": {
			const state = entry.mainRestartRecovery;
			if (entry.sessionId !== command.sessionId) return {
				kind: "rejected",
				reason: "session_replaced"
			};
			if (!state || state.cycleId !== command.cycleId || state.chargedAttempts !== command.attempt || state.reservation || state.foregroundClaims || !entry.restartRecoveryRuns?.some((run) => run.runId === command.runId && run.lifecycleGeneration === command.lifecycleGeneration)) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			if (entry.lifecycleRunId !== command.runId) return entry.abortedLastRun === true && entry.lifecycleRunId === void 0 && entry.restartRecoveryDeliveryRunId === void 0 ? { kind: "no_change" } : {
				kind: "rejected",
				reason: "stale_reservation"
			};
			entry.status = "interrupted";
			entry.lifecycleRunId = void 0;
			entry.lastRunId = void 0;
			entry.abortedLastRun = true;
			entry.startedAt = void 0;
			entry.endedAt = command.now;
			entry.lastRunError = "Run interrupted before restart recovery could start.";
			entry.runtimeMs = void 0;
			if (entry.restartRecoveryDeliveryRunId === command.runId) entry.restartRecoveryDeliveryRunId = void 0;
			entry.updatedAt = command.now;
			return { kind: "applied" };
		}
		case "claim_foreground": {
			if (entry.sessionId === command.sessionId && isMainRestartRecoveryCandidate(entry, command.sessionKey) && (isMainRestartRecoveryTerminalOnly(entry) || isMainRestartRecoveryAggregateEmptyAndUnowned(entry))) {
				Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
				return { kind: "applied" };
			}
			if (entry.sessionId !== command.sessionId || !hasMainSessionRecoveryClaim(entry) || entry.abortedLastRun !== true || !isMainRestartRecoveryCandidate(entry, command.sessionKey)) return { kind: "no_change" };
			const state = entry.mainRestartRecovery ?? createCycle(command.cycleId);
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			if (getMainSessionRecoveryRetryCount(state) >= 3) return {
				kind: "rejected",
				reason: "recovery_exhausted"
			};
			const currentClaims = state.foregroundClaims?.lifecycleGeneration === command.lifecycleGeneration ? state.foregroundClaims : void 0;
			const tokens = [.../* @__PURE__ */ new Set([...currentClaims?.tokens ?? [], command.claimId])].toSorted();
			const runIdsByClaimId = command.runId ? {
				...currentClaims?.runIdsByClaimId,
				[command.claimId]: command.runId
			} : currentClaims?.runIdsByClaimId;
			if (command.runId) recordLifecycleFence(entry, {
				lifecycleGeneration: command.lifecycleGeneration,
				runId: command.runId
			});
			updateRecoveryState(entry, state, {
				reservation: state.reservation?.lifecycleGeneration === command.lifecycleGeneration ? state.reservation : void 0,
				foregroundClaims: {
					lifecycleGeneration: command.lifecycleGeneration,
					tokens,
					...runIdsByClaimId ? { runIdsByClaimId } : {}
				}
			});
			return {
				kind: "foreground_claimed",
				claim: {
					cycleId: state.cycleId,
					lifecycleGeneration: command.lifecycleGeneration,
					claimId: command.claimId,
					sessionId: entry.sessionId,
					sessionKey: command.sessionKey,
					...command.runId ? { runId: command.runId } : {}
				}
			};
		}
		case "bind_foreground_run":
		case "release_foreground": {
			const state = entry.mainRestartRecovery;
			const claims = state?.foregroundClaims;
			if (!state || !claims || !ownsForegroundClaim(state, command.claim)) return { kind: "no_change" };
			if (command.kind === "bind_foreground_run") recordLifecycleFence(entry, {
				lifecycleGeneration: command.claim.lifecycleGeneration,
				runId: command.runId
			});
			const foregroundClaims = command.kind === "bind_foreground_run" ? {
				...claims,
				runIdsByClaimId: {
					...claims.runIdsByClaimId,
					[command.claim.claimId]: command.runId
				}
			} : removeMainSessionRecoveryForegroundClaim(claims, command.claim.claimId);
			if (!foregroundClaims && entry.abortedLastRun !== true) Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
			else updateRecoveryState(entry, state, { foregroundClaims });
			return { kind: "applied" };
		}
		case "validate_foreground": {
			const state = entry.mainRestartRecovery;
			return entry.sessionId === command.claim.sessionId && ownsForegroundClaim(state, command.claim) ? { kind: "foreground_validated" } : { kind: "no_change" };
		}
		case "tombstone": {
			const conflict = matchesObservation(entry, command.observation);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			const state = entry.mainRestartRecovery;
			if (state.reservation) return {
				kind: "rejected",
				reason: "reservation_active"
			};
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			updateRecoveryState(entry, state, { tombstone: { reason: command.reason } });
			entry.abortedLastRun = false;
			entry.status = "failed";
			entry.lifecycleRunId = void 0;
			entry.lastRunId = resolveRestartRecoveryTerminalClientRunId(entry);
			entry.endedAt = command.now;
			entry.runtimeMs = Math.max(0, command.now - (entry.startedAt ?? command.now));
			entry.updatedAt = command.now;
			return { kind: "tombstoned" };
		}
		case "doctor_repair":
			if (!entry.mainRestartRecovery?.tombstone || entry.abortedLastRun !== true) return { kind: "no_change" };
			entry.abortedLastRun = false;
			entry.updatedAt = command.now;
			return { kind: "doctor_repaired" };
		case "clear": {
			const patch = buildMainSessionRecoveryClearPatch(entry);
			if (Object.keys(patch).length === 0) return { kind: "no_change" };
			Object.assign(entry, patch);
			return { kind: "applied" };
		}
		default: return command;
	}
}
//#endregion
export { isMainSessionRecoveryPending as a, isMainRestartRecoveryTerminalOnly as i, hasCompletedMainSessionRecoveryOutcome as n, isMainSessionRecoveryReconciliationCandidate as o, inspectMainRestartRecoveryRolloverEligibility as r, transitionMainSessionRecovery as s, getMainSessionRecoveryRetryCount as t };
