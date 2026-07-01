/** Returns true when an assistant message requested the sessions_yield tool. */
export declare function assistantCallsSessionsYield(message: unknown): boolean;
/** Returns true when a tool result represents a completed sessions_yield handoff. */
export declare function isSessionsYieldToolResult(message: unknown, previousAssistantCalledYield: boolean): boolean;
