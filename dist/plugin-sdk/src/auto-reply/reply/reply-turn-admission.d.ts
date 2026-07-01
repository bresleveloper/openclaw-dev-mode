import { type ReplyOperation } from "./reply-run-registry.js";
/** Kinds of turns that compete for one reply run slot per session. */
export type ReplyTurnKind = "visible" | "heartbeat" | "queued_followup" | "control_abort";
/** Admission result for a reply turn attempting to own the session run slot. */
export type ReplyTurnAdmission = {
    status: "owned";
    operation: ReplyOperation;
} | {
    status: "skipped";
    reason: "active-run" | "aborted";
    activeOperation?: ReplyOperation;
};
/** Waits for or claims the per-session reply run slot. */
export declare function admitReplyTurn(params: {
    sessionKey: string;
    sessionId: string;
    kind: ReplyTurnKind;
    resetTriggered: boolean;
    routeThreadId?: string | number;
    upstreamAbortSignal?: AbortSignal;
    waitTimeoutMs?: number;
    waitForActive?: boolean;
}): Promise<ReplyTurnAdmission>;
/** Resolves the default turn kind from reply options. */
export declare function resolveReplyTurnKind(opts?: {
    isHeartbeat?: boolean;
}): ReplyTurnKind;
