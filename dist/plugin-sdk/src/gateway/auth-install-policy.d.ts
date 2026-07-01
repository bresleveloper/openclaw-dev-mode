import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Decide whether install should require token auth when no durable password source exists. */
export declare function shouldRequireGatewayTokenForInstall(cfg: OpenClawConfig, env: NodeJS.ProcessEnv): boolean;
