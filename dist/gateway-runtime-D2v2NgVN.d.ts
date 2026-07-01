import { P as GatewayAuthConfig, i as OpenClawConfig, it as GatewayTailscaleMode, rt as GatewayTailscaleConfig, st as GatewayTrustedProxyConfig } from "./types.openclaw-DlpCUWMr.js";
import { n as GatewayClientName, t as GatewayClientMode } from "./client-info-CgGSgtDZ.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { o as RespondFn, s as NodeSession } from "./types-BS4MjsWH.js";
import { cr as EventFrame, gr as HelloOk } from "./schema-JKCmgTCB.js";
import { a as DeviceIdentity$1, n as GatewayClientOptions$1, t as GatewayClient } from "./client-Dgl4xgM8.js";
import { Command } from "commander";

//#region src/gateway/channel-status-patches.d.ts
/** Patch emitted when a channel connection is established. */
type ConnectedChannelStatusPatch = {
  connected: true;
  lastConnectedAt: number;
  lastEventAt: number;
};
/** Patch emitted when a channel transport reports activity without reconnecting. */
type TransportActivityChannelStatusPatch = {
  lastTransportActivityAt: number;
};
/** Creates a connected-channel status patch with matching connection/event timestamps. */
declare function createConnectedChannelStatusPatch(at?: number): ConnectedChannelStatusPatch;
/** Creates a transport-activity patch for health/activity monitors. */
declare function createTransportActivityStatusPatch(at?: number): TransportActivityChannelStatusPatch;
//#endregion
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
  token?: string;
  timeout?: string;
  expectFinal?: boolean;
  json?: boolean;
};
//#endregion
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(cmd: Command): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: {
  clientName?: GatewayClientName;
  mode?: GatewayClientMode;
  deviceIdentity?: DeviceIdentity$1 | null;
  expectFinal?: boolean;
  progress?: boolean;
  scopes?: OperatorScope[];
}): Promise<Record<string, unknown>>;
//#endregion
//#region src/gateway/hosted-plugin-surface-url.d.ts
type HostSource = string | null | undefined;
/** Inputs used to infer the externally reachable plugin surface URL. */
type HostedPluginSurfaceUrlParams = {
  port?: number;
  hostOverride?: HostSource;
  forwardedHost?: HostSource | HostSource[];
  requestHost?: HostSource;
  forwardedProto?: HostSource | HostSource[];
  localAddress?: HostSource;
  scheme?: "http" | "https";
};
/** Resolve the URL that plugins should advertise for hosted node surfaces. */
declare function resolveHostedPluginSurfaceUrl(params: HostedPluginSurfaceUrlParams): string | undefined;
//#endregion
//#region src/gateway/node-command-policy.d.ts
type NodeCommandPolicyNode = Pick<NodeSession, "platform" | "deviceFamily"> & Partial<Pick<NodeSession, "caps" | "commands" | "connId" | "nodeId">> & {
  approvedCommands?: readonly string[];
};
declare function resolveNodeCommandAllowlist(cfg: OpenClawConfig, node?: NodeCommandPolicyNode): Set<string>;
declare function isNodeCommandAllowed(params: {
  command: string;
  declaredCommands?: string[];
  allowlist: Set<string>;
}): {
  ok: true;
} | {
  ok: false;
  reason: string;
};
//#endregion
//#region src/shared/node-match.d.ts
/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
/** Node fields accepted by shared CLI/API node selection helpers. */
type NodeMatchCandidate = {
  /** Stable node id used for RPC/session routing. */nodeId: string; /** Human-facing node name used for fuzzy operator input. */
  displayName?: string; /** Tailscale or network address accepted as an exact match. */
  remoteIp?: string; /** Connected nodes win only after the strongest match type is chosen. */
  connected?: boolean; /** Client id used to prefer current OpenClaw nodes over legacy migration ties. */
  clientId?: string;
};
//#endregion
//#region src/shared/node-resolve.d.ts
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
  allowDefault?: boolean;
  pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a user query to a node id, optionally using a caller-defined blank-query default. */
