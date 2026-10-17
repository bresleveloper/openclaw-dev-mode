import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { i as supportsUpdateCanaryProgress, n as UPDATE_CANARY_PROGRESS_PREFIX, r as isUpdateCanaryStartupMilestone } from "./update-candidate-canary-progress-YZ66-D3c.mjs";
import { r as consumeGatewayBootstrapSteps } from "./startup-trace-C4xndCPa.mjs";
import { a as isDiagnosticsTimelineEnabled, n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import { i as withDiagnosticPhase } from "./diagnostic-phase-C3wUA7rl.mjs";
import { c as recordGatewayRestartTraceDetail, l as recordGatewayRestartTraceSpan } from "./restart-trace-Kdafqv6h.mjs";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
//#region src/gateway/server-startup-trace.ts
const STARTUP_PROGRESS_PHASES = /* @__PURE__ */ new Set([
	"process.bootstrap",
	"state.schema-preflight",
	"config.auth",
	"startup.maintenance",
	"http.bound",
	"ready"
]);
/** Measure a startup step when tracing is active, otherwise run it directly. */
async function measureStartup(startupTrace, name, run) {
	return startupTrace ? startupTrace.measure(name, run) : await run();
}
function createGatewayStartupTrace(log, startedAt = performance.now(), updateCanary = false) {
	const progressEnabled = updateCanary && supportsUpdateCanaryProgress(process.argv);
	const logEnabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	let timelineConfig;
	let eventLoopDelay;
	let closed = false;
	const timelineOptions = () => ({
		...timelineConfig ? { config: timelineConfig } : {},
		env: process.env
	});
	const eventLoopTimelineEnabled = () => isDiagnosticsTimelineEnabled(timelineOptions()) && isTruthyEnvValue(process.env.OPENCLAW_DIAGNOSTICS_EVENT_LOOP);
	const ensureEventLoopDelay = () => {
		if (closed || eventLoopDelay || !logEnabled && !eventLoopTimelineEnabled()) return;
		eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
		eventLoopDelay.enable();
	};
	ensureEventLoopDelay();
	const close = () => {
		eventLoopDelay?.disable();
		eventLoopDelay = void 0;
		closed = true;
	};
	const started = startedAt;
	let last = started;
	let spanSequence = 0;
	let bootstrapSummary = "";
	const reportProgress = (name) => {
		if (progressEnabled && !closed && isUpdateCanaryStartupMilestone(name)) process.stderr.write(`${UPDATE_CANARY_PROGRESS_PREFIX}${name}\n`);
	};
	const formatMetric = (key, value) => `${key}=${typeof value === "number" ? value.toFixed(1) : value}`;
	const mapTimelineName = (name) => {
		switch (name) {
			case "config.snapshot": return "config.load";
			case "config.auth":
			case "runtime.config": return "config.normalize";
			case "plugins.bootstrap": return "plugins.load";
			case "runtime.post-attach":
			case "ready": return "gateway.ready";
			default: return name;
		}
	};
	const takeEventLoopSample = () => {
		if (!eventLoopDelay) return;
		const sample = {
			p50Ms: eventLoopDelay.percentile(50) / 1e6,
			p95Ms: eventLoopDelay.percentile(95) / 1e6,
			p99Ms: eventLoopDelay.percentile(99) / 1e6,
			maxMs: eventLoopDelay.max / 1e6
		};
		eventLoopDelay.reset();
		return sample;
	};
	const emitEventLoopTimelineSample = (activeSpanName, sample) => {
		if (!eventLoopTimelineEnabled() || !sample) return;
		emitDiagnosticsTimelineEvent({
			type: "eventLoop.sample",
			name: "eventLoop",
			phase: "startup",
			activeSpanName: mapTimelineName(activeSpanName),
			attributes: activeSpanName === mapTimelineName(activeSpanName) ? void 0 : { traceName: activeSpanName },
			...sample
		}, timelineOptions());
	};
	const emit = (name, durationMs, totalMs, eventLoopSample, extras = []) => {
		const metrics = [["eventLoopMax", `${(eventLoopSample?.maxMs ?? 0).toFixed(1)}ms`], ...extras];
		recordGatewayRestartTraceSpan(`restart.ready.${name}`, durationMs, totalMs, metrics);
		if (logEnabled) log.info(`startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
		else if (STARTUP_PROGRESS_PHASES.has(name)) log.info(`startup phase: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms`);
	};
	return {
		close,
		setConfig(config) {
			timelineConfig = config;
			ensureEventLoopDelay();
		},
		mark(name) {
			reportProgress(name);
			const now = performance.now();
			const eventLoopSample = takeEventLoopSample();
			if (name === "process.bootstrap") {
				const steps = consumeGatewayBootstrapSteps();
				bootstrapSummary = steps.map((step) => `${step.name}:${step.durationMs.toFixed(1)}ms/${step.calls}`).join(",");
				for (const step of steps) emit(`process.bootstrap.${step.name}`, step.durationMs, step.completedAt, void 0, [
					["start", `${step.startedAt.toFixed(1)}ms`],
					["calls", step.calls],
					...Object.entries(step.metrics)
				]);
			}
			emit(name, now - last, now - started, eventLoopSample, bootstrapSummary && (name === "process.bootstrap" || name === "ready") ? [["bootstrapSteps", bootstrapSummary]] : []);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				durationMs: now - started,
				attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
			}, timelineOptions());
			emitEventLoopTimelineSample(name, eventLoopSample);
			last = now;
			if (name === "ready") close();
		},
		detail(name, metrics) {
			const attributes = Object.fromEntries(metrics);
			recordGatewayRestartTraceDetail(`restart.ready.${name}`, metrics);
			if (logEnabled) log.info(`startup trace: ${name} ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				attributes: {
					traceName: name,
					...attributes
				}
			}, timelineOptions());
		},
		async measure(name, run, options = {}) {
			const before = performance.now();
			if (STARTUP_PROGRESS_PHASES.has(name)) log.info(`startup phase: ${name} starting total=${(before - started).toFixed(1)}ms`);
			const mappedName = mapTimelineName(name);
			const span = {
				name: mappedName,
				phase: "startup",
				spanId: `gateway-startup-${++spanSequence}`,
				attributes: name === mappedName ? void 0 : { traceName: name }
			};
			emitDiagnosticsTimelineEvent({
				...span,
				type: "span.start"
			}, timelineOptions());
			try {
				const result = await withDiagnosticPhase(mappedName, run, { traceName: name });
				reportProgress(name);
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					...span,
					type: "span.end",
					durationMs: now - before
				}, timelineOptions());
				return result;
			} catch (error) {
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					...span,
					type: "span.error",
					durationMs: now - before,
					errorName: error instanceof Error ? error.name : typeof error,
					...options.omitErrorMessage ? {} : { errorMessage: error instanceof Error ? error.message : String(error) }
				}, timelineOptions());
				throw error;
			} finally {
				const now = performance.now();
				const eventLoopSample = takeEventLoopSample();
				emit(name, now - before, now - started, eventLoopSample);
				emitEventLoopTimelineSample(name, eventLoopSample);
				last = now;
			}
		}
	};
}
//#endregion
export { measureStartup as n, createGatewayStartupTrace as t };
