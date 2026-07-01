type OwnedSessionTranscriptWriteContext = {
    sessionFile?: string;
    sessionKey?: string;
    canAdvanceSessionEntryCache?: (snapshot: OwnedSessionTranscriptCacheSnapshot) => boolean;
    publishSessionFileSnapshot?: (snapshot: OwnedSessionTranscriptCacheSnapshot) => boolean;
    withSessionWriteLock: <T>(run: () => Promise<T> | T, options?: OwnedSessionTranscriptWriteOptions<T>) => Promise<T>;
};
export type OwnedSessionTranscriptWriteOptions<T> = {
    publishOwnedWrite?: boolean;
    resolvePublishedEntries?: (result: T) => readonly OwnedSessionTranscriptPublishedEntry[];
    resolvePublishedEntriesAfterFailure?: () => readonly OwnedSessionTranscriptPublishedEntry[];
};
export type OwnedSessionTranscriptPublishedEntry = {
    kind: "id";
    id: string;
} | {
    kind: "header";
    serialized: string;
} | {
    kind: "serialized";
    serialized: string;
};
export type OwnedSessionTranscriptCacheSnapshot = {
    dev: bigint;
    ino: bigint;
    size: bigint;
    mtimeNs: bigint;
    ctimeNs: bigint;
};
/** Runs transcript writes with an owned write-lock context. */
export declare function withOwnedSessionTranscriptWrites<T>(context: OwnedSessionTranscriptWriteContext, run: () => Promise<T>): Promise<T>;
export declare function bindOwnedSessionTranscriptWrites<TArgs extends unknown[], TResult>(context: OwnedSessionTranscriptWriteContext, run: (...args: TArgs) => TResult): (...args: TArgs) => TResult;
export declare function runWithOwnedSessionTranscriptWriteLock<T>(params: {
    sessionFile?: string;
    sessionKey?: string;
}, run: () => Promise<T> | T): Promise<T>;
export declare function runWithOwnedSessionTranscriptWritePublication<T>(params: {
    sessionFile?: string;
    sessionKey?: string;
}, run: () => Promise<T> | T): Promise<T>;
export declare function resolveOwnedSessionTranscriptWriteLockRunner(params: {
    sessionFile?: string;
    sessionKey?: string;
}): OwnedSessionTranscriptWriteContext["withSessionWriteLock"] | undefined;
export declare function canAdvanceOwnedSessionEntryCache(params: {
    sessionFile?: string;
    sessionKey?: string;
    snapshot: OwnedSessionTranscriptCacheSnapshot;
}): boolean;
export declare function publishOwnedSessionFileSnapshot(params: {
    sessionFile?: string;
    sessionKey?: string;
    snapshot: OwnedSessionTranscriptCacheSnapshot;
}): boolean | undefined;
export {};
