import type { ConfigValidationIssue } from "./types.js";
type ConfigIssueLineInput = {
    path?: string | null;
    message: string;
};
type ConfigIssueFormatOptions = {
    normalizeRoot?: boolean;
};
type ConfigIssueSummaryOptions = ConfigIssueFormatOptions & {
    maxIssues?: number;
};
/** Normalize missing or blank config issue paths to the root marker used in CLI output. */
export declare function normalizeConfigIssuePath(path: string | null | undefined): string;
/** Return the public config issue shape with a normalized path and non-empty allowed values. */
export declare function normalizeConfigIssue(issue: ConfigValidationIssue): ConfigValidationIssue;
/** Normalize a batch of config validation issues for display or JSON output. */
export declare function normalizeConfigIssues(issues: ReadonlyArray<ConfigValidationIssue>): ConfigValidationIssue[];
/**
 * Format one config issue for terminal output.
 * Path and message are sanitized because issues can include user-edited config text.
 */
export declare function formatConfigIssueLine(issue: ConfigIssueLineInput, marker?: string, opts?: ConfigIssueFormatOptions): string;
/** Format config issues as terminal-safe lines with a shared marker prefix. */
export declare function formatConfigIssueLines(issues: ReadonlyArray<ConfigIssueLineInput>, marker?: string, opts?: ConfigIssueFormatOptions): string[];
/** Build a compact, terminal-safe issue summary for logs and recovery diagnostics. */
export declare function formatConfigIssueSummary(issues: ReadonlyArray<ConfigIssueLineInput>, opts?: ConfigIssueSummaryOptions): string | null;
export {};
