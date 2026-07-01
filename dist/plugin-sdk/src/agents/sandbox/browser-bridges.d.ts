/**
 * In-process browser bridge registry keyed by sandbox session.
 *
 * The prune path uses this table to stop bridge servers when backing containers expire.
 */
import type { BrowserBridge } from "../../plugin-sdk/browser-bridge.js";
export declare const BROWSER_BRIDGES: Map<string, {
    bridge: BrowserBridge;
    containerName: string;
    authToken?: string;
    authPassword?: string;
}>;
