import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime } from "../runtime-DlqUc5_p.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { i as sleepWithAbort, n as RetryOptions, r as computeBackoff, t as BackoffPolicy } from "../index-DcwqyTkK.js";
import { a as success, i as shouldLogVerbose, n as info, o as warn, r as logVerbose, t as danger } from "../globals-BSGGiwb5.js";
import { a as toPinoLikeLogger, i as setLoggerOverride, n as getChildLogger, r as resetLogger } from "../logger-BA_EE7GE.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-wpUvkHsZ.js";
//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
export declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/global-state.d.ts
export declare function isVerbose(): boolean;
//#endregion
//#region src/infra/retry.d.ts
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
export declare const retryAsync: <T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number) => Promise<T>;
//#endregion
//#region src/infra/env.d.ts
/** Interprets common human/operator truthy env strings. */
export declare function isTruthyEnvValue(value?: string): boolean;
//#endregion
//#region src/infra/format-time/format-duration.d.ts
type FormatDurationSecondsOptions = {
  decimals?: number;
  unit?: "s" | "seconds";
};
export declare function formatDurationSeconds(ms: number, options?: FormatDurationSecondsOptions): string;
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
export declare function formatDurationPrecise(ms: number, options?: FormatDurationSecondsOptions): string;
//#endregion
//#region src/infra/net/undici-global-dispatcher.d.ts
/** Installs the env-proxy global dispatcher once proxy env is available. */
export declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
//#endregion
//#region src/infra/wsl.d.ts
/** Detects WSL2 from kernel-version markers, which also establish WSL itself. */
export declare function isWSL2Sync(): boolean;
//#endregion
export { type BackoffPolicy, type RuntimeEnv, computeBackoff, createNonExitingRuntime, createSubsystemLogger, danger, defaultRuntime, getChildLogger, info, logVerbose, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resetLogger, setLoggerOverride, shouldLogVerbose, sleepWithAbort, success, toPinoLikeLogger, waitForAbortSignal, warn };