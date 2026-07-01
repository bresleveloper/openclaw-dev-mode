export declare const DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON = "deferred to background context-engine maintenance";
/** Prefer a safeguard cancel reason when the runtime only reports generic cancellation. */
export declare function resolveCompactionFailureReason(params: {
    reason: string;
    safeguardCancelReason?: string | null;
}): string;
/** Bucket a raw compaction reason into stable telemetry/status classes. */
export declare function classifyCompactionReason(reason?: string): string;
/** Sanitize an unknown reason into a short log/metric-safe detail suffix. */
export declare function formatUnknownCompactionReasonDetail(reason?: string): string | undefined;
