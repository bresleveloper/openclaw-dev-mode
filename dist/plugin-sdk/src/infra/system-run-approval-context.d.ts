import type { AllowAlwaysPattern, ExecAsk, ExecSecurity, SystemRunApprovalPlan } from "./exec-approvals.js";
export type PreparedRunExecPolicy = {
    security: ExecSecurity;
    ask: ExecAsk;
};
type PreparedRunPayload = {
    plan: SystemRunApprovalPlan;
    execPolicy?: PreparedRunExecPolicy;
    allowAlwaysCoverage?: {
        complete: boolean;
        patterns: AllowAlwaysPattern[];
    };
};
type SystemRunApprovalRequestContext = {
    plan: SystemRunApprovalPlan | null;
    commandArgv: string[] | undefined;
    commandText: string;
    commandPreview: string | null;
    cwd: string | null;
    agentId: string | null;
    sessionKey: string | null;
};
type SystemRunApprovalRuntimeContext = {
    ok: true;
    plan: SystemRunApprovalPlan | null;
    argv: string[];
    cwd: string | null;
    agentId: string | null;
    sessionKey: string | null;
    commandText: string;
} | {
    ok: false;
    message: string;
    details?: Record<string, unknown>;
};
export declare function parsePreparedSystemRunPayload(payload: unknown): PreparedRunPayload | null;
/** Build the approval request context from tool payload fields. */
export declare function resolveSystemRunApprovalRequestContext(params: {
    host?: unknown;
    command?: unknown;
    commandArgv?: unknown;
    systemRunPlan?: unknown;
    cwd?: unknown;
    agentId?: unknown;
    sessionKey?: unknown;
}): SystemRunApprovalRequestContext;
/** Build the runtime approval context from already-normalized command inputs. */
export declare function resolveSystemRunApprovalRuntimeContext(params: {
    plan?: unknown;
    command?: unknown;
    rawCommand?: unknown;
    cwd?: unknown;
    agentId?: unknown;
    sessionKey?: unknown;
}): SystemRunApprovalRuntimeContext;
export {};
