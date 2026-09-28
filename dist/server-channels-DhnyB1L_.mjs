import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { s as sleepWithAbort, t as RetrySupervisor } from "./src-D4OikzaT.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { c as runPluginCleanup, t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as PluginInstanceUnavailableError } from "./plugin-generation-artifact-VyjUi6ei.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { a as formatGatewayCrashLoopManualChannelStartHint } from "./gateway-boot-lifecycle-DZNz5cof.mjs";
import { y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { a as listLoadedChannelPluginsForRegistry, n as getLoadedChannelPluginEntryById } from "./registry-loaded-CYq2sa_C.mjs";
import { g as setActiveCredentialDegradedOwner, o as clearActiveCredentialDegradedOwner, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-BEpDh--e.mjs";
import { n as runOutsidePluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { r as resetDirectoryCache } from "./target-resolver-BGltLgX1.mjs";
import { n as withGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-RP-DVAyK.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { a as projectSafeChannelAccountSnapshotFields, t as getCredentialUnavailableDiagnostics } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { a as resolveUnavailableChannelAccountSnapshot, i as resolveChannelAccountState, o as isChannelAccountExplicitlyDisabled, t as applyChannelAccountState } from "./account-state-Bap6_YQI.mjs";
import { n as buildChannelAccountSnapshotFromRuntime, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-DhBHrWxT.mjs";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-D5eigP26.mjs";
import { a as isExecApprovalChannelRuntimeTerminalStartError } from "./approval-native-runtime-YidsYI-W.mjs";
import { n as createChannelApprovalHandlerFromCapability } from "./approval-handler-runtime-C0Ponyi5.mjs";
import { i as watchChannelRuntimeContexts, n as getChannelRuntimeContext, r as registerChannelRuntimeContext, t as createTaskScopedChannelRuntime } from "./channel-runtime-context-DU3GTBFU.mjs";
import { r as channelStartFailurePatch } from "./channel-status-patches-BS8oeT90.mjs";
import { i as withPluginHttpRouteRegistry, n as createPluginHttpRouteHandoff } from "./http-registry-Am1C83T4.mjs";
import { t as createPluginRuntimeCapabilityLease } from "./capability-lease-Dybi4lS4.mjs";
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
	if (!capability?.nativeRuntime || !params.channelRuntime) return async () => {};
	const channelLabel = params.plugin.meta.label || params.plugin.id;
	const logger = params.logger ?? createSubsystemLogger(`${params.plugin.id}/approval-bootstrap`);
	let activeGeneration = 0;
	let activeHandler = null;
	let retryTimer = null;
	const invalidateActiveHandler = () => {
		activeGeneration += 1;
	};
	const clearRetryTimer = () => {
		if (!retryTimer) return;
		clearTimeout(retryTimer);
		retryTimer = null;
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
		clearRetryTimer();
		retryTimer = setTimeout(() => {
			retryTimer = null;
			if (generation !== activeGeneration) return;
			spawn("failed to retry native approval handler", startHandlerForRegisteredContext(context, generation));
		}, APPROVAL_HANDLER_BOOTSTRAP_RETRY_MS);
		retryTimer.unref?.();
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
				if (isRetryableApprovalBootstrapStartError(error)) {
					logger.warn(`native approval handler deferred until gateway readiness recovers: ${formatRetryableApprovalBootstrapStartError(error)}`);
					scheduleRetryForContext(context, generation);
					return;
				}
				logger.error(`failed to start native approval handler: ${String(error)}`);
				scheduleRetryForContext(context, generation);
			}
		}
	};
	const unsubscribe = watchChannelRuntimeContexts({
		channelRuntime: params.channelRuntime,
		channelId: params.plugin.id,
		accountId: params.accountId,
		capability: "approval.native",
		onEvent: (event) => {
			if (event.type === "registered") {
				clearRetryTimer();
				invalidateActiveHandler();
				const generation = activeGeneration;
				spawn("failed to start native approval handler", startHandlerForRegisteredContext(event.context, generation));
				return;
			}
			clearRetryTimer();
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
	if (existingContext !== void 0) {
		clearRetryTimer();
		invalidateActiveHandler();
		spawn("failed to start native approval handler", startHandlerForRegisteredContext(existingContext, activeGeneration));
	}
	return async () => {
		unsubscribe();
		clearRetryTimer();
		invalidateActiveHandler();
		await stopHandler();
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
			if (store.startFence === fence && fence.state === "paused") {
				if (outcome !== "rollback") fence.state = outcome;
				else store.startFence = previous;
			}
		}
	};
}
//#endregion
//#region src/gateway/server-channel-startup.ts
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
function sanitizeAbortedTaskStatusPatch(patch, current) {
	const next = { ...patch };
	delete next.running;
	delete next.restartPending;
	delete next.reconnectAttempts;
	delete next.lastStartAt;
	delete next.lastStopAt;
	delete next.lifecycle;
	if (next.connected === true) {
		delete next.connected;
		delete next.lastConnectedAt;
		delete next.lastEventAt;
		delete next.lastTransportActivityAt;
	}
	if (next.lastError === null && current.lastError) delete next.lastError;
	return next;
}
function createRuntimeStore() {
	return {
		lifetimes: /* @__PURE__ */ new Map(),
		routeHandoffs: /* @__PURE__ */ new Map(),
		starting: /* @__PURE__ */ new Map(),
		stops: /* @__PURE__ */ new Map(),
		tasks: /* @__PURE__ */ new Map(),
		runtimes: /* @__PURE__ */ new Map()
	};
}
async function waitForChannelStopGracefully(task, timeoutMs) {
	if (!task) return true;
	let timer;
	try {
		return await Promise.race([task.then(() => true, () => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), timeoutMs);
			timer.unref?.();
		})]);
	} finally {
		clearTimeout(timer);
	}
}
async function waitForDeferredAccountStart(deferred, abortSignal) {
	if (abortSignal.aborted) return;
	await Promise.race([deferred, new Promise((resolve) => {
		abortSignal.addEventListener("abort", () => resolve(), { once: true });
	})]);
}
function createChannelManager(opts) {
	const { getRuntimeConfig, channelLogs, channelRuntimeEnvs, channelRuntime, resolveChannelRuntime, getPluginRegistry, startupTrace } = opts;
	const withRegistry = (run) => {
		const registry = getPluginRegistry();
		return withPluginRuntimeRegistryScope(registry, () => run(registry));
	};
	const getChannelPlugin = (channelId) => getLoadedChannelPluginEntryById(channelId, getPluginRegistry())?.plugin;
	const cloneDefaultRuntime = (channelId, accountId) => ({
		...getChannelPlugin(channelId)?.status?.defaultRuntime,
		accountId
	});
	const channelStores = /* @__PURE__ */ new Map();
	const restarts = /* @__PURE__ */ new Map();
	const manuallyStopped = /* @__PURE__ */ new Set();
	const recoveryStopTimedOut = /* @__PURE__ */ new Set();
	const recoveryStartRequested = /* @__PURE__ */ new Set();
	const pendingAutoRestarts = /* @__PURE__ */ new Set();
	let autostartSuppression = null;
	let ambientAutostartSuppressedChannelIds = new Set(opts.ambientAutostartSuppressedChannelIds ?? []);
	const restartKey = (channelId, accountId) => `${channelId}:${accountId}`;
	const releaseRouteHandoff = (store, accountId, expected = store.routeHandoffs.get(accountId)) => {
		if (expected && store.routeHandoffs.get(accountId) === expected) {
			expected.handoff.release();
			store.routeHandoffs.delete(accountId);
		}
	};
	const releaseChannelRouteHandoffs = (channelId, accountId) => {
		const store = getStore(channelId);
		for (const id of accountId ? [accountId] : store.routeHandoffs.keys()) {
			const admittedSignal = store.routeHandoffs.get(id)?.admittedSignal;
			if (!admittedSignal || admittedSignal.aborted) releaseRouteHandoff(store, id);
		}
	};
	const ensureChannelLog = (channelId) => {
		channelLogs[channelId] ??= createSubsystemLogger("channels").child(channelId);
		return channelLogs[channelId];
	};
	const ensureChannelRuntime = (channelId) => {
		channelRuntimeEnvs[channelId] ??= runtimeForLogger(ensureChannelLog(channelId));
		return channelRuntimeEnvs[channelId];
	};
	const resolveAccountHealthMonitorOverride = (channelConfig, channelId, accountId) => {
		if (!channelConfig?.accounts) return;
		const direct = resolveChannelAccountEntry(channelConfig.accounts, accountId, channelId);
		if (typeof direct?.healthMonitor?.enabled === "boolean") return direct.healthMonitor.enabled;
		const normalizedAccountId = normalizeOptionalAccountId(accountId);
		if (!normalizedAccountId) return;
		const match = resolveChannelAccountEntry(channelConfig.accounts, normalizedAccountId, channelId, normalizeAccountId);
		if (typeof match?.healthMonitor?.enabled !== "boolean") return;
		return match.healthMonitor.enabled;
	};
	const isHealthMonitorEnabled = (channelId, accountId) => {
		const channelConfig = getRuntimeConfig().channels?.[channelId];
		const accountOverride = resolveAccountHealthMonitorOverride(channelConfig, channelId, accountId);
		const channelOverride = channelConfig?.healthMonitor?.enabled;
		if (typeof accountOverride === "boolean") return accountOverride;
		if (typeof channelOverride === "boolean") return channelOverride;
		return true;
	};
	const getStore = (channelId) => {
		const existing = channelStores.get(channelId);
		if (existing) return existing;
		const next = createRuntimeStore();
		channelStores.set(channelId, next);
		return next;
	};
	const getRuntime = (channelId, accountId) => {
		return getStore(channelId).runtimes.get(accountId) ?? cloneDefaultRuntime(channelId, accountId);
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
	const getChannelRuntime = async () => {
		if (channelRuntime) return channelRuntime;
		return await resolveChannelRuntime?.();
	};
	const createAccountContext = (channelId, accountId, cfg, account, abortSignal) => ({
		cfg,
		accountId,
		account,
		abortSignal,
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
			restarts.delete(restartKey(channelId, id));
			manuallyStopped.delete(restartKey(channelId, id));
			recoveryStartRequested.delete(restartKey(channelId, id));
		}
	};
	const pruneInactiveChannelAccountState = (activeChannelIds) => {
		for (const [channelId, store] of channelStores) if (!activeChannelIds.has(channelId)) evictStaleChannelAccountState(channelId, store, []);
	};
	const startChannelProcessOwned = async (registry, channelId, accountId, optsValue = {}) => {
		const store = getStore(channelId);
		const startFence = store.startFence;
		const registration = getLoadedChannelPluginEntryById(channelId, registry);
		const assertStartCurrent = () => {
			if (startFence?.state === "paused" || store.startFence !== startFence || getLoadedChannelPluginEntryById(channelId, getPluginRegistry())?.plugin !== registration?.plugin) throw new Error("Channel plugins are reloading; retry the start after reload completes.");
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
		if (autostartSuppression && optsValue.manual !== true) {
			const suffix = accountId ? ` account ${accountId}` : "";
			ensureChannelLog(channelId).warn?.(`channel autostart suppressed by crash-loop breaker; refusing automatic start for ${channelId}${suffix}. ${formatGatewayCrashLoopManualChannelStartHint({
				channelId,
				...accountId ? { accountId } : {}
			})}`);
			for (const id of accountIds) {
				releaseRouteHandoff(store, id);
				setStoppedRuntime(channelId, id, {
					restartPending: false,
					lastError: autostartSuppression.message
				});
			}
			return new Map(accountIds.map((id) => [id, {
				status: "skipped",
				reason: "autostart-suppressed"
			}]));
		}
		if (ambientAutostartSuppressedChannelIds.has(channelId) && optsValue.manual !== true) {
			for (const id of accountIds) {
				releaseRouteHandoff(store, id);
				setStoppedRuntime(channelId, id, {
					restartPending: false,
					lastError: "ambient channel credentials suppressed; configure the channel or start the gateway with --ambient-channels"
				});
			}
			return new Map(accountIds.map((id) => [id, {
				status: "skipped",
				reason: "ambient-suppressed"
			}]));
		}
		const startOutcomes = /* @__PURE__ */ new Map();
		const startup = await runTasksWithConcurrency({
			limit: CHANNEL_STARTUP_CONCURRENCY,
			tasks: accountIds.map((id) => async () => {
				assertStartCurrent();
				const rKey = restartKey(channelId, id);
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
						let clearedTimedOutRecoveryTask = false;
						if (recoveryStopTimedOut.has(rKey)) {
							if (manuallyStopped.has(rKey)) {
								startOutcomes.set(id, {
									status: "skipped",
									reason: "manual-stop"
								});
								return;
							}
							if (recoveryStartRequested.has(rKey)) {
								recoveryStopTimedOut.delete(rKey);
								recoveryStartRequested.delete(rKey);
								restarts.delete(rKey);
								store.lifetimes.get(id)?.capabilityLease.revoke();
								store.lifetimes.delete(id);
								store.tasks.delete(id);
								clearedTimedOutRecoveryTask = true;
								setRuntime(channelId, id, {
									restartPending: false,
									reconnectAttempts: 0
								});
							} else {
								recoveryStartRequested.add(rKey);
								setRuntime(channelId, id, { restartPending: true });
								startOutcomes.set(id, {
									status: "retry",
									reason: "task-owned"
								});
								return;
							}
						}
						if (!clearedTimedOutRecoveryTask) {
							startOutcomes.set(id, {
								status: "retry",
								reason: "task-owned"
							});
							return;
						}
					}
					const existingStart = store.starting.get(id);
					if (!existingStart) break;
					await existingStart;
					assertStartCurrent();
				}
				const startGate = createDeferredCore();
				store.starting.set(id, startGate.promise);
				const routeHandoff = store.routeHandoffs.get(id);
				const abort = new AbortController();
				const capabilityLease = createPluginRuntimeCapabilityLease("channel account");
				const lifetime = {
					plugin,
					abort,
					capabilityLease
				};
				store.lifetimes.set(id, lifetime);
				let handedOffTask = false;
				const log = ensureChannelLog(channelId);
				let scopedChannelRuntime = null;
				let channelRuntimeForTask;
				let stopApprovalBootstrap = async () => {};
				const stopTaskScopedApprovalRuntime = async () => {
					const scopedRuntime = scopedChannelRuntime;
					scopedChannelRuntime = null;
					const stopBootstrap = stopApprovalBootstrap;
					stopApprovalBootstrap = async () => {};
					scopedRuntime?.dispose();
					await stopBootstrap();
				};
				const cleanupTaskScopedApprovalRuntime = async (label) => {
					try {
						await stopTaskScopedApprovalRuntime();
					} catch (error) {
						log.error?.(`[${id}] ${label}: ${formatErrorMessage(error)}`);
					}
				};
				const skipDisabledAccount = () => {
					setRuntime(channelId, id, {
						enabled: false,
						running: false,
						restartPending: false
					});
					startOutcomes.set(id, {
						status: "skipped",
						reason: "disabled"
					});
				};
				try {
					const secretOwnerId = `${channelId}:${normalizeAccountId(id)}`;
					clearActiveCredentialDegradedOwner("account", secretOwnerId);
					if (explicitlyDisabled && plugin.config.listAccountIds(cfg).some((listed) => normalizeAccountId(listed) === normalizeAccountId(id))) {
						skipDisabledAccount();
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
					const account = plugin.config.resolveAccount(cfg, id);
					const accountContext = createAccountContext(channelId, id, cfg, account, abort.signal);
					if (plugin.gateway?.stopAccount) {
						const stopAccount = plugin.gateway.stopAccount;
						const gateway = plugin.gateway;
						lifetime.teardown = {
							context: accountContext,
							run: (context) => runPluginCleanup(stopAccount, () => stopAccount.call(gateway, context))
						};
					}
					const described = plugin.config.describeAccount?.(account, cfg);
					if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) {
						skipDisabledAccount();
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
						setRuntime(channelId, id, {
							enabled: true,
							configured: false,
							linked: void 0,
							running: false,
							restartPending: false
						});
						startOutcomes.set(id, {
							status: "skipped",
							reason: "unconfigured"
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
						setRuntime(channelId, id, {
							enabled: true,
							linked: linkState === "not-linked" ? false : void 0,
							running: false,
							restartPending: false
						});
						startOutcomes.set(id, {
							status: "skipped",
							reason: "unlinked"
						});
						return;
					}
					if (abort.signal.aborted || manuallyStopped.has(rKey)) {
						setStoppedRuntime(channelId, id, {
							restartPending: false,
							lastStopAt: Date.now()
						});
						startOutcomes.set(id, {
							status: "skipped",
							reason: "manual-stop"
						});
						return;
					}
					scopedChannelRuntime = await measureStartup(`channels.${channelId}.runtime`, async () => createTaskScopedChannelRuntime({ channelRuntime: registration?.resolveChannelRuntime?.() ?? await getChannelRuntime() }));
					capabilityLease.assertActive("startup");
					channelRuntimeForTask = scopedChannelRuntime.channelRuntime;
					if (!preserveRestartAttempts) restarts.delete(rKey);
					try {
						stopApprovalBootstrap = await measureStartup(`channels.${channelId}.approval-bootstrap`, () => startChannelApprovalHandlerBootstrap({
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
					if (abort.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.()) {
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
					const trackedPromise = Promise.resolve().then(async () => {
						if (optsValue.deferAccountStartUntil) await waitForDeferredAccountStart(optsValue.deferAccountStartUntil, abort.signal);
						else if (startupTrace) await waitForChannelStartupHandoff();
						if (abort.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.()) return;
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
							if (abort.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.()) return;
							const runStartAccount = () => {
								const startedAt = Date.now();
								const recordDuration = () => {
									channelRunDurationMs = Date.now() - startedAt;
								};
								try {
									return withGatewayNativeApprovalRuntime(opts.getNativeApprovalRuntime?.(), () => startAccount({
										...accountContext,
										setStatus: (next) => isCurrentTask() ? setRuntimeFromTaskStatus(channelId, id, next, abort.signal) : getRuntime(channelId, id),
										invalidateDirectoryCache: () => resetDirectoryCache({
											cfg,
											channel: channelId,
											accountId: id
										}),
										...channelRuntimeForTask ? { channelRuntime: channelRuntimeForTask } : {}
									})).finally(recordDuration);
								} catch (error) {
									recordDuration();
									throw error;
								}
							};
							startAccountTask = withPluginHttpRouteRegistry(registry, () => runChannelAccountMonitor(registry, registration?.pluginId, runStartAccount), capabilityLease);
						});
						if (!startAccountTask) return;
						await startAccountTask;
					}).finally(() => capabilityLease.revoke()).then(() => {
						if (abort.signal.aborted || manuallyStopped.has(rKey) || opts.isClosing?.() || !isCurrentTask()) return;
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
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							return;
						}
						if (getRuntime(channelId, id).terminalDisconnect) {
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							restarts.delete(rKey);
							setRuntime(channelId, id, {
								restartPending: false,
								reconnectAttempts: 0
							});
							log.info?.(`[${id}] auto-restart skipped, terminal disconnect`);
							return;
						}
						if (recoveryStopTimedOut.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							if (!recoveryStartRequested.delete(rKey)) {
								setRuntime(channelId, id, {
									restartPending: false,
									reconnectAttempts: 0
								});
								releaseTask();
								return;
							}
							restarts.delete(rKey);
							log.info?.(`[${id}] restarting after timed-out channel stop completed`);
							setRuntime(channelId, id, {
								restartPending: true,
								reconnectAttempts: 0
							});
							releaseTask();
							try {
								await startChannelInternal(channelId, id, { preserveManualStop: true });
							} catch {}
							return;
						}
						if (channelRunDurationMs !== void 0 && channelRunDurationMs >= CHANNEL_STABLE_RUN_MS) restarts.delete(rKey);
						const restart = restarts.get(rKey) ?? new RetrySupervisor(RESTART_POLICY, MAX_RESTARTS);
						restarts.set(rKey, restart);
						const retry = restart.next(abort.signal);
						if (!retry) {
							setRuntime(channelId, id, {
								restartPending: false,
								reconnectAttempts: restart.attempts
							});
							log.error?.(`[${id}] giving up after ${MAX_RESTARTS} restart attempts`);
							return;
						}
						log.info?.(`[${id}] auto-restart attempt ${restart.attempts}/${MAX_RESTARTS} in ${Math.round(retry.delayMs / 1e3)}s`);
						setRuntime(channelId, id, {
							restartPending: true,
							reconnectAttempts: restart.attempts
						});
						pendingAutoRestarts.add(rKey);
						try {
							await sleepWithAbort(retry.delayMs, retry.signal);
							if (manuallyStopped.has(rKey) || opts.isClosing?.()) return;
							releaseTask();
							await startChannelInternal(channelId, id, {
								preserveRestartAttempts: true,
								preserveManualStop: true
							});
						} catch {} finally {
							pendingAutoRestarts.delete(rKey);
						}
					}).finally(() => {
						releaseTask();
						if (routeHandoff?.admittedSignal === abort.signal) releaseRouteHandoff(store, id, routeHandoff);
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
					if (routeHandoff) routeHandoff.admittedSignal = abort.signal;
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
						capabilityLease.revoke();
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
	const startChannelInternal = (...args) => runOutsidePluginLifecycleLease(() => runOutsideGatewayRootWorkAdmission(() => runOutsidePluginRuntimeGenerationScope(() => withRegistry((registry) => startChannelProcessOwned(registry, ...args)))));
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
			const runStopAttempt = async (previousOutcome) => {
				const lifetime = store.lifetimes.get(id);
				const abort = lifetime?.abort;
				const canHandoff = optsLocal.routeHandoff && configuredAccountIds.includes(id) && !isChannelAccountExplicitlyDisabled({
					cfg,
					channel: channelId,
					accountId: id
				}) && !manuallyStopped.has(rKey);
				if (!canHandoff) releaseRouteHandoff(store, id);
				const task = store.tasks.get(id);
				const fallbackStop = !lifetime && plugin ? runPluginCleanup(plugin, () => {
					const gateway = plugin.gateway;
					const stopAccount = gateway?.stopAccount;
					return stopAccount ? {
						gateway,
						stopAccount
					} : void 0;
				}) : void 0;
				if (!abort && !task && !lifetime?.teardown && !fallbackStop) return previousOutcome;
				const lease = lifetime?.capabilityLease;
				if (canHandoff && abort && lease && store.routeHandoffs.get(id)?.parkedBy !== abort) {
					const handoff = store.routeHandoffs.get(id)?.handoff ?? createPluginHttpRouteHandoff();
					handoff.park(lease);
					store.routeHandoffs.set(id, {
						handoff,
						parkedBy: abort
					});
				}
				if (optsLocal.routeHandoff) lease?.revoke();
				abort?.abort();
				const log = ensureChannelLog(channelId);
				let outcome = { status: "fulfilled" };
				let capabilityLease;
				let stopAccountSettled = true;
				try {
					let teardown = lifetime?.teardown;
					if (fallbackStop && plugin) {
						const { gateway, stopAccount } = fallbackStop;
						teardown = {
							context: createAccountContext(channelId, id, cfg, runPluginCleanup(plugin, () => plugin.config.resolveAccount(cfg, id)), new AbortController().signal),
							run: (context) => runPluginCleanup(stopAccount, () => stopAccount.call(gateway, context))
						};
					}
					if (teardown) {
						const { context, run } = teardown;
						const stopLease = createPluginRuntimeCapabilityLease("channel account stop");
						capabilityLease = stopLease;
						const runStopAccount = () => run({
							...context,
							setStatus: (next) => stopLease.isActive() ? setRuntime(channelId, id, next) : getRuntime(channelId, id)
						});
						stopAccountSettled = await waitForChannelStopGracefully(withPluginHttpRouteRegistry(registry, runStopAccount, stopLease).catch((error) => {
							if (!stopLease.isActive()) {
								log.warn?.(`[${id}] abandoned stopAccount failed late: ${formatErrorMessage(error)}`);
								return;
							}
							outcome = {
								status: "rejected",
								error
							};
							log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`);
						}), CHANNEL_STOP_ABORT_TIMEOUT_MS);
						if (!stopAccountSettled) log.warn?.(`[${id}] stopAccount exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms; continuing stop`);
					}
				} catch (error) {
					outcome = {
						status: "rejected",
						error
					};
					log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`);
				} finally {
					capabilityLease?.revoke();
				}
				const stoppedCleanly = await waitForChannelStopGracefully(task, CHANNEL_STOP_ABORT_TIMEOUT_MS);
				if (!stoppedCleanly) log.warn?.(`[${id}] channel stop exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms after abort; continuing shutdown`);
				if (optsLocal.strict && (!stopAccountSettled || !stoppedCleanly)) outcome = {
					status: "rejected",
					error: /* @__PURE__ */ new Error(`Channel ${channelId}/${id} ${stoppedCleanly ? "stopAccount did not settle" : "still owns running work"}.`)
				};
				if (outcome.status === "rejected" && retainCleanupOwner) {
					recoveryStopTimedOut.delete(rKey);
					recoveryStartRequested.delete(rKey);
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
					else {
						setStoppedRuntime(channelId, id, stoppedPatch);
						recoveryStopTimedOut.add(rKey);
					}
					return outcome;
				}
				recoveryStopTimedOut.delete(rKey);
				recoveryStartRequested.delete(rKey);
				if (store.tasks.get(id) === task) store.tasks.delete(id);
				const latestStop = store.stops.get(id);
				if (latestStop?.status === "stopping" && latestStop.attempt === stopAttempt && store.lifetimes.get(id) === lifetime) {
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
			const currentStop = store.stops.get(id);
			const stopAttempt = (currentStop?.status === "stopping" ? currentStop.attempt : Promise.resolve(currentStop ?? { status: "fulfilled" })).then(runStopAttempt);
			store.stops.set(id, {
				status: "stopping",
				attempt: stopAttempt
			});
			const outcome = await stopAttempt;
			const latestStop = store.stops.get(id);
			if (latestStop?.status === "stopping" && latestStop.attempt === stopAttempt) {
				if (outcome.status === "rejected" && retainCleanupOwner) store.stops.set(id, outcome);
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
	const startChannels = async () => await startChannelsWithOptions();
	const recoverAutostartSuppression = async () => {
		if (!autostartSuppression || opts.isClosing?.() || !opts.tryRecoverAutostartSuppression?.() || opts.isClosing?.()) return false;
		autostartSuppression = null;
		await startChannelsWithOptions({ preserveManualStop: true });
		return true;
	};
	const markChannelLoggedOut = (channelId, cleared, accountId) => {
		const plugin = getChannelPlugin(channelId);
		if (!plugin) return;
		const cfg = getRuntimeConfig();
		const resolvedId = accountId ?? resolveChannelDefaultAccountId({
			plugin,
			cfg
		});
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
		const accounts = accountIds.map((id) => {
			const initial = {
				...defaultRuntime,
				accountId: id
			};
			const runtime = () => {
				const current = store.runtimes.get(id) ?? initial;
				return configuredAccountIdSet.has(id) ? current : buildChannelAccountSnapshotFromRuntime(current);
			};
			let project = (current) => ({ ...current });
			if (configuredAccountIdSet.has(id) && inspectAccounts && !resolveUnavailableChannelAccountSnapshot(cfg, {
				registry,
				channelId,
				accountId: id,
				runtime: runtime()
			})) {
				const inspected = plugin.config.inspectAccount?.(cfg, id);
				if (inspected) {
					const record = asNullableRecord(inspected);
					const account = {
						...projectSafeChannelAccountSnapshotFields(inspected),
						accountId: record?.accountId,
						enabled: record?.enabled,
						configured: record?.configured,
						stateReason: record?.stateReason
					};
					project = (current) => buildChannelAccountSnapshotFromInspection({
						account,
						accountId: id,
						runtime: current
					});
				} else {
					const account = plugin.config.resolveAccount(cfg, id);
					const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account);
					const described = plugin.config.describeAccount?.(account, cfg);
					const configured = described?.configured;
					const linked = described?.linked;
					const mode = described?.mode;
					const hasLinkCheck = Boolean(plugin.config.isLinked);
					const reasons = {
						disabledReason: plugin.config.disabledReason?.(account, cfg),
						unconfiguredReason: plugin.config.unconfiguredReason?.(account, cfg),
						unlinkedReason: plugin.config.unlinkedReason?.(account, cfg)
					};
					project = (current) => {
						const next = {
							...current,
							accountId: id,
							enabled
						};
						applyChannelAccountState(next, resolveChannelAccountState({
							enabled,
							configured: configured ?? current.configured ?? true,
							linked: hasLinkCheck || typeof current.linked === "boolean" ? current.linked : linked,
							runtime: current,
							...reasons
						}));
						if (mode !== void 0) next.mode = mode;
						return next;
					};
				}
			}
			return () => {
				const current = runtime();
				return resolveUnavailableChannelAccountSnapshot(getRuntimeConfig(), {
					registry: getPluginRegistry(),
					channelId,
					accountId: id,
					runtime: current
				}) ?? project(current);
			};
		});
		return {
			listedAccountIds: configuredAccountIdSet,
			read: () => {
				const snapshots = Object.fromEntries(accountIds.map((id, index) => [id, accounts[index]()]));
				return {
					accounts: snapshots,
					defaultAccountId,
					defaultAccount: snapshots[defaultAccountId] ?? {
						...defaultRuntime,
						accountId: defaultAccountId
					}
				};
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
			const snapshot = (fence && fence.state !== "published" ? fence.snapshot : captureChannelSnapshot(plugin, inspectAccounts))?.read();
			if (fence?.state === "paused") reloadingChannels.set(plugin.id, snapshot?.defaultAccountId);
			if (snapshot) {
				channels[plugin.id] = snapshot.defaultAccount;
				channelAccounts[plugin.id] = snapshot.accounts;
			}
		}
		return {
			channels,
			channelAccounts,
			reloadingChannels
		};
	};
	const isManuallyStoppedFlag = (channelId, accountId) => {
		return manuallyStopped.has(restartKey(channelId, accountId));
	};
	const isAutoRestartScheduled = (channelId, accountId) => {
		return pendingAutoRestarts.has(restartKey(channelId, accountId));
	};
	const resetRestartAttempts = (channelId, accountId) => {
		restarts.delete(restartKey(channelId, accountId));
	};
	return {
		getRuntimeSnapshot,
		pauseChannelStarts: (channelIds) => pauseChannelStarts(channelIds, getStore, (channelId) => {
			const plugin = getChannelPlugin(channelId);
			return plugin ? captureChannelSnapshot(plugin) : void 0;
		}),
		startChannels,
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
		isManuallyStopped: isManuallyStoppedFlag,
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
		isAutoRestartScheduled,
		resetRestartAttempts,
		isHealthMonitorEnabled
	};
}
//#endregion
export { createChannelManager };
