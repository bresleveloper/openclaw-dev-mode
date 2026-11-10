import { PerformanceObserver, constants, performance } from "node:perf_hooks";
//#region src/infra/gc-observer.ts
const kinds = {
	[constants.NODE_PERFORMANCE_GC_MINOR]: "scavenge",
	[constants.NODE_PERFORMANCE_GC_MAJOR]: "mark_sweep_compact",
	[constants.NODE_PERFORMANCE_GC_INCREMENTAL]: "incremental",
	[constants.NODE_PERFORMANCE_GC_WEAKCB]: "weak_processing"
};
/** One observer per isolate owner; native batches travel together on worker ports. */
function observeGcSamples(publish) {
	if (!PerformanceObserver.supportedEntryTypes.includes("gc")) return;
	const activatedAt = performance.now();
	let active = true;
	const observer = new PerformanceObserver((list) => {
		if (!active) return;
		const samples = [];
		for (const entry of list.getEntries()) {
			const kind = kinds[entry.detail.kind];
			if (kind && entry.startTime >= activatedAt) samples.push({
				kind,
				durationMs: entry.duration
			});
		}
		if (samples.length) publish(samples);
	});
	observer.observe({ entryTypes: ["gc"] });
	return () => {
		active = false;
		observer.disconnect();
	};
}
//#endregion
export { observeGcSamples as t };
