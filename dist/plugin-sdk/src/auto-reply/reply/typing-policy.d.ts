import type { TypingPolicy } from "../types.js";
/** Inputs used to resolve typing behavior for one reply run. */
export type ResolveRunTypingPolicyParams = {
    requestedPolicy?: TypingPolicy;
    suppressTyping?: boolean;
    isHeartbeat?: boolean;
    originatingChannel?: string;
    systemEvent?: boolean;
};
/** Effective typing policy plus suppression flag for a reply run. */
export type ResolvedRunTypingPolicy = {
    typingPolicy: TypingPolicy;
    suppressTyping: boolean;
};
/** Resolves typing policy and suppresses typing for non-user-visible turns. */
export declare function resolveRunTypingPolicy(params: ResolveRunTypingPolicyParams): ResolvedRunTypingPolicy;
