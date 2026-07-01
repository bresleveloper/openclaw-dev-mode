type MessageLike = {
    role?: unknown;
    content?: unknown;
    timestamp?: unknown;
};
type EntryLike = {
    id?: unknown;
    type?: unknown;
    message?: unknown;
};
type DuplicateUserMessageOptions = {
    windowMs?: number;
};
/** Drop later duplicate user messages while preserving the first prompt. */
export declare function dedupeDuplicateUserMessagesForCompaction<T extends MessageLike>(messages: readonly T[], options?: DuplicateUserMessageOptions): T[];
/** Collects session entry ids that should be skipped when building a compaction branch summary. */
export declare function collectDuplicateUserMessageEntryIdsForCompaction(entries: readonly EntryLike[], options?: DuplicateUserMessageOptions): Set<string>;
export {};
