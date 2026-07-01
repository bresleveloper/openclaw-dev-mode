import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpSessionManagerDeps, SessionAcpMeta, WriteManagerSessionMeta } from "./manager.types.js";
/** Returns a reusable cached handle or initializes a fresh runtime session for the metadata. */
export declare function ensureManagerRuntimeHandle(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    meta: SessionAcpMeta;
    deps: Pick<AcpSessionManagerDeps, "requireRuntimeBackend">;
    runtimeHandles: ManagerRuntimeHandleCache;
    enforceConcurrentSessionLimit: (params: {
        cfg: OpenClawConfig;
        sessionKey: string;
    }) => void;
    writeSessionMeta: WriteManagerSessionMeta;
}): Promise<{
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
}>;
