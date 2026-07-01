import { type HookContext } from "../agents/agent-tools.before-tool-call.js";
import { type JsonRpcRequest } from "./mcp-http.protocol.js";
import { type McpLoopbackTool, type McpToolSchemaEntry } from "./mcp-http.schema.js";
/** Handles one MCP loopback JSON-RPC message and returns a response or notification null. */
export declare function handleMcpJsonRpc(params: {
    message: JsonRpcRequest;
    tools: McpLoopbackTool[];
    toolSchema: McpToolSchemaEntry[];
    hookContext?: HookContext;
    signal?: AbortSignal;
    onToolCallResult?: (call: {
        toolName: string;
        args: Record<string, unknown>;
        result?: unknown;
        isError: boolean;
    }) => void;
    onToolCallPrepared?: (call: {
        toolName: string;
        args: Record<string, unknown>;
    }) => void;
}): Promise<object | null>;
