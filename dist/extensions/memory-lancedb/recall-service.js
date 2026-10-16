import { MemoryRecallEmbeddingError, runWithTimeout } from "./embeddings.js";
//#region extensions/memory-lancedb/recall-service.ts
/** Run embedding and search under one deadline; callers retain cooldown and result policy. */
function startMemoryRecall(params) {
	let phase = "embedding";
	return {
		result: runWithTimeout({
			timeoutMs: params.timeoutMs,
			task: async (deadlineAtMs) => {
				let vector;
				try {
					vector = await params.embed(() => Math.max(1, deadlineAtMs - Date.now()));
				} catch (error) {
					throw new MemoryRecallEmbeddingError(error);
				}
				params.beforeSearch?.();
				phase = "search";
				return await params.search(vector, Math.max(0, deadlineAtMs - Date.now()));
			}
		}),
		get phase() {
			return phase;
		}
	};
}
//#endregion
export { startMemoryRecall };
