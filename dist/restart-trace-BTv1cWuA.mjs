import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/restart-trace.ts
const restartTraceLog = createSubsystemLogger("gateway");
const RESTART_TRACE_HANDOFF_STARTED_AT_ENV = "OPENCLAW_GATEWAY_RESTART_TRACE_STARTED_AT_MS";
const RESTART_TRACE_HANDOFF_LAST_AT_ENV = "OPENCLAW_GATEWAY_RESTART_TRACE_LAST_AT_MS";
const RESTART_TRACE_HANDOFF_MAX_AGE_MS = 6e5;
const CLOSE_STEP_SLOW_MS = 1e3;
const MAX_PENDING_CLOSE_STEPS = 8;
let startedAt = 0;
let lastAt = 0;
let active = false;
const pendingCloseSteps = /* @__PURE__ */ new Set();
function nowMs() {
	return performance.timeOrigin + performance.now();
}
function isRestartTraceEnabled() {
	return isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_RESTART_TRACE);
}
function formatMetricKey(key) {
	const normalized = key.replace(/[^A-Za-z0-9]/gu, "");
	if (!normalized) return "metric";
	return /^[A-Za-z]/u.test(normalized) ? normalized : `metric${normalized}`;
}
function formatMetricValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value.toFixed(1) : null;
	if (typeof value === "boolean") return value ? "true" : "false";
	if (value === null) return "null";
	if (typeof value === "string") return value.trim().replace(/\s+/gu, "_").replace(/[^A-Za-z0-9_.:/-]/gu, "_").slice(0, 120) || null;
	return null;
}
function formatMetrics(metrics) {
	const parts = [];
	for (const [key, value] of Array.isArray(metrics) ? metrics : Object.entries(metrics ?? {})) {
		const formatted = formatMetricValue(value);
		if (formatted === null) continue;
		parts.push(`${formatMetricKey(key)}=${formatted}`);
	}
	return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}
