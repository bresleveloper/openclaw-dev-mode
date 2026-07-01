import type { SessionTranscriptRuntimeScope, SessionTranscriptRuntimeTarget } from "../../config/sessions/session-accessor.js";
import { type TranscriptFileState, type TranscriptPersistedEntry } from "./transcript-file-state.js";
export type RuntimeTranscriptScope = SessionTranscriptRuntimeScope;
type RuntimeTranscriptTarget = SessionTranscriptRuntimeTarget;
/**
 * Resolves the runtime transcript target for read/probe operations without
 * linking missing file-backed metadata into the session store.
 */
export declare function resolveRuntimeTranscriptReadTarget(scope: RuntimeTranscriptScope): Promise<RuntimeTranscriptTarget>;
/**
 * Persists an append or migration rewrite for a resolved runtime transcript.
 */
export declare function persistRuntimeTranscriptStateMutation(params: {
    appendedEntries: TranscriptPersistedEntry[];
    state: TranscriptFileState;
    target: RuntimeTranscriptTarget;
}): Promise<void>;
export {};
