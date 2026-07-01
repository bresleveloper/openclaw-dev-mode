/** Server identity advertised by the local MCP loopback initialize response. */
export declare const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** Protocol-facing loopback server version, independent from the OpenClaw app version. */
export declare const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** MCP protocol versions accepted by the loopback HTTP bridge, newest first for negotiation. */
export declare const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS: readonly ["2025-03-26", "2024-11-05"];
type JsonRpcId = string | number | null | undefined;
/** Minimal JSON-RPC request shape accepted by the MCP loopback HTTP handler. */
export type JsonRpcRequest = {
    jsonrpc: "2.0";
    id?: JsonRpcId;
    method: string;
    params?: Record<string, unknown>;
};
/**
 * Builds a JSON-RPC success response, using null for notifications or malformed missing ids.
 */
export declare function jsonRpcResult(id: JsonRpcId, result: unknown): {
    jsonrpc: "2.0";
    id: string | number | null;
    result: unknown;
};
/**
 * Builds a JSON-RPC error response with the same id normalization as success responses.
 */
export declare function jsonRpcError(id: JsonRpcId, code: number, message: string): {
    jsonrpc: "2.0";
    id: string | number | null;
    error: {
        code: number;
        message: string;
    };
};
export {};
