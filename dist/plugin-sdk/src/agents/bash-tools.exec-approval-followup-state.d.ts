import type { ExecElevatedDefaults } from "./bash-tools.exec-types.js";
/** Single-use capability payload consumed by a follow-up agent turn. */
type ExecApprovalFollowupRuntimeHandoff = {
    kind: "exec-approval-followup";
    approvalId: string;
    sessionKey: string;
    idempotencyKey: string;
    bashElevated: ExecElevatedDefaults;
};
/** Registration handle returned to the gateway approval callback. */
type ExecApprovalFollowupRuntimeHandoffRegistration = {
    handoffId: string;
    idempotencyKey: string;
};
/** Build the idempotency key used for an exec approval follow-up. */
export declare function buildExecApprovalFollowupIdempotencyKey(params: {
    approvalId: string;
    nonce?: string;
}): string;
/** Parse the approval id embedded in a follow-up idempotency key. */
export declare function parseExecApprovalFollowupApprovalId(idempotencyKey: string): string | undefined;
/** Register a short-lived exec approval handoff for the next follow-up turn. */
export declare function registerExecApprovalFollowupRuntimeHandoff(params: {
    approvalId: string;
    sessionKey: string;
    bashElevated?: ExecElevatedDefaults;
    nowMs?: number;
}): ExecApprovalFollowupRuntimeHandoffRegistration | undefined;
/** Consume a matching handoff once, validating approval/session/idempotency data. */
export declare function consumeExecApprovalFollowupRuntimeHandoff(params: {
    handoffId?: string;
    approvalId?: string;
    idempotencyKey?: string;
    sessionKey?: string;
    nowMs?: number;
}): ExecApprovalFollowupRuntimeHandoff | undefined;
/**
 * A persisted exec-approval followup is stale when the session key it targeted
 * has since been rebound to a different session id (via `/new` or `/reset`).
 * Delivering it would leak the old approval result into the new session, so the
 * gateway drops the followup instead of resuming the rebound session.
 */
export declare function isExecApprovalFollowupSessionRebound(params: {
    expectedSessionId?: string;
    resolvedSessionId?: string;
}): boolean;
/** Clear exec approval follow-up handoffs between tests. */
export declare function resetExecApprovalFollowupRuntimeHandoffsForTests(): void;
export {};
