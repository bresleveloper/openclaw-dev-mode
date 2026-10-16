import { S as ExecApprovalResolved, T as ExecHost, _ as ApprovalScope, b as ExecApprovalRequest, c as SystemAgentApprovalResolved, d as PluginApprovalRequest, f as PluginApprovalRequestPayload, g as buildPluginApprovalResolvedMessage, h as buildPluginApprovalRequestMessage, l as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, m as buildPluginApprovalExpiredMessage, n as ApprovalResolved, o as SystemAgentApprovalRequest, p as PluginApprovalResolved, r as ChannelApprovalKind, s as SystemAgentApprovalRequestPayload, t as ApprovalRequestInput, u as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, v as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, x as ExecApprovalRequestPayload, y as ExecApprovalDecision } from "../approval-types-DOLowId2.js";
import { C as ChannelNativeApprovalDeliveryCallbacks, S as ResolvedApprovalView, T as ChannelApprovalNativeAdapter, w as ChannelNativeApprovalTransportSpec } from "../approval-handler-runtime-types-DDiXSqb1.js";
import { i as resolveExecApprovalRequestAllowedDecisions, r as resolveExecApprovalAllowedDecisions } from "../exec-approvals-DNGb8MUN.js";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-Hb4BQ_zR.js";
import { a as resolveApprovalApprovers, n as createResolvedApproverActionAuthAdapter } from "../approval-auth-helpers-Dl2BnQOC.js";
import { a as matchesApprovalRequestFilters, i as ApprovalRequestFilterInput, n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "../approval-client-helpers-DD8cXZQL.js";
import { c as buildExecApprovalPendingReplyPayload, i as ExecApprovalReplyMetadata, m as getExecApprovalReplyMetadata, n as ExecApprovalPendingReplyParams, p as getExecApprovalApproverDmNoticeText, r as ExecApprovalReplyDecision } from "../exec-approval-reply-BmfjYRek.js";
import { _ as resolveApprovalRequestSessionTarget, a as createChannelApproverDmTargetResolver, h as resolveApprovalRequestOriginTarget, m as ExecApprovalSessionTarget, o as createChannelNativeOriginTargetResolver, v as resolveExecApprovalSessionTarget } from "../approval-native-helpers-Dqlpyq-S.js";
import { a as splitChannelApprovalCapability, i as createChannelApprovalCapability, n as createApproverRestrictedNativeApprovalCapability, t as createApproverRestrictedNativeApprovalAdapter } from "../approval-delivery-helpers-C5rYKotR.js";
import { n as ExecApprovalChannelRuntimeAdapter, t as ExecApprovalChannelRuntime } from "../exec-approval-channel-runtime-DMdF-Bg2.js";
import { t as doesApprovalRequestMatchChannelAccount } from "../approval-request-account-binding-DGxD2D5N.js";
import { i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, o as resolveExecApprovalCommandDisplay, r as buildPluginApprovalPendingReplyPayload, t as buildApprovalPendingReplyPayload } from "../approval-renderers-Dx-TsjrY.js";
//#region src/infra/approval-native-runtime.d.ts
type ApprovalRequest = ApprovalRequestInput;
type ChannelNativeApprovalRuntimeAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest = ApprovalRequest, TResolved extends ApprovalResolved = ApprovalResolved> = Omit<ExecApprovalChannelRuntimeAdapter<TPendingEntry, TRequest, TResolved>, "deliverRequested"> & ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> & ChannelNativeApprovalDeliveryCallbacks<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> & {
  channel?: string;
  channelLabel?: string;
  accountId?: string | null;
  nativeAdapter?: ChannelApprovalNativeAdapter | null;
  /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */
  resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
  buildPendingContent: (params: {
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
  }) => TPendingContent | Promise<TPendingContent>;
  onStopped?: () => Promise<void> | void;
};
/** Creates the shared gateway approval runtime backed by channel-native delivery hooks. */
export declare function createChannelNativeApprovalRuntime<TPendingEntry, TPreparedTarget, TPendingContent, TRequest extends ApprovalRequest = ApprovalRequest, TResolved extends ApprovalResolved = ApprovalResolved>(adapter: ChannelNativeApprovalRuntimeAdapter<TPendingEntry, TPreparedTarget, TPendingContent, TRequest, TResolved>): ExecApprovalChannelRuntime<TRequest, TResolved>;
//#endregion
//#region src/plugin-sdk/approval-terminal.d.ts
type SystemAgentResolvedView = Extract<ResolvedApprovalView, {
  approvalKind: "system-agent";
}>;
/** Label a recorded decision without implying that a system change was applied. */
export declare function formatApprovalDecisionLabel(decision: ResolvedApprovalView["decision"]): string;
/** Format a rich terminal label, retaining transport-specific decision spelling. */
export declare function formatChannelApprovalResolvedLabel(view: ResolvedApprovalView, formatDecision?: (decision: ResolvedApprovalView["decision"]) => string): string;
/** Describe a system change using denial-first prose and a prepared operation summary. */
export declare function buildSystemAgentApprovalResolvedText(view: SystemAgentResolvedView): string;
//#endregion
//#region src/plugin-sdk/approval-native-controls.d.ts
type NativeApprovalBinding = {
  token: string;
  expiresAtMs: number;
};
/** Own one plugin's process-local native controls through resolution and card updates. */
export declare function createNativeApprovalControlRegistry<TBinding extends NativeApprovalBinding>(params: {
  releaseClaimOnLookupExpiry: boolean;
  onComplete?: (binding: TBinding) => void;
}): {
  createToken: () => string;
  register(binding: TBinding): boolean;
  get: (token: string) => TBinding | null;
  values: () => MapIterator<TBinding>;
  pruneExpired(nowMs: number): void;
  unregister(tokens: readonly string[]): void;
  settle<TResult>(token: string, resolveAndUpdate: (binding: TBinding) => Promise<TResult>): Promise<{
    kind: "missing";
  } | {
    kind: "in-flight";
  } | {
    kind: "not-found";
    binding: TBinding;
  } | {
    kind: "settled";
    binding: TBinding;
    result: TResult;
  }>;
};
//#endregion
export { type ApprovalRequestFilterInput, type ApprovalScope, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, type ExecApprovalDecision, type ExecApprovalPendingReplyParams, type ExecApprovalReplyDecision, type ExecApprovalReplyMetadata, type ExecApprovalRequest, type ExecApprovalRequestPayload, type ExecApprovalResolved, type ExecApprovalSessionTarget, type ExecHost, MAX_PLUGIN_APPROVAL_TIMEOUT_MS, type PluginApprovalRequest, type PluginApprovalRequestPayload, type PluginApprovalResolved, type SystemAgentApprovalRequest, type SystemAgentApprovalRequestPayload, type SystemAgentApprovalResolved, buildApprovalPendingReplyPayload, buildApprovalResolvedReplyPayload, buildExecApprovalPendingReplyPayload, buildPluginApprovalExpiredMessage, buildPluginApprovalPendingReplyPayload, buildPluginApprovalRequestMessage, buildPluginApprovalResolvedMessage, buildPluginApprovalResolvedReplyPayload, createApproverRestrictedNativeApprovalAdapter, createApproverRestrictedNativeApprovalCapability, createChannelApprovalCapability, createChannelApproverDmTargetResolver, createChannelExecApprovalProfile, createChannelNativeOriginTargetResolver, createResolvedApproverActionAuthAdapter, doesApprovalRequestMatchChannelAccount, formatApprovalDisplayPath, getExecApprovalApproverDmNoticeText, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters, resolveApprovalApprovers, resolveApprovalRequestOriginTarget, resolveApprovalRequestSessionTarget, resolveExecApprovalAllowedDecisions, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions, resolveExecApprovalSessionTarget, splitChannelApprovalCapability };