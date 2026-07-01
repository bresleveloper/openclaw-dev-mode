import fs from "node:fs";
/** Minimal session-store entry shape needed by state migration ordering and repair logic. */
export type SessionEntryLike = {
    sessionId?: string;
    updatedAt?: number;
} & Record<string, unknown>;
/** Reads directory entries or returns an empty list when the directory is missing/unreadable. */
export declare function safeReadDir(dir: string): fs.Dirent[];
/** Returns whether a path exists and resolves to a directory. */
export declare function existsDir(dir: string): boolean;
/** Creates a directory tree for migration targets. */
export declare function ensureDir(dir: string): void;
/** Returns whether a path exists and resolves to a regular file. */
export declare function fileExists(p: string): boolean;
/** Matches legacy WhatsApp auth shard names that should move into the channel auth dir. */
export declare function isLegacyWhatsAppAuthFile(name: string): boolean;
/** Reads a session store from disk, accepting JSON first and JSON5 as legacy/operator input. */
export declare function readSessionStoreJson5(storePath: string): {
    store: Record<string, SessionEntryLike>;
    ok: boolean;
};
/** Parses session-store text, preferring strict JSON before JSON5 compatibility. */
export declare function parseSessionStoreJson5(raw: string): {
    store: Record<string, SessionEntryLike>;
    ok: boolean;
};
