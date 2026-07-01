import type { EmbeddedContextFile } from "./embedded-agent-helpers.js";
import type { WorkspaceBootstrapFile } from "./workspace.js";
type BootstrapTruncationCause = "per-file-limit" | "total-limit";
type BootstrapPromptWarningMode = "off" | "once" | "always";
type BootstrapInjectionStat = {
    name: string;
    path: string;
    missing: boolean;
    rawChars: number;
    injectedChars: number;
    truncated: boolean;
};
type BootstrapAnalyzedFile = BootstrapInjectionStat & {
    nearLimit: boolean;
    causes: BootstrapTruncationCause[];
};
type BootstrapBudgetAnalysis = {
    files: BootstrapAnalyzedFile[];
    truncatedFiles: BootstrapAnalyzedFile[];
    nearLimitFiles: BootstrapAnalyzedFile[];
    totalNearLimit: boolean;
    hasTruncation: boolean;
    totals: {
        rawChars: number;
        injectedChars: number;
        truncatedChars: number;
        bootstrapMaxChars: number;
        bootstrapTotalMaxChars: number;
        nearLimitRatio: number;
    };
};
type BootstrapPromptWarning = {
    signature?: string;
    warningShown: boolean;
    lines: string[];
    warningSignaturesSeen: string[];
};
type BootstrapTruncationReportMeta = {
    warningMode: BootstrapPromptWarningMode;
    warningShown: boolean;
    promptWarningSignature?: string;
    warningSignaturesSeen?: string[];
    truncatedFiles: number;
    nearLimitFiles: number;
    totalNearLimit: boolean;
};
/** Restores prompt-warning dedupe state from a previous bootstrap report. */
export declare function resolveBootstrapWarningSignaturesSeen(report?: {
    bootstrapTruncation?: {
        warningMode?: BootstrapPromptWarningMode;
        warningSignaturesSeen?: string[];
        promptWarningSignature?: string;
    };
}): string[];
/** Compares raw bootstrap files with the injected context files the agent received. */
export declare function buildBootstrapInjectionStats(params: {
    bootstrapFiles: WorkspaceBootstrapFile[];
    injectedFiles: EmbeddedContextFile[];
}): BootstrapInjectionStat[];
/** Classifies bootstrap truncation and near-limit pressure for prompt/report output. */
export declare function analyzeBootstrapBudget(params: {
    files: BootstrapInjectionStat[];
    bootstrapMaxChars: number;
    bootstrapTotalMaxChars: number;
    nearLimitRatio?: number;
}): BootstrapBudgetAnalysis;
/** Decides whether to show a prompt warning and returns the updated dedupe state. */
export declare function buildBootstrapPromptWarning(params: {
    analysis: BootstrapBudgetAnalysis;
    mode: BootstrapPromptWarningMode;
    previousSignature?: string;
    seenSignatures?: string[];
    maxFiles?: number;
}): BootstrapPromptWarning;
/** Appends a detailed truncation warning block to the agent prompt when needed. */
export declare function appendBootstrapPromptWarning(prompt: string, warningLines?: string[], options?: {
    preserveExactPrompt?: string;
}): string;
/** Builds the compact truncation notice mirrored into run metadata. */
export declare function buildBootstrapPromptWarningNotice(warningLines?: string[]): string | undefined;
/** Serializes truncation warning state for run reports and future dedupe. */
export declare function buildBootstrapTruncationReportMeta(params: {
    analysis: BootstrapBudgetAnalysis;
    warningMode: BootstrapPromptWarningMode;
    warning: BootstrapPromptWarning;
}): BootstrapTruncationReportMeta;
export {};
