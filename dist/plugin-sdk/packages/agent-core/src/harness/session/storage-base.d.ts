import { type LeafEntry, type SessionMetadata, type SessionStorage, type SessionTreeEntry } from "../types.js";
/** Return the visible-leaf update represented by one session tree entry. */
export declare function leafIdUpdateAfterEntry(entry: SessionTreeEntry): string | null | undefined;
/** Return the raw parent for the next append after applying a tree entry. */
export declare function appendParentIdAfterEntry(entry: SessionTreeEntry): string | null;
export declare abstract class BaseSessionStorage<TMetadata extends SessionMetadata = SessionMetadata> implements SessionStorage<TMetadata> {
    private readonly metadata;
    private readonly entries;
    private readonly byId;
    private readonly labelsById;
    private readonly logicalParentsById;
    private leafId;
    private appendParentId;
    protected constructor(metadata: TMetadata, entries: SessionTreeEntry[], leafId?: string | null, appendParentId?: string | null);
    getMetadata(): Promise<TMetadata>;
    getLeafId(): Promise<string | null>;
    getAppendParentId(): Promise<string | null>;
    protected createLeafEntry(leafId: string | null): LeafEntry;
    createEntryId(): Promise<string>;
    protected validateEntryForAppend(entry: SessionTreeEntry): void;
    protected recordEntry(entry: SessionTreeEntry): void;
    getEntry(id: string): Promise<SessionTreeEntry | undefined>;
    findEntries<TType extends SessionTreeEntry["type"]>(type: TType): Promise<Array<Extract<SessionTreeEntry, {
        type: TType;
    }>>>;
    getLabel(id: string): Promise<string | undefined>;
    getPathToRoot(leafId: string | null): Promise<SessionTreeEntry[]>;
    getEntries(): Promise<SessionTreeEntry[]>;
    abstract setLeafId(leafId: string | null): Promise<void>;
    abstract appendEntry(entry: SessionTreeEntry): Promise<void>;
}
