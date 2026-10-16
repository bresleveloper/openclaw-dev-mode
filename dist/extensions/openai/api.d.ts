import { n as OpenClawConfig } from "../../types.openclaw-C-OasKBU.js";
import { _ as RealtimeVoiceBrowserSession, a as resolveProviderRequestHeaders$1, b as RealtimeVoiceProviderCapabilities, d as resolveAgentDir, f as redactSensitiveText, g as RealtimeVoiceBridge, h as RealtimeVoiceProviderPlugin, i as formatErrorMessage, l as fetchWithSsrFGuard, m as RealtimeTranscriptionProviderPlugin, o as createRealtimeTranscriptionWebSocketSession, p as PluginLogger, r as ProviderAuthContext, t as ProviderPlugin, u as OAuthCredentials, v as RealtimeVoiceBrowserSessionCreateRequest, y as RealtimeVoiceGatewayControl } from "../../net-CNd-dg0-.js";
import { na as MediaUnderstandingProvider, sa as AuthProfileCredential } from "../../node-list-types-BtJ_nH3c.js";
import "../../config-contracts-C9WIRZbi.js";
import "../../provider-onboard-D9ID6ldl.js";
import "../../ssrf-runtime-0hwhAsr2.js";
import { DatabaseSync } from "node:sqlite";
import "@openclaw/fs-safe/advanced";
import "kysely";
import { Agent, IncomingMessage, ServerResponse } from "node:http";
import "ws";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/store";
import "@openclaw/fs-safe/path";
import "@openclaw/ai/internal/shared";
import "@openclaw/fs-safe/atomic";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/watch";
//#region src/infra/http-response-body.d.ts
type ReadResponseTextPrefixOptions = {
  signal?: AbortSignal;
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error;
  /** Static timeout or lazy resolver evaluated immediately before body consumption. */
  timeoutMs?: number | (() => number);
  onTimeout?: (params: {
    timeoutMs: number;
  }) => Error;
};
//#endregion
//#region src/agents/provider-http-errors.d.ts
/** Shared timeout and byte-limit options for provider response consumption. */
type ProviderResponseReadOptions = ReadResponseTextPrefixOptions & {
  maxBytes?: number;
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
  /** Credentials that must not appear in malformed-response diagnostics. */
  requestHeaders?: HeadersInit;
};
/** Options for bounded provider error-body normalization. */
type ProviderHttpErrorOptions = {
  statusPrefix?: string;
  signal?: AbortSignal;
  maxBodyBytes?: number;
  bodyTimeoutMs?: ReadResponseTextPrefixOptions["timeoutMs"];
  onBodyTimeout?: NonNullable<ReadResponseTextPrefixOptions["onTimeout"]>;
  /** Scrub reflected request credentials before retaining response diagnostics. */
  requestHeaders?: HeadersInit;
};
/** Reads a successful provider text response under a byte cap. */
declare function readProviderTextResponse(response: Response, label: string, opts?: ProviderResponseReadOptions): Promise<string>;
/** Error type carrying normalized provider status, request id, code, type, and body metadata. */
declare class ProviderHttpError extends Error {
  readonly status: number;
  readonly statusCode: number;
  retryAfterMs?: number;
  readonly code?: string;
  readonly errorCode?: string;
  readonly errorType?: string;
  readonly errorBody?: string;
  readonly requestId?: string;
  constructor(message: string, params: {
    status: number;
    code?: string;
    type?: string;
    body?: string;
    requestId?: string;
    retryAfterMs?: number;
  });
}
/** Creates a normalized provider HTTP error from a failed response. */
declare function createProviderHttpError(response: Response, label: string, options?: ProviderHttpErrorOptions): Promise<ProviderHttpError>;
/**
 * Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
 *
 * The body is read through the same bounded reader as binary responses so a provider that streams an
 * unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
 */
