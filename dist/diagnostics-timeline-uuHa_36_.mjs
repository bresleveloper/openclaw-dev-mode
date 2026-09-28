import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as appendRegularFileSync } from "./regular-file-D4i0kJHS.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/infra/diagnostics-timeline.ts
const OPENCLAW_DIAGNOSTICS_TIMELINE_SCHEMA_VERSION = "openclaw.diagnostics.v1";
const MAX_PENDING_TIMELINE_BYTES = 65536;
const activeDiagnosticsTimelineSpan = new AsyncLocalStorage();
const timelineWriter = resolveGlobalSingleton(Symbol.for("openclaw.diagnosticsTimelineWriter"), () => {
	let pending;
	let scheduledFlush;
	let exiting = false;
	let warnedAboutWrite = false;
	const createdDirs = /* @__PURE__ */ new Set();
	function append(path, content) {
		try {
			const dir = dirname(path);
			if (!createdDirs.has(dir)) {
				mkdirSync(dir, { recursive: true });
				createdDirs.add(dir);
			}
			appendRegularFileSync({
				filePath: path,
				content
			});
		} catch (error) {
			if (!warnedAboutWrite) {
				warnedAboutWrite = true;
				console.warn(`[diagnostics] failed to write timeline event: ${String(error)}`);
			}
		}
	}
	function flush() {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = void 0;
		}
		const batch = pending;
		pending = void 0;
		if (batch) append(batch.path, batch.content);
	}
	process.once("exit", () => {
		exiting = true;
		flush();
	});
	return {
		flush,
		write(path, content) {
			const bytes = Buffer.byteLength(content, "utf8");
			if (pending && (pending.path !== path || pending.bytes + bytes > MAX_PENDING_TIMELINE_BYTES)) flush();
			if (exiting || bytes > MAX_PENDING_TIMELINE_BYTES) {
				append(path, content);
				return;
			}
			if (pending) {
				pending.content += content;
				pending.bytes += bytes;
			} else pending = {
				path,
				content,
				bytes
			};
			scheduledFlush ??= setImmediate(flush).unref();
		}
	};
});
/** Makes all previously emitted timeline events visible before reading or closing their files. */
function flushDiagnosticsTimeline() {
	timelineWriter.flush();
}
/** Returns true when diagnostics flags and a JSONL output path both allow timeline writes. */
function isDiagnosticsTimelineEnabled(options = {}) {
	const { config, env = process.env } = options;
	return (isDiagnosticFlagEnabled("timeline", config, env) || isDiagnosticFlagEnabled("diagnostics.timeline", config, env) || isTruthyEnvValue(env.OPENCLAW_DIAGNOSTICS)) && typeof env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH === "string" && env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH.trim().length > 0;
}
function normalizeNumber(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function normalizeAttributes(attributes) {
	if (!attributes) return;
	const normalized = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (typeof value === "number") {
			if (Number.isFinite(value)) normalized[key] = normalizeNumber(value) ?? 0;
			continue;
		}
		if (typeof value === "string" || typeof value === "boolean" || value === null) normalized[key] = value;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function serializeTimelineEvent(event, env) {
	const attributes = normalizeAttributes(event.attributes);
	const normalized = {
		schemaVersion: OPENCLAW_DIAGNOSTICS_TIMELINE_SCHEMA_VERSION,
		type: event.type,
		timestamp: event.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
		name: event.name,
		...env.OPENCLAW_DIAGNOSTICS_RUN_ID ? { runId: env.OPENCLAW_DIAGNOSTICS_RUN_ID } : {},
		...env.OPENCLAW_DIAGNOSTICS_ENV ? { envName: env.OPENCLAW_DIAGNOSTICS_ENV } : {},
		pid: process.pid,
		...event.runId ? { runId: event.runId } : {},
		...event.envName ? { envName: event.envName } : {},
		...typeof event.pid === "number" ? { pid: event.pid } : {},
		...event.phase ? { phase: event.phase } : {},
		...event.spanId ? { spanId: event.spanId } : {},
		...event.parentSpanId ? { parentSpanId: event.parentSpanId } : {},
		...typeof event.durationMs === "number" ? { durationMs: normalizeNumber(event.durationMs) } : {},
		...event.errorName ? { errorName: event.errorName } : {},
		...event.errorMessage ? { errorMessage: event.errorMessage } : {},
		...typeof event.p50Ms === "number" ? { p50Ms: normalizeNumber(event.p50Ms) } : {},
		...typeof event.p95Ms === "number" ? { p95Ms: normalizeNumber(event.p95Ms) } : {},
		...typeof event.p99Ms === "number" ? { p99Ms: normalizeNumber(event.p99Ms) } : {},
		...typeof event.maxMs === "number" ? { maxMs: normalizeNumber(event.maxMs) } : {},
		...event.activeSpanName ? { activeSpanName: event.activeSpanName } : {},
		...event.provider ? { provider: event.provider } : {},
		...event.operation ? { operation: event.operation } : {},
		...typeof event.ok === "boolean" ? { ok: event.ok } : {},
		...typeof event.status === "number" ? { status: normalizeNumber(event.status) } : {},
		...event.command ? { command: event.command } : {},
		...event.exitCode !== void 0 ? { exitCode: event.exitCode } : {},
		...event.signal !== void 0 ? { signal: event.signal } : {},
		...attributes ? { attributes } : {}
	};
	return `${JSON.stringify(normalized)}\n`;
}
/** Queues one normalized event; bounded batches append on the next event-loop turn. */
function emitDiagnosticsTimelineEvent(event, options = {}) {
	const env = options.env ?? process.env;
	if (!isDiagnosticsTimelineEnabled(options)) return;
	const path = env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim();
	if (!path) return;
	timelineWriter.write(path, serializeTimelineEvent(event, env));
}
/** Replays a completed span after its activation config becomes available. */
function emitCompletedDiagnosticsTimelineSpan(name, durationMs, options = {}) {
	if (!isDiagnosticsTimelineEnabled(options)) return;
	const spanId = randomUUID();
	emitDiagnosticsTimelineEvent({
		type: "span.start",
		name,
		phase: options.phase,
		spanId,
		parentSpanId: options.parentSpanId,
		attributes: options.attributes
	}, options);
	emitDiagnosticsTimelineEvent({
		type: "span.end",
		name,
		phase: options.phase,
		spanId,
		parentSpanId: options.parentSpanId,
		durationMs,
		attributes: options.attributes
	}, options);
}
/** Returns the currently active span so callers can preserve parentage across memoized work. */
function getActiveDiagnosticsTimelineSpan() {
	return activeDiagnosticsTimelineSpan.getStore();
}
function startDiagnosticsTimelineSpan(name, options) {
	const env = options.env ?? process.env;
	if (!isDiagnosticsTimelineEnabled({
		config: options.config,
		env
	})) return;
	const activeSpan = getActiveDiagnosticsTimelineSpan();
	const phase = options.phase ?? activeSpan?.phase;
	const parentSpanId = options.parentSpanId ?? activeSpan?.spanId;
	const span = {
		name,
		env,
		...options.config ? { config: options.config } : {},
		spanId: randomUUID(),
		startedAt: performance.now(),
		...phase ? { phase } : {},
		...parentSpanId ? { parentSpanId } : {},
		...options.attributes ? { attributes: options.attributes } : {},
		...options.omitErrorMessage ? { omitErrorMessage: true } : {}
	};
	emitDiagnosticsTimelineEvent({
		type: "span.start",
		name: span.name,
		phase: span.phase,
		spanId: span.spanId,
		parentSpanId: span.parentSpanId,
		attributes: span.attributes
	}, {
		config: span.config,
		env: span.env
	});
	return span;
}
function runInDiagnosticsTimelineSpan(span, run) {
	return activeDiagnosticsTimelineSpan.run({
		name: span.name,
		...span.phase ? { phase: span.phase } : {},
		spanId: span.spanId,
		...span.parentSpanId ? { parentSpanId: span.parentSpanId } : {},
		...span.attributes ? { attributes: span.attributes } : {}
	}, run);
}
function emitFinishedDiagnosticsTimelineSpan(span) {
	emitDiagnosticsTimelineEvent({
		type: "span.end",
		name: span.name,
		phase: span.phase,
		spanId: span.spanId,
		parentSpanId: span.parentSpanId,
		durationMs: performance.now() - span.startedAt,
		attributes: span.attributes
	}, {
		config: span.config,
		env: span.env
	});
}
function emitFailedDiagnosticsTimelineSpan(span, error) {
	emitDiagnosticsTimelineEvent({
		type: "span.error",
		name: span.name,
		phase: span.phase,
		spanId: span.spanId,
		parentSpanId: span.parentSpanId,
		durationMs: performance.now() - span.startedAt,
		attributes: span.attributes,
		errorName: error instanceof Error ? error.name : typeof error,
		...span.omitErrorMessage ? {} : { errorMessage: error instanceof Error ? error.message : String(error) }
	}, {
		config: span.config,
		env: span.env
	});
}
/** Measures async work as a start/end timeline span, emitting an error span before rethrowing. */
async function measureDiagnosticsTimelineSpan(name, run, options = {}) {
	const span = startDiagnosticsTimelineSpan(name, options);
	if (!span) return await run();
	try {
		const result = await runInDiagnosticsTimelineSpan(span, () => run());
		emitFinishedDiagnosticsTimelineSpan(span);
		return result;
	} catch (error) {
		emitFailedDiagnosticsTimelineSpan(span, error);
		throw error;
	}
}
/** Measures sync work as a start/end timeline span, emitting an error span before rethrowing. */
function measureDiagnosticsTimelineSpanSync(name, run, options = {}) {
	const span = startDiagnosticsTimelineSpan(name, options);
	if (!span) return run();
	try {
		const result = runInDiagnosticsTimelineSpan(span, run);
		emitFinishedDiagnosticsTimelineSpan(span);
		return result;
	} catch (error) {
		emitFailedDiagnosticsTimelineSpan(span, error);
		throw error;
	}
}
//#endregion
export { isDiagnosticsTimelineEnabled as a, getActiveDiagnosticsTimelineSpan as i, emitDiagnosticsTimelineEvent as n, measureDiagnosticsTimelineSpan as o, flushDiagnosticsTimeline as r, measureDiagnosticsTimelineSpanSync as s, emitCompletedDiagnosticsTimelineSpan as t };
