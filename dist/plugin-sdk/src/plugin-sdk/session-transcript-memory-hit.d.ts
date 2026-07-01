import type { SessionEntry } from "../config/sessions/types.js";
export type SessionTranscriptIdentity = {
    agentId: string;
    memoryKey: SessionTranscriptMemoryHitKey;
    sessionId: string;
    sessionKey: string;
};
export type SessionTranscriptMemoryHitIdentity = {
    agentId: string;
    key: SessionTranscriptMemoryHitKey;
    sessionId: string;
};
export type SessionTranscriptMemoryHitKey = `transcript:${string}:${string}`;
export type SessionTranscriptReadParams = {
    agentId?: string;
    env?: NodeJS.ProcessEnv;
    hydrateSkillPromptRefs?: boolean;
    sessionId: string;
    sessionKey: string;
    storePath?: string;
    threadId?: string | number;
};
export type SessionTranscriptMemoryHitKeyParams = {
    agentId: string;
    sessionId: string;
};
export type ResolveSessionTranscriptMemoryHitKeyParams = {
    includeSyntheticFallback?: boolean;
    key: string;
    store: Record<string, SessionEntry>;
};
/**
 * Builds the memory hit key for one session transcript.
 */
export declare function formatSessionTranscriptMemoryHitKey(params: SessionTranscriptMemoryHitKeyParams): SessionTranscriptMemoryHitKey;
/**
 * Parses a session transcript memory hit key.
 */
export declare function parseSessionTranscriptMemoryHitKey(key: string): SessionTranscriptMemoryHitIdentity | null;
/**
 * Maps a session transcript memory hit key back to visible session store keys.
 */
export declare function resolveSessionTranscriptMemoryHitKeyToSessionKeys(params: ResolveSessionTranscriptMemoryHitKeyParams): string[];
