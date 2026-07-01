import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-5IgE9UKY.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-DivrDqxu.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import { n as resolveChannelApprovalCapability } from "./plugins-DnKj2WmH.js";
import { n as sleepWithAbort, t as computeBackoff } from "./backoff-DPz-g2bN.js";
import { n as resolveNormalizedAccountEntry, t as resolveAccountEntry } from "./account-lookup-DjMZZ6go.js";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-CRpRKftP.js";
import { r as resetDirectoryCache } from "./target-resolver-BpCIOvtz.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-DLWtIqHq.js";
import { a as isExecApprovalChannelRuntimeTerminalStartError } from "./approval-native-runtime-C82aEgn_.js";
import { n as createChannelApprovalHandlerFromCapability } from "./approval-handler-runtime-DOgnayNp.js";
import { i as watchChannelRuntimeContexts, n as getChannelRuntimeContext, t as createTaskScopedChannelRuntime } from "./channel-runtime-context-Bx08uB94.js";
import { n as withPluginHttpRouteRegistry } from "./http-registry-Dbq40xIB.js";
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
		const handler = await createChannelApprovalHandlerFromCapability({
			capability,
			label: `${params.plugin.id}/native-approvals`,
			clientDisplayName: `${channelLabel} Native Approvals (${params.accountId})`,
			channel: params.plugin.id,
			channelLabel,
			cfg: params.cfg,
			accountId: params.accountId,
			context
		});
		if (!handler) return;
		if (generation !== activeGeneration) {
			await handler.stop().catch(() => {});
			return;
		}
		activeHandler = handler;
		try {
			await handler.start();
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
//#region src/gateway/server-channels.ts
const CHANNEL_RESTART_POLICY = {
	initialMs: 5e3,
	maxMs: 5 * 6e4,
	factor: 2,
	jitter: .1
};
const MAX_RESTART_ATTEMPTS = 10;
const CHANNEL_STOP_ABORT_TIMEOUT_MS = 5e3;
const CHANNEL_STARTUP_CONCURRENCY = 4;
function waitForChannelStartupHandoff() {
	return new Promise((resolve) => {
		setImmediate(resolve).unref?.();
	});
}
function sanitizeAbortedTaskStatusPatch(patch, current) {
	const next = { ...patch };
	delete next.running;
	delete next.restartPending;
	delete next.reconnectAttempts;
	delete next.lastStartAt;
	delete next.lastStopAt;
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
		aborts: /* @__PURE__ */ new Map(),
		starting: /* @__PURE__ */ new Map(),
		tasks: /* @__PURE__ */ new Map(),
		runtimes: /* @__PURE__ */ new Map()
	};
}
function resolveDefaultRuntime(channelId) {
	return getChannelPlugin(channelId)?.status?.defaultRuntime ?? { accountId: "default" };
}
function cloneDefaultRuntime(channelId, accountId) {
	return {
		...resolveDefaultRuntime(channelId),
		accountId
	};
}
async function waitForChannelStopGracefully(task, timeoutMs) {
	if (!task) return true;
	return await new Promise((resolve) => {
		let settled = false;
		const timer = setTimeout(() => {
			if (!settled) {
				settled = true;
				resolve(false);
			}
		}, timeoutMs);
		timer.unref?.();
		const resolveSettled = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve(true);
		};
		task.then(resolveSettled, resolveSettled);
	});
}
function applyDescribedAccountFields(next, described) {
	if (!described) {
		next.configured ??= true;
		return next;
	}
	if (typeof described.configured === "boolean") next.configured = described.configured;
	else next.configured ??= true;
	if (described.mode !== void 0) next.mode = described.mode;
	return next;
}
async function waitForDeferredAccountStart(deferred, abortSignal) {
	if (abortSignal.aborted) return;
	await Promise.race([deferred, new Promise((resolve) => {
		abortSignal.addEventListener("abort", () => resolve(), { once: true });
	})]);
}
function createChannelManager(opts) {
	const { getRuntimeConfig, channelLogs, channelRuntimeEnvs, channelRuntime, resolveChannelRuntime, getPluginHttpRouteRegistry, startupTrace } = opts;
	const channelStores = /* @__PURE__ */ new Map();
	const restartAttempts = /* @__PURE__ */ new Map();
	const manuallyStopped = /* @__PURE__ */ new Set();
	const recoveryStopTimedOut = /* @__PURE__ */ new Set();
	const recoveryStartRequested = /* @__PURE__ */ new Set();
	const restartKey = (channelId, accountId) => `${channelId}:${accountId}`;
	const ensureChannelLog = (channelId) => {
		channelLogs[channelId] ??= createSubsystemLogger("channels").child(channelId);
		return channelLogs[channelId];
	};
	const ensureChannelRuntime = (channelId) => {
		channelRuntimeEnvs[channelId] ??= runtimeForLogger(ensureChannelLog(channelId));
		return channelRuntimeEnvs[channelId];
	};
	const resolveAccountHealthMonitorOverride = (channelConfig, accountId) => {
		if (!channelConfig?.accounts) return;
		const direct = resolveAccountEntry(channelConfig.accounts, accountId);
		if (typeof direct?.healthMonitor?.enabled === "boolean") return direct.healthMonitor.enabled;
		const normalizedAccountId = normalizeOptionalAccountId(accountId);
		if (!normalizedAccountId) return;
		const match = resolveNormalizedAccountEntry(channelConfig.accounts, normalizedAccountId, normalizeAccountId);
		if (typeof match?.healthMonitor?.enabled !== "boolean") return;
		return match.healthMonitor.enabled;
	};
	const isHealthMonitorEnabled = (channelId, accountId) => {
		const cfg = getRuntimeConfig();
		const channelConfig = cfg.channels?.[channelId];
		const accountOverride = resolveAccountHealthMonitorOverride(channelConfig, accountId);
		const channelOverride = channelConfig?.healthMonitor?.enabled;
		if (typeof accountOverride === "boolean") return accountOverride;
		if (typeof channelOverride === "boolean") return channelOverride;
		const plugin = getChannelPlugin(channelId);
		if (!plugin) return true;
		try {
			plugin.config.resolveAccount(cfg, accountId);
		} catch (err) {
			ensureChannelLog(channelId).warn?.(`[${channelId}:${accountId}] health-monitor: failed to resolve account; skipping monitor (${formatErrorMessage(err)})`);
			return false;
		}
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
		const next = {
			...getRuntime(channelId, accountId),
			...patch,
			accountId
		};
		store.runtimes.set(accountId, next);
		return next;
	};
	const setRuntimeFromTaskStatus = (channelId, accountId, patch, abortSignal) => {
		return setRuntime(channelId, accountId, abortSignal?.aborted ? sanitizeAbortedTaskStatusPatch(patch, getRuntime(channelId, accountId)) : patch);
	};
	const setStoppedRuntime = (channelId, accountId, patch = {}) => {
		return setRuntime(channelId, accountId, {
			accountId,
			running: false,
			...typeof getRuntime(channelId, accountId).connected === "boolean" ? { connected: false } : {},
			...patch
		});
	};
	const getChannelRuntime = async () => {
		if (channelRuntime) return channelRuntime;
		return await resolveChannelRuntime?.();
	};
	const measureStartup = async (name, run) => {
		return startupTrace ? startupTrace.measure(name, run) : await run();
	};
	const evictStaleChannelAccountState = (channelId, store, accountIds) => {
		const activeAccountIds = new Set(accountIds);
		for (const id of store.runtimes.keys()) {
			if (activeAccountIds.has(id) || store.aborts.has(id) || store.starting.has(id) || store.tasks.has(id)) continue;
			store.runtimes.delete(id);
			restartAttempts.delete(restartKey(channelId, id));
			manuallyStopped.delete(restartKey(channelId, id));
			recoveryStartRequested.delete(restartKey(channelId, id));
		}
	};
	const startChannelInternal = async (channelId, accountId, optsValue = {}) => {
		const plugin = getChannelPlugin(channelId);
		const startAccount = plugin?.gateway?.startAccount;
		if (!startAccount) return;
		const { preserveRestartAttempts = false, preserveManualStop = false } = optsValue;
		const cfg = getRuntimeConfig();
		resetDirectoryCache({
			channel: channelId,
			accountId
		});
		const store = getStore(channelId);
		const accountIds = accountId ? [accountId] : await measureStartup(`channels.${channelId}.list-accounts`, () => plugin.config.listAccountIds(cfg));
		if (!accountId) evictStaleChannelAccountState(channelId, store, accountIds);
		if (accountIds.length === 0) return;
		const startup = await runTasksWithConcurrency({
			limit: CHANNEL_STARTUP_CONCURRENCY,
			tasks: accountIds.map((id) => async () => {
				const rKey = restartKey(channelId, id);
				if (store.tasks.has(id)) {
					if (recoveryStopTimedOut.has(rKey)) {
						if (!preserveManualStop) manuallyStopped.delete(rKey);
						if (manuallyStopped.has(rKey)) return;
						recoveryStartRequested.add(rKey);
						setRuntime(channelId, id, {
							accountId: id,
							restartPending: true
						});
					}
					return;
				}
				const existingStart = store.starting.get(id);
				if (existingStart) {
					await existingStart;
					return;
				}
				let resolveStart;
				const startGate = new Promise((resolve) => {
					resolveStart = resolve;
				});
				store.starting.set(id, startGate);
				const abort = new AbortController();
				store.aborts.set(id, abort);
				let handedOffTask = false;
				const log = ensureChannelLog(channelId);
				const runtime = ensureChannelRuntime(channelId);
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
				try {
					const account = plugin.config.resolveAccount(cfg, id);
					if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) {
						setRuntime(channelId, id, {
							accountId: id,
							enabled: false,
							configured: true,
							running: false,
							restartPending: false,
							lastError: plugin.config.disabledReason?.(account, cfg) ?? "disabled"
						});
						return;
					}
					let configured = true;
					if (plugin.config.isConfigured) configured = await measureStartup(`channels.${channelId}.is-configured`, () => plugin.config.isConfigured(account, cfg));
					if (!configured) {
						setRuntime(channelId, id, {
							accountId: id,
							enabled: true,
							configured: false,
							running: false,
							restartPending: false,
							lastError: plugin.config.unconfiguredReason?.(account, cfg) ?? "not configured"
						});
						return;
					}
					if (!preserveManualStop) manuallyStopped.delete(rKey);
					if (abort.signal.aborted || manuallyStopped.has(rKey)) {
						setStoppedRuntime(channelId, id, {
							restartPending: false,
							lastStopAt: Date.now()
						});
						return;
					}
					scopedChannelRuntime = await measureStartup(`channels.${channelId}.runtime`, async () => createTaskScopedChannelRuntime({ channelRuntime: await getChannelRuntime() }));
					channelRuntimeForTask = scopedChannelRuntime.channelRuntime;
					if (!preserveRestartAttempts) restartAttempts.delete(rKey);
					try {
						stopApprovalBootstrap = await measureStartup(`channels.${channelId}.approval-bootstrap`, () => startChannelApprovalHandlerBootstrap({
							plugin,
							cfg,
							accountId: id,
							channelRuntime: channelRuntimeForTask,
							logger: log
						}));
					} catch (error) {
						log.error?.(`[${id}] native approval bootstrap failed: ${formatErrorMessage(error)}`);
					}
					setRuntime(channelId, id, {
						accountId: id,
						enabled: true,
						configured: true,
						running: true,
						restartPending: false,
						lastStartAt: Date.now(),
						lastError: null,
						reconnectAttempts: preserveRestartAttempts ? restartAttempts.get(rKey) ?? 0 : 0
					});
					const trackedPromise = Promise.resolve().then(async () => {
						if (optsValue.deferAccountStartUntil) await waitForDeferredAccountStart(optsValue.deferAccountStartUntil, abort.signal);
						else if (startupTrace) await waitForChannelStartupHandoff();
						if (abort.signal.aborted || manuallyStopped.has(rKey)) return;
						let startAccountTask;
						await measureStartup(`channels.${channelId}.start-account-handoff`, () => {
							if (abort.signal.aborted || manuallyStopped.has(rKey)) return;
							const runStartAccount = () => startAccount({
								cfg,
								accountId: id,
								account,
								runtime,
								abortSignal: abort.signal,
								log,
								getStatus: () => getRuntime(channelId, id),
								setStatus: (next) => setRuntimeFromTaskStatus(channelId, id, next, abort.signal),
								...channelRuntimeForTask ? { channelRuntime: channelRuntimeForTask } : {}
							});
							const routeRegistry = getPluginHttpRouteRegistry?.();
							startAccountTask = routeRegistry ? withPluginHttpRouteRegistry(routeRegistry, runStartAccount) : runStartAccount();
						});
						if (!startAccountTask) return;
						await startAccountTask;
					}).then(() => {
						if (abort.signal.aborted || manuallyStopped.has(rKey)) return;
						const message = "channel exited without an error";
						setRuntime(channelId, id, {
							accountId: id,
							lastError: message
						});
						log.error?.(`[${id}] ${message}`);
					}).catch((err) => {
						const message = formatErrorMessage(err);
						setRuntime(channelId, id, {
							accountId: id,
							lastError: message
						});
						log.error?.(`[${id}] channel exited: ${message}`);
					}).then(async () => {
						await cleanupTaskScopedApprovalRuntime("channel cleanup failed");
						setStoppedRuntime(channelId, id, { lastStopAt: Date.now() });
					}).then(async () => {
						if (manuallyStopped.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							return;
						}
						if (recoveryStopTimedOut.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							if (!recoveryStartRequested.delete(rKey)) {
								setRuntime(channelId, id, {
									accountId: id,
									restartPending: false,
									reconnectAttempts: 0
								});
								if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
								if (store.aborts.get(id) === abort) store.aborts.delete(id);
								return;
							}
							restartAttempts.delete(rKey);
							log.info?.(`[${id}] restarting after timed-out channel stop completed`);
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: true,
								reconnectAttempts: 0
							});
							if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
							if (store.aborts.get(id) === abort) store.aborts.delete(id);
							try {
								await startChannelInternal(channelId, id, { preserveManualStop: true });
							} catch {}
							return;
						}
						const attempt = (restartAttempts.get(rKey) ?? 0) + 1;
						restartAttempts.set(rKey, attempt);
						if (attempt > MAX_RESTART_ATTEMPTS) {
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: false,
								reconnectAttempts: attempt
							});
							log.error?.(`[${id}] giving up after ${MAX_RESTART_ATTEMPTS} restart attempts`);
							return;
						}
						const delayMs = computeBackoff(CHANNEL_RESTART_POLICY, attempt);
						log.info?.(`[${id}] auto-restart attempt ${attempt}/${MAX_RESTART_ATTEMPTS} in ${Math.round(delayMs / 1e3)}s`);
						setRuntime(channelId, id, {
							accountId: id,
							restartPending: true,
							reconnectAttempts: attempt
						});
						try {
							await sleepWithAbort(delayMs, abort.signal);
							if (manuallyStopped.has(rKey)) return;
							if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
							if (store.aborts.get(id) === abort) store.aborts.delete(id);
							await startChannelInternal(channelId, id, {
								preserveRestartAttempts: true,
								preserveManualStop: true
							});
						} catch {}
					}).finally(() => {
						if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
						if (store.aborts.get(id) === abort) store.aborts.delete(id);
					});
					handedOffTask = true;
					store.tasks.set(id, trackedPromise);
				} catch (error) {
					if (!handedOffTask) setStoppedRuntime(channelId, id, {
						restartPending: false,
						lastError: formatErrorMessage(error)
					});
					throw error;
				} finally {
					resolveStart?.();
					if (store.starting.get(id) === startGate) store.starting.delete(id);
					if (!handedOffTask) await cleanupTaskScopedApprovalRuntime("channel startup cleanup failed");
					if (!handedOffTask && store.aborts.get(id) === abort) store.aborts.delete(id);
				}
			})
		});
		if (startup.hasError) throw startup.firstError;
	};
	const startChannel = async (channelId, accountId) => {
		await startChannelInternal(channelId, accountId);
	};
	const stopChannel = async (channelId, accountId, optsLocal = {}) => {
		const manual = optsLocal.manual ?? true;
		const plugin = getChannelPlugin(channelId);
		const store = getStore(channelId);
		const lifecycleIds = new Set([
			...store.aborts.keys(),
			...store.starting.keys(),
			...store.tasks.keys()
		]);
		if (!accountId && lifecycleIds.size === 0) return;
		if (!plugin?.gateway?.stopAccount && lifecycleIds.size === 0) return;
		const cfg = getRuntimeConfig();
		const knownIds = new Set([...lifecycleIds, ...plugin ? plugin.config.listAccountIds(cfg) : []]);
		if (accountId) {
			knownIds.clear();
			knownIds.add(accountId);
		}
		await Promise.all(Array.from(knownIds.values()).map(async (id) => {
			const abort = store.aborts.get(id);
			const task = store.tasks.get(id);
			if (!abort && !task && !plugin?.gateway?.stopAccount) return;
			const rKey = restartKey(channelId, id);
			if (manual) manuallyStopped.add(rKey);
			abort?.abort();
			const log = ensureChannelLog(channelId);
			const runtime = ensureChannelRuntime(channelId);
			if (plugin?.gateway?.stopAccount) {
				const account = plugin.config.resolveAccount(cfg, id);
				await plugin.gateway.stopAccount({
					cfg,
					accountId: id,
					account,
					runtime,
					abortSignal: abort?.signal ?? new AbortController().signal,
					log,
					getStatus: () => getRuntime(channelId, id),
					setStatus: (next) => setRuntime(channelId, id, next)
				});
			}
			if (!await waitForChannelStopGracefully(task, CHANNEL_STOP_ABORT_TIMEOUT_MS)) {
				log.warn?.(`[${id}] channel stop exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms after abort; continuing shutdown`);
				const stoppedPatch = {
					restartPending: !manual,
					lastError: `channel stop timed out after ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms`
				};
				if (manual) setRuntime(channelId, id, {
					accountId: id,
					running: true,
					...stoppedPatch
				});
				else setStoppedRuntime(channelId, id, stoppedPatch);
				if (!manual) recoveryStopTimedOut.add(rKey);
				return;
			}
			recoveryStopTimedOut.delete(rKey);
			recoveryStartRequested.delete(rKey);
			store.aborts.delete(id);
			store.tasks.delete(id);
			setStoppedRuntime(channelId, id, {
				restartPending: false,
				lastStopAt: Date.now()
			});
		}));
	};
	const startChannels = async () => {
		let releaseAccountStarts;
		const deferAccountStartUntil = opts.deferStartupAccountStartsUntil ?? (startupTrace ? new Promise((resolve) => {
			releaseAccountStarts = () => {
				setImmediate(resolve).unref?.();
			};
		}) : void 0);
		try {
			await runTasksWithConcurrency({
				limit: CHANNEL_STARTUP_CONCURRENCY,
				tasks: [...listChannelPlugins()].map((plugin) => async () => {
					try {
						await measureStartup(`channels.${plugin.id}.start`, () => startChannelInternal(plugin.id, void 0, deferAccountStartUntil ? { deferAccountStartUntil } : {}));
					} catch (err) {
						ensureChannelLog(plugin.id).error?.(`[${plugin.id}] channel startup failed: ${formatErrorMessage(err)}`);
					}
				})
			});
		} finally {
			releaseAccountStarts?.();
		}
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
		const next = {
			accountId: resolvedId,
			running: false,
			restartPending: false,
			lastError: cleared ? "logged out" : current.lastError
		};
		if (typeof current.connected === "boolean") next.connected = false;
		setRuntime(channelId, resolvedId, next);
	};
	const getRuntimeSnapshot = () => {
		const cfg = getRuntimeConfig();
		const channels = {};
		const channelAccounts = {};
		for (const plugin of listChannelPlugins()) {
			const store = getStore(plugin.id);
			const accountIds = plugin.config.listAccountIds(cfg);
			const defaultAccountId = resolveChannelDefaultAccountId({
				plugin,
				cfg,
				accountIds
			});
			const accounts = {};
			for (const id of accountIds) {
				const account = plugin.config.resolveAccount(cfg, id);
				const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account);
				const described = plugin.config.describeAccount?.(account, cfg);
				const next = {
					...store.runtimes.get(id) ?? cloneDefaultRuntime(plugin.id, id),
					accountId: id
				};
				next.enabled = enabled;
				applyDescribedAccountFields(next, described);
				const configured = described?.configured;
				if (!next.running) {
					if (!enabled) next.lastError ??= plugin.config.disabledReason?.(account, cfg) ?? "disabled";
					else if (configured === false) next.lastError ??= plugin.config.unconfiguredReason?.(account, cfg) ?? "not configured";
				}
				accounts[id] = next;
			}
			const defaultAccount = accounts[defaultAccountId] ?? cloneDefaultRuntime(plugin.id, defaultAccountId);
			channels[plugin.id] = defaultAccount;
			channelAccounts[plugin.id] = accounts;
		}
		return {
			channels,
			channelAccounts
		};
	};
	const isManuallyStoppedFlag = (channelId, accountId) => {
		return manuallyStopped.has(restartKey(channelId, accountId));
	};
	const resetRestartAttemptsForTest = (channelId, accountId) => {
		restartAttempts.delete(restartKey(channelId, accountId));
	};
	return {
		getRuntimeSnapshot,
		startChannels,
		startChannel,
		stopChannel,
		markChannelLoggedOut,
		isManuallyStopped: isManuallyStoppedFlag,
		resetRestartAttempts: resetRestartAttemptsForTest,
		isHealthMonitorEnabled
	};
}
//#endregion
export { createChannelManager };
