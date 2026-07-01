import { type OwnedSessionTranscriptPublishedEntry, type OwnedSessionTranscriptWriteOptions, type OwnedSessionTranscriptCacheSnapshot } from "../../../config/sessions/transcript-write-context.js";
import type { acquireSessionWriteLock } from "../../session-write-lock.js";
import type { CustomEntry, LabelEntry, SessionInfoEntry, SessionMessageEntry } from "../../sessions/session-manager.js";
type SessionLock = Awaited<ReturnType<typeof acquireSessionWriteLock>>;
type AcquireSessionWriteLock = typeof acquireSessionWriteLock;
type LockOptions = {
    sessionFile: string;
    timeoutMs: number;
    staleMs: number;
    maxHoldMs: number;
};
type SessionFileWriteAppendValidator<T> = (result: T, appendedText: string) => boolean;
type SessionFileFingerprint = {
    exists: false;
} | {
    exists: true;
    dev: bigint;
    ino: bigint;
    size: bigint;
    mtimeNs: bigint;
    ctimeNs: bigint;
};
export type TrustedSessionFileSnapshot = Extract<SessionFileFingerprint, {
    exists: true;
}>;
type PromptReleasedSessionMetadataEntry = CustomEntry | LabelEntry | SessionInfoEntry;
type PromptReleasedOpaqueEntry = {
    type: "prompt_released_opaque";
    record: unknown;
};
type PromptReleasedSessionEntry = SessionMessageEntry | PromptReleasedSessionMetadataEntry | PromptReleasedOpaqueEntry;
type PromptReleasedSessionMergeResult = {
    sessionFileSnapshot: OwnedSessionTranscriptCacheSnapshot;
    publishedEntries?: readonly OwnedSessionTranscriptPublishedEntry[];
    requiresReload?: true;
};
export type EmbeddedAttemptSessionFileOwner = {
    sessionFileKey: string;
    release(): void;
};
export declare function acquireEmbeddedAttemptSessionFileOwner(params: {
    sessionFile: string;
    timeoutMs?: number;
    signal?: AbortSignal;
}): Promise<EmbeddedAttemptSessionFileOwner>;
export declare function resetEmbeddedAttemptSessionFileOwnersForTest(): void;
export declare class EmbeddedAttemptSessionTakeoverError extends Error {
    constructor(sessionFile: string);
}
export type EmbeddedAttemptSessionLockController = {
    canAdvanceSessionEntryCache(snapshot: OwnedSessionTranscriptCacheSnapshot): boolean;
    publishOwnedSessionFileSnapshot(snapshot: OwnedSessionTranscriptCacheSnapshot): boolean;
    publishValidatedSessionFileSnapshot(snapshot: OwnedSessionTranscriptCacheSnapshot): boolean;
    readTrustedCurrentSessionFileSnapshot(): Promise<TrustedSessionFileSnapshot | undefined>;
    releaseForPrompt(): Promise<void>;
    releaseHeldLockForAbort(): Promise<void>;
    refreshAfterOwnedSessionWrite(): void;
    withOwnedSessionFileWrite<T>(run: () => T, validateAppend?: SessionFileWriteAppendValidator<T>): T;
    reacquireAfterPrompt(): Promise<void>;
    waitForSessionEvents(session: unknown): Promise<void>;
    withSessionWriteLock<T>(run: () => Promise<T> | T, options?: OwnedSessionTranscriptWriteOptions<T>): Promise<T>;
    acquireForCleanup(params?: {
        session?: unknown;
    }): Promise<SessionLock>;
    hasSessionTakeover(): boolean;
    dispose(): Promise<void>;
};
export declare function createEmbeddedAttemptSessionLockController(params: {
    acquireSessionWriteLock: AcquireSessionWriteLock;
    lockOptions: LockOptions;
    mergePromptReleasedSessionEntries?: (entries: readonly PromptReleasedSessionEntry[]) => Promise<PromptReleasedSessionMergeResult | void> | PromptReleasedSessionMergeResult | void;
    reloadPromptReleasedSessionFile?: () => Promise<void> | void;
}): Promise<EmbeddedAttemptSessionLockController>;
export declare function installPromptSubmissionLockRelease(params: {
    session: unknown;
    waitForSessionEvents: (session: unknown) => Promise<void>;
    releaseForPrompt: () => Promise<void>;
    reacquireAfterPrompt: () => Promise<void>;
    sessionFile?: string;
    sessionKey?: string;
    withSessionWriteLock?: <T>(run: () => Promise<T> | T, options?: OwnedSessionTranscriptWriteOptions<T>) => Promise<T>;
    canAdvanceSessionEntryCache?: (snapshot: OwnedSessionTranscriptCacheSnapshot) => boolean;
    publishSessionFileSnapshot?: (snapshot: OwnedSessionTranscriptCacheSnapshot) => boolean;
}): void;
export {};
