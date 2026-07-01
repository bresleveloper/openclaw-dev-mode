/** Output mode requested by web_fetch extraction. */
export type ExtractMode = "markdown" | "text";
/** Collapses display whitespace while preserving paragraph breaks. */
export declare function normalizeWhitespace(value: string): string;
/** Converts sanitized HTML into coarse markdown plus an optional title. */
export declare function htmlToMarkdown(html: string): {
    text: string;
    title?: string;
};
/** Removes markdown decoration for plain text extraction. */
export declare function markdownToText(markdown: string): string;
/** Truncates text by characters and reports whether truncation occurred. */
export declare function truncateText(value: string, maxChars: number): {
    text: string;
    truncated: boolean;
};
/** Sanitizes HTML and extracts either markdown or plain text content. */
export declare function extractBasicHtmlContent(params: {
    html: string;
    extractMode: ExtractMode;
}): Promise<{
    text: string;
    title?: string;
} | null>;
