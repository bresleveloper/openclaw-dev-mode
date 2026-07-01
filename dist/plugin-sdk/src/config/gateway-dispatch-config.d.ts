import type { OpenClawConfig } from "./types.openclaw.js";
/** Options for reading the reduced config surface used by Gateway dispatch. */
type GatewayDispatchConfigReadOptions = {
    configPath?: string;
    env?: NodeJS.ProcessEnv;
    logger?: Pick<Console, "warn" | "error">;
};
export declare function readGatewayDispatchConfig(options?: GatewayDispatchConfigReadOptions): OpenClawConfig;
export declare function readGatewayDispatchConfigWithShellEnvFallback(options?: GatewayDispatchConfigReadOptions): Promise<OpenClawConfig>;
export {};
