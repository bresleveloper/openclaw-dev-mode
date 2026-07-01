type AssistantTurnLike = {
    role?: unknown;
    stopReason?: unknown;
    content?: unknown;
};
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
export declare function hasOnlyAssistantReasoningContent(message: AssistantTurnLike): boolean;
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
export declare function isReasoningOnlyLengthAssistantTurn(message: AssistantTurnLike): boolean;
export {};
