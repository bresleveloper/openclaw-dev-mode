import { m as getDefaultAiTransportHost } from "../host-CNOUExXM.mjs";
/** Runtime transport owner attached to retained provider resources. */
export type SessionResourceOwner = ReturnType<typeof getDefaultAiTransportHost>;
/** Cleanup callback for resources tied to an LLM session or all sessions. */
export type SessionResourceCleanup = (sessionId?: string, owner?: SessionResourceOwner) => void;
/** Returns a process-local key that keeps retained resources separated by runtime owner. */
export declare function getSessionResourceOwnerId(owner: SessionResourceOwner): number;
/** Registers a session-resource cleanup hook and returns an unregister function. */
export declare function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void;
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
export declare function cleanupSessionResources(sessionId?: string, owner?: SessionResourceOwner): void;