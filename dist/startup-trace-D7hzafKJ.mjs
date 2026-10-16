import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-DFDqy1EF.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { i as supportsUpdateCanaryProgress, n as UPDATE_CANARY_PROGRESS_PREFIX, r as isUpdateCanaryStartupMilestone } from "./update-candidate-canary-progress-YZ66-D3c.mjs";
import process from "node:process";
//#region src/cli/startup-trace.ts
const CLI_STARTUP_TIMELINE_PHASE = "cli.startup";
const STARTUP_PROGRESS_PHASES = /* @__PURE__ */ new Set([
	"entry.run-main-import",
	"cli.main.gateway-run-select-environment",
	"cli.main.gateway-run-imports",
	"cli.main.gateway-run-pre-bootstrap",
	"cli.main.gateway-run-bootstrap"
]);
const BOOTSTRAP_PROGRESS_PHASES = /* @__PURE__ */ new Set(["cli.bootstrap.admission.database-readiness", "gateway.server-start-import"]);
const MAX_BOOTSTRAP_STEPS = 128;
let bootstrapSteps = /* @__PURE__ */ new Map();
/** Collect process facts once; Gateway startup consumes them before serving. */
function recordGatewayBootstrapStep(name, startedAt, completedAt, metrics = {}) {
	if (!bootstrapSteps || !isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE)) return;
	const stepName = bootstrapSteps.has(name) || bootstrapSteps.size < MAX_BOOTSTRAP_STEPS ? name : "omitted-steps";
	let step = bootstrapSteps.get(stepName);
	if (!step) {
		step = {
			name: stepName,
			startedAt,
			completedAt,
			durationMs: 0,
			calls: 0,
			metrics: {}
		};
		bootstrapSteps.set(stepName, step);
	}
	step.startedAt = Math.min(step.startedAt, startedAt);
	step.completedAt = Math.max(step.completedAt, completedAt);
	step.durationMs += completedAt - startedAt;
	step.calls += 1;
	for (const [key, value] of Object.entries(metrics)) step.metrics[key] = (step.metrics[key] ?? 0) + value;
}
function consumeGatewayBootstrapSteps() {
	const steps = [...bootstrapSteps?.values() ?? []];
	bootstrapSteps = void 0;
	return steps.toSorted((a, b) => a.startedAt - b.startedAt || a.name.localeCompare(b.name));
}
async function measureGatewayBootstrapStep(name, run, metrics) {
	const traceEnabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	const progressEnabled = BOOTSTRAP_PROGRESS_PHASES.has(name);
	if (!traceEnabled && !progressEnabled) return await run();
	const startedAt = performance.now();
	const { formatConsoleDiagnosticLine } = await import("./json-console-line-lWJWZD8J.mjs");
	if (progressEnabled) process.stderr.write(`${formatConsoleDiagnosticLine({
		level: "info",
		message: `[gateway] startup phase: ${name} starting total=${startedAt.toFixed(1)}ms`
	})}\n`);
	try {
		return await run();
	} finally {
		const completedAt = performance.now();
		const facts = metrics?.() ?? {};
		recordGatewayBootstrapStep(name, startedAt, completedAt, facts);
		const counts = Object.entries(facts).map(([key, value]) => ` ${key}=${value}`).join("");
		const message = `[gateway] startup ${traceEnabled ? "trace" : "phase"}: ${name} ${(completedAt - startedAt).toFixed(1)}ms total=${completedAt.toFixed(1)}ms start=${startedAt.toFixed(1)}ms${counts}`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "info",
			message
		})}\n`);
	}
}
function hasDiagnosticsTimelinePath(env) {
	return Boolean(env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim());
}
function createGatewayDispatchStartupTrace(argv, source) {
	const gatewayInvocation = argv.slice(2).includes("gateway");
	const enabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE) && gatewayInvocation;
	const progressEnabled = isForegroundGatewayRunArgv(argv);
	const updateCanary = gatewayInvocation && supportsUpdateCanaryProgress(argv);
	const started = performance.now();
	if (source === "entry" && enabled) {
		bootstrapSteps = /* @__PURE__ */ new Map();
		recordGatewayBootstrapStep("entry.imports", 0, started);
	}
	let last = started;
	let lineFormatter = null;
	let pendingMessages = [];
	const timelineModule = hasDiagnosticsTimelinePath(process.env) ? import("./diagnostics-timeline-iFJd0WBD.mjs").catch(() => null) : null;
	let timelineActivation = timelineModule ? "unknown" : "disabled";
	let timelineConfig;
	let timelineConfigResolved = false;
	const pendingTimelineEvents = [];
	let pendingTimelineWrites = Promise.resolve();
	const timelineName = (name) => `${source}.${name}`;
	const resolveTimelineActivation = async () => {
		if (timelineActivation !== "unknown" || !timelineModule) return timelineActivation;
		const module = await timelineModule;
		if (!module) {
			timelineActivation = "disabled";
			return timelineActivation;
		}
		if (module.isDiagnosticsTimelineEnabled({ env: process.env })) {
			timelineActivation = "enabled";
			return timelineActivation;
		}
		if (timelineConfigResolved) timelineActivation = module.isDiagnosticsTimelineEnabled({
			config: timelineConfig,
			env: process.env
		}) ? "enabled" : "disabled";
		return timelineActivation;
	};
	const writeTimelineEvent = (module, event) => {
		const commonOptions = {
			...timelineConfig ? { config: timelineConfig } : {},
			env: process.env
		};
		if (event.type === "mark") {
			module.emitDiagnosticsTimelineEvent({
				type: "mark",
				name: event.name,
				phase: CLI_STARTUP_TIMELINE_PHASE,
				durationMs: event.durationMs,
				attributes: { totalMs: event.totalMs }
			}, commonOptions);
			return;
		}
		module.emitCompletedDiagnosticsTimelineSpan(event.name, event.durationMs, {
			phase: CLI_STARTUP_TIMELINE_PHASE,
			...commonOptions
		});
	};
	const flushPendingTimelineEvents = async () => {
		const activation = await resolveTimelineActivation();
		if (activation === "unknown") return;
		if (activation === "disabled") {
			pendingTimelineEvents.length = 0;
			return;
		}
		const module = await timelineModule;
		if (!module) {
			pendingTimelineEvents.length = 0;
			return;
		}
		const events = pendingTimelineEvents.splice(0);
		for (const event of events) writeTimelineEvent(module, event);
	};
	const enqueueTimelineEvent = (event) => {
		if (!timelineModule || timelineActivation === "disabled") return;
		if (timelineActivation === "unknown") {
			pendingTimelineEvents.push(event);
			return;
		}
		pendingTimelineWrites = pendingTimelineWrites.then(async () => {
			const module = await timelineModule;
			if (module) writeTimelineEvent(module, event);
		});
	};
	const flushPending = (formatter) => {
		const queued = pendingMessages;
		pendingMessages = [];
		for (const message of queued) process.stderr.write(`${formatter(message)}\n`);
	};
	const flushPendingPlainOnExit = () => {
		if (!lineFormatter) flushPending((message) => message);
	};
	if (enabled) process.once("exit", flushPendingPlainOnExit);
	const writeMessage = (message) => {
		if (!lineFormatter) {
			pendingMessages.push(message);
			return;
		}
		process.stderr.write(`${lineFormatter(message)}\n`);
	};
	const emit = (name, durationMs, completedAt, completed = true) => {
		const milestone = `${source}.${name}`;
		if (updateCanary && completed && isUpdateCanaryStartupMilestone(milestone)) process.stderr.write(`${UPDATE_CANARY_PROGRESS_PREFIX}${milestone}\n`);
		if (!enabled && !(progressEnabled && STARTUP_PROGRESS_PHASES.has(milestone))) return;
		const startedAt = completedAt - durationMs;
		recordGatewayBootstrapStep(`${source}.${name}`, startedAt, completedAt);
		writeMessage(`[gateway] startup ${enabled ? "trace" : "phase"}: ${source}.${name} ${durationMs.toFixed(1)}ms total=${completedAt.toFixed(1)}ms start=${startedAt.toFixed(1)}ms${completed ? "" : " failed"}`);
	};
	return {
		enabled,
		consoleEnabled: enabled || progressEnabled,
		async requiresDiagnosticsConfig() {
			await flushPendingTimelineEvents();
			return timelineActivation === "unknown";
		},
		async configureDiagnosticsTimeline(config) {
			timelineConfig = config;
			timelineConfigResolved = true;
			await flushPendingTimelineEvents();
			await pendingTimelineWrites;
		},
		setLineFormatter(formatter) {
			lineFormatter = formatter;
			process.off("exit", flushPendingPlainOnExit);
			flushPending(formatter);
		},
		mark(name) {
			const now = performance.now();
			const durationMs = now - last;
			const totalMs = now - started;
			emit(name, durationMs, now);
			enqueueTimelineEvent({
				type: "mark",
				name: timelineName(name),
				durationMs,
				totalMs
			});
			last = now;
		},
		async measure(name, run, options = {}) {
			const before = performance.now();
			if (progressEnabled && STARTUP_PROGRESS_PHASES.has(timelineName(name))) writeMessage(`[gateway] startup phase: ${timelineName(name)} starting total=${before.toFixed(1)}ms`);
			let bufferCompletedTimelineSpan = false;
			let completed = false;
			try {
				if (timelineModule && options.timeline !== false) {
					await flushPendingTimelineEvents();
					const module = await timelineModule;
					if (module && timelineActivation === "enabled") {
						await pendingTimelineWrites;
						const result = await module.measureDiagnosticsTimelineSpan(timelineName(name), () => Promise.resolve(run()), {
							phase: CLI_STARTUP_TIMELINE_PHASE,
							...timelineConfig ? { config: timelineConfig } : {},
							env: process.env
						});
						completed = true;
						return result;
					}
					bufferCompletedTimelineSpan = timelineActivation === "unknown";
				}
				const result = await run();
				completed = true;
				return result;
			} finally {
				const now = performance.now();
				if (bufferCompletedTimelineSpan && completed) enqueueTimelineEvent({
					type: "span",
					name: timelineName(name),
					durationMs: now - before
				});
				emit(name, now - before, now, completed);
				last = now;
			}
		}
	};
}
async function configureCliStartupDiagnostics(traces, readConfig) {
	const activeTraces = traces.filter((trace) => Boolean(trace));
	if (!(await Promise.all(activeTraces.map((trace) => trace.requiresDiagnosticsConfig()))).some(Boolean)) return;
	const { withConsoleLogsRoutedToStderr } = await import("./json-output-mode-BR-Z3WUl.mjs");
	const { readSourceConfigBestEffort } = await import("./io-DWAGT1Vv.mjs");
	const config = await withConsoleLogsRoutedToStderr(readConfig ?? readSourceConfigBestEffort);
	await Promise.all(activeTraces.map((trace) => trace.configureDiagnosticsTimeline(config)));
}
async function prepareGatewayStartupTraceConsoleFormatting(trace) {
	if (!trace.consoleEnabled) return () => {};
	const { formatConsoleDiagnosticLine } = await import("./json-console-line-lWJWZD8J.mjs");
	return () => trace.setLineFormatter((message) => formatConsoleDiagnosticLine({
		level: "info",
		message
	}));
}
async function configureGatewayStartupTraceConsoleFormatting(trace) {
	(await prepareGatewayStartupTraceConsoleFormatting(trace))();
}
//#endregion
export { measureGatewayBootstrapStep as a, createGatewayDispatchStartupTrace as i, configureGatewayStartupTraceConsoleFormatting as n, prepareGatewayStartupTraceConsoleFormatting as o, consumeGatewayBootstrapSteps as r, recordGatewayBootstrapStep as s, configureCliStartupDiagnostics as t };
