export { formatDurationCompact } from "../infra/format-time/format-duration.ts";
/** Formats token counts using compact k/m suffixes for subagent summaries. */
export declare function formatTokenShort(value?: number): string | undefined;
/** Truncates a single-line display string without preserving trailing whitespace. */
export declare function truncateLine(value: string, maxLength: number): string;
type TokenUsageLike = {
    totalTokens?: unknown;
    inputTokens?: unknown;
    outputTokens?: unknown;
};
/** Resolves total token usage, falling back to input+output when no explicit total exists. */
export declare function resolveTotalTokens(entry?: TokenUsageLike): number | undefined;
/** Resolves finite input/output token usage and the derived total. */
export declare function resolveIoTokens(entry?: TokenUsageLike): {
    input: number;
    output: number;
    total: number;
} | undefined;
/** Formats token usage for compact subagent list/detail displays. */
export declare function formatTokenUsageDisplay(entry?: TokenUsageLike): string;
