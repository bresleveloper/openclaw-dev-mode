/** Trim a configured model id, fall back when empty, and strip known prefixes. */
export declare function normalizeEmbeddingModelWithPrefixes(params: {
    model: string;
    defaultModel: string;
    prefixes: string[];
}): string;
