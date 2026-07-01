import { type ExecApprovalInitiatingSurfaceState } from "../infra/exec-approval-surface.js";
import { resolveExecApprovals, type ExecAsk, type ExecApprovalDecision, type ExecSecurity } from "../infra/exec-approvals.js";
import { logWarn } from "../logger.js";
import { sendExecApprovalFollowup } from "./bash-tools.exec-approval-followup.js";
import { type ExecApprovalRegistration } from "./bash-tools.exec-approval-request.js";
import type { ExecElevatedDefaults, ExecToolDetails } from "./bash-tools.exec-types.js";
import type { AgentToolResult } from "./runtime/index.js";
type ResolvedExecApprovals = ReturnType<typeof resolveExecApprovals>;
/** Cap for deduplicating repeated follow-up dispatch failure log keys. */
export declare const MAX_EXEC_APPROVAL_FOLLOWUP_FAILURE_LOG_KEYS = 256;
/** Effective approval policy after caller config and approvals file are merged. */
export type ExecHostApprovalContext = {
    approvals: ResolvedExecApprovals;
    hostSecurity: ExecSecurity;
    hostAsk: ExecAsk;
    askFallback: ResolvedExecApprovals["agent"]["askFallback"];
};
/** Pending approval state shared by gateway/node exec hosts. */
export type ExecApprovalPendingState = {
    warningText: string;
    expiresAtMs: number;
    preResolvedDecision: string | null | undefined;
};
/** Pending approval state plus human-readable notice timing. */
export type ExecApprovalRequestState = ExecApprovalPendingState & {
    noticeSeconds: number;
};
/** Why an approval request cannot be delivered interactively. */
export type ExecApprovalUnavailableReason = "no-approval-route" | "initiating-platform-disabled" | "initiating-platform-unsupported";
/** Context returned after a default approval request is registered. */
export type RegisteredExecApprovalRequestContext = {
    approvalId: string;
    approvalSlug: string;
    warningText: string;
    expiresAtMs: number;
    preResolvedDecision: string | null | undefined;
    initiatingSurface: ExecApprovalInitiatingSurfaceState;
    sentApproverDms: boolean;
    unavailableReason: ExecApprovalUnavailableReason | null;
};
/** Destination and context for async exec approval follow-up delivery. */
export type ExecApprovalFollowupTarget = {
    approvalId: string;
    sessionKey?: string;
    /** Session UUID active when the approval was requested. Lets the followup be
     *  dropped if `/new` or `/reset` rebinds the session key to a new session. */
    expectedSessionId?: string;
    /** Session-store template, so the direct/denied path can resolve the key's
     *  current sessionId and drop a rebound followup before sending. */
    sessionStore?: string;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    direct?: boolean;
    bashElevated?: ExecElevatedDefaults;
};
/** Test seam for follow-up delivery and warning logging. */
export type ExecApprovalFollowupResultDeps = {
    sendExecApprovalFollowup?: typeof sendExecApprovalFollowup;
    logWarn?: typeof logWarn;
};
/** Common arguments used to build default approval request contexts. */
export type DefaultExecApprovalRequestArgs = {
    warnings: string[];
    approvalRunningNoticeMs: number;
    createApprovalSlug: (approvalId: string) => string;
    turnSourceChannel?: string;
    turnSourceAccountId?: string;
};
/** Builds pending approval state with warnings and a bounded expiry. */
export declare function createExecApprovalPendingState(params: {
    warnings: string[];
    timeoutMs: number;
}): ExecApprovalPendingState;
/** Builds pending approval state plus rounded notice duration. */
export declare function createExecApprovalRequestState(params: {
    warnings: string[];
    timeoutMs: number;
    approvalRunningNoticeMs: number;
}): ExecApprovalRequestState;
/** Creates a fresh approval id/slug/context key for a pending request. */
export declare function createExecApprovalRequestContext(params: {
    warnings: string[];
    timeoutMs: number;
    approvalRunningNoticeMs: number;
    createApprovalSlug: (approvalId: string) => string;
}): ExecApprovalRequestState & {
    approvalId: string;
    approvalSlug: string;
    contextKey: string;
};
/** Creates a pending approval context using the default approval timeout. */
export declare function createDefaultExecApprovalRequestContext(params: {
    warnings: string[];
    approvalRunningNoticeMs: number;
    createApprovalSlug: (approvalId: string) => string;
}): ExecApprovalPendingState & {
    noticeSeconds: number;
} & {
    approvalId: string;
    approvalSlug: string;
    contextKey: string;
};
/** Converts a raw approval decision plus fallback policy into execution state. */
export declare function resolveBaseExecApprovalDecision(params: {
    decision: string | null;
    askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}): {
    approvedByAsk: boolean;
    deniedReason: string | null;
    timedOut: boolean;
};
/** Resolves effective exec policy for a gateway/node host. */
export declare function resolveExecHostApprovalContext(params: {
    agentId?: string;
    security: ExecSecurity;
    ask: ExecAsk;
    host: "gateway" | "node";
}): ExecHostApprovalContext;
/** Waits for approval while converting wait failures to an undefined sentinel. */
export declare function resolveApprovalDecisionOrUndefined(params: {
    approvalId: string;
    preResolvedDecision: string | null | undefined;
    onFailure: () => void;
}): Promise<string | null | undefined>;
/** Resolves approval delivery availability for the initiating channel/account. */
export declare function resolveExecApprovalUnavailableState(params: {
    turnSourceChannel?: string;
    turnSourceAccountId?: string;
    preResolvedDecision: string | null | undefined;
}): {
    initiatingSurface: ExecApprovalInitiatingSurfaceState;
    sentApproverDms: boolean;
    unavailableReason: ExecApprovalUnavailableReason | null;
};
/** Creates, registers, and normalizes a default approval request context. */
export declare function createAndRegisterDefaultExecApprovalRequest(params: {
    warnings: string[];
    approvalRunningNoticeMs: number;
    createApprovalSlug: (approvalId: string) => string;
    turnSourceChannel?: string;
    turnSourceAccountId?: string;
    register: (approvalId: string) => Promise<ExecApprovalRegistration>;
}): Promise<RegisteredExecApprovalRequestContext>;
/** Builds the shared argument shape passed into default approval registration. */
export declare function buildDefaultExecApprovalRequestArgs(params: DefaultExecApprovalRequestArgs): DefaultExecApprovalRequestArgs;
/** Builds the immutable follow-up target passed to async approval continuations. */
export declare function buildExecApprovalFollowupTarget(params: ExecApprovalFollowupTarget): ExecApprovalFollowupTarget;
/** Builds mutable approval decision state from a raw decision. */
export declare function createExecApprovalDecisionState(params: {
    decision: string | null | undefined;
    askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}): {
    baseDecision: {
        approvedByAsk: boolean;
        deniedReason: string | null;
        timedOut: boolean;
    };
    approvedByAsk: boolean;
    deniedReason: string | null;
};
/** Prevents fallback approval from satisfying strict inline-eval/human-review paths. */
export declare function enforceStrictInlineEvalApprovalBoundary(params: {
    baseDecision: {
        timedOut: boolean;
    };
    approvedByAsk: boolean;
    deniedReason: string | null;
    requiresInlineEvalApproval: boolean;
    requiresAutoReviewHumanApproval?: boolean;
}): {
    approvedByAsk: boolean;
    deniedReason: string | null;
};
/** Returns true when a headless run should resolve an unavailable approval inline. */
export declare function shouldResolveExecApprovalUnavailableInline(params: {
    trigger?: string;
    unavailableReason: ExecApprovalUnavailableReason | null;
    preResolvedDecision: string | null | undefined;
}): boolean;
/** Builds the denial copy for headless runs that cannot wait for approval. */
export declare function buildHeadlessExecApprovalDeniedMessage(params: {
    trigger?: string;
    host: "gateway" | "node";
    security: ExecSecurity;
    ask: ExecAsk;
    askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}): string;
/** Sends async approval follow-up results with deduped warning logs on failure. */
export declare function sendExecApprovalFollowupResult(target: ExecApprovalFollowupTarget, resultText: string, deps?: ExecApprovalFollowupResultDeps): Promise<void>;
/** Renders an approval-pending or approval-unavailable exec tool result. */
export declare function buildExecApprovalPendingToolResult(params: {
    host: "gateway" | "node";
    command: string;
    cwd: string | undefined;
    warningText: string;
    approvalId: string;
    approvalSlug: string;
    expiresAtMs: number;
    initiatingSurface: ExecApprovalInitiatingSurfaceState;
    sentApproverDms: boolean;
    unavailableReason: ExecApprovalUnavailableReason | null;
    allowedDecisions?: readonly ExecApprovalDecision[];
    nodeId?: string;
}): AgentToolResult<ExecToolDetails>;
export {};
