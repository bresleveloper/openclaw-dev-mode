import { t as drainGlobalSingletonLifecycleState } from "./global-singleton-0m-JziJW.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as finalizeActiveDebugProxyCaptures } from "./runtime-cleanup-CDxMLsqE.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DPmgR5gM.mjs";
import { r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BSmCVVpP.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { r as disposeAllSessionMcpRuntimes } from "./agent-bundle-mcp-manager-api-DMR2FD5c.mjs";
import { s as closeOpenClawAgentDatabasesAsync } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { l as closePluginStateDatabaseAsync } from "./plugin-state-store-yKq-W0-T.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { i as createSessionEndTranscriptSourceLease } from "./hooks-ADSXph0M.mjs";
import { t as disposeRegisteredAgentHarnesses } from "./registry-BrXrewXj.mjs";
import { r as closePreparedModelRuntimeSnapshots } from "./prepared-model-runtime.lifecycle-ADHVLWEn.mjs";
import { n as closeSessionTranscriptReconcileWorkerPool } from "./session-transcript-reconcile-pool-8tPpYHPN.mjs";
import { r as listChannelPlugins } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { c as WEBSOCKET_CLOSE_GRACE_MS } from "./server-constants-BH_EolwD.mjs";
import { t as disposeAcpSessionManager } from "./manager-daMVnzH0.mjs";
import { r as captureGatewayReplyRunRestartAbort } from "./reply-run-registry.registry-C1J6phNB.mjs";
import { o as createAgentRunRestartAbortError } from "./run-termination-DGv2EKii.mjs";
import "./reply-run-registry-Beow_31i.mjs";
import { n as fenceSessionSuspensionWritesForGatewayShutdown } from "./session-suspension-B4trj5N1.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-HjIVcJaQ.mjs";
import "./agent-bundle-mcp-tools-BAc-juSa.mjs";
import { r as closeSwarmScheduler } from "./swarm-scheduler-BnTRUM_W.mjs";
import { a as markGatewayRestartTrace, n as collectGatewayProcessMemoryUsageMb, o as measureGatewayRestartTrace, s as recordGatewayRestartTrace } from "./restart-trace-Kdafqv6h.mjs";
import { i as waitForMediaCleanupDrainsToSettle } from "./server-media-cleanup-lifecycle-KlRv-aNy.mjs";
import { r as clearSessionTypingState } from "./session-typing-state-bCPje0x2.mjs";
import { o as removeChatAbortControllerEntry } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { n as createChatAbortMarker } from "./server-chat-state-BP63MB41.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-DsJ_Zmkt.mjs";
import { n as abortQueuedChatTurns } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { n as recordGatewayShutdownWarning, r as resolveGatewayShutdownNotice } from "./server-shutdown-DqBhRLh6.mjs";
import { o as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-CdF7y2ZY.mjs";
import { d as createClosedSessionTranscriptSource, i as buildSessionEndHookPayload, n as listActiveSessionsForShutdown, t as forgetActiveSessionForShutdown } from "./active-sessions-shutdown-tracker-DGxZ9_um.mjs";
import { setTimeout } from "node:timers/promises";
import { cleanupSessionResources } from "@openclaw/ai/internal/runtime";
//#region src/gateway/server-run-shutdown.ts
const shutdownLog$1 = createSubsystemLogger("gateway/shutdown");
const RESTART_REPLY_DRAIN_POLL_MS = 100;
const RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS = 1e3;
const RESTART_MARKER_SLOW_WARNING_MS = 1e3;
function getRestartReplyDrainCounts(params) {
	const pendingReplyCount = params.getPendingReplyCount();
	const activeRuns = listRestartDrainRuns(params.chatAbortControllers).length;
	const queuedTurns = Array.from(params.chatQueuedTurns.values(), (entry) => entry.controller.signal.aborted).filter((aborted) => !aborted).length;
	return {
		pendingReplies: Number.isFinite(pendingReplyCount) && pendingReplyCount > 0 ? Math.floor(pendingReplyCount) : 0,
		activeRuns,
		queuedTurns
	};
}
function listUnabortedRuns(chatAbortControllers) {
	return Array.from(chatAbortControllers.entries()).filter(([, entry]) => !entry.controller.signal.aborted);
}
function listRestartDrainRuns(chatAbortControllers) {
	return listUnabortedRuns(chatAbortControllers).filter(([, entry]) => entry.registrationCleanupRequested !== true);
}
function listRestartRecoveryRuns(chatAbortControllers) {
	return listUnabortedRuns(chatAbortControllers).filter(([, entry]) => entry.controlUiVisible !== false && (entry.registrationCleanupRequested !== true || entry.projectSessionTerminalPersisted !== true));
}
function formatRestartReplyDrainDetails(counts) {
	const details = [];
	if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} pending reply(ies)`);
	if (counts.activeRuns > 0) details.push(`${counts.activeRuns} active run(s)`);
	if (counts.queuedTurns > 0) details.push(`${counts.queuedTurns} queued turn(s)`);
	return details.length > 0 ? details.join(", ") : "no pending reply work";
}
async function waitForRestartReplyDrain(params) {
	const timeoutMs = Math.max(0, Math.floor(params.timeoutMs));
	let counts = getRestartReplyDrainCounts(params);
	if (counts.pendingReplies <= 0 && counts.activeRuns <= 0 && counts.queuedTurns <= 0) return {
		drained: true,
		elapsedMs: 0,
		counts
	};
	if (timeoutMs <= 0) return {
		drained: false,
		elapsedMs: 0,
		counts
	};
	const startedAt = Date.now();
	for (;;) {
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs >= timeoutMs) return {
			drained: false,
			elapsedMs,
			counts
		};
		await setTimeout(Math.min(RESTART_REPLY_DRAIN_POLL_MS, timeoutMs - elapsedMs), void 0, { ref: false });
		counts = getRestartReplyDrainCounts(params);
		if (counts.pendingReplies <= 0 && counts.activeRuns <= 0 && counts.queuedTurns <= 0) return {
			drained: true,
			elapsedMs: Date.now() - startedAt,
			counts
		};
	}
}
function collectActiveRestartSessionRefs(params) {
	const activeRuns = /* @__PURE__ */ new Map();
	const observedAt = Date.now();
	const addRun = (run) => {
		activeRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, {
			...run,
			observedAt: run.observedAt ?? observedAt
		});
	};
	for (const [runId, entry] of listRestartRecoveryRuns(params.chatAbortControllers)) {
		const sessionKey = entry.sessionKey.trim();
		const sessionId = (entry.kind === "agent" || !sessionKey ? void 0 : params.resolveActiveSessionIdForKey?.(sessionKey)) || entry.sessionId.trim();
		if (runId && entry.lifecycleGeneration && sessionKey && sessionId) addRun({
			runId,
			lifecycleGeneration: entry.lifecycleGeneration,
			sessionKey,
			sessionId,
			observedAt: entry.projectSessionTerminalObservedAt
		});
	}
	for (const candidate of params.restartRecoveryCandidates?.values() ?? []) {
		const resolvedSessionId = params.resolveActiveSessionIdForKey?.(candidate.sessionKey);
		addRun({
			...candidate,
			sessionId: resolvedSessionId || candidate.sessionId
		});
	}
	return [...activeRuns.values()];
}
async function settleTerminalSessionPersistenceForRestart(chatAbortControllers) {
	const pending = listUnabortedRuns(chatAbortControllers).flatMap(([, entry]) => {
		const persistence = entry.projectSessionTerminalPersistence;
		if (entry.projectSessionActive !== false || !persistence) return [];
		return [{
			entry,
			persistence
		}];
	});
	if (pending.length === 0) return;
	const results = await raceWithTimeout(() => Promise.allSettled(pending.map(({ persistence }) => persistence)), RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS, () => null, { ref: false });
	if (!results) {
		shutdownLog$1.warn(`terminal session persistence did not settle within ${RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS}ms; preserving restart recovery`);
		return;
	}
	for (const [index, result] of results.entries()) {
		const tracked = pending[index];
		if (!tracked || tracked.entry.projectSessionTerminalPersistence !== tracked.persistence) continue;
		tracked.entry.projectSessionTerminalPending = false;
		tracked.entry.projectSessionTerminalPersistence = void 0;
		if (result.status === "fulfilled") tracked.entry.projectSessionTerminalPersisted = true;
	}
}
async function markActiveRunsForRestartRecovery(params) {
	if (!params.markMainSessionsAbortedForRestart) return 0;
	await settleTerminalSessionPersistenceForRestart(params.chatAbortControllers);
	const activeRuns = collectActiveRestartSessionRefs(params);
	const activeEntries = new Map(params.chatAbortControllers);
	const recoveryCandidates = new Map(params.restartRecoveryCandidates);
	const abortReplyRuns = captureGatewayReplyRunRestartAbort(params.resolveGatewayContext);
	try {
		let markerOutcome;
		if (await raceWithTimeout(() => {
			markerOutcome = Promise.resolve(params.markMainSessionsAbortedForRestart({
				resolveGatewayContext: params.resolveGatewayContext,
				activeRuns,
				reason: params.reason,
				isActiveRun: (run) => {
					const entry = params.chatAbortControllers.get(run.runId);
					const candidate = params.restartRecoveryCandidates?.get(run.runId);
					return entry && entry === activeEntries.get(run.runId) && !entry.controller.signal.aborted && (entry.registrationCleanupRequested !== true || entry.projectSessionTerminalPersisted !== true) && entry.lifecycleGeneration === run.lifecycleGeneration || candidate !== void 0 && candidate === recoveryCandidates.get(run.runId) && candidate.lifecycleGeneration === run.lifecycleGeneration;
				}
			}));
			return markerOutcome.then(() => false);
		}, RESTART_MARKER_SLOW_WARNING_MS, () => true, { ref: false })) {
			shutdownLog$1.warn(`restart session marker did not settle within ${RESTART_MARKER_SLOW_WARNING_MS}ms; waiting before shutdown`);
			recordGatewayShutdownWarning(params.warnings, "restart-main-session-marker");
			await markerOutcome;
		}
		for (const run of activeRuns) if (params.restartRecoveryCandidates?.get(run.runId) === recoveryCandidates.get(run.runId)) params.restartRecoveryCandidates?.delete(run.runId);
	} catch (err) {
		shutdownLog$1.warn(`failed to mark active main session(s) for restart recovery: ${String(err)}`);
		recordGatewayShutdownWarning(params.warnings, "restart-main-session-marker");
	}
	return abortReplyRuns((sessionId, error) => {
		shutdownLog$1.warn(`failed to cancel reply for restart: sessionId=${sessionId} error=${String(error)}`);
		recordGatewayShutdownWarning(params.warnings, "restart-reply-abort");
	});
}
/** Cancels only this Gateway's exact controller registrations. */
function abortActiveRuns(params, restart) {
	let aborted = 0;
	for (const [runId, entry] of listUnabortedRuns(params.chatAbortControllers)) {
		if (!isChatAbortControllerEntryAbortable(entry)) continue;
		if (entry.projectSessionActive === false) {
			entry.abortStopReason = restart ? "restart" : "rpc";
			entry.controller.abort(restart ? createAgentRunRestartAbortError() : void 0);
			removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
			params.chatRunState.getOrCreate(runId).abortMarker = createChatAbortMarker();
			params.chatRunState.clearRun(runId);
			const removed = params.removeChatRun(runId, runId, entry.sessionKey);
			params.agentRunSeq.delete(runId);
			if (removed?.clientRunId) params.agentRunSeq.delete(removed.clientRunId);
			aborted += 1;
			continue;
		}
		if (abortChatRunById(params, {
			runId,
			sessionKey: entry.sessionKey,
			stopReason: restart ? "restart" : "rpc"
		}).aborted) aborted += 1;
	}
	return aborted;
}
/** Abort queued owners before active teardown can promote them into the closing runtime. */
function abortQueuedTurns(params, restart) {
	const matches = Array.from(params.chatQueuedTurns, ([runId, entry]) => ({
		runId,
		entry
	}));
	return abortQueuedChatTurns(params.chatQueuedTurns, matches, restart ? "restart" : void 0).length;
}
/** Completes grace and requests cancellation before execution joining begins. */
async function prepareGatewayRunShutdown(params) {
	if (!params.restart) {
		abortQueuedTurns(params, false);
		abortActiveRuns(params, false);
		return;
	}
	const initialCounts = getRestartReplyDrainCounts(params);
	let drainResult;
	if (initialCounts.pendingReplies > 0 || initialCounts.activeRuns > 0 || initialCounts.queuedTurns > 0) {
		const timeoutMs = Math.max(0, Math.floor(params.timeoutMs));
		if (timeoutMs > 0) shutdownLog$1.info(`waiting for ${formatRestartReplyDrainDetails(initialCounts)} before restart shutdown (timeout ${timeoutMs}ms)`);
		drainResult = await waitForRestartReplyDrain({
			getPendingReplyCount: params.getPendingReplyCount,
			chatAbortControllers: params.chatAbortControllers,
			chatQueuedTurns: params.chatQueuedTurns,
			timeoutMs
		});
		if (!drainResult.drained) {
			shutdownLog$1.warn(`restart reply drain timed out after ${drainResult.elapsedMs}ms with ${formatRestartReplyDrainDetails(drainResult.counts)} still active; continuing shutdown`);
			recordGatewayShutdownWarning(params.warnings, "restart-reply-drain");
		}
	}
	const abortedQueuedTurns = abortQueuedTurns(params, true);
	if (drainResult?.drained === false && abortedQueuedTurns > 0) shutdownLog$1.warn(`aborted ${abortedQueuedTurns} queued turn(s) during restart shutdown`);
	const abortedReplies = await markActiveRunsForRestartRecovery({
		...params,
		reason: "gateway restart shutdown"
	});
	const abortedRuns = abortActiveRuns(params, true) + abortedReplies;
	if (drainResult?.drained) shutdownLog$1.info(`restart reply drain completed after ${drainResult.elapsedMs}ms`);
	else if (drainResult && abortedRuns > 0) shutdownLog$1.warn(`aborted ${abortedRuns} active run(s) during restart shutdown`);
}
//#endregion
//#region src/gateway/server-close.ts
const shutdownLog = createSubsystemLogger("gateway/shutdown");
const GATEWAY_SHUTDOWN_HOOK_TIMEOUT_MS = 5e3;
const GATEWAY_PRE_RESTART_HOOK_TIMEOUT_MS = 1e4;
const ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS = 2e3;
const WEBSOCKET_CLOSE_FORCE_CONTINUE_MS = 250;
const HTTP_CLOSE_GRACE_MS = 1e3;
const HTTP_CLOSE_FORCE_WAIT_MS = 5e3;
const MCP_RUNTIME_CLOSE_GRACE_MS = 5e3;
const LSP_RUNTIME_CLOSE_GRACE_MS = 5e3;
const EMBEDDING_PROVIDER_CLOSE_GRACE_MS = 5e3;
const AGENT_HARNESS_CLOSE_GRACE_MS = 5e3;
function createCloseStepTimer(reason) {
	return (name, run) => {
		markGatewayRestartTrace(`restart.close.${name}.begin`);
		return measureGatewayRestartTrace(`restart.close.${name}`, run, [["reason", reason]]);
	};
}
/** Run one shutdown step and record a warning instead of aborting the whole close. */
async function shutdownStep(name, fn, warnings) {
	try {
		await fn();
	} catch (err) {
		if (hasRetainedPluginRuntimeCloseError(err)) throw err;
		const detail = err instanceof Error ? err.message : String(err);
		shutdownLog.warn(`${name}: ${detail}`);
		recordGatewayShutdownWarning(warnings, name);
	}
}
async function triggerGatewayLifecycleHookWithTimeout(params) {
	const hookPromise = params.cleanupWork.track(() => triggerInternalHook(params.event));
	hookPromise.catch(() => void 0);
	if (await settlesWithin(hookPromise, params.timeoutMs)) return "completed";
	shutdownLog.warn(`${params.hookName} hook timed out after ${params.timeoutMs}ms; continuing shutdown`);
	return "timeout";
}
async function disposeRuntimeWithShutdownGrace(params) {
	const disposePromise = params.cleanupWork.track(() => Promise.resolve().then(params.dispose)).catch((err) => {
		shutdownLog.warn(`${params.label} runtime disposal failed during shutdown: ${String(err)}`);
		recordGatewayShutdownWarning(params.warnings, params.label);
	});
	if (!await settlesWithin(disposePromise, params.graceMs)) {
		shutdownLog.warn(`${params.label} runtime disposal exceeded ${params.graceMs}ms; continuing shutdown`);
		recordGatewayShutdownWarning(params.warnings, params.label);
	}
}
async function runGatewayClosePrelude(params) {
	params.stopDiagnostics?.();
	await params.skillsChangeUnsub?.();
	params.disposeAuthRateLimiter?.();
	params.disposeBrowserAuthRateLimiter();
	await params.stopChannelHealthMonitor?.();
	params.stopReadinessEventLoopHealth?.();
	await params.closeMcpServer?.().catch(() => {});
}
async function waitForHttpClose(params) {
	return await settlesWithin(params.closePromise, params.timeoutMs).catch((err) => {
		const detail = err instanceof Error ? err.message : String(err);
		shutdownLog.warn(`${params.label}: ${detail}`);
		recordGatewayShutdownWarning(params.warnings, params.label);
		return true;
	});
}
async function closeHttpListener(params) {
	const { server, label, warnings } = params;
	server.closeIdleConnections?.();
	const closePromise = new Promise((resolve, reject) => {
		server.close((err) => {
			if (!err || hasErrnoCode(err, "ERR_SERVER_NOT_RUNNING")) {
				resolve();
				return;
			}
			reject(err);
		});
	});
	closePromise.catch(() => void 0);
	if (await waitForHttpClose({
		closePromise,
		timeoutMs: HTTP_CLOSE_GRACE_MS,
		label,
		warnings
	})) return;
	shutdownLog.warn(`${label} close exceeded ${HTTP_CLOSE_GRACE_MS}ms; forcing connection shutdown and waiting for close`);
	recordGatewayShutdownWarning(warnings, label);
	server.closeAllConnections?.();
	if (!await waitForHttpClose({
		closePromise,
		timeoutMs: HTTP_CLOSE_FORCE_WAIT_MS,
		label,
		warnings
	})) throw new Error(`${label} close still pending after forced connection shutdown (${HTTP_CLOSE_FORCE_WAIT_MS}ms)`);
}
async function prepareGatewayClose(params, opts) {
	const start = Date.now();
	const warnings = [];
	const notice = resolveGatewayShutdownNotice(opts);
	const { reason } = notice;
	const restartExpectedMs = notice.restartExpectedMs ?? null;
	const measureCloseStep = createCloseStepTimer(reason);
	const cleanupWork = new AsyncWorkScope();
	fenceSessionSuspensionWritesForGatewayShutdown();
	shutdownLog.debug(`shutdown started: ${reason}`);
	const triggerLifecycleHook = (action, timeoutMs) => {
		const hookName = `gateway:${action}`;
		return measureCloseStep(`gateway-${action}-hook`, () => shutdownStep(hookName, async () => {
			if (await triggerGatewayLifecycleHookWithTimeout({
				cleanupWork,
				event: createInternalHookEvent("gateway", action, hookName, {
					reason,
					restartExpectedMs
				}),
				hookName,
				timeoutMs
			}) === "timeout") recordGatewayShutdownWarning(warnings, hookName);
		}, warnings));
	};
	try {
		await shutdownStep("update-check", () => params.updateCheckStop?.(), warnings);
		await measureCloseStep("config-reloader", () => shutdownStep("config-reloader", () => params.configReloader.stop(), warnings));
		await triggerLifecycleHook("shutdown", GATEWAY_SHUTDOWN_HOOK_TIMEOUT_MS);
		if (restartExpectedMs !== null) await triggerLifecycleHook("pre-restart", GATEWAY_PRE_RESTART_HOOK_TIMEOUT_MS);
		const drainTimeoutMs = typeof opts?.drainTimeoutMs === "number" && Number.isFinite(opts.drainTimeoutMs) ? Math.max(0, Math.floor(opts.drainTimeoutMs)) : 0;
		await measureCloseStep("reply-drain", () => prepareGatewayRunShutdown({
			...params,
			restart: restartExpectedMs !== null,
			timeoutMs: drainTimeoutMs,
			warnings
		}));
		return {
			start,
			notice,
			warnings,
			cleanupWork
		};
	} catch (error) {
		await cleanupWork.drain();
		throw error;
	}
}
function completeGatewayClose(params, preparation) {
	return preparation.cleanupWork.run(async () => {
		try {
			return await closeGatewayResources(params, preparation);
		} finally {
			await preparation.cleanupWork.drain();
		}
	});
}
async function closeGatewayResources(params, preparation) {
	await params.pluginMetadata.beginClose();
	const { start, notice, warnings, cleanupWork } = preparation;
	const { reason } = notice;
	const restartExpectedMs = notice.restartExpectedMs ?? null;
	let pluginServicesCleanup;
	let mediaCleanupStopResult;
	const resourceCleanupErrors = [];
	const recordResourceCleanupFailure = (error) => {
		if (hasRetainedPluginRuntimeCloseError(error)) throw error;
		resourceCleanupErrors.push(error);
	};
	let closeFailure;
	const measureCloseStep = createCloseStepTimer(reason);
	try {
		if (params.drainActiveSessionsForShutdown) await measureCloseStep("session-end-drain", () => shutdownStep("session-end-drain", async () => {
			const drainReason = restartExpectedMs !== null ? "restart" : "shutdown";
			const result = await params.drainActiveSessionsForShutdown({
				reason: drainReason,
				totalTimeoutMs: ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS
			});
			if (result.timedOut) {
				shutdownLog.warn(`session-end-drain timed out after ${ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS}ms after ${result.emittedSessionIds.length} sessions; continuing shutdown`);
				recordGatewayShutdownWarning(warnings, "session-end-drain");
			}
		}, warnings));
		if (params.bonjourStop) await shutdownStep("bonjour", () => params.bonjourStop(), warnings);
		await measureCloseStep("acp-session-manager", () => shutdownStep("acp-session-manager", () => disposeAcpSessionManager("gateway-shutdown"), warnings));
		if (params.pluginServices) {
			const cleanup = cleanupWork.track(() => Promise.resolve().then(async () => {
				if ((await params.pluginServices.stop())?.errors.length) recordGatewayShutdownWarning(warnings, "plugin-services");
			}));
			pluginServicesCleanup = cleanup;
			await measureCloseStep("plugin-services", () => disposeRuntimeWithShutdownGrace({
				cleanupWork,
				label: "plugin-services",
				dispose: () => cleanup,
				graceMs: MCP_RUNTIME_CLOSE_GRACE_MS,
				warnings
			}));
		}
		await measureCloseStep("channels", async () => {
			const channelIds = params.channelIds ?? listChannelPlugins().map((plugin) => plugin.id);
			for (const channelId of channelIds) await shutdownStep(`channel/${channelId}`, () => params.stopChannel(channelId), warnings);
		});
		await shutdownStep("code-mode-runs", () => params.disposeAllCodeModeRuns(), warnings);
		await disposeRuntimeWithShutdownGrace({
			cleanupWork,
			label: "agent-harnesses",
			dispose: disposeRegisteredAgentHarnesses,
			graceMs: AGENT_HARNESS_CLOSE_GRACE_MS,
			warnings
		});
		await shutdownStep("ai-session-resources", () => cleanupSessionResources(), warnings);
		await shutdownStep("provider-transport-dispatchers", () => params.closeProviderTransportDispatcherPool(), warnings);
		await measureCloseStep("bundle-runtimes", async () => {
			await Promise.all([disposeRuntimeWithShutdownGrace({
				cleanupWork,
				label: "bundle-mcp",
				dispose: disposeAllSessionMcpRuntimes,
				graceMs: MCP_RUNTIME_CLOSE_GRACE_MS,
				warnings
			}), disposeRuntimeWithShutdownGrace({
				cleanupWork,
				label: "bundle-lsp",
				dispose: params.disposeAllBundleLspRuntimes,
				graceMs: LSP_RUNTIME_CLOSE_GRACE_MS,
				warnings
			})]);
		});
		await shutdownStep("periodic-maintenance", () => params.maintenance?.stopPeriodicTasks(), warnings);
		await shutdownStep("skill-usage", () => params.maintenance?.skillUsageCleanup(), warnings);
		try {
			mediaCleanupStopResult = await params.stopMediaCleanup();
		} catch (err) {
			shutdownLog.warn(`media-cleanup: ${err instanceof Error ? err.message : String(err)}`);
			recordGatewayShutdownWarning(warnings, "media-cleanup");
		}
		if (mediaCleanupStopResult !== "drained") recordGatewayShutdownWarning(warnings, "media-cleanup");
		await measureCloseStep("gmail-watcher", () => shutdownStep("gmail-watcher", () => params.stopGmailWatcher(), warnings));
		await shutdownStep("heartbeat-runner", () => params.heartbeatRunner.stop(), warnings);
		await shutdownStep("cron", () => params.cron.stopAndDrain ? params.cron.stopAndDrain() : params.cron.stop(), warnings);
		await shutdownStep("cron-maintenance", () => params.stopCronMaintenance?.(), warnings);
		if (params.agentUnsub) await shutdownStep("agent-unsub", () => params.agentUnsub(), warnings);
		if (params.heartbeatUnsub) await shutdownStep("heartbeat-unsub", () => params.heartbeatUnsub(), warnings);
		if (params.transcriptUnsub) await shutdownStep("transcript-unsub", () => params.transcriptUnsub(), warnings);
		if (params.lifecycleUnsub) await shutdownStep("lifecycle-unsub", () => params.lifecycleUnsub(), warnings);
		params.chatRunState.clear();
		let clientCloseFailures = 0;
		for (const c of params.clients) try {
			c.socket.close(1012, c.connectionKind === "worker" ? "gateway-shutdown" : "service restart");
		} catch {
			clientCloseFailures++;
		}
		if (clientCloseFailures > 0) {
			shutdownLog.warn(`failed to close ${clientCloseFailures} WebSocket client(s)`);
			recordGatewayShutdownWarning(warnings, "ws-clients");
		}
		params.clients.clear();
		if (params.wss) await measureCloseStep("websocket-server", async () => {
			const wsClients = params.wss?.clients ?? /* @__PURE__ */ new Set();
			const closePromise = new Promise((resolve) => {
				params.wss?.close(() => resolve());
			});
			if (!await settlesWithin(closePromise, 1e3)) {
				shutdownLog.warn(`websocket server close exceeded ${WEBSOCKET_CLOSE_GRACE_MS}ms; forcing shutdown continuation with ${wsClients.size} tracked client(s)`);
				recordGatewayShutdownWarning(warnings, "websocket-server");
				for (const client of wsClients) try {
					client.terminate();
				} catch {}
				if (!await settlesWithin(closePromise, WEBSOCKET_CLOSE_FORCE_CONTINUE_MS)) shutdownLog.warn(`websocket server close still pending after ${WEBSOCKET_CLOSE_FORCE_CONTINUE_MS}ms force window; continuing shutdown`);
			}
		});
		await params.finishRequestEntries?.();
		clearSessionTypingState();
		const transportServers = params.httpServers && params.httpServers.length > 0 ? params.httpServers : params.httpServer ? [params.httpServer] : [];
		try {
			if (transportServers.length > 0) await measureCloseStep("http-server", async () => {
				const failure = (await Promise.allSettled(transportServers.map((server, index) => closeHttpListener({
					server,
					label: transportServers.length > 1 ? `http-server[${index}]` : "http-server",
					warnings
				})))).find((result) => result.status === "rejected");
				if (failure) throw failure.reason;
			});
		} finally {
			if (params.tailscaleCleanup) await shutdownStep("tailscale", () => params.tailscaleCleanup(), warnings);
		}
		await disposeRuntimeWithShutdownGrace({
			cleanupWork,
			label: "embedding-providers",
			dispose: params.drainRetainedOpenAiEmbeddingProviders,
			graceMs: EMBEDDING_PROVIDER_CLOSE_GRACE_MS,
			warnings
		});
	} catch (error) {
		closeFailure = { error };
	} finally {
		await cleanupWork.runWhenIdle(() => {});
		await pluginServicesCleanup;
		await params.finishRequestEntries?.();
		await waitForMediaCleanupDrainsToSettle();
		await params.drainSdkWork?.();
		const swarmOwner = getCanonicalGatewayContextResolver(params.resolveGatewayContext);
		if (swarmOwner) await closeSwarmScheduler(swarmOwner).catch(recordResourceCleanupFailure);
		await params.stopScheduler();
		try {
			const registryClose = await params.closePluginRegistry(async (retireRegistry) => {
				await params.closeSdkResources?.().catch(recordResourceCleanupFailure);
				return params.pluginMetadata.close(async (retire) => {
					await closeSwarmScheduler().catch(recordResourceCleanupFailure);
					await closePreparedModelRuntimeSnapshots();
					await closeSessionTranscriptReconcileWorkerPool();
					await retire();
					await cleanupWork.runWhenIdle(() => {});
					await closeOpenClawAgentDatabasesAsync();
					await finalizeActiveDebugProxyCaptures().catch(recordResourceCleanupFailure);
					if (mediaCleanupStopResult !== void 0) await closePluginStateDatabaseAsync();
					try {
						await drainGlobalSingletonLifecycleState(restartExpectedMs === null ? "close" : "restart");
					} finally {
						try {
							params.clearSecretsRuntimeSnapshot?.();
						} catch {}
					}
				}, retireRegistry);
			});
			for (const error of registryClose.memoryErrors) {
				shutdownLog.warn(`memory-managers: ${formatErrorMessage(error)}`);
				recordGatewayShutdownWarning(warnings, "memory-managers");
			}
			for (const { pluginId, hookId, error } of registryClose.pluginFailures) {
				recordGatewayShutdownWarning(warnings, `plugin/${pluginId}`);
				const message = `Plugin ${pluginId} cleanup failed (${hookId}): ${formatErrorMessage(error)}`;
				shutdownLog.warn(message);
				if (hookId === "session-store") resourceCleanupErrors.push(new Error(message, { cause: error }));
			}
		} catch (error) {
			resourceCleanupErrors.push(error);
		}
	}
	const durationMs = Date.now() - start;
	if (resourceCleanupErrors.length > 0 || closeFailure) shutdownLog.warn(`shutdown failed in ${durationMs}ms${warnings.length ? `: ${warnings.join(", ")}` : ""}`);
	else if (warnings.length > 0) shutdownLog.warn(`shutdown completed in ${durationMs}ms with warnings: ${warnings.join(", ")}`);
	else shutdownLog.info(`shutdown completed cleanly in ${durationMs}ms`);
	recordGatewayRestartTrace("restart.close.total", durationMs, [
		["reason", reason],
		["restartExpectedMs", restartExpectedMs ?? "none"],
		...collectGatewayProcessMemoryUsageMb()
	]);
	if (resourceCleanupErrors.length === 1) throw resourceCleanupErrors[0];
	if (resourceCleanupErrors.length > 1) throw new AggregateError(resourceCleanupErrors, "Gateway resource cleanup failed", { cause: resourceCleanupErrors[0] });
	if (closeFailure) throw closeFailure.error;
	return {
		durationMs,
		warnings
	};
}
//#endregion
//#region src/gateway/active-sessions-shutdown-drain.ts
async function drainActiveSessionsForShutdown(params) {
	const tracked = listActiveSessionsForShutdown();
	if (tracked.length === 0) return {
		emittedSessionIds: [],
		timedOut: false
	};
	const totalTimeoutMs = Math.max(100, Math.floor(params.totalTimeoutMs ?? 2e3));
	const emittedSessionIds = [];
	const transcriptLeases = [];
	const hookRunner = getGlobalHookRunner();
	let settledEmissions = 0;
	const drain = Promise.allSettled(tracked.map(async (entry) => {
		try {
			forgetActiveSessionForShutdown(entry.sessionId);
			emittedSessionIds.push(entry.sessionId);
			if (!hookRunner?.hasHooks("session_end")) return;
			const transcript = resolveStableSessionEndTranscript({
				sessionId: entry.sessionId,
				storePath: entry.storePath,
				sessionFile: entry.sessionFile,
				agentId: entry.agentId
			});
			const transcriptLease = createSessionEndTranscriptSourceLease(createClosedSessionTranscriptSource({
				agentId: entry.agentId,
				sessionId: entry.sessionId,
				sessionKey: entry.sessionKey,
				storePath: entry.storePath
			}));
			transcriptLeases.push(transcriptLease);
			const payload = buildSessionEndHookPayload({
				sessionId: entry.sessionId,
				sessionKey: entry.sessionKey,
				agentId: entry.agentId,
				reason: params.reason,
				sessionFile: transcript.sessionFile,
				transcriptArchived: transcript.transcriptArchived,
				endedTranscript: transcriptLease.source
			});
			await hookRunner.runSessionEnd(payload.event, payload.context);
		} catch (err) {
			logVerbose(`session_end hook failed during shutdown drain: ${String(err)}`);
		} finally {
			settledEmissions++;
		}
	}));
	const timedOut = !await settlesWithin(drain, totalTimeoutMs);
	for (const lease of transcriptLeases) lease.revoke();
	if (timedOut) logVerbose(`shutdown session-end drain timed out after ${totalTimeoutMs}ms with ${tracked.length - settledEmissions} session_end handler(s) still pending`);
	return {
		emittedSessionIds,
		timedOut
	};
}
//#endregion
export { completeGatewayClose, drainActiveSessionsForShutdown, prepareGatewayClose, runGatewayClosePrelude };
