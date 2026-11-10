import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
//#region src/infra/diagnostic-flags.d.ts
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
declare function isDiagnosticFlagEnabled(flag: string, cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
//#endregion
export { isDiagnosticFlagEnabled as t };