/**
 * Public SDK facade for starting and stopping the bundled browser bridge server.
 */
import type { Server } from "node:http";
import type { ResolvedBrowserConfig } from "./browser-types.js";
/** Running browser bridge server state returned to plugin callers. */
export type BrowserBridge = {
    server: Server;
    port: number;
    baseUrl: string;
    state: {
        resolved: ResolvedBrowserConfig;
    };
};
type BrowserBridgeFacadeModule = {
    startBrowserBridgeServer(params: {
        resolved: ResolvedBrowserConfig;
        host?: string;
        port?: number;
        authToken?: string;
        authPassword?: string;
        onEnsureAttachTarget?: (profile: unknown) => Promise<void>;
        resolveSandboxNoVncToken?: (token: string) => {
            noVncPort: number;
            password?: string;
        } | null;
    }): Promise<BrowserBridge>;
    stopBrowserBridgeServer(server: Server): Promise<void>;
};
/** Starts the browser bridge runtime from the activated browser plugin facade. */
export declare function startBrowserBridgeServer(params: Parameters<BrowserBridgeFacadeModule["startBrowserBridgeServer"]>[0]): Promise<BrowserBridge>;
/** Stops a browser bridge server previously returned by startBrowserBridgeServer. */
export declare function stopBrowserBridgeServer(server: Server): Promise<void>;
export {};
