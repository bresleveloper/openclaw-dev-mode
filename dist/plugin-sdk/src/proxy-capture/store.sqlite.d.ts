import type { DatabaseSync } from "node:sqlite";
import type { CaptureBlobRecord, CaptureEventRecord, CaptureQueryPreset, CaptureQueryRow, CaptureSessionCoverageSummary, CaptureSessionRecord, CaptureSessionSummary, SharedCaptureBlobRecord } from "./types.js";
export type DebugProxyCaptureStoreOptions = {
    env?: NodeJS.ProcessEnv;
};
declare class DebugProxyCaptureStoreImpl {
    readonly db: DatabaseSync;
    readonly dbPath: string;
    readonly blobDir: string;
    private readonly pathBased?;
    private closed;
    constructor(optionsOrDbPath?: DebugProxyCaptureStoreOptions | string, legacyBlobDir?: string);
    close(): void;
    get isClosed(): boolean;
    upsertSession(session: CaptureSessionRecord): void;
    endSession(sessionId: string, endedAt?: number): void;
    persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
    recordEvent(event: CaptureEventRecord): void;
    private insertEvent;
    listSessions(limit?: number): CaptureSessionSummary[];
    getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
    summarizeSessionCoverage(sessionId: string): CaptureSessionCoverageSummary;
    readBlob(blobId: string): string | null;
    queryPreset(preset: CaptureQueryPreset, sessionId?: string): CaptureQueryRow[];
    purgeAll(): {
        sessions: number;
        events: number;
        blobs: number;
    };
    deleteSessions(sessionIds: string[]): {
        sessions: number;
        events: number;
        blobs: number;
    };
    private deletePathBasedSessions;
}
export type DebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
    persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
};
export type LegacyDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
    persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord;
};
export type SharedDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
    persistPayload(data: Buffer, contentType?: string): SharedCaptureBlobRecord;
};
type DebugProxyCaptureStoreConstructor = {
    new (dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
    new (options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
};
export declare const DebugProxyCaptureStore: DebugProxyCaptureStoreConstructor;
export declare function getDebugProxyCaptureStore(dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
export declare function getDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
export declare function closeDebugProxyCaptureStore(): void;
export declare function acquireDebugProxyCaptureStore(dbPath: string, blobDir: string): {
    store: LegacyDebugProxyCaptureStore;
    release: () => void;
};
export declare function acquireDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): {
    store: SharedDebugProxyCaptureStore;
    release: () => void;
};
export declare function persistEventPayload(store: {
    persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
}, params: {
    data?: Buffer | string | null;
    contentType?: string;
    previewLimit?: number;
}): {
    dataText?: string;
    dataBlobId?: string;
    dataSha256?: string;
};
export declare function safeJsonString(value: unknown): string | undefined;
export {};
