interface DeepSeekTextFilter {
    /** Push one streamed text chunk and receive any safe visible text segments. */
    push(chunk: string): string[];
    /** Flush buffered text at stream end, dropping any unterminated DSML block. */
    flush(): string[];
}
/** Create an incremental text filter that strips DeepSeek DSML tool blocks. */
export declare function createDeepSeekTextFilter(): DeepSeekTextFilter;
export {};
