/** Parses an account-prefixed binding id back into a conversation id. */
export declare function resolveThreadBindingConversationIdFromBindingId(params: {
    accountId: string;
    bindingId?: string;
}): string | undefined;
