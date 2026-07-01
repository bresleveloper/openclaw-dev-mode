import { type LogLevel } from "./levels.js";
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
export declare function resolveEnvLogLevelOverride(): LogLevel | undefined;
