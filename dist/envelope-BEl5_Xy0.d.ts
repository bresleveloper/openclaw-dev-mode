import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
//#region src/channels/sender-label.d.ts
type SenderLabelParams = {
  name?: string;
  username?: string;
  tag?: string;
  e164?: string;
  id?: string;
};
//#endregion
//#region src/auto-reply/envelope.d.ts
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
type EnvelopeFormatOptions = {
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
declare function resolveEnvelopeFormatOptions(cfg?: OpenClawConfig): EnvelopeFormatOptions;
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
declare function formatAgentEnvelope(params: AgentEnvelopeParams): string;
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
declare function formatInboundEnvelope(params: {
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
declare function formatInboundFromLabel(params: {
  isGroup: boolean;
  groupLabel?: string;
  groupId?: string;
  directLabel: string;
  directId?: string;
  groupFallback?: string;
}): string;
//#endregion
export { formatInboundFromLabel as a, formatInboundEnvelope as i, EnvelopeFormatOptions as n, resolveEnvelopeFormatOptions as o, formatAgentEnvelope as r, AgentEnvelopeParams as t };