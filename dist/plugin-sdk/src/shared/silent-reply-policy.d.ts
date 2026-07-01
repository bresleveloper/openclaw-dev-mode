export type SilentReplyPolicy = "allow" | "disallow";
export type SilentReplyConversationType = "direct" | "group" | "internal";
export type SilentReplyPolicyShape = Partial<Record<Exclude<SilentReplyConversationType, "direct">, SilentReplyPolicy>>;
export declare const DEFAULT_SILENT_REPLY_POLICY: Record<SilentReplyConversationType, SilentReplyPolicy>;
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
export declare function classifySilentReplyConversationType(params: {
    sessionKey?: string;
    surface?: string;
    conversationType?: SilentReplyConversationType;
}): SilentReplyConversationType;
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
export declare function resolveSilentReplyPolicyFromPolicies(params: {
    conversationType: SilentReplyConversationType;
    defaultPolicy?: SilentReplyPolicyShape;
    surfacePolicy?: SilentReplyPolicyShape;
}): SilentReplyPolicy;
