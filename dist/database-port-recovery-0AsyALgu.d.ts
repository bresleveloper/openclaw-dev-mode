import { A as GatewayTailscaleMode, C as GatewayAuthConfig, j as GatewayTrustedProxyConfig, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
import { dn as HelloOk, ln as ConnectParams, un as EventFrame } from "./index-DSy-_0fC.js";
import { a as GatewayClientMode, o as GatewayClientName } from "./client-info-CIRM8sMN.js";
import { r as GatewayWebSocketTargetOptions } from "./websocket-D7KFeEfD.js";
import { z } from "zod";
declare const KNOWN_OPERATOR_SCOPE_VALUES: readonly ["operator.admin", "operator.read", "operator.write", "operator.cron", "operator.sessions.read", "operator.sessions.write", "operator.approvals", "operator.questions", "operator.pairing", "operator.talk", "operator.talk.secrets"];
type OperatorScope = (typeof KNOWN_OPERATOR_SCOPE_VALUES)[number];
/** Stored bearer token metadata for one authorized device role. */
type DeviceAuthEntry = {
  token: string;
  role: string;
  scopes: string[];
  updatedAtMs: number;
};
/** Authentication modes after config, override, and credential inputs are combined. */
type ResolvedGatewayAuthMode = NonNullable<GatewayAuthConfig["mode"]>;
/** Records which input selected the effective Gateway auth mode. */
type ResolvedGatewayAuthModeSource = "override" | "config" | "password" | "token" | "default";
/** Fully resolved Gateway auth policy before startup validates required secrets. */
type ResolvedGatewayAuth = {
  mode: ResolvedGatewayAuthMode;
  modeSource?: ResolvedGatewayAuthModeSource;
  token?: string;
  password?: string;
  allowTailscale: boolean;
  trustedProxy?: GatewayTrustedProxyConfig;
};
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
declare function resolveGatewayAuth(params: {
  authConfig?: GatewayAuthConfig | null;
  authOverride?: GatewayAuthConfig | null;
  env?: NodeJS.ProcessEnv;
  tailscaleMode?: GatewayTailscaleMode;
}): ResolvedGatewayAuth;
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
type GatewayProtocolRequestOptions = {
  timeoutMs?: number | null;
  expectFinal?: boolean;
  onSent?: (requestId: string) => void;
  onAccepted?: (payload: unknown) => void;
  signal?: AbortSignal;
  /** Abort unsent/retry work while retaining a sent write's result and original deadline. */
  retainSentResultOnAbort?: boolean;
};
type GatewayProtocolRequestTiming = {
  id: string;
  method: string;
  ok: boolean;
  durationMs: number;
  startedAtMs: number;
  endedAtMs: number;
  errorCode?: string;
};
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
  /** Synchronously revalidate the caller's live authority before transport writes. */
  assertConnectionCurrent?: () => void;
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
declare class GatewayClient$1 {
  private readonly protocol;
  private ws;
  private opts;
  private deps;
  private stopped;
  private useLegacyNodeProtocolEnvelope;
  private nodeProtocolTransitionPending;
  private pendingDeviceTokenRetry;
  private deviceTokenRetryBudgetUsed;
  private approvalRuntimeTokenCompatibilityDisabled;
  private approvalRuntimeTokenRetryBudgetUsed;
  private lastTick;
  private tickIntervalMs;
  private tickTimer;
  private readonly requestTimeoutMs;
  private pendingStop;
  private readonly deviceAuth;
  private connectionStoredToken?;
  private transportValidated;
  private suppressedTransientPreHelloCleanCloses;
  constructor(opts: GatewayClientOptions$1);
  /** Current transport state, including CLOSING before the close callback fires.
   * This is not authentication or readiness evidence on its own. */
  get connected(): boolean;
  getConnectionMetadata(): GatewayClientConnectionMetadata;
  updateNodeManifest(manifest: {
    caps: string[];
    commands: string[];
    computerUse?: ConnectParams["computerUse"];
    /** @deprecated Compatibility for the shipped v1 node-host connect envelope. */
    workerRuns?: ConnectParams["workerRuns"];
  }): void;
  start(): void;
  private createSocket;
  stop(): void;
  stopAndWait(opts?: {
    timeoutMs?: number;
  }): Promise<void>;
  private beginStop;
  private resolvePendingStop;
  private logDebug;
  private logError;
  private shouldRetryWithAlternateNodeProtocol;
  private resolveConnectRequestFailure;
  private resolveClose;
  private clearStaleDeviceTokenForClose;
  private clearDeviceToken;
  private notifyConnectError;
  private notifyReconnectPaused;
  private isUnsupportedConnectAuthField;
  private isTrustedDeviceRetryEndpoint;
  private startTickWatch;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
}
type SshTunnel = {
  localPort: number;
  pid: number | null;
  closed: Promise<void>;
  isActive: () => boolean;
  stop: () => Promise<void>;
};
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
  private needsDeviceIdentity;
  private createClient;
  start(): void;
  private startPreparedClient;
  private startSsh;
  private notifyClosed;
  stop(): void;
  stopAndWait(opts?: {
    timeoutMs?: number;
  }): Promise<void>;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
  /** Current transport state, including CLOSING before the close callback fires.
   * This is not authentication or readiness evidence on its own. */
  get connected(): boolean;
  getConnectionMetadata(): GatewayClientConnectionMetadata;
  updateNodeManifest(manifest: Parameters<GatewayClient$1["updateNodeManifest"]>[0]): void;
}
type GatewayCallDeviceAuthOptions = Pick<GatewayClientOptions, "mode" | "clientName" | "deviceIdentity" | "preparedDeviceAuth" | "sharedStateMode" | "approvalRuntimeToken" | "agentRuntimeIdentityToken"> & {
  useStoredDeviceAuth?: boolean;
  requireLocalBackendSharedAuth?: boolean;
  /** Reuse local auth-none authority without opening device storage for ordinary CLI RPCs. */
  allowLocalBackendAuthNone?: boolean;
  /** CLI storage selection is lazy until authentication needs a local identity. */
  beforeDeviceIdentityLoad?: () => Promise<void>;
};
type GatewayRequestFunction = <T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions) => Promise<T>;
type CallGatewayBaseOptions = Pick<GatewayClientOptions, "caps"> & GatewayCallDeviceAuthOptions & {
  url?: string;
  /** Require this resolved endpoint without overriding target selection or authentication. */
  expectUrl?: string;
  token?: string;
  password?: string;
  tlsFingerprint?: string;
  preauthHandshakeTimeoutMs?: number;
  config?: OpenClawConfig;
  method: string;
  params?: unknown;
  expectFinal?: boolean;
  timeoutMs?: number | null;
  signal?: AbortSignal;
  assertConnectionCurrent?: () => void;
  prepareDispatchCurrent?: () => Promise<void>;
  assertDispatchCurrent?: () => void;
  onAccepted?: GatewayClientRequestOptions["onAccepted"];
  onSignalAbort?: (request: GatewayRequestFunction) => Promise<void> | void;
  /** Continue a multi-request operation on this exact authenticated connection. */
  onResponse?: (request: GatewayRequestFunction, signal: AbortSignal) => Promise<void>;
  clientDisplayName?: string;
  clientVersion?: string;
  platform?: string;
  requiredStoredDeviceAuthScopes?: OperatorScope[];
  /** Keep caller-resolved token/password authoritative, including an empty result. */
  skipImplicitAuth?: boolean;
  onHelloOk?: GatewayClientOptions["onHelloOk"];
  instanceId?: string;
  minProtocol?: number;
  maxProtocol?: number;
  requiredCapabilities?: string[];
  requiredMethods?: string[];
  /**
   * Overrides the config path shown in connection error details.
   * Does not affect config loading; callers still control auth via opts.token/password/env/config.
   */
  configPath?: string;
  /**
   * Explicit local gateway port for command-line overrides such as `gateway health --port`.
   * Bypasses OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_PORT for this call only.
   */
  localPortOverride?: number;
  /** Keep a caller-supplied config target authoritative over OPENCLAW_GATEWAY_URL. */
  ignoreEnvUrlOverride?: boolean;
  /**
   * Service-derived probe target (e.g. custom bind host or Tailnet address).
   * Used as the connection URL without classifying it as a caller URL override,
   * so the explicit-credential guard does not fire.
   */
  serviceTargetUrl?: string;
};
type CallGatewayOptions = CallGatewayBaseOptions & {
  scopes?: OperatorScope[];
};
type GatewayTransportErrorKind = "closed" | "timeout";
declare class GatewayTransportError extends Error {
  readonly kind: GatewayTransportErrorKind;
  readonly connectionDetails: GatewayConnectionDetails;
  readonly code?: number;
  readonly reason?: string;
  readonly timeoutMs?: number;
  readonly requestDispatched?: boolean;
  constructor(params: {
    kind: GatewayTransportErrorKind;
    message: string;
    connectionDetails: GatewayConnectionDetails;
    code?: number;
    reason?: string;
    timeoutMs?: number;
    requestDispatched?: boolean;
  });
}
declare function isGatewayTransportError(value: unknown): value is GatewayTransportError;
declare function isGatewayClientRequestError(value: unknown): value is Error & {
  gatewayCode: string;
  details?: unknown;
  retryable: boolean;
  retryAfterMs?: number;
};
declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
type DatabasePortRecoveryIntent = {
  manifestPath: string;
  operationId: string;
  action: "resume" | "rollback";
};
export { CallGatewayOptions as a, GatewayClientOptions as c, resolveGatewayAuth as d, OperatorScope as f, isGatewayTransportError as i, GatewayClientOptions$1 as l, callGateway as n, GatewayRequestFunction as o, isGatewayClientRequestError as r, GatewayClient as s, DatabasePortRecoveryIntent as t, ResolvedGatewayAuth as u };