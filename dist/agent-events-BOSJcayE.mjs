import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { E as rotateAgentRunRegistryLifecycleGeneration, M as getAgentEventExecutionContext, N as recordAgentEventRouting, S as resetAgentRunRegistryForTest, c as getAgentRunContext, d as getAgentRunLifecycleGeneration, h as recordAgentRunModel, k as recordAgentRunOutputTokens, u as getAgentRunContextOwnership, y as registerAgentRunSequenceResetHandler } from "./agent-run-registry-DO6Dg2r0.mjs";
//#region src/infra/agent-event-lifecycle.ts
/** Returns true when a lifecycle start omits its producer-owned finite timestamp. */
function hasInvalidLifecycleStartTimestamp(stream, data) {
	if (stream !== "lifecycle" || !data || typeof data !== "object" || Array.isArray(data)) return false;
	const lifecycle = data;
	return lifecycle.phase === "start" && (typeof lifecycle.startedAt !== "number" || !Number.isFinite(lifecycle.startedAt));
}
//#endregion
//#region src/infra/agent-lifecycle-error.ts
const AGENT_RUN_STALE_LIFECYCLE_ERROR = "Agent run belongs to a stale gateway lifecycle";
const AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE = "ERR_STALE_GATEWAY_LIFECYCLE";
function createAgentRunStaleLifecycleError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_STALE_LIFECYCLE_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE;
	return error;
}
function isAgentRunStaleLifecycleError(value) {
	try {
		return value instanceof Error && "code" in value && value.code === AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE;
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/agent-events.ts
const AGENT_EVENT_ROUTING_FIELDS = [
	["controlUiVisible", "isControlUiVisible"],
	["projectSessionLifecycle", "projectSessionLifecycle"],
	["projectSessionMessages", "projectSessionMessages"],
	["mainSessionRestartRecovery", "mainSessionRestartRecovery"],
	["isHeartbeat", "isHeartbeat"],
	["verboseLevel", "verboseLevel"],
	["registeredAt", "registeredAt"]
];
function getAgentEventState() {
	return resolveGlobalSingleton(Symbol.for("openclaw.agentEvents.state"), () => ({
		seqByRun: /* @__PURE__ */ new Map(),
		listeners: /* @__PURE__ */ new Map(),
		runListeners: /* @__PURE__ */ new Map(),
		nextListenerId: 0,
		listenerRevision: 0,
		auditListeners: /* @__PURE__ */ new Set()
	}));
}
registerAgentRunSequenceResetHandler((runId) => {
	getAgentEventState().seqByRun.delete(runId);
});
/** Runs one execution with immutable ownership inherited by every emitted stream event. */
function withAgentRunLifecycleGeneration(lifecycleGeneration, run) {
	const storage = getAgentEventExecutionContext();
	const parent = storage.getStore();
	const onceByRun = parent?.lifecycleGeneration === lifecycleGeneration ? parent.onceByRun : /* @__PURE__ */ new Map();
	const routingByRun = new Map(parent?.routingByRun);
	return storage.run({
		lifecycleGeneration,
		onceByRun,
		routingByRun
	}, run);
}
/** Shares one operation across fallback attempts that belong to the same admitted run. */
function runOncePerAgentRun(runId, operation, run) {
	const context = getAgentEventExecutionContext().getStore();
	if (!context) return run();
	const key = `${operation}:${runId}`;
	const existing = context.onceByRun.get(key);
	if (existing) return existing;
	const pending = Promise.resolve().then(run);
	context.onceByRun.set(key, pending);
	return pending;
}
function getAgentEventLifecycleGeneration() {
	return getAgentRunLifecycleGeneration();
}
function isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) {
	return lifecycleGeneration === getAgentRunLifecycleGeneration();
}
/** Registers process-local state cleanup at the gateway lifecycle boundary. */
function registerAgentEventLifecycleRotationHandler(key, handler) {
	const state = getAgentEventState();
	(state.lifecycleRotationHandlers ?? (state.lifecycleRotationHandlers = /* @__PURE__ */ new Map())).set(key, handler);
}
/** Rejects work that no longer belongs to the active gateway lifecycle. */
function assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration) {
	if (isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) return;
	throw createAgentRunStaleLifecycleError();
}
/** Captures immutable lifecycle ownership for one admitted execution. */
function captureAgentRunLifecycleGeneration(runId) {
	return getAgentEventExecutionContext().getStore()?.lifecycleGeneration ?? getAgentRunContext(runId)?.lifecycleGeneration ?? getAgentRunLifecycleGeneration();
}
/** Starts a new ownership generation before an in-process gateway restart. */
function rotateAgentEventLifecycleGeneration() {
	const state = getAgentEventState();
	const lifecycleGeneration = rotateAgentRunRegistryLifecycleGeneration();
	const errors = [];
	notifyListeners(state.lifecycleRotationHandlers?.values() ?? [], lifecycleGeneration, (error) => errors.push(error));
	if (errors.length > 0) throw new AggregateError(errors, "Failed to retire stale agent lifecycle owners");
	return lifecycleGeneration;
}
function enrichAgentEvent(state, event, claimId, expectedContext) {
	const currentLifecycleGeneration = getAgentRunLifecycleGeneration();
	const owners = getAgentRunContextOwnership(event.runId);
	if (claimId !== void 0) {
		if (owners?.lifecycleGeneration !== currentLifecycleGeneration || owners.exclusiveClaimId !== claimId || !owners.claimIds.has(claimId) || owners.clearRequested) return;
	} else if (owners?.lifecycleGeneration === currentLifecycleGeneration && owners.exclusiveClaimId) return;
	const context = getAgentRunContext(event.runId);
	if (expectedContext && context !== expectedContext) return;
	const scope = getAgentEventExecutionContext().getStore();
	const executionLifecycleGeneration = event.lifecycleGeneration ?? scope?.lifecycleGeneration;
	const ownedLifecycleGeneration = executionLifecycleGeneration ?? context?.lifecycleGeneration;
	if (executionLifecycleGeneration && context?.lifecycleGeneration && executionLifecycleGeneration !== context.lifecycleGeneration) return;
	if (ownedLifecycleGeneration && ownedLifecycleGeneration !== currentLifecycleGeneration) return;
	if (hasInvalidLifecycleStartTimestamp(event.stream, event.data)) return;
	const record = scope?.routingByRun?.get(event.runId);
	const captured = record?.routing.lifecycleGeneration === ownedLifecycleGeneration ? record : void 0;
	const capturedOwner = captured?.owner.deref();
	if (captured && context && capturedOwner !== context) return;
	const routing = context ?? captured?.routing;
	if (event.stream === "lifecycle" && event.data.phase === "model") {
		if (!context || claimId === void 0 && (expectedContext ?? capturedOwner) !== context) return;
		const { provider, model } = event.data;
		if (provider === null && model === null) recordAgentRunModel(event.runId, void 0);
		else if (typeof provider === "string" && provider.trim() && typeof model === "string" && model.trim()) recordAgentRunModel(event.runId, {
			provider,
			model
		});
		else return;
	}
	let data = event.data;
	if (routing && event.stream === "lifecycle") {
		if (routing.completionSource) data = {
			...data,
			completionSource: routing.completionSource
		};
		if (data.phase === "start") {
			if (context) context.lifecycleStartedAt = data.startedAt;
		} else if ((data.phase === "end" || data.phase === "error") && data.startedAt === void 0 && routing.lifecycleStartedAt !== void 0) data = {
			...data,
			startedAt: routing.lifecycleStartedAt
		};
	}
	if (context) recordAgentEventRouting(event.runId, context);
	const nextSeq = (state.seqByRun.get(event.runId) ?? 0) + 1;
	state.seqByRun.set(event.runId, nextSeq);
	if (context) context.lastActiveAt = Date.now();
	const isControlUiVisible = routing?.isControlUiVisible ?? true;
	const eventSessionKey = typeof event.sessionKey === "string" && event.sessionKey.trim() ? event.sessionKey : void 0;
	const deliverySessionKey = claimId !== void 0 ? eventSessionKey ?? routing?.sessionKey : !isControlUiVisible && event.stream !== "lifecycle" ? routing?.sessionKey : void 0;
	const sessionKey = isControlUiVisible || event.stream === "lifecycle" ? eventSessionKey ?? routing?.sessionKey : void 0;
	const sessionId = event.stream === "lifecycle" ? event.sessionId ?? routing?.sessionId : event.sessionId;
	const lifecycleGeneration = event.stream === "lifecycle" ? ownedLifecycleGeneration ?? currentLifecycleGeneration : ownedLifecycleGeneration;
	const agentId = event.agentId ?? routing?.agentId;
	const enriched = {
		...event,
		data,
		sessionKey,
		...sessionId ? { sessionId } : {},
		...agentId ? { agentId } : {},
		seq: nextSeq,
		ts: Date.now()
	};
	if (lifecycleGeneration) Object.defineProperty(enriched, "lifecycleGeneration", {
		value: lifecycleGeneration,
		enumerable: false
	});
	for (const [key, source] of AGENT_EVENT_ROUTING_FIELDS) {
		const value = routing?.[source];
		if (value !== void 0) Object.defineProperty(enriched, key, {
			value,
			enumerable: false
		});
	}
	if (claimId !== void 0) Object.defineProperty(enriched, "contextClaimId", {
		value: claimId,
		enumerable: false
	});
	if (deliverySessionKey) Object.defineProperty(enriched, "deliverySessionKey", {
		value: deliverySessionKey,
		enumerable: false
	});
	return enriched;
}
function* iterateAgentEventListeners(state, enriched) {
	let lastId = -1;
	let revision = -1;
	let runId;
	let globalRegistrations;
	let runRegistrations;
	let global;
	let scoped;
	while (true) {
		const currentRunId = enriched.runId;
		if (revision !== state.listenerRevision || runId !== currentRunId) {
			revision = state.listenerRevision;
			runId = currentRunId;
			globalRegistrations = state.listeners.values();
			runRegistrations = state.runListeners.get(runId)?.values();
			global = globalRegistrations.next().value;
			scoped = runRegistrations?.next().value;
		}
		while (global && global.id <= lastId) global = globalRegistrations?.next().value;
		while (scoped && scoped.id <= lastId) scoped = runRegistrations?.next().value;
		const next = global && (!scoped || global.id <= scoped.id) ? global : scoped;
		if (!next) return;
		lastId = next.id;
		yield next.listener;
	}
}
/** Emits an event only when its run ownership is still current. */
function emitAgentEventIfCurrent(event) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event);
	if (!enriched) return false;
	notifyListeners(iterateAgentEventListeners(state, enriched), enriched);
	return true;
}
/** Adds one completed model call, returning its accepted run total for local callbacks. */
function emitAgentRunOutputTokens(params) {
	return recordAgentRunOutputTokens({
		...params,
		emit: (data) => emitAgentEventIfCurrent({
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			sessionKey: params.sessionKey,
			stream: "usage",
			data
		})
	});
}
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
function emitAgentEvent(event) {
	emitAgentEventIfCurrent(event);
}
function emitAgentEventForOwner(event, claimId) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event, claimId);
	if (enriched) notifyListeners(iterateAgentEventListeners(state, enriched), enriched);
}
/** Emits only while the exact run-context record captured by its producer remains current. */
function emitAgentEventForRunContext(event, context) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event, void 0, context);
	if (enriched) notifyListeners(iterateAgentEventListeners(state, enriched), enriched);
}
/** Emits run metadata only to the Gateway-owned durable audit projection. */
function emitAgentAuditEvent(event) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event);
	if (enriched) {
		notifyListeners(state.auditListeners, enriched);
		const phase = event.stream === "lifecycle" ? event.data.phase : void 0;
		if ((phase === "end" || phase === "error") && !getAgentRunContext(event.runId)) state.seqByRun.delete(event.runId);
	}
}
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
function onAgentEvent(listener) {
	return registerAgentEventListener(listener);
}
/** Subscribes Gateway internals that consume non-public ownership and routing metadata. */
function onAgentRuntimeEvent(listener) {
	return registerAgentEventListener(listener);
}
/**
* Subscribes to one run's sequenced agent events; returns an unsubscribe callback.
* Prefer this over `onAgentEvent` for a listener that discards other runs: those
* listeners otherwise run on every concurrent run's events.
*/
function onAgentEventForRun(runId, listener) {
	return registerAgentEventListener(listener, runId);
}
function registerAgentEventListener(listener, runId) {
	const state = getAgentEventState();
	const bucket = runId === void 0 ? state.listeners : state.runListeners.get(runId) ?? /* @__PURE__ */ new Map();
	if (!bucket.has(listener)) {
		bucket.set(listener, {
			listener,
			id: state.nextListenerId++
		});
		if (runId !== void 0) state.runListeners.set(runId, bucket);
		state.listenerRevision++;
	}
	return () => {
		if (bucket.delete(listener)) state.listenerRevision++;
		if (runId !== void 0 && bucket.size === 0 && state.runListeners.get(runId) === bucket) state.runListeners.delete(runId);
	};
}
/** Subscribes to private audit-only agent events; returns an unsubscribe callback. */
function onAgentAuditEvent(listener) {
	return registerListener(getAgentEventState().auditListeners, listener);
}
/** Clears agent event state; test suites with a live Gateway can preserve its listeners. */
function resetAgentEventsForTest(options) {
	const state = getAgentEventState();
	state.seqByRun.clear();
	resetAgentRunRegistryForTest();
	if (!options?.preserveListeners) {
		state.listeners.clear();
		for (const bucket of state.runListeners.values()) bucket.clear();
		state.runListeners.clear();
		state.auditListeners.clear();
		state.listenerRevision++;
	}
}
//#endregion
export { hasInvalidLifecycleStartTimestamp as S, rotateAgentEventLifecycleGeneration as _, emitAgentEventForOwner as a, createAgentRunStaleLifecycleError as b, emitAgentRunOutputTokens as c, onAgentAuditEvent as d, onAgentEvent as f, resetAgentEventsForTest as g, registerAgentEventLifecycleRotationHandler as h, emitAgentEvent as i, getAgentEventLifecycleGeneration as l, onAgentRuntimeEvent as m, captureAgentRunLifecycleGeneration as n, emitAgentEventForRunContext as o, onAgentEventForRun as p, emitAgentAuditEvent as r, emitAgentEventIfCurrent as s, assertAgentRunLifecycleGenerationCurrent as t, isAgentEventLifecycleGenerationCurrent as u, runOncePerAgentRun as v, isAgentRunStaleLifecycleError as x, withAgentRunLifecycleGeneration as y };
