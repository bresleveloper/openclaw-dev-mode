import { c as isRecord, i as normalizeOptionalString, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { b as isBlockedObjectKey, g as resolveGlobalSingleton } from "./runtime-doctor-migrations-8XPPImoy.js";
import { a as serializeRedactedFileLogRecord, f as getSealedRuntimeSecureTempRoot, h as truncateUtf16Safe, i as resolveFileLogRedactOptions, l as readLoggingConfig, n as redactSecrets, r as redactSensitiveText, t as redactLogRecordForTransport, u as loggingState } from "./redact-V5IywZh1.js";
import "./src-CkqqhWE1.js";
import { l as expectDefined } from "./types.secrets-CBNculTH.js";
import "./fs-safe-defaults-2jt53BPm.js";
import { t as stripAnsi } from "./ansi-BV4Ablpw.js";
import { a as expandHomePrefix } from "./utils-CROxhhxU.js";
import "node:module";
import fs from "node:fs/promises";
import util from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs";
import { appendRegularFile, appendRegularFileSync } from "@openclaw/fs-safe/advanced";
import os from "node:os";
import { Chalk } from "chalk";
import { Logger } from "tslog";
import { createHash } from "node:crypto";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region src/global-state.ts
let globalVerbose = false;
function isVerbose() {
	return globalVerbose;
}
//#endregion
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
function hasInternalDiagnosticEventInterest(type) {
	const state = getDiagnosticEventListenerPresence();
	return state.broadInterestCount + (state.eventInterestDeltas.get(type) ?? 0) > 0;
}
//#endregion
//#region src/infra/diagnostic-model-request-provenance.ts
const CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY = "coreModelRequestLifecycle";
//#endregion
//#region src/infra/diagnostic-otel-listener-provenance.ts
const trustedOtelDiagnosticListeners = /* @__PURE__ */ new WeakSet();
function isTrustedOtelDiagnosticListener(listener) {
	return trustedOtelDiagnosticListeners.has(listener);
}
//#endregion
//#region src/infra/diagnostic-semantic-run-progress-provenance.ts
const CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY = "coreSemanticRunProgress";
//#endregion
//#region src/infra/diagnostic-tool-execution-liveness.ts
const TOOL_EXECUTION_LIVENESS_METADATA_KEY = "toolExecutionLiveness";
resolveGlobalSingleton(Symbol.for("openclaw.diagnosticToolExecutionLiveness"), () => ({
	context: new AsyncLocalStorage(),
	events: /* @__PURE__ */ new WeakMap()
}));
//#endregion
//#region src/infra/diagnostic-trace-context.ts
const TRACE_ID_RE = /^[0-9a-f]{32}$/;
const SPAN_ID_RE = /^[0-9a-f]{16}$/;
const TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
const DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = Symbol.for("openclaw.diagnosticTraceScope.state.v1");
function isNonZeroHex(value) {
	return !/^0+$/.test(value);
}
function createDiagnosticTraceScopeState() {
	return {
		marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
		storage: new AsyncLocalStorage()
	};
}
function isDiagnosticTraceScopeState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
	if (isDiagnosticTraceScopeState(existing)) return existing;
	const state = createDiagnosticTraceScopeState();
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
/** Returns the trace context bound to the current async scope. */
function getActiveDiagnosticTraceContext() {
	return getDiagnosticTraceScopeState().storage.getStore();
}
//#endregion
//#region src/infra/diagnostic-trace-propagation.ts
const DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY = Symbol.for("openclaw.diagnosticTracePropagation.state.v1");
function createDiagnosticTracePropagationState() {
	return {
		marker: DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY,
		bridges: /* @__PURE__ */ new Set()
	};
}
function isDiagnosticTracePropagationState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY && candidate.bridges instanceof Set;
}
function getDiagnosticTracePropagationState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY];
	if (isDiagnosticTracePropagationState(existing)) return existing;
	const state = createDiagnosticTracePropagationState();
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
				listener(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
				console.error(`[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
		for (const [listener, interest] of state.trustedListeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				const eventForListener = cloneDiagnosticEventForListener(enriched);
				const metadataForListener = createDiagnosticMetadataForListener(metadata);
				if (interest?.includePrivateData === false) listener(eventForListener, metadataForListener, EMPTY_DIAGNOSTIC_PRIVATE_DATA);
				else if (isTrustedOtelDiagnosticListener(listener)) listener(eventForListener, metadataForListener, cloneDiagnosticPrivateDataForOtelListener(privateData, options.hostPluginId));
				else listener(eventForListener, metadataForListener, cloneDiagnosticPrivateDataForListener(privateData));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
				console.error(`[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
	} finally {
		state.dispatchDepth -= 1;
	}
}
function createDiagnosticMetadataForListener(metadata) {
	return Object.freeze({ ...metadata });
}
function cloneDiagnosticEventForListener(event) {
	return deepFreezeDiagnosticValue(structuredClone(event));
}
function cloneDiagnosticPrivateDataForListener(privateData) {
	if (!privateData) return Object.freeze({});
	return deepFreezeDiagnosticValue(structuredClone(privateData));
}
function cloneDiagnosticPrivateDataForOtelListener(privateData, hostPluginId) {
	const cloned = structuredClone(privateData ?? {});
	delete cloned.hostPluginId;
	if (hostPluginId) cloned.hostPluginId = hostPluginId;
	return deepFreezeDiagnosticValue(cloned);
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
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	if (Array.isArray(value)) {
		for (const item of value) deepFreezeDiagnosticValue(item, seen);
		return Object.freeze(value);
	}
	for (const nested of Object.values(value)) deepFreezeDiagnosticValue(nested, seen);
	return Object.freeze(value);
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
		...options.coreSemanticRunProgress === true ? { [CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY]: true } : {},
		...trustedTraceContext ? { trustedTraceContext } : {}
	};
	const prepareTracePropagation = trusted && shouldPrepareDiagnosticTracePropagation(enriched);
	if (ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
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
		if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
		scheduleAsyncDiagnosticDrain(state);
		return;
	}
	if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
	dispatchDiagnosticEvent(state, enriched, metadata, privateData, { hostPluginId });
}
function isToolExecutionEventInput(event) {
	return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
	state.toolExecutionSeq += 1;
	let enriched;
	try {
		enriched = deepFreezeDiagnosticValue(structuredClone({
			...event,
			seq: state.toolExecutionSeq,
			ts: Date.now()
		}));
	} catch (error) {
		console.error(`[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`);
		return;
	}
	for (const listener of state.toolExecutionListeners) try {
		listener(enriched);
	} catch (error) {
		console.error(`[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`);
	}
}
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
function emitDiagnosticEvent(event) {
	emitDiagnosticEventWithTrust(event, false);
}
/** Emits an untrusted event whose trace context came from OpenClaw-owned scope. */
function emitDiagnosticEventWithTrustedTraceContext(event) {
	emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
//#endregion
//#region src/infra/tmp-openclaw-dir.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	const injected = getSealedRuntimeSecureTempRoot();
	if (injected) {
		resolveSecureTempRootRuntime = injected;
		return injected;
	}
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	const moduleNamespace = getBuiltinModule("module");
	if (typeof moduleNamespace.createRequire !== "function") throw new Error("Node createRequire is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = moduleNamespace.createRequire(import.meta.url)("@openclaw/fs-safe/temp").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredOpenClawTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: options.preferredDir ?? "/tmp/openclaw",
		fallbackPrefix: "openclaw",
		warningPrefix: "[openclaw]",
		unsafeFallbackLabel: "OpenClaw temp dir",
		skipPreferredOnWindows: true
	});
}
//#endregion
//#region src/logging/timestamps.ts
const validTimeZoneCache = /* @__PURE__ */ new Map();
const timestampFormatterCache = /* @__PURE__ */ new Map();
let hostTimeZone;
let lastTimestampParts;
function isValidTimeZone(tz) {
	const cached = validTimeZoneCache.get(tz);
	if (cached !== void 0) return cached;
	let valid;
	try {
		new Intl.DateTimeFormat("en", { timeZone: tz }).format();
		valid = true;
	} catch {
		valid = false;
	}
	validTimeZoneCache.set(tz, valid);
	return valid;
}
function resolveEffectiveTimeZone(timeZone) {
	const explicit = timeZone ?? process.env.TZ;
	return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
	return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
	const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
	const second = Math.floor(date.getTime() / 1e3);
	if (lastTimestampParts?.second === second && lastTimestampParts.timeZone === effectiveTimeZone) return lastTimestampParts.parts;
	let fmt = timestampFormatterCache.get(effectiveTimeZone);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat("en", {
			timeZone: effectiveTimeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			fractionalSecondDigits: 3,
			timeZoneName: "longOffset"
		});
		timestampFormatterCache.set(effectiveTimeZone, fmt);
	}
	const parts = {};
	for (const part of fmt.formatToParts(date)) parts[part.type] = part.value;
	lastTimestampParts = {
		second,
		timeZone: effectiveTimeZone,
		parts
	};
	return parts;
}
function formatTimestamp(date, options) {
	const style = options?.style ?? "medium";
	const parts = getTimestampParts(date, options?.timeZone);
	const offset = formatOffset(parts.timeZoneName ?? "GMT");
	const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
	switch (style) {
		case "short": return `${parts.hour}:${parts.minute}:${parts.second}${offset}`;
		case "medium": return `${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
		case "long": return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
	}
	throw new Error("Unsupported timestamp style");
}
//#endregion
//#region src/logging/json-console-line.ts
function formatJsonConsoleLine(params) {
	const envelope = {
		...params.meta,
		time: formatTimestamp(/* @__PURE__ */ new Date(), { style: "long" }),
		level: params.level,
		...params.subsystem ? { subsystem: params.subsystem } : {},
		message: params.message
	};
	return JSON.stringify(redactLogRecordForTransport(envelope, { format: "console" }));
}
/** Formats diagnostics that must bypass console capture without bypassing JSON console style. */
function formatConsoleDiagnosticLine(params) {
	return (loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) === "json" ? formatJsonConsoleLine(params) : params.message;
}
//#endregion
//#region src/logging/levels.ts
const ALLOWED_LOG_LEVELS = [
	"silent",
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace"
];
const MIN_LEVEL_BY_LOG_LEVEL = {
	trace: 1,
	debug: 2,
	info: 3,
	warn: 4,
	error: 5,
	fatal: 6,
	silent: Number.POSITIVE_INFINITY
};
function tryParseLogLevel(level) {
	if (typeof level !== "string") return;
	const candidate = level.trim();
	return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
	return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
	return MIN_LEVEL_BY_LOG_LEVEL[level];
}
//#endregion
//#region src/logging/env-log-level.ts
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
function resolveEnvLogLevelOverride() {
	const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
	if (!trimmed) {
		loggingState.invalidEnvLogLevelValue = null;
		return;
	}
	const parsed = tryParseLogLevel(trimmed);
	if (parsed) {
		loggingState.invalidEnvLogLevelValue = null;
		return parsed;
	}
	if (loggingState.invalidEnvLogLevelValue !== trimmed) {
		loggingState.invalidEnvLogLevelValue = trimmed;
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	}
}
//#endregion
//#region src/logging/log-file-shared.ts
const LOG_PREFIX = "openclaw";
const LOG_SUFFIX = ".log";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
function formatLocalDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region src/logging/log-file-path.ts
const ROLLING_LOG_FILE_RE = /^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u;
const MAX_LOG_PROFILE_SEGMENT_LENGTH = 220;
function encodeLogProfileSegment(profile) {
	let encoded = "";
	for (const char of profile) if (/^[a-z0-9]$/u.test(char)) encoded += char;
	else if (char === "-") encoded += "--";
	else if (char === "_") encoded += "-0";
	else if (/^[A-Z]$/u.test(char)) encoded += `-1${char.toLowerCase()}`;
	else encoded += `-2${char.codePointAt(0)?.toString(16) ?? "0"}-`;
	return encoded;
}
function resolveLogProfileSegment(env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	const encoded = encodeLogProfileSegment(profile);
	if (encoded.length <= MAX_LOG_PROFILE_SEGMENT_LENGTH) return encoded;
	return `-3${createHash("sha256").update(profile).digest("hex")}`;
}
/** Resolves today's default rolling log path for the active CLI profile. */
function resolveDefaultRollingLogFile(options) {
	const date = options?.date ?? /* @__PURE__ */ new Date();
	const env = options?.env ?? process.env;
	const logDir = options?.logDir ?? (canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : "/tmp/openclaw");
	const profileSegment = resolveLogProfileSegment(env);
	const profileSuffix = profileSegment ? `-${profileSegment}` : "";
	return path.join(logDir, `${LOG_PREFIX}${profileSuffix}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Returns whether a configured path had the legacy default rolling filename shape. */
function isLegacyRollingLogFilePath(file) {
	const base = path.basename(file);
	return base === `openclaw-YYYY-MM-DD.log` || ROLLING_LOG_FILE_RE.exec(base)?.[1] === "openclaw";
}
/** Advances a rolling log path to the requested date while preserving its profile family. */
function resolveRollingLogFilePathForDate(file, date) {
	const match = ROLLING_LOG_FILE_RE.exec(path.basename(file));
	if (!match) return isLegacyRollingLogFilePath(file) ? path.join(path.dirname(file), `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`) : file;
	return path.join(path.dirname(file), `${match[1]}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
//#endregion
//#region src/logging/logger-file-message.ts
const MAX_FILE_LOG_MESSAGE_CHARS = 4096;
function clampMessage(text) {
	return text.length > MAX_FILE_LOG_MESSAGE_CHARS ? `${truncateUtf16Safe(text, MAX_FILE_LOG_MESSAGE_CHARS)}...(truncated)` : text;
}
function stringifyFileLogMessagePart(value, json) {
	if (json) return JSON.stringify(value);
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (isRecord(value) && typeof value.message === "string") return value.message;
}
function buildFileLogMessage(record, parts) {
	const text = [];
	const spans = [];
	let length = 0;
	for (const { key, json, primitiveText } of parts) {
		const value = record[key];
		const part = primitiveText ?? stringifyFileLogMessagePart(value, json);
		if (!part?.trim()) continue;
		if (text.length > 0) length += 1;
		spans.push({
			key,
			json,
			messageField: !json && isRecord(value),
			start: length,
			...primitiveText === void 0 ? {} : { primitiveLength: primitiveText.length }
		});
		text.push(part);
		length += part.length;
	}
	if (text.length === 0) return;
	const joined = text.join(" ");
	const prefix = truncateUtf16Safe(joined, MAX_FILE_LOG_MESSAGE_CHARS);
	const textValue = clampMessage(joined);
	return {
		text: textValue,
		contentLength: prefix.length,
		finish: (value) => value === textValue ? value : clampMessage(value),
		parts: spans
	};
}
//#endregion
//#region src/logging/logger-file-transport.ts
const DEFAULT_MAX_QUEUED_RECORDS = 4096;
const MAX_APPEND_BATCH_BYTES = 65536;
const MAX_ROTATED_LOG_FILES = 5;
const MAX_TRACKED_APPEND_FAILURE_FILES = 64;
let queue = [];
let queueStart = 0;
let activeBatch = null;
let activeIndex = 0;
let droppedCount = 0;
let droppedTarget = null;
let maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
let scheduledFlush = null;
let flushPromise = null;
let drainGeneration = 0;
let processExiting = false;
let processHooksInstalled = false;
let appendFile = appendRegularFile;
const warnedRotationFiles = /* @__PURE__ */ new Map();
const warnedAppendFiles = /* @__PURE__ */ new Set();
let appendFailureTrackingSaturated = false;
function rotatedLogPath(file, index) {
	const ext = path.extname(file);
	return `${file.slice(0, file.length - ext.length)}.${index}${ext}`;
}
function rotateLogFile(file) {
	try {
		fs$1.mkdirSync(path.dirname(file), { recursive: true });
		fs$1.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
		for (let index = 4; index >= 1; index -= 1) {
			const from = rotatedLogPath(file, index);
			if (fs$1.existsSync(from)) fs$1.renameSync(from, rotatedLogPath(file, index + 1));
		}
		if (fs$1.existsSync(file)) fs$1.renameSync(file, rotatedLogPath(file, 1));
		return true;
	} catch {
		return false;
	}
}
async function getCurrentLogFileBytes(file) {
	try {
		return (await fs.stat(file)).size;
	} catch {
		return 0;
	}
}
function getCurrentLogFileBytesSync(file) {
	try {
		return fs$1.statSync(file).size;
	} catch {
		return 0;
	}
}
function buildDroppedMarker(target, count) {
	const date = /* @__PURE__ */ new Date();
	const message = `[openclaw] file log queue overflow; dropped ${count} oldest record${count === 1 ? "" : "s"}`;
	const record = {
		0: message,
		_meta: {
			date,
			hostname: target.hostname,
			logLevelName: "WARN",
			name: "openclaw"
		},
		time: formatTimestamp(date, { style: "long" }),
		hostname: target.hostname,
		message,
		dropped: count
	};
	return {
		...target,
		payload: `${serializeRedactedFileLogRecord(record)}\n`
	};
}
function writeFileTransportWarning(message, synchronous) {
	try {
		const line = `${formatConsoleDiagnosticLine({
			level: "warn",
			message: redactSensitiveText(message)
		})}\n`;
		if (synchronous) fs$1.writeSync(process.stderr.fd, line);
		else process.stderr.write(line);
		return true;
	} catch {
		return false;
	}
}
function warnAboutRotationFailure(entry, synchronous) {
	if (warnedRotationFiles.get(entry.file) === entry.maxFileBytes) return;
	warnedRotationFiles.set(entry.file, entry.maxFileBytes);
	writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${entry.file} maxFileBytes=${entry.maxFileBytes}`, synchronous);
}
function warnAboutAppendFailure(entry, synchronous) {
	if (warnedAppendFiles.has(entry.file)) return;
	const saturated = warnedAppendFiles.size >= MAX_TRACKED_APPEND_FAILURE_FILES;
	if (saturated && appendFailureTrackingSaturated) return;
	if (!writeFileTransportWarning(saturated ? "[openclaw] log file append failure diagnostics saturated; suppressing new file targets" : `[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${entry.file}`, synchronous)) return;
	if (saturated) appendFailureTrackingSaturated = true;
	else warnedAppendFiles.add(entry.file);
}
function clearAppendFailure(entry) {
	if (warnedAppendFiles.delete(entry.file)) appendFailureTrackingSaturated = false;
}
function claimQueuedEntries() {
	const entries = queueStart === 0 ? queue : [...queue.slice(queueStart), ...queue.slice(0, queueStart)];
	queue = [];
	queueStart = 0;
	if (droppedCount > 0 && droppedTarget) entries.unshift(buildDroppedMarker(droppedTarget, droppedCount));
	droppedCount = 0;
	droppedTarget = null;
	return entries;
}
function prepareWrite(entry, cursor, synchronous, entries, index) {
	let payloadBytes = Buffer.byteLength(entry.payload, "utf8");
	if (cursor.bytes > 0 && cursor.bytes + payloadBytes > entry.maxFileBytes) {
		if (rotateLogFile(entry.file)) {
			cursor.bytes = 0;
			warnedRotationFiles.delete(entry.file);
		} else warnAboutRotationFailure(entry, synchronous);
	}
	let nextIndex = index + 1;
	if (synchronous) return {
		payload: entry.payload,
		payloadBytes,
		nextIndex
	};
	const payloads = [entry.payload];
	for (; nextIndex < entries.length; nextIndex += 1) {
		const next = entries[nextIndex];
		if (!next || next.file !== entry.file || next.maxFileBytes !== entry.maxFileBytes) break;
		const nextBytes = Buffer.byteLength(next.payload, "utf8");
		if (payloadBytes + nextBytes > MAX_APPEND_BATCH_BYTES || cursor.bytes + payloadBytes + nextBytes > entry.maxFileBytes) break;
		payloads.push(next.payload);
		payloadBytes += nextBytes;
	}
	return {
		payload: payloads.join(""),
		payloadBytes,
		nextIndex
	};
}
async function writeEntries(entries, generation) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		if (generation !== drainGeneration || processExiting) return;
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: await getCurrentLogFileBytes(entry.file) };
			if (generation !== drainGeneration || processExiting) return;
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, false, entries, index);
		activeIndex = batch.nextIndex;
		try {
			await appendFile({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, false);
		} finally {
			for (const written of entries.slice(index, batch.nextIndex)) written.payload = "";
			index = batch.nextIndex;
		}
	}
}
function writeEntriesSync(entries) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: getCurrentLogFileBytesSync(entry.file) };
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, true, entries, index);
		try {
			appendRegularFileSync({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, true);
		}
		entry.payload = "";
		index = batch.nextIndex;
	}
}
async function runFlushLoop() {
	const generation = drainGeneration;
	for (;;) {
		if (generation !== drainGeneration || processExiting) return;
		const entries = claimQueuedEntries();
		if (entries.length === 0) return;
		activeBatch = entries;
		activeIndex = 0;
		await writeEntries(entries, generation);
		if (generation !== drainGeneration) return;
		activeBatch = null;
		activeIndex = 0;
	}
}
function startFlush() {
	if (flushPromise || processExiting) return;
	const running = runFlushLoop().catch(() => void 0);
	flushPromise = running;
	running.then(() => {
		if (flushPromise === running) flushPromise = null;
		if (queue.length > 0 || droppedCount > 0) scheduleFlush();
	});
}
function scheduleFlush() {
	if (scheduledFlush || flushPromise || processExiting) return;
	scheduledFlush = setImmediate(() => {
		scheduledFlush = null;
		startFlush();
	});
}
function handleProcessBeforeExit() {
	flushFileLogQueue();
}
function handleProcessExit() {
	processExiting = true;
	drainFileLogQueueSync();
}
function installProcessHooks() {
	if (processHooksInstalled) return;
	processHooksInstalled = true;
	process.on("beforeExit", handleProcessBeforeExit);
	process.on("exit", handleProcessExit);
}
function removeProcessHooks() {
	if (!processHooksInstalled) return;
	process.removeListener("beforeExit", handleProcessBeforeExit);
	process.removeListener("exit", handleProcessExit);
	processHooksInstalled = false;
}
if (process.env.VITEST !== "true") installProcessHooks();
/** Enqueues one serialized record without waiting for filesystem I/O. */
function enqueueFileLog(entry) {
	if (processExiting) {
		writeEntriesSync([entry]);
		return;
	}
	installProcessHooks();
	if (queue.length >= maxQueuedRecords) {
		const dropped = queue[queueStart];
		if (dropped) {
			dropped.payload = "";
			droppedTarget ??= dropped;
			droppedCount += 1;
		}
		queue[queueStart] = entry;
		queueStart = (queueStart + 1) % queue.length;
	} else queue.push(entry);
	scheduleFlush();
}
/** Waits until every record currently queued for the async transport has settled. */
async function flushFileLogQueue() {
	for (;;) {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = null;
		}
		if (!flushPromise && (queue.length > 0 || droppedCount > 0)) startFlush();
		const running = flushPromise;
		if (!running) return;
		await running;
	}
}
/** Synchronously rescues pending records for process.exit() and crash-adjacent paths. */
function drainFileLogQueueSync() {
	if (scheduledFlush) {
		clearImmediate(scheduledFlush);
		scheduledFlush = null;
	}
	drainGeneration += 1;
	const entries = activeBatch ? activeBatch.slice(activeIndex) : [];
	activeBatch = null;
	activeIndex = 0;
	entries.push(...claimQueuedEntries());
	writeEntriesSync(entries);
}
function setFileLogQueueMaxRecordsForTests(value) {
	maxQueuedRecords = Math.max(1, value ?? DEFAULT_MAX_QUEUED_RECORDS);
}
function setFileLogAppenderForTests(value) {
	appendFile = value ?? appendRegularFile;
}
function resetFileLogTransportForTests() {
	drainFileLogQueueSync();
	removeProcessHooks();
	processExiting = false;
	appendFile = appendRegularFile;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	warnedRotationFiles.clear();
	warnedAppendFiles.clear();
	appendFailureTrackingSaturated = false;
}
const fileLogTransport = {
	drainSync: drainFileLogQueueSync,
	enqueue: enqueueFileLog,
	flush: flushFileLogQueue,
	resetForTests: resetFileLogTransportForTests,
	setAppenderForTests: setFileLogAppenderForTests,
	setMaxQueuedRecordsForTests: setFileLogQueueMaxRecordsForTests
};
//#endregion
//#region src/logging/logger-hostname-state.ts
const defaultLoggerHostnameResolver = () => os.hostname();
const loggerHostnameState = {
	cached: null,
	resolver: defaultLoggerHostnameResolver
};
//#endregion
//#region src/logging/logger.ts
const DEFAULT_LOG_FILE = `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
const MAX_LOG_AGE_MS = 864e5;
const DEFAULT_MAX_LOG_FILE_BYTES = 104857600;
const MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8192;
const MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4096;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2048;
const MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
const MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
const DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
function clampDiagnosticLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampDiagnosticLogText(redactSensitiveText(clampDiagnosticLogText(value, maxChars)), maxChars);
}
function normalizeDiagnosticLogName(value) {
	if (!value || value.trim().startsWith("{")) return;
	const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
	if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) return;
	const normalizedKey = key.trim();
	if (isBlockedObjectKey(normalizedKey)) return;
	if (redactSensitiveText(normalizedKey) !== normalizedKey) return;
	if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) return;
	if (typeof value === "string") {
		attributes[normalizedKey] = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
		state.count += 1;
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[normalizedKey] = value;
		state.count += 1;
		return;
	}
	if (typeof value === "boolean") {
		attributes[normalizedKey] = value;
		state.count += 1;
	}
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
	if (!source) return;
	for (const key in source) {
		if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) break;
		if (!Object.hasOwn(source, key) || key === "trace") continue;
		assignDiagnosticLogAttribute(attributes, state, key, source[key]);
	}
}
function isPlainLogRecordObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (!isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function extractTraceContext(value) {
	const direct = normalizeTraceContext(value);
	if (direct) return direct;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return normalizeTraceContext(value.trace);
}
function getSortedNumericLogEntries(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0]));
}
function clampFileLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return String(value);
}
function readFirstContextString(sources, keys) {
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			const value = normalizeFileLogContextValue(source[key]);
			if (value) return value;
		}
	}
}
function resolveLogHostname() {
	if (loggerHostnameState.cached) return loggerHostnameState.cached;
	const hostname = loggerHostnameState.resolver().trim();
	if (!hostname) return "unknown";
	loggerHostnameState.cached = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return meta;
	return {
		...meta,
		hostname
	};
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
	const fromBindings = extractTraceContext(bindings);
	if (fromBindings) return fromBindings;
	for (const arg of numericArgs) {
		const fromArg = extractTraceContext(arg);
		if (fromArg) return fromArg;
	}
}
function resolveLogTraceContext(bindings, numericArgs) {
	const explicitTrace = findLogTraceContext(bindings, numericArgs);
	if (explicitTrace) return {
		trace: explicitTrace,
		trustedTraceContext: false
	};
	const activeTrace = getActiveDiagnosticTraceContext();
	return activeTrace ? {
		trace: activeTrace,
		trustedTraceContext: true
	} : { trustedTraceContext: false };
}
function prepareFileLogRecord(logObj) {
	const entries = getSortedNumericLogEntries(logObj);
	const { bindings, args } = extractLogBindingPrefix(entries.map(([, value]) => value));
	const { trace } = resolveLogTraceContext(bindings, args);
	const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
	const sources = [
		structuredArg,
		bindings,
		logObj
	];
	const metadataCount = structuredArg && typeof structuredArg.message !== "string" ? 1 : 0;
	const messageParts = entries.slice(entries.length - args.length + metadataCount).map(([key, value]) => {
		const part = {
			key,
			json: value != null && ![
				"string",
				"number",
				"boolean",
				"bigint"
			].includes(typeof value) && !(value instanceof Error) && !(isPlainLogRecordObject(value) && typeof value.message === "string")
		};
		if (typeof value === "number" && !Number.isFinite(value)) part.primitiveText = String(value);
		return part;
	});
	const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
	const sessionId = readFirstContextString(sources, [
		"session_id",
		"sessionId",
		"sessionKey"
	]);
	const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
	return {
		fields: {
			hostname: resolveLogHostname(),
			...agentId ? { agent_id: agentId } : {},
			...sessionId ? { session_id: sessionId } : {},
			...channel ? { channel } : {},
			...trace
		},
		messageParts
	};
}
function buildDiagnosticLogRecord(logObj) {
	const meta = logObj["_meta"];
	const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogEntries(logObj).map(([, value]) => value));
	const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
	const structuredArg = numericArgs[0];
	const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
	if (structuredBindings) numericArgs.shift();
	let message = "";
	if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") message = sanitizeDiagnosticLogText(String(numericArgs.pop()), MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS);
	else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
		message = String(numericArgs[0]);
		numericArgs.length = 0;
	}
	if (!message) message = "log";
	const attributes = Object.create(null);
	const attributeState = { count: 0 };
	addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
	addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
	const code = {};
	if (meta?.path?.fileLine) {
		const line = Number(meta.path.fileLine);
		if (Number.isFinite(line)) code.line = line;
	}
	if (meta?.path?.method) code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	const loggerName = normalizeDiagnosticLogName(meta?.name);
	const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
	return {
		event: {
			type: "log.record",
			level: meta?.logLevelName ?? "INFO",
			message,
			...loggerName ? { loggerName } : {},
			...loggerParents?.length ? { loggerParents } : {},
			...Object.keys(attributes).length > 0 ? { attributes } : {},
			...Object.keys(code).length > 0 ? { code } : {},
			...trace ? { trace } : {}
		},
		trustedTraceContext
	};
}
function attachDiagnosticEventTransport(logger) {
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("log.record")) return;
			try {
				const record = buildDiagnosticLogRecord(redactSecrets(logObj));
				(record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent)(record.event);
			} catch {}
		}
	});
}
function canUseSilentVitestFileLogFastPath(envLevel) {
	return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") return path.join(process.cwd(), ".artifacts", "test-logs", `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`);
	return resolveDefaultRollingLogFile();
}
function resolveSettings() {
	if (!canUseNodeFs()) return {
		level: "silent",
		file: DEFAULT_LOG_FILE,
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: false
	};
	const envLevel = resolveEnvLogLevelOverride();
	if (canUseSilentVitestFileLogFastPath(envLevel)) return {
		level: "silent",
		file: resolveDefaultRollingLogFile(),
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: true
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
	const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
	const level = envLevel ?? fromConfig;
	const rolling = cfg?.file ? isLegacyRollingLogFilePath(cfg.file) : true;
	return {
		level,
		file: resolveActiveLogFileWithMode(cfg?.file ?? resolveDefaultActiveLogFile(), rolling),
		maxFileBytes: resolveMaxLogFileBytes(cfg?.maxFileBytes),
		rolling
	};
}
function getRuntimeSettings() {
	const settings = loggingState.cachedSettings ?? resolveSettings();
	loggingState.cachedSettings = settings;
	return settings;
}
function isFileLogLevelEnabled(level) {
	const settings = getRuntimeSettings();
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function inheritLogLevel(logger, getLevel) {
	let resolveLevel = getLevel;
	Object.defineProperty(logger.settings, "minLevel", {
		configurable: true,
		enumerable: true,
		get: () => resolveLevel(),
		set: (level) => {
			resolveLevel = () => level;
		}
	});
}
var RuntimeLogger = class extends Logger {
	getSubLogger(settings, logObj) {
		const minLevel = settings?.minLevel ?? this.settings.minLevel;
		const child = super.getSubLogger({
			...settings,
			minLevel: minLevel === Infinity ? levelToMinLevel("fatal") : minLevel
		}, logObj);
		if (settings?.minLevel == null) inheritLogLevel(child, () => this.settings.minLevel);
		else if (minLevel === Infinity) child.settings.minLevel = minLevel;
		return child;
	}
};
function buildLogger() {
	const logger = new RuntimeLogger({
		name: "openclaw",
		mask: { keys: [] },
		meta: { property: "_meta" },
		minLevel: levelToMinLevel("fatal"),
		type: "hidden"
	});
	inheritLogLevel(logger, () => levelToMinLevel(getRuntimeSettings().level));
	let activeFile;
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			try {
				const settings = getRuntimeSettings();
				if (settings.level === "silent") return;
				const nextActiveFile = resolveActiveLogFileWithMode(settings.file, settings.rolling);
				if (nextActiveFile !== activeFile) {
					activeFile = nextActiveFile;
					fs$1.mkdirSync(path.dirname(activeFile), { recursive: true });
					if (settings.rolling) pruneOldRollingLogs(path.dirname(activeFile));
				}
				const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
				const { fields, messageParts } = prepareFileLogRecord(logObj);
				const line = serializeRedactedFileLogRecord({
					...logObj,
					_meta: withResolvedLogMetaHostname(logObj["_meta"], expectDefined(fields.hostname, "structured log hostname")),
					time,
					...fields
				}, {
					deriveMessage: (materialized) => buildFileLogMessage(materialized, messageParts),
					decodedOptions: resolveFileLogRedactOptions()
				});
				fileLogTransport.enqueue({
					file: activeFile,
					hostname: expectDefined(fields.hostname, "structured log hostname"),
					maxFileBytes: settings.maxFileBytes,
					payload: `${line}\n`
				});
			} catch {}
		}
	});
	attachDiagnosticEventTransport(logger);
	return logger;
}
function resolveMaxLogFileBytes(raw) {
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getLogger() {
	const cachedLogger = loggingState.cachedLogger;
	if (cachedLogger) return cachedLogger;
	getRuntimeSettings();
	const logger = buildLogger();
	loggingState.cachedLogger = logger;
	return logger;
}
function getChildLogger(bindings, opts) {
	const base = getLogger();
	const name = bindings ? JSON.stringify(bindings) : void 0;
	return base.getSubLogger({
		name,
		prefix: bindings ? [name ?? ""] : [],
		...opts?.level ? { minLevel: levelToMinLevel(opts.level) } : {}
	});
}
function resolveActiveLogFileWithMode(file, rolling) {
	const expandedFile = expandHomePrefix(file);
	return rolling ? resolveRollingLogFilePathForDate(expandedFile, /* @__PURE__ */ new Date()) : expandedFile;
}
function pruneOldRollingLogs(dir) {
	try {
		const entries = fs$1.readdirSync(dir, { withFileTypes: true });
		const cutoff = Date.now() - MAX_LOG_AGE_MS;
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!entry.name.startsWith(`openclaw-`) || !entry.name.endsWith(".log")) continue;
			const fullPath = path.join(dir, entry.name);
			try {
				if (fs$1.statSync(fullPath).mtimeMs < cutoff) fs$1.rmSync(fullPath, { force: true });
			} catch {}
		}
	} catch {}
}
//#endregion
//#region packages/terminal-core/src/restore.ts
const RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
function reportRestoreFailure(scope, err, reason) {
	const suffix = reason ? ` (${reason})` : "";
	const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
	try {
		process.stderr.write(`${message}\n`);
	} catch (writeErr) {
		console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
	}
}
function restoreTerminalState(reason, options = {}) {
	const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
	const resetStream = options.resetStream ?? process.stdout;
	const stdin = process.stdin;
	if (stdin.isTTY && typeof stdin.setRawMode === "function") {
		try {
			stdin.setRawMode(false);
		} catch (err) {
			reportRestoreFailure("raw mode", err, reason);
		}
		if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) try {
			stdin.resume();
		} catch (err) {
			reportRestoreFailure("stdin resume", err, reason);
		}
	}
	if (resetStream.isTTY) try {
		resetStream.write(RESET_SEQUENCE);
	} catch (err) {
		reportRestoreFailure("terminal reset", err, reason);
	}
}
//#endregion
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
	if (!shouldEmitRuntimeStdout()) return;
	const line = value.endsWith("\n") ? value : `${value}\n`;
	try {
		process.stdout.write(line);
	} catch (err) {
		if (isPipeClosedError(err)) return;
		throw err;
	}
}
function createRuntimeIo() {
	return {
		log: (...args) => {
			if (!shouldEmitRuntimeLog()) return;
			console.log(...args);
		},
		error: (...args) => {
			console.error(...args);
		},
		writeStdout,
		writeJson: (value, space = 2) => {
			writeStdout(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		}
	};
}
/** Keep terminal reset bytes off stdout when the invocation owns machine-readable output. */
function restoreRuntimeTerminalState(reason, options = {}) {
	const resetStream = options.resetStream ?? (loggingState.forceConsoleToStderr ? process.stderr : void 0);
	restoreTerminalState(reason, {
		...options,
		...resetStream ? { resetStream } : {}
	});
}
const defaultRuntime = {
	...createRuntimeIo(),
	exit: (code, opts) => {
		restoreRuntimeTerminalState("runtime exit", {
			resumeStdinIfPaused: false,
			...opts?.resetStream ? { resetStream: opts.resetStream } : {}
		});
		process.exit(code);
		throw new Error("unreachable");
	}
};
//#endregion
//#region src/logging/console.ts
function normalizeConsoleLevel(level) {
	if (isVerbose()) return "debug";
	if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") return "silent";
	return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
	if (style === "compact" || style === "json" || style === "pretty") return style;
	if (!process.stdout.isTTY) return "compact";
	return "pretty";
}
function resolveConsoleSettings() {
	const envLevel = resolveEnvLogLevelOverride();
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) return {
		level: "silent",
		style: normalizeConsoleStyle(void 0)
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	return {
		level: envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel),
		style: normalizeConsoleStyle(cfg?.consoleStyle)
	};
}
function getConsoleSettings() {
	const cached = loggingState.cachedConsoleSettings;
	if (cached) return cached;
	const settings = resolveConsoleSettings();
	loggingState.cachedConsoleSettings = settings;
	return loggingState.cachedConsoleSettings;
}
function normalizeConsoleSubsystem(subsystem) {
	if (typeof subsystem !== "string") return null;
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
const SUPPRESSED_CONSOLE_PREFIXES = [
	"Closing session:",
	"Opening session:",
	"Removing old closed session:",
	"Session already closed",
	"Session already open"
];
`${process.release.name}${process.pid}`;
function shouldSuppressConsoleMessage(message) {
	return SUPPRESSED_CONSOLE_PREFIXES.some((prefix) => message.startsWith(prefix));
}
function isEpipeError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
}
function captureConsoleTraceStack(message, caller) {
	const trace = new Error(message);
	trace.name = "Trace";
	Error.captureStackTrace(trace, caller);
	return trace.stack === void 0 ? `Trace: ${message}` : typeof trace.stack === "string" ? trace.stack : util.format(trace.stack);
}
function hasTimestampPrefix(value) {
	return /^(?:\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)/.test(value);
}
function writeFormattedConsoleOutput(params) {
	const consoleStyle = getConsoleSettings().style;
	const trimmed = consoleStyle !== "json" && loggingState.consoleTimestampPrefix ? stripAnsi(params.formatted).trimStart() : "";
	const timestamp = trimmed && !hasTimestampPrefix(trimmed) ? formatConsoleTimestamp(consoleStyle) : "";
	const stack = params.level === "trace" && params.caller ? captureConsoleTraceStack(params.formatted, params.caller) : void 0;
	try {
		const rendered = consoleStyle === "json" ? formatJsonConsoleLine({
			level: params.level,
			message: stripAnsi(params.formatted),
			meta: stack === void 0 ? void 0 : { stack: stripAnsi(stack) }
		}) : redactSensitiveText(stack ?? params.formatted);
		const line = timestamp ? `${timestamp} ${rendered}` : rendered;
		if (loggingState.forceConsoleToStderr) process.stderr.write(`${line}\n`);
		else if (consoleStyle !== "json" && !timestamp && params.args.length === 0 && stack === void 0) params.write.apply(console, params.args);
		else params.write.call(console, line);
	} catch (err) {
		if (isEpipeError(err)) return;
		throw err;
	}
}
/** Writes a root logger line to the pre-capture console sink without re-entering file capture. */
function writeRootConsoleLine(method, line) {
	const rawConsole = loggingState.rawConsole;
	if (!rawConsole) return false;
	if (shouldSuppressConsoleMessage(line)) return true;
	writeFormattedConsoleOutput({
		level: method === "error" ? "error" : "info",
		args: [line],
		formatted: line,
		write: rawConsole[method]
	});
	return true;
}
//#endregion
//#region src/logging/subsystem.ts
var subsystem_exports = /* @__PURE__ */ __exportAll({
	createSubsystemLogger: () => createSubsystemLogger,
	stripRedundantSubsystemPrefixForConsole: () => stripRedundantSubsystemPrefixForConsole
});
function normalizeSubsystemLabel(subsystem) {
	if (typeof subsystem !== "string") return "unknown";
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
(() => {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return null;
	try {
		const utilNamespace = getBuiltinModule("util");
		return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
	} catch {
		return null;
	}
})();
function isRichConsoleEnv() {
	const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
	if (process.env.COLORTERM || process.env.TERM_PROGRAM) return true;
	return term.length > 0 && term !== "dumb";
}
const consoleColors = [];
function getColorForConsole() {
	const level = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0" || !process.env.NO_COLOR && (process.stdout.isTTY || process.stderr.isTTY || isRichConsoleEnv()) ? 1 : 0;
	return consoleColors[level] ??= new Chalk({ level });
}
const SUBSYSTEM_COLORS = [
	"cyan",
	"green",
	"yellow",
	"blue",
	"magenta",
	"red"
];
const SUBSYSTEM_COLOR_OVERRIDES = /* @__PURE__ */ new Map([["gmail-watcher", "blue"]]);
const SUBSYSTEM_PREFIXES_TO_DROP = [
	"gateway",
	"channels",
	"providers"
];
const SUBSYSTEM_MAX_SEGMENTS = 2;
const CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
	"clickclack",
	"discord",
	"feishu",
	"googlechat",
	"imessage",
	"irc",
	"line",
	"matrix",
	"mattermost",
	"msteams",
	"nextcloud-talk",
	"nostr",
	"openclaw-weixin",
	"qqbot",
	"signal",
	"slack",
	"synology-chat",
	"telegram",
	"tlon",
	"twitch",
	"webchat",
	"wecom",
	"whatsapp",
	"yuanbao",
	"zalo",
	"zalouser"
]);
function isChannelSubsystemPrefix(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (!normalized) return false;
	return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(subsystem) {
	const override = SUBSYSTEM_COLOR_OVERRIDES.get(subsystem);
	if (override) return override;
	let hash = 0;
	for (let i = 0; i < subsystem.length; i += 1) hash = hash * 31 + subsystem.charCodeAt(i) | 0;
	const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
	return expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
}
function formatSubsystemForConsole(subsystem) {
	const parts = subsystem.split("/").filter(Boolean);
	const original = parts.join("/") || subsystem;
	while (parts.length > 0) {
		const first = parts.at(0);
		if (first === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first)) break;
		parts.shift();
	}
	const first = parts.at(0);
	if (first === void 0) return original;
	if (isChannelSubsystemPrefix(first)) return first;
	if (parts.length > SUBSYSTEM_MAX_SEGMENTS) return parts.slice(-2).join("/");
	return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
	if (!displaySubsystem) return message;
	if (message.startsWith("[")) {
		const closeIdx = message.indexOf("]");
		if (closeIdx > 1) {
			const bracketTag = message.slice(1, closeIdx);
			if (normalizeLowercaseStringOrEmpty(bracketTag) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
				let i = closeIdx + 1;
				while (message[i] === " ") i += 1;
				return message.slice(i);
			}
		}
	}
	const prefix = message.slice(0, displaySubsystem.length);
	if (normalizeLowercaseStringOrEmpty(prefix) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) return message;
	const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
	if (next !== ":" && next !== " ") return message;
	let i = displaySubsystem.length;
	while (message[i] === " ") i += 1;
	if (message[i] === ":") i += 1;
	while (message[i] === " ") i += 1;
	return message.slice(i);
}
function createConsoleLineFormatter(subsystem) {
	const displaySubsystem = formatSubsystemForConsole(subsystem);
	const prefix = `[${displaySubsystem}]`;
	const prefixColor = pickSubsystemColor(displaySubsystem);
	return (level, message, style) => {
		const color = getColorForConsole();
		const levelColor = level === "error" || level === "fatal" ? color.red : level === "warn" ? color.yellow : level === "debug" || level === "trace" ? color.gray : color.cyan;
		const displayMessage = stripRedundantSubsystemPrefixForConsole(redactSensitiveText(message), displaySubsystem);
		const time = style === "pretty" || loggingState.consoleTimestampPrefix ? color.gray(formatConsoleTimestamp(style)) : "";
		const prefixToken = color[prefixColor](prefix);
		return `${time ? `${time} ${prefixToken}` : prefixToken} ${levelColor(displayMessage)}`;
	};
}
function writeConsoleLine(level, line, opts = {}) {
	const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
	const redacted = opts.redacted ? sanitized : redactSensitiveText(sanitized);
	const sink = loggingState.rawConsole ?? console;
	if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") (sink.error ?? console.error)(redacted);
	else if (level === "warn") (sink.warn ?? console.warn)(redacted);
	else (sink.log ?? console.log)(redacted);
}
function shouldSuppressProbeConsoleLine(params) {
	if (isVerbose()) return false;
	if (params.level === "error" || params.level === "fatal") return false;
	const message = typeof params.message === "string" ? params.message : "";
	if (!params.suppressProbeMessages) return false;
	if ((typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0)?.startsWith("probe-")) return true;
	return /(sessionId|runId)=probe-/.test(message);
}
const CONSOLE_META_LEVELS = /* @__PURE__ */ new Set([
	"warn",
	"error",
	"fatal"
]);
const CONSOLE_META_MAX_CHARS = 2048;
function formatConsoleMetaValue(value) {
	if (value === void 0) return;
	if (typeof value === "string") return /\s|=/.test(value) || value.length === 0 ? JSON.stringify(value) : value;
	if (value === null || typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
/** Keeps an Error's message, which a JSON round-trip would otherwise reduce to `{}`. */
function prepareConsoleMetaRecord(meta) {
	let prepared;
	for (const [key, value] of Object.entries(meta)) if (value instanceof Error) {
		prepared ??= { ...meta };
		prepared[key] = value.message;
	}
	return prepared ?? meta;
}
/**
* Renders structured fields as one compact `key=value` tail so warn/error/fatal
* records keep their diagnostics in plain-text sinks such as journald, which only
* see the console line. The JSON console style and the file sink carry the same
* fields natively, so only plain styles call this.
*
* Fields pass through the shared console transport redactor before flattening, so
* key-aware protection such as `apiToken` survives the loss of structure and the
* length cap can only clip text that is already masked. That redactor also owns
* circular references, bigints, and values with no JSON form, and returns parsed
* data, so rendering a value here cannot re-enter a stateful `toJSON`.
*/
function formatConsoleMeta(meta) {
	let redacted;
	try {
		redacted = redactLogRecordForTransport(prepareConsoleMetaRecord(meta), { format: "console" });
	} catch {
		return "";
	}
	const parts = [];
	for (const [key, value] of Object.entries(redacted)) {
		const rendered = formatConsoleMetaValue(value);
		if (rendered !== void 0) parts.push(`${key}=${rendered}`);
	}
	const joined = parts.join(" ");
	return joined.length > CONSOLE_META_MAX_CHARS ? `${joined.slice(0, CONSOLE_META_MAX_CHARS)}...(truncated)` : joined;
}
function logToFile(fileLogger, level, message, meta) {
	if (level === "silent") return;
	if (meta && Object.keys(meta).length > 0) fileLogger[level](meta, message);
	else fileLogger[level](message);
}
function createSubsystemLogger(subsystem) {
	const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
	const suppressProbeMessages = resolvedSubsystem === "agent/embedded" || resolvedSubsystem.startsWith("agent/embedded/") || resolvedSubsystem === "model-fallback" || resolvedSubsystem.startsWith("model-fallback/");
	let fileChild;
	let fileChildWithoutStack;
	let formatConsoleLine;
	const getFileLogger = (level) => {
		fileChild ??= getChildLogger({ subsystem: resolvedSubsystem });
		if (level === "error" || level === "fatal" || areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("log.record")) return fileChild;
		if (!fileChildWithoutStack) {
			fileChildWithoutStack = fileChild.getSubLogger({ stack: { capture: "off" } });
			fileChildWithoutStack.settings.parentNames = fileChild.settings.parentNames;
		}
		return fileChildWithoutStack;
	};
	const emitLog = (level, message, meta) => {
		const consoleSettings = getConsoleSettings();
		const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
		const fileEnabled = isFileLogLevelEnabled(level);
		if (!consoleEnabled && !fileEnabled) return;
		let consoleMessageOverride;
		let fileMeta = meta;
		if (meta && Object.keys(meta).length > 0) {
			const { consoleMessage, ...rest } = meta;
			if (typeof consoleMessage === "string") consoleMessageOverride = consoleMessage;
			fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
		}
		if (fileEnabled) logToFile(getFileLogger(level), level, message, fileMeta);
		if (!consoleEnabled) return;
		const consoleMeta = consoleSettings.style !== "json" && consoleMessageOverride === void 0 && fileMeta && CONSOLE_META_LEVELS.has(level) ? formatConsoleMeta(fileMeta) : "";
		const consoleMessage = consoleMessageOverride ?? (consoleMeta ? `${message} ${consoleMeta}` : message);
		if (shouldSuppressProbeConsoleLine({
			level,
			suppressProbeMessages,
			message: consoleMessage,
			meta: fileMeta
		})) return;
		writeConsoleLine(level, consoleSettings.style === "json" ? formatJsonConsoleLine({
			level,
			subsystem: resolvedSubsystem,
			message,
			meta: fileMeta
		}) : (formatConsoleLine ??= createConsoleLineFormatter(resolvedSubsystem))(level, consoleMessage, consoleSettings.style), { redacted: true });
	};
	return {
		subsystem: resolvedSubsystem,
		isEnabled(level, target = "any") {
			const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
			const isFileEnabled = isFileLogLevelEnabled(level);
			if (target === "console") return isConsoleEnabled;
			if (target === "file") return isFileEnabled;
			return isConsoleEnabled || isFileEnabled;
		},
		trace(message, meta) {
			emitLog("trace", message, meta);
		},
		debug(message, meta) {
			emitLog("debug", message, meta);
		},
		info(message, meta) {
			emitLog("info", message, meta);
		},
		warn(message, meta) {
			emitLog("warn", message, meta);
		},
		error(message, meta) {
			emitLog("error", message, meta);
		},
		fatal(message, meta) {
			emitLog("fatal", message, meta);
		},
		raw(message) {
			if (isFileLogLevelEnabled("info")) logToFile(getFileLogger("info"), "info", message, { raw: true });
			const consoleSettings = getConsoleSettings();
			if (shouldLogToConsole("info", { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
				if (shouldSuppressProbeConsoleLine({
					level: "info",
					suppressProbeMessages,
					message
				})) return;
				writeConsoleLine("info", consoleSettings.style === "json" ? formatJsonConsoleLine({
					level: "info",
					subsystem: resolvedSubsystem,
					message
				}) : message, { redacted: consoleSettings.style === "json" });
			}
		},
		child(name) {
			return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
		}
	};
}
//#endregion
export { getChildLogger as a, isVerbose as c, defaultRuntime as i, __commonJSMin as l, subsystem_exports as n, getLogger as o, writeRootConsoleLine as r, resolvePreferredOpenClawTmpDir as s, createSubsystemLogger as t, __toESM as u };
