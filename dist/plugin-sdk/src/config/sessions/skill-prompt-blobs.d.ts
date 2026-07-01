import type { SessionEntry, SessionSkillPromptRef } from "./types.js";
type PersistedSessionStore = {
    store: Record<string, SessionEntry>;
    changed: boolean;
};
export type SessionSkillPromptBlobProjection = {
    ref: SessionSkillPromptRef;
    path: string | null;
    prompt: string;
};
export type SessionStorePersistenceProjection = PersistedSessionStore & {
    promptBlobs: Map<string, SessionSkillPromptBlobProjection>;
};
export declare function clearSessionSkillPromptRefCache(): void;
export declare function getSessionSkillPromptRefCacheStatsForTest(): {
    entries: number;
    maxEntries: number;
};
export declare function getValidSessionSkillPromptBlobCacheStatsForTest(): {
    entries: number;
    maxEntries: number;
};
export declare function resolveSessionSkillPromptBlobPath(storePath: string, hash: string): string | null;
export declare function isSessionSkillPromptBlobReadable(storePath: string, ref: SessionSkillPromptRef): boolean;
export declare function projectSessionStoreForPersistence(params: {
    storePath: string;
    store: Record<string, SessionEntry>;
}): SessionStorePersistenceProjection;
export declare function ensureSessionStorePromptBlobsForPersistence(params: {
    storePath: string;
    promptBlobs: Iterable<SessionSkillPromptBlobProjection>;
}): Promise<void>;
export declare function hydrateSessionStoreSkillPromptRefs(params: {
    storePath: string;
    store: Record<string, unknown>;
}): boolean;
export {};
