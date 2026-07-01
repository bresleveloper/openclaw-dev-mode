import { i as MsgContext } from "./templating-KsALmYhy.js";
import { a as SessionEntry, n as GroupKeyResolution, o as SessionScope } from "./types-CmP2mjUp.js";
import { b as ResolvedSessionMaintenanceConfig } from "./transcript-B5JEOgTb.js";
//#region src/config/sessions/group.d.ts
/**
 * Resolves channel/group chat context into the persisted group session key.
 *
 * Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
 * fallback for older channel surfaces that cannot yet express the generic route shape.
 */
declare function resolveGroupSessionKey(ctx: MsgContext): GroupKeyResolution | null;
//#endregion
//#region src/config/sessions/artifacts.d.ts
/** Returns true for archived session artifacts and legacy store backup names. */
declare function isSessionArchiveArtifactName(fileName: string): boolean;
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
declare function isUsageCountedSessionTranscriptFileName(fileName: string): boolean;
/** Extracts the session id from a usage-counted transcript filename. */
declare function parseUsageCountedSessionIdFromFileName(fileName: string): string | null;
//#endregion
//#region src/config/sessions/main-session.d.ts
/** Canonicalizes main-session aliases to the current scoped session key. */
declare function canonicalizeMainSessionAlias(params: {
  cfg?: {
    session?: {
      scope?: SessionScope;
      mainKey?: string;
    };
  };
  agentId: string;
  sessionKey: string;
}): string;
//#endregion
//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(agentId?: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
type SessionFilePathOptions = {
  agentId?: string;
  sessionsDir?: string;
};
declare function resolveSessionTranscriptPathInDir(sessionId: string, sessionsDir: string, topicId?: string | number): string;
declare function resolveSessionFilePath(sessionId: string, entry?: {
  sessionFile?: string;
}, opts?: SessionFilePathOptions): string;
declare function resolveStorePath(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
//#region src/config/sessions/session-key.d.ts
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
declare function resolveSessionKey(scope: SessionScope, ctx: MsgContext, mainKey?: string, agentId?: string): string;
//#endregion
//#region src/config/sessions/session-file.d.ts
/** Resolves a transcript file path and persists it into the session store when needed. */
declare function resolveAndPersistSessionFile(params: {
  sessionId: string;
  sessionKey: string;
  sessionStore: Record<string, SessionEntry>;
  storePath: string;
  sessionEntry?: SessionEntry;
  agentId?: string;
  sessionsDir?: string;
  fallbackSessionFile?: string;
  activeSessionKey?: string;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
}): Promise<{
  sessionFile: string;
  sessionEntry: SessionEntry;
}>;
//#endregion
export { resolveSessionTranscriptsDirForAgent as a, isSessionArchiveArtifactName as c, resolveGroupSessionKey as d, resolveSessionTranscriptPathInDir as i, isUsageCountedSessionTranscriptFileName as l, resolveSessionKey as n, resolveStorePath as o, resolveSessionFilePath as r, canonicalizeMainSessionAlias as s, resolveAndPersistSessionFile as t, parseUsageCountedSessionIdFromFileName as u };