/**
 * Shared diff computation utilities for the edit tool.
 * Used by both edit.ts (for execution) and tool-execution.ts (for preview rendering).
 */
export declare function detectLineEnding(content: string): "\r\n" | "\n";
export declare function normalizeToLF(text: string): string;
export declare function restoreLineEndings(text: string, ending: "\r\n" | "\n"): string;
export interface Edit {
    oldText: string;
    newText: string;
}
/** Strip UTF-8 BOM if present, return both the BOM (if any) and the text without it */
export declare function stripBom(content: string): {
    bom: string;
    text: string;
};
/**
 * Apply one or more exact-text replacements to LF-normalized content.
 *
 * All edits are matched against the same original content. Replacements are
 * then applied in reverse order so offsets remain stable. If any edit needs
 * fuzzy matching, the operation runs in fuzzy-normalized content space to
 * preserve current single-edit behavior.
 */
export declare function applyEditsToNormalizedContent(normalizedContent: string, edits: Edit[], path: string): {
    baseContent: string;
    newContent: string;
};
/** Generate a standard unified patch. */
export declare function generateUnifiedPatch(path: string, oldContent: string, newContent: string, contextLines?: number): string;
/**
 * Generate a display-oriented diff string with line numbers and context.
 * Returns both the diff string and the first changed line number (in the new file).
 */
export declare function generateDiffString(oldContent: string, newContent: string, contextLines?: number): {
    diff: string;
    firstChangedLine: number | undefined;
};
export interface EditDiffResult {
    diff: string;
    firstChangedLine: number | undefined;
}
export interface EditDiffError {
    error: string;
}
/**
 * Compute the diff for one or more edit operations without applying them.
 * Used for preview rendering in the TUI before the tool executes.
 */
export declare function computeEditsDiff(path: string, edits: Edit[], cwd: string, operations?: {
    readFile: (absolutePath: string) => Promise<Buffer | string>;
    access: (absolutePath: string) => Promise<void>;
}): Promise<EditDiffResult | EditDiffError>;
