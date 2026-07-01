import type { SessionMetadata, SessionTreeEntry } from "../types.js";
import { BaseSessionStorage } from "./storage-base.js";
/** Volatile session storage used by tests and in-process harness callers. */
export declare class InMemorySessionStorage<TMetadata extends SessionMetadata = SessionMetadata> extends BaseSessionStorage<TMetadata> {
    constructor(options?: {
        entries?: SessionTreeEntry[];
        metadata?: TMetadata;
    });
    setLeafId(leafId: string | null): Promise<void>;
    appendEntry(entry: SessionTreeEntry): Promise<void>;
}
