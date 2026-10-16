import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CuVhdCBs.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { P as runWithDiagnosticTraceContext, d as getInternalDiagnosticEventSequence, o as emitInternalDiagnosticEvent, p as isDiagnosticsEnabled, q as hasInternalDiagnosticEventInterest, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as sampleTrackedWorkerMemory } from "./worker-cpu-DU6Cf6Aq.mjs";
import { t as emitChildProcessSpawnSample } from "./spawn-diagnostics-BltWCplw.mjs";
import { t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as runAbortableTimeout } from "./with-timeout-CdvCydMF.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { s as withSessionDiagnosticTextInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { a as pruneDiagnosticSessionStates, i as peekDiagnosticSessionState, n as getDiagnosticSessionState, o as resetDiagnosticSessionStateForTest, r as isDiagnosticSessionStateCurrent, s as retireDiagnosticSessionObservations, t as diagnosticSessionStates } from "./diagnostic-session-state-tX9oTPd5.mjs";
import { a as logMessageQueuedWithBacklogPolicy, n as getLastDiagnosticActivityAt, o as markDiagnosticActivity, s as resetDiagnosticActivityForTest, t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { _ as resolveActiveEmbeddedRunRecoveryBlocker } from "./run-state-BmDkKYBf.mjs";
import { a as getDiagnosticEmbeddedRunActivitySequence, b as resolveRunStaleThresholdMs, h as stopDiagnosticRunActivityTracking, m as startDiagnosticRunActivityTracking, n as clearDiagnosticEmbeddedRunActivityForSession, o as getDiagnosticSessionActivitySnapshot, p as resetDiagnosticRunActivityForTest } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { t as compactionWatchdogResets } from "./compaction-watchdog-CJLL8-gr.mjs";
import { n as getRecentDiagnosticPhases, r as resetDiagnosticPhasesForTest, t as getCurrentDiagnosticPhase } from "./diagnostic-phase-C3wUA7rl.mjs";
import { t as boundSessionDiagnosticText } from "./session-diagnostic-text-RSPQUBVJ.mjs";
import { n as prepareCronJobNameResolver } from "./job-name-96dek-P6.mjs";
import { o as uninstallDiagnosticStabilityFatalHook, r as installDiagnosticStabilityFatalHook } from "./diagnostic-stability-bundle-vmtXgIWw.mjs";
import { a as startDiagnosticStabilityRecorder, o as stopDiagnosticStabilityRecorder, r as resetDiagnosticStabilityRecorderForTest } from "./diagnostic-stability-D-6e47hh.mjs";
import { getHeapSpaceStatistics, getHeapStatistics } from "node:v8";
import { totalmem } from "node:os";
import { channel } from "node:diagnostics_channel";
import { PerformanceObserver, monitorEventLoopDelay, performance } from "node:perf_hooks";
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.ts
const EMBEDDED_COMPACTION_TIMEOUT_MS = 18e4;
function resolveCompactionTimeoutMs(cfg) {
	return finiteSecondsToTimerSafeMilliseconds(cfg?.agents?.defaults?.compaction?.timeoutSeconds, { floorSeconds: true }) ?? EMBEDDED_COMPACTION_TIMEOUT_MS;
}
async function compactWithSafetyTimeout(compact, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, opts) {
	let canceled = false;
	const cancel = () => {
		if (canceled) return;
		canceled = true;
		try {
			opts?.onCancel?.();
		} catch {}
	};
	return await runAbortableTimeout(async (timeoutSignal, resetTimeout) => {
		const abortSignal = opts?.abortSignal;
		const composedAbortSignal = timeoutSignal && abortSignal ? AbortSignal.any([timeoutSignal, abortSignal]) : timeoutSignal ?? abortSignal;
		timeoutSignal?.addEventListener("abort", cancel, { once: true });
		try {
			return await racePromiseWithAbortSignal(() => trackAsyncWork(() => compact(composedAbortSignal, resetTimeout)), abortSignal, (signal) => {
				cancel();
				const reason = signal.reason;
				return reason instanceof Error ? reason : createAbortError("aborted", reason ? { cause: reason } : void 0);
			});
		} finally {
			timeoutSignal?.removeEventListener("abort", cancel);
		}
	}, timeoutMs, "Compaction");
}
/**
* Every engine is bounded by one host window and receives the composed
* timeout/caller cancellation signal. Only the built-in runtime delegate, reached
* with that signal, refreshes the window as its native stages make progress.
*/
function compactContextEngineWithSafetyTimeout(contextEngine, params, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, abortSignal) {
	return compactWithSafetyTimeout((compactionAbortSignal, resetTimeout) => {
		if (!compactionAbortSignal) return contextEngine.compact(params);
		compactionWatchdogResets.set(compactionAbortSignal, resetTimeout);
		return contextEngine.compact({
			...params,
			abortSignal: compactionAbortSignal
		});
	}, timeoutMs, abortSignal ? { abortSignal } : void 0);
}
//#endregion
//#region src/logging/diagnostic-gc.ts
let observer;
function stopDiagnosticGcObserver() {
	const current = observer;
	observer = void 0;
	current?.disconnect();
}
function reconcileDiagnosticGcObserver() {
	if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("diagnostic.gc") || !PerformanceObserver.supportedEntryTypes.includes("gc")) {
		stopDiagnosticGcObserver();
		return;
	}
	if (observer) return;
	const activatedAt = performance.now();
	const current = new PerformanceObserver((list) => {
		if (observer !== current || !areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("diagnostic.gc")) return;
		runWithDiagnosticTraceContext(void 0, () => {
			for (const entry of list.getEntries()) if (entry.startTime >= activatedAt) emitInternalDiagnosticEvent({
				type: "diagnostic.gc",
				durationMs: entry.duration
			});
		});
	});
	observer = current;
	current.observe({ entryTypes: ["gc"] });
}
//#endregion
//#region src/logging/diagnostic-liveness.ts
const DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS = 1e3;
const DEFAULT_LIVENESS_EVENT_LOOP_UTILIZATION_WARN = .95;
const DEFAULT_LIVENESS_CPU_CORE_RATIO_WARN = .9;
const DEFAULT_LIVENESS_WARN_COOLDOWN_MS = 12e4;
let diagnosticLivenessMonitor = null;
let lastDiagnosticLivenessWallAt = 0;
let lastDiagnosticLivenessCpuUsage = null;
let lastDiagnosticLivenessEventLoopUtilization = null;
let lastDiagnosticLivenessEventAt = 0;
let lastDiagnosticLivenessWarnAt = 0;
function roundDiagnosticMetric(value, digits = 3) {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
function nanosecondsToMilliseconds(value) {
	return roundDiagnosticMetric(value / 1e6, 1);
}
function startDiagnosticLivenessSampler() {
	lastDiagnosticLivenessWallAt = Date.now();
	lastDiagnosticLivenessCpuUsage = process.cpuUsage();
	lastDiagnosticLivenessEventLoopUtilization = performance.eventLoopUtilization();
	lastDiagnosticLivenessEventAt = 0;
	lastDiagnosticLivenessWarnAt = 0;
	if (diagnosticLivenessMonitor) {
		diagnosticLivenessMonitor.reset();
		return;
	}
	try {
		diagnosticLivenessMonitor = monitorEventLoopDelay({ resolution: 20 });
		diagnosticLivenessMonitor.enable();
		diagnosticLivenessMonitor.reset();
	} catch (err) {
		diagnosticLivenessMonitor = null;
		diagnosticLogger.debug(`diagnostic liveness monitor unavailable: ${String(err)}`);
	}
}
function stopDiagnosticLivenessSampler() {
	diagnosticLivenessMonitor?.disable();
	diagnosticLivenessMonitor = null;
	lastDiagnosticLivenessWallAt = 0;
	lastDiagnosticLivenessCpuUsage = null;
	lastDiagnosticLivenessEventLoopUtilization = null;
	lastDiagnosticLivenessEventAt = 0;
	lastDiagnosticLivenessWarnAt = 0;
}
function sampleDiagnosticLiveness(now) {
	if (!diagnosticLivenessMonitor || !lastDiagnosticLivenessCpuUsage || !lastDiagnosticLivenessEventLoopUtilization || lastDiagnosticLivenessWallAt <= 0) {
		startDiagnosticLivenessSampler();
		return null;
	}
	const intervalMs = Math.max(1, now - lastDiagnosticLivenessWallAt);
	const cpuUsage = process.cpuUsage(lastDiagnosticLivenessCpuUsage);
	const currentEventLoopUtilization = performance.eventLoopUtilization();
	const eventLoopUtilization = performance.eventLoopUtilization(currentEventLoopUtilization, lastDiagnosticLivenessEventLoopUtilization).utilization;
	const eventLoopDelayP99Ms = nanosecondsToMilliseconds(diagnosticLivenessMonitor.percentile(99));
	const eventLoopDelayMaxMs = nanosecondsToMilliseconds(diagnosticLivenessMonitor.max);
	diagnosticLivenessMonitor.reset();
	lastDiagnosticLivenessWallAt = now;
	lastDiagnosticLivenessCpuUsage = process.cpuUsage();
	lastDiagnosticLivenessEventLoopUtilization = currentEventLoopUtilization;
	const cpuUserMs = roundDiagnosticMetric(cpuUsage.user / 1e3, 1);
	const cpuSystemMs = roundDiagnosticMetric(cpuUsage.system / 1e3, 1);
	const cpuTotalMs = roundDiagnosticMetric(cpuUserMs + cpuSystemMs, 1);
	const cpuCoreRatio = roundDiagnosticMetric(cpuTotalMs / intervalMs, 3);
	const eventLoopUtilizationRatio = roundDiagnosticMetric(eventLoopUtilization, 3);
	const reasons = [];
	if (eventLoopDelayP99Ms >= 1e3 || eventLoopDelayMaxMs >= 1e3) reasons.push("event_loop_delay");
	if (eventLoopUtilizationRatio >= DEFAULT_LIVENESS_EVENT_LOOP_UTILIZATION_WARN) reasons.push("event_loop_utilization");
	if (cpuCoreRatio >= DEFAULT_LIVENESS_CPU_CORE_RATIO_WARN) reasons.push("cpu");
	if (reasons.length === 0) return null;
	return {
		reasons,
		intervalMs,
		eventLoopDelayP99Ms,
		eventLoopDelayMaxMs,
		eventLoopUtilization: eventLoopUtilizationRatio,
		cpuUserMs,
		cpuSystemMs,
		cpuTotalMs,
		cpuCoreRatio
	};
}
function shouldEmitDiagnosticLivenessEvent(now) {
	if (lastDiagnosticLivenessEventAt > 0 && now - lastDiagnosticLivenessEventAt < DEFAULT_LIVENESS_WARN_COOLDOWN_MS) return false;
	lastDiagnosticLivenessEventAt = now;
	return true;
}
function shouldEmitDiagnosticLivenessWarning(now, hasOpenWork) {
	if (!hasOpenWork) return false;
	if (lastDiagnosticLivenessWarnAt > 0 && now - lastDiagnosticLivenessWarnAt < DEFAULT_LIVENESS_WARN_COOLDOWN_MS) return false;
	lastDiagnosticLivenessWarnAt = now;
	return true;
}
//#endregion
//#region src/logging/diagnostic-memory.ts
const MB = 1048576;
const GB = 1024 * MB;
const DEFAULT_RSS_WARNING_BYTES = 1536 * MB;
const DEFAULT_RSS_CRITICAL_BYTES = 3072 * MB;
const DEFAULT_HEAP_WARNING_BYTES = 1024 * MB;
const DEFAULT_HEAP_CRITICAL_BYTES = 2048 * MB;
const DEFAULT_HEAP_WARNING_RATIO = .5;
const DEFAULT_HEAP_CRITICAL_RATIO = .75;
const BUN_HEAP_WARNING_MAX_BYTES = 4 * GB;
const BUN_HEAP_CRITICAL_MAX_BYTES = 6 * GB;
const DEFAULT_RSS_GROWTH_WARNING_BYTES = 512 * MB;
const DEFAULT_RSS_GROWTH_CRITICAL_BYTES = 1024 * MB;
const DEFAULT_RSS_GROWTH_WARNING_RATIO = .04;
const DEFAULT_RSS_GROWTH_CRITICAL_RATIO = .08;
const DEFAULT_GROWTH_WINDOW_MS = 6e5;
const DEFAULT_PRESSURE_REPEAT_MS = 3e5;
const BYTE_UNITS = [
	"B",
	"KiB",
	"MiB",
	"GiB",
	"TiB"
];
let defaultHeapSizeLimitBytes;
const DEFAULT_PROCESS_MEMORY_LIMIT_BYTES = process.constrainedMemory();
const DEFAULT_PHYSICAL_MEMORY_BYTES = totalmem();
const DEFAULT_IS_BUN_RUNTIME = typeof process.versions.bun === "string";
const log = createSubsystemLogger("gateway").child("diagnostics/memory");
function isPositiveMemoryLimit(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveProcessMemoryLimitBytes(processMemoryLimitBytes, physicalMemoryBytes, isBunRuntime) {
	if (!isPositiveMemoryLimit(processMemoryLimitBytes)) return !isBunRuntime && isPositiveMemoryLimit(physicalMemoryBytes) ? physicalMemoryBytes : void 0;
	return isPositiveMemoryLimit(physicalMemoryBytes) ? Math.min(processMemoryLimitBytes, physicalMemoryBytes) : processMemoryLimitBytes;
}
const state = {
	growth: null,
	lastPressureAtByKey: /* @__PURE__ */ new Map()
};
function normalizeMemoryUsage(memory) {
	return {
		rssBytes: memory.rss,
		heapTotalBytes: memory.heapTotal,
		heapUsedBytes: memory.heapUsed,
		externalBytes: memory.external,
		arrayBuffersBytes: memory.arrayBuffers,
		...sampleTrackedWorkerMemory()
	};
}
function resolveThresholds(thresholds, heapSizeLimitBytes, processMemoryLimitBytes, physicalMemoryBytes, isBunRuntime = false) {
	const hasHeapLimit = isPositiveMemoryLimit(heapSizeLimitBytes);
	const heapWarningBytes = hasHeapLimit ? Math.min(Math.floor(heapSizeLimitBytes * DEFAULT_HEAP_WARNING_RATIO), isBunRuntime ? BUN_HEAP_WARNING_MAX_BYTES : Infinity) : DEFAULT_HEAP_WARNING_BYTES;
	const heapCriticalBytes = hasHeapLimit ? Math.min(Math.floor(heapSizeLimitBytes * DEFAULT_HEAP_CRITICAL_RATIO), isBunRuntime ? BUN_HEAP_CRITICAL_MAX_BYTES : Infinity) : DEFAULT_HEAP_CRITICAL_BYTES;
	const usableProcessMemoryLimitBytes = resolveProcessMemoryLimitBytes(processMemoryLimitBytes, physicalMemoryBytes, isBunRuntime);
	const hasProcessMemoryLimit = usableProcessMemoryLimitBytes !== void 0;
	const useBunRssCaps = isBunRuntime && hasProcessMemoryLimit;
	const useHeapForRss = !isBunRuntime && hasHeapLimit;
	const rssWarningBase = useBunRssCaps ? BUN_HEAP_WARNING_MAX_BYTES : useHeapForRss ? Math.max(DEFAULT_RSS_WARNING_BYTES, heapWarningBytes) : DEFAULT_RSS_WARNING_BYTES;
	const rssCriticalBase = useBunRssCaps ? BUN_HEAP_CRITICAL_MAX_BYTES : useHeapForRss ? Math.max(DEFAULT_RSS_CRITICAL_BYTES, heapCriticalBytes) : DEFAULT_RSS_CRITICAL_BYTES;
	const processWarningBytes = hasProcessMemoryLimit ? Math.floor(usableProcessMemoryLimitBytes * DEFAULT_HEAP_WARNING_RATIO) : rssWarningBase;
	const processCriticalBytes = hasProcessMemoryLimit ? Math.floor(usableProcessMemoryLimitBytes * DEFAULT_HEAP_CRITICAL_RATIO) : rssCriticalBase;
	const growthMemoryLimitBytes = useHeapForRss ? Math.min(heapSizeLimitBytes, usableProcessMemoryLimitBytes ?? heapSizeLimitBytes) : 0;
	return {
		rssWarningBytes: thresholds?.rssWarningBytes ?? Math.min(rssWarningBase, processWarningBytes),
		rssCriticalBytes: thresholds?.rssCriticalBytes ?? Math.min(rssCriticalBase, processCriticalBytes),
		heapUsedWarningBytes: thresholds?.heapUsedWarningBytes ?? heapWarningBytes,
		heapUsedCriticalBytes: thresholds?.heapUsedCriticalBytes ?? heapCriticalBytes,
		rssGrowthWarningBytes: thresholds?.rssGrowthWarningBytes ?? Math.max(DEFAULT_RSS_GROWTH_WARNING_BYTES, Math.floor(growthMemoryLimitBytes * DEFAULT_RSS_GROWTH_WARNING_RATIO)),
		rssGrowthCriticalBytes: thresholds?.rssGrowthCriticalBytes ?? Math.max(DEFAULT_RSS_GROWTH_CRITICAL_BYTES, Math.floor(growthMemoryLimitBytes * DEFAULT_RSS_GROWTH_CRITICAL_RATIO)),
		growthWindowMs: thresholds?.growthWindowMs ?? DEFAULT_GROWTH_WINDOW_MS,
		pressureRepeatMs: thresholds?.pressureRepeatMs ?? DEFAULT_PRESSURE_REPEAT_MS
	};
}
function pickThresholdPressure(params) {
	const { memory, thresholds } = params;
	const candidates = [
		[
			memory.rssBytes,
			thresholds.rssCriticalBytes,
			"critical",
			"rss_threshold"
		],
		[
			memory.heapUsedBytes,
			thresholds.heapUsedCriticalBytes,
			"critical",
			"heap_threshold"
		],
		[
			memory.rssBytes,
			thresholds.rssWarningBytes,
			"warning",
			"rss_threshold"
		],
		[
			memory.heapUsedBytes,
			thresholds.heapUsedWarningBytes,
			"warning",
			"heap_threshold"
		]
	];
	for (const [value, thresholdBytes, level, reason] of candidates) if (value >= thresholdBytes) return {
		level,
		reason,
		memory,
		thresholdBytes
	};
	return null;
}
function pickGrowthPressure(params) {
	const { current, thresholds } = params;
	const growth = state.growth;
	if (!growth || current.ts <= growth.lastSampleAt || current.ts - growth.lastSampleAt > thresholds.growthWindowMs) {
		state.growth = {
			lastSampleAt: current.ts,
			windowStart: current.ts,
			windowMinimum: current,
			previousMinimum: null,
			baseline: current,
			risingWindows: 0
		};
		return null;
	}
	growth.lastSampleAt = current.ts;
	if (current.memory.rssBytes < growth.windowMinimum.memory.rssBytes) growth.windowMinimum = current;
	if (current.ts - growth.windowStart < thresholds.growthWindowMs / 2) return null;
	const minimum = growth.windowMinimum;
	const previous = growth.previousMinimum;
	growth.windowStart = current.ts;
	growth.windowMinimum = current;
	growth.previousMinimum = minimum;
	if (!previous || minimum.memory.rssBytes <= previous.memory.rssBytes) {
		growth.baseline = minimum;
		growth.risingWindows = 0;
		return null;
	}
	growth.risingWindows++;
	if (growth.risingWindows < 2) return null;
	const windowMs = minimum.ts - growth.baseline.ts;
	const rssGrowthBytes = minimum.memory.rssBytes - growth.baseline.memory.rssBytes;
	for (const [level, thresholdBytes] of [["critical", thresholds.rssGrowthCriticalBytes], ["warning", thresholds.rssGrowthWarningBytes]]) if (rssGrowthBytes >= thresholdBytes) return {
		level,
		reason: "rss_growth",
		memory: current.memory,
		thresholdBytes,
		rssGrowthBytes,
		windowMs
	};
	return null;
}
function shouldEmitPressure(pressure, now, repeatMs) {
	const key = `${pressure.level}:${pressure.reason}`;
	const lastAt = state.lastPressureAtByKey.get(key);
	if (lastAt !== void 0 && now - lastAt < repeatMs) return false;
	state.lastPressureAtByKey.set(key, now);
	return true;
}
function formatOptionalPressureMetric(label, value) {
	return typeof value === "number" && Number.isFinite(value) ? ` ${label}=${value}` : "";
}
function formatScaledNumber(value) {
	return (value >= 10 ? value.toFixed(1) : value.toFixed(2)).replace(/\.0+$/u, "").replace(/(\.\d*[1-9])0$/u, "$1");
}
function formatReadableBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	let scaled = value;
	let unitIndex = 0;
	while (scaled >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
		scaled /= 1024;
		unitIndex++;
	}
	return unitIndex === 0 ? `${Math.round(scaled)} ${BYTE_UNITS[unitIndex]}` : `${formatScaledNumber(scaled)} ${BYTE_UNITS[unitIndex]}`;
}
function formatPressureRatio(params) {
	const { pressure, thresholdBytes } = params;
	if (!Number.isFinite(thresholdBytes) || thresholdBytes <= 0) return;
	const value = pressure.reason === "heap_threshold" ? pressure.memory.heapUsedBytes : pressure.reason === "rss_growth" ? pressure.rssGrowthBytes : pressure.memory.rssBytes;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return `${formatScaledNumber(value / thresholdBytes * 100)}%`;
}
function formatPressureSummary(pressure) {
	return [
		`rss=${formatReadableBytes(pressure.memory.rssBytes)}`,
		`heap=${formatReadableBytes(pressure.memory.heapUsedBytes)}`,
		pressure.thresholdBytes !== void 0 ? `threshold=${formatReadableBytes(pressure.thresholdBytes)}` : "",
		pressure.thresholdBytes !== void 0 ? `thresholdRatio=${formatPressureRatio({
			pressure,
			thresholdBytes: pressure.thresholdBytes
		})}` : "",
		pressure.rssGrowthBytes !== void 0 ? `rssGrowth=${formatReadableBytes(pressure.rssGrowthBytes)}` : ""
	].filter((part) => Boolean(part)).join(" ");
}
function logMemoryPressure(pressure) {
	const nextStep = pressure.level === "critical" ? "nextStep=run openclaw gateway diagnostics export, inspect an existing bundle with openclaw gateway stability --bundle latest, or on Node sample allocations with openclaw gateway call diagnostics.heapProfile --timeout 30000." : "nextStep=run openclaw gateway status --deep and openclaw gateway diagnostics export; restart gateway if pressure persists";
	const message = `memory pressure: level=${pressure.level} reason=${pressure.reason} ${formatPressureSummary(pressure)} rssBytes=${pressure.memory.rssBytes} heapUsedBytes=${pressure.memory.heapUsedBytes} externalBytes=${pressure.memory.externalBytes} arrayBuffersBytes=${pressure.memory.arrayBuffersBytes}` + formatOptionalPressureMetric("workerHeapTotalBytes", pressure.memory.workerHeapTotalBytes) + formatOptionalPressureMetric("workerHeapUsedBytes", pressure.memory.workerHeapUsedBytes) + formatOptionalPressureMetric("workerExternalBytes", pressure.memory.workerExternalBytes) + formatOptionalPressureMetric("workerArrayBuffersBytes", pressure.memory.workerArrayBuffersBytes) + formatOptionalPressureMetric("workerCount", pressure.memory.workerCount) + formatOptionalPressureMetric("workerHeapSampledCount", pressure.memory.workerHeapSampledCount) + formatOptionalPressureMetric("workerArrayBuffersSampledCount", pressure.memory.workerArrayBuffersSampledCount) + (pressure.memory.workerMemoryCoverage ? ` workerMemoryCoverage=${pressure.memory.workerMemoryCoverage} workerMemoryScope=direct` : "") + (pressure.memory.workerMemoryMissing?.length ? ` workerMemoryMissing=${JSON.stringify(pressure.memory.workerMemoryMissing.slice(0, 5))}` : "") + (pressure.memory.workerHeaps?.length ? ` workerHeaps=${JSON.stringify(pressure.memory.workerHeaps.toSorted((a, b) => b.heapUsed + (b.external ?? 0) - a.heapUsed - (a.external ?? 0)).slice(0, 5))}` : "") + formatOptionalPressureMetric("thresholdBytes", pressure.thresholdBytes) + formatOptionalPressureMetric("rssGrowthBytes", pressure.rssGrowthBytes) + formatOptionalPressureMetric("windowMs", pressure.windowMs) + (pressure.memory.workerCount ? " workerLimitScope=js-heap-only; external/ArrayBuffers are not capped; nested workers are not included." : "") + ` ${nextStep}`;
	log.warn(message);
}
function emitDiagnosticMemorySample(options) {
	const now = options?.now ?? Date.now();
	const memory = normalizeMemoryUsage(options?.memoryUsage ?? process.memoryUsage());
	const current = {
		ts: now,
		memory
	};
	const thresholds = resolveThresholds(options?.thresholds, options?.heapSizeLimitBytes ?? (defaultHeapSizeLimitBytes ??= getHeapStatistics().heap_size_limit), options?.processMemoryLimitBytes ?? DEFAULT_PROCESS_MEMORY_LIMIT_BYTES, options?.physicalMemoryBytes ?? DEFAULT_PHYSICAL_MEMORY_BYTES, options?.isBunRuntime ?? DEFAULT_IS_BUN_RUNTIME);
	if (options?.emitSample !== false) emitInternalDiagnosticEvent({
		type: "diagnostic.memory.sample",
		memory: {
			...memory,
			heapSpaces: DEFAULT_IS_BUN_RUNTIME ? void 0 : getHeapSpaceStatistics()
		},
		uptimeMs: options?.uptimeMs ?? Math.round(process.uptime() * 1e3)
	});
	const growthPressure = pickGrowthPressure({
		current,
		thresholds
	});
	const pressure = pickThresholdPressure({
		memory,
		thresholds
	}) ?? growthPressure;
	if (pressure?.level === "critical") channel("openclaw.memory.critical").publish(void 0);
	if (pressure && shouldEmitPressure(pressure, now, thresholds.pressureRepeatMs)) {
		emitInternalDiagnosticEvent({
			type: "diagnostic.memory.pressure",
			...pressure
		});
		logMemoryPressure(pressure);
	}
	return memory;
}
function resetDiagnosticMemoryForTest() {
	state.growth = null;
	state.lastPressureAtByKey.clear();
}
//#endregion
//#region src/logging/diagnostic-session-attention.ts
function isRepeatedModelRequestStalled(activity, abortThresholdMs) {
	const now = Date.now();
	return activity.hasActiveEmbeddedRun === true && (activity.repeatedRequestNoProgressAgeMs ?? 0) >= Math.max(abortThresholdMs, activity.activeModelCallRequestTimeoutMs ?? 0) && (activity.activeRetryWaitDeadlineAtMs === void 0 || now >= activity.activeRetryWaitDeadlineAtMs) && (activity.activeToolRecoveryDeadlineAtMs === void 0 || now >= activity.activeToolRecoveryDeadlineAtMs);
}
function classifySessionAttention(params) {
	const longRunning = (reason) => ({
		eventType: "session.long_running",
		reason,
		classification: "long_running",
		activeWorkKind: params.activity.activeWorkKind,
		recoveryEligible: false
	});
	const stalled = (reason, classification = "stalled_agent_run") => ({
		eventType: "session.stalled",
		reason,
		classification,
		activeWorkKind: params.activity.activeWorkKind,
		recoveryEligible: false
	});
	if (params.activity.activeRetryWaitDeadlineAtMs !== void 0 && Date.now() < params.activity.activeRetryWaitDeadlineAtMs) return longRunning("provider_retry_wait");
	if (params.runtimeOwnsLiveness) return longRunning("runtime_owned_wait");
	if (params.activity.activeWorkKind) {
		const lastProgressAgeMs = params.activity.lastProgressAgeMs ?? 0;
		if (params.activity.hasActiveEmbeddedRun === true && typeof params.stuckSessionAbortMs === "number" && (params.activity.repeatedRequestNoProgressAgeMs ?? 0) >= params.stuckSessionAbortMs) return stalled("repeated_model_requests_without_progress");
		if (params.state === "idle" && params.queueDepth > 0 && params.activity.hasActiveEmbeddedRun !== true && lastProgressAgeMs > params.staleMs) return {
			eventType: "session.stuck",
			reason: "queued_work_without_active_run",
			classification: "stale_session_state",
			recoveryEligible: true
		};
		if (params.activity.activeWorkKind === "tool_call" && (params.activity.activeToolAgeMs ?? 0) > params.staleMs && lastProgressAgeMs > params.staleMs) return stalled("blocked_tool_call", "blocked_tool_call");
		if (params.queueDepth > 0 && params.activity.activeWorkKind === "embedded_run" && isTerminalDiagnosticProgressReason(params.activity.lastProgressReason)) return stalled("queued_behind_terminal_active_work");
		if (params.activity.activeWorkKind === "model_call" && params.activity.hasActiveEmbeddedRun === true && lastProgressAgeMs > params.staleMs) {
			if (typeof params.stuckSessionAbortMs === "number" && lastProgressAgeMs >= params.stuckSessionAbortMs) return stalled("active_work_without_progress");
			return longRunning("active_model_call_without_progress");
		}
		if (lastProgressAgeMs > params.staleMs) return stalled("active_work_without_progress");
		return longRunning(params.queueDepth > 0 ? "queued_behind_active_work" : "active_work");
	}
	return {
		eventType: "session.stuck",
		reason: params.queueDepth > 0 ? "queued_work_without_active_run" : "stale_session_state",
		classification: "stale_session_state",
		recoveryEligible: true
	};
}
function isTerminalDiagnosticProgressReason(reason) {
	if (!reason) return false;
	return reason === "run:completed" || reason === "embedded_run:ended" || reason.includes("response.completed") || reason.includes("rawResponseItem/completed") || reason.includes("raw_response_item.completed") || reason.includes("output_item.done");
}
//#endregion
//#region src/logging/diagnostic-session-context.ts
let logGeneration = 0;
function retireSessionDiagnosticLogs() {
	logGeneration += 1;
}
async function withSessionDiagnosticContext(params, consume, isCurrent = () => true) {
	const sessionKey = params.sessionKey?.trim();
	const parsed = parseAgentSessionKey(sessionKey);
	if (!sessionKey || !parsed || !isValidAgentId(parsed.agentId) || isIncognitoSessionKey(sessionKey)) {
		consume({});
		return;
	}
	const [kind, cronJobId, ...rest] = parsed.rest.split(":");
	const runIndex = rest.indexOf("run");
	const context = kind === "cron" && cronJobId ? {
		cronJobId,
		cronRunId: runIndex >= 0 ? rest[runIndex + 1] : void 0
	} : {};
	const sessionId = params.activeSessionId?.trim();
	let identityChanged = false;
	const unsubscribe = onSessionIdentityMutation((mutation) => {
		if (mutation.previous.sessionKeys.includes(sessionKey) || "current" in mutation && mutation.current.sessionKeys.includes(sessionKey) || mutation.agentId === parsed.agentId && sessionId && mutation.previous.sessionId === sessionId) identityChanged = true;
	});
	const assertCurrent = () => {
		if (identityChanged || !isCurrent()) throw new Error("Diagnostic session context is no longer current");
	};
	let consumed = false;
	let resolveName;
	const publish = (value) => {
		assertCurrent();
		if (value.cronJobId) value.cronJobName = resolveName?.(value.cronJobId);
		consumed = true;
		consume(value);
	};
	try {
		assertCurrent();
		if (context.cronJobId) {
			resolveName = await prepareCronJobNameResolver([context.cronJobId]).catch(() => void 0);
			assertCurrent();
		}
		if (sessionId) await withSessionDiagnosticTextInWorker({
			agentId: parsed.agentId,
			sessionKey,
			sessionId
		}, assertCurrent, (lastAssistant) => publish({
			...context,
			lastAssistant
		}));
		else publish(context);
	} catch {
		if (!consumed && isCurrent()) consume(identityChanged ? {} : context);
	} finally {
		unsubscribe();
	}
}
function formatSessionDiagnosticFields(context, cronNameLabel = "cronJob") {
	const quote = (value) => `"${boundSessionDiagnosticText(value).replace(/["\\]/g, "\\$&")}"`;
	return [
		context.cronJobId ? `cronJobId=${context.cronJobId}` : "",
		context.cronRunId ? `cronRunId=${context.cronRunId}` : "",
		context.cronJobName ? `${cronNameLabel}=${quote(context.cronJobName)}` : "",
		context.lastAssistant ? `lastAssistant=${quote(context.lastAssistant)}` : ""
	].filter(Boolean).join(" ");
}
/** Recovery and event publication never wait for optional display enrichment. */
function logWithSessionDiagnosticContext(params) {
	const generation = logGeneration;
	const isCurrent = () => areDiagnosticsEnabledForProcess() && generation === logGeneration;
	if (!isCurrent() || !diagnosticLogger.isEnabled(params.level)) return;
	return withSessionDiagnosticContext(params, (context) => {
		if (isCurrent() && diagnosticLogger.isEnabled(params.level)) diagnosticLogger[params.level](params.format(formatSessionDiagnosticFields(context, params.cronNameLabel)));
	}, isCurrent);
}
//#endregion
//#region src/logging/diagnostic-session-recovery.ts
function resolveStuckSessionRecoveryRef(params) {
	return params.sessionKey?.trim() || params.sessionId?.trim() || void 0;
}
function recoveryOutcomeClearsQueuedSessionState(outcome) {
	return (outcome.status === "released" || outcome.status === "aborted" && outcome.released > 0) && (outcome.queuedCount ?? 0) === 0;
}
function formatRecoveryOutcome(outcome) {
	const fields = [
		`status=${outcome.status}`,
		`action=${outcome.action}`,
		`sessionId=${outcome.sessionId ?? outcome.activeSessionId ?? "unknown"}`,
		`sessionKey=${outcome.sessionKey ?? "unknown"}`
	];
	if (outcome.activeSessionId) fields.push(`activeSessionId=${outcome.activeSessionId}`);
	if (outcome.activeWorkKind) fields.push(`activeWorkKind=${outcome.activeWorkKind}`);
	if (outcome.lane) fields.push(`lane=${outcome.lane}`);
	if ("reason" in outcome) fields.push(`reason=${outcome.reason}`);
	if ("aborted" in outcome) fields.push(`aborted=${outcome.aborted}`, `drained=${outcome.drained}`, `forceCleared=${outcome.forceCleared}`);
	if ("released" in outcome) fields.push(`released=${outcome.released}`);
	if ((outcome.status === "aborted" || outcome.status === "released") && outcome.queuedCount !== void 0) fields.push(`queuedCount=${outcome.queuedCount}`);
	if ("activeCount" in outcome && outcome.activeCount !== void 0) fields.push(`laneActive=${outcome.activeCount}`);
	if (outcome.status === "skipped" && outcome.queuedCount !== void 0) fields.push(`laneQueued=${outcome.queuedCount}`);
	if ("error" in outcome) fields.push(`error=${outcome.error}`);
	return fields.join(" ");
}
//#endregion
//#region src/logging/diagnostic-session-recovery-coordinator.ts
const recoveryRequestsInFlight = /* @__PURE__ */ new Set();
function emitSessionRecoveryRequested(params) {
	emitInternalDiagnosticEvent({
		type: "session.recovery.requested",
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		state: params.request.expectedState ?? "processing",
		stateGeneration: params.request.stateGeneration,
		ageMs: params.request.ageMs,
		queueDepth: params.request.queueDepth,
		reason: params.classification.reason,
		activeWorkKind: params.classification.activeWorkKind,
		allowActiveAbort: params.request.allowActiveAbort
	});
}
function emitSessionRecoveryCompleted(params) {
	emitInternalDiagnosticEvent({
		type: "session.recovery.completed",
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		state: params.request.expectedState ?? "processing",
		stateGeneration: params.request.stateGeneration,
		ageMs: params.request.ageMs,
		queueDepth: params.request.queueDepth,
		activeWorkKind: params.outcome.activeWorkKind,
		status: params.outcome.status,
		action: params.outcome.action,
		outcomeReason: "reason" in params.outcome ? params.outcome.reason : void 0,
		released: "released" in params.outcome ? params.outcome.released || void 0 : void 0,
		stale: params.stale
	});
}
function isRecoveryPromiseLike(value) {
	return typeof value?.then === "function";
}
function applyRecoveryOutcomeToDiagnosticState(params) {
	if (!params.outcome) return;
	if (params.outcome.status !== "aborted" && params.outcome.status !== "released") {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome
		});
		return;
	}
	const expectedState = params.request.expectedState ?? "processing";
	const currentState = peekDiagnosticSessionState(params.request);
	const currentGeneration = currentState?.generation ?? 0;
	const requestGeneration = params.request.stateGeneration ?? 0;
	if (!(expectedState === "idle" && params.request.stateGeneration !== void 0 && params.outcome.action === "abort_embedded_run" ? currentState?.state === "idle" && (currentGeneration === requestGeneration || currentGeneration === requestGeneration + 1) : isDiagnosticSessionStateCurrent({
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		generation: params.request.stateGeneration,
		state: expectedState
	}))) {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome,
			stale: true
		});
		return;
	}
	const state = getDiagnosticSessionState(params.request);
	if (clearDiagnosticEmbeddedRunActivityForSession({
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		activeSessionId: params.outcome.activeSessionId,
		recoveryStartedAfterEmbeddedRunSequence: params.recoveryStartedAfterEmbeddedRunSequence,
		recoveryStartedAfterDiagnosticEventSequence: params.recoveryStartedAfterDiagnosticEventSequence
	}).blockedByActiveEmbeddedRun) {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome,
			stale: true
		});
		return;
	}
	const prevState = state.state;
	state.state = "idle";
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	const preserveQueuedIdleWork = params.request.expectedState === "idle" && (params.outcome.queuedCount ?? 0) > 0;
	state.queueDepth = recoveryOutcomeClearsQueuedSessionState(params.outcome) ? 0 : preserveQueuedIdleWork ? Math.max(state.queueDepth, params.request.queueDepth ?? 0) : Math.max(0, state.queueDepth - 1);
	emitInternalDiagnosticEvent({
		type: "session.state",
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		prevState,
		state: "idle",
		reason: `stuck_recovery:${params.outcome.status}`,
		queueDepth: state.queueDepth
	});
	emitSessionRecoveryCompleted({
		request: params.request,
		outcome: params.outcome
	});
	markDiagnosticActivity();
}
function requestStuckSessionRecoveryOutcome(params) {
	const inFlightKey = resolveStuckSessionRecoveryRef(params.request);
	if (inFlightKey && recoveryRequestsInFlight.has(inFlightKey)) {
		const outcome = {
			status: "skipped",
			action: "observe_only",
			reason: "already_in_flight",
			sessionId: params.request.sessionId,
			sessionKey: params.request.sessionKey,
			activeWorkKind: params.classification.activeWorkKind
		};
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome
		});
		return Promise.resolve(outcome);
	}
	if (inFlightKey) recoveryRequestsInFlight.add(inFlightKey);
	emitSessionRecoveryRequested({
		request: params.request,
		classification: params.classification
	});
	const recoveryStartedAfterEmbeddedRunSequence = getDiagnosticEmbeddedRunActivitySequence();
	const recoveryStartedAfterDiagnosticEventSequence = getInternalDiagnosticEventSequence();
	const clearInFlight = () => {
		if (inFlightKey) recoveryRequestsInFlight.delete(inFlightKey);
	};
	const completeRecovery = (outcome) => {
		applyRecoveryOutcomeToDiagnosticState({
			request: params.request,
			outcome,
			recoveryStartedAfterEmbeddedRunSequence,
			recoveryStartedAfterDiagnosticEventSequence
		});
		return outcome;
	};
	const failRecovery = (err) => {
		return completeRecovery({
			status: "failed",
			action: "none",
			reason: "exception",
			sessionId: params.request.sessionId,
			sessionKey: params.request.sessionKey,
			error: String(err)
		});
	};
	try {
		const result = params.recover(params.request);
		if (isRecoveryPromiseLike(result)) return result.then((outcome) => completeRecovery(outcome ?? void 0)).catch(failRecovery).finally(clearInFlight);
		const outcome = completeRecovery(result ?? void 0);
		clearInFlight();
		return Promise.resolve(outcome);
	} catch (err) {
		try {
			return Promise.resolve(failRecovery(err));
		} finally {
			clearInFlight();
		}
	}
}
function requestStuckSessionRecovery(params) {
	requestStuckSessionRecoveryOutcome(params);
}
function resetDiagnosticSessionRecoveryCoordinatorForTest() {
	recoveryRequestsInFlight.clear();
}
//#endregion
//#region src/logging/diagnostic.ts
const webhookStats = {
	received: 0,
	processed: 0,
	errors: 0
};
const DEFAULT_STUCK_SESSION_WARN_MS = 12e4;
const MIN_STALLED_EMBEDDED_RUN_ABORT_MS = 3e5;
const STALLED_EMBEDDED_RUN_ABORT_WARN_MULTIPLIER = 3;
const RECENT_DIAGNOSTIC_ACTIVITY_MS = 12e4;
const DIAGNOSTIC_HEARTBEAT_INTERVAL_MS = 3e4;
const loadStuckSessionRecoveryRuntime = createLazyRuntimeModule(() => import("./diagnostic-stuck-session-recovery.runtime.js"));
const loadCommandPollBackoffRuntime = createLazyRuntimeModule(() => import("./command-poll-backoff.runtime.js"));
async function recoverStuckSession(params) {
	return loadStuckSessionRecoveryRuntime().then(({ recoverStuckDiagnosticSession }) => recoverStuckDiagnosticSession(params)).catch((err) => {
		diagnosticLogger.warn(`stuck session recovery unavailable: ${String(err)}`);
		return {
			status: "failed",
			action: "none",
			reason: "exception",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			error: String(err)
		};
	});
}
function pushLimitedDiagnosticLabel(labels, state, now) {
	const label = state.sessionKey ?? state.sessionId ?? "unknown";
	const ageSeconds = Math.round(Math.max(0, now - state.lastActivity) / 1e3);
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: state.sessionId,
		sessionKey: state.sessionKey
	}, now);
	if (labels.length >= 5) return;
	const workKind = activity.activeWorkKind ? `/${activity.activeWorkKind}` : "";
	const lastProgress = activity.lastProgressReason ? ` last=${activity.lastProgressReason}` : "";
	labels.push(`${label}(${state.state}${workKind},q=${state.queueDepth},age=${ageSeconds}s${lastProgress})`);
}
function resolveDiagnosticQueuedBacklog(state) {
	return Math.max(0, state.queueDepth - (state.state === "processing" && state.activeQueuedTurn ? 1 : 0));
}
function getDiagnosticWorkSnapshot(now = Date.now()) {
	let activeCount = 0;
	let waitingCount = 0;
	let queuedCount = 0;
	const activeLabels = [];
	const waitingLabels = [];
	const queuedLabels = [];
	for (const state of diagnosticSessionStates.values()) {
		if (state.state === "processing") {
			activeCount += 1;
			pushLimitedDiagnosticLabel(activeLabels, state, now);
		} else if (state.state === "waiting") {
			waitingCount += 1;
			pushLimitedDiagnosticLabel(waitingLabels, state, now);
		}
		const queuedBacklog = resolveDiagnosticQueuedBacklog(state);
		if (queuedBacklog > 0) pushLimitedDiagnosticLabel(queuedLabels, state, now);
		queuedCount += queuedBacklog;
	}
	return {
		activeCount,
		waitingCount,
		queuedCount,
		activeLabels,
		waitingLabels,
		queuedLabels
	};
}
function hasOpenDiagnosticWork(snapshot) {
	return snapshot.activeCount > 0 || snapshot.waitingCount > 0 || snapshot.queuedCount > 0;
}
function hasRecentDiagnosticActivity(now) {
	const lastActivityAt = getLastDiagnosticActivityAt();
	return lastActivityAt > 0 && now - lastActivityAt <= RECENT_DIAGNOSTIC_ACTIVITY_MS;
}
function formatOptionalDiagnosticMetric(value) {
	return value === void 0 ? "unknown" : String(value);
}
function emitDiagnosticLivenessWarning(sample, work, now) {
	const phase = getCurrentDiagnosticPhase();
	const recentPhases = getRecentDiagnosticPhases(6, { completedAfter: now - Math.max(0, sample.intervalMs) });
	const recentPhaseSummary = formatRecentDiagnosticPhases(recentPhases);
	const workLabelSummary = formatDiagnosticWorkLabels(work);
	const message = `liveness warning: reasons=${sample.reasons.join(",")} interval=${Math.round(sample.intervalMs / 1e3)}s${sample.degradedSinceMs === void 0 ? "" : ` degradedFor=${Math.round(sample.degradedSinceMs / 1e3)}s`} eventLoopDelayP99Ms=${formatOptionalDiagnosticMetric(sample.eventLoopDelayP99Ms)} eventLoopDelayMaxMs=${formatOptionalDiagnosticMetric(sample.eventLoopDelayMaxMs)} eventLoopUtilization=${formatOptionalDiagnosticMetric(sample.eventLoopUtilization)} cpuCoreRatio=${formatOptionalDiagnosticMetric(sample.cpuCoreRatio)} active=${work.activeCount} waiting=${work.waitingCount} queued=${work.queuedCount}${phase ? ` phase=${phase}` : ""}${recentPhaseSummary ? ` recentPhases=${recentPhaseSummary}` : ""}${workLabelSummary ? ` work=[${workLabelSummary}]` : ""}`;
	const hasBlockingWork = work.waitingCount > 0 || work.queuedCount > 0;
	const hasPersistentDegradation = sample.degradedSinceMs !== void 0;
	const hasSustainedEventLoopDelay = (sample.eventLoopDelayP99Ms ?? 0) >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS;
	if (hasPersistentDegradation || hasBlockingWork || hasOpenDiagnosticWork(work) && hasSustainedEventLoopDelay) diagnosticLogger.warn(message);
	else diagnosticLogger.debug(message);
	emitInternalDiagnosticEvent({
		type: "diagnostic.liveness.warning",
		reasons: sample.reasons,
		intervalMs: sample.intervalMs,
		degradedSinceMs: sample.degradedSinceMs,
		eventLoopDelayP99Ms: sample.eventLoopDelayP99Ms,
		eventLoopDelayMaxMs: sample.eventLoopDelayMaxMs,
		eventLoopUtilization: sample.eventLoopUtilization,
		cpuUserMs: sample.cpuUserMs,
		cpuSystemMs: sample.cpuSystemMs,
		cpuTotalMs: sample.cpuTotalMs,
		cpuCoreRatio: sample.cpuCoreRatio,
		active: work.activeCount,
		waiting: work.waitingCount,
		queued: work.queuedCount,
		phase,
		recentPhases,
		activeWorkLabels: work.activeLabels,
		waitingWorkLabels: work.waitingLabels,
		queuedWorkLabels: work.queuedLabels
	});
	markDiagnosticActivity();
}
function formatRecentDiagnosticPhases(phases) {
	return phases.map((phase) => `${phase.name}:${Math.round(phase.durationMs ?? 0)}ms`).join(",");
}
function formatDiagnosticWorkLabels(work) {
	return [
		work.activeLabels.length > 0 ? `active=${work.activeLabels.join("|")}` : "",
		work.waitingLabels.length > 0 ? `waiting=${work.waitingLabels.join("|")}` : "",
		work.queuedLabels.length > 0 ? `queued=${work.queuedLabels.join("|")}` : ""
	].filter(Boolean).join(" ");
}
function resolveStuckSessionWarnMs() {
	return DEFAULT_STUCK_SESSION_WARN_MS;
}
function resolveStuckSessionAbortMs(stuckSessionWarnMs) {
	return Math.max(MIN_STALLED_EMBEDDED_RUN_ABORT_MS, stuckSessionWarnMs * STALLED_EMBEDDED_RUN_ABORT_WARN_MULTIPLIER);
}
function isActiveAbortRecoveryEligible(params) {
	const { activity, classification, stuckSessionAbortMs } = params;
	const lastProgressAgeMs = activity?.lastProgressAgeMs;
	if (!activity || classification?.eventType !== "session.stalled" || lastProgressAgeMs === void 0) return false;
	if (classification.classification === "blocked_tool_call" && classification.activeWorkKind === "tool_call") {
		const abortMs = resolveRunStaleThresholdMs(activity, lastProgressAgeMs, stuckSessionAbortMs);
		return activity.activeToolAgeMs !== void 0 && lastProgressAgeMs >= abortMs && (activity.activeToolDeadlineAtMs !== void 0 || activity.activeToolAgeMs >= abortMs);
	}
	if (classification.classification !== "stalled_agent_run") return false;
	if (isRepeatedModelRequestStalled(activity, stuckSessionAbortMs)) return true;
	const modelAllowanceExpired = activity.activeModelCallRequestTimeoutMs === void 0 || lastProgressAgeMs >= activity.activeModelCallRequestTimeoutMs;
	return (classification.activeWorkKind === "model_call" || classification.activeWorkKind === "embedded_run") && lastProgressAgeMs >= resolveRunStaleThresholdMs(activity, lastProgressAgeMs, stuckSessionAbortMs) && modelAllowanceExpired;
}
function isIdleQueuedRecoverableSessionStall(params) {
	return params.state.state === "idle" && params.state.queueDepth > 0 && (params.activity.activeWorkKind !== void 0 || params.activity.hasActiveEmbeddedRun === true) && (params.activity.lastProgressAgeMs ?? 0) > params.staleMs;
}
function logWebhookReceived(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.received += 1;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`webhook received: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} total=${webhookStats.received}`);
	emitInternalDiagnosticEvent({
		type: "webhook.received",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId
	});
	markDiagnosticActivity();
}
function logWebhookProcessed(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.processed += 1;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`webhook processed: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} duration=${params.durationMs ?? 0}ms processed=${webhookStats.processed}`);
	emitInternalDiagnosticEvent({
		type: "webhook.processed",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId,
		durationMs: params.durationMs
	});
	markDiagnosticActivity();
}
function logWebhookError(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.errors += 1;
	diagnosticLogger.error(`webhook error: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} error="${params.error}" errors=${webhookStats.errors}`);
	emitInternalDiagnosticEvent({
		type: "webhook.error",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId,
		error: params.error
	});
	markDiagnosticActivity();
}
function logMessageQueued(params) {
	logMessageQueuedWithBacklogPolicy(params, true);
}
function logMessageReceived(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`message received: channel=${params.channel ?? "unknown"} chatId=${params.chatId ?? "unknown"} messageId=${params.messageId ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source}`);
	emitInternalDiagnosticEvent({
		type: "message.received",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		messageId: params.messageId,
		chatId: params.chatId,
		source: params.source
	});
	markDiagnosticActivity();
}
function logMessageDispatchStarted(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`message dispatch started: channel=${params.channel ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source}`);
	emitInternalDiagnosticEvent({
		type: "message.dispatch.started",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		source: params.source
	});
	markDiagnosticActivity();
}
function logMessageDispatchCompleted(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const level = params.outcome === "error" ? "error" : "debug";
	if (diagnosticLogger.isEnabled(level)) {
		const payload = `message dispatch completed: channel=${params.channel ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source} outcome=${params.outcome} duration=${params.durationMs}ms${params.reason ? ` reason=${params.reason}` : ""}${params.error ? ` error="${params.error}"` : ""}`;
		diagnosticLogger[level](payload);
	}
	emitInternalDiagnosticEvent({
		type: "message.dispatch.completed",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		source: params.source,
		durationMs: params.durationMs,
		outcome: params.outcome,
		reason: params.reason,
		error: params.error
	});
	markDiagnosticActivity();
}
function logMessageProcessed(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const level = params.outcome === "error" ? "error" : "debug";
	if (diagnosticLogger.isEnabled(level)) {
		const payload = `message processed: channel=${params.channel} chatId=${params.chatId ?? "unknown"} messageId=${params.messageId ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} duration=${params.durationMs ?? 0}ms${params.reason ? ` reason=${params.reason}` : ""}${params.error ? ` error="${params.error}"` : ""}`;
		diagnosticLogger[level](payload);
	}
	emitInternalDiagnosticEvent({
		type: "message.processed",
		channel: params.channel,
		chatId: params.chatId,
		messageId: params.messageId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		durationMs: params.durationMs,
		outcome: params.outcome,
		reason: params.reason,
		error: params.error
	});
	markDiagnosticActivity();
}
function logSessionTurnCreated(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`session turn created: runId=${params.runId} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} agentId=${params.agentId ?? "unknown"} channel=${params.channel ?? "unknown"} trigger=${params.trigger}`);
	emitInternalDiagnosticEvent({
		type: "session.turn.created",
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		channel: params.channel,
		trigger: params.trigger
	});
	markDiagnosticActivity();
}
function logSessionStateChange(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	const isProbeSession = state.sessionId?.startsWith("probe-") ?? false;
	const prevState = state.state;
	state.state = params.state;
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	if (params.state === "processing" && prevState !== "processing") state.activeQueuedTurn = state.queueDepth > 0;
	if (params.state === "idle") {
		state.queueDepth = Math.max(0, state.queueDepth - 1);
		state.activeQueuedTurn = false;
	}
	if (!isProbeSession && diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`session state: sessionId=${state.sessionId ?? "unknown"} sessionKey=${state.sessionKey ?? "unknown"} prev=${prevState} new=${params.state} reason="${params.reason ?? ""}" queueDepth=${state.queueDepth}`);
	emitInternalDiagnosticEvent({
		type: "session.state",
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		prevState,
		state: params.state,
		reason: params.reason,
		queueDepth: state.queueDepth
	});
	markDiagnosticActivity();
}
function markDiagnosticSessionProgress(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	markDiagnosticActivity();
}
function sessionAttentionFields(params) {
	const terminalProgressStale = isTerminalDiagnosticProgressReason(params.activity.lastProgressReason);
	return {
		...params.classification.activeWorkKind ? { activeWorkKind: params.classification.activeWorkKind } : {},
		...params.activity.lastProgressAgeMs !== void 0 ? { lastProgressAgeMs: params.activity.lastProgressAgeMs } : {},
		...params.activity.lastProgressReason ? { lastProgressReason: params.activity.lastProgressReason } : {},
		...params.activity.activeToolName ? { activeToolName: params.activity.activeToolName } : {},
		...params.activity.activeToolCallId ? { activeToolCallId: params.activity.activeToolCallId } : {},
		...params.activity.activeToolAgeMs !== void 0 ? { activeToolAgeMs: params.activity.activeToolAgeMs } : {},
		...params.activity.repeatedRequestNoProgressAgeMs !== void 0 ? { repeatedRequestNoProgressAgeMs: params.activity.repeatedRequestNoProgressAgeMs } : {},
		...terminalProgressStale ? { terminalProgressStale: true } : {}
	};
}
function formatSessionActivityLogFields(activity) {
	const fields = [];
	if (activity.lastProgressReason) fields.push(`lastProgress=${activity.lastProgressReason}`);
	if (activity.lastProgressAgeMs !== void 0) fields.push(`lastProgressAge=${Math.round(activity.lastProgressAgeMs / 1e3)}s`);
	if (activity.activeToolName) fields.push(`activeTool=${activity.activeToolName}`);
	if (activity.activeToolCallId) fields.push(`activeToolCallId=${activity.activeToolCallId}`);
	if (activity.activeToolAgeMs !== void 0) fields.push(`activeToolAge=${Math.round(activity.activeToolAgeMs / 1e3)}s`);
	if (activity.repeatedRequestNoProgressAgeMs !== void 0) fields.push(`repeatedRequestNoProgressAge=${Math.round(activity.repeatedRequestNoProgressAgeMs / 1e3)}s`);
	if (isTerminalDiagnosticProgressReason(activity.lastProgressReason)) fields.push("terminalProgressStale=true");
	return fields.join(" ");
}
function logSessionAttention(state, params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const { activity, queueDepth } = params;
	const classification = classifySessionAttention({
		state: params.expectedState,
		queueDepth,
		activity,
		staleMs: params.thresholdMs,
		stuckSessionAbortMs: params.abortThresholdMs,
		runtimeOwnsLiveness: params.runtimeOwnsLiveness
	});
	const allowActiveAbort = isActiveAbortRecoveryEligible({
		classification,
		activity,
		stuckSessionAbortMs: params.abortThresholdMs
	});
	const recovery = classification.recoveryEligible || allowActiveAbort ? {
		classification,
		allowActiveAbort
	} : void 0;
	const warningAgeField = classification.eventType === "session.stuck" ? "lastStuckWarnAgeMs" : classification.eventType === "session.long_running" ? "lastLongRunningWarnAgeMs" : void 0;
	if (warningAgeField) {
		const lastWarnAgeMs = state[warningAgeField];
		const nextWarnAgeMs = lastWarnAgeMs === void 0 ? params.thresholdMs : Math.max(lastWarnAgeMs + params.thresholdMs, lastWarnAgeMs * 2);
		if (params.ageMs < nextWarnAgeMs) return recovery;
		state[warningAgeField] = params.ageMs;
	}
	const label = classification.eventType === "session.stuck" ? "stuck session" : classification.eventType === "session.stalled" ? "stalled session" : "long-running session";
	logWithSessionDiagnosticContext({
		level: classification.eventType === "session.long_running" && queueDepth <= 0 ? "debug" : "warn",
		sessionKey: params.sessionKey,
		activeSessionId: params.sessionId,
		format: (sessionFields) => {
			const detailFields = [formatSessionActivityLogFields(activity), sessionFields].filter(Boolean).join(" ");
			return `${label}: sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} state=${params.expectedState} age=${Math.round(params.ageMs / 1e3)}s queueDepth=${queueDepth} reason=${classification.reason} classification=${classification.classification}${classification.activeWorkKind ? ` activeWorkKind=${classification.activeWorkKind}` : ""}${detailFields ? ` ${detailFields}` : ""} recovery=${recovery ? "checking" : "none"}`;
		}
	});
	const baseEvent = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		state: params.expectedState,
		ageMs: params.ageMs,
		queueDepth,
		reason: classification.reason,
		...sessionAttentionFields({
			classification,
			activity
		})
	};
	if (classification.eventType === "session.long_running") emitInternalDiagnosticEvent({
		type: "session.long_running",
		...baseEvent,
		classification: "long_running"
	});
	else if (classification.eventType === "session.stalled") emitInternalDiagnosticEvent({
		type: "session.stalled",
		...baseEvent,
		classification: classification.classification
	});
	else emitInternalDiagnosticEvent({
		type: "session.stuck",
		...baseEvent,
		classification: "stale_session_state"
	});
	markDiagnosticActivity();
	return recovery;
}
let heartbeatJob;
let detachHeartbeatOwner;
let lastDiagnosticHeartbeatTickAt;
function startGatewayDiagnosticHeartbeat(scheduler, config, opts) {
	if (!areDiagnosticsEnabledForProcess() || !isDiagnosticsEnabled(config)) return;
	startDiagnosticRunActivityTracking();
	startDiagnosticStabilityRecorder();
	installDiagnosticStabilityFatalHook();
	reconcileDiagnosticGcObserver();
	if (heartbeatJob) return;
	if (!opts?.sampleLiveness) startDiagnosticLivenessSampler();
	const livenessGraceUntil = opts?.startupGraceMs != null && opts.startupGraceMs > 0 ? scheduler.now() + opts.startupGraceMs : 0;
	lastDiagnosticHeartbeatTickAt = scheduler.now();
	const tick = () => {
		reconcileDiagnosticGcObserver();
		emitChildProcessSpawnSample();
		let heartbeatConfig = config;
		if (!heartbeatConfig) try {
			heartbeatConfig = (opts?.getConfig ?? getRuntimeConfig)();
		} catch {
			heartbeatConfig = void 0;
		}
		const stuckSessionWarnMs = opts?.testTimings?.stuckSessionWarnMs ?? resolveStuckSessionWarnMs();
		const stuckSessionAbortMs = opts?.testTimings?.stuckSessionAbortMs ?? resolveStuckSessionAbortMs(stuckSessionWarnMs);
		const compactionSafetyTimeoutMs = resolveCompactionTimeoutMs(heartbeatConfig);
		const now = scheduler.now();
		const heartbeatElapsedMs = lastDiagnosticHeartbeatTickAt === void 0 ? 0 : now - lastDiagnosticHeartbeatTickAt;
		lastDiagnosticHeartbeatTickAt = now;
		const heartbeatOverdueMs = Math.max(0, heartbeatElapsedMs - DIAGNOSTIC_HEARTBEAT_INTERVAL_MS);
		const inStartupGrace = livenessGraceUntil > 0 && now < livenessGraceUntil;
		const recoveryObservationNow = now - heartbeatOverdueMs;
		const shouldDeferRecovery = heartbeatOverdueMs >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS;
		if (shouldDeferRecovery && !inStartupGrace) diagnosticLogger.warn(`liveness heartbeat delayed: overdue=${Math.round(heartbeatOverdueMs)}ms elapsed=${Math.round(heartbeatElapsedMs)}ms; deferring recovery decisions`);
		pruneDiagnosticSessionStates(now, true);
		const work = getDiagnosticWorkSnapshot(now);
		const rawLivenessSample = (opts?.sampleLiveness ?? sampleDiagnosticLiveness)(now, work);
		const livenessSample = inStartupGrace ? null : rawLivenessSample;
		const shouldEmitLivenessEvent = livenessSample !== null && shouldEmitDiagnosticLivenessEvent(now);
		const shouldEmitLivenessWarning = livenessSample !== null && shouldEmitDiagnosticLivenessWarning(now, hasOpenDiagnosticWork(work));
		const shouldEmitLivenessReport = shouldEmitLivenessEvent || shouldEmitLivenessWarning;
		const shouldRecordMemorySample = shouldEmitLivenessReport || hasRecentDiagnosticActivity(now) || hasOpenDiagnosticWork(work);
		if (opts?.emitMemorySample) opts.emitMemorySample({ emitSample: shouldRecordMemorySample });
		else emitDiagnosticMemorySample({ emitSample: shouldRecordMemorySample });
		if (!shouldRecordMemorySample) return;
		if (shouldEmitLivenessReport && livenessSample) emitDiagnosticLivenessWarning(livenessSample, work, now);
		diagnosticLogger.debug(`heartbeat: webhooks=${webhookStats.received}/${webhookStats.processed}/${webhookStats.errors} active=${work.activeCount} waiting=${work.waitingCount} queued=${work.queuedCount} nextWakeAtMs=${scheduler.nextWakeAtMs ?? "none"}`);
		emitInternalDiagnosticEvent({
			type: "diagnostic.heartbeat",
			webhooks: {
				received: webhookStats.received,
				processed: webhookStats.processed,
				errors: webhookStats.errors
			},
			active: work.activeCount,
			waiting: work.waitingCount,
			queued: work.queuedCount
		});
		loadCommandPollBackoffRuntime().then(({ pruneStaleCommandPolls }) => {
			for (const [, state] of diagnosticSessionStates) pruneStaleCommandPolls(state);
		}).catch((err) => {
			diagnosticLogger.debug(`command-poll-backoff prune failed: ${String(err)}`);
		});
		for (const [, state] of diagnosticSessionStates) {
			const observation = {
				sessionId: state.sessionId,
				sessionKey: state.sessionKey,
				sessionFile: state.sessionFile,
				expectedState: state.state,
				stateGeneration: state.generation ?? 0,
				queueDepth: resolveDiagnosticQueuedBacklog(state)
			};
			const ageMs = recoveryObservationNow - state.lastActivity;
			const recoveryBlocker = observation.sessionId ? resolveActiveEmbeddedRunRecoveryBlocker(observation.sessionId) : void 0;
			if (recoveryBlocker === "stale_session_state" || !isDiagnosticSessionStateCurrent({
				...observation,
				state: observation.expectedState,
				generation: observation.stateGeneration
			})) continue;
			const activity = getDiagnosticSessionActivitySnapshot(observation, recoveryObservationNow);
			const idleQueuedRecoverableStall = isIdleQueuedRecoverableSessionStall({
				state: {
					state: observation.expectedState,
					queueDepth: observation.queueDepth
				},
				activity,
				staleMs: stuckSessionWarnMs
			});
			const ownedWorkAgeMs = activity.activeWorkKind ? activity.lastProgressAgeMs ?? 0 : 0;
			const attentionAgeMs = idleQueuedRecoverableStall ? activity.lastProgressAgeMs ?? ageMs : Math.max(ageMs, activity.repeatedRequestNoProgressAgeMs ?? 0, ownedWorkAgeMs);
			if (observation.expectedState === "processing" && attentionAgeMs > stuckSessionWarnMs || idleQueuedRecoverableStall) {
				const recovery = logSessionAttention(state, {
					...observation,
					activity,
					runtimeOwnsLiveness: recoveryBlocker === "runtime_owned_wait",
					ageMs: attentionAgeMs,
					thresholdMs: stuckSessionWarnMs,
					abortThresholdMs: stuckSessionAbortMs
				});
				if (!recovery || shouldDeferRecovery) continue;
				requestStuckSessionRecovery({
					recover: opts?.recoverStuckSession ?? recoverStuckSession,
					classification: recovery.classification,
					request: {
						...observation,
						ageMs: attentionAgeMs,
						...recovery.allowActiveAbort ? { allowActiveAbort: true } : { staleActiveProgressAbortMs: stuckSessionAbortMs },
						...recovery.classification.reason === "repeated_model_requests_without_progress" ? { repeatedRequestNoProgressAbortMs: stuckSessionAbortMs } : {},
						compactionSafetyTimeoutMs
					}
				});
			}
		}
	};
	const job = scheduler.schedule({
		id: "diagnostic-heartbeat",
		atMs: scheduler.now() + DIAGNOSTIC_HEARTBEAT_INTERVAL_MS,
		everyMs: DIAGNOSTIC_HEARTBEAT_INTERVAL_MS,
		run: tick
	});
	heartbeatJob = job;
	const stopOwnedHeartbeat = () => {
		if (heartbeatJob === job) stopGatewayDiagnosticHeartbeat();
	};
	scheduler.signal.addEventListener("abort", stopOwnedHeartbeat, { once: true });
	detachHeartbeatOwner = () => scheduler.signal.removeEventListener("abort", stopOwnedHeartbeat);
	if (scheduler.signal.aborted) stopOwnedHeartbeat();
}
function stopGatewayDiagnosticHeartbeat() {
	detachHeartbeatOwner?.();
	detachHeartbeatOwner = void 0;
	retireSessionDiagnosticLogs();
	stopDiagnosticGcObserver();
	heartbeatJob?.cancel();
	heartbeatJob = void 0;
	lastDiagnosticHeartbeatTickAt = void 0;
	stopDiagnosticRunActivityTracking();
	retireDiagnosticSessionObservations();
	stopDiagnosticLivenessSampler();
	stopDiagnosticStabilityRecorder();
	uninstallDiagnosticStabilityFatalHook();
}
function resetDiagnosticStateForTest() {
	stopGatewayDiagnosticHeartbeat();
	resetDiagnosticSessionRecoveryCoordinatorForTest();
	resetDiagnosticSessionStateForTest();
	resetDiagnosticActivityForTest();
	resetDiagnosticRunActivityForTest();
	webhookStats.received = 0;
	webhookStats.processed = 0;
	webhookStats.errors = 0;
	resetDiagnosticMemoryForTest();
	resetDiagnosticPhasesForTest();
	resetDiagnosticStabilityRecorderForTest();
}
const testing = {
	resetDiagnosticStateForTest,
	resolveStuckSessionAbortMs,
	resolveStuckSessionWarnMs
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.diagnosticTestApi")] = testing;
//#endregion
export { isRepeatedModelRequestStalled as _, logMessageReceived as a, resolveCompactionTimeoutMs as b, logWebhookError as c, markDiagnosticSessionProgress as d, startGatewayDiagnosticHeartbeat as f, logWithSessionDiagnosticContext as g, resolveStuckSessionRecoveryRef as h, logMessageQueued as i, logWebhookProcessed as l, formatRecoveryOutcome as m, logMessageDispatchStarted as n, logSessionStateChange as o, stopGatewayDiagnosticHeartbeat as p, logMessageProcessed as r, logSessionTurnCreated as s, logMessageDispatchCompleted as t, logWebhookReceived as u, compactContextEngineWithSafetyTimeout as v, compactWithSafetyTimeout as y };
