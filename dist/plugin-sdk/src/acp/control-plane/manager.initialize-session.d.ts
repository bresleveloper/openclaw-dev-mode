import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpInitializeSessionInput, AcpSessionManagerDeps, SessionAcpMeta, WriteManagerSessionMeta } from "./manager.types.js";
/** Initializes an ACP runtime session and persists its metadata before caching the handle. */
export declare function runManagerInitializeSession(params: {
    input: AcpInitializeSessionInput;
    sessionKey: string;
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
