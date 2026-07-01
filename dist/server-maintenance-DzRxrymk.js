import { m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { v as sweepStaleRunContexts } from "./agent-events-7y1r8HOP.js";
import { r as cleanOldMedia } from "./store-MjA3hYFB.js";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-COF_MGQr.js";
import { r as abortTrackedChatRunById } from "./chat-abort-CHoKqMso.js";
import { r as HEALTH_REFRESH_INTERVAL_MS, s as TICK_INTERVAL_MS, t as DEDUPE_MAX } from "./server-constants-BGwLM6XN.js";
import { n as pruneStaleControlPlaneBuckets } from "./control-plane-rate-limit--vbw5fd7.js";
import { t as formatError } from "./server-utils-DsMt4SeL.js";
import { s as setBroadcastHealthUpdate } from "./health-state-bGXNRoZQ.js";
//#region src/gateway/server-maintenance.ts
function startGatewayMaintenanceTimers(params) {
	setBroadcastHealthUpdate((snap) => {
		params.broadcast("health", snap, { stateVersion: {
			presence: params.getPresenceVersion(),
			health: params.getHealthVersion()
		} });
		params.nodeSendToAllSubscribed("health", snap);
	});
	const tickInterval = setInterval(() => {
		const payload = { ts: Date.now() };
		params.broadcast("tick", payload);
		params.nodeSendToAllSubscribed("tick", payload);
	}, TICK_INTERVAL_MS);
	const healthInterval = setInterval(() => {
		params.refreshGatewayHealthSnapshot({ probe: false }).catch((err) => params.logHealth.error(`refresh failed: ${formatError(err)}`));
	}, HEALTH_REFRESH_INTERVAL_MS);
	params.refreshGatewayHealthSnapshot({ probe: false }).catch((err) => params.logHealth.error(`initial refresh failed: ${formatError(err)}`));
	const dedupeCleanup = setInterval(() => {
		const AGENT_RUN_SEQ_MAX = 1e4;
		const now = Date.now();
		const resolveDedupeRunId = (key, entry) => {
			if (!key.startsWith("agent:") && !key.startsWith("chat:")) return;
			const keyRunId = key.slice(key.indexOf(":") + 1);
			if (keyRunId) {
				if (params.chatAbortControllers.get(keyRunId)) return keyRunId;
			}
			const payload = entry.payload;
			return payload && typeof payload === "object" && !Array.isArray(payload) ? typeof payload.runId === "string" ? payload.runId.trim() || void 0 : void 0 : void 0;
		};
		const isPendingAcceptedAgentDedupeKey = (key, dedupeEntry) => {
			if (!key.startsWith("agent:")) return false;
			const payload = dedupeEntry.payload;
			if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
			if (payload.status !== "accepted") return false;
			const expiresAtMs = payload.expiresAtMs;
			return isFutureDateTimestampMs(expiresAtMs, { nowMs: now });
		};
		const isActiveRunDedupeKey = (key, dedupeEntry) => {
			if (!key.startsWith("agent:") && !key.startsWith("chat:")) return false;
			const runId = resolveDedupeRunId(key, dedupeEntry);
			const entry = runId ? params.chatAbortControllers.get(runId) : void 0;
			if (!entry) return false;
			return key.startsWith("agent:") ? entry.kind === "agent" : entry.kind !== "agent";
		};
		for (const [k, v] of params.dedupe) {
			if (isActiveRunDedupeKey(k, v) || isPendingAcceptedAgentDedupeKey(k, v)) continue;
			if (now - v.ts > 3e5) params.dedupe.delete(k);
		}
		if (params.dedupe.size > 1e3) {
			const excess = params.dedupe.size - DEDUPE_MAX;
			const oldestKeys = [...params.dedupe.entries()].filter(([key, entry]) => !isActiveRunDedupeKey(key, entry) && !isPendingAcceptedAgentDedupeKey(key, entry)).toSorted(([, left], [, right]) => left.ts - right.ts).slice(0, excess).map(([key]) => key);
			for (const key of oldestKeys) params.dedupe.delete(key);
		}
		if (params.agentRunSeq.size > AGENT_RUN_SEQ_MAX) {
			const excess = params.agentRunSeq.size - AGENT_RUN_SEQ_MAX;
			let removed = 0;
			for (const runId of params.agentRunSeq.keys()) {
				params.agentRunSeq.delete(runId);
				removed += 1;
				if (removed >= excess) break;
			}
		}
		const resolveAgentThrottleRunId = (key) => {
			if (key.endsWith(":assistant")) return key.slice(0, -10);
			if (key.endsWith(":thinking")) return key.slice(0, -9);
			return key;
		};
		for (const [runId, entry] of params.chatAbortControllers) {
			if (entry.projectSessionTerminalPending === true) continue;
			if (isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) continue;
			if (entry.projectSessionTerminalPersistence) {
				const lifecycleGeneration = entry.lifecycleGeneration?.trim();
				const sessionKey = entry.sessionKey.trim();
				const sessionId = entry.sessionId.trim();
				if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId) params.restartRecoveryCandidates.set(runId, {
					runId,
					lifecycleGeneration,
					sessionKey,
					sessionId,
					observedAt: entry.projectSessionTerminalObservedAt
				});
				params.chatAbortControllers.delete(runId);
				continue;
			}
			if (entry.projectSessionActive === false) {
				params.chatAbortControllers.delete(runId);
				continue;
			}
			abortTrackedChatRunById(params, {
				runId,
				sessionKey: entry.sessionKey,
				stopReason: "timeout"
			});
		}
		const ABORTED_RUN_TTL_MS = 60 * 6e4;
		for (const [runId, abortMarker] of params.chatRunState.abortedRuns) {
			if (now - chatAbortMarkerTimestampMs(abortMarker) <= ABORTED_RUN_TTL_MS) continue;
			params.chatRunState.abortedRuns.delete(runId);
			params.chatRunState.clearRun(runId);
		}
		pruneStaleControlPlaneBuckets(now);
		for (const [runId, lastSentAt] of params.chatDeltaSentAt) {
			if (params.chatRunState.abortedRuns.has(runId)) continue;
			if (params.chatAbortControllers.has(runId)) continue;
			if (now - lastSentAt <= ABORTED_RUN_TTL_MS) continue;
			params.chatRunState.clearRun(runId);
		}
		for (const [runId, lastUpdatedAt] of params.chatRunState.bufferUpdatedAt) {
			if (params.chatRunState.abortedRuns.has(runId)) continue;
			if (params.chatAbortControllers.has(runId)) continue;
			if (now - lastUpdatedAt <= ABORTED_RUN_TTL_MS) continue;
			params.chatRunState.clearRun(runId);
		}
		for (const [key, lastSentAt] of params.chatRunState.agentDeltaSentAt) {
			const runId = resolveAgentThrottleRunId(key);
			if (params.chatRunState.abortedRuns.has(runId)) continue;
			if (params.chatAbortControllers.has(runId)) continue;
			if (now - lastSentAt <= ABORTED_RUN_TTL_MS) continue;
			params.chatRunState.clearRun(runId);
		}
		sweepStaleRunContexts();
	}, 6e4);
	if (typeof params.mediaCleanupTtlMs !== "number") return {
		tickInterval,
		healthInterval,
		dedupeCleanup,
		mediaCleanup: null
	};
	let mediaCleanupInFlight = null;
	const runMediaCleanup = () => {
		if (mediaCleanupInFlight) return mediaCleanupInFlight;
		mediaCleanupInFlight = cleanOldMedia(params.mediaCleanupTtlMs, {
			recursive: true,
			pruneEmptyDirs: true
		}).catch((err) => {
			params.logHealth.error(`media cleanup failed: ${formatError(err)}`);
		}).finally(() => {
			mediaCleanupInFlight = null;
		});
		return mediaCleanupInFlight;
	};
	const mediaCleanup = setInterval(() => {
		runMediaCleanup();
	}, 60 * 6e4);
	runMediaCleanup();
	return {
		tickInterval,
		healthInterval,
		dedupeCleanup,
		mediaCleanup
	};
}
//#endregion
export { startGatewayMaintenanceTimers };
