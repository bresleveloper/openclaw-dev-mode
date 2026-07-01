import { type SessionAcpMeta, type SessionEntry } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** ACP metadata joined with its legacy session-store row and config context. */
export type AcpSessionStoreEntry = {
    cfg: OpenClawConfig;
    storePath: string;
    sessionKey: string;
    storeSessionKey: string;
    entry?: SessionEntry;
    acp?: SessionAcpMeta;
    storeReadFailed?: boolean;
};
/** Resolves the session store path that owns an ACP session key. */
export declare function resolveSessionStorePathForAcp(params: {
    sessionKey: string;
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): {
    cfg: OpenClawConfig;
    storePath: string;
};
export declare function readAcpSessionMeta(params: {
    sessionKey: string;
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
}): SessionAcpMeta | undefined;
export declare function readAcpSessionMetaForEntry(params: {
    sessionKey: string;
    entry: Pick<SessionEntry, "sessionId"> | undefined;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
}): SessionAcpMeta | undefined;
export declare function writeAcpSessionMetaForMigration(params: {
    sessionKey: string;
    sessionId?: string;
    meta: SessionAcpMeta;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
    now?: () => number;
}): void;
export declare function repairAcpSessionMetaKeyForMigration(params: {
    sessionKey: string;
    candidateSessionKeys?: Iterable<string | null | undefined>;
    entry?: Pick<SessionEntry, "sessionId">;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
    now?: () => number;
}): boolean;
export declare function readAcpSessionEntry(params: {
    sessionKey: string;
    cfg?: OpenClawConfig;
    clone?: boolean;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
}): AcpSessionStoreEntry | null;
export declare function listAcpSessionEntries(params: {
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    clone?: boolean;
    databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
export declare function upsertAcpSessionMeta(params: {
    sessionKey: string;
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    databasePath?: string;
    now?: () => number;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
    mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
