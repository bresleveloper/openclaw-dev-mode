import type { OpenClawConfig } from "../config/types.openclaw.js";
type ApprovalCommandAuthorization = {
    authorized: boolean;
    reason?: string;
    explicit: boolean;
};
/** Resolves whether a chat `/approve` command is authorized by channel-specific approval policy. */
export declare function resolveApprovalCommandAuthorization(params: {
    cfg: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
    senderId?: string | null;
    kind: "exec" | "plugin";
}): ApprovalCommandAuthorization;
export {};
