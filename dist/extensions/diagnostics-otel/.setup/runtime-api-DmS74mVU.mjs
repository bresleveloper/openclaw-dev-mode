import { ROOT_CONTEXT, SpanKind, SpanStatusCode, TraceFlags, context, createNoopMeter, diag, isSpanContextValid, metrics, propagation, trace } from "@opentelemetry/api";
import * as otelCore from "@opentelemetry/core";
import { CompositePropagator, ExportResultCode, W3CBaggagePropagator, W3CTraceContextPropagator, getStringListFromEnv } from "@opentelemetry/core";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import * as resources from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BasicTracerProvider, BatchSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { asFiniteNumberInRange, asNonNegativeFiniteNumber, asPositiveFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { registerUnhandledRejectionHandler } from "openclaw/plugin-sdk/runtime-env";
import { asFiniteNumber, isRecord, normalizeOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { readFileSync } from "node:fs";
import nodePath from "node:path";
import { isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, normalizeDiagnosticLane, normalizeDiagnosticValue } from "openclaw/plugin-sdk/diagnostic-runtime";
import { collectErrorGraphCandidates, readErrorName } from "openclaw/plugin-sdk/error-runtime";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { ATTR_GEN_AI_INPUT_MESSAGES, ATTR_GEN_AI_OUTPUT_MESSAGES, ATTR_GEN_AI_TOOL_CALL_ARGUMENTS, ATTR_GEN_AI_TOOL_CALL_ID, ATTR_GEN_AI_TOOL_CALL_RESULT, ATTR_GEN_AI_TOOL_DEFINITIONS, GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL, GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT } from "@opentelemetry/semantic-conventions/incubating";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
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
const OTEL_EXPORTER_OTLP_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_KEY_ENV = "OTEL_EXPORTER_OTLP_CLIENT_KEY";
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
function normalizeOtelLogString(value, maxChars) {
	const redacted = redactSensitiveText(value);
	return redacted.length > maxChars ? `${truncateUtf16Safe(redacted, maxChars)}...(truncated)` : redacted;
}
function normalizeOtelErrorMessage(value) {
	if (!value) return;
	return normalizeOtelLogString(value.trim(), MAX_OTEL_ERROR_MESSAGE_CHARS) || void 0;
}
function hasPreloadedOtelSdk() {
	return process.env[PRELOADED_OTEL_SDK_ENV] === "1";
}
function createOtelContentRedactor() {
	const redacted = /* @__PURE__ */ new Map();
	return (value) => {
		let result = redacted.get(value);
		if (result === void 0) {
			result = redactSensitiveText(value);
			redacted.set(value, result);
		}
		return result;
	};
}
function normalizeOtelContentValue(value, redact) {
	if (typeof value === "string") return normalizeOtelLogString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (Array.isArray(value)) {
		const items = value.slice(0, 200).filter((item) => typeof item === "string");
		if (items.length > 0) return normalizeOtelLogString(items.join("\n"), MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	}
	return safeJsonString(value, redact);
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
const MAX_OTEL_REDACTED_JSON_CANDIDATE_CHARS = 4 * MAX_OTEL_CONTENT_ATTRIBUTE_CHARS;
function safeJsonString(value, redact = createOtelContentRedactor()) {
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return;
	const json = serializeJsonForOtelAttribute(value);
	const exact = redactJsonWithinAttributeBudget(json);
	if (exact) return exact;
	for (const maxArrayItems of JSON_TRUNCATION_ARRAY_ITEM_BUDGETS) for (const maxStringChars of JSON_TRUNCATION_STRING_BUDGETS) {
		const truncated = redactJsonWithinAttributeBudget(serializeJsonForOtelAttribute(truncateJsonValueForOtelAttribute(value, maxArrayItems, maxStringChars, redact)));
		if (truncated) return truncated;
	}
	return redactJsonWithinAttributeBudget(serializeJsonForOtelAttribute({
		truncated: true,
		reason: json ? "max_attribute_size" : "unserializable_value",
		type: describeJsonValue(value)
	}));
}
function serializeJsonForOtelAttribute(value) {
	try {
		return JSON.stringify(value) || void 0;
	} catch {
		return;
	}
}
function redactJsonWithinAttributeBudget(json) {
	if (!json || json.length > MAX_OTEL_REDACTED_JSON_CANDIDATE_CHARS) return;
	const redacted = redactSensitiveText(json);
	return redacted.length <= 131072 ? redacted : void 0;
}
function truncateJsonValueForOtelAttribute(input, maxArrayItems, maxStringChars, redact) {
	const seen = /* @__PURE__ */ new WeakSet();
	function visit(value, depth) {
		if (typeof value === "string" || typeof value === "bigint") return truncateJsonTextForOtelAttribute(redact(String(value)), maxStringChars);
		if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
		if (typeof value !== "object") return;
		if (depth <= 0) return {
			truncated: true,
			reason: "max_depth"
		};
		if (seen.has(value)) {
			const marker = {
				truncated: true,
				reason: "circular_reference"
			};
			return Array.isArray(value) ? [marker] : marker;
		}
		seen.add(value);
		let result;
		if (Array.isArray(value)) {
			const items = value.slice(0, maxArrayItems).map((item) => visit(item, depth - 1));
			if (value.length > items.length) items.push({
				truncated: true,
				omittedItems: value.length - items.length
			});
			result = items;
		} else {
			const object = {};
			const entries = Object.entries(value).filter(([, field]) => field !== void 0 && typeof field !== "function" && typeof field !== "symbol");
			for (const [key, field] of entries.slice(0, JSON_TRUNCATION_MAX_OBJECT_FIELDS)) object[key] = visit(field, depth - 1);
			if (entries.length > JSON_TRUNCATION_MAX_OBJECT_FIELDS) {
				object.truncated = true;
				object.omittedFields = entries.length - JSON_TRUNCATION_MAX_OBJECT_FIELDS;
			}
			result = object;
		}
		seen.delete(value);
		return result;
	}
	return visit(input, JSON_TRUNCATION_MAX_DEPTH);
}
function truncateJsonTextForOtelAttribute(redacted, maxChars) {
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
	const signalEndpoint = normalizeOptionalString(params.signalEndpoint ?? params.signalEnvEndpoint);
	const endpoint = signalEndpoint ?? params.endpoint;
	const signalEnvEndpoint = readNonBlankString(params.signalEnvEndpoint);
	const sharedEnvEndpoint = readNonBlankString(params.sharedEnvEndpoint);
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
	const filePath = readNonBlankString(process.env[signalEnvName]) ?? readNonBlankString(process.env[params.sharedEnvName]);
	if (!filePath) return;
	try {
		const material = readFileSync(nodePath.resolve(process.cwd(), filePath));
		if (material.length > 0) return material;
	} catch {}
	throw new Error(`Configured OpenTelemetry ${params.label} file is missing, empty, or unreadable; refusing insecure export`);
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
	const { logger, recorders, recordLogEvent } = params;
	const handlers = {
		"diagnostic.gc": recorders.recordGcDuration.bind(recorders),
		"gateway.event_loop.sample": recorders.recordGatewayEventLoopSample.bind(recorders),
		"gateway.rpc": recorders.recordGatewayRpc.bind(recorders),
		"model.usage": (evt, metadata, privateData) => recorders.recordModelUsage(evt, metadata, privateData.hostPluginId),
		"webhook.received": recorders.recordWebhookReceived.bind(recorders),
		"webhook.processed": recorders.recordWebhookProcessed.bind(recorders),
		"webhook.error": recorders.recordWebhookError.bind(recorders),
		"message.queued": recorders.recordMessageQueued.bind(recorders),
		"message.received": recorders.recordMessageReceived.bind(recorders),
		"message.dispatch.started": recorders.recordMessageDispatchStarted.bind(recorders),
		"message.dispatch.completed": recorders.recordMessageDispatchCompleted.bind(recorders),
		"message.processed": recorders.recordMessageProcessed.bind(recorders),
		"message.delivery.started": recorders.recordMessageDeliveryStarted.bind(recorders),
		"message.delivery.completed": recorders.recordMessageDeliveryFinished.bind(recorders),
		"message.delivery.error": recorders.recordMessageDeliveryFinished.bind(recorders),
		"talk.event": recorders.recordTalkEvent.bind(recorders),
		"queue.lane.enqueue": recorders.recordLaneEnqueue.bind(recorders),
		"queue.lane.dequeue": recorders.recordLaneDequeue.bind(recorders),
		"session.state": recorders.recordSessionState.bind(recorders),
		"session.turn.created": recorders.recordSessionTurnCreated.bind(recorders),
		"session.stuck": recorders.recordSessionStuck.bind(recorders),
		"session.recovery.requested": recorders.recordSessionRecoveryRequested.bind(recorders),
		"session.recovery.completed": recorders.recordSessionRecoveryCompleted.bind(recorders),
		"run.attempt": recorders.recordRunAttempt.bind(recorders),
		"diagnostic.heartbeat": recorders.recordHeartbeat.bind(recorders),
		"diagnostic.liveness.warning": recorders.recordLivenessWarning.bind(recorders),
		"diagnostic.phase.completed": recorders.recordDiagnosticPhaseCompleted.bind(recorders),
		"run.started": recorders.recordRunStarted.bind(recorders),
		"run.completed": recorders.recordRunCompleted.bind(recorders),
		"harness.run.started": recorders.recordHarnessRunStarted.bind(recorders),
		"agent.commentary": recorders.recordAgentCommentary.bind(recorders),
		"harness.run.completed": recorders.recordHarnessRunFinished.bind(recorders),
		"harness.run.error": recorders.recordHarnessRunFinished.bind(recorders),
		"context.assembled": recorders.recordContextAssembled.bind(recorders),
		"model.call.started": recorders.recordModelCallStarted.bind(recorders),
		"model.call.completed": (evt, metadata, privateData) => recorders.recordModelCallFinished(evt, metadata, privateData.modelContent),
		"model.call.error": (evt, metadata, privateData) => recorders.recordModelCallFinished(evt, metadata, privateData.modelContent),
		"tool.execution.started": recorders.recordToolExecutionStarted.bind(recorders),
		"tool.execution.completed": (evt, metadata, privateData) => recorders.recordToolExecutionFinished(evt, metadata, privateData.toolContent),
		"tool.execution.error": (evt, metadata, privateData) => recorders.recordToolExecutionFinished(evt, metadata, privateData.toolContent),
		"tool.execution.blocked": recorders.recordToolExecutionBlocked.bind(recorders),
		"skill.used": recorders.recordSkillUsed.bind(recorders),
		"exec.process.completed": recorders.recordExecProcessCompleted.bind(recorders),
		"log.record": (evt, metadata) => recordLogEvent?.(evt, metadata),
		"security.event": (evt, metadata) => recordLogEvent?.(evt, metadata),
		"tool.loop": recorders.recordToolLoop.bind(recorders),
		"diagnostic.memory.sample": (evt) => recorders.recordMemoryUsageMetrics(evt),
		"diagnostic.memory.pressure": recorders.recordMemoryPressure.bind(recorders),
		"diagnostic.async_queue.dropped": recorders.recordAsyncQueueDropped.bind(recorders),
		"telemetry.exporter": recorders.recordTelemetryExporter.bind(recorders),
		"payload.large": recorders.recordPayloadLarge.bind(recorders),
		"model.failover": recorders.recordModelFailover.bind(recorders)
	};
	return (evt, metadata, privateData) => {
		try {
			if (Object.hasOwn(handlers, evt.type)) handlers[evt.type]?.(evt, metadata, privateData);
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
			const active = failures.get(key) ?? /* @__PURE__ */ new Map();
			if (active.has(reason)) return;
			active.set(reason, event);
			failures.set(key, active);
			if (active.size === 1) publish(event);
			return;
		}
		const active = failures.get(key);
		const reported = active?.keys().next().value;
		if (!active?.delete(reason) || reported !== reason) return;
		const next = active.values().next().value;
		if (next) {
			publish(next);
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
	const exportItems = exporter.export.bind(exporter);
	const shutdown = exporter.shutdown.bind(exporter);
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
	exporter.export = (items, resultCallback) => {
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
	exporter.shutdown = async () => {
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
function assignOptionalNumberAttrs(attributes, prefix, values) {
	for (const [key, value] of Object.entries(values)) if (value !== void 0) attributes[`${prefix}${key}`] = value;
}
function redactOtelAttributes(attributes) {
	const redactedAttributes = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (DROPPED_OTEL_ATTRIBUTE_KEYS.has(key)) continue;
		redactedAttributes[key] = typeof value === "string" ? redactSensitiveText(value) : value;
	}
	return redactedAttributes;
}
function securityTargetNameAttr(value) {
	const redacted = redactSensitiveText(value.trim());
	const redactedLower = redacted.toLowerCase();
	if (redactedLower.startsWith("agent:") || redactedLower.includes(":agent:")) return "unknown";
	return SECURITY_TARGET_NAME_VALUE_RE.test(redacted) ? redacted : "unknown";
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
	const assignOptionalNormalized = (key, value) => {
		if (value) assignOtelLogAttribute(attributes, key, normalizeDiagnosticValue(value));
	};
	assignOtelLogAttribute(attributes, "openclaw.security.event_id", evt.eventId);
	assignOtelLogAttribute(attributes, "openclaw.security.category", evt.category);
	assignOtelLogAttribute(attributes, "openclaw.security.action", normalizeDiagnosticValue(evt.action));
	assignOtelLogAttribute(attributes, "openclaw.security.outcome", evt.outcome);
	assignOtelLogAttribute(attributes, "openclaw.security.severity", evt.severity);
	assignOptionalNormalized("openclaw.security.reason", evt.reason);
	if (evt.actor) {
		assignOtelLogAttribute(attributes, "openclaw.security.actor.kind", evt.actor.kind);
		assignOptionalNormalized("openclaw.security.actor.id_hash", evt.actor.idHash);
		assignOptionalNormalized("openclaw.security.actor.device_id_hash", evt.actor.deviceIdHash);
		assignOptionalNormalized("openclaw.security.actor.channel", evt.actor.channel);
		assignOptionalNormalized("openclaw.security.actor.role", evt.actor.role);
		if (evt.actor.scopes?.length) assignOtelLogAttribute(attributes, "openclaw.security.actor.scopes", evt.actor.scopes.map((scope) => normalizeDiagnosticValue(scope)).join(","));
	}
	if (evt.target) {
		assignOtelLogAttribute(attributes, "openclaw.security.target.kind", evt.target.kind);
		assignOptionalNormalized("openclaw.security.target.id_hash", evt.target.idHash);
		if (evt.target.name) assignOtelLogAttribute(attributes, "openclaw.security.target.name", securityTargetNameAttr(evt.target.name));
		assignOptionalNormalized("openclaw.security.target.owner", evt.target.owner);
	}
	if (evt.policy) {
		assignOptionalNormalized("openclaw.security.policy.id", evt.policy.id);
		if (evt.policy.decision) assignOtelLogAttribute(attributes, "openclaw.security.policy.decision", evt.policy.decision);
		assignOptionalNormalized("openclaw.security.policy.reason", evt.policy.reason);
	}
	if (evt.control) {
		assignOptionalNormalized("openclaw.security.control.id", evt.control.id);
		if (evt.control.family) assignOtelLogAttribute(attributes, "openclaw.security.control.family", evt.control.family);
	}
	assignOtelEventAttributes(attributes, evt.attributes, "openclaw.security.attribute.", normalizeDiagnosticValue);
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
	if (!traceContext?.spanId) return;
	return trace.setSpanContext(context.active(), {
		traceId: traceContext.traceId,
		spanId: traceContext.spanId,
		traceFlags: traceFlagsToOtel(traceContext.traceFlags),
		isRemote: true
	});
}
function normalizedTrustedTraceContext(evt, metadata) {
	return metadata.trusted || metadata.trustedTraceContext === true ? normalizeTraceContext(evt.trace) : void 0;
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
	const { captureContent, emitExporterEvent, flushIntervalMs, headers, logger, logsToOtlp, logsToStdout, logHttpAgentOptions, logUrl, resource, serviceName } = params;
	let logProvider = null;
	if (!logsToOtlp && !logsToStdout) return {
		logProvider,
		recordLogEvent: void 0
	};
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
	const recordLogEvent = (evt, metadata) => {
		if (evt.type === "security.event" && !metadata.trusted) return;
		const label = evt.type === "log.record" ? "log record" : "security event";
		try {
			const attributes = Object.create(null);
			let severityText;
			let body;
			if (evt.type === "log.record") {
				severityText = evt.level || "INFO";
				body = captureContent ? normalizeOtelLogString(evt.message || "log", MAX_OTEL_LOG_BODY_CHARS) : "log";
				assignOtelLogAttribute(attributes, "openclaw.log.level", severityText);
				if (evt.loggerName) assignOtelLogAttribute(attributes, "openclaw.logger", evt.loggerName);
				if (evt.loggerParents?.length) assignOtelLogAttribute(attributes, "openclaw.logger.parents", evt.loggerParents.join("."));
				assignOtelLogEventAttributes(attributes, evt.attributes);
				if (evt.code?.line) assignOtelLogAttribute(attributes, "code.lineno", evt.code.line);
				if (evt.code?.functionName) assignOtelLogAttribute(attributes, "code.function", evt.code.functionName);
			} else {
				severityText = securitySeverityText(evt.severity);
				body = "openclaw.security.event";
				assignOtelSecurityAttributes(attributes, evt);
			}
			const traceContext = normalizedTrustedTraceContext(evt, metadata);
			if (evt.type === "log.record" && traceContext?.traceFlags) attributes["openclaw.traceFlags"] = traceContext.traceFlags;
			const logRecord = {
				body,
				severityText,
				severityNumber: LOG_SEVERITY_MAP[severityText] ?? 9,
				attributes: redactOtelAttributes(attributes),
				timestamp: evt.ts
			};
			const logContext = contextForTraceContext(traceContext);
			if (logContext) logRecord.context = logContext;
			for (const transport of activeTransports) try {
				if (transport === "otlp-http-protobuf") otelLogger?.emit(logRecord);
				else writeStdoutDiagnosticLogRecord({
					logRecord,
					serviceName,
					...traceContext ? { traceContext } : {}
				});
				emitExporterEvent({
					exporter: "diagnostics-otel",
					signal: "logs",
					transport,
					status: "recovered",
					reason: "emit_failed"
				});
			} catch (error) {
				reportLogExportFailure(error, label, transport);
			}
		} catch (err) {
			for (const transport of activeTransports) reportLogExportFailure(err, label, transport);
		}
	};
	return {
		logProvider,
		recordLogEvent
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-metrics.ts
const DEFAULT_METRIC_NAME_PREFIX = "openclaw.";
function createDiagnosticsMetrics(meter, metricNamePrefix = DEFAULT_METRIC_NAME_PREFIX) {
	const createCounter = (name, description, unit = "1") => meter.createCounter(`${metricNamePrefix}${name}`, {
		unit,
		description
	});
	const createHistogram = (name, description, unit = "ms", explicitBucketBoundaries) => meter.createHistogram(`${metricNamePrefix}${name}`, {
		unit,
		description,
		...explicitBucketBoundaries ? { advice: { explicitBucketBoundaries } } : {}
	});
	const createDurationHistogram = (name, description) => createHistogram(name, description, "ms", AGENT_DURATION_MS_BUCKETS);
	return {
		gcDurationHistogram: createDurationHistogram("gc.duration_ms", "Elapsed garbage collection duration for the hosting JavaScript isolate"),
		gatewayEventLoopDelayMaxHistogram: createDurationHistogram("gateway.event_loop.delay_max_ms", "Maximum event-loop delay per completed Gateway observation window"),
		gatewayEventLoopObservedCounter: createCounter("gateway.event_loop.observed_ms", "Elapsed time covered by completed Gateway event-loop observation windows", "ms"),
		gatewayRpcRequestsCounter: createCounter("gateway.rpc.requests", "Authenticated Gateway WebSocket requests received"),
		gatewayRpcOutcomesCounter: createCounter("gateway.rpc.outcomes", "Gateway RPC observations by phase and outcome"),
		gatewayRpcFirstResponseHistogram: createDurationHistogram("gateway.rpc.first_response_ms", "Elapsed time until the first Gateway RPC response is sent"),
		gatewayRpcHandlerHistogram: createDurationHistogram("gateway.rpc.handler_ms", "Gateway RPC handler duration until return or throw"),
		gatewayRpcAdmissionHistogram: createDurationHistogram("gateway.rpc.admission_ms", "Elapsed time from Gateway RPC receipt until handler invocation"),
		gatewayRpcQueueWaitHistogram: createDurationHistogram("gateway.rpc.queue_wait_ms", "Gateway operator start queue or worker frame queue wait"),
		tokensCounter: createCounter("tokens", "Token usage by type"),
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
		costCounter: createCounter("cost.usd", "Estimated model cost (USD)"),
		durationHistogram: createDurationHistogram("run.duration_ms", "Agent run duration"),
		harnessDurationHistogram: createDurationHistogram("harness.duration_ms", "Agent harness lifecycle duration"),
		contextHistogram: createHistogram("context.tokens", "Context window size and usage", "1", CONTEXT_TOKENS_BUCKETS),
		webhookReceivedCounter: createCounter("webhook.received", "Webhook requests received"),
		webhookErrorCounter: createCounter("webhook.error", "Webhook processing errors"),
		webhookDurationHistogram: createHistogram("webhook.duration_ms", "Webhook processing duration"),
		messageQueuedCounter: createCounter("message.queued", "Messages queued for processing"),
		messageReceivedCounter: createCounter("message.received", "Inbound messages received"),
		messageDispatchStartedCounter: createCounter("message.dispatch.started", "Inbound message dispatch attempts started"),
		messageDispatchCompletedCounter: createCounter("message.dispatch.completed", "Inbound message dispatch attempts completed"),
		messageDispatchDurationHistogram: createHistogram("message.dispatch.duration_ms", "Inbound message dispatch duration"),
		messageProcessedCounter: createCounter("message.processed", "Messages processed by outcome"),
		messageDurationHistogram: createDurationHistogram("message.duration_ms", "Message processing duration"),
		messageDeliveryStartedCounter: createCounter("message.delivery.started", "Outbound message delivery attempts started"),
		messageDeliveryDurationHistogram: createHistogram("message.delivery.duration_ms", "Outbound message delivery duration"),
		queueDepthHistogram: createHistogram("queue.depth", "Queue depth on enqueue/dequeue", "1"),
		queueWaitHistogram: createHistogram("queue.wait_ms", "Queue wait time before execution"),
		laneEnqueueCounter: createCounter("queue.lane.enqueue", "Command queue lane enqueue events"),
		laneDequeueCounter: createCounter("queue.lane.dequeue", "Command queue lane dequeue events"),
		sessionStateCounter: createCounter("session.state", "Session state transitions"),
		sessionTurnCreatedCounter: createCounter("session.turn.created", "Agent session turns created"),
		sessionStuckCounter: createCounter("session.stuck", "Sessions stuck in processing"),
		sessionStuckAgeHistogram: createHistogram("session.stuck_age_ms", "Age of stuck sessions"),
		sessionRecoveryRequestedCounter: createCounter("session.recovery.requested", "Session recovery attempts requested"),
		sessionRecoveryCompletedCounter: createCounter("session.recovery.completed", "Session recovery attempts completed"),
		sessionRecoveryAgeHistogram: createHistogram("session.recovery.age_ms", "Age of sessions selected for recovery"),
		talkEventCounter: createCounter("talk.event", "Talk events emitted by type"),
		talkEventDurationHistogram: createHistogram("talk.event.duration_ms", "Talk event duration when reported"),
		talkAudioBytesHistogram: createHistogram("talk.audio.bytes", "Talk audio frame byte lengths", "By"),
		runAttemptCounter: createCounter("run.attempt", "Run attempts"),
		toolLoopCounter: createCounter("tool.loop", "Detected repetitive tool-call loop events"),
		skillUsedCounter: createCounter("skill.used", "Skills used by agent runs"),
		modelCallDurationHistogram: createHistogram("model_call.duration_ms", "Model call duration"),
		modelCallRequestBytesHistogram: createHistogram("model_call.request_bytes", "UTF-8 byte size of sanitized model request payloads", "By"),
		modelCallResponseBytesHistogram: createHistogram("model_call.response_bytes", "UTF-8 byte size of bounded streamed model response payloads", "By"),
		modelCallTimeToFirstByteHistogram: createHistogram("model_call.time_to_first_byte_ms", "Elapsed time before the first streamed model response event"),
		modelFailoverCounter: createCounter("model.failover", "Model failovers by source, destination, lane, and reason"),
		toolExecutionDurationHistogram: createHistogram("tool.execution.duration_ms", "Tool execution duration"),
		toolExecutionBlockedCounter: createCounter("tool.execution.blocked", "Tool executions blocked by policy or sandbox diagnostics"),
		execProcessDurationHistogram: createHistogram("exec.duration_ms", "Exec process duration"),
		memoryRssHistogram: createHistogram("memory.rss_bytes", "Resident set size reported by diagnostic memory samples", "By"),
		memoryHeapUsedHistogram: createHistogram("memory.heap_used_bytes", "Heap used bytes reported by diagnostic memory samples", "By"),
		memoryHeapTotalHistogram: createHistogram("memory.heap_total_bytes", "Heap total bytes reported by diagnostic memory samples", "By"),
		memoryExternalHistogram: createHistogram("memory.external_bytes", "External memory bytes reported by diagnostic memory samples", "By"),
		memoryArrayBuffersHistogram: createHistogram("memory.array_buffers_bytes", "ArrayBuffer bytes reported by diagnostic memory samples", "By"),
		memoryPressureCounter: createCounter("memory.pressure", "Diagnostic memory pressure events"),
		asyncQueueDroppedCounter: createCounter("diagnostic.async_queue.dropped", "Async diagnostic queue drops by dropped event class"),
		payloadLargeCounter: createCounter("payload.large", "Oversized payload diagnostics by surface and action"),
		payloadLargeBytesHistogram: createHistogram("payload.large_bytes", "Oversized payload byte sizes by surface and action", "By"),
		livenessWarningCounter: createCounter("liveness.warning", "Diagnostic liveness warning events"),
		livenessEventLoopDelayP99Histogram: createHistogram("liveness.event_loop_delay_p99_ms", "P99 event-loop delay reported by diagnostic liveness warnings"),
		livenessEventLoopDelayMaxHistogram: createHistogram("liveness.event_loop_delay_max_ms", "Maximum event-loop delay reported by diagnostic liveness warnings"),
		livenessEventLoopUtilizationHistogram: createHistogram("liveness.event_loop_utilization", "Event-loop utilization reported by diagnostic liveness warnings", "1"),
		livenessCpuCoreRatioHistogram: createHistogram("liveness.cpu_core_ratio", "Whole-process CPU usage in core equivalents, including worker and native threads; can exceed 1.", "1"),
		telemetryExporterCounter: createCounter("telemetry.exporter.events", "Diagnostic telemetry exporter lifecycle and failure events")
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-propagation.ts
const DEFAULT_PROPAGATORS = ["tracecontext", "baggage"];
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
	const contextManager = new AsyncLocalStorageContextManager().enable();
	const ownsContext = context.setGlobalContextManager(contextManager);
	if (!ownsContext) contextManager.disable();
	const propagator = createConfiguredPropagator(warn);
	const ownsPropagation = propagator ? propagation.setGlobalPropagator(propagator) : false;
	if (!ownsContext && !ownsPropagation) return null;
	return () => {
		if (ownsPropagation) propagation.disable();
		if (ownsContext) context.disable();
	};
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
		const json = safeJsonString(value);
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
		if (part.type === "image" && typeof redacted.data === "string" && redacted.data.length > 131072) delete redacted.data;
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
function normalizeGenAiMessage(value, fallbackRole) {
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
function assignJsonAttribute(attributes, key, value, redact) {
	const json = safeJsonString(value, redact);
	if (json) attributes[key] = json;
}
function assignOtelContentAttribute(attributes, key, value, redact) {
	const normalized = normalizeOtelContentValue(value, redact);
	if (normalized) attributes[key] = normalized;
}
function assignOtelToolIdentityAttributes(attributes, evt) {
	attributes["gen_ai.operation.name"] = GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL;
	const toolCallId = evt.toolCallId?.trim();
	if (toolCallId) attributes[ATTR_GEN_AI_TOOL_CALL_ID] = toolCallId;
}
function assignOtelModelContentAttributes(attributes, content, captureContent) {
	if (!captureContent) return;
	const redact = createOtelContentRedactor();
	const redactedInput = redactInternalReasoningFromMessages(content?.inputMessages);
	const redactedOutput = redactInternalReasoningFromMessages(content?.outputMessages);
	const inputMessages = normalizeGenAiMessages(redactedInput, "user");
	if (inputMessages.length > 0) {
		assignJsonAttribute(attributes, ATTR_GEN_AI_INPUT_MESSAGES, inputMessages, redact);
		if (attributes[ATTR_GEN_AI_INPUT_MESSAGES] !== void 0) attributes["input.value"] = attributes[ATTR_GEN_AI_INPUT_MESSAGES];
		attributes["input.mime_type"] = "application/json";
	}
	const toolDefinitions = normalizeGenAiToolDefinitions(content?.toolDefinitions);
	if (toolDefinitions.length > 0) assignJsonAttribute(attributes, ATTR_GEN_AI_TOOL_DEFINITIONS, toolDefinitions, redact);
	const outputMessages = normalizeGenAiMessages(redactedOutput, "assistant");
	if (outputMessages.length > 0) {
		assignJsonAttribute(attributes, ATTR_GEN_AI_OUTPUT_MESSAGES, outputMessages, redact);
		if (attributes[ATTR_GEN_AI_OUTPUT_MESSAGES] !== void 0) attributes["output.value"] = attributes[ATTR_GEN_AI_OUTPUT_MESSAGES];
		attributes["output.mime_type"] = "application/json";
	}
	assignOtelContentAttribute(attributes, "openclaw.content.input_messages", redactedInput, redact);
	assignOtelContentAttribute(attributes, "openclaw.content.tool_definitions", content?.toolDefinitions, redact);
	assignOtelContentAttribute(attributes, "openclaw.content.output_messages", redactedOutput, redact);
}
function assignOtelToolContentAttributes(attributes, content, captureContent) {
	if (!captureContent) return;
	const toolInput = normalizeOtelContentValue(content?.toolInput);
	if (toolInput) {
		attributes[ATTR_GEN_AI_TOOL_CALL_ARGUMENTS] = toolInput;
		attributes["openclaw.content.tool_input"] = toolInput;
	}
	const toolOutput = normalizeOtelContentValue(content?.toolOutput);
	if (toolOutput) {
		attributes[ATTR_GEN_AI_TOOL_CALL_RESULT] = toolOutput;
		attributes["openclaw.content.tool_output"] = toolOutput;
	}
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-harness.ts
function createHarnessRecorders(runtime) {
	const harnessRunMetricAttrs = (evt) => ({
		"openclaw.harness.id": normalizeDiagnosticValue(evt.harnessId, "unknown"),
		"openclaw.harness.plugin": normalizeDiagnosticValue(evt.pluginId),
		...evt.type === "harness.run.started" ? {} : { "openclaw.outcome": evt.type === "harness.run.error" ? "error" : evt.outcome },
		"openclaw.provider": normalizeDiagnosticValue(evt.provider, "unknown"),
		"openclaw.model": normalizeDiagnosticValue(evt.model, "unknown"),
		...evt.channel ? { "openclaw.channel": normalizeDiagnosticValue(evt.channel) } : {}
	});
	return {
		recordAgentCommentary(evt, metadata, privateData) {
			if (!runtime.tracesEnabled || !metadata.trusted) return;
			const span = runtime.getTrackedInternalOrTrustedSpan(evt, metadata);
			if (!span) return;
			const attrs = {
				"openclaw.harness.id": normalizeDiagnosticValue(evt.harnessId, "unknown"),
				"openclaw.commentary.sequence": evt.sourceSequence,
				"openclaw.commentary.text_length": evt.textLength,
				"openclaw.commentary.content_truncated": evt.contentTruncated
			};
			assignOtelModelContentAttributes(attrs, privateData.modelContent, runtime.captureContent);
			span.addEvent("openclaw.agent.commentary", redactOtelAttributes(attrs), evt.sourceTimestampMs);
		},
		recordHarnessRunStarted(evt, metadata, privateData) {
			if (!runtime.tracesEnabled || !metadata.trusted) return;
			const spanAttrs = { ...harnessRunMetricAttrs(evt) };
			runtime.addRunAttrs(spanAttrs, evt);
			const inputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.harnessContent?.userPrompt) : void 0;
			if (inputValue) spanAttrs["input.value"] = inputValue;
			runtime.trackTrustedSpan(evt, metadata, runtime.spanWithDuration("openclaw.harness.run", spanAttrs, void 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				startTimeMs: evt.ts
			}));
		},
		recordHarnessRunFinished(evt, metadata, privateData) {
			const errorType = evt.type === "harness.run.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : "error";
			const attrs = {
				...harnessRunMetricAttrs(evt),
				...evt.type === "harness.run.error" ? {
					"openclaw.harness.phase": evt.phase,
					"openclaw.errorCategory": errorType
				} : {}
			};
			runtime.harnessDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			runtime.addRunAttrs(spanAttrs, evt);
			if (evt.type === "harness.run.completed") {
				if (evt.resultClassification) spanAttrs["openclaw.harness.result_classification"] = normalizeDiagnosticValue(evt.resultClassification);
				if (typeof evt.yieldDetected === "boolean") spanAttrs["openclaw.harness.yield_detected"] = evt.yieldDetected;
				if (evt.itemLifecycle) {
					spanAttrs["openclaw.harness.items.started"] = evt.itemLifecycle.startedCount;
					spanAttrs["openclaw.harness.items.completed"] = evt.itemLifecycle.completedCount;
					spanAttrs["openclaw.harness.items.active"] = evt.itemLifecycle.activeCount;
				}
			} else {
				spanAttrs["error.type"] = errorType;
				if (evt.cleanupFailed) spanAttrs["openclaw.harness.cleanup_failed"] = true;
			}
			const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
			if (redactedError) spanAttrs["openclaw.error"] = redactedError;
			const inputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.harnessContent?.userPrompt) : void 0;
			if (inputValue) spanAttrs["input.value"] = inputValue;
			const outputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.harnessContent?.finalResponse) : void 0;
			if (outputValue) spanAttrs["output.value"] = outputValue;
			const trustedTrace = runtime.trustedTraceContext(evt, metadata);
			const trackedSpan = trustedTrace?.spanId ? runtime.activeTrustedSpans.get(trustedTrace.spanId) : void 0;
			const span = trackedSpan ?? runtime.spanWithDuration("openclaw.harness.run", spanAttrs, evt.durationMs, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			});
			runtime.setSpanAttrs(span, spanAttrs);
			if (evt.type === "harness.run.error" || evt.outcome === "error") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactedError ?? errorType
			});
			runtime.completeTrackedLifecycleSpan(trackedSpan ? trustedTrace : void 0, span, evt.ts);
		},
		recordContextAssembled(evt, metadata) {
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				"openclaw.context.message_count": evt.messageCount,
				"openclaw.context.history_text_chars": evt.historyTextChars,
				"openclaw.context.history_image_blocks": evt.historyImageBlocks,
				"openclaw.context.max_message_text_chars": evt.maxMessageTextChars,
				"openclaw.context.system_prompt_chars": evt.systemPromptChars,
				"openclaw.context.prompt_chars": evt.promptChars,
				"openclaw.context.prompt_images": evt.promptImages
			};
			runtime.addRunAttrs(spanAttrs, evt);
			if (evt.contextTokenBudget !== void 0) spanAttrs["openclaw.context.token_budget"] = evt.contextTokenBudget;
			if (evt.reserveTokens !== void 0) spanAttrs["openclaw.context.reserve_tokens"] = evt.reserveTokens;
			runtime.spanWithDuration("openclaw.context.assembled", spanAttrs, 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			}).end(evt.ts);
		},
		recordModelFailover(evt, metadata) {
			const metricAttrs = {
				"openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown"),
				"openclaw.failover.suspended": evt.suspended === void 0 ? "unknown" : String(evt.suspended),
				"openclaw.lane": normalizeDiagnosticLane(evt.lane, "unknown"),
				"openclaw.model": normalizeDiagnosticValue(evt.fromModel),
				"openclaw.provider": normalizeDiagnosticValue(evt.fromProvider),
				"openclaw.failover.to_model": normalizeDiagnosticValue(evt.toModel),
				"openclaw.failover.to_provider": normalizeDiagnosticValue(evt.toProvider)
			};
			runtime.modelFailoverCounter.add(1, metricAttrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { "openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown") };
			if (evt.fromProvider) spanAttrs["openclaw.provider"] = evt.fromProvider;
			if (evt.fromModel) spanAttrs["openclaw.model"] = evt.fromModel;
			if (evt.toProvider) spanAttrs["openclaw.failover.to_provider"] = evt.toProvider;
			if (evt.toModel) spanAttrs["openclaw.failover.to_model"] = evt.toModel;
			if (evt.lane) spanAttrs["openclaw.lane"] = normalizeDiagnosticLane(evt.lane, "unknown");
			if (evt.suspended !== void 0) spanAttrs["openclaw.failover.suspended"] = evt.suspended;
			if (evt.cascadeDepth !== void 0) spanAttrs["openclaw.failover.cascade_depth"] = evt.cascadeDepth;
			runtime.spanWithDuration("openclaw.model.failover", spanAttrs, 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			}).end(evt.ts);
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-genai-attributes.ts
function emitLatestGenAiSemconv() {
	return process.env["OTEL_SEMCONV_STABILITY_OPT_IN"]?.split(",").map((part) => part.trim()).includes("gen_ai_latest_experimental") ?? false;
}
function genAiOperationName(api, observationUnit) {
	if (observationUnit === "turn") return GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT;
	const normalized = api?.trim().toLowerCase();
	if (!normalized) return "chat";
	if (normalized === "completions" || normalized.endsWith("-completions")) return "text_completion";
	if (normalized === "generate_content" || normalized.includes("generative-ai")) return "generate_content";
	return "chat";
}
function assignPositiveNumberAttr(attrs, key, value) {
	const normalized = asPositiveFiniteNumber(value);
	if (normalized !== void 0) attrs[key] = normalized;
}
function modelCallPromptTokens(usage) {
	const promptTokens = asNonNegativeFiniteNumber(usage.promptTokens);
	if (promptTokens !== void 0) return promptTokens;
	const input = asNonNegativeFiniteNumber(usage.input);
	const cacheRead = asNonNegativeFiniteNumber(usage.cacheRead);
	const cacheWrite = asNonNegativeFiniteNumber(usage.cacheWrite);
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
	]) {
		const normalized = asFiniteNumber(value);
		if (normalized !== void 0) attrs[key] = normalized;
	}
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
		const normalized = asNonNegativeFiniteNumber(value);
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
	attrs["openclaw.model_call.observation_unit"] = evt.observationUnit ?? "request";
}
function modelCallSpanName(evt) {
	if (!emitLatestGenAiSemconv()) return "openclaw.model.call";
	const operationName = genAiOperationName(evt.api, evt.observationUnit);
	return operationName === GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT ? operationName : `${operationName} ${normalizeDiagnosticValue(evt.model)}`;
}
function addUpstreamRequestIdSpanEvent(span, upstreamRequestIdHash) {
	if (!upstreamRequestIdHash) return;
	const boundedHash = normalizeDiagnosticValue(upstreamRequestIdHash);
	if (boundedHash === "unknown") return;
	span.addEvent?.("openclaw.provider.request", { "openclaw.upstreamRequestIdHash": boundedHash });
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-model.ts
function createModelRecorders(runtime) {
	return {
		recordModelCallStarted(evt, metadata) {
			if (!runtime.tracesEnabled || !metadata.trusted) return;
			const trackedSpan = runtime.getTrackedInternalOrTrustedSpan(evt, metadata);
			if (trackedSpan) return trackedSpan.spanContext();
			const spanAttrs = {
				"openclaw.provider": evt.provider,
				"openclaw.model": evt.model
			};
			runtime.addRunAttrs(spanAttrs, evt);
			assignGenAiModelCallAttrs(spanAttrs, evt);
			if (evt.api) spanAttrs["openclaw.api"] = evt.api;
			if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
			assignModelCallPromptStatsAttrs(spanAttrs, evt);
			return runtime.trackTrustedSpan(evt, metadata, runtime.spanWithDuration(modelCallSpanName(evt), spanAttrs, void 0, {
				kind: SpanKind.CLIENT,
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				startTimeMs: evt.ts
			})).spanContext();
		},
		recordModelCallFinished(evt, metadata, modelContent) {
			const errorType = evt.type === "model.call.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : void 0;
			const metricAttrs = {
				"openclaw.provider": evt.provider,
				"openclaw.model": evt.model,
				"openclaw.api": normalizeDiagnosticValue(evt.api),
				"openclaw.transport": normalizeDiagnosticValue(evt.transport),
				"openclaw.model_call.observation_unit": evt.observationUnit ?? "request",
				...errorType !== void 0 ? { "openclaw.errorCategory": errorType } : {},
				...evt.type === "model.call.error" && evt.failureKind ? { "openclaw.failureKind": normalizeDiagnosticValue(evt.failureKind, "other") } : {}
			};
			runtime.modelCallDurationHistogram.record(evt.durationMs, metricAttrs);
			for (const [histogram, value] of [
				[runtime.modelCallRequestBytesHistogram, evt.requestPayloadBytes],
				[runtime.modelCallResponseBytesHistogram, evt.responseStreamBytes],
				[runtime.modelCallTimeToFirstByteHistogram, evt.timeToFirstByteMs]
			]) {
				const normalized = asPositiveFiniteNumber(value);
				if (normalized !== void 0) histogram.record(normalized, metricAttrs);
			}
			runtime.genAiOperationDurationHistogram.record(evt.durationMs / 1e3, {
				"gen_ai.operation.name": genAiOperationName(evt.api, evt.observationUnit),
				"gen_ai.provider.name": normalizeDiagnosticValue(evt.provider),
				"gen_ai.request.model": normalizeDiagnosticValue(evt.model),
				...errorType ? { "error.type": errorType } : {}
			});
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				"openclaw.provider": evt.provider,
				"openclaw.model": evt.model,
				...errorType !== void 0 ? {
					"openclaw.errorCategory": errorType,
					"error.type": errorType
				} : {}
			};
			runtime.addRunAttrs(spanAttrs, evt);
			if (evt.type === "model.call.error" && evt.failureKind) spanAttrs["openclaw.failureKind"] = normalizeDiagnosticValue(evt.failureKind, "other");
			assignGenAiModelCallAttrs(spanAttrs, evt);
			if (evt.api) spanAttrs["openclaw.api"] = evt.api;
			if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
			for (const [key, value] of [
				["openclaw.model_call.request_bytes", evt.requestPayloadBytes],
				["openclaw.model_call.response_bytes", evt.responseStreamBytes],
				["openclaw.model_call.time_to_first_byte_ms", evt.timeToFirstByteMs]
			]) assignPositiveNumberAttr(spanAttrs, key, value);
			assignModelCallPromptStatsAttrs(spanAttrs, evt);
			assignModelCallUsageAttrs(spanAttrs, evt);
			assignOtelModelContentAttributes(spanAttrs, modelContent, runtime.captureContent);
			const span = runtime.takeTrackedTrustedSpan(evt, metadata) ?? runtime.spanWithDuration(modelCallSpanName(evt), spanAttrs, evt.durationMs, {
				kind: SpanKind.CLIENT,
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			});
			runtime.setSpanAttrs(span, spanAttrs);
			addUpstreamRequestIdSpanEvent(span, evt.upstreamRequestIdHash);
			if (evt.type === "model.call.error") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactSensitiveText(evt.errorCategory)
			});
			span.end(evt.ts);
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-operations.ts
function createOperationsRecorders(runtime) {
	const sessionRecoveryAttrs = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
		if (evt.activeWorkKind) attrs["openclaw.active_work_kind"] = evt.activeWorkKind;
		return attrs;
	};
	const recordMemoryUsageMetrics = (evt, attrs = {}) => {
		runtime.memoryRssHistogram.record(evt.memory.rssBytes, attrs);
		runtime.memoryHeapUsedHistogram.record(evt.memory.heapUsedBytes, attrs);
		runtime.memoryHeapTotalHistogram.record(evt.memory.heapTotalBytes, attrs);
		runtime.memoryExternalHistogram.record(evt.memory.externalBytes, attrs);
		runtime.memoryArrayBuffersHistogram.record(evt.memory.arrayBuffersBytes, attrs);
	};
	return {
		recordGatewayRpc(evt, metadata) {
			if (!metadata.trusted || evt.phase === "response" && evt.firstResponse === false) return;
			const attrs = { "openclaw.gateway.rpc.method": evt.method };
			if (evt.phase === "received") {
				runtime.gatewayRpcRequestsCounter.add(1, attrs);
				return;
			}
			const outcomeAttrs = {
				"openclaw.gateway.rpc.phase": evt.phase,
				"openclaw.gateway.rpc.outcome": evt.outcome
			};
			runtime.gatewayRpcOutcomesCounter.add(1, outcomeAttrs);
			switch (evt.phase) {
				case "response":
					if (evt.outcome === "ok" || evt.outcome === "error") runtime.gatewayRpcFirstResponseHistogram.record(evt.durationMs, attrs);
					break;
				case "handler":
					runtime.gatewayRpcHandlerHistogram.record(evt.durationMs, attrs);
					runtime.gatewayRpcAdmissionHistogram.record(evt.admissionMs, attrs);
					break;
				case "dispatch": if (evt.queueWaitMs !== void 0) runtime.gatewayRpcQueueWaitHistogram.record(evt.queueWaitMs, attrs);
			}
			if (!runtime.tracesEnabled) return;
			const span = runtime.spanWithDuration(`openclaw.gateway.rpc.${evt.phase}`, {
				...attrs,
				...outcomeAttrs,
				...evt.phase === "handler" ? { "openclaw.gateway.rpc.admission_ms": evt.admissionMs } : {},
				...evt.phase === "dispatch" ? { "openclaw.gateway.rpc.response": evt.response } : {}
			}, evt.durationMs, {
				endTimeMs: evt.ts,
				parentContext: runtime.internalOrTrustedExplicitParentContext(evt, metadata) ?? ROOT_CONTEXT
			});
			if (evt.outcome === "error" || evt.outcome === "threw") span.setStatus({ code: SpanStatusCode.ERROR });
			span.end(evt.ts);
		},
		recordLaneEnqueue(evt) {
			const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
			runtime.laneEnqueueCounter.add(1, attrs);
			runtime.queueDepthHistogram.record(evt.queueSize, attrs);
		},
		recordLaneDequeue(evt) {
			const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
			runtime.laneDequeueCounter.add(1, attrs);
			runtime.queueDepthHistogram.record(evt.queueSize, attrs);
			if (typeof evt.waitMs === "number") runtime.queueWaitHistogram.record(evt.waitMs, attrs);
		},
		recordSessionState(evt) {
			const attrs = { "openclaw.state": evt.state };
			if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
			runtime.sessionStateCounter.add(1, attrs);
		},
		recordSessionTurnCreated(evt) {
			runtime.sessionTurnCreatedCounter.add(1, {
				"openclaw.agent": normalizeDiagnosticValue(evt.agentId, "unknown"),
				"openclaw.channel": normalizeDiagnosticValue(evt.channel, "unknown"),
				"openclaw.trigger": evt.trigger
			});
		},
		recordSessionStuck(evt) {
			const attrs = { "openclaw.state": evt.state };
			runtime.sessionStuckCounter.add(1, attrs);
			if (typeof evt.ageMs === "number") runtime.sessionStuckAgeHistogram.record(evt.ageMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			spanAttrs["openclaw.queueDepth"] = evt.queueDepth ?? 0;
			spanAttrs["openclaw.ageMs"] = evt.ageMs;
			const span = runtime.tracer.startSpan("openclaw.session.stuck", { attributes: spanAttrs });
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: "session stuck"
			});
			span.end();
		},
		recordSessionRecoveryRequested(evt) {
			const attrs = sessionRecoveryAttrs(evt);
			attrs["openclaw.action"] = evt.allowActiveAbort ? "abort" : "recover";
			runtime.sessionRecoveryRequestedCounter.add(1, attrs);
			runtime.sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
		},
		recordSessionRecoveryCompleted(evt) {
			const attrs = sessionRecoveryAttrs(evt);
			attrs["openclaw.status"] = evt.status;
			attrs["openclaw.action"] = normalizeDiagnosticValue(evt.action, "unknown");
			if (evt.outcomeReason) attrs["openclaw.reason"] = redactSensitiveText(evt.outcomeReason);
			runtime.sessionRecoveryCompletedCounter.add(1, attrs);
			runtime.sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
		},
		recordTalkEvent(evt, metadata) {
			if (!metadata.trusted) return;
			const attrs = {
				"openclaw.talk.brain": normalizeDiagnosticValue(evt.brain),
				"openclaw.talk.event_type": normalizeDiagnosticValue(evt.talkEventType),
				"openclaw.talk.mode": normalizeDiagnosticValue(evt.mode),
				"openclaw.talk.provider": normalizeDiagnosticValue(evt.provider),
				"openclaw.talk.transport": normalizeDiagnosticValue(evt.transport)
			};
			runtime.talkEventCounter.add(1, attrs);
			if (typeof evt.durationMs === "number") runtime.talkEventDurationHistogram.record(evt.durationMs, attrs);
			if (typeof evt.byteLength === "number") runtime.talkAudioBytesHistogram.record(evt.byteLength, attrs);
		},
		recordRunAttempt(evt) {
			runtime.runAttemptCounter.add(1, { "openclaw.attempt": evt.attempt });
		},
		recordToolLoop(evt) {
			const attrs = {
				"openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool"),
				"openclaw.loop.level": evt.level,
				"openclaw.loop.action": evt.action,
				"openclaw.loop.detector": evt.detector,
				"openclaw.loop.count": evt.count,
				...evt.pairedToolName ? { "openclaw.loop.paired_tool": normalizeDiagnosticValue(evt.pairedToolName, "tool") } : {}
			};
			runtime.toolLoopCounter.add(1, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			runtime.addRunAttrs(spanAttrs, evt);
			const span = runtime.spanWithDuration("openclaw.tool.loop", spanAttrs, 0, { endTimeMs: evt.ts });
			if (evt.level === "critical" || evt.action === "block") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: `${evt.detector}:${evt.action}`
			});
			span.end(evt.ts);
		},
		recordMemoryUsageMetrics,
		recordMemoryPressure(evt) {
			const attrs = {
				"openclaw.memory.level": evt.level,
				"openclaw.memory.reason": evt.reason
			};
			runtime.memoryPressureCounter.add(1, attrs);
			recordMemoryUsageMetrics(evt, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				...attrs,
				"openclaw.memory.rss_bytes": evt.memory.rssBytes,
				"openclaw.memory.heap_used_bytes": evt.memory.heapUsedBytes,
				"openclaw.memory.heap_total_bytes": evt.memory.heapTotalBytes,
				"openclaw.memory.external_bytes": evt.memory.externalBytes,
				"openclaw.memory.array_buffers_bytes": evt.memory.arrayBuffersBytes
			};
			assignOptionalNumberAttrs(spanAttrs, "openclaw.memory.", {
				threshold_bytes: evt.thresholdBytes,
				rss_growth_bytes: evt.rssGrowthBytes,
				window_ms: evt.windowMs
			});
			const span = runtime.spanWithDuration("openclaw.memory.pressure", spanAttrs, 0, { endTimeMs: evt.ts });
			if (evt.level === "critical") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: evt.reason
			});
			span.end(evt.ts);
		},
		recordAsyncQueueDropped(evt) {
			runtime.asyncQueueDroppedCounter.add(evt.droppedEvents, { "openclaw.diagnostic.async_queue.drop_class": "total" });
			for (const [dropClass, field] of [
				["trusted", "droppedTrustedEvents"],
				["untrusted", "droppedUntrustedEvents"],
				["priority", "droppedPriorityEvents"]
			]) if (evt[field] !== void 0) runtime.asyncQueueDroppedCounter.add(evt[field], { "openclaw.diagnostic.async_queue.drop_class": dropClass });
		},
		recordRunCompleted(evt, metadata, privateData) {
			const attrs = {
				"openclaw.outcome": evt.outcome,
				"openclaw.provider": evt.provider ?? "unknown",
				"openclaw.model": evt.model ?? "unknown"
			};
			if (evt.channel) attrs["openclaw.channel"] = evt.channel;
			if (evt.blockedBy) attrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
			runtime.durationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { "openclaw.outcome": evt.outcome };
			runtime.addRunAttrs(spanAttrs, evt);
			if (evt.blockedBy) spanAttrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
			if (evt.errorCategory) spanAttrs["openclaw.errorCategory"] = normalizeDiagnosticValue(evt.errorCategory, "other");
			const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
			if (redactedError) spanAttrs["openclaw.error"] = redactedError;
			const inputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.messageContent?.userPrompt) : void 0;
			if (inputValue) spanAttrs["input.value"] = inputValue;
			const outputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.messageContent?.finalResponse) : void 0;
			if (outputValue) spanAttrs["output.value"] = outputValue;
			const trustedTrace = runtime.trustedTraceContext(evt, metadata);
			const trackedSpan = trustedTrace?.spanId ? runtime.activeTrustedSpans.get(trustedTrace.spanId) : void 0;
			const span = trackedSpan ?? runtime.spanWithDuration("openclaw.run", spanAttrs, evt.durationMs, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			});
			runtime.setSpanAttrs(span, spanAttrs);
			if (evt.outcome === "error") {
				const message = redactedError ?? (evt.errorCategory ? redactSensitiveText(evt.errorCategory) : void 0);
				span.setStatus({
					code: SpanStatusCode.ERROR,
					...message ? { message } : {}
				});
			}
			runtime.completeTrackedLifecycleSpan(trackedSpan ? trustedTrace : void 0, span, evt.ts);
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-tools.ts
function createToolAndSystemRecorders(runtime) {
	const toolExecutionBaseAttrs = (evt) => ({
		"openclaw.toolName": evt.toolName,
		"openclaw.tool.source": normalizeDiagnosticValue(evt.toolSource, "core"),
		"gen_ai.tool.name": evt.toolName,
		...evt.toolOwner ? { "openclaw.tool.owner": normalizeDiagnosticValue(evt.toolOwner) } : {},
		...evt.paramsSummary ? { "openclaw.tool.params.kind": evt.paramsSummary.kind } : {}
	});
	const toolTimestampMs = (evt) => evt.sourceTimestampMs ?? evt.ts;
	return {
		recordGcDuration(evt, metadata) {
			if (!metadata.trusted && !isInternalDiagnosticEventMetadata(metadata)) return;
			runtime.gcDurationHistogram.record(evt.durationMs, {
				"openclaw.gc.kind": evt.kind ?? "unknown",
				"openclaw.gc.thread": evt.thread ?? "main",
				...evt.workerSlot === void 0 ? {} : { "openclaw.gc.worker_slot": evt.workerSlot }
			}, ROOT_CONTEXT);
		},
		recordGatewayEventLoopSample(evt, metadata) {
			if (!metadata.trusted && !isInternalDiagnosticEventMetadata(metadata)) return;
			runtime.gatewayEventLoopDelayMaxHistogram.record(evt.delayMaxMs, void 0, ROOT_CONTEXT);
			runtime.gatewayEventLoopObservedCounter.add(evt.intervalMs, void 0, ROOT_CONTEXT);
		},
		recordSkillUsed(evt, metadata) {
			if (!metadata.trusted) return;
			const attrs = {
				"openclaw.skill.name": normalizeDiagnosticValue(evt.skillName, "skill"),
				"openclaw.skill.source": normalizeDiagnosticValue(evt.skillSource),
				"openclaw.skill.activation": normalizeDiagnosticValue(evt.activation),
				...evt.agentId ? { "openclaw.agent": normalizeDiagnosticValue(evt.agentId) } : {},
				...evt.toolName ? { "openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool") } : {}
			};
			runtime.skillUsedCounter.add(1, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			runtime.addRunAttrs(spanAttrs, evt);
			const span = runtime.spanWithDuration("openclaw.skill.used", spanAttrs, 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			});
			runtime.setSpanAttrs(span, spanAttrs);
			span.end(evt.ts);
		},
		recordToolExecutionStarted(evt, metadata) {
			if (!runtime.tracesEnabled || !metadata.trusted) return;
			const trackedSpan = runtime.getTrackedInternalOrTrustedSpan(evt, metadata);
			if (trackedSpan) return trackedSpan.spanContext();
			const spanAttrs = {
				...toolExecutionBaseAttrs(evt),
				...runtime.paramsSummaryAttrs(evt.paramsSummary)
			};
			assignOtelToolIdentityAttributes(spanAttrs, evt);
			return runtime.trackTrustedSpan(evt, metadata, runtime.spanWithDuration("openclaw.tool.execution", spanAttrs, void 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				startTimeMs: toolTimestampMs(evt)
			})).spanContext();
		},
		recordToolExecutionFinished(evt, metadata, toolContent) {
			const attrs = toolExecutionBaseAttrs(evt);
			if (evt.type === "tool.execution.error") attrs["openclaw.errorCategory"] = normalizeDiagnosticValue(evt.errorCategory, "other");
			runtime.toolExecutionDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				...attrs,
				...runtime.paramsSummaryAttrs(evt.paramsSummary)
			};
			runtime.addRunAttrs(spanAttrs, evt);
			assignOtelToolIdentityAttributes(spanAttrs, evt);
			if (evt.type === "tool.execution.error" && evt.errorCode) spanAttrs["openclaw.errorCode"] = normalizeDiagnosticValue(evt.errorCode, "other");
			assignOtelToolContentAttributes(spanAttrs, toolContent, runtime.captureContent);
			const span = runtime.takeTrackedTrustedSpan(evt, metadata) ?? runtime.spanWithDuration("openclaw.tool.execution", spanAttrs, evt.durationMs, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: toolTimestampMs(evt)
			});
			runtime.setSpanAttrs(span, spanAttrs);
			if (evt.type === "tool.execution.error") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactSensitiveText(evt.errorCategory)
			});
			span.end(toolTimestampMs(evt));
		},
		recordToolExecutionBlocked(evt, metadata) {
			runtime.toolExecutionBlockedCounter.add(1, {
				...toolExecutionBaseAttrs(evt),
				"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
			});
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				...toolExecutionBaseAttrs(evt),
				...runtime.paramsSummaryAttrs(evt.paramsSummary),
				"openclaw.outcome": "blocked",
				"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
			};
			runtime.addRunAttrs(spanAttrs, evt);
			assignOtelToolIdentityAttributes(spanAttrs, evt);
			const span = runtime.takeTrackedTrustedSpan(evt, metadata) ?? runtime.spanWithDuration("openclaw.tool.execution", spanAttrs, 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: toolTimestampMs(evt)
			});
			runtime.setSpanAttrs(span, spanAttrs);
			span.end(toolTimestampMs(evt));
		},
		recordPayloadLarge(evt) {
			const attrs = {
				"openclaw.payload.action": evt.action,
				"openclaw.payload.surface": normalizeDiagnosticValue(evt.surface, "unknown"),
				"openclaw.channel": normalizeDiagnosticValue(evt.channel, "none"),
				"openclaw.plugin": normalizeDiagnosticValue(evt.pluginId, "none"),
				"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none")
			};
			runtime.payloadLargeCounter.add(1, attrs);
			const bytes = asPositiveFiniteNumber(evt.bytes);
			if (bytes !== void 0) runtime.payloadLargeBytesHistogram.record(bytes, attrs);
		},
		recordExecProcessCompleted(evt, metadata) {
			const attrs = {
				"openclaw.exec.target": evt.target,
				"openclaw.exec.mode": evt.mode,
				"openclaw.outcome": evt.outcome
			};
			if (evt.failureKind) attrs["openclaw.failureKind"] = evt.failureKind;
			runtime.execProcessDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				...attrs,
				"openclaw.exec.command_length": evt.commandLength
			};
			if (typeof evt.exitCode === "number") spanAttrs["openclaw.exec.exit_code"] = evt.exitCode;
			if (evt.exitSignal) spanAttrs["openclaw.exec.exit_signal"] = normalizeDiagnosticValue(evt.exitSignal, "other");
			if (evt.timedOut !== void 0) spanAttrs["openclaw.exec.timed_out"] = evt.timedOut;
			const span = runtime.spanWithDuration("openclaw.exec", spanAttrs, evt.durationMs, {
				parentContext: runtime.exportedInternalOrTrustedContext(evt, metadata),
				endTimeMs: evt.ts
			});
			if (evt.outcome === "failed") span.setStatus({
				code: SpanStatusCode.ERROR,
				...evt.failureKind ? { message: evt.failureKind } : {}
			});
			span.end(evt.ts);
		},
		recordHeartbeat(evt) {
			runtime.queueDepthHistogram.record(evt.queued, { "openclaw.channel": "heartbeat" });
		},
		recordLivenessWarning(evt) {
			const reason = evt.reasons.join(":");
			const attrs = { "openclaw.liveness.reason": normalizeDiagnosticValue(reason, "unknown") };
			runtime.livenessWarningCounter.add(1, attrs);
			runtime.queueDepthHistogram.record(evt.queued, { "openclaw.channel": "liveness" });
			for (const [histogram, value] of [
				[runtime.livenessEventLoopDelayP99Histogram, evt.eventLoopDelayP99Ms],
				[runtime.livenessEventLoopDelayMaxHistogram, evt.eventLoopDelayMaxMs],
				[runtime.livenessEventLoopUtilizationHistogram, evt.eventLoopUtilization],
				[runtime.livenessCpuCoreRatioHistogram, evt.cpuCoreRatio]
			]) if (value !== void 0) histogram.record(value, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = {
				...attrs,
				"openclaw.liveness.active": evt.active,
				"openclaw.liveness.waiting": evt.waiting,
				"openclaw.liveness.queued": evt.queued,
				"openclaw.liveness.interval_ms": evt.intervalMs
			};
			assignOptionalNumberAttrs(spanAttrs, "openclaw.liveness.", {
				event_loop_delay_p99_ms: evt.eventLoopDelayP99Ms,
				event_loop_delay_max_ms: evt.eventLoopDelayMaxMs,
				event_loop_utilization: evt.eventLoopUtilization,
				cpu_user_ms: evt.cpuUserMs,
				cpu_system_ms: evt.cpuSystemMs,
				cpu_total_ms: evt.cpuTotalMs,
				cpu_core_ratio: evt.cpuCoreRatio
			});
			const span = runtime.spanWithDuration("openclaw.liveness.warning", spanAttrs, 0, { endTimeMs: evt.ts });
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: reason
			});
			span.end(evt.ts);
		},
		recordDiagnosticPhaseCompleted(evt, metadata) {
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { "openclaw.phase": normalizeDiagnosticValue(evt.name, "unknown") };
			assignOptionalNumberAttrs(spanAttrs, "openclaw.phase.", {
				cpu_user_ms: evt.cpuUserMs,
				cpu_system_ms: evt.cpuSystemMs,
				cpu_total_ms: evt.cpuTotalMs,
				cpu_core_ratio: evt.cpuCoreRatio
			});
			for (const [key, value] of Object.entries(evt.details ?? {})) spanAttrs[`openclaw.phase.detail.${key}`] = typeof value === "boolean" ? String(value) : value;
			runtime.spanWithDuration("openclaw.diagnostic.phase", spanAttrs, evt.durationMs, {
				endTimeMs: evt.ts,
				...metadata.trusted ? { parentContext: runtime.internalOrTrustedExplicitParentContext(evt, metadata) ?? ROOT_CONTEXT } : {}
			}).end(evt.ts);
		},
		recordTelemetryExporter(evt, metadata) {
			if (!metadata.trusted) return;
			runtime.telemetryExporterCounter.add(1, {
				"openclaw.exporter": normalizeDiagnosticValue(evt.exporter, "unknown"),
				"openclaw.signal": evt.signal,
				"openclaw.status": evt.status,
				...evt.reason ? { "openclaw.reason": evt.reason } : {},
				...evt.errorCategory ? { "openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other") } : {}
			});
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-usage.ts
function createUsageRecorders(runtime) {
	const messageDeliveryAttrs = (evt) => ({
		"openclaw.channel": normalizeDiagnosticValue(evt.channel),
		"openclaw.delivery.kind": normalizeDiagnosticValue(evt.deliveryKind, "other")
	});
	return {
		recordModelUsage(evt, metadata, hostPluginId) {
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
			for (const [tokenType, field] of [
				["input", "input"],
				["output", "output"],
				["cache_read", "cacheRead"],
				["cache_write", "cacheWrite"],
				["prompt", "promptTokens"],
				["total", "total"]
			]) {
				const amount = usage[field];
				if (!amount) continue;
				runtime.tokensCounter.add(amount, {
					...attrs,
					"openclaw.token": tokenType
				});
				if (tokenType === "input" || tokenType === "output") runtime.genAiTokenUsageHistogram.record(amount, {
					...genAiAttrs,
					"gen_ai.token.type": tokenType
				});
			}
			if (evt.costUsd) runtime.costCounter.add(evt.costUsd, attrs);
			if (evt.durationMs) runtime.durationHistogram.record(evt.durationMs, attrs);
			for (const kind of ["limit", "used"]) {
				const amount = evt.context?.[kind];
				if (amount) runtime.contextHistogram.record(amount, {
					...attrs,
					"openclaw.context": kind
				});
			}
			if (!runtime.tracesEnabled) return;
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
			runtime.addRunAttrs(spanAttrs, evt);
			assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.input_tokens", genAiInputTokens);
			assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.output_tokens", usage.output);
			assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_read.input_tokens", usage.cacheRead);
			assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_creation.input_tokens", usage.cacheWrite);
			runtime.spanWithDuration("openclaw.model.usage", spanAttrs, evt.durationMs, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				endTimeMs: evt.ts
			}).end(evt.ts);
		},
		recordWebhookReceived(evt) {
			const attrs = {
				"openclaw.channel": evt.channel ?? "unknown",
				"openclaw.webhook": evt.updateType ?? "unknown"
			};
			runtime.webhookReceivedCounter.add(1, attrs);
		},
		recordWebhookProcessed(evt) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
			};
			if (typeof evt.durationMs === "number") runtime.webhookDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			runtime.spanWithDuration("openclaw.webhook.processed", spanAttrs, evt.durationMs).end();
		},
		recordWebhookError(evt) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
			};
			runtime.webhookErrorCounter.add(1, attrs);
			if (!runtime.tracesEnabled) return;
			const redactedError = redactSensitiveText(evt.error);
			const spanAttrs = {
				...attrs,
				"openclaw.error": redactedError
			};
			const span = runtime.tracer.startSpan("openclaw.webhook.error", { attributes: spanAttrs });
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactedError
			});
			span.end();
		},
		recordMessageQueued(evt) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.source": normalizeDiagnosticValue(evt.source)
			};
			runtime.messageQueuedCounter.add(1, attrs);
			if (typeof evt.queueDepth === "number") runtime.queueDepthHistogram.record(evt.queueDepth, attrs);
		},
		recordMessageReceived(evt) {
			runtime.messageReceivedCounter.add(1, {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.source": normalizeDiagnosticValue(evt.source)
			});
		},
		recordMessageDispatchStarted(evt, metadata) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.source": normalizeDiagnosticValue(evt.source)
			};
			runtime.messageDispatchStartedCounter.add(1, attrs);
			if (!runtime.tracesEnabled) return;
			const traceContext = runtime.internalOrTrustedTraceContext(evt, metadata);
			if (!traceContext?.spanId || runtime.activeTrustedSpans.has(traceContext.spanId)) return;
			runtime.trackInternalOrTrustedSpan(evt, metadata, runtime.spanWithDuration("openclaw.message.processed", attrs, void 0, {
				parentContext: runtime.internalOrTrustedExplicitParentContext(evt, metadata),
				startTimeMs: evt.ts
			}));
		},
		recordMessageDispatchCompleted(evt) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.outcome": evt.outcome,
				"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none"),
				"openclaw.source": normalizeDiagnosticValue(evt.source)
			};
			runtime.messageDispatchCompletedCounter.add(1, attrs);
			runtime.messageDispatchDurationHistogram.record(evt.durationMs, attrs);
		},
		recordMessageProcessed(evt, metadata, privateData) {
			const attrs = {
				"openclaw.channel": normalizeDiagnosticValue(evt.channel),
				"openclaw.outcome": evt.outcome ?? "unknown"
			};
			runtime.messageProcessedCounter.add(1, attrs);
			if (typeof evt.durationMs === "number") runtime.messageDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const spanAttrs = { ...attrs };
			runtime.addRunAttrs(spanAttrs, evt);
			if (evt.reason) spanAttrs["openclaw.reason"] = normalizeDiagnosticValue(evt.reason, "unknown");
			const inputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.messageContent?.userPrompt) : void 0;
			if (inputValue) spanAttrs["input.value"] = inputValue;
			const outputValue = runtime.captureContent ? normalizeOtelContentValue(privateData.messageContent?.finalResponse) : void 0;
			if (outputValue) spanAttrs["output.value"] = outputValue;
			const trackedSpan = runtime.getTrackedInternalOrTrustedSpan(evt, metadata);
			const span = trackedSpan ?? runtime.spanWithDuration("openclaw.message.processed", spanAttrs, evt.durationMs, {
				parentContext: runtime.internalOrTrustedExplicitParentContext(evt, metadata),
				endTimeMs: evt.ts
			});
			runtime.setSpanAttrs(span, spanAttrs);
			if (evt.outcome === "error" && evt.error) span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactSensitiveText(evt.error)
			});
			const traceContext = runtime.internalOrTrustedTraceContext(evt, metadata);
			runtime.completeTrackedLifecycleSpan(trackedSpan ? traceContext : void 0, span, evt.ts);
		},
		recordMessageDeliveryStarted(evt) {
			runtime.messageDeliveryStartedCounter.add(1, messageDeliveryAttrs(evt));
		},
		recordMessageDeliveryFinished(evt, metadata) {
			const attrs = {
				...messageDeliveryAttrs(evt),
				"openclaw.outcome": evt.type === "message.delivery.error" ? "error" : "completed",
				...evt.type === "message.delivery.error" ? { "openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other") } : {}
			};
			runtime.messageDeliveryDurationHistogram.record(evt.durationMs, attrs);
			if (!runtime.tracesEnabled) return;
			const span = runtime.spanWithDuration("openclaw.message.delivery", {
				...attrs,
				...evt.type === "message.delivery.completed" ? { "openclaw.delivery.result_count": evt.resultCount } : {}
			}, evt.durationMs, {
				parentContext: runtime.activeInternalOrTrustedContext(evt, metadata),
				endTimeMs: evt.ts
			});
			if (evt.type === "message.delivery.error") span.setStatus({
				code: SpanStatusCode.ERROR,
				message: redactSensitiveText(evt.errorCategory)
			});
			span.end(evt.ts);
		},
		recordRunStarted(evt, metadata) {
			if (!runtime.tracesEnabled || !metadata.trusted) return;
			const spanAttrs = {};
			runtime.addRunAttrs(spanAttrs, evt);
			const span = runtime.trackTrustedSpan(evt, metadata, runtime.spanWithDuration("openclaw.run", spanAttrs, void 0, {
				parentContext: runtime.activeTrustedParentContext(evt, metadata),
				startTimeMs: evt.ts
			}));
			const parentSpanId = runtime.trustedTraceContext(evt, metadata)?.parentSpanId;
			if (parentSpanId && !runtime.activeTrustedSpans.has(parentSpanId)) {
				const owner = evt.runId;
				runtime.activeTrustedSpanAliases.set(runtime.trustedSpanAliasKey(parentSpanId, owner), {
					span,
					spanId: parentSpanId,
					owner
				});
			}
		}
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
		return tracer.startSpan(name, {
			attributes: redactOtelAttributes(attributes),
			...options.kind !== void 0 ? { kind: options.kind } : {},
			...startTime !== void 0 ? { startTime } : {}
		}, options.parentContext ?? void 0);
	};
	const trustedTraceContext = (evt, metadata) => metadata.trusted ? normalizeTraceContext(evt.trace) : void 0;
	const internalOrTrustedTraceContext = (evt, metadata) => metadata.internal ? normalizeTraceContext(evt.trace) : normalizedTrustedTraceContext(evt, metadata);
	const trustedSpanAliasOwner = (evt) => "runId" in evt ? evt.runId || void 0 : void 0;
	const trustedSpanAliasKey = (spanId, owner) => `${spanId}:run:${owner}`;
	const retainedTrustedSpanContextKey = (traceId, spanId, owner) => `${traceId}:${owner ? trustedSpanAliasKey(spanId, owner) : spanId}`;
	const retainedTrustedSpanContext = (traceContext, spanId, owner) => {
		if (!traceContext?.traceId || !spanId) return;
		return (owner ? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId, owner)) : void 0) ?? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId));
	};
	const activeTrustedSpanAlias = (spanId, owner) => {
		if (!owner) return;
		return activeTrustedSpanAliases.get(trustedSpanAliasKey(spanId, owner))?.span;
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
		retainedTrustedSpanContexts.set(retainedTrustedSpanContextKey(traceId, spanId, owner), spanContext);
		pruneMapToMaxSize(retainedTrustedSpanContexts, MAX_RETAINED_TRUSTED_SPAN_CONTEXTS);
	};
	const completeTrackedLifecycleSpan = (traceContext, span, endTimeMs) => {
		if (!traceContext?.spanId) {
			span.end(endTimeMs);
			return;
		}
		const spanId = traceContext.spanId;
		const spanContext = span.spanContext();
		const retainedKeys = [{ spanId }];
		for (const [aliasKey, alias] of activeTrustedSpanAliases) if (alias.span === span) {
			retainedKeys.push({
				spanId: alias.spanId,
				owner: alias.owner
			});
			activeTrustedSpanAliases.delete(aliasKey);
		}
		if (activeTrustedSpans.get(spanId) === span) activeTrustedSpans.delete(spanId);
		span.end(endTimeMs);
		for (const retainedKey of retainedKeys) retainTrustedSpanContext(traceContext.traceId, retainedKey.spanId, spanContext, retainedKey.owner);
	};
	const addRunAttrs = (spanAttrs, evt) => {
		if (evt.provider) spanAttrs["openclaw.provider"] = evt.provider;
		if (evt.model) spanAttrs["openclaw.model"] = evt.model;
		if (evt.channel) spanAttrs["openclaw.channel"] = evt.channel;
		if (evt.trigger) spanAttrs["openclaw.trigger"] = evt.trigger;
		if (evt.agentId) spanAttrs["openclaw.agent"] = normalizeDiagnosticValue(evt.agentId);
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
		spanWithDuration,
		trustedTraceContext,
		internalOrTrustedTraceContext,
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
function isOtelSdkDisabled(logger) {
	const value = process.env.OTEL_SDK_DISABLED?.trim().toLowerCase();
	if (!value || value === "false") return false;
	if (value === "true") return true;
	logger.warn("diagnostics-otel: invalid OTEL_SDK_DISABLED value; expected true or false, using false");
	return false;
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
function createStartupRollbackError(startupError, cleanupError) {
	return new AggregateError([startupError, cleanupError], "diagnostics-otel startup failed and rollback cleanup failed", { cause: startupError });
}
function publicExporterEventForHealth(event) {
	const base = {
		exporter: event.exporter,
		signal: event.signal
	};
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
				const protocol = otel.protocol ?? readNonBlankString(process.env[`OTEL_EXPORTER_OTLP_${signal.toUpperCase()}_PROTOCOL`]) ?? readNonBlankString(process.env["OTEL_EXPORTER_OTLP_PROTOCOL"]) ?? OTLP_HTTP_PROTOBUF_PROTOCOL;
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
			const endpoint = hasOwnedOtlpSignal ? normalizeOptionalString(otel.endpoint ?? sharedEnvEndpoint) : void 0;
			const headers = otel.headers ?? void 0;
			const serviceName = otel.serviceName?.trim() || process.env.OTEL_SERVICE_NAME || "openclaw";
			const sampleRate = asFiniteNumberInRange(otel.sampleRate, {
				min: 0,
				max: 1
			});
			const captureContent = otel.captureContent === true;
			const resource = resources.resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName });
			const resolveSignal = (signal, enabled) => {
				if (!enabled) return {};
				const signalIdentifier = {
					logs: "LOGS",
					traces: "TRACES",
					metrics: "METRICS"
				}[signal];
				const url = resolveSignalOtelUrl({
					signalEndpoint: otel[`${signal}Endpoint`],
					signalEnvEndpoint: process.env[`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`],
					sharedEnvEndpoint,
					endpoint,
					path: `v1/${signal}`
				});
				return {
					url,
					httpAgentOptions: resolveOtelHttpAgentOptions({
						url,
						signalIdentifier
					})
				};
			};
			const { url: logUrl, httpAgentOptions: logHttpAgentOptions } = resolveSignal("logs", logsToOtlp);
			const { url: traceUrl, httpAgentOptions: traceHttpAgentOptions } = resolveSignal("traces", tracesToOtlp);
			const { url: metricUrl, httpAgentOptions: metricHttpAgentOptions } = resolveSignal("metrics", metricsToOtlp);
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
				captureContent,
				emitExporterEvent,
				flushIntervalMs: otel.flushIntervalMs,
				headers,
				logger: ctx.logger,
				logsToOtlp,
				logsToStdout,
				logHttpAgentOptions,
				logUrl,
				resource,
				serviceName
			});
			active.logProvider = diagnosticsLogs.logProvider;
			const recorderRuntime = {
				...diagnosticMetrics,
				...diagnosticsTrace,
				captureContent,
				tracesEnabled: tracesActive
			};
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
				recordLogEvent: diagnosticsLogs.recordLogEvent
			}), metricsActive ? tracesActive ? void 0 : { exclude: ["diagnostic.phase.completed"] } : tracesActive ? { exclude: ["gateway.event_loop.sample", "diagnostic.gc"] } : { include: ["log.record", "security.event"] });
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
					return spanContext ? {
						traceId: spanContext.traceId,
						spanId: spanContext.spanId,
						traceFlags: spanContext.traceFlags.toString(16).padStart(2, "0")
					} : void 0;
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
