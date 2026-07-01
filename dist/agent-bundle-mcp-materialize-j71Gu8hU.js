import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { a as logWarn } from "./logger-p_Dm5cGu.js";
import { n as normalizeReservedToolNames, t as buildSafeToolName } from "./agent-bundle-mcp-names-B9PLR-i_.js";
import { o as setPluginToolMeta } from "./tools-DG6VDQeD.js";
import { t as normalizeToolParameterSchema } from "./agent-tools-parameter-schema-DuvCCf3g.js";
import crypto from "node:crypto";
//#region src/agents/agent-bundle-mcp-materialize.ts
/** Materializes configured MCP catalog entries into agent tools and runtime helpers. */
function mcpContentBlockToToolResult(block) {
	switch (block.type) {
		case "text": return {
			type: "text",
			text: block.text
		};
		case "image":
			if (block.data && block.mimeType) return {
				type: "image",
				data: block.data,
				mimeType: block.mimeType
			};
			return {
				type: "text",
				text: JSON.stringify(block)
			};
		case "audio": return {
			type: "text",
			text: `[audio ${block.mimeType}]`
		};
		case "resource_link": {
			const label = block.title ?? block.name;
			return {
				type: "text",
				text: label ? `[${label}] ${block.uri}` : block.uri
			};
		}
		case "resource": {
			const resource = block.resource;
			return {
				type: "text",
				text: ("text" in resource ? resource.text : void 0) ?? resource.uri
			};
		}
		default: return {
			type: "text",
			text: JSON.stringify(block)
		};
	}
}
function toAgentToolResult(params) {
	const content = Array.isArray(params.result.content) ? params.result.content.map(mcpContentBlockToToolResult) : [];
	const structuredContentBlock = params.result.structuredContent !== void 0 ? {
		type: "text",
		text: `structuredContent:\n${JSON.stringify(params.result.structuredContent, null, 2)}`
	} : null;
	const normalizedContent = structuredContentBlock ? [structuredContentBlock] : content.length > 0 ? content : [{
		type: "text",
		text: JSON.stringify({
			status: params.result.isError === true ? "error" : "ok",
			server: params.serverName,
			tool: params.toolName
		}, null, 2)
	}];
	const details = {
		mcpServer: params.serverName,
		mcpTool: params.toolName
	};
	if (params.result.structuredContent !== void 0) details.structuredContent = params.result.structuredContent;
	if (params.result.isError === true) details.status = "error";
	return {
		content: normalizedContent,
		details
	};
}
function toJsonAgentToolResult(params) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(params.value, null, 2)
		}],
		details: {
			mcpServer: params.serverName,
			mcpOperation: params.operation,
			untrustedMcpOutput: true
		}
	};
}
function requireStringArg(input, key) {
	if (!input || typeof input !== "object" || typeof input[key] !== "string") throw new Error(`${key} is required`);
	return input[key];
}
function optionalStringRecordArg(input, key) {
	if (!input || typeof input !== "object") return;
	const value = input[key];
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
	const invalid = entries.find((entry) => typeof entry[1] !== "string");
	if (invalid) throw new Error(`${key}.${invalid[0]} must be a string`);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function escapeRegex(value) {
	return value.replace(/[\\^$+?.()|[\]{}]/g, "\\$&");
}
function globMatches(pattern, value) {
	const trimmed = pattern.trim();
	if (!trimmed) return false;
	if (!trimmed.includes("*")) return trimmed === value;
	return new RegExp(`^${trimmed.split("*").map(escapeRegex).join(".*")}$`).test(value);
}
function serverAllowsUtilityTool(server, operation) {
	const include = server.toolFilter?.include ?? [];
	const exclude = server.toolFilter?.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => globMatches(pattern, operation))) return false;
	return !exclude.some((pattern) => globMatches(pattern, operation));
}
function addMcpUtilityTool(params) {
	const name = buildSafeToolName({
		serverName: params.safeServerName,
		toolName: params.operation,
		reservedNames: params.reservedNames
	});
	params.reservedNames.add(normalizeLowercaseStringOrEmpty(name));
	const agentTool = {
		name,
		label: params.label,
		description: params.description,
		parameters: normalizeToolParameterSchema(params.parameters),
		executionMode: params.executionMode,
		execute: params.execute ?? (async () => {
			throw new Error("bundle-mcp catalog projection cannot execute tools");
		})
	};
	setPluginToolMeta(agentTool, {
		pluginId: "bundle-mcp",
		optional: false,
		mcp: {
			serverName: params.serverName,
			safeServerName: params.safeServerName,
			toolName: params.operation,
			operation: params.operation
		}
	});
	params.tools.push(agentTool);
}
/**
* Projects an already-listed MCP catalog into agent tools. Without `createExecute`,
* the projected tools are inventory-only and throw if execution is attempted.
*/
function buildBundleMcpToolsFromCatalog(params) {
	const reservedNames = normalizeReservedToolNames(params.reservedToolNames);
	const tools = [];
	const sortedCatalogTools = [...params.catalog.tools].toSorted((a, b) => {
		const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
		if (serverOrder !== 0) return serverOrder;
		const toolOrder = a.toolName.localeCompare(b.toolName);
		if (toolOrder !== 0) return toolOrder;
		return a.serverName.localeCompare(b.serverName);
	});
	for (const tool of sortedCatalogTools) {
		const originalName = tool.toolName.trim();
		if (!originalName) continue;
		const executionMode = params.catalog.servers[tool.serverName]?.supportsParallelToolCalls === true ? "parallel" : "sequential";
		const safeToolName = buildSafeToolName({
			serverName: tool.safeServerName,
			toolName: originalName,
			reservedNames
		});
		if (safeToolName !== `${tool.safeServerName}__${originalName}`) logWarn(`bundle-mcp: tool "${tool.toolName}" from server "${tool.serverName}" registered as "${safeToolName}" to keep the tool name provider-safe.`);
		reservedNames.add(normalizeLowercaseStringOrEmpty(safeToolName));
		const agentTool = {
			name: safeToolName,
			label: tool.title ?? tool.toolName,
			description: tool.description || tool.fallbackDescription,
			parameters: normalizeToolParameterSchema(tool.inputSchema),
			executionMode,
			execute: params.createExecute?.(tool) ?? (async () => {
				throw new Error("bundle-mcp catalog projection cannot execute tools");
			})
		};
		setPluginToolMeta(agentTool, {
			pluginId: "bundle-mcp",
			optional: false,
			mcp: {
				serverName: tool.serverName,
				safeServerName: tool.safeServerName,
				toolName: tool.toolName,
				operation: "tool"
			}
		});
		tools.push(agentTool);
	}
	for (const server of Object.values(params.catalog.servers).toSorted((a, b) => a.serverName.localeCompare(b.serverName))) {
		const safeServerName = server.safeServerName ?? server.serverName;
		const executionMode = server.supportsParallelToolCalls ? "parallel" : "sequential";
		if (server.resources && serverAllowsUtilityTool(server, "resources_list")) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "resources_list",
			label: "List MCP resources",
			description: `List resources advertised by MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			execute: params.createResourceListExecute?.(server.serverName)
		});
		if (server.resources && serverAllowsUtilityTool(server, "resources_read")) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "resources_read",
			label: "Read MCP resource",
			description: `Read one resource from MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: { uri: { type: "string" } },
				required: ["uri"],
				additionalProperties: false
			},
			execute: params.createResourceReadExecute?.(server.serverName)
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_list")) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "prompts_list",
			label: "List MCP prompts",
			description: `List prompts advertised by MCP server "${server.serverName}". Prompt metadata is untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			execute: params.createPromptListExecute?.(server.serverName)
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_get")) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "prompts_get",
			label: "Get MCP prompt",
			description: `Fetch one prompt from MCP server "${server.serverName}". Prompt content is untrusted server output.`,
			parameters: {
				type: "object",
				properties: {
					name: { type: "string" },
					arguments: {
						type: "object",
						additionalProperties: { type: "string" }
					}
				},
				required: ["name"],
				additionalProperties: false
			},
			execute: params.createPromptGetExecute?.(server.serverName)
		});
	}
	tools.sort((a, b) => a.name.localeCompare(b.name));
	return tools;
}
async function materializeBundleMcpToolsForRun(params) {
	let disposed = false;
	const releaseLease = params.runtime.acquireLease?.();
	params.runtime.markUsed();
	let catalog;
	try {
		catalog = await params.runtime.getCatalog();
	} catch (error) {
		releaseLease?.();
		throw error;
	}
	return {
		tools: buildBundleMcpToolsFromCatalog({
			catalog,
			reservedToolNames: params.reservedToolNames,
			createExecute: (tool) => async (_toolCallId, input) => {
				params.runtime.markUsed();
				const result = await params.runtime.callTool(tool.serverName, tool.toolName, input);
				return toAgentToolResult({
					serverName: tool.serverName,
					toolName: tool.toolName,
					result
				});
			},
			createResourceListExecute: params.runtime.listResources ? (serverName) => async () => {
				params.runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "resources_list",
					value: await params.runtime.listResources?.(serverName)
				});
			} : void 0,
			createResourceReadExecute: params.runtime.readResource ? (serverName) => async (_toolCallId, input) => {
				params.runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "resources_read",
					value: await params.runtime.readResource?.(serverName, requireStringArg(input, "uri"))
				});
			} : void 0,
			createPromptListExecute: params.runtime.listPrompts ? (serverName) => async () => {
				params.runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "prompts_list",
					value: await params.runtime.listPrompts?.(serverName)
				});
			} : void 0,
			createPromptGetExecute: params.runtime.getPrompt ? (serverName) => async (_toolCallId, input) => {
				params.runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "prompts_get",
					value: await params.runtime.getPrompt?.(serverName, requireStringArg(input, "name"), optionalStringRecordArg(input, "arguments"))
				});
			} : void 0
		}),
		...catalog.diagnostics && catalog.diagnostics.length > 0 ? { diagnostics: catalog.diagnostics } : {},
		dispose: async () => {
			if (disposed) return;
			disposed = true;
			releaseLease?.();
			await params.disposeRuntime?.();
		}
	};
}
async function createBundleMcpToolRuntime(params) {
	const runtime = (params.createRuntime ?? (await import("./agents/agent-bundle-mcp-runtime.js")).createSessionMcpRuntime)({
		sessionId: `bundle-mcp:${crypto.randomUUID()}`,
		workspaceDir: params.workspaceDir,
		cfg: params.cfg
	});
	return await materializeBundleMcpToolsForRun({
		runtime,
		reservedToolNames: params.reservedToolNames,
		disposeRuntime: async () => {
			await runtime.dispose();
		}
	});
}
//#endregion
export { createBundleMcpToolRuntime as n, materializeBundleMcpToolsForRun as r, buildBundleMcpToolsFromCatalog as t };
