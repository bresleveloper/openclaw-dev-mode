import type { OpenClawConfig } from "./config/types.openclaw.js";
export declare function cleanupBrowserSessionsForLifecycleEnd(params: {
    cfg?: OpenClawConfig;
    sessionKeys: string[];
    onWarn?: (message: string) => void;
    onError?: (error: unknown) => void;
}): Promise<void>;
