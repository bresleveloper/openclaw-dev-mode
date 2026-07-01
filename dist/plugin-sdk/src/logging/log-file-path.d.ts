import type { OpenClawConfig } from "../config/types.js";
/** Resolves the configured log file or today's rolling default log path. */
export declare function resolveConfiguredLogFilePath(config?: OpenClawConfig | null): string;
