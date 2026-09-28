import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
//#region src/auto-reply/inbound-debounce.d.ts
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
declare function resolveInboundDebounceMs(params: {
  cfg: OpenClawConfig;
  channel: string;
  overrideMs?: number;
}): number;
/** A flush releases its debounce lane at admission while completion remains drainable. */
type InboundDebounceFlush = {
  admission: Promise<void>;
  completion: Promise<void>;
};
type InboundDebounceAdmissionLifecycleInput = {
  abortSignal?: AbortSignal;
  onAdopted?: () => void | Promise<void>;
  onDeferred?: () => boolean | void;
  onDeferredHeartbeat?: () => void;
  deferredHeartbeatIntervalMs?: number;
  onAdoptionFinalizing?: () => void;
  onFailed?: (error: unknown) => void | Promise<void>;
  onAbandoned?: () => void | Promise<void>;
};
/** Lifecycle shape passed to a channel dispatch so it can signal session-lane admission. */
type InboundDebounceAdmissionLifecycle = {
  abortSignal: AbortSignal;
  onAdopted: () => Promise<void>;
  onDeferred: () => boolean | void;
  onDeferredHeartbeat?: () => void;
  deferredHeartbeatIntervalMs?: number;
  onAdoptionFinalizing: () => void;
  onFailed?: (error: unknown) => Promise<void>;
  onAbandoned: () => Promise<void>;
};
/**
 * Start one flush and bind its admission signal to the turn lifecycle.
 * Completion also releases admission for gated work that never enters a session lane.
 */
declare function createInboundDebounceFlush(params: {
  lifecycle?: InboundDebounceAdmissionLifecycleInput;
  dispatch: (lifecycle: InboundDebounceAdmissionLifecycle) => Promise<void>;
}): InboundDebounceFlush;
/** Options for creating a keyed inbound debouncer. */
type InboundDebounceCreateParams<T> = {
  debounceMs: number;
  maxTrackedKeys?: number;
  maxWaitMs?: number | ((item: T) => number | undefined);
  buildKey: (item: T) => string | null | undefined;
  shouldDebounce?: (item: T) => boolean;
  resolveDebounceMs?: (item: T, pending?: readonly T[]) => number | undefined;
  canAppend?: (item: T, pending: readonly T[]) => boolean;
  serializeImmediate?: boolean;
  onFlush: (items: T[], createFlush: typeof createInboundDebounceFlush) => InboundDebounceFlush;
  onError?: (err: unknown, items: T[]) => void;
  onCancel?: (items: T[]) => void;
};
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
declare function createInboundDebouncer<T>(params: InboundDebounceCreateParams<T>): {
  enqueue: (item: T) => Promise<void>;
  shouldBuffer: (item: T) => boolean;
  flushKey: (key: string) => Promise<void>;
  cancelKey: (key: string) => boolean;
  drain: () => Promise<void>;
};
//#endregion
export { createInboundDebouncer as n, resolveInboundDebounceMs as r, InboundDebounceCreateParams as t };