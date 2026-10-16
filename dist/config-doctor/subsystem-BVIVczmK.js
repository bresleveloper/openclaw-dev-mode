import { A as asOptionalRecord, D as normalizeOptionalString, T as normalizeLowercaseStringOrEmpty, _ as isPlainObject, g as mergeDeep, h as resolveGlobalSingleton, j as isRecord, m as resolveGlobalSet, p as pruneMapToMaxSize, v as isBlockedObjectKey, y as isMissingPathError } from "./runtime-doctor-migrations-BhouWAUC.js";
import "./src-BRYbjtIr.js";
import { i as parseEnvTemplateSecretRef, u as expectDefined } from "./types.secrets-pt3cVWr4.js";
import { a as tryProcessCwd, t as expandHomePrefix } from "./account-core-bZmYRKLc.js";
import "./ansi-twpzQrRE.js";
import { i as resolveIncludeRoots, n as openRootFileSync, r as resolveConfigPath, t as canUseRootFileOpen } from "./boundary-file-read-D-7q9BJU.js";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { isPathInside } from "@openclaw/fs-safe/path";
import path from "node:path";
import fs$1 from "node:fs";
import { appendRegularFile, appendRegularFileSync } from "@openclaw/fs-safe/advanced";
import { createHash } from "node:crypto";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { Chalk } from "chalk";
import { Logger } from "tslog";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
//#endregion
//#region src/shared/regexp.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
//#region src/infra/tmp-openclaw-dir.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	if (typeof process.getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = process.getBuiltinModule("module").createRequire(import.meta.url)("@openclaw/fs-safe/secure-temp-root").resolveSecureTempRoot;
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
//#region src/shared/listeners.ts
/** Notifies every registered listener while isolating individual listener failures. */
function notifyListeners(listeners, event, onError) {
	for (const listener of listeners) try {
		listener(event);
	} catch (error) {
		onError?.(error);
	}
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
/** Returns the trace context bound to the current async scope. */
function getActiveDiagnosticTraceContext() {
	return getDiagnosticTraceScopeState().storage.getStore();
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
//#endregion
//#region src/shared/dot-path.ts
/** Appends one config path segment without confusing literal record keys with traversal. */
function appendConfigPathSegment(path, segment) {
	if (typeof segment === "number") return `${path}[${segment}]`;
	if (!/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(segment)) return `${path}[${JSON.stringify(segment)}]`;
	return path ? `${path}.${segment}` : segment;
}
//#endregion
//#region src/config/env-substitution.ts
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const DEFAULT_VALUE_OPERATOR = ":-";
/** Error thrown when a config value references a missing or empty environment variable. */
var MissingEnvVarError = class extends Error {
	constructor(varName, configPath) {
		super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
		this.varName = varName;
		this.configPath = configPath;
		this.name = "MissingEnvVarError";
	}
};
/** Rebuilds the authored placeholder text for a parsed token. */
function renderEnvTemplateToken(token) {
	return token.defaultValue === void 0 ? `\${${token.name}}` : `\${${token.name}${DEFAULT_VALUE_OPERATOR}${token.defaultValue}}`;
}
function* iterateEnvTemplateTokens(value) {
	for (let index = value.indexOf("$"); index !== -1; index = value.indexOf("$", index + 1)) {
		const escaped = value[index + 1] === "$" && value[index + 2] === "{";
		if (!escaped && value[index + 1] !== "{") continue;
		const start = index + (escaped ? 3 : 2);
		const end = value.indexOf("}", start);
		if (end === -1) continue;
		const body = value.slice(start, end);
		const operatorIndex = body.indexOf(DEFAULT_VALUE_OPERATOR);
		const name = operatorIndex === -1 ? body : body.slice(0, operatorIndex);
		const defaultValue = operatorIndex === -1 ? void 0 : body.slice(operatorIndex + 2);
		if (!ENV_VAR_NAME_PATTERN.test(name) || defaultValue?.includes("$") || defaultValue?.includes("{")) continue;
		yield {
			kind: escaped ? "escaped" : "substitution",
			name,
			defaultValue,
			start: index,
			end
		};
		index = end;
	}
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	let end = 0;
	for (const token of iterateEnvTemplateTokens(value)) {
		chunks.push(value.slice(end, token.start));
		end = token.end + 1;
		if (token.kind === "escaped") {
			chunks.push(renderEnvTemplateToken(token));
			continue;
		}
		const envValue = env[token.name];
		if (envValue === void 0 || envValue === "") {
			if (token.defaultValue !== void 0) {
				chunks.push(token.defaultValue);
				continue;
			}
			if (opts?.onMissing) {
				opts.onMissing({
					varName: token.name,
					configPath
				});
				if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
				chunks.push(renderEnvTemplateToken(token));
				continue;
			}
			throw new MissingEnvVarError(token.name, configPath);
		}
		if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
		chunks.push(envValue);
	}
	chunks.push(value.slice(end));
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	for (const token of iterateEnvTemplateTokens(value)) if (token.kind === "substitution") return true;
	return false;
}
/** Resolve config string templates, preserving unresolved text when onMissing is supplied. */
function resolveConfigEnvVars(value, env = process.env, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, "");
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
//#endregion
//#region src/utils/parse-json-compat.ts
/**
* JSON parser compatibility helper for persisted config, manifests, and legacy stores.
* Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
*/
let json5Runtime;
function isJson5Parser(value) {
	return typeof value === "object" && value !== null && "parse" in value && typeof value.parse === "function";
}
function setJson5Runtime(runtime) {
	const parser = isJson5Parser(runtime) ? runtime : typeof runtime === "object" && runtime !== null && "default" in runtime ? runtime.default : void 0;
	if (!isJson5Parser(parser)) throw new Error("json5 parser unavailable");
	json5Runtime = parser;
	return parser;
}
function loadJson5Parser() {
	if (json5Runtime) return json5Runtime;
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed JSON5 runtime was not registered before use");
	return setJson5Runtime(createRequire(import.meta.url)("json5"));
}
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5) {
	try {
		return JSON.parse(raw);
	} catch {
		return (json5 ?? loadJson5Parser()).parse(raw);
	}
}
//#endregion
//#region src/config/includes.ts
const INCLUDE_KEY = "$include";
const MAX_INCLUDE_FILE_BYTES = 2097152;
/** Maximum length for $include path and resolved path (CWE-22 hardening). */
const MAX_INCLUDE_PATH_LENGTH = 4096;
function isConfigContainer(value) {
	return Array.isArray(value) || isPlainObject(value);
}
function includeLogicalPath(link) {
	const parts = [];
	for (let current = link; current; current = current.parent) parts.push(current.key);
	return parts.toReversed();
}
var ConfigIncludeError = class extends Error {
	constructor(message, includePath, cause) {
		super(message);
		this.includePath = includePath;
		this.cause = cause;
		this.name = "ConfigIncludeError";
	}
};
/** File access failed; the included configuration has not been validated. */
var ConfigIncludeReadError = class extends ConfigIncludeError {
	constructor(..._args) {
		super(..._args);
		this.name = "ConfigIncludeReadError";
	}
};
var CircularIncludeError = class extends ConfigIncludeError {
	constructor(chain) {
		super(`Circular include detected: ${chain.join(" -> ")}`, expectDefined(chain[chain.length - 1], "chain entry at chain.length 1"));
		this.chain = chain;
		this.name = "CircularIncludeError";
	}
};
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
	return mergeDeep(target, source, {
		arrays: "concat",
		undefinedValues: "replace"
	});
}
var IncludeProcessor = class {
	constructor(basePath, resolver, boundary, rootProjectionKeys) {
		this.basePath = basePath;
		this.resolver = resolver;
		this.boundary = boundary;
		this.rootProjectionKeys = rootProjectionKeys;
	}
	get rootDir() {
		return this.boundary.configRoot.rootDir;
	}
	process(obj) {
		const stack = [];
		let current = this.traverseValue(obj, null, false, {
			basePath: this.basePath,
			visited: /* @__PURE__ */ new Set([path.normalize(this.basePath)]),
			depth: 0
		});
		let delivered = void 0;
		for (;;) {
			const step = current.next(delivered);
			if (step.done) {
				const parent = stack.pop();
				if (!parent) return step.value;
				delivered = step.value;
				current = parent;
				continue;
			}
			stack.push(current);
			current = this.traverseValue(step.value.value, step.value.pathLink, step.value.hasArrayAncestor, step.value.context);
		}
	}
	*traverseValue(value, pathLink, hasArrayAncestor, context) {
		if (Array.isArray(value)) {
			const result = [];
			for (const [index, item] of value.entries()) result.push(isConfigContainer(item) ? yield {
				value: item,
				pathLink: {
					parent: pathLink,
					key: String(index)
				},
				hasArrayAncestor: true,
				context
			} : item);
			return result;
		}
		if (!isPlainObject(value)) return value;
		if (!("$include" in value)) {
			const isRoot = pathLink === null;
			const result = {};
			for (const [key, entry] of Object.entries(value)) {
				if (isRoot && this.rootProjectionKeys && !this.rootProjectionKeys.has(key)) continue;
				result[key] = isConfigContainer(entry) ? yield {
					value: entry,
					pathLink: {
						parent: pathLink,
						key
					},
					hasArrayAncestor,
					context
				} : entry;
			}
			return result;
		}
		return yield* this.traverseInclude(value, pathLink, hasArrayAncestor, context);
	}
	*traverseInclude(obj, pathLink, hasArrayAncestor, context) {
		const includeValue = obj[INCLUDE_KEY];
		const isRoot = pathLink === null;
		const siblingKeys = Object.keys(obj).filter((key) => key !== "$include" && (!isRoot || !this.rootProjectionKeys || this.rootProjectionKeys.has(key)));
		const multiple = Array.isArray(includeValue);
		if (!multiple && typeof includeValue !== "string") throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof includeValue}`, String(includeValue));
		const entries = [];
		for (const item of multiple ? includeValue : [includeValue]) {
			if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
			const loaded = this.loadFileSync(item, context);
			entries.push({
				value: yield {
					value: loaded.parsed,
					pathLink,
					hasArrayAncestor,
					context: loaded.nestedContext
				},
				targetPath: loaded.resolvedPath
			});
		}
		const included = multiple ? entries.reduce((current, entry) => deepMerge(current, entry.value), {}) : entries[0].value;
		this.resolver.onIncludeResolved?.({
			path: includeLogicalPath(pathLink),
			value: included,
			kind: multiple ? "multiple" : "single",
			hasSiblingOverrides: siblingKeys.length > 0,
			hasArrayAncestor,
			...multiple ? { targetPaths: entries.map((entry) => entry.targetPath) } : { targetPath: entries[0].targetPath }
		});
		if (siblingKeys.length === 0) return included;
		if (!isPlainObject(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
		const rest = {};
		for (const key of siblingKeys) {
			const sibling = obj[key];
			rest[key] = isConfigContainer(sibling) ? yield {
				value: sibling,
				pathLink: {
					parent: pathLink,
					key
				},
				hasArrayAncestor,
				context
			} : sibling;
		}
		return deepMerge(included, rest);
	}
	loadFileSync(includePath, context) {
		const { resolvedPath, root } = this.resolvePath(includePath, context);
		if (context.visited.has(resolvedPath)) throw new CircularIncludeError([...context.visited, resolvedPath]);
		if (context.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
		const raw = this.readFile(includePath, resolvedPath, root);
		return {
			parsed: this.parseFile(includePath, resolvedPath, raw),
			resolvedPath,
			nestedContext: {
				basePath: resolvedPath,
				visited: /* @__PURE__ */ new Set([...context.visited, resolvedPath]),
				depth: context.depth + 1
			}
		};
	}
	resolvePath(includePath, context) {
		if (includePath.includes("\0")) throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
		if (includePath.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const configDir = path.dirname(context.basePath);
		const resolved = path.isAbsolute(includePath) ? includePath : path.resolve(configDir, includePath);
		const normalized = path.normalize(resolved);
		if (normalized.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const lexicalMatch = this.findContainingRoot(normalized, "rootDir");
		if (!lexicalMatch) throw new ConfigIncludeError(`Include path escapes config directory: ${includePath} (root: ${this.rootDir})`, includePath);
		this.resolver.onLexicalPath?.(normalized);
		try {
			const real = fs$1.realpathSync(normalized);
			const realMatch = this.findContainingRoot(real, "rootRealDir");
			if (!realMatch) throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`, includePath);
			return {
				resolvedPath: normalized,
				root: realMatch
			};
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			if (isMissingPathError(err)) return {
				resolvedPath: normalized,
				root: lexicalMatch
			};
			throw new ConfigIncludeReadError(`Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	findContainingRoot(candidate, field) {
		if (isPathInside(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
		for (const root of this.boundary.allowedRoots) if (isPathInside(root[field], candidate)) return root;
		return null;
	}
	readFile(includePath, resolvedPath, root) {
		try {
			if (this.resolver.readFileWithGuards) return this.resolver.readFileWithGuards({
				includePath,
				resolvedPath,
				rootRealDir: root.rootRealDir
			});
			return this.resolver.readFile(resolvedPath);
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			throw new ConfigIncludeReadError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	parseFile(includePath, resolvedPath, raw) {
		try {
			return this.resolver.parseJson(raw);
		} catch (err) {
			throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
};
function safeRealpath(target) {
	try {
		return fs$1.realpathSync(target);
	} catch {
		return target;
	}
}
/** Capture the lexical and canonical include roots once for a resolver traversal. */
function createConfigIncludeBoundary(configPath, allowedRoots = []) {
	const configRootDir = path.normalize(path.dirname(configPath));
	return {
		configRoot: {
			rootDir: configRootDir,
			rootRealDir: path.normalize(safeRealpath(configRootDir))
		},
		allowedRoots: allowedRoots.filter((entry) => typeof entry === "string" && entry.length > 0 && path.isAbsolute(entry)).map((entry) => {
			const rootDir = path.normalize(entry);
			return {
				rootDir,
				rootRealDir: path.normalize(safeRealpath(rootDir))
			};
		})
	};
}
function readConfigIncludeFileWithGuards(params) {
	const ioFs = params.ioFs ?? fs$1;
	const maxBytes = params.maxBytes ?? MAX_INCLUDE_FILE_BYTES;
	if (!canUseRootFileOpen(ioFs)) {
		const raw = ioFs.readFileSync(params.resolvedPath, "utf-8");
		try {
			params.onResolvedPath?.(path.normalize(ioFs.realpathSync(params.resolvedPath)));
		} catch {}
		return raw;
	}
	const opened = openRootFileSync({
		absolutePath: params.resolvedPath,
		rootPath: params.rootRealDir,
		rootRealPath: params.rootRealDir,
		boundaryLabel: "config directory",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		maxBytes,
		ioFs
	});
	if (!opened.ok) {
		if (opened.reason === "validation") throw new ConfigIncludeError(`Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`, params.includePath);
		throw new ConfigIncludeReadError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
	}
	try {
		const raw = ioFs.readFileSync(opened.fd, "utf-8");
		params.onResolvedPath?.(path.normalize(opened.path));
		return raw;
	} finally {
		ioFs.closeSync(opened.fd);
	}
}
const defaultResolver = {
	readFile: (p) => fs$1.readFileSync(p, "utf-8"),
	readFileWithGuards: readConfigIncludeFileWithGuards,
	parseJson: parseJsonWithJson5Fallback
};
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? [])).process(obj);
}
/**
* Resolves one top-level config field through the canonical include graph while
* leaving unrelated top-level branches untouched. Early bootstrap readers use
* this when a malformed sibling must not hide an independently valid setting.
*/
function resolveConfigIncludesForTopLevelKey(obj, configPath, key, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []), /* @__PURE__ */ new Set([key])).process(obj);
}
//#endregion
//#region src/logging/state.ts
const LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
const APPLIED_LOGGING_CONFIG_UNOWNED = "unowned";
function createUnownedAppliedLoggingConfig() {
	return APPLIED_LOGGING_CONFIG_UNOWNED;
}
function createLoggingState() {
	return {
		appliedConfig: createUnownedAppliedLoggingConfig(),
		cachedLogger: null,
		cachedSettings: null,
		cachedConsoleSettings: null,
		overrideSettings: null,
		invalidEnvLogLevelValue: null,
		consolePatched: false,
		forceConsoleToStderr: false,
		earlyConsoleRoutingRestore: null,
		consoleTimestampPrefix: false,
		consoleSubsystemFilter: null,
		streamErrorHandlersInstalled: false,
		rawConsole: null
	};
}
const globalStore = globalThis;
const loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
if (!Object.hasOwn(loggingState, "appliedConfig")) loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
globalStore[LOGGING_STATE_KEY] = loggingState;
//#endregion
//#region src/logging/config.ts
let cachedLoggingConfig;
function resolveLoggingConfigSelector() {
	const env = process.env;
	return [
		env.OPENCLAW_CONFIG_PATH,
		env.OPENCLAW_STATE_DIR,
		env.OPENCLAW_HOME,
		env.OPENCLAW_PROFILE,
		env.HOME,
		env.USERPROFILE,
		env.HOMEDRIVE,
		env.HOMEPATH,
		env.PREFIX,
		env.ANDROID_DATA,
		env.OPENCLAW_TEST_FAST,
		tryProcessCwd() ?? ""
	].map((value) => value ?? "").join("\0");
}
function resolvePartialDiagnosticLoggingConfig(logging) {
	if (!isRecord(logging)) return;
	const partial = {};
	if (typeof logging.consoleStyle === "string") try {
		const resolved = resolveConfigEnvVars({ consoleStyle: logging.consoleStyle });
		if (isRecord(resolved) && (resolved.consoleStyle === "pretty" || resolved.consoleStyle === "compact" || resolved.consoleStyle === "json")) partial.consoleStyle = resolved.consoleStyle;
	} catch {}
	if (Array.isArray(logging.redactPatterns)) try {
		const resolved = resolveConfigEnvVars({ redactPatterns: logging.redactPatterns });
		if (isRecord(resolved) && Array.isArray(resolved.redactPatterns) && resolved.redactPatterns.every((entry) => typeof entry === "string")) partial.redactPatterns = resolved.redactPatterns;
	} catch {}
	return Object.keys(partial).length > 0 ? partial : void 0;
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
	try {
		if (loggingState.appliedConfig !== "unowned") return loggingState.appliedConfig;
		const selector = resolveLoggingConfigSelector();
		if (cachedLoggingConfig?.selector === selector) return cachedLoggingConfig.logging;
		const configPath = resolveConfigPath();
		if (!fs$1.existsSync(configPath)) {
			cachedLoggingConfig = {
				selector,
				logging: void 0
			};
			return;
		}
		const parsed = parseJsonWithJson5Fallback(fs$1.readFileSync(configPath, "utf8"));
		const allowedRoots = resolveIncludeRoots();
		let includedConfig;
		try {
			includedConfig = resolveConfigIncludesForTopLevelKey(parsed, configPath, "logging", void 0, { allowedRoots });
		} catch {
			const directLogging = isRecord(parsed) ? parsed.logging : void 0;
			if (directLogging === void 0) return;
			try {
				includedConfig = resolveConfigIncludes({ logging: directLogging }, configPath, void 0, { allowedRoots });
			} catch {
				return resolvePartialDiagnosticLoggingConfig(directLogging);
			}
		}
		let resolvedConfig;
		try {
			resolvedConfig = resolveConfigEnvVars(includedConfig);
		} catch {
			return resolvePartialDiagnosticLoggingConfig(isRecord(includedConfig) ? includedConfig.logging : void 0);
		}
		const logging = isRecord(resolvedConfig) ? resolvedConfig.logging : void 0;
		const resolvedLogging = isRecord(logging) ? logging : void 0;
		cachedLoggingConfig = {
			selector,
			logging: resolvedLogging
		};
		return resolvedLogging;
	} catch {
		return;
	}
}
//#endregion
//#region packages/net-policy/src/redact-sensitive-url.ts
const SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
	"token",
	"key",
	"api_key",
	"apikey",
	"secret",
	"access_token",
	"auth_token",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"id_token",
	"code",
	"client_secret",
	"app_secret",
	"hook_token",
	"refresh_token",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"private_key",
	"credential",
	"authorization",
	"sig",
	"x_api_key",
	"x_access_token",
	"x_auth_token"
]);
const URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE = /(?:^|_)token(?:_[a-f0-9]{16,})?$/u;
const MAX_NESTED_URL_REDACTION_DEPTH = 8;
function normalizeUrlQueryParamName(name) {
	let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
	for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
		let decoded;
		try {
			decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
		} catch {
			break;
		}
		if (decoded === current) return {
			value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
			unresolvedEncoding: false
		};
		current = decoded;
	}
	return {
		value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
		unresolvedEncoding: current.includes("%")
	};
}
/** True for auth-like URL query parameter names that should be redacted. */
function isSensitiveUrlQueryParamName(name) {
	const normalized = normalizeUrlQueryParamName(name);
	return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value) || SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE.test(normalized.value);
}
//#endregion
//#region packages/acp-core/src/structured-auth-redaction.ts
const HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
const HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
const HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
const HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
const HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
const HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
const HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
const HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
const HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const STRUCTURED_AUTH_HEADER_RE = new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`, "giu");
const AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
	let cursor = start;
	while (value[cursor] === " " || value[cursor] === "	") cursor += 1;
	return cursor;
}
function skipSerializedBackslashes(value, start) {
	let cursor = start;
	while (cursor - start < 64 && value[cursor] === "\\") cursor += 1;
	return cursor;
}
function readSerializedLineEnd(value, start) {
	const cursor = skipSerializedBackslashes(value, start);
	if (cursor === start) return null;
	if (value[cursor] === "n") return cursor + 1;
	if (value[cursor] !== "r") return null;
	const lineEnd = skipSerializedBackslashes(value, cursor + 1);
	return lineEnd > cursor + 1 && value[lineEnd] === "n" ? lineEnd + 1 : null;
}
function readSerializedTabEnd(value, start) {
	const cursor = skipSerializedBackslashes(value, start);
	return cursor > start && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipHorizontalWhitespace(value, cursor);
		const tabEnd = readSerializedTabEnd(value, cursor);
		if (tabEnd !== null) {
			cursor = tabEnd;
			continue;
		}
		const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
		if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) return cursor;
		cursor = lineEnd;
	}
}
function readAuthParamName(value, start) {
	const match = AUTH_PARAM_TOKEN_RE.exec(value.slice(start));
	return match ? {
		name: match[0].toLowerCase(),
		end: start + match[0].length
	} : null;
}
function isAuthHeaderStart(value, index) {
	const previous = value[index - 1];
	let serializedLineBoundary = false;
	if (previous === "n" || previous === "r") {
		let slashCursor = index - 2;
		let slashCount = 0;
		while (slashCount < 64 && value[slashCursor] === "\\") {
			slashCount += 1;
			slashCursor -= 1;
		}
		serializedLineBoundary = slashCount > 0;
	}
	if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) return false;
	const proxyName = "proxy-authorization";
	const directName = "authorization";
	const candidate = value.slice(index, index + 19).toLowerCase();
	const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
	if (!name) return false;
	const quoteStart = index + name.length;
	let cursor = skipSerializedBackslashes(value, quoteStart);
	if (value[cursor] === "\"" || value[cursor] === "'") cursor += 1;
	else if (cursor > quoteStart) return false;
	cursor = skipHorizontalWhitespace(value, cursor);
	return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipAuthWhitespace(value, cursor);
		if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
		if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") return null;
		if (value[cursor] === ",") {
			cursor += 1;
			continue;
		}
		const param = readAuthParamName(value, cursor);
		if (param) {
			const equals = skipAuthWhitespace(value, param.end);
			if (value[equals] === "=" && value[equals + 1] !== "=") return cursor;
		}
		while (cursor < value.length) {
			const whitespaceEnd = skipAuthWhitespace(value, cursor);
			if (whitespaceEnd > cursor) {
				cursor = whitespaceEnd;
				continue;
			}
			if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
			const char = value[cursor];
			if (char === "\r" || char === "\n" || char === ";") return null;
			cursor += 1;
			if (char === ",") break;
		}
	}
}
function usesAuthParams(scheme) {
	return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function isAuthFieldEnd(char) {
	return char === void 0 || char === "\r" || char === "\n" || char === ";" || char === "\\" || char === "\"" || char === "'" || char === "}" || char === "]";
}
function findAuthFieldEnd(value, start) {
	let cursor = start;
	while (cursor < value.length) {
		const whitespaceEnd = skipAuthWhitespace(value, cursor);
		if (whitespaceEnd > cursor) {
			cursor = whitespaceEnd;
			continue;
		}
		if (cursor > start && isAuthHeaderStart(value, cursor)) break;
		if (isAuthFieldEnd(value[cursor])) break;
		cursor += 1;
	}
	return cursor;
}
function readParamValue(value, start, options) {
	let escapedQuoteSlashCount = 0;
	while (value[start + escapedQuoteSlashCount] === "\\") escapedQuoteSlashCount += 1;
	const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === "\"";
	const quote = value[start] === "\"" || value[start] === "'" ? value[start] : void 0;
	if (quote || escapedQuotes) {
		let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
		while (cursor < value.length) {
			if (value[cursor] === "\r" || value[cursor] === "\n") {
				const whitespaceEnd = skipAuthWhitespace(value, cursor);
				if (whitespaceEnd === cursor) break;
				cursor = whitespaceEnd;
				continue;
			}
			if (escapedQuotes && value[cursor] === "\\") {
				let slashEnd = cursor + 1;
				while (value[slashEnd] === "\\") slashEnd += 1;
				if (value[slashEnd] === "\"") {
					if ((slashEnd - cursor) % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) return slashEnd + 1;
					cursor = slashEnd + 1;
					continue;
				}
				cursor = slashEnd;
				continue;
			}
			if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
				cursor += 2;
				continue;
			}
			if (!escapedQuotes && value[cursor] === quote) return cursor + 1;
			cursor += 1;
		}
		return cursor > start + 1 ? cursor : null;
	}
	if (options.signedHeaders) {
		const match = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(value.slice(start));
		if (!match) return null;
		const end = start + match[0].length;
		const next = value[end];
		return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
	}
	const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(value.slice(start));
	return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
	const ranges = [];
	for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
		const scheme = (header[2] ?? "").toLowerCase();
		let cursor = (header.index ?? 0) + header[0].length;
		const rangeStart = cursor;
		let rangeEnd = cursor;
		const directParam = readAuthParamName(value, cursor);
		const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
		if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
			if (value[skipAuthWhitespace(value, cursor)] !== "," && !usesAuthParams(scheme)) continue;
			const firstParamStart = findNextAuthParamStart(value, cursor);
			if (firstParamStart === null) continue;
			cursor = firstParamStart;
		}
		for (;;) {
			const param = readAuthParamName(value, cursor);
			if (!param) break;
			cursor = skipAuthWhitespace(value, param.end);
			if (value[cursor] !== "=") break;
			cursor = skipAuthWhitespace(value, cursor + 1);
			const valueEnd = readParamValue(value, cursor, {
				awsScope: scheme.startsWith("aws4-") && param.name === "credential",
				signedHeaders: param.name === "signedheaders"
			});
			if (valueEnd === null) {
				const nextParamStart = findNextAuthParamStart(value, cursor);
				if (nextParamStart !== null) {
					cursor = nextParamStart;
					continue;
				}
				rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
				break;
			}
			rangeEnd = valueEnd;
			const separator = skipAuthWhitespace(value, valueEnd);
			if (value[separator] !== ",") {
				if (!isAuthFieldEnd(value[separator])) {
					const nextParamStart = findNextAuthParamStart(value, separator);
					if (nextParamStart !== null) {
						cursor = nextParamStart;
						continue;
					}
					rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
				}
				break;
			}
			const nextParamStart = findNextAuthParamStart(value, separator + 1);
			if (nextParamStart === null) break;
			cursor = nextParamStart;
		}
		if (rangeEnd > rangeStart) ranges.push({
			start: rangeStart,
			end: rangeEnd
		});
	}
	return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
	const parts = [];
	let cursor = 0;
	for (const range of findStructuredAuthParamRanges(value)) {
		if (parts.length === 0 || range.start > cursor) parts.push(value.slice(cursor, range.start), replacement);
		cursor = Math.max(cursor, range.end);
	}
	parts.push(value.slice(cursor));
	return parts.join("");
}
//#endregion
//#region src/security/safe-regex.ts
const SAFE_REGEX_CACHE_MAX = 256;
const safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
	return {
		lastToken: null,
		containsRepetition: false,
		hasAlternation: false,
		branchMinLength: 0,
		branchMaxLength: 0,
		altMinLength: null,
		altMaxLength: null
	};
}
function addLength(left, right) {
	if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
	return left + right;
}
function multiplyLength(length, factor) {
	if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
	return length * factor;
}
function recordAlternative(frame) {
	if (frame.altMinLength === null || frame.altMaxLength === null) {
		frame.altMinLength = frame.branchMinLength;
		frame.altMaxLength = frame.branchMaxLength;
		return;
	}
	frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
	frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
	const ch = source[index];
	const consumed = source[index + 1] === "?" ? 2 : 1;
	if (ch === "*") return {
		consumed,
		minRepeat: 0,
		maxRepeat: null
	};
	if (ch === "+") return {
		consumed,
		minRepeat: 1,
		maxRepeat: null
	};
	if (ch === "?") return {
		consumed,
		minRepeat: 0,
		maxRepeat: 1
	};
	if (ch !== "{") return null;
	let i = index + 1;
	while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
	if (i === index + 1) return null;
	const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
	let maxRepeat = minRepeat;
	if (source[i] === ",") {
		i += 1;
		const maxStart = i;
		while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
		maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
	}
	if (source[i] !== "}") return null;
	i += 1;
	if (source[i] === "?") i += 1;
	if (maxRepeat !== null && maxRepeat < minRepeat) return null;
	return {
		consumed: i - index,
		minRepeat,
		maxRepeat
	};
}
function tokenizePattern(source) {
	const tokens = [];
	let inCharClass = false;
	for (let i = 0; i < source.length; i += 1) {
		const ch = source[i];
		if (inCharClass) {
			if (ch === "\\") {
				i += 1;
				continue;
			}
			if (ch === "]") inCharClass = false;
			continue;
		}
		if (ch === "\\") {
			i += 1;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "[") {
			inCharClass = true;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "(") {
			tokens.push({ kind: "group-open" });
			continue;
		}
		if (ch === ")") {
			tokens.push({ kind: "group-close" });
			continue;
		}
		if (ch === "|") {
			tokens.push({ kind: "alternation" });
			continue;
		}
		const quantifier = readQuantifier(source, i);
		if (quantifier) {
			tokens.push({
				kind: "quantifier",
				quantifier
			});
			i += quantifier.consumed - 1;
			continue;
		}
		tokens.push({ kind: "simple-token" });
	}
	return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
	const frames = [createParseFrame()];
	const emitToken = (token) => {
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		frame.lastToken = token;
		if (token.containsRepetition) frame.containsRepetition = true;
		frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
		frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
	};
	const emitSimpleToken = () => {
		emitToken({
			containsRepetition: false,
			hasAmbiguousAlternation: false,
			minLength: 1,
			maxLength: 1
		});
	};
	for (const token of tokens) {
		if (token.kind === "simple-token") {
			emitSimpleToken();
			continue;
		}
		if (token.kind === "group-open") {
			frames.push(createParseFrame());
			continue;
		}
		if (token.kind === "group-close") {
			if (frames.length > 1) {
				const frame = frames.pop();
				if (frame.hasAlternation) recordAlternative(frame);
				const groupMinLength = frame.hasAlternation ? frame.altMinLength ?? 0 : frame.branchMinLength;
				const groupMaxLength = frame.hasAlternation ? frame.altMaxLength ?? 0 : frame.branchMaxLength;
				emitToken({
					containsRepetition: frame.containsRepetition,
					hasAmbiguousAlternation: frame.hasAlternation && frame.altMinLength !== null && frame.altMaxLength !== null && frame.altMinLength !== frame.altMaxLength,
					minLength: groupMinLength,
					maxLength: groupMaxLength
				});
			}
			continue;
		}
		if (token.kind === "alternation") {
			const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
			frame.hasAlternation = true;
			recordAlternative(frame);
			frame.branchMinLength = 0;
			frame.branchMaxLength = 0;
			frame.lastToken = null;
			continue;
		}
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		const previousToken = frame.lastToken;
		if (!previousToken) continue;
		if (previousToken.containsRepetition) return true;
		if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) return true;
		const previousMinLength = previousToken.minLength;
		const previousMaxLength = previousToken.maxLength;
		previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
		previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
		previousToken.containsRepetition = true;
		frame.containsRepetition = true;
		frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
		frame.branchMaxLength = addLength(Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY, previousToken.maxLength);
	}
	return false;
}
function hasNestedRepetition(source) {
	return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
	const trimmed = source.trim();
	if (!trimmed) return {
		regex: null,
		source: trimmed,
		flags,
		reason: "empty"
	};
	const cacheKey = `${flags}::${trimmed}`;
	const cached = safeRegexCache.get(cacheKey);
	if (cached) return cached;
	let result;
	if (hasNestedRepetition(trimmed)) result = {
		regex: null,
		source: trimmed,
		flags,
		reason: "unsafe-nested-repetition"
	};
	else try {
		result = {
			regex: new RegExp(trimmed, flags),
			source: trimmed,
			flags,
			reason: null
		};
	} catch {
		result = {
			regex: null,
			source: trimmed,
			flags,
			reason: "invalid-regex"
		};
	}
	safeRegexCache.set(cacheKey, result);
	pruneMapToMaxSize(safeRegexCache, SAFE_REGEX_CACHE_MAX);
	return result;
}
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
/**
* Compile a single user-configured regex with the shared safe-regex guardrails.
* Returns null for blank patterns so optional config entries can be skipped silently.
*/
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
//#endregion
//#region src/logging/redact-bounded.ts
const REDACT_REGEX_CHUNK_THRESHOLD = 32768;
const REDACT_REGEX_CHUNK_SIZE = 16384;
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer) {
	if (text.length <= REDACT_REGEX_CHUNK_THRESHOLD) return text.replace(pattern, replacer);
	let output;
	for (let index = 0; index < text.length; index += REDACT_REGEX_CHUNK_SIZE) {
		const chunk = text.slice(index, index + REDACT_REGEX_CHUNK_SIZE);
		const replaced = chunk.replace(pattern, replacer);
		if (output !== void 0) output += replaced;
		else if (replaced !== chunk) output = text.slice(0, index) + replaced;
	}
	return output ?? text;
}
//#endregion
//#region src/logging/redact-edit-composition.ts
/** Compose sorted, disjoint current-value edits while retaining original source spans. */
function composeRedactionEdits(length, previous, edits) {
	if (previous.length === 0) return edits;
	const pieces = [];
	let source = 0;
	for (const edit of previous) {
		if (source < edit.start) pieces.push({
			start: source,
			end: edit.start
		});
		pieces.push(edit);
		source = edit.end;
	}
	if (source < length) pieces.push({
		start: source,
		end: length
	});
	const output = [];
	let index = 0;
	let offset = 0;
	let position = 0;
	const consume = (end, keep) => {
		if (end === position) {
			const piece = pieces[index];
			if (!piece) return {
				start: length,
				end: length
			};
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			return {
				start,
				end: piece.replacement !== void 0 && offset > 0 ? piece.end : start
			};
		}
		let sourceStart;
		let sourceEnd = 0;
		while (position < end) {
			const piece = expectDefined(pieces[index], "current redaction piece");
			const size = piece.replacement?.length ?? piece.end - piece.start;
			const count = Math.min(size - offset, end - position);
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			const finish = piece.replacement === void 0 ? start + count : piece.end;
			sourceStart ??= start;
			sourceEnd = finish;
			if (keep && count > 0) output.push({
				start,
				end: finish,
				replacement: piece.replacement?.slice(offset, offset + count)
			});
			position += count;
			offset += count;
			if (offset === size) {
				index += 1;
				offset = 0;
			}
		}
		return {
			start: sourceStart ?? sourceEnd,
			end: sourceEnd
		};
	};
	for (const edit of edits) {
		consume(edit.start, true);
		output.push({
			...consume(edit.end, false),
			replacement: edit.replacement
		});
	}
	while (index < pieces.length) {
		const piece = expectDefined(pieces[index], "remaining redaction piece");
		consume(position + (piece.replacement?.length ?? piece.end - piece.start) - offset, true);
	}
	const composed = [];
	let fragments = [];
	let pending;
	const flush = () => {
		if (pending) {
			pending.replacement = fragments.join("");
			composed.push(pending);
			pending = void 0;
			fragments = [];
		}
	};
	for (const piece of output) {
		if (piece.replacement === void 0) {
			flush();
			continue;
		}
		const sameEmptySpan = pending && pending.start === piece.start && pending.end === piece.end && piece.start === piece.end;
		if (!pending || piece.start >= pending.end && !sameEmptySpan) {
			flush();
			pending = {
				start: piece.start,
				end: piece.end,
				replacement: ""
			};
		} else pending.end = Math.max(pending.end, piece.end);
		fragments.push(piece.replacement);
	}
	flush();
	return composed;
}
/** Project source-span replacements onto a value that already contains replacements. */
function rebaseRedactionEdits(previous, edits) {
	let shift = 0;
	const spans = previous.map((edit) => {
		const start = edit.start + shift;
		shift += edit.replacement.length - (edit.end - edit.start);
		return {
			...edit,
			currentStart: start,
			currentEnd: edit.end + shift
		};
	});
	const boundary = (position, end) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + high >>> 1;
			const span = expectDefined(spans[middle], "source redaction span");
			if (span.end < position || span.end === position && span.start !== span.end) low = middle + 1;
			else high = middle;
		}
		const span = spans[low];
		if (span && (position > span.start || position === span.start && span.start === span.end)) return end ? span.currentEnd : span.currentStart;
		const before = spans[low - 1];
		return position + (before ? before.currentEnd - before.end : 0);
	};
	return edits.map((edit) => ({
		start: boundary(edit.start, false),
		end: boundary(edit.end, true),
		replacement: edit.replacement
	}));
}
function mergeRedactionEdits(edits) {
	edits.sort((left, right) => left.start - right.start || left.end - right.end);
	const merged = [];
	for (const edit of edits) {
		const previous = merged.at(-1);
		if (!previous || edit.start >= previous.end) merged.push({ ...edit });
		else if (edit.start !== previous.start || edit.end !== previous.end || edit.replacement !== previous.replacement) {
			previous.end = Math.max(previous.end, edit.end);
			previous.replacement = "***";
		}
	}
	return merged;
}
function applyRedactionEdits(value, edits) {
	const parts = [];
	let cursor = 0;
	for (const edit of mergeRedactionEdits(edits)) {
		parts.push(value.slice(cursor, edit.start), edit.replacement);
		cursor = edit.end;
	}
	return parts.join("") + value.slice(cursor);
}
//#endregion
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const state = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistry"), () => ({
	registeredValues: /* @__PURE__ */ new Map(),
	registryRevision: 0,
	registeredValueRedactor: void 0
}));
const registrySnapshots = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistrySnapshots"), () => new AsyncLocalStorage());
function invalidateMatcher() {
	state.registryRevision += 1;
	state.registeredValueRedactor = void 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	const scoped = registrySnapshots.getStore();
	if (scoped) {
		scoped.redactor ??= createSecretValueRedactor(scoped.snapshot.values);
		return scoped.redactor(text, mask);
	}
	if (!text || state.registeredValues.size === 0) return text;
	state.registeredValueRedactor ??= createSecretValueRedactor([...state.registeredValues.keys()]);
	return state.registeredValueRedactor(text, mask);
}
function createSecretValueRedactor(values) {
	let compiledMatcher;
	let firstChars;
	return (text, mask) => {
		if (!text || values.length === 0) return text;
		let couldMatch = false;
		firstChars ??= new Set(values.map((value) => value.charAt(0)));
		for (const firstChar of firstChars) if (text.includes(firstChar)) {
			couldMatch = true;
			break;
		}
		if (!couldMatch) return text;
		if (!compiledMatcher) {
			const buckets = /* @__PURE__ */ new Map();
			for (const value of values.toSorted((left, right) => right.length - left.length)) {
				const prefix = value.slice(0, MIN_SECRET_VALUE_LENGTH);
				const bucket = buckets.get(prefix);
				if (bucket) bucket.push(value);
				else buckets.set(prefix, [value]);
			}
			compiledMatcher = {
				prefixes: new RegExp([...buckets.keys()].map(escapeRegExp).join("|"), "g"),
				buckets
			};
		}
		const { prefixes, buckets } = compiledMatcher;
		const matches = [];
		prefixes.lastIndex = 0;
		for (let match = prefixes.exec(text); match; match = prefixes.exec(text)) {
			const index = match.index;
			const value = buckets.get(match[0])?.find((candidate) => text.startsWith(candidate, index));
			if (value !== void 0) matches.push({
				index,
				value
			});
			prefixes.lastIndex = index + (value?.length ?? 1);
		}
		let result = "";
		let cursor = 0;
		for (const match of matches) {
			result += `${text.slice(cursor, match.index)}${mask(match.value, match.index)}`;
			cursor = match.index + match.value.length;
		}
		return result + text.slice(cursor);
	};
}
function resetSecretRedactionRegistryForTest() {
	state.registeredValues.clear();
	invalidateMatcher();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
//#endregion
//#region src/logging/redact-internal-state.ts
const fullContextToolPayloadRedaction = Symbol("full-context-tool-payload-redaction");
const fullContextToolPayloadRedactionState = {
	mark(loggingConfig) {
		return {
			...loggingConfig,
			[fullContextToolPayloadRedaction]: true
		};
	},
	isMarked(loggingConfig) {
		return Boolean(loggingConfig?.[fullContextToolPayloadRedaction]);
	}
};
//#endregion
//#region src/logging/redact-internal.ts
function isFullContextToolPayloadRedaction(loggingConfig) {
	return fullContextToolPayloadRedactionState.isMarked(loggingConfig);
}
//#endregion
//#region src/logging/redact-json-tokens.ts
const JSON_TOKEN_RE = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g;
function skipWhitespace(text, start) {
	let offset = start;
	while (text[offset] === " " || text[offset] === "	" || text[offset] === "\r" || text[offset] === "\n") offset += 1;
	return offset;
}
function readScalarTokens(text, origins) {
	const tokens = [];
	const containers = [];
	const root = {
		key: "",
		path: [],
		origins,
		origin: origins.value,
		objectPath: true
	};
	const valueContext = (parent) => !parent ? root : parent.array ? {
		...parent.context,
		origin: parent.context.origins?.value ?? parent.context.origin,
		origins: parent.context.origins?.children.get(String(parent.nextIndex++))
	} : expectDefined(parent.field, "JSON object field context");
	for (const match of text.matchAll(JSON_TOKEN_RE)) {
		const raw = match[0];
		const parent = containers.at(-1);
		if (raw === "{" || raw === "[") {
			const context = valueContext(parent);
			const array = raw === "[";
			containers.push({
				array,
				nextIndex: 0,
				context: array ? {
					...context,
					objectPath: false
				} : context,
				start: match.index,
				tokenStart: tokens.length
			});
			continue;
		}
		if (raw === "}" || raw === "]") {
			const container = expectDefined(containers.pop(), "JSON container");
			if (container.tokenStart === tokens.length) {
				const end = match.index + 1;
				const value = text.slice(container.start, end);
				tokens.push({
					...container.context,
					isKey: false,
					string: false,
					value,
					start: container.start,
					end,
					escaped: false,
					edits: [],
					projectedEdits: [],
					currentValue: value,
					currentStart: container.start,
					currentEnd: end
				});
			}
			continue;
		}
		const start = match.index;
		const end = start + raw.length;
		const string = raw.startsWith("\"");
		const value = string ? JSON.parse(raw) : raw;
		const next = skipWhitespace(text, end);
		const isKey = string && text[next] === ":";
		let context;
		if (isKey) {
			const container = expectDefined(parent, "JSON property container");
			const inherited = container.context;
			context = {
				key: "",
				path: [],
				origin: inherited.origin,
				objectPath: false,
				rootKey: inherited.rootKey,
				rootValueStart: inherited.rootValueStart
			};
			const valueStart = skipWhitespace(text, next + 1);
			container.field = {
				key: value,
				path: [...inherited.path, value],
				origins: inherited.origins?.children.get(value),
				origin: inherited.origins?.value ?? inherited.origin,
				objectPath: inherited.objectPath,
				rootKey: containers.length === 1 ? value : inherited.rootKey,
				rootValueStart: containers.length === 1 ? valueStart : inherited.rootValueStart
			};
		} else context = valueContext(parent);
		const origin = isKey ? {
			structured: false,
			primitiveMask: false
		} : context.origins?.value ?? context.origin;
		tokens.push({
			...context,
			origin,
			start,
			end,
			isKey,
			string,
			value,
			escaped: string && raw.includes("\\"),
			edits: [],
			projectedEdits: [],
			currentValue: value,
			currentStart: start,
			currentEnd: end
		});
	}
	return tokens;
}
function readBatchTokens(input, origins, preserveLines = false) {
	const tokens = [];
	let offset = 0;
	for (const line of input.split("\n")) {
		let json = false;
		try {
			JSON.parse(line);
			json = true;
		} catch {}
		if (json) for (const token of readScalarTokens(line, origins)) {
			token.deferEncoding = !token.string;
			token.start += offset;
			token.end += offset;
			token.currentStart += offset;
			token.currentEnd += offset;
			tokens.push(token);
		}
		else {
			const previous = tokens.at(-1);
			if (!preserveLines && previous?.raw && previous.end + 1 === offset) {
				previous.value += `\n${line}`;
				previous.currentValue = previous.value;
				previous.end = previous.currentEnd = offset + line.length;
			} else tokens.push({
				raw: true,
				origin: origins.value,
				key: "",
				path: [],
				objectPath: false,
				isKey: false,
				string: false,
				value: line,
				escaped: false,
				start: offset,
				end: offset + line.length,
				currentStart: offset,
				currentEnd: offset + line.length,
				currentValue: line,
				edits: [],
				projectedEdits: []
			});
		}
		offset += line.length + 1;
	}
	return tokens;
}
//#endregion
//#region src/logging/redact-pattern-runtime.ts
function parseRedactPatternSource(raw) {
	const literal = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	if (!literal) return [raw, "gi"];
	const source = literal[1] ?? "";
	const flags = literal[2] ?? "";
	return [source, flags.includes("g") ? flags : `${flags}g`];
}
const OPEN_REPEAT_RE = /^\{(\d+),\}/;
const BOUNDED_REPEAT_RE = /^\{(?:\d+(?:,\d*)?|,\d+)\}/;
const HEX_DIGIT_RE = /[0-9A-Fa-f]/;
const ASSERTION_ESCAPE_CHARS = /* @__PURE__ */ new Set(["b", "B"]);
const escapeHexValue = (source, at) => {
	let value = 0;
	for (let index = 0; index < 4; index += 1) {
		const digit = source[at + index];
		if (digit === void 0 || !HEX_DIGIT_RE.test(digit)) return null;
		value = value * 16 + Number.parseInt(digit, 16);
	}
	return value;
};
/** True when the escape at `i` is a `\uXXXX` high-surrogate escape. */
const isHighSurrogateEscape = (source, i) => {
	const value = escapeHexValue(source, i + 2);
	return value !== null && value >= 55296 && value <= 56319;
};
/** True when the escape at `i` is a `\uXXXX` low-surrogate escape. */
const isLowSurrogateEscape = (source, i) => {
	const value = escapeHexValue(source, i + 2);
	return value !== null && value >= 56320 && value <= 57343;
};
/** End index (exclusive) of the single atom introduced by the escape at `i` (a backslash), or -1. */
function escapeAtomEnd(source, i) {
	const kind = source[i + 1];
	if (kind === void 0) return -1;
	if (ASSERTION_ESCAPE_CHARS.has(kind)) return i + 2;
	if (kind === "x") return HEX_DIGIT_RE.test(source[i + 2] ?? "") && HEX_DIGIT_RE.test(source[i + 3] ?? "") ? i + 4 : i + 2;
	if ((kind === "u" || kind === "p" || kind === "P") && source[i + 2] === "{") {
		const close = source.indexOf("}", i + 3);
		return close === -1 ? i + 2 : close + 1;
	}
	if (kind === "u") {
		let end = i + 2;
		while (end < i + 6 && HEX_DIGIT_RE.test(source[end] ?? "")) end += 1;
		return end;
	}
	if (kind === "c") return i + 3;
	if (kind === "k" && source[i + 2] === "<") {
		const close = source.indexOf(">", i + 3);
		return close === -1 ? i + 2 : close + 1;
	}
	if (kind >= "0" && kind <= "9") {
		let end = i + 2;
		for (let cursor = end; cursor < source.length; cursor += 1) {
			const digit = source[cursor];
			if (digit === void 0 || digit < "0" || digit > "9") break;
			end = cursor + 1;
		}
		return end;
	}
	return i + 2;
}
/** End index (exclusive) of the character class starting at `i` (an unescaped bracket). */
function classAtomEnd(source, i) {
	let cursor = i + 1;
	if (source[cursor] === "^") cursor += 1;
	if (source[cursor] === "]") return -1;
	while (cursor < source.length) {
		const char = source[cursor];
		if (char === "\\") {
			cursor += 2;
			continue;
		}
		if (char === "]") return cursor + 1;
		cursor += 1;
	}
	return source.length;
}
/**
* Rewrites open-ended repeats `X{n,}` into `X{n}X*` for flat single-character atoms `X`
* (one literal, one escaped atom, or one bracket class). Greedy `X{n,}` and `X{n}X*`
* accept the same strings in the same backtracking order, but the latter never grows one
* backtrack stack entry per repetition, so multi-megabyte runs no longer overflow.
* Bounded repeats, quantifiers after groups, and quantified atoms are left untouched.
* `flags` decides atom boundaries for literal astral characters: under `u` a surrogate pair
* is one atom; without `u` JavaScript quantifies only the trailing code unit, so the pair
* must keep its per-unit handling and the original language.
*/
function rewriteOpenEndedRepeats(source, flags = "") {
	if (!source.includes("{")) return source;
	let out = "";
	let atomStart = -1;
	let atomEnd = -1;
	let i = 0;
	while (i < source.length) {
		const char = source[i];
		if (char === "\\") {
			const end = escapeAtomEnd(source, i);
			if (end < 0) {
				out += char;
				i += 1;
				atomStart = -1;
				continue;
			}
			if (flags.includes("u") && isHighSurrogateEscape(source, i) && source[end] === "\\" && isLowSurrogateEscape(source, end)) {
				const pairEnd = escapeAtomEnd(source, end);
				out += source.slice(i, pairEnd);
				atomStart = i;
				atomEnd = pairEnd;
				i = pairEnd;
				continue;
			}
			out += source.slice(i, end);
			if (ASSERTION_ESCAPE_CHARS.has(source[i + 1])) atomStart = -1;
			else {
				atomStart = i;
				atomEnd = end;
			}
			i = end;
			continue;
		}
		if (char === "[") {
			const end = classAtomEnd(source, i);
			if (end < 0) return source;
			out += source.slice(i, end);
			atomStart = i;
			atomEnd = end;
			i = end;
			continue;
		}
		if (char === "{") {
			const open = OPEN_REPEAT_RE.exec(source.slice(i));
			if (open && atomStart >= 0) {
				const atom = source.slice(atomStart, atomEnd);
				out += `{${open[1]}}${atom}*`;
				i += open[0].length;
				if (source[i] === "?") {
					out += "?";
					i += 1;
				}
				atomStart = -1;
				continue;
			}
			const bounded = BOUNDED_REPEAT_RE.exec(source.slice(i));
			if (bounded) {
				out += bounded[0];
				i += bounded[0].length;
				if (source[i] === "?") {
					out += "?";
					i += 1;
				}
				atomStart = -1;
				continue;
			}
			out += char;
			atomStart = i;
			atomEnd = i + 1;
			i += 1;
			continue;
		}
		out += char;
		if (flags.includes("u") && char >= "\ud800" && char <= "\udbff" && i + 1 < source.length && source[i + 1] >= "\udc00" && source[i + 1] <= "\udfff") {
			out += source[i + 1];
			atomStart = i;
			atomEnd = i + 2;
			i += 2;
			continue;
		}
		if (char === "*" || char === "+" || char === "?" || char === "(" || char === ")" || char === "|" || char === "^" || char === "$") atomStart = -1;
		else {
			atomStart = i;
			atomEnd = i + 1;
		}
		i += 1;
	}
	return out;
}
function readRedactMatch(args) {
	const inputIndex = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null ? args.length - 2 : args.length - 1;
	const offsetIndex = inputIndex - 1;
	const match = typeof args[0] === "string" ? args[0] : "";
	const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
	const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
	return {
		match,
		groups,
		input: typeof args[inputIndex] === "string" ? args[inputIndex] : "",
		offset
	};
}
const patternPrefilters = /* @__PURE__ */ new WeakMap();
function setRedactPatternPrefilter(pattern, probe) {
	if (patternPrefilters.has(pattern)) return;
	const source = pattern.source;
	const exec = pattern.exec;
	const flags = pattern instanceof RegExp ? pattern.flags : void 0;
	const replace = pattern instanceof RegExp ? pattern[Symbol.replace] : void 0;
	patternPrefilters.set(pattern, (text) => pattern.source !== source || pattern.exec !== exec || pattern instanceof RegExp && (pattern.flags !== flags || pattern[Symbol.replace] !== replace) || probe(text));
}
const indexedPatterns = /* @__PURE__ */ new WeakMap();
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
	if (!(pattern instanceof RegExp) || matchOffset < 0 || !input) return null;
	let indexedPattern = indexedPatterns.get(pattern);
	if (!indexedPattern) {
		indexedPattern = new RegExp(pattern.source, `${pattern.flags.replace("d", "").replace("g", "")}dg`);
		indexedPatterns.set(pattern, indexedPattern);
	}
	indexedPattern.lastIndex = matchOffset;
	const indexedMatch = indexedPattern.exec(input);
	const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
	return indexedMatch?.index === matchOffset && indexedMatch[0] === match && captureIndices ? captureIndices[0] - matchOffset : null;
}
function selectSecretCapture(match, groups) {
	const selected = {
		index: -1,
		value: match
	};
	for (let index = 0; index < groups.length; index++) {
		const value = groups[index];
		if (typeof value === "string" && value.length > 0) {
			selected.index = index;
			selected.value = value;
		}
	}
	return selected;
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
	return getIndexedCaptureStart(pattern, input, match, matchOffset, selected.index) ?? match.lastIndexOf(selected.value);
}
const globalPatterns = /* @__PURE__ */ new WeakMap();
function visitRedactMatches(text, pattern, visit) {
	if (patternPrefilters.get(pattern)?.(text) === false) return;
	if (!(pattern instanceof RegExp)) {
		for (const match of pattern.exec(text)) visit(match, pattern);
		return;
	}
	let regex = pattern.global ? pattern : globalPatterns.get(pattern);
	if (!regex) {
		regex = new RegExp(pattern.source, `${pattern.flags}g`);
		globalPatterns.set(pattern, regex);
	}
	const unicode = regex.unicode || regex.flags.includes("v");
	let cursor = 0;
	while (cursor <= text.length) {
		const previousIndex = regex.lastIndex;
		let match;
		try {
			regex.lastIndex = cursor;
			match = regex.exec(text);
		} finally {
			regex.lastIndex = previousIndex;
		}
		if (!match) return;
		cursor = match.index + match[0].length;
		if (!match[0]) {
			const codePoint = text.codePointAt(cursor);
			cursor += unicode && codePoint !== void 0 && codePoint > 65535 ? 2 : 1;
		}
		visit({
			match: match[0],
			groups: match.slice(1).map((group) => group ?? ""),
			input: text,
			offset: match.index
		}, pattern);
	}
}
function replaceRedactPattern(text, pattern, replace, replaceRegex) {
	if (pattern instanceof RegExp) {
		if (patternPrefilters.get(pattern)?.(text) === false) {
			pattern.lastIndex = 0;
			return text;
		}
		return text.replace(pattern, replaceRegex ?? ((...args) => replace(readRedactMatch(args))));
	}
	const parts = [];
	let end = 0;
	visitRedactMatches(text, pattern, (match) => {
		parts.push(text.slice(end, match.offset), replace(match));
		end = match.offset + match.match.length;
	});
	return parts.length ? parts.join("") + text.slice(end) : text;
}
function redactPemBlock(block, marker) {
	const lines = block.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return "***";
	return `${lines[0]}\n${marker}\n${lines[lines.length - 1]}`;
}
//#endregion
//#region src/logging/redact-json.ts
function getPatternRedactionEdits(value, pattern, getCapture) {
	const edits = [];
	visitRedactMatches(value, pattern, (match) => {
		const capture = getCapture(match, pattern);
		const edit = capture?.redact(capture);
		if (edit && edit.end >= edit.start) edits.push(edit);
	});
	return edits;
}
function stringBoundaries(text, start, end) {
	const boundaries = /* @__PURE__ */ new Map();
	let decoded = 0;
	for (let offset = start; offset < end; decoded += 1) {
		boundaries.set(offset, decoded);
		offset += text[offset] === "\\" ? text[offset + 1] === "u" ? 6 : 2 : 1;
	}
	boundaries.set(end, decoded);
	return boundaries;
}
function decodedBoundary(text, token, offset) {
	if (!token.escaped) return offset - token.start - 1;
	token.boundaries ??= stringBoundaries(text, token.start + 1, token.end - 1);
	return token.boundaries.get(offset);
}
function encodedBoundary(text, token, offset) {
	if (!token.escaped) return token.start + 1 + offset;
	if (!token.encodedBoundaries) {
		token.boundaries ??= stringBoundaries(text, token.start + 1, token.end - 1);
		token.encodedBoundaries = [];
		for (const [encoded, decoded] of token.boundaries) token.encodedBoundaries[decoded] = encoded;
	}
	return expectDefined(token.encodedBoundaries[offset], "decoded JSON edit boundary");
}
function projectMessageEdits(input, tokens, message, getEdits) {
	const parts = new Map(message.parts.map((part) => [part.key, part]));
	const projected = [];
	for (const token of tokens) {
		if (!token.isKey && token.path.length === 1 && token.key === "message") continue;
		const part = token.rootKey === void 0 ? void 0 : parts.get(token.rootKey);
		if (!part) continue;
		if (!part.json && (token.isKey || (part.messageField ? token.path.length !== 2 || token.key !== "message" : token.path.length !== 1))) continue;
		const edits = getEdits(token);
		for (const edit of edits) {
			let start;
			let end;
			let replacement = edit.replacement;
			if (part.json) {
				const base = part.start - expectDefined(token.rootValueStart, "displayed JSON argument");
				if (token.string) {
					start = base + encodedBoundary(input, token, edit.start);
					end = base + encodedBoundary(input, token, edit.end);
					replacement = JSON.stringify(replacement).slice(1, -1);
				} else {
					start = base + token.start;
					end = base + token.end;
					replacement = JSON.stringify(replacement);
				}
			} else {
				start = part.start + edit.start;
				end = part.start + (part.primitiveLength ?? edit.end);
			}
			if (start < message.contentLength) projected.push({
				start,
				end: Math.min(end, message.contentLength),
				replacement,
				scalar: part.json && !token.string
			});
		}
	}
	return projected.toSorted((left, right) => left.start - right.start || left.end - right.end);
}
function firstIntersectingToken(tokens, start) {
	let low = 0;
	let high = tokens.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(tokens[middle], "bounded JSON token search").currentEnd <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function updateCurrentToken(input, token) {
	if (token.raw || token.deferEncoding) {
		token.currentRaw = token.currentValue;
		return;
	}
	const parts = [];
	const encodedEdits = [];
	let cursor = token.start + (token.string ? 1 : 0);
	let encodedLength = 0;
	let decodedShift = 0;
	for (const edit of token.edits) {
		const start = token.string ? encodedBoundary(input, token, edit.start) : token.start + edit.start;
		const end = token.string ? encodedBoundary(input, token, edit.end) : token.start + edit.end;
		const replacement = JSON.stringify(edit.replacement).slice(1, -1);
		const encodedStart = encodedLength + start - cursor;
		const encodedEnd = encodedStart + replacement.length;
		encodedEdits.push({
			start: encodedStart,
			end: encodedEnd,
			decodedStart: edit.start + decodedShift,
			decodedEnd: edit.start + decodedShift + edit.replacement.length,
			sourceEnd: end,
			sourceDecodedEnd: edit.end,
			replacement
		});
		parts.push(input.slice(cursor, start), replacement);
		encodedLength = encodedEnd;
		decodedShift += edit.replacement.length - (edit.end - edit.start);
		cursor = end;
	}
	parts.push(input.slice(cursor, token.end - (token.string ? 1 : 0)));
	token.currentRaw = `"${parts.join("")}"`;
	token.encodedEdits = encodedEdits;
}
function currentDecodedBoundary(input, token, position, replacements) {
	const offset = position - token.currentStart - 1;
	const edits = token.encodedEdits;
	if (!edits) return decodedBoundary(input, token, token.start + 1 + offset);
	let low = 0;
	let high = edits.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(edits[middle], "current encoded edit").end < offset) low = middle + 1;
		else high = middle;
	}
	const edit = edits[low];
	if (edit && offset >= edit.start) {
		const within = offset - edit.start;
		if (!edit.replacement.includes("\\")) return edit.decodedStart + within;
		let boundaries = replacements.get(edit.replacement);
		if (!boundaries) {
			boundaries = stringBoundaries(edit.replacement, 0, edit.replacement.length);
			replacements.set(edit.replacement, boundaries);
		}
		const decoded = boundaries.get(within);
		return decoded === void 0 ? void 0 : edit.decodedStart + decoded;
	}
	const previous = edits[low - 1];
	const decoded = decodedBoundary(input, token, offset + (previous ? previous.sourceEnd - previous.end : token.start + 1));
	return decoded === void 0 ? void 0 : decoded + (previous ? previous.decodedEnd - previous.sourceDecodedEnd : 0);
}
function commitPatternEdits(token) {
	const pending = token.pending;
	token.pending = void 0;
	if (!pending) return false;
	const edits = mergeRedactionEdits(pending);
	const value = applyRedactionEdits(token.currentValue, edits);
	if (value === token.currentValue) return false;
	token.edits = composeRedactionEdits(token.value.length, token.edits, edits);
	token.currentValue = value;
	return true;
}
function changedRedactionEdits(previous, current) {
	let index = 0;
	return current.filter((edit) => {
		while (previous[index] && expectDefined(previous[index], "previous configured edit").start < edit.start) index += 1;
		const before = previous[index];
		return !before || before.start !== edit.start || before.end !== edit.end || before.replacement !== edit.replacement;
	});
}
function commitOriginalEdits(token, edits) {
	if (edits.length === 0) return false;
	const combined = mergeRedactionEdits([...token.edits, ...edits]);
	const value = applyRedactionEdits(token.value, combined);
	if (value === token.currentValue) return false;
	token.edits = combined;
	token.currentValue = value;
	return true;
}
function updateCurrentRecord(input, current, tokens, changed) {
	const parts = [];
	let cursor = 0;
	let shift = 0;
	for (const token of tokens) {
		const start = token.currentStart;
		const end = token.currentEnd;
		if (changed.has(token)) {
			updateCurrentToken(input, token);
			const raw = expectDefined(token.currentRaw, "changed JSON token");
			parts.push(current.slice(cursor, start), raw);
			cursor = end;
			token.currentStart = start + shift;
			shift += raw.length - (end - start);
		} else token.currentStart = start + shift;
		token.currentEnd = end + shift;
	}
	parts.push(current.slice(cursor));
	return parts.join("");
}
function projectedStringEnd(input, tokens, message, token, start, end) {
	const jsonParts = new Set(message.parts.filter((part) => part.json).map((part) => part.key));
	const spans = projectMessageEdits(input, tokens, message, (source) => source.string && !source.isKey && source.rootKey !== void 0 && jsonParts.has(source.rootKey) ? [{
		start: 0,
		end: source.value.length,
		replacement: ""
	}] : []).filter((span) => span.end < message.contentLength);
	const containing = rebaseRedactionEdits(token.edits, spans).filter((span) => span.start <= start && start < span.end && end <= span.end);
	return containing.length === 1 ? expectDefined(containing[0], "displayed source string").end : token.currentValue.length;
}
function redactJsonRecord(input, origins, patternPhases, getCapture, legacyFieldEdits, fieldEdits, prepEdits, skipDecodedPatterns, message, batch) {
	let tokens = batch ? [] : readScalarTokens(input, origins);
	const messageToken = message ? tokens.find((token) => !token.isKey && token.path.length === 1 && token.key === "message") : void 0;
	const replacementBoundaries = /* @__PURE__ */ new Map();
	let projectedMessageEdits = [];
	let projectedMessageValue = messageToken?.value ?? "";
	let current = input;
	const prepared = /* @__PURE__ */ new Set();
	for (const token of tokens) if (commitOriginalEdits(token, prepEdits(token))) prepared.add(token);
	if (prepared.size > 0) current = updateCurrentRecord(input, current, tokens, prepared);
	const decodedTokens = tokens.filter((token) => !token.isKey && token.string && !skipDecodedPatterns(token, token.currentValue));
	const projectMessage = () => {
		if (!messageToken || !message) return false;
		const projected = projectMessageEdits(input, tokens, message, (token) => {
			const edits = changedRedactionEdits(token.projectedEdits, token.edits);
			token.projectedEdits = token.edits;
			return edits;
		});
		if (projected.length === 0) return false;
		const sourceEdits = rebaseRedactionEdits(projectedMessageEdits, projected);
		const messageEdits = rebaseRedactionEdits(messageToken.edits, projected);
		let generatedIndex = 0;
		for (let index = 0; index < messageEdits.length; index += 1) {
			const edit = expectDefined(messageEdits[index], "projected message edit");
			const sourceEdit = expectDefined(sourceEdits[index], "projected source edit");
			const projection = expectDefined(projected[index], "source projection");
			while (messageToken.edits[generatedIndex] && expectDefined(messageToken.edits[generatedIndex], "generated message span").start < projection.start) generatedIndex += 1;
			const generated = messageToken.edits[generatedIndex];
			const scalarPromotion = projection.scalar && generated?.start === projection.start && generated.end === projection.end && edit.replacement === JSON.stringify(generated.replacement);
			const before = messageToken.currentValue.slice(edit.start, edit.end);
			if (!scalarPromotion && before !== edit.replacement && before !== projectedMessageValue.slice(sourceEdit.start, sourceEdit.end)) edit.replacement = projection.scalar ? JSON.stringify("***") : "***";
		}
		messageToken.pending = messageEdits;
		projectedMessageValue = applyRedactionEdits(projectedMessageValue, sourceEdits);
		projectedMessageEdits = composeRedactionEdits(messageToken.value.length, projectedMessageEdits, sourceEdits);
		return commitPatternEdits(messageToken);
	};
	for (const [phase, groups] of patternPhases.entries()) {
		const changed = /* @__PURE__ */ new Set();
		const pending = /* @__PURE__ */ new Set();
		const add = (token, edit) => {
			(token.pending ??= []).push(edit);
			pending.add(token);
		};
		let decodedToken;
		const visitDecodedMatch = (match, pattern) => {
			const capture = getCapture(match, pattern);
			const edit = capture?.redact(capture);
			if (edit && edit.end >= edit.start) add(decodedToken, edit);
		};
		for (const group of groups) {
			if (group.couldMatch && !group.couldMatch(current)) continue;
			for (const pattern of group.patterns) {
				if (phase === 0) for (decodedToken of decodedTokens) visitRedactMatches(decodedToken.currentValue, pattern, visitDecodedMatch);
				else visitRedactMatches(current, pattern, (match) => {
					const capture = getCapture(match, pattern);
					if (!capture || capture.end < capture.start) return;
					if (batch && tokens.length === 0) tokens = readBatchTokens(input, origins, batch.preserveLines);
					for (let index = firstIntersectingToken(tokens, capture.start); index < tokens.length; index += 1) {
						const token = expectDefined(tokens[index], "serialized capture token");
						if (token.currentStart >= capture.end) break;
						const unquoted = token.raw || token.deferEncoding;
						const padding = unquoted ? 0 : 1;
						const captureInsideToken = capture.start >= token.currentStart + padding && capture.end <= token.currentEnd - padding;
						if (batch && token.isKey && !captureInsideToken) continue;
						const value = token.currentValue;
						if (!token.raw && !token.string && token.edits.length === 0) {
							add(token, {
								start: 0,
								end: value.length,
								replacement: "***"
							});
							continue;
						}
						let startPosition = Math.max(capture.start, token.currentStart + padding);
						let start = unquoted ? startPosition - token.currentStart : currentDecodedBoundary(input, token, startPosition, replacementBoundaries);
						let endPosition = Math.min(capture.end, token.currentEnd - padding);
						let end = unquoted ? endPosition - token.currentStart : currentDecodedBoundary(input, token, endPosition, replacementBoundaries);
						if (start === void 0 || end === void 0) {
							while (start === void 0) start = currentDecodedBoundary(input, token, --startPosition, replacementBoundaries);
							while (end === void 0) end = currentDecodedBoundary(input, token, ++endPosition, replacementBoundaries);
							const maskEnd = token === messageToken && message ? projectedStringEnd(input, tokens, message, token, start, end) : value.length;
							add(token, {
								start,
								end: maskEnd,
								replacement: "***"
							});
							continue;
						}
						if (end < start || batch && end === start) continue;
						const { start: captureStart, end: captureEnd } = capture;
						const edit = capture.redact({
							start,
							end,
							value: current.slice(Math.max(captureStart, token.currentStart + padding), Math.min(captureEnd, token.currentEnd - padding))
						});
						if (!edit) continue;
						let replacement = "***";
						if (captureInsideToken) try {
							replacement = unquoted ? edit.replacement : JSON.parse(`"${edit.replacement}"`);
						} catch {}
						add(token, {
							...edit,
							replacement
						});
					}
				});
				if (pending.size === 0) continue;
				for (const token of pending) if (!commitPatternEdits(token)) pending.delete(token);
				else if (phase === 0) changed.add(token);
				if (phase !== 0 && pending.size > 0) current = updateCurrentRecord(input, current, tokens, pending);
				pending.clear();
			}
		}
		for (const token of tokens) if (phase === 0) {
			token.pending = legacyFieldEdits(token, token.currentValue);
			if (commitPatternEdits(token)) changed.add(token);
		} else if (commitOriginalEdits(token, fieldEdits(token))) changed.add(token);
		if ((phase !== 0 || prepared.size > 0 || changed.size > 0) && projectMessage() && messageToken) changed.add(messageToken);
		if (changed.size > 0) current = updateCurrentRecord(input, current, tokens, changed);
	}
	if (messageToken && message) {
		const finished = message.finish(messageToken.currentValue);
		if (finished !== messageToken.currentValue) return applyRedactionEdits(current, [{
			start: messageToken.currentStart,
			end: messageToken.currentEnd,
			replacement: JSON.stringify(finished)
		}]);
	}
	return applyRedactionEdits(current, tokens.flatMap((token) => token.deferEncoding && token.edits.length > 0 ? [{
		start: token.currentStart,
		end: token.currentEnd,
		replacement: JSON.stringify(token.currentValue)
	}] : []));
}
//#endregion
//#region src/logging/redact-pem.ts
const PEM_REDACT_PATTERN_SOURCE = String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`;
function createState() {
	return {
		scanner: {
			offset: 0,
			phase: "search",
			dashes: 0,
			keyword: "BEGIN ",
			keywordOffset: 0,
			start: 0,
			suffix: ""
		},
		matchEnd: 0
	};
}
function resetScanner(scanner, char) {
	scanner.phase = "search";
	scanner.dashes = char === "-" ? 1 : 0;
	scanner.suffix = "";
}
function* readDelimiters(text, scanner) {
	for (let index = 0; index < text.length; index += 1) {
		if (scanner.phase === "search" && scanner.dashes === 0) {
			const nextDash = text.indexOf("-", index);
			if (nextDash === -1) {
				scanner.offset += text.length - index;
				return;
			}
			scanner.offset += nextDash - index;
			index = nextDash;
		}
		const code = text.charCodeAt(index);
		const char = code >= 97 && code <= 122 ? String.fromCharCode(code - 32) : text.charAt(index);
		const offset = scanner.offset++;
		switch (scanner.phase) {
			case "search":
				if (char === "-") scanner.dashes = Math.min(5, scanner.dashes + 1);
				else if (scanner.dashes === 5 && (char === "B" || char === "E")) {
					scanner.phase = "keyword";
					scanner.keyword = char === "B" ? "BEGIN " : "END ";
					scanner.keywordOffset = 1;
					scanner.start = offset - 5;
				} else scanner.dashes = 0;
				break;
			case "keyword":
				if (char !== scanner.keyword.charAt(scanner.keywordOffset)) resetScanner(scanner, char);
				else if (++scanner.keywordOffset === scanner.keyword.length) {
					scanner.phase = "label";
					scanner.suffix = "";
				}
				break;
			case "label":
				if (char >= "A" && char <= "Z" || char === " ") scanner.suffix = (scanner.suffix + char).slice(-11);
				else if (char === "-" && scanner.suffix === "PRIVATE KEY") {
					scanner.phase = "close";
					scanner.dashes = 1;
				} else resetScanner(scanner, char);
				break;
			case "close": if (char !== "-") resetScanner(scanner, char);
			else if (++scanner.dashes === 5) {
				scanner.phase = "search";
				scanner.suffix = "";
				yield {
					kind: scanner.keyword === "BEGIN " ? "begin" : "end",
					start: scanner.start,
					end: offset + 1
				};
			}
		}
	}
}
function consumeDelimiter(state, delimiter) {
	if (!state.open) {
		if (delimiter.kind === "begin" && delimiter.start >= state.matchEnd) state.open = {
			start: delimiter.start,
			end: delimiter.end
		};
		return;
	}
	if (delimiter.kind !== "end" || delimiter.start <= state.open.end) return;
	const block = {
		start: state.open.start,
		end: delimiter.end,
		bodyStart: state.open.end,
		bodyEnd: delimiter.start
	};
	state.open = void 0;
	state.matchEnd = delimiter.end;
	return block;
}
function* matchPem(text, context, incomplete) {
	const state = {
		...context,
		scanner: { ...context.scanner },
		open: context.open && { ...context.open }
	};
	const origin = state.scanner.offset;
	for (const delimiter of readDelimiters(text, state.scanner)) {
		const block = consumeDelimiter(state, delimiter);
		if (!block) continue;
		const start = Math.max(0, (incomplete ? block.bodyStart : block.start) - origin);
		const end = (incomplete ? block.bodyEnd : block.end) - origin;
		if (end <= start) continue;
		yield {
			match: text.slice(start, end),
			groups: [],
			input: text,
			offset: start,
			...incomplete ? { replacement: "…redacted…" } : {}
		};
	}
	if (incomplete && state.open) {
		const start = Math.max(0, state.open.end - origin);
		if (start < text.length) yield {
			match: text.slice(start),
			groups: [],
			input: text,
			offset: start,
			replacement: "…redacted…"
		};
	}
}
const PEM_REDACT_MATCHER = {
	source: PEM_REDACT_PATTERN_SOURCE,
	exec(text) {
		return matchPem(text, createState(), false);
	},
	createContext() {
		let whenClosed = false;
		let whenOpen = true;
		return {
			prepend() {
				const closed = createState();
				const open = createState();
				open.open = {
					start: -1,
					end: -1
				};
				return {
					consume(text) {
						for (const delimiter of readDelimiters(text, closed.scanner)) {
							consumeDelimiter(closed, delimiter);
							consumeDelimiter(open, delimiter);
						}
					},
					finish() {
						const nextClosed = closed.open ? whenOpen : whenClosed;
						const nextOpen = open.open ? whenOpen : whenClosed;
						whenClosed = nextClosed;
						whenOpen = nextOpen;
						return whenClosed === whenOpen;
					}
				};
			},
			pattern: {
				source: PEM_REDACT_PATTERN_SOURCE,
				exec(text) {
					const state = createState();
					if (whenClosed) state.open = {
						start: -1,
						end: -1
					};
					return matchPem(text, state, true);
				}
			}
		};
	}
};
//#endregion
//#region src/logging/redact-patterns.ts
const PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
const PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
const PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
const AWS_SECRET_ACCESS_KEY_FIELD_KEYS = String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`;
const AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
const FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_COLON_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS = String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS = String.raw`password|passphrase|pass|passwd`;
const CLI_SECRET_FLAG_KEYS = String.raw`${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
	"access_token",
	"auth_token",
	"awssecretaccesskey",
	"aws_secret_access_key",
	"hook_token",
	"refresh_token",
	"id_token",
	"token",
	"api_key",
	"apikey",
	"client_secret",
	"app_secret",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"code",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"secret",
	"secretaccesskey",
	"credential",
	"private_key",
	"authorization",
	"key",
	"card_number",
	"card_cvc",
	"card_cvv",
	"cvc",
	"cvv",
	"security_code",
	"payment_credential",
	"shared_payment_token"
]);
const FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
const ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
const ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
const STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
const STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
const CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`;
const CONFIG_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_COLON_ASSIGNMENT_SECRET_KEYS})\s*:\s*|(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})(?:\s+=\s*|=\s+))([^\s#"'\x60<>]+)/g`;
const CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS})=([^\s#"'\x60<>]+)/g`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const STRUCTURED_JSON_SECRET_REDACT_PATTERN = String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`;
const STRUCTURED_JSON_PAYMENT_REDACT_PATTERN = String.raw`"(?:${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`;
const AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])`;
const base64SafeToken = (token) => String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(?=${token})(?<!;base64,[A-Za-z0-9+/=]*)(${token})`;
const IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
function isAwsValueCharacter(char) {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || char === "/" || char === "+" || char === "=";
}
const AWS_SECRET_ACCESS_KEY_VALUE_RE = /(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u;
function couldMatchAwsSecretAccessKey(text) {
	for (let end = 39; end < text.length;) {
		let cursor = end;
		while (cursor > end - 40 && isAwsValueCharacter(text[cursor])) cursor--;
		if (cursor === end - 40) return AWS_SECRET_ACCESS_KEY_VALUE_RE.test(text);
		end = cursor + 40;
	}
	return false;
}
const AWS_VALUE_WHITESPACE_RE = /\s/;
const AWS_URL_SCHEME_CHARACTER_RE = /[A-Za-z0-9+.-]/;
const AWS_URL_SCHEME_START_RE = /[A-Za-z]/;
function* matchAwsSecretAccessKeys(text) {
	if (!couldMatchAwsSecretAccessKey(text)) return;
	const closingDelimiters = {
		"\"": "\"",
		"'": "'",
		"`": "`",
		"<": ">",
		"(": ")",
		"[": "]",
		"{": "}"
	};
	let runStart = -1;
	let schemeStart = -1;
	let url;
	let backslashes = 0;
	const runs = [];
	for (let index = 0; index <= text.length; index++) {
		const char = text[index] ?? "";
		const whitespace = index === text.length || AWS_VALUE_WHITESPACE_RE.test(char);
		const escapeDepth = backslashes;
		backslashes = char === "\\" ? backslashes + 1 : 0;
		if (char && isAwsValueCharacter(char)) {
			if (runStart === -1) runStart = index;
		} else if (runStart !== -1) {
			if (index - runStart === 40) runs.push({
				start: runStart,
				end: index,
				origin: runStart,
				url
			});
			else if (index - runStart > 40 && char === "@" && text[index - 41] === "/") runs.push({
				start: index - 40,
				end: index,
				origin: runStart,
				url
			});
			runStart = -1;
		}
		if (whitespace) {
			if (url) url.end = Math.min(url.end, index);
			for (const run of runs) {
				const context = run.url;
				const publicUrl = context && !context.hasAt && context.portValid && (context.portStart === -1 || (context.authorityEnd === -1 ? context.end : context.authorityEnd) > context.portStart + 1);
				const before = text[run.start - 1] ?? "";
				const after = text[run.end] ?? "";
				const slashCredential = run.start !== run.origin;
				const portCredential = context && context.portStart !== -1 && run.origin === context.portStart + 1 && context.authorityEnd > run.origin && run.end > context.authorityEnd && after === "@";
				if (!slashCredential && (before === "_" || isAwsValueCharacter(before)) || after === "_" || text.slice(run.origin - 8, run.origin) === ";base64," || publicUrl && !portCredential && run.start >= context.start && run.end <= context.end) continue;
				const match = text.slice(run.start, run.end);
				if (AWS_SECRET_ACCESS_KEY_VALUE_RE.test(match)) yield {
					match,
					groups: [match],
					input: text,
					offset: run.start
				};
			}
			runs.length = 0;
			schemeStart = -1;
			url = void 0;
			continue;
		}
		if (url && index >= url.start) {
			if (char === url.closing && escapeDepth === url.closingEscapeDepth) {
				url.end = Math.min(url.end, index);
				url = void 0;
			} else {
				if ("?#\"'<>`|()[]{}".includes(char)) url.end = Math.min(url.end, index);
				url.queryOrFragment ||= char === "?" || char === "#";
				if (url.authorityEnd === -1) {
					url.hasAt ||= char === "@";
					if ("/?#".includes(char)) url.authorityEnd = index;
					else if (index < url.end) {
						if (char === ":") {
							url.portValid &&= url.portStart === -1;
							url.portStart = index;
						} else if (url.portStart !== -1 && (char < "0" || char > "9")) url.portValid = false;
					}
				}
			}
		}
		if (AWS_URL_SCHEME_CHARACTER_RE.test(char)) {
			if (schemeStart === -1) schemeStart = index;
		} else {
			if ((!url || index >= url.end && !url.queryOrFragment) && char === ":" && text.startsWith("//", index + 1) && schemeStart !== -1 && AWS_URL_SCHEME_START_RE.test(text[schemeStart])) {
				const opening = text[schemeStart - 1];
				let closingEscapeDepth = 0;
				for (let offset = schemeStart - 2; offset >= 0 && text[offset] === "\\"; offset--) closingEscapeDepth++;
				url = {
					start: index + 3,
					end: text.length,
					authorityEnd: -1,
					portStart: -1,
					portValid: true,
					hasAt: false,
					queryOrFragment: false,
					closing: opening ? closingDelimiters[opening] : void 0,
					closingEscapeDepth
				};
			}
			schemeStart = -1;
		}
	}
}
const AWS_SECRET_ACCESS_KEY_MATCHER = Object.freeze({
	source: "aws-secret-access-key",
	exec: matchAwsSecretAccessKeys,
	couldMatch: couldMatchAwsSecretAccessKey
});
const BARE_PASS_KEY_RE = new RegExp(String.raw`(?<![A-Za-z0-9])(pass|${CONFIG_COLON_ASSIGNMENT_SECRET_KEYS})\s*:\s*`, "gi");
const BARE_PASS_VALUE_RE = /[^\s#"'\x60<>]+/y;
const ASCII_WORD_CHAR_RE = /[A-Za-z0-9]/;
const INLINE_WHITESPACE_RE = /[ \t\r\n]/;
function* matchBarePassAssignments(text) {
	if (!/pass\s*:/.test(text)) return;
	const keys = [...text.matchAll(BARE_PASS_KEY_RE)];
	if (keys.length === 0) return;
	let next = 0;
	let assignmentSeen = false;
	for (let index = 0; index < text.length; index++) {
		const key = keys[next];
		if (!key) return;
		if (index === key.index) {
			next++;
			const before = text[index - 1] ?? "";
			const owned = key[1] !== "pass" || before === "." || before === "-" || before === "_";
			if (!(!owned && !assignmentSeen && before === " " && ASCII_WORD_CHAR_RE.test(text[index - 2] ?? ""))) {
				assignmentSeen = true;
				let end = index + key[0].length;
				if (!owned) {
					BARE_PASS_VALUE_RE.lastIndex = end;
					const value = BARE_PASS_VALUE_RE.exec(text)?.[0];
					if (value) {
						end += value.length;
						yield {
							match: text.slice(index, end),
							groups: [value],
							input: text,
							offset: index
						};
					}
				}
				let following = keys[next];
				while (following && following.index < end) {
					next++;
					following = keys[next];
				}
				index = end - 1;
				continue;
			}
		}
		const char = text[index];
		if (char === "\n" || char === "\r") assignmentSeen = false;
		else if (char === "=") assignmentSeen = true;
		else if (char === ":" && !INLINE_WHITESPACE_RE.test(text[index + 1] ?? " ")) assignmentSeen = true;
	}
}
const BARE_PASS_ASSIGNMENT_MATCHER = Object.freeze({
	source: "bare-pass-assignment",
	exec: matchBarePassAssignments
});
const TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const CREDENTIAL_STYLE_HEADER_KEYS = "x-goog-api-key|api-key|apikey|x-api-token|x-access-token";
const GATEWAY_SECURITY_HEADER_KEYS = "X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token";
const CREDENTIAL_HEADER_FIELD_RE = new RegExp(`^(?:${CREDENTIAL_STYLE_HEADER_KEYS}|${GATEWAY_SECURITY_HEADER_KEYS})$`, "i");
const LOG_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`;
const CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*:${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*=${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*:\s*([^\s"',;]+)`;
const GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*=\s*([^\s"',;]+)`;
const FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES = /* @__PURE__ */ new Set([CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN]);
const HTTP_AUTH_HEADER_REDACT_PATTERNS = [
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN,
	CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN
];
const AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
const SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN
]);
const DEFAULT_REDACT_FIELD_PATTERNS = [
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	STRUCTURED_JSON_PAYMENT_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})=([^\s"']+)`,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS,
	GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN,
	GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
	String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
	String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	BARE_PASS_ASSIGNMENT_MATCHER,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN,
	PEM_REDACT_PATTERN_SOURCE,
	String.raw`(^|[\s,{])["']?(?:${AWS_SECRET_ACCESS_KEY_FIELD_KEYS})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`
];
const CONFIG_KEY_PROBE = new RegExp(String.raw`[:=](?<=(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])`);
const CONFIG_QUOTED_PROBE = new RegExp(String.raw`[:=](?<=(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])\s*["'\x60]`);
const CONFIG_NAMESPACED_PROBE = new RegExp(String.raw`[:=](?<=\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])`);
const STANDALONE_ASSIGNMENT_PROBE = new RegExp(String.raw`=(?<=(?:^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=)`, "i");
const REDACT_PATTERN_PREFILTERS = new Map([
	[ENV_ASSIGNMENT_REDACT_PATTERN, (text) => /KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD|CVC|CVV|SECURITY|PAYMENT/.test(text)],
	[ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN, (text) => text.includes("\\")],
	[STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, (text) => /[=]["'`]/.test(text)],
	[STANDALONE_ASSIGNMENT_REDACT_PATTERN, (text) => STANDALONE_ASSIGNMENT_PROBE.test(text)],
	[CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN, (text) => /["'`]/.test(text) && CONFIG_QUOTED_PROBE.test(text)],
	[CONFIG_ASSIGNMENT_REDACT_PATTERN, (text) => (text.includes(":") || text.includes("=")) && CONFIG_KEY_PROBE.test(text)],
	[CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN, (text) => text.includes("=")],
	[CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN, (text) => /[-_](?:password|passphrase|pass|passwd)\s*[:=]/.test(text)],
	[CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN, (text) => CONFIG_NAMESPACED_PROBE.test(text)],
	[AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN, (text) => /["']/.test(text)],
	[AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN, (text) => /["']/.test(text)],
	...HTTP_AUTH_HEADER_REDACT_PATTERNS.slice(0, 4).map((raw) => [raw, (text) => /authorization/i.test(text)]),
	[CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN, (text) => /api-key|apikey|api-token|access-token/i.test(text)],
	[CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, (text) => /api-key|apikey|api-token|access-token/i.test(text)],
	[STRUCTURED_JSON_SECRET_REDACT_PATTERN, (text) => text.includes("\"")],
	[STRUCTURED_JSON_PAYMENT_REDACT_PATTERN, (text) => text.includes("\"")],
	[GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN, (text) => /x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(text)],
	[GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN, (text) => /x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(text)]
]);
const VENDOR_TOKEN_REDACT_PATTERNS = [
	String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
	String.raw`(ghp_[A-Za-z0-9]{10,})`,
	String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
	String.raw`(gho_[A-Za-z0-9]{10,})`,
	String.raw`(ghu_[A-Za-z0-9]{10,})`,
	String.raw`(ghs_[A-Za-z0-9]{10,})`,
	String.raw`(ghr_[A-Za-z0-9]{10,})`,
	String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
	String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,
	String.raw`(gldt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,
	String.raw`(glptt-[A-Za-z0-9_-]{40,})`,
	String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,
	String.raw`(glimt-[A-Za-z0-9_-]{25,})`,
	String.raw`(glagent-[A-Za-z0-9_-]{50,})`,
	String.raw`(glwt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,
	String.raw`(glffct-[A-Za-z0-9_-]{20,})`,
	String.raw`(glrt-[A-Za-z0-9._-]{20,})`,
	String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,
	String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,
	String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,
	String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
	String.raw`(xapp-[A-Za-z0-9-]{10,})`,
	String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
	String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
	String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
	String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
	String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
	String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
	String.raw`(fal_[A-Za-z0-9_-]{10,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fc-[A-Za-z0-9]{10,})`,
	String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
	base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),
	String.raw`(sk_live_[A-Za-z0-9]{10,})`,
	String.raw`(sk_test_[A-Za-z0-9]{10,})`,
	String.raw`(rk_live_[A-Za-z0-9]{10,})`,
	String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(npm_[A-Za-z0-9]{10,})`,
	String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
	String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
	String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
	String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
	String.raw`(bkua_[a-z0-9]{40})`,
	String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
	String.raw`(sbp_[a-z0-9]{40})`,
	base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),
	String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
	String.raw`(glsa_[A-Za-z0-9_]{41})`,
	String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
	String.raw`(nfp_[A-Za-z0-9_]{36})`,
	String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
	base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),
	base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),
	base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),
	String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
	String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
	String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
	String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
	String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
	String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
	String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
	String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
	String.raw`(tvly-[A-Za-z0-9]{10,})`,
	String.raw`(exa_[A-Za-z0-9]{10,})`,
	String.raw`(syt_[A-Za-z0-9]{10,})`,
	String.raw`(retaindb_[A-Za-z0-9]{10,})`,
	String.raw`(hsk-[A-Za-z0-9]{10,})`,
	String.raw`(mem0_[A-Za-z0-9]{10,})`,
	String.raw`(brv_[A-Za-z0-9]{10,})`,
	String.raw`(xai-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
	base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),
	base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),
	String.raw`(AKID[A-Za-z0-9]{10,})`,
	String.raw`(LTAI[A-Za-z0-9]{10,})`,
	String.raw`(hf_[A-Za-z0-9]{10,})`,
	String.raw`(api_org_[A-Za-z0-9]{20,})`,
	String.raw`(r8_[A-Za-z0-9]{10,})`,
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN
];
const CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS,
	...VENDOR_TOKEN_REDACT_PATTERNS.filter((source) => source.startsWith(BASE64_SAFE_TOKEN_BOUNDARY))
]);
const DEFAULT_REDACT_PATTERNS = [
	...DEFAULT_REDACT_FIELD_PATTERNS,
	...VENDOR_TOKEN_REDACT_PATTERNS,
	AWS_SECRET_ACCESS_KEY_MATCHER
];
const TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN
]);
/** Programmatic counterparts of the ambiguous assignment rules: kept out of tool payloads, preserved in source. */
const AMBIGUOUS_ASSIGNMENT_MATCHERS = /* @__PURE__ */ new Set([BARE_PASS_ASSIGNMENT_MATCHER]);
const TOOL_PAYLOAD_REDACT_PATTERNS = DEFAULT_REDACT_PATTERNS.filter((pattern) => typeof pattern === "string" ? !TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(pattern) : !AMBIGUOUS_ASSIGNMENT_MATCHERS.has(pattern));
//#endregion
//#region src/logging/redact-linear-matchers.ts
const JS_WHITESPACE_CODES = /* @__PURE__ */ new Set([
	9,
	10,
	11,
	12,
	13,
	32,
	160,
	5760,
	8232,
	8233,
	8239,
	8287,
	12288,
	65279
]);
function isJsWhitespaceAt(text, index) {
	if (index >= text.length) return false;
	const code = text.charCodeAt(index);
	return JS_WHITESPACE_CODES.has(code) || code >= 8192 && code <= 8202;
}
function isJsWhitespaceChar(char) {
	return char !== void 0 && isJsWhitespaceAt(char, 0);
}
function isAlnumChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isLetterChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isWordChar(char) {
	return char === "_" || isAlnumChar(char);
}
function isHexChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102;
}
function isDigitChar(char) {
	return char !== void 0 && char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
}
function isBase64UrlChar(char) {
	return isAlnumChar(char) || char === "+" || char === "/" || char === "=";
}
const prefixRegexPools = /* @__PURE__ */ new Map();
/** Reuse compiled prefixes without sharing mutable lastIndex with a reentrant scan. */
function* scanPrefixOccurrences(text, prefix) {
	let pool = prefixRegexPools.get(prefix);
	if (!pool) {
		pool = [];
		prefixRegexPools.set(prefix, pool);
	}
	const re = pool.pop() ?? new RegExp(prefix, "gi");
	try {
		re.lastIndex = 0;
		for (let match = re.exec(text); match; match = re.exec(text)) yield match.index;
	} finally {
		re.lastIndex = 0;
		pool.push(re);
	}
}
/** The `;base64,` exemption under the shared case-insensitive compilation of these rules. */
function isDataUrlPrefix(text, runStart) {
	return runStart >= 8 && text.slice(runStart - 8, runStart).toLowerCase() === ";base64,";
}
/** End of the maximal run of `isMember` characters starting at `start`. */
function runEndOf(text, start, isMember) {
	let end = start;
	while (end < text.length && isMember(text[end])) end += 1;
	return end;
}
/**
* Shared matcher for the `BASE64_SAFE_TOKEN_BOUNDARY` vendor rules. The boundary group is
* checked per candidate in O(1); the `(?<!;base64,[A-Za-z0-9+/=]*)` exemption walks each
* base64 run once because candidates advance left to right and share runs, replacing the
* unbounded lookbehind that rescanned the whole run from every candidate. The token-end
* function is created per exec() call so concurrent redactions never share scanner state.
*/
function makeBase64SafeTokenMatcher(source, prefix, makeTokenEnd) {
	function* exec(text) {
		const tokenEnd = makeTokenEnd();
		let runStart = -1;
		let runEnd = -1;
		let searchFloor = 0;
		for (const candidate of scanPrefixOccurrences(text, prefix)) {
			if (candidate < searchFloor) continue;
			if (candidate > 0 && isAlnumChar(text[candidate - 1])) continue;
			if (candidate > 0) {
				let runAtCandidate;
				if (isBase64UrlChar(text[candidate - 1])) {
					if (candidate - 1 >= runStart && candidate - 1 < runEnd) runAtCandidate = runStart;
					else {
						let walk = candidate - 1;
						while (walk > 0 && isBase64UrlChar(text[walk - 1])) walk -= 1;
						runStart = walk;
						runEnd = runEndOf(text, candidate, isBase64UrlChar);
						runAtCandidate = walk;
					}
				} else runAtCandidate = candidate;
				if (isDataUrlPrefix(text, runAtCandidate)) continue;
			}
			const end = tokenEnd(text, candidate);
			if (end === null) continue;
			const matchStart = candidate > 0 ? candidate - 1 : 0;
			yield {
				match: text.slice(matchStart, end),
				groups: [candidate > 0 ? text[candidate - 1] : "", text.slice(candidate, end)],
				input: text,
				offset: matchStart
			};
			searchFloor = end + 1;
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const GAAAA_VALUE_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "=" || char === "-";
const ATBB_VALUE_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "=" || char === "." || char === "-";
const AT_VALUE_CHAR = (char) => isAlnumChar(char) || char === "+" || char === "/" || char === "=" || char === "-" || char === "_";
function fixedTailTokenEnd(tailStart, tailLength, isMember) {
	return (text, start) => {
		const end = start + tailStart + tailLength;
		for (let index = start + tailStart; index < end; index++) if (!isMember(text[index])) return null;
		return end;
	};
}
/** `dapi` + 32 hex digits + an optional `-<digit>`; the optional tail is greedy like the regex. */
function dapiTokenEnd(text, start) {
	const bodyEnd = start + 4 + 32;
	for (let index = start + 4; index < bodyEnd; index++) if (!isHexChar(text[index])) return null;
	if (text[bodyEnd] === "-" && isDigitChar(text[bodyEnd + 1])) return bodyEnd + 2;
	return bodyEnd;
}
/**
* `ATCTT3xFfG`/`ATATT` value: one or more class characters, then `=`, then exactly eight
* alphanumerics. Greedy backtracking lands on the rightmost `=` in the run whose next
* eight characters are alphanumerics; each run is scanned once and candidates share it.
*/
function makeAtEqualsTokenMatcher(source, prefix) {
	const prefixLength = prefix.length;
	return makeBase64SafeTokenMatcher(source, prefix, () => {
		let runStart = -1;
		let runEnd = -1;
		let equals = [];
		return (text, start) => {
			const valueStart = start + prefixLength;
			if (valueStart < runStart || valueStart >= runEnd) {
				runEnd = runEndOf(text, valueStart, AT_VALUE_CHAR);
				runStart = valueStart;
				equals = [];
				for (let index = valueStart; index < runEnd; index++) if (text[index] === "=" && index + 9 <= text.length && isAlnumChar(text[index + 1]) && isAlnumChar(text[index + 2]) && isAlnumChar(text[index + 3]) && isAlnumChar(text[index + 4]) && isAlnumChar(text[index + 5]) && isAlnumChar(text[index + 6]) && isAlnumChar(text[index + 7]) && isAlnumChar(text[index + 8])) equals.push(index);
			}
			const minimum = valueStart + 1;
			const split = equals[equals.length - 1];
			return split !== void 0 && split >= minimum ? split + 9 : null;
		};
	});
}
const GAAAA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token gAAAA (linear)", "gAAAA", () => (text, start) => {
	const end = runEndOf(text, start + 5, GAAAA_VALUE_CHAR);
	return end - (start + 5) >= 20 ? end : null;
});
const ATBB_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token ATBB (linear)", "ATBB", () => (text, start) => {
	const end = runEndOf(text, start + 4, ATBB_VALUE_CHAR);
	return end - (start + 4) >= 16 ? end : null;
});
const AKIA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token AKIA (linear)", "AKIA", () => fixedTailTokenEnd(4, 16, isAlnumChar));
const ASIA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token ASIA (linear)", "ASIA", () => fixedTailTokenEnd(4, 16, isAlnumChar));
const DAPI_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token dapi (linear)", "dapi", () => dapiTokenEnd);
const ATCTT_TOKEN_MATCHER = makeAtEqualsTokenMatcher("vendor-token ATCTT3xFfG (linear)", "ATCTT3xFfG");
const ATATT_TOKEN_MATCHER = makeAtEqualsTokenMatcher("vendor-token ATATT (linear)", "ATATT");
const JWT_REDACT_PATTERN = String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`;
const JWT_SEGMENT_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "-";
/** JWT rule: each `eyJ` candidate parses its three segments forward; class runs are shared. */
const JWT_MATCHER = Object.freeze({
	source: "jwt (linear)",
	*exec(text) {
		const firstRun = {
			start: -1,
			end: -1
		};
		const secondRun = {
			start: -1,
			end: -1
		};
		const thirdRun = {
			start: -1,
			end: -1
		};
		const segmentEnd = (position, run) => {
			if (position >= run.start && position < run.end) return run.end;
			const end = runEndOf(text, position, JWT_SEGMENT_CHAR);
			run.start = position;
			run.end = end;
			return end;
		};
		let searchFloor = 0;
		for (const candidate of scanPrefixOccurrences(text, "eyj")) {
			if (candidate < searchFloor) continue;
			const firstEnd = segmentEnd(candidate + 3, firstRun);
			if (firstEnd - (candidate + 3) < 10 || text[firstEnd] !== ".") continue;
			const secondEnd = segmentEnd(firstEnd + 1, secondRun);
			if (secondEnd - (firstEnd + 1) < 10 || text[secondEnd] !== ".") continue;
			const thirdEnd = segmentEnd(secondEnd + 1, thirdRun);
			if (thirdEnd - (secondEnd + 1) < 10) continue;
			const token = text.slice(candidate, thirdEnd);
			yield {
				match: token,
				groups: [token],
				input: text,
				offset: candidate
			};
			searchFloor = thirdEnd;
		}
	}
});
const URL_USERINFO_REDACT_PATTERN = String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`;
const CONNECTION_STRING_REDACT_PATTERN = String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`;
const URL_USERINFO_SCHEMES = /* @__PURE__ */ new Set([
	"http",
	"https",
	"ws",
	"wss",
	"ftp"
]);
const CONNECTION_STRING_SCHEMES = /* @__PURE__ */ new Set([
	"postgres",
	"postgresql",
	"mysql",
	"mongodb",
	"mongodb+srv",
	"redis",
	"rediss",
	"amqp",
	"amqps"
]);
/**
* Shared matcher for the URL-userinfo and connection-string password rules. Both regexes are
* deterministic parses (each character class excludes its own terminators), so every `://`
* candidate parses forward once; failed password scans are memoized because later candidates
* share their tail regions.
*/
function makeUserInfoMatcher(source, schemes, isPassTerminator) {
	function* exec(text) {
		let searchFloor = 0;
		let failedPassScanEnd = -1;
		let separator = text.indexOf("://");
		while (separator !== -1) {
			let schemeStart = separator;
			while (schemeStart > 0 && isWordChar(text[schemeStart - 1])) schemeStart -= 1;
			let scheme = text.slice(schemeStart, separator).toLowerCase();
			let matchStart = schemeStart;
			if (!schemes.has(scheme) && schemeStart >= 8 && scheme === "srv" && text.slice(schemeStart - 8, schemeStart).toLowerCase() === "mongodb+") {
				scheme = "mongodb+srv";
				matchStart = schemeStart - 8;
			}
			if (separator >= searchFloor && schemes.has(scheme) && (matchStart === 0 || !isWordChar(text[matchStart - 1]))) {
				let cursor = separator + 3;
				while (cursor < text.length && text[cursor] !== ":" && text[cursor] !== "/" && text[cursor] !== "@" && !isJsWhitespaceAt(text, cursor)) cursor += 1;
				if (text[cursor] === ":") {
					const passStart = cursor + 1;
					if (passStart >= failedPassScanEnd) {
						const passEnd = runEndOf(text, passStart, (char) => !isPassTerminator(char));
						if (text[passEnd] === "@" && passEnd > passStart) {
							yield {
								match: text.slice(matchStart, passEnd + 1),
								groups: [text.slice(passStart, passEnd)],
								input: text,
								offset: matchStart
							};
							searchFloor = passEnd + 1;
							separator = text.indexOf("://", passEnd + 1);
							continue;
						}
						failedPassScanEnd = passEnd;
					}
				}
			}
			separator = text.indexOf("://", separator + 1);
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const URL_USERINFO_MATCHER = makeUserInfoMatcher("url-userinfo (linear)", URL_USERINFO_SCHEMES, (char) => char === "/" || char === "@" || isJsWhitespaceChar(char));
const CONNECTION_STRING_MATCHER = makeUserInfoMatcher("connection-string (linear)", CONNECTION_STRING_SCHEMES, (char) => char === "@" || isJsWhitespaceChar(char));
const FORM_BODY_FIRST_PAIR_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`;
const FORM_FIRST_PAIR_KEYS_RE = new RegExp(`^(?:${FORM_BODY_FIRST_PAIR_KEYS})$`, "i");
const FORM_FIRST_PAIR_KEY_CHAR = (char) => isAlnumChar(char) || char === "-" || char === "_";
const FORM_FIRST_PAIR_TAIL_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "." || char === "-";
/** The lookahead `&[A-Za-z_][A-Za-z0-9_.-]*=` is a deterministic forward check. */
function isFormPairBoundary(text, ampersand) {
	const first = text[ampersand + 1];
	if (!(first !== void 0 && (isLetterChar(first) || first === "_"))) return false;
	return text[runEndOf(text, ampersand + 2, FORM_FIRST_PAIR_TAIL_CHAR)] === "=";
}
/**
* Form first-pair rule: the value class excludes `&` and whitespace, so the greedy value
* always ends at the first `&` or whitespace and the lookahead is checked there alone;
* per-candidate value runs are shared so long runs are read once.
*/
const FORM_BODY_FIRST_PAIR_MATCHER = Object.freeze({
	source: "form-body-first-pair (linear)",
	*exec(text) {
		let runStart = -1;
		let runEnd = -1;
		const valueEnd = (start) => {
			if (start >= runStart && start < runEnd) return runEnd;
			const end = runEndOf(text, start, (char) => char !== "&" && !isJsWhitespaceChar(char));
			runStart = start;
			runEnd = end;
			return end;
		};
		let searchFloor = 0;
		let separator = text.indexOf("=");
		while (separator !== -1) {
			let keyStart = separator;
			while (keyStart > 0 && FORM_FIRST_PAIR_KEY_CHAR(text[keyStart - 1])) keyStart -= 1;
			const key = text.slice(keyStart, separator);
			if (separator >= searchFloor && key.length > 0 && FORM_FIRST_PAIR_KEYS_RE.test(key) && (keyStart === 0 || text[keyStart - 1] === "," || text[keyStart - 1] === ";" || isJsWhitespaceAt(text, keyStart - 1))) {
				const start = separator + 1;
				const end = valueEnd(start);
				if (end > start && end < text.length && text[end] === "&" && isFormPairBoundary(text, end)) {
					const matchStart = keyStart > 0 ? keyStart - 1 : 0;
					yield {
						match: text.slice(matchStart, end),
						groups: [keyStart > 0 ? text[keyStart - 1] : "", text.slice(start, end)],
						input: text,
						offset: matchStart
					};
					searchFloor = end;
					separator = text.indexOf("=", end);
					continue;
				}
			}
			separator = text.indexOf("=", separator + 1);
		}
	}
});
const STANDALONE_QUOTED_PREFIX_SOURCE = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])`;
const CONFIG_QUOTED_PREFIX_SOURCE = String.raw`(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])`;
/**
* Shared matcher for the two quoted-value rules. The tempered dot `((?:(?!\2)[^\r\n])+)`
* forced a per-character lookahead and one backtrack stack entry per value character; the
* value here is a linear scan to the first closing quote or line end, and failed scans are
* memoized per quote character because later candidates share their tail regions.
*/
function makeQuotedAssignmentMatcher(source, prefixSource, flags) {
	const prefixRegexPool = [];
	function* exec(text) {
		const prefixRe = prefixRegexPool.pop() ?? new RegExp(prefixSource, flags);
		const failedScans = /* @__PURE__ */ new Map();
		let searchFrom = 0;
		try {
			for (;;) {
				prefixRe.lastIndex = searchFrom;
				const prefix = prefixRe.exec(text);
				if (!prefix) return;
				const start = prefix.index;
				const quote = prefix[2];
				const valueStart = start + prefix[0].length;
				const memo = failedScans.get(quote);
				let closing = -1;
				if (!(memo !== void 0 && valueStart >= memo.start && valueStart < memo.end)) {
					closing = valueStart;
					while (closing < text.length) {
						const char = text[closing];
						if (char === quote || char === "\r" || char === "\n") break;
						closing += 1;
					}
				}
				if (closing > valueStart && text[closing] === quote) {
					const end = closing + 1;
					yield {
						match: text.slice(start, end),
						groups: [
							prefix[1] ?? "",
							quote,
							text.slice(valueStart, closing)
						],
						input: text,
						offset: start
					};
					searchFrom = end;
				} else {
					if (closing !== -1) failedScans.set(quote, {
						start: valueStart,
						end: closing
					});
					searchFrom = start + 1;
				}
			}
		} finally {
			prefixRe.lastIndex = 0;
			prefixRegexPool.push(prefixRe);
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const STANDALONE_QUOTED_MATCHER = makeQuotedAssignmentMatcher("standalone-quoted-assignment (linear)", STANDALONE_QUOTED_PREFIX_SOURCE, "gi");
const CONFIG_QUOTED_MATCHER = makeQuotedAssignmentMatcher("config-quoted-assignment (linear)", CONFIG_QUOTED_PREFIX_SOURCE, "g");
/** Default rule sources whose compilation routes to the linear matchers above. */
const LINEAR_MATCHER_SOURCES = /* @__PURE__ */ new Map([
	[base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`), GAAAA_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`), ATCTT_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`), ATATT_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`), ATBB_TOKEN_MATCHER],
	[base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`), DAPI_TOKEN_MATCHER],
	[base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`), AKIA_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`), ASIA_TOKEN_MATCHER],
	[JWT_REDACT_PATTERN, JWT_MATCHER],
	[URL_USERINFO_REDACT_PATTERN, URL_USERINFO_MATCHER],
	[CONNECTION_STRING_REDACT_PATTERN, CONNECTION_STRING_MATCHER],
	[FORM_BODY_FIRST_PAIR_REDACT_PATTERN, FORM_BODY_FIRST_PAIR_MATCHER],
	[STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, STANDALONE_QUOTED_MATCHER],
	[CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN, CONFIG_QUOTED_MATCHER]
]);
//#endregion
//#region src/logging/redact-mask.ts
const DEFAULT_REDACT_MIN_LENGTH = 18;
const DEFAULT_REDACT_KEEP_START = 6;
const SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
const SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
const SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"`"
]);
function maskToken(token) {
	if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
	return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
	const openingQuote = token[0] ?? "";
	const contentStart = SECRET_VALUE_QUOTE_CHARS.has(openingQuote) ? 1 : 0;
	if (contentStart) {
		const closingQuoteIndex = token.lastIndexOf(openingQuote);
		if (closingQuoteIndex > 0) {
			const suffix = token.slice(closingQuoteIndex + 1);
			if (SECRET_VALUE_SUFFIX_RE.test(suffix)) return {
				maskable: token.slice(1, closingQuoteIndex),
				suffix,
				maskStart: 0,
				maskEnd: closingQuoteIndex + 1
			};
		}
	}
	const content = token.slice(contentStart);
	const trailingDelimiter = content.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
	const maskable = trailingDelimiter && trailingDelimiter.length < content.length ? content.slice(0, -trailingDelimiter.length) : content;
	return {
		maskable,
		suffix: maskable === content ? "" : trailingDelimiter,
		maskStart: 0,
		maskEnd: contentStart + maskable.length
	};
}
function splitFormAwareCredentialValue(token) {
	const pairBoundary = token.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);
	return pairBoundary < 0 ? {
		secret: token,
		suffix: ""
	} : {
		secret: token.slice(0, pairBoundary),
		suffix: token.slice(pairBoundary)
	};
}
function maskSecretValue(token, options) {
	const { maskable, suffix } = splitSecretValueForMask(token);
	return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
//#endregion
//#region src/logging/redact-performance.ts
const redactionPerformance = channel("openclaw.redaction");
/** The capture subscriber receives counts and synchronous CPU time, never text or patterns. */
function startRedactionMeasurement(operation) {
	if (!redactionPerformance.hasSubscribers) return;
	const startedAt = performance.now();
	const cpu = process.threadCpuUsage();
	return (outcome, inputChars, patternCount) => {
		const elapsedMs = performance.now() - startedAt;
		const used = process.threadCpuUsage(cpu);
		redactionPerformance.publish({
			operation,
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			elapsedMs,
			threadCpuMs: (used.user + used.system) / 1e3,
			...inputChars === void 0 ? {} : { inputChars },
			...patternCount === void 0 ? {} : { patternCount }
		});
	};
}
//#endregion
//#region src/logging/redact-prefilter.ts
const FIELD_KEY_PREFILTER_RE = /KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=/iu;
const SEPARATED_VENDOR_PREFILTER_RE = /sk-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|_gitlab_session=|xox[baprs]-|xapp-|gsk_|pplx-|fal_|fc-|bb_live_|[sr]k_(?:live|test)_|npm_|pypi-|do[opr]_v1_|dckr_|bkua_|CCIPAT_|sbp_|dd[pw]_|glsa_|nfp_|CFPAT-|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_|(?:^|[^A-Za-z0-9_])(?:am_|sk_)|hf_|api_org_|r8_/iu;
const DEFAULT_REDACT_PREFILTER_RE = /PRIVATE KEY|\bBearer\s+|GR1348941|hooks\.slack\.com|discord|AIza|ya29\.|1\/\/0|eyJ|gAAAA|SG\.|dp\.(?:ct|pt|sa|st|scim|audit)\.|dapi[0-9a-f]|ATCTT3|ATATT|ATBB|FlyV1|A[KS]IA[A-Z0-9]|AKID|LTAI|\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}/iu;
const OBFUSCATED_KEY_CHAR_RE = new RegExp(`[${FORM_BODY_KEY_INVISIBLE_CHARS}+%]`, "u");
const FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE = /JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i;
function couldMatchDefaultRedactPatterns(text) {
	return FIELD_KEY_PREFILTER_RE.test(text) || (text.includes("-") || text.includes("_")) && SEPARATED_VENDOR_PREFILTER_RE.test(text) || DEFAULT_REDACT_PREFILTER_RE.test(text) || text.includes("://") && text.includes("@") || text.includes("=") && OBFUSCATED_KEY_CHAR_RE.test(text) || AWS_SECRET_ACCESS_KEY_MATCHER.couldMatch(text);
}
function couldMatchDefaultFullContextPatterns(text) {
	return couldMatchDefaultRedactPatterns(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function couldMatchVendorRedactPatterns(text) {
	return (text.includes("-") || text.includes("_")) && SEPARATED_VENDOR_PREFILTER_RE.test(text) || DEFAULT_REDACT_PREFILTER_RE.test(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function createRedactPrefilter(probe) {
	const matches = /* @__PURE__ */ new Map();
	return (text) => {
		const cached = matches.get(text);
		if (cached !== void 0) return cached;
		const result = probe(text);
		matches.set(text, result);
		return result;
	};
}
//#endregion
//#region src/shared/assistant-error-format.ts
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const CONNECTION_FAILED_MESSAGE = "Couldn't connect to the AI service. Check your connection, then try again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.";
const TRANSPORT_ERRORS = [
	{
		code: /\beconnrefused\b/i,
		phrases: ["connection refused", "actively refused"],
		message: CONNECTION_FAILED_MESSAGE
	},
	{
		code: /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i,
		phrases: [
			"socket hang up",
			"connection reset",
			"connection aborted"
		],
		message: "Lost the connection to the AI service. Check the conversation before trying again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`."
	},
	{
		code: /\benotfound\b|\beai_again\b|\benetunreach\b|\behostunreach\b|\behostdown\b/i,
		phrases: [
			"getaddrinfo",
			"no such host",
			"dns",
			"network is unreachable",
			"host is unreachable",
			"fetch failed",
			"connection error",
			"network request failed"
		],
		message: CONNECTION_FAILED_MESSAGE
	}
];
function isKnownTransportErrorCode(value) {
	return TRANSPORT_ERRORS.some(({ code }) => code?.exec(value)?.[0] === value);
}
//#endregion
//#region src/logging/structured-authorization-code.ts
function shouldRedactStructuredAuthorizationCode(normalizedKey, path, transportCode) {
	if (normalizedKey !== "code") return false;
	const normalizedPath = path.map((part) => part.toLowerCase());
	if (normalizedPath.length === 1 || normalizedPath.at(-1) === "code" && [
		"error",
		"nodeerror",
		"status",
		"details",
		"warnings"
	].includes(normalizedPath.at(-2) ?? "")) return false;
	return !(transportCode !== void 0 && normalizedPath.length > 1 && normalizedPath.slice(0, -1).every((part) => part === "cause") && isKnownTransportErrorCode(transportCode));
}
//#endregion
//#region src/logging/redact.ts
const DEFAULT_REDACT_MODE = "tools";
const shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
const builtInResolvedPatterns = /* @__PURE__ */ new WeakSet();
const vendorResolvedPatterns = /* @__PURE__ */ new WeakMap();
const vendorSources = new Set(VENDOR_TOKEN_REDACT_PATTERNS);
const chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
const canonicalBuiltInSources = new Set([...DEFAULT_REDACT_PATTERNS, ...TOOL_PAYLOAD_REDACT_PATTERNS].filter((entry) => typeof entry === "string"));
const formAwareEqualsAssignmentPatterns = /* @__PURE__ */ new WeakSet();
const sourceAssignmentPatterns = /* @__PURE__ */ new WeakSet();
let defaultResolvedPatterns;
let toolPayloadResolvedPatterns;
const FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`, "gu");
const FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
const FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
const FORM_BODY_VALUE = "[^&\\s<>]*";
const URL_QUERY_VALUE = "[^&#\\s<>]*";
const FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
const FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
const FORM_BODY_SUBSTRING_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`, "gu");
const ENCODED_FORM_PAIR_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`, "gu");
const FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`, "giu");
const URL_QUERY_PAIR_RE = new RegExp(String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`, "gu");
const FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
const FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
const STRUCTURED_SECRET_FIELD_RE = new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`, "i");
const STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
const STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
const APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
const BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
	"case",
	"claw",
	"demo",
	"file",
	"main",
	"name",
	"open",
	"path",
	"slug",
	"test"
]);
const STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`, "i");
function normalizeMode(value) {
	return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
	if (raw === PEM_REDACT_PATTERN_SOURCE) return PEM_REDACT_MATCHER;
	if (typeof raw !== "string" && !(raw instanceof RegExp)) {
		if (AMBIGUOUS_ASSIGNMENT_MATCHERS.has(raw)) sourceAssignmentPatterns.add(raw);
		return raw;
	}
	let pattern = typeof raw === "string" ? LINEAR_MATCHER_SOURCES.get(raw) ?? null : null;
	let canPrefilter = true;
	if (raw instanceof RegExp) {
		if (raw.flags.includes("g")) pattern = raw;
		else pattern = new RegExp(raw.source, `${raw.flags}g`);
	} else if (!pattern && raw.trim()) {
		const [source, flags] = parseRedactPatternSource(raw);
		const optimized = canonicalBuiltInSources.has(raw) ? rewriteOpenEndedRepeats(source, flags) : source;
		pattern = compileConfigRegex(optimized, flags)?.regex ?? null;
		canPrefilter = pattern !== null && pattern.source === optimized && pattern.flags === flags && pattern.exec === RegExp.prototype.exec && pattern[Symbol.replace] === RegExp.prototype[Symbol.replace];
	}
	if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) shellReferencePreservingPatterns.add(pattern);
	if (pattern && typeof raw === "string" && TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(raw)) sourceAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES.has(raw)) formAwareEqualsAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && (raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) chunkUnsafePatterns.add(pattern);
	if (pattern && typeof raw === "string") {
		if (canonicalBuiltInSources.has(raw)) builtInResolvedPatterns.add(pattern);
		if (canPrefilter && vendorSources.has(raw) && !vendorResolvedPatterns.has(pattern)) {
			const source = pattern.source;
			const exec = pattern.exec;
			const flags = pattern instanceof RegExp ? pattern.flags : void 0;
			const replace = pattern instanceof RegExp ? pattern[Symbol.replace] : void 0;
			vendorResolvedPatterns.set(pattern, () => pattern.source === source && pattern.exec === exec && (!(pattern instanceof RegExp) || pattern.flags === flags && pattern[Symbol.replace] === replace));
		}
		const probe = REDACT_PATTERN_PREFILTERS.get(raw);
		if (canPrefilter && probe) setRedactPatternPrefilter(pattern, probe);
	}
	return pattern;
}
function resolvePatterns(value) {
	if (value === TOOL_PAYLOAD_REDACT_PATTERNS) {
		toolPayloadResolvedPatterns ??= TOOL_PAYLOAD_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return toolPayloadResolvedPatterns;
	}
	if (!value?.length || value === DEFAULT_REDACT_PATTERNS) {
		defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return defaultResolvedPatterns;
	}
	const seen = /* @__PURE__ */ new Set();
	const combined = [];
	for (const raw of value) {
		const resolved = parsePattern(raw);
		if (resolved !== null && !seen.has(resolved)) {
			seen.add(resolved);
			combined.push(resolved);
		}
	}
	if (!seen.has(AWS_SECRET_ACCESS_KEY_MATCHER)) combined.push(AWS_SECRET_ACCESS_KEY_MATCHER);
	return combined;
}
function usesBuiltInRedactPatterns(value) {
	return !value?.length || value === DEFAULT_REDACT_PATTERNS || value === TOOL_PAYLOAD_REDACT_PATTERNS;
}
function normalizeSensitiveKeyName(value) {
	const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
	try {
		return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
	} catch {
		return stripped.toLowerCase().replaceAll("-", "_");
	}
}
function isSensitiveBodyKey(key) {
	return isSensitiveUrlQueryParamName(key) || BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
	return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function visitSensitiveAssignments(text, kind, visit) {
	if (!text || kind === "url" && !text.includes("?")) return;
	if (kind === "encoded" && !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) return;
	if (kind === "context" && !/[=:]/u.test(text)) return;
	const visitPair = (key, token, valueOffset) => {
		if (kind === "encoded" && !hasEncodedOrInvisibleFormKey(key)) return;
		if (!isSensitiveBodyKey(key)) return;
		const { maskable, maskStart, maskEnd } = splitSecretValueForMask(token);
		visit(valueOffset + maskStart, valueOffset + maskEnd, maskable);
	};
	if (kind === "form") {
		let cursor = 0;
		for (const pair of text.split("&")) {
			const equalsIndex = pair.indexOf("=");
			if (equalsIndex >= 0) visitPair(pair.slice(0, equalsIndex), pair.slice(equalsIndex + 1), cursor + equalsIndex + 1);
			cursor += pair.length + 1;
		}
		return;
	}
	const pattern = kind === "url" ? URL_QUERY_PAIR_RE : kind === "encoded" ? ENCODED_FORM_PAIR_RE : FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
	const keyIndex = kind === "context" ? 3 : 2;
	pattern.lastIndex = 0;
	try {
		for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
			const prefix = match[1] ?? "";
			const key = match[keyIndex] ?? "";
			visitPair(key, match[keyIndex + 1] ?? "", match.index + prefix.length + key.length + 1);
		}
	} finally {
		pattern.lastIndex = 0;
	}
}
function redactAssignmentValues(text, kind, onEdits) {
	const parts = [];
	const edits = [];
	let cursor = 0;
	visitSensitiveAssignments(text, kind, (start, end, maskable) => {
		const replacement = kind === "url" ? maskToken(maskable) : "***";
		parts.push(text.slice(cursor, start), replacement);
		if (onEdits) edits.push({
			start,
			end,
			replacement
		});
		cursor = end;
	});
	if (edits.length > 0) onEdits?.(edits);
	return parts.length > 0 ? parts.join("") + text.slice(cursor) : text;
}
function redactFormBodyLine(text, onEdits) {
	if (!text.includes("=")) return text;
	const contextRedacted = redactAssignmentValues(redactAssignmentValues(text, "encoded", onEdits), "context", onEdits);
	if (!contextRedacted.includes("&")) return contextRedacted;
	if (FORM_BODY_RE.test(contextRedacted)) return redactAssignmentValues(contextRedacted, "form", onEdits);
	const substringEdits = [];
	const redacted = contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body, offset) => {
		const redactedBody = redactAssignmentValues(body, "form", onEdits ? (edits) => {
			for (const edit of edits) substringEdits.push({
				...edit,
				start: offset + prefix.length + edit.start,
				end: offset + prefix.length + edit.end
			});
		} : void 0);
		return redactedBody === body ? match : `${prefix}${redactedBody}`;
	});
	if (substringEdits.length > 0) onEdits?.(substringEdits);
	return redactAssignmentValues(redactAssignmentValues(redacted, "encoded", onEdits), "context", onEdits);
}
function redactFormBody(text, onEdits) {
	if (!text.includes("=")) return text;
	if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
		let offset = 0;
		return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map((segment) => {
			const result = FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment, onEdits ? (edits) => onEdits(edits.map((edit) => ({
				...edit,
				start: offset + edit.start,
				end: offset + edit.end
			}))) : void 0);
			offset += result.length;
			return result;
		}).join("");
	}
	return redactFormBodyLine(text, onEdits);
}
function isShellReferenceToKey(key, value) {
	if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
	const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
	if (bare) return bare[1] === key;
	return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function maskSecretFieldValue(key, value) {
	const expansion = value.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);
	if (expansion && expansion[1] === key) return `${value.slice(0, value.indexOf(":") + 2)}***}`;
	return "***";
}
function shouldPreserveShellReferenceMatch(match, token) {
	const key = match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
	return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
	return /^[-=?+]\}$/.test(token);
}
function prepareRedactionCapture({ match, groups, input, offset, replacement: policyReplacement }, pattern, preserveSourceAssignment) {
	if (match.includes("PRIVATE KEY-----")) return {
		start: offset,
		end: offset + match.length,
		value: match,
		redact: (target) => ({
			start: target.start,
			end: target.end,
			value: target.value,
			replacement: policyReplacement ?? redactPemBlock(target.value, "…redacted…")
		})
	};
	const selected = selectSecretCapture(match, groups);
	if (selected.value === "***") return;
	const tokenIndex = selected.value === match ? 0 : getSecretCaptureStart(pattern, input, match, offset, selected);
	if (tokenIndex < 0) return;
	const start = offset + tokenIndex;
	return {
		start,
		end: start + selected.value.length,
		value: selected.value,
		redact: (target) => {
			const token = target.value;
			if (sourceAssignmentPatterns.has(pattern) && preserveSourceAssignment?.(input, offset + getSecretCaptureStart(pattern, input, match, offset, selected))) return;
			const formAwareValue = formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(token) : {
				secret: token,
				suffix: ""
			};
			if (splitSecretValueForMask(formAwareValue.secret).maskable === "***") return;
			const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
			if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) return;
			const masked = policyReplacement ?? (preserveSourceAssignment && sourceAssignmentPatterns.has(pattern) ? maskSecretValue(token) : isShellReferencePattern ? maskToken(token) : `${maskSecretValue(formAwareValue.secret, { hinted: true })}${formAwareValue.suffix}`);
			return {
				start: target.start,
				end: target.end,
				replacement: masked
			};
		}
	};
}
function redactMatch(match, pattern, preserveSourceAssignment) {
	const capture = prepareRedactionCapture(match, pattern, preserveSourceAssignment);
	const edit = capture?.redact(capture);
	return edit ? match.match.slice(0, edit.start - match.offset) + edit.replacement + match.match.slice(edit.end - match.offset) : match.match;
}
function redactText(text, patterns, options) {
	const finishMeasurement = startRedactionMeasurement("text");
	let outcome = "error";
	try {
		let next = redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(text, "***"), "url"));
		let pattern;
		const replace = (match) => redactMatch(match, pattern, options?.preserveSourceAssignment);
		const replaceRegex = (...args) => replace(readRedactMatch(args));
		let vendorInput;
		let vendorMatch = false;
		for (pattern of patterns) {
			if (vendorResolvedPatterns.get(pattern)?.()) {
				if (vendorInput !== next) {
					vendorInput = next;
					vendorMatch = couldMatchVendorRedactPatterns(next);
				}
				if (!vendorMatch) {
					if (pattern instanceof RegExp) pattern.lastIndex = 0;
					continue;
				}
			}
			next = pattern instanceof RegExp && !options?.fullContext && !builtInResolvedPatterns.has(pattern) && !chunkUnsafePatterns.has(pattern) ? replacePatternBounded(next, pattern, replaceRegex) : replaceRedactPattern(next, pattern, replace, replaceRegex);
		}
		outcome = "ok";
		return next;
	} finally {
		finishMeasurement?.(outcome, text.length, patterns.length);
	}
}
function looksLikeAppSpecificPassword(candidate) {
	return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
	if (!text.includes("-")) return text;
	return text.replace(APP_SPECIFIC_PASSWORD_RE, (match, token) => looksLikeAppSpecificPassword(token) ? maskToken(token) : match);
}
function resolveConfigRedaction() {
	const cfg = readLoggingConfig();
	return {
		mode: DEFAULT_REDACT_MODE,
		patterns: cfg?.redactPatterns
	};
}
function resolveRedactOptions(options) {
	const resolved = options ?? resolveConfigRedaction();
	const mode = normalizeMode(resolved.mode);
	return {
		mode,
		patterns: mode === "off" ? [] : resolvePatterns(resolved.patterns)
	};
}
function redactSensitiveText(text, options) {
	if (!text) return text;
	return redactSensitiveTextWithOptions(redactRegisteredSecretValues(text, maskToken), options ?? resolveConfigRedaction());
}
function redactSensitiveTextWithOptions(exactRedacted, resolvedOptions) {
	if (normalizeMode(resolvedOptions.mode) === "off") return exactRedacted;
	if (usesBuiltInRedactPatterns(resolvedOptions.patterns) && !couldMatchDefaultRedactPatterns(exactRedacted)) return exactRedacted;
	return redactText(exactRedacted, resolveRedactOptions(resolvedOptions).patterns);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	return {
		mode: "tools",
		patterns: userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0
	};
}
function redactToolPayloadText(text) {
	return redactToolPayloadTextWithConfig(text, readLoggingConfig());
}
function redactToolPayloadTextWithPolicy(text, loggingConfig, options) {
	if (!text) return text;
	if (!isFullContextToolPayloadRedaction(loggingConfig)) return redactSensitiveText(text, options);
	const resolved = resolveRedactOptions(options);
	return redactText(redactRegisteredSecretValues(text, maskToken), resolved.patterns, { fullContext: true });
}
function redactToolPayloadTextWithConfig(text, loggingConfig) {
	return redactToolPayloadTextWithPolicy(text, loggingConfig, resolveToolPayloadRedaction(loggingConfig));
}
function isSensitiveFieldKey(key) {
	return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function isPublicShareIdPath(path) {
	if (path.at(-1)?.toLowerCase() !== "id") return false;
	return path.at(-2)?.toLowerCase().replaceAll("-", "").replaceAll("_", "") === "publicshare";
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key], objectPath = true, couldMatch = couldMatchDefaultRedactPatterns) {
	const exactRedacted = redactRegisteredSecretValues(value, maskToken);
	if (isPublicShareIdPath(path)) return maskToken(exactRedacted);
	const fieldOptions = isSensitiveFieldKey(key) && options.sensitiveFieldPatterns ? {
		...options,
		patterns: options.sensitiveFieldPatterns
	} : options;
	const resolved = resolveRedactOptions(fieldOptions);
	if (resolved.mode === "off") return exactRedacted;
	const redacted = !usesBuiltInRedactPatterns(fieldOptions.patterns) || couldMatch(exactRedacted) ? redactText(exactRedacted, resolved.patterns) : exactRedacted;
	if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		const appRedacted = redactAppSpecificPasswords(redacted);
		if (appRedacted !== value) return appRedacted;
	}
	if (redacted !== value) return redacted;
	return shouldRedactStructuredStringField(key, exactRedacted, path, objectPath) ? maskToken(exactRedacted) : exactRedacted;
}
function shouldRedactStructuredPrimitiveField(key, path) {
	const normalizedKey = key.toLowerCase();
	return isPublicShareIdPath(path) || shouldRedactStructuredAuthorizationCode(normalizedKey, path) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, couldMatch, path = key ? [key] : [], objectPath = true) {
	if (typeof value === "string") return redactSensitiveFieldValueWithOptions(key, value, options, path, objectPath, couldMatch);
	if (value === null || value === void 0) return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, couldMatch, path, false));
		seen.delete(value);
		return out;
	}
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		if (!isPlainRedactableObject(value)) return value;
		seen.add(value);
		const entries = Object.entries(value);
		for (const entry of entries) {
			const [name, child] = entry;
			entry[1] = redactStructuredSecretValue(name, child, seen, options, couldMatch, [...path, name], objectPath);
		}
		seen.delete(value);
		return Object.fromEntries(entries);
	}
	return value;
}
function redactSecretsWithOptions(value, options) {
	if (typeof value === "string") return redactSensitiveText(value, options);
	if (value === null || typeof value !== "object") return value;
	return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options, createRedactPrefilter(couldMatchDefaultRedactPatterns));
}
function redactSecrets(value) {
	return redactSecretsWithOptions(value, resolveToolPayloadRedaction());
}
function preservesStructuredReference(key, value) {
	return key.toLowerCase() === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(value) || isShellReferenceToKey(key, value);
}
function shouldRedactStructuredStringField(key, value, path, objectPath) {
	return shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path, objectPath ? value : void 0) || isSensitiveFieldKey(key) && !preservesStructuredReference(key, value);
}
function classifyLogFieldProtection(key, path, objectPath, value) {
	return (value === void 0 ? shouldRedactStructuredPrimitiveField(key, path) : isPublicShareIdPath(path) || shouldRedactStructuredStringField(key, value, path, objectPath)) ? "legacy" : CREDENTIAL_HEADER_FIELD_RE.test(key) ? "header" : void 0;
}
function getFieldRecordEdits(field, mode) {
	const { key, value, path, objectPath } = field;
	if (mode === "off" || !field.string && value === "null" || !classifyLogFieldProtection(key, path, objectPath, field.string ? value : void 0)) return [];
	return [{
		start: 0,
		end: value.length,
		replacement: maskSecretFieldValue(key, value)
	}];
}
function getTextRecordEdits(field, mode, fileFields) {
	const { value } = field;
	if (field.isKey || fileFields && !field.origin.structured) return [];
	if (fileFields && field.origin.primitiveMask) return [{
		start: 0,
		end: value.length,
		replacement: "***"
	}];
	if (!field.string) return [];
	const edits = [];
	const registered = redactRegisteredSecretValues(value, (secret, start) => {
		const replacement = maskToken(secret);
		edits.push({
			start,
			end: start + secret.length,
			replacement
		});
		return replacement;
	});
	if (fileFields && isPublicShareIdPath(field.path)) return [{
		start: 0,
		end: value.length,
		replacement: maskToken(registered)
	}];
	if (mode === "off") return edits;
	let combined = edits;
	const receive = (added) => {
		combined = composeRedactionEdits(value.length, combined, added);
	};
	const headers = findStructuredAuthParamRanges(registered).map(({ start, end }) => ({
		start,
		end,
		replacement: "***"
	}));
	receive(headers);
	redactFormBody(redactAssignmentValues(applyRedactionEdits(registered, headers), "url", receive), receive);
	return combined;
}
function getLegacyFieldRecordEdits(field, value, beforeConversion = false) {
	const { key, value: original, path, objectPath } = field;
	if (field.isKey || !field.origin.structured || !field.string) return [];
	if (isPublicShareIdPath(path)) return [];
	const edits = [];
	if (value !== original || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		for (const match of value.matchAll(APP_SPECIFIC_PASSWORD_RE)) if (looksLikeAppSpecificPassword(match[0])) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: maskToken(match[0])
		});
	}
	if (edits.length > 0 || value !== original) return edits;
	const protection = classifyLogFieldProtection(key, path, objectPath, value);
	return protection === "legacy" || beforeConversion && protection === "header" ? [{
		start: 0,
		end: value.length,
		replacement: maskToken(value)
	}] : [];
}
function resolveFileLogRedactOptions() {
	return resolveRedactOptions(resolveToolPayloadRedaction());
}
function* redactionEditMatches(input, edits) {
	for (const edit of edits) yield {
		match: input.slice(edit.start, edit.end),
		groups: [],
		input,
		offset: edit.start,
		replacement: edit.replacement
	};
}
const preparationPatterns = [
	{
		source: "registered secret values",
		*exec(input) {
			const matches = [];
			redactRegisteredSecretValues(input, (secret, offset) => {
				matches.push({
					match: secret,
					groups: [],
					input,
					offset,
					replacement: maskToken(secret)
				});
				return secret;
			});
			yield* matches;
		}
	},
	{
		source: "structured authorization parameters",
		*exec(input) {
			for (const { start, end } of findStructuredAuthParamRanges(input)) yield {
				match: input.slice(start, end),
				groups: [],
				input,
				offset: start,
				replacement: "***"
			};
		}
	},
	{
		source: "URL query assignments",
		*exec(input) {
			const edits = [];
			redactAssignmentValues(input, "url", (added) => edits.push(...added));
			yield* redactionEditMatches(input, edits);
		}
	},
	{
		source: "form bodies",
		*exec(input) {
			let edits = [];
			redactFormBody(input, (added) => {
				edits = composeRedactionEdits(input.length, edits, added);
			});
			yield* redactionEditMatches(input, edits);
		}
	}
];
const CONSOLE_STRUCTURAL_FIELDS = /* @__PURE__ */ new Set(["time", "level"]);
function prepareFileToJsonReceivers(record, patterns) {
	const decoded = /* @__PURE__ */ new WeakSet();
	const active = /* @__PURE__ */ new WeakSet();
	const visit = (value, key, path, objectPath, decode) => {
		if (typeof value === "string" && decode) {
			const field = {
				key,
				path,
				objectPath,
				value,
				isKey: false,
				string: true,
				origin: {
					structured: true,
					primitiveMask: false
				}
			};
			let current = applyRedactionEdits(value, getTextRecordEdits(field, "tools", true));
			if (!isPublicShareIdPath(path)) for (const pattern of patterns) current = applyRedactionEdits(current, getPatternRedactionEdits(current, pattern, prepareRedactionCapture));
			return applyRedactionEdits(current, getLegacyFieldRecordEdits(field, current, true));
		}
		if (value === null || typeof value !== "object") return decode && [
			"number",
			"boolean",
			"bigint"
		].includes(typeof value) && classifyLogFieldProtection(key, path, objectPath, void 0) ? "***" : value;
		if (!Array.isArray(value) && !isPlainRedactableObject(value)) return value;
		if (active.has(value)) return "[Circular]";
		active.add(value);
		let clone;
		let decodeFields = decode;
		if (Array.isArray(value)) clone = value.map((entry) => visit(entry, key, path, false, decodeFields));
		else {
			const entries = Object.entries(value);
			decodeFields ||= entries.some(([name, entry]) => name === "toJSON" && typeof entry === "function");
			clone = Object.fromEntries(entries.map(([name, entry]) => [name, visit(entry, name, [...path, name], objectPath, decodeFields)]));
		}
		if (decodeFields) decoded.add(clone);
		active.delete(value);
		return clone;
	};
	return {
		record: visit(record, "", [], true, false),
		decoded
	};
}
/** Converts native values once and applies configured and structural protection before output. */
function redactLogRecord(record, options, finish) {
	const finishMeasurement = startRedactionMeasurement("log-record");
	let outcome = "error";
	let inputChars;
	try {
		const resolved = resolveRedactOptions();
		const prepared = options.format === "console" ? {
			record,
			decoded: /* @__PURE__ */ new WeakSet()
		} : prepareFileToJsonReceivers(record, options.decodedOptions?.patterns ?? resolved.patterns);
		const ordinary = {
			structured: true,
			primitiveMask: false
		};
		const origins = {
			value: ordinary,
			children: /* @__PURE__ */ new Map()
		};
		const ancestors = [];
		const json = JSON.stringify(prepared.record, function(key, value) {
			while (ancestors.length > 0 && ancestors.at(-1)?.value !== this) ancestors.pop();
			const parent = ancestors.at(-1);
			const array = Array.isArray(this);
			const fieldKey = array && parent ? parent.key : key;
			const path = array && parent ? parent.path : parent ? [...parent.path, key] : [];
			const source = !parent ? prepared.record : parent.structured && options.format !== "console" ? Reflect.get(this, key) : value;
			const structured = (parent?.structured ?? true) && (source === null || typeof source !== "object" || !prepared.decoded.has(source) && source === value && (Array.isArray(source) || isPlainRedactableObject(source)));
			const primitiveMask = structured && [
				"number",
				"boolean",
				"bigint"
			].includes(typeof source) && classifyLogFieldProtection(fieldKey, path, !array, void 0) === "legacy";
			const circular = value !== null && typeof value === "object" && ancestors.some((frame) => frame.value === value);
			const emitted = circular ? "[Circular]" : typeof value === "bigint" ? String(value) : value;
			const container = emitted !== null && typeof emitted === "object";
			let node = origins;
			if (parent && parent.structured && (container || !structured || primitiveMask || circular)) {
				node = {
					value: {
						structured: structured && !circular,
						primitiveMask
					},
					children: /* @__PURE__ */ new Map()
				};
				parent.origins.children.set(key, node);
			} else if (parent) node = parent.origins;
			else origins.value = {
				structured,
				primitiveMask
			};
			if (container) ancestors.push({
				value: emitted,
				path,
				key: fieldKey,
				origins: node,
				structured
			});
			return emitted;
		});
		inputChars = json.length;
		let materialized = JSON.parse(json);
		const message = options.deriveMessage?.(materialized);
		if (message) {
			origins.children.set("message", {
				value: ordinary,
				children: /* @__PURE__ */ new Map()
			});
			if (Object.hasOwn(materialized, "message")) materialized.message = message.text;
			else {
				const entries = Object.entries(materialized);
				entries.splice(entries.findIndex(([key]) => key === "hostname") + 1, 0, ["message", message.text]);
				materialized = Object.fromEntries(entries);
			}
		}
		const serialized = message ? JSON.stringify(materialized) : json;
		const decodedPatterns = options.decodedOptions?.patterns ?? resolved.patterns;
		const couldMatch = createRedactPrefilter(couldMatchDefaultFullContextPatterns);
		const result = finish(redactJsonRecord(serialized, origins, [[{ patterns: decodedPatterns }], [{ patterns: preparationPatterns }, {
			patterns: resolved.patterns,
			...resolved.patterns === defaultResolvedPatterns ? { couldMatch } : {}
		}]], prepareRedactionCapture, options.format === "console" ? () => [] : getLegacyFieldRecordEdits, (field) => getFieldRecordEdits(field, resolved.mode), (field) => getTextRecordEdits(field, resolved.mode, options.format !== "console"), (field, currentValue) => (options.format === "console" ? field.path.length === 1 && CONSOLE_STRUCTURAL_FIELDS.has(field.key) : !field.origin.structured || field.origin.primitiveMask || isPublicShareIdPath(field.path)) || decodedPatterns === defaultResolvedPatterns && !couldMatch(currentValue), message), message ? serialized : void 0);
		outcome = "ok";
		return result;
	} finally {
		finishMeasurement?.(outcome, inputChars);
	}
}
function redactLogRecordForTransport(record, options = {}) {
	return redactLogRecord(record, options, (redacted) => JSON.parse(redacted));
}
function serializeRedactedFileLogRecord(record, options = {}) {
	return redactLogRecord(record, options, (redacted, canonical) => redacted === canonical ? redacted : JSON.stringify(JSON.parse(redacted)));
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
function isLogLevelEnabled(level, minimum) {
	return level !== "silent" && minimum !== "silent" && levelToMinLevel(level) >= levelToMinLevel(minimum);
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
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${redactToolPayloadText(trimmed)}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
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
	try {
		return process.getBuiltinModule?.("fs") !== void 0;
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
//#region src/logging/logger.ts
const DEFAULT_LOG_FILE = `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
const MAX_LOG_AGE_MS = 864e5;
const DEFAULT_MAX_LOG_FILE_BYTES = 104857600;
let cachedHostname = null;
const MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8192;
const MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4096;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2048;
const MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
const MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
const DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
function clampLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampLogText(redactSensitiveText(clampLogText(value, maxChars)), maxChars);
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
	let attribute;
	if (typeof value === "string") attribute = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
	else if (typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) attribute = value;
	else return;
	attributes[normalizedKey] = attribute;
	state.count += 1;
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
	if (!isRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	const candidate = asOptionalRecord(value);
	if (!candidate || !isValidDiagnosticTraceId(candidate.traceId)) return;
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
	return normalizeTraceContext(value) ?? normalizeTraceContext(asOptionalRecord(value)?.trace);
}
function getSortedNumericLogEntries(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0]));
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) return String(value);
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
	if (cachedHostname) return cachedHostname;
	const hostname = os.hostname().trim();
	if (!hostname) return "unknown";
	cachedHostname = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	return isRecord(meta) ? {
		...meta,
		hostname
	} : meta;
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (isRecord(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function resolveLogTraceContext(bindings, numericArgs) {
	for (const value of [bindings, ...numericArgs]) {
		const trace = extractTraceContext(value);
		if (trace) return {
			trace,
			trustedTraceContext: false
		};
	}
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
	return isLogLevelEnabled(level, getRuntimeSettings().level);
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
resolveGlobalSingleton(Symbol.for("openclaw.signalExitOwner"), () => ({}));
resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
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
	return settings;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeOptionalString(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
`${process.release.name}${process.pid}`;
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
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
({ ...createRuntimeIo() });
(() => {
	try {
		const inspect = process.getBuiltinModule?.("util").inspect;
		return typeof inspect === "function" ? inspect : null;
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
const SUBSYSTEM_PREFIXES_TO_DROP = /* @__PURE__ */ new Set([
	"gateway",
	"channels",
	"providers"
]);
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
	while (parts[0] !== void 0 && SUBSYSTEM_PREFIXES_TO_DROP.has(parts[0])) parts.shift();
	const first = parts.at(0);
	if (first === void 0) return original;
	if (CHANNEL_SUBSYSTEM_PREFIXES.has(normalizeLowercaseStringOrEmpty(first))) return first;
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
	const resolvedSubsystem = normalizeOptionalString(subsystem) ?? "unknown";
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
		const consoleEnabled = isLogLevelEnabled(level, consoleSettings.level) && shouldLogSubsystemToConsole(resolvedSubsystem);
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
			const isConsoleEnabled = isLogLevelEnabled(level, getConsoleSettings().level) && shouldLogSubsystemToConsole(resolvedSubsystem);
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
			if (isLogLevelEnabled("info", consoleSettings.level) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
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
export { truncateUtf16Safe as n, createSubsystemLogger as t };
