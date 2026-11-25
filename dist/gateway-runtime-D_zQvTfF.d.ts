import { Cn as GatewayRequestHandlerOptions, Cu as RespondFn, Pn as prepareGitHubPublicationRequesterV2$1, kn as PersonalGitHubSessionActionV2, nA as SessionMutationTarget, oj as ChannelAccountSnapshot } from "./config-contracts-hzlacViZ.js";
import { C as GatewayAuthConfig, k as GatewayTailscaleConfig, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./index-DSy-_0fC.js";
import { c as GatewayClientOptions$1, l as GatewayClientOptions, s as GatewayClient, u as ResolvedGatewayAuth } from "./database-port-recovery-0AsyALgu.js";
import "./gateway-rpc-DXTfd5fR.js";
type Request = Pick<GatewayRequestHandlerOptions, "client" | "context" | "signal">;
/** Retain the authenticated policy owner for worker commits as well as immediate effects. */
declare function preparePersonalGitHubSessionActionV2$1(options: Request & Parameters<typeof prepareGitHubPublicationRequesterV2$1>[0], target: SessionMutationTarget): Promise<{
  action: PersonalGitHubSessionActionV2;
  release: () => void;
}>;
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
declare function redactSensitiveUrlLikeString(value: string): string;
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
type NodeCommandPolicyNode = {
  platform?: string;
  deviceFamily?: string;
  caps?: string[];
  commands?: string[];
  connId?: string;
  nodeId?: string;
  approvedCommands?: readonly string[];
};
declare function resolveNodeCommandAllowlist(cfg: OpenClawConfig, node?: NodeCommandPolicyNode): Set<string>;
declare function isNodeCommandAllowed(params: {
  command: string;
  declaredCommands?: readonly string[];
  allowlist: Set<string>;
}): {
  ok: true;
} | {
  ok: false;
  reason: string;
};
/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
type NodeMatchCandidate = {
  nodeId: string;
  displayName?: string;
  /** Tailscale or network address accepted as an exact match. */
  remoteIp?: string;
  /** Connected nodes win only after the strongest match type is chosen. */
  connected?: boolean;
  /** Client id included in ambiguous-node diagnostics. */
  clientId?: string;
};
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
  allowDefault?: boolean;
  allowCompactDisplayName?: boolean;
  pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): TNode;
