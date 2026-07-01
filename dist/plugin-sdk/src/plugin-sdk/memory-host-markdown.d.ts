/**
 * Public SDK helpers for maintaining generated blocks inside Markdown files.
 */
export type ManagedMarkdownBlockParams = {
    original: string;
    body: string;
    startMarker: string;
    endMarker: string;
    heading?: string;
};
/** Ensures generated Markdown content ends with exactly the caller-provided body plus newline. */
export declare function withTrailingNewline(content: string): string;
/** Replaces all existing managed blocks with one current block, or appends it if missing. */
export declare function replaceManagedMarkdownBlock(params: ManagedMarkdownBlockParams): string;
