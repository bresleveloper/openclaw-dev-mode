import "./openclaw-state-db.generated-D9YhbPU3.js";
import { _ as CaptureSessionCoverageSummary, b as SharedCaptureBlobRecord, g as CaptureQueryRow, h as CaptureQueryPreset, m as CaptureEventRecord, v as CaptureSessionRecord, y as CaptureSessionSummary } from "./runtime-C4DfPay6.js";
import "kysely";
//#region src/proxy-capture/store.worker-contract.d.ts
type CapturePayloadInput = {
  data?: Buffer | string | null;
  contentType?: string;
  previewLimit?: number;
};
type CaptureDeleteResult$1 = {
  sessions: number;
  events: number;
  blobs: number;
};
type CaptureWorkerOperations = {
  "capture.upsertSession": {
    input: CaptureSessionRecord;
    output: void;
  };
  "capture.endSession": {
    input: {
      sessionId: string;
      endedAt: number;
    };
    output: void;
  };
  "capture.persistPayload": {
    input: {
      data: Buffer;
      contentType?: string;
    };
    output: SharedCaptureBlobRecord;
  };
  "capture.recordEvent": {
    input: CaptureEventRecord;
    output: void;
  };
  "capture.recordEventWithPayload": {
    input: {
      event: CaptureEventRecord;
      payload: CapturePayloadInput;
    };
    output: void;
  };
  "capture.listSessions": {
    input: {
      limit?: number;
    };
    output: CaptureSessionSummary[];
  };
  "capture.getSessionEvents": {
    input: {
      sessionId: string;
      limit?: number;
    };
    output: Array<Record<string, unknown>>;
  };
  "capture.summarizeSessionCoverage": {
    input: {
      sessionId: string;
    };
    output: CaptureSessionCoverageSummary;
  };
  "capture.readBlob": {
    input: {
      blobId: string;
    };
    output: string | null;
  };
  "capture.queryPreset": {
    input: {
      preset: CaptureQueryPreset;
      sessionId?: string;
    };
    output: CaptureQueryRow[];
  };
  "capture.deleteSessions": {
    input: {
      sessionIds: string[];
    };
    output: CaptureDeleteResult$1;
  };
  "capture.purgeAll": {
    input: undefined;
    output: CaptureDeleteResult$1;
  };
};
//#endregion
//#region src/proxy-capture/store.types.d.ts
type CaptureDeleteResult = CaptureWorkerOperations["capture.purgeAll"]["output"];
type AsyncDebugProxyCaptureStore = {
  readonly dbPath: string;
  readonly isClosed: boolean;
  upsertSession(session: CaptureSessionRecord): Promise<void>;
  endSession(sessionId: string, endedAt?: number): Promise<void>;
  persistPayload(data: Buffer, contentType?: string): Promise<SharedCaptureBlobRecord>;
  recordEvent(event: CaptureEventRecord): Promise<void>;
  recordEventWithPayload(event: CaptureEventRecord, payload: CapturePayloadInput): Promise<void>;
  listSessions(limit?: number): Promise<CaptureSessionSummary[]>;
  getSessionEvents(sessionId: string, limit?: number): Promise<Array<Record<string, unknown>>>;
  summarizeSessionCoverage(sessionId: string): Promise<CaptureSessionCoverageSummary>;
  readBlob(blobId: string): Promise<string | null>;
  queryPreset(preset: CaptureQueryPreset, sessionId?: string): Promise<CaptureQueryRow[]>;
  deleteSessions(sessionIds: string[]): Promise<CaptureDeleteResult>;
  purgeAll(): Promise<CaptureDeleteResult>;
  close(): Promise<void>;
};
//#endregion
//#region src/proxy-capture/store-readonly.d.ts
/** @deprecated Use AsyncDebugProxyCaptureReader and await its read operations. Final compatibility day: 2026-12-31. */
type DebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
  readBlob(blobId: string): string | null;
};
/** @deprecated Use createDebugProxyCaptureReaderAsync for worker-backed, noncreating reads. Final compatibility day: 2026-12-31. */
declare function createDebugProxyCaptureReader(params: {
  env: NodeJS.ProcessEnv;
}): DebugProxyCaptureReader;
//#endregion
//#region src/proxy-capture/store-readonly.async.d.ts
type AsyncDebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Promise<Array<Record<string, unknown>>>;
  readBlob(blobId: string): Promise<string | null>;
};
/** Capture the read target without opening or creating its database. */
declare function createDebugProxyCaptureReaderAsync(params: {
  env: NodeJS.ProcessEnv;
}): AsyncDebugProxyCaptureReader;
//#endregion
//#region src/proxy-capture/store.async.d.ts
declare function acquireDebugProxyCaptureStoreAsync(options?: {
  env?: NodeJS.ProcessEnv;
}): Promise<{
  store: AsyncDebugProxyCaptureStore;
  release: () => Promise<void>;
}>;
//#endregion
export { createDebugProxyCaptureReader as a, DebugProxyCaptureReader as i, AsyncDebugProxyCaptureReader as n, AsyncDebugProxyCaptureStore as o, createDebugProxyCaptureReaderAsync as r, acquireDebugProxyCaptureStoreAsync as t };