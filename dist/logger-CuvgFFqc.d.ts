import "./types-BnfxNjkF.js";
import { r as LogLevel } from "./subsystem-RmDRaRJV.js";
import { Logger } from "tslog";
//#region src/logging/types.d.ts
type ConsoleStyle = "pretty" | "compact" | "json";
/** User-configurable logger settings after config/env normalization. */
type LoggerSettings = {
  level?: LogLevel;
  file?: string;
  maxFileBytes?: number;
  consoleLevel?: LogLevel;
  consoleStyle?: ConsoleStyle;
};
//#endregion
//#region src/logging/logger.d.ts
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
//#endregion
export { toPinoLikeLogger as a, setLoggerOverride as i, getChildLogger as n, LoggerSettings as o, resetLogger as r, LoggerResolvedSettings as t };