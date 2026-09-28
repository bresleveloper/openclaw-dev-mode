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
declare function resolveRetryConfig(defaults?: Required<RetryConfig>, overrides?: RetryConfig): Required<RetryConfig>;
//#endregion
//#region src/globals.d.ts
declare function shouldLogVerbose(): boolean;
declare function logVerbose(message: string): void;
type ThemeFormatter = (value: string) => string;
declare const success: ThemeFormatter;
declare const warn: ThemeFormatter;
declare const info: ThemeFormatter;
declare const danger: ThemeFormatter;
//#endregion
export { success as a, RetryConfig as c, computeBackoff as d, resolveRetryConfig as f, shouldLogVerbose as i, RetryInfo as l, info as n, warn as o, sleepWithAbort as p, logVerbose as r, BackoffPolicy as s, danger as t, RetryOptions as u };