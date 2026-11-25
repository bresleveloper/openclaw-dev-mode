import "./types-ACDCRjU-.js";
import { r as LogLevel } from "./subsystem-wnS6DJyq.js";
import "./unhandled-rejections-D3oSvOwT.js";
import { Logger } from "tslog";
declare function isVerbose(): boolean;
declare function shouldLogVerbose(): boolean;
declare function logVerbose(message: string): void;
type ThemeFormatter = (value: string) => string;
declare const success: ThemeFormatter;
declare const warn: ThemeFormatter;
declare const info: ThemeFormatter;
declare const danger: ThemeFormatter;
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
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
declare const retryAsync: <T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number) => Promise<T>;
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
type RuntimeDynamicExecutionFeature = "plugins" | "code-mode" | "qa";
/** Performance information only; trust and execution authority stay with their owners. */
declare function noteRuntimeDynamicExecution(feature: RuntimeDynamicExecutionFeature): void;
/** Add guidance only after the runtime actually rejects code or cannot find a module. */
declare function annotateRuntimeExecutionError(error: unknown, feature: string): unknown;
/** Interprets common human/operator truthy env strings. */
declare function isTruthyEnvValue(value?: string): boolean;
type ConsoleStyle = "pretty" | "compact" | "json";
/** User-configurable logger settings after config/env normalization. */
type LoggerSettings = {
  level?: LogLevel;
  file?: string;
  maxFileBytes?: number;
  consoleLevel?: LogLevel;
  consoleStyle?: ConsoleStyle;
};
type LogObj = {
  date?: Date;
} & Record<string, unknown>;
type ResolvedSettings = {
  level: LogLevel;
  file: string;
  maxFileBytes: number;
};
type LoggerResolvedSettings = ResolvedSettings;
declare function getChildLogger(bindings?: Record<string, unknown>, opts?: {
  level?: LogLevel;
}): Logger<LogObj>;
declare function toPinoLikeLogger(logger: Logger<LogObj>, level: LogLevel): PinoLikeLogger;
type PinoLikeLogger = {
  level: string;
  child: (bindings?: Record<string, unknown>) => PinoLikeLogger;
  trace: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  fatal: (...args: unknown[]) => void;
};
declare function setLoggerOverride(settings: LoggerSettings | null): void;
declare function resetLogger(): void;
type FormatDurationSecondsOptions = {
  decimals?: number;
  unit?: "s" | "seconds";
};
declare function formatDurationSeconds(ms: number, options?: FormatDurationSecondsOptions): string;
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
declare function formatDurationPrecise(ms: number, options?: FormatDurationSecondsOptions): string;
/** Installs the env-proxy global dispatcher once proxy env is available. */
declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
/** Detects WSL2 from kernel-version markers, which also establish WSL itself. */
declare function isWSL2Sync(): boolean;
export { info as C, warn as D, success as E, isVerbose as O, danger as S, shouldLogVerbose as T, BackoffPolicy as _, LoggerResolvedSettings as a, computeBackoff as b, setLoggerOverride as c, isTruthyEnvValue as d, RuntimeDynamicExecutionFeature as f, retryAsync as g, sleep as h, formatDurationSeconds as i, toPinoLikeLogger as l, noteRuntimeDynamicExecution as m, ensureGlobalUndiciEnvProxyDispatcher as n, getChildLogger as o, annotateRuntimeExecutionError as p, formatDurationPrecise as r, resetLogger as s, isWSL2Sync as t, LoggerSettings as u, RetryConfig as v, logVerbose as w, sleepWithAbort as x, RetryOptions as y };