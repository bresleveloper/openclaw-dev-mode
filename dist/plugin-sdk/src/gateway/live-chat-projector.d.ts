export declare const MAX_LIVE_CHAT_BUFFER_CHARS = 500000;
/** Merges assistant full-text and delta events into a capped live buffer. */
export declare function resolveMergedAssistantText(params: {
    previousText: string;
    nextText: string;
    nextDelta: string;
}): string;
/** Removes runtime-only context/directive tags from live assistant event text. */
export declare function normalizeLiveAssistantEventText(params: {
    text: string;
    delta?: unknown;
}): {
    text: string;
    delta: string;
};
/** Projects buffered assistant text into display text or a suppressed/pending state. */
export declare function projectLiveAssistantBufferedText(rawText: string, options?: {
    suppressLeadFragments?: boolean;
}): {
    text: string;
    suppress: boolean;
    pendingLeadFragment: boolean;
};
/** Returns true when an assistant event phase should not appear in live chat. */
export declare function shouldSuppressAssistantEventForLiveChat(data: unknown): boolean;
