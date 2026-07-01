import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExecApprovalDecision, type ExecApprovalsFile, type ExecAsk, type ExecMode, type ExecSecurity, type ExecTarget } from "./exec-approvals.js";
type ExecPolicyConfig = {
    host?: ExecTarget;
    mode?: ExecMode;
    security?: ExecSecurity;
    ask?: ExecAsk;
};
type ExecPolicyHostSummary = {
    requested: ExecTarget;
    requestedSource: string;
};
type ExecPolicyFieldSummary<TValue extends ExecSecurity | ExecAsk> = {
    requested: TValue;
    requestedSource: string;
    host: TValue;
    hostSource: string;
    effective: TValue;
    note: string;
};
export type ExecPolicyScopeSnapshot = {
    scopeLabel: string;
    configPath: string;
    agentId?: string;
    host: ExecPolicyHostSummary;
    mode: {
        requested: ExecMode;
        requestedSource: string;
        effective: ExecMode;
        note: string;
    };
    security: ExecPolicyFieldSummary<ExecSecurity>;
    ask: ExecPolicyFieldSummary<ExecAsk>;
    askFallback: {
        effective: ExecSecurity;
        source: string;
    };
    allowedDecisions: readonly ExecApprovalDecision[];
};
export declare function collectExecPolicyScopeSnapshots(params: {
    cfg: OpenClawConfig;
    approvals: ExecApprovalsFile;
    hostPath?: string;
}): ExecPolicyScopeSnapshot[];
export declare function resolveExecPolicyScopeSnapshot(params: {
    approvals: ExecApprovalsFile;
    scopeExecConfig?: ExecPolicyConfig | undefined;
    globalExecConfig?: ExecPolicyConfig | undefined;
    configPath: string;
    scopeLabel: string;
    agentId?: string;
    hostPath?: string;
}): ExecPolicyScopeSnapshot;
export {};
