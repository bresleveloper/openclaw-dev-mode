/** Minimal OpenAI-compatible embedding batch output line. */
export type EmbeddingBatchOutputLine = {
    custom_id?: string;
    error?: {
        message?: string;
    };
    response?: {
        status_code?: number;
        body?: {
            data?: Array<{
                embedding?: number[];
            }>;
            error?: {
                message?: string;
            };
        } | string;
    };
};
/** Apply one output line, collecting errors and successful embeddings by custom id. */
export declare function applyEmbeddingBatchOutputLine(params: {
    line: EmbeddingBatchOutputLine;
    remaining: Set<string>;
    errors: string[];
    byCustomId: Map<string, number[]>;
}): void;
