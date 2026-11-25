import { r as ChannelApprovalKind } from "./approval-types-Bh5AmS0_.js";
import { i as ChannelApprovalNativeAvailabilityAdapterAsync, l as ChannelApprovalNativeRuntimeAdapter, r as ChannelApprovalNativeAvailabilityAdapter, u as ChannelApprovalNativeRuntimeAdapterAsync } from "./approval-handler-runtime-types-fbG6kmPg.js";
/** Runtime-context capability key used by channels to register native approval resources. */
declare const CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY = "approval.native";
/** @deprecated Use createLazyChannelApprovalNativeRuntimeAdapterAsync with awaited availability callbacks. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function createLazyChannelApprovalNativeRuntimeAdapter<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown, TCapabilityBoundary extends boolean = false>(params: {
  load: () => Promise<ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>>;
  isConfigured: ChannelApprovalNativeAvailabilityAdapter["isConfigured"];
  shouldHandle: ChannelApprovalNativeAvailabilityAdapter["shouldHandle"];
  eventKinds?: readonly ChannelApprovalKind[];
  /** Erases payload types only when registering with the non-generic channel capability. */
  capabilityBoundary?: TCapabilityBoundary;
  /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */
  resolveApprovalKind?: ChannelApprovalNativeRuntimeAdapter["resolveApprovalKind"];
}): TCapabilityBoundary extends true ? ChannelApprovalNativeRuntimeAdapter : ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>;
/** Creates an approval runtime adapter that loads heavy channel code only when delivery hooks run. */
declare function createLazyChannelApprovalNativeRuntimeAdapterAsync<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown, TCapabilityBoundary extends boolean = false>(params: {
  load: () => Promise<ChannelApprovalNativeRuntimeAdapterAsync<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>>;
  isConfigured: ChannelApprovalNativeAvailabilityAdapterAsync["isConfigured"];
  shouldHandle: ChannelApprovalNativeAvailabilityAdapterAsync["shouldHandle"];
  eventKinds?: readonly ChannelApprovalKind[];
  /** Erases payload types only when registering with the non-generic channel capability. */
  capabilityBoundary?: TCapabilityBoundary;
  /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */
  resolveApprovalKind?: ChannelApprovalNativeRuntimeAdapterAsync["resolveApprovalKind"];
}): TCapabilityBoundary extends true ? ChannelApprovalNativeRuntimeAdapterAsync : ChannelApprovalNativeRuntimeAdapterAsync<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>;
export { createLazyChannelApprovalNativeRuntimeAdapter as n, createLazyChannelApprovalNativeRuntimeAdapterAsync as r, CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY as t };