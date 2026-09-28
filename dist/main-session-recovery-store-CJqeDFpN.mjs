import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { y as applySessionEntryReplacements } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { a as isMainSessionRecoveryPending, c as transitionMainSessionRecovery, i as isMainRestartRecoveryCandidate } from "./main-session-recovery-state-uW-wldbD.mjs";
import { a as scheduleMainSessionRecoveryMutation, i as retryMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-ixJMfYJz.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-recovery-store.ts
function matchesReservation(entry, reservation) {
	const state = entry.mainRestartRecovery;
	return entry.sessionId === reservation.sessionId && state?.cycleId === reservation.cycleId && state.reservation?.runId === reservation.runId && state.reservation.lifecycleGeneration === reservation.lifecycleGeneration;
}
function currentGenerationRequiredBy(command) {
	if (command.kind === "validate_foreground" || command.kind === "bind_foreground_run") return command.claim.lifecycleGeneration;
	return "lifecycleGeneration" in command ? command.lifecycleGeneration : void 0;
}
async function commitMainSessionRecovery(params) {
	const reservationCleanup = params.command.kind === "cancel_reservation" || params.command.kind === "abandon_reservation" ? params.command.reservation : void 0;
	const recoveryAdmission = params.command.kind === "admit_recovery" || params.command.kind === "validate_recovery" ? params.command : void 0;
	const ownerClaim = params.command.kind === "claim_foreground" ? params.command : void 0;
	const exactOwnerClaim = params.command.kind === "validate_foreground" || params.command.kind === "release_foreground" ? params.command.claim : void 0;
	return await applySessionEntryReplacements({
		agentId: params.target.agentId,
		requireWriteSuccess: params.requireWriteSuccess,
		...params.scanAliases ? {} : { sessionKeys: [params.target.sessionKey] },
		storePath: params.target.storePath,
		update: (entries) => {
			const expectedGeneration = currentGenerationRequiredBy(params.command);
			if (params.shouldContinue?.() === false || expectedGeneration && expectedGeneration !== getAgentEventLifecycleGeneration()) return { result: { transition: {
				kind: "rejected",
				reason: "stale_generation"
			} } };
			const selected = entries.find(({ sessionKey }) => sessionKey === params.target.sessionKey);
			let candidate = params.expectedSessionId && selected?.entry.sessionId !== params.expectedSessionId || ownerClaim && selected?.entry.sessionId !== ownerClaim.sessionId ? void 0 : selected;
			if (reservationCleanup) candidate = entries.find(({ entry }) => matchesReservation(entry, reservationCleanup));
			else if (recoveryAdmission) candidate = entries.find(({ entry }) => {
				const reservation = entry.mainRestartRecovery?.reservation;
				return entry.sessionId === recoveryAdmission.sessionId && reservation?.runId === recoveryAdmission.runId && reservation.lifecycleGeneration === recoveryAdmission.lifecycleGeneration;
			});
			else if (exactOwnerClaim) candidate = entries.find(({ entry }) => {
				const state = entry.mainRestartRecovery;
				return state?.cycleId === exactOwnerClaim.cycleId && state.foregroundClaims?.lifecycleGeneration === exactOwnerClaim.lifecycleGeneration && state.foregroundClaims.tokens.includes(exactOwnerClaim.claimId);
			});
			else if (ownerClaim && (!selected || selected.entry.sessionId !== ownerClaim.sessionId)) candidate = entries.find(({ entry }) => entry.sessionId === ownerClaim.sessionId);
			else if (params.scanAliases && params.expectedSessionId) candidate = entries.find(({ entry }) => entry.sessionId === params.expectedSessionId);
			if (!candidate && !params.scanAliases && (reservationCleanup || recoveryAdmission || exactOwnerClaim || ownerClaim || params.command.kind === "inspect")) return { result: void 0 };
			if (reservationCleanup || recoveryAdmission || exactOwnerClaim) candidate ??= selected;
			if (!candidate) return { result: {
				entry: selected?.entry,
				sessionKey: selected?.sessionKey,
				transition: {
					kind: "rejected",
					reason: "session_replaced"
				}
			} };
			const entry = candidate.entry;
			const previousRecoveryState = entry.mainRestartRecovery;
			const command = (params.command.kind === "claim_foreground" || params.command.kind === "observe" || params.command.kind === "inspect") && params.command.sessionKey !== candidate.sessionKey ? {
				...params.command,
				sessionKey: candidate.sessionKey
			} : params.command;
			const transition = transitionMainSessionRecovery(entry, command);
			const changed = previousRecoveryState !== entry.mainRestartRecovery || transition.kind !== "foreground_validated" && transition.kind !== "no_change" && transition.kind !== "observed" && transition.kind !== "rejected";
			return {
				result: {
					entry,
					sessionKey: candidate.sessionKey,
					transition
				},
				...changed ? { replacements: [{
					sessionKey: candidate.sessionKey,
					entry
				}] } : {}
			};
		}
	}) ?? commitMainSessionRecovery({
		...params,
		scanAliases: true
	});
}
async function refreshMainSessionRecoveryOwner(lease, runId) {
	const result = await commitMainSessionRecovery({
		command: runId ? {
			kind: "bind_foreground_run",
			claim: lease,
			runId
		} : {
			kind: "validate_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	});
	return (runId ? result.transition.kind === "applied" : result.transition.kind === "foreground_validated") && result.entry && result.sessionKey ? {
		lease: runId ? {
			...lease,
			runId
		} : lease,
		entry: result.entry,
		sessionKey: result.sessionKey
	} : void 0;
}
async function claimMainSessionRecoveryOwner(params) {
	const claim = await commitMainSessionRecovery({
		command: {
			kind: "claim_foreground",
			cycleId: randomUUID(),
			lifecycleGeneration: params.lifecycleGeneration,
			sessionId: params.sessionId,
			sessionKey: params.target.sessionKey,
			claimId: randomUUID(),
			...params.runId ? { runId: params.runId } : {}
		},
		requireWriteSuccess: true,
		target: params.target
	});
	if (claim.transition.kind === "foreground_claimed") {
		if (!claim.entry || !claim.sessionKey) return {
			kind: "invalidated",
			reason: "state_changed"
		};
		return {
			kind: "claimed",
			lease: {
				...params.target,
				...claim.transition.claim
			},
			entry: claim.entry,
			sessionKey: claim.sessionKey
		};
	}
	if (claim.transition.kind === "rejected" && claim.transition.reason === "stale_generation") return {
		kind: "invalidated",
		reason: claim.transition.reason
	};
	if (!claim.entry && (params.allowMissingSession || params.replacementSessionId)) return { kind: "not_required" };
	const healthyExpectedSession = claim.entry && claim.entry.abortedLastRun !== true && claim.entry.restartRecoveryRuns === void 0 && claim.entry.mainRestartRecovery === void 0 && (claim.entry.sessionId === params.sessionId || claim.entry.sessionId === params.replacementSessionId);
	if (claim.entry?.sessionId === params.sessionId && claim.sessionKey && !isMainRestartRecoveryCandidate(claim.entry, claim.sessionKey)) return { kind: "not_required" };
	if (healthyExpectedSession) return { kind: "not_required" };
	return {
		kind: "invalidated",
		reason: claim.transition.kind === "rejected" ? claim.transition.reason : "state_changed"
	};
}
async function inspectMainSessionRecoveryRequired(params) {
	const result = await commitMainSessionRecovery({
		command: {
			kind: "inspect",
			lifecycleGeneration: params.lifecycleGeneration,
			sessionKey: params.target.sessionKey
		},
		expectedSessionId: params.expectedSessionId,
		requireWriteSuccess: true,
		target: params.target
	});
	if (result.transition.kind === "observed") return result.transition.view.status === "inactive" ? { kind: "not_required" } : { kind: "required" };
	if (result.transition.kind === "rejected" && result.transition.reason === "session_replaced") return !result.entry && params.allowMissingSession ? { kind: "not_required" } : {
		kind: "invalidated",
		reason: result.transition.reason
	};
	return {
		kind: "invalidated",
		reason: result.transition.kind === "rejected" ? result.transition.reason : "state_changed"
	};
}
async function releaseMainSessionRecoveryOwnerWithRetries(lease) {
	const released = await retryMainSessionRecoveryMutation(async () => commitMainSessionRecovery({
		command: {
			kind: "release_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	}));
	const { entry, sessionKey } = released;
	if (released.transition.kind !== "applied" && released.transition.kind !== "no_change" || !entry || !sessionKey || entry.sessionId !== lease.sessionId || !isMainSessionRecoveryPending(entry, sessionKey)) return;
	return {
		agentId: lease.agentId,
		sessionId: entry.sessionId,
		sessionKey,
		storePath: lease.storePath
	};
}
async function releaseMainSessionRecoveryOwner(lease) {
	if (!lease) return;
	try {
		return await releaseMainSessionRecoveryOwnerWithRetries(lease);
	} catch (error) {
		scheduleMainSessionRecoveryMutation({
			mutation: () => releaseMainSessionRecoveryOwnerWithRetries(lease),
			onSuccess: async (pending) => {
				if (pending) {
					const { scheduleMainSessionRecoveryPendingTarget } = await import("./main-session-recovery-owner-release-lTo0sKSW.mjs");
					scheduleMainSessionRecoveryPendingTarget(pending);
				}
			}
		});
		throw error;
	}
}
//#endregion
export { releaseMainSessionRecoveryOwner as a, refreshMainSessionRecoveryOwner as i, commitMainSessionRecovery as n, inspectMainSessionRecoveryRequired as r, claimMainSessionRecoveryOwner as t };
