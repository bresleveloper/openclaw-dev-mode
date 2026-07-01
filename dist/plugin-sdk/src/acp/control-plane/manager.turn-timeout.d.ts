/** Timeout and cleanup helpers for long-running ACP turns. */
import type { AcpRuntimeSessionMode } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ActiveTurnState, SessionAcpMeta } from "./manager.types.js";
/** Resolves the effective ACP turn timeout from session runtime options or agent defaults. */
export declare function resolveTurnTimeoutMs(params: {
    cfg: OpenClawConfig;
    meta: SessionAcpMeta;
}): number;
/** Awaits a turn promise with bounded timeout handling and late-error logging. */
export declare function awaitTurnWithTimeout<T>(params: {
    sessionKey: string;
    turnPromise: Promise<T>;
    timeoutMs: number;
    timeoutLabelMs: number;
    onTimeout: () => Promise<void>;
}): Promise<T>;
/** Cancels a timed-out turn and clears non-persistent cached runtime state. */
export declare function cleanupTimedOutTurn(params: {
    sessionKey: string;
    activeTurn: ActiveTurnState;
    mode: AcpRuntimeSessionMode;
    clearCachedRuntimeStateIfHandleMatches: (activeTurn: ActiveTurnState) => void;
}): Promise<void>;
