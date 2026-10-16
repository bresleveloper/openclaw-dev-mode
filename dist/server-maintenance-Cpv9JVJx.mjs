import { g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { f as hasAgentRunContextExecutionOwner, k as sweepStaleRunContexts } from "./agent-run-registry-BaxMDLZF.mjs";
import { r as generateSecureInt } from "./secure-random-Dimnnrm0.mjs";
import { A as tryBeginGatewaySuspendAdmission, f as isGatewayWorkAdmissionClosed, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as checkGatewayInstallationReplacement } from "./stale-install-CLeiGj_K.mjs";
import { r as HEALTH_REFRESH_INTERVAL_MS, s as TICK_INTERVAL_MS, t as DEDUPE_MAX } from "./server-constants-BH_EolwD.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { c as isActiveEmbeddedRunId } from "./runs-BErx7xDZ.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-D2-QpshF.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import { s as pruneExpiredDeliveryQueueTombstones } from "./delivery-queue-sqlite-CZH3GILC.mjs";
import { c as pruneOutboundMedia, l as prunePlaybackTranscodeCache, r as cleanOldMedia } from "./store-A0dMc8iV.mjs";
import { t as pruneOrphanedDeliveryQueueMedia } from "./delivery-queue-media-spool-DlhI6JUi.mjs";
import "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { i as waitForMediaCleanupDrainsToSettle, n as registerMediaCleanupDrain, r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-KlRv-aNy.mjs";
import { o as removeChatAbortControllerEntry } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-BP63MB41.mjs";
import { t as abortChatRunById } from "./chat-abort-DsJ_Zmkt.mjs";
import { n as hasRegisteredChatRunForSessionKey } from "./session-active-runs-6vHANwv_.mjs";
import { a as managedWorktrees, i as WORKTREE_GC_INTERVAL_MS, o as resolveWorktreeCleanupLimits } from "./service-DvlxnA92.mjs";
import { l as pruneExpiredDevicePairSetupCompletions } from "./device-bootstrap-oFZT97Lm.mjs";
import { t as formatWorktreeGcResult } from "./gc-result-B4mResXZ.mjs";
import { t as createManagedWorktreeOwnerPolicy } from "./owner-protection-DY31u8NE.mjs";
import { r as registerSkillUsageTracking } from "./curator-B4R9c7DJ.mjs";
import { r as checkTelemetryUpdate } from "./telemetry-ybvPJqq1.mjs";
import { r as pruneStaleControlPlaneBuckets } from "./control-plane-rate-limit-Diov6H2_.mjs";
import { a as pruneExpiredArtifactDownloads } from "./artifact-download-grants-tzwDxk5o.mjs";
import "./server-shared-C-7Ahu3n.mjs";
import { s as setBroadcastHealthUpdate } from "./health-state-CFMejOLY.mjs";
import { r as startSessionColdStorageMaintenance } from "./session-cold-storage-maintenance-DNOTXSnj.mjs";
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
			lastTickAtMs = deps.nowMs();
			lastCpuUsage = process.cpuUsage();
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
	const scheduler = params.scheduler.scope();
	const schedulePeriodic = (id, everyMs, run, immediate = false) => {
		scheduler.schedule({
			id: `maintenance:${id}`,
			atMs: scheduler.now() + (immediate ? 0 : everyMs),
			everyMs,
			run
		});
	};
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
			return await params.restartRunningChannels(mode, () => !invalidated && !scheduler.signal.aborted) ? { status: "completed" } : {
				status: "retry",
				reason: "channel-restart-incomplete"
			};
		} finally {
			admission.release();
		}
	};
	const hostThawRecovery = createHostThawRecovery({
		nowMs: () => scheduler.now(),
		restartChannelsIfIdle,
		refreshHealth: async () => {
			await params.refreshGatewayHealthSnapshot({ probe: true });
		},
		refreshPresence: params.refreshPresence,
		resetEventLoopHealth: params.resetEventLoopHealth,
		isAdmissionClosed: () => scheduler.signal.aborted || isGatewayWorkAdmissionClosed(),
		logger: params.logHealth
	});
	const scheduleTelemetry = (delayMs) => {
		scheduler.schedule({
			id: "maintenance:telemetry",
			delayMs,
			run: async () => {
				try {
					await checkTelemetryUpdate(params.getRuntimeConfig, { surface: "gateway" });
				} catch {} finally {
					if (!scheduler.signal.aborted) scheduleTelemetry(TELEMETRY_MAINTENANCE_INTERVAL_MS + generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS));
				}
			}
		});
	};
	if (!params.isNixMode) scheduleTelemetry(generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS));
	schedulePeriodic("installation", TICK_INTERVAL_MS, () => checkGatewayInstallationReplacement().catch((error) => params.logHealth.error(`installation check failed: ${formatErrorMessage(error)}`)));
	schedulePeriodic("host-thaw", TICK_INTERVAL_MS, () => hostThawRecovery.tick().catch((error) => params.logHealth.error(`host thaw recovery failed: ${formatErrorMessage(error)}`)));
	schedulePeriodic("tick", TICK_INTERVAL_MS, () => {
		const payload = { ts: scheduler.now() };
		params.broadcast("tick", payload);
		params.nodeSendToAllSubscribed("tick", payload);
	});
	schedulePeriodic("health", HEALTH_REFRESH_INTERVAL_MS, () => params.refreshGatewayHealthSnapshot({ probe: false }).catch((err) => params.logHealth.error(`refresh failed: ${formatErrorMessage(err)}`)), true);
	const runWorktreeGc = params.runWorktreeGc ?? (() => {
		const cfg = params.getRuntimeConfig();
		return managedWorktrees.gc({
			...createManagedWorktreeOwnerPolicy(cfg),
			limits: resolveWorktreeCleanupLimits()
		});
	});
	schedulePeriodic("worktrees", WORKTREE_GC_INTERVAL_MS, () => runWorktreeGc().then((result) => {
		if (!result) return;
		if (result.outcome === "partial") params.logHealth.error(formatWorktreeGcResult(result));
		else if (result.outcome === "deferred") params.logHealth.info(formatWorktreeGcResult(result));
	}).catch((err) => {
		params.logHealth.error(`managed worktree cleanup failed: ${formatErrorMessage(err)}`);
	}));
	const mediaScheduler = params.scheduler.scope();
	const runDeliveryQueueMediaGc = params.runDeliveryQueueMediaGc ?? (async () => {
		const context = captureDeliveryQueueStateContext();
		try {
			await pruneExpiredDeliveryQueueTombstones(void 0, context);
		} finally {
			await pruneOrphanedDeliveryQueueMedia(void 0, context);
		}
	});
	const scheduleMedia = (id, run) => {
		mediaScheduler.schedule({
			id: `maintenance:${id}`,
			atMs: mediaScheduler.now(),
			everyMs: DELIVERY_QUEUE_MEDIA_GC_INTERVAL_MS,
			run
		});
	};
	waitForMediaCleanupDrainsToSettle().then(() => {
		if (!mediaScheduler.signal.aborted) scheduleMedia("delivery-queue-media", () => runDeliveryQueueMediaGc().catch((error) => {
			params.logHealth.error(`delivery queue maintenance failed: ${formatErrorMessage(error)}`);
		}));
	});
	schedulePeriodic("device-pair-setup", 6e4, () => pruneExpiredDevicePairSetupCompletions({ nowMs: scheduler.now() }).catch((error) => {
		params.logHealth.error(`device pair setup cleanup failed: ${formatErrorMessage(error)}`);
	}), true);
	schedulePeriodic("plugin-state", 6e4, async () => {
		const signal = getAsyncWorkSignal();
		try {
			const { sweepExpiredPluginStateEntriesInWorker } = await import("./plugin-state-worker-client-B8_YMuCb.mjs");
			await sweepExpiredPluginStateEntriesInWorker({ assertActive: () => signal?.throwIfAborted() });
		} catch (error) {
			params.logHealth.error(`plugin state cleanup failed: ${formatErrorMessage(error)}`);
		}
	}, true);
	const skillUsageCleanup = registerSkillUsageTracking();
	schedulePeriodic("dedupe", 6e4, () => {
		const AGENT_RUN_SEQ_MAX = 1e4;
		const now = scheduler.now();
		pruneExpiredArtifactDownloads(params.clients, now);
		params.chatRunState.toolEventRecipients.pruneExpired(now);
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
			if (params.chatAbortControllers.has(runId) || params.chatQueuedTurns.has(runId) || hasAgentRunContextExecutionOwner(runId) || isActiveEmbeddedRunId(runId)) continue;
			if (record.abortMarker !== void 0) {
				if (now - chatAbortMarkerTimestampMs(record.abortMarker) <= ABORTED_RUN_TTL_MS) continue;
				params.chatRunState.deleteAbortMarker(runId);
			} else if (now - record.lastActivityAt <= ABORTED_RUN_TTL_MS) continue;
			while (params.chatRunState.registry.shift(runId));
			params.chatRunState.clearRun(runId);
		}
		sweepStaleRunContexts();
	});
	const runManagedOutgoingMediaGc = params.runManagedOutgoingMediaGc ?? (async () => {
		const { cleanupManagedOutgoingMediaRecords } = await import("./managed-image-attachments-Dw1dKNTm.mjs");
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
	let mediaCleanupStarted = false;
	const startMediaCleanup = () => {
		if (mediaScheduler.signal.aborted || mediaCleanupStarted) return;
		mediaCleanupStarted = true;
		waitForMediaCleanupDrainsToSettle().then(() => {
			if (mediaScheduler.signal.aborted) return;
			scheduleMedia("playback-cache", () => prunePlaybackTranscodeCache().catch((err) => {
				params.logHealth.error(`playback transcode cache cleanup failed: ${formatErrorMessage(err)}`);
			}));
			scheduleMedia("managed-outgoing", () => runManagedOutgoingMediaGc().catch((err) => {
				params.logHealth.error(`managed outgoing media cleanup failed: ${formatErrorMessage(err)}`);
			}));
			scheduleMedia("media", () => {
				const ttlHours = params.getRuntimeConfig().attachments?.ttlHours;
				return (ttlHours !== void 0 ? cleanOldMedia(ttlHours * 60 * 6e4, {
					recursive: true,
					pruneEmptyDirs: true
				}) : pruneOutboundMedia()).catch((err) => {
					params.logHealth.error(`media cleanup failed: ${formatErrorMessage(err)}`);
				});
			});
		});
	};
	let stopMediaCleanupPromise;
	const stopMediaCleanup = () => {
		stopMediaCleanupPromise ??= (async () => {
			registerMediaCleanupDrain(mediaScheduler.stop());
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
		scheduler: params.scheduler,
		getRuntimeConfig: params.getRuntimeConfig,
		onError: (message) => params.logHealth.error(`transcript cold storage failed: ${message}`)
	});
	const stopPeriodicTasks = () => {
		if (!periodicTasksStopPromise) {
			restartDrainSignal.removeEventListener("abort", onRestartDrain);
			periodicTasksStopPromise = Promise.allSettled([
				scheduler.stop(),
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
