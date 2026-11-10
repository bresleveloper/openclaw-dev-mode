//#endregion
//#region src/plugin-sdk/channel-route.d.ts
/** Coarse chat shape used when a channel can distinguish direct, group, and broadcast targets. */
type ChannelRouteChatType = "direct" | "group" | "channel";
/** Provider-specific thread kind carried with normalized channel routes. */
type ChannelRouteThreadKind = "topic" | "thread" | "reply";
/** Describes which runtime surface supplied a channel route thread id. */
type ChannelRouteThreadSource = "explicit" | "target" | "session" | "turn";
/** Normalized channel route used for comparison, binding, and dedupe helpers. */
type ChannelRouteRef = {
  /** Lowercase channel id such as `slack`, `telegram`, or `discord`. */
  channel?: string;
  /** Normalized account/profile id when a channel supports multiple accounts. */
  accountId?: string;
  target?: {
    /** Canonical destination id used for route equality and delivery. */
    to: string;
    /** Original destination text when provider target grammar differs from the canonical id. */
    rawTo?: string;
    /** Coarse destination shape used by channels with different direct/group/broadcast rules. */
    chatType?: ChannelRouteChatType;
  };
  thread?: {
    /** Provider thread/topic/root id; strings are preserved when providers use opaque ids. */
    id: string | number;
    /** Provider-specific thread family for channels that distinguish topics, replies, and threads. */
    kind?: ChannelRouteThreadKind;
    /** Runtime source that supplied the thread id, used when callers need route provenance. */
    source?: ChannelRouteThreadSource;
  };
};
/** Loose route input accepted at SDK boundaries before normalization. */
type ChannelRouteRefInput = {
  /** Raw channel id; normalized to lowercase. */
  channel?: unknown;
  /** Raw account/profile id; normalized with account-id rules when string. */
  accountId?: unknown;
  /** Raw destination id before trimming and route-key normalization. */
  to?: unknown;
  /** Provider-specific target text retained when different from `to`. */
  rawTo?: unknown;
  /** Coarse destination shape supplied by channels that distinguish target kinds. */
  chatType?: ChannelRouteChatType;
  /** Raw provider thread/topic/root id before route-key normalization. */
  threadId?: unknown;
  /** Provider-specific thread family carried with the normalized thread id. */
  threadKind?: ChannelRouteThreadKind;
  /** Runtime surface that supplied the thread id. */
  threadSource?: ChannelRouteThreadSource;
};
/** Raw outbound target input shape used by helpers that do not need thread metadata source. */
type ChannelRouteTargetInput = Pick<ChannelRouteRefInput, "channel" | "accountId" | "to" | "rawTo" | "chatType" | "threadId">;
//#endregion
//#region src/utils/delivery-context.types.d.ts
/** Deferred outbound delivery intent attached to a session or task. */
type DeliveryIntentRef = {
  /** Stable queue/work item id. */
  id: string;
  /** Intent family; currently scoped to outbound queue delivery. */
  kind: "outbound_queue";
  /** Whether queueing is mandatory or best-effort for this delivery. */
  queuePolicy?: "required" | "best_effort";
};
/** Canonical channel delivery target shared by sessions, cron, tasks, and plugins. */
type DeliveryContext = Pick<ChannelRouteTargetInput, "accountId" | "channel" | "threadId" | "to"> & {
  /** Channel/plugin id that owns the delivery target. */
  channel?: string;
  /** Channel-local destination id, preserved with channel-specific casing. */
  to?: string;
  /** Optional channel account/workspace id. */
  accountId?: string;
  /** Optional thread/topic id nested under `to`. */
  threadId?: string | number;
  /** Optional queued-delivery intent associated with this context. */
  deliveryIntent?: DeliveryIntentRef;
};
//#endregion
//#region src/infra/exec-request-context.d.ts
type ExecRequestIdentity = {
  runId?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  ownerConnId?: string;
  ownerDeviceId?: string;
  controlUiVisible?: boolean;
  turnKind?: "main" | "btw";
};
/** Process-local ownership of ordinary commands, independent of a disposable tool call. */
type ExecRequestOwner = {
  identity: Readonly<ExecRequestIdentity>;
  readonly turnRunIds: Set<string>;
  readonly controller: AbortController;
  readonly signal: AbortSignal;
  readonly pendingProcesses: Set<Promise<void>>;
  cleanupUncertain: boolean;
};
declare const EVENT_OWNERS: unique symbol;
type OwnedEvent = {
  [EVENT_OWNERS]?: readonly ExecRequestOwner[];
};
/** Opaque request ancestry retained by work admitted through a host capability. */
type ExecRequestCustody = Readonly<OwnedEvent>;
declare namespace system_events_d_exports {
  export { SystemEvent, SystemEventQueueFullError, claimSystemEventTurn, consumeSelectedSystemEventEntries, drainSystemEventEntries, drainSystemEvents, enqueueRequiredSystemEventEntry, enqueueSystemEvent, enqueueSystemEventEntry, enqueueSystemEventWithReceipt, hasSystemEvents, holdSystemEventDelivery, isSystemEventContextChanged, isSystemEventTurnOwned, peekDeliverableSystemEventEntries, peekExecRequestSystemEventEntries, peekSystemEventEntries, peekSystemEvents, resetSystemEventsForTest, resolveSystemEventDeliveryContext };
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
  /** An unresolved exec attempt must not be regenerated by an unrelated model turn. */
  deliveryHeld?: boolean;
  /** Queued by work a conversation turn started, not heartbeat or automation work. */
  fromConversationTurn?: true;
  sessionStorePath?: string | null;
};
declare class SystemEventQueueFullError extends Error {
  constructor();
}
type SystemEventOptions = {
  sessionKey: string;
  sessionStorePath?: string | null;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
  fromConversationTurn?: boolean;
  /** Replace the pending event for this context and delivery route. Requires contextKey. */
  replace?: boolean;
};
type ReceiptOptions = {
  allowDuplicate?: boolean;
};
declare function isSystemEventContextChanged(sessionKey: string, contextKey?: string | null): boolean;
declare function enqueueSystemEventEntry(text: string, options: SystemEventOptions, receiptOptions?: ReceiptOptions): SystemEvent | null;
/** Host-owned admission must report capacity refusal before claiming the occurrence. */
declare function enqueueRequiredSystemEventEntry(text: string, options: SystemEventOptions, receiptOptions?: ReceiptOptions): SystemEvent | null;
declare function enqueueSystemEvent(text: string, options: SystemEventOptions): boolean;
/** Transfer one bounded set of exact occurrences to ordinary session admission. */
declare function claimSystemEventTurn(sessionKey: string, occurrences: readonly SystemEvent[], cancel: () => void, agentId?: string): {
  start(): void;
  cancel: () => boolean;
  /** Rejected adoption returns the surviving originals to passive custody. */
  release(): boolean;
} | undefined;
declare function isSystemEventTurnOwned(sessionKey: string, occurrence: SystemEvent): boolean;
/** Enqueues one occurrence and returns one-use removal ownership for its UUID. */
declare function enqueueSystemEventWithReceipt(text: string, options: SystemEventOptions, receiptOptions?: ReceiptOptions): (() => boolean) | null;
declare function drainSystemEventEntries(sessionKey: string): SystemEvent[];
declare function consumeSelectedSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[], options?: {
  deferredEventIds?: readonly string[];
}): SystemEvent[];
declare function drainSystemEvents(sessionKey: string): string[];
declare function peekSystemEventEntries(sessionKey: string): SystemEvent[];
/** Routed completions retain request ownership after process output expires. Stop is a cold path. */
declare function peekExecRequestSystemEventEntries(target: ExecRequestIdentity): Array<{
  sessionKey: string;
  events: SystemEvent[];
}>;
declare function peekSystemEvents(sessionKey: string): string[];
declare function hasSystemEvents(sessionKey: string): boolean;
declare function resolveSystemEventDeliveryContext(events: readonly SystemEvent[]): DeliveryContext | undefined;
declare function resetSystemEventsForTest(): void;
declare function peekDeliverableSystemEventEntries(sessionKey: string): SystemEvent[];
declare function holdSystemEventDelivery(sessionKey: string, attempted: readonly SystemEvent[]): void;
//#endregion
//#region src/plugins/runtime/system-events.d.ts
declare const enqueueSystemEventFromSdk: (text: string, { agentId, ...options }: Parameters<typeof enqueueSystemEvent>[1] & {
  agentId?: string;
}) => boolean;
declare const enqueueSystemEventEntryFromSdk: (text: string, options: Parameters<typeof enqueueSystemEventEntry>[1]) => ReturnType<typeof enqueueSystemEventEntry>;
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
export { enqueueSystemEventEntryFromSdk as a, isSystemEventContextChangedFromSdk as c, SystemEvent as d, resolveSystemEventDeliveryContext as f, ChannelRouteRef as g, DeliveryContext as h, enqueueRoutedSystemEvent as i, peekSystemEventEntriesFromSdk as l, ExecRequestOwner as m, drainSystemEventEntriesFromSdk as n, enqueueSystemEventFromSdk as o, ExecRequestCustody as p, drainSystemEventsFromSdk as r, hasSystemEventsFromSdk as s, consumeSelectedSystemEventEntriesFromSdk as t, peekSystemEventsFromSdk as u };