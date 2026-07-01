import { type SessionArchiveReason } from "../config/sessions/artifacts.js";
import { extractGeneratedTranscriptSessionId } from "../config/sessions/generated-transcript-session-id.js";
type ArchiveFileReason = SessionArchiveReason;
export type ArchivedSessionTranscript = {
    sourcePath: string;
    archivedPath: string;
};
export { extractGeneratedTranscriptSessionId };
export declare function resolveSessionTranscriptCandidates(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): string[];
export declare function resolveSessionTranscriptResetArchiveCandidatesAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): Promise<string[]>;
export declare function archiveFileOnDisk(filePath: string, reason: ArchiveFileReason): string;
export declare function archiveSessionTranscripts(opts: {
    sessionId: string;
    storePath: string | undefined;
    sessionFile?: string;
    agentId?: string;
    reason: "reset" | "deleted";
    /**
     * When true, only archive files resolved under the session store directory.
     * This prevents maintenance operations from mutating paths outside the agent sessions dir.
     */
    restrictToStoreDir?: boolean;
    onArchiveError?: (err: unknown, sourcePath: string) => void;
}): string[];
export declare function archiveSessionTranscriptsDetailed(opts: {
    sessionId: string;
    storePath: string | undefined;
    sessionFile?: string;
    agentId?: string;
    reason: "reset" | "deleted";
    /**
     * When true, only archive files resolved under the session store directory.
     * This prevents maintenance operations from mutating paths outside the agent sessions dir.
     */
    restrictToStoreDir?: boolean;
    /**
     * Invoked when an individual transcript candidate fails to archive. The
     * caller decides whether to log, warn-deliver, or escalate.
     */
    onArchiveError?: (err: unknown, sourcePath: string) => void;
}): ArchivedSessionTranscript[];
export declare function resolveStableSessionEndTranscript(params: {
    sessionId: string;
    storePath: string | undefined;
    sessionFile?: string;
    agentId?: string;
    archivedTranscripts?: ArchivedSessionTranscript[];
}): {
    sessionFile?: string;
    transcriptArchived?: boolean;
};
export type SessionArchiveCleanupRule = {
    reason: ArchiveFileReason;
    olderThanMs: number;
};
export declare function cleanupArchivedSessionTranscripts(opts: {
    directories: string[];
    rules: SessionArchiveCleanupRule[];
    nowMs?: number;
}): Promise<{
    removed: number;
    scanned: number;
}>;
