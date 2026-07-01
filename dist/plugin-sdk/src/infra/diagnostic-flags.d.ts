import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
export declare function resolveDiagnosticFlags(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): string[];
/** Matches one diagnostic flag against exact, wildcard, and namespace-enabled flags. */
export declare function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean;
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
export declare function isDiagnosticFlagEnabled(flag: string, cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
