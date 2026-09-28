import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { o as getSessionMcpRequestSignal } from "./mcp-app-model-context-nV9u20zq.mjs";
import { c as releaseSessionMcpRuntime, n as acquireSessionMcpRuntime, r as completeDeferredSessionMcpRuntimeRetirement, s as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { a as getMcpAppViewLeaseForSession, i as getMcpAppViewLease, r as fetchMcpAppView, t as acquireMcpAppViewRequest } from "./mcp-ui-resource-CANSsmIF.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { u as visitSessionMessagesAsync } from "./session-transcript-readers-nuptsJ6Q.mjs";
import { CallToolRequestSchema, ContentBlockSchema, ListResourceTemplatesRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/gateway/mcp-app-reconstruction.ts
const MCP_APP_RESTORE_IN_FLIGHT_KEY = Symbol.for("openclaw.mcpAppRestoreInFlight");
function readDescriptor(value) {
	const record = asOptionalRecord(value);
	const viewId = normalizeOptionalString(record?.viewId);
	const serverName = normalizeOptionalString(record?.serverName);
	const toolName = normalizeOptionalString(record?.toolName);
	const uiResourceUri = normalizeOptionalString(record?.uiResourceUri);
	const toolCallId = normalizeOptionalString(record?.toolCallId);
	const rawResultMetaState = record?.resultMetaState;
	const resultMetaState = rawResultMetaState === "unavailable" ? rawResultMetaState : void 0;
	if (!viewId || viewId.length > 128 || !serverName || serverName.length > 256 || !toolName || toolName.length > 256 || !uiResourceUri?.startsWith("ui://") || uiResourceUri.length > 2048 || !toolCallId || toolCallId.length > 512 || rawResultMetaState !== void 0 && resultMetaState === void 0) return;
	return {
		viewId,
		serverName,
		toolName,
		uiResourceUri,
		toolCallId,
		...resultMetaState ? { resultMetaState } : {}
	};
}
function readToolInputFromMessage(value, toolCallId, modelToolName) {
	const message = asOptionalRecord(value);
	if (normalizeOptionalString(message?.role)?.toLowerCase() !== "assistant") return;
	const content = Array.isArray(message?.content) ? message.content : [];
	for (const blockValue of content) {
		const block = asOptionalRecord(blockValue);
		if ((normalizeOptionalString(block?.id) ?? normalizeOptionalString(block?.toolCallId)) !== toolCallId) continue;
		const type = normalizeOptionalString(block?.type)?.toLowerCase();
		if (type !== "toolcall" && type !== "tool_call" && type !== "tooluse" && type !== "tool_use") continue;
		if ((normalizeOptionalString(block?.name) ?? normalizeOptionalString(block?.toolName) ?? normalizeOptionalString(block?.tool_name)) !== modelToolName) continue;
		return {
			found: true,
			input: block?.arguments ?? block?.input ?? block?.args ?? {}
		};
	}
}
function readCallToolResult(message, details) {
	return {
		content: Array.isArray(message.content) ? message.content.flatMap((value) => {
			const parsed = ContentBlockSchema.safeParse(value);
			return parsed.success ? [parsed.data] : [];
		}) : [],
		...details.structuredContent !== void 0 ? { structuredContent: details.structuredContent } : {},
		...message.isError === true || details.status === "error" ? { isError: true } : {}
	};
}
function matchesLookup(rawDescriptor, lookup) {
	if ("viewId" in lookup) return normalizeOptionalString(rawDescriptor?.viewId) === lookup.viewId;
	const descriptor = lookup.descriptor;
	return normalizeOptionalString(rawDescriptor?.serverName) === descriptor.serverName && normalizeOptionalString(rawDescriptor?.toolName) === descriptor.toolName && normalizeOptionalString(rawDescriptor?.uiResourceUri) === descriptor.uiResourceUri && normalizeOptionalString(rawDescriptor?.toolCallId) === descriptor.toolCallId;
}
function readTranscriptResult(value, lookup) {
	const message = asOptionalRecord(value);
	if (!message || normalizeOptionalString(message.role)?.toLowerCase() !== "toolresult") return;
	const details = asOptionalRecord(message.details);
	if (!details) return;
	const preview = asOptionalRecord(details.mcpAppPreview);
	const rawDescriptor = asOptionalRecord(preview?.mcpApp);
	if (!matchesLookup(rawDescriptor, lookup)) return;
	const descriptor = readDescriptor(rawDescriptor);
	const modelToolName = normalizeOptionalString(message.toolName) ?? normalizeOptionalString(message.tool_name);
	if (!descriptor || !modelToolName) return { kind: "unavailable" };
	if (normalizeOptionalString(message.toolCallId) !== descriptor.toolCallId || normalizeOptionalString(details.mcpServer) !== descriptor.serverName || normalizeOptionalString(details.mcpTool) !== descriptor.toolName || descriptor.resultMetaState === "unavailable") return { kind: "unavailable" };
	return {
		kind: "restorable",
		value: {
			descriptor,
			modelToolName,
			toolResult: readCallToolResult(message, details)
		}
	};
}
/** Searches the full active transcript without retaining its messages in memory. */
async function findMcpAppReconstructionDataByVisit(visitTranscript, lookup) {
	let resultRead;
	let resultIndex = -1;
	let messageIndex = 0;
	await visitTranscript((message) => {
		const read = readTranscriptResult(message, lookup);
		if (read) {
			resultRead = read;
			resultIndex = messageIndex;
		}
		messageIndex += 1;
	});
	if (!resultRead || resultRead.kind === "unavailable") return;
	const resolvedResult = resultRead.value;
	let toolInput;
	let foundInput = false;
	messageIndex = 0;
	await visitTranscript((message) => {
		if (messageIndex >= resultIndex) {
			messageIndex += 1;
			return;
		}
		const input = readToolInputFromMessage(message, resolvedResult.descriptor.toolCallId, resolvedResult.modelToolName);
		if (input) {
			foundInput = true;
			toolInput = input.input;
		}
		messageIndex += 1;
	});
	if (!foundInput) return;
	const { modelToolName: _modelToolName, ...reconstruction } = resolvedResult;
	return {
		...reconstruction,
		toolInput
	};
}
function getRestoreInFlight() {
	const state = globalThis;
	const existing = state[MCP_APP_RESTORE_IN_FLIGHT_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	state[MCP_APP_RESTORE_IN_FLIGHT_KEY] = created;
	return created;
}
async function reconstructMcpAppView(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId });
	const sessionId = loaded.entry?.sessionId;
	if (!sessionId) return;
	const transcriptScope = {
		agentId,
		sessionId,
		sessionKey: loaded.canonicalKey,
		storePath: loaded.storePath,
		sessionEntry: loaded.entry
	};
	const data = await findMcpAppReconstructionDataByVisit(async (visit) => {
		await visitSessionMessagesAsync(transcriptScope, visit);
	}, params.lookup);
	if (!data) return;
	const acquisition = await acquireSessionMcpRuntime({
		sessionId,
		sessionKey: loaded.canonicalKey,
		workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId),
		agentDir: resolveAgentDir(params.cfg, agentId),
		cfg: params.cfg
	});
	const { runtime } = acquisition;
	try {
		if (runtime.mcpAppsEnabled !== true) return;
		const fetched = await fetchMcpAppView({
			runtime,
			agentId,
			serverName: data.descriptor.serverName,
			toolName: data.descriptor.toolName,
			uiResourceUri: data.descriptor.uiResourceUri,
			toolCallId: data.descriptor.toolCallId,
			toolInput: data.toolInput,
			toolResult: data.toolResult,
			...params.viewId ? { viewId: params.viewId } : {},
			allowedAppToolNames: params.allowedAppToolNames,
			...params.authorizeAppInteraction ? { authorizeAppInteraction: params.authorizeAppInteraction } : {},
			...params.readOnly ? { readOnly: true } : {}
		});
		const view = fetched ? getMcpAppViewLease(fetched.viewId, runtime) : void 0;
		return view ? {
			runtime,
			view
		} : void 0;
	} finally {
		await releaseSessionMcpRuntime(acquisition);
	}
}
async function restoreMcpAppViewOnce(params) {
	if (!params.viewId.startsWith("mcp-app-") || params.viewId.length > 128) return;
	return await reconstructMcpAppView({
		...params,
		lookup: { viewId: params.viewId },
		allowedAppToolNames: /* @__PURE__ */ new Set(),
		readOnly: true
	});
}
async function mintMcpAppViewFromTranscript(params) {
	return await reconstructMcpAppView({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		lookup: { descriptor: params.descriptor },
		allowedAppToolNames: params.allowedAppToolNames,
		...params.authorizeAppInteraction ? { authorizeAppInteraction: params.authorizeAppInteraction } : {},
		readOnly: params.readOnly
	});
}
async function restoreMcpAppView(params) {
	const key = `${params.agentId ?? ""}\0${params.sessionKey}\0${params.viewId}`;
	const inFlight = getRestoreInFlight();
	return await getOrCreatePromise(inFlight, key, () => restoreMcpAppViewOnce(params), { evictOnSettled: true });
}
//#endregion
//#region src/gateway/mcp-app-operations.ts
var McpAppViewExpiredError = class extends Error {
	constructor() {
		super("MCP App view expired or is not authorized for this session");
		this.name = "McpAppViewExpiredError";
	}
};
function isAppCallableTool(tool) {
	return tool.uiVisibility === void 0 || tool.uiVisibility.includes("app");
}
function isAppCallableListedTool(tool) {
	const { _meta: metadata } = tool;
	const ui = metadata?.ui && typeof metadata.ui === "object" && !Array.isArray(metadata.ui) ? metadata.ui : void 0;
	const visibility = Array.isArray(ui?.visibility) ? ui.visibility.filter((entry) => entry === "app" || entry === "model") : void 0;
	return visibility === void 0 || visibility.includes("app");
}
function isAllowedByView(view, toolName) {
	return view.allowedAppToolNames === void 0 || view.allowedAppToolNames.has(toolName);
}
async function requireMcpAppInteraction(view) {
	if (view.readOnly === true || view.allowedAppToolNames === void 0) throw new Error("MCP App view is read-only");
	if (view.authorizeAppInteraction && !await view.authorizeAppInteraction()) throw new Error("MCP App widget grant is no longer active");
}
async function resolveMcpAppAllowedToolNames(active) {
	if (active.view.readOnly === true || active.view.allowedAppToolNames === void 0) return [];
	return (await active.runtime.getCatalog()).tools.filter((tool) => tool.serverName === active.view.serverName && isAppCallableTool(tool) && isAllowedByView(active.view, tool.toolName)).map((tool) => tool.toolName).filter((toolName, index, all) => all.indexOf(toolName) === index).toSorted();
}
async function getRequestCatalog(runtime) {
	const signal = getSessionMcpRequestSignal();
	signal?.throwIfAborted();
	return racePromiseWithAbortSignal(runtime.getCatalog(), signal);
}
async function requireCallableTool(runtime, view, toolName) {
	await requireMcpAppInteraction(view);
	const tool = (await getRequestCatalog(runtime)).tools.find((entry) => entry.serverName === view.serverName && entry.toolName === toolName);
	if (!tool || !isAppCallableTool(tool) || !isAllowedByView(view, toolName)) throw new Error(`MCP tool "${toolName}" is not app-callable`);
}
async function resolveMcpAppActiveView(params) {
	if (params.cfg && params.cfg.mcp?.apps?.enabled !== true) throw new Error("MCP App runtime is unavailable");
	const liveView = params.agentId ? getMcpAppViewLeaseForSession(params.viewId, params.sessionKey, params.agentId) : void 0;
	if (liveView) {
		if (liveView.runtime.mcpAppsEnabled !== true) throw new Error("MCP App runtime is unavailable");
		return {
			runtime: liveView.runtime,
			view: liveView
		};
	}
	const existingRuntime = params.agentId && !parseAgentSessionKey(params.sessionKey) ? void 0 : peekSessionMcpRuntime({ sessionKey: params.sessionKey });
	if (existingRuntime && existingRuntime.mcpAppsEnabled !== true) throw new Error("MCP App runtime is unavailable");
	const existingView = existingRuntime ? getMcpAppViewLease(params.viewId, existingRuntime) : void 0;
	const restored = existingRuntime?.mcpAppsEnabled === true && existingView ? {
		runtime: existingRuntime,
		view: existingView
	} : params.cfg ? await restoreMcpAppView({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		viewId: params.viewId
	}) : void 0;
	if (!restored) throw new McpAppViewExpiredError();
	return restored;
}
async function withMcpAppActiveView(active, kind, operation) {
	active.runtime.markUsed();
	const release = acquireMcpAppViewRequest(active.view, kind);
	const releaseRuntimeLease = active.runtime.acquireLease?.();
	try {
		return await operation();
	} finally {
		release();
		releaseRuntimeLease?.();
		await completeDeferredSessionMcpRuntimeRetirement(active.runtime).catch((error) => {
			logWarn(`mcp-app: deferred runtime cleanup failed: ${formatErrorMessage(error)}`);
		});
	}
}
async function withMcpAppResourceAuthority(active, operation) {
	return await withMcpAppActiveView(active, "read", async () => {
		await requireMcpAppInteraction(active.view);
		const result = await operation();
		await requireMcpAppInteraction(active.view);
		return result;
	});
}
async function executeMcpAppOperation(active, operation) {
	const { runtime, view } = active;
	switch (operation.method) {
		case "tools/call": return await withMcpAppActiveView(active, "tool", async () => {
			await requireCallableTool(runtime, view, operation.params.name);
			await requireMcpAppInteraction(view);
			return await runtime.callTool(view.serverName, operation.params.name, operation.params.arguments ?? {});
		});
		case "tools/list": return await withMcpAppActiveView(active, "read", async () => {
			await requireMcpAppInteraction(view);
			if (!runtime.listTools) throw new Error("MCP tools/list is unavailable");
			const [listed, catalog] = await Promise.all([runtime.listTools(view.serverName, operation.params?.cursor ? { cursor: operation.params.cursor } : void 0), getRequestCatalog(runtime)]);
			const allowed = new Set(catalog.tools.filter((tool) => tool.serverName === view.serverName && isAppCallableTool(tool) && isAllowedByView(view, tool.toolName)).map((tool) => tool.toolName));
			const result = {
				...listed,
				tools: listed.tools.filter((tool) => allowed.has(tool.name.trim()) && isAppCallableListedTool(tool))
			};
			await requireMcpAppInteraction(view);
			return result;
		});
		case "resources/list": return await withMcpAppResourceAuthority(active, async () => {
			if (!runtime.listResources) throw new Error("MCP resources/list is unavailable");
			const resources = await runtime.listResources(view.serverName);
			return Array.isArray(resources) ? { resources } : resources;
		});
		case "resources/templates/list": return await withMcpAppResourceAuthority(active, async () => {
			if (!runtime.listResourceTemplates) throw new Error("MCP resources/templates/list is unavailable");
			return await runtime.listResourceTemplates(view.serverName, operation.params?.cursor ? { cursor: operation.params.cursor } : void 0);
		});
		case "resources/read": return await withMcpAppResourceAuthority(active, async () => {
			if (!runtime.readResource) throw new Error("MCP resources/read is unavailable");
			return await runtime.readResource(view.serverName, operation.params.uri);
		});
		default: throw new Error(`Unsupported MCP App operation: ${String(operation)}`);
	}
}
function parseMcpAppOperation(value) {
	const method = value && typeof value === "object" && !Array.isArray(value) ? value.method : void 0;
	const schema = method === "tools/call" ? CallToolRequestSchema : method === "tools/list" ? ListToolsRequestSchema : method === "resources/list" ? ListResourcesRequestSchema : method === "resources/templates/list" ? ListResourceTemplatesRequestSchema : method === "resources/read" ? ReadResourceRequestSchema : void 0;
	if (!schema) return;
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
//#endregion
export { resolveMcpAppActiveView as a, mintMcpAppViewFromTranscript as c, requireMcpAppInteraction as i, executeMcpAppOperation as n, resolveMcpAppAllowedToolNames as o, parseMcpAppOperation as r, withMcpAppActiveView as s, McpAppViewExpiredError as t };
