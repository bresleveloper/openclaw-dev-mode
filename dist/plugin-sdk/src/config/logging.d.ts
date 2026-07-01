import type { RuntimeEnv } from "../runtime.js";
type LogConfigUpdatedOptions = {
    path?: string;
    backupPath?: string | false;
    suffix?: string;
};
/** Formats a config path for operator-facing log output. */
export declare function formatConfigPath(path?: string): string;
/** Builds the config-updated log message, including backup detail only when it exists. */
export declare function formatConfigUpdatedMessage(path: string, opts?: LogConfigUpdatedOptions): string;
/** Emits the standard config-updated message through the active runtime logger. */
export declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
export {};
