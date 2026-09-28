import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DBMZPbPL.mjs";
import { et as consumeAdjustedParamsForToolCall, l as rewrapToolWithBeforeToolCallHook, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-Ub1aezaD.mjs";
import { t as coerceChatContentText } from "./chat-content-DNdfeXZh.mjs";
import { h as isToolWrappedWithBeforeToolCallHook, p as getBeforeToolCallHookContext } from "./agent-tool-metadata-COcr-3AD.mjs";
import { r as isToolResultError } from "./tool-result-error-CWadvCKd.mjs";
import { randomUUID } from "node:crypto";
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
	for (const tool of wrappedTools) toolMap.set(tool.name, {
		tool,
		runId: getBeforeToolCallHookContext(tool)?.runId
	});
	const automationsName = wrappedTools.find((tool) => isAutomationsToolName(tool.name))?.name;
	const automationsEntry = automationsName ? toolMap.get(automationsName) : void 0;
	return {
		listTools: async () => ({ tools: wrappedTools.map((tool) => ({
			name: tool.name,
			description: tool.description ?? "",
			inputSchema: resolveJsonSchemaForTool(tool)
		})) }),
		callTool: async (params, signal) => {
			const entry = toolMap.get(params.name) ?? (isAutomationsToolName(params.name) ? automationsEntry : void 0);
			if (!entry) return {
				content: [{
					type: "text",
					text: `Unknown tool: ${params.name}`
				}],
				isError: true
			};
			const toolCallId = `mcp-${randomUUID()}`;
			try {
				const result = await entry.tool.execute(toolCallId, params.arguments ?? {}, signal);
				const isError = isToolResultError(result);
				const rawContent = result && typeof result === "object" && "content" in result ? result.content : result;
				return {
					content: Array.isArray(rawContent) ? rawContent.map(toMcpContentBlock) : [{
						type: "text",
						text: coerceChatContentText(rawContent)
					}],
					...isError ? { isError: true } : {}
				};
			} catch (err) {
				return {
					content: [{
						type: "text",
						text: `Tool error: ${formatErrorMessage(err)}`
					}],
					isError: true
				};
			} finally {
				consumeAdjustedParamsForToolCall(toolCallId, entry.runId);
			}
		}
	};
}
//#endregion
export { createPluginToolsMcpHandlers as t };
