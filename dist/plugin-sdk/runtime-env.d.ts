import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime } from "../runtime-DlqUc5_p.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { a as success, d as computeBackoff, i as shouldLogVerbose, n as info, o as warn, p as sleepWithAbort, r as logVerbose, s as BackoffPolicy, t as danger } from "../globals-BkKO3lYj.js";
import { T as retryAsync, _ as formatDurationPrecise, b as isTruthyEnvValue, c as ensureGlobalUndiciEnvProxyDispatcher, n as isWSL2Sync, v as formatDurationSeconds } from "../wsl-DFRn_LY6.js";
import { a as toPinoLikeLogger, i as setLoggerOverride, n as getChildLogger, r as resetLogger } from "../logger-CuvgFFqc.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-CGRXXrIP.js";
//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
export declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/global-state.d.ts
export declare function isVerbose(): boolean;
//#endregion
export { type BackoffPolicy, type RuntimeEnv, computeBackoff, createNonExitingRuntime, createSubsystemLogger, danger, defaultRuntime, ensureGlobalUndiciEnvProxyDispatcher, formatDurationPrecise, formatDurationSeconds, getChildLogger, info, isTruthyEnvValue, isWSL2Sync, logVerbose, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resetLogger, retryAsync, setLoggerOverride, shouldLogVerbose, sleepWithAbort, success, toPinoLikeLogger, waitForAbortSignal, warn };