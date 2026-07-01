export { resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeNativeThinkingLevelMap, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, } from "@openclaw/llm-core";
type ReplayModelRef = {
    provider?: string;
    api?: string;
    modelId?: string;
    responseModelId?: string;
    modelParams?: Record<string, unknown>;
};
export declare function usesClaudeFable5MessagesContract(model: {
    id?: string;
    params?: Record<string, unknown>;
    api?: string;
}): boolean;
export declare function requiresClaudeAdaptiveThinking(model: {
    id?: string;
    params?: Record<string, unknown>;
    api?: string;
}): boolean;
export declare function resolveModelBoundThinkingReplayMode(params: {
    source: ReplayModelRef;
    target: ReplayModelRef;
}): "default" | "preserve" | "drop";
