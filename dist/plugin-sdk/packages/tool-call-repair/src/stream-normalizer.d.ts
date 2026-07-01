export type PlainTextToolCallNameMatcher = {
    /** True only when the candidate is a complete tool name this request may repair. */
    hasExactName(name: string): boolean;
    /** True while streamed bytes still match at least one repairable tool name prefix. */
    hasNamePrefix(prefix: string): boolean;
};
/** Result of repairing the final message carried by a provider stream `done` event. */
export type PlainTextToolCallMessageNormalization = {
    kind: "promoted" | "scrubbed";
    message: Record<string, unknown>;
} | undefined;
/** Stream-level hooks used to promote leaked text tool calls into provider events. */
export type PlainTextToolCallStreamNormalizerOptions = {
    /** Expands a promoted final message into provider-native tool-call stream events. */
    createPromotedToolCallEvents(message: Record<string, unknown>): Iterable<unknown>;
    /** Tool-name matcher scoped to the exact request being normalized. */
    matcher: PlainTextToolCallNameMatcher;
    /** Repairs or scrubs the final done-message snapshot after text buffering completes. */
    normalizeDoneMessage(params: {
        message: unknown;
        reason: unknown;
    }): PlainTextToolCallMessageNormalization;
    /** Stop after the first normalized done event when the wrapped provider has completed. */
    stopAfterDone?: boolean;
};
/** Scrubs final messages whose streamed plain-text tool-call prefix exceeded the buffer cap. */
export declare function scrubOverCapPlainTextToolCallMessage(params: {
    candidateText: string | undefined;
    matcher: PlainTextToolCallNameMatcher;
    message: unknown;
}): Record<string, unknown> | undefined;
/** Buffers provider stream text long enough to promote or hide leaked plain-text tool calls. */
export declare function normalizePlainTextToolCallStreamEvents(source: AsyncIterable<unknown>, options: PlainTextToolCallStreamNormalizerOptions): AsyncGenerator;
