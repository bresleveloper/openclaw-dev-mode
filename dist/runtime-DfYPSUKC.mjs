import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton, t as drainGlobalSingletonLifecycleState } from "./global-singleton-0m-JziJW.mjs";
import { c as trackAsyncWork, i as isAsyncWorkScopeActiveHere, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as PluginRuntimeCloseRetainedError } from "./runtime-close-error-DPmgR5gM.mjs";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-BSDrXrxO.mjs";
import { c as pluginInstanceState, d as runPluginCleanup, o as getPluginValueInstance, r as getPluginInstanceOwner } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { f as onAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { C as markPluginRegistryActive, E as quiescePluginRegistry, T as preparePluginRegistryCacheShutdown, b as isPluginRegistryRetired, n as bindPluginRegistryGatewayOwner, p as getPluginRegistryResourceOwner, t as adoptPluginRegistryRecords, w as markPluginRegistryRetired } from "./registry-lifecycle-CnhlPo20.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { t as getPluginHttpRouteCanonicalPath } from "./http-path-utbm8n9N.mjs";
import { r as withPluginRuntimeGenerationRegistryScope } from "./generation-state-C1yPL1Zl.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState } from "./registry-lookup-CszP7Fcb.mjs";
import { o as listLoadedChannelPluginsForRegistry } from "./registry-loaded-BugfxX6l.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-D0pq-oeY.mjs";
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
function isPluginCommandExecutionActiveHere(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return [...executionContext.getStore() ?? []].some((token) => token.registry === registry && token.active);
}
async function withPluginCommandExecution(registryView, run) {
	const registry = getPluginRegistryResourceOwner(registryView);
	if (isPluginRegistryRetired(registry)) return { admitted: false };
	const state = getExecutionState(registry);
	state.count += 1;
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
		state.count -= 1;
		if (state.count === 0) for (const resolve of state.waiters.splice(0)) resolve();
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
//#region src/plugins/host-hook-cleanup-timeout.ts
/** Max time allowed for plugin host cleanup hooks before failing shutdown. */
const PLUGIN_HOST_CLEANUP_TIMEOUT_MS = 5e3;
var PluginHostCleanupTimeoutError = class extends Error {};
/** Runs plugin host cleanup with a bounded timeout and clears the timer afterward. */
async function withPluginHostCleanupTimeout(hookId, cleanup, timeoutMs = PLUGIN_HOST_CLEANUP_TIMEOUT_MS) {
	const pending = trackAsyncWork(() => Promise.resolve().then(cleanup));
	if (!await settlesWithin(pending, timeoutMs)) throw new PluginHostCleanupTimeoutError(`plugin host cleanup timed out: ${hookId}`);
	return await pending;
}
//#endregion
//#region src/plugins/host-hooks.ts
function normalizePluginHostHookId(value) {
	return (value ?? "").trim();
}
function buildPluginAgentTurnPrepareContext(params) {
	const prepend = [];
	const append = [];
	params.queuedInjections.forEach((entry) => {
		if (entry.placement !== "prepend_context" && entry.placement !== "append_context" || typeof entry.text !== "string") return;
		const text = entry.text.trim();
		if (text) (entry.placement === "prepend_context" ? prepend : append).push(text);
	});
	return {
		...prepend.length > 0 ? { prependContext: prepend.join("\n\n") } : {},
		...append.length > 0 ? { appendContext: append.join("\n\n") } : {}
	};
}
function normalizeHostHookString(value) {
	return typeof value === "string" ? normalizePluginHostHookId(value) : "";
}
function normalizeOptionalHostHookString(value) {
	return value === void 0 ? void 0 : normalizeHostHookString(value);
}
function normalizeHostHookStringList(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return null;
	const normalized = [];
	for (const item of value) {
		const text = normalizeOptionalHostHookString(item);
		if (!text) return null;
		normalized.push(text);
	}
	return normalized;
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
async function waitForTerminalEventHandlers(runId) {
	const settled = waitForLiveTerminalEventHandlers(runId);
	await raceWithTimeout(settled, PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS, () => {
		rememberBoundedRunId(getPluginHostRuntimeState().terminalEventCleanupExpiredRunIds, runId);
		getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.delete(runId);
		log$1.warn(`plugin terminal agent event subscriptions still running after ${PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS}ms; clearing run context without waiting for them to settle`);
	}, { ref: false });
}
/** Stores JSON-compatible plugin run context for one run/plugin/namespace tuple. */
function setPluginRunContext(params) {
	const runId = normalizeOptionalString(params.patch.runId);
	const namespace = normalizePluginHostHookId(params.patch.namespace);
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
	const contexts = getPluginRunContexts();
	const byPlugin = contexts.get(runId) ?? /* @__PURE__ */ new Map();
	contexts.set(runId, byPlugin);
	const namespaces = new Map(byPlugin.get(params.pluginId));
	byPlugin.set(params.pluginId, namespaces);
	namespaces.set(namespace, structuredClone(params.patch.value));
	return true;
}
/** Reads previously stored plugin run context for one run/plugin/namespace tuple. */
function getPluginRunContext(params) {
	const runId = normalizeOptionalString(params.get.runId);
	const namespace = normalizePluginHostHookId(params.get.namespace);
	if (!runId || !namespace) return;
	const value = getPluginRunContexts().get(runId)?.get(params.pluginId)?.get(namespace);
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
	const namespaceFilter = normalizePluginHostHookId(params.namespace) || void 0;
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
//#region src/plugins/http-route-owner.ts
const registryViews = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteOwners"), () => /* @__PURE__ */ new WeakMap());
const entryViews = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteEntryOwners"), () => /* @__PURE__ */ new WeakMap());
const routeChangeListeners = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteChangeListeners"), () => /* @__PURE__ */ new Set());
function onPluginHttpRoutesChanged(listener) {
	return registerListener(routeChangeListeners, listener);
}
function notifyPluginHttpRoutesChanged() {
	for (const listener of routeChangeListeners) listener();
}
function respondPluginHttpRouteHandoff(_req, res) {
	res.statusCode = 503;
	res.setHeader("Retry-After", "1");
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end("plugin route is restarting; retry");
	return true;
}
function resolveOwner(registry, pluginId, instance) {
	const record = registry.plugins.find((entry) => entry.id === pluginId);
	return instance ?? (record && pluginInstanceState.records.get(record)?.instance) ?? pluginId;
}
function resolveEntryOwner(registry, entry) {
	const captured = entryViews.get(entry);
	return captured ? captured.owner : resolveOwner(registry, entry.pluginId, pluginInstanceState.values.get(entry.handler));
}
/** Shared raw callbacks keep the exact owner captured when their route was registered. */
function runPluginHttpRoute(registry, entry, value, run) {
	if (entry.handoff) return run();
	const owner = entryViews.get(entry)?.owner;
	const instance = (owner && typeof owner !== "string" ? getPluginInstanceOwner(owner)?.instance : void 0) ?? getPluginValueInstance(value);
	return instance ? withPluginRuntimeGenerationRegistryScope(registry, () => instance.runConsumer(run)) : run();
}
function viewsByOwner(registry) {
	let owners = registryViews.get(registry);
	if (!owners) registryViews.set(registry, owners = /* @__PURE__ */ new Map());
	return owners;
}
function ownerViews(registry, owner) {
	const owners = viewsByOwner(registry);
	let views = owners.get(owner);
	if (!views) owners.set(owner, views = /* @__PURE__ */ new Set([new WeakRef(registry)]));
	return views;
}
function liveViews(views) {
	const registries = [];
	for (const ref of views) {
		const registry = ref.deref();
		if (!registry || isPluginRegistryRetired(registry)) views.delete(ref);
		else registries.push(registry);
	}
	return registries;
}
/** A retained instance owns route mutations in both its published and prepared registries. */
function getPluginHttpRouteViews(registry, pluginId, instance = pluginInstanceInvocation.getStore()?.instance) {
	return liveViews(ownerViews(registry, resolveOwner(registry, pluginId, instance)));
}
function isPluginHttpRouteVisible(entry) {
	const views = entryViews.get(entry)?.views;
	return views ? liveViews(views).some((view) => view.httpRoutes.includes(entry)) : false;
}
/** Exact records own routes even when registration fails before registry insertion. */
function projectPluginHttpRoutes(source, record, target) {
	const owner = pluginInstanceState.records.get(record)?.instance ?? record.id;
	const views = ownerViews(source, owner);
	const owns = (route) => resolveEntryOwner(source, route) === owner;
	if (target) {
		target.httpRoutes.push(...source.httpRoutes.filter(owns));
		viewsByOwner(target).set(owner, views);
		if (!liveViews(views).includes(target)) views.add(new WeakRef(target));
	} else {
		source.httpRoutes = source.httpRoutes.filter((route) => !owns(route));
		viewsByOwner(source).delete(owner);
		for (const ref of views) if (ref.deref() === source) views.delete(ref);
	}
	notifyPluginHttpRoutesChanged();
}
function removeRoute(entry, views) {
	for (const view of liveViews(entryViews.get(entry)?.views ?? views)) {
		const index = view.httpRoutes.indexOf(entry);
		if (index >= 0) view.httpRoutes.splice(index, 1);
	}
}
/** Mutate at the owner so cleanup during drain also removes already projected routes. */
function replacePluginHttpRoutes(registry, entry, previous = [], keepPosition = false) {
	getPluginHttpRouteCanonicalPath(entry);
	const owner = resolveEntryOwner(registry, entry.handoff ? previous[0] ?? entry : entry);
	const views = ownerViews(registry, owner);
	const placements = liveViews(views).map((view) => ({
		routes: view.httpRoutes,
		index: keepPosition && previous.length ? view.httpRoutes.indexOf(previous[0]) : -1
	}));
	for (const route of previous) removeRoute(route, views);
	for (const { routes, index } of placements) routes.splice(index >= 0 ? index : routes.length, 0, entry);
	entryViews.set(entry, {
		owner,
		views
	});
	notifyPluginHttpRoutesChanged();
	return () => {
		removeRoute(entry, views);
		notifyPluginHttpRoutesChanged();
	};
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
const loadMemoryRuntime = createLazyRuntimeModule(() => import("./memory-runtime-BNDrcERN.mjs"));
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
const loadPluginHostCleanupRuntime = createLazyRuntimeModule(() => import("./host-hook-cleanup-Cx7SvuVn.mjs"));
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
		notifyPluginHttpRoutesChanged();
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
	const gatewayOwner = { current: () => registryOwners.has(owner) && !owner.closing ? owner.activeRegistry : void 0 };
	bindPluginRegistryGatewayOwner(registry, gatewayOwner);
	return {
		get registry() {
			return owner.activeRegistry;
		},
		publish(next) {
			if (owner.closing || !registryOwners.has(owner) || state.activeRegistry !== next) throw new Error("Plugin registry publication requires a live owner and active candidate");
			const previous = owner.activeRegistry;
			Object.assign(owner, captureActivePluginRegistrySnapshot());
			bindPluginRegistryGatewayOwner(next, gatewayOwner);
			notifyPluginHttpRoutesChanged();
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
					if (previous.memoryCapabilities.some(({ capability }) => capability.runtime || capability.providerRuntime)) {
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
						preparePluginRegistryRetirement(previous, () => retainedRegistry, false)?.retireIfUnused();
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
					runContextCleanup
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
export { withPluginHostCleanupTimeout as $, isPluginHttpRouteVisible as A, getPluginRunContext as B, setActivePluginRegistry as C, getPreparedMessageToolCatalog as D, withPluginRegistrationContext as E, respondPluginHttpRouteHandoff as F, setPluginRunContext as G, preparePluginRunContextCleanup as H, runPluginHttpRoute as I, normalizeHostHookString as J, withPluginRunContextCleanup as K, cleanupPluginSessionSchedulerJobs as L, onPluginHttpRoutesChanged as M, projectPluginHttpRoutes as N, getPreparedMessageToolCatalogForRegistry as O, replacePluginHttpRoutes as P, PluginHostCleanupTimeoutError as Q, clearPluginRunContext as R, rollbackStagedPluginRegistry as S, waitForPluginRegistryRetirement as T, publishPluginSessionSchedulerJobs as U, makePluginSessionSchedulerJobKey as V, registerPluginSessionSchedulerJob as W, normalizeOptionalHostHookString as X, normalizeHostHookStringList as Y, normalizePluginHostHookId as Z, requireActivePluginChannelRegistry as _, createPluginRegistryOwner as a, resolveDirectPluginRegistrationOwner as b, getActivePluginChannelRegistryVersion as c, getActivePluginRegistryVersion as d, getPluginCommandExecutionCount as et, getActivePluginRegistryWorkspaceDir as f, recordImportedPluginId as g, prepareActivePluginRegistryShutdown as h, commitStagedPluginRegistry as i, notifyPluginHttpRoutesChanged as j, getPluginHttpRouteViews as k, getActivePluginRegistry as l, listImportedRuntimePluginIds as m, captureActivePluginRegistrySnapshot as n, disposePluginRegistryInstances as o, getPluginRegistrationContext as p, buildPluginAgentTurnPrepareContext as q, clearActivePluginRegistry as r, getActivePluginChannelRegistry as s, assertDirectPluginRegistrationReplacement as t, withPluginCommandExecution as tt, getActivePluginRegistryKey as u, requireActivePluginRegistry as v, stageActivePluginRegistry as w, restoreActivePluginRegistrySnapshot as x, resetPluginRuntimeStateForTest as y, deletePluginSessionSchedulerJob as z };
