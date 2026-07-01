import type { ConversationRef, SessionBindingBindInput, SessionBindingCapabilities, SessionBindingRecord, SessionBindingUnbindInput } from "./session-binding.types.js";
/** Reports generic current-conversation binding support for plugin-owned channels. */
export declare function getGenericCurrentConversationBindingCapabilities(params: {
    channel: string;
    accountId: string;
}): SessionBindingCapabilities | null;
/** Stores or replaces the current-conversation binding for a normalized conversation ref. */
export declare function bindGenericCurrentConversation(input: SessionBindingBindInput): Promise<SessionBindingRecord | null>;
/** Resolves a current-conversation binding and prunes it if its TTL has expired. */
export declare function resolveGenericCurrentConversationBinding(ref: ConversationRef): SessionBindingRecord | null;
/** Lists non-expired current-conversation bindings owned by one target session. */
export declare function listGenericCurrentConversationBindingsBySession(targetSessionKey: string): SessionBindingRecord[];
/** Persists last-activity metadata for an existing generic current-conversation binding. */
export declare function touchGenericCurrentConversationBinding(bindingId: string, at?: number): void;
/** Removes generic current-conversation bindings by binding id or target session key. */
export declare function unbindGenericCurrentConversationBindings(input: SessionBindingUnbindInput): Promise<SessionBindingRecord[]>;
export declare const testing: {
    resetCurrentConversationBindingsForTests(params?: {
        deletePersistedFile?: boolean;
        env?: NodeJS.ProcessEnv;
    }): void;
};
export { testing as __testing };
