export declare function readResponseBodySnippet(response: Response, limits: {
    maxBytes: number;
    maxChars: number;
}): Promise<string>;
