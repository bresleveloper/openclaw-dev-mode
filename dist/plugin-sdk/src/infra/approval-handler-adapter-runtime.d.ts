import type { ChannelApprovalNativeAvailabilityAdapter, ChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-types.js";
import type { ExecApprovalChannelRuntimeEventKind } from "./exec-approval-channel-runtime.types.js";
/** Runtime-context capability key used by channels to register native approval resources. */
export declare const CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY = "approval.native";
/** Creates an approval runtime adapter that loads heavy channel code only when delivery hooks run. */
export declare function createLazyChannelApprovalNativeRuntimeAdapter<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown>(params: {
    load: () => Promise<ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>>;
    isConfigured: ChannelApprovalNativeAvailabilityAdapter["isConfigured"];
    shouldHandle: ChannelApprovalNativeAvailabilityAdapter["shouldHandle"];
    eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[];
    resolveApprovalKind?: ChannelApprovalNativeRuntimeAdapter["resolveApprovalKind"];
}): ChannelApprovalNativeRuntimeAdapter<TPendingPayload, TPreparedTarget, TPendingEntry, TBinding, TFinalPayload>;
