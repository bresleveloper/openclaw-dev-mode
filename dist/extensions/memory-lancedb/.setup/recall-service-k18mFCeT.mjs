import { a as runWithTimeout, t as MemoryRecallEmbeddingError } from "./embeddings-CA5O6Qvd.mjs";
// extensions/memory-lancedb/recall-service.ts
/** Run embedding and search under one deadline; callers retain cooldown and result policy. */
function startMemoryRecall(params) {
	let phase = "embedding";
	return {
		result: runWithTimeout({
			timeoutMs: params.timeoutMs,
			task: async (deadlineAtMs) => {
				let vector;
				try {
					vector = await params.embed(() => Math.max(1, Math.floor(deadlineAtMs - performance.now())));
				} catch (error) {
					throw new MemoryRecallEmbeddingError(error);
				}
				params.beforeSearch?.();
				phase = "search";
				return await params.search(vector, Math.max(0, Math.floor(deadlineAtMs - performance.now())));
			}
		}),
		get phase() {
			return phase;
		}
	};
}
export { startMemoryRecall as t };
