//#region packages/retry/src/index.d.ts
type BackoffPolicy = {
  initialMs: number;
  maxMs: number;
  factor: number;
  jitter: number;
};
declare function computeBackoff(policy: BackoffPolicy, attempt: number): number;
declare function sleepWithAbort(ms: number, abortSignal?: AbortSignal, options?: {
  ref?: boolean;
}): Promise<void>;
type RetryConfig = {
  attempts?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  /** Fractional symmetric spread or full jitter. */
  jitter?: number | "full";
};
type RetryDelayContext = {
  attempt: number;
  maxAttempts: number;
  err: unknown;
  label?: string;
};
type RetryInfo = RetryDelayContext & {
  delayMs: number;
};
type RetryOptions = RetryConfig & {
  label?: string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
  retryAfterMaxDelayMs?: number;
  delayMs?: number | ((context: RetryDelayContext) => number);
  onRetry?: (info: RetryInfo) => unknown;
  random?: () => number;
  sleep?: (ms: number) => Promise<void>;
};
//#endregion
export { sleepWithAbort as i, RetryOptions as n, computeBackoff as r, BackoffPolicy as t };