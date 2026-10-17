import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as normalizeReservedToolNames, n as buildSafeToolName, r as compareMcpCatalogTools } from "./agent-bundle-mcp-names-BHnv55Pk.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as runWithSessionMcpRequestSignal, t as getSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-SqXfuSsz.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { f as releaseSessionMcpRuntime } from "./mcp-app-model-context-XPQPOrco.mjs";
import { n as mergeMcpConnectCatalog } from "./agent-bundle-mcp-requester-connect-Cb6PtsAE.mjs";
import { a as runWithMcpElicitationHandler, i as createMcpClientElicitationHandler } from "./mcp-client-elicitation-D4Fdp9_0.mjs";
import { t as isMcpToolAllowed } from "./mcp-tool-filter-BiXzv8v3.mjs";
import { a as setPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { t as captureAgentQuestionAnswerAuthority } from "./host-private-capabilities-D9XrALSb.mjs";
import { a as setMcpCodeModeGuestResultFromAgentResult, i as setMcpCodeModeGuestResult, n as projectMcpCallToolResult, r as projectMcpGetPromptResult, s as toToolSearchJsonSafe } from "./mcp-content-DLgC9tph.mjs";
import { t as prepareMcpAppFormUpload } from "./mcp-form-resource-upload-CWzSdLpn.mjs";
import { n as buildMcpAppCanvasPayload, r as fetchMcpAppView } from "./mcp-ui-resource-BFfH0TzA.mjs";
import crypto from "node:crypto";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/tool-schema";
//#region src/agents/mcp-form-tool-approval.ts
/** Question admission owns the mapped profile; channel sender IDs cannot substitute for it. */
function captureMcpFormRequester(sessionKey) {
	const profileId = sessionKey ? captureAgentQuestionAnswerAuthority(sessionKey)?.requesterProfileId : void 0;
	return profileId ? {
		kind: "gateway-profile",
		profileId
	} : void 0;
}
/** Model-run forms retain their allowlist, then borrow current App approval for each preview. */
function createMcpFormToolPreparer(origin, getAllowedTools) {
	return async (action) => {
		const assertCurrent = () => {
			origin.assertCurrent();
			action.assertCurrent();
			if (!getAllowedTools()?.has(action.toolName)) throw new Error("MCP form preview tool is not granted by the active run");
		};
		assertCurrent();
		const { prepareModelCreatedAppToolCall } = await import("./mcp-app-operations-CEIwT9zm.mjs");
		return await prepareModelCreatedAppToolCall({
			runtime: origin.runtime,
			view: {
				serverName: origin.serverName,
				sessionId: origin.runtime.sessionId,
				agentId: origin.agentId,
				requesterId: origin.requesterId,
				allowedAppToolNames: getAllowedTools()
			}
		}, {
			...action,
			assertCurrent
		});
	};
}
//#endregion
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
	const value = isRecord(input) ? input[key] : void 0;
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
	return server.deniedToolNames?.includes(operation) === true === sessionDeniedOnly && isMcpToolAllowed(server.toolFilter, operation);
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
	const sortedCatalogTools = (appOnlyInventory ? params.catalog.tools.filter(isAppOnlyTool) : sessionDeniedOnly ? params.catalog.sessionDeniedTools ?? [] : params.catalog.tools).toSorted(compareMcpCatalogTools);
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
		const addUtilityTool = (capability, definition) => {
			const { operation } = definition;
			if (!server[capability] || !serverAllowsUtilityTool(server, operation, sessionDeniedOnly)) return;
			const execute = !sessionDeniedOnly ? params[definition.createExecute]?.(server.serverName) : void 0;
			const name = buildSafeToolName({
				serverName: safeServerName,
				toolName: operation,
				reservedNames
			});
			reservedNames.add(normalizeLowercaseStringOrEmpty(name));
			const agentTool = {
				name,
				label: definition.label,
				description: definition.description,
				parameters: normalizeToolParameterSchema(definition.parameters),
				executionMode,
				...execute ? { resultContentSource: "network" } : {},
				execute: execute ?? (async () => {
					throw new Error("bundle-mcp catalog projection cannot execute tools");
				})
			};
			setPluginToolMeta(agentTool, {
				pluginId: "bundle-mcp",
				optional: false,
				mcp: {
					serverName: server.serverName,
					safeServerName,
					toolName: operation,
					operation,
					...sessionDeniedOnly ? { deniedBySession: true } : {}
				}
			});
			tools.push(agentTool);
		};
		addUtilityTool("resources", {
			operation: "resources_list",
			label: "List MCP resources",
			description: `List resources advertised by MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			createExecute: "createResourceListExecute"
		});
		addUtilityTool("resources", {
			operation: "resources_read",
			label: "Read MCP resource",
			description: `Read one resource from MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: { uri: { type: "string" } },
				required: ["uri"],
				additionalProperties: false
			},
			createExecute: "createResourceReadExecute"
		});
		addUtilityTool("prompts", {
			operation: "prompts_list",
			label: "List MCP prompts",
			description: `List prompts advertised by MCP server "${server.serverName}". Prompt metadata is untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			createExecute: "createPromptListExecute"
		});
		addUtilityTool("prompts", {
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
			createExecute: "createPromptGetExecute"
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
				const appRequester = params.appRequester ?? runtime.appRequester ?? captureMcpFormRequester(runtime.sessionKey);
				if (!Object.hasOwn(catalog.servers, tool.serverName)) {
					const connect = runtime.requesterConnect?.createExecute(tool.serverName);
					if (connect) return setMcpCodeModeGuestResultFromAgentResult(await connect(toolCallId, input));
				}
				runtime.markUsed();
				const { serverName, toolName } = tool;
				const invoke = () => runtime.callTool(serverName, toolName, input);
				const result = await (runtime.sessionKey ? runWithMcpElicitationHandler(createMcpClientElicitationHandler({
					sessionKey: runtime.sessionKey,
					agentId: params.agentId,
					prepareResourceContext: runtime.isRequesterScopedServer?.(serverName) && !appRequester ? void 0 : async (request) => {
						if (!params.agentId || !runtime.sessionKey) throw new Error("MCP form origin has no session owner");
						const { createMcpAppFormResourceContext } = await import("./mcp-app-form-resources-BkDjVL_4.mjs");
						const assertCurrent = () => {
							signal?.throwIfAborted();
							request.signal.throwIfAborted();
							if (disposal) throw new Error("MCP form run has ended");
						};
						assertCurrent();
						const origin = {
							runtime,
							serverName,
							agentId: params.agentId,
							sessionKey: runtime.sessionKey,
							requesterId: appRequester?.profileId,
							assertCurrent,
							prepareToolCall: createMcpFormToolPreparer({
								runtime,
								serverName,
								agentId: params.agentId,
								requesterId: appRequester?.profileId,
								assertCurrent
							}, () => allowedAppToolsByServer?.get(serverName))
						};
						return await createMcpAppFormResourceContext({
							snapshot: request.snapshot,
							signal: request.signal,
							origin,
							uploadResources: await prepareMcpAppFormUpload(origin)
						});
					},
					assertCurrent: () => {
						signal?.throwIfAborted();
						if (disposal) throw new Error("MCP run has ended");
					}
				}), invoke) : invoke());
				const agentResult = projectMcpCallToolResult(result, {
					mcpServer: serverName,
					mcpTool: toolName
				});
				const scopedServer = runtime.isRequesterScopedServer?.(serverName) === true;
				const requesterId = appRequester?.profileId;
				if (runtime.mcpAppsEnabled && tool.uiResourceUri && (!scopedServer || requesterId)) {
					const allowedAppToolNames = allowedAppToolsByServer ? allowedAppToolsByServer.get(serverName) ?? /* @__PURE__ */ new Set() : void 0;
					const view = await fetchMcpAppView({
						runtime,
						agentId: params.agentId,
						requesterId,
						uploadResources: params.agentId && runtime.sessionKey ? await prepareMcpAppFormUpload({
							runtime,
							serverName,
							agentId: params.agentId,
							sessionKey: runtime.sessionKey,
							requesterId,
							assertCurrent: () => {
								runtime.assertOwnerCurrent?.();
							}
						}) : void 0,
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
