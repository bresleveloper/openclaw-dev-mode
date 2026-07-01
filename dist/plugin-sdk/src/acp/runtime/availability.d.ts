/** Availability check for exposing ACP runtime spawning to tools and clients. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Returns whether ACP runtime spawning is allowed and the selected backend is healthy enough. */
export declare function isAcpRuntimeSpawnAvailable(params: {
    config?: OpenClawConfig;
    sandboxed?: boolean;
    backendId?: string;
}): boolean;
