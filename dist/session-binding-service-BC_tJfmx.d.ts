import { a as SessionBindingPlacement, c as SessionBindingUnbindInput, i as SessionBindingCapabilities, n as ConversationRef, o as SessionBindingRecord, r as SessionBindingBindInput, s as SessionBindingScope } from "./session-binding.types-CHb9gl-M.js";
//#region src/infra/outbound/session-binding-service.d.ts
type SessionBindingService = {
  bind: (input: SessionBindingBindInput) => Promise<SessionBindingRecord>;
  getCapabilities: (params: {
    channel: string;
    accountId: string;
  }) => SessionBindingCapabilities;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  /** @deprecated Use touchAsync. Retained through the next Plugin SDK major. */
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
type SessionBindingAdapterCapabilities = {
  placements?: SessionBindingPlacement[];
  bindSupported?: boolean;
  unbindSupported?: boolean;
};
type SessionBindingAdapter = {
  channel: string;
  accountId: string;
  capabilities?: SessionBindingAdapterCapabilities;
  bind?: (input: SessionBindingBindInput) => Promise<SessionBindingRecord | null>;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  /** Pure selection for ownership checks; defaults to resolveByConversation for legacy adapters. */
  inspectByConversation?: (ref: ConversationRef) => SessionBindingRecord | null;
  /** Inspects committed ownership without creating storage or pruning rows. */
  inspectByConversationAsync?: (ref: ConversationRef) => Promise<SessionBindingRecord | null>;
  resolveByConversationAsync?: (ref: ConversationRef) => Promise<SessionBindingRecord | null>;
  /** @deprecated Use touchAsync. Retained through the next Plugin SDK major. */
  touch?: (bindingId: string, at?: number) => void;
  /** Settles accepted persistence before resolving. */
  touchAsync?: (bindingId: string, at?: number) => Promise<void>;
  unbind?: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
declare function registerSessionBindingAdapter(adapter: SessionBindingAdapter): void;
declare function unregisterSessionBindingAdapter(params: {
  channel: string;
  accountId: string;
  adapter?: SessionBindingAdapter;
}): void;
declare function inspectSessionBindingByConversation(ref: ConversationRef): {
  status: "available";
  binding: SessionBindingRecord | null;
} | {
  status: "unavailable";
};
/** Awaits worker-backed ownership inspection; legacy external adapters retain their sync reader. */
declare function inspectSessionBindingByConversationAsync(ref: ConversationRef): Promise<ReturnType<typeof inspectSessionBindingByConversation>>;
declare function getSessionBindingService(): AsyncSessionBindingService;
declare const testing: {
  resetSessionBindingAdaptersForTests(): void;
  getRegisteredAdapterKeys(): string[];
};
//#endregion
export { testing as a, registerSessionBindingAdapter as i, getSessionBindingService as n, unregisterSessionBindingAdapter as o, inspectSessionBindingByConversation as r, SessionBindingAdapter as t };