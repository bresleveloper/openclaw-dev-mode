import { DatabaseSync } from "node:sqlite";
import { ColumnType } from "kysely";
import { Agent } from "node:http";
//#region src/state/openclaw-state-db.generated.d.ts
type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
interface WorkerEnvironments {
  attached_session_ids_json: Generated<string>;
  bootstrap_bundle_hash: string | null;
  bootstrap_install_kind: string | null;
  bootstrap_openclaw_version: string | null;
  bootstrap_protocol_features_json: string | null;
  created_at_ms: number;
  desktop_json: string | null;
  destroy_requested_at_ms: number | null;
  environment_id: string;
  idle_since_at_ms: number | null;
  last_activated_at_ms: number | null;
  last_error: string | null;
  lease_id: string | null;
  node_device_id: string | null;
  node_setup_id: string | null;
  owner_epoch: Generated<number>;
  preparation_consumed_at_ms: number | null;
  preparation_demand_at_ms: number | null;
  preparation_expires_at_ms: number | null;
  preparation_key: string | null;
  preparation_purpose: string | null;
  profile_id: string;
  profile_snapshot_json: string;
  provider_id: string;
  provision_operation_id: string;
  shared_host: number | null;
  ssh_host: string | null;
  ssh_host_key: string | null;
  ssh_key_ref_json: string | null;
  ssh_port: number | null;
  ssh_user: string | null;
  state: string;
  state_changed_at_ms: number;
  teardown_terminal_state: string | null;
  updated_at_ms: number;
}
//#endregion
//#region src/infra/fetch-headers.d.ts
type HeadersLike = {
  entries: () => IterableIterator<[string, string]>;
  get: (name: string) => string | null;
  [Symbol.iterator]: () => IterableIterator<[string, string]>;
};
//#endregion
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
declare const DebugProxyCaptureStore: DebugProxyCaptureStoreConstructor;
declare function getDebugProxyCaptureStore(dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
declare function getDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
declare function closeDebugProxyCaptureStore(): void;
declare function acquireDebugProxyCaptureStore(dbPath: string, blobDir: string): {
  store: LegacyDebugProxyCaptureStore;
  release: () => void;
};
declare function acquireDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): {
  store: SharedDebugProxyCaptureStore;
  release: () => void;
};
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
declare function isDebugProxyGlobalFetchPatchInstalled(): boolean;
declare function finalizeDebugProxyCapture(resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
//#endregion
//#region src/proxy-capture/runtime.d.ts
declare function initializeDebugProxyCapture(mode: string, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
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
declare function captureHttpExchange(params: HttpCaptureParams, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
declare function captureWsEvent(params: {
  url: string;
  direction: "outbound" | "inbound" | "local";
  kind: "ws-open" | "ws-frame" | "ws-close" | "error";
  flowId: string;
  payload?: string | Buffer;
  closeCode?: number;
  errorText?: string;
  meta?: Record<string, unknown>;
}, resolved?: DebugProxySettings, deps?: DebugProxyCaptureRuntimeDeps): void;
//#endregion
export { WorkerEnvironments as _, isDebugProxyGlobalFetchPatchInstalled as a, closeDebugProxyCaptureStore as c, CaptureQueryPreset as d, CaptureQueryRow as f, resolveEffectiveDebugProxyUrl as g, resolveDebugProxySettings as h, finalizeDebugProxyCapture as i, getDebugProxyCaptureStore as l, createDebugProxyWebSocketAgent as m, captureWsEvent as n, DebugProxyCaptureStore as o, CaptureSessionSummary as p, initializeDebugProxyCapture as r, acquireDebugProxyCaptureStore as s, captureHttpExchange as t, CaptureEventRecord as u };