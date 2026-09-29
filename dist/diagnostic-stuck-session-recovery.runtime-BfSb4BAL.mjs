import { h as resolveActiveEmbeddedRunRecoveryBlocker } from "./run-state-CTlPY590.mjs";
import { a as getDiagnosticSessionActivitySnapshot, y as resolveRunStaleThresholdMs } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { r as isDiagnosticSessionStateCurrent } from "./diagnostic-session-state-DpvjzgzY.mjs";
import { t as diagnosticLogger } from "./diagnostic-runtime-BQEUFA0X.mjs";
import { _ as formatStoppedCronSessionDiagnosticFields, g as resolveStuckSessionRecoveryRef, h as formatRecoveryOutcome, v as resolveCronSessionDiagnosticContext } from "./diagnostic-CT1lx7JC.mjs";
import { C as resolveActiveEmbeddedRunHandleSessionIdBySessionFile, E as resolveActiveEmbeddedRunSessionIdBySessionFile, S as resolveActiveEmbeddedRunHandleSessionId, d as isEmbeddedAgentRunActive, f as isEmbeddedAgentRunHandleActive, k as resolveEmbeddedReplyActivity, t as abortAndDrainEmbeddedAgentRun } from "./runs-Cjzxx3Pg.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-BHX_SDCX.mjs";
import { a as getCommandLaneSnapshot, h as resetCommandLane, i as getCommandLaneActiveTaskIds } from "./command-queue-CaY517ob.mjs";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.mjs";
import { i as prepareStaleFollowupDrainRetirement } from "./drain-DGjQsdif.mjs";
import { r as recoverTerminalSessionPlacementTurn } from "./session-placement-admission-Gs1bL6J1.mjs";
//#region src/logging/diagnostic-stuck-session-recovery.runtime.ts
const STUCK_SESSION_ABORT_SETTLE_MS = 15e3;
const STUCK_SESSION_PROGRESS_STALE_MS = 3e5;
const STALE_ACTIVE_LANE_TASK_RELEASE_MS = STUCK_SESSION_PROGRESS_STALE_MS;
const recoveriesInFlight = /* @__PURE__ */ new Set();
function resolveStaleActiveProgressAbortMs(params) {
	const configured = params.staleActiveProgressAbortMs;
	return typeof configured === "number" && configured > 0 ? configured : STUCK_SESSION_PROGRESS_STALE_MS;
}
function resolveStaleActiveLaneTaskReleaseMs(params) {
	const compactionSafetyTimeoutMs = params.compactionSafetyTimeoutMs;
	const compactionReleaseMs = typeof compactionSafetyTimeoutMs === "number" && compactionSafetyTimeoutMs > 0 ? compactionSafetyTimeoutMs + STUCK_SESSION_ABORT_SETTLE_MS : 0;
	return Math.max(STALE_ACTIVE_LANE_TASK_RELEASE_MS, compactionReleaseMs);
}
function isActiveRunProgressStale(params) {
	if (!params.allowActiveAbort && (params.queueDepth ?? 0) <= 0 && params.requireQueueBacklog !== false) return false;
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey
	});
	if (activity.activeRetryWaitDeadlineAtMs !== void 0 && Date.now() < activity.activeRetryWaitDeadlineAtMs) return false;
	if (params.allowActiveAbort && activity.activeToolDeadlineAtMs === void 0) return activity.activeWorkKind === "tool_call" || activity.activeBackendLivenessDeadlineAtMs === void 0 || Date.now() >= activity.activeBackendLivenessDeadlineAtMs;
	const evidenceAgeMs = activity.lastProgressAgeMs ?? params.ageMs;
	return evidenceAgeMs >= resolveRunStaleThresholdMs(activity, evidenceAgeMs, params.staleAbortMs);
}
function formatRecoveryContext(params, extra) {
	const fields = [
		`sessionId=${params.sessionId ?? extra?.activeSessionId ?? "unknown"}`,
		`sessionKey=${params.sessionKey ?? "unknown"}`,
		`age=${Math.round(params.ageMs / 1e3)}s`,
		`queueDepth=${params.queueDepth ?? 0}`
	];
	if (extra?.activeSessionId) fields.push(`activeSessionId=${extra.activeSessionId}`);
	if (extra?.lane) fields.push(`lane=${extra.lane}`);
	if (extra?.activeCount !== void 0) fields.push(`laneActive=${extra.activeCount}`);
	if (extra?.queuedCount !== void 0) fields.push(`laneQueued=${extra.queuedCount}`);
	return fields.join(" ");
}
function reportRecoveryOutcome(outcome) {
	diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
	return outcome;
}
async function recoverStuckDiagnosticSession(params) {
	const key = resolveStuckSessionRecoveryRef(params);
	if (!key || recoveriesInFlight.has(key)) return {
		status: "skipped",
		action: "observe_only",
		reason: key ? "already_in_flight" : "missing_session_ref",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey
	};
	recoveriesInFlight.add(key);
	try {
		if (!isDiagnosticSessionStateCurrent({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			generation: params.stateGeneration,
			state: params.expectedState ?? "processing"
		})) return {
			status: "skipped",
			action: "observe_only",
			reason: "stale_session_state",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		};
		const terminalWorkerError = params.sessionId ? recoverTerminalSessionPlacementTurn({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		}) : void 0;
		if (terminalWorkerError !== void 0) return reportRecoveryOutcome({
			status: "failed",
			action: "fail_worker_turn",
			reason: "terminal_worker",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			error: terminalWorkerError
		});
		const fallbackActiveSessionId = params.sessionId && isEmbeddedAgentRunHandleActive(params.sessionId) ? params.sessionId : void 0;
		const fileActiveSessionId = params.sessionFile ? resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile) : void 0;
		let activeSessionId = params.sessionKey ? resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) ?? fileActiveSessionId ?? fallbackActiveSessionId : fileActiveSessionId ?? fallbackActiveSessionId;
		const fileActiveWorkSessionId = params.sessionFile ? resolveActiveEmbeddedRunSessionIdBySessionFile(params.sessionFile) : void 0;
		const activeWorkSessionId = params.sessionKey ? resolveActiveEmbeddedRunSessionId(params.sessionKey) ?? fileActiveWorkSessionId ?? params.sessionId : fileActiveWorkSessionId ?? params.sessionId;
		const retireStaleFollowupDrain = prepareStaleFollowupDrainRetirement(key);
		const sessionLane = key ? resolveEmbeddedSessionLane(key) : null;
		const preAbortActiveTaskIds = new Set(sessionLane ? getCommandLaneActiveTaskIds(sessionLane) : []);
		let aborted = false;
		let drained = true;
		let forceCleared = false;
		const staleActiveProgressAbortMs = resolveStaleActiveProgressAbortMs(params);
		const staleActiveLaneTaskReleaseMs = resolveStaleActiveLaneTaskReleaseMs(params);
		const activeReplyActivity = activeWorkSessionId ? resolveEmbeddedReplyActivity(activeWorkSessionId) : void 0;
		const activeReplyPhase = activeReplyActivity?.phase;
		const activeReplyAgeMs = activeReplyActivity ? Math.max(0, Date.now() - activeReplyActivity.lastActivityAtMs) : void 0;
		const maintenancePhase = activeReplyPhase === "preflight_compacting" || activeReplyPhase === "memory_flushing";
		const activeMaintenanceProtected = maintenancePhase && activeReplyAgeMs !== void 0 && activeReplyAgeMs < staleActiveLaneTaskReleaseMs;
		if (activeReplyActivity?.terminalOutcomeCommitted === true) return reportRecoveryOutcome({
			status: "skipped",
			action: "keep_lane",
			reason: "terminal_outcome_committed",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeSessionId: activeWorkSessionId,
			activeWorkKind: "embedded_run"
		});
		if (activeReplyPhase === "waiting_for_global_lane" || activeMaintenanceProtected) return reportRecoveryOutcome({
			status: "skipped",
			action: "keep_lane",
			reason: activeMaintenanceProtected ? "active_reply_work" : "global_lane_wait",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeSessionId: activeWorkSessionId
		});
		if (activeSessionId) {
			if (!isActiveRunProgressStale({
				ageMs: params.ageMs,
				sessionId: activeSessionId,
				sessionKey: params.sessionKey,
				queueDepth: params.queueDepth,
				staleAbortMs: staleActiveProgressAbortMs,
				allowActiveAbort: params.allowActiveAbort
			})) {
				const outcome = {
					status: "skipped",
					action: "observe_only",
					reason: "active_embedded_run",
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					activeSessionId,
					activeWorkKind: "embedded_run"
				};
				diagnosticLogger.warn(`stuck session recovery skipped: ${formatRecoveryContext(params, { activeSessionId })}`);
				return reportRecoveryOutcome(outcome);
			}
			if (params.allowActiveAbort !== true) diagnosticLogger.warn(`stuck session recovery reclaiming stale active run: ${formatRecoveryContext(params, { activeSessionId })}`);
			const recoveryBlocker = resolveActiveEmbeddedRunRecoveryBlocker(activeSessionId);
			if (recoveryBlocker) return {
				status: "skipped",
				action: "keep_lane",
				reason: recoveryBlocker,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				activeSessionId
			};
			const result = await abortAndDrainEmbeddedAgentRun({
				sessionId: activeSessionId,
				sessionKey: params.sessionKey,
				settleMs: STUCK_SESSION_ABORT_SETTLE_MS,
				forceClear: true,
				reason: "stuck_recovery"
			});
			aborted = result.aborted;
			drained = result.drained;
			forceCleared = result.forceCleared;
		}
		if (!activeSessionId && activeWorkSessionId && isEmbeddedAgentRunActive(activeWorkSessionId)) {
			if (activeReplyPhase === "waiting_for_deferred_maintenance") return reportRecoveryOutcome({
				status: "skipped",
				action: "keep_lane",
				reason: "deferred_maintenance_wait",
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				activeSessionId: activeWorkSessionId
			});
			if (isActiveRunProgressStale({
				ageMs: params.ageMs,
				sessionId: activeWorkSessionId,
				sessionKey: params.sessionKey,
				queueDepth: params.queueDepth,
				staleAbortMs: staleActiveProgressAbortMs,
				allowActiveAbort: params.allowActiveAbort,
				requireQueueBacklog: maintenancePhase ? void 0 : false
			})) {
				if (params.allowActiveAbort !== true) diagnosticLogger.warn(`stuck session recovery reclaiming stale active reply work: ${formatRecoveryContext(params, { activeSessionId: activeWorkSessionId })}`);
				const result = await abortAndDrainEmbeddedAgentRun({
					sessionId: activeWorkSessionId,
					sessionKey: params.sessionKey,
					settleMs: STUCK_SESSION_ABORT_SETTLE_MS,
					forceClear: true,
					reason: "stuck_recovery"
				});
				aborted = result.aborted;
				drained = result.drained;
				forceCleared = result.forceCleared;
				activeSessionId = activeWorkSessionId;
			} else return reportRecoveryOutcome({
				status: "skipped",
				action: "keep_lane",
				reason: "active_reply_work",
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				activeSessionId: activeWorkSessionId,
				activeWorkKind: "embedded_run"
			});
		}
		if (activeSessionId && resolveEmbeddedReplyActivity(activeSessionId)?.terminalOutcomeCommitted) return reportRecoveryOutcome({
			status: "skipped",
			action: "keep_lane",
			reason: "terminal_outcome_committed",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeSessionId
		});
		if (!activeSessionId && sessionLane) {
			const laneSnapshot = getCommandLaneSnapshot(sessionLane);
			if (laneSnapshot.activeCount > 0) {
				if (!getCommandLaneActiveTaskIds(sessionLane).some((id) => !preAbortActiveTaskIds.has(id)) && params.ageMs >= staleActiveLaneTaskReleaseMs) {
					const released = resetCommandLane(sessionLane);
					retireStaleFollowupDrain?.();
					return reportRecoveryOutcome({
						status: "released",
						action: "release_lane",
						reason: "stale_lane_task",
						sessionId: params.sessionId,
						sessionKey: params.sessionKey,
						lane: sessionLane,
						released,
						queuedCount: laneSnapshot.queuedCount
					});
				}
				return reportRecoveryOutcome({
					status: "skipped",
					action: "keep_lane",
					reason: "active_lane_task",
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					lane: sessionLane,
					activeCount: laneSnapshot.activeCount,
					queuedCount: laneSnapshot.queuedCount
				});
			}
		}
		const queuedCount = sessionLane ? getCommandLaneSnapshot(sessionLane).queuedCount : 0;
		const laneStartedFreshTask = sessionLane !== null && getCommandLaneActiveTaskIds(sessionLane).some((id) => !preAbortActiveTaskIds.has(id));
		const hasQueuedSessionWork = (params.queueDepth ?? 0) > 0;
		const released = sessionLane && !laneStartedFreshTask && (queuedCount > 0 || hasQueuedSessionWork || !activeSessionId || !aborted || !drained) ? resetCommandLane(sessionLane) : 0;
		const clearStaleSession = !aborted && released === 0 && !activeSessionId;
		if (aborted || forceCleared || released > 0 || clearStaleSession) {
			retireStaleFollowupDrain?.();
			const action = aborted || forceCleared ? "abort_embedded_run" : "release_lane";
			const stoppedFields = formatStoppedCronSessionDiagnosticFields(resolveCronSessionDiagnosticContext({
				sessionKey: params.sessionKey,
				activeSessionId
			}));
			diagnosticLogger.warn(`stuck session recovery: sessionId=${params.sessionId ?? activeSessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} age=${Math.round(params.ageMs / 1e3)}s action=${action} aborted=${aborted} drained=${drained} released=${released}${stoppedFields ? ` ${stoppedFields}` : ""}`);
			return reportRecoveryOutcome(aborted || forceCleared ? {
				status: "aborted",
				action: "abort_embedded_run",
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				activeSessionId,
				activeWorkKind: "embedded_run",
				aborted,
				drained,
				forceCleared,
				released,
				lane: sessionLane ?? void 0,
				...queuedCount > 0 ? { queuedCount } : {}
			} : {
				status: "released",
				action: "release_lane",
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				released,
				lane: sessionLane ?? void 0,
				...clearStaleSession ? { reason: "no_active_work" } : {}
			});
		}
		return reportRecoveryOutcome({
			status: "skipped",
			action: "observe_only",
			reason: "active_embedded_run",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeSessionId,
			activeWorkKind: "embedded_run"
		});
	} catch (err) {
		const outcome = {
			status: "failed",
			action: "none",
			reason: "exception",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			error: String(err)
		};
		diagnosticLogger.warn(`stuck session recovery failed: sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} err=${String(err)}`);
		return outcome;
	} finally {
		recoveriesInFlight.delete(key);
	}
}
//#endregion
export { recoverStuckDiagnosticSession };
