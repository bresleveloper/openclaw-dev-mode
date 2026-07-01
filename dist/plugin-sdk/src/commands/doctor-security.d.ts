import type { OpenClawConfig } from "../config/config.js";
/** Collects doctor security warnings without emitting terminal notes. */
export declare function collectSecurityWarnings(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): Promise<string[]>;
/** Emits security warnings plus the deep audit follow-up command. */
export declare function noteSecurityWarnings(cfg: OpenClawConfig): Promise<void>;
