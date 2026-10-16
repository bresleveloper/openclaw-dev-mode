import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { g as onInternalDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
//#region src/logging/diagnostic-stability-query.ts
const DEFAULT_DIAGNOSTIC_STABILITY_CAPACITY = 1e3;
const DEFAULT_DIAGNOSTIC_STABILITY_LIMIT = 50;
const MAX_DIAGNOSTIC_STABILITY_LIMIT = DEFAULT_DIAGNOSTIC_STABILITY_CAPACITY;
function parseOptionalNonNegativeInteger(value, field) {
	if (value === void 0 || value === null || value === "") return;
	if (typeof value === "string") {
		if (!/^\d+$/.test(value)) throw new Error(`${field} must be a non-negative integer`);
	}
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0) throw new Error(`${field} must be a non-negative integer`);
	return parsed;
}
function parseOptionalType(value) {
	if (value === void 0 || value === null || value === "") return;
	if (typeof value !== "string" || value.trim() === "") throw new Error("type must be a non-empty string");
	return value.trim();
}
function normalizeLimit(limit, defaultLimit = DEFAULT_DIAGNOSTIC_STABILITY_LIMIT) {
	const parsed = parseOptionalNonNegativeInteger(limit, "limit");
	if (parsed === void 0) return defaultLimit;
	if (parsed < 1 || parsed > 1e3) throw new Error(`limit must be between 1 and ${MAX_DIAGNOSTIC_STABILITY_LIMIT}`);
	return parsed;
}
/** Normalizes user-facing snapshot query options. */
function normalizeDiagnosticStabilityQuery(input = {}, options) {
	return {
		limit: normalizeLimit(input.limit, options?.defaultLimit),
		type: parseOptionalType(input.type),
		sinceSeq: parseOptionalNonNegativeInteger(input.sinceSeq, "sinceSeq")
	};
}
//#endregion
//#region src/logging/diagnostic-stability.ts
const MAX_DIAGNOSTIC_EXPORTER_STATES = 16;
const LIVENESS_EVENT_LOOP_DELAY_WARN_MS = 1e3;
const SAFE_REASON_CODE = /^[A-Za-z0-9_.:-]{1,120}$/u;
const SAFE_EXPORTER_CODE = /^[A-Za-z0-9_-]{1,120}$/u;
function createState(capacity = DEFAULT_DIAGNOSTIC_STABILITY_CAPACITY) {
	return {
		records: Array.from({ length: capacity }),
		capacity,
		nextIndex: 0,
		count: 0,
		dropped: 0,
		exporterSeq: 0,
		exporterRecords: /* @__PURE__ */ new Map(),
		exporterDropped: 0,
		unsubscribe: null
	};
}
function getDiagnosticStabilityState() {
	const globalStore = globalThis;
	globalStore["__openclawDiagnosticStabilityState"] ??= createState();
	return globalStore["__openclawDiagnosticStabilityState"];
}
function copyReasonCode(reason) {
	if (typeof reason !== "string" || !SAFE_REASON_CODE.test(reason)) return;
	return reason;
}
function copyExporterCode(value) {
	return typeof value === "string" && SAFE_EXPORTER_CODE.test(value) ? value : void 0;
}
function isDiagnosticExporterSignal(value) {
	return value === "traces" || value === "metrics" || value === "logs";
}
function isDiagnosticExporterStatus(value) {
	return value === "started" || value === "failure" || value === "recovered" || value === "dropped";
}
function assignReasonCode(record, reason) {
	const reasonCode = copyReasonCode(reason);
	if (reasonCode) record.reason = reasonCode;
}
function resolveDiagnosticLivenessRecordLevel(event) {
	const hasBlockingWork = event.waiting > 0 || event.queued > 0;
	const hasSustainedEventLoopDelay = (event.eventLoopDelayP99Ms ?? 0) >= LIVENESS_EVENT_LOOP_DELAY_WARN_MS;
	return event.degradedSinceMs !== void 0 || hasBlockingWork || event.active > 0 && hasSustainedEventLoopDelay ? "warning" : "info";
}
function sanitizeDiagnosticEvent(event) {
	const record = {
		seq: event.seq,
		ts: event.ts,
		type: event.type
	};
	const copy = (source, ...keys) => {
		for (const key of keys) record[key] = source[key];
	};
	switch (event.type) {
		case "agent.commentary": break;
		case "gateway.rpc":
		case "gateway.event_loop.sample":
		case "diagnostic.gc":
		case "diagnostic.child_process.spawn":
		case "log.record":
		case "telemetry.exporter": break;
		case "model.usage":
			copy(event, "channel", "provider", "model");
			record.usage = { ...event.usage };
			record.context = event.context ? { ...event.context } : void 0;
			copy(event, "costUsd", "durationMs");
			break;
		case "webhook.received":
		case "webhook.error":
			record.channel = event.channel;
			break;
		case "webhook.processed":
			copy(event, "channel", "durationMs");
			break;
		case "message.queued":
			copy(event, "channel", "source", "queueDepth");
			break;
		case "message.received":
		case "message.dispatch.started":
			copy(event, "channel", "source");
			break;
		case "message.dispatch.completed":
			copy(event, "channel", "source", "durationMs", "outcome");
			assignReasonCode(record, event.reason);
			break;
		case "message.processed":
			copy(event, "channel", "durationMs", "outcome");
			assignReasonCode(record, event.reason);
			break;
		case "message.delivery.started":
		case "message.delivery.completed":
		case "message.delivery.error":
			copy(event, "channel", "deliveryKind");
			if (event.type !== "message.delivery.started") {
				record.durationMs = event.durationMs;
				if (event.type === "message.delivery.completed") {
					record.resultCount = event.resultCount;
					record.outcome = "completed";
				} else {
					record.outcome = "error";
					assignReasonCode(record, event.errorCategory);
				}
			}
			break;
		case "talk.event":
			copy(event, "talkEventType", "mode", "transport", "brain", "provider", "final", "durationMs");
			record.bytes = event.byteLength;
			break;
		case "session.state":
			record.outcome = event.state;
			assignReasonCode(record, event.reason);
			record.queueDepth = event.queueDepth;
			break;
		case "session.long_running":
		case "session.stalled":
		case "session.stuck":
			record.outcome = event.state;
			if (event.type === "session.stuck") record.level = "warning";
			assignReasonCode(record, event.reason);
			copy(event, "ageMs", "queueDepth");
			if (event.activeWorkKind) record.activeWorkKind = event.activeWorkKind;
			if (event.activeToolName) record.toolName = event.activeToolName;
			break;
		case "session.recovery.requested":
			record.outcome = event.state;
			record.action = event.allowActiveAbort ? "abort" : "recover";
			copy(event, "ageMs", "queueDepth");
			if (event.activeWorkKind) record.activeWorkKind = event.activeWorkKind;
			assignReasonCode(record, event.reason);
			break;
		case "session.recovery.completed":
			record.outcome = event.status;
			copy(event, "action", "ageMs", "queueDepth");
			record.count = event.released;
			if (event.activeWorkKind) record.activeWorkKind = event.activeWorkKind;
			assignReasonCode(record, event.outcomeReason ?? event.reason);
			break;
		case "session.turn.created":
			record.source = event.agentId;
			record.channel = event.channel;
			record.outcome = event.trigger;
			break;
		case "queue.lane.enqueue":
		case "queue.lane.dequeue":
			record.source = event.lane;
			record.queueSize = event.queueSize;
			if (event.type === "queue.lane.dequeue") record.waitMs = event.waitMs;
			break;
		case "run.attempt":
			record.count = event.attempt;
			break;
		case "run.progress":
			assignReasonCode(record, event.reason);
			break;
		case "run.execution_phase":
			copy(event, "phase", "provider", "model");
			record.toolName = event.tool;
			break;
		case "context.assembled":
			copy(event, "channel", "provider", "model");
			record.count = event.messageCount;
			record.bytes = event.promptChars;
			record.context = event.contextTokenBudget !== void 0 ? { limit: event.contextTokenBudget } : void 0;
			break;
		case "diagnostic.heartbeat":
			record.webhooks = { ...event.webhooks };
			copy(event, "active", "waiting", "queued");
			break;
		case "diagnostic.liveness.warning":
			record.level = resolveDiagnosticLivenessRecordLevel(event);
			record.durationMs = event.degradedSinceMs ?? event.intervalMs;
			record.count = event.reasons.length;
			assignReasonCode(record, event.reasons[0]);
			copy(event, "eventLoopDelayP99Ms", "eventLoopDelayMaxMs", "eventLoopUtilization", "cpuCoreRatio", "active", "waiting", "queued", "phase");
			if (event.activeWorkLabels?.length) record.source = event.activeWorkLabels[0];
			else if (event.queuedWorkLabels?.length) record.source = event.queuedWorkLabels[0];
			break;
		case "diagnostic.phase.completed":
			record.phase = event.name;
			copy(event, "durationMs", "cpuCoreRatio");
			break;
		case "tool.loop":
			copy(event, "toolName", "level", "action", "detector", "count", "pairedToolName");
			break;
		case "tool.execution.started":
		case "tool.execution.completed":
		case "tool.execution.error":
		case "tool.execution.blocked":
			record.toolName = event.toolName;
			record.source = event.toolSource;
			record.pluginId = event.toolOwner;
			if (event.type === "tool.execution.completed" || event.type === "tool.execution.error") record.durationMs = event.durationMs;
			if (event.type === "tool.execution.error") {
				if (event.terminalReason) record.outcome = event.terminalReason;
				assignReasonCode(record, event.errorCategory);
			} else if (event.type === "tool.execution.blocked") {
				record.outcome = "blocked";
				assignReasonCode(record, event.deniedReason);
			}
			break;
		case "skill.used":
			record.toolName = event.toolName;
			record.source = event.skillSource;
			record.action = event.activation;
			record.target = event.skillName;
			break;
		case "exec.process.completed":
			copy(event, "target", "mode", "outcome", "durationMs", "commandLength", "exitCode", "timedOut", "failureKind");
			assignReasonCode(record, event.failureKind);
			break;
		case "exec.approval.followup_suppressed":
			copy(event, "approvalId", "phase");
			assignReasonCode(record, event.reason);
			break;
		case "run.started":
		case "run.completed":
			copy(event, "provider", "model", "channel");
			if (event.type === "run.completed") {
				copy(event, "durationMs", "outcome");
				assignReasonCode(record, event.errorCategory);
			}
			break;
		case "harness.run.started":
		case "harness.run.completed":
		case "harness.run.error":
			record.source = event.harnessId;
			copy(event, "pluginId", "provider", "model", "channel");
			if (event.type !== "harness.run.started") {
				record.durationMs = event.durationMs;
				if (event.type === "harness.run.completed") {
					record.outcome = event.outcome;
					record.count = event.itemLifecycle?.completedCount;
				} else {
					record.outcome = "error";
					record.action = event.phase;
					assignReasonCode(record, event.errorCategory);
				}
			}
			break;
		case "model.call.started":
		case "model.call.completed":
		case "model.call.error":
			copy(event, "provider", "model");
			if (event.type !== "model.call.started") {
				record.durationMs = event.durationMs;
				record.requestBytes = event.requestPayloadBytes;
				record.responseBytes = event.responseStreamBytes;
				record.timeToFirstByteMs = event.timeToFirstByteMs;
				if (event.type === "model.call.error") {
					record.failureKind = event.failureKind;
					record.memory = event.memory ? { ...event.memory } : void 0;
					assignReasonCode(record, event.errorCategory);
				}
			}
			break;
		case "security.event":
			record.source = event.category;
			copy(event, "action", "outcome");
			record.level = event.severity;
			record.target = event.target?.name ?? event.target?.kind;
			assignReasonCode(record, event.reason ?? event.policy?.reason);
			break;
		case "diagnostic.memory.sample":
			record.memory = { ...event.memory };
			break;
		case "diagnostic.memory.pressure":
			record.level = event.level;
			assignReasonCode(record, event.reason);
			record.memory = { ...event.memory };
			copy(event, "thresholdBytes", "rssGrowthBytes", "windowMs");
			break;
		case "payload.large":
			copy(event, "surface", "action", "bytes", "limitBytes", "count", "channel", "pluginId");
			assignReasonCode(record, event.reason);
			break;
		case "diagnostic.async_queue.dropped":
			copy(event, "droppedEvents", "droppedTrustedEvents", "droppedUntrustedEvents", "droppedPriorityEvents", "queueLength", "maxQueueLength", "drainBatchSize");
			break;
		case "model.failover":
			record.provider = event.fromProvider;
			record.model = event.fromModel;
			assignReasonCode(record, event.reason);
	}
	return record;
}
function appendRecord(record) {
	const state = getDiagnosticStabilityState();
	state.records[state.nextIndex] = record;
	state.nextIndex = (state.nextIndex + 1) % state.capacity;
	if (state.count < state.capacity) {
		state.count += 1;
		return;
	}
	state.dropped += 1;
}
function upsertExporterRecord(record) {
	if (!record.source) return;
	const state = getDiagnosticStabilityState();
	const key = `${record.source}\u0000${record.target ?? "unknown"}\u0000${record.transport ?? "unknown"}`;
	if (record.outcome === "dropped") {
		state.exporterRecords.delete(key);
		return;
	}
	const previous = state.exporterRecords.get(key);
	if (!record.mode && previous?.mode) record.mode = previous.mode;
	if (!state.exporterRecords.has(key) && state.exporterRecords.size >= MAX_DIAGNOSTIC_EXPORTER_STATES) {
		const oldestKey = state.exporterRecords.keys().next().value;
		if (oldestKey !== void 0) {
			state.exporterRecords.delete(oldestKey);
			state.exporterDropped += 1;
		}
	}
	state.exporterRecords.delete(key);
	state.exporterRecords.set(key, record);
}
/** Records a trusted diagnostics-exporter health transition outside the public event contract. */
function recordDiagnosticExporterHealth(exporter, update) {
	const source = copyExporterCode(exporter);
	if (!source || !isDiagnosticExporterSignal(update.signal) || !isDiagnosticExporterStatus(update.status)) return;
	const state = getDiagnosticStabilityState();
	state.exporterSeq += 1;
	const record = {
		seq: state.exporterSeq,
		ts: Date.now(),
		type: "telemetry.exporter",
		source,
		target: update.signal,
		outcome: update.status
	};
	const transport = copyExporterCode(update.transport);
	if (transport) record.transport = transport;
	if (update.endpointMode === "configured" || update.endpointMode === "default_endpoint") record.mode = update.endpointMode;
	const errorCategory = copyReasonCode(update.errorCategory);
	if (errorCategory) record.errorCategory = errorCategory;
	assignReasonCode(record, update.reason ?? update.errorCategory);
	upsertExporterRecord(record);
}
function listRecords() {
	const state = getDiagnosticStabilityState();
	const records = [];
	const start = state.count < state.capacity ? 0 : state.nextIndex;
	for (let offset = 0; offset < state.count; offset += 1) {
		const record = state.records[(start + offset) % state.capacity];
		if (record !== void 0) records.push(record);
	}
	return records;
}
function listExporterRecords() {
	return [...getDiagnosticStabilityState().exporterRecords.values()].toSorted((left, right) => left.seq - right.seq);
}
function summarizeRecords(records) {
	const byType = {};
	let latestMemory;
	let maxRssBytes;
	let maxHeapUsedBytes;
	let pressureCount = 0;
	const payloadLarge = {
		count: 0,
		rejected: 0,
		truncated: 0,
		chunked: 0,
		bySurface: {}
	};
	for (const record of records) {
		byType[record.type] = (byType[record.type] ?? 0) + 1;
		if (record.memory) {
			latestMemory = record.memory;
			maxRssBytes = maxRssBytes === void 0 ? record.memory.rssBytes : Math.max(maxRssBytes, record.memory.rssBytes);
			maxHeapUsedBytes = maxHeapUsedBytes === void 0 ? record.memory.heapUsedBytes : Math.max(maxHeapUsedBytes, record.memory.heapUsedBytes);
		}
		if (record.type === "diagnostic.memory.pressure") pressureCount += 1;
		if (record.type === "payload.large") {
			payloadLarge.count += 1;
			if (record.action === "rejected") payloadLarge.rejected += 1;
			else if (record.action === "truncated") payloadLarge.truncated += 1;
			else if (record.action === "chunked") payloadLarge.chunked += 1;
			const surface = record.surface ?? "unknown";
			payloadLarge.bySurface[surface] = (payloadLarge.bySurface[surface] ?? 0) + 1;
		}
	}
	return {
		byType,
		...latestMemory || pressureCount > 0 ? { memory: {
			latest: latestMemory,
			maxRssBytes,
			maxHeapUsedBytes,
			pressureCount
		} } : {},
		...payloadLarge.count > 0 ? { payloadLarge } : {}
	};
}
function selectRecords(records, options) {
	const { limit, type, sinceSeq } = normalizeDiagnosticStabilityQuery(options);
	const filtered = records.filter((record) => {
		if (type && record.type !== type) return false;
		if (sinceSeq !== void 0 && record.seq <= sinceSeq) return false;
		return true;
	});
	return {
		filtered,
		events: filtered.slice(Math.max(0, filtered.length - limit))
	};
}
function startDiagnosticStabilityRecorder() {
	const state = getDiagnosticStabilityState();
	if (state.unsubscribe) return;
	state.unsubscribe = onInternalDiagnosticEvent((event) => {
		appendRecord(sanitizeDiagnosticEvent(event));
	}, {
		includeTrusted: [
			"model.call.started",
			"model.call.completed",
			"model.call.error"
		],
		exclude: [
			"log.record",
			"telemetry.exporter",
			"gateway.rpc",
			"gateway.event_loop.sample",
			"diagnostic.gc",
			"diagnostic.child_process.spawn"
		]
	});
}
function stopDiagnosticStabilityRecorder() {
	const state = getDiagnosticStabilityState();
	state.unsubscribe?.();
	state.unsubscribe = null;
}
function getDiagnosticStabilitySnapshot(options) {
	const state = getDiagnosticStabilityState();
	const exporterQuery = options?.type === "telemetry.exporter";
	const { filtered, events } = selectRecords(exporterQuery ? listExporterRecords() : listRecords(), options);
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		capacity: exporterQuery ? MAX_DIAGNOSTIC_EXPORTER_STATES : state.capacity,
		count: filtered.length,
		dropped: exporterQuery ? state.exporterDropped : state.dropped,
		firstSeq: filtered[0]?.seq,
		lastSeq: filtered.at(-1)?.seq,
		events,
		summary: summarizeRecords(filtered)
	};
}
/** Applies filtering/limits to an existing snapshot without mutating its source records. */
function selectDiagnosticStabilitySnapshot(snapshot, options) {
	const { filtered, events } = selectRecords(snapshot.events, options);
	return {
		...snapshot,
		count: filtered.length,
		firstSeq: filtered[0]?.seq,
		lastSeq: filtered.at(-1)?.seq,
		events,
		summary: summarizeRecords(filtered)
	};
}
function resetDiagnosticStabilityRecorderForTest() {
	const state = getDiagnosticStabilityState();
	state.unsubscribe?.();
	const next = createState(state.capacity);
	const globalStore = globalThis;
	globalStore["__openclawDiagnosticStabilityState"] = next;
}
//#endregion
export { startDiagnosticStabilityRecorder as a, normalizeDiagnosticStabilityQuery as c, selectDiagnosticStabilitySnapshot as i, recordDiagnosticExporterHealth as n, stopDiagnosticStabilityRecorder as o, resetDiagnosticStabilityRecorderForTest as r, MAX_DIAGNOSTIC_STABILITY_LIMIT as s, getDiagnosticStabilitySnapshot as t };