function emitRestartTrace(name, durationMs, totalMs, metrics) {
	restartTraceLog.info(`restart trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms${formatMetrics(metrics)}`);
}
function startGatewayRestartTrace(name, metrics) {
	if (!isRestartTraceEnabled()) {
		active = false;
		return;
	}
	const now = nowMs();
	startedAt = now;
	lastAt = now;
	active = true;
	emitRestartTrace(name, 0, 0, metrics);
}
function isGatewayRestartTraceActive() {
	return isRestartTraceEnabled() && active;
}
function markGatewayRestartTrace(name, metrics) {
	if (!isGatewayRestartTraceActive()) return;
	const now = nowMs();
	emitRestartTrace(name, now - lastAt, now - startedAt, metrics);
	lastAt = now;
}
function finishGatewayRestartTrace(name, metrics) {
	markGatewayRestartTrace(name, metrics);
	active = false;
}
async function measureGatewayRestartTrace(name, run, metrics) {
	return await measureGatewayTraceSpan(name, run, metrics, false);
}
/** Tracks shutdown joins even when detailed restart tracing is disabled. */
async function measureGatewayCloseStep(name, run, metrics) {
	return await measureGatewayTraceSpan(formatMetricValue(name) ?? "unnamed", run, metrics, true);
}
/** A bounded snapshot for the process deadline; overlapping joins retain separate identities. */
function formatGatewayPendingCloseSteps() {
	const now = nowMs();
	const entries = [];
	for (const step of pendingCloseSteps) {
		entries.push(`${step.name}=${Math.max(0, Math.round(now - step.startedAt))}ms`);
		if (entries.length === MAX_PENDING_CLOSE_STEPS) break;
	}
	const omitted = pendingCloseSteps.size - entries.length;
	if (omitted > 0) entries.push(`+${omitted} more`);
	return entries.join(", ") || "none";
}
async function measureGatewayTraceSpan(name, run, metrics, closeStep) {
	const trace = isGatewayRestartTraceActive();
	if (!trace && !closeStep) return await run();
	const before = nowMs();
	const pending = closeStep ? {
		name,
		startedAt: before
	} : void 0;
	if (pending) {
		pendingCloseSteps.add(pending);
		markGatewayRestartTrace(`${name}.begin`);
	}
	try {
		return await run();
	} finally {
		if (pending) pendingCloseSteps.delete(pending);
		const now = nowMs();
		if (trace) {
			emitRestartTrace(name, now - before, now - startedAt, typeof metrics === "function" ? metrics() : metrics);
			lastAt = now;
		} else if (closeStep && now - before >= CLOSE_STEP_SLOW_MS) restartTraceLog.info(`shutdown step ${name} settled after ${Math.round(now - before)}ms`);
	}
}
function recordGatewayRestartTrace(name, durationMs, metrics) {
	if (!isGatewayRestartTraceActive() || !Number.isFinite(durationMs)) return;
	const now = nowMs();
	emitRestartTrace(name, Math.max(0, durationMs), now - startedAt, metrics);
	lastAt = now;
}
function recordGatewayRestartTraceSpan(name, durationMs, totalMs, metrics) {
	if (!isGatewayRestartTraceActive() || !Number.isFinite(durationMs) || !Number.isFinite(totalMs)) return;
	emitRestartTrace(name, Math.max(0, durationMs), Math.max(0, totalMs), metrics);
}
function recordGatewayRestartTraceDetail(name, metrics) {
	if (!isGatewayRestartTraceActive()) return;
	const formatted = formatMetrics(metrics).trim();
	if (formatted) restartTraceLog.info(`restart trace: ${name} ${formatted}`);
}
function collectGatewayProcessMemoryUsageMb() {
	const usage = process.memoryUsage();
	const toMb = (bytes) => bytes / 1024 / 1024;
	const metrics = [
		["rssMb", toMb(usage.rss)],
		["heapTotalMb", toMb(usage.heapTotal)],
		["heapUsedMb", toMb(usage.heapUsed)],
		["externalMb", toMb(usage.external)],
		["arrayBuffersMb", toMb(usage.arrayBuffers)]
	];
	const processWithResourceAccess = process;
	const activeHandles = processWithResourceAccess["_getActiveHandles"]?.();
	const activeRequests = processWithResourceAccess["_getActiveRequests"]?.();
	const activeResources = process.getActiveResourcesInfo();
	metrics.push(["processSigintListenersCount", process.listenerCount("SIGINT")], ["processSigtermListenersCount", process.listenerCount("SIGTERM")], ["processRestartListenersCount", process.listenerCount("SIGUSR2")]);
	if (activeHandles) metrics.push(["activeHandlesCount", activeHandles.length]);
	if (activeRequests) metrics.push(["activeRequestsCount", activeRequests.length]);
	metrics.push(["activeTimersCount", activeResources.filter((resource) => resource === "Timeout" || resource === "Timer").length]);
	return metrics;
}
function normalizeRestartTraceHandoff(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
	const record = value;
	if (typeof record.startedAt !== "number" || !Number.isFinite(record.startedAt) || typeof record.lastAt !== "number" || !Number.isFinite(record.lastAt) || record.startedAt <= 0 || record.lastAt < record.startedAt || record.lastAt - record.startedAt > RESTART_TRACE_HANDOFF_MAX_AGE_MS) return null;
	const now = nowMs();
	if (record.startedAt > now || now - record.startedAt > RESTART_TRACE_HANDOFF_MAX_AGE_MS) return null;
	return {
		startedAt: record.startedAt,
		lastAt: record.lastAt
	};
}
function captureGatewayRestartTraceHandoff() {
	if (!isGatewayRestartTraceActive()) return;
	return {
		startedAt,
		lastAt
	};
}
function createGatewayRestartTraceHandoffEnv(handoff = captureGatewayRestartTraceHandoff()) {
	const normalized = normalizeRestartTraceHandoff(handoff);
	if (!normalized) return;
	return {
		[RESTART_TRACE_HANDOFF_STARTED_AT_ENV]: String(normalized.startedAt),
		[RESTART_TRACE_HANDOFF_LAST_AT_ENV]: String(normalized.lastAt)
	};
}
function resumeGatewayRestartTraceFromHandoff(handoff, metrics) {
	if (!isRestartTraceEnabled() || active) return false;
	const normalized = normalizeRestartTraceHandoff(handoff);
	if (!normalized) return false;
	startedAt = normalized.startedAt;
	lastAt = normalized.lastAt;
	active = true;
	markGatewayRestartTrace("restart.process-resume", metrics);
	return true;
}
function resumeGatewayRestartTraceFromEnv(env = process.env, metrics) {
	const startedRaw = env[RESTART_TRACE_HANDOFF_STARTED_AT_ENV];
	const lastRaw = env[RESTART_TRACE_HANDOFF_LAST_AT_ENV];
	delete env[RESTART_TRACE_HANDOFF_STARTED_AT_ENV];
	delete env[RESTART_TRACE_HANDOFF_LAST_AT_ENV];
	return resumeGatewayRestartTraceFromHandoff({
		startedAt: Number(startedRaw),
		lastAt: Number(lastRaw)
	}, metrics);
}
//#endregion
export { formatGatewayPendingCloseSteps as a, measureGatewayRestartTrace as c, recordGatewayRestartTraceSpan as d, resumeGatewayRestartTraceFromEnv as f, finishGatewayRestartTrace as i, recordGatewayRestartTrace as l, startGatewayRestartTrace as m, collectGatewayProcessMemoryUsageMb as n, markGatewayRestartTrace as o, resumeGatewayRestartTraceFromHandoff as p, createGatewayRestartTraceHandoffEnv as r, measureGatewayCloseStep as s, captureGatewayRestartTraceHandoff as t, recordGatewayRestartTraceDetail as u };
