import type { AcpRuntime, AcpRuntimeCapabilities, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AcpSessionStatus, EnsureManagerRuntimeHandle, ReconcileManagerRuntimeSessionIdentifiers, ResolveManagerSession } from "./manager.types.js";
/** Reads a fresh ACP session status and reconciles runtime identifiers from the status response. */
export declare function runManagerGetSessionStatus(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    signal?: AbortSignal;
    throwIfAborted: (signal?: AbortSignal) => void;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    resolveRuntimeCapabilities: (params: {
        runtime: AcpRuntime;
        handle: AcpRuntimeHandle;
    }) => Promise<AcpRuntimeCapabilities>;
    reconcileRuntimeSessionIdentifiers: ReconcileManagerRuntimeSessionIdentifiers;
}): Promise<AcpSessionStatus>;
