import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as generateSecureInt } from "./secure-random-BJtJxP9Y.mjs";
import { A as tryBeginGatewaySuspendAdmission, f as isGatewayWorkAdmissionClosed, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { D as sweepStaleRunContexts } from "./agent-run-registry-DO6Dg2r0.mjs";
import { r as HEALTH_REFRESH_INTERVAL_MS, s as TICK_INTERVAL_MS, t as DEDUPE_MAX } from "./server-constants-Dx_kHnY5.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-BarRglPD.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { c as pruneExpiredDeliveryQueueTombstones } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { c as pruneOutboundMedia, l as prunePlaybackTranscodeCache, r as cleanOldMedia } from "./store-BrX2xbJz.mjs";
import { t as pruneOrphanedDeliveryQueueMedia } from "./delivery-queue-media-spool-Mb8s9C8L.mjs";
import { i as waitForMediaCleanupDrainsToSettle, n as registerMediaCleanupDrain, r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-FrwOsNwk.mjs";
import { c as removeChatAbortControllerEntry, t as abortChatRunById } from "./chat-abort-D7PkkSq8.mjs";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-DfVYc1CX.mjs";
import { n as hasRegisteredChatRunForSessionKey } from "./session-active-runs-COSfbADi.mjs";
import { a as managedWorktrees, i as WORKTREE_GC_INTERVAL_MS, o as resolveWorktreeCleanupLimits } from "./service-BPmV9ykg.mjs";
import { n as checkGatewayInstallationReplacement } from "./stale-install-BTpQ40eq.mjs";
import { l as pruneExpiredDevicePairSetupCompletions } from "./device-bootstrap-BtrqJlcg.mjs";
import { t as formatWorktreeGcResult } from "./gc-result-Ba9YFoRv.mjs";
import { t as createManagedWorktreeOwnerPolicy } from "./owner-protection-CtII-MQD.mjs";
import { r as registerSkillUsageTracking } from "./curator-BpldtG30.mjs";
import { r as checkTelemetryUpdate } from "./telemetry-zaPKARP_.mjs";
import { r as pruneStaleControlPlaneBuckets } from "./control-plane-rate-limit-mnXyzTxO.mjs";
import "./server-shared-C-7Ahu3n.mjs";
import { s as setBroadcastHealthUpdate } from "./health-state-BFGMqqXu.mjs";
import { r as startSessionColdStorageMaintenance } from "./session-cold-storage-maintenance-Dex39V2G.mjs";
const HOST_THAW_RESTART_WINDOW_MS = 6e5;
function createHostThawRecovery(deps) {
	let lastTickAtMs = deps.nowMs();
	let lastCpuUsage = process.cpuUsage();
	let pendingFrozenMs;
	let pendingChannelRestart;
	let activeRecovery;
	const runStep = async (label, step) => {
		try {
			await step();
		} catch (error) {
			deps.logger.error(`host thaw ${label} failed: ${String(error)}`);
		}
	};
	const expireChannelRestart = () => {
		if (pendingChannelRestart && deps.nowMs() >= pendingChannelRestart.deadlineAtMs) {
			deps.logger.info(`host thaw channel restart abandoned after 10 minutes: ${pendingChannelRestart.reason ?? "gateway admission remained closed"}`);
			pendingChannelRestart = void 0;
		}
	};
	const restartChannels = async (mode) => {
		expireChannelRestart();
		const pending = pendingChannelRestart;
		if (!pending) return;
		try {
			const outcome = await deps.restartChannelsIfIdle(mode);
			if (outcome.status === "retry") {
				const detail = outcome.reason === "active-work" ? "gateway still has active work" : outcome.reason === "admission-closed" ? "gateway admission is closed" : "one or more channel accounts remain pending";
				pending.reason = outcome.reason === "active-work" ? "gateway stayed busy" : detail;
				if (!pending.loggedDeferral) {
					pending.loggedDeferral = true;
					deps.logger.info(`host thaw channel restart deferred: ${detail}`);
				}
			} else if (pendingChannelRestart === pending) pendingChannelRestart = void 0;
		} catch (error) {
			pending.reason = "channel restart kept failing";
			deps.logger.error(`host thaw channel restart failed: ${String(error)}`);
		}
	};
	const recover = async (frozenMs) => {
		deps.logger.info(`host timing gap detected: process was frozen ~${Math.round(frozenMs)}ms; restarting channels when idle and refreshing health`);
		const deferForAdmission = () => {
			if (deps.isAdmissionClosed()) {
				pendingFrozenMs = Math.max(pendingFrozenMs ?? 0, frozenMs);
				deps.logger.info("host thaw recovery deferred: gateway suspension began mid-recovery");
				return true;
			}
			return false;
		};
		if (deferForAdmission()) return;
		await runStep("event-loop reset", deps.resetEventLoopHealth);
		if (deferForAdmission()) return;
		await restartChannels("new-thaw");
		for (const [label, step] of [["health refresh", deps.refreshHealth], ["presence refresh", deps.refreshPresence]]) {
			if (deferForAdmission()) return;
			await runStep(label, step);
		}
	};
	return { tick: async () => {
		const nowMs = deps.nowMs();
		const cpuUsage = process.cpuUsage();
		const gapMs = nowMs - lastTickAtMs;
		const cpuMs = (cpuUsage.user - lastCpuUsage.user + cpuUsage.system - lastCpuUsage.system) / 1e3;
		lastTickAtMs = nowMs;
		lastCpuUsage = cpuUsage;
		if (gapMs >= 75e3) {
			const cpuCoreRatio = cpuMs / gapMs;
			if (cpuCoreRatio >= .5) deps.logger.info(`host timing gap attributed to event-loop load: gap ${Math.round(gapMs)}ms, CPU ratio ${cpuCoreRatio.toFixed(2)}; skipping thaw recovery`);
			else {
				pendingFrozenMs = Math.max(pendingFrozenMs ?? 0, gapMs - TICK_INTERVAL_MS);
				pendingChannelRestart = {
					deadlineAtMs: nowMs + HOST_THAW_RESTART_WINDOW_MS,
					loggedDeferral: false
				};
			}
		}
		if (!activeRecovery) expireChannelRestart();
		if (pendingFrozenMs === void 0 && !pendingChannelRestart || deps.isAdmissionClosed() || activeRecovery) return;
		const frozenMs = pendingFrozenMs;
		pendingFrozenMs = void 0;
		activeRecovery = frozenMs === void 0 ? restartChannels("deferred-retry") : recover(frozenMs);
		try {
			await activeRecovery;
		} finally {
			activeRecovery = void 0;
		}
	} };
}
//#endregion
//#region src/gateway/server-maintenance.ts
const DELIVERY_QUEUE_MEDIA_GC_INTERVAL_MS = 36e5;
const TELEMETRY_MAINTENANCE_INTERVAL_MS = 3e5;
function startGatewayMaintenanceTimers(params) {
	const restartDrainSignal = getGatewayRestartDrainSignal();
	const periodicWork = new AsyncWorkScope();
	let periodicTasksStopPromise;
	setBroadcastHealthUpdate((snap) => {
		params.broadcast("health", snap, { stateVersion: {
			presence: params.getPresenceVersion(),
			health: params.getHealthVersion()
		} });
		params.nodeSendToAllSubscribed("health", snap);
	});
	const restartChannelsIfIdle = async (mode) => {
		if (!createGatewayActiveWorkSnapshot(params.activeWorkInspectors, { ignoreTerminalSessions: true }).idle) return {
			status: "retry",
			reason: "active-work"
		};
		let invalidated = false;
		const admission = tryBeginGatewaySuspendAdmission(() => {
			invalidated = true;
		});
		if (!admission) return {
			status: "retry",
			reason: "admission-closed"
		};
		if (!admission.commit()) return {
			status: "retry",
			reason: "admission-closed"
		};
		try {
			return await params.restartRunningChannels(mode, () => !invalidated && !periodicTasksStopPromise) ? { status: "completed" } : {
				status: "retry",
				reason: "channel-restart-incomplete"
			};
		} finally {
			admission.release();
		}
	};
	const hostThawRecovery = createHostThawRecovery({
		nowMs: Date.now,
		restartChannelsIfIdle,
		refreshHealth: async () => {
			await params.refreshGatewayHealthSnapshot({ probe: true });
		},
		refreshPresence: params.refreshPresence,
		resetEventLoopHealth: params.resetEventLoopHealth,
		isAdmissionClosed: () => Boolean(periodicTasksStopPromise) || isGatewayWorkAdmissionClosed(),
		logger: params.logHealth
	});
	let nextTelemetryCheckAtMs = Date.now() + generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS);
	let telemetryCheckInFlight;
	const performTelemetryCheck = () => {
		telemetryCheckInFlight ??= periodicWork.track(() => checkTelemetryUpdate(params.getRuntimeConfig, { surface: "gateway" })).then(() => void 0).catch(() => {}).finally(() => {
			telemetryCheckInFlight = void 0;
		});
	};
	const tickInterval = setInterval(() => {
		periodicWork.track(checkGatewayInstallationReplacement).catch((error) => params.logHealth.error(`installation check failed: ${formatErrorMessage(error)}`));
		periodicWork.track(() => hostThawRecovery.tick()).catch((error) => params.logHealth.error(`host thaw recovery failed: ${formatErrorMessage(error)}`));
		const now = Date.now();
		if (!params.isNixMode && now >= nextTelemetryCheckAtMs) {
			nextTelemetryCheckAtMs = now + TELEMETRY_MAINTENANCE_INTERVAL_MS + generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS);
			performTelemetryCheck();
		}
		const payload = { ts: now };
		params.broadcast("tick", payload);
		params.nodeSendToAllSubscribed("tick", payload);
	}, TICK_INTERVAL_MS);
	const healthInterval = setInterval(() => {
		periodicWork.track(() => params.refreshGatewayHealthSnapshot({ probe: false })).catch((err) => params.logHealth.error(`refresh failed: ${formatErrorMessage(err)}`));
	}, HEALTH_REFRESH_INTERVAL_MS);
	if (!restartDrainSignal.aborted) periodicWork.track(() => params.refreshGatewayHealthSnapshot({ probe: false })).catch((err) => params.logHealth.error(`initial refresh failed: ${formatErrorMessage(err)}`));
	const runWorktreeGc = params.runWorktreeGc ?? (() => {
		const cfg = params.getRuntimeConfig();
		return managedWorktrees.gc({
			...createManagedWorktreeOwnerPolicy(cfg),
			limits: resolveWorktreeCleanupLimits()
		});
	});
	const performWorktreeGc = () => periodicWork.track(runWorktreeGc).then((result) => {
		if (!result) return;
		if (result.outcome === "partial") params.logHealth.error(formatWorktreeGcResult(result));
		else if (result.outcome === "deferred") params.logHealth.info(formatWorktreeGcResult(result));
	}).catch((err) => {
		params.logHealth.error(`managed worktree cleanup failed: ${formatErrorMessage(err)}`);
	});
	const worktreeCleanup = setInterval(() => void performWorktreeGc(), WORKTREE_GC_INTERVAL_MS);
	if (!restartDrainSignal.aborted) performWorktreeGc();
	let mediaCleanupStopped = false;
	const runDeliveryQueueMediaGc = params.runDeliveryQueueMediaGc ?? (async () => {
		const context = captureDeliveryQueueStateContext();
		try {
			await pruneExpiredDeliveryQueueTombstones(void 0, context);
		} finally {
			await pruneOrphanedDeliveryQueueMedia(void 0, context);
		}
	});
	let deliveryQueueMediaGcStartedAtMs = 0;
	const deliveryQueueMediaGcLoader = createLazyPromiseLoader(async () => {
		try {
			await runDeliveryQueueMediaGc();
		} catch (error) {
			params.logHealth.error(`delivery queue maintenance failed: ${formatErrorMessage(error)}`);
		} finally {
			deliveryQueueMediaGcLoader.clear();
		}
	});
	let deliveryQueueMediaGcStartPromise;
	const performDeliveryQueueMediaGc = () => {
		if (mediaCleanupStopped) return;
		const running = deliveryQueueMediaGcLoader.peek();
		if (running) return running;
		deliveryQueueMediaGcStartPromise ??= waitForMediaCleanupDrainsToSettle().then(() => {
			deliveryQueueMediaGcStartPromise = void 0;
			if (mediaCleanupStopped) return;
			deliveryQueueMediaGcStartedAtMs = Date.now();
			return deliveryQueueMediaGcLoader.load();
		});
		return deliveryQueueMediaGcStartPromise;
	};
	performDeliveryQueueMediaGc();
	let devicePairSetupCompletionGcInFlight = null;
	const performDevicePairSetupCompletionGc = (nowMs) => {
		if (devicePairSetupCompletionGcInFlight) return devicePairSetupCompletionGcInFlight;
		devicePairSetupCompletionGcInFlight = periodicWork.track(() => pruneExpiredDevicePairSetupCompletions({ nowMs })).then(() => void 0).catch((error) => {
			params.logHealth.error(`device pair setup cleanup failed: ${formatErrorMessage(error)}`);
		}).finally(() => {
			devicePairSetupCompletionGcInFlight = null;
		});
		return devicePairSetupCompletionGcInFlight;
	};
	if (!restartDrainSignal.aborted) performDevicePairSetupCompletionGc(Date.now());
	const skillUsageCleanup = registerSkillUsageTracking();
	const dedupeCleanup = setInterval(() => {
		const AGENT_RUN_SEQ_MAX = 1e4;
		const now = Date.now();
		params.chatRunState.toolEventRecipients.pruneExpired(now);
		performDevicePairSetupCompletionGc(now);
		if (now - deliveryQueueMediaGcStartedAtMs >= DELIVERY_QUEUE_MEDIA_GC_INTERVAL_MS) performDeliveryQueueMediaGc();
		const resolveDedupeRunId = (key, entry) => {
			if (!key.startsWith("agent:") && !key.startsWith("chat:")) return;
			const keyRunId = key.slice(key.indexOf(":") + 1);
			if (keyRunId) {
				if (params.chatAbortControllers.has(keyRunId) || params.chatQueuedTurns.has(keyRunId)) return keyRunId;
			}
			const payload = entry.payload;
			return payload && typeof payload === "object" && !Array.isArray(payload) ? typeof payload.runId === "string" ? payload.runId.trim() || void 0 : void 0 : void 0;
		};
		const isPendingAcceptedRunDedupeKey = (key, dedupeEntry) => {
			if (!key.startsWith("agent:") && !key.startsWith("pending-chat:")) return false;
			const payload = dedupeEntry.payload;
			if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
			if (payload.status !== "accepted") return false;
			const expiresAtMs = payload.expiresAtMs;
			return isFutureDateTimestampMs(expiresAtMs, { nowMs: now });
		};
		const isActiveRunDedupeKey = (key, dedupeEntry) => {
			const isAgentKey = key.startsWith("agent:");
			const isChatKey = key.startsWith("chat:");
			if (!isAgentKey && !isChatKey) return false;
			const runId = resolveDedupeRunId(key, dedupeEntry);
			const entry = runId ? params.chatAbortControllers.get(runId) : void 0;
			if (entry) return isAgentKey ? entry.kind === "agent" : entry.kind !== "agent";
			return Boolean(isChatKey && runId && params.chatQueuedTurns.has(runId));
		};
		for (const [k, v] of params.dedupe) {
			if (isActiveRunDedupeKey(k, v) || isPendingAcceptedRunDedupeKey(k, v)) continue;
			if (now - v.ts > 3e5) params.dedupe.delete(k);
		}
		if (params.dedupe.size > 1e3) {
			const excess = params.dedupe.size - DEDUPE_MAX;
			const oldestKeys = [...params.dedupe.entries()].filter(([key, entry]) => !isActiveRunDedupeKey(key, entry) && !isPendingAcceptedRunDedupeKey(key, entry)).toSorted(([, left], [, right]) => left.ts - right.ts).slice(0, excess).map(([key]) => key);
			for (const key of oldestKeys) params.dedupe.delete(key);
		}
		pruneMapToMaxSize(params.agentRunSeq, AGENT_RUN_SEQ_MAX);
		for (const [runId, entry] of params.chatAbortControllers) {
			const terminalClearOverdue = typeof entry.projectSessionTerminalObservedAt === "number" && now - entry.projectSessionTerminalObservedAt > 15e3;
			if (entry.projectSessionTerminalPending === true && !terminalClearOverdue) continue;
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
				removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
				continue;
			}
			if (entry.projectSessionActive === false) {
				removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
				continue;
			}
			if (!abortChatRunById(params, {
				runId,
				sessionKey: entry.sessionKey,
				stopReason: "timeout"
			}).aborted) removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
		}
		const ABORTED_RUN_TTL_MS = 36e5;
		pruneStaleControlPlaneBuckets(now);
		for (const [runId, record] of params.chatRunState.runs) {
			if (record.abortMarker !== void 0) {
				if (now - chatAbortMarkerTimestampMs(record.abortMarker) > ABORTED_RUN_TTL_MS) {
					params.chatRunState.deleteAbortMarker(runId);
					params.chatRunState.clearRun(runId);
				}
				continue;
			}
			if (params.chatAbortControllers.has(runId)) continue;
			if ([
				record.deltaSentAt,
				record.bufferUpdatedAt,
				record.agentText?.assistant?.lastSentAt,
				record.agentText?.thinking?.lastSentAt
			].some((timestamp) => timestamp !== void 0 && now - timestamp > ABORTED_RUN_TTL_MS)) params.chatRunState.clearRun(runId);
		}
		sweepStaleRunContexts();
	}, 6e4);
	const playbackTranscodeCacheCleanupLoader = createLazyPromiseLoader(async () => {
		try {
			await prunePlaybackTranscodeCache();
		} catch (err) {
			params.logHealth.error(`playback transcode cache cleanup failed: ${formatErrorMessage(err)}`);
		} finally {
			playbackTranscodeCacheCleanupLoader.clear();
		}
	});
	const runManagedOutgoingMediaGc = params.runManagedOutgoingMediaGc ?? (async () => {
		const { cleanupManagedOutgoingMediaRecords } = await import("./managed-image-attachments-DwSc8cOA.mjs");
		return await cleanupManagedOutgoingMediaRecords({ hasActiveSessionRun: (sessionKey, agentId) => {
			const cfg = params.getRuntimeConfig();
			return hasRegisteredChatRunForSessionKey({
				context: { chatAbortControllers: params.chatAbortControllers },
				sessionKey,
				agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			});
		} });
	});
	const managedOutgoingCleanupLoader = createLazyPromiseLoader(async () => {
		try {
			await runManagedOutgoingMediaGc();
		} catch (err) {
			params.logHealth.error(`managed outgoing media cleanup failed: ${formatErrorMessage(err)}`);
		} finally {
			managedOutgoingCleanupLoader.clear();
		}
	});
	let mediaCleanupInFlight = null;
	const runMediaCleanup = () => {
		if (mediaCleanupInFlight) return mediaCleanupInFlight;
		const ttlHours = params.getRuntimeConfig().attachments?.ttlHours;
		mediaCleanupInFlight = (ttlHours !== void 0 ? cleanOldMedia(ttlHours * 60 * 6e4, {
			recursive: true,
			pruneEmptyDirs: true
		}) : pruneOutboundMedia()).catch((err) => {
			params.logHealth.error(`media cleanup failed: ${formatErrorMessage(err)}`);
		}).finally(() => {
			mediaCleanupInFlight = null;
		});
		return mediaCleanupInFlight;
	};
	let mediaCleanupInterval;
	const runMediaMaintenance = () => {
		if (mediaCleanupStopped) return;
		playbackTranscodeCacheCleanupLoader.load();
		managedOutgoingCleanupLoader.load();
		runMediaCleanup();
	};
	let mediaCleanupStartPromise;
	const startMediaCleanup = () => {
		if (mediaCleanupStopped || mediaCleanupInterval || mediaCleanupStartPromise) return;
		mediaCleanupStartPromise = waitForMediaCleanupDrainsToSettle().then(() => {
			mediaCleanupStartPromise = void 0;
			if (mediaCleanupStopped || mediaCleanupInterval) return;
			mediaCleanupInterval = setInterval(runMediaMaintenance, 36e5);
			runMediaMaintenance();
		});
	};
	let stopMediaCleanupPromise;
	const stopMediaCleanup = () => {
		stopMediaCleanupPromise ??= (async () => {
			mediaCleanupStopped = true;
			if (mediaCleanupInterval) {
				clearInterval(mediaCleanupInterval);
				mediaCleanupInterval = void 0;
			}
			const pending = [
				deliveryQueueMediaGcLoader.peek(),
				playbackTranscodeCacheCleanupLoader.peek(),
				managedOutgoingCleanupLoader.peek(),
				mediaCleanupInFlight
			].filter((promise) => promise !== void 0 && promise !== null);
			if (pending.length > 0) registerMediaCleanupDrain(Promise.allSettled(pending).then(() => void 0));
			return await waitForMediaCleanupDrains({
				timeoutMs: MEDIA_CLEANUP_STOP_TIMEOUT_MS,
				onTimeout: () => {
					params.logHealth.error(`media cleanup drain exceeded ${MEDIA_CLEANUP_STOP_TIMEOUT_MS}ms; retaining shared state until cleanup settles`);
				}
			});
		})();
		return stopMediaCleanupPromise;
	};
	const sessionColdStorageMaintenance = startSessionColdStorageMaintenance({
		getRuntimeConfig: params.getRuntimeConfig,
		onError: (message) => params.logHealth.error(`transcript cold storage failed: ${message}`)
	});
	const stopPeriodicTasks = () => {
		if (!periodicTasksStopPromise) {
			restartDrainSignal.removeEventListener("abort", onRestartDrain);
			clearInterval(tickInterval);
			clearInterval(healthInterval);
			clearInterval(dedupeCleanup);
			clearInterval(worktreeCleanup);
			periodicTasksStopPromise = Promise.allSettled([
				AsyncWorkScope.runWhenAllIdle(() => [periodicWork], () => periodicWork.drain()),
				sessionColdStorageMaintenance.stop(),
				stopMediaCleanup()
			]).then((results) => {
				const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "Gateway periodic maintenance failed to stop");
			});
			periodicTasksStopPromise.catch(() => {});
		}
		return periodicTasksStopPromise;
	};
	const onRestartDrain = () => {
		stopPeriodicTasks();
	};
	restartDrainSignal.addEventListener("abort", onRestartDrain, { once: true });
	if (restartDrainSignal.aborted) onRestartDrain();
	return {
		stopPeriodicTasks,
		startMediaCleanup,
		stopMediaCleanup,
		skillUsageCleanup
	};
}
//#endregion
export { startGatewayMaintenanceTimers };
