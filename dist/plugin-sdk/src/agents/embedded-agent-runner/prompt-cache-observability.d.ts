import type { NormalizedUsage } from "../usage.js";
type PromptCacheChangeCode = "cacheRetention" | "model" | "streamStrategy" | "systemPrompt" | "tools" | "transport";
export type PromptCacheChange = {
    code: PromptCacheChangeCode;
    detail: string;
};
type PromptCacheSnapshot = {
    provider: string;
    modelId: string;
    modelApi?: string | null;
    cacheRetention?: "none" | "short" | "long";
    streamStrategy: string;
    transport?: string;
    systemPromptDigest: string;
    toolDigest: string;
    toolCount: number;
    toolNames: string[];
};
type PromptCacheObservationStart = {
    snapshot: PromptCacheSnapshot;
    changes: PromptCacheChange[] | null;
    previousCacheRead: number | null;
};
export type PromptCacheBreak = {
    previousCacheRead: number;
    cacheRead: number;
    changes: PromptCacheChange[] | null;
};
export declare function collectPromptCacheToolNames(tools: readonly {
    name?: string;
}[]): string[];
export declare function beginPromptCacheObservation(params: {
    sessionId: string;
    promptCacheKey?: string;
    sessionKey?: string;
    provider: string;
    modelId: string;
    modelApi?: string | null;
    cacheRetention?: "none" | "short" | "long";
    streamStrategy: string;
    transport?: string;
    systemPrompt: string;
    toolNames: string[];
}): PromptCacheObservationStart;
export declare function completePromptCacheObservation(params: {
    sessionId: string;
    promptCacheKey?: string;
    sessionKey?: string;
    usage?: NormalizedUsage;
}): PromptCacheBreak | null;
export declare function resetPromptCacheObservabilityForTest(): void;
export {};
