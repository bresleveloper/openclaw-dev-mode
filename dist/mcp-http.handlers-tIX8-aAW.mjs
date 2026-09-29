import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DBMZPbPL.mjs";
import { x as runBeforeToolCallHook } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { l as copyInternalToolResultState } from "./internal-hooks-DUPhyX-W.mjs";
import { a as protectNetworkToolExecutionError, l as resolveToolExecutionErrorKind, n as formatToolExecutionErrorMessage, u as resolveToolResultFailureKind } from "./tool-result-error-CWadvCKd.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-BzSlbw21.mjs";
import { i as extractToolErrorMessage } from "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import { n as readMcpLoopbackToolName } from "./mcp-http.schema-BZBf_SU-.mjs";
import { a as jsonRpcResult, i as jsonRpcError, n as MCP_LOOPBACK_SERVER_VERSION, r as MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS, t as MCP_LOOPBACK_SERVER_NAME } from "./mcp-http.protocol-DlFNaqVL.mjs";
import crypto from "node:crypto";
import { ContentBlockSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/gateway/mcp-http.handlers.ts
function stringifyMcpContent(value) {
	return typeof value === "string" ? value : JSON.stringify(value) ?? String(value);
}
const MCP_LOOPBACK_CONTENT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"image",
	"resource"
]);
function normalizeToolCallContent(result) {
	const content = result?.content;
	if (Array.isArray(content)) return content.map((block) => {
		const parsed = ContentBlockSchema.safeParse(block);
		if (parsed.success && MCP_LOOPBACK_CONTENT_TYPES.has(parsed.data.type)) return parsed.data;
		return {
			type: "text",
			text: stringifyMcpContent(block)
		};
	});
	return [{
		type: "text",
		text: stringifyMcpContent(result)
	}];
}
/** Handles one MCP loopback JSON-RPC message and returns a response or notification null. */
async function handleMcpJsonRpc(params) {
	const { id, method, params: methodParams } = params.message;
	switch (method) {
		case "initialize": {
			const clientVersion = methodParams?.protocolVersion ?? "";
			const negotiated = MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS.find((version) => version === clientVersion) ?? MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS[0];
			return jsonRpcResult(id, {
				protocolVersion: negotiated,
				capabilities: { tools: {} },
				serverInfo: {
					name: MCP_LOOPBACK_SERVER_NAME,
					version: MCP_LOOPBACK_SERVER_VERSION
				}
			});
		}
		case "notifications/initialized":
		case "notifications/cancelled": return null;
		case "tools/list": return jsonRpcResult(id, { tools: params.toolSchema });
		case "tools/call": {
			const requestedToolName = typeof methodParams?.name === "string" ? methodParams.name.trim() : "";
			const toolName = !params.toolSchema.some((tool) => tool.name === requestedToolName) && isAutomationsToolName(requestedToolName) ? params.toolSchema.find((tool) => isAutomationsToolName(tool.name))?.name ?? requestedToolName : requestedToolName;
			const rawToolArgs = methodParams?.arguments;
			if (rawToolArgs !== void 0 && !isRecord(rawToolArgs)) return jsonRpcError(id, -32602, "Invalid params: tools/call arguments must be an object");
			const toolArgs = rawToolArgs ?? {};
			if (!toolName) return jsonRpcResult(id, {
				content: [{
					type: "text",
					text: "Tool not available: unknown"
				}],
				isError: true
			});
			if (!params.toolSchema.some((tool) => tool.name === toolName)) return jsonRpcResult(id, {
				content: [{
					type: "text",
					text: `Tool not available: ${toolName}`
				}],
				isError: true
			});
			const tool = params.tools.find((candidate) => readMcpLoopbackToolName(candidate) === toolName);
			if (!tool) return jsonRpcResult(id, {
				content: [{
					type: "text",
					text: `Tool not available: ${toolName}`
				}],
				isError: true
			});
			const toolCallId = `mcp-${crypto.randomUUID()}`;
			const startedAt = Date.now();
			let executedToolArgs = toolArgs;
			const reportToolCallResult = (outcome, result, error) => {
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId,
					runId: params.hookContext?.runId,
					agentId: params.hookContext?.agentId,
					sessionId: params.hookContext?.sessionId,
					sessionKey: params.hookContext?.sessionKey,
					channelId: params.hookContext?.channelId,
					startArgs: executedToolArgs,
					result,
					error,
					startedAt
				}).catch(() => {});
				try {
					params.onToolCallResult?.({
						toolName,
						args: executedToolArgs,
						...outcome
					});
				} catch {}
			};
			try {
				const preparedToolArgs = tool.prepareBeforeToolCallParams ? await tool.prepareBeforeToolCallParams(toolArgs, {
					toolCallId,
					hookContext: params.hookContext,
					signal: params.signal
				}) : toolArgs;
				executedToolArgs = preparedToolArgs;
				const hookResult = await runBeforeToolCallHook({
					toolName,
					params: preparedToolArgs,
					toolCallId,
					ctx: params.hookContext,
					signal: params.signal
				});
				if (hookResult.blocked) {
					const disposition = hookResult.kind === "failure" ? hookResult.disposition : "blocked";
					reportToolCallResult(disposition === "blocked" ? {
						outcome: disposition,
						deniedReason: hookResult.deniedReason ?? "plugin-before-tool-call"
					} : { outcome: disposition }, hookResult.reason, hookResult.reason);
					return jsonRpcResult(id, {
						content: [{
							type: "text",
							text: hookResult.reason
						}],
						isError: true
					});
				}
				const finalizedToolArgs = tool.finalizeBeforeToolCallParams?.(hookResult.params, preparedToolArgs) ?? hookResult.params;
				executedToolArgs = finalizedToolArgs;
				try {
					params.onToolCallPrepared?.({
						toolName,
						args: executedToolArgs
					});
				} catch {}
				if (params.authorizeToolCall && !params.authorizeToolCall()) {
					reportToolCallResult({
						outcome: "blocked",
						deniedReason: "client-grant-revoked"
					}, void 0, "Tool call authorization expired");
					return jsonRpcResult(id, {
						content: [{
							type: "text",
							text: "Tool call authorization expired"
						}],
						isError: true
					});
				}
				let result;
				try {
					result = await tool.execute(toolCallId, finalizedToolArgs, params.signal);
				} catch (error) {
					throw tool.resultContentSource === "network" ? protectNetworkToolExecutionError(error, "tool execution failed", params.signal) : error;
				}
				const failureKind = resolveToolResultFailureKind(result);
				reportToolCallResult(failureKind === "blocked" ? {
					outcome: "blocked",
					deniedReason: "tool_result_blocked"
				} : {
					outcome: failureKind ?? "completed",
					result
				}, result, failureKind ? extractToolErrorMessage(result) ?? "Tool execution failed" : void 0);
				return copyInternalToolResultState(result, jsonRpcResult(id, {
					content: normalizeToolCallContent(result),
					isError: failureKind !== void 0
				}));
			} catch (error) {
				const message = formatToolExecutionErrorMessage(error, "tool execution failed");
				reportToolCallResult({
					outcome: params.signal?.aborted ? "unknown" : resolveToolExecutionErrorKind(error),
					result: error
				}, error, message);
				return jsonRpcResult(id, {
					content: [{
						type: "text",
						text: message || "tool execution failed"
					}],
					isError: true
				});
			}
		}
		default: return jsonRpcError(id, -32601, `Method not found: ${method}`);
	}
}
//#endregion
export { handleMcpJsonRpc };
