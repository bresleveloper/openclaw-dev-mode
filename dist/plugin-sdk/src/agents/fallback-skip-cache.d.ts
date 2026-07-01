/**
 * Session-scoped "known-bad candidate" cache for the model fallback chain.
 *
 * When explicitly enabled and a fallback candidate fails with a non-transient
 * credential error (`auth` / `auth_permanent`), the chain can avoid retrying
 * the same candidate on every subsequent turn until the user fixes their auth.
 *
 * This module records skip markers per `(sessionId, provider, model)` with a
 * short TTL. The cache is intentionally in-memory only: a process restart
 * clears it so a freshly-restarted gateway always tries every candidate at
 * least once before deciding to skip again.
 *
 * The cache is global, not per-config, so any caller running fallbacks for the
 * same `sessionId` shares the same skip set. Tests can reset state via
 * `resetFallbackSkipCacheForTest()`.
 */
type SkipEntry = {
    expiresAtMs: number;
    reason: string;
};
type SkipBySession = Map<string, Map<string, SkipEntry>>;
/**
 * Record that `(sessionId, provider, model)` should be skipped for the
 * configured TTL. Safe to call with falsy `sessionId` — the call becomes a
 * no-op so callers do not need to guard themselves.
 */
export declare function markFallbackCandidateSkipped(params: {
    sessionId: string | undefined;
    provider: string;
    model: string;
    reason: string;
    now?: number;
    ttlMs?: number;
}): void;
/**
 * Returns true when `(sessionId, provider, model)` has an unexpired skip
 * marker. Expired entries are pruned as a side-effect so the cache does not
 * grow unbounded.
 */
export declare function isFallbackCandidateSkipped(params: {
    sessionId: string | undefined;
    provider: string;
    model: string;
    now?: number;
}): boolean;
/**
 * Look up the recorded skip reason for a `(sessionId, provider, model)`
 * triple. Returns `undefined` when no unexpired marker exists. Used by the
 * fallback chain to surface the original failure reason in observation logs.
 */
export declare function getFallbackCandidateSkipReason(params: {
    sessionId: string | undefined;
    provider: string;
    model: string;
    now?: number;
}): string | undefined;
/**
 * Test-only escape hatch. Production code must not call this; the global
 * cache is meant to outlive individual fallback runs.
 */
export declare function resetFallbackSkipCacheForTest(): void;
/**
 * Test-only inspection hook for the global session-bucket map. Production
 * code must not read this; the buckets are an implementation detail of the
 * cache and may change shape.
 */
export declare function peekFallbackSkipBucketsForTest(): SkipBySession;
export {};
