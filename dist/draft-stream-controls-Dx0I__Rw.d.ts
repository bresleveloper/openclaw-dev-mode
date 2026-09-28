import { r as ChannelAccountSnapshot } from "./types.core-D1MQo5ra.js";
import { S as MessageReceipt, y as LiveMessageState } from "./types-DOAIO5Ze.js";
import { n as ChannelDeliveryResult } from "./delivery-outcome-Dvdp8_SV.js";
//#region src/channels/run-state-machine.d.ts
type RunStateStatusPatch = {
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
/** Status sink used by channel run-state updates. */
type RunStateStatusSink = (patch: RunStateStatusPatch) => void;
type RunStateMachineParams = {
  setStatus?: RunStateStatusSink;
  abortSignal?: AbortSignal;
  heartbeatMs?: number;
  now?: () => number;
};
/** Creates a channel run-state tracker with heartbeat updates while runs are active. */
declare function createRunStateMachine(params: RunStateMachineParams): {
  isActive(): boolean;
  onRunStart(): void;
  onRunEnd(): void;
  deactivate: () => void;
};
//#endregion
//#region src/plugin-sdk/channel-lifecycle.core.d.ts
type CloseAwareServer = {
  once: (event: "close", listener: () => void) => unknown;
};
type PassiveAccountLifecycleParams<Handle> = {
  abortSignal?: AbortSignal;
  start: () => Promise<Handle>;
  stop?: (handle: Handle) => void | Promise<void>;
  onStop?: () => void | Promise<void>;
};
/** Runtime context passed to queued channel work. */
type ChannelRunQueueTaskContext = {
  /** Signal tied to the channel/account lifecycle that owns the queued work. */
  lifecycleSignal?: AbortSignal;
};
/** Per-key async queue used by channel plugins to serialize account or thread work. */
type ChannelRunQueue = {
  /** Enqueue work under a serialization key such as account id, thread id, or chat id. */
  enqueue: (key: string, task: (context: ChannelRunQueueTaskContext) => Promise<void>) => void;
  /** Stop accepting meaningful work and mark the lifecycle as inactive. */
  deactivate: () => void;
};
/** Hooks used to wire channel queue state into runtime status and error reporting. */
type ChannelRunQueueParams = {
  /** Receives busy/idle lifecycle snapshots from the shared run-state machine. */
  setStatus?: RunStateStatusSink;
  /** Lifecycle signal propagated to queued tasks. */
  abortSignal?: AbortSignal;
  /** Best-effort sink for task failures after enqueueing. */
  onError?: (error: unknown) => void;
};
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
declare function createAccountStatusSink(params: {
  accountId: string;
  setStatus: (next: ChannelAccountSnapshot) => void;
}): (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
/**
 * Serialize channel work per key while keeping lifecycle/busy accounting out of
 * channel-specific message handlers. The queue does not impose run timeouts;
 * callers should rely on session/tool/runtime lifecycle for long-running work.
 */
declare function createChannelRunQueue(params: ChannelRunQueueParams): ChannelRunQueue;
/**
 * Return a promise that resolves when the signal is aborted.
 *
 * If no signal is provided, the promise stays pending forever. When provided,
 * `onAbort` runs once before the promise resolves.
 */
declare function waitUntilAbort(signal?: AbortSignal, onAbort?: () => void | Promise<void>): Promise<void>;
/**
 * Keep a passive account task alive until abort, then run optional cleanup.
 */
declare function runPassiveAccountLifecycle<Handle>(params: PassiveAccountLifecycleParams<Handle>): Promise<void>;
/**
 * Keep a channel/provider task pending until the HTTP server closes.
 *
 * When an abort signal is provided, `onAbort` is invoked once and should
 * trigger server shutdown. The returned promise resolves only after `close`.
 */
declare function keepHttpServerTaskAlive(params: {
  server: CloseAwareServer;
  abortSignal?: AbortSignal;
  onAbort?: () => void | Promise<void>;
}): Promise<void>;
//#endregion
//#region src/channels/message/live.d.ts
/** A transport-owned preview. discardPending must stop new work before awaiting in-flight work. */
type LivePreviewFinalizerDraft<TId> = {
  flush: () => Promise<void>;
  id: () => TId | undefined;
  seal?: () => Promise<void>;
  discardPending?: () => Promise<void>;
  clear: () => Promise<void>;
};
type LivePreviewDraft<TId> = Omit<LivePreviewFinalizerDraft<TId>, "clear"> & {
  clear: () => Promise<boolean | void>;
};
type LivePreviewDeliveryResult = ChannelDeliveryResult & {
  visibleReplySent: boolean;
};
type PreviewSendResult = LivePreviewDeliveryResult | boolean | void;
type LivePreviewFinalizerResultKind = "normal-delivered" | "normal-skipped" | "preview-finalized" | "preview-retained";
type LivePreviewFinalizerResult<TPayload> = {
  kind: LivePreviewFinalizerResultKind;
  liveState?: LiveMessageState<TPayload>;
  deliveryResult?: LivePreviewDeliveryResult;
};
type PublishedPreviewAdapter<TPayload, TId, TEdit> = {
  draft?: LivePreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
  createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
  onPreviewFinalized?: (id: TId, receipt: MessageReceipt, liveState: LiveMessageState<TPayload>) => Promise<void> | void;
  buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
  deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
  handlePreviewEditError?: (params: {
    error: unknown;
    id: TId;
    edit: TEdit;
    payload: TPayload;
    liveState: LiveMessageState<TPayload>;
  }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
  logPreviewEditFailure?: (error: unknown) => void;
};
type FinalizableLivePreviewAdapter<TPayload, TId, TEdit> = Omit<PublishedPreviewAdapter<TPayload, TId, TEdit>, "draft" | "buildFinalEdit" | "editFinal" | "deliverSupplemental"> & {
  draft?: LivePreviewDraft<TId>;
  buildFinalEdit?: (payload: TPayload) => TEdit | undefined;
  editFinal?: (id: TId, edit: TEdit) => Promise<void | LivePreviewDeliveryResult>;
  deliverSupplemental?: (payload: TPayload) => Promise<PreviewSendResult>;
};
declare function defineFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(adapter: PublishedPreviewAdapter<TPayload, TId, TEdit>): PublishedPreviewAdapter<TPayload, TId, TEdit>;
declare function createPreviewMessageReceipt(params: {
  id: unknown;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
  raw?: unknown;
}): MessageReceipt;
/** Published adapter contract; shares the stateful owner's delivery implementation. */
declare function deliverWithFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  liveState?: LiveMessageState<TPayload>;
  adapter?: PublishedPreviewAdapter<TPayload, TId, TEdit>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onNormalDelivered?: () => Promise<void> | void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
type LivePreviewLifecycle<TPayload, TId> = {
  readonly previewFinalized: boolean;
  readonly finalDelivered: boolean;
  readonly finalSucceeded: boolean;
  readonly finalFailed: boolean;
  readonly finalStarted: boolean;
  deliver<TEdit = never>(params: {
    kind: "tool" | "block" | "final";
    payload: TPayload;
    isError?: boolean;
    adapter?: Omit<FinalizableLivePreviewAdapter<TPayload, TId, TEdit>, "draft">;
    deliverNormally: (payload: TPayload) => Promise<LivePreviewDeliveryResult>;
    onNormalDelivered?: () => Promise<void> | void;
  }): Promise<LivePreviewFinalizerResult<TPayload>>;
  observeDelivery: (result: LivePreviewDeliveryResult) => Promise<void>;
  observeFailure: () => void;
  cleanup: (options?: {
    failed?: boolean;
  }) => Promise<void>;
  retainPreview: () => void;
  reset: () => void;
};
/** Owns one admitted turn's final facts and preview custody, not provider wire semantics. */
declare function createLivePreviewLifecycle<TPayload, TId>(options?: {
  draft?: LivePreviewDraft<TId>;
  retainOnError?: boolean;
  cleanupUndelivered?: boolean;
  onFinalStarted?: () => void;
  onFinalDelivered?: () => void;
  onCleanupFailure?: (error: unknown) => void;
}): LivePreviewLifecycle<TPayload, TId>;
//#endregion
//#region src/channels/draft-stream-loop.d.ts
/** Throttled draft-stream sender used by channels that edit in-progress replies. */
type DraftStreamLoop<T = string> = {
  update: (value: T) => void;
  flush: () => Promise<void>;
  stop: () => void;
  resetPending: () => void;
  resetThrottleWindow: () => void;
  waitForInFlight: () => Promise<void>;
  /** Removes queued (not in-flight) text atomically and cancels its scheduled flush. */
  takePending?: () => T;
};
type CreatedDraftStreamLoop<T> = DraftStreamLoop<T> & {
  takePending: () => T;
};
/** Creates a single-flight draft stream loop that preserves the newest pending value. */
declare function createDraftStreamLoop<T = string>(params: {
  throttleMs: number;
  /** Keep background updates arriving during a send in the next throttle window. */
  coalesceInFlight?: boolean;
  isStopped: () => boolean;
  sendOrEditStreamMessage: (value: T) => Promise<void | boolean>;
  /** Empty sentinel and predicate for non-string payloads. */
  emptyValue?: T;
  isEmpty?: (value: T) => boolean;
  onBackgroundFlushError?: (err: unknown) => void;
}): CreatedDraftStreamLoop<T>;
//#endregion
//#region src/channels/draft-stream-controls.d.ts
/**
 * Mutable finalization flags shared by draft stream controls and channel adapters.
 */
type FinalizableDraftStreamState = {
  stopped: boolean;
  final: boolean;
};
type StopAndClearMessageIdParams<T> = {
  stopForClear: () => Promise<void>;
  readMessageId: () => T | undefined;
  clearMessageId: () => void;
};
type ClearFinalizableDraftMessageParams<T> = StopAndClearMessageIdParams<T> & {
  isValidMessageId: (value: unknown) => value is T;
  deleteMessage: (messageId: T) => Promise<boolean | void>;
  onDeleteFailure?: (messageId: T) => void;
  onDeleteSuccess?: (messageId: T) => void;
  warn?: (message: string) => void;
  warnPrefix: string;
};
type FinalizableDraftLifecycleParams<TMessageId, TUpdate = string> = Omit<ClearFinalizableDraftMessageParams<TMessageId>, "onDeleteFailure" | "stopForClear"> & {
  throttleMs: number;
  coalesceInFlight?: boolean;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (value: TUpdate) => Promise<void | boolean>;
  emptyValue?: TUpdate;
  isEmpty?: (value: TUpdate) => boolean;
};
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
declare function createFinalizableDraftStreamControls<T = string>(params: {
  throttleMs: number;
  coalesceInFlight?: boolean;
  isStopped: () => boolean;
  isFinal: () => boolean;
  markStopped: () => void;
  markFinal: () => void;
  sendOrEditStreamMessage: (value: T) => Promise<void | boolean>;
  emptyValue?: T;
  isEmpty?: (value: T) => boolean;
}): {
  loop: DraftStreamLoop<T> & {
    takePending: () => T;
  };
  update: (value: T) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Creates finalizable draft controls backed by a shared mutable state object.
 */
declare function createFinalizableDraftStreamControlsForState<T = string>(params: {
  throttleMs: number;
  coalesceInFlight?: boolean;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (value: T) => Promise<void | boolean>;
  emptyValue?: T;
  isEmpty?: (value: T) => boolean;
}): {
  loop: DraftStreamLoop<T> & {
    takePending: () => T;
  };
  update: (value: T) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Stops a draft stream, reads the current preview message id, then clears the stored id.
 */
declare function takeMessageIdAfterStop<T>(params: StopAndClearMessageIdParams<T>): Promise<T | undefined>;
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 * Claims the current id before deletion; stateful callers can retain failures through
 * onDeleteFailure without making overlapping clears delete the same message twice.
 */
declare function clearFinalizableDraftMessage<T>(params: ClearFinalizableDraftMessageParams<T>): Promise<void>;
/**
 * Builds the standard draft lifecycle used by channel streaming preview implementations.
 */
declare function createFinalizableDraftLifecycle<TMessageId, TUpdate = string>(params: FinalizableDraftLifecycleParams<TMessageId, TUpdate>): {
  loop: DraftStreamLoop<TUpdate> & {
    takePending: () => TUpdate;
  };
  update: (value: TUpdate) => void;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
  stop: () => Promise<void>;
  clear: () => Promise<void>;
  clearWithStop: (stopForClear: () => Promise<void>, messageIdOwner?: Pick<StopAndClearMessageIdParams<TMessageId>, "readMessageId" | "clearMessageId">) => Promise<void>;
  retire: (messageId: TMessageId, options?: {
    defer?: boolean;
  }) => Promise<void>;
  cleanupPending: (prepareCleanup?: () => void) => Promise<void>;
};
//#endregion
export { runPassiveAccountLifecycle as C, keepHttpServerTaskAlive as S, createRunStateMachine as T, ChannelRunQueue as _, createFinalizableDraftStreamControlsForState as a, createAccountStatusSink as b, createDraftStreamLoop as c, LivePreviewFinalizerResultKind as d, LivePreviewLifecycle as f, deliverWithFinalizableLivePreviewAdapter as g, defineFinalizableLivePreviewAdapter as h, createFinalizableDraftStreamControls as i, LivePreviewDeliveryResult as l, createPreviewMessageReceipt as m, clearFinalizableDraftMessage as n, takeMessageIdAfterStop as o, createLivePreviewLifecycle as p, createFinalizableDraftLifecycle as r, DraftStreamLoop as s, FinalizableDraftStreamState as t, LivePreviewFinalizerDraft as u, ChannelRunQueueParams as v, waitUntilAbort as w, createChannelRunQueue as x, ChannelRunQueueTaskContext as y };