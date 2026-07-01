import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime, t as OutputRuntimeEnv } from "./runtime-Bxifh4bY.js";
import { a as stripRedundantSubsystemPrefixForConsole, c as levelToMinLevel, i as runtimeForLogger, l as normalizeLogLevel, n as createSubsystemLogger, o as ALLOWED_LOG_LEVELS, r as createSubsystemRuntime, s as LogLevel, t as SubsystemLogger } from "./subsystem-Boo2DQIV.js";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-Ci1QGA2-.js";
import { a as shouldLogVerbose, c as isVerbose, d as setYes, i as logVerboseConsole, l as isYes, n as info, o as success, r as logVerbose, s as warn, t as danger, u as setVerbose } from "./globals-BL1_NohW.js";
import { t as collectProviderDangerousNameMatchingScopes } from "./dangerous-name-matching-CuJZ51RE.js";
import { createLoggerBackedRuntime, resolveRuntimeEnv, resolveRuntimeEnvWithUnavailableExit } from "./runtime-logger.js";
import { a as getChildLogger, c as isFileLogLevelEnabled, d as setLoggerOverride, h as LoggerSettings, i as PinoLikeLogger, l as resetLogger, m as ConsoleStyle, n as DEFAULT_LOG_FILE, o as getLogger, p as toPinoLikeLogger, r as LoggerResolvedSettings, s as getResolvedLoggerSettings, t as DEFAULT_LOG_DIR, u as setLoggerConfigLoaderForTests } from "./logger-B88BjBEV.js";
import { n as detectPluginInstallPathIssue, r as formatPluginInstallPathIssue, t as removePluginFromConfig } from "./uninstall-BCZVKB-y.js";
import { a as enableConsoleCapture, c as routeLogsToStderr, d as setConsoleTimestampPrefix, f as shouldLogSubsystemToConsole, i as ConsoleLoggerSettings, l as setConsoleConfigLoaderForTests, n as registerUnhandledRejectionHandler, o as getConsoleSettings, r as waitForAbortSignal, s as getResolvedConsoleSettings, t as registerUncaughtExceptionHandler, u as setConsoleSubsystemFilter } from "./unhandled-rejections-CIvsxlB-.js";
import { t as getChannelsCommandSecretTargetIds } from "./command-secret-targets-CW5OwMS0.js";

//#region src/commands/backup-shared.d.ts
type BackupAssetKind = "state" | "config" | "credentials" | "workspace";
type BackupAsset = {
  kind: BackupAssetKind;
  sourcePath: string;
  displayPath: string;
  archivePath: string;
};
//#endregion
//#region src/infra/backup-create.d.ts
type BackupCreateOptions = {
  output?: string;
  dryRun?: boolean;
  includeWorkspace?: boolean;
  onlyConfig?: boolean;
  verify?: boolean;
  json?: boolean;
  nowMs?: number;
  /**
   * Optional info logger invoked for non-fatal backup events such as tar
   * retry notices or volatile-file skip counts. When omitted, events are
   * silent aside from the final result.
   */
  log?: (message: string) => void;
};
type BackupCreateResult = {
  createdAt: string;
  archiveRoot: string;
  archivePath: string;
  dryRun: boolean;
  includeWorkspace: boolean;
  onlyConfig: boolean;
  verified: boolean;
  assets: BackupAsset[];
  skipped: Array<{
    kind: string;
    sourcePath: string;
    displayPath: string;
    reason: string;
    coveredBy?: string;
  }>;
  /**
   * Count of files the archiver actively skipped because they matched the
   * known-volatile filter (live sessions, cron logs, queues, sockets, pid/tmp).
   * Populated on real writes only; dry runs report 0.
   */
  skippedVolatileCount: number;
};
declare function createBackupArchive(opts?: BackupCreateOptions): Promise<BackupCreateResult>;
//#endregion
export { ALLOWED_LOG_LEVELS, type ConsoleLoggerSettings, type ConsoleStyle, DEFAULT_LOG_DIR, DEFAULT_LOG_FILE, type LogLevel, type LoggerResolvedSettings, type LoggerSettings, type OutputRuntimeEnv, type PinoLikeLogger, type RuntimeEnv, type SubsystemLogger, collectProviderDangerousNameMatchingScopes, createBackupArchive, createLoggerBackedRuntime, createNonExitingRuntime, createSubsystemLogger, createSubsystemRuntime, danger, defaultRuntime, detectPluginInstallPathIssue, enableConsoleCapture, formatPluginInstallPathIssue, getChannelsCommandSecretTargetIds, getChildLogger, getConsoleSettings, getLogger, getResolvedConsoleSettings, getResolvedLoggerSettings, info, isFileLogLevelEnabled, isVerbose, isYes, levelToMinLevel, logVerbose, logVerboseConsole, normalizeLogLevel, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, removePluginFromConfig, resetLogger, resolveCommandSecretRefsViaGateway, resolveRuntimeEnv, resolveRuntimeEnvWithUnavailableExit, routeLogsToStderr, runtimeForLogger, setConsoleConfigLoaderForTests, setConsoleSubsystemFilter, setConsoleTimestampPrefix, setLoggerConfigLoaderForTests, setLoggerOverride, setVerbose, setYes, shouldLogSubsystemToConsole, shouldLogVerbose, stripRedundantSubsystemPrefixForConsole, success, toPinoLikeLogger, waitForAbortSignal, warn };