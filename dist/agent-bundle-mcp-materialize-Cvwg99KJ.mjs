import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as buildSafeToolName, r as normalizeReservedToolNames } from "./agent-bundle-mcp-names-38ksiKnf.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { o as getSessionMcpRequestSignal, s as runWithSessionMcpRequestSignal } from "./mcp-app-model-context-nV9u20zq.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { n as mergeMcpConnectCatalog } from "./agent-bundle-mcp-requester-connect-6RTPH5wa.mjs";
import { t as isMcpToolAllowed } from "./mcp-tool-filter-BFjsm6Nl.mjs";
import { a as setPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { a as setMcpCodeModeGuestResultFromAgentResult, i as setMcpCodeModeGuestResult, n as projectMcpCallToolResult, r as projectMcpGetPromptResult, s as toToolSearchJsonSafe } from "./mcp-content-BHUhnILn.mjs";
import { n as buildMcpAppCanvasPayload, r as fetchMcpAppView } from "./mcp-ui-resource-CANSsmIF.mjs";
import crypto from "node:crypto";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/tool-schema";
//#region src/agents/agent-bundle-mcp-materialize.ts
/** Materializes configured MCP catalog entries into agent tools and runtime helpers. */
function isAppOnlyTool(tool) {
	return tool.uiVisibility !== void 0 && !tool.uiVisibility.includes("model");
}
function buildAppToolPolicyProjections(params) {
	const tools = params.modelTools.filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	const reservedNames = normalizeReservedToolNames([...params.reservedToolNames ?? [], ...params.modelTools.map((tool) => tool.name)]);
	const appOnlyTools = params.catalog.tools.filter(isAppOnlyTool).toSorted((a, b) => {
		return a.safeServerName.localeCompare(b.safeServerName) || a.toolName.localeCompare(b.toolName);
	});
	for (const tool of appOnlyTools) {
		const server = params.catalog.servers[tool.serverName];
		const name = buildSafeToolName({
			serverName: tool.safeServerName,
			toolName: tool.toolName,
			reservedNames
		});
		reservedNames.add(normalizeLowercaseStringOrEmpty(name));
		const projection = {
			name,
			label: tool.title ?? tool.toolName,
			description: tool.description || tool.fallbackDescription,
			parameters: normalizeToolParameterSchema(tool.inputSchema),
			execute: async () => {
				throw new Error("MCP App policy projections cannot execute tools");
			}
		};
		setPluginToolMeta(projection, {
			pluginId: "bundle-mcp",
			optional: false,
			mcp: {
				serverName: tool.serverName,
				safeServerName: tool.safeServerName,
				toolName: tool.toolName,
				operation: "tool",
				codexApproval: {
					mode: server?.codexApprovalMode,
					...tool.codexAnnotations ? { annotations: tool.codexAnnotations } : {}
				}
			}
		});
		tools.push(projection);
	}
	return tools.toSorted((a, b) => a.name.localeCompare(b.name));
}
function toJsonAgentToolResult(params) {
	const publicValue = toToolSearchJsonSafe(params.operation === "resources_list" && Array.isArray(params.value) ? { resources: params.value } : params.operation === "prompts_list" && Array.isArray(params.value) ? { prompts: params.value } : params.value);
	if (isRecord(publicValue)) delete publicValue._meta;
	const result = {
		content: [{
			type: "text",
			text: JSON.stringify(publicValue, null, 2)
		}],
		details: {
			mcpServer: params.serverName,
			mcpOperation: params.operation,
			untrustedMcpOutput: true
		}
	};
	return setMcpCodeModeGuestResult(result, publicValue);
}
function requireStringArg(input, key) {
	if (!isRecord(input)) throw new Error(`${key} is required`);
	const value = input[key];
	if (typeof value !== "string") throw new Error(`${key} is required`);
	return value;
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
function serverAllowsUtilityTool(server, operation, sessionDeniedOnly) {
	if (server.deniedToolNames?.includes(operation) === true !== sessionDeniedOnly) return false;
	return isMcpToolAllowed(server.toolFilter, operation);
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
		...params.execute ? { resultContentSource: "network" } : {},
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
			operation: params.operation,
			...params.deniedBySession ? { deniedBySession: true } : {}
		}
	});
	params.tools.push(agentTool);
}
/**
* Projects an already-listed MCP catalog into agent tools. Without `createExecute`,
* the projected tools are inventory-only and throw if execution is attempted.
*/
function buildBundleMcpToolsFromCatalog(params) {
	const initialReservedNames = normalizeReservedToolNames(params.reservedToolNames);
	const sessionDeniedOnly = params.includeSessionDenied === true;
	const appOnlyInventory = params.includeAppOnlyInventory === true;
	const tools = appOnlyInventory ? buildBundleMcpToolsFromCatalog({
		...params,
		reservedToolNames: initialReservedNames,
		includeAppOnlyInventory: false
	}) : sessionDeniedOnly ? buildBundleMcpToolsFromCatalog({
		...params,
		reservedToolNames: initialReservedNames,
		includeSessionDenied: false
	}) : [];
	const reservedNames = normalizeReservedToolNames([...initialReservedNames, ...tools.map((tool) => tool.name)]);
	const sortedCatalogTools = [...appOnlyInventory ? params.catalog.tools.filter(isAppOnlyTool) : sessionDeniedOnly ? params.catalog.sessionDeniedTools ?? [] : params.catalog.tools].toSorted((a, b) => {
		const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
		if (serverOrder !== 0) return serverOrder;
		const toolOrder = a.toolName.localeCompare(b.toolName);
		if (toolOrder !== 0) return toolOrder;
		return a.serverName.localeCompare(b.serverName);
	});
	for (const tool of sortedCatalogTools) {
		const appOnly = isAppOnlyTool(tool);
		if (appOnly && !appOnlyInventory) continue;
		const originalName = tool.toolName.trim();
		if (!originalName) continue;
		const server = params.catalog.servers[tool.serverName];
		const executionMode = server?.supportsParallelToolCalls === true ? "parallel" : "sequential";
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
			...params.createExecute && !sessionDeniedOnly ? { resultContentSource: "network" } : {},
			execute: (!sessionDeniedOnly ? params.createExecute?.(tool) : void 0) ?? (async () => {
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
				operation: "tool",
				...tool.oauthConnectBootstrap ? { oauthConnectBootstrap: true } : {},
				...tool.excludedFromOpenClawCatalog || appOnly ? { excludedFromOpenClawCatalog: true } : {},
				...tool.deniedBySession ? { deniedBySession: true } : {},
				codexApproval: {
					mode: server?.codexApprovalMode,
					...tool.codexAnnotations ? { annotations: tool.codexAnnotations } : {}
				}
			}
		});
		tools.push(agentTool);
	}
	for (const server of Object.values(params.catalog.servers).toSorted((a, b) => a.serverName.localeCompare(b.serverName))) {
		const safeServerName = server.safeServerName ?? server.serverName;
		const executionMode = server.supportsParallelToolCalls ? "parallel" : "sequential";
		if (server.resources && serverAllowsUtilityTool(server, "resources_list", sessionDeniedOnly)) addMcpUtilityTool({
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
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createResourceListExecute?.(server.serverName) : void 0
		});
		if (server.resources && serverAllowsUtilityTool(server, "resources_read", sessionDeniedOnly)) addMcpUtilityTool({
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
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createResourceReadExecute?.(server.serverName) : void 0
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_list", sessionDeniedOnly)) addMcpUtilityTool({
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
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createPromptListExecute?.(server.serverName) : void 0
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_get", sessionDeniedOnly)) addMcpUtilityTool({
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
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createPromptGetExecute?.(server.serverName) : void 0
		});
	}
	tools.sort((a, b) => a.name.localeCompare(b.name));
	return tools;
}
async function materializeBundleMcpToolsForRun(params) {
	const runtime = params.runtime;
	let disposal;
	let allowedAppToolsByServer;
	let releaseLease;
	const dispose = async () => {
		disposal ??= (async () => {
			try {
				const { releaseSessionMcpRuntime } = await import("./agents/agent-bundle-mcp-manager-api.js");
				await releaseSessionMcpRuntime({
					runtime,
					releaseLease
				});
			} finally {
				await params.disposeRuntime?.();
			}
		})();
		try {
			try {
				await disposal;
			} finally {
				if (runtime.joinCleanup) await runtime.joinCleanup();
				else recordAgentCleanupFailure();
			}
		} catch (error) {
			recordAgentCleanupFailure();
			throw error;
		}
	};
	try {
		releaseLease = params.releaseLease ?? runtime.acquireLease?.();
		runtime.markUsed();
		const catalog = await runtime.getCatalog();
		const reservedToolNames = params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0;
		const materializedCatalog = mergeMcpConnectCatalog(catalog, runtime.requesterConnect);
		const getPrompt = runtime.getPrompt?.bind(runtime);
		const tools = buildBundleMcpToolsFromCatalog({
			catalog: materializedCatalog,
			reservedToolNames,
			createExecute: (tool) => (toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
				if (!Object.hasOwn(catalog.servers, tool.serverName)) {
					const connect = runtime.requesterConnect?.createExecute(tool.serverName);
					if (connect) return setMcpCodeModeGuestResultFromAgentResult(await connect(toolCallId, input));
				}
				runtime.markUsed();
				const { serverName, toolName } = tool;
				const result = await runtime.callTool(serverName, toolName, input);
				const agentResult = projectMcpCallToolResult(result, {
					mcpServer: serverName,
					mcpTool: toolName
				});
				const scopedServer = runtime.isRequesterScopedServer?.(serverName) === true;
				if (runtime.mcpAppsEnabled && tool.uiResourceUri && !scopedServer) {
					const allowedAppToolNames = allowedAppToolsByServer ? allowedAppToolsByServer.get(serverName) ?? /* @__PURE__ */ new Set() : void 0;
					const view = await fetchMcpAppView({
						runtime,
						agentId: params.agentId,
						serverName,
						toolName,
						uiResourceUri: tool.uiResourceUri,
						toolCallId,
						toolInput: input,
						toolResult: result,
						...allowedAppToolNames ? { allowedAppToolNames } : {}
					});
					if (view) agentResult.details.mcpAppPreview = buildMcpAppCanvasPayload({
						...view,
						...runtime.sessionKey ? { originSessionKey: runtime.sessionKey } : {},
						...result["_meta"] !== void 0 ? { resultMetaState: "unavailable" } : {}
					});
				}
				return agentResult;
			}),
			createResourceListExecute: runtime.listResources ? (serverName) => (_toolCallId, _input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
				runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "resources_list",
					value: await runtime.listResources?.(serverName)
				});
			}) : void 0,
			createResourceReadExecute: runtime.readResource ? (serverName) => (_toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
				const uri = requireStringArg(input, "uri");
				runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "resources_read",
					value: await runtime.readResource?.(serverName, uri)
				});
			}) : void 0,
			createPromptListExecute: runtime.listPrompts ? (serverName) => (_toolCallId, _input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
				runtime.markUsed();
				return toJsonAgentToolResult({
					serverName,
					operation: "prompts_list",
					value: await runtime.listPrompts?.(serverName)
				});
			}) : void 0,
			createPromptGetExecute: getPrompt ? (serverName) => (_toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
				runtime.markUsed();
				return projectMcpGetPromptResult(await getPrompt(serverName, requireStringArg(input, "name"), optionalStringRecordArg(input, "arguments")), {
					mcpServer: serverName,
					mcpOperation: "prompts_get",
					untrustedMcpOutput: true
				});
			}) : void 0
		});
		return {
			tools,
			appTools: buildAppToolPolicyProjections({
				catalog: materializedCatalog,
				modelTools: tools,
				reservedToolNames
			}),
			...catalog.diagnostics && catalog.diagnostics.length > 0 ? { diagnostics: catalog.diagnostics } : {},
			restrictAppTools: (allowedTools) => {
				const next = /* @__PURE__ */ new Map();
				for (const allowedTool of allowedTools) {
					const mcp = getPluginToolMeta(allowedTool)?.mcp;
					if (!mcp || mcp.operation !== "tool") continue;
					const names = next.get(mcp.serverName) ?? /* @__PURE__ */ new Set();
					names.add(mcp.toolName);
					next.set(mcp.serverName, names);
				}
				allowedAppToolsByServer = next;
			},
			dispose
		};
	} catch (error) {
		await dispose().catch(() => void 0);
		throw error;
	}
}
async function createBundleMcpToolRuntime(params) {
	const signal = getSessionMcpRequestSignal();
	signal?.throwIfAborted();
	const createRuntime = params.createRuntime ?? (await import("./agents/agent-bundle-mcp-runtime.js")).createSessionMcpRuntime;
	signal?.throwIfAborted();
	const runtime = createRuntime({
		sessionId: `bundle-mcp:${crypto.randomUUID()}`,
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.excludeServerNames ? { excludeServerNames: params.excludeServerNames } : {},
		...params.safeServerNamesByServer ? { safeServerNamesByServer: params.safeServerNamesByServer } : {}
	});
	let abortDisposal;
	const onAbort = () => {
		abortDisposal = (async () => {
			await runtime.dispose();
		})();
		abortDisposal.catch(() => recordAgentCleanupFailure());
	};
	signal?.addEventListener("abort", onAbort, { once: true });
	if (signal?.aborted) onAbort();
	try {
		const materialized = await materializeBundleMcpToolsForRun({
			runtime,
			reservedToolNames: params.reservedToolNames,
			disposeRuntime: async () => {
				await runtime.dispose();
			}
		}).catch(async (error) => {
			if (signal?.aborted) {
				try {
					await abortDisposal;
				} finally {
					await runtime.joinCleanup?.();
				}
				signal.throwIfAborted();
			}
			throw error;
		});
		if (signal?.aborted) {
			await materialized.dispose();
			signal.throwIfAborted();
		}
		return materialized;
	} finally {
		signal?.removeEventListener("abort", onAbort);
		await abortDisposal;
	}
}
//#endregion
export { createBundleMcpToolRuntime as n, materializeBundleMcpToolsForRun as r, buildBundleMcpToolsFromCatalog as t };
