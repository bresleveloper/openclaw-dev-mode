type ReactionToolContext = {
    currentMessageId?: string | number;
};
/**
 * Resolves the message id for reaction tools from explicit args or current tool context.
 */
export declare function resolveReactionMessageId(params: {
    args: Record<string, unknown>;
    toolContext?: ReactionToolContext;
}): string | number | undefined;
export {};
