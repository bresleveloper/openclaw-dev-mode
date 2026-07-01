import type { ReplyPayload } from "../auto-reply/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Inputs for rendering direct-session status replies outside the active channel turn. */
export type ResolveDirectStatusReplyForSessionParams = {
    /** Caller config used when the target session cannot load a config snapshot. */
    cfg: OpenClawConfig;
    /** Requested session key; whitespace-only keys produce no status reply. */
    sessionKey: string;
    /** Channel/surface name used when rendering the status command context. */
    channel: string;
    /** Optional sender id for command-context rendering and audit output. */
    senderId?: string;
    /** Whether the requester is an owner and may see owner-only session state. */
    senderIsOwner: boolean;
    /** Whether the requester passed channel allowlist/authorization checks. */
    isAuthorizedSender: boolean;
    /** Whether the status reply is being rendered for a group conversation. */
    isGroup: boolean;
    /** Channel default activation mode used by the status renderer for groups. */
    defaultGroupActivation: () => "always" | "mention";
};
/**
 * Builds a direct `/status` reply for an arbitrary session key.
 * Unauthorized requesters may see the session exists, but configured reasoning
 * state is masked so private agent/session defaults are not leaked.
 */
export declare function resolveDirectStatusReplyForSession(params: ResolveDirectStatusReplyForSessionParams): Promise<ReplyPayload | undefined>;
