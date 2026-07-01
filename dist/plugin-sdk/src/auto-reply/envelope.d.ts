import { type SenderLabelParams } from "../channels/sender-label.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type AgentEnvelopeParams = {
    channel: string;
    from?: string;
    timestamp?: number | Date;
    host?: string;
    ip?: string;
    body: string;
    previousTimestamp?: number | Date;
    envelope?: EnvelopeFormatOptions;
};
/** User/config-facing controls for timestamp rendering in prompt envelopes. */
export type EnvelopeFormatOptions = {
    /**
     * "local" (default), "utc", "user", or an explicit IANA timezone string.
     */
    timezone?: string;
    /**
     * Include absolute timestamps in the envelope (default: true).
     */
    includeTimestamp?: boolean;
    /**
     * Include elapsed time suffix when previousTimestamp is provided (default: true).
     */
    includeElapsed?: boolean;
    /**
     * Optional user timezone used when timezone="user".
     */
    userTimezone?: string;
};
/** Resolves envelope formatting defaults from agent config. */
export declare function resolveEnvelopeFormatOptions(cfg?: OpenClawConfig): EnvelopeFormatOptions;
/** Formats an envelope timestamp using local, UTC, user, or explicit IANA timezone rules. */
export declare function formatEnvelopeTimestamp(ts: number | Date | undefined, options?: EnvelopeFormatOptions): string | undefined;
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
export declare function formatAgentEnvelope(params: AgentEnvelopeParams): string;
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
export declare function formatInboundEnvelope(params: {
    channel: string;
    from: string;
    body: string;
    timestamp?: number | Date;
    chatType?: string;
    senderLabel?: string;
    sender?: SenderLabelParams;
    previousTimestamp?: number | Date;
    envelope?: EnvelopeFormatOptions;
    fromMe?: boolean;
}): string;
/** Builds the compact `from` label used in inbound envelope headers. */
export declare function formatInboundFromLabel(params: {
    isGroup: boolean;
    groupLabel?: string;
    groupId?: string;
    directLabel: string;
    directId?: string;
    groupFallback?: string;
}): string;
export {};