declare function readProviderJsonResponse<T>(response: Response, label: string, opts?: ProviderResponseReadOptions): Promise<T>;
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
//#region src/proxy-capture/store.async.d.ts
declare function acquireDebugProxyCaptureStoreAsync(options?: {
  env?: NodeJS.ProcessEnv;
}): Promise<{
  store: AsyncDebugProxyCaptureStore;
  release: () => Promise<void>;
}>;
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
//#region extensions/openai/default-models.d.ts
export declare const OPENAI_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
export declare const OPENAI_DEFAULT_TTS_MODEL = "gpt-4o-mini-tts";
export declare const OPENAI_DEFAULT_TTS_VOICE = "alloy";
export declare const OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL = "gpt-4o-transcribe";
export declare const OPENAI_DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export declare function applyOpenAIProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenAIConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
//#region extensions/openai/media-understanding-provider.d.ts
export declare const openaiMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
//#region extensions/openai/openai-chatgpt-oauth.runtime.d.ts
export declare function loginOpenAICodexOAuth(params: {
  prompter: ProviderAuthContext["prompter"];
  runtime: ProviderAuthContext["runtime"];
  oauth: ProviderAuthContext["oauth"];
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  signal?: AbortSignal;
  assertCurrent?: () => void;
  onManualCodeInput?: () => Promise<string>;
  localBrowserMessage?: string;
}): Promise<OAuthCredentials | null>;
//#endregion
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.d.ts
declare function refreshOpenAICodexToken$1(refreshToken: string): Promise<OAuthCredentials>;
//#endregion
//#region extensions/openai/openai-chatgpt-provider.runtime.d.ts
export declare function refreshOpenAICodexToken(...args: Parameters<typeof refreshOpenAICodexToken$1>): Promise<Awaited<ReturnType<typeof refreshOpenAICodexToken$1>>>;
//#endregion
//#region extensions/openai/openai-provider.d.ts
export declare function buildOpenAIProvider(): ProviderPlugin;
//#endregion
//#region extensions/openai/realtime-transcription-provider.d.ts
export declare function buildOpenAIRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
//#endregion
//#region src/talk/agent-consult-tool.d.ts
/** Compact transcript entry included in delegated agent prompts. */
type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
//#endregion
//#region src/infra/kysely-sync-cache-state.d.ts
declare const { kyselyByDatabase, queryErrorHandlerByDatabase }: {
  kyselyByDatabase: WeakMap<DatabaseSync, unknown>;
  queryErrorHandlerByDatabase: WeakMap<DatabaseSync, (error: unknown) => void>;
};
//#endregion
//#region src/proxy-capture/store-readonly.d.ts
type DebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
  readBlob(blobId: string): string | null;
};
/** @deprecated Use createDebugProxyCaptureReaderAsync for worker-backed, noncreating reads. */
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
declare namespace proxy_capture_d_exports {
  export { AsyncDebugProxyCaptureReader, AsyncDebugProxyCaptureStore, CaptureEventRecord, CaptureQueryPreset, CaptureQueryRow, CaptureSessionSummary, DebugProxyCaptureReader, DebugProxyCaptureStore, acquireDebugProxyCaptureStore, acquireDebugProxyCaptureStoreAsync, captureHttpExchange, captureHttpExchangeAsync, captureWsEvent, captureWsEventAsync, closeDebugProxyCaptureStore, createDebugProxyCaptureReader, createDebugProxyCaptureReaderAsync, createDebugProxyWebSocketAgent, finalizeDebugProxyCapture, finalizeDebugProxyCaptureAsync, getDebugProxyCaptureStore, initializeDebugProxyCapture, initializeDebugProxyCaptureAsync, isDebugProxyGlobalFetchPatchInstalled, resolveDebugProxySettings, resolveEffectiveDebugProxyUrl };
}
//#endregion
//#region extensions/openai/realtime-host.d.ts
declare const openAIRealtimeHost: {
  resolveAgentDir: typeof resolveAgentDir;
  isProviderAuthProfileConfigured: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => boolean;
  resolveProviderAuthProfileApiKey: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => Promise<string | undefined>;
  resolveProviderRequestHeaders: typeof resolveProviderRequestHeaders$1;
  createRealtimeTranscriptionWebSocketSession: typeof createRealtimeTranscriptionWebSocketSession;
  captureWsEventAsync: typeof captureWsEventAsync | undefined;
  createDebugProxyWebSocketAgent: typeof createDebugProxyWebSocketAgent;
  resolveDebugProxySettings: typeof resolveDebugProxySettings;
  fetchWithSsrFGuard: typeof fetchWithSsrFGuard;
  createProviderHttpError: typeof createProviderHttpError;
  readProviderJsonResponse: typeof readProviderJsonResponse;
  readProviderTextResponse: typeof readProviderTextResponse;
  formatErrorMessage: typeof formatErrorMessage;
  warn: (value: string) => string;
  redactSensitiveText: typeof redactSensitiveText;
};
type OpenAIRealtimeHost = typeof openAIRealtimeHost;
//#endregion
//#region extensions/openai/realtime-quicksilver-wire.d.ts
type OpenAIQuicksilverAuth = {
  type: "api-key";
  token: string;
} | {
  type: "oauth";
  token: string;
  accountId: string;
};
//#endregion
//#region extensions/openai/realtime-quicksilver-session.d.ts
type OpenAIQuicksilverSessionRequest = {
  initialItems?: RealtimeVoiceAgentConsultTranscriptEntry[];
  ownerConnId?: string;
} & ((RealtimeVoiceBrowserSessionCreateRequest & {
  gaSession?: Record<string, unknown> & {
    model: string;
  };
  gaSideband?: never;
}) | (Omit<RealtimeVoiceBrowserSessionCreateRequest, "clientControl" | "gatewayControl"> & {
  clientControl: {
    owner: "gateway";
  };
  gatewayControl: RealtimeVoiceGatewayControl;
  gaSession: Record<string, unknown> & {
    model: string;
  };
  gaSideband: {
    createBridge: (params: {
      apiKey: string;
      callId: string;
      onTerminal: () => void;
    }) => RealtimeVoiceBridge;
  };
}));
type OpenAIQuicksilverBrowserSessionBroker = {
  capabilities: Partial<RealtimeVoiceProviderCapabilities> & {
    handlesAgentConsult: true;
  };
  createBrowserSession: (request: OpenAIQuicksilverSessionRequest, auth: OpenAIQuicksilverAuth) => Promise<RealtimeVoiceBrowserSession>;
  cancelBrowserSession: (session: RealtimeVoiceBrowserSession) => Promise<void> | void;
};
//#endregion
//#region extensions/openai/realtime-voice-provider-factory.d.ts
declare function buildOpenAIRealtimeVoiceProvider$1(context: OpenAIRealtimeHost, options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
//#endregion
//#region extensions/openai/realtime-voice-provider.d.ts
export declare function buildOpenAIRealtimeVoiceProvider(options?: Parameters<typeof buildOpenAIRealtimeVoiceProvider$1>[1]): RealtimeVoiceProviderPlugin;
//#endregion