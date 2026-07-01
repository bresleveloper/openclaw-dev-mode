import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
import type { PluginApprovalRequest } from "./plugin-approvals.js";
type ApprovalRequestLike = ExecApprovalRequest | PluginApprovalRequest;
type PersistedApprovalRequestSessionEntry = {
    sessionKey: string;
    entry: SessionEntry;
};
/** Loads the persisted session entry referenced by an approval request, if still present. */
export declare function resolvePersistedApprovalRequestSessionEntry(params: {
    cfg: OpenClawConfig;
    request: ApprovalRequestLike;
}): PersistedApprovalRequestSessionEntry | null;
/** Resolves the account id an approval request belongs to for an optional channel filter. */
export declare function resolveApprovalRequestAccountId(params: {
    cfg: OpenClawConfig;
    request: ApprovalRequestLike;
    channel?: string | null;
}): string | null;
/** Resolves an approval request account only when the request can be routed to a channel. */
export declare function resolveApprovalRequestChannelAccountId(params: {
    cfg: OpenClawConfig;
    request: ApprovalRequestLike;
    channel: string;
}): string | null;
/** Checks whether a channel/account pair is eligible to handle an approval request. */
export declare function doesApprovalRequestMatchChannelAccount(params: {
    cfg: OpenClawConfig;
    request: ApprovalRequestLike;
    channel: string;
    accountId?: string | null;
}): boolean;
export {};
