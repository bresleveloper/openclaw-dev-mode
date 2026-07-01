export type SessionArchiveReason = "bak" | "reset" | "deleted";
/** Returns true for archived session artifacts and legacy store backup names. */
export declare function isSessionArchiveArtifactName(fileName: string): boolean;
export declare function isSessionStoreTempArtifactName(fileName: string, storeBasename: string): boolean;
/** Parses a compaction checkpoint transcript filename into session/checkpoint ids. */
export declare function parseCompactionCheckpointTranscriptFileName(fileName: string): {
    sessionId: string;
    checkpointId: string;
} | null;
/** Returns true when a filename is a compaction checkpoint transcript. */
export declare function isCompactionCheckpointTranscriptFileName(fileName: string): boolean;
/** Returns true for trajectory runtime jsonl artifacts. */
export declare function isTrajectoryRuntimeArtifactName(fileName: string): boolean;
/** Returns true for trajectory pointer artifacts. */
export declare function isTrajectoryPointerArtifactName(fileName: string): boolean;
/** Returns true for any trajectory-related session artifact. */
export declare function isTrajectorySessionArtifactName(fileName: string): boolean;
/** Returns true for primary session transcript files that represent live session history. */
export declare function isPrimarySessionTranscriptFileName(fileName: string): boolean;
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
export declare function isUsageCountedSessionTranscriptFileName(fileName: string): boolean;
/** Extracts the session id from a usage-counted transcript filename. */
export declare function parseUsageCountedSessionIdFromFileName(fileName: string): string | null;
/** Formats an archive timestamp that is safe for filenames. */
export declare function formatSessionArchiveTimestamp(nowMs?: number): string;
export declare function parseSessionArchiveTimestamp(fileName: string, reason: SessionArchiveReason): number | null;
