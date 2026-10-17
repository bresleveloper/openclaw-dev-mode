import { d as joinPresentTextSegments } from "./hooks-ADSXph0M.mjs";
import { h as serializeCacheTtlToolResultProjections, o as hashToolResultProjectionSnapshot } from "./session-prompt-state-CQINGzpX.mjs";
import { normalizeStructuredPromptSection } from "@openclaw/ai/internal/shared";
//#region src/agents/embedded-agent-runner/run/attempt-thread-helpers.ts
/** Custom transcript marker used to preserve cache-TTL pruning state across attempts. */
const ATTEMPT_CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
/**
* Combines hook-provided system context with the base prompt while preserving
* stable structured-section bytes. Returning undefined when hooks add nothing
* lets callers avoid rewriting the original prompt.
*/
function composeSystemPromptWithHookContext(params) {
	const prependSystem = typeof params.prependSystemContext === "string" ? normalizeStructuredPromptSection(params.prependSystemContext) : "";
	const appendSystem = typeof params.appendSystemContext === "string" ? normalizeStructuredPromptSection(params.appendSystemContext) : "";
	if (!prependSystem && !appendSystem) return;
	return joinPresentTextSegments([
		prependSystem,
		params.baseSystemPrompt,
		appendSystem
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
	const snapshot = serializeCacheTtlToolResultProjections(params.toolResultPromptProjectionState);
	const hash = hashToolResultProjectionSnapshot(snapshot);
	await params.sessionManager.appendCustomEntryAsync(ATTEMPT_CACHE_TTL_CUSTOM_TYPE, {
		timestamp: params.now ?? Date.now(),
		provider: params.provider,
		modelId: params.modelId,
		...hash !== params.toolResultPromptProjectionState.lastWrittenSnapshotHash ? snapshot : {}
	});
	params.toolResultPromptProjectionState.lastWrittenSnapshotHash = hash;
	return true;
}
//#endregion
export { composeSystemPromptWithHookContext as n, resolveAttemptSpawnWorkspaceDir as r, appendAttemptCacheTtlIfNeeded as t };
