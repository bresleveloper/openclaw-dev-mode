import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { c as SessionAcpMeta } from "./types-Bst3_XVW2.js";
import { o as SessionEntry } from "./types-DP8esrTo.js";

//#region src/acp/runtime/session-meta.d.ts
/** ACP metadata joined with its legacy session-store row and config context. */
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
declare function readAcpSessionEntry(params: {
  sessionKey: string;
  cfg?: OpenClawConfig;
  clone?: boolean;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
}): AcpSessionStoreEntry | null;
declare function listAcpSessionEntries(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  clone?: boolean;
  databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
declare function upsertAcpSessionMeta(params: {
  sessionKey: string;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
  now?: () => number;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
//#endregion
export { upsertAcpSessionMeta as i, listAcpSessionEntries as n, readAcpSessionEntry as r, AcpSessionStoreEntry as t };