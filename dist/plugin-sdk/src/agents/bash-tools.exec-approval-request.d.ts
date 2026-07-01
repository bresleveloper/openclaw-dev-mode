import type { ExecApprovalCommandSpan, ExecApprovalUnavailableDecision, ExecAsk, ExecSecurity, SystemRunApprovalPlan } from "../infra/exec-approvals.js";
/** Gateway payload fields used to register or wait for an exec approval decision. */
type RequestExecApprovalDecisionParams = {
    id: string;
    command?: string;
    commandArgv?: string[];
    systemRunPlan?: SystemRunApprovalPlan;
    env?: Record<string, string>;
    cwd: string | undefined;
    nodeId?: string;
    host: "gateway" | "node";
    security: ExecSecurity;
    ask: ExecAsk;
    warningText?: string;
    commandSpans?: ExecApprovalCommandSpan[];
    unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
    agentId?: string;
    resolvedPath?: string;
    sessionKey?: string;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    approvalReviewerDeviceIds?: string[];
    requireDeliveryRoute?: boolean;
    suppressDelivery?: boolean;
};
/** Registration result returned before an approval decision is available. */
export type ExecApprovalRegistration = {
    id: string;
    expiresAtMs: number;
    finalDecision?: string | null;
};
/** Registers a two-phase exec approval request with the gateway. */
export declare function registerExecApprovalRequest(params: RequestExecApprovalDecisionParams): Promise<ExecApprovalRegistration>;
/** Uses a pre-resolved decision or waits for the registered approval id. */
export declare function resolveRegisteredExecApprovalDecision(params: {
    approvalId: string;
    preResolvedDecision: string | null | undefined;
}): Promise<string | null>;
type HostExecApprovalParams = {
    approvalId: string;
    command?: string;
    commandArgv?: string[];
    systemRunPlan?: SystemRunApprovalPlan;
    env?: Record<string, string>;
    workdir: string | undefined;
    host: "gateway" | "node";
    nodeId?: string;
    security: ExecSecurity;
    ask: ExecAsk;
    warningText?: string;
    commandSpans?: ExecApprovalCommandSpan[];
    unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
    commandHighlighting?: boolean;
    agentId?: string;
    resolvedPath?: string;
    sessionKey?: string;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    approvalReviewerDeviceIds?: string[];
    requireDeliveryRoute?: boolean;
    suppressDelivery?: boolean;
};
type ExecApprovalRequesterContext = {
    agentId?: string;
    sessionKey?: string;
};
/** Builds requester identity context for an approval payload. */
export declare function buildExecApprovalRequesterContext(params: ExecApprovalRequesterContext): {
    agentId?: string;
    sessionKey?: string;
};
type ExecApprovalTurnSourceContext = {
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
};
/** Builds originating channel context for approval delivery/routing. */
export declare function buildExecApprovalTurnSourceContext(params: ExecApprovalTurnSourceContext): ExecApprovalTurnSourceContext;
/** Registers a host/node approval request without waiting for a decision. */
export declare function registerExecApprovalRequestForHost(params: HostExecApprovalParams): Promise<ExecApprovalRegistration>;
/** Registers a host/node approval request and wraps failures for exec callers. */
export declare function registerExecApprovalRequestForHostOrThrow(params: HostExecApprovalParams): Promise<ExecApprovalRegistration>;
export {};
