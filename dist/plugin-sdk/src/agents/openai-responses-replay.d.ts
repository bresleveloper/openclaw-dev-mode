/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
export declare function resolveReplayableResponsesMessageId(params: {
    replayResponsesItemIds: boolean;
    textSignatureId?: string;
    fallbackId: string;
    fallbackOrdinal: number;
    previousReplayItemWasReasoning: boolean;
}): string | undefined;
