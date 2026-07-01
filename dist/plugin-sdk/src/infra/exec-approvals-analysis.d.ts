import type { ExecCommandSegment } from "./exec-command-analysis-types.js";
export { analyzeArgvCommand } from "./exec-argv-analysis.js";
export { matchAllowlist, parseExecArgvToken, resolveAllowlistCandidatePath, resolveApprovalAuditCandidatePath, resolveApprovalAuditTrustPath, resolveCommandResolution, resolveCommandResolutionFromArgv, resolveExecutionTargetCandidatePath, resolveExecutionTargetResolution, resolveExecutionTargetTrustPath, resolvePolicyAllowlistCandidatePath, resolvePolicyTargetCandidatePath, resolvePolicyTargetResolution, resolvePolicyTargetTrustPath, resolveExecutableTrustPath, type CommandResolution, type ExecutableResolution, type ExecArgvToken, } from "./exec-command-resolution.js";
export { analyzeWindowsShellCommand, isWindowsPlatform, tokenizeWindowsSegment, windowsEscapeArg, } from "./windows-shell-command.js";
export type { ExecCommandAnalysis, ExecCommandSegment, ShellChainOperator, } from "./exec-command-analysis-types.js";
export declare function resolvePlannedSegmentArgv(segment: ExecCommandSegment): string[] | null;
export declare function buildEnforcedShellCommand(params: {
    command: string;
    segments: ExecCommandSegment[];
    platform?: string | null;
}): {
    ok: boolean;
    command?: string;
    reason?: string;
};
