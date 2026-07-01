import type { Model, SimpleStreamOptions, StreamOptions, ThinkingBudgets, ThinkingLevel } from "../types.js";
export declare function buildBaseOptions(model: Model, options?: SimpleStreamOptions, apiKey?: string): StreamOptions;
export declare function clampReasoning(effort: ThinkingLevel | undefined): Exclude<ThinkingLevel, "xhigh"> | undefined;
export declare function adjustMaxTokensForThinking(baseMaxTokens: number | undefined, modelMaxTokens: number, reasoningLevel: ThinkingLevel, customBudgets?: ThinkingBudgets): {
    maxTokens: number;
    thinkingBudget: number;
};
