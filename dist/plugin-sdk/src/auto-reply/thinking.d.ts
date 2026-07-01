import type { ThinkLevel, ThinkingCatalogEntry } from "./thinking.shared.js";
export { isSessionDefaultDirectiveValue, normalizeElevatedLevel, normalizeFastMode, normalizeReasoningLevel, normalizeTraceLevel, normalizeThinkLevel, normalizeUsageDisplay, normalizeVerboseLevel, resolveResponseUsageMode, } from "./thinking.shared.js";
export type { ElevatedLevel, FastMode, NoticeLevel, ReasoningLevel, TraceLevel, ThinkLevel, ThinkingCatalogEntry, VerboseLevel, } from "./thinking.shared.js";
/** UI-facing thinking level option. */
export type ThinkingLevelOption = {
    id: ThinkLevel;
    label: string;
};
type RankedThinkingLevelOption = ThinkingLevelOption & {
    rank: number;
};
type ResolvedThinkingProfile = {
    levels: RankedThinkingLevelOption[];
    defaultLevel?: ThinkLevel | null;
};
/** Resolve supported thinking levels and default for a provider/model pair. */
export declare function resolveThinkingProfile(params: {
    provider?: string | null;
    model?: string | null;
    catalog?: ThinkingCatalogEntry[];
}): ResolvedThinkingProfile;
/** List thinking level ids supported by provider/model. */
export declare function listThinkingLevels(provider?: string | null, model?: string | null, catalog?: ThinkingCatalogEntry[]): ThinkLevel[];
/** List labeled thinking level options supported by provider/model. */
export declare function listThinkingLevelOptions(provider?: string | null, model?: string | null, catalog?: ThinkingCatalogEntry[]): ThinkingLevelOption[];
/** List display labels for thinking levels supported by provider/model. */
export declare function listThinkingLevelLabels(provider?: string | null, model?: string | null, catalog?: ThinkingCatalogEntry[]): string[];
/** Format supported thinking level labels for command/status output. */
export declare function formatThinkingLevels(provider?: string | null, model?: string | null, separator?: string, catalog?: ThinkingCatalogEntry[]): string;
/** Resolve the default thinking level for a provider/model pair. */
export declare function resolveThinkingDefaultForModel(params: {
    provider: string;
    model: string;
    catalog?: ThinkingCatalogEntry[];
}): ThinkLevel;
/** Return whether a specific thinking level is supported by provider/model. */
export declare function isThinkingLevelSupported(params: {
    provider?: string | null;
    model?: string | null;
    level: ThinkLevel;
    catalog?: ThinkingCatalogEntry[];
}): boolean;
/** Clamp a requested thinking level to the closest supported provider/model level. */
export declare function resolveSupportedThinkingLevel(params: {
    provider?: string | null;
    model?: string | null;
    level: ThinkLevel;
    catalog?: ThinkingCatalogEntry[];
}): ThinkLevel;
