/**
 * Minimal active-session surface needed to steer a running attempt and observe
 * whether the queued user message reached the transcript.
 */
export type EmbeddedAgentActiveSessionSteerTarget = {
    agent?: unknown;
    getSteeringMessages?(): readonly string[];
    steer(text: string): Promise<void>;
    subscribe(listener: (event: unknown) => void): () => void;
};
/**
 * Removes one pending steered user message from both the runtime queue and UI
 * steering list. This targets the exact text so unrelated queued messages keep
 * their payloads and ordering.
 */
export declare function cancelQueuedSteeringMessage(activeSession: EmbeddedAgentActiveSessionSteerTarget, text: string): Promise<boolean>;
/**
 * Sends a steering message and resolves only after the matching user
 * `message_end` event appears. If the run ends or times out first, the pending
 * queue entry is removed so an abandoned steer does not leak into a later turn.
 */
export declare function steerAndWaitForTranscriptCommit(activeSession: EmbeddedAgentActiveSessionSteerTarget, text: string, timeoutMs: number): Promise<void>;
/**
 * Steers the active session directly or waits for transcript commitment when a
 * caller needs delivery proof before returning.
 */
export declare function steerActiveSessionWithOptionalDeliveryWait(activeSession: EmbeddedAgentActiveSessionSteerTarget, text: string, options: {
    deliveryTimeoutMs?: number;
    waitForTranscriptCommit?: boolean;
} | undefined): Promise<void>;