declare function parseGatewayPayload(value: string | null | undefined): unknown;
declare const respondUnavailableOnNodeInvokeError: <T extends {
  ok: boolean;
  error?: unknown;
}>(respond: RespondFn, res: T) => res is T & {
  ok: true;
};
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
  auth: ResolvedGatewayAuth;
  generatedToken?: string;
  persistedGeneratedToken: boolean;
}>;
/** Readiness probe outcome with timing data for diagnosing event-loop stalls. */
type EventLoopReadyResult = {
  ready: boolean;
  elapsedMs: number;
  maxDriftMs: number;
  checks: number;
  aborted: boolean;
};
type GatewayClientStartable = {
  start(): void;
};
/** Timeout and abort controls for delaying client start until the loop can process IO. */
type GatewayClientStartReadinessOptions = {
  timeoutMs?: number;
  clientOptions?: Pick<GatewayClientOptions, "connectChallengeTimeoutMs" | "env" | "preauthHandshakeTimeoutMs">;
  signal?: AbortSignal;
};
/** Starts a gateway client after the default event-loop readiness probe succeeds. */
declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
/** Create a Gateway client authorized for operator approval event handling. */
declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions$1, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk" | "onReconnectPaused"> & {
  config: OpenClawConfig;
  gatewayUrl?: string;
}): Promise<GatewayClient>;
/** Optional for old clients; new local callers must bind to the physically held owner. */
declare function captureLocalStateMutationGuard(expectedOwnerId: string, options: GatewayRequestHandlerOptions, target?: {
  path: string;
  identity: string;
}): () => void;
/** Preserve the selected owner through plugin transport effects and response disclosure. */
declare function runWithLocalStateMutationOwner<T>(expectedOwnerId: string, options: GatewayRequestHandlerOptions, run: (assertCurrent: () => void) => Promise<T>): Promise<T>;
type ReadyChannelStatusPatch = {
  running: true;
  connected: true;
  lifecycle: "ready";
  lastConnectedAt: number;
  lastError: null;
  terminalDisconnect: undefined;
};
type BlockedChannelStatusPatch = {
  lifecycle: "blocked";
  terminalDisconnect: true;
  lastError: string;
};
type StoppedChannelStatusPatch = {
  running: false;
  connected: false;
  lifecycle: "stopped";
};
type ReadyChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof ReadyChannelStatusPatch>> & {
  lastConnectedAt?: number;
};
type BlockedChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof BlockedChannelStatusPatch>>;
type StoppedChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof StoppedChannelStatusPatch>>;
/** Creates a connected-channel status patch with matching connection/event timestamps. */
declare function createConnectedChannelStatusPatch(at?: number): {
  connected: true;
  lastConnectedAt: number;
  lastEventAt: number;
};
/** Creates a transport-activity patch for health/activity monitors. */
declare function createTransportActivityStatusPatch(at?: number): {
  lastTransportActivityAt: number;
};
/** Creates a ready patch that clears any retained terminal-auth verdict. */
declare function channelReadyPatch(): ReadyChannelStatusPatch;
declare function channelReadyPatch<TExtras extends ReadyChannelStatusExtras>(extras: TExtras): ReadyChannelStatusPatch & TExtras;
/** Creates a terminal blocked patch with a required operator-facing error. */
declare function channelBlockedPatch(lastError: string): BlockedChannelStatusPatch;
declare function channelBlockedPatch<TExtras extends BlockedChannelStatusExtras>(lastError: string, extras: TExtras): BlockedChannelStatusPatch & TExtras;
/** Creates the shared patch emitted after a channel account has stopped. */
declare function channelStoppedPatch(): StoppedChannelStatusPatch;
declare function channelStoppedPatch<TExtras extends StoppedChannelStatusExtras>(extras: TExtras): StoppedChannelStatusPatch & TExtras;
declare function parseTimeoutMsWithFallback(raw: unknown, fallbackMs: number, options?: {
  invalidType?: "fallback" | "error";
  flagName?: string;
}): number;
/** Prepare a host-owned requester from this handler's admitted Gateway authority. */
declare function prepareGitHubPublicationRequesterV2(...args: Parameters<typeof prepareGitHubPublicationRequesterV2$1>): ReturnType<typeof prepareGitHubPublicationRequesterV2$1>;
/** Prepare personal publication authority and release it when the handler settles. */
declare function preparePersonalGitHubSessionActionV2(...args: Parameters<typeof preparePersonalGitHubSessionActionV2$1>): ReturnType<typeof preparePersonalGitHubSessionActionV2$1>;
export { redactSensitiveUrlLikeString as S, NodeMatchCandidate as _, channelReadyPatch as a, HostedPluginSurfaceUrlParams as b, createTransportActivityStatusPatch as c, createOperatorApprovalsGatewayClient as d, startGatewayClientWhenEventLoopReady as f, resolveNodeFromNodeList as g, parseGatewayPayload as h, channelBlockedPatch as i, captureLocalStateMutationGuard as l, respondUnavailableOnNodeInvokeError as m, preparePersonalGitHubSessionActionV2 as n, channelStoppedPatch as o, ensureGatewayStartupAuth as p, parseTimeoutMsWithFallback as r, createConnectedChannelStatusPatch as s, prepareGitHubPublicationRequesterV2 as t, runWithLocalStateMutationOwner as u, isNodeCommandAllowed as v, resolveHostedPluginSurfaceUrl as x, resolveNodeCommandAllowlist as y };