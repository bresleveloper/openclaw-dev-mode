import { type ExecCommandAnalysis, type ExecCommandSegment } from "../exec-approvals-analysis.js";
/** Normalized policy analysis result for argv and shell commands. */
export type CommandPolicyAnalysis = {
    ok: true;
    source: "argv" | "shell";
    analysis: ExecCommandAnalysis;
    segments: ExecCommandSegment[];
} | {
    ok: false;
    source: "argv" | "shell";
    reason?: string;
    analysis: ExecCommandAnalysis;
    segments: [];
};
/** Parses a shell or argv command into command segments for approval policy checks. */
export declare function analyzeCommandForPolicy(params: {
    source: "argv";
    argv: string[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}): CommandPolicyAnalysis;
export declare function detectPolicyInlineEval(segments: readonly ExecCommandSegment[]): import("./inline-eval.ts").InterpreterInlineEvalHit | null;
