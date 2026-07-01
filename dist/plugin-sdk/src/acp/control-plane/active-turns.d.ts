/** Marks a session as currently running an ACP turn. */
export declare function markAcpTurnActive(sessionKey: string): void;
/** Clears the active-turn marker for a session. */
export declare function clearAcpTurnActive(sessionKey: string): void;
/** Returns whether the process currently owns an in-flight ACP turn for a session. */
export declare function isAcpTurnActive(sessionKey: string): boolean;
/** Clears active-turn state for isolated tests. */
export declare function resetAcpActiveTurnsForTests(): void;
