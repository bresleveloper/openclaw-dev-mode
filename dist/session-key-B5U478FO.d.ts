//#region src/sessions/session-key-utils.d.ts
type ParsedThreadSessionSuffix = {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
};
declare function isCronSessionKey(sessionKey: string | undefined | null): boolean;
declare function isSubagentSessionKey(sessionKey: string | undefined | null): boolean;
declare function isAcpSessionKey(sessionKey: string | undefined | null): boolean;
declare function parseThreadSessionSuffix(sessionKey: string | undefined | null): ParsedThreadSessionSuffix;
//#endregion
//#region src/routing/session-key.d.ts
declare function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null, configuredDefaultAgentId?: string): string;
declare function sanitizeAgentId(value: string | undefined | null): string;
declare function buildGroupHistoryKey(params: {
  channel: string;
  accountId?: string | null;
  peerKind: "group" | "channel";
  peerId: string;
}): string;
declare function resolveThreadSessionKeys(params: {
  baseSessionKey: string;
  threadId?: string | null;
  parentSessionKey?: string;
  useSuffix?: boolean;
  normalizeThreadId?: (threadId: string) => string;
}): {
  sessionKey: string;
  parentSessionKey?: string;
};
//#endregion
export { isAcpSessionKey as a, parseThreadSessionSuffix as c, sanitizeAgentId as i, resolveAgentIdFromSessionKey as n, isCronSessionKey as o, resolveThreadSessionKeys as r, isSubagentSessionKey as s, buildGroupHistoryKey as t };