import { type SessionContext, type SessionEntry, type SessionHeader } from "../sessions/index.js";
type BranchSummaryEntry = Extract<SessionEntry, {
    type: "branch_summary";
}>;
type CompactionEntry = Extract<SessionEntry, {
    type: "compaction";
}>;
type CustomEntry = Extract<SessionEntry, {
    type: "custom";
}>;
type CustomMessageEntry = Extract<SessionEntry, {
    type: "custom_message";
}>;
type LabelEntry = Extract<SessionEntry, {
    type: "label";
}>;
type ModelChangeEntry = Extract<SessionEntry, {
    type: "model_change";
}>;
type SessionInfoEntry = Extract<SessionEntry, {
    type: "session_info";
}>;
type SessionMessageEntry = Extract<SessionEntry, {
    type: "message";
}>;
type ThinkingLevelChangeEntry = Extract<SessionEntry, {
    type: "thinking_level_change";
}>;
type TranscriptLeafControlEntry = {
    type: "leaf";
    id: string;
    parentId: string | null;
    timestamp: string;
    targetId: string | null;
    appendParentId?: string | null;
    appendMode?: "side";
};
export type TranscriptPersistedEntry = SessionEntry | TranscriptLeafControlEntry;
/** In-memory transcript state with branch, label, and append helpers. */
export declare class TranscriptFileState {
    readonly header: SessionHeader | null;
    readonly entries: SessionEntry[];
    readonly migrated: boolean;
    private readonly byId;
    private readonly labelsById;
    private readonly labelTimestampsById;
    private readonly opaqueParentsById;
    private readonly logicalParentsById;
    private leafId;
    private appendParentId;
    private appendMode;
    constructor(params: {
        header: SessionHeader | null;
        entries: SessionEntry[];
        leafId?: string | null;
        appendParentId?: string | null;
        appendMode?: "side";
        opaqueParentsById?: ReadonlyMap<string, string | null>;
        logicalParentsById?: ReadonlyMap<string, string | null>;
        migrated?: boolean;
    });
    private resolveCanonicalParentId;
    private rebuildIndex;
    getCwd(): string;
    getHeader(): SessionHeader | null;
    getEntries(): SessionEntry[];
    getLeafId(): string | null;
    getAppendParentId(): string | null;
    getAppendMode(): "side" | undefined;
    getLeafEntry(): SessionEntry | undefined;
    getLabel(id: string): string | undefined;
    getBranch(fromId?: string): SessionEntry[];
    buildSessionContext(): SessionContext;
    /** Move the active leaf to an existing entry without appending a row. */
    branch(branchFromId: string): void;
    /** Clear the active leaf so the next append starts a root branch. */
    resetLeaf(): void;
    appendMessage(message: SessionMessageEntry["message"]): SessionMessageEntry;
    appendThinkingLevelChange(thinkingLevel: string): ThinkingLevelChangeEntry;
    appendModelChange(provider: string, modelId: string): ModelChangeEntry;
    appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): CompactionEntry;
    appendCustomEntry(customType: string, data?: unknown): CustomEntry;
    appendSessionInfo(name: string): SessionInfoEntry;
    appendCustomMessageEntry(customType: string, content: CustomMessageEntry["content"], display: boolean, details?: unknown): CustomMessageEntry;
    appendLabelChange(targetId: string, label: string | undefined): LabelEntry;
    branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromHook?: boolean): BranchSummaryEntry;
    appendLeafControl(params: {
        targetId: string | null;
        appendParentId: string | null;
        appendMode?: "side";
    }): TranscriptLeafControlEntry;
    private appendEntry;
}
/** Read a transcript file, migrate old rows, and drop only unrecoverable entries. */
export declare function readTranscriptFileState(sessionFile: string): Promise<TranscriptFileState>;
/** Rewrite the full transcript through the private-file store. */
export declare function writeTranscriptFileAtomic(filePath: string, entries: Array<SessionHeader | TranscriptPersistedEntry>): Promise<void>;
/** Persist a state mutation using append-only writes unless migration forced a rewrite. */
export declare function persistTranscriptStateMutation(params: {
    sessionFile: string;
    state: TranscriptFileState;
    appendedEntries: TranscriptPersistedEntry[];
}): Promise<void>;
export {};
