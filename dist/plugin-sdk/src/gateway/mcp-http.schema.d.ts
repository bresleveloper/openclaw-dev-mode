import { resolveGatewayScopedTools } from "./tool-resolution.js";
export type McpLoopbackTool = ReturnType<typeof resolveGatewayScopedTools>["tools"][number];
/** MCP tools/list schema entry derived from a gateway loopback tool. */
export type McpToolSchemaEntry = {
    name: string;
    description: string | undefined;
    inputSchema: Record<string, unknown>;
};
/** Safely reads and normalizes a loopback tool name from plugin-provided tool objects. */
export declare function readMcpLoopbackToolName(tool: McpLoopbackTool): string | undefined;
/** Builds MCP-compatible tool schemas for loopback-visible gateway tools. */
export declare function buildMcpToolSchema(tools: McpLoopbackTool[]): McpToolSchemaEntry[];
