import { _ as PluginApprovalResolved, h as PluginApprovalRequest, n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import { i as ReplyPayload } from "./reply-payload-yojyxBLb.js";
import { r as ExecApprovalReplyDecision } from "./exec-approval-reply-ZUfh_LBI.js";
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
export { buildTypedPluginApprovalPendingReplyPayload as a, buildPluginApprovalResolvedReplyPayload as i, buildApprovalResolvedReplyPayload as n, buildPluginApprovalPendingReplyPayload as r, buildApprovalPendingReplyPayload as t };