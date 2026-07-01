import { type ParsedThreadSessionSuffix } from "../../sessions/session-key-utils.js";
/**
 * Normalized conversation id details for one channel raw id.
 */
export type ResolvedSessionConversation = {
    id: string;
    threadId: string | undefined;
    baseConversationId: string;
    parentConversationCandidates: string[];
};
/**
 * Parsed session-key conversation reference with parent/thread metadata.
 */
export type ResolvedSessionConversationRef = {
    channel: string;
    kind: "group" | "channel";
    rawId: string;
    id: string;
    threadId: string | undefined;
    baseSessionKey: string;
    baseConversationId: string;
    parentConversationCandidates: string[];
};
type SessionConversationResolutionOptions = {
    bundledFallback?: boolean;
};
/**
 * Resolves one raw channel conversation id into base/thread conversation metadata.
 */
export declare function resolveSessionConversation(params: {
    channel: string;
    kind: "group" | "channel";
    rawId: string;
    bundledFallback?: boolean;
}): ResolvedSessionConversation | null;
export declare function resolveSessionConversationRef(sessionKey: string | undefined | null, opts?: SessionConversationResolutionOptions): ResolvedSessionConversationRef | null;
/**
 * Resolves thread suffix metadata from a session key, using channel hooks when available.
 */
export declare function resolveSessionThreadInfo(sessionKey: string | undefined | null, opts?: SessionConversationResolutionOptions): ParsedThreadSessionSuffix;
/**
 * Resolves the parent session key for a threaded child session.
 */
export declare function resolveSessionParentSessionKey(sessionKey: string | undefined | null): string | null;
export {};
