//#region src/agents/failover/signal.d.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
declare const FAILOVER_REASONS: readonly ["auth", "auth_permanent", "format", "rate_limit", "overloaded", "billing", "server_error", "timeout", "tls_certificate", "context_overflow", "model_not_found", "session_expired", "empty_response", "no_error_details", "unclassified", "unknown"];
type FailoverReason = (typeof FAILOVER_REASONS)[number];
//#endregion
//#region src/agents/model-fallback.types.d.ts
type ModelCandidate = {
  provider: string;
  model: string;
};
type ModelFallbackRouteResolution = "raw" | "resolved";
type FallbackAttempt = ModelCandidate & {
  error: string;
  rateLimitRetriesExhausted?: number;
  reason?: FailoverReason;
  authMode?: string;
  status?: number;
  code?: string;
};
/** Original route plus the outer fallback stage that admitted one real attempt. */
type ModelFallbackAttemptProvenance = {
  requestedProvider: string;
  requestedModel: string;
  stage: "initial" | "fallback";
  /** A user switch invalidates automatic routing for the original selection for this cycle. */
  selectionChanged?: boolean;
  fallbackReason?: FailoverReason;
};
//#endregion
export { FailoverReason as i, ModelFallbackAttemptProvenance as n, ModelFallbackRouteResolution as r, FallbackAttempt as t };