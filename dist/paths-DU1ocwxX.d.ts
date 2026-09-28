import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import "./types-BnfxNjkF.js";
//#region src/config/paths.d.ts
declare let STATE_DIR: string;
/**
 * Active config path (prefers existing config files).
 */
declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
export { resolveOAuthDir as i, resolveConfigPath as n, resolveGatewayPort as r, STATE_DIR as t };