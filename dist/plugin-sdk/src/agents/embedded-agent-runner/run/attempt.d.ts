import { resetEmbeddedAgentBaseStreamFnCacheForTest, resolveEmbeddedAgentBaseStreamFn, resolveEmbeddedAgentStreamFn } from "../stream-resolution.js";
import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "./types.js";
export { appendAttemptCacheTtlIfNeeded, composeSystemPromptWithHookContext, resolveAttemptSpawnWorkspaceDir, } from "./attempt.thread-helpers.js";
export { buildAfterTurnRuntimeContext, buildAfterTurnRuntimeContextFromUsage, mergeOrphanedTrailingUserPrompt, prependSystemPromptAddition, resolveAttemptFsWorkspaceOnly, resolveAttemptMediaTaskSystemPromptAddition, resolvePromptBuildHookResult, resolvePromptModeForSession, shouldWarnOnOrphanedUserRepair, } from "./attempt.prompt-helpers.js";
export { resetEmbeddedAgentBaseStreamFnCacheForTest, resolveEmbeddedAgentBaseStreamFn, resolveEmbeddedAgentStreamFn, };
export declare function runEmbeddedAttempt(params: EmbeddedRunAttemptParams): Promise<EmbeddedRunAttemptResult>;
