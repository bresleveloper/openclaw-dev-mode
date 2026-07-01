import type { OpenClawConfig } from "../../config/types.openclaw.js";
export { isAnnounceSkip, isNonDeliverableSessionsReply, isReplySkip, } from "./sessions-send-tokens.js";
export type AnnounceTarget = {
    channel: string;
    to: string;
    accountId?: string;
    threadId?: string;
};
/** Resolves a session key into the channel target used for source-reply announcements. */
export declare function resolveAnnounceTargetFromKey(sessionKey: string): AnnounceTarget | null;
/** Builds the initial prompt context for a sessions_send agent-to-agent request. */
export declare function buildAgentToAgentMessageContext(params: {
    requesterSessionKey?: string;
    requesterChannel?: string;
    targetSessionKey: string;
}): string;
/** Builds the bounded ping-pong reply prompt for the current A2A participant. */
export declare function buildAgentToAgentReplyContext(params: {
    requesterSessionKey?: string;
    requesterChannel?: string;
    targetSessionKey: string;
    targetChannel?: string;
    currentRole: "requester" | "target";
    turn: number;
    maxTurns: number;
}): string;
/** Builds the final announce prompt that decides whether to post back to the target channel. */
export declare function buildAgentToAgentAnnounceContext(params: {
    requesterSessionKey?: string;
    requesterChannel?: string;
    targetSessionKey: string;
    targetChannel?: string;
    originalMessage: string;
    roundOneReply?: string;
    latestReply?: string;
}): string;
/** Resolves the configured A2A ping-pong turn limit with a hard runtime cap. */
export declare function resolvePingPongTurns(cfg?: OpenClawConfig): number;
