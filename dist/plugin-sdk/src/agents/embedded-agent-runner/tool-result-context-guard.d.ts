/**
 * Installs context guards for oversized tool-result histories.
 */
import type { ContextEngine, ContextEngineRuntimeContext, ContextEngineRuntimeSettings } from "../../context-engine/types.js";
import type { AgentMessage } from "../runtime/index.js";
import { type MidTurnPrecheckRequest } from "./run/midturn-precheck.js";
export declare const PREEMPTIVE_CONTEXT_OVERFLOW_MESSAGE = "Context overflow: estimated context size exceeds safe threshold during tool loop.";
type GuardableAgent = object;
type MidTurnPrecheckOptions = {
    enabled?: boolean;
    contextTokenBudget: number;
    reserveTokens: () => number;
    toolResultMaxChars?: number;
    getSystemPrompt?: () => string | undefined;
    getPrePromptMessageCount?: () => number;
    onMidTurnPrecheck?: (request: MidTurnPrecheckRequest) => void;
};
export { CONTEXT_LIMIT_TRUNCATION_NOTICE, formatContextLimitTruncationNotice, } from "./context-truncation-notice.js";
export declare function markTranscriptPromptText(message: AgentMessage, text: string): void;
/**
 * Per-iteration `afterTurn` + `assemble` wrapper for sessions where
 * the context engine owns compaction. Lets the engine compact inside
 * a long tool loop instead of only at end of attempt.
 */
export declare function installContextEngineLoopHook(params: {
    agent: GuardableAgent;
    contextEngine: ContextEngine;
    sessionId: string;
    sessionKey?: string;
    sessionFile: string;
    tokenBudget?: number;
    modelId: string;
    repairAssembledMessages?: (messages: AgentMessage[]) => AgentMessage[];
    getPrePromptMessageCount?: () => number;
    onAfterTurnCheckpoint?: (messageCount: number) => void;
    getRuntimeContext?: (params: {
        messages: AgentMessage[];
        prePromptMessageCount: number;
    }) => ContextEngineRuntimeContext | undefined;
    runtimeSettings?: ContextEngineRuntimeSettings;
    /** True when this turn belongs to a heartbeat run. */
    isHeartbeat?: boolean;
}): () => void;
export declare function installToolResultContextGuard(params: {
    agent: GuardableAgent;
    contextWindowTokens: number;
    midTurnPrecheck?: MidTurnPrecheckOptions;
}): () => void;
