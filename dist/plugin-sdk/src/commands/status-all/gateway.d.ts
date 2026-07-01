/** Reads the last non-empty lines from a gateway log file, returning an empty list on read failure. */
export declare function readFileTailLines(filePath: string, maxLines: number): Promise<string[]>;
/** Summarizes gateway log tail lines, grouping repeated failures and trimming long output. */
export declare function summarizeLogTail(rawLines: string[], opts?: {
    maxLines?: number;
}): string[];
