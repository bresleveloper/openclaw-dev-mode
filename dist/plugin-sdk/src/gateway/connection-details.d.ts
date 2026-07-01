import type { OpenClawConfig } from "../config/types.js";
/** Resolved gateway target plus redacted display text for diagnostics. */
export type GatewayConnectionDetails = {
    url: string;
    urlSource: string;
    bindDetail?: string;
    remoteFallbackNote?: string;
    message: string;
};
type GatewayConnectionDetailResolvers = {
    getRuntimeConfig?: () => OpenClawConfig;
    resolveConfigPath?: (env: NodeJS.ProcessEnv) => string;
    resolveGatewayPort?: (cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv) => number;
};
/** Build gateway target details and reject unsafe remote plaintext websocket URLs. */
export declare function buildGatewayConnectionDetailsWithResolvers(options?: {
    config?: OpenClawConfig;
    url?: string;
    configPath?: string;
    urlSource?: "cli" | "env";
    ignoreEnvUrlOverride?: boolean;
    localPortOverride?: number;
}, resolvers?: GatewayConnectionDetailResolvers): GatewayConnectionDetails;
export {};
