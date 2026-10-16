//#region src/logging/levels.d.ts
declare const ALLOWED_LOG_LEVELS: readonly ["silent", "fatal", "error", "warn", "info", "debug", "trace"];
type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];
//#endregion
//#region src/logging/subsystem.d.ts
type SubsystemLogger = {
  subsystem: string;
  isEnabled: (level: LogLevel, target?: "any" | "console" | "file") => boolean;
  trace: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  fatal: (message: string, meta?: Record<string, unknown>) => void;
  raw: (message: string) => void;
  child: (name: string) => SubsystemLogger;
};
declare function createSubsystemLogger(subsystem: string): SubsystemLogger;
//#endregion
export { createSubsystemLogger as n, LogLevel as r, SubsystemLogger as t };