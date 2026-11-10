import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { n as runWithMainThreadTask } from "./main-thread-stall-BJxVH-It.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname } from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { appendRegularFileSync } from "@openclaw/fs-safe/advanced";
import { performance } from "node:perf_hooks";
//#region src/infra/diagnostics-timeline.ts
const OPENCLAW_DIAGNOSTICS_TIMELINE_SCHEMA_VERSION = "openclaw.diagnostics.v1";
const MAX_PENDING_TIMELINE_BYTES = 65536;
const activeDiagnosticsTimelineSpan = new AsyncLocalStorage();
const spanObserver = new AsyncLocalStorage();
/** Observe existing spans within one request, independently of timeline file logging. */
function withDiagnosticsTimelineObserver(observer, run) {
	return spanObserver.run(observer, run);
}
function observeSpan(name, options) {
	let finish;
	try {
		finish = spanObserver.getStore()?.(name, options.attributes);
	} catch {}
	if (!finish) return;
	return { [Symbol.dispose]() {
		try {
			finish?.();
		} catch {}
	} };
}
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
		phase: event.phase || void 0,
		spanId: event.spanId || void 0,
		parentSpanId: event.parentSpanId || void 0,
		durationMs: normalizeNumber(event.durationMs),
		errorName: event.errorName || void 0,
		errorMessage: event.errorMessage || void 0,
		p50Ms: normalizeNumber(event.p50Ms),
		p95Ms: normalizeNumber(event.p95Ms),
		p99Ms: normalizeNumber(event.p99Ms),
		maxMs: normalizeNumber(event.maxMs),
		activeSpanName: event.activeSpanName || void 0,
		provider: event.provider || void 0,
		operation: event.operation || void 0,
		ok: typeof event.ok === "boolean" ? event.ok : void 0,
		status: normalizeNumber(event.status),
		command: event.command || void 0,
		exitCode: event.exitCode,
		signal: event.signal,
		attributes
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
	const span = {
		name,
		phase: options.phase,
		spanId: randomUUID(),
		parentSpanId: options.parentSpanId,
		attributes: options.attributes
	};
	emitDiagnosticsTimelineEvent({
		type: "span.start",
		...span
	}, options);
	emitDiagnosticsTimelineEvent({
		type: "span.end",
		...span,
		durationMs
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
		...span
	}, span);
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
function emitFinishedDiagnosticsTimelineSpan(span, failure) {
	emitDiagnosticsTimelineEvent({
		type: failure ? "span.error" : "span.end",
		...span,
		durationMs: performance.now() - span.startedAt,
		...failure ? {
			errorName: failure.error instanceof Error ? failure.error.name : typeof failure.error,
			...span.omitErrorMessage ? {} : { errorMessage: failure.error instanceof Error ? failure.error.message : String(failure.error) }
		} : {}
	}, span);
}
/** Measures async work as a start/end timeline span, emitting an error span before rethrowing. */
async function measureDiagnosticsTimelineSpan(name, run, options = {}) {
	try {
		var _usingCtx$1 = _usingCtx();
		_usingCtx$1.u(observeSpan(name, options));
		const span = startDiagnosticsTimelineSpan(name, options);
		if (!span) return await runWithMainThreadTask(name, run);
		try {
			const result = await runInDiagnosticsTimelineSpan(span, () => runWithMainThreadTask(name, run));
			emitFinishedDiagnosticsTimelineSpan(span);
			return result;
		} catch (error) {
			emitFinishedDiagnosticsTimelineSpan(span, { error });
			throw error;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Measures sync work as a start/end timeline span, emitting an error span before rethrowing. */
function measureDiagnosticsTimelineSpanSync(name, run, options = {}) {
	try {
		var _usingCtx3 = _usingCtx();
		_usingCtx3.u(observeSpan(name, options));
		const span = startDiagnosticsTimelineSpan(name, options);
		if (!span) return runWithMainThreadTask(name, run);
		try {
			const result = runInDiagnosticsTimelineSpan(span, () => runWithMainThreadTask(name, run));
			emitFinishedDiagnosticsTimelineSpan(span);
			return result;
		} catch (error) {
			emitFinishedDiagnosticsTimelineSpan(span, { error });
			throw error;
		}
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
}
//#endregion
export { isDiagnosticsTimelineEnabled as a, withDiagnosticsTimelineObserver as c, getActiveDiagnosticsTimelineSpan as i, emitDiagnosticsTimelineEvent as n, measureDiagnosticsTimelineSpan as o, flushDiagnosticsTimeline as r, measureDiagnosticsTimelineSpanSync as s, emitCompletedDiagnosticsTimelineSpan as t };
