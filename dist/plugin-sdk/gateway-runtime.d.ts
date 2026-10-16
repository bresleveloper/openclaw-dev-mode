import { L as GatewayTailscaleConfig, P as GatewayAuthConfig, r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { Gt as ErrorCodes, Rt as errorShape } from "../index-B4F-ENEv.js";
import { Ao as NodeSession, Eo as GatewayRequestHandlers, To as GatewayRequestHandlerOptions, _s as resolveGatewayAuth, cn as startGatewayClientWhenEventLoopReady, cs as PLUGIN_NODE_CAPABILITY_PATH_PREFIX, ds as normalizePluginNodeCapabilityScopedUrl, fs as RespondFn, gs as ResolvedGatewayAuth, ls as buildPluginNodeCapabilityScopedHostUrl, on as isGatewayClientRequestError, os as DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, sn as isGatewayTransportError, ss as NormalizedPluginNodeCapabilityUrl, us as mintPluginNodeCapabilityToken } from "../agent-harness-runtime-DZjstJNb.js";
import { r as ChannelAccountSnapshot } from "../types.core-Bra2QBA5.js";
import { n as GatewayClientOptions, t as GatewayClient } from "../client-DIJ-R7Dq.js";
import { t as isLoopbackHost } from "../net-BAY1NiI6.js";
import { n as callGatewayFromCli, r as GatewayRpcOpts, t as addGatewayClientOptions } from "../gateway-rpc-8kP-oCwp.js";
//#region packages/net-policy/src/redact-sensitive-url.d.ts
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
export declare function redactSensitiveUrlLikeString(value: string): string;
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
export declare function resolveHostedPluginSurfaceUrl(params: HostedPluginSurfaceUrlParams): string | undefined;
//#endregion
//#region src/gateway/node-command-policy.d.ts
type NodeCommandPolicyNode = {
  platform?: string;
  deviceFamily?: string;
  caps?: string[];
  commands?: string[];
  connId?: string;
  nodeId?: string;
  approvedCommands?: readonly string[];
};
export declare function resolveNodeCommandAllowlist(cfg: OpenClawConfig, node?: NodeCommandPolicyNode): Set<string>;
export declare function isNodeCommandAllowed(params: {
  command: string;
  declaredCommands?: readonly string[];
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
  /** Stable node id used for RPC/session routing. */
  nodeId: string;
  /** Human-facing node name used for fuzzy operator input. */
  displayName?: string;
  /** Tailscale or network address accepted as an exact match. */
  remoteIp?: string;
  /** Connected nodes win only after the strongest match type is chosen. */
  connected?: boolean;
  /** Client id included in ambiguous-node diagnostics. */
  clientId?: string;
};
//#endregion
//#region src/shared/node-resolve.d.ts
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
  allowDefault?: boolean;
  allowCompactDisplayName?: boolean;
  pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
export declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): TNode;
//#endregion
//#region src/gateway/server-json.d.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
declare function parseGatewayPayload(value: string | null | undefined): unknown;
//#endregion
//#region src/gateway/server-methods/nodes.helpers.d.ts
/** Narrows successful node invoke results or responds with the node error details. */
export declare function respondUnavailableOnNodeInvokeError<T extends {
  ok: boolean;
  error?: unknown;
}>(respond: RespondFn, res: T): res is T & {
  ok: true;
};
//#endregion
//#region src/gateway/startup-auth.d.ts
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
export declare function ensureGatewayStartupAuth(params: {
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
//#endregion
//#region src/gateway/operator-approvals-client.d.ts
/** Create a Gateway client authorized for operator approval event handling. */
export declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk" | "onReconnectPaused"> & {
  config: OpenClawConfig;
  gatewayUrl?: string;
}): Promise<GatewayClient>;
//#endregion
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
export declare function createConnectedChannelStatusPatch(at?: number): ConnectedChannelStatusPatch;
/** Creates a transport-activity patch for health/activity monitors. */
export declare function createTransportActivityStatusPatch(at?: number): TransportActivityChannelStatusPatch;
/** Creates a ready patch that clears any retained terminal-auth verdict. */
export declare function channelReadyPatch(): ReadyChannelStatusPatch;
export declare function channelReadyPatch<TExtras extends ReadyChannelStatusExtras>(extras: TExtras): ReadyChannelStatusPatch & TExtras;
/** Creates a terminal blocked patch with a required operator-facing error. */
export declare function channelBlockedPatch(lastError: string): BlockedChannelStatusPatch;
export declare function channelBlockedPatch<TExtras extends BlockedChannelStatusExtras>(lastError: string, extras: TExtras): BlockedChannelStatusPatch & TExtras;
/** Creates the shared patch emitted after a channel account has stopped. */
export declare function channelStoppedPatch(): StoppedChannelStatusPatch;
export declare function channelStoppedPatch<TExtras extends StoppedChannelStatusExtras>(extras: TExtras): StoppedChannelStatusPatch & TExtras;
//#endregion
//#region src/plugin-sdk/gateway-runtime.d.ts
export declare function resolveAdvertisedLanHost(): Promise<string | null>;
//#endregion
export { DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, ErrorCodes, GatewayClient, type GatewayRequestHandlerOptions, type GatewayRequestHandlers, type GatewayRpcOpts, type HostedPluginSurfaceUrlParams, type NodeMatchCandidate, type NodeSession, type NormalizedPluginNodeCapabilityUrl, PLUGIN_NODE_CAPABILITY_PATH_PREFIX, addGatewayClientOptions, buildPluginNodeCapabilityScopedHostUrl, callGatewayFromCli, errorShape, isGatewayClientRequestError, isGatewayTransportError, isLoopbackHost, mintPluginNodeCapabilityToken, normalizePluginNodeCapabilityScopedUrl, resolveGatewayAuth, parseGatewayPayload as safeParseJson, startGatewayClientWhenEventLoopReady };