import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes, randomUUID } from "node:crypto";
//#region src/infra/diagnostic-event-listener-presence.ts
/** Process-wide listener counts used to avoid telemetry work without consumers. */
const DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY = Symbol.for("openclaw.diagnosticEventListenerPresence.v1");
function getDiagnosticEventListenerPresence() {
	const existing = globalThis[DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY];
	if (existing && typeof existing === "object" && existing.marker === DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY) {
		const state = existing;
		state.broadInterestCount ??= 0;
		state.eventInterestDeltas ??= /* @__PURE__ */ new Map();
		return state;
	}
	const state = {
		broadInterestCount: 0,
		eventInterestDeltas: /* @__PURE__ */ new Map(),
		marker: DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY,
		internalCount: 0,
		trustedCount: 0
	};
	Object.defineProperty(globalThis, DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
function isInternalDiagnosticEventInterested(interest, type, trusted) {
	return (!interest?.include || interest.include.includes(type)) && !interest?.exclude?.includes(type) && (!trusted || !interest?.includeTrusted || interest.includeTrusted.includes(type));
}
function updateEventInterestDelta(state, type, delta) {
	const next = (state.eventInterestDeltas.get(type) ?? 0) + delta;
	if (next === 0) state.eventInterestDeltas.delete(type);
	else state.eventInterestDeltas.set(type, next);
}
function updateInternalDiagnosticEventInterest(interest, delta) {
	const state = getDiagnosticEventListenerPresence();
	if (interest?.include) {
		for (const type of new Set(interest.include)) if (!interest.exclude?.includes(type)) updateEventInterestDelta(state, type, delta);
		return;
	}
	state.broadInterestCount += delta;
	for (const type of new Set(interest?.exclude ?? [])) updateEventInterestDelta(state, type, -delta);
}
function hasInternalDiagnosticEventInterest(type) {
	const state = getDiagnosticEventListenerPresence();
	return state.broadInterestCount + (state.eventInterestDeltas.get(type) ?? 0) > 0;
}
function resetInternalDiagnosticEventListenerPresence() {
	const state = getDiagnosticEventListenerPresence();
	state.internalCount = 0;
	state.trustedCount = 0;
	state.broadInterestCount = 0;
	state.eventInterestDeltas.clear();
}
function setInternalDiagnosticEventListenerCounts(internalCount, trustedCount) {
	const state = getDiagnosticEventListenerPresence();
	state.internalCount = internalCount;
	state.trustedCount = trustedCount;
}
function hasInternalDiagnosticEventListeners() {
	const state = getDiagnosticEventListenerPresence();
	return state.internalCount > 0 || state.trustedCount > 0;
}
//#endregion
//#region src/infra/diagnostic-event-snapshot.ts
function createDiagnosticMetadataForListener(metadata) {
	return Object.freeze({ ...metadata });
}
function cloneDiagnosticValueForListener(value) {
	return deepFreezeDiagnosticValue(structuredClone(value));
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	for (const nested of Array.isArray(value) ? value : Object.values(value)) deepFreezeDiagnosticValue(nested, seen);
	return Object.freeze(value);
}
//#endregion
//#region src/infra/diagnostic-model-request-provenance.ts
const CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY = "coreModelRequestLifecycle";
const coreModelRequestLifecycleEvents = /* @__PURE__ */ new WeakMap();
function markCoreModelRequestLifecycleDiagnosticEvent(event, provenance) {
	coreModelRequestLifecycleEvents.set(event, provenance);
	return event;
}
function consumeCoreModelRequestLifecycleDiagnosticEvent(event) {
	const provenance = coreModelRequestLifecycleEvents.get(event);
	coreModelRequestLifecycleEvents.delete(event);
	return provenance;
}
//#endregion
//#region src/infra/diagnostic-otel-listener-provenance.ts
const trustedOtelDiagnosticListeners = /* @__PURE__ */ new WeakSet();
function markTrustedOtelDiagnosticListener(listener) {
	const registeredListener = (...args) => listener(...args);
	trustedOtelDiagnosticListeners.add(registeredListener);
	return registeredListener;
}
function isTrustedOtelDiagnosticListener(listener) {
	return trustedOtelDiagnosticListeners.has(listener);
}
//#endregion
//#region src/infra/diagnostic-plugin-usage-provenance.ts
const hostPluginUsageIds = /* @__PURE__ */ new WeakMap();
function markHostPluginUsageDiagnosticEvent(event, hostPluginId) {
	const normalizedHostPluginId = hostPluginId?.trim();
	if (normalizedHostPluginId) hostPluginUsageIds.set(event, normalizedHostPluginId);
	return event;
}
function consumeHostPluginUsageDiagnosticEvent(event) {
	const hostPluginId = hostPluginUsageIds.get(event);
	hostPluginUsageIds.delete(event);
	return hostPluginId;
}
//#endregion
//#region src/infra/diagnostic-semantic-run-progress-provenance.ts
const CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY = "coreSemanticRunProgress";
const coreSemanticRunProgressEvents = /* @__PURE__ */ new WeakMap();
function markCoreSemanticRunProgressDiagnosticEvent(event, owner) {
	coreSemanticRunProgressEvents.set(event, owner ?? true);
	return event;
}
function consumeCoreSemanticRunProgressDiagnosticEvent(event) {
	const provenance = coreSemanticRunProgressEvents.get(event);
	coreSemanticRunProgressEvents.delete(event);
	return provenance;
}
//#endregion
//#region src/infra/diagnostic-tool-execution-liveness.ts
const TOOL_EXECUTION_LIVENESS_METADATA_KEY = "toolExecutionLiveness";
const state = resolveGlobalSingleton(Symbol.for("openclaw.diagnosticToolExecutionLiveness"), () => ({
	context: new AsyncLocalStorage(),
	events: /* @__PURE__ */ new WeakMap()
}));
/** The invocation owns the reference; only its execution owner supplies a deadline. */
function createDiagnosticToolExecutionLiveness(signal) {
	let active = true;
	let deadlineAtMs;
	const waits = /* @__PURE__ */ new Map();
	const view = Object.freeze({ get deadlineAtMs() {
		if (signal?.aborted) return;
		let latestDeadline = deadlineAtMs;
		for (const deadline of waits.values()) latestDeadline = Math.max(latestDeadline ?? deadline, deadline);
		return latestDeadline;
	} });
	const record = (deadline) => {
		if (active && !signal?.aborted) deadlineAtMs = deadline;
	};
	record.register = (deadline) => {
		const wait = {};
		if (active && !signal?.aborted && Number.isFinite(deadline)) waits.set(wait, deadline);
		return () => {
			waits.delete(wait);
		};
	};
	return {
		view,
		run(execute) {
			return state.context.run(record, execute);
		},
		close() {
			active = false;
			waits.clear();
		}
	};
}
function recordDiagnosticToolExecutionDeadline(deadlineAtMs) {
	state.context.getStore()?.(deadlineAtMs);
}
/** The enforced response wait owns this allowance, independently of overlapping waits. */
function registerDiagnosticToolExecutionDeadline(deadlineAtMs) {
	return state.context.getStore()?.register?.(deadlineAtMs);
}
/** Keep the live reference out of the cloned, plugin-facing event payload. */
function markToolExecutionLivenessDiagnosticEvent(event, liveness) {
	state.events.set(event, liveness);
	return event;
}
function consumeToolExecutionLivenessDiagnosticEvent(event) {
	const liveness = state.events.get(event);
	state.events.delete(event);
	return liveness;
}
function resolveToolExecutionLivenessDiagnosticMetadata(metadata) {
	return metadata.trusted ? metadata[TOOL_EXECUTION_LIVENESS_METADATA_KEY] : void 0;
}
//#endregion
//#region src/infra/diagnostic-trace-context.ts
const TRACEPARENT_VERSION = "00";
const DEFAULT_TRACE_FLAGS = "01";
const MAX_TRACEPARENT_LENGTH = 128;
const TRACE_ID_RE = /^[0-9a-f]{32}$/;
const SPAN_ID_RE = /^[0-9a-f]{16}$/;
const TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
const TRACEPARENT_VERSION_RE = /^[0-9a-f]{2}$/;
const DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = Symbol.for("openclaw.diagnosticTraceScope.state.v1");
function isNonZeroHex(value) {
	return !/^0+$/.test(value);
}
function randomNonZeroHex(bytes) {
	let value = randomBytes(bytes).toString("hex");
	while (!isNonZeroHex(value)) value = randomBytes(bytes).toString("hex");
	return value;
}
function isDiagnosticTraceScopeState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
	if (isDiagnosticTraceScopeState(existing)) return existing;
	const state = {
		marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
		storage: new AsyncLocalStorage()
	};
	Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
/** Returns whether a value is a non-zero W3C trace id. */
function isValidDiagnosticTraceId(value) {
	return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a non-zero W3C span id. */
function isValidDiagnosticSpanId(value) {
	return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a valid W3C trace-flags byte. */
function isValidDiagnosticTraceFlags(value) {
	return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
function normalizeTraceField(value, isValid) {
	if (typeof value !== "string") return;
	const normalized = value.toLowerCase();
	return isValid(normalized) ? normalized : void 0;
}
/** Parses a W3C `traceparent` header into a normalized diagnostic trace context. */
function parseDiagnosticTraceparent(traceparent) {
	if (typeof traceparent !== "string" || traceparent.length > MAX_TRACEPARENT_LENGTH) return;
	const parts = traceparent.trim().toLowerCase().split("-");
	if (parts.length < 4) return;
	const [version, traceId, spanId, traceFlags] = parts;
	if (!TRACEPARENT_VERSION_RE.test(expectDefined(version, "diagnostic trace context version")) || version === "ff" || version === TRACEPARENT_VERSION && parts.length !== 4) return;
	if (!isValidDiagnosticTraceId(traceId) || !isValidDiagnosticSpanId(spanId) || !isValidDiagnosticTraceFlags(traceFlags)) return;
	return {
		traceId,
		spanId,
		traceFlags
	};
}
/** Formats a diagnostic trace context as a W3C `traceparent` header. */
function formatDiagnosticTraceparent(context) {
	if (!context?.spanId) return;
	const traceId = normalizeTraceField(context.traceId, isValidDiagnosticTraceId);
	const spanId = normalizeTraceField(context.spanId, isValidDiagnosticSpanId);
	const traceFlags = normalizeTraceField(context.traceFlags, isValidDiagnosticTraceFlags) ?? DEFAULT_TRACE_FLAGS;
	if (!traceId || !spanId) return;
	return `${TRACEPARENT_VERSION}-${traceId}-${spanId}-${traceFlags}`;
}
/** Creates a normalized trace context from explicit fields, traceparent, or generated ids. */
function createDiagnosticTraceContext(input = {}) {
	const parsed = parseDiagnosticTraceparent(input.traceparent);
	const traceId = normalizeTraceField(input.traceId, isValidDiagnosticTraceId) ?? parsed?.traceId ?? randomNonZeroHex(16);
	const spanId = normalizeTraceField(input.spanId, isValidDiagnosticSpanId) ?? parsed?.spanId ?? randomNonZeroHex(8);
	const parentSpanId = normalizeTraceField(input.parentSpanId, isValidDiagnosticSpanId);
	return {
		traceId,
		spanId,
		...parentSpanId && parentSpanId !== spanId ? { parentSpanId } : {},
		traceFlags: normalizeTraceField(input.traceFlags, isValidDiagnosticTraceFlags) ?? parsed?.traceFlags ?? DEFAULT_TRACE_FLAGS
	};
}
/** Creates a child context that preserves the parent trace id and records the parent span id. */
function createChildDiagnosticTraceContext(parent, input = {}) {
	const parentSpanId = normalizeTraceField(input.parentSpanId, isValidDiagnosticSpanId) ?? normalizeTraceField(parent.spanId, isValidDiagnosticSpanId);
	return createDiagnosticTraceContext({
		traceId: parent.traceId,
		spanId: input.spanId,
		parentSpanId,
		traceFlags: input.traceFlags ?? parent.traceFlags
	});
}
/** Creates a child of the active trace scope, or a new root context when no scope is active. */
function createDiagnosticTraceContextFromActiveScope(input = {}) {
	const active = getActiveDiagnosticTraceContext();
	if (!active) return createDiagnosticTraceContext(input);
	return createChildDiagnosticTraceContext(active, input);
}
/** Returns an immutable defensive copy of a trace context. */
function freezeDiagnosticTraceContext(context) {
	return Object.freeze({
		traceId: context.traceId,
		...context.spanId ? { spanId: context.spanId } : {},
		...context.parentSpanId ? { parentSpanId: context.parentSpanId } : {},
		...context.traceFlags ? { traceFlags: context.traceFlags } : {}
	});
}
/** Returns the trace context bound to the current async scope. */
function getActiveDiagnosticTraceContext() {
	return getDiagnosticTraceScopeState().storage.getStore();
}
/** Runs a callback with a frozen trace context, or explicitly without a trace. */
function runWithDiagnosticTraceContext(trace, callback) {
	return getDiagnosticTraceScopeState().storage.run(trace === void 0 ? void 0 : freezeDiagnosticTraceContext(trace), callback);
}
//#endregion
//#region src/infra/diagnostic-trace-propagation.ts
const DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY = Symbol.for("openclaw.diagnosticTracePropagation.state.v1");
function isDiagnosticTracePropagationState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY && candidate.bridges instanceof Set;
}
function getDiagnosticTracePropagationState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY];
	if (isDiagnosticTracePropagationState(existing)) return existing;
	const state = {
		marker: DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY,
		bridges: /* @__PURE__ */ new Set()
	};
	Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
function activeDiagnosticTracePropagationBridge() {
	let active;
	for (const bridge of getDiagnosticTracePropagationState().bridges) active = bridge;
	return active;
}
function registerDiagnosticTracePropagationBridge(bridge) {
	const state = getDiagnosticTracePropagationState();
	const registered = bridge;
	state.bridges.add(registered);
	return () => {
		state.bridges.delete(registered);
	};
}
function shouldPrepareDiagnosticTracePropagation(event) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return false;
	if (!bridge.shouldPrepareEvent) return true;
	try {
		return bridge.shouldPrepareEvent(event);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare filter error: ${String(error)}`);
		return false;
	}
}
function prepareDiagnosticTracePropagation(event, metadata) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return;
	try {
		bridge.prepareEvent(event, metadata);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare error type=${event.type} seq=${event.seq}: ${String(error)}`);
	}
}
/** Formats the exporter-owned context when one is active, suppressing unresolved identities. */
function formatPropagatedDiagnosticTraceparent(traceContext) {
	if (!traceContext) return;
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge) return formatDiagnosticTraceparent(traceContext);
	let propagated;
	try {
		propagated = bridge.resolveTraceContext(traceContext);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] resolve error: ${String(error)}`);
		return;
	}
	return formatDiagnosticTraceparent(propagated);
}
function resetDiagnosticTracePropagationForTest() {
	getDiagnosticTracePropagationState().bridges.clear();
}
//#endregion
//#region src/infra/diagnostic-events.ts
const EMPTY_DIAGNOSTIC_PRIVATE_DATA = Object.freeze({});
const MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
const MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
const DIAGNOSTIC_EVENTS_STATE_KEY = Symbol.for("openclaw.diagnosticEvents.state.v1");
const ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
	"diagnostic.gc",
	"gateway.event_loop.sample",
	"gateway.rpc",
	"tool.execution.started",
	"tool.execution.completed",
	"tool.execution.error",
	"tool.execution.blocked",
	"skill.used",
	"exec.process.completed",
	"exec.approval.followup_suppressed",
	"message.delivery.started",
	"message.delivery.completed",
	"message.delivery.error",
	"talk.event",
	"model.call.started",
	"model.call.completed",
	"model.call.error",
	"run.progress",
	"run.execution_phase",
	"agent.commentary",
	"harness.run.completed",
	"harness.run.error",
	"context.assembled",
	"log.record"
]);
const PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
	"tool.execution.completed",
	"tool.execution.error",
	"tool.execution.blocked",
	"model.call.completed",
	"model.call.error",
	"harness.run.completed",
	"harness.run.error"
]);
function createDiagnosticEventsState() {
	return {
		marker: DIAGNOSTIC_EVENTS_STATE_KEY,
		enabled: true,
		seq: 0,
		listeners: /* @__PURE__ */ new Map(),
		trustedListeners: /* @__PURE__ */ new Map(),
		toolExecutionListeners: /* @__PURE__ */ new Set(),
		toolExecutionSeq: 0,
		dispatchDepth: 0,
		asyncQueue: [],
		asyncDrainScheduled: false,
		asyncDroppedEvents: 0,
		asyncDroppedTrustedEvents: 0,
		asyncDroppedUntrustedEvents: 0,
		asyncDroppedPriorityEvents: 0
	};
}
function isDiagnosticEventsState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_EVENTS_STATE_KEY && typeof candidate.enabled === "boolean" && typeof candidate.seq === "number" && candidate.listeners instanceof Map && candidate.trustedListeners instanceof Map && (candidate.toolExecutionListeners === void 0 || candidate.toolExecutionListeners instanceof Set) && typeof candidate.dispatchDepth === "number" && Array.isArray(candidate.asyncQueue) && typeof candidate.asyncDrainScheduled === "boolean";
}
function getDiagnosticEventsState() {
	const existing = globalThis[DIAGNOSTIC_EVENTS_STATE_KEY];
	if (isDiagnosticEventsState(existing)) {
		existing.asyncDroppedEvents ??= 0;
		existing.asyncDroppedTrustedEvents ??= 0;
		existing.asyncDroppedUntrustedEvents ??= 0;
		existing.asyncDroppedPriorityEvents ??= 0;
		existing.toolExecutionListeners ??= /* @__PURE__ */ new Set();
		existing.toolExecutionSeq ??= 0;
		return existing;
	}
	const state = createDiagnosticEventsState();
	Object.defineProperty(globalThis, DIAGNOSTIC_EVENTS_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
/** Returns whether diagnostics are enabled for a loaded config; missing config defaults enabled. */
function isDiagnosticsEnabled(config) {
	return config?.diagnostics?.enabled !== false;
}
/** Sets the process-wide diagnostic dispatcher enable flag. */
function setDiagnosticsEnabledForProcess(enabled) {
	getDiagnosticEventsState().enabled = enabled;
}
/** Returns the current process-wide diagnostic dispatcher enable flag. */
function areDiagnosticsEnabledForProcess() {
	return getDiagnosticEventsState().enabled;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
	if (state.dispatchDepth > 100) {
		console.error(`[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`);
		return;
	}
	state.dispatchDepth += 1;
	try {
		if (!options.trustedListenersOnly) for (const [listener, interest] of state.listeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				listener(cloneDiagnosticValueForListener(enriched), createDiagnosticMetadataForListener(metadata));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : String(err);
				console.error(`[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
		for (const [listener, interest] of state.trustedListeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				const eventForListener = cloneDiagnosticValueForListener(enriched);
				const metadataForListener = createDiagnosticMetadataForListener(metadata);
				if (interest?.includePrivateData === false) listener(eventForListener, metadataForListener, EMPTY_DIAGNOSTIC_PRIVATE_DATA);
				else if (isTrustedOtelDiagnosticListener(listener)) {
					const cloned = structuredClone(privateData ?? {});
					Reflect.deleteProperty(cloned, "hostPluginId");
					listener(eventForListener, metadataForListener, deepFreezeDiagnosticValue(options.hostPluginId ? Object.assign(cloned, { hostPluginId: options.hostPluginId }) : cloned));
				} else listener(eventForListener, metadataForListener, privateData ? cloneDiagnosticValueForListener(privateData) : Object.freeze({}));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : String(err);
				console.error(`[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
	} finally {
		state.dispatchDepth -= 1;
	}
}
function isPriorityAsyncDiagnosticEvent(entry) {
	return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
	state.asyncDroppedEvents += 1;
	if (entry.metadata.trusted) state.asyncDroppedTrustedEvents += 1;
	else state.asyncDroppedUntrustedEvents += 1;
	if (isPriorityAsyncDiagnosticEvent(entry)) state.asyncDroppedPriorityEvents += 1;
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
	const nonPriorityIndex = state.asyncQueue.findIndex((entry) => !isPriorityAsyncDiagnosticEvent(entry));
	if (nonPriorityIndex >= 0) return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
	return state.asyncQueue.shift();
}
function scheduleAsyncDiagnosticDrain(state) {
	if (state.asyncDrainScheduled) return;
	state.asyncDrainScheduled = true;
	setImmediate(() => {
		state.asyncDrainScheduled = false;
		const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
		for (const entry of batch) dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, {
			hostPluginId: entry.hostPluginId,
			trustedListenersOnly: entry.trustedListenersOnly
		});
		if (state.asyncQueue.length > 0) {
			scheduleAsyncDiagnosticDrain(state);
			return;
		}
		dispatchAsyncDiagnosticDropSummary(state);
	});
}
function dispatchAsyncDiagnosticDropSummary(state) {
	if (state.asyncDroppedEvents <= 0) return;
	const droppedEvents = state.asyncDroppedEvents;
	const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
	const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
	const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
	state.asyncDroppedEvents = 0;
	state.asyncDroppedTrustedEvents = 0;
	state.asyncDroppedUntrustedEvents = 0;
	state.asyncDroppedPriorityEvents = 0;
	dispatchDiagnosticEvent(state, enrichDiagnosticEvent(state, {
		type: "diagnostic.async_queue.dropped",
		droppedEvents,
		...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
		...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
		...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
		queueLength: state.asyncQueue.length,
		maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
		drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
	}), createInternalDiagnosticMetadata(false));
}
/** Waits until async diagnostic events queued when called are no longer pending. */
async function waitForDiagnosticEventsDrained() {
	const state = getDiagnosticEventsState();
	const targetSeq = state.asyncQueue.at(-1)?.event.seq;
	if (targetSeq === void 0) return;
	while ((state.asyncQueue[0]?.event.seq ?? Number.POSITIVE_INFINITY) <= targetSeq) await new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function enrichDiagnosticEvent(state, event) {
	const enriched = {};
	for (const [key, value] of Object.entries(event)) {
		if (isBlockedObjectKey(key)) continue;
		enriched[key] = value;
	}
	enriched.trace ??= getActiveDiagnosticTraceContext();
	state.seq += 1;
	enriched.seq = state.seq;
	enriched.ts = Date.now();
	return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
	return {
		internal: true,
		trusted
	};
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
	const state = getDiagnosticEventsState();
	if (trusted && isToolExecutionEventInput(event)) dispatchTrustedToolExecutionEvent(state, event);
	if (!state.enabled) return;
	if (event.type === "security.event" && options.allowSecurityEvent !== true) return;
	const enriched = enrichDiagnosticEvent(state, event);
	const { hostPluginId, internal = false, privateData } = options;
	const trustedTraceContext = options.trustedTraceContext === true;
	const metadata = {
		...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
		...options.toolExecutionLiveness ? { [TOOL_EXECUTION_LIVENESS_METADATA_KEY]: options.toolExecutionLiveness } : {},
		...options.coreModelRequestLifecycle ? { [CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY]: options.coreModelRequestLifecycle } : {},
		...options.coreSemanticRunProgress ? { [CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY]: options.coreSemanticRunProgress } : {},
		...trustedTraceContext ? { trustedTraceContext } : {}
	};
	const prepareTracePropagation = trusted && !options.queuedPhase && shouldPrepareDiagnosticTracePropagation(enriched);
	const queued = options.queuedPhase || ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type);
	if (queued) {
		if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
			if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
				noteAsyncDiagnosticDrop(state, {
					event: enriched,
					metadata,
					privateData,
					hostPluginId
				});
				return;
			}
			const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
			if (droppedEntry) noteAsyncDiagnosticDrop(state, droppedEntry);
		}
		state.asyncQueue.push({
			event: enriched,
			metadata,
			privateData,
			hostPluginId
		});
	}
	if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticValueForListener(enriched), createDiagnosticMetadataForListener(metadata));
	if (queued) scheduleAsyncDiagnosticDrain(state);
	else dispatchDiagnosticEvent(state, enriched, metadata, privateData, { hostPluginId });
}
function isToolExecutionEventInput(event) {
	return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
	state.toolExecutionSeq += 1;
	let enriched;
	try {
		enriched = cloneDiagnosticValueForListener({
			...event,
			seq: state.toolExecutionSeq,
			ts: Date.now()
		});
	} catch (error) {
		console.error(`[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`);
		return;
	}
	notifyListeners(state.toolExecutionListeners, enriched, (error) => {
		console.error(`[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`);
	});
}
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
function emitDiagnosticEvent(event) {
	emitDiagnosticEventWithTrust(event, false);
}
/** Emits an untrusted event whose trace context came from OpenClaw-owned scope. */
function emitDiagnosticEventWithTrustedTraceContext(event) {
	emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
/** Emits an untrusted diagnostic event tagged as internal dispatcher provenance. */
function emitInternalDiagnosticEvent(event) {
	emitDiagnosticEventWithTrust(event, false, { internal: true });
}
/** Returns the latest diagnostic event sequence number assigned in this process. */
function getInternalDiagnosticEventSequence() {
	return getDiagnosticEventsState().seq;
}
/** Emits a trusted diagnostic event from core/runtime-owned instrumentation. */
function emitTrustedDiagnosticEvent(event) {
	const toolExecutionLiveness = consumeToolExecutionLivenessDiagnosticEvent(event);
	const hostPluginId = consumeHostPluginUsageDiagnosticEvent(event);
	const coreSemanticRunProgress = consumeCoreSemanticRunProgressDiagnosticEvent(event);
	emitDiagnosticEventWithTrust(event, true, {
		...toolExecutionLiveness ? { toolExecutionLiveness } : {},
		...hostPluginId ? {
			hostPluginId,
			internal: true
		} : {},
		...coreSemanticRunProgress ? { coreSemanticRunProgress } : {}
	});
}
/** Queues runtime phase observations without changing synchronous startup phases. */
function createQueuedDiagnosticPhaseEmitter() {
	const state = getDiagnosticEventsState();
	const interested = () => {
		if (!state.enabled) return false;
		for (const interest of state.trustedListeners.values()) if (isInternalDiagnosticEventInterested(interest, "diagnostic.phase.completed", true)) return true;
		return false;
	};
	if (!interested()) return;
	const trace = getActiveDiagnosticTraceContext();
	return (phase) => {
		if (!interested()) return;
		runWithDiagnosticTraceContext(trace, () => emitDiagnosticEventWithTrust({
			...phase,
			type: "diagnostic.phase.completed",
			trace,
			details: phase.details ? { ...phase.details } : void 0
		}, true, { queuedPhase: true }));
	};
}
/** Keeps trusted internal skill accounting alive when optional diagnostics are disabled. */
function emitTrustedSkillUsedDiagnosticEvent(event, privateData) {
	const state = getDiagnosticEventsState();
	if (state.enabled) {
		emitDiagnosticEventWithTrust(event, true, { privateData });
		return;
	}
	const queued = {
		event: enrichDiagnosticEvent(state, event),
		metadata: { trusted: true },
		privateData,
		trustedListenersOnly: true
	};
	if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
		noteAsyncDiagnosticDrop(state, queued);
		return;
	}
	state.asyncQueue.push(queued);
	scheduleAsyncDiagnosticDrain(state);
}
/** Emits a trusted diagnostic event with private listener-only payload data. */
function emitTrustedDiagnosticEventWithPrivateData(event, privateData) {
	const coreModelRequestLifecycle = consumeCoreModelRequestLifecycleDiagnosticEvent(event);
	if (!privateData || !Object.hasOwn(privateData, "hostPluginId")) {
		emitDiagnosticEventWithTrust(event, true, {
			coreModelRequestLifecycle,
			privateData
		});
		return;
	}
	const sanitized = { ...privateData };
	Reflect.deleteProperty(sanitized, "hostPluginId");
	emitDiagnosticEventWithTrust(event, true, {
		coreModelRequestLifecycle,
		privateData: sanitized
	});
}
/** Emits a trusted canonical security event from core-owned enforcement boundaries. */
function emitTrustedSecurityEvent(event) {
	emitDiagnosticEventWithTrust({
		type: "security.event",
		...event,
		eventId: event.eventId ?? randomUUID()
	}, true, { allowSecurityEvent: true });
}
/** Emits a trusted model failover diagnostic event. */
function emitFailoverEvent(event) {
	emitTrustedDiagnosticEvent({
		type: "model.failover",
		...event
	});
}
function registerDiagnosticEventListener(state, listeners, listener, filter) {
	if (listeners.has(listener)) updateInternalDiagnosticEventInterest(listeners.get(listener), -1);
	listeners.set(listener, filter);
	updateInternalDiagnosticEventInterest(filter, 1);
	setInternalDiagnosticEventListenerCounts(state.listeners.size, state.trustedListeners.size);
	return () => {
		const interest = listeners.get(listener);
		if (listeners.delete(listener)) updateInternalDiagnosticEventInterest(interest, -1);
		setInternalDiagnosticEventListenerCounts(state.listeners.size, state.trustedListeners.size);
	};
}
/** Subscribes to diagnostic events with dispatcher metadata. */
function onInternalDiagnosticEvent(listener, filter) {
	const state = getDiagnosticEventsState();
	return registerDiagnosticEventListener(state, state.listeners, listener, filter);
}
/** Subscribes to diagnostic events plus trusted private payload data. */
function onTrustedInternalDiagnosticEvent(listener, filter, options) {
	const state = getDiagnosticEventsState();
	return registerDiagnosticEventListener(state, state.trustedListeners, listener, {
		...filter,
		includePrivateData: options?.includePrivateData
	});
}
/** Subscribes to trusted metadata-only tool execution events, even when diagnostics are disabled. */
function onTrustedToolExecutionEvent(listener) {
	return registerListener(getDiagnosticEventsState().toolExecutionListeners, listener);
}
/** Checks currently queued async diagnostic events without draining the queue. */
function hasPendingInternalDiagnosticEvent(predicate) {
	const state = getDiagnosticEventsState();
	for (const entry of state.asyncQueue) {
		let event;
		try {
			event = cloneDiagnosticValueForListener(entry.event);
		} catch {
			continue;
		}
		if (predicate(event, createDiagnosticMetadataForListener(entry.metadata))) return true;
	}
	return false;
}
/** Subscribes to public untrusted diagnostic events only. */
function onDiagnosticEvent(listener) {
	return onInternalDiagnosticEvent((event, metadata) => {
		if (metadata.trusted) return;
		listener(event);
	}, { exclude: [
		"log.record",
		"gateway.rpc",
		"gateway.event_loop.sample",
		"diagnostic.gc"
	] });
}
/** Returns whether listener metadata marks dispatcher-internal provenance. */
function isInternalDiagnosticEventMetadata(metadata) {
	return metadata.internal === true;
}
/** Resets dispatcher state between tests. */
function resetDiagnosticEventsForTest() {
	const state = getDiagnosticEventsState();
	state.enabled = true;
	state.seq = 0;
	state.listeners.clear();
	state.trustedListeners.clear();
	resetInternalDiagnosticEventListenerPresence();
	state.toolExecutionListeners.clear();
	state.toolExecutionSeq = 0;
	state.dispatchDepth = 0;
	state.asyncQueue = [];
	state.asyncDrainScheduled = false;
	state.asyncDroppedEvents = 0;
	state.asyncDroppedTrustedEvents = 0;
	state.asyncDroppedUntrustedEvents = 0;
	state.asyncDroppedPriorityEvents = 0;
	resetDiagnosticTracePropagationForTest();
}
//#endregion
export { isValidDiagnosticSpanId as A, CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY as B, registerDiagnosticTracePropagationBridge as C, formatDiagnosticTraceparent as D, createDiagnosticTraceContextFromActiveScope as E, createDiagnosticToolExecutionLiveness as F, markCoreModelRequestLifecycleDiagnosticEvent as G, markHostPluginUsageDiagnosticEvent as H, markToolExecutionLivenessDiagnosticEvent as I, hasInternalDiagnosticEventListeners as J, deepFreezeDiagnosticValue as K, recordDiagnosticToolExecutionDeadline as L, isValidDiagnosticTraceId as M, parseDiagnosticTraceparent as N, freezeDiagnosticTraceContext as O, runWithDiagnosticTraceContext as P, registerDiagnosticToolExecutionDeadline as R, formatPropagatedDiagnosticTraceparent as S, createDiagnosticTraceContext as T, markTrustedOtelDiagnosticListener as U, markCoreSemanticRunProgressDiagnosticEvent as V, CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY as W, onTrustedInternalDiagnosticEvent as _, emitFailoverEvent as a, setDiagnosticsEnabledForProcess as b, emitTrustedDiagnosticEventWithPrivateData as c, getInternalDiagnosticEventSequence as d, hasPendingInternalDiagnosticEvent as f, onInternalDiagnosticEvent as g, onDiagnosticEvent as h, emitDiagnosticEventWithTrustedTraceContext as i, isValidDiagnosticTraceFlags as j, getActiveDiagnosticTraceContext as k, emitTrustedSecurityEvent as l, isInternalDiagnosticEventMetadata as m, createQueuedDiagnosticPhaseEmitter as n, emitInternalDiagnosticEvent as o, isDiagnosticsEnabled as p, hasInternalDiagnosticEventInterest as q, emitDiagnosticEvent as r, emitTrustedDiagnosticEvent as s, areDiagnosticsEnabledForProcess as t, emitTrustedSkillUsedDiagnosticEvent as u, onTrustedToolExecutionEvent as v, createChildDiagnosticTraceContext as w, waitForDiagnosticEventsDrained as x, resetDiagnosticEventsForTest as y, resolveToolExecutionLivenessDiagnosticMetadata as z };
