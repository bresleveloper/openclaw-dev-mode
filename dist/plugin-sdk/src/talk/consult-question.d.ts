export type RealtimeVoiceConsultQuestionMatchOptions = {
    /** Minimum overlap ratio against the smaller token set for fuzzy matches. */
    minTokenOverlapRatio?: number;
    /** Minimum number of non-stopword tokens that must overlap. */
    minTokenOverlapCount?: number;
};
export type RealtimeVoiceSpeakableToolResultOptions = {
    /** Candidate result keys to read from object-shaped tool output. */
    keys?: readonly string[];
    /** Maximum spoken result length before appending a truncation marker. */
    maxChars?: number;
    /** Whether a raw string result is allowed as speakable output. */
    stringResult?: boolean;
};
/** Read the consult question from a raw string or selected object keys. */
export declare function readRealtimeVoiceConsultQuestion(args: unknown, keys?: readonly string[]): string | undefined;
/** Normalize consult questions for stable matching across punctuation/casing. */
export declare function normalizeRealtimeVoiceConsultQuestion(value: string | undefined): string | undefined;
/** Compare two consult questions with exact, containment, and token-overlap matching. */
export declare function matchRealtimeVoiceConsultQuestions(left: string | undefined, right: string | undefined, options?: RealtimeVoiceConsultQuestionMatchOptions): boolean;
/** Extract a bounded speakable string from a tool result payload. */
export declare function readSpeakableRealtimeVoiceToolResult(result: unknown, options?: RealtimeVoiceSpeakableToolResultOptions): string | undefined;
