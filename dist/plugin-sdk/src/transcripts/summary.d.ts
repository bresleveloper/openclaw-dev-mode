import type { TranscriptSessionDescriptor, TranscriptUtterance } from "./provider-types.js";
/**
 * Lightweight transcript summarization and markdown rendering.
 *
 * This is a deterministic heuristic summary used for captured/imported
 * transcripts when no model-backed summarizer is involved.
 */
/** Summary artifact written alongside transcript sessions. */
export type TranscriptsSummary = {
    sessionId: string;
    title: string;
    generatedAt: string;
    overview: string;
    transcript: string[];
    decisions: string[];
    actionItems: string[];
    risks: string[];
    utteranceCount: number;
};
/** Build a deterministic summary from transcript utterances. */
export declare function summarizeTranscripts(params: {
    session: TranscriptSessionDescriptor;
    utterances: TranscriptUtterance[];
}): TranscriptsSummary;
/** Render a transcript summary as markdown for local artifacts. */
export declare function renderTranscriptsMarkdown(summary: TranscriptsSummary): string;
