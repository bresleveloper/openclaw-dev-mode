import { d as PluginApprovalRequest, p as PluginApprovalResolved, r as ChannelApprovalKind, x as ExecApprovalRequestPayload } from "./approval-types-DOLowId2.js";
import "./exec-approvals-DNGb8MUN.js";
import { r as ExecApprovalReplyDecision } from "./exec-approval-reply-BmfjYRek.js";
import { i as ReplyPayload } from "./reply-payload-OW17IyAQ.js";
//#region src/infra/exec-approval-command-display.d.ts
/** Resolves sanitized command and preview text for exec approval prompts. */
declare function resolveExecApprovalCommandDisplay(request: ExecApprovalRequestPayload): {
  /** Primary command text rendered in the approval prompt. */
  commandText: string;
  /** Optional shorter preview, omitted when it would duplicate the primary command text. */
  commandPreview: string | null;
};
//#endregion
//#region src/plugin-sdk/approval-renderers.d.ts
type BuildApprovalPendingReplyPayloadParams = {
  /** Stable approval id used by `/approve` commands and metadata correlation. */
  approvalId: string;
  /** Short channel-facing approval slug for compact metadata displays. */
  approvalSlug: string;
  /** Visible approval request text sent to the channel. */
  text: string;
  /** Optional agent id associated with the approval request. */
  agentId?: string | null;
  /** Decisions rendered as buttons and accepted by the approval command. */
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  /** Optional session key associated with the approval request. */
  sessionKey?: string | null;
  /** Channel-specific metadata merged with the shared approval metadata. */
  channelData?: Record<string, unknown>;
};
/** Build a shipped command-backed approval payload. */
declare function buildApprovalPendingReplyPayload(params: BuildApprovalPendingReplyPayloadParams & {
  approvalKind?: ChannelApprovalKind;
}): ReplyPayload;
/** Build a resolved approval reply payload with approval metadata but no controls. */
declare function buildApprovalResolvedReplyPayload(params: {
  /** Stable approval id used by `/approve` commands and metadata correlation. */
  approvalId: string;
  /** Short channel-facing approval slug for compact metadata displays. */
  approvalSlug: string;
  /** Visible resolved-state text sent to the channel. */
  text: string;
  /** Channel-specific metadata merged with the shared approval metadata. */
  channelData?: Record<string, unknown>;
}): ReplyPayload;
type BuildPluginApprovalPendingReplyPayloadParams = {
  /** Plugin approval request to render. */
  request: PluginApprovalRequest;
  /** Current time used for request expiry copy. */
  nowMs: number;
  /** Optional visible text override. */
  text?: string;
  /** Optional compact approval slug; defaults to the request id prefix. */
  approvalSlug?: string;
  /** Optional decision override; defaults to the request's allowed decisions. */
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  /** Channel-specific metadata merged with the shared approval metadata. */
  channelData?: Record<string, unknown>;
};
/** Build pending plugin approval copy and metadata from a plugin approval request. */
declare function buildPluginApprovalPendingReplyPayload(params: BuildPluginApprovalPendingReplyPayloadParams): ReplyPayload;
/** Build a plugin approval prompt with canonical typed decision actions. */
declare function buildTypedPluginApprovalPendingReplyPayload(params: BuildPluginApprovalPendingReplyPayloadParams): ReplyPayload;
/** Build resolved plugin approval copy and metadata from a plugin approval event. */
declare function buildPluginApprovalResolvedReplyPayload(params: {
  /** Resolved plugin approval event to render. */
  resolved: PluginApprovalResolved;
  /** Optional visible text override. */
  text?: string;
  /** Optional compact approval slug; defaults to the resolved id prefix. */
  approvalSlug?: string;
  /** Channel-specific metadata merged with the shared approval metadata. */
  channelData?: Record<string, unknown>;
}): ReplyPayload;
//#endregion
export { buildTypedPluginApprovalPendingReplyPayload as a, buildPluginApprovalResolvedReplyPayload as i, buildApprovalResolvedReplyPayload as n, resolveExecApprovalCommandDisplay as o, buildPluginApprovalPendingReplyPayload as r, buildApprovalPendingReplyPayload as t };