import { Fn as GatewayTailscaleMode, In as GatewayTrustedProxyConfig, M as OpenClawConfig, kn as GatewayAuthConfig } from "./types-D7I_F5Ux.js";
import { $t as ConnectParams, nn as HelloOk, tn as EventFrame } from "./index-8f56f6LD.js";
import "./openclaw-state-db-CsmosWKr.js";
import { a as GatewayClientMode, o as GatewayClientName } from "./client-info-DmzJu9gO.js";
import { r as GatewayWebSocketTargetOptions } from "./websocket-DbnFnlN8.js";
import { z } from "zod";
//#region src/gateway/operator-scopes.d.ts
declare const KNOWN_OPERATOR_SCOPE_VALUES: readonly ["operator.admin", "operator.read", "operator.write", "operator.sessions.read", "operator.sessions.write", "operator.approvals", "operator.questions", "operator.pairing", "operator.talk", "operator.talk.secrets"];
type OperatorScope = (typeof KNOWN_OPERATOR_SCOPE_VALUES)[number];
//#endregion
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
  private assembleConnectParams;
  private shouldNegotiateLegacyNodeProtocol;
  private shouldRetryWithAlternateNodeProtocol;
  private buildDeviceConnectParams;
  private handleConnectHello;
  private completeConnectHello;
  private handleConnectRequestFailure;
  private resolveConnectRequestFailure;
  private resolveClose;
  private closeInfo;
  private clearStaleDeviceTokenForClose;
  private clearDeviceToken;
  private notifyConnectError;
  private notifyReconnectPaused;
  private isUnsupportedConnectAuthField;
  private isTrustedDeviceRetryEndpoint;
  private selectConnectAuth;
  private startTickWatch;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
}
//#endregion
//#region packages/gateway-client/src/event-loop-ready.d.ts
/** Readiness probe outcome with timing data for diagnosing event-loop stalls. */
type EventLoopReadyResult = {
  ready: boolean;
  elapsedMs: number;
  maxDriftMs: number;
  checks: number;
  aborted: boolean;
};
//#endregion
//#region packages/gateway-client/src/readiness.d.ts
type GatewayClientStartable = {
  start(): void;
};
/** Timeout and abort controls for delaying client start until the loop can process IO. */
type GatewayClientStartReadinessOptions = {
  timeoutMs?: number;
  clientOptions?: Pick<GatewayClientOptions$1, "connectChallengeTimeoutMs" | "env" | "preauthHandshakeTimeoutMs">;
  signal?: AbortSignal;
};
/** Starts a gateway client after the default event-loop readiness probe succeeds. */
declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
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
//#region src/gateway/auth-resolve.d.ts
/** Authentication modes after config, override, and credential inputs are combined. */
type ResolvedGatewayAuthMode = "none" | "token" | "password" | "trusted-proxy";
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
//#endregion
//#region src/gateway/call-device-auth.d.ts
type GatewayCallDeviceAuthOptions = Pick<GatewayClientOptions, "mode" | "clientName" | "deviceIdentity" | "preparedDeviceAuth" | "sharedStateMode" | "approvalRuntimeToken" | "agentRuntimeIdentityToken"> & {
  useStoredDeviceAuth?: boolean;
  requireLocalBackendSharedAuth?: boolean;
  /** Reuse local auth-none authority without opening device storage for ordinary CLI RPCs. */
  allowLocalBackendAuthNone?: boolean;
};
//#endregion
//#region src/gateway/transport-error.d.ts
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
//#endregion
//#region src/gateway/call.d.ts
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
declare function isGatewayClientRequestError(value: unknown): value is Error & {
  gatewayCode: string;
  details?: unknown;
  retryable: boolean;
  retryAfterMs?: number;
};
declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
//#endregion
//#region src/infra/database-port-recovery.d.ts
type DatabasePortRecoveryIntent = {
  manifestPath: string;
  operationId: string;
  action: "resume" | "rollback";
};
//#endregion
export { isGatewayClientRequestError as a, GatewayClientOptions as c, startGatewayClientWhenEventLoopReady as d, OperatorScope as f, callGateway as i, ResolvedGatewayAuth as l, CallGatewayOptions as n, isGatewayTransportError as o, GatewayRequestFunction as r, GatewayClient as s, DatabasePortRecoveryIntent as t, resolveGatewayAuth as u };