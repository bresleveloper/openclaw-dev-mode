import type { TranscriptSessionDescriptor, TranscriptUtterance } from "./provider-types.js";
import type { TranscriptsSummary } from "./summary.js";
/**
 * File-backed transcript session store.
 *
 * Sessions are stored by date/session id with metadata JSON, append-only
 * utterance JSONL, and rendered summary artifacts.
 */
/** Stored session metadata plus the resolved session directory. */
export type TranscriptsSessionEntry = {
    session: TranscriptSessionDescriptor;
    sessionDir: string;
};
/** Durable transcript store rooted at a caller-provided directory. */
export declare class TranscriptsStore {
    private readonly rootDir;
    constructor(rootDir: string);
    /** Resolve the dated directory for a transcript session. */
    sessionDir(session: TranscriptSessionDescriptor): string;
    private hasSessionMetadata;
    private findSessionDirForSession;
    private findSessionDir;
    /** Persist transcript session metadata. */
    writeSession(session: TranscriptSessionDescriptor): Promise<void>;
    /** Read one session descriptor by session id or qualified date/id selector. */
    readSession(sessionId: string): Promise<TranscriptSessionDescriptor | undefined>;
    /** Read one session descriptor plus its directory. */
    readSessionEntry(sessionId: string): Promise<TranscriptsSessionEntry | undefined>;
    /** Append an utterance for an exact session descriptor. */
    appendUtteranceForSession(session: TranscriptSessionDescriptor, utterance: TranscriptUtterance): Promise<void>;
    private appendUtteranceToDir;
    /** Read utterances for an exact session descriptor. */
    readUtterancesForSession(session: TranscriptSessionDescriptor, options?: {
        maxUtterances?: number;
    }): Promise<TranscriptUtterance[]>;
    /** Read utterances directly from a known session directory. */
    readUtterancesFromSessionDir(sessionDir: string, options?: {
        maxUtterances?: number;
    }): Promise<TranscriptUtterance[]>;
    private readUtterancesFromDir;
    /** Mark a transcript session as stopped when metadata exists. */
    updateStopped(sessionId: string, stoppedAt: string): Promise<void>;
    /** Write summary artifacts for a session and return the markdown path. */
    writeSummary(summary: TranscriptsSummary, session?: TranscriptSessionDescriptor): Promise<string>;
    /** Write summary JSON and markdown to a known directory. */
    writeSummaryToDir(summary: TranscriptsSummary, dir: string): Promise<string>;
}
