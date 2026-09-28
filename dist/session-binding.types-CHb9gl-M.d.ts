//#region src/infra/outbound/session-binding.types.d.ts
/**
 * Runtime destination a conversation binding points at.
 */
type BindingTargetKind = "subagent" | "session";
/**
 * Lifecycle state for a registered session binding.
 */
type BindingStatus = "active" | "ending" | "ended";
/**
 * Placement requested when binding a child/current session to a conversation.
 */
type SessionBindingPlacement = "current" | "child";
/**
 * Channel/account/conversation tuple used to resolve a bound delivery route.
 */
type ConversationRef = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};
/** Channel/account owner of an adapter-local binding id. */
type SessionBindingScope = Pick<ConversationRef, "channel" | "accountId">;
/**
 * Persistable record that connects one conversation to one target session.
 */
type SessionBindingRecord = {
  bindingId: string;
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  status: BindingStatus;
  boundAt: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
};
/**
 * Request to create or refresh a session binding for a conversation.
 */
type SessionBindingBindInput = {
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  placement?: SessionBindingPlacement;
  metadata?: Record<string, unknown>;
  ttlMs?: number;
  /** Host admission authority; current-placement adapters recheck before committing a binding. */
  assertCurrent?: () => void;
};
/**
 * Request to remove bindings by id or target session.
 */
type SessionBindingUnbindInput = {
  bindingId?: string;
  targetSessionKey?: string;
  /** Restrict removal to this owner; omit only for intentional cross-channel cleanup. */
  scope?: SessionBindingScope;
  reason: string;
};
/**
 * Capability summary exposed by the active binding adapter for a conversation scope.
 */
type SessionBindingCapabilities = {
  adapterAvailable: boolean;
  bindSupported: boolean;
  unbindSupported: boolean;
  placements: SessionBindingPlacement[];
};
//#endregion
export { SessionBindingPlacement as a, SessionBindingUnbindInput as c, SessionBindingCapabilities as i, ConversationRef as n, SessionBindingRecord as o, SessionBindingBindInput as r, SessionBindingScope as s, BindingTargetKind as t };