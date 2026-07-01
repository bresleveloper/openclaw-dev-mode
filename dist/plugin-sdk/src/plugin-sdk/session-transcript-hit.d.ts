import type { SessionEntry } from "../config/sessions/types.js";
export { formatSessionTranscriptMemoryHitKey, parseSessionTranscriptMemoryHitKey, resolveSessionTranscriptMemoryHitKeyToSessionKeys, } from "./session-transcript-memory-hit.js";
export type { ResolveSessionTranscriptMemoryHitKeyParams, SessionTranscriptIdentity, SessionTranscriptMemoryHitIdentity, SessionTranscriptMemoryHitKey, SessionTranscriptMemoryHitKeyParams, SessionTranscriptReadParams, } from "./session-transcript-memory-hit.js";
export { loadCombinedSessionStoreForGateway } from "../config/sessions/combined-store-gateway.js";
/** Canonical session identity parsed from a transcript search-hit path. */
export type SessionTranscriptHitIdentity = {
    stem: string;
    liveStem?: string;
    ownerAgentId?: string;
    archived: boolean;
};
/**
 * Derive transcript stem `S` from a memory search hit path for `source === "sessions"`.
 * Builtin index uses `sessions/<basename>.jsonl`; QMD exports use `<stem>.md`.
 * Archived transcripts (`.jsonl.reset.<iso>` / `.jsonl.deleted.<iso>`) resolve
 * to the same stem as the live `.jsonl` they were rotated from.
 */
export declare function extractTranscriptStemFromSessionsMemoryHit(hitPath: string): string | null;
/** Parse live/archive ownership metadata from a sessions-memory hit path. */
export declare function extractTranscriptIdentityFromSessionsMemoryHit(hitPath: string): SessionTranscriptHitIdentity | null;
/**
 * Map transcript stem to canonical session store keys (all agents in the combined store).
 * Session tools visibility and agent-to-agent policy are enforced by the caller (e.g.
 * `createSessionVisibilityGuard`), including cross-agent cases.
 */
export declare function resolveTranscriptStemToSessionKeys(params: {
    store: Record<string, SessionEntry>;
    stem: string;
    archivedOwnerAgentId?: string;
    allowQmdSlugFallback?: boolean;
}): string[];
