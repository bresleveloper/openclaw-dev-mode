import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runOutsideAsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { M as PluginInstanceUnavailableError } from "./plugin-cache-BbahpD-b.mjs";
import { d as sleepWithAbort, o as racePromiseWithAbortSignal, t as RetrySupervisor } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as withPluginRuntimeGatewayContextResolver, d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { d as runPluginCleanup, n as getPluginInstance, o as getPluginValueInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { o as listLoadedChannelPluginsForRegistry, r as getLoadedChannelPluginEntryById } from "./registry-loaded-B-WQB-l0.mjs";
import { S as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { _ as setActiveCredentialDegradedOwner, o as clearActiveCredentialDegradedOwner, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { i as withPluginHttpRouteRegistry, n as createPluginHttpRouteHandoff } from "./http-registry-eGHR5upq.mjs";
import { m as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-CCVkYF8m.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as withPluginServiceScheduler } from "./service-scheduler-binding-BGIyG3K0.mjs";
import { r as runOutsidePluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { n as describeChannelAccount, r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
import { i as resolveChannelHealthMonitorEnabled } from "./channel-health-policy-cv1tBUoD.mjs";
import { r as resetDirectoryCache } from "./target-resolver-c-W9fpkt.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { n as withGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-BiXoDu0U.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { n as getCredentialUnavailableDiagnostics } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { t as isChannelAccountExplicitlyDisabled } from "./account-config-enabled-Ck6QSq-W.mjs";
import { a as resolveUnavailableChannelAccountSnapshot, i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-0YA3UWGA.mjs";
import { n as buildChannelAccountSnapshotFromRuntime, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-DHgRbD3b.mjs";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-CHOY5_FT.mjs";
import { r as isExecApprovalChannelRuntimeTerminalStartError } from "./approval-native-runtime-CqkZYXOG.mjs";
import { n as createChannelApprovalHandlerFromCapability } from "./approval-handler-runtime-CkaFt78O.mjs";
import { i as watchChannelRuntimeContexts, n as getChannelRuntimeContext, r as registerChannelRuntimeContext, t as createTaskScopedChannelRuntime } from "./channel-runtime-context-B5obVth5.mjs";
import { r as channelStartFailurePatch, s as sanitizeAbortedTaskStatusPatch } from "./channel-status-patches-B5E4Vlav.mjs";
import { n as formatGatewayCrashLoopManualChannelStartHint } from "./gateway-boot-lifecycle-B_E2PbYI.mjs";
import { n as createPluginServiceSchedulerRunner, r as createPluginRuntimeCapabilityLease, t as createPluginServiceScheduler } from "./service-scheduler-Bofi9JCx.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/approval-handler-bootstrap.ts
const APPROVAL_HANDLER_BOOTSTRAP_RETRY_MS = 1e3;
function isRetryableApprovalBootstrapStartError(error) {
	const message = String(error);
	return message.includes("gateway readiness unavailable before approval client start") || message.includes("gateway approval client start aborted before readiness") || message.includes("gateway readiness unavailable before exec approval runtime start") || message.includes("gateway approval runtime start aborted before readiness") || message.includes("gateway event loop readiness timeout") || message.includes("gateway starting") || message.includes("code=1013") || message.includes("close code 1013");
}
function formatRetryableApprovalBootstrapStartError(error) {
	const message = String(error);
	if (message.includes("gateway event loop readiness timeout")) return "gateway readiness unavailable before approval handler start";
	return message;
}
/** Starts the native approval handler for a channel runtime context and returns its cleanup hook. */
async function startChannelApprovalHandlerBootstrap(params) {
	const capability = resolveChannelApprovalCapability(params.plugin);
	if (!(capability?.nativeRuntimeAsync ?? capability?.nativeRuntime) || !params.channelRuntime) return async () => {};
	const channelLabel = params.plugin.meta.label || params.plugin.id;
	const logger = params.logger ?? createSubsystemLogger(`${params.plugin.id}/approval-bootstrap`);
	const retryId = `approval-bootstrap/${params.plugin.id}/${params.accountId}/${randomUUID()}`;
	let activeGeneration = 0;
	let activeHandler = null;
	let retryJob;
	const invalidateActiveHandler = () => {
		retryJob?.cancel();
		retryJob = void 0;
		activeGeneration += 1;
	};
	const stopHandler = async () => {
		const handler = activeHandler;
		activeHandler = null;
		if (!handler) return;
		await handler.stop();
	};
	const startHandlerForContext = async (context, generation) => {
		if (generation !== activeGeneration) return;
		await stopHandler();
		if (generation !== activeGeneration) return;
		const handler = await withGatewayNativeApprovalRuntime(params.gatewayRuntime, () => createChannelApprovalHandlerFromCapability({
			capability,
			label: `${params.plugin.id}/native-approvals`,
			clientDisplayName: `${channelLabel} Native Approvals (${params.accountId})`,
			channel: params.plugin.id,
			channelLabel,
			cfg: params.cfg,
			accountId: params.accountId,
			context
		}));
		if (!handler) return;
		if (generation !== activeGeneration) {
			await handler.stop().catch(() => {});
			return;
		}
		activeHandler = handler;
		try {
			await withGatewayNativeApprovalRuntime(params.gatewayRuntime, () => handler.start());
		} catch (error) {
			if (activeHandler === handler) activeHandler = null;
			await handler.stop().catch(() => {});
			throw error;
		}
	};
	const spawn = (label, promise) => {
		promise.catch((error) => {
			logger.error(`${label}: ${String(error)}`);
		});
	};
	const scheduleRetryForContext = (context, generation) => {
		if (generation !== activeGeneration) return;
		retryJob = params.scheduler.schedule({
			id: retryId,
			delayMs: APPROVAL_HANDLER_BOOTSTRAP_RETRY_MS,
			run: () => startHandlerForRegisteredContext(context, generation)
		});
	};
	const startHandlerForRegisteredContext = async (context, generation) => {
		try {
			await startHandlerForContext(context, generation);
		} catch (error) {
			if (generation === activeGeneration) {
				if (isExecApprovalChannelRuntimeTerminalStartError(error)) {
					logger.error(`native approval handler disabled: ${String(error)}`);
					return;
				}
				if (isRetryableApprovalBootstrapStartError(error)) logger.warn(`native approval handler deferred until gateway readiness recovers: ${formatRetryableApprovalBootstrapStartError(error)}`);
				else logger.error(`failed to start native approval handler: ${String(error)}`);
				scheduleRetryForContext(context, generation);
			}
		}
	};
	const startForContext = (context) => {
		invalidateActiveHandler();
		spawn("failed to start native approval handler", startHandlerForRegisteredContext(context, activeGeneration));
	};
	const unsubscribe = watchChannelRuntimeContexts({
		channelRuntime: params.channelRuntime,
		channelId: params.plugin.id,
		accountId: params.accountId,
		capability: "approval.native",
		onEvent: (event) => {
			if (event.type === "registered") {
				startForContext(event.context);
				return;
			}
			invalidateActiveHandler();
			spawn("failed to stop native approval handler", stopHandler());
		}
	}) ?? (() => {});
	const existingContext = getChannelRuntimeContext({
		channelRuntime: params.channelRuntime,
		channelId: params.plugin.id,
		accountId: params.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY
	});
	if (existingContext !== void 0) startForContext(existingContext);
	return async () => {
		unsubscribe();
		invalidateActiveHandler();
		await stopHandler();
	};
}
//#endregion
//#region src/gateway/channel-stop-timeout.ts
async function waitForChannelStopGracefully(task, timeoutMs) {
	if (!task) return true;
	return await settlesWithin(task.catch(() => void 0), timeoutMs);
}
//#endregion
//#region src/gateway/server-channel-account-lifetime.ts
function createChannelAccountLifetime(plugin, registry, rootScheduler) {
	const abort = new AbortController();
	const capabilityLease = createPluginRuntimeCapabilityLease("channel account");
	const instance = getPluginValueInstance(plugin);
	const { scheduler } = createPluginServiceScheduler(rootScheduler, createPluginServiceSchedulerRunner({
		registry,
		record: instance?.owner?.record,
		instance,
		lease: capabilityLease
	}));
	abort.signal.addEventListener("abort", scheduler.beginClose, { once: true });
	return {
		plugin,
		abort,
		capabilityLease,
		scheduler
	};
}
async function runChannelAccountStop(params) {
	try {
		await withPluginHttpRouteRegistry(params.registry, async () => {
			let teardown = params.teardown;
			if (params.fallback) {
				const { plugin, gateway, stopAccount, cfg, accountId } = params.fallback;
				const account = await runPluginCleanup(plugin, () => resolveChannelAccount({
					plugin,
					cfg,
					accountId
				}));
				params.lease.assertActive("account resolution");
				const { scheduler } = createPluginServiceScheduler(params.rootScheduler);
				await scheduler.stop();
				teardown = {
					context: params.createFallbackContext(account, scheduler),
					run: (context) => runPluginCleanup(stopAccount, () => stopAccount.call(gateway, context))
				};
			}
			if (!teardown) return;
			const { context, run } = teardown;
			const cleanup = Promise.resolve().then(() => {
				params.lease.assertActive("account cleanup");
				params.onCleanupStarted();
				return withPluginServiceScheduler(context.scheduler, () => run({
					...context,
					setStatus: params.setStatus
				}));
			});
			const scheduled = context.scheduler.stop();
			try {
				await cleanup;
			} finally {
				await scheduled;
			}
		}, params.lease);
		return { status: "fulfilled" };
	} catch (error) {
		params.onError(error);
		return {
			status: "rejected",
			error
		};
	}
}
//#endregion
//#region src/gateway/server-channel-autostart-recovery.ts
function createChannelAutostartRecovery(params) {
	let recovery;
	return (signal) => {
		params.signal.throwIfAborted();
		signal?.throwIfAborted();
		if (params.isClosing?.()) throw new Error("Gateway crash-loop recovery is closing");
		if (recovery) return racePromiseWithAbortSignal(recovery, signal);
		const suppression = params.getSuppression();
		if (!suppression) return;
		recovery = (async () => {
			if (!params.tryRecover) throw new Error("Gateway crash-loop recovery has no boot owner");
			const pausedUntilMs = await params.tryRecover(params.signal);
			params.signal.throwIfAborted();
			if (params.isClosing?.() || params.getSuppression() !== suppression) throw new Error("Gateway crash-loop recovery owner changed");
			if (pausedUntilMs !== void 0) return pausedUntilMs;
			params.clearSuppression();
			if (!isChannelStartupSuppressedByEnvironment()) await params.startChannels();
		})().finally(() => {
			recovery = void 0;
		});
		return racePromiseWithAbortSignal(recovery, signal);
	};
}
//#endregion
//#region src/gateway/server-channel-start-fence.ts
/** A settled failure retains diagnostic facts without retaining a reload pause. */
function pauseChannelStarts(channelIds, getStore, captureSnapshot) {
	const reservations = [...new Set(channelIds)].map((channelId) => {
		const store = getStore(channelId);
		const previous = store.startFence;
		return {
			channelId,
			store,
			previous,
			fence: {
				state: "paused",
				snapshot: previous && previous.state !== "published" ? previous.snapshot : captureSnapshot(channelId)
			}
		};
	});
	for (const { store, fence } of reservations) store.startFence = fence;
	return (outcome, selected) => {
		for (const { channelId, store, previous, fence } of reservations) {
			if (selected && !selected.has(channelId)) continue;
			if (outcome !== "rollback") fence.state = outcome;
			else store.startFence = previous;
		}
	};
}
//#endregion
//#region src/gateway/server-channel-startup.ts
/** Channel tasks outlive their caller's authority, work scope, lease, and generation. */
function runChannelAccountStartup(start) {
	return withoutGatewayToolCallerIdentity(() => runOutsideOperatorToolGatewayAuthority(() => runOutsidePluginLifecycleLease(() => runOutsideGatewayRootWorkAdmission(() => runOutsidePluginRuntimeGenerationScope(() => runOutsideAsyncWorkScope(start))))));
}
function waitForChannelStartupHandoff() {
	return new Promise((resolve) => {
		setImmediate(resolve).unref?.();
	});
}
async function runChannelAccountMonitor(registry, pluginId, start) {
	const record = registry.plugins.find((entry) => entry.id === pluginId);
	const instance = record && getPluginInstance(record);
	if (instance && !instance.acceptingCalls) throw new PluginInstanceUnavailableError(instance.pluginId);
	const consumer = instance?.retainConsumer(void 0, void 0, "custody");
	try {
		return await (consumer ? consumer.run(start) : start());
	} finally {
		consumer?.release();
	}
}
async function waitForDeferredAccountStart(deferred, abortSignal) {
	if (abortSignal.aborted) return;
	const aborted = createDeferredCore();
	const onAbort = () => aborted.resolve();
	abortSignal.addEventListener("abort", onAbort, { once: true });
	try {
		await Promise.race([deferred, aborted.promise]);
	} finally {
		abortSignal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/gateway/server-channels.ts
const RESTART_POLICY = {
	initialMs: 5e3,
	maxMs: 3e5,
	factor: 2,
	jitter: .1
};
const MAX_RESTARTS = 10;
const CHANNEL_STABLE_RUN_MS = RESTART_POLICY.maxMs;
const CHANNEL_STOP_ABORT_TIMEOUT_MS = 5e3;
const CHANNEL_STARTUP_CONCURRENCY = 4;
const CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY = "approval.gateway";
function createChannelManager(opts) {
	const { getRuntimeConfig, channelLogs, channelRuntimeEnvs, channelRuntime, resolveChannelRuntime, getPluginRegistry, startupTrace } = opts;
	const withRegistry = (run) => {
		const registry = getPluginRegistry();
		return withPluginRuntimeRegistryScope(registry, () => run(registry));
	};
	const getChannelPlugin = (channelId) => getLoadedChannelPluginEntryById(channelId, getPluginRegistry())?.plugin;
	const channelStores = /* @__PURE__ */ new Map();
	const restarts = /* @__PURE__ */ new Map();
	const manuallyStopped = /* @__PURE__ */ new Set();
	const recoveryStopTimedOut = /* @__PURE__ */ new Set();
	const recoveryStartRequested = /* @__PURE__ */ new Set();
	const pendingAutoRestarts = /* @__PURE__ */ new Set();
	const clearRecoveryState = (key) => {
		recoveryStopTimedOut.delete(key);
		recoveryStartRequested.delete(key);
	};
	let autostartSuppression = null;
	let ambientAutostartSuppressedChannelIds = new Set(opts.ambientAutostartSuppressedChannelIds ?? []);
	const restartKey = (channelId, accountId) => `${channelId}:${accountId}`;
	const releaseRouteHandoff = (store, accountId, expected = store.routeHandoffs.get(accountId)) => {
		if (expected && store.routeHandoffs.get(accountId) === expected) {
			expected.release();
			store.routeHandoffs.delete(accountId);
		}
	};
	const releaseChannelRouteHandoffs = (channelId, accountId) => {
		const store = getStore(channelId);
		for (const id of accountId ? [accountId] : store.routeHandoffs.keys()) if (!store.tasks.has(id) || store.lifetimes.get(id)?.abort.signal.aborted !== false) releaseRouteHandoff(store, id);
	};
	const ensureChannelLog = (channelId) => {
		channelLogs[channelId] ??= createSubsystemLogger("channels").child(channelId);
		return channelLogs[channelId];
	};
	const ensureChannelRuntime = (channelId) => {
		channelRuntimeEnvs[channelId] ??= runtimeForLogger(ensureChannelLog(channelId));
		return channelRuntimeEnvs[channelId];
	};
	const getStore = (channelId) => {
		const existing = channelStores.get(channelId);
		if (existing) return existing;
		const next = {
			lifetimes: /* @__PURE__ */ new Map(),
			routeHandoffs: /* @__PURE__ */ new Map(),
			starting: /* @__PURE__ */ new Map(),
			stops: /* @__PURE__ */ new Map(),
			tasks: /* @__PURE__ */ new Map(),
			runtimes: /* @__PURE__ */ new Map()
		};
		channelStores.set(channelId, next);
		return next;
	};
	const getRuntime = (channelId, accountId) => {
		return getStore(channelId).runtimes.get(accountId) ?? {
			...getChannelPlugin(channelId)?.status?.defaultRuntime,
			accountId
		};
	};
	const setRuntime = (channelId, accountId, patch) => {
		const store = getStore(channelId);
		const current = getRuntime(channelId, accountId);
		const hasExplicitReadyRecovery = Object.hasOwn(patch, "lifecycle") && patch.lifecycle === "ready" && Object.hasOwn(patch, "terminalDisconnect") && patch.terminalDisconnect === void 0;
		const lifecycle = current.lifecycle === "blocked" && current.terminalDisconnect === true && patch.lifecycle !== "starting" && !hasExplicitReadyRecovery ? "blocked" : patch.lifecycle ?? (patch.restartPending === true ? "recovering" : patch.connected === true ? "ready" : void 0);
		const next = {
			...current,
			...patch,
			...lifecycle ? { lifecycle } : {},
			accountId
		};
		store.runtimes.set(accountId, next);
		return next;
	};
	const setRuntimeFromTaskStatus = (channelId, accountId, patch, abortSignal) => {
		const safePatch = abortSignal.aborted ? sanitizeAbortedTaskStatusPatch(patch, getRuntime(channelId, accountId)) : patch;
		const next = setRuntime(channelId, accountId, safePatch);
		if (!abortSignal.aborted && (next.lifecycle === "ready" || patch.terminalDisconnect === true)) releaseRouteHandoff(getStore(channelId), accountId);
		return next;
	};
	const setStoppedRuntime = (channelId, accountId, patch = {}) => {
		const current = getRuntime(channelId, accountId);
		return setRuntime(channelId, accountId, {
			running: false,
			lifecycle: patch.restartPending === true ? "recovering" : "stopped",
			...typeof current.connected === "boolean" ? { connected: false } : {},
			...patch
		});
	};
	const createAccountContext = (channelId, accountId, cfg, account, abortSignal, scheduler) => ({
		cfg,
		accountId,
		account,
		abortSignal,
		scheduler,
		runtime: ensureChannelRuntime(channelId),
		log: ensureChannelLog(channelId),
		getStatus: () => getRuntime(channelId, accountId)
	});
	const measureStartup = async (name, run) => {
		return startupTrace ? startupTrace.measure(name, run) : await run();
	};
	const evictStaleChannelAccountState = (channelId, store, accountIds) => {
		const activeAccountIds = new Set(accountIds);
		for (const id of store.routeHandoffs.keys()) if (!activeAccountIds.has(id)) releaseRouteHandoff(store, id);
		for (const id of store.runtimes.keys()) {
			if (activeAccountIds.has(id) || store.lifetimes.has(id) || store.starting.has(id) || store.stops.has(id) || store.tasks.has(id)) continue;
			store.runtimes.delete(id);
			clearActiveCredentialDegradedOwner("account", restartKey(channelId, normalizeAccountId(id)));
			const key = restartKey(channelId, id);
			restarts.delete(key);
			manuallyStopped.delete(key);
			recoveryStartRequested.delete(key);
		}
	};
	const pruneInactiveChannelAccountState = (activeChannelIds) => {
		for (const [channelId, store] of channelStores) if (!activeChannelIds.has(channelId)) evictStaleChannelAccountState(channelId, store, []);
	};
	const startChannelProcessOwned = async (registry, channelId, accountId, optsValue = {}) => {
		const store = getStore(channelId);
		const registration = getLoadedChannelPluginEntryById(channelId, registry);
		const assertStartCurrent = () => {
			if (store.startFence?.state === "paused" || getLoadedChannelPluginEntryById(channelId, getPluginRegistry())?.plugin !== registration?.plugin) throw new Error("Channel plugins are reloading; retry the start after reload completes.");
		};
		assertStartCurrent();
		const plugin = registration?.plugin;
		const startAccount = plugin?.gateway?.startAccount;
		if (!startAccount) {
			for (const id of accountId ? [accountId] : store.routeHandoffs.keys()) releaseRouteHandoff(store, id);
			return accountId ? /* @__PURE__ */ new Map([[accountId, {
				status: "skipped",
				reason: "unsupported"
			}]]) : /* @__PURE__ */ new Map();
		}
		const { preserveRestartAttempts = false, preserveManualStop = false } = optsValue;
		const cfg = getRuntimeConfig();
		resetDirectoryCache({
			cfg,
			channel: channelId,
			accountId
		});
		const accountIds = accountId ? [accountId] : await measureStartup(`channels.${channelId}.list-accounts`, () => plugin.config.listAccountIds(cfg));
		assertStartCurrent();
		if (!accountId) evictStaleChannelAccountState(channelId, store, accountIds);
		if (accountIds.length === 0) return /* @__PURE__ */ new Map();
		const suppression = optsValue.manual === true ? null : autostartSuppression;
		const ambientSuppressed = optsValue.manual !== true && ambientAutostartSuppressedChannelIds.has(channelId);
		if (suppression || ambientSuppressed) {
			if (suppression) {
				const suffix = accountId ? ` account ${accountId}` : "";
				ensureChannelLog(channelId).warn?.(`channel autostart suppressed by crash-loop breaker; refusing automatic start for ${channelId}${suffix}. ${formatGatewayCrashLoopManualChannelStartHint({
					channelId,
					...accountId ? { accountId } : {}
				})}`);
			}
			for (const id of accountIds) {
				releaseRouteHandoff(store, id);
				setStoppedRuntime(channelId, id, {
					restartPending: false,
					lastError: suppression?.message ?? "ambient channel credentials suppressed; configure the channel or start the gateway with --ambient-channels"
				});
			}
			return new Map(accountIds.map((id) => [id, {
				status: "skipped",
				reason: suppression ? "autostart-suppressed" : "ambient-suppressed"
			}]));
		}
		const startOutcomes = /* @__PURE__ */ new Map();
		const startup = await runTasksWithConcurrency({
			limit: CHANNEL_STARTUP_CONCURRENCY,
			tasks: accountIds.map((id) => async () => {
				const rKey = restartKey(channelId, id);
				const setRestartState = (restartPending, reconnectAttempts = 0) => setRuntime(channelId, id, {
					restartPending,
					reconnectAttempts
				});
				const explicitlyDisabled = isChannelAccountExplicitlyDisabled({
					cfg,
					channel: channelId,
					accountId: id
				});
				if (explicitlyDisabled) releaseRouteHandoff(store, id);
				if (!preserveManualStop && !store.stops.has(id)) manuallyStopped.delete(rKey);
				for (;;) {
					if (store.stops.has(id)) {
						startOutcomes.set(id, {
							status: "retry",
							reason: "stop-in-flight"
						});
						return;
					}
					if (store.tasks.has(id)) {
						const timedOutRecovery = recoveryStopTimedOut.has(rKey);
						if (timedOutRecovery && manuallyStopped.has(rKey)) {
							startOutcomes.set(id, {
								status: "skipped",
								reason: "manual-stop"
							});
							return;
						}
						if (!timedOutRecovery || !recoveryStartRequested.has(rKey) && optsValue.manual !== true) {
							if (timedOutRecovery) {
								recoveryStartRequested.add(rKey);
								setRuntime(channelId, id, { restartPending: true });
							}
							startOutcomes.set(id, {
								status: "retry",
								reason: "task-owned"
							});
							return;
						}
						clearRecoveryState(rKey);
						restarts.delete(rKey);
						store.lifetimes.get(id)?.capabilityLease.revoke();
						store.lifetimes.delete(id);
						store.tasks.delete(id);
						setRestartState(false);
					}
					const existingStart = store.starting.get(id);
					if (!existingStart) break;
					await existingStart;
				}
				const startGate = createDeferredCore();
				store.starting.set(id, startGate.promise);
				const routeHandoff = store.routeHandoffs.get(id);
				const lifetime = createChannelAccountLifetime(plugin, registry, opts.scheduler);
				const { abort, capabilityLease, scheduler } = lifetime;
				const startCancelled = () => abort.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.();
				store.lifetimes.set(id, lifetime);
				let handedOffTask = false;
				const log = ensureChannelLog(channelId);
				let scopedChannelRuntime = null;
				let stopApprovalBootstrap = async () => {};
				const cleanupTaskScopedApprovalRuntime = async (label) => {
					try {
						const scopedRuntime = scopedChannelRuntime;
						scopedChannelRuntime = null;
						const stopBootstrap = stopApprovalBootstrap;
						stopApprovalBootstrap = async () => {};
						scopedRuntime?.dispose();
						await stopBootstrap();
					} catch (error) {
						log.error?.(`[${id}] ${label}: ${formatErrorMessage(error)}`);
					}
				};
				const skipAccount = (reason, patch) => {
					setRuntime(channelId, id, {
						...patch,
						running: false,
						restartPending: false
					});
					startOutcomes.set(id, {
						status: "skipped",
						reason
					});
				};
				try {
					const secretOwnerId = `${channelId}:${normalizeAccountId(id)}`;
					clearActiveCredentialDegradedOwner("account", secretOwnerId);
					if (explicitlyDisabled && plugin.config.listAccountIds(cfg).some((listed) => normalizeAccountId(listed) === normalizeAccountId(id))) {
						skipAccount("disabled", { enabled: false });
						return;
					}
					try {
						assertSecretOwnerAvailable("account", secretOwnerId);
					} catch (error) {
						if (!optsValue.skipUnavailableAccounts) throw error;
						setStoppedRuntime(channelId, id, {
							restartPending: false,
							lastError: formatErrorMessage(error)
						});
						startOutcomes.set(id, {
							status: "skipped",
							reason: "secret-unavailable"
						});
						return;
					}
					const account = await resolveChannelAccount({
						plugin,
						cfg,
						accountId: id
					});
					capabilityLease.assertActive("startup");
					const accountContext = createAccountContext(channelId, id, cfg, account, abort.signal, scheduler);
					if (plugin.gateway?.stopAccount) {
						const stopAccount = plugin.gateway.stopAccount;
						const gateway = plugin.gateway;
						lifetime.teardown = {
							context: accountContext,
							run: (context) => runPluginCleanup(stopAccount, () => stopAccount.call(gateway, context))
						};
					}
					const described = await describeChannelAccount({
						plugin,
						account,
						cfg
					});
					assertStartCurrent();
					capabilityLease.assertActive("startup");
					if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) {
						skipAccount("disabled", { enabled: false });
						return;
					}
					const credentialDiagnostics = getCredentialUnavailableDiagnostics(account);
					if (credentialDiagnostics.length > 0) {
						setActiveCredentialDegradedOwner({
							ownerKind: "account",
							ownerId: secretOwnerId,
							state: "unavailable",
							paths: credentialDiagnostics.map((diagnostic) => diagnostic.path),
							refKeys: [],
							reason: "credential file is unavailable"
						});
						assertSecretOwnerAvailable("account", secretOwnerId);
					}
					let configured = true;
					if (plugin.config.isConfigured) configured = await measureStartup(`channels.${channelId}.is-configured`, () => plugin.config.isConfigured(account, cfg));
					capabilityLease.assertActive("startup");
					if (!configured) {
						skipAccount("unconfigured", {
							enabled: true,
							configured: false,
							linked: void 0
						});
						return;
					}
					setRuntime(channelId, id, {
						enabled: true,
						configured: true,
						...plugin.config.isLinked ? { linked: void 0 } : {}
					});
					const fallbackLinked = described?.linked ?? getRuntime(channelId, id).linked;
					const linkState = plugin.config.isLinked ? await measureStartup(`channels.${channelId}.is-linked`, () => plugin.config.isLinked(account, cfg)) : fallbackLinked === true ? "linked" : fallbackLinked === false ? "not-linked" : void 0;
					capabilityLease.assertActive("startup");
					if (linkState === "not-linked" || linkState === "unknown") {
						skipAccount("unlinked", {
							enabled: true,
							linked: linkState === "not-linked" ? false : void 0
						});
						return;
					}
					scopedChannelRuntime = await measureStartup(`channels.${channelId}.runtime`, async () => createTaskScopedChannelRuntime({ channelRuntime: registration?.resolveChannelRuntime?.() ?? channelRuntime ?? await resolveChannelRuntime?.() }));
					capabilityLease.assertActive("startup");
					const channelRuntimeForTask = scopedChannelRuntime.channelRuntime;
					if (!preserveRestartAttempts) restarts.delete(rKey);
					try {
						stopApprovalBootstrap = await measureStartup(`channels.${channelId}.approval-bootstrap`, () => startChannelApprovalHandlerBootstrap({
							scheduler: opts.scheduler,
							plugin,
							cfg,
							accountId: id,
							channelRuntime: channelRuntimeForTask,
							gatewayRuntime: opts.getNativeApprovalRuntime?.(),
							logger: log
						}));
					} catch (error) {
						log.error?.(`[${id}] native approval bootstrap failed: ${formatErrorMessage(error)}`);
					}
					assertStartCurrent();
					capabilityLease.assertActive("startup");
					if (startCancelled()) {
						startOutcomes.set(id, {
							status: "skipped",
							reason: "manual-stop"
						});
						return;
					}
					let channelRunDurationMs;
					setRuntime(channelId, id, {
						enabled: true,
						...linkState === "linked" ? { linked: true } : {},
						running: true,
						lifecycle: "starting",
						restartPending: false,
						lastStartAt: Date.now(),
						lastError: null,
						ingressUnavailable: void 0,
						terminalDisconnect: void 0,
						...getRuntime(channelId, id).healthState === "plugin-trust-refused" ? { healthState: void 0 } : {},
						reconnectAttempts: preserveRestartAttempts ? restarts.get(rKey)?.attempts ?? 0 : 0
					});
					const task = Promise.resolve().then(async () => {
						if (optsValue.deferAccountStartUntil) await waitForDeferredAccountStart(optsValue.deferAccountStartUntil, abort.signal);
						else if (startupTrace) await waitForChannelStartupHandoff();
						if (startCancelled()) return;
						const gatewayApprovalRuntime = opts.getNativeApprovalRuntime?.();
						if (channelRuntimeForTask && gatewayApprovalRuntime) registerChannelRuntimeContext({
							channelRuntime: channelRuntimeForTask,
							channelId,
							accountId: id,
							capability: CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY,
							context: { request: async (method, requestParams, requestOptions) => {
								if (method !== "approval.resolve") throw new Error(`channel approval runtime cannot dispatch ${method}`);
								return await gatewayApprovalRuntime.request("approval.resolve", requestParams, requestOptions);
							} },
							abortSignal: abort.signal
						});
						let startAccountTask;
						await measureStartup(`channels.${channelId}.start-account-handoff`, () => {
							if (startCancelled()) return;
							log.info(`[${id}] starting account (reason: ${optsValue.reason ?? (optsValue.manual ? "manual" : "requested")})`);
							const runStartAccount = async () => {
								const startedAt = Date.now();
								try {
									return await withGatewayNativeApprovalRuntime(opts.getNativeApprovalRuntime?.(), () => startAccount({
										...accountContext,
										setStatus: (next) => isCurrentTask() ? setRuntimeFromTaskStatus(channelId, id, next, abort.signal) : getRuntime(channelId, id),
										invalidateDirectoryCache: () => resetDirectoryCache({
											cfg,
											channel: channelId,
											accountId: id
										}),
										...channelRuntimeForTask ? { channelRuntime: channelRuntimeForTask } : {}
									}));
								} finally {
									channelRunDurationMs = Date.now() - startedAt;
								}
							};
							startAccountTask = withPluginHttpRouteRegistry(registry, () => withPluginServiceScheduler(accountContext.scheduler, () => runChannelAccountMonitor(registry, registration?.pluginId, runStartAccount)), capabilityLease);
						});
						if (!startAccountTask) return;
						await startAccountTask;
					});
					const settledTask = async () => {
						try {
							await task;
						} finally {
							try {
								await scheduler.stop();
							} finally {
								capabilityLease.revoke();
							}
						}
					};
					const trackedPromise = settledTask().then(() => {
						if (startCancelled() || !isCurrentTask()) return;
						if (getRuntime(channelId, id).terminalDisconnect) return;
						const message = "channel exited without an error";
						setRuntime(channelId, id, { lastError: message });
						log.error?.(`[${id}] ${message}`);
					}).catch((err) => {
						if (!isCurrentTask() || store.stops.has(id) || opts.isClosing?.()) return;
						const failure = channelStartFailurePatch(err);
						setRuntime(channelId, id, failure);
						log.error?.(`[${id}] channel exited: ${failure.lastError}`);
					}).then(async () => {
						await cleanupTaskScopedApprovalRuntime("channel cleanup failed");
						if (!isCurrentTask() || store.stops.has(id) || opts.isClosing?.()) return;
						setStoppedRuntime(channelId, id, { lastStopAt: Date.now() });
					}).then(async () => {
						if (!isCurrentTask() || store.stops.has(id) || opts.isClosing?.()) return;
						if (manuallyStopped.has(rKey)) {
							clearRecoveryState(rKey);
							return;
						}
						if (getRuntime(channelId, id).terminalDisconnect) {
							clearRecoveryState(rKey);
							restarts.delete(rKey);
							setRestartState(false);
							log.info?.(`[${id}] auto-restart skipped, terminal disconnect`);
							return;
						}
						if (recoveryStopTimedOut.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							if (!recoveryStartRequested.delete(rKey)) {
								setRestartState(false);
								releaseTask();
								return;
							}
							restarts.delete(rKey);
							log.info?.(`[${id}] restarting after timed-out channel stop completed`);
							setRestartState(true);
							releaseTask();
							try {
								await startChannelInternal(channelId, id, {
									reason: "stop-recovery",
									preserveManualStop: true
								});
							} catch {}
							return;
						}
						if (channelRunDurationMs !== void 0 && channelRunDurationMs >= CHANNEL_STABLE_RUN_MS) restarts.delete(rKey);
						const restart = restarts.get(rKey) ?? new RetrySupervisor(RESTART_POLICY, MAX_RESTARTS);
						restarts.set(rKey, restart);
						const retry = restart.next(opts.scheduler.signal);
						if (!retry) {
							setRestartState(false, restart.attempts);
							log.error?.(`[${id}] giving up after ${MAX_RESTARTS} restart attempts`);
							return;
						}
						log.info?.(`[${id}] auto-restart attempt ${restart.attempts}/${MAX_RESTARTS} in ${Math.round(retry.delayMs / 1e3)}s`);
						setRestartState(true, restart.attempts);
						pendingAutoRestarts.add(rKey);
						try {
							await sleepWithAbort(retry.delayMs, retry.signal);
							if (retry.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.()) return;
							releaseTask();
							await startChannelInternal(channelId, id, {
								reason: "auto-restart",
								preserveRestartAttempts: true,
								preserveManualStop: true
							});
						} catch (error) {
							if (!retry.signal.aborted) {
								const lastError = formatErrorMessage(error);
								log.error?.(`[${id}] auto-restart failed: ${lastError}`);
								if (isCurrentTask() && !store.stops.has(id)) setRuntime(channelId, id, { lastError });
							}
						} finally {
							if (isCurrentTask() && !store.stops.has(id)) setStoppedRuntime(channelId, id, {
								restartPending: false,
								reconnectAttempts: restart.attempts
							});
							pendingAutoRestarts.delete(rKey);
						}
					}).finally(() => {
						const ownsHandoff = store.lifetimes.get(id) === lifetime && !abort.signal.aborted;
						releaseTask();
						if (routeHandoff && ownsHandoff) releaseRouteHandoff(store, id, routeHandoff);
					});
					function releaseTask() {
						if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
						if (store.lifetimes.get(id) === lifetime && !store.stops.has(id)) store.lifetimes.delete(id);
						abort.abort();
					}
					function isCurrentTask() {
						return store.tasks.get(id) === trackedPromise;
					}
					handedOffTask = true;
					store.tasks.set(id, trackedPromise);
					startOutcomes.set(id, { status: "handed-off" });
				} catch (error) {
					if (!handedOffTask && capabilityLease.isActive()) setStoppedRuntime(channelId, id, {
						restartPending: false,
						lastError: formatErrorMessage(error)
					});
					throw error;
				} finally {
					if (!handedOffTask) {
						if (routeHandoff && capabilityLease.isActive()) releaseRouteHandoff(store, id, routeHandoff);
						try {
							await scheduler.stop();
						} finally {
							capabilityLease.revoke();
						}
						await cleanupTaskScopedApprovalRuntime("channel startup cleanup failed");
					}
					if (!handedOffTask && store.lifetimes.get(id) === lifetime && !store.stops.has(id)) store.lifetimes.delete(id);
					if (store.starting.get(id) === startGate.promise) store.starting.delete(id);
					startGate.resolve();
				}
			})
		});
		if (startup.hasError) throw startup.firstError;
		return startOutcomes;
	};
	const startChannelInternal = (...args) => runChannelAccountStartup(() => withPluginRuntimeGatewayContextResolver(opts.resolveGatewayContext, () => withRegistry((registry) => startChannelProcessOwned(registry, ...args)), { inheritRequestScope: false }));
	const stopChannelInRegistry = async (registry, channelId, accountId, optsLocal = {}) => {
		const manual = optsLocal.manual ?? true;
		const retainCleanupOwner = manual || !optsLocal.routeHandoff;
		const plugin = getLoadedChannelPluginEntryById(channelId, registry)?.plugin;
		const store = getStore(channelId);
		if (retainCleanupOwner) releaseChannelRouteHandoffs(channelId, accountId);
		const lifecycleIds = /* @__PURE__ */ new Set([
			...store.lifetimes.keys(),
			...store.starting.keys(),
			...store.stops.keys(),
			...store.tasks.keys()
		]);
		if (!accountId && lifecycleIds.size === 0) return;
		const cfg = getRuntimeConfig();
		const configuredAccountIds = !accountId || optsLocal.routeHandoff ? plugin ? runPluginCleanup(plugin, () => plugin.config.listAccountIds(cfg)) : [] : [];
		const knownIds = new Set(accountId ? [accountId] : [...lifecycleIds, ...configuredAccountIds]);
		const failedStop = (await Promise.all(Array.from(knownIds.values()).map(async (id) => {
			const rKey = restartKey(channelId, id);
			if (manual) manuallyStopped.add(rKey);
			restarts.get(rKey)?.cancel();
			const currentStop = store.stops.get(id);
			if (currentStop?.status === "stopping") {
				const outcome = await currentStop.attempt;
				return optsLocal.strict && !currentStop.settled && outcome.status === "fulfilled" ? {
					status: "rejected",
					error: /* @__PURE__ */ new Error(`Channel ${channelId}/${id} still owns running work.`)
				} : outcome;
			}
			const runStopAttempt = async () => {
				const lifetime = store.lifetimes.get(id);
				const abort = lifetime?.abort;
				const retainedCleanup = store.stops.get(id)?.cleanup;
				const explicitlyDisabled = isChannelAccountExplicitlyDisabled({
					cfg,
					channel: channelId,
					accountId: id
				});
				const canHandoff = optsLocal.routeHandoff && configuredAccountIds.includes(id) && !explicitlyDisabled && !manuallyStopped.has(rKey);
				if (!canHandoff) releaseRouteHandoff(store, id);
				const task = store.tasks.get(id);
				const fallbackStop = !lifetime && !explicitlyDisabled && plugin ? runPluginCleanup(plugin, () => {
					const gateway = plugin.gateway;
					const stopAccount = gateway?.stopAccount;
					return gateway && stopAccount ? {
						gateway,
						stopAccount
					} : void 0;
				}) : void 0;
				if (!abort && !task && !lifetime?.teardown && !fallbackStop && !retainedCleanup) {
					stopState.settled = true;
					return { status: "fulfilled" };
				}
				const lease = lifetime?.capabilityLease;
				if (canHandoff && lease) {
					const handoff = store.routeHandoffs.get(id) ?? createPluginHttpRouteHandoff();
					handoff.park(lease);
					store.routeHandoffs.set(id, handoff);
				}
				if (optsLocal.routeHandoff) lease?.revoke();
				abort?.abort();
				const log = ensureChannelLog(channelId);
				let outcome = { status: "fulfilled" };
				let stopAccountSettled = true;
				const teardown = lifetime?.teardown;
				if (teardown || fallbackStop && plugin || retainedCleanup) {
					const stopLease = createPluginRuntimeCapabilityLease("channel account stop");
					try {
						let stopAccountStarted = retainedCleanup !== void 0;
						const stopAccountAttempt = retainedCleanup ?? runChannelAccountStop({
							registry,
							rootScheduler: opts.scheduler,
							lease: stopLease,
							teardown,
							fallback: fallbackStop && plugin ? {
								...fallbackStop,
								plugin,
								cfg,
								accountId: id
							} : void 0,
							createFallbackContext: (account, scheduler) => createAccountContext(channelId, id, cfg, account, new AbortController().signal, scheduler),
							setStatus: (next) => stopLease.isActive() ? setRuntime(channelId, id, next) : getRuntime(channelId, id),
							onCleanupStarted: () => {
								stopAccountStarted = true;
							},
							onError: (error) => log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`)
						});
						stopAccountSettled = await waitForChannelStopGracefully(stopAccountAttempt, CHANNEL_STOP_ABORT_TIMEOUT_MS);
						const stopState = store.stops.get(id);
						if (!stopAccountSettled) {
							if (stopState && stopAccountStarted) stopState.cleanup = stopAccountAttempt;
							log.warn?.(`[${id}] stopAccount exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms; continuing stop`);
						} else {
							outcome = await stopAccountAttempt;
							if (stopState?.cleanup === stopAccountAttempt) delete stopState.cleanup;
						}
					} catch (error) {
						outcome = {
							status: "rejected",
							error
						};
						log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`);
					} finally {
						stopLease.revoke();
					}
				}
				const stoppedCleanly = await waitForChannelStopGracefully(task, CHANNEL_STOP_ABORT_TIMEOUT_MS);
				stopState.settled = stopAccountSettled && stoppedCleanly;
				if (!stoppedCleanly) log.warn?.(`[${id}] channel stop exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms after abort; continuing shutdown`);
				if (!stopAccountSettled && retainCleanupOwner || optsLocal.strict && (!stopAccountSettled || !stoppedCleanly)) outcome = {
					status: "rejected",
					error: /* @__PURE__ */ new Error(`Channel ${channelId}/${id} ${stoppedCleanly ? "stopAccount did not settle" : "still owns running work"}.`)
				};
				if (outcome.status === "rejected" && retainCleanupOwner) {
					clearRecoveryState(rKey);
					if (stoppedCleanly && store.tasks.get(id) === task) store.tasks.delete(id);
					setRuntime(channelId, id, {
						running: true,
						restartPending: false,
						lastError: formatErrorMessage(outcome.error)
					});
					return outcome;
				}
				if (!stoppedCleanly && retainCleanupOwner) {
					const stoppedPatch = {
						restartPending: !manual,
						lastError: `channel stop timed out after ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms`
					};
					if (manual) setRuntime(channelId, id, {
						running: true,
						...stoppedPatch
					});
					else setStoppedRuntime(channelId, id, stoppedPatch);
					recoveryStopTimedOut.add(rKey);
					return outcome;
				}
				clearRecoveryState(rKey);
				if (store.tasks.get(id) === task) store.tasks.delete(id);
				if (store.lifetimes.get(id) === lifetime) {
					store.lifetimes.delete(id);
					if (!retainCleanupOwner) store.starting.delete(id);
				}
				setStoppedRuntime(channelId, id, {
					restartPending: false,
					lastStopAt: Date.now(),
					...outcome.status === "rejected" ? { lastError: formatErrorMessage(outcome.error) } : {}
				});
				return outcome;
			};
			const stopAttempt = Promise.resolve().then(runStopAttempt);
			const stopState = {
				status: "stopping",
				attempt: stopAttempt,
				settled: false,
				...currentStop?.cleanup ? { cleanup: currentStop.cleanup } : {}
			};
			store.stops.set(id, stopState);
			const outcome = await stopAttempt;
			const latestStop = store.stops.get(id);
			if (latestStop?.status === "stopping" && latestStop.attempt === stopAttempt) {
				if (outcome.status === "rejected" && retainCleanupOwner) store.stops.set(id, {
					...outcome,
					...latestStop.cleanup ? { cleanup: latestStop.cleanup } : {}
				});
				else {
					store.stops.delete(id);
					if (!store.tasks.has(id) && !store.starting.has(id)) store.lifetimes.delete(id);
				}
			}
			return outcome;
		}))).find((outcome) => outcome.status === "rejected");
		if (failedStop?.status === "rejected") throw failedStop.error;
	};
	const stopChannel = (...args) => withRegistry((registry) => stopChannelInRegistry(registry, ...args));
	const startChannelsWithOptions = async (startOptions = {}) => {
		let releaseAccountStarts;
		const deferAccountStartUntil = opts.deferStartupAccountStartsUntil ?? (startupTrace ? new Promise((resolve) => {
			releaseAccountStarts = () => {
				setImmediate(resolve).unref?.();
			};
		}) : void 0);
		try {
			await runTasksWithConcurrency({
				limit: CHANNEL_STARTUP_CONCURRENCY,
				tasks: listLoadedChannelPluginsForRegistry(getPluginRegistry()).map((plugin) => async () => {
					try {
						await measureStartup(`channels.${plugin.id}.start`, () => startChannelInternal(plugin.id, void 0, {
							reason: "startup",
							...startOptions,
							...deferAccountStartUntil ? { deferAccountStartUntil } : {}
						}));
					} catch (err) {
						ensureChannelLog(plugin.id).error?.(`[${plugin.id}] channel startup failed: ${formatErrorMessage(err)}`);
					}
				})
			});
		} finally {
			releaseAccountStarts?.();
		}
	};
	const recoverAutostartSuppression = createChannelAutostartRecovery({
		getSuppression: () => autostartSuppression,
		clearSuppression: () => {
			const message = autostartSuppression?.message;
			autostartSuppression = null;
			if (message === void 0) return;
			for (const [channelId, store] of channelStores) for (const [accountId, runtime] of store.runtimes) if (runtime.lastError === message) setRuntime(channelId, accountId, { lastError: null });
		},
		tryRecover: opts.tryRecoverAutostartSuppression,
		signal: opts.scheduler.signal,
		isClosing: opts.isClosing,
		startChannels: () => startChannelsWithOptions({
			reason: "autostart-recovery",
			preserveManualStop: true
		})
	});
	const markChannelLoggedOut = (channelId, cleared, accountId) => {
		const plugin = getChannelPlugin(channelId);
		if (!plugin) return;
		const resolvedId = accountId ?? resolveChannelDefaultAccountId({
			plugin,
			cfg: getRuntimeConfig()
		});
		const store = getStore(channelId);
		if (store.starting.has(resolvedId) || store.tasks.has(resolvedId)) return;
		const current = getRuntime(channelId, resolvedId);
		setStoppedRuntime(channelId, resolvedId, {
			...cleared ? { linked: false } : {},
			restartPending: false,
			lastError: cleared ? "logged out" : current.lastError
		});
	};
	const captureChannelSnapshot = (plugin, inspectAccounts = true) => {
		const channelId = plugin.id;
		const store = getStore(channelId);
		const cfg = getRuntimeConfig();
		const registry = getPluginRegistry();
		const configuredAccountIds = [...plugin.config.listAccountIds(cfg)];
		const configuredAccountIdSet = new Set(configuredAccountIds);
		const accountIds = [.../* @__PURE__ */ new Set([...configuredAccountIds, ...store.lifetimes.keys()])];
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: configuredAccountIds
		});
		const defaultRuntime = { ...plugin.status?.defaultRuntime };
		const accounts = Object.fromEntries(accountIds.map((id) => {
			const runtime = store.runtimes.get(id) ?? {
				...defaultRuntime,
				accountId: id
			};
			const current = configuredAccountIdSet.has(id) ? runtime : buildChannelAccountSnapshotFromRuntime(runtime);
			const unavailable = resolveUnavailableChannelAccountSnapshot(cfg, {
				registry,
				channelId,
				accountId: id,
				runtime: current
			});
			if (unavailable || !configuredAccountIdSet.has(id) || !inspectAccounts) return [id, unavailable ?? { ...current }];
			const inspected = plugin.config.inspectAccount?.(cfg, id);
			if (inspected) return [id, buildChannelAccountSnapshotFromInspection({
				account: inspected,
				accountId: id,
				runtime: current
			})];
			if (plugin.config.resolveAccountAsync || plugin.config.describeAccountAsync) return [id, { ...current }];
			const account = plugin.config.resolveAccount(cfg, id);
			const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account);
			const described = plugin.config.describeAccount?.(account, cfg);
			const next = {
				...current,
				accountId: id,
				enabled
			};
			applyChannelAccountState(next, resolveChannelAccountState({
				enabled,
				configured: described?.configured ?? current.configured ?? true,
				linked: plugin.config.isLinked || typeof current.linked === "boolean" ? current.linked : described?.linked,
				runtime: current,
				disabledReason: plugin.config.disabledReason?.(account, cfg),
				unconfiguredReason: plugin.config.unconfiguredReason?.(account, cfg),
				unlinkedReason: plugin.config.unlinkedReason?.(account, cfg)
			}));
			if (described?.mode !== void 0) next.mode = described.mode;
			return [id, next];
		}));
		return {
			listedAccountIds: configuredAccountIdSet,
			accounts,
			defaultAccountId,
			defaultAccount: accounts[defaultAccountId] ?? {
				...defaultRuntime,
				accountId: defaultAccountId
			}
		};
	};
	const getRuntimeSnapshot = (options = {}) => {
		const { channelId, inspectAccounts = true } = options;
		const channels = {};
		const channelAccounts = {};
		const reloadingChannels = /* @__PURE__ */ new Map();
		for (const plugin of listLoadedChannelPluginsForRegistry(getPluginRegistry())) {
			if (channelId !== void 0 && plugin.id !== channelId) continue;
			const fence = getStore(plugin.id).startFence;
			const snapshot = fence && fence.state !== "published" ? fence.snapshot : captureChannelSnapshot(plugin, inspectAccounts);
			if (fence?.state === "paused") reloadingChannels.set(plugin.id, snapshot?.defaultAccountId);
			if (snapshot) {
				const accounts = snapshot === fence?.snapshot ? Object.fromEntries(Object.entries(snapshot.accounts).map(([id, captured]) => {
					const runtime = {
						...captured,
						...getStore(plugin.id).runtimes.get(id)
					};
					return [id, buildChannelAccountSnapshotFromInspection({
						account: runtime,
						accountId: id,
						runtime
					})];
				})) : snapshot.accounts;
				channels[plugin.id] = accounts[snapshot.defaultAccountId] ?? snapshot.defaultAccount;
				channelAccounts[plugin.id] = accounts;
			}
		}
		return {
			channels,
			channelAccounts,
			reloadingChannels
		};
	};
	return {
		getRuntimeSnapshot,
		pauseChannelStarts: (channelIds) => pauseChannelStarts(channelIds, getStore, (channelId) => {
			const plugin = getChannelPlugin(channelId);
			return plugin ? captureChannelSnapshot(plugin) : void 0;
		}),
		startChannels: () => startChannelsWithOptions(),
		startChannel: startChannelInternal,
		stopChannel,
		releaseChannelRouteHandoffs,
		pruneInactiveChannelAccountState,
		setAutostartSuppression: (suppression) => {
			autostartSuppression = suppression;
		},
		getAutostartSuppression: () => autostartSuppression,
		recoverAutostartSuppression,
		setAmbientAutostartSuppressedChannelIds: (channelIds) => {
			ambientAutostartSuppressedChannelIds = new Set(channelIds);
		},
		isAmbientAutostartSuppressed: (channelId) => ambientAutostartSuppressedChannelIds.has(channelId),
		markChannelLoggedOut,
		isManuallyStopped: (channelId, accountId) => manuallyStopped.has(restartKey(channelId, accountId)),
		hasCurrentAccountTask: (channelId, accountId) => {
			const store = channelStores.get(channelId);
			const lifetime = store?.lifetimes.get(accountId);
			return Boolean(store && lifetime && store.tasks.has(accountId) && !store.stops.has(accountId) && !lifetime.abort.signal.aborted && lifetime.capabilityLease.isActive() && lifetime.plugin === getChannelPlugin(channelId));
		},
		isAccountListed: (channelId, accountId) => {
			const fence = channelStores.get(channelId)?.startFence;
			return fence && fence.state !== "published" ? fence.snapshot?.listedAccountIds.has(accountId) ?? false : withRegistry((registry) => getLoadedChannelPluginEntryById(channelId, registry)?.plugin.config.listAccountIds(getRuntimeConfig()).includes(accountId) ?? false);
		},
		resolveRuntimeAccountId: (channelId, accountId) => {
			const matches = [...channelStores.get(channelId)?.runtimes.keys() ?? []].filter((id) => normalizeAccountId(id) === accountId);
			return matches.length === 1 ? matches[0] : void 0;
		},
		isAutoRestartScheduled: (channelId, accountId) => pendingAutoRestarts.has(restartKey(channelId, accountId)),
		resetRestartAttempts: (channelId, accountId) => {
			restarts.delete(restartKey(channelId, accountId));
		},
		isHealthMonitorEnabled: (channelId, accountId) => resolveChannelHealthMonitorEnabled(getRuntimeConfig(), channelId, accountId)
	};
}
//#endregion
export { createChannelManager };
