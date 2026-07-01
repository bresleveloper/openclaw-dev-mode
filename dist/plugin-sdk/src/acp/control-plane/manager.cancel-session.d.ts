import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ActiveTurnState, EnsureManagerRuntimeHandle, ResolveManagerSession, SetManagerSessionState, WithManagerSessionActor } from "./manager.types.js";
/** Cancels either the active ACP turn or the idle runtime handle for a session. */
export declare function runManagerCancelSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason?: string;
    activeTurnBySession: Map<string, ActiveTurnState>;
    withSessionActor: WithManagerSessionActor;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    setSessionState: SetManagerSessionState;
}): Promise<void>;
