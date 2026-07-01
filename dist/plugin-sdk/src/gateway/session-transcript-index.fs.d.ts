type ParsedTranscriptRecord = Record<string, unknown>;
/** Visible transcript entry plus its byte range in the JSONL file. */
export type IndexedTranscriptEntry = {
    seq: number;
    id?: string;
    offset: number;
    byteLength: number;
    record: ParsedTranscriptRecord;
};
type SessionTranscriptIndex = {
    filePath: string;
    mtimeMs: number;
    size: number;
    hasTreeEntries: boolean;
    leafId?: string | null;
    entries: IndexedTranscriptEntry[];
    allEntries: IndexedTranscriptEntry[];
};
type ReadSessionTranscriptIndexOptions = {
    cache?: "reuse" | "skip";
    view?: "active" | "all";
};
/** Clears transcript index caches and in-flight builds between tests. */
export declare function clearSessionTranscriptIndexCache(): void;
/** Reads or builds the visible transcript index for a JSONL session file. */
export declare function readSessionTranscriptIndex(filePath: string, opts?: ReadSessionTranscriptIndexOptions): Promise<SessionTranscriptIndex | null>;
export {};
