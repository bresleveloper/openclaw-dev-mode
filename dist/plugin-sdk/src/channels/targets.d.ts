export type { DirectoryConfigParams } from "./plugins/directory-types.js";
export type { ChannelDirectoryEntry } from "./plugins/types.public.js";
/** Canonical route target families shared by channel-owned parsers. */
export type MessagingTargetKind = "user" | "channel";
/** Parsed channel target with the original token and normalized lookup key. */
export type MessagingTarget = {
    kind: MessagingTargetKind;
    id: string;
    raw: string;
    normalized: string;
};
/** Options for parsers that can infer a kind or reject ambiguous input. */
export type MessagingTargetParseOptions = {
    defaultKind?: MessagingTargetKind;
    ambiguousMessage?: string;
};
/** Builds the stable lower-case lookup key used to compare channel targets. */
export declare function normalizeTargetId(kind: MessagingTargetKind, id: string): string;
/** Creates a parsed target while preserving the user-provided raw token. */
export declare function buildMessagingTarget(kind: MessagingTargetKind, id: string, raw: string): MessagingTarget;
/** Validates an extracted target id with a channel-owned grammar. */
export declare function ensureTargetId(params: {
    candidate: string;
    pattern: RegExp;
    errorMessage: string;
}): string;
/** Parses one mention pattern whose first capture group is the target id. */
export declare function parseTargetMention(params: {
    raw: string;
    mentionPattern: RegExp;
    kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses a single kind-prefixed target such as channel:<id> or user:<id>. */
export declare function parseTargetPrefix(params: {
    raw: string;
    prefix: string;
    kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses the first matching kind-prefixed target from a channel grammar list. */
export declare function parseTargetPrefixes(params: {
    raw: string;
    prefixes: Array<{
        prefix: string;
        kind: MessagingTargetKind;
    }>;
}): MessagingTarget | undefined;
/** Parses @user shorthand and validates it against a channel-owned user grammar. */
export declare function parseAtUserTarget(params: {
    raw: string;
    pattern: RegExp;
    errorMessage: string;
}): MessagingTarget | undefined;
/** Tries mention, explicit prefixes, then @user shorthand in deterministic order. */
export declare function parseMentionPrefixOrAtUserTarget(params: {
    raw: string;
    mentionPattern: RegExp;
    prefixes: Array<{
        prefix: string;
        kind: MessagingTargetKind;
    }>;
    atUserPattern: RegExp;
    atUserErrorMessage: string;
}): MessagingTarget | undefined;
/** Requires a parsed target of the requested kind and returns its channel id. */
export declare function requireTargetKind(params: {
    platform: string;
    target: MessagingTarget | undefined;
    kind: MessagingTargetKind;
}): string;
