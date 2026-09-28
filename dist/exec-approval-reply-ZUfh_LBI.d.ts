import "./templating-OpWn1DzT.js";
import { h as ReplyPayload } from "./reply-payload-Dv0rYqXd.js";
import { B as ExecHost, T as ApprovalScope, k as ExecApprovalDecision, n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import { f as MessagePresentation, h as MessagePresentationButton, p as MessagePresentationAction } from "./payload-Co5fPRVS.js";
import "./exec-approvals-BN7bizpP.js";
//#region src/infra/exec-approval-reply.d.ts
type ExecApprovalReplyDecision = ExecApprovalDecision;
type ExecApprovalUnavailableReason = "initiating-platform-disabled" | "initiating-platform-unsupported" | "no-approval-route";
type ExecApprovalReplyMetadata = {
  approvalId: string;
  approvalSlug: string;
  approvalKind: ChannelApprovalKind;
  agentId?: string;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  sessionKey?: string;
};
type ExecApprovalActionDescriptor = {
  decision: ExecApprovalReplyDecision;
  label: string;
  style: NonNullable<MessagePresentationButton["style"]>;
  /** Optional semantic action; omitted by the shipped command-backed builders. */
  action?: MessagePresentationAction;
  /** Copyable text fallback retained for non-interactive approval surfaces. */
  command: string;
};
/** Approval descriptor guaranteed to carry a canonical typed approval action. */
type TypedApprovalActionDescriptor = ExecApprovalActionDescriptor & {
  action: Extract<MessagePresentationAction, {
    type: "approval";
  }>;
};
type ExecApprovalPendingReplyParams = {
  warningText?: string;
  approvalId: string;
  approvalSlug: string;
  approvalCommandId?: string;
  ask?: string | null;
  agentId?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  command: string;
  cwd?: string;
  host: ExecHost;
  nodeId?: string;
  scope?: ApprovalScope | null;
  sessionKey?: string | null;
  expiresAtMs?: number;
  nowMs?: number;
};
type ExecApprovalUnavailableReplyParams = {
  warningText?: string;
  channel?: string;
  channelLabel?: string;
  accountId?: string;
  reason: ExecApprovalUnavailableReason;
  sentApproverDms?: boolean;
  host?: ExecHost;
  nodeId?: string;
};
declare function buildExecApprovalCommandText(params: {
  approvalCommandId: string;
  decision: ExecApprovalReplyDecision;
}): string;
type BuildExecApprovalActionDescriptorsParams = {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
};
declare function buildExecApprovalActionDescriptors(params: BuildExecApprovalActionDescriptorsParams): ExecApprovalActionDescriptor[];
/** Build approval descriptors with explicit owner-aware typed actions. */
declare function buildTypedApprovalActionDescriptors(params: BuildExecApprovalActionDescriptorsParams & {
  approvalKind: ChannelApprovalKind;
}): TypedApprovalActionDescriptor[];
/** Build portable approval controls from decision descriptors. */
declare function buildApprovalPresentationFromActionDescriptors(actions: readonly ExecApprovalActionDescriptor[]): MessagePresentation | undefined;
type BuildApprovalPresentationParams = {
  approvalId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
};
/** Build the shipped command-backed portable approval controls. */
declare function buildApprovalButtonPresentation(params: BuildApprovalPresentationParams): MessagePresentation | undefined;
/** Build portable approval controls with explicit owner-aware typed actions. */
declare function buildTypedApprovalPresentation(params: BuildApprovalPresentationParams & {
  approvalKind: ChannelApprovalKind;
}): MessagePresentation | undefined;
/** Build the shipped command-backed exec-approval presentation. */
declare function buildExecApprovalPresentation(params: {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
}): MessagePresentation | undefined;
/** Build an exec-approval presentation with canonical typed decision actions. */
declare function buildTypedExecApprovalPresentation(params: {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
}): MessagePresentation | undefined;
declare function getExecApprovalApproverDmNoticeText(): string;
declare function parseExecApprovalCommandText(raw: string): {
  approvalId: string;
  decision: ExecApprovalReplyDecision;
} | null;
declare function formatExecApprovalExpiresIn(expiresAtMs: number, nowMs: number): string;
declare function getExecApprovalReplyMetadata(payload: ReplyPayload): ExecApprovalReplyMetadata | null;
declare function buildExecApprovalPendingReplyPayload(params: ExecApprovalPendingReplyParams): ReplyPayload;
/** Build an exec approval prompt with canonical typed decision actions. */
declare function buildTypedExecApprovalPendingReplyPayload(params: ExecApprovalPendingReplyParams): ReplyPayload;
declare function buildExecApprovalUnavailableReplyPayload(params: ExecApprovalUnavailableReplyParams): ReplyPayload;
//#endregion
export { parseExecApprovalCommandText as S, buildTypedExecApprovalPendingReplyPayload as _, ExecApprovalUnavailableReason as a, getExecApprovalApproverDmNoticeText as b, buildApprovalButtonPresentation as c, buildExecApprovalCommandText as d, buildExecApprovalPendingReplyPayload as f, buildTypedApprovalPresentation as g, buildTypedApprovalActionDescriptors as h, ExecApprovalReplyMetadata as i, buildApprovalPresentationFromActionDescriptors as l, buildExecApprovalUnavailableReplyPayload as m, ExecApprovalPendingReplyParams as n, ExecApprovalUnavailableReplyParams as o, buildExecApprovalPresentation as p, ExecApprovalReplyDecision as r, TypedApprovalActionDescriptor as s, ExecApprovalActionDescriptor as t, buildExecApprovalActionDescriptors as u, buildTypedExecApprovalPresentation as v, getExecApprovalReplyMetadata as x, formatExecApprovalExpiresIn as y };