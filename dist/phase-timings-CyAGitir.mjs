import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/phase-timings.ts
/** Request-local totals; overlapping scopes contribute independently. */
function createPhaseTimings() {
	const totals = /* @__PURE__ */ new Map();
	const active = /* @__PURE__ */ new Set();
	return {
		totals,
		flush(now) {
			for (const record of active) record(now);
		},
		close() {
			active.clear();
		},
		scope(initialPhase) {
			let phase = initialPhase;
			let startedAt = performance.now();
			const record = (now) => {
				if (phase) totals.set(phase, (totals.get(phase) ?? 0) + now - startedAt);
				startedAt = now;
			};
			active.add(record);
			const scope = {
				mark(next) {
					if (active.has(record)) {
						record(performance.now());
						phase = next;
					}
				},
				finish() {
					scope.mark();
					active.delete(record);
				},
				[Symbol.dispose]() {
					scope.finish();
				}
			};
			return scope;
		}
	};
}
//#endregion
export { createPhaseTimings as t };
