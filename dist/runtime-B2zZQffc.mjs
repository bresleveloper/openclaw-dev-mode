import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton, t as drainGlobalSingletonLifecycleState } from "./global-singleton-Dc_stLtU.mjs";
import { c as trackAsyncWork, i as isAsyncWorkScopeActiveHere, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { c as runPluginCleanup } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState } from "./registry-lookup-CHpIYnmq.mjs";
import { f as onAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { _ as markPluginRegistryActive, b as quiescePluginRegistry, h as isPluginRegistryRetired, t as adoptPluginRegistryRecords, u as getPluginRegistryResourceOwner, v as markPluginRegistryRetired, y as preparePluginRegistryCacheShutdown } from "./registry-lifecycle-xdpzLZzd.mjs";
import { n as withPluginHostCleanupTimeout } from "./host-hook-cleanup-timeout-CuGfY1se.mjs";
import { a as listLoadedChannelPluginsForRegistry } from "./registry-loaded-CYq2sa_C.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/command-execution-lock.ts
/** Per-registry command execution admission and retirement drain. */
const executionStates = /* @__PURE__ */ new WeakMap();
const executionContext = new AsyncLocalStorage();
function getExecutionState(registry) {
	const existing = executionStates.get(registry);
	if (existing) return existing;
	const created = {
		count: 0,
		waiters: []
	};
	executionStates.set(registry, created);
	return created;
}
function getPluginCommandExecutionCount(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return executionStates.get(registry)?.count ?? 0;
}
function beginPluginCommandExecution(registry) {
	if (isPluginRegistryRetired(registry)) return false;
	getExecutionState(registry).count += 1;
	return true;
}
function endPluginCommandExecution(registry) {
	const state = getExecutionState(registry);
	if (state.count <= 0) throw new Error("Plugin command execution lock is unbalanced.");
	state.count -= 1;
	if (state.count !== 0) return;
	const waiters = state.waiters.splice(0);
	for (const resolve of waiters) resolve();
}
function isPluginCommandExecutionActiveHere(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return [...executionContext.getStore() ?? []].some((token) => token.registry === registry && token.active);
}
async function withPluginCommandExecution(registryView, run) {
	const registry = getPluginRegistryResourceOwner(registryView);
	if (!beginPluginCommandExecution(registry)) return { admitted: false };
	const token = {
		registry,
		active: true
	};
	const active = new Set([...executionContext.getStore() ?? []].filter((inherited) => inherited.registry !== registry));
	active.add(token);
	try {
		return {
			admitted: true,
			value: await executionContext.run(active, run)
		};
	} finally {
		token.active = false;
		endPluginCommandExecution(registry);
	}
}
async function waitForPluginCommandExecutions(registryView) {
	const state = getExecutionState(getPluginRegistryResourceOwner(registryView));
	if (state.count === 0) return;
	await new Promise((resolve) => {
		state.waiters.push(resolve);
	});
}
//#endregion
//#region src/plugins/host-hook-runtime.ts
const PLUGIN_HOST_RUNTIME_STATE_KEY = Symbol.for("openclaw.pluginHostRuntimeState");
const TRACKED_RUN_IDS_MAX = 512;
const PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS = 5e3;
const log$1 = createSubsystemLogger("plugins/host-hooks");
function getPluginHostRuntimeState() {
	return resolveGlobalSingleton(PLUGIN_HOST_RUNTIME_STATE_KEY, () => ({
		runContextByRunId: /* @__PURE__ */ new Map(),
		schedulerJobsByPlugin: /* @__PURE__ */ new Map(),
		nextSchedulerJobGeneration: 1,
		pendingAgentEventHandlersByRunId: /* @__PURE__ */ new Map(),
		closedRunIds: /* @__PURE__ */ new Set(),
		terminalEventCleanupExpiredRunIds: /* @__PURE__ */ new Set()
	}));
}
const runContextCleanup = resolveGlobalSingleton(Symbol.for("openclaw.pluginRunContextCleanup"), () => new AsyncLocalStorage());
function getPluginRunContexts() {
	return runContextCleanup.getStore()?.contexts ?? getPluginHostRuntimeState().runContextByRunId;
}
function normalizeNamespace(value) {
	return (value ?? "").trim();
}
function rememberBoundedRunId(runIds, runId) {
	runIds.delete(runId);
	runIds.add(runId);
	while (runIds.size > TRACKED_RUN_IDS_MAX) {
		const oldest = runIds.values().next().value;
		if (oldest === void 0) break;
		runIds.delete(oldest);
	}
}
function trackAgentEventHandler(runId, pending) {
	const state = getPluginHostRuntimeState();
	const handlers = state.pendingAgentEventHandlersByRunId.get(runId) ?? /* @__PURE__ */ new Set();
	handlers.add(pending);
	state.pendingAgentEventHandlersByRunId.set(runId, handlers);
	pending.finally(() => {
		handlers.delete(pending);
		if (handlers.size === 0 && getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.get(runId) === handlers) state.pendingAgentEventHandlersByRunId.delete(runId);
	});
}
async function waitForLiveTerminalEventHandlers(runId) {
	for (;;) {
		const pendingHandlers = getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.get(runId);
		if (!pendingHandlers || pendingHandlers.size === 0) return "settled";
		await Promise.allSettled(pendingHandlers);
	}
}
function waitForTerminalEventHandlers(runId) {
	let timeout;
	const settled = waitForLiveTerminalEventHandlers(runId);
	const timedOut = new Promise((resolve) => {
		timeout = setTimeout(() => {
			rememberBoundedRunId(getPluginHostRuntimeState().terminalEventCleanupExpiredRunIds, runId);
			getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.delete(runId);
			log$1.warn(`plugin terminal agent event subscriptions still running after ${PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS}ms; clearing run context without waiting for them to settle`);
			resolve("timeout");
		}, PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS);
	});
	if (timeout) timeout.unref?.();
	return Promise.race([settled, timedOut]).then(() => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
	});
}
function getPluginRunContextNamespaces(runId, pluginId, create = false) {
	const contexts = getPluginRunContexts();
	let byPlugin = contexts.get(runId);
	if (!byPlugin && create) {
		byPlugin = /* @__PURE__ */ new Map();
		contexts.set(runId, byPlugin);
	}
	if (!byPlugin) return;
	let namespaces = byPlugin.get(pluginId);
	if (create) {
		namespaces = new Map(namespaces);
		byPlugin.set(pluginId, namespaces);
	}
	return namespaces;
}
/** Stores JSON-compatible plugin run context for one run/plugin/namespace tuple. */
function setPluginRunContext(params) {
	const runId = normalizeOptionalString(params.patch.runId);
	const namespace = normalizeNamespace(params.patch.namespace);
	if (!runId || !namespace) return false;
	if (!params.allowClosedRun && getPluginHostRuntimeState().closedRunIds.has(runId)) return false;
	if (params.patch.unset === true) {
		clearPluginRunContext({
			pluginId: params.pluginId,
			runId,
			namespace
		});
		return true;
	}
	if (params.patch.value === void 0 || !isPluginJsonValue(params.patch.value)) return false;
	getPluginRunContextNamespaces(runId, params.pluginId, true)?.set(namespace, structuredClone(params.patch.value));
	return true;
}
/** Reads previously stored plugin run context for one run/plugin/namespace tuple. */
function getPluginRunContext(params) {
	const runId = normalizeOptionalString(params.get.runId);
	const namespace = normalizeNamespace(params.get.namespace);
	if (!runId || !namespace) return;
	const value = getPluginRunContextNamespaces(runId, params.pluginId)?.get(namespace);
	return value === void 0 ? void 0 : structuredClone(value);
}
function capturePluginRunContextCleanup() {
	const current = runContextCleanup.getStore();
	if (current) return current;
	const source = getPluginRunContexts();
	return {
		source,
		contexts: new Map(Array.from(source, ([runId, byPlugin]) => [runId, new Map(byPlugin)])),
		owners: new Set(Array.from(source.values()).flatMap((byPlugin) => Array.from(byPlugin.values())))
	};
}
/** Capture before publication or drains can replace the retiring namespace bindings. */
function preparePluginRunContextCleanup() {
	const scope = capturePluginRunContextCleanup();
	return (run) => runContextCleanup.run(scope, run);
}
/** Cleanup owns a private view across awaits; later serving writes keep their own bindings. */
function withPluginRunContextCleanup(params, run) {
	const scope = capturePluginRunContextCleanup();
	return runContextCleanup.run(scope, () => run(() => clearPluginRunContextState(params, scope.owners, scope.source)));
}
function clearPluginRunContext(params) {
	clearPluginRunContextState(params);
}
function clearPluginRunContextState(params, owners, contexts = getPluginRunContexts()) {
	const namespaceFilter = (params.namespace !== void 0 ? normalizeNamespace(params.namespace) : void 0) || void 0;
	const state = getPluginHostRuntimeState();
	const runIds = params.runId ? [params.runId] : [...contexts.keys()];
	for (const runId of runIds) {
		const byPlugin = contexts.get(runId);
		if (!byPlugin) continue;
		const pluginIds = params.pluginId ? [params.pluginId] : [...byPlugin.keys()];
		for (const pluginId of pluginIds) {
			let namespaces = byPlugin.get(pluginId);
			if (!namespaces || owners && !owners.has(namespaces)) continue;
			if (namespaceFilter !== void 0) {
				namespaces = new Map(namespaces);
				namespaces.delete(namespaceFilter);
				byPlugin.set(pluginId, namespaces);
			}
			if (namespaceFilter === void 0 || namespaces.size === 0) byPlugin.delete(pluginId);
		}
		if (byPlugin.size === 0) contexts.delete(runId);
	}
	if (contexts === state.runContextByRunId && params.runId && !params.pluginId && namespaceFilter === void 0) state.pendingAgentEventHandlersByRunId.delete(params.runId);
}
function isTerminalAgentRunEvent(event) {
	const phase = event.data?.phase;
	return event.stream === "lifecycle" && (phase === "end" || phase === "error");
}
function logAgentEventSubscriptionFailure(pluginId, subscriptionId, error) {
	log$1.warn(`plugin agent event subscription failed: plugin=${pluginId} subscription=${subscriptionId} error=${String(error)}`);
}
function dispatchPluginAgentEventSubscriptions(params) {
	const subscriptions = params.registry?.agentEventSubscriptions ?? [];
	const isTerminalEvent = isTerminalAgentRunEvent(params.event);
	for (const registration of subscriptions) {
		const streams = registration.subscription.streams;
		if (streams && streams.length > 0 && !streams.includes(params.event.stream)) continue;
		const pluginId = registration.pluginId;
		const runId = params.event.runId;
		let handlerActive = true;
		const ctx = {
			getRunContext: ((namespace) => params.isLive() ? getPluginRunContext({
				pluginId,
				get: {
					runId,
					namespace
				}
			}) : void 0),
			setRunContext: (namespace, value) => {
				if (!params.isLive()) return;
				setPluginRunContext({
					pluginId,
					patch: {
						runId,
						namespace,
						value
					},
					allowClosedRun: isTerminalEvent && handlerActive && !getPluginHostRuntimeState().terminalEventCleanupExpiredRunIds.has(runId)
				});
			},
			clearRunContext: (namespace) => {
				if (!params.isLive()) return;
				clearPluginRunContext({
					pluginId,
					runId,
					namespace
				});
			}
		};
		try {
			trackAgentEventHandler(runId, Promise.resolve(registration.subscription.handle(structuredClone(params.event), ctx)).catch((error) => {
				logAgentEventSubscriptionFailure(pluginId, registration.subscription.id, error);
			}).finally(() => {
				handlerActive = false;
			}));
		} catch (error) {
			handlerActive = false;
			logAgentEventSubscriptionFailure(pluginId, registration.subscription.id, error);
		}
	}
	if (isTerminalEvent) {
		rememberBoundedRunId(getPluginHostRuntimeState().closedRunIds, params.event.runId);
		waitForTerminalEventHandlers(params.event.runId).then(() => {
			clearPluginRunContext({ runId: params.event.runId });
		});
	}
}
function registerPluginSessionSchedulerJob(params) {
	const id = normalizeOptionalString(params.job.id);
	const sessionKey = normalizeOptionalString(params.job.sessionKey);
	const kind = normalizeOptionalString(params.job.kind);
	if (!id || !sessionKey || !kind) return;
	const state = getPluginHostRuntimeState();
	const jobs = state.schedulerJobsByPlugin.get(params.pluginId) ?? /* @__PURE__ */ new Map();
	const generation = state.nextSchedulerJobGeneration++;
	jobs.set(id, {
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		job: {
			...params.job,
			id,
			sessionKey,
			kind
		},
		generation,
		...params.ownerRegistry ? { ownerRegistry: params.ownerRegistry } : {}
	});
	state.schedulerJobsByPlugin.set(params.pluginId, jobs);
	return {
		id,
		pluginId: params.pluginId,
		sessionKey,
		kind
	};
}
/** Publish collected jobs and transfer dynamic jobs without rotating retained instances. */
function publishPluginSessionSchedulerJobs(registry) {
	const state = getPluginHostRuntimeState();
	for (const [pluginId, jobs] of state.schedulerJobsByPlugin) {
		const retained = registry.plugins.find((record) => record.id === pluginId);
		for (const job of jobs.values()) if (retained && job.ownerRegistry?.plugins.includes(retained)) job.ownerRegistry = registry;
	}
	for (const registration of registry.sessionSchedulerJobs) {
		if (registration.generation !== void 0) continue;
		registerPluginSessionSchedulerJob({
			...registration,
			ownerRegistry: registry
		});
		registration.generation = getPluginSessionSchedulerJobGeneration({
			pluginId: registration.pluginId,
			jobId: registration.job.id,
			sessionKey: registration.job.sessionKey
		});
	}
}
function deletePluginSessionSchedulerJob(params) {
	const state = getPluginHostRuntimeState();
	const jobs = state.schedulerJobsByPlugin.get(params.pluginId);
	const record = jobs?.get(params.jobId);
	if (!jobs || !record) return;
	if (params.sessionKey && record.job.sessionKey !== params.sessionKey) return;
	if (params.expectedGeneration !== void 0 && record.generation !== params.expectedGeneration) return;
	jobs.delete(params.jobId);
	if (jobs.size === 0) state.schedulerJobsByPlugin.delete(params.pluginId);
}
function getPluginSessionSchedulerJobGeneration(params) {
	const record = getPluginHostRuntimeState().schedulerJobsByPlugin.get(params.pluginId)?.get(params.jobId);
	if (!record) return;
	if (params.sessionKey && record.job.sessionKey !== params.sessionKey) return;
	return record.generation;
}
function makePluginSessionSchedulerJobKey(pluginId, jobId) {
	return JSON.stringify([pluginId, jobId]);
}
async function cleanupPluginSessionSchedulerJobs(params) {
	const state = getPluginHostRuntimeState();
	const failures = [];
	const shouldCleanup = params.shouldCleanup ?? (() => true);
	if (!shouldCleanup()) return failures;
	const cleanupJob = async (pluginId, jobId, record, registeredSessionKey) => {
		const hookId = `scheduler:${jobId}`;
		try {
			await withPluginHostCleanupTimeout(hookId, () => runPluginCleanup(record.job.cleanup ?? record.job, () => record.job.cleanup?.({
				reason: params.reason,
				sessionKey: registeredSessionKey ?? record.job.sessionKey,
				jobId
			})));
		} catch (error) {
			failures.push({
				pluginId,
				hookId,
				error
			});
			return;
		}
		if (shouldCleanup()) deletePluginSessionSchedulerJob({
			pluginId,
			jobId,
			sessionKey: registeredSessionKey,
			expectedGeneration: record.generation
		});
	};
	const registryRecordKeys = /* @__PURE__ */ new Set();
	const schedulerJobKey = (pluginId, jobId, sessionKey) => `${pluginId}\0${jobId}\0${sessionKey}`;
	if (params.records) for (const record of params.records) {
		if (!shouldCleanup()) return failures;
		if (params.pluginId && record.pluginId !== params.pluginId) continue;
		const jobId = normalizeOptionalString(record.job.id);
		const sessionKey = normalizeOptionalString(record.job.sessionKey);
		if (!jobId || !sessionKey) continue;
		if (params.sessionKey && sessionKey !== params.sessionKey) continue;
		const liveGeneration = getPluginSessionSchedulerJobGeneration({
			pluginId: record.pluginId,
			jobId,
			sessionKey
		});
		if (record.generation === void 0 || liveGeneration === void 0) continue;
		if (params.preserveJobIds?.has(jobId) ?? false) continue;
		if (liveGeneration === record.generation) registryRecordKeys.add(schedulerJobKey(record.pluginId, jobId, sessionKey));
		await cleanupJob(record.pluginId, jobId, record, sessionKey);
	}
	const pluginIds = params.pluginId ? [params.pluginId] : [...state.schedulerJobsByPlugin.keys()];
	for (const pluginId of pluginIds) {
		if (!shouldCleanup()) return failures;
		const jobs = state.schedulerJobsByPlugin.get(pluginId);
		if (!jobs) continue;
		for (const [jobId, record] of jobs.entries()) {
			if (!shouldCleanup()) return failures;
			if (params.sessionKey && record.job.sessionKey !== params.sessionKey) continue;
			if (params.cleanupOwnerRegistry !== void 0 && record.ownerRegistry !== params.cleanupOwnerRegistry) continue;
			if (registryRecordKeys.has(schedulerJobKey(pluginId, jobId, record.job.sessionKey))) continue;
			if (params.preserveOwnerRegistry !== void 0 && record.ownerRegistry === params.preserveOwnerRegistry) continue;
			if (params.excludeJobKeys?.has(makePluginSessionSchedulerJobKey(pluginId, jobId))) continue;
			if (params.preserveJobIds?.has(jobId)) continue;
			await cleanupJob(pluginId, jobId, record);
		}
	}
	return failures;
}
function clearPluginHostRuntimeState(params) {
	clearPluginRunContext(params ?? {});
	if (params?.pluginId) getPluginHostRuntimeState().schedulerJobsByPlugin.delete(params.pluginId);
	else if (!params?.runId) {
		const state = getPluginHostRuntimeState();
		state.schedulerJobsByPlugin.clear();
		state.pendingAgentEventHandlersByRunId.clear();
		state.closedRunIds.clear();
		state.terminalEventCleanupExpiredRunIds.clear();
	}
}
//#endregion
//#region src/plugins/prepared-message-tool-catalog.ts
/** Registry-owned message-tool metadata prepared once per channel registry generation. */
const catalogsByRegistry = /* @__PURE__ */ new WeakMap();
function selectedRegistry(snapshot) {
	return snapshot.registry ?? void 0;
}
/** Settles the catalog after the process-root registry changes. */
function settlePreparedMessageToolCatalog(preparedRegistry, preparedVersion) {
	const snapshot = preparedRegistry && preparedVersion !== void 0 ? void 0 : getActivePluginChannelRegistrySnapshotFromState();
	const registry = preparedRegistry ?? (snapshot ? selectedRegistry(snapshot) : void 0);
	if (!registry) return;
	const version = preparedVersion ?? snapshot?.version ?? 0;
	const existing = catalogsByRegistry.get(registry);
	if (existing?.version === version) return existing;
	const channels = Object.freeze(listLoadedChannelPluginsForRegistry(registry).map((plugin) => Object.freeze({
		id: plugin.id,
		...plugin.actions ? { actions: plugin.actions } : {},
		reconcilesUnknownSend: plugin.message?.durableFinal?.capabilities?.reconcileUnknownSend === true && typeof plugin.message.durableFinal.reconcileUnknownSend === "function"
	})));
	const byId = new Map(channels.map((entry) => [entry.id, entry]));
	const catalog = Object.freeze({
		version,
		channels,
		getChannel: (id) => byId.get(id)
	});
	catalogsByRegistry.set(registry, catalog);
	return catalog;
}
/** Returns the catalog for the active channel generation without rebuilding it. */
function getPreparedMessageToolCatalog() {
	const snapshot = getActivePluginChannelRegistrySnapshotFromState();
	const registry = selectedRegistry(snapshot);
	if (!registry) return;
	const catalog = catalogsByRegistry.get(registry);
	return catalog?.version === snapshot.version ? catalog : void 0;
}
/** Returns the latest catalog settled for this runtime registry. */
function getPreparedMessageToolCatalogForRegistry(registry) {
	return catalogsByRegistry.get(registry);
}
//#endregion
//#region src/plugins/runtime.ts
const log = createSubsystemLogger("plugins/runtime");
const retirements = resolveGlobalSingleton(Symbol.for("openclaw.pluginRegistryRetirements"), () => /* @__PURE__ */ new WeakMap());
const registryOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginRegistryOwners"), () => /* @__PURE__ */ new Set());
const loadMemoryRuntime = createLazyRuntimeModule(() => import("./memory-runtime-C0Z6eTr_.mjs"));
const state = resolveGlobalSingleton(PLUGIN_REGISTRY_STATE, () => ({
	activeRegistry: null,
	activeVersion: 0,
	key: null,
	workspaceDir: null,
	runtimeSubagentMode: "default",
	importedPluginIds: /* @__PURE__ */ new Set()
}));
const registryVersions = state.registryVersions ??= /* @__PURE__ */ new WeakMap();
function registryHasPluginHostCleanupWork(registry) {
	return registry.plugins.some((plugin) => plugin.status === "loaded" || plugin.status === "error") || registry.sessionExtensions.length > 0 || registry.runtimeLifecycles.length > 0 || registry.agentEventSubscriptions.length > 0 || registry.sessionSchedulerJobs.length > 0;
}
function isRegistryLive(registry) {
	return state.activeRegistry === registry || [...registryOwners].some((owner) => owner.activeRegistry === registry);
}
const loadPluginHostCleanupRuntime = createLazyRuntimeModule(() => import("./host-hook-cleanup-Cw-M4muH.mjs"));
function completedPluginRegistryRetirement(result) {
	return async () => ({
		...result,
		failures: [...result.failures]
	});
}
/** Candidate retirement releases resources without changing committed session state. */
function disposePluginRegistryInstances(registryView, retained, options) {
	const registry = getPluginRegistryResourceOwner(registryView);
	let wait = retirements.get(registry);
	if (!wait) {
		const cfg = options?.cfg ?? getRuntimeConfigSnapshot() ?? void 0;
		const runContextCleanup = options?.runContextCleanup ?? preparePluginRunContextCleanup();
		const initialized = trackAsyncWork(() => runContextCleanup(() => Promise.resolve().then(() => waitForPluginCommandExecutions(registry)).then(() => options?.beforeDispose?.()).then(loadPluginHostCleanupRuntime).then(({ createPluginHostRegistryRetirement }) => {
			if (retirements.get(registry) !== wait) return;
			if (options?.cleanupPersistentState && isRegistryLive(registry)) {
				retirements.delete(registry);
				return;
			}
			markPluginRegistryRetired(registry);
			return createPluginHostRegistryRetirement({
				cfg,
				previousRegistry: registry,
				nextRegistry: typeof retained === "function" ? retained() : retained,
				skipPersistentSessionState: options?.cleanupPersistentState !== true,
				shouldCleanup: options?.cleanupPersistentState ? () => !isRegistryLive(registry) : void 0
			});
		})));
		wait = async (observation) => await (await initialized)?.(observation) ?? {
			cleanupCount: 0,
			failures: []
		};
		retirements.set(registry, wait);
		quiescePluginRegistry(registry);
		pluginInstanceInvocation.exit(wait).then((result) => {
			if (retirements.get(registry) === wait) retirements.set(registry, completedPluginRegistryRetirement(result));
		}).catch((error) => log.warn(`plugin host registry cleanup failed: ${String(error)}`));
	}
	return wait();
}
function preparePluginRegistryRetirement(registry, retained = () => state.activeRegistry, cleanupPersistentState = true) {
	if (!registry) return;
	const runContextCleanup = preparePluginRunContextCleanup();
	const work = new AsyncWorkScope();
	const completion = createDeferredCore();
	const pending = state.retiredRegistryCleanups ??= /* @__PURE__ */ new Map();
	pending.set(completion.promise, {
		registry,
		work
	});
	const release = () => {
		pending.delete(completion.promise);
		completion.resolve();
	};
	const cleanup = async () => {
		try {
			await work.track(async () => {
				if (registryHasPluginHostCleanupWork(registry)) await disposePluginRegistryInstances(registry, retained, {
					cleanupPersistentState,
					runContextCleanup
				});
				else {
					await waitForPluginCommandExecutions(registry);
					if (!isRegistryLive(registry)) markPluginRegistryRetired(registry);
				}
			});
		} finally {
			await work.drain();
		}
	};
	return {
		release,
		retireIfUnused() {
			if (isRegistryLive(registry)) {
				release();
				return;
			}
			quiescePluginRegistry(registry);
			cleanup().catch((error) => {
				log.warn(`plugin host registry cleanup failed: ${String(error)}`);
			}).then(release);
		}
	};
}
function retirePluginRegistryIfUnused(registry, retained = () => state.activeRegistry) {
	preparePluginRegistryRetirement(registry, retained)?.retireIfUnused();
}
/** Lifecycle callers observe the same teardown that publication started. */
async function waitForPluginRegistryRetirement(registry, options) {
	return await retirements.get(getPluginRegistryResourceOwner(registry))?.(options) ?? {
		cleanupCount: 0,
		failures: []
	};
}
function syncPluginAgentEventBridge() {
	state.agentEventBridgeUnsubscribe?.();
	state.agentEventBridgeUnsubscribe = void 0;
	const registry = state.activeRegistry;
	if (!registry) return;
	const version = state.activeVersion;
	state.agentEventBridgeUnsubscribe = onAgentEvent((event) => {
		dispatchPluginAgentEventSubscriptions({
			registry,
			event,
			isLive: () => state.activeRegistry === registry && state.activeVersion === version
		});
	});
}
function recordImportedPluginId(pluginId) {
	state.importedPluginIds.add(pluginId);
}
function setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode = "default", workspaceDir) {
	installActivePluginRegistry({
		activeRegistry: registry,
		key: cacheKey ?? null,
		runtimeSubagentMode,
		workspaceDir: workspaceDir ?? null
	});
}
function stageActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir) {
	return installActivePluginRegistry({
		activeRegistry: registry,
		key: cacheKey,
		runtimeSubagentMode,
		workspaceDir: workspaceDir ?? null,
		retirePrevious: false
	});
}
function commitStagedPluginRegistry(previousRegistry, registry) {
	if (state.activeRegistry === registry) retirePluginRegistryIfUnused(previousRegistry);
}
function captureActivePluginRegistrySnapshot() {
	return {
		activeRegistry: state.activeRegistry,
		key: state.key,
		runtimeSubagentMode: state.runtimeSubagentMode,
		workspaceDir: state.workspaceDir
	};
}
function restoreActivePluginRegistrySnapshot(snapshot) {
	installActivePluginRegistry(snapshot);
}
/** Rolls back a staged registry without reactivating the prior committed generation. */
function rollbackStagedPluginRegistry(snapshot, retainedRegistry = snapshot.activeRegistry) {
	const candidate = state.activeRegistry;
	const retirement = candidate !== snapshot.activeRegistry ? preparePluginRegistryRetirement(candidate, () => retainedRegistry, false) : void 0;
	try {
		const installedVersion = installActivePluginRegistry({
			...snapshot,
			activateRegistry: false,
			retirePrevious: false
		});
		adoptPluginRegistryRecords(retainedRegistry);
		return installedVersion;
	} finally {
		retirement?.retireIfUnused();
	}
}
function installActivePluginRegistry(params) {
	const previousSnapshot = captureActivePluginRegistrySnapshot();
	const registry = params.activeRegistry;
	const retirement = previousSnapshot.activeRegistry !== registry ? preparePluginRegistryRetirement(previousSnapshot.activeRegistry) : void 0;
	state.activeRegistry = registry;
	const installedVersion = ++state.activeVersion;
	if (registry) registryVersions.set(registry, installedVersion);
	state.key = params.key;
	state.workspaceDir = params.workspaceDir;
	state.runtimeSubagentMode = params.runtimeSubagentMode;
	if (registry && previousSnapshot.activeRegistry !== registry) retirements.delete(registry);
	const isCurrent = () => state.activeRegistry === registry && state.activeVersion === installedVersion;
	try {
		if (params.activateRegistry !== false) markPluginRegistryActive(registry);
		else adoptPluginRegistryRecords(registry);
		if (!isCurrent()) return installedVersion;
		if (registry) {
			publishPluginSessionSchedulerJobs(registry);
			if (!isCurrent()) return installedVersion;
			settlePreparedMessageToolCatalog(registry, installedVersion);
		} else settlePreparedMessageToolCatalog();
		if (!isCurrent()) return installedVersion;
		syncPluginAgentEventBridge();
	} catch (error) {
		if (params.retirePrevious === false && isCurrent()) rollbackStagedPluginRegistry(previousSnapshot);
		throw error;
	} finally {
		if (params.retirePrevious === false && isCurrent()) retirement?.release();
		else retirement?.retireIfUnused();
	}
	return installedVersion;
}
/** Each Gateway owns its current registry; the process default is only a lookup projection. */
function createPluginRegistryOwner(registry, workspaceDir) {
	const owner = {
		key: null,
		runtimeSubagentMode: "gateway-bindable",
		workspaceDir: workspaceDir ?? null,
		...state.activeRegistry === registry ? captureActivePluginRegistrySnapshot() : {},
		activeRegistry: registry
	};
	registryOwners.add(owner);
	return {
		get registry() {
			return owner.activeRegistry;
		},
		publish(next) {
			if (owner.closing || !registryOwners.has(owner) || state.activeRegistry !== next) throw new Error("Plugin registry publication requires a live owner and active candidate");
			const previous = owner.activeRegistry;
			Object.assign(owner, captureActivePluginRegistrySnapshot());
			retirePluginRegistryIfUnused(previous, () => registryOwners.has(owner) ? owner.activeRegistry : null);
		},
		close(onRetirement) {
			if (owner.closing && !owner.closing.failure) return owner.closing.promise;
			const closing = { promise: Promise.resolve().then(async () => {
				const previous = owner.activeRegistry;
				const retainedMemory = () => {
					const openOwners = [...registryOwners].filter((candidate) => candidate !== owner && !candidate.closing);
					return {
						memoryCapabilities: [...new Set(openOwners.flatMap(({ activeRegistry }) => activeRegistry.memoryCapabilities))],
						embeddingProviders: [...new Set(openOwners.flatMap(({ activeRegistry }) => activeRegistry.embeddingProviders))]
					};
				};
				let memoryErrors = [];
				try {
					if (previous.memoryCapabilities.some(({ capability }) => capability.runtime)) {
						const { prepareMemoryRuntimeReload } = await loadMemoryRuntime();
						const memory = prepareMemoryRuntimeReload(previous, retainedMemory());
						memoryErrors = (await memory.close()).errors;
						memory.commit(retainedMemory());
					}
				} catch (error) {
					closing.failure = new PluginRuntimeCloseRetainedError(error);
					throw closing.failure;
				}
				let retirement;
				const retire = () => retirement ??= Promise.resolve().then(async () => {
					registryOwners.delete(owner);
					const survivor = [...registryOwners].findLast((candidate) => !candidate.closing);
					if (state.activeRegistry === previous) {
						if (survivor) installActivePluginRegistry({
							...survivor,
							activateRegistry: false,
							retirePrevious: false
						});
						else clearActivePluginRegistryState();
					}
					if (registryOwners.size === 0 && state.activeRegistry === null) await clearActivePluginRegistry(previous);
					else {
						const retainedRegistry = survivor?.activeRegistry ?? null;
						retirePluginRegistryIfUnused(previous, () => retainedRegistry);
					}
					return await waitForPluginRegistryRetirement(previous);
				});
				const cleanup = await onRetirement?.(retire);
				const registryCleanup = await retire();
				return {
					memoryErrors,
					pluginFailures: (cleanup ?? registryCleanup).failures
				};
			}) };
			owner.closing = closing;
			return closing.promise;
		}
	};
}
function getActivePluginRegistry() {
	return state.activeRegistry;
}
function getActivePluginRegistryWorkspaceDir() {
	return state.workspaceDir ?? void 0;
}
function requireActivePluginRegistry() {
	const registry = getPluginRegistryForContext();
	if (registry) return registry;
	state.activeRegistry = createEmptyPluginRegistry();
	markPluginRegistryActive(state.activeRegistry);
	state.activeVersion += 1;
	registryVersions.set(state.activeRegistry, state.activeVersion);
	settlePreparedMessageToolCatalog(state.activeRegistry, state.activeVersion);
	syncPluginAgentEventBridge();
	return state.activeRegistry;
}
/** Binds unchanged direct SDK facades to the registry currently running synchronous register(). */
function withPluginRegistrationContext(registry, pluginId, run, context) {
	const previous = state.registrationContext;
	state.registrationContext = {
		registry,
		pluginId,
		...context
	};
	try {
		return run();
	} finally {
		state.registrationContext = previous;
	}
}
function getPluginRegistrationContext() {
	return state.registrationContext;
}
/** Keeps direct registration facades owned by the plugin whose synchronous register() is running. */
function resolveDirectPluginRegistrationOwner(ownerPluginId) {
	return state.registrationContext?.pluginId ?? ownerPluginId;
}
/** A failed plugin must not displace an earlier plugin's builder-local contribution. */
function assertDirectPluginRegistrationReplacement(existingOwnerPluginId, capability) {
	const pluginId = state.registrationContext?.pluginId;
	if (pluginId && existingOwnerPluginId !== pluginId) throw new Error(`${capability} already registered by ${existingOwnerPluginId || "core"}`);
}
function getActivePluginChannelRegistry() {
	return getActivePluginChannelRegistrySnapshotFromState().registry;
}
function getActivePluginChannelRegistryVersion() {
	return getActivePluginChannelRegistrySnapshotFromState().version;
}
function requireActivePluginChannelRegistry() {
	return getActivePluginChannelRegistry() ?? requireActivePluginRegistry();
}
function getActivePluginRegistryKey() {
	return state.key;
}
function getActivePluginRuntimeSubagentMode() {
	return state.runtimeSubagentMode;
}
function getActivePluginRegistryVersion() {
	return state.activeVersion;
}
/** Includes earlier cached or failed imports; metadata-only bundles never import runtime code. */
function listImportedRuntimePluginIds() {
	const imported = new Set(state.importedPluginIds);
	for (const plugin of state.activeRegistry?.plugins ?? []) if (plugin.status === "loaded" && plugin.format !== "bundle") imported.add(plugin.id);
	return [...imported].toSorted((left, right) => left.localeCompare(right));
}
function clearActivePluginRegistryState() {
	const previousRegistry = state.activeRegistry;
	state.activeRegistry = null;
	state.activeVersion += 1;
	state.key = null;
	state.workspaceDir = null;
	state.runtimeSubagentMode = "default";
	settlePreparedMessageToolCatalog();
	syncPluginAgentEventBridge();
	return previousRegistry;
}
async function clearActivePluginRegistry(previousRegistry = state.activeRegistry) {
	const cfg = getRuntimeConfigSnapshot() ?? void 0;
	const runContextCleanup = preparePluginRunContextCleanup();
	if (state.activeRegistry === previousRegistry) clearActivePluginRegistryState();
	const clearVersion = state.activeVersion;
	const clearRegistries = state.commandRegistryClearRegistries ??= /* @__PURE__ */ new Map();
	if (previousRegistry) clearRegistries.set(previousRegistry, (clearRegistries.get(previousRegistry) ?? 0) + 1);
	const completion = (state.commandRegistryClearTail ?? Promise.resolve()).catch(() => void 0).then(async () => {
		const cleanupWork = new AsyncWorkScope();
		try {
			if (previousRegistry) {
				await waitForPluginCommandExecutions(previousRegistry);
				if (registryHasPluginHostCleanupWork(previousRegistry)) await cleanupWork.track(() => disposePluginRegistryInstances(previousRegistry, () => state.activeRegistry, {
					cfg,
					runContextCleanup,
					cleanupPersistentState: true
				}));
			}
		} finally {
			await cleanupWork.drain();
			while (state.retiredRegistryCleanups?.size) await Promise.all(state.retiredRegistryCleanups.keys());
			if (state.activeRegistry === null && state.activeVersion === clearVersion) try {
				await drainGlobalSingletonLifecycleState("plugin-registry");
			} finally {
				clearPluginHostRuntimeState();
			}
		}
	}).finally(() => {
		if (previousRegistry) {
			const remaining = (clearRegistries.get(previousRegistry) ?? 1) - 1;
			if (remaining === 0) clearRegistries.delete(previousRegistry);
			else clearRegistries.set(previousRegistry, remaining);
		}
	});
	state.commandRegistryClearTail = completion.catch((error) => {
		log.warn(`plugin registry clear failed: ${String(error)}`);
	});
	quiescePluginRegistry(previousRegistry);
	if ([...clearRegistries.keys()].some(isPluginCommandExecutionActiveHere) || [...state.retiredRegistryCleanups?.values() ?? []].some(({ registry, work }) => isPluginCommandExecutionActiveHere(registry) || isAsyncWorkScopeActiveHere(work))) return;
	await completion;
}
async function prepareActivePluginRegistryShutdown() {
	await Promise.all([
		loadPluginHostCleanupRuntime(),
		loadMemoryRuntime(),
		preparePluginRegistryCacheShutdown()
	]);
}
function resetPluginRuntimeStateForTest() {
	state.registrationContext = void 0;
	registryOwners.clear();
	markPluginRegistryRetired(clearActivePluginRegistryState());
	state.importedPluginIds.clear();
	drainGlobalSingletonLifecycleState("plugin-registry");
	clearPluginHostRuntimeState();
	clearPluginMetadataLifecycleCaches();
}
//#endregion
export { cleanupPluginSessionSchedulerJobs as A, getPluginCommandExecutionCount as B, rollbackStagedPluginRegistry as C, withPluginRegistrationContext as D, waitForPluginRegistryRetirement as E, preparePluginRunContextCleanup as F, publishPluginSessionSchedulerJobs as I, registerPluginSessionSchedulerJob as L, deletePluginSessionSchedulerJob as M, getPluginRunContext as N, getPreparedMessageToolCatalog as O, makePluginSessionSchedulerJobKey as P, setPluginRunContext as R, restoreActivePluginRegistrySnapshot as S, stageActivePluginRegistry as T, withPluginCommandExecution as V, recordImportedPluginId as _, createPluginRegistryOwner as a, resetPluginRuntimeStateForTest as b, getActivePluginChannelRegistryVersion as c, getActivePluginRegistryVersion as d, getActivePluginRegistryWorkspaceDir as f, prepareActivePluginRegistryShutdown as g, listImportedRuntimePluginIds as h, commitStagedPluginRegistry as i, clearPluginRunContext as j, getPreparedMessageToolCatalogForRegistry as k, getActivePluginRegistry as l, getPluginRegistrationContext as m, captureActivePluginRegistrySnapshot as n, disposePluginRegistryInstances as o, getActivePluginRuntimeSubagentMode as p, clearActivePluginRegistry as r, getActivePluginChannelRegistry as s, assertDirectPluginRegistrationReplacement as t, getActivePluginRegistryKey as u, requireActivePluginChannelRegistry as v, setActivePluginRegistry as w, resolveDirectPluginRegistrationOwner as x, requireActivePluginRegistry as y, withPluginRunContextCleanup as z };
