import type { Agent } from "node:http";
export declare const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
export declare const OPENCLAW_DEBUG_PROXY_URL = "OPENCLAW_DEBUG_PROXY_URL";
/** @deprecated Capture storage now lives in the shared state database. */
export declare const OPENCLAW_DEBUG_PROXY_DB_PATH = "OPENCLAW_DEBUG_PROXY_DB_PATH";
/** @deprecated Capture payloads now live in the shared state database. */
export declare const OPENCLAW_DEBUG_PROXY_BLOB_DIR = "OPENCLAW_DEBUG_PROXY_BLOB_DIR";
export declare const OPENCLAW_DEBUG_PROXY_CERT_DIR = "OPENCLAW_DEBUG_PROXY_CERT_DIR";
export declare const OPENCLAW_DEBUG_PROXY_SESSION_ID = "OPENCLAW_DEBUG_PROXY_SESSION_ID";
export declare const OPENCLAW_DEBUG_PROXY_REQUIRE = "OPENCLAW_DEBUG_PROXY_REQUIRE";
export type DebugProxySettings = {
    enabled: boolean;
    required: boolean;
    proxyUrl?: string;
    /** @deprecated Capture storage now lives in the shared state database. */
    dbPath: string;
    /** @deprecated Capture payloads now live in the shared state database. */
    blobDir: string;
    certDir: string;
    sessionId: string;
    sourceProcess: string;
};
export declare function resolveDebugProxySettings(env?: NodeJS.ProcessEnv): DebugProxySettings;
export declare function applyDebugProxyEnv(env: NodeJS.ProcessEnv, params: {
    proxyUrl: string;
    sessionId: string;
    certDir?: string;
}): NodeJS.ProcessEnv;
export declare function createDebugProxyWebSocketAgent(settings: DebugProxySettings): Agent | undefined;
export declare function resolveEffectiveDebugProxyUrl(configuredProxyUrl?: string): string | undefined;
