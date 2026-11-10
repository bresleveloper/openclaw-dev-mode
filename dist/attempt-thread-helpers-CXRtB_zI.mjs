import { d as joinPresentTextSegments } from "./hooks-CU2qx9-T.mjs";
import { o as persistToolResultProjections } from "./session-prompt-state-tij27tsD.mjs";
//#region src/agents/embedded-agent-runner/run/attempt-thread-helpers.ts
/** Combines already-normalized hook sections without rewriting an unchanged prompt. */
function composeSystemPromptWithHookContext(params) {
	if (!params.prependSystemContext && !params.appendSystemContext) return;
	return joinPresentTextSegments([
		params.prependSystemContext,
		params.baseSystemPrompt,
		params.appendSystemContext
	], { trim: true });
}
/**
* Returns the workspace path that must be mounted for sandboxed spawn attempts.
* Read-only sandbox modes need the resolved workspace explicitly; full rw
* access uses the normal workspace wiring.
*/
function resolveAttemptSpawnWorkspaceDir(params) {
	return params.sandbox?.enabled && params.sandbox.workspaceAccess !== "rw" ? params.resolvedWorkspace : void 0;
}
/**
* Appends the cache-TTL transcript marker when context-pruning policy and model
* eligibility both allow it. The boolean result tells callers whether the
* session transcript changed.
*/
async function appendAttemptCacheTtlIfNeeded(params) {
	if (params.timedOutDuringCompaction || params.compactionOccurredThisAttempt || params.config?.agents?.defaults?.contextPruning?.mode !== "cache-ttl" || !params.isCacheTtlEligibleProvider(params.provider, params.modelId, params.modelApi, params.modelRoute)) return false;
	await persistToolResultProjections(params.toolResultPromptProjectionState, (customType, data) => params.sessionManager.appendCustomEntryAsync(customType, data), {
		timestamp: params.now ?? Date.now(),
		provider: params.provider,
		modelId: params.modelId
	});
	return true;
}
//#endregion
export { composeSystemPromptWithHookContext as n, resolveAttemptSpawnWorkspaceDir as r, appendAttemptCacheTtlIfNeeded as t };
