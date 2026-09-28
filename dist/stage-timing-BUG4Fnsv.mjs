//#region src/shared/stage-timing.ts
/** Records checkpoints and explicit spans without owning logging policy. */
function createStageTimingTracker(now = () => Date.now()) {
	const startedAt = now();
	let previousAt = startedAt;
	const stages = [];
	const toMs = (value) => Math.max(0, Math.round(value));
	const record = (name, spanStartedAt) => {
		const currentAt = now();
		stages.push({
			name,
			durationMs: toMs(currentAt - spanStartedAt),
			elapsedMs: toMs(currentAt - startedAt)
		});
		return currentAt;
	};
	return {
		mark: (name) => {
			previousAt = record(name, previousAt);
		},
		measure: async (name, run) => {
			const spanStartedAt = now();
			try {
				return await run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		measureSync: (name, run) => {
			const spanStartedAt = now();
			try {
				return run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		snapshot: () => {
			return {
				totalMs: toMs(now() - startedAt),
				stages: stages.slice()
			};
		}
	};
}
/** Formats timing entries without choosing the caller's prefix or field label. */
function formatStageTimings(stages) {
	return stages.length > 0 ? stages.map((stage) => `${stage.name}:${stage.durationMs}ms@${stage.elapsedMs}ms`).join(",") : "none";
}
//#endregion
export { formatStageTimings as n, createStageTimingTracker as t };
