import { a as runInDetachedAsyncContext } from "./async-work-scope-CWk2dk1h.mjs";
import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, f as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-CHv_0noy.mjs";
import { l as getSessionEventWakeAbortSignal } from "./heartbeat-wake-bWS25cgK.mjs";
import { T as resolveSessionStorePathForScope, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { b as readSessionUpstreamLink, d as recordSessionHumanDirectMessage, f as recordSessionStateEvent, v as deleteSessionUpstreamLink, x as updateSessionUpstreamLinkMarker, y as listWatchedSessionUpstreamLinks } from "./session-state-events-CMg59EpB.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-Cjzxx3Pg.mjs";
import { i as readRecentUserAssistantTextForSession } from "./transcript-DgtCkbrJ.mjs";
import { t as computeBackoffMs } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import "./delivery-queue-sqlite-BghoE75G.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { I as schedulePendingSessionDeliveries, R as startSessionDeliveryRuntime } from "./subagent-completion-admission.store-S2mDR3VB.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import "./embedded-agent-DGv6YF31.mjs";
import { n as fenceScheduledGatewayContextResolver, t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-CudRX7U4.mjs";
import { t as startHeartbeatRunner } from "./heartbeat-runner-scheduler-Cku5mVrE.mjs";
import { r as assertQueuedConversationDeliveryAttemptAuthorized } from "./conversation-route-ownership-DnpeQv9j.mjs";
import { n as clearGatewayMaintenanceHandles, t as createNoopHeartbeatRunner } from "./server-runtime-service-shared-DE-vorah.mjs";
import "./server-idle-task-C1eSHJhq.mjs";
import "./server-runtime-startup-services-DaDODLLa.mjs";
import { createHash } from "node:crypto";
//#region src/sessions/session-upstream-monitor.ts
/** Polls watched adopted sessions for direct upstream human activity. */
const SESSION_UPSTREAM_MONITOR_INTERVAL_MS = 6e4;
const SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS = 15e3;
const SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT = 10;
const SESSION_UPSTREAM_MISSING_THRESHOLD = 3;
const log = createSubsystemLogger("sessions/upstream-monitor");
function currentProviders() {
	return (getPluginRegistryState()?.activeRegistry?.sessionCatalogs ?? []).map((registration) => registration.provider);
}
function databaseOptions(options) {
	return {
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {}
	};
}
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function upstreamSourceKey(probe) {
	return createHash("sha256").update(`${probe.hostId}\u0000${probe.threadId}\u0000${JSON.stringify(probe.upstreamRef)}`).digest("hex").slice(0, 16);
}
function upstreamMonitorLinkKey(probe) {
	return `${probe.sessionKey}\n${probe.agentId}\n${upstreamSourceKey(probe)}`;
}
function loadProbeSession(probe, options) {
	if (options.signal?.aborted) return;
	const entry = (options.loadEntry ?? loadSessionEntryReadOnly)({
		sessionKey: probe.sessionKey,
		agentId: probe.agentId,
		clone: false,
		...options.env ? { env: options.env } : {}
	});
	return entry?.sessionId ? entry : void 0;
}
function loadIdleProbeSession(probe, options, expectedSessionId) {
	const entry = loadProbeSession(probe, options);
	if (!entry || expectedSessionId !== void 0 && entry.sessionId !== expectedSessionId || (options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId)) return;
	return entry;
}
function readMatchingProbeLink(probe, expectedUpdatedAt, options) {
	const currentLink = readSessionUpstreamLink(probe.sessionKey, probe.agentId, options);
	return currentLink && currentLink.updatedAt === expectedUpdatedAt && upstreamSourceKey(currentLink) === upstreamSourceKey(probe) ? currentLink : void 0;
}
async function loadOwnRecentUserTexts(probe, entry, options) {
	if (options.loadOwnRecentUserTexts) return await options.loadOwnRecentUserTexts({
		entry,
		probe
	});
	const storePath = resolveSessionStorePathForScope({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		...options.env ? { env: options.env } : {}
	});
	return (await readRecentUserAssistantTextForSession({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		storePath,
		limit: SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT,
		preferUpstreamUserText: true,
		role: "user"
	})).map((item) => normalizeUserText(item.text)).filter(Boolean);
}
async function probeProvenanceUnchanged(probe, expectedSessionId, options) {
	const entry = loadIdleProbeSession(probe, options, expectedSessionId);
	if (!entry) return false;
	const current = await loadOwnRecentUserTexts(probe, entry, options);
	if (!loadIdleProbeSession(probe, options, expectedSessionId)) return false;
	return options.signal?.aborted !== true && current.length === probe.ownRecentUserTexts.length && current.every((text, index) => text === probe.ownRecentUserTexts[index]);
}
async function runSessionUpstreamMonitorTick(options = {}, missingCounts = /* @__PURE__ */ new Map()) {
	if (options.signal?.aborted) return;
	const dbOptions = databaseOptions(options);
	const linksByCatalog = await listWatchedSessionUpstreamLinks(dbOptions);
	if (options.signal?.aborted) return;
	const watchedLinkKeys = new Set([...linksByCatalog.values()].flatMap((links) => links.map(upstreamMonitorLinkKey)));
	for (const key of missingCounts.keys()) if (!watchedLinkKeys.has(key)) missingCounts.delete(key);
	const providers = options.providers ?? currentProviders();
	const providerById = new Map(providers.map((provider) => [provider.id, provider]));
	for (const [catalogId, links] of linksByCatalog) {
		const provider = providerById.get(catalogId);
		if (!provider?.checkUpstreamActivity) continue;
		const probes = [];
		const sessionIdBySessionKey = /* @__PURE__ */ new Map();
		for (const link of links) {
			const probe = {
				sessionKey: link.sessionKey,
				agentId: link.agentId,
				threadId: link.threadId,
				hostId: link.hostId,
				upstreamKind: link.upstreamKind,
				upstreamRef: link.upstreamRef,
				marker: link.marker
			};
			try {
				const entry = loadIdleProbeSession(probe, options);
				if (!entry) continue;
				const ownRecentUserTexts = await loadOwnRecentUserTexts(probe, entry, options);
				if (options.signal?.aborted) return;
				probes.push({
					...probe,
					ownRecentUserTexts
				});
				sessionIdBySessionKey.set(probe.sessionKey, entry.sessionId);
			} catch (error) {
				log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
			}
		}
		if (probes.length === 0) continue;
		const probeBySessionKey = new Map(probes.map((probe) => [probe.sessionKey, probe]));
		const linkUpdatedAtBySessionKey = new Map(links.map((link) => [link.sessionKey, link.updatedAt]));
		try {
			const outcomes = await provider.checkUpstreamActivity(probes, { allowProcessHomeFallback: allowsProcessHomeSessionScan(options.env ?? process.env) });
			if (options.signal?.aborted) return;
			const missingSessionKeys = new Set(outcomes.filter((outcome) => outcome.kind === "missing").map((outcome) => outcome.sessionKey));
			for (const probe of probes) if (!missingSessionKeys.has(probe.sessionKey)) missingCounts.delete(upstreamMonitorLinkKey(probe));
			for (const outcome of outcomes) {
				const probe = probeBySessionKey.get(outcome.sessionKey);
				if (!probe) continue;
				const missingCountKey = upstreamMonitorLinkKey(probe);
				if (outcome.kind === "missing") {
					const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(outcome.sessionKey);
					const expectedSessionId = sessionIdBySessionKey.get(outcome.sessionKey);
					if (expectedUpdatedAt === void 0 || expectedSessionId === void 0) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					if (options.signal?.aborted) return;
					const currentLink = readMatchingProbeLink(probe, expectedUpdatedAt, dbOptions);
					if (!currentLink) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					const currentSession = loadProbeSession(probe, options);
					if (!currentSession || currentSession.sessionId !== expectedSessionId) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					if ((options.isRunActive ?? isEmbeddedAgentRunActive)(currentSession.sessionId)) continue;
					const previous = missingCounts.get(missingCountKey);
					const missingCount = Math.min(SESSION_UPSTREAM_MISSING_THRESHOLD, (previous?.linkUpdatedAt === expectedUpdatedAt ? previous.count : 0) + 1);
					missingCounts.set(missingCountKey, {
						count: missingCount,
						linkUpdatedAt: expectedUpdatedAt
					});
					if (missingCount < SESSION_UPSTREAM_MISSING_THRESHOLD) continue;
					const sourceKey = upstreamSourceKey(probe);
					if (!recordSessionStateEvent({
						sessionKey: probe.sessionKey,
						agentId: probe.agentId,
						kind: "upstream_missing",
						actorType: "system",
						dedupeKey: `upstream-missing:${probe.sessionKey}:${sourceKey}:${currentLink.updatedAt}`,
						summary: `upstream missing via ${catalogId}`,
						payload: { channel: catalogId }
					}, {
						...dbOptions,
						now: (options.now ?? Date.now)()
					})) {
						missingCounts.set(missingCountKey, {
							count: 2,
							linkUpdatedAt: expectedUpdatedAt
						});
						continue;
					}
					deleteSessionUpstreamLink(probe.sessionKey, probe.agentId, dbOptions);
					missingCounts.delete(missingCountKey);
					continue;
				}
				missingCounts.delete(missingCountKey);
				const activity = outcome;
				if (!Number.isSafeInteger(activity.humanTurns) || activity.humanTurns < 0) continue;
				try {
					if (!await probeProvenanceUnchanged(probe, sessionIdBySessionKey.get(probe.sessionKey), options)) continue;
				} catch (error) {
					log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
					continue;
				}
				const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(activity.sessionKey);
				if (!readMatchingProbeLink(probe, expectedUpdatedAt, dbOptions)) continue;
				if (activity.humanTurns === 0) {
					updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
						...dbOptions,
						now: (options.now ?? Date.now)(),
						...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
					});
					continue;
				}
				if (!Number.isFinite(activity.occurredAt) || !activity.dedupeId) continue;
				if (!recordSessionHumanDirectMessage({
					sessionKey: probe.sessionKey,
					agentId: probe.agentId,
					actor: { actorType: "human" },
					channel: catalogId,
					dedupeKey: `upstream:${probe.sessionKey}:${upstreamSourceKey(probe)}:${activity.dedupeId}`,
					...activity.humanTurns > 1 ? { payload: { turns: activity.humanTurns } } : {},
					occurredAt: activity.occurredAt
				}, {
					...dbOptions,
					now: (options.now ?? Date.now)()
				})) continue;
				updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
					...dbOptions,
					now: (options.now ?? Date.now)(),
					...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
				});
			}
		} catch (error) {
			log.warn(`upstream activity probe failed for ${catalogId}: ${String(error)}`);
		}
	}
}
function startSessionUpstreamMonitor(options = {}) {
	let stopped = false;
	let running = false;
	const lifecycle = new AbortController();
	const tickOptions = {
		...options,
		signal: lifecycle.signal
	};
	const missingCounts = /* @__PURE__ */ new Map();
	const run = () => {
		if (stopped || running) return;
		running = true;
		runSessionUpstreamMonitorTick(tickOptions, missingCounts).catch((error) => {
			log.warn(`upstream monitor tick failed: ${String(error)}`);
		}).finally(() => {
			running = false;
		});
	};
	const initialTimer = setTimeout(run, SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS);
	initialTimer.unref?.();
	const interval = setInterval(run, SESSION_UPSTREAM_MONITOR_INTERVAL_MS);
	interval.unref?.();
	return { stop: () => {
		if (stopped) return;
		stopped = true;
		lifecycle.abort();
		clearTimeout(initialTimer);
		clearInterval(interval);
	} };
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionUpstreamMonitorTestApi")] = { runSessionUpstreamMonitorTick };
//#endregion
//#region src/gateway/server-runtime-services.ts
const loadHeartbeatExecution = createLazyRuntimeModule(() => import("./heartbeat-runner-run-DBzm7GJw.mjs"));
/** Starts cron without making the surrounding startup or reload transaction wait. */
function startGatewayCronWithLogging(params) {
	const reconciliation = params.cronReconciliation.arm({
		reason: params.reason,
		config: params.config,
		cronState: params.cronState
	});
	runInDetachedAsyncContext(() => runWithGatewayIndependentRootWorkAdmission(async () => {
		try {
			await params.cronState.cron.start();
			await params.afterStart?.();
			await reconciliation.complete();
		} catch (err) {
			params.logCron.error(`failed to start: ${String(err)}`);
			params.onStartError?.(err);
		}
	}, "runtime:cron-start").catch((err) => params.logCron.error(`failed to enter start root: ${String(err)}`)));
}
/** Schedules post-ready maintenance and cancels/cleans handles if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const timer = setTimeout(() => {
		params.onStarted?.();
		if (params.isClosing()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => {
			try {
				if (!params.isClosing()) {
					const maintenance = await params.startMaintenance();
					if (params.isClosing()) await clearGatewayMaintenanceHandles(maintenance);
					else if (maintenance) await params.applyMaintenance(maintenance);
				}
			} catch (err) {
				params.log.warn(`gateway post-ready maintenance startup failed: ${String(err)}`);
			}
			if (!params.isClosing() && params.shouldStartCron()) {
				params.markCronStartHandled();
				startGatewayCronWithLogging({
					cronState: params.cronState,
					cronReconciliation: params.cronReconciliation,
					reason: "startup",
					config: params.cronConfig,
					logCron: params.logCron
				});
			}
			if (!params.isClosing()) params.recordPostReadyMemory();
		}, "runtime:maintenance").catch((err) => params.log.warn(`gateway post-ready maintenance deferred task failed: ${String(err)}`));
	}, params.delayMs);
	timer.unref?.();
	return timer;
}
const RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS = 5e3;
function startPendingOutboundDeliveryRecovery(params) {
	const recoveryContext = captureDeliveryQueueStateContext();
	let stopped = false;
	let initialPass = true;
	let inFlight = null;
	let stopPromise = null;
	let logRecovery;
	const recover = () => {
		if (stopped || inFlight || isGatewayWorkAdmissionClosed()) return;
		const settled = runWithGatewayIndependentRootWorkAdmission(async () => {
			if (stopped) return;
			const { drainPendingDeliveriesCore, recoverPendingDeliveries } = await import("./delivery-queue-recovery-CumOZnMz.mjs");
			const { deliverOutboundPayloadsInternal } = await import("./deliver-mrBvwqxk.mjs");
			if (stopped) return;
			const deliverWithCurrentConversationAuthority = async (deliveryParams, stateContext) => {
				const completion = deliveryParams.deliveryCompletion;
				const attemptAuthority = completion?.kind === "conversation" ? completion : deliveryParams.conversationDeliveryAttemptAuthority;
				if (!attemptAuthority) return await deliverOutboundPayloadsInternal(deliveryParams, stateContext);
				return await deliverOutboundPayloadsInternal({
					...deliveryParams,
					onDeliveryAttempt: async () => {
						await deliveryParams.onDeliveryAttempt?.();
						if (!attemptAuthority.routeFingerprint) return;
						await assertQueuedConversationDeliveryAttemptAuthorized({
							readCurrentConfig: getRuntimeConfig,
							operationId: attemptAuthority.operationId,
							routeFingerprint: attemptAuthority.routeFingerprint
						}, {
							agentId: attemptAuthority.agentId,
							...attemptAuthority.storePath ? { storePath: attemptAuthority.storePath } : {},
							env: resolveDeliveryQueueStateEnv(deliveryParams.deliveryQueueStateDir, stateContext)
						});
					}
				}, stateContext);
			};
			logRecovery ??= params.log.child("delivery-recovery");
			if (initialPass) {
				const cfg = params.cfg;
				initialPass = false;
				const { countPendingDeliveryQueueEntries } = await import("./delivery-queue-sqlite-CQ4nzaH7.mjs");
				const { LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME } = await import("./delivery-queue-namespaces-Dyq8sC33.mjs");
				const remaining = countPendingDeliveryQueueEntries([
					LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
					OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
					OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
				], void 0, recoveryContext);
				const { listLegacyDeliveryQueueArtifacts } = await import("./delivery-queue-legacy-files-0sAeCECI.mjs");
				const legacyFiles = listLegacyDeliveryQueueArtifacts(recoveryContext.stateDir);
				if (remaining > 0 || legacyFiles.length > 0) logRecovery.warn(`${remaining} legacy outbound deliveries and ${legacyFiles.length} legacy queue files need repair. Stop the Gateway and run openclaw doctor --fix.`);
				await recoverPendingDeliveries({
					deliver: deliverWithCurrentConversationAuthority,
					log: logRecovery,
					cfg,
					shouldContinue: () => !stopped
				}, deliverWithCurrentConversationAuthority, recoveryContext);
				return;
			}
			await drainPendingDeliveriesCore({
				drainKey: "gateway:outbound",
				logLabel: "Outbound delivery retry",
				cfg: getRuntimeConfig(),
				log: logRecovery,
				deliver: deliverWithCurrentConversationAuthority,
				selectEntry: () => ({
					match: true,
					bypassBackoff: false
				}),
				shouldContinue: () => !stopped
			}, deliverWithCurrentConversationAuthority, recoveryContext);
		}, "runtime:delivery-recovery").catch((err) => params.log.error(`Delivery recovery failed: ${String(err)}`)).finally(() => {
			if (inFlight === settled) inFlight = null;
		});
		inFlight = settled;
	};
	const retryTimer = setInterval(recover, computeBackoffMs(1));
	retryTimer.unref?.();
	recover();
	return () => {
		stopped = true;
		clearInterval(retryTimer);
		if (stopPromise) return stopPromise;
		const recovery = inFlight;
		if (!recovery) {
			stopPromise = Promise.resolve();
			return stopPromise;
		}
		const stillPendingTimer = setTimeout(() => {
			(logRecovery ??= params.log.child("delivery-recovery")).warn(`delivery recovery is still pending after ${RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS}ms; waiting before runtime teardown`);
		}, RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS);
		stillPendingTimer.unref?.();
		stopPromise = recovery.finally(() => {
			clearTimeout(stillPendingTimer);
		});
		return stopPromise;
	};
}
function startPendingSessionDeliveryRuntime(params) {
	const queueContext = captureOpenClawStateWorkerContext();
	const controller = new AbortController();
	const { signal } = controller;
	let recovery;
	let stopPromise;
	let stopRuntime;
	const timer = setTimeout(() => {
		recovery = runWithGatewayIndependentRootWorkAdmission(async () => {
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, settleQueuedSessionDelivery } = await import("./server-restart-sentinel-B_1ETS0T.mjs");
			if (signal.aborted) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				queueContext,
				deliver: (entry, { queueContext: deliveryContext }) => deliverQueuedSessionDelivery({
					deps: params.deps,
					entry,
					queueContext: deliveryContext,
					...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
				}),
				log: logRecovery,
				onSettled: settleQueuedSessionDelivery
			});
			try {
				await recoverPendingRestartContinuationDeliveries({
					deps: params.deps,
					queueContext,
					log: logRecovery,
					maxEnqueuedAt: params.maxEnqueuedAt,
					...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
				});
			} finally {
				if (!signal.aborted) await schedulePendingSessionDeliveries();
			}
		}, "runtime:session-delivery-recovery", signal).catch((err) => {
			if (!(signal.aborted && (err === signal.reason || err instanceof Error && err.cause === signal.reason))) params.log.error(`Session delivery recovery failed: ${String(err)}`);
		});
	}, 1250);
	timer.unref?.();
	return () => {
		controller.abort();
		clearTimeout(timer);
		stopPromise ??= Promise.all([recovery, stopRuntime?.()]).then(() => {});
		return stopPromise;
	};
}
/** Activates background gateway services after core runtime startup is ready. */
function activateGatewayScheduledServices(params) {
	if (params.minimalTestGateway) return {
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopDeliveryRecovery: async () => {}
	};
	if (!params.cronEnabled && resolveHeartbeatAgents(params.cfgAtStart).some((agent) => Boolean(resolveHeartbeatIntervalMs(params.cfgAtStart, void 0, agent.heartbeat)))) params.log.child("heartbeat").warn("scheduled heartbeats are disabled because the cron scheduler is disabled; enable cron and restart the gateway");
	if (!params.cronEnabled && resolveSkillWorkshopConfig(params.cfgAtStart).autonomous.mode === "auto") params.log.child("skill-workshop").warn("scheduled skill collection reviews are disabled because the cron scheduler is disabled; enable cron and restart the gateway");
	const heartbeatGatewayContextResolver = fenceScheduledGatewayContextResolver(params.resolveGatewayContext);
	const runScheduledHeartbeat = createScheduledGatewayRunner(heartbeatGatewayContextResolver);
	let heartbeatStopped = false;
	const heartbeatRunner = startHeartbeatRunner({
		cfg: params.cfgAtStart,
		readCurrentConfig: getRuntimeConfig,
		...heartbeatGatewayContextResolver ? { runOnce: async (opts) => {
			const wakeSignal = getSessionEventWakeAbortSignal();
			const { runHeartbeatOnce } = await loadHeartbeatExecution();
			if (heartbeatStopped || wakeSignal?.aborted) return {
				status: "skipped",
				reason: "disabled"
			};
			return await runScheduledHeartbeat(async () => await runHeartbeatOnce(opts));
		} } : {}
	});
	const sessionUpstreamMonitor = startSessionUpstreamMonitor();
	const stopSessionDeliveryRuntime = startPendingSessionDeliveryRuntime({
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
	});
	const stopOutboundDeliveryRecovery = startPendingOutboundDeliveryRecovery({
		cfg: params.cfgAtStart,
		log: params.log
	});
	let deliveryRecoveryStopPromise;
	const stopDeliveryRecovery = () => {
		deliveryRecoveryStopPromise ??= Promise.all([stopOutboundDeliveryRecovery(), stopSessionDeliveryRuntime()]).then(() => {});
		return deliveryRecoveryStopPromise;
	};
	return {
		heartbeatRunner: {
			updateConfig: heartbeatRunner.updateConfig,
			stop: () => {
				heartbeatStopped = true;
				stopDeliveryRecovery();
				sessionUpstreamMonitor.stop();
				heartbeatRunner.stop();
			}
		},
		stopDeliveryRecovery
	};
}
//#endregion
export { scheduleGatewayPostReadyMaintenance as n, startGatewayCronWithLogging as r, activateGatewayScheduledServices as t };
