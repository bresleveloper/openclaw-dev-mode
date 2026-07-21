import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { a as routeLogsToStderr } from "./console-DDSYsaep.js";
import { f as coerceChatContentText } from "./sanitize-user-facing-text-D-sR-1VY.js";
import { d as rewrapToolWithBeforeToolCallHook, p as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-Bn4cnw4c.js";
import { S as isToolWrappedWithBeforeToolCallHook } from "./gateway-CmPZGwyr.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//#region src/mcp/plugin-tools-handlers.ts
function toMcpContentBlock(block) {
	if (!isRecord(block)) return {
		type: "text",
		text: coerceChatContentText(block)
	};
	if (block.type !== "image") return block;
	if (typeof block.data === "string" && typeof block.mimeType === "string") return block;
	const source = block.source;
	if (isRecord(source) && source.type === "base64" && typeof source.data === "string" && typeof source.media_type === "string") return {
		type: "image",
		data: source.data,
		mimeType: source.media_type
	};
	return {
		type: "text",
		text: coerceChatContentText(block)
	};
}
function resolveJsonSchemaForTool(tool) {
	const params = tool.parameters;
	if (params && typeof params === "object" && "type" in params) return params;
	return {
		type: "object",
		properties: {}
	};
}
function createPluginToolsMcpHandlers(tools) {
	const wrappedTools = tools.map((tool) => {
		if (isToolWrappedWithBeforeToolCallHook(tool)) return rewrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
		return wrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
	});
	const toolMap = /* @__PURE__ */ new Map();
	for (const tool of wrappedTools) toolMap.set(tool.name, tool);
	return {
		listTools: async () => ({ tools: wrappedTools.map((tool) => ({
			name: tool.name,
			description: tool.description ?? "",
			inputSchema: resolveJsonSchemaForTool(tool)
		})) }),
		callTool: async (params, signal) => {
			const tool = toolMap.get(params.name);
			if (!tool) return {
				content: [{
					type: "text",
					text: `Unknown tool: ${params.name}`
				}],
				isError: true
			};
			try {
				const result = await tool.execute(`mcp-${Date.now()}`, params.arguments ?? {}, signal);
				const rawContent = result && typeof result === "object" && "content" in result ? result.content : result;
				return { content: Array.isArray(rawContent) ? rawContent.map(toMcpContentBlock) : [{
					type: "text",
					text: coerceChatContentText(rawContent)
				}] };
			} catch (err) {
				return {
					content: [{
						type: "text",
						text: `Tool error: ${formatErrorMessage(err)}`
					}],
					isError: true
				};
			}
		}
	};
}
//#endregion
//#region src/mcp/tools-stdio-server.ts
function createToolsMcpServer(params) {
	const handlers = createPluginToolsMcpHandlers(params.tools);
	const server = new Server({
		name: params.name,
		version: VERSION
	}, { capabilities: { tools: {} } });
	server.setRequestHandler(ListToolsRequestSchema, handlers.listTools);
	server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
		return await handlers.callTool(request.params, extra.signal);
	});
	return server;
}
async function connectToolsMcpServerToStdio(server) {
	routeLogsToStderr();
	const transport = new StdioServerTransport();
	let shuttingDown = false;
	const shutdown = () => {
		if (shuttingDown) return;
		shuttingDown = true;
		process.stdin.off("end", shutdown);
		process.stdin.off("close", shutdown);
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
		server.close();
	};
	process.stdin.once("end", shutdown);
	process.stdin.once("close", shutdown);
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	await server.connect(transport);
}
//#endregion
export { createToolsMcpServer as n, connectToolsMcpServerToStdio as t };
