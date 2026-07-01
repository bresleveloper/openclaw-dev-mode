import type { SessionEntry } from "./types.js";
/** Normalizes persisted session store entries before they reach runtime callers. */
export declare function normalizePersistedSessionEntryShape(value: unknown): SessionEntry | undefined;
