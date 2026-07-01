/** Session lifecycle event broadcast to observers when a session is created or linked. */
export type SessionLifecycleEvent = {
    sessionKey: string;
    reason: string;
    parentSessionKey?: string;
    label?: string;
    displayName?: string;
};
type SessionLifecycleListener = (event: SessionLifecycleEvent) => void;
/** Registers a session lifecycle listener. */
export declare function onSessionLifecycleEvent(listener: SessionLifecycleListener): () => void;
/** Emits a best-effort session lifecycle event to all listeners. */
export declare function emitSessionLifecycleEvent(event: SessionLifecycleEvent): void;
export {};
