import type { ExecApprovalForwardTarget } from "../config/types.approvals.js";
import { matchesApprovalRequestFilters } from "../infra/approval-request-filters.js";
import { getExecApprovalReplyMetadata } from "../infra/exec-approval-reply.js";
import type { ExecApprovalRequest } from "../infra/exec-approvals.js";
import type { PluginApprovalRequest } from "../infra/plugin-approvals.js";
import type { OpenClawConfig } from "./config-runtime.js";
import type { ReplyPayload } from "./reply-payload.js";
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalTarget = "dm" | "channel" | "both";
type ChannelExecApprovalEnableMode = boolean | "auto";
type ChannelApprovalConfig = {
    /** Whether the channel approval client is enabled for this account. */
    enabled?: ChannelExecApprovalEnableMode;
    /** Preferred approval delivery target for this account. */
    target?: ApprovalTarget;
    /** Optional agent filters for forwarded approval requests. */
    agentFilter?: string[];
    /** Optional session filters for forwarded approval requests. */
    sessionFilter?: string[];
};
type ApprovalProfileParams = {
    /** Full config used to resolve account-scoped approval settings. */
    cfg: OpenClawConfig;
    /** Optional channel account id for account-scoped approval settings. */
    accountId?: string | null;
};
export { getExecApprovalReplyMetadata, matchesApprovalRequestFilters };
/** Return whether a channel account has an enabled approval client and at least one approver. */
export declare function isChannelExecApprovalClientEnabledFromConfig(params: {
    /** Configured channel approval enable mode. */
    enabled?: ChannelExecApprovalEnableMode;
    /** Number of configured approvers after account resolution. */
    approverCount: number;
}): boolean;
/**
 * Return whether a sender is one of the configured global exec approval forward targets.
 * Channel plugins provide the target matcher because `to` shapes differ by provider.
 */
export declare function isChannelExecApprovalTargetRecipient(params: {
    /** Full config containing global exec approval target routing. */
    cfg: OpenClawConfig;
    /** Sender id or handle to compare with configured forward targets. */
    senderId?: string | null;
    /** Optional channel account id for account-scoped target matching. */
    accountId?: string | null;
    /** Channel id receiving the approval action. */
    channel: string;
    /** Optional sender normalizer; defaults to trimmed string normalization. */
    normalizeSenderId?: (value: string) => string | undefined;
    /** Channel-specific matcher for normalized sender ids against target records. */
    matchTarget: (params: {
        target: ExecApprovalForwardTarget;
        normalizedSenderId: string;
        normalizedAccountId?: string;
    }) => boolean;
}): boolean;
/**
 * Build the common approval-client profile used by channel plugins.
 * The returned helpers centralize enablement, approver auth, request filters, and local prompt suppression.
 */
export declare function createChannelExecApprovalProfile(params: {
    /** Resolves channel approval config for the current account. */
    resolveConfig: (params: ApprovalProfileParams) => ChannelApprovalConfig | undefined;
    /** Resolves normalized approver ids for the current account. */
    resolveApprovers: (params: ApprovalProfileParams) => string[];
    /** Optional sender normalizer; defaults to trimmed string normalization. */
    normalizeSenderId?: (value: string) => string | undefined;
    /** Optional global approval-target matcher for sender authorization. */
    isTargetRecipient?: (params: ApprovalProfileParams & {
        senderId?: string | null;
    }) => boolean;
    /** Optional account matcher for filtering forwarded approval requests. */
    matchesRequestAccount?: (params: ApprovalProfileParams & {
        request: ApprovalRequest;
    }) => boolean;
    fallbackAgentIdFromSessionKey?: boolean;
    /** Allows local prompt suppression even when the remote approval client is disabled. */
    requireClientEnabledForLocalPromptSuppression?: boolean;
}): {
    /** Whether this account has an enabled channel approval client and approvers. */
    isClientEnabled: (input: ApprovalProfileParams) => boolean;
    /** Whether a sender is in the resolved approver set. */
    isApprover: (input: ApprovalProfileParams & {
        senderId?: string | null;
    }) => boolean;
    /** Whether a sender is either an approver or a configured approval target. */
    isAuthorizedSender: (input: ApprovalProfileParams & {
        senderId?: string | null;
    }) => boolean;
    /** Preferred delivery target, defaulting to approver DMs. */
    resolveTarget: (input: ApprovalProfileParams) => ApprovalTarget;
    /** Whether this profile should handle a forwarded approval request. */
    shouldHandleRequest: (input: ApprovalProfileParams & {
        request: ApprovalRequest;
    }) => boolean;
    /** Whether a local approval prompt should be suppressed for an already-rendered payload. */
    shouldSuppressLocalPrompt: (input: ApprovalProfileParams & {
        payload: ReplyPayload;
    }) => boolean;
};
