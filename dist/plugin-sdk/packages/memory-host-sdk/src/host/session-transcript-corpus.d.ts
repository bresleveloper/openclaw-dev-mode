export type SessionTranscriptCorpusArtifactKind = "active-session" | "archive-artifact" | "orphan-file-artifact";
export type SessionTranscriptCorpusEntry = {
    agentId: string;
    sessionFile: string;
    sessionId: string;
    artifactKind: SessionTranscriptCorpusArtifactKind;
    sessionKey?: string;
    /** True when this transcript belongs to an internal dreaming narrative run. */
    generatedByDreamingNarrative?: boolean;
    /** True when this transcript belongs to an isolated cron run session. */
    generatedByCronRun?: boolean;
};
export declare function listSessionTranscriptCorpusEntriesForAgentSync(agentId: string): SessionTranscriptCorpusEntry[];
/**
 * Lists transcript corpus entries for QMD/memory indexing.
 *
 * Active sessions come from the session accessor seam; retained reset/delete
 * transcript artifacts remain explicit file artifacts until core owns archive
 * artifact enumeration.
 */
export declare function listSessionTranscriptCorpusEntriesForAgent(agentId: string): Promise<SessionTranscriptCorpusEntry[]>;
