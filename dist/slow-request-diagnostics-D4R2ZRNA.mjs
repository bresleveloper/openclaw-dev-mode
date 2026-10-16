import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/slow-request-diagnostics.ts
const SLOW_GATEWAY_REQUEST_MS = 1e3;
/** The router owns the lifetime so preparation waits are included before handler entry. */
function startSlowRequestDiagnostics(log, message, operation, initialPhase) {
	if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return;
	let checkpoint = performance.now();
	const startedAt = checkpoint;
	const timing = createStageTimingTracker(() => checkpoint);
	const trace = getActiveDiagnosticTraceContext();
	let phase = initialPhase;
	const mark = (next) => {
		checkpoint = performance.now();
		timing.mark(phase);
		phase = next;
	};
	return {
		mark,
		[Symbol.dispose]() {
			mark(phase);
			const elapsedMs = checkpoint - startedAt;
			if (elapsedMs < 1e3 || !areDiagnosticsEnabledForProcess()) return;
			try {
				const phaseDurationsMs = {};
				for (const stage of timing.snapshot().stages) phaseDurationsMs[stage.name] = (phaseDurationsMs[stage.name] ?? 0) + stage.durationMs;
				runWithDiagnosticTraceContext(trace, () => log.warn(message, {
					operation,
					elapsedMs: Math.round(elapsedMs),
					phaseDurationsMs
				}));
			} catch {}
		}
	};
}
//#endregion
export { startSlowRequestDiagnostics as n, SLOW_GATEWAY_REQUEST_MS as t };
