/**
 * Canonical event names emitted by Talk sessions across realtime and STT/TTS flows.
 */
export declare const TALK_EVENT_TYPES: readonly ["session.started", "session.ready", "session.closed", "session.error", "session.replaced", "turn.started", "turn.ended", "turn.cancelled", "capture.started", "capture.stopped", "capture.cancelled", "capture.once", "input.audio.delta", "input.audio.committed", "transcript.delta", "transcript.done", "output.text.delta", "output.text.done", "output.audio.started", "output.audio.delta", "output.audio.done", "tool.call", "tool.progress", "tool.result", "tool.error", "usage.metrics", "latency.metrics", "health.changed"];
/**
 * Talk event name accepted by the event sequencer.
 */
export type TalkEventType = (typeof TALK_EVENT_TYPES)[number];
/**
 * High-level media mode used to group Talk session telemetry.
 */
export type TalkMode = "realtime" | "stt-tts" | "transcription";
/**
 * Transport family carrying Talk audio and session control.
 */
export type TalkTransport = "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
/**
 * Brain mode that explains whether Talk output is agent-mediated, tool-only, or passive.
 */
export type TalkBrain = "agent-consult" | "direct-tools" | "none";
/**
 * Session-level correlation fields copied onto every Talk event.
 */
export type TalkEventContext = {
    sessionId: string;
    mode: TalkMode;
    transport: TalkTransport;
    brain: TalkBrain;
    provider?: string;
};
/**
 * Sequenced Talk event envelope delivered to observers and gateway clients.
 */
export type TalkEvent<TPayload = unknown> = TalkEventContext & {
    id: string;
    type: TalkEventType;
    turnId?: string;
    captureId?: string;
    seq: number;
    timestamp: string;
    final?: boolean;
    callId?: string;
    itemId?: string;
    parentId?: string;
    payload: TPayload;
};
/**
 * Caller-supplied event payload before session context, id, sequence, and timestamp are attached.
 */
export type TalkEventInput<TPayload = unknown> = {
    type: TalkEventType;
    payload: TPayload;
    turnId?: string;
    captureId?: string;
    timestamp?: string;
    final?: boolean;
    callId?: string;
    itemId?: string;
    parentId?: string;
};
/**
 * Per-session event sequencer that enforces correlation ids before emitting events.
 */
export type TalkEventSequencer = {
    next<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
};
/**
 * Creates a sequencer that stamps Talk events with stable session context and monotonic ids.
 */
export declare function createTalkEventSequencer(context: TalkEventContext, options?: {
    now?: () => Date | string;
}): TalkEventSequencer;
