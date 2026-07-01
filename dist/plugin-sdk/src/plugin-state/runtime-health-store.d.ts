/** Envelope persisted with every cross-process runtime health record. */
export type RuntimeHealthRecordEnvelope = {
    processId: number;
    /** Random per-process identity; proves incarnation for own-PID records. */
    processToken: string;
    /** Linux /proc starttime for sibling verification; null when unavailable. */
    processStartTime: number | null;
    failedAtMs: number;
};
export type RuntimeHealthStoreOptions<T extends RuntimeHealthRecordEnvelope> = {
    ownerId: `core:${string}`;
    namespace: string;
    maxEntries: number;
    /** Optional expiry backstop on top of liveness filtering. */
    ttlMs?: number;
    /** Validates domain fields and strips unknown ones; envelope is pre-validated. */
    normalizeRecord: (value: Record<string, unknown> & RuntimeHealthRecordEnvelope) => T | undefined;
    /** Groups records for display dedupe across recorder processes. */
    displayKey: (record: T) => string;
    /** Which failedAtMs wins per display group: root cause vs most recent reason. */
    pick: "earliest" | "latest";
};
export type RuntimeHealthStore<T extends RuntimeHealthRecordEnvelope> = {
    /** Persists a record under the key, overwriting any prior value. */
    register(key: string, record: T): void;
    /** One record per display group, restricted to live recorder processes. */
    list(): T[];
    /** Removes records recorded by the process, optionally narrowed by predicate. */
    clearForProcess(processId: number, matches?: (record: T) => boolean): void;
};
/** Builds the common health envelope for records owned by this process. */
export declare function createRuntimeHealthRecordEnvelope(failedAt: Date): RuntimeHealthRecordEnvelope;
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
export declare function createRuntimeHealthStore<T extends RuntimeHealthRecordEnvelope>(options: RuntimeHealthStoreOptions<T>): RuntimeHealthStore<T>;
