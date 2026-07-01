import type { SessionEntry } from "./types.js";
/** Applies best-effort in-place migrations for legacy session store entry fields. */
export declare function applySessionStoreMigrations(store: Record<string, SessionEntry>): boolean;
