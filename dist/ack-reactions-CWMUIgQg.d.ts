import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { v as HumanDelayConfig, y as IdentityConfig } from "./types.base-CA0_JvyZ.js";
//#region src/agents/identity.d.ts
/** Resolve the configured identity block for one agent. */
declare function resolveAgentIdentity(cfg: OpenClawConfig, agentId: string): IdentityConfig | undefined;
/** Resolve the acknowledgement reaction using account, channel, global, then identity fallback. */
declare function resolveAckReaction(cfg: OpenClawConfig, agentId: string, opts?: {
  channel?: string;
  accountId?: string;
}): string;
/** Build the automatic `[name]` prefix for an agent identity. */
declare function resolveIdentityNamePrefix(cfg: OpenClawConfig, agentId: string): string | undefined;
/** Resolve message and response prefix values together for channel delivery. */
declare function resolveEffectiveMessagesConfig(cfg: OpenClawConfig, agentId: string, opts?: {
  hasAllowFrom?: boolean;
  fallbackMessagePrefix?: string;
  channel?: string;
  accountId?: string;
}): {
  messagePrefix: string;
  responsePrefix?: string;
};
/** Resolve per-agent human-delay settings over global agent defaults. */
declare function resolveHumanDelayConfig(cfg: OpenClawConfig, agentId: string): HumanDelayConfig | undefined;
//#endregion
//#region src/channels/ack-reactions.d.ts
type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
/** Sent ack reaction state plus the cleanup hook callers can run after reply delivery. */
type AckReactionHandle = {
  ackReactionPromise: Promise<boolean>;
  ackReactionValue: string;
  remove: () => Promise<void>;
};
/**
 * Inputs for the reusable direct/group/mention gate shared by channel plugins.
 *
 * `effectiveWasMentioned` should already include any channel-specific mention
 * normalization. `shouldBypassMention` is only for an earlier channel gate that
 * proved the active conversation, such as a group activation state.
 */
type AckReactionGateParams = {
  scope: AckReactionScope | undefined;
  inboundEventKind?: "user_request" | "room_event";
  isDirect: boolean;
  isGroup: boolean;
  isMentionableGroup: boolean;
  canDetectMention: boolean;
  effectiveWasMentioned: boolean;
  shouldBypassMention?: boolean;
};
/** Resolves the generic ack reaction gate without sending or removing reactions. */
declare function shouldAckReaction(params: AckReactionGateParams): boolean;
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
declare function createAckReactionHandle(params: {
  ackReactionValue: string;
  send: () => Promise<void>;
  remove: () => Promise<void>;
  onSendError?: (err: unknown) => void;
}): AckReactionHandle | null;
/** Schedules removal of a previously sent ack reaction after reply delivery. */
declare function removeAckReactionAfterReply(params: {
  removeAfterReply: boolean;
  ackReactionPromise: Promise<boolean> | null;
  ackReactionValue: string | null;
  remove: () => Promise<void>;
  onError?: (err: unknown) => void;
}): void;
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
declare function removeAckReactionHandleAfterReply(params: {
  removeAfterReply: boolean;
  ackReaction: AckReactionHandle | null | undefined;
  onError?: (err: unknown) => void;
}): void;
//#endregion
export { removeAckReactionAfterReply as a, resolveAckReaction as c, resolveHumanDelayConfig as d, resolveIdentityNamePrefix as f, createAckReactionHandle as i, resolveAgentIdentity as l, AckReactionHandle as n, removeAckReactionHandleAfterReply as o, AckReactionScope as r, shouldAckReaction as s, AckReactionGateParams as t, resolveEffectiveMessagesConfig as u };