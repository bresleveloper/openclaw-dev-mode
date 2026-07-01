/**
 * Lifecycle callback state helpers for a single agent attempt.
 */
import type { AgentMessage } from "../runtime/index.js";
/** Mutable lifecycle flags observed while a single agent attempt runs. */
export type AgentAttemptLifecycleState = {
    currentTurnUserMessagePersisted: boolean;
    lifecycleError?: string;
    lifecycleFinishing: boolean;
    lifecycleEnded: boolean;
};
/** Event shape emitted by runtimes during an agent attempt. */
type AgentAttemptLifecycleEvent = {
    stream: string;
    data?: Record<string, unknown>;
    sessionKey?: string;
};
/** Creates callbacks that update lifecycle flags for persistence decisions. */
export declare function createAgentAttemptLifecycleCallbacks(state: AgentAttemptLifecycleState): {
    onUserMessagePersisted: (message: Extract<AgentMessage, {
        role: "user";
    }>) => void;
    onAgentEvent: (evt: AgentAttemptLifecycleEvent) => void;
};
export {};
