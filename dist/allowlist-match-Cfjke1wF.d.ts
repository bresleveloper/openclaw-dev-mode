//#region src/channels/plugins/chat-target-prefixes.d.ts
type ParsedChatTarget = {
  kind: "chat_id";
  chatId: number;
} | {
  kind: "chat_guid";
  chatGuid: string;
} | {
  kind: "chat_identifier";
  chatIdentifier: string;
};
type ParsedChatAllowTarget = ParsedChatTarget | {
  kind: "handle";
  handle: string;
};
type ChatSenderAllowParams = {
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
  allowConversationTargets?: boolean | null;
};
declare function isAllowedParsedChatSender(params: ChatSenderAllowParams & {
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
}): boolean;
/** Remove one of the known provider prefixes from a free-form target string. */
declare function stripChannelTargetPrefix(raw: string, ...providers: string[]): string;
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
declare function stripTargetKindPrefix(raw: string): string;
//#endregion
//#region src/channels/allowlist-match.d.ts
type AllowlistMatchSource = "wildcard" | "id" | "name" | "tag" | "username" | "prefixed-id" | "prefixed-user" | "prefixed-name" | "slug" | "localpart";
type AllowlistMatch<TSource extends string = AllowlistMatchSource> = {
  allowed: boolean;
  matchKey?: string;
  matchSource?: TSource;
};
type CompiledAllowlist = {
  set: ReadonlySet<string>;
  wildcard: boolean;
};
/** Formats match metadata for diagnostics without leaking channel-specific text. */
declare function formatAllowlistMatchMeta(match?: {
  matchKey?: string;
  matchSource?: string;
} | null): string;
/** Compiles normalized allowlist entries and records wildcard presence. */
declare function compileAllowlist(entries: ReadonlyArray<string>): CompiledAllowlist;
declare function resolveAllowlistCandidates<TSource extends string>(params: {
  compiledAllowlist: CompiledAllowlist;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Applies wildcard and empty-list semantics before candidate matching. */
declare function resolveCompiledAllowlistMatch<TSource extends string>(params: {
  compiledAllowlist: CompiledAllowlist;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Convenience wrapper for callers that do not need to reuse a compiled list. */
declare function resolveAllowlistMatchByCandidates<TSource extends string>(params: {
  allowList: ReadonlyArray<string>;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Matches simple sender id/name allowlists used by legacy channel config. */
declare function resolveAllowlistMatchSimple(params: {
  allowFrom: ReadonlyArray<string | number>;
  senderId: string;
  senderName?: string | null;
  allowNameMatching?: boolean;
}): AllowlistMatch<"wildcard" | "id" | "name">;
//#endregion
export { formatAllowlistMatchMeta as a, resolveAllowlistMatchSimple as c, stripChannelTargetPrefix as d, stripTargetKindPrefix as f, compileAllowlist as i, resolveCompiledAllowlistMatch as l, AllowlistMatchSource as n, resolveAllowlistCandidates as o, CompiledAllowlist as r, resolveAllowlistMatchByCandidates as s, AllowlistMatch as t, isAllowedParsedChatSender as u };