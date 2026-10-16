import { W as protectCodexAppServerLiveThread, _ as retainSharedCodexAppServerClientIfCurrent, n as captureCodexAppServerClientLifetime } from "./shared-client-r9NcV_GJ.mjs";
import { B as getCodexAppServerClientInstanceId } from "./client-BM1XpAkE.mjs";
import { n as getCodexAppServerTurnRouter } from "./turn-router-DLqce1id.mjs";
import { a as requestPluginApprovalOutcome } from "./plugin-approval-roundtrip-CP6xoxpH.mjs";
import { i as readCodexMcpToolUiVisibility, n as projectCodexMcpToolMetadata, r as readCodexMcpToolConnectorId, t as projectCodexMcpServerMetadata } from "./mcp-tool-metadata-j10HhfTC.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { loadAgentHarnessMcpConfig, prepareHarnessNativeMcpAppPreview } from "openclaw/plugin-sdk/agent-harness-runtime";
import { captureMcpClientElicitation, createHarnessMcpFormResourceContext, normalizeMcpCodexToolAnnotations, requiresMcpCodexToolApproval, resolveProjectedMcpCodexToolApprovalMode } from "openclaw/plugin-sdk/codex-mcp-projection";
//#region extensions/codex/src/app-server/native-mcp-app.ts
var native_mcp_app_exports = /* @__PURE__ */ __exportAll({
	createCodexNativeMcpAppResultDetailsPreparer: () => createCodexNativeMcpAppResultDetailsPreparer,
	createNativeMcpRuntime: () => createNativeMcpRuntime,
	prepareCodexNativeMcpFormResourceContext: () => prepareCodexNativeMcpFormResourceContext
});
const CODEX_APPS_MCP_SERVER = "codex_apps";
const toolCallMetadataSchema = z.record(z.string(), z.json());
function readMcpToolResult(item) {
	const result = asOptionalRecord(item.result);
	if (!result || !Array.isArray(result.content)) return;
	const resultMeta = asOptionalRecord(result["_meta"]);
	return {
		content: result.content,
		...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
		...result.isError === true ? { isError: true } : {},
		...resultMeta ? { _meta: resultMeta } : {}
	};
}
function statusTools(status) {
	return Object.entries(status.tools).map(([name, value]) => Object.assign({}, asOptionalRecord(value) ?? {}, { name }));
}
function createNativeMcpRuntime(params) {
	let catalog = null;
	let statuses;
	const createdAt = Date.now();
	let localFileOwner;
	try {
		localFileOwner = captureCodexAppServerClientLifetime(params.client, "native-process");
	} catch {}
	let localServerNames;
	const loadStatuses = async () => {
		params.assertCurrent?.();
		if (statuses) return statuses;
		const loaded = [];
		const cursors = /* @__PURE__ */ new Set();
		let cursor;
		for (let page = 0; page < 100; page += 1) {
			params.assertCurrent?.();
			const response = await params.client.request("mcpServerStatus/list", {
				threadId: params.threadId,
				detail: "full",
				...cursor ? { cursor } : {}
			}, { assertCurrent: params.assertCurrent });
			params.assertCurrent?.();
			loaded.push(...response.data);
			if (!response.nextCursor) {
				statuses = loaded;
				return statuses;
			}
			if (cursors.has(response.nextCursor)) throw new Error("Native MCP status cursor repeated");
			cursor = response.nextCursor;
			cursors.add(cursor);
		}
		throw new Error("Native MCP status exceeded the page limit");
	};
	const getCatalog = async () => {
		if (catalog) return catalog;
		const loaded = await loadStatuses();
		if (localFileOwner && !localServerNames) {
			const configured = await loadAgentHarnessMcpConfig({
				workspaceDir: params.attempt.workspaceDir,
				cfg: params.attempt.config,
				toolOverrides: params.attempt.toolOverrides
			});
			params.assertCurrent?.();
			localFileOwner();
			localServerNames = new Set(Object.entries(configured.config.mcpServers).filter(([, server]) => (normalizeLowercaseStringOrEmpty(server.transport) || "stdio") === "stdio" && typeof server.command === "string").map(([name]) => name));
		}
		catalog = {
			version: 1,
			generatedAt: Date.now(),
			servers: Object.fromEntries(loaded.map((status) => [status.name, projectCodexMcpServerMetadata(status)])),
			tools: loaded.flatMap((status) => statusTools(status).map((tool) => {
				const uiVisibility = readCodexMcpToolUiVisibility(tool);
				return Object.assign({
					serverName: status.name,
					safeServerName: status.name,
					toolName: String(tool.name),
					inputSchema: asOptionalRecord(tool.inputSchema) ?? { type: "object" }
				}, projectCodexMcpToolMetadata(String(tool.name), tool), uiVisibility ? { uiVisibility } : {});
			}))
		};
		return catalog;
	};
	const runtime = {
		sessionId: params.attempt.sessionId,
		sessionKey: params.attempt.sessionKey,
		workspaceDir: params.attempt.workspaceDir,
		configFingerprint: `${getCodexAppServerClientInstanceId(params.client)}:${params.threadId}`,
		mcpAppsEnabled: true,
		...params.appRequester ? { appRequester: params.appRequester } : {},
		assertOwnerCurrent: params.assertCurrent,
		canReadLocalFiles: (serverName) => {
			params.assertCurrent?.();
			if (!localFileOwner || !localServerNames?.has(serverName)) return false;
			localFileOwner();
			return true;
		},
		createdAt,
		lastUsedAt: createdAt,
		acquireLease: () => {
			params.assertCurrent?.();
			const releaseClient = retainSharedCodexAppServerClientIfCurrent(params.client);
			if (!releaseClient) throw new Error("Native MCP App client is no longer current");
			const unprotect = protectCodexAppServerLiveThread(params.client, params.threadId);
			return () => {
				unprotect();
				releaseClient();
			};
		},
		getCatalog,
		peekCatalog: () => catalog,
		markUsed: () => {
			runtime.lastUsedAt = Date.now();
		},
		callTool: async (serverName, toolName, input, options) => {
			const assertCurrent = () => {
				params.assertCurrent?.();
				options?.assertCurrent?.();
			};
			assertCurrent();
			const elicitation = captureMcpClientElicitation();
			const call = async () => await params.client.request("mcpServer/tool/call", {
				threadId: params.threadId,
				server: serverName,
				tool: toolName,
				arguments: asOptionalRecord(input) ?? {},
				...options?._meta ? { _meta: toolCallMetadataSchema.parse(options._meta) } : {}
			}, {
				signal: elicitation?.signal,
				assertCurrent
			});
			if (!elicitation) return await call();
			return await getCodexAppServerTurnRouter(params.client).withMcpToolCall({
				threadId: params.threadId,
				serverName,
				signal: elicitation.signal,
				onRequest: async (request, _scope, signal) => {
					assertCurrent();
					const elicitationInput = asOptionalRecord(request.params);
					if (!elicitationInput) throw new Error("Invalid native MCP elicitation");
					const rich = elicitationInput.mode === "openai/form" || elicitationInput.mode === "openaiForm";
					const result = await elicitation.handle({
						method: rich ? "openai/elicitation/create" : "elicitation/create",
						requestId: request.id,
						params: elicitationInput,
						signal
					});
					assertCurrent();
					return z.json().parse(result);
				}
			}, call);
		},
		listTools: async (serverName) => {
			const status = (await loadStatuses()).find((entry) => entry.name === serverName);
			return { tools: status ? statusTools(status) : [] };
		},
		readResource: async (serverName, uri, options) => {
			params.assertCurrent?.();
			if (options?._meta && Object.keys(options._meta).length > 0) throw new Error("This Codex connection does not support metadata-selected remote resource representations");
			const isCodexAppsServer = serverName === CODEX_APPS_MCP_SERVER;
			const response = await params.client.request("mcpServer/resource/read", {
				threadId: params.threadId,
				...isCodexAppsServer ? { originCallId: params.originCallId } : {},
				server: serverName,
				uri,
				...params.connectorId ? { connectorId: params.connectorId } : {}
			}, { assertCurrent: params.assertCurrent });
			if (isCodexAppsServer && response.originCallId !== params.originCallId) throw new Error(`Codex MCP resource response originCallId mismatch: expected ${params.originCallId}, received ${response.originCallId}`);
			return response;
		},
		listResources: async (serverName) => {
			return { resources: (await loadStatuses()).find((entry) => entry.name === serverName)?.resources ?? [] };
		},
		listResourceTemplates: async (serverName) => {
			return { resourceTemplates: (await loadStatuses()).find((entry) => entry.name === serverName)?.resourceTemplates ?? [] };
		},
		joinCleanup: async () => {},
		dispose: async () => {}
	};
	return runtime;
}
function createCodexNativeMcpAppResultDetailsPreparer(params) {
	if (params.attempt.config?.mcp?.apps?.enabled !== true) return;
	return async (item) => {
		const serverName = normalizeOptionalString(item.server);
		const toolName = normalizeOptionalString(item.tool);
		const appContext = asOptionalRecord(item.appContext);
		const uiResourceUri = normalizeOptionalString(appContext?.resourceUri) ?? normalizeOptionalString(item.mcpAppResourceUri);
		const connectorId = normalizeOptionalString(appContext?.connectorId);
		const toolResult = readMcpToolResult(item);
		if (!serverName || !toolName || !uiResourceUri?.startsWith("ui://") || !toolResult) return;
		if (serverName === CODEX_APPS_MCP_SERVER && !connectorId) return;
		const runtime = createNativeMcpRuntime({
			...params,
			originCallId: item.id,
			...connectorId ? { connectorId } : {}
		});
		const tools = (await runtime.listTools?.(serverName))?.tools ?? [];
		const allowedAppToolNames = new Set(tools.filter((tool) => {
			const uiVisibility = readCodexMcpToolUiVisibility(tool);
			return (uiVisibility === void 0 || uiVisibility.includes("app")) && (serverName !== CODEX_APPS_MCP_SERVER || readCodexMcpToolConnectorId(tool) === connectorId);
		}).map((tool) => tool.name));
		if (!allowedAppToolNames.has(toolName)) return;
		await runtime.getCatalog();
		return await prepareHarnessNativeMcpAppPreview({
			runtime,
			agentId: params.attempt.agentId,
			serverName,
			toolName,
			uiResourceUri,
			toolCallId: item.id,
			toolInput: item.arguments ?? {},
			toolResult,
			allowedAppToolNames,
			...toolResult["_meta"] !== void 0 ? { resultMetaState: "unavailable" } : {}
		});
	};
}
/** The per-turn projector, not a client-supplied resource id, selects the native origin. */
async function prepareCodexNativeMcpFormResourceContext(params) {
	const serverName = typeof params.request.snapshot.serverName === "string" ? params.request.snapshot.serverName : "";
	const origin = params.readOrigin(serverName);
	const { agentId, sessionKey } = params.attempt;
	if (!origin || !sessionKey || !agentId) throw new Error("Native MCP form has no unambiguous live origin");
	const assertCurrent = () => {
		params.attempt.hostCapabilities.assertActive();
		if (params.readOrigin(serverName)?.id !== origin.id) throw new Error("Native MCP form origin expired");
		params.request.signal.throwIfAborted();
	};
	assertCurrent();
	const tools = (await createNativeMcpRuntime({
		client: params.client,
		threadId: params.threadId,
		attempt: params.attempt,
		originCallId: origin.id,
		assertCurrent
	}).listTools?.(origin.server))?.tools ?? [];
	assertCurrent();
	const source = tools.find((tool) => tool.name === origin.tool);
	if (!source) throw new Error("Native MCP form origin is no longer listed");
	const connectorId = readCodexMcpToolConnectorId(source);
	if (origin.server === CODEX_APPS_MCP_SERVER && !connectorId) throw new Error("Native MCP form connector is unavailable");
	const runtime = createNativeMcpRuntime({
		client: params.client,
		threadId: params.threadId,
		attempt: params.attempt,
		originCallId: origin.id,
		connectorId,
		assertCurrent
	});
	await runtime.getCatalog();
	assertCurrent();
	return await createHarnessMcpFormResourceContext({
		version: 1,
		requestId: params.request.requestId,
		snapshot: params.request.snapshot,
		signal: params.request.signal,
		origin: {
			runtime,
			serverName: origin.server,
			agentId,
			sessionKey,
			requesterId: runtime.appRequester?.profileId,
			assertCurrent,
			prepareToolCall: async (request) => {
				assertCurrent();
				request.assertCurrent();
				const target = tools.find((tool) => tool.name === request.toolName);
				if (!target || params.attempt.toolOverrides?.mcpServers?.[origin.server] === false || params.attempt.toolOverrides?.mcpToolsDeny?.[origin.server]?.includes(request.toolName) || readCodexMcpToolUiVisibility(target)?.includes("app") === false || origin.server === CODEX_APPS_MCP_SERVER && readCodexMcpToolConnectorId(target) !== connectorId) throw new Error("Native form preview tool is not authorized");
				const server = params.attempt.config?.mcp?.servers?.[origin.server];
				if (requiresMcpCodexToolApproval({
					mode: server ? resolveProjectedMcpCodexToolApprovalMode(origin.server, server) : "prompt",
					fullPermission: params.attempt.permissionMode === "full",
					annotations: normalizeMcpCodexToolAnnotations(target.annotations)
				})) {
					const description = JSON.stringify({
						server: origin.server,
						tool: request.toolName,
						arguments: request.input
					});
					if (description.length > 512) throw new Error("Native form preview arguments exceed the approval display limit");
					if (await requestPluginApprovalOutcome({
						hostCapabilities: params.attempt.hostCapabilities,
						signal: request.signal ?? params.request.signal,
						title: "Run MCP form preview?",
						description,
						toolName: request.toolName,
						allowedDecisions: ["allow-once", "deny"]
					}) !== "approved-once") throw new Error("Native MCP form preview was not approved");
				}
				assertCurrent();
				request.assertCurrent();
			}
		}
	});
}
//#endregion
export { native_mcp_app_exports as n, prepareCodexNativeMcpFormResourceContext as r, createCodexNativeMcpAppResultDetailsPreparer as t };
