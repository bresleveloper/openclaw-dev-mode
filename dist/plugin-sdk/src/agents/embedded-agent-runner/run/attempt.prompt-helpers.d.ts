/**
 * Builds and repairs prompt inputs for embedded-agent attempts.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { ContextEnginePromptCacheInfo, ContextEngineRuntimeContext } from "../../../context-engine/types.js";
import type { PluginAgentTurnPrepareResult, PluginNextTurnInjectionRecord, PluginHookAgentContext, PluginHookBeforeAgentStartResult, PluginHookBeforePromptBuildResult } from "../../../plugins/types.js";
import { type NormalizedUsage } from "../../usage.js";
import type { EmbeddedRunAttemptParams } from "./types.js";
type PromptBuildHookRunner = {
    hasHooks: (hookName: "agent_turn_prepare" | "heartbeat_prompt_contribution" | "before_prompt_build" | "before_agent_start") => boolean;
    runAgentTurnPrepare?: (event: {
        prompt: string;
        messages: unknown[];
        queuedInjections: PluginNextTurnInjectionRecord[];
    }, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | undefined>;
    runHeartbeatPromptContribution?: (event: {
        sessionKey?: string;
        agentId?: string;
        heartbeatName?: string;
    }, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | undefined>;
    runBeforePromptBuild: (event: {
        prompt: string;
        messages: unknown[];
    }, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
    runBeforeAgentStart: (event: {
        prompt: string;
        messages: unknown[];
    }, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentStartResult | undefined>;
};
/**
 * Releases the per-run drained-injection cache. Call when a run terminates so
 * the cap stays headroom for active runs.
 */
export declare function forgetPromptBuildDrainCacheForRun(runId: string | undefined): void;
/**
 * Resolves prompt-build hook contributions for one attempt. Next-turn
 * injections are drained once per run and cached for retries so destructive
 * session-store reads do not lose plugin context after a failed first attempt.
 */
export declare function resolvePromptBuildHookResult(params: {
    config: OpenClawConfig;
    prompt: string;
    messages: unknown[];
    hookCtx: PluginHookAgentContext;
    hookRunner?: PromptBuildHookRunner | null;
    beforeAgentStartResult?: PluginHookBeforeAgentStartResult;
}): Promise<PluginHookBeforePromptBuildResult>;
export declare function resolvePromptModeForSession(sessionKey?: string): "minimal" | "full";
/**
 * Determines whether the default agent's heartbeat run should include the
 * heartbeat prompt contribution. Non-default agents and non-heartbeat triggers
 * keep their normal prompt shape.
 */
export declare function shouldInjectHeartbeatPrompt(params: {
    config?: OpenClawConfig;
    agentId?: string;
    defaultAgentId?: string;
    isDefaultAgent: boolean;
    trigger?: EmbeddedRunAttemptParams["trigger"];
}): boolean;
/** User-visible runs warn when transcript repair had to merge an orphaned user turn. */
export declare function shouldWarnOnOrphanedUserRepair(trigger: EmbeddedRunAttemptParams["trigger"]): boolean;
type PromptSubmissionSkipReason = "blank_user_prompt" | "empty_prompt_history_images";
/**
 * Distinguishes a truly empty prompt/history from a blank follow-up in a visible
 * conversation. This lets callers skip model submission while reporting the
 * reason accurately.
 */
export declare function resolvePromptSubmissionSkipReason(params: {
    prompt: string;
    messages: readonly unknown[];
    imageCount: number;
    runtimeOnly?: boolean;
}): PromptSubmissionSkipReason | null;
/**
 * Merges a trailing user message that was queued in transcript history but not
 * present in the active prompt. The leaf is removed whether merged or already
 * present so the transcript cannot submit the same user turn twice.
 */
export declare function mergeOrphanedTrailingUserPrompt(params: {
    prompt: string;
    trigger: EmbeddedRunAttemptParams["trigger"];
    leafMessage: {
        content?: unknown;
    };
}): {
    prompt: string;
    merged: boolean;
    removeLeaf: boolean;
};
export declare function resolveAttemptFsWorkspaceOnly(params: {
    config?: OpenClawConfig;
    sessionAgentId: string;
}): boolean;
export declare function prependSystemPromptAddition(params: {
    systemPrompt: string;
    systemPromptAddition?: string;
}): string;
export declare function resolveAttemptMediaTaskSystemPromptAddition(params: {
    sessionKey?: string;
    trigger?: EmbeddedRunAttemptParams["trigger"];
}): string | undefined;
type AfterTurnRuntimeContextAttempt = Pick<EmbeddedRunAttemptParams, "sessionKey" | "sandboxSessionKey" | "messageChannel" | "messageProvider" | "agentAccountId" | "currentChannelId" | "currentThreadTs" | "currentMessageId" | "config" | "skillsSnapshot" | "senderId" | "provider" | "modelId" | "agentHarnessId" | "thinkLevel" | "reasoningLevel" | "bashElevated" | "extraSystemPrompt" | "ownerNumbers" | "authProfileId"> & {
    sessionId?: EmbeddedRunAttemptParams["sessionId"];
};
/** Build runtime context passed into context-engine afterTurn hooks. */
export declare function buildAfterTurnRuntimeContext(params: {
    attempt: AfterTurnRuntimeContextAttempt;
    workspaceDir: string;
    cwd?: string;
    agentDir: string;
    activeAgentId?: string;
    contextEnginePluginId?: string;
    tokenBudget?: number;
    currentTokenCount?: number;
    promptCache?: ContextEnginePromptCacheInfo;
}): ContextEngineRuntimeContext;
export declare function buildAfterTurnRuntimeContextFromUsage(params: Omit<Parameters<typeof buildAfterTurnRuntimeContext>[0], "currentTokenCount"> & {
    lastCallUsage?: NormalizedUsage;
}): ContextEngineRuntimeContext;
export {};
