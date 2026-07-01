import type { ExecCommandAnalysis } from "./exec-command-analysis-types.js";
export declare function analyzeArgvCommand(params: {
    argv: string[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    platform?: string | null;
}): ExecCommandAnalysis;
