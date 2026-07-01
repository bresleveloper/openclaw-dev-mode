import type { MentionPatternsMode, MentionPatternsPolicyConfig } from "../config/types.messages.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Inputs for resolving whether mention-pattern matching is enabled in a conversation.
 */
export type ResolveMentionPatternPolicyParams = {
    cfg?: OpenClawConfig;
    provider?: string;
    conversationId?: string | null;
    providerPolicy?: MentionPatternsPolicyConfig;
    agentId?: string;
};
/**
 * Effective mention-pattern policy after provider and conversation allow/deny rules.
 */
export type ResolvedMentionPatternPolicy = {
    effectiveMode: MentionPatternsMode;
    allowMatched: boolean;
    denyMatched: boolean;
    enabled: boolean;
};
/**
 * Resolves provider-scoped mention-pattern policy for a single conversation.
 */
export declare function resolveMentionPatternPolicy(params: ResolveMentionPatternPolicyParams): ResolvedMentionPatternPolicy;
