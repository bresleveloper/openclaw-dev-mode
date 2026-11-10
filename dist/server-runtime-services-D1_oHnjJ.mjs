import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-orClZ-2Z.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { E as onOutboundDeliveryEnqueued } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission, h as isGatewayWorkAdmissionClosed, s as getActiveGatewayRootWorkCount } from "./gateway-work-admission-FWbk4b3p.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { d as recordSessionHumanDirectMessage, f as recordSessionStateEventAsync } from "./session-state-events-BCzDVKh0.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { i as readRecentUserAssistantTextForSession } from "./transcript-BSOdHT4f.mjs";
import "./lanes-D7a4ntDu.mjs";
import { l as getSessionEventWakeAbortSignal } from "./heartbeat-wake-do575_JN.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { s as getQueueSize } from "./command-queue-Dvag6gVL.mjs";
import { n as createNoopHeartbeatRunner, t as clearGatewayMaintenanceHandles } from "./server-maintenance-lifecycle-sBQZSAcp.mjs";
import { n as measureStartup } from "./server-startup-trace-D_q4lWuA.mjs";
import { t as computeBackoffMs } from "./delivery-recovery.shared-BD9P01Ce.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { r as startSessionDeliveryRuntime, t as schedulePendingSessionDeliveries } from "./session-delivery-queue-runtime-Di93zudM.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-CNn1aX1c.mjs";
import { n as fenceScheduledGatewayContextResolver, t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-Cs6rVhRo.mjs";
import { r as listWatchedSessionUpstreamLinks } from "./session-upstream-links-B-mgRkEp.mjs";
import { a as withAuthorizedQueuedConversationDelivery } from "./conversation-route-ownership-BwU3sGGv.mjs";
import { i as settleSessionUpstreamLink } from "./session-upstream-links-runtime-3vVKBo1p.mjs";
import { t as startHeartbeatRunner } from "./heartbeat-runner-scheduler-HaEuBqJo.mjs";
import { t as scheduleGatewayIdleTask } from "./server-idle-task-BVzJ54Ae.mjs";
import "./server-runtime-startup-services-U9f1hf6q.mjs";
import { createHash } from "node:crypto";
//#region src/sessions/session-upstream-monitor.ts
/** Polls watched adopted sessions for direct upstream human activity. */
const SESSION_UPSTREAM_MONITOR_INTERVAL_MS = 6e4;
const SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS = 15e3;
const SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT = 10;
const SESSION_UPSTREAM_MISSING_THRESHOLD = 3;
const log = createSubsystemLogger("sessions/upstream-monitor");
function upstreamSourceKey(probe) {
	return createHash("sha256").update(`${probe.hostId}\u0000${probe.threadId}\u0000${JSON.stringify(probe.upstreamRef)}`).digest("hex").slice(0, 16);
}
function upstreamMonitorLinkKey(probe) {
	return `${probe.sessionKey}\n${probe.agentId}\n${upstreamSourceKey(probe)}`;
}
function assertMonitorCurrent(options) {
	options.signal?.throwIfAborted();
}
function isIdleSession(entry, options) {
	return Boolean(!options.signal?.aborted && entry?.sessionId && !(options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId));
}
async function loadProbeSession(probe, options) {
	assertMonitorCurrent(options);
	const scope = {
		sessionKey: probe.sessionKey,
		agentId: probe.agentId,
		clone: false,
		env: options.env
	};
	const loadEntry = options.loadEntry;
	return loadEntry ? loadEntry(scope) : await withSessionEntryReadOnlyInWorker(scope, () => assertMonitorCurrent(options), async (read) => {
		if (!read.ok) throw read.error;
		return read.value;
	});
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
	})).map((item) => item.text.trim().replace(/\s+/g, " ")).filter(Boolean);
}
async function runSessionUpstreamMonitorTick(options = {}, missingCounts = /* @__PURE__ */ new Map()) {
	if (options.signal?.aborted) return;
	const providers = options.providers ?? (getPluginRegistryState()?.activeRegistry?.sessionCatalogs ?? []).map((registration) => registration.provider);
	if (!providers.some((provider) => provider.checkUpstreamActivity)) {
		missingCounts.clear();
		return;
	}
	const dbOptions = {
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {}
	};
	const linksByCatalog = await listWatchedSessionUpstreamLinks(dbOptions);
	if (options.signal?.aborted) return;
	const watchedLinkKeys = new Set([...linksByCatalog.values()].flatMap((links) => links.map(upstreamMonitorLinkKey)));
	for (const key of missingCounts.keys()) if (!watchedLinkKeys.has(key)) missingCounts.delete(key);
	const providerById = new Map(providers.map((provider) => [provider.id, provider]));
	for (const [catalogId, links] of linksByCatalog) {
		const provider = providerById.get(catalogId);
		if (!provider?.checkUpstreamActivity) continue;
		const probes = [];
		const sessionBySessionKey = /* @__PURE__ */ new Map();
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
				const session = await loadProbeSession(probe, options);
				if (!session || !isIdleSession(session, options)) continue;
				const ownRecentUserTexts = await loadOwnRecentUserTexts(probe, session, options);
				if (options.signal?.aborted) return;
				probes.push({
					...probe,
					ownRecentUserTexts
				});
				sessionBySessionKey.set(probe.sessionKey, session);
			} catch (error) {
				log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
			}
		}
		if (probes.length === 0) continue;
		const probeBySessionKey = new Map(probes.map((probe) => [probe.sessionKey, probe]));
		const linkBySessionKey = new Map(links.map((link) => [link.sessionKey, link]));
		try {
			const outcomes = await provider.checkUpstreamActivity(probes, { allowProcessHomeFallback: allowsProcessHomeSessionScan(options.env ?? process.env) });
			if (options.signal?.aborted) return;
			const missingSessionKeys = new Set(outcomes.filter((outcome) => outcome.kind === "missing").map((outcome) => outcome.sessionKey));
			for (const probe of probes) if (!missingSessionKeys.has(probe.sessionKey)) missingCounts.delete(upstreamMonitorLinkKey(probe));
			for (const outcome of outcomes) {
				const probe = probeBySessionKey.get(outcome.sessionKey);
				const session = sessionBySessionKey.get(outcome.sessionKey);
				const currentLink = linkBySessionKey.get(outcome.sessionKey);
				if (!probe || !session || !currentLink) continue;
				try {
					const expectedUpdatedAt = currentLink.updatedAt;
					const currentSession = await loadProbeSession(probe, options);
					if (!currentSession || currentSession.sessionId !== session.sessionId) {
						missingCounts.delete(upstreamMonitorLinkKey(probe));
						continue;
					}
					if (!isIdleSession(currentSession, options)) continue;
					const admission = { assertCurrent: () => assertMonitorCurrent(options) };
					const missingCountKey = upstreamMonitorLinkKey(probe);
					if (outcome.kind === "missing") {
						const previous = missingCounts.get(missingCountKey);
						const missingCount = Math.min(SESSION_UPSTREAM_MISSING_THRESHOLD, (previous?.linkUpdatedAt === expectedUpdatedAt ? previous.count : 0) + 1);
						missingCounts.set(missingCountKey, {
							count: missingCount,
							linkUpdatedAt: expectedUpdatedAt
						});
						if (missingCount < SESSION_UPSTREAM_MISSING_THRESHOLD) continue;
						const sourceKey = upstreamSourceKey(probe);
						if (!await recordSessionStateEventAsync({
							sessionKey: probe.sessionKey,
							agentId: probe.agentId,
							kind: "upstream_missing",
							actorType: "system",
							dedupeKey: `upstream-missing:${probe.sessionKey}:${sourceKey}:${currentLink.updatedAt}`,
							summary: `upstream missing via ${catalogId}`,
							payload: { channel: catalogId }
						}, {
							...dbOptions,
							now: (options.now ?? Date.now)(),
							...admission,
							expectedUpstream: currentLink
						})) {
							missingCounts.set(missingCountKey, {
								count: 2,
								linkUpdatedAt: expectedUpdatedAt
							});
							continue;
						}
						if (await settleSessionUpstreamLink(currentLink, { kind: "missing" }, {
							...dbOptions,
							...admission
						})) missingCounts.delete(missingCountKey);
						continue;
					}
					missingCounts.delete(missingCountKey);
					const activity = outcome;
					if (!Number.isSafeInteger(activity.humanTurns) || activity.humanTurns < 0) continue;
					if (activity.humanTurns === 0) {
						await settleSessionUpstreamLink(currentLink, {
							kind: "activity",
							marker: activity.nextMarker,
							now: (options.now ?? Date.now)()
						}, {
							...dbOptions,
							...admission
						});
						continue;
					}
					if (!Number.isFinite(activity.occurredAt) || !activity.dedupeId) continue;
					if (await recordSessionHumanDirectMessage({
						sessionKey: probe.sessionKey,
						agentId: probe.agentId,
						actor: { actorType: "human" },
						channel: catalogId,
						dedupeKey: `upstream:${probe.sessionKey}:${upstreamSourceKey(probe)}:${activity.dedupeId}`,
						...activity.humanTurns > 1 ? { payload: { turns: activity.humanTurns } } : {},
						occurredAt: activity.occurredAt
					}, {
						...dbOptions,
						now: (options.now ?? Date.now)(),
						expectedUpstream: currentLink,
						...admission
					})) await settleSessionUpstreamLink(currentLink, {
						kind: "activity",
						marker: activity.nextMarker,
						now: (options.now ?? Date.now)()
					}, {
						...dbOptions,
						...admission
					});
				} catch (error) {
					log.warn(`upstream settlement failed for ${probe.sessionKey}: ${String(error)}`);
				}
			}
		} catch (error) {
			log.warn(`upstream activity check failed for ${catalogId}: ${String(error)}`);
		}
	}
}
function startSessionUpstreamMonitor(options) {
	const { scheduler } = options;
	let running;
	const lifecycle = scheduler.scope();
	const tickOptions = {
		...options,
		now: options.now ?? (() => scheduler.now()),
		signal: options.signal ? AbortSignal.any([lifecycle.signal, options.signal]) : lifecycle.signal
	};
	const missingCounts = /* @__PURE__ */ new Map();
	const run = () => {
		if (lifecycle.signal.aborted || running) return;
		running = runSessionUpstreamMonitorTick(tickOptions, missingCounts).catch((error) => {
			log.warn(`upstream monitor tick failed: ${String(error)}`);
		}).finally(() => {
			running = void 0;
		});
		return running;
	};
	lifecycle.schedule({
		id: "sessions:upstream-initial-probe",
		delayMs: SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS,
		run
	});
	lifecycle.schedule({
		id: "sessions:upstream-monitor",
		delayMs: SESSION_UPSTREAM_MONITOR_INTERVAL_MS,
		everyMs: SESSION_UPSTREAM_MONITOR_INTERVAL_MS,
		run
	});
	return { stop: () => lifecycle.stop() };
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionUpstreamMonitorTestApi")] = { runSessionUpstreamMonitorTick };
//#endregion
//#region src/gateway/server-runtime-services.ts
const loadHeartbeatExecution = createLazyRuntimeModule(() => import("./heartbeat-runner-run--OdzO9aY.mjs"));
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
/** Schedules post-ready maintenance and cleans up if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const isRecovering = () => getQueueSize("background") > 0 || getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0;
	const idle = {
		scheduler: params.scheduler,
		delayMs: params.delayMs,
		retryDelayMs: Math.max(1e3, params.delayMs),
		isClosing: () => params.signal.aborted || params.isClosing(),
		isBusy: isRecovering,
		waitForReady: params.waitForPostReadyWork,
		log: params.log
	};
	if (process.platform === "linux") scheduleGatewayIdleTask({
		...idle,
		id: "database:page-cache",
		repeatDelayMs: 9e5,
		errorMessage: "database page-cache probe failed",
		run: async (signal) => {
			try {
				const { warmGatewayDatabasePageCache } = await import("./server-database-page-cache-YiNez-Wp.mjs");
				signal.throwIfAborted();
				await warmGatewayDatabasePageCache({
					databases: params.startupMaintenance.startupSessionDatabases,
					signal,
					startupTrace: params.startupMaintenance.startupTrace,
					log: params.log
				});
			} catch (error) {
				if (!signal.aborted && !params.isClosing()) params.log.warn(`database page-cache probe failed: ${String(error)}`);
			}
		}
	});
	scheduleGatewayIdleTask({
		...idle,
		id: "startup:database-maintenance",
		errorMessage: "Gateway post-ready startup maintenance failed",
		run: async (signal) => {
			await measureStartup(params.startupMaintenance.startupTrace, "post-ready.startup-maintenance", async () => {
				const { runGatewayPostReadyStartupMaintenance } = await import("./server-startup-plugins-CKrPrccB.mjs");
				signal.throwIfAborted();
				await runGatewayPostReadyStartupMaintenance({
					getConfig: readRuntimeConfig,
					getPluginRegistry: () => params.startupMaintenance.pluginRuntime.registry,
					pluginMetadataSnapshot: params.startupMaintenance.pluginMetadataSnapshot,
					databases: params.startupMaintenance.startupSessionDatabases,
					startupTrace: params.startupMaintenance.startupTrace,
					signal,
					log: params.log
				});
			});
		}
	});
	params.scheduler.schedule({
		id: "startup:maintenance",
		delayMs: params.delayMs,
		run: () => {
			if (params.isClosing()) return;
			return runWithGatewayIndependentRootWorkAdmission(async () => {
				await params.waitForPostReadyWork();
				if (params.isClosing()) return;
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
			}, "runtime:maintenance", params.signal).catch((err) => {
				if (!(params.signal.aborted && (err === params.signal.reason || err instanceof Error && err.cause === params.signal.reason))) params.log.warn(`gateway post-ready maintenance deferred task failed: ${String(err)}`);
			});
		}
	});
}
const RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS = 5e3;
function startPendingOutboundDeliveryRecovery(params) {
	const recoveryContext = captureDeliveryQueueStateContext();
	const scheduler = params.scheduler.scope();
	const { signal } = scheduler;
	let initialPass = true;
	let pending = false;
	let inFlight = null;
	let stopPromise = null;
	let logRecovery;
	const recover = () => {
		if (signal.aborted || inFlight) return;
		pending = false;
		const settled = runWithGatewayIndependentRootWorkAdmission(async () => {
			if (signal.aborted) return;
			const { drainPendingDeliveriesCore, recoverPendingDeliveries } = await import("./delivery-queue-recovery-Cl6qoECF.mjs");
			const { deliverOutboundPayloadsInternal } = await import("./deliver-B87hoYRp.mjs");
			if (signal.aborted) return;
			const deliver = (deliveryParams, stateContext) => {
				const completion = deliveryParams.deliveryCompletion;
				const attemptAuthority = completion?.kind === "conversation" ? completion : deliveryParams.conversationDeliveryAttemptAuthority;
				if (!attemptAuthority) return deliverOutboundPayloadsInternal(deliveryParams, stateContext);
				return deliverOutboundPayloadsInternal({
					...deliveryParams,
					withDirectAdapterHandoff: (initiate) => withAuthorizedQueuedConversationDelivery({
						readCurrentConfig: readRuntimeConfig,
						operationId: attemptAuthority.operationId,
						routeFingerprint: attemptAuthority.routeFingerprint ?? ""
					}, {
						agentId: attemptAuthority.agentId,
						...attemptAuthority.storePath ? { storePath: attemptAuthority.storePath } : {},
						env: resolveDeliveryQueueStateEnv(deliveryParams.deliveryQueueStateDir, stateContext)
					}, initiate)
				}, stateContext);
			};
			const recoveryLog = logRecovery ??= params.log.child("delivery-recovery");
			const options = {
				deliver,
				log: recoveryLog,
				cfg: initialPass ? params.cfg : readRuntimeConfig(),
				shouldContinue: () => !signal.aborted,
				onPending: schedule
			};
			if (initialPass) {
				initialPass = false;
				const { countPendingDeliveryQueueEntries } = await import("./delivery-queue-sqlite-BrRQ6L7X.mjs");
				const { LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME } = await import("./delivery-queue-namespaces-BXCTR05e.mjs");
				const diagnoseLegacy = async () => {
					const remaining = await countPendingDeliveryQueueEntries([
						LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
						OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
						OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
					], void 0, recoveryContext);
					if (!signal.aborted && remaining > 0) recoveryLog.warn(`${remaining} legacy outbound deliveries need repair. Stop the Gateway and run openclaw doctor --fix.`);
				};
				const settled = await Promise.allSettled([diagnoseLegacy(), recoverPendingDeliveries(options, deliver, recoveryContext)]);
				for (const result of settled) if (result.status === "rejected") {
					schedule();
					params.log.error(`Delivery recovery failed: ${String(result.reason)}`);
				}
				return;
			}
			await drainPendingDeliveriesCore({
				...options,
				drainKey: "gateway:outbound",
				logLabel: "Outbound delivery retry",
				selectEntry: () => ({
					match: true,
					bypassBackoff: false
				})
			}, deliver, recoveryContext);
		}, "runtime:delivery-recovery").catch((err) => {
			pending = true;
			params.log.error(`Delivery recovery failed: ${String(err)}`);
		}).finally(() => {
			inFlight = null;
			if (pending) schedule();
		});
		inFlight = settled;
		return settled;
	};
	const schedule = () => {
		pending = true;
		if (!inFlight) scheduler.schedule({
			id: "delivery:outbound-recovery",
			delayMs: computeBackoffMs(1),
			mode: "earliest",
			run: () => isGatewayWorkAdmissionClosed() ? schedule() : recover()
		});
	};
	const unsubscribe = onOutboundDeliveryEnqueued((stateDir) => {
		if (stateDir === recoveryContext.stateDir) runInDetachedAsyncContext(schedule);
	});
	isGatewayWorkAdmissionClosed() ? schedule() : recover();
	return () => {
		if (stopPromise) return stopPromise;
		unsubscribe();
		const scheduled = scheduler.stop();
		const recovery = inFlight;
		if (!recovery) return stopPromise = scheduled;
		const stillPendingTimer = setTimeout(() => {
			(logRecovery ??= params.log.child("delivery-recovery")).warn(`delivery recovery is still pending after ${RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS}ms; waiting before runtime teardown`);
		}, RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS);
		stillPendingTimer.unref?.();
		stopPromise = Promise.all([scheduled, recovery]).then(() => {}).finally(() => {
			clearTimeout(stillPendingTimer);
		});
		return stopPromise;
	};
}
function startPendingSessionDeliveryRuntime(params) {
	const queueContext = captureOpenClawStateWorkerContext();
	const scheduler = params.scheduler.scope();
	const { signal } = scheduler;
	const runDelivery = createScheduledGatewayRunner(fenceScheduledGatewayContextResolver(params.resolveGatewayContext));
	let stopPromise;
	let stopRuntime;
	scheduler.schedule({
		id: "delivery:session-recovery",
		delayMs: 1250,
		run: () => runWithGatewayIndependentRootWorkAdmission(async () => {
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, settleQueuedSessionDelivery } = await import("./server-restart-sentinel-BXH137cy.mjs");
			if (signal.aborted) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				scheduler: params.scheduler,
				queueContext,
				deliver: (entry, { queueContext: deliveryContext }) => runDelivery(() => deliverQueuedSessionDelivery({
					deps: params.deps,
					entry,
					queueContext: deliveryContext,
					resolveGatewayContext: params.resolveGatewayContext
				})),
				log: logRecovery,
				onSettled: settleQueuedSessionDelivery
			});
			try {
				await runDelivery(() => recoverPendingRestartContinuationDeliveries({
					deps: params.deps,
					queueContext,
					log: logRecovery,
					maxEnqueuedAt: params.maxEnqueuedAt,
					resolveGatewayContext: params.resolveGatewayContext
				}));
			} finally {
				if (!signal.aborted) await schedulePendingSessionDeliveries();
			}
		}, "runtime:session-delivery-recovery", signal).catch((err) => {
			if (!(signal.aborted && (err === signal.reason || err instanceof Error && err.cause === signal.reason))) params.log.error(`Session delivery recovery failed: ${String(err)}`);
		})
	});
	return () => {
		stopPromise ??= Promise.all([scheduler.stop(), stopRuntime?.()]).then(() => {});
		return stopPromise;
	};
}
/** Activates background gateway services after core runtime startup is ready. */
function activateGatewayScheduledServices(params) {
	if (params.minimalTestGateway) return {
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopDeliveryRecovery: async () => {}
	};
	const { scheduler } = params;
	if (!params.cronEnabled && resolveHeartbeatAgents(params.cfgAtStart).some((agent) => Boolean(resolveHeartbeatIntervalMs(params.cfgAtStart, void 0, agent.heartbeat)))) params.log.child("heartbeat").warn("scheduled heartbeats are disabled because the cron scheduler is disabled; enable cron and restart the gateway");
	const heartbeatGatewayContextResolver = fenceScheduledGatewayContextResolver(params.resolveGatewayContext);
	const runScheduledHeartbeat = createScheduledGatewayRunner(heartbeatGatewayContextResolver);
	let heartbeatStopped = false;
	const heartbeatRunner = startHeartbeatRunner({
		cfg: params.cfgAtStart,
		readCurrentConfig: readRuntimeConfig,
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
	const sessionUpstreamMonitor = startSessionUpstreamMonitor({ scheduler });
	const stopSessionDeliveryRuntime = startPendingSessionDeliveryRuntime({
		scheduler,
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
	});
	const stopOutboundDeliveryRecovery = startPendingOutboundDeliveryRecovery({
		scheduler,
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
