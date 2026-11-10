import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { s as isDefinitiveRunLifecycle } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { B as recordAgentEventRouting, M as recordAgentRunOutputTokens, S as registerAgentRunSequenceResetHandler, T as resetAgentRunRegistryForTest, d as getAgentRunContextOwnership, f as getAgentRunLifecycleGeneration, k as rotateAgentRunRegistryLifecycleGeneration, u as getAgentRunContext, v as recordAgentRunModel, z as getAgentEventExecutionContext } from "./agent-run-registry-gmaPgO-n.mjs";
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
const RESTART_RECOVERY_CLAIM_CHANGED_ERROR = "restart recovery claim changed before agent adoption";
const RESTART_RECOVERY_CLAIM_CHANGED_ERROR_CODE = "ERR_RESTART_RECOVERY_CLAIM_CHANGED";
function createAgentRunStaleLifecycleError() {
	return Object.assign(/* @__PURE__ */ new Error(AGENT_RUN_STALE_LIFECYCLE_ERROR), {
		name: "AbortError",
		code: AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE
	});
}
function hasLifecycleErrorCode(value, code) {
	try {
		return value instanceof Error && "code" in value && value.code === code;
	} catch {
		return false;
	}
}
function isAgentRunStaleLifecycleError(value) {
	return hasLifecycleErrorCode(value, AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE);
}
function createRestartRecoveryClaimChangedError() {
	return Object.assign(/* @__PURE__ */ new Error(RESTART_RECOVERY_CLAIM_CHANGED_ERROR), {
		name: "AbortError",
		code: RESTART_RECOVERY_CLAIM_CHANGED_ERROR_CODE
	});
}
function isRestartRecoveryClaimChangedError(value) {
	return hasLifecycleErrorCode(value, RESTART_RECOVERY_CLAIM_CHANGED_ERROR_CODE);
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
		runs: /* @__PURE__ */ new Map(),
		listeners: /* @__PURE__ */ new Map(),
		runListeners: /* @__PURE__ */ new Map(),
		nextListenerId: 0,
		auditListeners: /* @__PURE__ */ new Set()
	}));
}
/** Correlate copied model frames with their occurrence without changing transcript bytes. */
function bindAgentAssistantSource(message, source) {
	(getAgentEventState().assistantSources ??= /* @__PURE__ */ new WeakMap()).set(message, source);
}
function readAgentAssistantSource(message) {
	return message && typeof message === "object" ? getAgentEventState().assistantSources?.get(message) : void 0;
}
registerAgentRunSequenceResetHandler((runId) => {
	getAgentEventState().runs.delete(runId);
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
/** Reserves client terminal publication without advancing execution settlement. */
function reserveAgentTerminalEvent(identity) {
	const { runId } = identity;
	const context = getAgentRunContext(runId);
	return withAgentRunLifecycleGeneration(captureAgentRunLifecycleGeneration(runId), () => {
		if (context) recordAgentEventRouting(runId, context);
		const resolved = resolveAgentEventRouting(identity);
		if (!resolved) return () => {};
		const state = getAgentEventState();
		const runState = resolved.routing?.eventState ?? state.runs.get(runId) ?? { seq: 0 };
		const publication = Symbol("agent terminal publication");
		runState.terminalPublication ??= publication;
		if (!state.runs.has(runId)) state.runs.set(runId, runState);
		const storage = getAgentEventExecutionContext();
		const scope = storage.getStore();
		let pending = true;
		return (data) => {
			if (pending) {
				pending = false;
				storage.run(scope, () => dispatchAgentEvent({
					...identity,
					stream: "lifecycle",
					data
				}, void 0, void 0, publication));
			}
		};
	});
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
	const handlers = state.lifecycleRotationHandlers ?? (state.lifecycleRotationHandlers = /* @__PURE__ */ new Map());
	handlers.set(key, handler);
	return () => {
		if (handlers.get(key) === handler) handlers.delete(key);
	};
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
const MAX_EXECUTION_ACTIVITY_ITEMS = 64;
const MAX_EXECUTION_ACTIVITY_ID_LENGTH = 256;
const MAX_EXECUTION_TOOL_NAME_LENGTH = 120;
function activityId(value) {
	if (typeof value !== "string") return;
	const id = value.trim();
	return id && id.length <= MAX_EXECUTION_ACTIVITY_ID_LENGTH ? id : void 0;
}
function recordExecutionActivity(context, event) {
	if (event.sessionKey && context.sessionKey && event.sessionKey !== context.sessionKey || event.sessionId && context.sessionId && event.sessionId !== context.sessionId) return;
	const { stream, data } = event;
	if (stream === "lifecycle" && (data.phase === "end" || data.phase === "error")) {
		context.executionActivity = void 0;
		return;
	}
	const approval = stream === "execution" && isRecord(data.approval) ? data.approval : void 0;
	const approvalId = activityId(approval?.id ?? (stream === "lifecycle" ? data.approvalId : void 0));
	const approvalState = approval?.state ?? (data.phase === "waiting-approval" ? "pending" : data.phase === "approval-resolved" ? "resolved" : void 0);
	if (approvalId && (approvalState === "pending" || approvalState === "resolved")) {
		const activity = context.executionActivity ??= {
			tools: [],
			pendingApprovalIds: []
		};
		if (approvalState === "pending" && !activity.pendingApprovalIds.includes(approvalId)) {
			if (activity.pendingApprovalIds.length < MAX_EXECUTION_ACTIVITY_ITEMS) activity.pendingApprovalIds.push(approvalId);
			else activity.approvalOverflow = true;
		} else if (approvalState === "resolved") activity.pendingApprovalIds = activity.pendingApprovalIds.filter((id) => id !== approvalId);
		return;
	}
	if (stream === "execution" && (data.state === "running" || data.state === "waiting" || data.state === "unknown")) {
		const sourceId = activityId(data.sourceId);
		const previous = context.executionActivity?.execution;
		if (data.invalidate === true && (!sourceId || previous?.sourceId !== sourceId)) return;
		const activity = context.executionActivity ??= {
			tools: [],
			pendingApprovalIds: []
		};
		const id = activityId(data.executionId);
		if (data.state === "unknown" || sourceId && previous?.sourceId !== sourceId || id && previous?.id !== id) activity.tools = [];
		const kind = isRecord(data.wait) ? data.wait.kind : void 0;
		const wait = kind === "approval" || kind === "user_input" || kind === "agent_messages" || kind === "children" ? kind : "external";
		activity.execution = {
			state: data.state,
			sourceId: sourceId ?? previous?.sourceId,
			id: id ?? previous?.id,
			...data.state === "waiting" ? { wait } : {}
		};
		return;
	}
	if (stream !== "tool") return;
	const toolCallId = activityId(data.toolCallId);
	if (!toolCallId) return;
	const existing = context.executionActivity;
	if (data.phase === "result" || data.phase === "end") {
		if (existing) existing.tools = existing.tools.filter((tool) => tool.id !== toolCallId);
		return;
	}
	if (data.phase !== "start" || typeof data.name !== "string" || !data.name.trim()) return;
	const activity = context.executionActivity ??= {
		tools: [],
		pendingApprovalIds: []
	};
	const tool = {
		id: toolCallId,
		name: truncateUtf16Safe(data.name.trim(), MAX_EXECUTION_TOOL_NAME_LENGTH)
	};
	const index = activity.tools.findIndex((current) => current.id === toolCallId);
	if (index >= 0) activity.tools[index] = tool;
	else if (activity.tools.length < MAX_EXECUTION_ACTIVITY_ITEMS) activity.tools.push(tool);
}
function resolveAgentEventRouting(event, claimId, expectedContext) {
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
	const record = scope?.routingByRun?.get(event.runId);
	const captured = record?.routing.lifecycleGeneration === ownedLifecycleGeneration ? record : void 0;
	const capturedOwner = captured?.owner.deref();
	if (captured && context && capturedOwner !== context) return;
	return {
		context,
		routing: context ?? captured?.routing,
		capturedOwner,
		ownedLifecycleGeneration,
		currentLifecycleGeneration
	};
}
function enrichAgentEvent(state, event, claimId, expectedContext, reservedPublication, assistantSource, assistantProjection) {
	const resolved = resolveAgentEventRouting(event, claimId, expectedContext);
	if (!resolved || hasInvalidLifecycleStartTimestamp(event.stream, event.data)) return;
	const { context, routing, capturedOwner, ownedLifecycleGeneration, currentLifecycleGeneration } = resolved;
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
	const runState = routing?.eventState ?? state.runs.get(event.runId) ?? { seq: 0 };
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
	const nextSeq = Math.max(runState.seq, state.runs.get(event.runId)?.seq ?? 0) + 1;
	runState.seq = nextSeq;
	state.runs.set(event.runId, runState);
	if (context) {
		context.lastActiveAt = Date.now();
		recordExecutionActivity(context, event);
	}
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
	if (event.stream === "lifecycle") {
		const publication = reservedPublication ?? Symbol("agent lifecycle publication");
		let consumed = false;
		Object.defineProperty(enriched, "admitLifecyclePublication", { value: () => {
			if (consumed || runState.terminalPublication && runState.terminalPublication !== publication) return false;
			consumed = true;
			if (isDefinitiveRunLifecycle({
				phase: data.phase,
				data
			})) runState.terminalPublication = publication;
			return true;
		} });
	}
	Object.defineProperties(enriched, {
		assistantSource: {
			value: assistantSource,
			enumerable: false
		},
		assistantProjection: {
			value: assistantProjection,
			enumerable: false
		}
	});
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
function dispatchAgentEvent(event, claimId, expectedContext, reservedPublication, assistantSource, assistantProjection) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event, claimId, expectedContext, reservedPublication, assistantSource, assistantProjection);
	if (!enriched) return false;
	const runListeners = state.runListeners.get(enriched.runId);
	const registrations = [...state.listeners.values(), ...runListeners?.values() ?? []].toSorted((left, right) => left.id - right.id);
	const deliveries = /* @__PURE__ */ new Map();
	notifyListeners(registrations.map((registration) => () => {
		if (registration.captureDelivery) deliveries.set(registration, registration.captureDelivery(enriched));
	}), enriched);
	notifyListeners(registrations.map((registration) => (deliveredEvent) => {
		if (state.listeners.get(registration.listener) !== registration && runListeners?.get(registration.listener) !== registration) return;
		const isDeliveryCurrent = deliveries.get(registration);
		if (!registration.captureDelivery) registration.listener(deliveredEvent);
		else if (isDeliveryCurrent?.()) registration.listener(deliveredEvent, isDeliveryCurrent);
	}), enriched);
	return true;
}
/** Emits an event only when its run ownership is still current. */
function emitAgentEventIfCurrent(event) {
	return dispatchAgentEvent(event);
}
/** Bind the source occurrence only after ordinary event ownership admission. */
function emitAgentEventWithAssistantSourceIfCurrent(event, assistantSource, assistantProjection) {
	return dispatchAgentEvent(event, void 0, void 0, void 0, assistantSource, assistantProjection);
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
	return dispatchAgentEvent(event, claimId);
}
/** Emits only while the exact run-context record captured by its producer remains current. */
function emitAgentEventForRunContext(event, context) {
	return dispatchAgentEvent(event, void 0, context);
}
/** Emits run metadata only to the Gateway-owned durable audit projection. */
function emitAgentAuditEvent(event) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(state, event);
	if (enriched) {
		notifyListeners(state.auditListeners, enriched);
		const phase = event.stream === "lifecycle" ? event.data.phase : void 0;
		if ((phase === "end" || phase === "error") && !getAgentRunContext(event.runId)) state.runs.delete(event.runId);
	}
}
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
function onAgentEvent(listener) {
	return registerAgentEventListener(listener);
}
/** Subscribes Gateway internals that consume non-public ownership and routing metadata. */
function onAgentRuntimeEvent(listener, captureDelivery) {
	return registerAgentEventListener(listener, void 0, captureDelivery);
}
/**
* Subscribes to one run's sequenced agent events; returns an unsubscribe callback.
* Prefer this over `onAgentEvent` for a listener that discards other runs: those
* listeners otherwise run on every concurrent run's events.
*/
function onAgentEventForRun(runId, listener) {
	return registerAgentEventListener(listener, runId);
}
function registerAgentEventListener(listener, runId, captureDelivery) {
	const state = getAgentEventState();
	const bucket = runId === void 0 ? state.listeners : state.runListeners.get(runId) ?? /* @__PURE__ */ new Map();
	if (!bucket.has(listener)) {
		bucket.set(listener, {
			listener,
			id: state.nextListenerId++,
			captureDelivery
		});
		if (runId !== void 0) state.runListeners.set(runId, bucket);
	}
	return () => {
		bucket.delete(listener);
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
	state.runs.clear();
	resetAgentRunRegistryForTest();
	if (!options?.preserveListeners) {
		state.listeners.clear();
		for (const bucket of state.runListeners.values()) bucket.clear();
		state.runListeners.clear();
		state.auditListeners.clear();
	}
}
//#endregion
export { withAgentRunLifecycleGeneration as C, isRestartRecoveryClaimChangedError as D, isAgentRunStaleLifecycleError as E, hasInvalidLifecycleStartTimestamp as O, runOncePerAgentRun as S, createRestartRecoveryClaimChangedError as T, readAgentAssistantSource as _, emitAgentEvent as a, resetAgentEventsForTest as b, emitAgentEventIfCurrent as c, getAgentEventLifecycleGeneration as d, isAgentEventLifecycleGenerationCurrent as f, onAgentRuntimeEvent as g, onAgentEventForRun as h, emitAgentAuditEvent as i, emitAgentEventWithAssistantSourceIfCurrent as l, onAgentEvent as m, bindAgentAssistantSource as n, emitAgentEventForOwner as o, onAgentAuditEvent as p, captureAgentRunLifecycleGeneration as r, emitAgentEventForRunContext as s, assertAgentRunLifecycleGenerationCurrent as t, emitAgentRunOutputTokens as u, registerAgentEventLifecycleRotationHandler as v, createAgentRunStaleLifecycleError as w, rotateAgentEventLifecycleGeneration as x, reserveAgentTerminalEvent as y };
