/**
 * Tracks whether an embedded run can be replayed after compaction or retry.
 */
export type EmbeddedRunReplayState = {
    replayInvalid: boolean;
    hadPotentialSideEffects: boolean;
};
/** Serializable replay metadata stored with run results. */
export type EmbeddedRunReplayMetadata = {
    hadPotentialSideEffects: boolean;
    replaySafe: boolean;
};
/** Creates a normalized replay state from partial caller metadata. */
export declare function createEmbeddedRunReplayState(state?: Partial<EmbeddedRunReplayState>): EmbeddedRunReplayState;
/** Merges replay state monotonically so unsafe observations cannot be cleared accidentally. */
export declare function mergeEmbeddedRunReplayState(current: EmbeddedRunReplayState, next?: Partial<EmbeddedRunReplayState>): EmbeddedRunReplayState;
/** Applies result metadata to the current replay state. */
export declare function observeReplayMetadata(current: EmbeddedRunReplayState, metadata?: EmbeddedRunReplayMetadata | null): EmbeddedRunReplayState;
/** Converts internal replay state into the compact metadata persisted with run results. */
export declare function replayMetadataFromState(state: EmbeddedRunReplayState): EmbeddedRunReplayMetadata;
