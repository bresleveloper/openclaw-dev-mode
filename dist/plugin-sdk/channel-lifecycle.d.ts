import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { C as runPassiveAccountLifecycle, S as keepHttpServerTaskAlive, T as createRunStateMachine, _ as ChannelRunQueue, a as createFinalizableDraftStreamControlsForState, b as createAccountStatusSink, c as createDraftStreamLoop, d as LivePreviewFinalizerResultKind, i as createFinalizableDraftStreamControls, n as clearFinalizableDraftMessage, o as takeMessageIdAfterStop, r as createFinalizableDraftLifecycle, s as DraftStreamLoop, t as FinalizableDraftStreamState, u as LivePreviewFinalizerDraft, v as ChannelRunQueueParams, w as waitUntilAbort, x as createChannelRunQueue, y as ChannelRunQueueTaskContext } from "../draft-stream-controls-Dx0I__Rw.js";
//#region src/channels/draft-preview-finalizer.d.ts
/**
 * @deprecated Use `LivePreviewFinalizerDraft` from `openclaw/plugin-sdk/channel-outbound`.
 */
export type DraftPreviewFinalizerDraft<TId> = LivePreviewFinalizerDraft<TId>;
/**
 * @deprecated Use `LivePreviewFinalizerResult` from `openclaw/plugin-sdk/channel-outbound`.
 */
export type DraftPreviewFinalizerResult = Exclude<LivePreviewFinalizerResultKind, "preview-retained">;
/**
 * @deprecated Use `deliverFinalizableLivePreview` from `openclaw/plugin-sdk/channel-outbound`.
 */
export declare function deliverFinalizableDraftPreview<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  draft?: DraftPreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onPreviewFinalized?: (id: TId) => Promise<void> | void;
  onNormalDelivered?: () => Promise<void> | void;
  logPreviewEditFailure?: (error: unknown) => void;
}): Promise<DraftPreviewFinalizerResult>;
//#endregion
//#region src/channels/transport/stall-watchdog.d.ts
type StallWatchdogTimeoutMeta = {
  idleMs: number;
  timeoutMs: number;
};
/** Public control surface for a transport stall watchdog instance. */
type ArmableStallWatchdog = {
  arm: (atMs?: number) => void;
  touch: (atMs?: number) => void;
  disarm: () => void;
  stop: () => void;
  isArmed: () => boolean;
};
/** Creates a watchdog that reports once when an armed transport goes idle. */
export declare function createArmableStallWatchdog(params: {
  label: string;
  timeoutMs: number;
  checkIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime?: RuntimeEnv;
  onTimeout: (meta: StallWatchdogTimeoutMeta) => void;
}): ArmableStallWatchdog;
//#endregion
export { type ArmableStallWatchdog, ChannelRunQueue, ChannelRunQueueParams, ChannelRunQueueTaskContext, DraftStreamLoop, FinalizableDraftStreamState, type StallWatchdogTimeoutMeta, clearFinalizableDraftMessage, createAccountStatusSink, createChannelRunQueue, createDraftStreamLoop, createFinalizableDraftLifecycle, createFinalizableDraftStreamControls, createFinalizableDraftStreamControlsForState, createRunStateMachine, keepHttpServerTaskAlive, runPassiveAccountLifecycle, takeMessageIdAfterStop, waitUntilAbort };