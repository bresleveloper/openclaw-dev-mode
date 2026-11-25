import { t as SchemaContract } from "./schema-contract-c2sTcmgZ.js";
import { t as EngineConnection } from "./sql-connection-CSeUqY2a.js";
import { z } from "zod";
import { Agent } from "node:http";
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
declare const debugProxyCaptureWriteCommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"capture.upsertSession">;
  input: z.ZodObject<{
    id: z.ZodString;
    startedAt: z.ZodNumber;
    endedAt: z.ZodOptional<z.ZodNumber>;
    mode: z.ZodString;
    sourceScope: z.ZodLiteral<"openclaw">;
    sourceProcess: z.ZodString;
    proxyUrl: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.endSession">;
  input: z.ZodObject<{
    sessionId: z.ZodString;
    endedAt: z.ZodNumber;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.recordEvent">;
  input: z.ZodObject<{
    sessionId: z.ZodString;
    ts: z.ZodNumber;
    sourceScope: z.ZodLiteral<"openclaw">;
    sourceProcess: z.ZodString;
    protocol: z.ZodEnum<{
      connect: "connect";
      http: "http";
      https: "https";
      sse: "sse";
      ws: "ws";
      wss: "wss";
    }>;
    direction: z.ZodEnum<{
      inbound: "inbound";
      local: "local";
      outbound: "outbound";
    }>;
    kind: z.ZodEnum<{
      connect: "connect";
      error: "error";
      request: "request";
      response: "response";
      "retry-link": "retry-link";
      "tls-handshake": "tls-handshake";
      "ws-close": "ws-close";
      "ws-frame": "ws-frame";
      "ws-open": "ws-open";
    }>;
    flowId: z.ZodString;
    method: z.ZodOptional<z.ZodString>;
    host: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNumber>;
    closeCode: z.ZodOptional<z.ZodNumber>;
    contentType: z.ZodOptional<z.ZodString>;
    headersJson: z.ZodOptional<z.ZodString>;
    dataText: z.ZodOptional<z.ZodString>;
    dataBlobId: z.ZodOptional<z.ZodString>;
    dataSha256: z.ZodOptional<z.ZodString>;
    errorText: z.ZodOptional<z.ZodString>;
    metaJson: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.recordEventWithPayload">;
  input: z.ZodObject<{
    event: z.ZodObject<{
      sessionId: z.ZodString;
      ts: z.ZodNumber;
      sourceScope: z.ZodLiteral<"openclaw">;
      sourceProcess: z.ZodString;
      protocol: z.ZodEnum<{
        connect: "connect";
        http: "http";
        https: "https";
        sse: "sse";
        ws: "ws";
        wss: "wss";
      }>;
      direction: z.ZodEnum<{
        inbound: "inbound";
        local: "local";
        outbound: "outbound";
      }>;
      kind: z.ZodEnum<{
        connect: "connect";
        error: "error";
        request: "request";
        response: "response";
        "retry-link": "retry-link";
        "tls-handshake": "tls-handshake";
        "ws-close": "ws-close";
        "ws-frame": "ws-frame";
        "ws-open": "ws-open";
      }>;
      flowId: z.ZodString;
      method: z.ZodOptional<z.ZodString>;
      host: z.ZodOptional<z.ZodString>;
      path: z.ZodOptional<z.ZodString>;
      status: z.ZodOptional<z.ZodNumber>;
      closeCode: z.ZodOptional<z.ZodNumber>;
      contentType: z.ZodOptional<z.ZodString>;
      headersJson: z.ZodOptional<z.ZodString>;
      dataText: z.ZodOptional<z.ZodString>;
      dataBlobId: z.ZodOptional<z.ZodString>;
      dataSha256: z.ZodOptional<z.ZodString>;
      errorText: z.ZodOptional<z.ZodString>;
      metaJson: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    payload: z.ZodPipe<z.ZodObject<{
      data: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      base64: z.ZodOptional<z.ZodBoolean>;
      contentType: z.ZodOptional<z.ZodString>;
      previewLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodTransform<{
      contentType?: string | undefined;
      previewLimit?: number | undefined;
      data: string | Buffer<ArrayBuffer> | null | undefined;
    }, {
      data?: string | null | undefined;
      base64?: boolean | undefined;
      contentType?: string | undefined;
      previewLimit?: number | undefined;
    }>>;
  }, z.core.$strict>;
}, z.core.$strict>], "type">;
declare const debugProxyCliCommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"capture.upsertSession">;
  input: z.ZodObject<{
    id: z.ZodString;
    startedAt: z.ZodNumber;
    endedAt: z.ZodOptional<z.ZodNumber>;
    mode: z.ZodString;
    sourceScope: z.ZodLiteral<"openclaw">;
    sourceProcess: z.ZodString;
    proxyUrl: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.endSession">;
  input: z.ZodObject<{
    sessionId: z.ZodString;
    endedAt: z.ZodNumber;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.recordEvent">;
  input: z.ZodObject<{
    sessionId: z.ZodString;
    ts: z.ZodNumber;
    sourceScope: z.ZodLiteral<"openclaw">;
    sourceProcess: z.ZodString;
    protocol: z.ZodEnum<{
      connect: "connect";
      http: "http";
      https: "https";
      sse: "sse";
      ws: "ws";
      wss: "wss";
    }>;
    direction: z.ZodEnum<{
      inbound: "inbound";
      local: "local";
      outbound: "outbound";
    }>;
    kind: z.ZodEnum<{
      connect: "connect";
      error: "error";
      request: "request";
      response: "response";
      "retry-link": "retry-link";
      "tls-handshake": "tls-handshake";
      "ws-close": "ws-close";
      "ws-frame": "ws-frame";
      "ws-open": "ws-open";
    }>;
    flowId: z.ZodString;
    method: z.ZodOptional<z.ZodString>;
    host: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNumber>;
    closeCode: z.ZodOptional<z.ZodNumber>;
    contentType: z.ZodOptional<z.ZodString>;
    headersJson: z.ZodOptional<z.ZodString>;
    dataText: z.ZodOptional<z.ZodString>;
    dataBlobId: z.ZodOptional<z.ZodString>;
    dataSha256: z.ZodOptional<z.ZodString>;
    errorText: z.ZodOptional<z.ZodString>;
    metaJson: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.recordEventWithPayload">;
  input: z.ZodObject<{
    event: z.ZodObject<{
      sessionId: z.ZodString;
      ts: z.ZodNumber;
      sourceScope: z.ZodLiteral<"openclaw">;
      sourceProcess: z.ZodString;
      protocol: z.ZodEnum<{
        connect: "connect";
        http: "http";
        https: "https";
        sse: "sse";
        ws: "ws";
        wss: "wss";
      }>;
      direction: z.ZodEnum<{
        inbound: "inbound";
        local: "local";
        outbound: "outbound";
      }>;
      kind: z.ZodEnum<{
        connect: "connect";
        error: "error";
        request: "request";
        response: "response";
        "retry-link": "retry-link";
        "tls-handshake": "tls-handshake";
        "ws-close": "ws-close";
        "ws-frame": "ws-frame";
        "ws-open": "ws-open";
      }>;
      flowId: z.ZodString;
      method: z.ZodOptional<z.ZodString>;
      host: z.ZodOptional<z.ZodString>;
      path: z.ZodOptional<z.ZodString>;
      status: z.ZodOptional<z.ZodNumber>;
      closeCode: z.ZodOptional<z.ZodNumber>;
      contentType: z.ZodOptional<z.ZodString>;
      headersJson: z.ZodOptional<z.ZodString>;
      dataText: z.ZodOptional<z.ZodString>;
      dataBlobId: z.ZodOptional<z.ZodString>;
      dataSha256: z.ZodOptional<z.ZodString>;
      errorText: z.ZodOptional<z.ZodString>;
      metaJson: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    payload: z.ZodPipe<z.ZodObject<{
      data: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      base64: z.ZodOptional<z.ZodBoolean>;
      contentType: z.ZodOptional<z.ZodString>;
      previewLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodTransform<{
      contentType?: string | undefined;
      previewLimit?: number | undefined;
      data: string | Buffer<ArrayBuffer> | null | undefined;
    }, {
      data?: string | null | undefined;
      base64?: boolean | undefined;
      contentType?: string | undefined;
      previewLimit?: number | undefined;
    }>>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.listSessions">;
  input: z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.readBlob">;
  input: z.ZodObject<{
    blobId: z.ZodString;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.queryPreset">;
  input: z.ZodObject<{
    preset: z.ZodEnum<{
      "cache-busting": "cache-busting";
      "double-sends": "double-sends";
      "error-bursts": "error-bursts";
      "missing-ack": "missing-ack";
      "retry-storms": "retry-storms";
      "ws-duplicate-frames": "ws-duplicate-frames";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"capture.purgeAll">;
  input: z.ZodOptional<z.ZodUndefined>;
}, z.core.$strict>], "type">;
type CaptureWriteCommand = z.input<typeof debugProxyCaptureWriteCommandSchema>;
type CaptureCliCommand = z.input<typeof debugProxyCliCommandSchema>;
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
type CaptureEventRecord = SchemaContract<Extract<CaptureWriteCommand, {
  type: "capture.recordEvent";
}>["input"]>;
type CaptureQueryPreset = Extract<CaptureCliCommand, {
  type: "capture.queryPreset";
}>["input"]["preset"];
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
type DebugProxyCaptureKernelOptions = {
  db: EngineConnection;
  dbPath: string;
  blobDir: string;
  pathBased?: {
    blobDir: string;
  };
  runWrite: <T>(operation: () => T) => T;
};
declare class DebugProxyCaptureKernel {
  readonly db: EngineConnection;
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
  private readSessionDeletionBlobRows;
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
/** @deprecated Use AsyncDebugProxyCaptureStore for worker-backed shared-state access. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
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
/** @deprecated Acquire shared-state storage with acquireDebugProxyCaptureStoreAsync. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare const DebugProxyCaptureStore: DebugProxyCaptureStoreConstructor;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function getDebugProxyCaptureStore(dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function getDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
/** @deprecated Await each async capture lease's release instead. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function closeDebugProxyCaptureStore(): void;
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function acquireDebugProxyCaptureStore(dbPath: string, blobDir: string): {
  store: LegacyDebugProxyCaptureStore;
  release: () => void;
};
/** @deprecated Use acquireDebugProxyCaptureStoreAsync for shared-state access. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function acquireDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): {
  store: SharedDebugProxyCaptureStore;
  release: () => void;
};
declare function safeJsonString(value: unknown): string | undefined;
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
/** @deprecated Use finalizeDebugProxyCaptureAsync to drain asynchronous capture work. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function finalizeDebugProxyCapture(resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
declare function finalizeDebugProxyCaptureAsync(resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): Promise<void>;
type HeadersLike = {
  entries: () => IterableIterator<[string, string]>;
  get: (name: string) => string | null;
  [Symbol.iterator]: () => IterableIterator<[string, string]>;
};
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
/** @deprecated Use initializeDebugProxyCaptureAsync for worker-backed capture. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function initializeDebugProxyCapture(mode: string, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
/** @deprecated Use captureHttpExchangeAsync and await capture finalization at shutdown. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
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
/** @deprecated Use captureWsEventAsync and await capture finalization at shutdown. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function captureWsEvent(params: WsCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
declare function captureWsEventAsync(params: WsCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
declare function captureHttpExchangeAsync(params: HttpCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
declare function initializeDebugProxyCaptureAsync(mode: string, resolved?: DebugProxySettings, deps?: DebugProxyCaptureAsyncRuntimeDeps): Promise<void>;
export { CaptureQueryRow as _, initializeDebugProxyCapture as a, resolveDebugProxySettings as b, finalizeDebugProxyCaptureAsync as c, DebugProxyCaptureStore as d, acquireDebugProxyCaptureStore as f, CaptureQueryPreset as g, CaptureEventRecord as h, captureWsEventAsync as i, isDebugProxyGlobalFetchPatchInstalled as l, getDebugProxyCaptureStore as m, captureHttpExchangeAsync as n, initializeDebugProxyCaptureAsync as o, closeDebugProxyCaptureStore as p, captureWsEvent as r, finalizeDebugProxyCapture as s, captureHttpExchange as t, AsyncDebugProxyCaptureStore as u, CaptureSessionSummary as v, resolveEffectiveDebugProxyUrl as x, createDebugProxyWebSocketAgent as y };