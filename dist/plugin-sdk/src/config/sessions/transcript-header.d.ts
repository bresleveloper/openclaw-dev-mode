/** Inputs for the first JSONL entry in a session transcript. */
type SessionTranscriptHeaderParams = {
    sessionId?: string;
    cwd?: string;
};
/** Creates a session transcript header entry with current version metadata. */
export declare function createSessionTranscriptHeader(params?: SessionTranscriptHeaderParams): {
    type: string;
    version: number;
    id: string;
    timestamp: string;
    cwd: string;
};
export {};
