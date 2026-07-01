/** Normalizes Windows separators for command output paths. */
export declare const toPosixPath: (value: string) => string;
/** Formats a labeled daemon output line with terminal-aware styling. */
export declare function formatLine(label: string, value: string): string;
export declare function writeFormattedLines(stdout: NodeJS.WritableStream, lines: Array<{
    label: string;
    value: string;
}>, opts?: {
    leadingBlankLine?: boolean;
}): void;
