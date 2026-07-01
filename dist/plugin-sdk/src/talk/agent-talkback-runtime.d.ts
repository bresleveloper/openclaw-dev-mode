/**
 * Debounced realtime voice talkback queue for delegated OpenClaw consults.
 *
 * Transcript fragments can arrive quickly while one consult is already running;
 * this queue batches compatible fragments, runs consults serially, and aborts
 * cleanly when the voice session closes.
 */
import type { RuntimeLogger } from "../plugins/runtime/types-core.js";
/** Text produced by a delegated voice consult. */
export type RealtimeVoiceAgentTalkbackResult = {
    text: string;
};
/** Minimal queue API owned by a realtime voice session. */
export type RealtimeVoiceAgentTalkbackQueue = {
    close(): void;
    enqueue(question: string, metadata?: unknown): void;
};
/** Runtime dependencies and policy knobs for the talkback queue. */
export type RealtimeVoiceAgentTalkbackQueueParams = {
    /** Delay used to merge nearby transcript fragments into one consult. */
    debounceMs: number;
    isStopped: () => boolean;
    logger: Pick<RuntimeLogger, "info" | "warn">;
    logPrefix: string;
    responseStyle: string;
    fallbackText: string;
    /** Delegates a batched question to OpenClaw and respects the abort signal. */
    consult: (args: {
        question: string;
        metadata?: unknown;
        responseStyle: string;
        signal: AbortSignal;
    }) => Promise<RealtimeVoiceAgentTalkbackResult>;
    /** Delivers final speakable text back to the realtime provider/session. */
    deliver: (text: string) => void;
};
/** Create a serial consult queue for realtime transcript talkback. */
export declare function createRealtimeVoiceAgentTalkbackQueue(params: RealtimeVoiceAgentTalkbackQueueParams): RealtimeVoiceAgentTalkbackQueue;
