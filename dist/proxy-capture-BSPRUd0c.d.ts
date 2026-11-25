import "./openclaw-state-db.generated-B0kBijiJ.js";
import { u as AsyncDebugProxyCaptureStore } from "./runtime-DN-E2F5t.js";
import "kysely";
/** @deprecated Use AsyncDebugProxyCaptureReader and await its read operations. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
type DebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
  readBlob(blobId: string): string | null;
};
/** @deprecated Use createDebugProxyCaptureReaderAsync for worker-backed, noncreating reads. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function createDebugProxyCaptureReader(params: {
  env: NodeJS.ProcessEnv;
}): DebugProxyCaptureReader;
type AsyncDebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Promise<Array<Record<string, unknown>>>;
  readBlob(blobId: string): Promise<string | null>;
};
/** Capture the read target without opening or creating its database. */
declare function createDebugProxyCaptureReaderAsync(params: {
  env: NodeJS.ProcessEnv;
}): AsyncDebugProxyCaptureReader;
declare function acquireDebugProxyCaptureStoreAsync(options?: {
  env?: NodeJS.ProcessEnv;
}): Promise<{
  store: AsyncDebugProxyCaptureStore;
  release: () => Promise<void>;
}>;
export { createDebugProxyCaptureReader as a, DebugProxyCaptureReader as i, AsyncDebugProxyCaptureReader as n, createDebugProxyCaptureReaderAsync as r, acquireDebugProxyCaptureStoreAsync as t };