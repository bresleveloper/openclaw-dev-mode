import { n as serveWorkerTasks } from "../worker-task-server-CwtaNZgU.mjs";
import { c as buildSummaryChunks, l as computeAdaptiveChunkRatio, o as buildOversizedFallbackPlan, s as buildStageSplitPlan } from "../compaction-planning-Cn8w0Co8.mjs";
//#region src/agents/compaction-planning.worker.ts
/**
* Worker-thread entrypoint for serializable compaction planning requests.
*/
function isWorkerInput(value) {
	if (!value || typeof value !== "object" || !("kind" in value)) return false;
	const input = value;
	if (!Array.isArray(input.messages)) return false;
	switch (input.kind) {
		case "summaryChunks":
		case "stageSplit": return typeof input.maxChunkTokens === "number" && Number.isFinite(input.maxChunkTokens);
		case "oversizedFallback":
		case "adaptiveChunkRatio": return typeof input.contextWindow === "number" && Number.isFinite(input.contextWindow);
		default: return false;
	}
}
function createMessageIndexer(source) {
	const indexByMessage = new Map(source.map((message, index) => [message, index]));
	return (selected) => selected.map((message) => {
		const index = indexByMessage.get(message);
		if (index === void 0) throw new Error("Compaction planning result contains an unknown message");
		return index;
	});
}
/** Run one compaction planning request and return a serializable value. */
function runCompactionPlanningWorkerInput(input) {
	if (!isWorkerInput(input)) throw new Error("invalid compaction planning worker input");
	switch (input.kind) {
		case "summaryChunks": return {
			kind: input.kind,
			chunkIndexes: buildSummaryChunks(input).map(createMessageIndexer(input.messages))
		};
		case "oversizedFallback": {
			const plan = buildOversizedFallbackPlan(input);
			return {
				kind: input.kind,
				smallMessageIndexes: createMessageIndexer(input.messages)(plan.smallMessages),
				oversizedNotes: plan.oversizedNotes
			};
		}
		case "stageSplit": {
			const plan = buildStageSplitPlan(input);
			return plan.mode === "split" ? {
				kind: input.kind,
				mode: "split",
				chunkIndexes: plan.chunks.map(createMessageIndexer(input.messages))
			} : {
				kind: input.kind,
				mode: "single"
			};
		}
		case "adaptiveChunkRatio": return {
			kind: input.kind,
			ratio: computeAdaptiveChunkRatio(input.messages, input.contextWindow)
		};
	}
	throw new Error("unsupported compaction planning worker input");
}
serveWorkerTasks(runCompactionPlanningWorkerInput);
//#endregion
export { runCompactionPlanningWorkerInput };
