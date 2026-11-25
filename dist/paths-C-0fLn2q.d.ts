import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
declare let STATE_DIR: string;
/**
 * Active config path.
 */
declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
export { resolveOAuthDir as i, resolveConfigPath as n, resolveGatewayPort as r, STATE_DIR as t };