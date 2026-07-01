type TranscriptRecord = Record<string, unknown>;
export type SessionTranscriptTreeEntry = {
    id: string;
    parentId: string | null;
    leafId: string | null | undefined;
    appendParentId: string | null;
    appendMode?: "side";
};
export type SessionTranscriptTreeNode<T> = SessionTranscriptTreeEntry & {
    entry: T;
    index: number;
};
export type SessionTranscriptTree<T> = {
    nodes: SessionTranscriptTreeNode<T>[];
    byId: Map<string, SessionTranscriptTreeNode<T>>;
    leafId: string | null;
    appendParentId: string | null;
    hasLeafControl: boolean;
    hasLeafUpdate: boolean;
    hasExplicitLeafUpdate: boolean;
    hasInvalidLeafControl: boolean;
};
export declare function isCanonicalSessionTranscriptEntry(record: unknown): record is TranscriptRecord & {
    type: string;
};
export declare function isSessionTranscriptSideAppendEntry(record: unknown): boolean;
export declare function isSessionTranscriptLeafControl(record: unknown): record is TranscriptRecord & {
    type: "leaf";
};
/**
 * Parse one parent-linked transcript row.
 *
 * Leaf rows are navigation controls: they select targetId as the active leaf,
 * and descendants that reference the marker continue through that same target.
 */
export declare function parseSessionTranscriptTreeEntry(record: unknown): SessionTranscriptTreeEntry | undefined;
/**
 * Resolve transcript navigation state in file order.
 *
 * Current-version transcripts can contain parentless canonical rows written by
 * older appenders. Treat those rows as a linear continuation of the current
 * append cursor so a later leaf control can still address their full history.
 */
export declare function scanSessionTranscriptTree<T>(entries: readonly T[]): SessionTranscriptTree<T>;
/** Select one normalized path, retaining a reachable suffix after missing ancestors. */
export declare function selectSessionTranscriptTreePathNodes<T>(tree: SessionTranscriptTree<T>, leafId: string | null): SessionTranscriptTreeNode<T>[];
/** Merge normalized paths in original file order and expose their retained parent links. */
export declare function mergeSessionTranscriptTreePaths<T>(paths: Array<SessionTranscriptTreeNode<T>[]>): Array<SessionTranscriptTreeNode<T> & {
    selectedParentId: string | null;
}>;
/**
 * Build a copy-safe branch from the visible path and the opaque append suffix.
 *
 * Hidden canonical append ancestors must not leak into forks or repairs. Keep
 * only opaque cursor records after the last canonical ancestor and reparent
 * that suffix onto the selected visible path.
 */
export declare function mergeSessionTranscriptVisiblePathWithOpaqueAppendPath<T>(params: {
    visiblePath: SessionTranscriptTreeNode<T>[];
    appendPath: SessionTranscriptTreeNode<T>[];
    appendParentId: string | null;
}): {
    nodes: Array<SessionTranscriptTreeNode<T> & {
        selectedParentId: string | null;
    }>;
    appendParentId: string | null;
};
/**
 * Select the effective branch only when the transcript contains leaf controls.
 *
 * Legacy flat readers can keep their existing behavior when this returns
 * undefined. Once navigation controls exist, returning the selected path keeps
 * side branches out of prompts and hooks even after later active-branch appends.
 */
export declare function selectSessionTranscriptLeafControlledPath<T>(entries: readonly T[]): T[] | undefined;
export {};
