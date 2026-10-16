import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { S as ExecApprovalResolved, c as SystemAgentApprovalResolved, n as ApprovalResolved$1, p as PluginApprovalResolved, r as ChannelApprovalKind, t as ApprovalRequestInput } from "../approval-types-DOLowId2.js";
import { r as ChannelApprovalCapability } from "../types.adapters-Bo2TMZGx.js";
import { C as ChannelNativeApprovalDeliveryCallbacks, S as ResolvedApprovalView, T as ChannelApprovalNativeAdapter, _ as ExpiredApprovalView, a as ChannelApprovalNativeInteractionAdapter, b as PluginApprovalPendingView, c as ChannelApprovalNativeRuntimeAdapter, d as ApprovalActionView, f as ApprovalMetadataView, g as ExecApprovalResolvedView, h as ExecApprovalPendingView, i as ChannelApprovalNativeFinalAction, l as ChannelApprovalNativeRuntimeSpec, m as ExecApprovalExpiredView, n as ChannelApprovalCapabilityHandlerContext, o as ChannelApprovalNativeObserveAdapter, p as ApprovalViewModel, r as ChannelApprovalNativeAvailabilityAdapter, s as ChannelApprovalNativePresentationAdapter, t as ApprovalRequest$1, u as ChannelApprovalNativeTransportAdapter, v as PendingApprovalView, w as ChannelNativeApprovalTransportSpec, x as PluginApprovalResolvedView, y as PluginApprovalExpiredView } from "../approval-handler-runtime-types-DDiXSqb1.js";
import "../exec-approvals-DNGb8MUN.js";
import { t as resolveApprovalOverGateway } from "../approval-gateway-runtime-BeglNVLf.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter, t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "../approval-handler-adapter-runtime-CiDDDfqz.js";
import { t as ExecApprovalChannelRuntime } from "../exec-approval-channel-runtime-DMdF-Bg2.js";
//#region src/infra/approval-handler-runtime.d.ts
type ChannelApprovalHandler<TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = ExecApprovalChannelRuntime<TRequest, TResolved>;
/** Adapts a strongly typed channel native approval spec into the erased runtime contract. */
export declare function createChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView, TResolvedView extends ResolvedApprovalView = ResolvedApprovalView, TExpiredView extends ExpiredApprovalView = ExpiredApprovalView>(spec: ChannelApprovalNativeRuntimeSpec<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload, TPendingView, TResolvedView, TExpiredView>): ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>;
type ChannelApprovalHandlerRuntimeSpec<TRequest extends ApprovalRequest$1> = {
  label: string;
  clientDisplayName: string;
  cfg: OpenClawConfig;
  gatewayUrl?: string;
  eventKinds?: readonly ChannelApprovalKind[];
  channel?: string;
  channelLabel?: string;
  accountId?: string | null;
  nativeAdapter?: ChannelApprovalNativeAdapter | null;
  /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */
  resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
  isConfigured: () => boolean;
  shouldHandle: (request: TRequest) => boolean;
  nowMs?: () => number;
};
type ChannelApprovalHandlerContentSpec<TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1> = {
  buildPendingContent: (params: {
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
  }) => TPendingContent | Promise<TPendingContent>;
};
type ChannelApprovalHandlerLifecycleSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = ChannelNativeApprovalDeliveryCallbacks<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> & {
  finalizeResolved: (params: {
    request: TRequest;
    resolved: TResolved;
    entries: TPendingEntry[];
  }) => Promise<void>;
  finalizeExpired?: (params: {
    request: TRequest;
    entries: TPendingEntry[];
  }) => Promise<void>;
  onStopped?: () => Promise<void> | void;
};
/** Adapter contract used by core to run a channel's native approval delivery lifecycle. */
type ChannelApprovalHandlerAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1> = {
  runtime: ChannelApprovalHandlerRuntimeSpec<TRequest>;
  content: ChannelApprovalHandlerContentSpec<TPendingContent, TRequest>;
  transport: ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest>;
  lifecycle: ChannelApprovalHandlerLifecycleSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest, TResolved>;
};
/** Creates the shared approval handler runtime from channel-specific content and transport hooks. */
export declare function createChannelApprovalHandler<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest$1 = ApprovalRequest$1, TResolved extends ApprovalResolved$1 = ApprovalResolved$1>(adapter: ChannelApprovalHandlerAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest, TResolved>): ChannelApprovalHandler<TRequest, TResolved>;
/** Builds a shared approval handler from a plugin approval capability, or null when unsupported. */
export declare function createChannelApprovalHandlerFromCapability(params: {
  capability?: Pick<ChannelApprovalCapability, "native" | "nativeRuntime" | "supportsScopedPluginApprovalApprovers"> | null;
  label: string;
  clientDisplayName: string;
  channel: string;
  channelLabel: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
  nowMs?: () => number;
}): Promise<ChannelApprovalHandler | null>;
//#endregion
//#region src/plugin-sdk/approval-handler-runtime.d.ts
type ApprovalRequest = ApprovalRequestInput;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved | SystemAgentApprovalResolved;
/** Builds channel-visible resolved approval text for every approval kind. */
export declare function buildChannelApprovalResolvedText(params: {
  request: ApprovalRequest;
  resolved: ApprovalResolved;
  view: ResolvedApprovalView;
}): string;
/** Builds channel-visible expiration text for exec and plugin approvals. */
export declare function buildChannelApprovalExpiredText(params: {
  request: ApprovalRequest;
  view: ExpiredApprovalView;
}): string;
/** Resolves the account id prepared for approval routing with planned/context fallback order. */
export declare function resolvePreparedApprovalAccountId(params: {
  plannedAccountId?: string | null;
  contextAccountId?: string | null;
  fallbackAccountId: string;
}): string;
/** Resolve prepared approval account id when every source may be missing. */
export declare function resolvePreparedApprovalAccountId(params: {
  plannedAccountId?: string | null;
  contextAccountId?: string | null;
  fallbackAccountId?: string | null;
}): string | undefined;
//#endregion
export { type ApprovalActionView, type ApprovalMetadataView, type ApprovalViewModel, CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY, type ChannelApprovalCapabilityHandlerContext, type ChannelApprovalHandler, type ChannelApprovalHandlerAdapter, type ChannelApprovalKind, type ChannelApprovalNativeAvailabilityAdapter, type ChannelApprovalNativeFinalAction, type ChannelApprovalNativeInteractionAdapter, type ChannelApprovalNativeObserveAdapter, type ChannelApprovalNativePresentationAdapter, type ChannelApprovalNativeRuntimeAdapter, type ChannelApprovalNativeRuntimeSpec, type ChannelApprovalNativeTransportAdapter, type ExecApprovalExpiredView, type ExecApprovalPendingView, type ExecApprovalResolvedView, type ExpiredApprovalView, type PendingApprovalView, type PluginApprovalExpiredView, type PluginApprovalPendingView, type PluginApprovalResolvedView, type ResolvedApprovalView, createLazyChannelApprovalNativeRuntimeAdapter, resolveApprovalOverGateway };