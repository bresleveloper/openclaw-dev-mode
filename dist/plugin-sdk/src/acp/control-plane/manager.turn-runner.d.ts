/** Runs ACP turns, failover, timeout cleanup, and detached-task progress mirroring. */
import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import { AcpRuntimeError } from "../runtime/errors.js";
import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpRunTurnInput, AcpSessionManagerDeps, ActiveTurnState, EnsureManagerRuntimeHandle, ReconcileManagerRuntimeSessionIdentifiers, ResolveManagerSession, SetManagerSessionState, SessionAcpMeta, WriteManagerSessionMeta } from "./manager.types.js";
type ApplyRuntimeControls = (params: {
    sessionKey: string;
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
}) => Promise<void>;
/** Executes one ACP prompt turn against the selected backend and records terminal state. */
export declare function runManagerTurn(params: {
    input: AcpRunTurnInput;
    sessionKey: string;
    deps: AcpSessionManagerDeps;
    runtimeHandles: ManagerRuntimeHandleCache;
    activeTurnBySession: Map<string, ActiveTurnState>;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    applyRuntimeControls: ApplyRuntimeControls;
    setSessionState: SetManagerSessionState;
    recordTurnCompletion: (params: {
        startedAt: number;
        errorCode?: AcpRuntimeError["code"];
    }) => void;
    reconcileRuntimeSessionIdentifiers: ReconcileManagerRuntimeSessionIdentifiers;
    writeSessionMeta: WriteManagerSessionMeta;
}): Promise<void>;
export {};
