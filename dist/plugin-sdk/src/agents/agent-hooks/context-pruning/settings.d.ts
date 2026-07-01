/** Allow/deny glob config for tool-result pruning. */
export type ContextPruningToolMatch = {
    allow?: string[];
    deny?: string[];
};
type ContextPruningMode = "off" | "cache-ttl";
/** Fully normalized context-pruning settings used at runtime. */
export type EffectiveContextPruningSettings = {
    mode: Exclude<ContextPruningMode, "off">;
    ttlMs: number;
    keepLastAssistants: number;
    softTrimRatio: number;
    hardClearRatio: number;
    minPrunableToolChars: number;
    tools: ContextPruningToolMatch;
    softTrim: {
        maxChars: number;
        headChars: number;
        tailChars: number;
    };
    hardClear: {
        enabled: boolean;
        placeholder: string;
    };
};
export declare const DEFAULT_CONTEXT_PRUNING_SETTINGS: EffectiveContextPruningSettings;
/** Computes effective pruning settings, returning null when pruning is disabled or invalid. */
export declare function computeEffectiveSettings(raw: unknown): EffectiveContextPruningSettings | null;
export {};