declare function resolveNodeIdFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): string;
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): TNode;
//#endregion
//#region src/gateway/server-json.d.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
declare function safeParseJson(value: string | null | undefined): unknown;
//#endregion
//#region src/gateway/server-methods/nodes.helpers.d.ts
/** Narrows successful node invoke results or responds with the node error details. */
declare function respondUnavailableOnNodeInvokeError<T extends {
  ok: boolean;
  error?: unknown;
}>(respond: RespondFn, res: T): res is T & {
  ok: true;
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
//#region src/gateway/startup-auth.d.ts
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
declare function ensureGatewayStartupAuth(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  authOverride?: GatewayAuthConfig;
  tailscaleOverride?: GatewayTailscaleConfig;
  warn?: (message: string) => void;
  /**
   * Legacy startup option retained for external callers. Startup-generated auth
   * is runtime-only; durable auth changes must go through explicit config tools.
   */
  persist?: boolean;
  baseHash?: string;
}): Promise<{
  cfg: OpenClawConfig;
  auth: ReturnType<typeof resolveGatewayAuth>;
  generatedToken?: string;
  persistedGeneratedToken: boolean;
}>;
//#endregion
//#region packages/gateway-client/src/client.d.ts
type DeviceIdentity = {
  deviceId: string;
  privateKeyPem: string;
  publicKeyPem: string;
};
type DeviceAuthTokenRecord = {
  token?: string;
  scopes?: string[];
};
type GatewayClientHostDeps = {
  loadOrCreateDeviceIdentity?: () => DeviceIdentity | undefined;
  signDevicePayload?: (privateKeyPem: string, payload: string) => string;
  publicKeyRawBase64UrlFromPem?: (publicKeyPem: string) => string;
  loadDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => DeviceAuthTokenRecord | null;
  storeDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    token: string;
    scopes: string[];
    env?: NodeJS.ProcessEnv;
  }) => void;
  clearDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => void;
  beforeConnect?: () => void;
  registerGatewayLoopbackBypass?: (url: string) => (() => void) | undefined;
  logDebug?: (message: string) => void;
  logError?: (message: string) => void;
  redactForLog?: (message: string) => string;
  normalizeTlsFingerprint?: (fingerprint: string | undefined) => string;
};
type GatewayReconnectPausedInfo = {
  code: number;
  reason: string;
  detailCode: string | null;
};
type GatewayClientCloseInfo = {
  phase: "pre-hello" | "post-hello";
  socketOpened: boolean;
  transportValidated: boolean;
  transientPreHelloCleanClose: boolean;
};
type GatewayClientOptions = {
  url?: string;
  connectChallengeTimeoutMs?: number; /** @deprecated Use connectChallengeTimeoutMs. */
  connectDelayMs?: number;
  /**
   * Server-side pre-auth handshake budget. Config-derived local clients use
   * this to keep the connect-challenge watchdog aligned with the gateway.
   */
  preauthHandshakeTimeoutMs?: number;
  tickWatchMinIntervalMs?: number;
  tickWatchTimeoutMs?: number;
  requestTimeoutMs?: number;
  token?: string;
  bootstrapToken?: string;
  deviceToken?: string;
  password?: string;
  approvalRuntimeToken?: string;
  instanceId?: string;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  platform?: string;
  deviceFamily?: string;
  mode?: GatewayClientMode;
  role?: string;
  scopes?: string[];
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  env?: NodeJS.ProcessEnv;
  deviceIdentity?: DeviceIdentity | null;
  hostDeps?: GatewayClientHostDeps;
  minProtocol?: number;
  maxProtocol?: number;
  tlsFingerprint?: string;
  onEvent?: (evt: EventFrame) => void;
  onHelloOk?: (hello: HelloOk) => void;
  onConnectError?: (err: Error) => void;
  onReconnectPaused?: (info: GatewayReconnectPausedInfo) => void;
  onClose?: (code: number, reason: string, info?: GatewayClientCloseInfo) => void;
  onGap?: (info: {
    expected: number;
    received: number;
  }) => void;
};
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
  clientOptions?: Pick<GatewayClientOptions, "connectChallengeTimeoutMs" | "connectDelayMs" | "env" | "preauthHandshakeTimeoutMs">;
  signal?: AbortSignal;
};
//#endregion
//#region src/gateway/client-start-readiness.d.ts
/** Starts a gateway client once the shared event-loop readiness check passes. */
declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
//#endregion
//#region src/gateway/operator-approvals-client.d.ts
/** Create a Gateway client authorized for operator approval event handling. */
declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions$1, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk" | "onReconnectPaused"> & {
  config: OpenClawConfig;
  gatewayUrl?: string;
}): Promise<GatewayClient>;
/** Run a callback with a started operator-approvals Gateway client and close it after. */
declare function withOperatorApprovalsGatewayClient<T>(params: {
  config: OpenClawConfig;
  gatewayUrl?: string;
  clientDisplayName: string;
}, run: (client: GatewayClient) => Promise<T>): Promise<T>;
//#endregion
export { GatewayRpcOpts as _, resolveGatewayAuth as a, createConnectedChannelStatusPatch as b, resolveNodeFromNodeList as c, isNodeCommandAllowed as d, resolveNodeCommandAllowlist as f, callGatewayFromCli as g, addGatewayClientOptions as h, ensureGatewayStartupAuth as i, resolveNodeIdFromNodeList as l, resolveHostedPluginSurfaceUrl as m, withOperatorApprovalsGatewayClient as n, respondUnavailableOnNodeInvokeError as o, HostedPluginSurfaceUrlParams as p, startGatewayClientWhenEventLoopReady as r, safeParseJson as s, createOperatorApprovalsGatewayClient as t, NodeMatchCandidate as u, ConnectedChannelStatusPatch as v, createTransportActivityStatusPatch as x, TransportActivityChannelStatusPatch as y };