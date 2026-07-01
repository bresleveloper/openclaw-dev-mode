import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AcpSessionManagerDeps, AcpStartupIdentityReconcileResult, EnsureManagerRuntimeHandle, ReconcileManagerRuntimeSessionIdentifiers, ResolveManagerSession, WithManagerSessionActor } from "./manager.types.js";
/** Resolves pending ACP session identities opportunistically during manager startup. */
export declare function runManagerStartupIdentityReconcile(params: {
    cfg: OpenClawConfig;
    deps: Pick<AcpSessionManagerDeps, "listAcpSessions">;
    withSessionActor: WithManagerSessionActor;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    reconcileRuntimeSessionIdentifiers: ReconcileManagerRuntimeSessionIdentifiers;
}): Promise<AcpStartupIdentityReconcileResult>;
