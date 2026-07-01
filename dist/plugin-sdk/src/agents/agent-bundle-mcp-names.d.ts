export declare const TOOL_NAME_SEPARATOR = "__";
/** Sanitize one MCP server name and reserve it in the provided set. */
export declare function sanitizeServerName(raw: string, usedNames: Set<string>): string;
/** Normalizes reserved tool names for collision checks. */
export declare function normalizeReservedToolNames(names?: Iterable<string>): Set<string>;
/** Build a safe model-facing tool name from server and tool fragments. */
export declare function buildSafeToolName(params: {
    serverName: string;
    toolName: string;
    reservedNames: Set<string>;
}): string;
