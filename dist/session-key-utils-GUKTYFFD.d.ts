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
export { parseThreadSessionSuffix as i, isCronSessionKey as n, isSubagentSessionKey as r, isAcpSessionKey as t };