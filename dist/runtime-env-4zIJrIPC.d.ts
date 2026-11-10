import "./unhandled-rejections-wpUvkHsZ.js";
import "./logger-B5J5_m3z.js";
//#region src/global-state.d.ts
declare function isVerbose(): boolean;
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
//#region src/infra/retry.d.ts
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
declare const retryAsync: <T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number) => Promise<T>;
//#endregion
//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/infra/env.d.ts
/** Interprets common human/operator truthy env strings. */
declare function isTruthyEnvValue(value?: string): boolean;
//#endregion
//#region src/infra/format-time/format-duration.d.ts
type FormatDurationSecondsOptions = {
  decimals?: number;
  unit?: "s" | "seconds";
};
declare function formatDurationSeconds(ms: number, options?: FormatDurationSecondsOptions): string;
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
declare function formatDurationPrecise(ms: number, options?: FormatDurationSecondsOptions): string;
//#endregion
//#region src/infra/net/undici-global-dispatcher.d.ts
/** Installs the env-proxy global dispatcher once proxy env is available. */
declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
//#endregion
//#region src/infra/wsl.d.ts
/** Detects WSL2 from kernel-version markers, which also establish WSL itself. */
declare function isWSL2Sync(): boolean;
//#endregion
export { success as _, isTruthyEnvValue as a, BackoffPolicy as c, computeBackoff as d, sleepWithAbort as f, shouldLogVerbose as g, logVerbose as h, formatDurationSeconds as i, RetryConfig as l, info as m, ensureGlobalUndiciEnvProxyDispatcher as n, sleep as o, danger as p, formatDurationPrecise as r, retryAsync as s, isWSL2Sync as t, RetryOptions as u, warn as v, isVerbose as y };