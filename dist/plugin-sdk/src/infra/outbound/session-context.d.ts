import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SilentReplyConversationType } from "../../shared/silent-reply-policy.js";
export type OutboundSessionContext = {
    /**
     * Canonical session key used for internal hook dispatch.
     *
     * MUST equal the agent runtime's `params.sessionKey` for the run that
     * produced the payload being delivered. Plugins observing both
     * `agent_end`/`llm_input`/`llm_output`/`before_tool_call`/`after_tool_call`
     * and `message_sending`/`message_sent` rely on this equality to correlate
     * per-turn state across the agent-loop and delivery boundaries.
     *
     * Callers populating this field should use the same value the agent runner
     * received as its sessionKey — in the chat path that is
     * `targetSessionKey || ctx.SessionKey` (see
     * `auto-reply/reply/get-reply.ts`). Followup, ACP, command, and cron
     * delivery paths each have their own canonical value to forward; consult
     * the relevant runner.
     */
    key?: string;
    /**
     * Session key used for policy resolution when delivery differs from the
     * control session. Used to look up silent-reply policy, send rate limits,
     * agent-scoped channel preferences, etc., for the chat the reply is being
     * delivered into. May equal `key` when there is no redirect; otherwise
     * `policyKey` describes the *delivery target*'s session while `key`
     * describes the *control session* whose hooks fire.
     */
    policyKey?: string;
    /** Explicit conversation type for policy resolution when a session key is generic. */
    conversationType?: SilentReplyConversationType;
    /** Active agent id used for workspace-scoped media roots. */
    agentId?: string;
    /** Originating account id used for requester-scoped group policy resolution. */
    requesterAccountId?: string;
    /** Originating sender id used for sender-scoped outbound media policy. */
    requesterSenderId?: string;
    /** Originating sender display name for name-keyed sender policy matching. */
    requesterSenderName?: string;
    /** Originating sender username for username-keyed sender policy matching. */
    requesterSenderUsername?: string;
    /** Originating sender E.164 phone number for e164-keyed sender policy matching. */
    requesterSenderE164?: string;
};
/** Builds the outbound delivery session context, omitting empty policy fields. */
export declare function buildOutboundSessionContext(params: {
    cfg: OpenClawConfig;
    sessionKey?: string | null;
    policySessionKey?: string | null;
    conversationType?: string | null;
    isGroup?: boolean | null;
    agentId?: string | null;
    requesterAccountId?: string | null;
    requesterSenderId?: string | null;
    requesterSenderName?: string | null;
    requesterSenderUsername?: string | null;
    requesterSenderE164?: string | null;
}): OutboundSessionContext | undefined;
