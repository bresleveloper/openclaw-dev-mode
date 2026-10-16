import { ar as GatewayClientName, ir as GatewayClientMode } from "./reply-payload-DazZPys5.js";
import "./types-C-BtfS0H.js";
import { Ht as HelloOk, Vt as EventFrame, zt as ConnectParams } from "./index-B4F-ENEv.js";
import { r as GatewayWebSocketTargetOptions } from "./websocket-DbnFnlN8.js";
//#region packages/gateway-client/src/client-device-auth.d.ts
type DeviceAuthTokenRecord = {
  token?: string;
  scopes?: string[];
};
type MaybePromise<T> = T | Promise<T>;
type DeviceAuthOperation = {
  signal?: AbortSignal;
  assertCurrent?: () => void;
};
type GatewayClientDeviceAuthStorage = {
  loadDeviceAuthToken?: (params: DeviceAuthOperation & {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => MaybePromise<DeviceAuthTokenRecord | null>;
  storeDeviceAuthToken?: (params: DeviceAuthOperation & {
    deviceId: string;
    role: string;
    token: string;
    scopes: string[];
    env?: NodeJS.ProcessEnv;
    expectedToken?: string | null;
  }) => unknown;
  clearDeviceAuthToken?: (params: DeviceAuthOperation & {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
    expectedToken?: string;
  }) => unknown;
};
//#endregion
//#region packages/gateway-client/src/protocol-request.d.ts
type GatewayProtocolRequestOptions = {
  timeoutMs?: number | null;
  expectFinal?: boolean;
  onSent?: (requestId: string) => void;
  onAccepted?: (payload: unknown) => void;
  signal?: AbortSignal;
};
//#endregion
//#region packages/gateway-client/src/pending-request.d.ts
type GatewayProtocolRequestTiming = {
  id: string;
  method: string;
  ok: boolean;
  durationMs: number;
  startedAtMs: number;
  endedAtMs: number;
  errorCode?: string;
};
//#endregion
//#region packages/gateway-client/src/protocol-client-contract.d.ts
type GatewayClientCloseInfo = {
  phase: "pre-hello" | "post-hello";
  socketOpened: boolean;
  transportValidated: boolean;
  connectRequestSent?: boolean;
  transientPreHelloCleanClose: boolean;
  connectError?: Error;
};
type GatewayClientConnectionMetadata = {
  clientName?: GatewayClientName;
  hasDeviceIdentity: boolean;
  mode?: GatewayClientMode;
  preauthHandshakeTimeoutMs?: number;
};
//#endregion
//#region packages/gateway-client/src/client.d.ts
type DeviceIdentity = {
  deviceId: string;
  privateKeyPem: string;
  publicKeyPem: string;
};
type GatewayClientHostDeps = GatewayClientDeviceAuthStorage & {
  loadOrCreateDeviceIdentity?: () => DeviceIdentity | undefined;
  signDevicePayload?: (privateKeyPem: string, payload: string) => string;
  publicKeyRawBase64UrlFromPem?: (publicKeyPem: string) => string;
  beforeConnect?: () => void;
  registerGatewayLoopbackBypass?: (url: string) => (() => void) | undefined;
  logDebug?: (message: string) => void;
  logError?: (message: string) => void;
  redactForLog?: (message: string) => string;
  normalizeTlsFingerprint?: (fingerprint: string | undefined) => string;
};
type GatewayClientRequestOptions = GatewayProtocolRequestOptions;
type GatewayReconnectPausedInfo = {
  code: number;
  reason: string;
  detailCode: string | null;
};
type GatewayClientOptions$1 = GatewayWebSocketTargetOptions & NonNullable<ConnectParams["auth"]> & {
  origin?: string;
  /** Already-resolved edge-proxy auth headers (identity-aware proxy in front of the Gateway). */
  edgeAuthHeaders?: Readonly<Record<string, string>>;
  connectChallengeTimeoutMs?: number;
  /**
   * Server-side pre-auth handshake budget. Config-derived local clients use
   * this to keep the connect-challenge watchdog aligned with the gateway.
   */
  preauthHandshakeTimeoutMs?: number;
  tickWatchMinIntervalMs?: number;
  tickWatchTimeoutMs?: number;
  requestTimeoutMs?: number;
  /** Prefer one setup credential for the first successful device-auth exchange. */
  preferBootstrapToken?: boolean;
  instanceId?: string;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  clientBuildId?: string;
  platform?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  mode?: GatewayClientMode;
  role?: string;
  scopes?: string[];
  modelCatalog?: ConnectParams["modelCatalog"];
  caps?: string[];
  commands?: string[];
  computerUse?: ConnectParams["computerUse"];
  /** @deprecated Compatibility for the shipped v1 node-host connect envelope. */
  workerRuns?: ConnectParams["workerRuns"];
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  env?: NodeJS.ProcessEnv;
  deviceIdentity?: DeviceIdentity | null;
  hostDeps?: GatewayClientHostDeps;
  minProtocol?: number;
  maxProtocol?: number;
  onEvent?: (evt: EventFrame) => void;
  onHelloOk?: (hello: HelloOk) => void;
  onConnectError?: (err: Error) => void;
  onReconnectPaused?: (info: GatewayReconnectPausedInfo) => void;
  /** Report retryable startup closes for clients that present connection progress. */
  notifyOnStartupRetry?: boolean;
  onClose?: (code: number, reason: string, info?: GatewayClientCloseInfo) => void;
  onGap?: (info: {
    expected: number;
    received: number;
  }) => void;
  onRequestTiming?: (timing: GatewayProtocolRequestTiming) => void;
};
//#endregion
//#region src/shared/device-auth.d.ts
/** Stored bearer token metadata for one authorized device role. */
type DeviceAuthEntry = {
  token: string;
  role: string;
  scopes: string[];
  updatedAtMs: number;
};
//#endregion
//#region src/infra/ssh-tunnel.d.ts
type SshTunnel = {
  localPort: number;
  pid: number | null;
  closed: Promise<void>;
  isActive: () => boolean;
  stop: () => Promise<void>;
};
//#endregion
//#region src/gateway/connection-details.d.ts
type GatewaySshRoute = {
  target: string;
  remotePort: number;
  identity?: string;
  hostKeyPolicy?: "strict" | "openssh";
};
/** Resolved gateway target plus redacted display text for diagnostics. */
type GatewayConnectionDetails = {
  url: string;
  urlSource: string;
  bindDetail?: string;
  remoteFallbackNote?: string;
  message: string;
};
//#endregion
//#region src/gateway/client.d.ts
type GatewayClientOptions = GatewayClientOptions$1 & {
  /** Exact normalized remote gateway scope for origin-bound device credentials. */
  deviceAuthScope?: string;
  /** Prevent this client lifecycle from creating or mutating shared state. */
  sharedStateMode?: "read-only";
  /** Auth already resolved and validated by the one-shot call owner. */
  preparedDeviceAuth?: DeviceAuthEntry;
  /** Selected remote route; this client owns its SSH transport lifetime. */
  sshTunnel?: GatewaySshRoute;
  /** Transfer a tunnel already opened for the same selected route. */
  preparedSshTunnel?: SshTunnel;
};
declare class GatewayClient {
  #private;
  constructor(opts: GatewayClientOptions);
  private createClient;
  start(): void;
  private startSsh;
  private notifySshClosed;
  stop(): void;
  stopAndWait(opts?: {
    timeoutMs?: number;
  }): Promise<void>;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
  /** Current transport state, including CLOSING before the close callback fires.
   * This is not authentication or readiness evidence on its own. */
  get connected(): boolean;
  getConnectionMetadata(): GatewayClientConnectionMetadata;
  updateNodeManifest(manifest: {
    caps: string[];
    commands: string[];
    computerUse?: GatewayClientOptions$1["computerUse"];
  }): void;
}
//#endregion
export { GatewayClientRequestOptions as a, GatewayClientOptions$1 as i, GatewayClientOptions as n, GatewayConnectionDetails as r, GatewayClient as t };