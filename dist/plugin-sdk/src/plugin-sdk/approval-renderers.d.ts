import { type ExecApprovalReplyDecision } from "../infra/exec-approval-reply.js";
import { type PluginApprovalRequest, type PluginApprovalResolved } from "../infra/plugin-approvals.js";
import type { ReplyPayload } from "./reply-payload.js";
/** Build a pending approval reply payload using the portable presentation API. */
export declare function buildApprovalPendingReplyPayload(params: {
    /** Approval surface recorded in channel metadata; defaults to exec approvals. */
    approvalKind?: "exec" | "plugin";
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
}): ReplyPayload;
/** Build a resolved approval reply payload with approval metadata but no controls. */
export declare function buildApprovalResolvedReplyPayload(params: {
    /** Stable approval id used by `/approve` commands and metadata correlation. */
    approvalId: string;
    /** Short channel-facing approval slug for compact metadata displays. */
    approvalSlug: string;
    /** Visible resolved-state text sent to the channel. */
    text: string;
    /** Channel-specific metadata merged with the shared approval metadata. */
    channelData?: Record<string, unknown>;
}): ReplyPayload;
/** Build pending plugin approval copy and metadata from a plugin approval request. */
export declare function buildPluginApprovalPendingReplyPayload(params: {
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
}): ReplyPayload;
/** Build resolved plugin approval copy and metadata from a plugin approval event. */
export declare function buildPluginApprovalResolvedReplyPayload(params: {
    /** Resolved plugin approval event to render. */
    resolved: PluginApprovalResolved;
    /** Optional visible text override. */
    text?: string;
    /** Optional compact approval slug; defaults to the resolved id prefix. */
    approvalSlug?: string;
    /** Channel-specific metadata merged with the shared approval metadata. */
    channelData?: Record<string, unknown>;
}): ReplyPayload;
