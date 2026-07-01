import { type ExecCommandAnalysis, type ExecCommandSegment, type ExecutableResolution } from "./exec-approvals-analysis.js";
import type { ExecAllowlistEntry } from "./exec-approvals.types.js";
import { type ExecAuthorizationPlan } from "./exec-authorization-plan.js";
import { type SafeBinProfile } from "./exec-safe-bin-policy.js";
import { isTrustedSafeBinPath } from "./exec-safe-bin-trust.js";
export declare function normalizeSafeBins(entries?: readonly string[]): Set<string>;
export declare function resolveSafeBins(entries?: readonly string[] | null): Set<string>;
export declare function isSafeBinUsage(params: {
    argv: string[];
    resolution: ExecutableResolution | null;
    safeBins: Set<string>;
    platform?: string | null;
    trustedSafeBinDirs?: ReadonlySet<string>;
    safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
    isTrustedSafeBinPathFn?: typeof isTrustedSafeBinPath;
}): boolean;
export type ExecAllowlistEvaluation = {
    allowlistSatisfied: boolean;
    allowlistMatches: ExecAllowlistEntry[];
    segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
    segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
};
export type ExecSegmentSatisfiedBy = "allowlist" | "safeBins" | "inlineChain" | "safeBuiltins" | "skills" | null;
export type SkillBinTrustEntry = {
    name: string;
    resolvedPath: string;
};
type ExecAllowlistContext = {
    allowlist: ExecAllowlistEntry[];
    safeBins: Set<string>;
    safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
    trustedSafeBinDirs?: ReadonlySet<string>;
    skillBins?: readonly SkillBinTrustEntry[];
    autoAllowSkills?: boolean;
    allowShellBuiltins?: boolean;
};
export declare function evaluateExecAllowlist(params: {
    analysis: ExecCommandAnalysis;
} & ExecAllowlistContext): ExecAllowlistEvaluation;
export type ExecAllowlistAnalysis = {
    analysisOk: boolean;
    allowlistSatisfied: boolean;
    allowlistMatches: ExecAllowlistEntry[];
    segments: ExecCommandSegment[];
    segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
    segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
    authorizationPlan?: ExecAuthorizationPlan;
};
export type AllowAlwaysPattern = {
    pattern: string;
    argPattern?: string;
};
/**
 * Derive persisted allowlist patterns for an "allow always" decision.
 * When a command is wrapped in a shell (for example `zsh -lc "<cmd>"`),
 * persist the inner executable(s) rather than the shell binary.
 */
export declare function resolveAllowAlwaysPatternEntries(params: {
    segments: ExecCommandSegment[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
    strictInlineEval?: boolean;
}): AllowAlwaysPattern[];
export declare function resolveAllowAlwaysPatterns(params: {
    segments: ExecCommandSegment[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
    strictInlineEval?: boolean;
}): string[];
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
export declare function evaluateShellAllowlist(params: {
    command: string;
    env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): ExecAllowlistAnalysis;
export declare function evaluateShellAllowlistWithAuthorization(params: {
    command: string;
    env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): Promise<ExecAllowlistAnalysis>;
export declare function evaluateExecAllowlistWithAuthorization(params: {
    analysis: ExecCommandAnalysis;
    command?: string;
} & ExecAllowlistContext): Promise<ExecAllowlistEvaluation & {
    segments?: ExecCommandSegment[];
    authorizationPlan?: ExecAuthorizationPlan;
}>;
export {};
