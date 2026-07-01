import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
/** Prompt for local Gateway network/auth settings and return config plus call token. */
export declare function promptGatewayConfig(cfg: OpenClawConfig, runtime: RuntimeEnv): Promise<{
    config: OpenClawConfig;
    port: number;
    token?: string;
}>;
