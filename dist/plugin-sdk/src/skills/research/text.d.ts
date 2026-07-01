/** Extracts role/text pairs from mixed transcript message shapes. */
export declare function extractTranscriptText(messages: unknown[]): Array<{
    role: string;
    text: string;
}>;
export declare function compactWhitespace(value: string): string;
