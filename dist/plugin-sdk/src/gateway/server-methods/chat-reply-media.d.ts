import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Normalize reply media paths for webchat display without leaking sensitive media. */
export declare function normalizeWebchatReplyMediaPathsForDisplay(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    agentId: string;
    workspaceDir?: string;
    accountId?: string;
    payloads: ReplyPayload[];
}): Promise<ReplyPayload[]>;
