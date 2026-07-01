import type { OpenClawConfig } from "./config-runtime.js";
type ApprovalKind = "exec" | "plugin";
type ApprovalAuthorizationResult = {
    /** Whether the actor may perform the approval action. */
    authorized: boolean;
    /** User-facing denial reason when authorization fails. */
    reason?: string;
};
/**
 * Marks an authorization result as the implicit same-chat fallback used when a
 * channel has no configured approver allowlist.
 */
export declare function markImplicitSameChatApprovalAuthorization(
/** Authorization result to tag as the empty-approver same-chat fallback. */
result: ApprovalAuthorizationResult): ApprovalAuthorizationResult;
/**
 * Checks whether an authorization result came from the implicit same-chat
 * fallback instead of an explicitly configured approver allowlist.
 */
export declare function isImplicitSameChatApprovalAuthorization(
/** Authorization result returned by approval auth helpers. */
result: ApprovalAuthorizationResult | null | undefined): boolean;
/**
 * Builds the approval authorization adapter shared by channels that resolve
 * approvers from account-scoped config.
 */
export declare function createResolvedApproverActionAuthAdapter(params: {
    /** Human-readable channel label used in denial messages. */
    channelLabel: string;
    /** Resolves normalized approver ids from config and optional account scope. */
    resolveApprovers: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => string[];
    /** Optional sender normalizer; defaults to trimmed string normalization. */
    normalizeSenderId?: (value: string) => string | undefined;
}): {
    authorizeActorAction({ cfg, accountId, senderId, approvalKind, }: {
        /** Full config used to resolve account-scoped approvers. */
        cfg: OpenClawConfig;
        /** Optional channel account id for account-scoped approver config. */
        accountId?: string | null;
        /** Actor attempting the approval action. */
        senderId?: string | null;
        /** Approval action being authorized. */
        action: "approve";
        /** Approval kind used in user-facing denial copy. */
        approvalKind: ApprovalKind;
    }): ApprovalAuthorizationResult | {
        reason?: undefined;
        readonly authorized: true;
    } | {
        readonly authorized: false;
        readonly reason: `\u274C You are not authorized to approve exec requests on ${string}.` | `\u274C You are not authorized to approve plugin requests on ${string}.`;
    };
};
export {};
