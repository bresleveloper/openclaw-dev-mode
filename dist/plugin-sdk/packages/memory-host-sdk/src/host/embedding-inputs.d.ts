/** Text part passed through embedding providers that support structured input. */
export type EmbeddingInputTextPart = {
    type: "text";
    text: string;
};
/** Inline binary payload encoded for providers with multimodal embedding support. */
export type EmbeddingInputInlineDataPart = {
    type: "inline-data";
    mimeType: string;
    data: string;
};
/** Single structured embedding input part. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;
/** Provider-facing input while preserving the plain text fallback. */
export type EmbeddingInput = {
    text: string;
    parts?: EmbeddingInputPart[];
};
/** Build the common text-only embedding input shape. */
export declare function buildTextEmbeddingInput(text: string): EmbeddingInput;
/** Narrow an embedding part to an inline-data payload. */
export declare function isInlineDataEmbeddingInputPart(part: EmbeddingInputPart): part is EmbeddingInputInlineDataPart;
/** Return true when a chunk needs structured provider handling, not text splitting. */
export declare function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean;
