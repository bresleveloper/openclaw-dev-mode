type WriteJsonlFileOptions = {
    encoding?: BufferEncoding;
    flag?: string;
    mode?: number;
};
/** Serializes one JSONL entry and appends the newline terminator. */
export declare function serializeJsonlEntry(entry: unknown): string;
export declare function serializeJsonlLine(entry: unknown): string;
export declare function serializeJsonlEntries(entries: readonly unknown[]): string;
export declare function serializeJsonlLines(lines: readonly string[]): string;
export declare function writeJsonlEntriesSync(filePath: string, entries: readonly unknown[]): string;
export declare function appendJsonlEntrySync(filePath: string, entry: unknown, options?: {
    prefixNewline?: boolean;
}): string;
export declare function appendSerializedJsonlEntrySync(filePath: string, serializedEntry: string, options?: {
    prefixNewline?: boolean;
}): string;
export declare function writeJsonlEntry(filePath: string, entry: unknown, options?: WriteJsonlFileOptions): Promise<void>;
export declare function writeJsonlLines(filePath: string, lines: readonly string[], options?: WriteJsonlFileOptions): Promise<string>;
export declare function appendJsonlEntry(filePath: string, entry: unknown): Promise<void>;
export declare function appendSerializedJsonlEntry(filePath: string, serializedEntry: string): Promise<void>;
export {};
