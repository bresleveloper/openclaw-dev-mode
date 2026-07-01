import type { ProviderUsageSnapshot, UsageSummary } from "./provider-usage.types.js";
/** Formats one provider snapshot into a short usage-window summary. */
export declare function formatUsageWindowSummary(snapshot: ProviderUsageSnapshot, opts?: {
    now?: number;
    maxWindows?: number;
    includeResets?: boolean;
}): string | null;
export declare function formatUsageSummaryLine(summary: UsageSummary, opts?: {
    now?: number;
    maxProviders?: number;
}): string | null;
export declare function formatUsageReportLines(summary: UsageSummary, opts?: {
    now?: number;
}): string[];
