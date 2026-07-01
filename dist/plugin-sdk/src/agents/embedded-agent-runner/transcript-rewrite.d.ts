/**
 * Rewrites transcript entries in session managers, states, and files.
 */
import type { TranscriptRewriteReplacement, TranscriptRewriteRequest, TranscriptRewriteResult } from "../../context-engine/types.js";
import { type SessionWriteLockAcquireTimeoutConfig } from "../session-write-lock.js";
import { SessionManager } from "../sessions/index.js";
import { type TranscriptFileState, type TranscriptPersistedEntry } from "./transcript-file-state.js";
import { type RuntimeTranscriptScope } from "./transcript-runtime-state.js";
type SessionManagerLike = ReturnType<typeof SessionManager.open>;
/**
 * Safely rewrites transcript message entries on the active branch by branching
 * from the first rewritten message's parent and re-appending the suffix.
 */
export declare function rewriteTranscriptEntriesInSessionManager(params: {
    sessionManager: SessionManagerLike;
    replacements: TranscriptRewriteReplacement[];
}): TranscriptRewriteResult;
export declare function rewriteTranscriptEntriesInState(params: {
    state: TranscriptFileState;
    replacements: TranscriptRewriteReplacement[];
    allowedRewriteSuffixEntryIds?: string[];
}): TranscriptRewriteResult & {
    appendedEntries: TranscriptPersistedEntry[];
};
/**
 * Rewrites message entries for a runtime transcript without using the
 * file-backed path as caller identity.
 */
export declare function rewriteTranscriptEntriesInRuntimeTranscript(params: {
    scope: RuntimeTranscriptScope;
    request: TranscriptRewriteRequest;
    config?: SessionWriteLockAcquireTimeoutConfig;
}): Promise<TranscriptRewriteResult>;
/**
 * Rewrites a named transcript file artifact. Runtime callers should prefer
 * rewriteTranscriptEntriesInRuntimeTranscript with agent/session scope.
 */
export declare function rewriteTranscriptEntriesInSessionFile(params: {
    sessionFile: string;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    request: TranscriptRewriteRequest;
    config?: SessionWriteLockAcquireTimeoutConfig;
}): Promise<TranscriptRewriteResult>;
export {};
