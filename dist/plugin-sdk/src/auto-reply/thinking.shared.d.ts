/** Shared normalization for thinking, verbosity, tracing, reasoning, and usage directives. */
import { type FastMode, normalizeFastMode } from "../../packages/normalization-core/src/string-coerce.js";
export { normalizeFastMode };
export type { FastMode };
/** Canonical thinking level values accepted by chat commands and session state. */
export type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
export type VerboseLevel = "off" | "on" | "full";
export type TraceLevel = "off" | "on" | "raw";
export type NoticeLevel = "off" | "on" | "full";
export type ElevatedLevel = "off" | "on" | "ask" | "full";
export type ReasoningLevel = "off" | "on" | "stream";
type UsageDisplayLevel = "off" | "tokens" | "full";
/** Minimal model catalog entry needed to choose thinking defaults. */
export type ThinkingCatalogEntry = {
    provider: string;
    id: string;
    api?: string;
    reasoning?: boolean;
    params?: Record<string, unknown>;
    compat?: {
        thinkingFormat?: string;
        supportedReasoningEfforts?: readonly string[] | null;
    } | null;
};
export declare const BASE_THINKING_LEVELS: ThinkLevel[];
export declare const THINKING_LEVEL_RANKS: Record<ThinkLevel, number>;
/** Normalizes user-provided thinking level strings to the canonical enum. */
export declare function normalizeThinkLevel(raw?: string | null): ThinkLevel | undefined;
/** Returns true for command values that clear an inherited session override. */
export declare function isSessionDefaultDirectiveValue(raw?: string | null): boolean;
/** Chooses the default thinking level for one provider/model catalog entry. */
export declare function resolveThinkingDefaultForModel(params: {
    provider: string;
    model: string;
    catalog?: ThinkingCatalogEntry[];
}): ThinkLevel;
/** Normalizes /verbose values. */
export declare function normalizeVerboseLevel(raw?: string | null): VerboseLevel | undefined;
/** Normalizes /trace values. */
export declare function normalizeTraceLevel(raw?: string | null): TraceLevel | undefined;
/** Normalizes response usage display values. */
export declare function normalizeUsageDisplay(raw?: string | null): UsageDisplayLevel | undefined;
/** Resolves response usage display mode with the persisted default. */
export declare function resolveResponseUsageMode(raw?: string | null): UsageDisplayLevel;
/** Normalizes elevated execution policy values. */
export declare function normalizeElevatedLevel(raw?: string | null): ElevatedLevel | undefined;
/** Normalizes reasoning visibility values. */
export declare function normalizeReasoningLevel(raw?: string | null): ReasoningLevel | undefined;
