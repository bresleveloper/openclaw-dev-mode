import type { NormalizedUsage } from "../agents/usage.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export { formatTokenCount } from "./token-format.js";
/**
 * A single tier in a tiered-pricing schedule.  Prices are expressed as
 * USD per-million tokens, just like the flat `ModelCostConfig` fields.
 *
 * `range` is a half-open interval `[start, end)` expressed in *input*
 * token counts.  The tiers MUST be sorted in ascending `range[0]` order
 * with no gaps.
 */
type PricingTier = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    /** [startTokens, endTokens) — half-open interval on the input token axis. */
    range: [number, number];
};
/** Per-million-token model pricing used by usage summaries and cost estimates. */
export type ModelCostConfig = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    /** Optional tiered pricing tiers.  When present, `estimateUsageCost`
     *  uses them instead of the flat rates above.  The flat rates still
     *  serve as the "default / first-tier" fallback for callers that are
     *  unaware of tiered pricing. */
    tieredPricing?: PricingTier[];
};
type UsageTotals = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
};
/** Formats a USD amount for usage summaries, keeping tiny costs visible. */
export declare function formatUsd(value?: number): string | undefined;
/**
 * Fingerprints all model-pricing sources that can affect usage cost estimates.
 * Consumers cache this value to know when resolved cost entries need recomputation.
 */
export declare function resolveModelCostConfigFingerprint(config?: OpenClawConfig): string;
/**
 * Resolves pricing for a provider/model pair from local models.json, configured models, then gateway cache.
 * Direct keys win before plugin normalization so configured pricing does not trigger provider discovery.
 */
export declare function resolveModelCostConfig(params: {
    provider?: string;
    model?: string;
    config?: OpenClawConfig;
    allowPluginNormalization?: boolean;
}): ModelCostConfig | undefined;
/**
 * Estimates USD usage cost from normalized token totals.
 * Tiered pricing selects one whole-request tier by input size; it does not blend tiers.
 */
export declare function estimateUsageCost(params: {
    usage?: NormalizedUsage | UsageTotals | null;
    cost?: ModelCostConfig;
}): number | undefined;
export declare function resetUsageFormatCachesForTest(): void;
