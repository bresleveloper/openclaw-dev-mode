//#region src/infra/outbound/session-binding.types.d.ts
/**
 * Runtime destination a conversation binding points at.
 */
type BindingTargetKind = "subagent" | "session";
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
  /** Lifecycle state for a registered session binding. */
  status: "active" | "ending" | "ended";
  boundAt: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
};
type SessionBindingInspection = {
  status: "available";
  binding: SessionBindingRecord | null;
} | {
  status: "unavailable";
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
type SessionBindingAdapterCapabilities = {
  placements?: SessionBindingPlacement[];
  bindSupported?: boolean;
  unbindSupported?: boolean;
};
/** @deprecated Implement SessionBindingAdapterV2; final compatibility day: 2026-12-31. */
type SessionBindingAdapter = {
  channel: string;
  accountId: string;
  capabilities?: SessionBindingAdapterCapabilities;
  bind?: (input: SessionBindingBindInput) => Promise<SessionBindingRecord | null>;
  /** @deprecated Use listBySessionAsync; final compatibility day: 2026-12-31. */
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  /** @deprecated Use resolveByConversationAsync; final compatibility day: 2026-12-31. */
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  /** @deprecated Use inspectByConversationAsync; final compatibility day: 2026-12-31. */
  inspectByConversation?: (ref: ConversationRef) => SessionBindingRecord | null;
  /** Inspects committed ownership without creating storage or pruning rows. */
  inspectByConversationAsync?: (ref: ConversationRef) => Promise<SessionBindingRecord | null>;
  resolveByConversationAsync?: (ref: ConversationRef) => Promise<SessionBindingRecord | null>;
  /** @deprecated Use touchAsync; final compatibility day: 2026-12-31. */
  touch?: (bindingId: string, at?: number) => void;
  /** Settles accepted persistence before resolving. */
  touchAsync?: (bindingId: string, at?: number) => Promise<void>;
  unbind?: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
//#endregion
//#region src/infra/outbound/session-binding-service.d.ts
type SessionBindingService = {
  bind: (input: SessionBindingBindInput) => Promise<SessionBindingRecord>;
  getCapabilities: (params: SessionBindingScope) => SessionBindingCapabilities;
  /** @deprecated Use listBySessionAsync; final compatibility day: 2026-12-31. */
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  /** @deprecated Use resolveByConversationAsync; final compatibility day: 2026-12-31. */
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  /** @deprecated Use touchAsync; final compatibility day: 2026-12-31. */
  touch: (bindingId: string, at?: number, scope?: SessionBindingScope) => void;
  unbind: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
/** Host service with explicit awaited mutations; the legacy structural type stays assignable. */
type AsyncSessionBindingService = SessionBindingService & {
  inspectByConversationAsync: typeof inspectSessionBindingByConversationAsync;
  resolveByConversationAsync: (ref: ConversationRef) => Promise<SessionBindingRecord | null>;
  /** Joins the selected adapter's mutation; legacy adapters may still perform synchronous work. */
  touchAsync: (bindingId: string, at?: number, scope?: SessionBindingScope) => Promise<void>;
};
type SessionBindingServiceV2 = AsyncSessionBindingService & {
  listBySessionAsync: typeof listSessionBindingsBySessionAsync;
};
/** @deprecated Use registerSessionBindingAdapterV2; final compatibility day: 2026-12-31. */
declare function registerSessionBindingAdapter(adapter: SessionBindingAdapter): void;
declare function unregisterSessionBindingAdapter(params: {
  channel: string;
  accountId: string;
  adapter?: SessionBindingAdapter;
}): void;
declare function listSessionBindingsBySessionAsync(targetSessionKey: string): Promise<SessionBindingRecord[]>;
/** @deprecated Use inspectSessionBindingByConversationAsync; final compatibility day: 2026-12-31. */
declare function inspectSessionBindingByConversation(ref: ConversationRef): SessionBindingInspection;
/** Awaits worker-backed ownership inspection; legacy external adapters retain their sync reader. */
declare function inspectSessionBindingByConversationAsync(ref: ConversationRef): Promise<ReturnType<typeof inspectSessionBindingByConversation>>;
declare function getSessionBindingService(): SessionBindingServiceV2;
declare const testing: {
  resetSessionBindingAdaptersForTests(): void;
  getRegisteredAdapterKeys(): string[];
};
//#endregion
export { testing as a, ConversationRef as c, SessionBindingInspection as d, SessionBindingRecord as f, registerSessionBindingAdapter as i, SessionBindingAdapter as l, inspectSessionBindingByConversation as n, unregisterSessionBindingAdapter as o, inspectSessionBindingByConversationAsync as r, BindingTargetKind as s, getSessionBindingService as t, SessionBindingBindInput as u };