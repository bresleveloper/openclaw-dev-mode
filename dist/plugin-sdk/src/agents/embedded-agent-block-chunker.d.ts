export type BlockReplyChunking = {
    minChars: number;
    maxChars: number;
    breakPreference?: "paragraph" | "newline" | "sentence";
    /** When true, prefer \n\n paragraph boundaries once minChars has been satisfied. */
    flushOnParagraph?: boolean;
};
export declare class EmbeddedBlockChunker {
    #private;
    constructor(chunking: BlockReplyChunking);
    /** Add streamed text to the pending chunk buffer. */
    append(text: string): void;
    /** Clear any buffered reply text without emitting it. */
    reset(): void;
    /** Return the currently buffered text for tests and flush logic. */
    get bufferedText(): string;
    /** Return true when there is pending text to drain. */
    hasBuffered(): boolean;
    /** Emit safe chunks according to size and Markdown fence constraints. */
    drain(params: {
        force: boolean;
        emit: (chunk: string) => void;
    }): void;
}
