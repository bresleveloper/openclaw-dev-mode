import { n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import { i as ChannelApprovalNativeAvailabilityAdapter, l as ChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-types-DuldNTAV.js";
//#region src/infra/approval-handler-adapter-runtime.d.ts
/** Runtime-context capability key used by channels to register native approval resources. */
declare const CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY = "approval.native";
/** Creates an approval runtime adapter that loads heavy channel code only when delivery hooks run. */
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
//#endregion
export { createLazyChannelApprovalNativeRuntimeAdapter as n, CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY as t };