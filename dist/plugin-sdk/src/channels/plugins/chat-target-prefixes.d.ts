/**
 * Prefix mapping for service-qualified target strings.
 */
export type ServicePrefix<TService extends string> = {
    prefix: string;
    service: TService;
};
/**
 * Normalized input used by chat target prefix parsers.
 */
export type ChatTargetPrefixesParams = {
    trimmed: string;
    lower: string;
    chatIdPrefixes: string[];
    chatGuidPrefixes: string[];
    chatIdentifierPrefixes: string[];
};
/**
 * Parsed conversation target forms accepted by channel allowlists and target resolvers.
 */
export type ParsedChatTarget = {
    kind: "chat_id";
    chatId: number;
} | {
    kind: "chat_guid";
    chatGuid: string;
} | {
    kind: "chat_identifier";
    chatIdentifier: string;
};
/**
 * Parsed allowlist target, including sender handles.
 */
export type ParsedChatAllowTarget = ParsedChatTarget | {
    kind: "handle";
    handle: string;
};
/**
 * Sender metadata used for chat-aware allowlist checks.
 */
export type ChatSenderAllowParams = {
    allowFrom: Array<string | number>;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
    allowConversationTargets?: boolean | null;
};
/**
 * Checks whether a sender or current conversation matches an allowlist entry.
 */
export declare function isAllowedParsedChatSender(params: {
    allowFrom: Array<string | number>;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
    allowConversationTargets?: boolean | null;
    normalizeSender: (sender: string) => string;
    parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
}): boolean;
/**
 * Resolves service-prefixed handle targets, delegating chat-shaped remainders.
 */
export declare function resolveServicePrefixedTarget<TService extends string, TTarget>(params: {
    trimmed: string;
    lower: string;
    servicePrefixes: Array<ServicePrefix<TService>>;
    isChatTarget: (remainderLower: string) => boolean;
    parseTarget: (remainder: string) => TTarget;
}): ({
    kind: "handle";
    to: string;
    service: TService;
} | TTarget) | null;
/**
 * Resolves service-prefixed targets where chat ids should bypass handle parsing.
 */
export declare function resolveServicePrefixedChatTarget<TService extends string, TTarget>(params: {
    trimmed: string;
    lower: string;
    servicePrefixes: Array<ServicePrefix<TService>>;
    chatIdPrefixes: string[];
    chatGuidPrefixes: string[];
    chatIdentifierPrefixes: string[];
    extraChatPrefixes?: string[];
    parseTarget: (remainder: string) => TTarget;
}): ({
    kind: "handle";
    to: string;
    service: TService;
} | TTarget) | null;
/**
 * Parses chat target prefixes and throws for malformed prefixed values.
 */
export declare function parseChatTargetPrefixesOrThrow(params: ChatTargetPrefixesParams): ParsedChatTarget | null;
/**
 * Resolves service-prefixed allowlist targets.
 */
export declare function resolveServicePrefixedAllowTarget<TAllowTarget>(params: {
    trimmed: string;
    lower: string;
    servicePrefixes: Array<{
        prefix: string;
    }>;
    parseAllowTarget: (remainder: string) => TAllowTarget;
}): (TAllowTarget | {
    kind: "handle";
    handle: string;
}) | null;
/**
 * Resolves service-prefixed allow targets before falling back to chat prefixes.
 */
export declare function resolveServicePrefixedOrChatAllowTarget<TAllowTarget extends ParsedChatAllowTarget>(params: {
    trimmed: string;
    lower: string;
    servicePrefixes: Array<{
        prefix: string;
    }>;
    parseAllowTarget: (remainder: string) => TAllowTarget;
    chatIdPrefixes: string[];
    chatGuidPrefixes: string[];
    chatIdentifierPrefixes: string[];
}): TAllowTarget | null;
/**
 * Creates a reusable sender matcher for chat-aware channel allowlists.
 */
export declare function createAllowedChatSenderMatcher(params: {
    normalizeSender: (sender: string) => string;
    parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
    allowConversationTargets?: boolean;
}): (input: ChatSenderAllowParams) => boolean;
/**
 * Parses chat target prefixes for allowlist entries, ignoring malformed values.
 */
export declare function parseChatAllowTargetPrefixes(params: ChatTargetPrefixesParams): ParsedChatTarget | null;
