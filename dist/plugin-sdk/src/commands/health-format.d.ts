import type { HealthSummary } from "./health.types.js";
export declare function formatGatewayClosedDiagnostic(err: unknown): string | undefined;
/** Formats thrown health errors with rich detail lines when terminal color is enabled. */
export declare function formatHealthCheckFailure(err: unknown, opts?: {
    rich?: boolean;
}): string;
/** Formats one terse health line per channel, optionally including every account. */
export declare const formatHealthChannelLines: (summary: HealthSummary, opts?: {
    accountMode?: "default" | "all";
    accountIdsByChannel?: Record<string, string[] | undefined>;
}) => string[];
