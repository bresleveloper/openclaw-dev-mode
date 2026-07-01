type ResponseTextSnippetOptions = {
    maxBytes?: number;
    maxChars?: number;
    signal?: AbortSignal;
};
type ResponseJsonOptions = {
    maxBytes?: number;
    errorPrefix: string;
    signal?: AbortSignal;
};
/** Read a small collapsed text snippet from a response body. */
export declare function readResponseTextSnippet(res: Response, options?: ResponseTextSnippetOptions): Promise<string>;
/** Read and parse JSON while enforcing a hard byte limit. */
export declare function readResponseJsonWithLimit(res: Response, options: ResponseJsonOptions): Promise<unknown>;
export {};
