import { isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, redactSensitiveText } from "../api.js";
import { ROOT_CONTEXT, SpanKind, SpanStatusCode, TraceFlags, context, createContextKey, createNoopMeter, diag, isSpanContextValid, metrics, propagation, trace } from "@opentelemetry/api";
import * as otelCore from "@opentelemetry/core";
import { CompositePropagator, ExportResultCode, W3CBaggagePropagator, W3CTraceContextPropagator, getStringListFromEnv } from "@opentelemetry/core";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import * as resources from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BasicTracerProvider, BatchSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { registerUnhandledRejectionHandler } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { isInternalDiagnosticEventMetadata, normalizeDiagnosticLane, normalizeDiagnosticValue } from "openclaw/plugin-sdk/diagnostic-runtime";
import { readFileSync } from "node:fs";
import nodePath from "node:path";
import { collectErrorGraphCandidates } from "openclaw/plugin-sdk/error-runtime";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { ATTR_GEN_AI_INPUT_MESSAGES, ATTR_GEN_AI_OUTPUT_MESSAGES, ATTR_GEN_AI_SYSTEM_INSTRUCTIONS, ATTR_GEN_AI_TOOL_CALL_ARGUMENTS, ATTR_GEN_AI_TOOL_CALL_ID, ATTR_GEN_AI_TOOL_CALL_RESULT, ATTR_GEN_AI_TOOL_DEFINITIONS, GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL, GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT } from "@opentelemetry/semantic-conventions/incubating";
import { asFiniteNumber, asFiniteNumberInRange, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
const DROPPED_OTEL_ATTRIBUTE_KEYS = /* @__PURE__ */ new Set([
	"openclaw.callId",
	"openclaw.call_id",
	"openclaw.chatId",
	"openclaw.chat_id",
	"openclaw.messageId",
	"openclaw.message_id",
	"openclaw.parentSpanId",
	"openclaw.parent_span_id",
	"openclaw.runId",
	"openclaw.run_id",
	"openclaw.sessionId",
	"openclaw.session_id",
	"openclaw.sessionKey",
	"openclaw.session_key",
	"openclaw.spanId",
	"openclaw.span_id",
	"openclaw.toolCallId",
	"openclaw.tool_call_id",
	"openclaw.traceId",
	"openclaw.trace_id"
]);
const SECURITY_TARGET_NAME_VALUE_RE = /^[A-Za-z0-9@/_.:-]{1,256}$/u;
const MAX_OTEL_LOG_BODY_CHARS = 4096;
const MAX_OTEL_LOG_ATTRIBUTE_VALUE_CHARS = 4096;
const OTEL_LOG_RAW_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
const OTEL_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,96}$/u;
const BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const OTEL_EXPORTER_OTLP_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_ENDPOINT";
const OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT";
const OTEL_EXPORTER_OTLP_METRICS_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT";
const OTEL_EXPORTER_OTLP_LOGS_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT";
const OTEL_EXPORTER_OTLP_TRACES_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_TRACES_PROTOCOL";
const OTEL_EXPORTER_OTLP_METRICS_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL";
const OTEL_EXPORTER_OTLP_LOGS_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL";
const OTEL_EXPORTER_OTLP_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_KEY_ENV = "OTEL_EXPORTER_OTLP_CLIENT_KEY";
const OTEL_SEMCONV_STABILITY_OPT_IN_ENV = "OTEL_SEMCONV_STABILITY_OPT_IN";
const GEN_AI_LATEST_EXPERIMENTAL_OPT_IN = "gen_ai_latest_experimental";
const GEN_AI_TOKEN_USAGE_BUCKETS = [
	1,
	4,
	16,
	64,
	256,
	1024,
	4096,
	16384,
	65536,
	262144,
	1048576,
	4194304,
	16777216,
	67108864
];
const GEN_AI_OPERATION_DURATION_BUCKETS = [
	.01,
	.02,
	.04,
	.08,
	.16,
	.32,
	.64,
	1.28,
	2.56,
	5.12,
	10.24,
	20.48,
	40.96,
	81.92
];
const OTEL_DEFAULT_HISTOGRAM_BUCKETS = [
	0,
	5,
	10,
	25,
	50,
	75,
	100,
	250,
	500,
	750,
	1e3,
	2500,
	5e3,
	7500,
	1e4
];
const AGENT_DURATION_MS_BUCKETS = [
	...OTEL_DEFAULT_HISTOGRAM_BUCKETS,
	15e3,
	2e4,
	3e4,
	45e3,
	6e4,
	12e4,
	18e4,
	24e4,
	3e5,
	6e5,
	9e5,
	18e5,
	36e5
];
const CONTEXT_TOKENS_BUCKETS = [
	...OTEL_DEFAULT_HISTOGRAM_BUCKETS,
	16e3,
	32e3,
	64e3,
	128e3,
	2e5,
	4e5,
	1e6,
	2e6
];
const MAX_RETAINED_TRUSTED_SPAN_CONTEXTS = 1024;
//#endregion
//#region extensions/diagnostics-otel/src/service-content-normalization.ts
const MAX_OTEL_CONTENT_ATTRIBUTE_CHARS = 131072;
const MAX_OTEL_ERROR_MESSAGE_CHARS = 4096;
const PRELOADED_OTEL_SDK_ENV = "OPENCLAW_OTEL_PRELOADED";
const NO_CONTENT_CAPTURE = {
	inputMessages: false,
	outputMessages: false,
	toolInputs: false,
	toolOutputs: false,
	systemPrompt: false,
	toolDefinitions: false,
	logBodies: false
};
function clampOtelLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeOtelLogString(value, maxChars) {
	return clampOtelLogText(redactSensitiveText(value), maxChars);
}
function normalizeOtelErrorMessage(value) {
	if (!value) return;
	return normalizeOtelLogString(value.trim(), MAX_OTEL_ERROR_MESSAGE_CHARS) || void 0;
}
function resolveContentCapturePolicy(value) {
	return value === true ? {
		inputMessages: true,
		outputMessages: true,
		toolInputs: true,
		toolOutputs: true,
		systemPrompt: false,
		toolDefinitions: true,
		logBodies: true
	} : NO_CONTENT_CAPTURE;
}
function hasPreloadedOtelSdk() {
	return process.env[PRELOADED_OTEL_SDK_ENV] === "1";
}
function normalizeOtelContentValue(value) {
	if (typeof value === "string") return normalizeOtelLogString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (Array.isArray(value)) {
		const items = [];
		for (const item of value.slice(0, 200)) if (typeof item === "string") items.push(item);
		if (items.length > 0) return normalizeOtelLogString(items.join("\n"), MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	}
	const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (json) return json;
}
const TRUNCATED_JSON_TEXT_SUFFIX = "...(truncated)";
const JSON_TRUNCATION_STRING_BUDGETS = [
	8192,
	4096,
	2048,
	1024,
	512,
	256,
	128,
	64,
	32
];
const JSON_TRUNCATION_ARRAY_ITEM_BUDGETS = [
	200,
	100,
	50,
	25,
	10,
	5,
	1
];
const JSON_TRUNCATION_MAX_OBJECT_FIELDS = 64;
const JSON_TRUNCATION_MAX_DEPTH = 8;
function safeJsonString(value, maxChars) {
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return;
	const exact = stringifyJsonForOtelAttribute(value);
	if (exact && exact.length <= maxChars) return exact;
	for (const maxArrayItems of JSON_TRUNCATION_ARRAY_ITEM_BUDGETS) for (const maxStringChars of JSON_TRUNCATION_STRING_BUDGETS) {
		const json = stringifyJsonForOtelAttribute(truncateJsonValueForOtelAttribute(value, {
			maxArrayItems,
			maxDepth: JSON_TRUNCATION_MAX_DEPTH,
			maxObjectFields: JSON_TRUNCATION_MAX_OBJECT_FIELDS,
			maxStringChars,
			seen: /* @__PURE__ */ new WeakSet()
		}));
		if (json && json.length <= maxChars) return json;
	}
	const summary = stringifyJsonForOtelAttribute({
		truncated: true,
		reason: exact ? "max_attribute_size" : "unserializable_value",
		type: describeJsonValue(value)
	});
	return summary && summary.length <= maxChars ? summary : void 0;
}
function stringifyJsonForOtelAttribute(value) {
	try {
		const json = JSON.stringify(value);
		if (!json) return;
		return redactSensitiveText(json);
	} catch {
		return;
	}
}
function truncateJsonValueForOtelAttribute(value, options) {
	if (typeof value === "string") return truncateJsonTextForOtelAttribute(value, options.maxStringChars);
	if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
	if (typeof value === "bigint") return truncateJsonTextForOtelAttribute(String(value), options.maxStringChars);
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return;
	if (options.maxDepth <= 0) return {
		truncated: true,
		reason: "max_depth"
	};
	if (Array.isArray(value)) return truncateJsonArrayForOtelAttribute(value, options);
	if (typeof value === "object") return truncateJsonObjectForOtelAttribute(value, options);
}
function truncateJsonArrayForOtelAttribute(value, options) {
	if (options.seen.has(value)) return [{
		truncated: true,
		reason: "circular_reference"
	}];
	options.seen.add(value);
	const nextOptions = {
		...options,
		maxDepth: options.maxDepth - 1
	};
	const items = value.slice(0, options.maxArrayItems).map((item) => truncateJsonValueForOtelAttribute(item, nextOptions));
	if (value.length > items.length) items.push({
		truncated: true,
		omittedItems: value.length - items.length
	});
	options.seen.delete(value);
	return items;
}
function truncateJsonObjectForOtelAttribute(value, options) {
	if (options.seen.has(value)) return {
		truncated: true,
		reason: "circular_reference"
	};
	options.seen.add(value);
	const nextOptions = {
		...options,
		maxDepth: options.maxDepth - 1
	};
	const result = {};
	const entries = Object.entries(value).filter(([, field]) => field !== void 0 && typeof field !== "function" && typeof field !== "symbol");
	for (const [key, field] of entries.slice(0, options.maxObjectFields)) result[key] = truncateJsonValueForOtelAttribute(field, nextOptions);
	if (entries.length > options.maxObjectFields) {
		result.truncated = true;
		result.omittedFields = entries.length - options.maxObjectFields;
	}
	options.seen.delete(value);
	return result;
}
function truncateJsonTextForOtelAttribute(value, maxChars) {
	const redacted = redactSensitiveText(value);
	if (redacted.length <= maxChars) return redacted;
	const suffixBudget = Math.min(14, maxChars);
	const prefixBudget = Math.max(0, maxChars - suffixBudget);
	return `${truncateUtf16Safe(redacted, prefixBudget)}${TRUNCATED_JSON_TEXT_SUFFIX.slice(14 - suffixBudget)}`;
}
function describeJsonValue(value) {
	if (Array.isArray(value)) return "array";
	if (value === null) return "null";
	return typeof value;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-exporter.ts
function normalizeEndpoint(endpoint) {
	return endpoint?.trim() || void 0;
}
const SIGNAL_QUALIFIED_OTLP_PATH_PATTERN = /\/v1\/(traces|metrics|logs)$/iu;
function appendOrReplaceSignalPath(value, path) {
	const base = value.replace(/\/+$/u, "");
	return SIGNAL_QUALIFIED_OTLP_PATH_PATTERN.test(base) ? base.replace(SIGNAL_QUALIFIED_OTLP_PATH_PATTERN, `/${path}`) : `${base}/${path}`;
}
function resolveSharedOtelUrl(endpoint, path) {
	const endpointWithoutQueryOrFragment = endpoint.split(/[?#]/, 1)[0] ?? endpoint;
	const base = endpointWithoutQueryOrFragment.replace(/\/+$/u, "");
	const matchedSignal = base.match(SIGNAL_QUALIFIED_OTLP_PATH_PATTERN)?.[1];
	const requestedSignal = path.slice(path.lastIndexOf("/") + 1);
	if (matchedSignal?.toLowerCase() === requestedSignal.toLowerCase()) return endpoint === endpointWithoutQueryOrFragment ? base : endpoint;
	if (/[?#]/u.test(endpoint)) {
		const url = new URL(endpoint);
		url.pathname = appendOrReplaceSignalPath(url.pathname, path);
		return url.toString();
	}
	return appendOrReplaceSignalPath(endpoint, path);
}
function resolveSignalOtelUrl(params) {
	const signalEndpoint = normalizeEndpoint(params.signalEndpoint ?? params.signalEnvEndpoint);
	const endpoint = signalEndpoint ?? params.endpoint;
	const signalEnvEndpoint = params.signalEnvEndpoint?.trim() ? params.signalEnvEndpoint : void 0;
	const sharedEnvEndpoint = params.sharedEnvEndpoint?.trim() ? params.sharedEnvEndpoint : void 0;
	const consumedSharedEnvEndpoint = signalEnvEndpoint ? void 0 : sharedEnvEndpoint;
	const appendedSharedEnvEndpoint = consumedSharedEnvEndpoint ? `${consumedSharedEnvEndpoint}${consumedSharedEnvEndpoint.endsWith("/") ? "" : "/"}${params.path}` : void 0;
	const resolvedEndpoint = endpoint && URL.canParse(endpoint) && !signalEndpoint ? resolveSharedOtelUrl(endpoint, params.path) : endpoint;
	for (const candidate of [
		endpoint,
		signalEnvEndpoint ?? sharedEnvEndpoint,
		appendedSharedEnvEndpoint,
		resolvedEndpoint
	]) if (candidate && !URL.canParse(candidate)) throw new Error("Configured OpenTelemetry collector endpoint is invalid; check the collector URL");
	return resolvedEndpoint;
}
function readOtelEnvFile(params) {
	const signalEnvName = `OTEL_EXPORTER_OTLP_${params.signalIdentifier}_${params.signalSuffix}`;
	const filePath = normalizeOtelEnvValue(process.env[signalEnvName]) ?? normalizeOtelEnvValue(process.env[params.sharedEnvName]);
	if (!filePath) return;
	try {
		const material = readFileSync(nodePath.resolve(process.cwd(), filePath));
		if (material.length > 0) return material;
	} catch {}
	throw new Error(`Configured OpenTelemetry ${params.label} file is missing, empty, or unreadable; refusing insecure export`);
}
function normalizeOtelEnvValue(value) {
	return value?.trim() ? value : void 0;
}
function resolveOtelHttpAgentOptions(params) {
	const { url, signalIdentifier } = params;
	const ca = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CERTIFICATE",
		sharedEnvName: OTEL_EXPORTER_OTLP_CERTIFICATE_ENV,
		label: "TLS root certificate"
	});
	const cert = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CLIENT_CERTIFICATE",
		sharedEnvName: OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE_ENV,
		label: "mTLS client certificate"
	});
	const key = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CLIENT_KEY",
		sharedEnvName: OTEL_EXPORTER_OTLP_CLIENT_KEY_ENV,
		label: "mTLS client private key"
	});
	if (cert === void 0 !== (key === void 0)) throw new Error("Configured OpenTelemetry mTLS requires both a client certificate and private key; refusing insecure export");
	if (!url) return;
	const agentOptions = {
		keepAlive: true,
		...ca !== void 0 ? { ca } : {},
		...cert !== void 0 ? { cert } : {},
		...key !== void 0 ? { key } : {}
	};
	try {
		const agent = createNodeProxyAgent({
			mode: "env",
			targetUrl: url,
			agentOptions
		});
		if (agent) return () => agent;
	} catch {
		throw new Error("Configured telemetry proxy is invalid or unsupported; refusing direct export");
	}
	return (ca || cert || key) && new URL(url).protocol === "https:" ? agentOptions : void 0;
}
function resolveSampleRate(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	if (value < 0 || value > 1) return;
	return value;
}
function formatError(err) {
	if (err instanceof Error) return err.stack ?? err.message;
	if (typeof err === "string") return err;
	try {
		return JSON.stringify(err);
	} catch {
		return String(err);
	}
}
function errorCategory(err) {
	try {
		if (err instanceof Error && typeof err.name === "string" && err.name.trim()) return normalizeDiagnosticValue(err.name, "Error");
		return normalizeDiagnosticValue(typeof err, "unknown");
	} catch {
		return "unknown";
	}
}
function readErrorName(err) {
	if (!err || typeof err !== "object") return;
	const name = err.name;
	return typeof name === "string" && name.trim() ? name : void 0;
}
function readErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = err.code;
	return typeof code === "string" || typeof code === "number" ? code : void 0;
}
function findOtlpExporterError(reason) {
	for (const candidate of collectErrorGraphCandidates(reason, (current) => Array.isArray(current) ? current : [
		current.cause,
		current.reason,
		current.original,
		current.error,
		...Array.isArray(current.errors) ? current.errors : []
	])) if (readErrorName(candidate) === "OTLPExporterError" && candidate && typeof candidate === "object") return candidate;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-events.ts
function createDiagnosticsEventHandler(params) {
	const { logger, recorders, recordLogRecord, recordSecurityEvent } = params;
	const { recordGcDuration, recordGatewayEventLoopSample, recordGatewayRpc, recordModelUsage, recordWebhookReceived, recordWebhookProcessed, recordWebhookError, recordMessageQueued, recordMessageReceived, recordMessageDispatchStarted, recordMessageDispatchCompleted, recordMessageProcessed, recordMessageDeliveryStarted, recordMessageDeliveryCompleted, recordMessageDeliveryError, recordTalkEvent, recordLaneEnqueue, recordLaneDequeue, recordSessionState, recordSessionTurnCreated, recordSessionStuck, recordSessionRecoveryRequested, recordSessionRecoveryCompleted, recordRunAttempt, recordHeartbeat, recordLivenessWarning, recordDiagnosticPhaseCompleted, recordRunStarted, recordRunCompleted, recordHarnessRunStarted, recordHarnessRunCompleted, recordHarnessRunError, recordContextAssembled, recordModelCallStarted, recordModelCallFinished, recordToolExecutionStarted, recordToolExecutionFinished, recordToolExecutionBlocked, recordSkillUsed, recordExecProcessCompleted, recordToolLoop, recordMemorySample, recordMemoryPressure, recordAsyncQueueDropped, recordTelemetryExporter, recordPayloadLarge, recordModelFailover } = recorders;
	return (evt, metadata, privateData) => {
		try {
			switch (evt.type) {
				case "diagnostic.child_process.spawn": return;
				case "diagnostic.gc":
					recordGcDuration(evt, metadata);
					return;
				case "gateway.event_loop.sample":
					recordGatewayEventLoopSample(evt, metadata);
					return;
				case "gateway.rpc":
					recordGatewayRpc(evt, metadata);
					return;
				case "model.usage":
					recordModelUsage(evt, metadata, privateData.hostPluginId);
					return;
				case "webhook.received":
					recordWebhookReceived(evt);
					return;
				case "webhook.processed":
					recordWebhookProcessed(evt);
					return;
				case "webhook.error":
					recordWebhookError(evt);
					return;
				case "message.queued":
					recordMessageQueued(evt);
					return;
				case "message.received":
					recordMessageReceived(evt);
					return;
				case "message.dispatch.started":
					recordMessageDispatchStarted(evt, metadata);
					return;
				case "message.dispatch.completed":
					recordMessageDispatchCompleted(evt);
					return;
				case "message.processed":
					recordMessageProcessed(evt, metadata);
					return;
				case "message.delivery.started":
					recordMessageDeliveryStarted(evt);
					return;
				case "message.delivery.completed":
					recordMessageDeliveryCompleted(evt, metadata);
					return;
				case "message.delivery.error":
					recordMessageDeliveryError(evt, metadata);
					return;
				case "talk.event":
					recordTalkEvent(evt, metadata);
					return;
				case "queue.lane.enqueue":
					recordLaneEnqueue(evt);
					return;
				case "queue.lane.dequeue":
					recordLaneDequeue(evt);
					return;
				case "session.state":
					recordSessionState(evt);
					break;
				case "session.long_running":
				case "session.stalled": break;
				case "session.turn.created":
					recordSessionTurnCreated(evt);
					return;
				case "session.stuck":
					recordSessionStuck(evt);
					return;
				case "session.recovery.requested":
					recordSessionRecoveryRequested(evt);
					return;
				case "session.recovery.completed":
					recordSessionRecoveryCompleted(evt);
					return;
				case "run.attempt":
					recordRunAttempt(evt);
					break;
				case "run.progress": break;
				case "run.execution_phase": break;
				case "diagnostic.heartbeat":
					recordHeartbeat(evt);
					return;
				case "diagnostic.liveness.warning":
					recordLivenessWarning(evt);
					return;
				case "diagnostic.phase.completed":
					recordDiagnosticPhaseCompleted(evt);
					return;
				case "run.started":
					recordRunStarted(evt, metadata);
					return;
				case "run.completed":
					recordRunCompleted(evt, metadata, privateData);
					return;
				case "harness.run.started":
					recordHarnessRunStarted(evt, metadata);
					return;
				case "harness.run.completed":
					recordHarnessRunCompleted(evt, metadata, privateData);
					return;
				case "harness.run.error":
					recordHarnessRunError(evt, metadata, privateData);
					return;
				case "context.assembled":
					recordContextAssembled(evt, metadata);
					return;
				case "model.call.started":
					recordModelCallStarted(evt, metadata);
					return;
				case "model.call.completed":
				case "model.call.error":
					recordModelCallFinished(evt, metadata, privateData.modelContent);
					return;
				case "tool.execution.started":
					recordToolExecutionStarted(evt, metadata);
					return;
				case "tool.execution.completed":
				case "tool.execution.error":
					recordToolExecutionFinished(evt, metadata, privateData.toolContent);
					return;
				case "tool.execution.blocked":
					recordToolExecutionBlocked(evt, metadata);
					return;
				case "skill.used":
					recordSkillUsed(evt, metadata);
					return;
				case "exec.process.completed":
					recordExecProcessCompleted(evt, metadata);
					break;
				case "exec.approval.followup_suppressed": break;
				case "log.record":
					recordLogRecord?.(evt, metadata);
					return;
				case "security.event":
					recordSecurityEvent?.(evt, metadata);
					return;
				case "tool.loop":
					recordToolLoop(evt);
					return;
				case "diagnostic.memory.sample":
					recordMemorySample(evt);
					return;
				case "diagnostic.memory.pressure":
					recordMemoryPressure(evt);
					return;
				case "diagnostic.async_queue.dropped":
					recordAsyncQueueDropped(evt);
					return;
				case "telemetry.exporter":
					recordTelemetryExporter(evt, metadata);
					return;
				case "payload.large":
					recordPayloadLarge(evt);
					return;
				case "model.failover": recordModelFailover(evt, metadata);
			}
		} catch (err) {
			logger.error(`diagnostics-otel: event handler failed (${evt.type}): ${formatError(err)}`);
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-exporter-health.ts
function publicFailureKey(event) {
	return `${event.reason ?? "unspecified"}\u0000${event.errorCategory ?? "unknown"}`;
}
/** Owns route transitions so one producer cannot recover another producer's failure. */
function createExporterHealthEventEmitter(publish) {
	const failures = /* @__PURE__ */ new Map();
	return (event) => {
		const key = `${event.exporter}\u0000${event.signal}\u0000${event.transport}`;
		if (event.status === "started" || event.status === "dropped") {
			failures.delete(key);
			publish(event);
			return;
		}
		const reason = event.reason ?? "unspecified";
		if (event.status === "failure") {
			const route = failures.get(key) ?? { active: /* @__PURE__ */ new Map() };
			failures.set(key, route);
			if (route.active.has(reason)) return;
			route.active.set(reason, event);
			if (route.reported === void 0) {
				route.reported = reason;
				publish(event);
			}
			return;
		}
		const route = failures.get(key);
		if (!route?.active.delete(reason) || route.reported !== reason) return;
		const next = route.active.entries().next().value;
		if (next) {
			route.reported = next[0];
			publish(next[1]);
			return;
		}
		failures.delete(key);
		publish(event);
	};
}
/** Coalesces private transport transitions into the shipped signal-level public stream. */
function createPublicExporterHealthEventEmitter(publish) {
	const signals = /* @__PURE__ */ new Map();
	return (event) => {
		const signalKey = `${event.exporter}\u0000${event.signal}`;
		let state = signals.get(signalKey);
		if (!state) {
			if (event.status === "dropped") return;
			state = {
				routes: /* @__PURE__ */ new Set(),
				started: false,
				routeFailures: /* @__PURE__ */ new Map()
			};
			signals.set(signalKey, state);
		}
		const routeKey = event.transport;
		if (event.status === "dropped") {
			const removed = state.routes.delete(routeKey);
			state.routeFailures.delete(routeKey);
			if (!removed || state.routes.size > 0) return;
			signals.delete(signalKey);
			publish({
				...event,
				status: "dropped"
			});
			return;
		}
		state.routes.add(routeKey);
		if (event.status === "started") {
			state.routeFailures.delete(routeKey);
			if (state.started) return;
			state.started = true;
			publish({
				...event,
				status: "started"
			});
			return;
		}
		if (event.status === "recovered") {
			state.routeFailures.delete(routeKey);
			return;
		}
		const failureKey = publicFailureKey(event);
		if (state.routeFailures.get(routeKey) === failureKey) return;
		const duplicate = [...state.routeFailures.entries()].some(([transport, activeFailure]) => transport !== routeKey && activeFailure === failureKey);
		state.routeFailures.set(routeKey, failureKey);
		if (!duplicate) publish({
			...event,
			status: "failure"
		});
	};
}
/**
* Observes the exporter result callback, which runs only after the OTLP
* transport has exhausted dependency-owned retries.
*/
function observeOtlpExporterHealth(exporter, params) {
	const observed = exporter;
	const exportItems = observed.export.bind(observed);
	const shutdown = observed.shutdown.bind(observed);
	const emit = (status, reason, error) => {
		params.emitExporterEvent({
			exporter: "diagnostics-otel",
			signal: params.signal,
			transport: "otlp-http-protobuf",
			status,
			reason,
			...error ? { errorCategory: errorCategory(error) } : {}
		});
	};
	observed.export = (items, resultCallback) => {
		let dependencyCallbackInvoked = false;
		try {
			exportItems(items, (result) => {
				dependencyCallbackInvoked = true;
				if (result.code === ExportResultCode.FAILED) emit("failure", "export_failed", result.error);
				else if (result.code === ExportResultCode.SUCCESS) emit("recovered", "export_failed");
				resultCallback(result);
			});
		} catch (error) {
			if (!dependencyCallbackInvoked) emit("failure", "export_failed", error);
			throw error;
		}
	};
	observed.shutdown = async () => {
		try {
			await shutdown();
		} catch (error) {
			emit("failure", "shutdown_failed", error);
			throw error;
		}
	};
	return exporter;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-attributes.ts
function redactOtelAttributes(attributes) {
	const redactedAttributes = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (DROPPED_OTEL_ATTRIBUTE_KEYS.has(key)) continue;
		redactedAttributes[key] = typeof value === "string" ? redactSensitiveText(value) : value;
	}
	return redactedAttributes;
}
function securityTargetNameAttr(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	const redactedLower = redacted.toLowerCase();
	if (redactedLower.startsWith("agent:") || redactedLower.includes(":agent:")) return fallback;
	return SECURITY_TARGET_NAME_VALUE_RE.test(redacted) ? redacted : fallback;
}
function shouldCaptureOtelLogBody(policy) {
	return policy.logBodies;
}
function otelLogTimestampIso(timestamp) {
	if (timestamp instanceof Date) return timestamp.toISOString();
	if (typeof timestamp === "number" && Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
	if (Array.isArray(timestamp)) {
		const [seconds, nanoseconds] = timestamp;
		if (Number.isFinite(seconds) && Number.isFinite(nanoseconds)) return new Date(seconds * 1e3 + Math.trunc(nanoseconds / 1e6)).toISOString();
	}
	return (/* @__PURE__ */ new Date()).toISOString();
}
function writeStdoutDiagnosticLogRecord(params) {
	const { logRecord, serviceName, traceContext } = params;
	const line = {
		ts: otelLogTimestampIso(logRecord.timestamp),
		signal: "openclaw.diagnostic.log",
		"service.name": serviceName,
		severityText: logRecord.severityText,
		severityNumber: logRecord.severityNumber,
		body: logRecord.body,
		attributes: logRecord.attributes ?? {},
		...traceContext?.traceId ? { trace_id: traceContext.traceId } : {},
		...traceContext?.spanId ? { span_id: traceContext.spanId } : {},
		...traceContext?.traceFlags ? { trace_flags: traceContext.traceFlags } : {}
	};
	process.stdout.write(`${JSON.stringify(line)}\n`);
}
function assignOtelLogAttribute(attributes, key, value) {
	if (Object.keys(attributes).length >= 64) return;
	if (BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS.has(key)) return;
	if (redactSensitiveText(key) !== key) return;
	if (!OTEL_LOG_ATTRIBUTE_KEY_RE.test(key)) return;
	if (typeof value === "string") {
		attributes[key] = normalizeOtelLogString(value, MAX_OTEL_LOG_ATTRIBUTE_VALUE_CHARS);
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[key] = value;
		return;
	}
	if (typeof value === "boolean") attributes[key] = value;
}
function assignOtelEventAttributes(attributes, eventAttributes, keyPrefix, normalizeString) {
	if (!eventAttributes) return;
	for (const [rawKey, value] of Object.entries(eventAttributes)) {
		if (Object.keys(attributes).length >= 64) break;
		const key = rawKey.trim();
		if (BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS.has(key) || redactSensitiveText(key) !== key || !OTEL_LOG_RAW_ATTRIBUTE_KEY_RE.test(key)) continue;
		const normalized = typeof value === "string" && normalizeString ? normalizeString(value) : value;
		assignOtelLogAttribute(attributes, `${keyPrefix}${key}`, normalized);
	}
}
function assignOtelLogEventAttributes(attributes, eventAttributes) {
	assignOtelEventAttributes(attributes, eventAttributes, "openclaw.");
}
function assignOtelSecurityEventAttributes(attributes, eventAttributes) {
	assignOtelEventAttributes(attributes, eventAttributes, "openclaw.security.attribute.", normalizeDiagnosticValue);
}
function securitySeverityText(severity) {
	switch (severity) {
		case "critical": return "FATAL";
		case "high": return "ERROR";
		case "medium": return "WARN";
		case "info":
		case "low": return "INFO";
	}
	return severity;
}
function assignOtelSecurityAttributes(attributes, evt) {
	assignOtelLogAttribute(attributes, "openclaw.security.event_id", evt.eventId);
	assignOtelLogAttribute(attributes, "openclaw.security.category", evt.category);
	assignOtelLogAttribute(attributes, "openclaw.security.action", normalizeDiagnosticValue(evt.action));
	assignOtelLogAttribute(attributes, "openclaw.security.outcome", evt.outcome);
	assignOtelLogAttribute(attributes, "openclaw.security.severity", evt.severity);
	if (evt.reason) assignOtelLogAttribute(attributes, "openclaw.security.reason", normalizeDiagnosticValue(evt.reason));
	if (evt.actor) {
		assignOtelLogAttribute(attributes, "openclaw.security.actor.kind", evt.actor.kind);
		if (evt.actor.idHash) assignOtelLogAttribute(attributes, "openclaw.security.actor.id_hash", normalizeDiagnosticValue(evt.actor.idHash));
		if (evt.actor.deviceIdHash) assignOtelLogAttribute(attributes, "openclaw.security.actor.device_id_hash", normalizeDiagnosticValue(evt.actor.deviceIdHash));
		if (evt.actor.channel) assignOtelLogAttribute(attributes, "openclaw.security.actor.channel", normalizeDiagnosticValue(evt.actor.channel));
		if (evt.actor.role) assignOtelLogAttribute(attributes, "openclaw.security.actor.role", normalizeDiagnosticValue(evt.actor.role));
		if (evt.actor.scopes?.length) assignOtelLogAttribute(attributes, "openclaw.security.actor.scopes", evt.actor.scopes.map((scope) => normalizeDiagnosticValue(scope)).join(","));
	}
	if (evt.target) {
		assignOtelLogAttribute(attributes, "openclaw.security.target.kind", evt.target.kind);
		if (evt.target.idHash) assignOtelLogAttribute(attributes, "openclaw.security.target.id_hash", normalizeDiagnosticValue(evt.target.idHash));
		if (evt.target.name) assignOtelLogAttribute(attributes, "openclaw.security.target.name", securityTargetNameAttr(evt.target.name));
		if (evt.target.owner) assignOtelLogAttribute(attributes, "openclaw.security.target.owner", normalizeDiagnosticValue(evt.target.owner));
	}
	if (evt.policy) {
		if (evt.policy.id) assignOtelLogAttribute(attributes, "openclaw.security.policy.id", normalizeDiagnosticValue(evt.policy.id));
		if (evt.policy.decision) assignOtelLogAttribute(attributes, "openclaw.security.policy.decision", evt.policy.decision);
		if (evt.policy.reason) assignOtelLogAttribute(attributes, "openclaw.security.policy.reason", normalizeDiagnosticValue(evt.policy.reason));
	}
	if (evt.control) {
		if (evt.control.id) assignOtelLogAttribute(attributes, "openclaw.security.control.id", normalizeDiagnosticValue(evt.control.id));
		if (evt.control.family) assignOtelLogAttribute(attributes, "openclaw.security.control.family", evt.control.family);
	}
	assignOtelSecurityEventAttributes(attributes, evt.attributes);
}
//#endregion
//#region extensions/diagnostics-otel/src/service-trace-context.ts
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
function traceFlagsToOtel(traceFlags) {
	return (Number.parseInt(traceFlags ?? "00", 16) & TraceFlags.SAMPLED) !== 0 ? TraceFlags.SAMPLED : TraceFlags.NONE;
}
function contextForTraceContext(traceContext) {
	const normalized = normalizeTraceContext(traceContext);
	if (!normalized?.spanId) return;
	return trace.setSpanContext(context.active(), {
		traceId: normalized.traceId,
		spanId: normalized.spanId,
		traceFlags: traceFlagsToOtel(normalized.traceFlags),
		isRemote: true
	});
}
function contextForTrustedTraceContext(evt, metadata) {
	return metadata.trusted || metadata.trustedTraceContext === true ? contextForTraceContext(evt.trace) : void 0;
}
function normalizedTrustedTraceContext(evt, metadata) {
	return metadata.trusted || metadata.trustedTraceContext === true ? normalizeTraceContext(evt.trace) : void 0;
}
function addTraceAttributes(attributes, traceContext) {
	const normalized = normalizeTraceContext(traceContext);
	if (!normalized) return;
	attributes["openclaw.traceId"] = normalized.traceId;
	if (normalized.spanId) attributes["openclaw.spanId"] = normalized.spanId;
	if (normalized.parentSpanId) attributes["openclaw.parentSpanId"] = normalized.parentSpanId;
	if (normalized.traceFlags) attributes["openclaw.traceFlags"] = normalized.traceFlags;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-logs.ts
const LOG_SEVERITY_MAP = {
	TRACE: 1,
	DEBUG: 5,
	INFO: 9,
	WARN: 13,
	ERROR: 17,
	FATAL: 21
};
function createDiagnosticsLogExporter(params) {
	const { contentCapturePolicy, emitExporterEvent, flushIntervalMs, headers, logger, logsEnabled, logsToOtlp, logsToStdout, logHttpAgentOptions, logUrl, resource, serviceName } = params;
	let logProvider = null;
	const logSeverityMap = LOG_SEVERITY_MAP;
	let recordLogRecord;
	let recordSecurityEvent;
	if (logsEnabled) {
		let logRecordExportFailureLastReportedAt = Number.NEGATIVE_INFINITY;
		let otelLogger;
		const activeTransports = [...logsToOtlp ? ["otlp-http-protobuf"] : [], ...logsToStdout ? ["stdout"] : []];
		if (logsToOtlp) {
			const logExporter = observeOtlpExporterHealth(new OTLPLogExporter({
				...logUrl ? { url: logUrl } : {},
				...headers ? { headers } : {},
				...logHttpAgentOptions ? { httpAgentOptions: logHttpAgentOptions } : {}
			}), {
				emitExporterEvent,
				signal: "logs"
			});
			const logProcessor = new BatchLogRecordProcessor({
				exporter: logExporter,
				...typeof flushIntervalMs === "number" ? { scheduledDelayMillis: Math.max(1e3, flushIntervalMs) } : {}
			});
			logProvider = new LoggerProvider({
				resource,
				processors: [logProcessor]
			});
			otelLogger = logProvider.getLogger("openclaw");
		}
		const reportLogExportFailure = (err, label, transport) => {
			emitExporterEvent({
				exporter: "diagnostics-otel",
				signal: "logs",
				transport,
				status: "failure",
				reason: "emit_failed",
				errorCategory: errorCategory(err)
			});
			const now = Date.now();
			if (now - logRecordExportFailureLastReportedAt >= 6e4) {
				logRecordExportFailureLastReportedAt = now;
				logger.error(`diagnostics-otel: ${label} export failed: ${formatError(err)}`);
			}
		};
		const reportLogExportRecovery = (transport) => {
			emitExporterEvent({
				exporter: "diagnostics-otel",
				signal: "logs",
				transport,
				status: "recovered",
				reason: "emit_failed"
			});
		};
		const reportLogPreparationFailure = (err, label) => {
			for (const transport of activeTransports) reportLogExportFailure(err, label, transport);
		};
		const emitLogRecord = ({ logRecord, traceContext }, label) => {
			if (logsToOtlp) try {
				otelLogger?.emit(logRecord);
				reportLogExportRecovery("otlp-http-protobuf");
			} catch (error) {
				reportLogExportFailure(error, label, "otlp-http-protobuf");
			}
			if (logsToStdout) try {
				writeStdoutDiagnosticLogRecord({
					logRecord,
					serviceName,
					...traceContext ? { traceContext } : {}
				});
				reportLogExportRecovery("stdout");
			} catch (error) {
				reportLogExportFailure(error, label, "stdout");
			}
		};
		const buildDiagnosticLogRecord = (evt, metadata) => {
			const logLevelName = evt.level || "INFO";
			const severityNumber = logSeverityMap[logLevelName] ?? 9;
			const body = shouldCaptureOtelLogBody(contentCapturePolicy) ? normalizeOtelLogString(evt.message || "log", MAX_OTEL_LOG_BODY_CHARS) : "log";
			const attributes = Object.create(null);
			assignOtelLogAttribute(attributes, "openclaw.log.level", logLevelName);
			if (evt.loggerName) assignOtelLogAttribute(attributes, "openclaw.logger", evt.loggerName);
			if (evt.loggerParents?.length) assignOtelLogAttribute(attributes, "openclaw.logger.parents", evt.loggerParents.join("."));
			assignOtelLogEventAttributes(attributes, evt.attributes);
			if (evt.code?.line) assignOtelLogAttribute(attributes, "code.lineno", evt.code.line);
			if (evt.code?.functionName) assignOtelLogAttribute(attributes, "code.function", evt.code.functionName);
			const traceContext = normalizedTrustedTraceContext(evt, metadata);
			addTraceAttributes(attributes, traceContext);
			const logRecord = {
				body,
				severityText: logLevelName,
				severityNumber,
				attributes: redactOtelAttributes(attributes),
				timestamp: evt.ts
			};
			const logContext = contextForTrustedTraceContext(evt, metadata);
			if (logContext) logRecord.context = logContext;
			return {
				logRecord,
				...traceContext ? { traceContext } : {}
			};
		};
		const buildSecurityLogRecord = (evt, metadata) => {
			const severityText = securitySeverityText(evt.severity);
			const attributes = Object.create(null);
			assignOtelSecurityAttributes(attributes, evt);
			const traceContext = normalizedTrustedTraceContext(evt, metadata);
			const logRecord = {
				body: "openclaw.security.event",
				severityText,
				severityNumber: logSeverityMap[severityText] ?? 9,
				attributes: redactOtelAttributes(attributes),
				timestamp: evt.ts
			};
			const logContext = contextForTrustedTraceContext(evt, metadata);
			if (logContext) logRecord.context = logContext;
			return {
				logRecord,
				...traceContext ? { traceContext } : {}
			};
		};
		recordLogRecord = (evt, metadata) => {
			try {
				const record = buildDiagnosticLogRecord(evt, metadata);
				emitLogRecord(record, "log record");
			} catch (err) {
				reportLogPreparationFailure(err, "log record");
			}
		};
		recordSecurityEvent = (evt, metadata) => {
			if (!metadata.trusted) return;
			try {
				const record = buildSecurityLogRecord(evt, metadata);
				emitLogRecord(record, "security event");
			} catch (err) {
				reportLogPreparationFailure(err, "security event");
			}
		};
	}
	return {
		logProvider,
		recordLogRecord,
		recordSecurityEvent
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-metrics.ts
const DEFAULT_METRIC_NAME_PREFIX = "openclaw.";
function createDiagnosticsMetrics(meter, metricNamePrefix = DEFAULT_METRIC_NAME_PREFIX) {
	const resolveMetricName = (name) => `${metricNamePrefix}${name.slice(9)}`;
	const createCounter = (name, options) => meter.createCounter(resolveMetricName(name), options);
	const createHistogram = (name, options) => meter.createHistogram(resolveMetricName(name), options);
	return {
		gcDurationHistogram: createHistogram("openclaw.gc.duration_ms", {
			unit: "ms",
			description: "Elapsed garbage collection duration for the hosting JavaScript isolate",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		gatewayEventLoopDelayMaxHistogram: createHistogram("openclaw.gateway.event_loop.delay_max_ms", {
			unit: "ms",
			description: "Maximum event-loop delay per completed Gateway observation window",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		gatewayEventLoopObservedCounter: createCounter("openclaw.gateway.event_loop.observed_ms", {
			unit: "ms",
			description: "Elapsed time covered by completed Gateway event-loop observation windows"
		}),
		gatewayRpcRequestsCounter: createCounter("openclaw.gateway.rpc.requests", {
			unit: "1",
			description: "Authenticated Gateway WebSocket requests received"
		}),
		gatewayRpcOutcomesCounter: createCounter("openclaw.gateway.rpc.outcomes", {
			unit: "1",
			description: "Gateway RPC observations by phase and outcome"
		}),
		gatewayRpcFirstResponseHistogram: createHistogram("openclaw.gateway.rpc.first_response_ms", {
			unit: "ms",
			description: "Elapsed time until the first Gateway RPC response is sent",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		gatewayRpcHandlerHistogram: createHistogram("openclaw.gateway.rpc.handler_ms", {
			unit: "ms",
			description: "Gateway RPC handler duration until return or throw",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		gatewayRpcAdmissionHistogram: createHistogram("openclaw.gateway.rpc.admission_ms", {
			unit: "ms",
			description: "Elapsed time from Gateway RPC receipt until handler invocation",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		gatewayRpcQueueWaitHistogram: createHistogram("openclaw.gateway.rpc.queue_wait_ms", {
			unit: "ms",
			description: "Gateway operator start queue or worker frame queue wait",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		tokensCounter: createCounter("openclaw.tokens", {
			unit: "1",
			description: "Token usage by type"
		}),
		genAiTokenUsageHistogram: meter.createHistogram("gen_ai.client.token.usage", {
			unit: "{token}",
			description: "Number of input and output tokens used by GenAI client operations",
			advice: { explicitBucketBoundaries: GEN_AI_TOKEN_USAGE_BUCKETS }
		}),
		genAiOperationDurationHistogram: meter.createHistogram("gen_ai.client.operation.duration", {
			unit: "s",
			description: "GenAI client operation duration",
			advice: { explicitBucketBoundaries: GEN_AI_OPERATION_DURATION_BUCKETS }
		}),
		costCounter: createCounter("openclaw.cost.usd", {
			unit: "1",
			description: "Estimated model cost (USD)"
		}),
		durationHistogram: createHistogram("openclaw.run.duration_ms", {
			unit: "ms",
			description: "Agent run duration",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		harnessDurationHistogram: createHistogram("openclaw.harness.duration_ms", {
			unit: "ms",
			description: "Agent harness lifecycle duration",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		contextHistogram: createHistogram("openclaw.context.tokens", {
			unit: "1",
			description: "Context window size and usage",
			advice: { explicitBucketBoundaries: CONTEXT_TOKENS_BUCKETS }
		}),
		webhookReceivedCounter: createCounter("openclaw.webhook.received", {
			unit: "1",
			description: "Webhook requests received"
		}),
		webhookErrorCounter: createCounter("openclaw.webhook.error", {
			unit: "1",
			description: "Webhook processing errors"
		}),
		webhookDurationHistogram: createHistogram("openclaw.webhook.duration_ms", {
			unit: "ms",
			description: "Webhook processing duration"
		}),
		messageQueuedCounter: createCounter("openclaw.message.queued", {
			unit: "1",
			description: "Messages queued for processing"
		}),
		messageReceivedCounter: createCounter("openclaw.message.received", {
			unit: "1",
			description: "Inbound messages received"
		}),
		messageDispatchStartedCounter: createCounter("openclaw.message.dispatch.started", {
			unit: "1",
			description: "Inbound message dispatch attempts started"
		}),
		messageDispatchCompletedCounter: createCounter("openclaw.message.dispatch.completed", {
			unit: "1",
			description: "Inbound message dispatch attempts completed"
		}),
		messageDispatchDurationHistogram: createHistogram("openclaw.message.dispatch.duration_ms", {
			unit: "ms",
			description: "Inbound message dispatch duration"
		}),
		messageProcessedCounter: createCounter("openclaw.message.processed", {
			unit: "1",
			description: "Messages processed by outcome"
		}),
		messageDurationHistogram: createHistogram("openclaw.message.duration_ms", {
			unit: "ms",
			description: "Message processing duration"
		}),
		messageDeliveryStartedCounter: createCounter("openclaw.message.delivery.started", {
			unit: "1",
			description: "Outbound message delivery attempts started"
		}),
		messageDeliveryDurationHistogram: createHistogram("openclaw.message.delivery.duration_ms", {
			unit: "ms",
			description: "Outbound message delivery duration"
		}),
		queueDepthHistogram: createHistogram("openclaw.queue.depth", {
			unit: "1",
			description: "Queue depth on enqueue/dequeue"
		}),
		queueWaitHistogram: createHistogram("openclaw.queue.wait_ms", {
			unit: "ms",
			description: "Queue wait time before execution"
		}),
		laneEnqueueCounter: createCounter("openclaw.queue.lane.enqueue", {
			unit: "1",
			description: "Command queue lane enqueue events"
		}),
		laneDequeueCounter: createCounter("openclaw.queue.lane.dequeue", {
			unit: "1",
			description: "Command queue lane dequeue events"
		}),
		sessionStateCounter: createCounter("openclaw.session.state", {
			unit: "1",
			description: "Session state transitions"
		}),
		sessionTurnCreatedCounter: createCounter("openclaw.session.turn.created", {
			unit: "1",
			description: "Agent session turns created"
		}),
		sessionStuckCounter: createCounter("openclaw.session.stuck", {
			unit: "1",
			description: "Sessions stuck in processing"
		}),
		sessionStuckAgeHistogram: createHistogram("openclaw.session.stuck_age_ms", {
			unit: "ms",
			description: "Age of stuck sessions"
		}),
		sessionRecoveryRequestedCounter: createCounter("openclaw.session.recovery.requested", {
			unit: "1",
			description: "Session recovery attempts requested"
		}),
		sessionRecoveryCompletedCounter: createCounter("openclaw.session.recovery.completed", {
			unit: "1",
			description: "Session recovery attempts completed"
		}),
		sessionRecoveryAgeHistogram: createHistogram("openclaw.session.recovery.age_ms", {
			unit: "ms",
			description: "Age of sessions selected for recovery"
		}),
		talkEventCounter: createCounter("openclaw.talk.event", {
			unit: "1",
			description: "Talk events emitted by type"
		}),
		talkEventDurationHistogram: createHistogram("openclaw.talk.event.duration_ms", {
			unit: "ms",
			description: "Talk event duration when reported"
		}),
		talkAudioBytesHistogram: createHistogram("openclaw.talk.audio.bytes", {
			unit: "By",
			description: "Talk audio frame byte lengths"
		}),
		runAttemptCounter: createCounter("openclaw.run.attempt", {
			unit: "1",
			description: "Run attempts"
		}),
		toolLoopCounter: createCounter("openclaw.tool.loop", {
			unit: "1",
			description: "Detected repetitive tool-call loop events"
		}),
		skillUsedCounter: createCounter("openclaw.skill.used", {
			unit: "1",
			description: "Skills used by agent runs"
		}),
		modelCallDurationHistogram: createHistogram("openclaw.model_call.duration_ms", {
			unit: "ms",
			description: "Model call duration"
		}),
		modelCallRequestBytesHistogram: createHistogram("openclaw.model_call.request_bytes", {
			unit: "By",
			description: "UTF-8 byte size of sanitized model request payloads"
		}),
		modelCallResponseBytesHistogram: createHistogram("openclaw.model_call.response_bytes", {
			unit: "By",
			description: "UTF-8 byte size of bounded streamed model response payloads"
		}),
		modelCallTimeToFirstByteHistogram: createHistogram("openclaw.model_call.time_to_first_byte_ms", {
			unit: "ms",
			description: "Elapsed time before the first streamed model response event"
		}),
		modelFailoverCounter: createCounter("openclaw.model.failover", {
			unit: "1",
			description: "Model failovers by source, destination, lane, and reason"
		}),
		toolExecutionDurationHistogram: createHistogram("openclaw.tool.execution.duration_ms", {
			unit: "ms",
			description: "Tool execution duration"
		}),
		toolExecutionBlockedCounter: createCounter("openclaw.tool.execution.blocked", {
			unit: "1",
			description: "Tool executions blocked by policy or sandbox diagnostics"
		}),
		execProcessDurationHistogram: createHistogram("openclaw.exec.duration_ms", {
			unit: "ms",
			description: "Exec process duration"
		}),
		memoryRssHistogram: createHistogram("openclaw.memory.rss_bytes", {
			unit: "By",
			description: "Resident set size reported by diagnostic memory samples"
		}),
		memoryHeapUsedHistogram: createHistogram("openclaw.memory.heap_used_bytes", {
			unit: "By",
			description: "Heap used bytes reported by diagnostic memory samples"
		}),
		memoryHeapTotalHistogram: createHistogram("openclaw.memory.heap_total_bytes", {
			unit: "By",
			description: "Heap total bytes reported by diagnostic memory samples"
		}),
		memoryExternalHistogram: createHistogram("openclaw.memory.external_bytes", {
			unit: "By",
			description: "External memory bytes reported by diagnostic memory samples"
		}),
		memoryArrayBuffersHistogram: createHistogram("openclaw.memory.array_buffers_bytes", {
			unit: "By",
			description: "ArrayBuffer bytes reported by diagnostic memory samples"
		}),
		memoryPressureCounter: createCounter("openclaw.memory.pressure", {
			unit: "1",
			description: "Diagnostic memory pressure events"
		}),
		asyncQueueDroppedCounter: createCounter("openclaw.diagnostic.async_queue.dropped", {
			unit: "1",
			description: "Async diagnostic queue drops by dropped event class"
		}),
		payloadLargeCounter: createCounter("openclaw.payload.large", {
			unit: "1",
			description: "Oversized payload diagnostics by surface and action"
		}),
		payloadLargeBytesHistogram: createHistogram("openclaw.payload.large_bytes", {
			unit: "By",
			description: "Oversized payload byte sizes by surface and action"
		}),
		livenessWarningCounter: createCounter("openclaw.liveness.warning", {
			unit: "1",
			description: "Diagnostic liveness warning events"
		}),
		livenessEventLoopDelayP99Histogram: createHistogram("openclaw.liveness.event_loop_delay_p99_ms", {
			unit: "ms",
			description: "P99 event-loop delay reported by diagnostic liveness warnings"
		}),
		livenessEventLoopDelayMaxHistogram: createHistogram("openclaw.liveness.event_loop_delay_max_ms", {
			unit: "ms",
			description: "Maximum event-loop delay reported by diagnostic liveness warnings"
		}),
		livenessEventLoopUtilizationHistogram: createHistogram("openclaw.liveness.event_loop_utilization", {
			unit: "1",
			description: "Event-loop utilization reported by diagnostic liveness warnings"
		}),
		livenessCpuCoreRatioHistogram: createHistogram("openclaw.liveness.cpu_core_ratio", {
			unit: "1",
			description: "Whole-process CPU usage in core equivalents, including worker and native threads; can exceed 1."
		}),
		telemetryExporterCounter: createCounter("openclaw.telemetry.exporter.events", {
			unit: "1",
			description: "Diagnostic telemetry exporter lifecycle and failure events"
		})
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-propagation.ts
const DEFAULT_PROPAGATORS = ["tracecontext", "baggage"];
const CONTEXT_OWNER_KEY = createContextKey("openclaw.owned-sdk.context-owner");
const PROPAGATOR_OWNER_KEY = createContextKey("openclaw.owned-sdk.propagator-owner");
var OwnedContextManager = class extends AsyncLocalStorageContextManager {
	constructor(owner) {
		super();
		this.owner = owner;
	}
	with(activeContext, fn, thisArg, ...args) {
		const probe = activeContext.getValue(CONTEXT_OWNER_KEY);
		if (probe && typeof probe === "object") probe.owner = this.owner;
		return super.with(activeContext, fn, thisArg, ...args);
	}
};
var OwnedPropagator = class {
	constructor(delegate, owner) {
		this.delegate = delegate;
		this.owner = owner;
	}
	inject(carrierContext, carrier, setter) {
		const probe = carrierContext.getValue(PROPAGATOR_OWNER_KEY);
		if (probe && typeof probe === "object") {
			probe.owner = this.owner;
			return;
		}
		this.delegate.inject(carrierContext, carrier, setter);
	}
	extract(carrierContext, carrier, getter) {
		return this.delegate.extract(carrierContext, carrier, getter);
	}
	fields() {
		return this.delegate.fields();
	}
};
function ownsGlobalPropagator(owner) {
	const probe = {};
	propagation.inject(ROOT_CONTEXT.setValue(PROPAGATOR_OWNER_KEY, probe), {}, { set() {} });
	return probe.owner === owner;
}
function ownsGlobalContextManager(owner) {
	const probe = {};
	context.with(ROOT_CONTEXT.setValue(CONTEXT_OWNER_KEY, probe), () => {});
	return probe.owner === owner;
}
function createConfiguredPropagator(warn) {
	const names = (getStringListFromEnv("OTEL_PROPAGATORS") ?? DEFAULT_PROPAGATORS).map((name) => name.toLowerCase());
	if (names.includes("none")) return null;
	const propagators = [...new Set(names)].flatMap((name) => {
		switch (name) {
			case "tracecontext": return [new W3CTraceContextPropagator()];
			case "baggage": return [new W3CBaggagePropagator()];
			case "b3": return [new B3Propagator()];
			case "b3multi": return [new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER })];
			case "jaeger":
				warn("The Jaeger propagator is deprecated and will be removed in a future release. Use the W3C TraceContext propagator (\"tracecontext\") instead.");
				return [new JaegerPropagator()];
			default:
				warn(`Propagator "${name}" requested through environment variable is unavailable.`);
				return [];
		}
	});
	if (propagators.length === 0) return null;
	return propagators.length === 1 ? propagators[0] : new CompositePropagator({ propagators });
}
function registerOwnedSdkRuntime(warn) {
	const owner = {};
	const contextManager = new OwnedContextManager(owner).enable();
	const ownsContext = context.setGlobalContextManager(contextManager);
	if (!ownsContext) contextManager.disable();
	const propagator = createConfiguredPropagator(warn);
	const ownsPropagation = propagator ? propagation.setGlobalPropagator(new OwnedPropagator(propagator, owner)) : false;
	if (!ownsContext && !ownsPropagation) return null;
	return () => {
		if (ownsPropagation && ownsGlobalPropagator(owner)) propagation.disable();
		if (ownsContext && ownsGlobalContextManager(owner)) context.disable();
		else if (ownsContext) contextManager.disable();
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorder-runtime.ts
function createDiagnosticsRecorderRuntime(params) {
	return {
		...params.metrics,
		...params.traces,
		contentCapturePolicy: params.contentCapturePolicy,
		tracesEnabled: params.tracesEnabled
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-harness.ts
function createHarnessRecorders(runtime) {
	const { harnessDurationHistogram, modelFailoverCounter, activeTrustedSpans, spanWithDuration, trustedTraceContext, activeTrustedParentContext, trackTrustedSpan, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const harnessRunMetricAttrs = (evt) => ({
		"openclaw.harness.id": normalizeDiagnosticValue(evt.harnessId, "unknown"),
		"openclaw.harness.plugin": normalizeDiagnosticValue(evt.pluginId),
		...evt.type === "harness.run.started" ? {} : { "openclaw.outcome": evt.type === "harness.run.error" ? "error" : evt.outcome },
		"openclaw.provider": normalizeDiagnosticValue(evt.provider, "unknown"),
		"openclaw.model": normalizeDiagnosticValue(evt.model, "unknown"),
		...evt.channel ? { "openclaw.channel": normalizeDiagnosticValue(evt.channel) } : {}
	});
	const recordHarnessRunStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.harness.run", harnessRunMetricAttrs(evt), void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
	};
	const recordHarnessRunCompleted = (evt, metadata, privateData) => {
		harnessDurationHistogram.record(evt.durationMs, harnessRunMetricAttrs(evt));
		if (!tracesEnabled) return;
		const spanAttrs = { ...harnessRunMetricAttrs(evt) };
		if (evt.resultClassification) spanAttrs["openclaw.harness.result_classification"] = normalizeDiagnosticValue(evt.resultClassification);
		if (typeof evt.yieldDetected === "boolean") spanAttrs["openclaw.harness.yield_detected"] = evt.yieldDetected;
		if (evt.itemLifecycle) {
			spanAttrs["openclaw.harness.items.started"] = evt.itemLifecycle.startedCount;
			spanAttrs["openclaw.harness.items.completed"] = evt.itemLifecycle.completedCount;
			spanAttrs["openclaw.harness.items.active"] = evt.itemLifecycle.activeCount;
		}
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		if (redactedError) spanAttrs["openclaw.error"] = redactedError;
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.harness.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError ?? "error"
		});
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const recordHarnessRunError = (evt, metadata, privateData) => {
		const errorType = normalizeDiagnosticValue(evt.errorCategory, "other");
		const attrs = {
			...harnessRunMetricAttrs(evt),
			"openclaw.harness.phase": evt.phase,
			"openclaw.errorCategory": errorType
		};
		harnessDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		const spanAttrs = {
			...attrs,
			"error.type": errorType,
			...redactedError ? { "openclaw.error": redactedError } : {},
			...evt.cleanupFailed ? { "openclaw.harness.cleanup_failed": true } : {}
		};
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.harness.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError ?? errorType
		});
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const recordContextAssembled = (evt, metadata) => {
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.context.message_count": evt.messageCount,
			"openclaw.context.history_text_chars": evt.historyTextChars,
			"openclaw.context.history_image_blocks": evt.historyImageBlocks,
			"openclaw.context.max_message_text_chars": evt.maxMessageTextChars,
			"openclaw.context.system_prompt_chars": evt.systemPromptChars,
			"openclaw.context.prompt_chars": evt.promptChars,
			"openclaw.context.prompt_images": evt.promptImages
		};
		addRunAttrs(spanAttrs, evt);
		if (evt.contextTokenBudget !== void 0) spanAttrs["openclaw.context.token_budget"] = evt.contextTokenBudget;
		if (evt.reserveTokens !== void 0) spanAttrs["openclaw.context.reserve_tokens"] = evt.reserveTokens;
		spanWithDuration("openclaw.context.assembled", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordModelFailover = (evt, metadata) => {
		const metricAttrs = {
			"openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown"),
			"openclaw.failover.suspended": evt.suspended === void 0 ? "unknown" : String(evt.suspended),
			"openclaw.lane": normalizeDiagnosticLane(evt.lane, "unknown"),
			"openclaw.model": normalizeDiagnosticValue(evt.fromModel),
			"openclaw.provider": normalizeDiagnosticValue(evt.fromProvider),
			"openclaw.failover.to_model": normalizeDiagnosticValue(evt.toModel),
			"openclaw.failover.to_provider": normalizeDiagnosticValue(evt.toProvider)
		};
		modelFailoverCounter.add(1, metricAttrs);
		if (!tracesEnabled) return;
		const spanAttrs = { "openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown") };
		if (evt.fromProvider) spanAttrs["openclaw.provider"] = evt.fromProvider;
		if (evt.fromModel) spanAttrs["openclaw.model"] = evt.fromModel;
		if (evt.toProvider) spanAttrs["openclaw.failover.to_provider"] = evt.toProvider;
		if (evt.toModel) spanAttrs["openclaw.failover.to_model"] = evt.toModel;
		if (evt.lane) spanAttrs["openclaw.lane"] = normalizeDiagnosticLane(evt.lane, "unknown");
		if (evt.suspended !== void 0) spanAttrs["openclaw.failover.suspended"] = evt.suspended;
		if (evt.cascadeDepth !== void 0) spanAttrs["openclaw.failover.cascade_depth"] = evt.cascadeDepth;
		spanWithDuration("openclaw.model.failover", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	return {
		recordHarnessRunStarted,
		recordHarnessRunCompleted,
		recordHarnessRunError,
		recordContextAssembled,
		recordModelFailover
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-genai-attributes.ts
function hasOtelSemconvOptIn(value, optIn) {
	return value?.split(",").map((part) => part.trim()).includes(optIn) ?? false;
}
function emitLatestGenAiSemconv() {
	return hasOtelSemconvOptIn(process.env[OTEL_SEMCONV_STABILITY_OPT_IN_ENV], GEN_AI_LATEST_EXPERIMENTAL_OPT_IN);
}
function genAiOperationName(api, observationUnit) {
	if (observationUnit === "turn") return GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT;
	const normalized = api?.trim().toLowerCase();
	if (!normalized) return "chat";
	if (normalized === "completions" || normalized.endsWith("-completions")) return "text_completion";
	if (normalized === "generate_content" || normalized.includes("generative-ai")) return "generate_content";
	return "chat";
}
function positiveFiniteNumber(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		minExclusive: true
	});
}
function nonNegativeFiniteNumber(value) {
	return asFiniteNumberInRange(value, { min: 0 });
}
function assignPositiveNumberAttr(attrs, key, value) {
	const normalized = positiveFiniteNumber(value);
	if (normalized !== void 0) attrs[key] = normalized;
}
function assignModelCallSizeTimingAttrs(attrs, evt) {
	assignPositiveNumberAttr(attrs, "openclaw.model_call.request_bytes", evt.requestPayloadBytes);
	assignPositiveNumberAttr(attrs, "openclaw.model_call.response_bytes", evt.responseStreamBytes);
	assignPositiveNumberAttr(attrs, "openclaw.model_call.time_to_first_byte_ms", evt.timeToFirstByteMs);
}
function assignNumberAttr(attrs, key, value) {
	const normalized = asFiniteNumber(value);
	if (normalized !== void 0) attrs[key] = normalized;
}
function modelCallPromptTokens(usage) {
	const promptTokens = nonNegativeFiniteNumber(usage.promptTokens);
	if (promptTokens !== void 0) return promptTokens;
	const input = nonNegativeFiniteNumber(usage.input);
	const cacheRead = nonNegativeFiniteNumber(usage.cacheRead);
	const cacheWrite = nonNegativeFiniteNumber(usage.cacheWrite);
	if (input === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	return (input ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0);
}
function assignModelCallPromptStatsAttrs(attrs, evt) {
	const stats = evt.promptStats;
	if (!stats) return;
	for (const [key, value] of [
		["openclaw.model_call.prompt.input_messages_count", stats.inputMessagesCount],
		["openclaw.model_call.prompt.input_messages_chars", stats.inputMessagesChars],
		["openclaw.model_call.prompt.system_prompt_chars", stats.systemPromptChars],
		["openclaw.model_call.prompt.tool_definitions_count", stats.toolDefinitionsCount],
		["openclaw.model_call.prompt.tool_definitions_chars", stats.toolDefinitionsChars],
		["openclaw.model_call.prompt.total_chars", stats.totalChars]
	]) assignNumberAttr(attrs, key, value);
}
function assignModelCallUsageAttrs(attrs, evt) {
	const usage = evt.usage;
	if (!usage) return;
	const promptTokens = modelCallPromptTokens(usage);
	for (const [key, value] of [
		["openclaw.model_call.usage.input_tokens", usage.input],
		["openclaw.model_call.usage.output_tokens", usage.output],
		["openclaw.model_call.usage.cache_read_input_tokens", usage.cacheRead],
		["openclaw.model_call.usage.cache_creation_input_tokens", usage.cacheWrite],
		["openclaw.model_call.usage.reasoning_output_tokens", usage.reasoningTokens],
		["openclaw.model_call.usage.prompt_tokens", promptTokens],
		["openclaw.model_call.usage.total_tokens", usage.total],
		["gen_ai.usage.input_tokens", promptTokens],
		["gen_ai.usage.output_tokens", usage.output],
		["gen_ai.usage.cache_read.input_tokens", usage.cacheRead],
		["gen_ai.usage.cache_creation.input_tokens", usage.cacheWrite]
	]) {
		const normalized = nonNegativeFiniteNumber(value);
		if (normalized !== void 0) attrs[key] = normalized;
	}
}
function assignGenAiSpanIdentityAttrs(attrs, input) {
	if (emitLatestGenAiSemconv()) attrs["gen_ai.provider.name"] = normalizeDiagnosticValue(input.provider);
	else attrs["gen_ai.system"] = normalizeDiagnosticValue(input.provider);
	if (input.model) attrs["gen_ai.request.model"] = redactSensitiveText(input.model.trim());
	attrs["gen_ai.operation.name"] = genAiOperationName(input.api, input.observationUnit);
}
function assignGenAiModelCallAttrs(attrs, evt) {
	assignGenAiSpanIdentityAttrs(attrs, evt);
	attrs["openclaw.model_call.observation_unit"] = modelCallObservationUnit(evt);
}
function modelCallObservationUnit(evt) {
	return evt.observationUnit ?? "request";
}
function modelCallSpanName(evt) {
	if (!emitLatestGenAiSemconv()) return "openclaw.model.call";
	const operationName = genAiOperationName(evt.api, evt.observationUnit);
	return operationName === GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT ? operationName : `${operationName} ${normalizeDiagnosticValue(evt.model)}`;
}
function modelCallSpanKind() {
	return SpanKind.CLIENT;
}
function addUpstreamRequestIdSpanEvent(span, upstreamRequestIdHash) {
	if (!upstreamRequestIdHash) return;
	const boundedHash = normalizeDiagnosticValue(upstreamRequestIdHash);
	if (boundedHash === "unknown") return;
	span.addEvent?.("openclaw.provider.request", { "openclaw.upstreamRequestIdHash": boundedHash });
}
//#endregion
//#region extensions/diagnostics-otel/src/service-genai-content.ts
function textPart(content) {
	return {
		type: "text",
		content
	};
}
function textPartContent(part) {
	if (part.type !== "text") return;
	if (typeof part.text === "string") return part.text;
	return typeof part.content === "string" ? part.content : void 0;
}
function toolCallResponseValue(value) {
	if (!Array.isArray(value)) return value;
	const textItems = [];
	for (const item of value) {
		const text = typeof item === "string" ? item : isRecord(item) ? textPartContent(item) : void 0;
		if (typeof text !== "string") return value;
		textItems.push(text);
	}
	const kept = textItems.slice(0, 200);
	const joined = kept.filter((text) => text.length > 0).join("\n");
	if (joined.length === 0) return value;
	const omitted = textItems.length - kept.length;
	return omitted > 0 ? `${joined}\n...(${omitted} more text parts omitted)` : joined;
}
function toolCallResponsePart(part) {
	return {
		type: "tool_call_response",
		...typeof part.id === "string" ? { id: part.id } : {},
		response: toolCallResponseValue(part.response ?? part.result ?? part.content ?? part.details ?? "")
	};
}
function contentParts(value) {
	if (typeof value === "string") return value.length > 0 ? [textPart(value)] : [];
	if (!Array.isArray(value)) {
		if (value === void 0 || value === null) return [];
		if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return [textPart(String(value))];
		const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
		return json ? [textPart(json)] : [];
	}
	const parts = [];
	for (const part of value) {
		if (typeof part === "string") {
			if (part.length > 0) parts.push(textPart(part));
			continue;
		}
		if (!isRecord(part)) continue;
		const text = textPartContent(part);
		if (text !== void 0) parts.push(textPart(text));
		else if ((part.type === "toolCall" || part.type === "tool_call") && typeof part.name === "string") parts.push({
			type: "tool_call",
			name: part.name,
			...typeof part.id === "string" ? { id: part.id } : {},
			...part.arguments !== void 0 ? { arguments: part.arguments } : {}
		});
		else if (part.type === "tool_call_response") parts.push(toolCallResponsePart(part));
		else if (part.type === "image") {
			const data = typeof part.data === "string" ? part.data : void 0;
			parts.push({
				type: "blob",
				modality: "image",
				...typeof part.mimeType === "string" ? { mime_type: part.mimeType } : {},
				...typeof part.mime_type === "string" ? { mime_type: part.mime_type } : {},
				...data ? { content: data } : {}
			});
		}
	}
	return parts;
}
const INTERNAL_REASONING_MESSAGE_FIELDS = [
	"reasoning",
	"reasoning_content",
	"reasoning_details",
	"reasoning_text"
];
const INTERNAL_REASONING_PART_FIELDS = [
	"textSignature",
	"thinkingSignature",
	"thoughtSignature"
];
function redactInternalReasoningParts(value) {
	if (!Array.isArray(value)) return value;
	return value.map((part) => {
		if (isRecord(part) && (part.type === "thinking" || part.type === "redacted_thinking" || part.type === "reasoning")) return {
			type: "reasoning",
			redacted: true
		};
		if (!isRecord(part)) return part;
		const redacted = { ...part };
		for (const field of INTERNAL_REASONING_PART_FIELDS) delete redacted[field];
		return redacted;
	});
}
function redactInternalReasoningFromMessage(value) {
	if (!isRecord(value)) return value;
	const redacted = { ...value };
	for (const field of INTERNAL_REASONING_MESSAGE_FIELDS) delete redacted[field];
	const hasContentParts = Array.isArray(value.content);
	const hasExplicitParts = Array.isArray(value.parts);
	if (hasContentParts) redacted.content = redactInternalReasoningParts(value.content);
	if (hasExplicitParts) redacted.parts = redactInternalReasoningParts(value.parts);
	return redacted;
}
function redactInternalReasoningFromMessages(value) {
	return Array.isArray(value) ? value.map((message) => redactInternalReasoningFromMessage(message)) : redactInternalReasoningFromMessage(value);
}
function normalizeGenAiMessage(value, fallbackRole = "user") {
	if (typeof value === "string") return {
		role: fallbackRole,
		parts: [textPart(value)]
	};
	if (!isRecord(value)) return;
	const rawRole = typeof value.role === "string" ? value.role : fallbackRole;
	const role = rawRole === "toolResult" ? "tool" : rawRole;
	let parts;
	if (role === "tool") {
		const explicitParts = contentParts(value.parts);
		parts = explicitParts.length > 0 ? explicitParts : [toolCallResponsePart({
			id: value.toolCallId,
			response: value.content ?? value.details ?? ""
		})];
	} else parts = contentParts(value.parts ?? value.content);
	if (parts.length === 0) return;
	return {
		role,
		parts,
		...typeof value.name === "string" ? { name: value.name } : {},
		...typeof value.finish_reason === "string" ? { finish_reason: value.finish_reason } : {},
		...typeof value.stopReason === "string" ? { finish_reason: value.stopReason } : {}
	};
}
function normalizeGenAiMessages(value, fallbackRole) {
	const source = Array.isArray(value) ? value : value === void 0 ? [] : [value];
	const messages = [];
	for (const item of source.slice(0, 200)) {
		const message = normalizeGenAiMessage(item, fallbackRole);
		if (message) messages.push(message);
	}
	return messages;
}
function normalizeGenAiToolDefinition(value) {
	if (!isRecord(value) || typeof value.name !== "string" || value.name.trim().length === 0) return;
	return {
		type: typeof value.type === "string" ? value.type : "function",
		name: value.name,
		...typeof value.description === "string" ? { description: value.description } : {},
		...value.parameters !== void 0 ? { parameters: value.parameters } : {}
	};
}
function normalizeGenAiToolDefinitions(value) {
	if (!Array.isArray(value)) return [];
	const definitions = [];
	for (const item of value.slice(0, 200)) {
		const definition = normalizeGenAiToolDefinition(item);
		if (definition) definitions.push(definition);
	}
	return definitions;
}
function assignJsonAttribute(attributes, key, value) {
	const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (json) attributes[key] = json;
}
function assignGenAiModelContentAttributes(attributes, content, policy) {
	if (policy.systemPrompt && typeof content?.systemPrompt === "string") {
		const systemInstructions = [textPart(content.systemPrompt)];
		assignJsonAttribute(attributes, ATTR_GEN_AI_SYSTEM_INSTRUCTIONS, systemInstructions);
	}
	if (policy.inputMessages) {
		const inputMessages = normalizeGenAiMessages(content?.inputMessages, "user");
		if (inputMessages.length > 0) {
			assignJsonAttribute(attributes, ATTR_GEN_AI_INPUT_MESSAGES, inputMessages);
			assignJsonAttribute(attributes, "input.value", inputMessages);
			attributes["input.mime_type"] = "application/json";
		}
	}
	if (policy.toolDefinitions) {
		const toolDefinitions = normalizeGenAiToolDefinitions(content?.toolDefinitions);
		if (toolDefinitions.length > 0) assignJsonAttribute(attributes, ATTR_GEN_AI_TOOL_DEFINITIONS, toolDefinitions);
	}
	if (policy.outputMessages) {
		const outputMessages = normalizeGenAiMessages(content?.outputMessages, "assistant");
		if (outputMessages.length > 0) {
			assignJsonAttribute(attributes, ATTR_GEN_AI_OUTPUT_MESSAGES, outputMessages);
			assignJsonAttribute(attributes, "output.value", outputMessages);
			attributes["output.mime_type"] = "application/json";
		}
	}
}
function assignOtelContentAttribute(attributes, key, value) {
	const normalized = normalizeOtelContentValue(value);
	if (normalized) attributes[key] = normalized;
}
function assignOtelToolIdentityAttributes(attributes, evt) {
	attributes["gen_ai.operation.name"] = GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL;
	const toolCallId = evt.toolCallId?.trim();
	if (toolCallId) attributes[ATTR_GEN_AI_TOOL_CALL_ID] = toolCallId;
}
function assignOtelModelContentAttributes(attributes, content, policy) {
	const redactedContent = content ? {
		...content,
		inputMessages: redactInternalReasoningFromMessages(content.inputMessages),
		outputMessages: redactInternalReasoningFromMessages(content.outputMessages)
	} : void 0;
	assignGenAiModelContentAttributes(attributes, redactedContent, policy);
	if (policy.inputMessages) assignOtelContentAttribute(attributes, "openclaw.content.input_messages", redactedContent?.inputMessages);
	if (policy.toolDefinitions) assignOtelContentAttribute(attributes, "openclaw.content.tool_definitions", content?.toolDefinitions);
	if (policy.outputMessages) assignOtelContentAttribute(attributes, "openclaw.content.output_messages", redactedContent?.outputMessages);
	if (policy.systemPrompt) assignOtelContentAttribute(attributes, "openclaw.content.system_prompt", content?.systemPrompt);
}
function assignOtelToolContentAttributes(attributes, content, policy) {
	if (policy.toolInputs) {
		const toolInput = normalizeOtelContentValue(content?.toolInput);
		if (toolInput) {
			attributes[ATTR_GEN_AI_TOOL_CALL_ARGUMENTS] = toolInput;
			attributes["openclaw.content.tool_input"] = toolInput;
		}
	}
	if (policy.toolOutputs) {
		const toolOutput = normalizeOtelContentValue(content?.toolOutput);
		if (toolOutput) {
			attributes[ATTR_GEN_AI_TOOL_CALL_RESULT] = toolOutput;
			attributes["openclaw.content.tool_output"] = toolOutput;
		}
	}
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-model.ts
function createModelRecorders(runtime) {
	const { genAiOperationDurationHistogram, modelCallDurationHistogram, modelCallRequestBytesHistogram, modelCallResponseBytesHistogram, modelCallTimeToFirstByteHistogram, spanWithDuration, activeTrustedParentContext, trackTrustedSpan, getTrackedInternalOrTrustedSpan, takeTrackedTrustedSpan, setSpanAttrs, contentCapturePolicy, tracesEnabled } = runtime;
	const modelCallMetricAttrs = (evt) => ({
		"openclaw.provider": evt.provider,
		"openclaw.model": evt.model,
		"openclaw.api": normalizeDiagnosticValue(evt.api),
		"openclaw.transport": normalizeDiagnosticValue(evt.transport),
		"openclaw.model_call.observation_unit": modelCallObservationUnit(evt)
	});
	const recordModelCallSizeTimingMetrics = (evt, attrs) => {
		const requestPayloadBytes = positiveFiniteNumber(evt.requestPayloadBytes);
		if (requestPayloadBytes !== void 0) modelCallRequestBytesHistogram.record(requestPayloadBytes, attrs);
		const responseStreamBytes = positiveFiniteNumber(evt.responseStreamBytes);
		if (responseStreamBytes !== void 0) modelCallResponseBytesHistogram.record(responseStreamBytes, attrs);
		const timeToFirstByteMs = positiveFiniteNumber(evt.timeToFirstByteMs);
		if (timeToFirstByteMs !== void 0) modelCallTimeToFirstByteHistogram.record(timeToFirstByteMs, attrs);
	};
	const recordModelCallStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		if (trackedSpan) return trackedSpan.spanContext();
		const spanAttrs = {
			"openclaw.provider": evt.provider,
			"openclaw.model": evt.model
		};
		assignGenAiModelCallAttrs(spanAttrs, evt);
		if (evt.api) spanAttrs["openclaw.api"] = evt.api;
		if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
		assignModelCallPromptStatsAttrs(spanAttrs, evt);
		return trackTrustedSpan(evt, metadata, spanWithDuration(modelCallSpanName(evt), spanAttrs, void 0, {
			kind: modelCallSpanKind(),
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		})).spanContext();
	};
	const recordModelCallFinished = (evt, metadata, modelContent) => {
		const errorType = evt.type === "model.call.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : void 0;
		const metricAttrs = {
			...modelCallMetricAttrs(evt),
			...errorType !== void 0 ? { "openclaw.errorCategory": errorType } : {},
			...evt.type === "model.call.error" && evt.failureKind ? { "openclaw.failureKind": normalizeDiagnosticValue(evt.failureKind, "other") } : {}
		};
		modelCallDurationHistogram.record(evt.durationMs, metricAttrs);
		recordModelCallSizeTimingMetrics(evt, metricAttrs);
		genAiOperationDurationHistogram.record(evt.durationMs / 1e3, {
			"gen_ai.operation.name": genAiOperationName(evt.api, evt.observationUnit),
			"gen_ai.provider.name": normalizeDiagnosticValue(evt.provider),
			"gen_ai.request.model": normalizeDiagnosticValue(evt.model),
			...errorType ? { "error.type": errorType } : {}
		});
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.provider": evt.provider,
			"openclaw.model": evt.model,
			...errorType !== void 0 ? {
				"openclaw.errorCategory": errorType,
				"error.type": errorType
			} : {}
		};
		if (evt.type === "model.call.error" && evt.failureKind) spanAttrs["openclaw.failureKind"] = normalizeDiagnosticValue(evt.failureKind, "other");
		assignGenAiModelCallAttrs(spanAttrs, evt);
		if (evt.api) spanAttrs["openclaw.api"] = evt.api;
		if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
		assignModelCallSizeTimingAttrs(spanAttrs, evt);
		assignModelCallPromptStatsAttrs(spanAttrs, evt);
		assignModelCallUsageAttrs(spanAttrs, evt);
		assignOtelModelContentAttributes(spanAttrs, modelContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration(modelCallSpanName(evt), spanAttrs, evt.durationMs, {
			kind: modelCallSpanKind(),
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		addUpstreamRequestIdSpanEvent(span, evt.upstreamRequestIdHash);
		if (evt.type === "model.call.error") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(evt.ts);
	};
	return {
		recordModelCallStarted,
		recordModelCallFinished
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-operations.ts
function createOperationsRecorders(runtime) {
	const { durationHistogram, gatewayRpcRequestsCounter, gatewayRpcOutcomesCounter, gatewayRpcFirstResponseHistogram, gatewayRpcHandlerHistogram, gatewayRpcAdmissionHistogram, gatewayRpcQueueWaitHistogram, queueDepthHistogram, queueWaitHistogram, laneEnqueueCounter, laneDequeueCounter, sessionStateCounter, sessionTurnCreatedCounter, sessionStuckCounter, sessionStuckAgeHistogram, sessionRecoveryRequestedCounter, sessionRecoveryCompletedCounter, sessionRecoveryAgeHistogram, talkEventCounter, talkEventDurationHistogram, talkAudioBytesHistogram, runAttemptCounter, toolLoopCounter, memoryRssHistogram, memoryHeapUsedHistogram, memoryHeapTotalHistogram, memoryExternalHistogram, memoryArrayBuffersHistogram, memoryPressureCounter, asyncQueueDroppedCounter, tracer, activeTrustedSpans, spanWithDuration, trustedTraceContext, activeTrustedParentContext, internalOrTrustedExplicitParentContext, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const recordGatewayRpc = (evt, metadata) => {
		if (!metadata.trusted) return;
		const attrs = { "openclaw.gateway.rpc.method": evt.method };
		if (evt.phase === "received") {
			gatewayRpcRequestsCounter.add(1, attrs);
			return;
		}
		const outcomeAttrs = {
			"openclaw.gateway.rpc.phase": evt.phase,
			"openclaw.gateway.rpc.outcome": evt.outcome
		};
		gatewayRpcOutcomesCounter.add(1, outcomeAttrs);
		switch (evt.phase) {
			case "response":
				if (evt.outcome === "ok" || evt.outcome === "error") gatewayRpcFirstResponseHistogram.record(evt.durationMs, attrs);
				break;
			case "handler":
				gatewayRpcHandlerHistogram.record(evt.durationMs, attrs);
				gatewayRpcAdmissionHistogram.record(evt.admissionMs, attrs);
				break;
			case "dispatch": if (evt.queueWaitMs !== void 0) gatewayRpcQueueWaitHistogram.record(evt.queueWaitMs, attrs);
		}
		if (!tracesEnabled) return;
		const span = spanWithDuration(`openclaw.gateway.rpc.${evt.phase}`, {
			...attrs,
			...outcomeAttrs,
			...evt.phase === "handler" ? { "openclaw.gateway.rpc.admission_ms": evt.admissionMs } : {},
			...evt.phase === "dispatch" ? { "openclaw.gateway.rpc.response": evt.response } : {}
		}, evt.durationMs, {
			endTimeMs: evt.ts,
			parentContext: internalOrTrustedExplicitParentContext(evt, metadata) ?? ROOT_CONTEXT
		});
		if (evt.outcome === "error" || evt.outcome === "threw") span.setStatus({ code: SpanStatusCode.ERROR });
		span.end(evt.ts);
	};
	const recordLaneEnqueue = (evt) => {
		const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
		laneEnqueueCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queueSize, attrs);
	};
	const recordLaneDequeue = (evt) => {
		const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
		laneDequeueCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queueSize, attrs);
		if (typeof evt.waitMs === "number") queueWaitHistogram.record(evt.waitMs, attrs);
	};
	const recordSessionState = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
		sessionStateCounter.add(1, attrs);
	};
	const recordSessionTurnCreated = (evt) => {
		sessionTurnCreatedCounter.add(1, {
			"openclaw.agent": normalizeDiagnosticValue(evt.agentId, "unknown"),
			"openclaw.channel": normalizeDiagnosticValue(evt.channel, "unknown"),
			"openclaw.trigger": evt.trigger
		});
	};
	const recordSessionStuck = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		sessionStuckCounter.add(1, attrs);
		if (typeof evt.ageMs === "number") sessionStuckAgeHistogram.record(evt.ageMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		spanAttrs["openclaw.queueDepth"] = evt.queueDepth ?? 0;
		spanAttrs["openclaw.ageMs"] = evt.ageMs;
		const span = tracer.startSpan("openclaw.session.stuck", { attributes: spanAttrs });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: "session stuck"
		});
		span.end();
	};
	const sessionRecoveryAttrs = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
		if (evt.activeWorkKind) attrs["openclaw.active_work_kind"] = evt.activeWorkKind;
		return attrs;
	};
	const recordSessionRecoveryRequested = (evt) => {
		const attrs = sessionRecoveryAttrs(evt);
		attrs["openclaw.action"] = evt.allowActiveAbort ? "abort" : "recover";
		sessionRecoveryRequestedCounter.add(1, attrs);
		sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
	};
	const recordSessionRecoveryCompleted = (evt) => {
		const attrs = sessionRecoveryAttrs(evt);
		attrs["openclaw.status"] = evt.status;
		attrs["openclaw.action"] = normalizeDiagnosticValue(evt.action, "unknown");
		if (evt.outcomeReason) attrs["openclaw.reason"] = redactSensitiveText(evt.outcomeReason);
		sessionRecoveryCompletedCounter.add(1, attrs);
		sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
	};
	const talkEventAttrs = (evt) => ({
		"openclaw.talk.brain": normalizeDiagnosticValue(evt.brain),
		"openclaw.talk.event_type": normalizeDiagnosticValue(evt.talkEventType),
		"openclaw.talk.mode": normalizeDiagnosticValue(evt.mode),
		"openclaw.talk.provider": normalizeDiagnosticValue(evt.provider),
		"openclaw.talk.transport": normalizeDiagnosticValue(evt.transport)
	});
	const recordTalkEvent = (evt, metadata) => {
		if (!metadata.trusted) return;
		const attrs = talkEventAttrs(evt);
		talkEventCounter.add(1, attrs);
		if (typeof evt.durationMs === "number") talkEventDurationHistogram.record(evt.durationMs, attrs);
		if (typeof evt.byteLength === "number") talkAudioBytesHistogram.record(evt.byteLength, attrs);
	};
	const recordRunAttempt = (evt) => {
		runAttemptCounter.add(1, { "openclaw.attempt": evt.attempt });
	};
	const toolLoopAttrs = (evt) => ({
		"openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool"),
		"openclaw.loop.level": evt.level,
		"openclaw.loop.action": evt.action,
		"openclaw.loop.detector": evt.detector,
		"openclaw.loop.count": evt.count,
		...evt.pairedToolName ? { "openclaw.loop.paired_tool": normalizeDiagnosticValue(evt.pairedToolName, "tool") } : {}
	});
	const recordToolLoop = (evt) => {
		const attrs = toolLoopAttrs(evt);
		toolLoopCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const span = spanWithDuration("openclaw.tool.loop", attrs, 0, { endTimeMs: evt.ts });
		if (evt.level === "critical" || evt.action === "block") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: `${evt.detector}:${evt.action}`
		});
		span.end(evt.ts);
	};
	const recordMemoryUsageMetrics = (evt, attrs = {}) => {
		memoryRssHistogram.record(evt.memory.rssBytes, attrs);
		memoryHeapUsedHistogram.record(evt.memory.heapUsedBytes, attrs);
		memoryHeapTotalHistogram.record(evt.memory.heapTotalBytes, attrs);
		memoryExternalHistogram.record(evt.memory.externalBytes, attrs);
		memoryArrayBuffersHistogram.record(evt.memory.arrayBuffersBytes, attrs);
	};
	const recordMemorySample = (evt) => {
		recordMemoryUsageMetrics(evt);
	};
	const recordMemoryPressure = (evt) => {
		const attrs = {
			"openclaw.memory.level": evt.level,
			"openclaw.memory.reason": evt.reason
		};
		memoryPressureCounter.add(1, attrs);
		recordMemoryUsageMetrics(evt, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.memory.rss_bytes": evt.memory.rssBytes,
			"openclaw.memory.heap_used_bytes": evt.memory.heapUsedBytes,
			"openclaw.memory.heap_total_bytes": evt.memory.heapTotalBytes,
			"openclaw.memory.external_bytes": evt.memory.externalBytes,
			"openclaw.memory.array_buffers_bytes": evt.memory.arrayBuffersBytes,
			...evt.thresholdBytes !== void 0 ? { "openclaw.memory.threshold_bytes": evt.thresholdBytes } : {},
			...evt.rssGrowthBytes !== void 0 ? { "openclaw.memory.rss_growth_bytes": evt.rssGrowthBytes } : {},
			...evt.windowMs !== void 0 ? { "openclaw.memory.window_ms": evt.windowMs } : {}
		};
		const span = spanWithDuration("openclaw.memory.pressure", spanAttrs, 0, { endTimeMs: evt.ts });
		if (evt.level === "critical") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: evt.reason
		});
		span.end(evt.ts);
	};
	const recordAsyncQueueDropped = (evt) => {
		asyncQueueDroppedCounter.add(evt.droppedEvents, { "openclaw.diagnostic.async_queue.drop_class": "total" });
		if (evt.droppedTrustedEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedTrustedEvents, { "openclaw.diagnostic.async_queue.drop_class": "trusted" });
		if (evt.droppedUntrustedEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedUntrustedEvents, { "openclaw.diagnostic.async_queue.drop_class": "untrusted" });
		if (evt.droppedPriorityEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedPriorityEvents, { "openclaw.diagnostic.async_queue.drop_class": "priority" });
	};
	const recordRunCompleted = (evt, metadata, privateData) => {
		const attrs = {
			"openclaw.outcome": evt.outcome,
			"openclaw.provider": evt.provider ?? "unknown",
			"openclaw.model": evt.model ?? "unknown"
		};
		if (evt.channel) attrs["openclaw.channel"] = evt.channel;
		if (evt.blockedBy) attrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
		durationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { "openclaw.outcome": evt.outcome };
		addRunAttrs(spanAttrs, evt);
		if (evt.blockedBy) spanAttrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
		if (evt.errorCategory) spanAttrs["openclaw.errorCategory"] = normalizeDiagnosticValue(evt.errorCategory, "other");
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		if (redactedError) spanAttrs["openclaw.error"] = redactedError;
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error") {
			const message = redactedError ?? (evt.errorCategory ? redactSensitiveText(evt.errorCategory) : void 0);
			span.setStatus({
				code: SpanStatusCode.ERROR,
				...message ? { message } : {}
			});
		}
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	return {
		recordGatewayRpc,
		recordLaneEnqueue,
		recordLaneDequeue,
		recordSessionState,
		recordSessionTurnCreated,
		recordSessionStuck,
		recordSessionRecoveryRequested,
		recordSessionRecoveryCompleted,
		recordTalkEvent,
		recordRunAttempt,
		recordToolLoop,
		recordMemoryUsageMetrics,
		recordMemorySample,
		recordMemoryPressure,
		recordAsyncQueueDropped,
		recordRunCompleted
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-tools.ts
function createToolAndSystemRecorders(runtime) {
	const { gcDurationHistogram, gatewayEventLoopDelayMaxHistogram, gatewayEventLoopObservedCounter, queueDepthHistogram, skillUsedCounter, toolExecutionDurationHistogram, toolExecutionBlockedCounter, execProcessDurationHistogram, payloadLargeCounter, payloadLargeBytesHistogram, livenessWarningCounter, livenessEventLoopDelayP99Histogram, livenessEventLoopDelayMaxHistogram, livenessEventLoopUtilizationHistogram, livenessCpuCoreRatioHistogram, telemetryExporterCounter, spanWithDuration, activeTrustedParentContext, exportedInternalOrTrustedContext, trackTrustedSpan, getTrackedInternalOrTrustedSpan, takeTrackedTrustedSpan, setSpanAttrs, addRunAttrs, paramsSummaryAttrs, contentCapturePolicy, tracesEnabled } = runtime;
	const toolExecutionBaseAttrs = (evt) => ({
		"openclaw.toolName": evt.toolName,
		"openclaw.tool.source": normalizeDiagnosticValue(evt.toolSource, "core"),
		"gen_ai.tool.name": evt.toolName,
		...evt.toolOwner ? { "openclaw.tool.owner": normalizeDiagnosticValue(evt.toolOwner) } : {},
		...paramsSummaryAttrs(evt.paramsSummary)
	});
	const toolTimestampMs = (evt) => evt.sourceTimestampMs ?? evt.ts;
	const skillUsedAttrs = (evt) => ({
		"openclaw.skill.name": normalizeDiagnosticValue(evt.skillName, "skill"),
		"openclaw.skill.source": normalizeDiagnosticValue(evt.skillSource),
		"openclaw.skill.activation": normalizeDiagnosticValue(evt.activation),
		...evt.agentId ? { "openclaw.agent": normalizeDiagnosticValue(evt.agentId) } : {},
		...evt.toolName ? { "openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool") } : {}
	});
	const recordSkillUsed = (evt, metadata) => {
		if (!metadata.trusted) return;
		const attrs = skillUsedAttrs(evt);
		skillUsedCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		addRunAttrs(spanAttrs, evt);
		const span = spanWithDuration("openclaw.skill.used", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		span.end(evt.ts);
	};
	const recordToolExecutionStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		if (trackedSpan) return trackedSpan.spanContext();
		const spanAttrs = toolExecutionBaseAttrs(evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		return trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.tool.execution", spanAttrs, void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: toolTimestampMs(evt)
		})).spanContext();
	};
	const recordToolExecutionFinished = (evt, metadata, toolContent) => {
		const attrs = toolExecutionBaseAttrs(evt);
		if (evt.type === "tool.execution.error") attrs["openclaw.errorCategory"] = normalizeDiagnosticValue(evt.errorCategory, "other");
		toolExecutionDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		addRunAttrs(spanAttrs, evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		if (evt.type === "tool.execution.error" && evt.errorCode) spanAttrs["openclaw.errorCode"] = normalizeDiagnosticValue(evt.errorCode, "other");
		assignOtelToolContentAttributes(spanAttrs, toolContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration("openclaw.tool.execution", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: toolTimestampMs(evt)
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.type === "tool.execution.error") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(toolTimestampMs(evt));
	};
	const recordToolExecutionBlocked = (evt, metadata) => {
		toolExecutionBlockedCounter.add(1, {
			...toolExecutionBaseAttrs(evt),
			"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
		});
		if (!tracesEnabled) return;
		const spanAttrs = {
			...toolExecutionBaseAttrs(evt),
			"openclaw.outcome": "blocked",
			"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
		};
		addRunAttrs(spanAttrs, evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration("openclaw.tool.execution", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: toolTimestampMs(evt)
		});
		setSpanAttrs(span, spanAttrs);
		span.end(toolTimestampMs(evt));
	};
	const recordPayloadLarge = (evt) => {
		const attrs = {
			"openclaw.payload.action": evt.action,
			"openclaw.payload.surface": normalizeDiagnosticValue(evt.surface, "unknown"),
			"openclaw.channel": normalizeDiagnosticValue(evt.channel, "none"),
			"openclaw.plugin": normalizeDiagnosticValue(evt.pluginId, "none"),
			"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none")
		};
		payloadLargeCounter.add(1, attrs);
		const bytes = positiveFiniteNumber(evt.bytes);
		if (bytes !== void 0) payloadLargeBytesHistogram.record(bytes, attrs);
	};
	const recordExecProcessCompleted = (evt, metadata) => {
		const attrs = {
			"openclaw.exec.target": evt.target,
			"openclaw.exec.mode": evt.mode,
			"openclaw.outcome": evt.outcome
		};
		if (evt.failureKind) attrs["openclaw.failureKind"] = evt.failureKind;
		execProcessDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.exec.command_length": evt.commandLength
		};
		if (typeof evt.exitCode === "number") spanAttrs["openclaw.exec.exit_code"] = evt.exitCode;
		if (evt.exitSignal) spanAttrs["openclaw.exec.exit_signal"] = normalizeDiagnosticValue(evt.exitSignal, "other");
		if (evt.timedOut !== void 0) spanAttrs["openclaw.exec.timed_out"] = evt.timedOut;
		const span = spanWithDuration("openclaw.exec", spanAttrs, evt.durationMs, {
			parentContext: exportedInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		});
		if (evt.outcome === "failed") span.setStatus({
			code: SpanStatusCode.ERROR,
			...evt.failureKind ? { message: evt.failureKind } : {}
		});
		span.end(evt.ts);
	};
	const recordGcDuration = (evt, metadata) => {
		if (!metadata.trusted && !isInternalDiagnosticEventMetadata(metadata)) return;
		gcDurationHistogram.record(evt.durationMs, void 0, ROOT_CONTEXT);
	};
	const recordGatewayEventLoopSample = (evt, metadata) => {
		if (!metadata.trusted && !isInternalDiagnosticEventMetadata(metadata)) return;
		gatewayEventLoopDelayMaxHistogram.record(evt.delayMaxMs, void 0, ROOT_CONTEXT);
		gatewayEventLoopObservedCounter.add(evt.intervalMs, void 0, ROOT_CONTEXT);
	};
	const recordHeartbeat = (evt) => {
		queueDepthHistogram.record(evt.queued, { "openclaw.channel": "heartbeat" });
	};
	const recordLivenessWarning = (evt) => {
		const reason = evt.reasons.join(":");
		const attrs = { "openclaw.liveness.reason": normalizeDiagnosticValue(reason, "unknown") };
		livenessWarningCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queued, { "openclaw.channel": "liveness" });
		if (evt.eventLoopDelayP99Ms !== void 0) livenessEventLoopDelayP99Histogram.record(evt.eventLoopDelayP99Ms, attrs);
		if (evt.eventLoopDelayMaxMs !== void 0) livenessEventLoopDelayMaxHistogram.record(evt.eventLoopDelayMaxMs, attrs);
		if (evt.eventLoopUtilization !== void 0) livenessEventLoopUtilizationHistogram.record(evt.eventLoopUtilization, attrs);
		if (evt.cpuCoreRatio !== void 0) livenessCpuCoreRatioHistogram.record(evt.cpuCoreRatio, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.liveness.active": evt.active,
			"openclaw.liveness.waiting": evt.waiting,
			"openclaw.liveness.queued": evt.queued,
			"openclaw.liveness.interval_ms": evt.intervalMs,
			...evt.eventLoopDelayP99Ms !== void 0 ? { "openclaw.liveness.event_loop_delay_p99_ms": evt.eventLoopDelayP99Ms } : {},
			...evt.eventLoopDelayMaxMs !== void 0 ? { "openclaw.liveness.event_loop_delay_max_ms": evt.eventLoopDelayMaxMs } : {},
			...evt.eventLoopUtilization !== void 0 ? { "openclaw.liveness.event_loop_utilization": evt.eventLoopUtilization } : {},
			...evt.cpuUserMs !== void 0 ? { "openclaw.liveness.cpu_user_ms": evt.cpuUserMs } : {},
			...evt.cpuSystemMs !== void 0 ? { "openclaw.liveness.cpu_system_ms": evt.cpuSystemMs } : {},
			...evt.cpuTotalMs !== void 0 ? { "openclaw.liveness.cpu_total_ms": evt.cpuTotalMs } : {},
			...evt.cpuCoreRatio !== void 0 ? { "openclaw.liveness.cpu_core_ratio": evt.cpuCoreRatio } : {}
		};
		const span = spanWithDuration("openclaw.liveness.warning", spanAttrs, 0, { endTimeMs: evt.ts });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: reason
		});
		span.end(evt.ts);
	};
	const recordDiagnosticPhaseCompleted = (evt) => {
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.phase": normalizeDiagnosticValue(evt.name, "unknown"),
			...evt.cpuUserMs !== void 0 ? { "openclaw.phase.cpu_user_ms": evt.cpuUserMs } : {},
			...evt.cpuSystemMs !== void 0 ? { "openclaw.phase.cpu_system_ms": evt.cpuSystemMs } : {},
			...evt.cpuTotalMs !== void 0 ? { "openclaw.phase.cpu_total_ms": evt.cpuTotalMs } : {},
			...evt.cpuCoreRatio !== void 0 ? { "openclaw.phase.cpu_core_ratio": evt.cpuCoreRatio } : {}
		};
		for (const [key, value] of Object.entries(evt.details ?? {})) spanAttrs[`openclaw.phase.detail.${key}`] = typeof value === "boolean" ? String(value) : value;
		spanWithDuration("openclaw.diagnostic.phase", spanAttrs, evt.durationMs, { endTimeMs: evt.ts }).end(evt.ts);
	};
	const recordTelemetryExporter = (evt, metadata) => {
		if (!metadata.trusted) return;
		telemetryExporterCounter.add(1, {
			"openclaw.exporter": normalizeDiagnosticValue(evt.exporter, "unknown"),
			"openclaw.signal": evt.signal,
			"openclaw.status": evt.status,
			...evt.reason ? { "openclaw.reason": evt.reason } : {},
			...evt.errorCategory ? { "openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other") } : {}
		});
	};
	return {
		recordGcDuration,
		recordGatewayEventLoopSample,
		recordSkillUsed,
		recordToolExecutionStarted,
		recordToolExecutionFinished,
		recordToolExecutionBlocked,
		recordPayloadLarge,
		recordExecProcessCompleted,
		recordHeartbeat,
		recordLivenessWarning,
		recordDiagnosticPhaseCompleted,
		recordTelemetryExporter
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-usage.ts
function createUsageRecorders(runtime) {
	const { tokensCounter, genAiTokenUsageHistogram, costCounter, durationHistogram, contextHistogram, webhookReceivedCounter, webhookErrorCounter, webhookDurationHistogram, messageQueuedCounter, messageReceivedCounter, messageDispatchStartedCounter, messageDispatchCompletedCounter, messageDispatchDurationHistogram, messageProcessedCounter, messageDurationHistogram, messageDeliveryStartedCounter, messageDeliveryDurationHistogram, queueDepthHistogram, tracer, activeTrustedSpans, activeTrustedSpanAliases, trustedSpanAliasKey, spanWithDuration, trustedTraceContext, internalOrTrustedTraceContext, internalOrTrustedExplicitParentContext, activeTrustedParentContext, activeInternalOrTrustedContext, trackTrustedSpan, trackInternalOrTrustedSpan, getTrackedInternalOrTrustedSpan, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const recordModelUsage = (evt, metadata, hostPluginId) => {
		const attrs = {
			"openclaw.channel": evt.channel ?? "unknown",
			"openclaw.agent": normalizeDiagnosticValue(evt.agentId),
			"openclaw.provider": evt.provider ?? "unknown",
			"openclaw.model": evt.model ?? "unknown"
		};
		const genAiAttrs = {
			"gen_ai.operation.name": "chat",
			"gen_ai.provider.name": normalizeDiagnosticValue(evt.provider),
			"gen_ai.request.model": normalizeDiagnosticValue(evt.model)
		};
		const usage = evt.usage;
		if (usage.input) {
			tokensCounter.add(usage.input, {
				...attrs,
				"openclaw.token": "input"
			});
			genAiTokenUsageHistogram.record(usage.input, {
				...genAiAttrs,
				"gen_ai.token.type": "input"
			});
		}
		if (usage.output) {
			tokensCounter.add(usage.output, {
				...attrs,
				"openclaw.token": "output"
			});
			genAiTokenUsageHistogram.record(usage.output, {
				...genAiAttrs,
				"gen_ai.token.type": "output"
			});
		}
		if (usage.cacheRead) tokensCounter.add(usage.cacheRead, {
			...attrs,
			"openclaw.token": "cache_read"
		});
		if (usage.cacheWrite) tokensCounter.add(usage.cacheWrite, {
			...attrs,
			"openclaw.token": "cache_write"
		});
		if (usage.promptTokens) tokensCounter.add(usage.promptTokens, {
			...attrs,
			"openclaw.token": "prompt"
		});
		if (usage.total) tokensCounter.add(usage.total, {
			...attrs,
			"openclaw.token": "total"
		});
		if (evt.costUsd) costCounter.add(evt.costUsd, attrs);
		if (evt.durationMs) durationHistogram.record(evt.durationMs, attrs);
		if (evt.context?.limit) contextHistogram.record(evt.context.limit, {
			...attrs,
			"openclaw.context": "limit"
		});
		if (evt.context?.used) contextHistogram.record(evt.context.used, {
			...attrs,
			"openclaw.context": "used"
		});
		if (!tracesEnabled) return;
		const genAiInputTokens = usage.promptTokens ?? (usage.input ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
		const spanAttrs = {
			...attrs,
			"openclaw.tokens.input": usage.input ?? 0,
			"openclaw.tokens.output": usage.output ?? 0,
			"openclaw.tokens.cache_read": usage.cacheRead ?? 0,
			"openclaw.tokens.cache_write": usage.cacheWrite ?? 0,
			"openclaw.tokens.total": usage.total ?? 0
		};
		if (metadata.trusted && metadata.internal && hostPluginId) spanAttrs["openclaw.plugin"] = normalizeDiagnosticValue(hostPluginId);
		assignGenAiSpanIdentityAttrs(spanAttrs, evt);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.input_tokens", genAiInputTokens);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.output_tokens", usage.output);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_read.input_tokens", usage.cacheRead);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_creation.input_tokens", usage.cacheWrite);
		spanWithDuration("openclaw.model.usage", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordWebhookReceived = (evt) => {
		const attrs = {
			"openclaw.channel": evt.channel ?? "unknown",
			"openclaw.webhook": evt.updateType ?? "unknown"
		};
		webhookReceivedCounter.add(1, attrs);
	};
	const recordWebhookProcessed = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
		};
		if (typeof evt.durationMs === "number") webhookDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		spanWithDuration("openclaw.webhook.processed", spanAttrs, evt.durationMs).end();
	};
	const recordWebhookError = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
		};
		webhookErrorCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const redactedError = redactSensitiveText(evt.error);
		const spanAttrs = {
			...attrs,
			"openclaw.error": redactedError
		};
		const span = tracer.startSpan("openclaw.webhook.error", { attributes: spanAttrs });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError
		});
		span.end();
	};
	const recordMessageQueued = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageQueuedCounter.add(1, attrs);
		if (typeof evt.queueDepth === "number") queueDepthHistogram.record(evt.queueDepth, attrs);
	};
	const recordMessageReceived = (evt) => {
		messageReceivedCounter.add(1, {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		});
	};
	const recordMessageDispatchStarted = (evt, metadata) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageDispatchStartedCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext?.spanId || activeTrustedSpans.has(traceContext.spanId)) return;
		trackInternalOrTrustedSpan(evt, metadata, spanWithDuration("openclaw.message.processed", attrs, void 0, {
			parentContext: internalOrTrustedExplicitParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
	};
	const recordMessageDispatchCompleted = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.outcome": evt.outcome,
			"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none"),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageDispatchCompletedCounter.add(1, attrs);
		messageDispatchDurationHistogram.record(evt.durationMs, attrs);
	};
	const recordMessageProcessed = (evt, metadata) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.outcome": evt.outcome ?? "unknown"
		};
		messageProcessedCounter.add(1, attrs);
		if (typeof evt.durationMs === "number") messageDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		if (evt.reason) spanAttrs["openclaw.reason"] = normalizeDiagnosticValue(evt.reason, "unknown");
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		const span = trackedSpan ?? spanWithDuration("openclaw.message.processed", spanAttrs, evt.durationMs, {
			parentContext: internalOrTrustedExplicitParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error" && evt.error) span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.error)
		});
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (trackedSpan && traceContext?.spanId) {
			completeTrackedLifecycleSpan(traceContext, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const messageDeliveryAttrs = (evt) => ({
		"openclaw.channel": normalizeDiagnosticValue(evt.channel),
		"openclaw.delivery.kind": normalizeDiagnosticValue(evt.deliveryKind, "other")
	});
	const recordMessageDeliveryStarted = (evt) => {
		messageDeliveryStartedCounter.add(1, messageDeliveryAttrs(evt));
	};
	const recordMessageDeliveryCompleted = (evt, metadata) => {
		const attrs = {
			...messageDeliveryAttrs(evt),
			"openclaw.outcome": "completed"
		};
		messageDeliveryDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		spanWithDuration("openclaw.message.delivery", {
			...attrs,
			"openclaw.delivery.result_count": evt.resultCount
		}, evt.durationMs, {
			parentContext: activeInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordMessageDeliveryError = (evt, metadata) => {
		const attrs = {
			...messageDeliveryAttrs(evt),
			"openclaw.outcome": "error",
			"openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other")
		};
		messageDeliveryDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const span = spanWithDuration("openclaw.message.delivery", attrs, evt.durationMs, {
			parentContext: activeInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		});
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(evt.ts);
	};
	const recordRunStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const spanAttrs = {};
		addRunAttrs(spanAttrs, evt);
		const span = trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.run", spanAttrs, void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
		const parentSpanId = trustedTraceContext(evt, metadata)?.parentSpanId;
		if (parentSpanId && !activeTrustedSpans.has(parentSpanId)) {
			const owner = {
				kind: "run",
				id: evt.runId
			};
			activeTrustedSpanAliases.set(trustedSpanAliasKey(parentSpanId, owner), {
				span,
				spanId: parentSpanId,
				owner
			});
		}
	};
	return {
		recordModelUsage,
		recordWebhookReceived,
		recordWebhookProcessed,
		recordWebhookError,
		recordMessageQueued,
		recordMessageReceived,
		recordMessageDispatchStarted,
		recordMessageDispatchCompleted,
		recordMessageProcessed,
		recordMessageDeliveryStarted,
		recordMessageDeliveryCompleted,
		recordMessageDeliveryError,
		recordRunStarted
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-traces.ts
function createDiagnosticsTraceRuntime(tracer) {
	const activeTrustedSpans = /* @__PURE__ */ new Map();
	const activeTrustedSpanAliases = /* @__PURE__ */ new Map();
	const retainedTrustedSpanContexts = /* @__PURE__ */ new Map();
	const stopActiveTrustedSpans = () => {
		const stopAt = Date.now();
		retainedTrustedSpanContexts.clear();
		for (const span of /* @__PURE__ */ new Set([...activeTrustedSpans.values(), ...Array.from(activeTrustedSpanAliases.values(), (entry) => entry.span)])) span.end(stopAt);
		activeTrustedSpans.clear();
		activeTrustedSpanAliases.clear();
	};
	const spanWithDuration = (name, attributes, durationMs, options = {}) => {
		const endTimeMs = options.endTimeMs ?? Date.now();
		const startTime = typeof options.startTimeMs === "number" ? options.startTimeMs : typeof durationMs === "number" && durationMs >= 0 ? endTimeMs - durationMs : void 0;
		const parentContext = "parentContext" in options ? options.parentContext ?? void 0 : void 0;
		return tracer.startSpan(name, {
			attributes: redactOtelAttributes(attributes),
			...options.kind !== void 0 ? { kind: options.kind } : {},
			...startTime !== void 0 ? { startTime } : {}
		}, parentContext);
	};
	const trustedTraceContext = (evt, metadata) => metadata.trusted ? normalizeTraceContext(evt.trace) : void 0;
	const internalOrTrustedTraceContext = (evt, metadata) => metadata.internal ? normalizeTraceContext(evt.trace) : normalizedTrustedTraceContext(evt, metadata);
	const trustedSpanAliasOwner = (evt) => {
		if ("runId" in evt && evt.runId) return {
			kind: "run",
			id: evt.runId
		};
	};
	const sameTrustedSpanAliasOwner = (left, right) => Boolean(left && right && left.kind === right.kind && left.id === right.id);
	const trustedSpanAliasKey = (spanId, owner) => `${spanId}:${owner.kind}:${owner.id}`;
	const retainedTrustedSpanContextKey = (traceId, spanId, owner) => `${traceId}:${owner ? trustedSpanAliasKey(spanId, owner) : spanId}`;
	const retainedTrustedSpanContext = (traceContext, spanId, owner) => {
		if (!traceContext?.traceId || !spanId) return;
		const retained = (owner ? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId, owner)) : void 0) ?? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId));
		if (!retained) return;
		if (retained.owner && !sameTrustedSpanAliasOwner(retained.owner, owner)) return;
		return retained.spanContext;
	};
	const activeTrustedSpanAlias = (spanId, owner) => {
		if (!owner) return;
		const alias = activeTrustedSpanAliases.get(trustedSpanAliasKey(spanId, owner));
		if (!alias || !sameTrustedSpanAliasOwner(alias.owner, owner)) return;
		return alias.span;
	};
	const internalOrTrustedParentContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		const parentSpanId = traceContext?.parentSpanId ?? traceContext?.spanId;
		if (!traceContext || !parentSpanId) return;
		return contextForTraceContext({
			...traceContext,
			spanId: parentSpanId
		});
	};
	const internalOrTrustedExplicitParentContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext?.parentSpanId) return;
		return contextForTraceContext({
			...traceContext,
			spanId: traceContext.parentSpanId
		});
	};
	const activeTrustedParentContext = (evt, metadata) => {
		const traceContext = trustedTraceContext(evt, metadata);
		const parentSpanId = traceContext?.parentSpanId;
		if (!parentSpanId) return;
		const owner = trustedSpanAliasOwner(evt);
		const spanContext = (activeTrustedSpans.get(parentSpanId) ?? activeTrustedSpanAlias(parentSpanId, owner))?.spanContext() ?? retainedTrustedSpanContext(traceContext, parentSpanId, owner);
		if (!spanContext) return;
		return trace.setSpanContext(context.active(), spanContext);
	};
	const exportedInternalOrTrustedContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext) return;
		const owner = trustedSpanAliasOwner(evt);
		const activeSpan = (traceContext.spanId ? activeTrustedSpans.get(traceContext.spanId) ?? activeTrustedSpanAlias(traceContext.spanId, owner) : void 0) ?? (traceContext.parentSpanId ? activeTrustedSpans.get(traceContext.parentSpanId) ?? activeTrustedSpanAlias(traceContext.parentSpanId, owner) : void 0);
		if (activeSpan) return trace.setSpanContext(context.active(), activeSpan.spanContext());
		const retainedSpanContext = retainedTrustedSpanContext(traceContext, traceContext.spanId, owner) ?? retainedTrustedSpanContext(traceContext, traceContext.parentSpanId, owner);
		return retainedSpanContext ? trace.setSpanContext(context.active(), retainedSpanContext) : void 0;
	};
	const exportedSpanContextForDiagnosticTraceContext = (traceContext) => {
		if (!traceContext.spanId) return;
		const spanContext = activeTrustedSpans.get(traceContext.spanId)?.spanContext() ?? retainedTrustedSpanContext(traceContext, traceContext.spanId);
		return spanContext && isSpanContextValid(spanContext) ? spanContext : void 0;
	};
	const activeInternalOrTrustedContext = (evt, metadata) => exportedInternalOrTrustedContext(evt, metadata) ?? internalOrTrustedParentContext(evt, metadata);
	const trackTrustedSpan = (evt, metadata, span) => {
		const spanId = trustedTraceContext(evt, metadata)?.spanId;
		if (spanId) activeTrustedSpans.set(spanId, span);
		return span;
	};
	const trackInternalOrTrustedSpan = (evt, metadata, span) => {
		const spanId = internalOrTrustedTraceContext(evt, metadata)?.spanId;
		if (spanId) activeTrustedSpans.set(spanId, span);
		return span;
	};
	const takeTrackedTrustedSpan = (evt, metadata) => {
		const spanId = trustedTraceContext(evt, metadata)?.spanId;
		if (!spanId) return;
		const span = activeTrustedSpans.get(spanId);
		if (span) activeTrustedSpans.delete(spanId);
		return span;
	};
	const getTrackedInternalOrTrustedSpan = (evt, metadata) => {
		const spanId = internalOrTrustedTraceContext(evt, metadata)?.spanId;
		if (!spanId) return;
		return activeTrustedSpans.get(spanId);
	};
	const setSpanAttrs = (span, attributes) => {
		span.setAttributes?.(redactOtelAttributes(attributes));
	};
	const retainTrustedSpanContext = (traceId, spanId, spanContext, owner) => {
		retainedTrustedSpanContexts.set(retainedTrustedSpanContextKey(traceId, spanId, owner), {
			spanContext,
			...owner ? { owner } : {}
		});
		while (retainedTrustedSpanContexts.size > MAX_RETAINED_TRUSTED_SPAN_CONTEXTS) {
			const oldestKey = retainedTrustedSpanContexts.keys().next().value;
			if (!oldestKey) break;
			retainedTrustedSpanContexts.delete(oldestKey);
		}
	};
	const completeTrackedLifecycleSpan = (traceContext, span, endTimeMs) => {
		const spanId = traceContext.spanId;
		if (!spanId) {
			span.end(endTimeMs);
			return;
		}
		const spanContext = span.spanContext();
		const retainedKeys = [{ spanId }];
		const retainedAliasKeys = [];
		for (const [aliasKey, alias] of activeTrustedSpanAliases) if (alias.span === span) {
			retainedKeys.push({
				spanId: alias.spanId,
				owner: alias.owner
			});
			retainedAliasKeys.push(aliasKey);
		}
		if (activeTrustedSpans.get(spanId) === span) activeTrustedSpans.delete(spanId);
		for (const aliasKey of retainedAliasKeys) if (activeTrustedSpanAliases.get(aliasKey)?.span === span) activeTrustedSpanAliases.delete(aliasKey);
		span.end(endTimeMs);
		for (const retainedKey of retainedKeys) retainTrustedSpanContext(traceContext.traceId, retainedKey.spanId, spanContext, retainedKey.owner);
	};
	const addRunAttrs = (spanAttrs, evt) => {
		if (evt.provider) spanAttrs["openclaw.provider"] = evt.provider;
		if (evt.model) spanAttrs["openclaw.model"] = evt.model;
		if (evt.channel) spanAttrs["openclaw.channel"] = evt.channel;
		if (evt.trigger) spanAttrs["openclaw.trigger"] = evt.trigger;
	};
	const paramsSummaryAttrs = (summary) => {
		if (!summary) return {};
		return {
			"openclaw.tool.params.kind": summary.kind,
			..."length" in summary ? { "openclaw.tool.params.length": summary.length } : {}
		};
	};
	return {
		tracer,
		activeTrustedSpans,
		activeTrustedSpanAliases,
		trustedSpanAliasKey,
		trustedSpanAliasOwner,
		spanWithDuration,
		trustedTraceContext,
		internalOrTrustedTraceContext,
		internalOrTrustedParentContext,
		internalOrTrustedExplicitParentContext,
		activeTrustedParentContext,
		activeInternalOrTrustedContext,
		exportedInternalOrTrustedContext,
		exportedSpanContextForDiagnosticTraceContext,
		trackTrustedSpan,
		trackInternalOrTrustedSpan,
		takeTrackedTrustedSpan,
		getTrackedInternalOrTrustedSpan,
		setSpanAttrs,
		completeTrackedLifecycleSpan,
		addRunAttrs,
		paramsSummaryAttrs,
		stopActiveTrustedSpans
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service.ts
const OTLP_HTTP_PROTOBUF_PROTOCOL = "http/protobuf";
const RESOURCE_DETECTORS = [
	["host", resources.hostDetector],
	["os", resources.osDetector],
	["serviceinstance", resources.serviceInstanceIdDetector],
	["process", resources.processDetector],
	["env", resources.envDetector]
];
const OTEL_SIGNAL_PROTOCOL_ENV = {
	traces: OTEL_EXPORTER_OTLP_TRACES_PROTOCOL_ENV,
	metrics: OTEL_EXPORTER_OTLP_METRICS_PROTOCOL_ENV,
	logs: OTEL_EXPORTER_OTLP_LOGS_PROTOCOL_ENV
};
function isOtelSdkDisabled(logger) {
	const value = process.env.OTEL_SDK_DISABLED?.trim().toLowerCase();
	if (!value || value === "false") return false;
	if (value === "true") return true;
	logger.warn("diagnostics-otel: invalid OTEL_SDK_DISABLED value; expected true or false, using false");
	return false;
}
function readNonblankOtelEnv(name) {
	const value = process.env[name];
	return value?.trim() ? value : void 0;
}
function readPositiveOtelNumber(name, fallback) {
	const value = otelCore.getNumberFromEnv(name);
	if (value !== void 0 && value <= 0) {
		diag.warn(`${name} (${value}) is invalid, expected number greater than 0, using default.`);
		return fallback;
	}
	return value ?? fallback;
}
function resolveResourceDetectors() {
	const names = otelCore.getStringListFromEnv("OTEL_NODE_RESOURCE_DETECTORS");
	if (names === void 0) return [
		resources.envDetector,
		resources.processDetector,
		resources.hostDetector
	];
	if (names.includes("all")) return RESOURCE_DETECTORS.map(([, detector]) => detector);
	if (names.includes("none")) return [];
	return names.flatMap((name) => {
		const detector = RESOURCE_DETECTORS.find(([candidate]) => candidate === name)?.[1];
		if (!detector) diag.warn(`Invalid resource detector "${name}" specified in the environment variable OTEL_NODE_RESOURCE_DETECTORS`);
		return detector ? [detector] : [];
	});
}
function resolveSignalProtocol(signal, configuredProtocol) {
	return configuredProtocol ?? readNonblankOtelEnv(OTEL_SIGNAL_PROTOCOL_ENV[signal]) ?? readNonblankOtelEnv("OTEL_EXPORTER_OTLP_PROTOCOL") ?? OTLP_HTTP_PROTOBUF_PROTOCOL;
}
function createStartupRollbackError(startupError, cleanupError) {
	return new AggregateError([startupError, cleanupError], "diagnostics-otel startup failed and rollback cleanup failed", { cause: startupError });
}
function publicExporterEventForHealth(event) {
	const base = {
		exporter: event.exporter,
		signal: event.signal
	};
	if (event.status === "recovered") return;
	if (event.status === "started") return {
		...base,
		status: "started",
		reason: "configured"
	};
	if (event.status === "dropped") return {
		...base,
		status: "dropped"
	};
	const reason = event.reason === "export_failed" ? "emit_failed" : event.reason;
	return {
		...base,
		status: "failure",
		...reason && reason !== "default_endpoint" ? { reason } : {},
		...event.errorCategory ? { errorCategory: event.errorCategory } : {}
	};
}
function diagnosticTraceContextFromSpanContext(spanContext) {
	return {
		traceId: spanContext.traceId,
		spanId: spanContext.spanId,
		traceFlags: spanContext.traceFlags.toString(16).padStart(2, "0")
	};
}
function createDiagnosticsOtelService() {
	let state = {};
	let preserveExporterRoutesOnNextStop = false;
	const stopStarted = async (options) => {
		const current = state;
		state = options?.preserveExporterRoutes ? { retireExporterRoutes: current.retireExporterRoutes } : {};
		const settle = async (...stops) => (await Promise.allSettled(stops.map((stop) => Promise.resolve().then(() => stop?.())))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		const failures = await settle(current.unregisterTracePropagationBridge, current.unsubscribe, current.stopActiveTrustedSpans, current.unregisterOwnedSdkRuntime);
		const providerFailures = await settle(() => current.logProvider?.shutdown(), () => current.traceProvider?.shutdown(), () => current.meterProvider?.shutdown());
		failures.push(...providerFailures);
		if (!options?.preserveExporterRoutes) current.retireExporterRoutes?.(providerFailures.length > 0);
		if (providerFailures.length > 0) state.retireExporterRoutes = current.retireExporterRoutes;
		failures.push(...await settle(current.unregisterUnhandledRejectionHandler));
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, `diagnostics-otel shutdown failed: ${failures.join("; ")}`);
	};
	return {
		id: "diagnostics-otel",
		reload: { configPrefixes: ["diagnostics.otel", "diagnostics.enabled"] },
		async start(ctx) {
			preserveExporterRoutesOnNextStop = false;
			await stopStarted();
			const active = state;
			const cfg = ctx.config.diagnostics;
			const otel = cfg?.otel;
			if (!cfg || cfg.enabled === false || !otel?.enabled) return;
			const sdkDisabled = isOtelSdkDisabled(ctx.logger);
			const sdkPreloaded = hasPreloadedOtelSdk();
			if (!sdkPreloaded) active.unregisterOwnedSdkRuntime = registerOwnedSdkRuntime((message) => ctx.logger.warn(message));
			if (!sdkPreloaded && sdkDisabled) return;
			const exporterRoutes = /* @__PURE__ */ new Map();
			const internalDiagnostics = ctx.internalDiagnostics;
			const exporterHealthReporter = internalDiagnostics;
			const emitPublicExporterEvent = createPublicExporterHealthEventEmitter((event) => {
				const publicEvent = publicExporterEventForHealth(event);
				if (!publicEvent) return;
				try {
					internalDiagnostics?.emit({
						type: "telemetry.exporter",
						...publicEvent
					});
				} catch {}
			});
			const emitExporterEvent = createExporterHealthEventEmitter((event) => {
				const key = `${event.signal}\u0000${event.transport}`;
				if (event.status === "dropped") exporterRoutes.delete(key);
				else exporterRoutes.set(key, {
					signal: event.signal,
					status: event.status,
					transport: event.transport
				});
				try {
					const { exporter: _exporter, ...update } = event;
					exporterHealthReporter?.reportExporterHealth?.(update);
				} catch {}
				emitPublicExporterEvent(event);
			});
			const tracesEnabled = otel.traces !== false;
			const metricsEnabled = otel.metrics !== false;
			const logsEnabled = otel.logs === true && !sdkDisabled;
			const logsExporter = otel.logsExporter ?? "otlp";
			const logsToOtlpRequested = logsEnabled && (logsExporter === "otlp" || logsExporter === "both");
			const logsToStdout = logsEnabled && (logsExporter === "stdout" || logsExporter === "both");
			if ([
				...tracesEnabled ? ["traces"] : [],
				...metricsEnabled ? ["metrics"] : [],
				...logsEnabled ? ["logs"] : []
			].length === 0) return;
			const subscribe = ctx.internalDiagnostics?.onEvent;
			if (!subscribe) {
				ctx.logger.error("diagnostics-otel: internal diagnostics capability unavailable");
				return;
			}
			active.retireExporterRoutes = (preserveFailures = false) => {
				for (const route of exporterRoutes.values()) {
					if (preserveFailures && route.status === "failure") continue;
					emitExporterEvent({
						exporter: "diagnostics-otel",
						signal: route.signal,
						transport: route.transport,
						status: "dropped"
					});
				}
			};
			const ownedOtlpSignals = [
				...!sdkPreloaded && tracesEnabled ? ["traces"] : [],
				...!sdkPreloaded && metricsEnabled ? ["metrics"] : [],
				...logsToOtlpRequested ? ["logs"] : []
			];
			const supportedOtlpSignals = /* @__PURE__ */ new Set();
			for (const signal of ownedOtlpSignals) {
				const protocol = resolveSignalProtocol(signal, otel.protocol);
				if (protocol === OTLP_HTTP_PROTOBUF_PROTOCOL) {
					supportedOtlpSignals.add(signal);
					continue;
				}
				emitExporterEvent({
					signal,
					exporter: "diagnostics-otel",
					transport: "otlp-http-protobuf",
					status: "failure",
					reason: "unsupported_protocol"
				});
				ctx.logger.warn(`diagnostics-otel: unsupported ${signal} protocol ${protocol}; OTLP export disabled`);
			}
			const tracesToOtlp = !sdkPreloaded && tracesEnabled && supportedOtlpSignals.has("traces");
			const metricsToOtlp = !sdkPreloaded && metricsEnabled && supportedOtlpSignals.has("metrics");
			const logsToOtlp = logsToOtlpRequested && supportedOtlpSignals.has("logs");
			const tracesActive = sdkPreloaded ? tracesEnabled : tracesToOtlp;
			const metricsActive = sdkPreloaded ? metricsEnabled : metricsToOtlp;
			const logsActive = logsToStdout || logsToOtlp;
			if (!tracesActive && !metricsActive && !logsActive) return;
			const hasOwnedOtlpSignal = ownedOtlpSignals.length > 0;
			const sharedEnvEndpoint = hasOwnedOtlpSignal ? process.env[OTEL_EXPORTER_OTLP_ENDPOINT_ENV] : void 0;
			const endpoint = hasOwnedOtlpSignal ? normalizeEndpoint(otel.endpoint ?? sharedEnvEndpoint) : void 0;
			const headers = otel.headers ?? void 0;
			const serviceName = otel.serviceName?.trim() || process.env.OTEL_SERVICE_NAME || "openclaw";
			const sampleRate = resolveSampleRate(otel.sampleRate);
			const contentCapturePolicy = resolveContentCapturePolicy(otel.captureContent);
			const resource = resources.resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName });
			const logUrl = logsToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.logsEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_LOGS_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/logs"
			}) : void 0;
			const traceUrl = tracesToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.tracesEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/traces"
			}) : void 0;
			const metricUrl = metricsToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.metricsEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_METRICS_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/metrics"
			}) : void 0;
			const logHttpAgentOptions = logsToOtlp ? resolveOtelHttpAgentOptions({
				url: logUrl,
				signalIdentifier: "LOGS"
			}) : void 0;
			const traceHttpAgentOptions = tracesToOtlp ? resolveOtelHttpAgentOptions({
				url: traceUrl,
				signalIdentifier: "TRACES"
			}) : void 0;
			const metricHttpAgentOptions = metricsToOtlp ? resolveOtelHttpAgentOptions({
				url: metricUrl,
				signalIdentifier: "METRICS"
			}) : void 0;
			if (tracesToOtlp || metricsToOtlp) try {
				const detectedResource = resources.detectResources({ detectors: resolveResourceDetectors() }).merge(resource);
				const sdkMetricsEnabled = otelCore.getBooleanFromEnv("OTEL_NODE_EXPERIMENTAL_SDK_METRICS");
				const metricExporter = metricsToOtlp ? observeOtlpExporterHealth(new OTLPMetricExporter({
					...metricUrl ? { url: metricUrl } : {},
					...headers ? { headers } : {},
					...metricHttpAgentOptions ? { httpAgentOptions: metricHttpAgentOptions } : {}
				}), {
					emitExporterEvent,
					signal: "metrics"
				}) : void 0;
				const metricInterval = typeof otel.flushIntervalMs === "number" ? Math.max(1e3, otel.flushIntervalMs) : readPositiveOtelNumber("OTEL_METRIC_EXPORT_INTERVAL", 6e4);
				let metricTimeout = readPositiveOtelNumber("OTEL_METRIC_EXPORT_TIMEOUT", 3e4);
				if (metricTimeout > metricInterval) {
					diag.warn(`OTEL_METRIC_EXPORT_TIMEOUT (${metricTimeout}) is greater than the active metric export interval (${metricInterval}). Clamping timeout to interval value.`);
					metricTimeout = metricInterval;
				}
				const metricReader = metricExporter ? new PeriodicExportingMetricReader({
					exporter: metricExporter,
					exportIntervalMillis: metricInterval,
					exportTimeoutMillis: metricTimeout
				}) : void 0;
				if (metricReader) active.meterProvider = new MeterProvider({
					resource: detectedResource,
					readers: [metricReader],
					sdkMetricsEnabled
				});
				const traceExporter = tracesToOtlp ? observeOtlpExporterHealth(new OTLPTraceExporter({
					...traceUrl ? { url: traceUrl } : {},
					...headers ? { headers } : {},
					...traceHttpAgentOptions ? { httpAgentOptions: traceHttpAgentOptions } : {}
				}), {
					emitExporterEvent,
					signal: "traces"
				}) : void 0;
				if (traceExporter) {
					const maxQueueSize = readPositiveOtelNumber("OTEL_BSP_MAX_QUEUE_SIZE", 2048);
					const spanProcessor = new BatchSpanProcessor(traceExporter, {
						maxQueueSize,
						maxExportBatchSize: Math.min(readPositiveOtelNumber("OTEL_BSP_MAX_EXPORT_BATCH_SIZE", 512), maxQueueSize),
						scheduledDelayMillis: typeof otel.flushIntervalMs === "number" ? Math.max(1e3, otel.flushIntervalMs) : readPositiveOtelNumber("OTEL_BSP_SCHEDULE_DELAY", 5e3),
						exportTimeoutMillis: readPositiveOtelNumber("OTEL_BSP_EXPORT_TIMEOUT", 3e4),
						...sdkMetricsEnabled && active.meterProvider ? { selfObsMeterProvider: active.meterProvider } : {}
					});
					active.traceProvider = new BasicTracerProvider({
						resource: detectedResource,
						spanProcessors: [spanProcessor],
						...sampleRate !== void 0 ? { sampler: new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(sampleRate) }) } : {},
						...sdkMetricsEnabled && active.meterProvider ? { meterProvider: active.meterProvider } : {}
					});
				}
			} catch (err) {
				for (const [signal, url] of [...tracesToOtlp ? [["traces", traceUrl]] : [], ...metricsToOtlp ? [["metrics", metricUrl]] : []]) emitExporterEvent({
					exporter: "diagnostics-otel",
					signal,
					transport: "otlp-http-protobuf",
					endpointMode: url ? "configured" : "default_endpoint",
					status: "failure",
					reason: "start_failed",
					errorCategory: errorCategory(err)
				});
				ctx.logger.error(`diagnostics-otel: failed to start SDK: ${formatError(err)}`);
				preserveExporterRoutesOnNextStop = true;
				try {
					await stopStarted({ preserveExporterRoutes: true });
				} catch (cleanupError) {
					ctx.logger.error(`diagnostics-otel: SDK startup rollback cleanup failed: ${formatError(cleanupError)}`);
					throw createStartupRollbackError(err, cleanupError);
				}
				throw err;
			}
			else if (sdkPreloaded && (tracesEnabled || metricsEnabled)) ctx.logger.info("diagnostics-otel: using preloaded OpenTelemetry SDK");
			const meter = !metricsActive ? createNoopMeter() : active.meterProvider ? active.meterProvider.getMeter("openclaw") : metrics.getMeter("openclaw");
			const diagnosticsTrace = createDiagnosticsTraceRuntime(active.traceProvider ? active.traceProvider.getTracer("openclaw") : trace.getTracer("openclaw"));
			active.stopActiveTrustedSpans = diagnosticsTrace.stopActiveTrustedSpans;
			const diagnosticMetrics = createDiagnosticsMetrics(meter, otel.metricNamePrefix);
			const diagnosticsLogs = createDiagnosticsLogExporter({
				contentCapturePolicy,
				emitExporterEvent,
				flushIntervalMs: otel.flushIntervalMs,
				headers,
				logger: ctx.logger,
				logsEnabled: logsActive,
				logsToOtlp,
				logsToStdout,
				logHttpAgentOptions,
				logUrl,
				resource,
				serviceName
			});
			active.logProvider = diagnosticsLogs.logProvider;
			const { recordLogRecord, recordSecurityEvent } = diagnosticsLogs;
			const recorderRuntime = createDiagnosticsRecorderRuntime({
				contentCapturePolicy,
				metrics: diagnosticMetrics,
				traces: diagnosticsTrace,
				tracesEnabled: tracesActive
			});
			const recorders = {
				...createUsageRecorders(recorderRuntime),
				...createOperationsRecorders(recorderRuntime),
				...createHarnessRecorders(recorderRuntime),
				...createModelRecorders(recorderRuntime),
				...createToolAndSystemRecorders(recorderRuntime)
			};
			active.unsubscribe = subscribe(createDiagnosticsEventHandler({
				logger: ctx.logger,
				recorders,
				recordLogRecord,
				recordSecurityEvent
			}), metricsActive ? void 0 : tracesActive ? { exclude: ["gateway.event_loop.sample", "diagnostic.gc"] } : { include: ["log.record", "security.event"] });
			if (tracesActive) active.unregisterTracePropagationBridge = ctx.internalDiagnostics?.registerTracePropagationBridge?.({
				shouldPrepareEvent(event) {
					return event.type === "model.call.started" || event.type === "tool.execution.started";
				},
				prepareEvent(event, metadata) {
					if (event.type === "model.call.started") recorders.recordModelCallStarted(event, metadata);
					else if (event.type === "tool.execution.started") recorders.recordToolExecutionStarted(event, metadata);
				},
				resolveTraceContext(traceContext) {
					const spanContext = diagnosticsTrace.exportedSpanContextForDiagnosticTraceContext(traceContext);
					return spanContext ? diagnosticTraceContextFromSpanContext(spanContext) : void 0;
				}
			}) ?? null;
			if (hasOwnedOtlpSignal || sdkPreloaded && !sdkDisabled) active.unregisterUnhandledRejectionHandler = registerUnhandledRejectionHandler((reason) => {
				const otlpError = findOtlpExporterError(reason);
				if (!otlpError) return false;
				const code = readErrorCode(otlpError) ?? "unknown";
				ctx.logger.warn(`diagnostics-otel: suppressed OTLP exporter unhandled rejection (code=${String(code)})`);
				return true;
			});
			const emitStarted = (signal, transport, endpointMode) => {
				emitExporterEvent({
					exporter: "diagnostics-otel",
					signal,
					transport,
					...endpointMode ? { endpointMode } : {},
					status: "started",
					reason: endpointMode ?? "configured"
				});
			};
			if (sdkPreloaded && tracesEnabled) emitStarted("traces", "external-sdk");
			else if (tracesToOtlp) emitStarted("traces", "otlp-http-protobuf", traceUrl ? "configured" : "default_endpoint");
			if (sdkPreloaded && metricsEnabled) emitStarted("metrics", "external-sdk");
			else if (metricsToOtlp) emitStarted("metrics", "otlp-http-protobuf", metricUrl ? "configured" : "default_endpoint");
			if (logsToOtlp) emitStarted("logs", "otlp-http-protobuf", logUrl ? "configured" : "default_endpoint");
			if (logsToStdout) emitStarted("logs", "stdout");
			if (logsActive) {
				const label = logsToOtlp && logsToStdout ? "OTLP/Protobuf + stdout JSONL" : logsToStdout ? "stdout JSONL" : "OTLP/Protobuf";
				ctx.logger.info(`diagnostics-otel: logs exporter enabled (${label})`);
			}
		},
		async stop() {
			const preserveExporterRoutes = preserveExporterRoutesOnNextStop;
			preserveExporterRoutesOnNextStop = false;
			await stopStarted(preserveExporterRoutes ? { preserveExporterRoutes: true } : void 0);
		}
	};
}
//#endregion
export { createDiagnosticsOtelService as t };
