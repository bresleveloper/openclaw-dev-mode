import type { CommandOperator, CommandStep } from "./command-explainer/types.js";
import { type ExecCommandAnalysis, type ExecCommandSegment, type ShellChainOperator } from "./exec-approvals-analysis.js";
export type ExecAuthorizationDialect = "argv" | "posix-shell" | "windows-cmd" | "powershell";
export type ExecAuthorizationTransport = {
    kind: "direct";
} | {
    kind: "shell-wrapper";
    wrapperSegment: ExecCommandSegment;
    wrapperArgv: string[];
    wrapperPrefix: string;
    inlineCommand: string;
};
export type ExecAuthorizationTrustMode = "executable" | "exact-command" | "prompt-only";
export type ExecAuthorizationCandidate = {
    sourceSegment: ExecCommandSegment;
    sourceStep: CommandStep;
    sourceStepId?: string;
    transport: ExecAuthorizationTransport;
    trustMode: ExecAuthorizationTrustMode;
    allowAlways: boolean;
    reasons: string[];
};
export type ExecAuthorizationGroup = {
    opToNext?: ShellChainOperator | null;
    candidates: ExecAuthorizationCandidate[];
};
export type ExecAuthorizationPlan = {
    ok: true;
    dialect: ExecAuthorizationDialect;
    originalCommand: string;
    groups: ExecAuthorizationGroup[];
    operators: CommandOperator[];
} | {
    ok: false;
    dialect: ExecAuthorizationDialect;
    originalCommand: string;
    reason: string;
    groups: [];
    operators: [];
};
export declare const POSITIONAL_CARRIER_BLOCKED_EXECUTABLES: Set<string>;
export declare function canUseReusableWrapperPayloadCandidates(segments: readonly ExecCommandSegment[]): boolean;
export declare function planShellAuthorization(params: {
    command: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
}): Promise<ExecAuthorizationPlan>;
export declare function planExecAuthorization(params: {
    analysis: ExecCommandAnalysis;
    command?: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
}): Promise<ExecAuthorizationPlan>;
