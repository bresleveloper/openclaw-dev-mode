/** Normalized qmd query result consumed by memory search. */
export type QmdQueryResult = {
    docid?: string;
    score?: number;
    collection?: string;
    file?: string;
    snippet?: string;
    body?: string;
    startLine?: number;
    endLine?: number;
};
/** Parse qmd stdout/stderr into normalized results, accepting known no-result markers. */
export declare function parseQmdQueryJson(stdout: string, stderr: string): QmdQueryResult[];
