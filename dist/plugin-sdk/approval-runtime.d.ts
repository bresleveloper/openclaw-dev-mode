import { cn as formatApprovalDisplayPath } from "../agent-harness-runtime-CWL0fcg5.js";
import { A as ExecApprovalRequest, B as ExecHost, E as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, M as ExecApprovalResolved, T as ApprovalScope, _ as PluginApprovalResolved, a as SystemAgentApprovalRequest, b as buildPluginApprovalRequestMessage, g as PluginApprovalRequestPayload, h as PluginApprovalRequest, j as ExecApprovalRequestPayload, k as ExecApprovalDecision, l as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, o as SystemAgentApprovalRequestPayload, s as SystemAgentApprovalResolved, u as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, x as buildPluginApprovalResolvedMessage, y as buildPluginApprovalExpiredMessage } from "../approval-types-DIxuby8L.js";
import { C as ResolvedApprovalView } from "../approval-handler-runtime-types-DuldNTAV.js";
import { T as resolveExecApprovalRequestAllowedDecisions, w as resolveExecApprovalAllowedDecisions } from "../exec-approvals-BN7bizpP.js";
import { a as resolveApprovalApprovers, n as createResolvedApproverActionAuthAdapter } from "../approval-auth-helpers-DkwoXSVE.js";
import { a as matchesApprovalRequestFilters, i as ApprovalRequestFilterInput, n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "../approval-client-helpers-BYB9Sa8W.js";
import { b as getExecApprovalApproverDmNoticeText, f as buildExecApprovalPendingReplyPayload, i as ExecApprovalReplyMetadata, n as ExecApprovalPendingReplyParams, r as ExecApprovalReplyDecision, x as getExecApprovalReplyMetadata } from "../exec-approval-reply-ZUfh_LBI.js";
import { a as resolveApprovalRequestSessionTarget, n as ExecApprovalSessionTarget, o as resolveExecApprovalSessionTarget, r as resolveApprovalRequestOriginTarget } from "../exec-approval-session-target-D8fbKOxi.js";
import { a as createChannelApproverDmTargetResolver, o as createChannelNativeOriginTargetResolver } from "../approval-native-helpers-BZIdxHd2.js";
import { a as splitChannelApprovalCapability, i as createChannelApprovalCapability, n as createApproverRestrictedNativeApprovalCapability, t as createApproverRestrictedNativeApprovalAdapter } from "../approval-delivery-helpers-CWt2SrVm.js";
import { t as doesApprovalRequestMatchChannelAccount } from "../approval-request-account-binding-ChF46XVk.js";
import { t as resolveExecApprovalCommandDisplay } from "../exec-approval-command-display-O6-bJw3K.js";
import { i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, r as buildPluginApprovalPendingReplyPayload, t as buildApprovalPendingReplyPayload } from "../approval-renderers-DV4n1zfb.js";
import { t as createChannelNativeApprovalRuntime } from "../approval-native-runtime-D_j-xIVB.js";
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
export { type ApprovalRequestFilterInput, type ApprovalScope, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, type ExecApprovalDecision, type ExecApprovalPendingReplyParams, type ExecApprovalReplyDecision, type ExecApprovalReplyMetadata, type ExecApprovalRequest, type ExecApprovalRequestPayload, type ExecApprovalResolved, type ExecApprovalSessionTarget, type ExecHost, MAX_PLUGIN_APPROVAL_TIMEOUT_MS, type PluginApprovalRequest, type PluginApprovalRequestPayload, type PluginApprovalResolved, type SystemAgentApprovalRequest, type SystemAgentApprovalRequestPayload, type SystemAgentApprovalResolved, buildApprovalPendingReplyPayload, buildApprovalResolvedReplyPayload, buildExecApprovalPendingReplyPayload, buildPluginApprovalExpiredMessage, buildPluginApprovalPendingReplyPayload, buildPluginApprovalRequestMessage, buildPluginApprovalResolvedMessage, buildPluginApprovalResolvedReplyPayload, createApproverRestrictedNativeApprovalAdapter, createApproverRestrictedNativeApprovalCapability, createChannelApprovalCapability, createChannelApproverDmTargetResolver, createChannelExecApprovalProfile, createChannelNativeApprovalRuntime, createChannelNativeOriginTargetResolver, createResolvedApproverActionAuthAdapter, doesApprovalRequestMatchChannelAccount, formatApprovalDisplayPath, getExecApprovalApproverDmNoticeText, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters, resolveApprovalApprovers, resolveApprovalRequestOriginTarget, resolveApprovalRequestSessionTarget, resolveExecApprovalAllowedDecisions, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions, resolveExecApprovalSessionTarget, splitChannelApprovalCapability };