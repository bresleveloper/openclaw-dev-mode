import { MemoryRecallEmbeddingError, isMemoryRecallTimeoutError } from "./embeddings.js";
import { dropMediaNoteLines } from "./memory-capture-sanitization.js";
import { cleanMemorySearchResults, formatRelevantMemoriesContext, normalizeRecallQuery } from "./memory-policy.js";
import { startMemoryRecall } from "./recall-service.js";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/memory-lancedb/auto-recall.ts
const AUTO_RECALL_TIMEOUT_MS = 15e3;
const AUTO_RECALL_OVERFETCH_LIMIT = 10;
const AUTO_RECALL_RESULT_CAP = 3;
function createAutoRecallHook(params) {
	return async (event, ctx) => {
		const currentCfg = params.resolveCurrentConfig();
		const recallMaxChars = currentCfg.recallMaxChars;
		if (!currentCfg.autoRecall) return;
		const toolAuthority = ctx.toolAuthority;
		if (!toolAuthority) {
			params.logger.debug?.("memory-lancedb: auto-recall skipped because this prompt has no turn tool authority");
			return;
		}
		toolAuthority.assertActive();
		if (!toolAuthority.allows("memory_recall")) {
			params.logger.debug?.("memory-lancedb: auto-recall skipped by turn tool policy");
			return;
		}
		const agentId = params.resolveEnabledAgentId(ctx.agentId);
		if (!agentId || !event.prompt || event.prompt.length < 5) return;
		const cooldown = params.readCooldown(agentId);
		if (cooldown) {
			params.logger.debug?.(`memory-lancedb: auto-recall skipped during recall cooldown: ${cooldown.error}`);
			return;
		}
		try {
			const recallQuery = normalizeRecallQuery(dropMediaNoteLines(event.prompt), recallMaxChars);
			if (!recallQuery) return;
			toolAuthority.assertActive();
			const recallOperation = startMemoryRecall({
				timeoutMs: AUTO_RECALL_TIMEOUT_MS,
				embed: (timeoutMs) => params.embeddings.embed(agentId, recallQuery, currentCfg.embedding, timeoutMs()),
				beforeSearch: () => toolAuthority.assertActive(),
				search: (vector, timeoutMs) => params.db.search(agentId, vector, AUTO_RECALL_OVERFETCH_LIMIT, .3, { timeoutMs })
			});
			const recall = await recallOperation.result;
			toolAuthority.assertActive();
			if (recall.status === "timeout") {
				if (recallOperation.phase === "embedding") params.recordCooldown(agentId, `auto-recall timed out after ${Math.round(AUTO_RECALL_TIMEOUT_MS / 1e3)}s`);
				params.logger.warn?.(`memory-lancedb: auto-recall timed out after ${AUTO_RECALL_TIMEOUT_MS}ms; skipping memory injection to avoid stalling agent startup`);
				return;
			}
			const cleanResults = cleanMemorySearchResults(recall.value).map(({ entry }) => entry).slice(0, AUTO_RECALL_RESULT_CAP);
			if (cleanResults.length === 0) return;
			params.logger.info?.(`memory-lancedb: injecting ${cleanResults.length} memories into context`);
			const context = formatRelevantMemoriesContext(cleanResults, recallMaxChars);
			return context ? { prependContext: context } : void 0;
		} catch (err) {
			if (err instanceof MemoryRecallEmbeddingError && isMemoryRecallTimeoutError(err.originalError)) params.recordCooldown(agentId, formatErrorMessage(err.originalError));
			params.logger.warn(`memory-lancedb: recall failed: ${String(err)}`);
			return;
		}
	};
}
//#endregion
export { createAutoRecallHook };
