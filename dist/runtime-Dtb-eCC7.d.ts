import { DatabaseSync } from "node:sqlite";
import { Agent } from "node:http";
//#region src/proxy-capture/env.d.ts
type DebugProxySettings = {
  enabled: boolean;
  required: boolean;
  proxyUrl?: string;
  /** @deprecated Capture storage now lives in the shared state database. */
  dbPath: string;
  /** @deprecated Capture payloads now live in the shared state database. */
  blobDir: string;
  certDir: string;
  sessionId: string;
  sourceProcess: string;
};
declare function resolveDebugProxySettings(env?: NodeJS.ProcessEnv): DebugProxySettings;
declare function createDebugProxyWebSocketAgent(settings: DebugProxySettings): Agent | undefined;
declare function resolveEffectiveDebugProxyUrl(configuredProxyUrl?: string): string | undefined;
//#endregion
//#region src/proxy-capture/types.d.ts
type CaptureProtocol = "http" | "https" | "sse" | "ws" | "wss" | "connect";
type CaptureDirection = "outbound" | "inbound" | "local";
type CaptureEventKind = "connect" | "tls-handshake" | "request" | "response" | "ws-open" | "ws-frame" | "ws-close" | "error" | "retry-link";
type CaptureSessionRecord = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceScope: "openclaw";
  sourceProcess: string;
  proxyUrl?: string;
  /** @deprecated Capture storage now lives in the shared state database. */
  dbPath?: string;
  /** @deprecated Capture payloads now live in the shared state database. */
  blobDir?: string;
};
type CaptureBlobRecord = {
  blobId: string;
  path: string;
  encoding: "gzip";
  sizeBytes: number;
  sha256: string;
  contentType?: string;
};
type SharedCaptureBlobRecord = Omit<CaptureBlobRecord, "path"> & {
  path?: never;
};
type CaptureEventRecord = {
  sessionId: string;
  ts: number;
  sourceScope: "openclaw";
  sourceProcess: string;
  protocol: CaptureProtocol;
  direction: CaptureDirection;
  kind: CaptureEventKind;
  flowId: string;
  method?: string;
  host?: string;
  path?: string;
  status?: number;
  closeCode?: number;
  contentType?: string;
  headersJson?: string;
  dataText?: string;
  dataBlobId?: string;
  dataSha256?: string;
  errorText?: string;
  metaJson?: string;
};
type CaptureQueryPreset = "double-sends" | "retry-storms" | "cache-busting" | "ws-duplicate-frames" | "missing-ack" | "error-bursts";
type CaptureQueryRow = Record<string, string | number | null>;
type CaptureSessionSummary = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceProcess: string;
  proxyUrl?: string;
  eventCount: number;
};
type CaptureObservedDimension = {
  value: string;
  count: number;
};
type CaptureSessionCoverageSummary = {
  sessionId: string;
  totalEvents: number;
  unlabeledEventCount: number;
  providers: CaptureObservedDimension[];
  apis: CaptureObservedDimension[];
  models: CaptureObservedDimension[];
  hosts: CaptureObservedDimension[];
  localPeers: CaptureObservedDimension[];
};
//#endregion
//#region src/proxy-capture/store.kernel.d.ts
type DebugProxyCaptureKernelOptions = {
  db: DatabaseSync;
  dbPath: string;
  blobDir: string;
  pathBased?: {
    blobDir: string;
  };
  runWrite: <T>(operation: () => T) => T;
};
declare class DebugProxyCaptureKernel {
  readonly db: DatabaseSync;
  readonly dbPath: string;
  readonly blobDir: string;
  private readonly capturePathBased?;
  private readonly runWrite;
  constructor(options: DebugProxyCaptureKernelOptions);
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
  private countCaptureRows;
  private readSessionDeletionRows;
  private deleteSessionMetadata;
  private findRemainingBlobReferences;
}
declare function persistEventPayload(store: {
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
//#endregion
//#region src/proxy-capture/store.sqlite.d.ts
type DebugProxyCaptureStoreOptions = {
  env?: NodeJS.ProcessEnv;
};
declare class DebugProxyCaptureStoreImpl extends DebugProxyCaptureKernel {
  private readonly pathBased?;
  private readonly releaseIdleReference?;
  private closed;
  private closing;
  constructor(optionsOrDbPath?: DebugProxyCaptureStoreOptions | string, legacyBlobDir?: string);
  close(): void;
  get isClosed(): boolean;
}
/** @deprecated Use AsyncDebugProxyCaptureStore for worker-backed shared-state access. */
type DebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
};
type LegacyDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord;
};
type SharedDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): SharedCaptureBlobRecord;
};
type DebugProxyCaptureStoreConstructor = {
  new (dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
  new (options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
};
/** @deprecated Acquire shared-state storage with acquireDebugProxyCaptureStoreAsync. */
declare const DebugProxyCaptureStore: DebugProxyCaptureStoreConstructor;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. */
declare function getDebugProxyCaptureStore(dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. */
declare function getDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
/** @deprecated Await each async capture lease's release instead. */
declare function closeDebugProxyCaptureStore(): void;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. */
declare function acquireDebugProxyCaptureStore(dbPath: string, blobDir: string): {
  store: LegacyDebugProxyCaptureStore;
  release: () => void;
};
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. */
declare function acquireDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): {
  store: SharedDebugProxyCaptureStore;
  release: () => void;
};
declare function safeJsonString(value: unknown): string | undefined;
//#endregion
//#region src/proxy-capture/runtime-owner.d.ts
type DebugProxyCaptureStoreLike = Pick<ReturnType<typeof getDebugProxyCaptureStore>, "upsertSession" | "endSession" | "recordEvent"> & Partial<Pick<ReturnType<typeof getDebugProxyCaptureStore>, "close" | "isClosed">>;
type DebugProxyCaptureRuntimeDeps = {
  getStore?: () => DebugProxyCaptureStoreLike;
  closeStore?: () => void;
  persistEventPayload?: (store: DebugProxyCaptureStoreLike, payload: Parameters<typeof persistEventPayload>[1]) => ReturnType<typeof persistEventPayload>;
  safeJsonString?: typeof safeJsonString;
  fetchTarget?: typeof globalThis;
};
type DebugProxyCaptureAsyncRuntimeDeps = Pick<DebugProxyCaptureRuntimeDeps, "safeJsonString" | "fetchTarget">;
declare function isDebugProxyGlobalFetchPatchInstalled(): boolean;
/** @deprecated Use finalizeDebugProxyCaptureAsync to drain asynchronous capture work. */
declare function finalizeDebugProxyCapture(resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
declare function finalizeDebugProxyCaptureAsync(resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): Promise<void>;
//#endregion
//#region src/infra/fetch-headers.d.ts
type HeadersLike = {
  entries: () => IterableIterator<[string, string]>;
  get: (name: string) => string | null;
  [Symbol.iterator]: () => IterableIterator<[string, string]>;
};
//#endregion
//#region src/proxy-capture/runtime-response-body.d.ts
type HttpCaptureParams = {
  url: string;
  method: string;
  requestHeaders?: HeadersLike | Record<string, string> | undefined;
  requestBody?: BodyInit | Buffer | string | null;
  response: Response;
  signal?: AbortSignal;
  transport?: "http" | "sse";
  flowId?: string;
  meta?: Record<string, unknown>;
};
//#endregion
//#region src/proxy-capture/runtime.d.ts
/** @deprecated Use initializeDebugProxyCaptureAsync for worker-backed capture. */
declare function initializeDebugProxyCapture(mode: string, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
/** @deprecated Use captureHttpExchangeAsync and await capture finalization at shutdown. */
declare function captureHttpExchange(params: HttpCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
type WsCaptureParams = {
  url: string;
  direction: "outbound" | "inbound" | "local";
  kind: "ws-open" | "ws-frame" | "ws-close" | "error";
  flowId: string;
  payload?: string | Buffer;
  closeCode?: number;
  errorText?: string;
  meta?: Record<string, unknown>;
};
/** @deprecated Use captureWsEventAsync and await capture finalization at shutdown. */
declare function captureWsEvent(params: WsCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
declare function captureWsEventAsync(params: WsCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
declare function captureHttpExchangeAsync(params: HttpCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
declare function initializeDebugProxyCaptureAsync(mode: string, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
//#endregion
export { resolveEffectiveDebugProxyUrl as C, resolveDebugProxySettings as S, CaptureSessionCoverageSummary as _, initializeDebugProxyCapture as a, SharedCaptureBlobRecord as b, finalizeDebugProxyCaptureAsync as c, acquireDebugProxyCaptureStore as d, closeDebugProxyCaptureStore as f, CaptureQueryRow as g, CaptureQueryPreset as h, captureWsEventAsync as i, isDebugProxyGlobalFetchPatchInstalled as l, CaptureEventRecord as m, captureHttpExchangeAsync as n, initializeDebugProxyCaptureAsync as o, getDebugProxyCaptureStore as p, captureWsEvent as r, finalizeDebugProxyCapture as s, captureHttpExchange as t, DebugProxyCaptureStore as u, CaptureSessionRecord as v, createDebugProxyWebSocketAgent as x, CaptureSessionSummary as y };