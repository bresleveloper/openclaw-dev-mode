import { pn as ReplyPayload } from "./reply-payload-DazZPys5.js";
import { T as ExecHost, _ as ApprovalScope, r as ChannelApprovalKind, y as ExecApprovalDecision } from "./approval-types-DOLowId2.js";
import { f as MessagePresentation, h as MessagePresentationButton, p as MessagePresentationAction } from "./payload-DbVrIDaU.js";
import "./exec-approvals-DNGb8MUN.js";
//#region src/infra/exec-approval-reply.d.ts
type ExecApprovalReplyDecision = ExecApprovalDecision;
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
type BuildExecApprovalActionDescriptorsParams = {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
};
declare function buildExecApprovalActionDescriptors(params: BuildExecApprovalActionDescriptorsParams): ExecApprovalActionDescriptor[];
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
//#endregion
export { buildApprovalButtonPresentation as a, buildExecApprovalPendingReplyPayload as c, buildTypedExecApprovalPendingReplyPayload as d, formatExecApprovalExpiresIn as f, parseExecApprovalCommandText as h, ExecApprovalReplyMetadata as i, buildExecApprovalPresentation as l, getExecApprovalReplyMetadata as m, ExecApprovalPendingReplyParams as n, buildApprovalPresentationFromActionDescriptors as o, getExecApprovalApproverDmNoticeText as p, ExecApprovalReplyDecision as r, buildExecApprovalActionDescriptors as s, ExecApprovalActionDescriptor as t, buildTypedApprovalPresentation as u };