import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { A as ExecApprovalRequest, a as SystemAgentApprovalRequest, h as PluginApprovalRequest, n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import { r as ChannelApprovalCapability } from "./types.adapters-dxHXA2rq.js";
import "./channel-contract-9xwYMZks.js";
import "./exec-approvals-BN7bizpP.js";
import "./config-runtime-PKnmbNvK.js";
import { i as NativeApprovalTarget, s as createNativeApprovalChannelRouteGates } from "./approval-native-helpers-BZIdxHd2.js";
//#region src/plugin-sdk/approval-delivery-helpers.d.ts
type NativeApprovalDeliveryMode = "dm" | "channel" | "both";
type NativeApprovalRequest = ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
type ApprovalAdapterParams = {
  /** Full config used to inspect channel approval settings. */
  cfg: OpenClawConfig;
  /** Optional channel account id for account-scoped approval settings. */
  accountId?: string | null;
  /** Actor attempting the approval action. */
  senderId?: string | null;
};
type DeliverySuppressionParams = {
  /** Full config used to inspect native approval delivery settings. */
  cfg: OpenClawConfig;
  /** Approval kind being delivered. */
  approvalKind: ChannelApprovalKind;
  /** Forwarding fallback target under consideration. */
  target: {
    channel: string;
    accountId?: string | null;
  };
  /** Approval request metadata, including original turn source when available. */
  request: {
    request: {
      turnSourceChannel?: string | null;
      turnSourceAccountId?: string | null;
    };
  };
};
type ApproverRestrictedNativeApprovalCommonParams = {
  /** Channel id that owns this native approval capability. */
  channel: string;
  /** Human-readable channel label used in denial messages. */
  channelLabel: string;
  /** Optional setup description helper shown when exec approvals are unavailable. */
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
  /** Optional setup description helper shown when plugin approvals are unavailable. */
  describePluginApprovalSetup?: ChannelApprovalCapability["describePluginApprovalSetup"];
  /** Native runtime hooks used by channel-specific delivery implementations. */
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"];
};
type ApproverRestrictedNativeApprovalFlatParams = {
  /** Lists configured account ids so DM-route availability can scan every account. */
  listAccountIds: (cfg: OpenClawConfig) => string[];
  /** Whether an account has approvers configured. */
  hasApprovers: (params: ApprovalAdapterParams) => boolean;
  /** Whether a sender can approve exec approvals for this account. */
  isExecAuthorizedSender: (params: ApprovalAdapterParams) => boolean;
  /** Optional plugin approval authorization hook; defaults to exec authorization. */
  isPluginAuthorizedSender?: (params: ApprovalAdapterParams) => boolean;
  /** Whether native approval delivery is enabled for an account. */
  isNativeDeliveryEnabled: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean;
  /** Native delivery target preference for an account. */
  resolveNativeDeliveryMode: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => NativeApprovalDeliveryMode;
  /** Requires the approval request's original turn channel to match this channel before suppression. */
  requireMatchingTurnSourceChannel?: boolean;
  /** Optional account id resolver used when deciding forwarding-fallback suppression. */
  resolveSuppressionAccountId?: (params: DeliverySuppressionParams) => string | undefined;
  /** Resolves the original channel target for native approval delivery. */
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: NativeApprovalRequest;
  }) => NativeApprovalTarget | null | Promise<NativeApprovalTarget | null>;
  /** Resolves approver DM targets for native approval delivery. */
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: NativeApprovalRequest;
  }) => NativeApprovalTarget[] | Promise<NativeApprovalTarget[]>;
  /** Whether DM-only native delivery should also notify the origin channel. */
  notifyOriginWhenDmOnly?: boolean;
};
type StandardNativeApprovalRouting = Pick<ReturnType<typeof createNativeApprovalChannelRouteGates>, "canApprovalPotentiallyRouteToChannel" | "canAnyApprovalPotentiallyRouteToChannel" | "isNativeApprovalHandlerConfigured" | "shouldHandleApprovalRequest"> & {
  getActionAvailabilityState: NonNullable<ChannelApprovalCapability["getActionAvailabilityState"]>;
  getExecInitiatingSurfaceState: NonNullable<ChannelApprovalCapability["getExecInitiatingSurfaceState"]>;
  delivery: NonNullable<ChannelApprovalCapability["delivery"]>;
  native: NonNullable<ChannelApprovalCapability["native"]>;
};
type ApproverRestrictedNativeApprovalRoutedParams = {
  /** Standard forwarding-backed native routing assembled inside the capability factory. */
  routing: StandardNativeApprovalRoutingParams;
  /** Channel-owned authorization, including any implicit same-chat fallback marker. */
  authorizeActorAction: NonNullable<ChannelApprovalCapability["authorizeActorAction"]>;
  /** Builds native runtime hooks after the shared routing policy exists. */
  createNativeRuntime?: (routing: StandardNativeApprovalRouting) => ChannelApprovalCapability["nativeRuntime"];
  /** Render hooks for pending and resolved approval payloads. */
  render?: ChannelApprovalCapability["render"];
};
type StandardNativeApprovalRoutingParams = {
  /** Default forwarding mode when top-level approval config omits one. */
  defaultForwardingMode: "session" | "targets" | "both";
  /** Whether the channel transport is available for an account. */
  isTransportEnabled: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean;
  /** Lists channel account ids for route and DM availability checks. */
  listAccountIds: (cfg: OpenClawConfig) => readonly string[];
  /** Resolves the channel's default account id. */
  resolveDefaultAccountId: (cfg: OpenClawConfig) => string;
  /** Normalizes a channel-local messaging destination. */
  normalizeTo: (to: string) => string | null | undefined;
  /** Resolves configured native approval recipients. */
  resolveApprovers: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => readonly string[];
  /** Optional origin safety gate, such as requiring approvers for group conversations. */
  isOriginTargetAllowed?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind?: ChannelApprovalKind;
    request: NativeApprovalRequest;
    target: NativeApprovalTarget;
  }) => boolean;
  /** Whether explicit target forwarding participates in exact-match fallback suppression. */
  suppressExplicitTargetFallback?: boolean;
  /** Whether DM-only native delivery should also notify the origin channel. */
  notifyOriginWhenDmOnly?: boolean;
};
/** Build the split approval adapter shape for approver-restricted native channels. */
declare function createApproverRestrictedNativeApprovalAdapter(params: ApproverRestrictedNativeApprovalCommonParams & ApproverRestrictedNativeApprovalFlatParams): {
  auth: {
    authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
    getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
    getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
  nativeRuntime: ChannelApprovalCapability["nativeRuntime"];
  render: ChannelApprovalCapability["render"];
  native: ChannelApprovalCapability["native"];
  describeExecApprovalSetup: ChannelApprovalCapability["describeExecApprovalSetup"];
  describePluginApprovalSetup: ChannelApprovalCapability["describePluginApprovalSetup"];
};
/** Assemble a channel approval capability from its auth, delivery, render, and native surfaces. */
declare function createChannelApprovalCapability(params: {
  /** Authorizes actors attempting approval actions. */
  authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
  /** Reports whether approval actions are generally available. */
  getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
  /** Reports whether exec approvals can start from the initiating surface. */
  getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
  /** Optional command behavior override for approval replies. */
  resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  /** Optional setup copy for unavailable exec approval paths. */
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"];
  /** Optional setup copy for unavailable plugin approval paths. */
  describePluginApprovalSetup?: ChannelApprovalCapability["describePluginApprovalSetup"];
  /** Delivery fallback and DM-route helpers. */
  delivery?: ChannelApprovalCapability["delivery"];
  /** Native runtime hooks for channel-specific approval delivery. */
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"];
  /** Render hooks for pending/resolved approval payloads. */
  render?: ChannelApprovalCapability["render"];
  /** Native target/capability discovery hooks. */
  native?: ChannelApprovalCapability["native"];
}): ChannelApprovalCapability;
/** Split the canonical approval capability into the adapter shape older channel loaders consume. */
declare function splitChannelApprovalCapability(capability: ChannelApprovalCapability): {
  auth: {
    authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
    getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
    getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
  nativeRuntime: ChannelApprovalCapability["nativeRuntime"];
  render: ChannelApprovalCapability["render"];
  native: ChannelApprovalCapability["native"];
  describeExecApprovalSetup: ChannelApprovalCapability["describeExecApprovalSetup"];
  describePluginApprovalSetup: ChannelApprovalCapability["describePluginApprovalSetup"];
};
/** Build the canonical approval capability for approver-restricted native delivery channels. */
declare function createApproverRestrictedNativeApprovalCapability(params: ApproverRestrictedNativeApprovalCommonParams & ApproverRestrictedNativeApprovalFlatParams): ChannelApprovalCapability;
/** Build a forwarding-routed capability and expose its shared route gates to the owning channel. */
declare function createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes(params: ApproverRestrictedNativeApprovalCommonParams & ApproverRestrictedNativeApprovalRoutedParams): {
  capability: ChannelApprovalCapability;
  routing: StandardNativeApprovalRouting;
};
//#endregion
export { splitChannelApprovalCapability as a, createChannelApprovalCapability as i, createApproverRestrictedNativeApprovalCapability as n, createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes as r, createApproverRestrictedNativeApprovalAdapter as t };