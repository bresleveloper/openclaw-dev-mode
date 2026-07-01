import type { OpenClawConfig } from "../config/types.openclaw.js";
type LoggingConfig = OpenClawConfig["logging"];
/** Avoids config reads that can mutate or validate config while schema/config commands run. */
export declare function shouldSkipMutatingLoggingConfigRead(argv?: string[]): boolean;
/** Reads the logging block from config, caching by resolved config path. */
export declare function readLoggingConfig(): LoggingConfig | undefined;
export {};
