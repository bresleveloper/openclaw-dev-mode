import type { CommandExplanation } from "../command-explainer/types.js";
import type { ExecCommandSegment } from "../exec-approvals-analysis.js";
/** Compact command explanation summary shown in approval UI. */
export type CommandExplanationSummary = {
    commandCount: number;
    nestedCommandCount: number;
    riskKinds: string[];
    warningLines: string[];
};
/** Summarizes parsed shell-command explanation data for display. */
export declare function summarizeCommandExplanation(explanation: CommandExplanation): CommandExplanationSummary;
export declare function summarizeCommandSegmentsForDisplay(segments: readonly ExecCommandSegment[]): CommandExplanationSummary;
export declare function resolveCommandAnalysisSummaryForDisplay(params: {
    host?: string | null;
    commandText: string;
    commandArgv?: string[];
    cwd?: string | null;
    sanitizeText?: (value: string) => string;
}): Promise<CommandExplanationSummary | null>;
export declare function explainCommandForDisplay(command: string): Promise<{
    explanation: CommandExplanation;
    summary: CommandExplanationSummary;
} | null>;
