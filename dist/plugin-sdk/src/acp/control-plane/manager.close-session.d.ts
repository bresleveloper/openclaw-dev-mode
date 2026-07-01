import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpCloseSessionInput, AcpCloseSessionResult, AcpSessionManagerDeps, EnsureManagerRuntimeHandle, ResolveManagerSession, WriteManagerSessionMeta } from "./manager.types.js";
/** Closes an ACP session runtime handle and optionally discards persistent state/meta. */
export declare function runManagerCloseSession(params: {
    input: AcpCloseSessionInput;
    sessionKey: string;
    deps: Pick<AcpSessionManagerDeps, "getRuntimeBackend">;
    runtimeHandles: ManagerRuntimeHandleCache;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    writeSessionMeta: WriteManagerSessionMeta;
}): Promise<AcpCloseSessionResult>;
