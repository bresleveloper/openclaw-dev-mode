import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, f as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { l as getSessionEventWakeAbortSignal } from "./heartbeat-wake-ba6LAy2M.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { i as readRecentUserAssistantTextForSession } from "./transcript-CEhnMlD1.mjs";
import { d as recordSessionHumanDirectMessage, p as recordSessionStateEventAsync } from "./session-state-events-B7wdeeGU.mjs";
import { n as listWatchedSessionUpstreamLinks } from "./session-upstream-links-BUvTYp9x.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-BErx7xDZ.mjs";
import { t as computeBackoffMs } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import "./delivery-queue-sqlite-CZH3GILC.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-C8iJzbV2.mjs";
import { C as startSessionDeliveryRuntime, x as schedulePendingSessionDeliveries } from "./subagent-registry-helpers-mfWGRpKe.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config--CDRLwW6.mjs";
import "./embedded-agent-B_DdyEe2.mjs";
import { n as fenceScheduledGatewayContextResolver, t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-CxI8WTGy.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-DVR59qVq.mjs";
import { t as startHeartbeatRunner } from "./heartbeat-runner-scheduler-tVm1-BC2.mjs";
import { r as assertQueuedConversationDeliveryAttemptAuthorized } from "./conversation-route-ownership-nNlK5875.mjs";
import { n as clearGatewayMaintenanceHandles, t as createNoopHeartbeatRunner } from "./server-runtime-service-shared-DE-vorah.mjs";
import "./server-idle-task-CWJoOeL4.mjs";
import "./server-runtime-startup-services-CpSEgL6K.mjs";
import { createHash } from "node:crypto";
//#region src/sessions/session-upstream-links-runtime.ts
function isSessionUpstreamLinkCurrent(expected, options) {
	return executeOpenClawStateWorker(captureOpenClawStateWorkerContext(options), {
		type: "sessionUpstream.current",
		input: expected
	});
}
function settleSessionUpstreamLink(expected, settlement, options) {
	const context = captureOpenClawStateWorkerContext(options);
	const { assertCurrent, sessionEntryCurrent } = options;
	const input = structuredClone({
		expected,
		settlement,
		sessionEntryCurrentSource: sessionEntryCurrent?.source
	});
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "sessionUpstream.settle",
		input
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Upstream settlement requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent();
				assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
				grant();
			})
		})
	});
}
//#endregion
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
function assertMonitorCurrent(options) {
	options.signal?.throwIfAborted();
}
function isIdleSession(entry, options, expectedSessionId) {
	return Boolean(!options.signal?.aborted && entry?.sessionId && (expectedSessionId === void 0 || entry.sessionId === expectedSessionId) && !(options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId));
}
async function loadIdleProbeSession(probe, options) {
	assertMonitorCurrent(options);
	const scope = {
		sessionKey: probe.sessionKey,
		agentId: probe.agentId,
		clone: false,
		env: options.env
	};
	const loadEntry = options.loadEntry;
	const loaded = loadEntry ? {
		entry: loadEntry(scope),
		current: {
			kind: "native",
			assertSourceCurrent: () => assertMonitorCurrent(options),
			readCurrent: () => loadEntry(scope)
		}
	} : await withSessionEntryReadOnlyInWorker(scope, () => assertMonitorCurrent(options), async (read, owner) => {
		if (!read.ok) throw read.error;
		return {
			entry: read.value,
			current: captureSessionEntryCurrentRead(scope, owner)
		};
	});
	return loaded.entry && isIdleSession(loaded.entry, options) ? {
		...loaded,
		entry: loaded.entry
	} : void 0;
}
async function probeSessionIdle(session, options) {
	return isIdleSession(await session.current.readCurrent(), options, session.entry.sessionId);
}
function probeAdmission(session, options) {
	const assertEntry = (entry) => {
		if (!isIdleSession(entry, options, session.entry.sessionId)) throw new Error("Upstream observation lost its idle session owner");
	};
	return {
		assertCurrent: () => {
			assertMonitorCurrent(options);
			session.current.assertSourceCurrent();
			assertEntry(session.current.kind === "file" ? session.entry : session.current.readCurrent());
		},
		...session.current.source ? { sessionEntryCurrent: {
			source: session.current.source,
			assertCurrent: assertEntry
		} } : {}
	};
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
async function probeProvenanceUnchanged(probe, session, options) {
	if (!await probeSessionIdle(session, options)) return false;
	const current = await loadOwnRecentUserTexts(probe, session.entry, options);
	return await probeSessionIdle(session, options) && current.length === probe.ownRecentUserTexts.length && current.every((text, index) => text === probe.ownRecentUserTexts[index]);
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
				const session = await loadIdleProbeSession(probe, options);
				if (!session) continue;
				const ownRecentUserTexts = await loadOwnRecentUserTexts(probe, session.entry, options);
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
					const admission = probeAdmission(session, options);
					const missingCountKey = upstreamMonitorLinkKey(probe);
					if (outcome.kind === "missing") {
						if (!await isSessionUpstreamLinkCurrent(currentLink, dbOptions)) {
							missingCounts.delete(missingCountKey);
							continue;
						}
						const currentSession = await session.current.readCurrent();
						if (!currentSession || currentSession.sessionId !== session.entry.sessionId) {
							missingCounts.delete(missingCountKey);
							continue;
						}
						if (!isIdleSession(currentSession, options, session.entry.sessionId)) continue;
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
					try {
						if (!await probeProvenanceUnchanged(probe, session, options)) continue;
					} catch (error) {
						log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
						continue;
					}
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
			log.warn(`upstream activity probe failed for ${catalogId}: ${String(error)}`);
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
const loadHeartbeatExecution = createLazyRuntimeModule(() => import("./heartbeat-runner-run-QPxQxkQ6.mjs"));
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
	params.scheduler.schedule({
		id: "startup:maintenance",
		delayMs: params.delayMs,
		run: () => {
			if (params.isClosing()) return;
			return runWithGatewayIndependentRootWorkAdmission(async () => {
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
	let inFlight = null;
	let stopPromise = null;
	let logRecovery;
	const recover = () => {
		if (signal.aborted || inFlight || isGatewayWorkAdmissionClosed()) return;
		const settled = runWithGatewayIndependentRootWorkAdmission(async () => {
			if (signal.aborted) return;
			const { drainPendingDeliveriesCore, recoverPendingDeliveries } = await import("./delivery-queue-recovery-whl7o2zM.mjs");
			const { deliverOutboundPayloadsInternal } = await import("./deliver-1V_qx-NW.mjs");
			if (signal.aborted) return;
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
				const { countPendingDeliveryQueueEntries } = await import("./delivery-queue-sqlite-DZjTWBGN.mjs");
				const { LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME } = await import("./delivery-queue-namespaces-DmPtWtv9.mjs");
				const remaining = countPendingDeliveryQueueEntries([
					LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
					OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
					OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
				], void 0, recoveryContext);
				if (remaining > 0) logRecovery.warn(`${remaining} legacy outbound deliveries need repair. Stop the Gateway and run openclaw doctor --fix.`);
				await recoverPendingDeliveries({
					deliver: deliverWithCurrentConversationAuthority,
					log: logRecovery,
					cfg,
					shouldContinue: () => !signal.aborted
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
				shouldContinue: () => !signal.aborted
			}, deliverWithCurrentConversationAuthority, recoveryContext);
		}, "runtime:delivery-recovery").catch((err) => params.log.error(`Delivery recovery failed: ${String(err)}`)).finally(() => {
			if (inFlight === settled) inFlight = null;
		});
		inFlight = settled;
		return settled;
	};
	scheduler.schedule({
		id: "delivery:outbound-recovery",
		delayMs: computeBackoffMs(1),
		everyMs: computeBackoffMs(1),
		run: recover
	});
	recover();
	return () => {
		if (stopPromise) return stopPromise;
		const scheduled = scheduler.stop();
		const recovery = inFlight;
		if (!recovery) {
			stopPromise = scheduled;
			return stopPromise;
		}
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
	let stopPromise;
	let stopRuntime;
	scheduler.schedule({
		id: "delivery:session-recovery",
		delayMs: 1250,
		run: () => runWithGatewayIndependentRootWorkAdmission(async () => {
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, settleQueuedSessionDelivery } = await import("./server-restart-sentinel-BqF_KIyI.mjs");
			if (signal.aborted) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				scheduler: params.scheduler,
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
