import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
declare function isDiagnosticFlagEnabled(flag: string, cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
export { isDiagnosticFlagEnabled as t };