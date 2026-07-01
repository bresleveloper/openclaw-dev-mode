//#region src/infra/retry.d.ts
/** Retry timing knobs shared by generic retry runners and channel retry policies. */
type RetryConfig = {
  attempts?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  jitter?: number;
};
/** Metadata emitted before a retry attempt sleeps and reruns the operation. */
type RetryInfo = {
  attempt: number;
  maxAttempts: number;
  delayMs: number;
  err: unknown;
  label?: string;
};
/** Retry execution options, including predicates, Retry-After hooks, and retry callbacks. */
type RetryOptions = RetryConfig & {
  label?: string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
  onRetry?: (info: RetryInfo) => void;
};
/** Resolves retry config overrides into clamped timer-safe settings. */
declare function resolveRetryConfig(defaults?: Required<RetryConfig>, overrides?: RetryConfig): Required<RetryConfig>;
/** Runs an async operation until it succeeds, retry policy stops, or attempts are exhausted. */
declare function retryAsync<T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number): Promise<T>;
//#endregion
export { retryAsync as a, resolveRetryConfig as i, RetryInfo as n, RetryOptions as r, RetryConfig as t };