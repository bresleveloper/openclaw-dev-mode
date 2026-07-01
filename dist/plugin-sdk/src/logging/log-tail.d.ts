/** Payload returned to log-tail callers with cursor and truncation metadata. */
export type LogTailPayload = {
    file: string;
    cursor: number;
    size: number;
    lines: string[];
    truncated: boolean;
    reset: boolean;
};
/** Resolves a rolling daily log path to the newest existing rolling log when needed. */
export declare function resolveLogFile(file: string): Promise<string>;
/** Reads and redacts the configured log tail with bounded bytes and line count. */
export declare function readConfiguredLogTail(params?: {
    cursor?: number;
    limit?: number;
    maxBytes?: number;
}): Promise<LogTailPayload>;
