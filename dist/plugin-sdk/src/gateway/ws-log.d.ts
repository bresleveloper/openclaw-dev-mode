/** Returns true when gateway WebSocket logging is enabled for the current console. */
export declare function shouldLogWs(): boolean;
/** Compacts long ids while keeping enough entropy for log correlation. */
export declare function shortId(value: string): string;
/** Formats and redacts arbitrary values before they are written to gateway logs. */
export declare function formatForLog(value: unknown): string;
/** Extracts small, non-sensitive fields from agent event payloads for WS logs. */
export declare function summarizeAgentEventForWsLog(payload: unknown): Record<string, unknown>;
export declare function logWs(direction: "in" | "out", kind: string, meta?: Record<string, unknown>): void;
