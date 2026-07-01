import type { MediaUnderstandingOutput } from "./types.js";
/** Extracts user-authored text while ignoring synthetic media placeholder tokens. */
export declare function extractMediaUserText(body?: string): string | undefined;
/** Formats media-understanding outputs into the chat body sent back to the model. */
export declare function formatMediaUnderstandingBody(params: {
    body?: string;
    outputs: MediaUnderstandingOutput[];
}): string;
/** Formats one or more audio transcript outputs for legacy transcript-only callers. */
export declare function formatAudioTranscripts(outputs: MediaUnderstandingOutput[]): string;
