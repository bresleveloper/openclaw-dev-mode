import type { AcpRuntime } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AcpRuntimeError } from "../runtime/errors.js";
import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpSessionManagerDeps, SessionAcpMeta, WriteManagerSessionMeta } from "./manager.types.js";
/** Detects acpx exits that are safe to retry with a fresh runtime handle. */
export declare function isRecoverableManagerAcpxExitError(message: string): boolean;
/** Prepares a one-time fresh-handle retry for recoverable pre-output runtime failures. */
export declare function prepareFreshManagerRuntimeHandleRetry(params: {
    attempt: number;
    cfg: OpenClawConfig;
    sessionKey: string;
    error: AcpRuntimeError;
    sawTurnOutput: boolean;
    runtime?: AcpRuntime;
    meta?: SessionAcpMeta;
    runtimeHandles: ManagerRuntimeHandleCache;
    writeSessionMeta: WriteManagerSessionMeta;
}): Promise<boolean>;
/** Clears persisted runtime resume identifiers while preserving the manager session shell. */
export declare function discardPersistedManagerRuntimeState(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    writeSessionMeta: WriteManagerSessionMeta;
}): Promise<void>;
export declare function tryPrepareFreshManagerRuntimeSession(params: {
    deps: Pick<AcpSessionManagerDeps, "getRuntimeBackend">;
    cfg: OpenClawConfig;
    meta: SessionAcpMeta;
    sessionKey: string;
    logPrefix: string;
    missingBackendError?: unknown;
}): Promise<void>;
