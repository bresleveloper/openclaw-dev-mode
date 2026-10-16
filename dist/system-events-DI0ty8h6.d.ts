import { t as DeliveryContext } from "./delivery-context.types-DgfLEW3H.js";
declare namespace system_events_d_exports {
  export { SystemEvent, consumeSelectedSystemEventEntries, drainSystemEventEntries, drainSystemEvents, enqueueSystemEvent, enqueueSystemEventEntry, enqueueSystemEventWithReceipt, hasSystemEvents, isSystemEventContextChanged, peekSystemEventEntries, peekSystemEvents, resetSystemEventsForTest, resolveSystemEventDeliveryContext };
}
type SystemEvent = {
  /**
   * OpenClaw-assigned opaque identity for one queued occurrence. Preserve it when returning a
   * snapshot to consume. It changes on replacement or re-enqueue; optional only for legacy
   * ID-less compatibility.
   */
  id?: string;
  text: string;
  ts: number;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
  sessionStorePath?: string | null;
};
type SystemEventOptions = {
  sessionKey: string;
  sessionStorePath?: string | null;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
  /** Replace the pending event for this context and delivery route. Requires contextKey. */
  replace?: boolean;
};
type ReceiptOptions = {
  allowDuplicate?: boolean;
};
declare function isSystemEventContextChanged(sessionKey: string, contextKey?: string | null): boolean;
declare function enqueueSystemEventEntry(text: string, options: SystemEventOptions): SystemEvent | null;
declare function enqueueSystemEvent(text: string, options: SystemEventOptions): boolean;
/** Enqueues one occurrence and returns one-use removal ownership for its UUID. */
declare function enqueueSystemEventWithReceipt(text: string, options: SystemEventOptions, receiptOptions?: ReceiptOptions): (() => boolean) | null;
declare function drainSystemEventEntries(sessionKey: string): SystemEvent[];
declare function consumeSelectedSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[], options?: {
  deferredEventIds?: readonly string[];
}): SystemEvent[];
declare function drainSystemEvents(sessionKey: string): string[];
declare function peekSystemEventEntries(sessionKey: string): SystemEvent[];
declare function peekSystemEvents(sessionKey: string): string[];
declare function hasSystemEvents(sessionKey: string): boolean;
declare function resolveSystemEventDeliveryContext(events: readonly SystemEvent[]): DeliveryContext | undefined;
declare function resetSystemEventsForTest(): void;
//#endregion
//#region src/plugins/runtime/system-events.d.ts
declare const enqueueSystemEventFromSdk: (text: string, { agentId, ...options }: Parameters<typeof enqueueSystemEvent>[1] & {
  agentId?: string;
}) => boolean;
declare const enqueueSystemEventEntryFromSdk: typeof enqueueSystemEventEntry;
declare function enqueueRoutedSystemEvent(text: string, route: {
  agentId: string;
  sessionKey: string;
}, options?: Omit<Parameters<typeof enqueueSystemEvent>[1], "sessionKey">): boolean;
declare const consumeSelectedSystemEventEntriesFromSdk: typeof consumeSelectedSystemEventEntries;
declare const drainSystemEventEntriesFromSdk: typeof drainSystemEventEntries;
declare const drainSystemEventsFromSdk: typeof drainSystemEvents;
declare const hasSystemEventsFromSdk: typeof hasSystemEvents;
declare const isSystemEventContextChangedFromSdk: typeof isSystemEventContextChanged;
declare function peekSystemEventEntriesFromSdk(key: string, agentId?: string): SystemEvent[];
declare const peekSystemEventsFromSdk: typeof peekSystemEvents;
//#endregion
export { enqueueSystemEventEntryFromSdk as a, isSystemEventContextChangedFromSdk as c, SystemEvent as d, resolveSystemEventDeliveryContext as f, enqueueRoutedSystemEvent as i, peekSystemEventEntriesFromSdk as l, drainSystemEventEntriesFromSdk as n, enqueueSystemEventFromSdk as o, drainSystemEventsFromSdk as r, hasSystemEventsFromSdk as s, consumeSelectedSystemEventEntriesFromSdk as t, peekSystemEventsFromSdk as u };