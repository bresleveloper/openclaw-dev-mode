/**
 * Chooses the best conversation id from an explicit thread id or outbound targets.
 */
export declare function resolveConversationIdFromTargets(params: {
    threadId?: string | number;
    targets: Array<string | undefined | null>;
}): string | undefined;
