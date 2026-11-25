declare const DEFAULT_MAIN_KEY = "main";
/** Classifies process-only agent session keys without consulting runtime registry state. */
declare function isIncognitoSessionKey(sessionKey: string | undefined | null): boolean;
type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};
declare function normalizeMainKey(value: string | undefined | null): string;
declare function buildAgentMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
}): string;
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
type ParsedThreadSessionSuffix = {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
};
declare function isCronSessionKey(sessionKey: string | undefined | null): boolean;
declare function isSubagentSessionKey(sessionKey: string | undefined | null): boolean;
declare function isAcpSessionKey(sessionKey: string | undefined | null): boolean;
declare function parseThreadSessionSuffix(sessionKey: string | undefined | null): ParsedThreadSessionSuffix;
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
export { isAcpSessionKey as a, parseThreadSessionSuffix as c, ParsedAgentSessionKey as d, buildAgentMainSessionKey as f, sanitizeAgentId as i, parseAgentSessionKey as l, normalizeMainKey as m, resolveAgentIdFromSessionKey as n, isCronSessionKey as o, isIncognitoSessionKey as p, resolveThreadSessionKeys as r, isSubagentSessionKey as s, buildGroupHistoryKey as t, DEFAULT_MAIN_KEY as u };