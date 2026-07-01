/** Renders sanitized attachment text as a model-visible file block without allowing file-tag injection. */
export declare function renderFileContextBlock(params: {
    filename?: string | null;
    fallbackName?: string;
    mimeType?: string | null;
    content: string;
    surroundContentWithNewlines?: boolean;
}): string;
