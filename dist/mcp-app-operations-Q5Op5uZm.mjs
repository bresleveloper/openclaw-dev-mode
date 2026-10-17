import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as runWithSessionMcpRequestSignal, t as getSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-SqXfuSsz.mjs";
import { n as acquireSessionMcpRuntime, o as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-DMR2FD5c.mjs";
import { f as releaseSessionMcpRuntime, u as completeDeferredSessionMcpRuntimeRetirement } from "./mcp-app-model-context-XPQPOrco.mjs";
import { a as runWithMcpElicitationHandler, i as createMcpClientElicitationHandler } from "./mcp-client-elicitation-D4Fdp9_0.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { a as getMcpAppViewLeaseForSession, i as getMcpAppViewLease, r as fetchMcpAppView, t as acquireMcpAppViewRequest } from "./mcp-ui-resource-BFfH0TzA.mjs";
import { m as readSessionTranscriptSummaryAsync } from "./session-transcript-readers-Z-j3mApc.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { CallToolRequestSchema, ListResourceTemplatesRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/gateway/mcp-app-reconstruction.ts
const MCP_APP_RESTORE_IN_FLIGHT_KEY = Symbol.for("openclaw.mcpAppRestoreInFlight");
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
	const { data } = await readSessionTranscriptSummaryAsync(transcriptScope, {
		kind: "mcp-app",
		lookup: params.lookup
	});
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
async function mintMcpAppViewFromTranscript(params) {
	const { descriptor, ...request } = params;
	return await reconstructMcpAppView({
		...request,
		lookup: { descriptor }
	});
}
async function restoreMcpAppView(params) {
	const key = `${params.agentId ?? ""}\0${params.sessionKey}\0${params.viewId}`;
	const inFlight = resolveGlobalMap(MCP_APP_RESTORE_IN_FLIGHT_KEY);
	return await getOrCreatePromise(inFlight, key, async () => {
		if (!params.viewId.startsWith("mcp-app-") || params.viewId.length > 128) return;
		return reconstructMcpAppView({
			...params,
			lookup: { viewId: params.viewId },
			allowedAppToolNames: /* @__PURE__ */ new Set(),
			readOnly: true
		});
	}, { evictOnSettled: true });
}
//#endregion
//#region src/gateway/mcp-app-operations.ts
function resolveMcpAppRequesterId(client) {
	const actor = resolveGatewayOperatorRoleActor(client);
	return client?.authenticatedUserProfile?.profileId ?? (actor?.kind === "operator" ? actor.profileId : void 0);
}
var McpAppViewExpiredError = class extends Error {
	constructor() {
		super("MCP App view expired or is not authorized for this session");
		this.name = "McpAppViewExpiredError";
	}
};
function isAppCallableTool(view, tool) {
	return tool.serverName === view.serverName && (tool.uiVisibility === void 0 || tool.uiVisibility.includes("app")) && (view.allowedAppToolNames === void 0 || view.allowedAppToolNames.has(tool.toolName));
}
function isAppCallableListedTool(tool) {
	const visibility = asOptionalRecord(tool._meta?.ui)?.visibility;
	return !Array.isArray(visibility) || visibility.includes("app");
}
async function requireMcpAppInteraction(view) {
	if (view.readOnly === true || view.allowedAppToolNames === void 0) throw new Error("MCP App view is read-only");
	if (view.authorizeAppInteraction && !await view.authorizeAppInteraction()) throw new Error("MCP App widget grant is no longer active");
}
async function resolveMcpAppAllowedToolNames(active) {
	if (active.view.readOnly === true || active.view.allowedAppToolNames === void 0) return [];
	return (await active.runtime.getCatalog()).tools.filter((tool) => isAppCallableTool(active.view, tool)).map((tool) => tool.toolName).filter((toolName, index, all) => all.indexOf(toolName) === index).toSorted();
}
async function getRequestCatalog(runtime) {
	const signal = getSessionMcpRequestSignal();
	signal?.throwIfAborted();
	return racePromiseWithAbortSignal(runtime.getCatalog(), signal);
}
async function requireCallableTool(runtime, view, toolName) {
	await requireMcpAppInteraction(view);
	const tool = (await getRequestCatalog(runtime)).tools.find((entry) => entry.serverName === view.serverName && entry.toolName === toolName);
	if (!tool || !isAppCallableTool(view, tool)) throw new Error(`MCP tool "${toolName}" is not app-callable`);
}
async function resolveMcpAppActiveView(params) {
	const requireRequester = (active) => {
		if (active.view.requesterId !== void 0 && active.view.requesterId !== params.requesterId) throw new McpAppViewExpiredError();
		active.runtime.assertOwnerCurrent?.();
		return active;
	};
	if (params.cfg && params.cfg.mcp?.apps?.enabled !== true) throw new Error("MCP App runtime is unavailable");
	const liveView = params.agentId ? getMcpAppViewLeaseForSession(params.viewId, params.sessionKey, params.agentId) : void 0;
	if (liveView) {
		if (liveView.runtime.mcpAppsEnabled !== true) throw new Error("MCP App runtime is unavailable");
		return requireRequester({
			runtime: liveView.runtime,
			view: liveView
		});
	}
	const existingRuntime = params.agentId && !parseAgentSessionKey(params.sessionKey) ? void 0 : peekSessionMcpRuntime({ sessionKey: params.sessionKey });
	if (existingRuntime && existingRuntime.mcpAppsEnabled !== true) throw new Error("MCP App runtime is unavailable");
	const existingView = existingRuntime ? getMcpAppViewLease(params.viewId, existingRuntime) : void 0;
	const restored = existingRuntime?.mcpAppsEnabled === true && existingView ? {
		runtime: existingRuntime,
		view: existingView
	} : params.cfg && params.restore !== false ? await restoreMcpAppView({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		viewId: params.viewId
	}) : void 0;
	if (!restored) throw new McpAppViewExpiredError();
	return requireRequester(restored);
}
async function withMcpAppActiveView(active, kind, operation) {
	active.runtime.assertOwnerCurrent?.();
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
async function withMcpAppReadAuthority(active, operation) {
	return await withMcpAppActiveView(active, "read", async () => {
		await requireMcpAppInteraction(active.view);
		const result = await operation();
		await requireMcpAppInteraction(active.view);
		return result;
	});
}
/** Model-created views retain a tool allowlist, not authority to skip current approval policy. */
async function prepareModelCreatedAppToolCall(active, request) {
	const [{ loadSessionMcpConfig }, { buildBundleMcpToolsFromCatalog }, { getPluginToolMeta }, { isMcpToolAllowed, normalizeMcpToolFilter }, { requiresMcpCodexToolApproval, resolveProjectedMcpCodexToolApprovalMode }, { getSessionRowProjection }, { resolveSessionResourceToolPolicy }, { requestMcpAppToolApproval }] = await Promise.all([
		import("./agent-bundle-mcp-runtime-config-BwkNeCLN.mjs"),
		import("./agents/agent-bundle-mcp-materialize.js"),
		import("./plugins/tool-metadata.js"),
		import("./mcp-tool-filter-uld9UJsR.mjs"),
		import("./mcp-codex-tool-approval-DANhna8Z.mjs"),
		import("./session-row-projection-access-4OuFSwiS.mjs"),
		import("./session-resource-tool-policy-Cx3fEcGG.mjs"),
		import("./mcp-app-tool-approval-D72RsO8i.mjs")
	]);
	request.assertCurrent();
	const { runtime, view } = active;
	const { options } = request;
	const sessionKey = runtime.sessionKey;
	const projection = getSessionRowProjection(options.context);
	if (!sessionKey || !projection) throw new Error("MCP App current session policy is unavailable");
	const cfg = options.context.getRuntimeConfig();
	const query = {
		agentId: view.agentId,
		key: sessionKey
	};
	const requesterId = resolveMcpAppRequesterId(options.client);
	const current = () => {
		request.assertCurrent();
		if (options.context.getRuntimeConfig() !== cfg || cfg.mcp?.apps?.enabled !== true || getSessionRowProjection(options.context) !== projection || resolveMcpAppRequesterId(options.client) !== requesterId || view.requesterId !== void 0 && requesterId !== view.requesterId) throw new Error("MCP App requester or configuration changed");
		const target = projection.sharingTarget(query);
		if (!target || target.entry.sessionId !== runtime.sessionId || view.sessionId !== runtime.sessionId) throw new Error("MCP App session changed");
		return target;
	};
	const initial = current();
	const expectedLifecycleRevision = initial.entry.lifecycleRevision;
	const { loaded } = loadSessionMcpConfig({
		workspaceDir: runtime.workspaceDir,
		cfg,
		toolOverrides: initial.entry.toolOverrides
	});
	const rawServer = loaded.mcpServers[view.serverName];
	const catalog = runtime.peekCatalog();
	const server = catalog?.servers[view.serverName];
	const tool = catalog?.tools.find((entry) => entry.serverName === view.serverName && entry.toolName === request.toolName);
	if (!catalog || !server || !tool || !rawServer && !(runtime.assertOwnerCurrent && server.pluginId)) throw new Error("MCP App approval origin is not known to the current server/native owner");
	const projected = buildBundleMcpToolsFromCatalog({
		catalog,
		includeAppOnlyInventory: true
	}).find((entry) => {
		const mcp = getPluginToolMeta(entry)?.mcp;
		return mcp?.operation === "tool" && mcp.serverName === view.serverName && mcp.toolName === request.toolName;
	});
	if (!projected) throw new Error("MCP App current tool projection is unavailable");
	const expectedToolPolicy = JSON.stringify({
		server,
		tool
	});
	const assertPolicy = () => {
		const live = current();
		if (live.entry.lifecycleRevision !== expectedLifecycleRevision) throw new Error("MCP App session lifecycle changed");
		const currentCatalog = runtime.peekCatalog();
		const currentTool = currentCatalog?.tools.find((entry) => entry.serverName === view.serverName && entry.toolName === request.toolName);
		if (!currentTool || !isAppCallableTool(view, currentTool) || currentTool.deniedBySession || JSON.stringify({
			server: currentCatalog?.servers[view.serverName],
			tool: currentTool
		}) !== expectedToolPolicy || live.entry.toolOverrides?.mcpServers?.[view.serverName] === false || live.entry.toolOverrides?.mcpToolsDeny?.[view.serverName]?.includes(request.toolName) || rawServer && !isMcpToolAllowed(normalizeMcpToolFilter(rawServer.toolFilter), request.toolName)) throw new Error("MCP App tool is denied by current policy");
		resolveSessionResourceToolPolicy({
			config: cfg,
			client: options.client,
			current: live,
			readPreparedSessionEntry: (source) => projection.sharingTarget(source)?.entry,
			toolName: projected.name,
			assertNativeRuntimeCurrent: runtime.assertOwnerCurrent
		});
		return requiresMcpCodexToolApproval({
			mode: rawServer ? resolveProjectedMcpCodexToolApprovalMode(view.serverName, rawServer) : "prompt",
			fullPermission: live.entry.permissionMode === "full",
			annotations: currentTool.codexAnnotations
		});
	};
	const approvalRequired = assertPolicy();
	if (approvalRequired) await requestMcpAppToolApproval({
		options,
		agentId: view.agentId,
		sessionKey,
		serverName: view.serverName,
		toolName: request.toolName,
		input: request.input,
		view: request.view,
		requesterId,
		signal: options.signal,
		assertCurrent: () => {
			assertPolicy();
		}
	});
	const assertExecutionCurrent = () => {
		if (assertPolicy() && !approvalRequired) throw new Error("MCP App approval policy changed before execution");
	};
	assertExecutionCurrent();
	return assertExecutionCurrent;
}
async function executeMcpAppOperation(active, operation, request) {
	const { runtime, view } = active;
	if (operation.method === "tools/call") return await withMcpAppActiveView(active, "tool", async () => {
		await requireCallableTool(runtime, view, operation.params.name);
		await requireMcpAppInteraction(view);
		const input = operation.params.arguments ?? {};
		const assertViewCurrent = () => {
			request?.assertCurrent();
			runtime.assertOwnerCurrent?.();
			request?.options.signal?.throwIfAborted();
			if (getMcpAppViewLease(view.viewId, runtime) !== view || view.readOnly || view.allowedAppToolNames === void 0) throw new McpAppViewExpiredError();
		};
		let assertPreparedPolicy;
		const assertCurrent = () => {
			assertViewCurrent();
			if (assertPreparedPolicy) assertPreparedPolicy();
		};
		if (view.prepareToolCall) {
			if (!request) throw new Error("This App tool requires an authenticated request for approval");
			assertPreparedPolicy = await view.prepareToolCall({
				options: request.options,
				toolName: operation.params.name,
				input,
				view,
				assertCurrent: assertViewCurrent,
				signal: request.options.signal
			});
			assertCurrent();
		} else if (request) assertPreparedPolicy = await prepareModelCreatedAppToolCall(active, {
			options: request.options,
			toolName: operation.params.name,
			input,
			view,
			assertCurrent: assertViewCurrent
		});
		await requireMcpAppInteraction(view);
		if (request) {
			if (!runtime.sessionKey) throw new Error("MCP App session is unavailable");
			assertCurrent();
			return await callMcpAppToolWithElicitation({
				options: request.options,
				origin: {
					runtime,
					serverName: view.serverName,
					agentId: view.agentId,
					sessionKey: runtime.sessionKey,
					requesterId: resolveMcpAppRequesterId(request.options.client),
					assertCurrent,
					prepareToolCall: view.prepareToolCall
				},
				toolName: operation.params.name,
				input,
				assertCurrent,
				uploadResources: view.uploadResources,
				...view.hostFile ? { _meta: { "openai/resource": { path: path.join(view.hostFile.rootDir, view.hostFile.path) } } } : {}
			});
		}
		if (view.hostFile) return await runtime.callTool(view.serverName, operation.params.name, input, { _meta: { "openai/resource": { path: path.join(view.hostFile.rootDir, view.hostFile.path) } } });
		return await runtime.callTool(view.serverName, operation.params.name, input);
	});
	return await withMcpAppReadAuthority(active, async () => {
		switch (operation.method) {
			case "tools/list": {
				if (!runtime.listTools) throw new Error("MCP tools/list is unavailable");
				const [listed, catalog] = await Promise.all([runtime.listTools(view.serverName, operation.params?.cursor !== void 0 ? { cursor: operation.params.cursor } : void 0), getRequestCatalog(runtime)]);
				const allowed = new Set(catalog.tools.filter((tool) => isAppCallableTool(view, tool)).map((tool) => tool.toolName));
				return {
					...listed,
					tools: listed.tools.filter((tool) => allowed.has(tool.name.trim()) && isAppCallableListedTool(tool))
				};
			}
			case "resources/list": {
				if (!runtime.listResources) throw new Error("MCP resources/list is unavailable");
				const resources = await runtime.listResources(view.serverName);
				return Array.isArray(resources) ? { resources } : resources;
			}
			case "resources/templates/list":
				if (!runtime.listResourceTemplates) throw new Error("MCP resources/templates/list is unavailable");
				return await runtime.listResourceTemplates(view.serverName, operation.params?.cursor !== void 0 ? { cursor: operation.params.cursor } : void 0);
			case "resources/read":
				if (!runtime.readResource) throw new Error("MCP resources/read is unavailable");
				return await runtime.readResource(view.serverName, operation.params.uri);
			default: throw new Error(`Unsupported MCP App operation: ${String(operation)}`);
		}
	});
}
function parseMcpAppOperation(value) {
	const method = asOptionalRecord(value)?.method;
	const schema = method === "tools/call" ? CallToolRequestSchema : method === "tools/list" ? ListToolsRequestSchema : method === "resources/list" ? ListResourcesRequestSchema : method === "resources/templates/list" ? ListResourceTemplatesRequestSchema : method === "resources/read" ? ReadResourceRequestSchema : void 0;
	if (!schema) return;
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
/** The current UI request owns approval/question delivery; upstream server callbacks retain that scope. */
async function callMcpAppToolWithElicitation(params) {
	const signals = [
		params.options.signal,
		params.signal,
		getSessionMcpRequestSignal()
	].filter((signal) => signal !== void 0);
	const signal = signals.length ? AbortSignal.any(signals) : new AbortController().signal;
	const assertCurrent = () => {
		signal.throwIfAborted();
		params.assertCurrent();
		params.origin.assertCurrent();
	};
	assertCurrent();
	const questions = /* @__PURE__ */ new Map();
	const retireQuestions = () => {
		const manager = params.options.context.questionManager;
		for (const [id, observation] of questions) {
			try {
				if (manager && observation.isCurrent() && observation.record.status === "pending") manager.cancel(id, "mcp-app-request-retired");
			} catch (error) {
				logWarn(`mcp-app: question cleanup failed: ${formatErrorMessage(error)}`);
			}
			questions.delete(id);
		}
	};
	signal.addEventListener("abort", retireQuestions, { once: true });
	const handler = createMcpClientElicitationHandler({
		sessionKey: params.origin.sessionKey,
		agentId: params.origin.agentId,
		assertCurrent,
		gatewayCall: {
			version: 2,
			call: async ({ method, params: requestParams, signal: requestSignal, authority }) => {
				const assertDispatchCurrent = () => {
					assertCurrent();
					if (authority.kind === "source-bound") authority.assertCurrent();
				};
				assertDispatchCurrent();
				const { handleGatewayRequest } = await import("./server-methods-CfbaDveK.mjs");
				assertDispatchCurrent();
				return await new Promise((resolve, reject) => {
					handleGatewayRequest({
						req: {
							type: "req",
							id: randomUUID(),
							method,
							params: requestParams
						},
						client: params.options.client,
						context: params.options.context,
						methodRegistry: params.options.context.getGatewayMethodRegistry?.(),
						isWebchatConnect: params.options.isWebchatConnect,
						signal: requestSignal ?? signal,
						sessionMutationCommitGuard: assertDispatchCurrent,
						hasCurrentClientAuthority: params.options.hasCurrentClientAuthority,
						respond: (ok, result, error) => {
							if (!ok) {
								reject(new Error(error?.message ?? "App question request failed"));
								return;
							}
							if (method === "question.request") {
								const id = asOptionalRecord(result)?.id;
								const observation = typeof id === "string" ? params.options.context.questionManager?.observe(id) : void 0;
								if (observation && typeof id === "string") {
									questions.set(id, observation);
									if (signal.aborted) retireQuestions();
								}
							}
							resolve(result);
						}
					}).catch(reject);
				});
			}
		},
		prepareResourceContext: async (request) => {
			const { createMcpAppFormResourceContext } = await import("./mcp-app-form-resources-BkDjVL_4.mjs");
			assertCurrent();
			return createMcpAppFormResourceContext({
				snapshot: request.snapshot,
				signal: request.signal,
				origin: params.origin,
				uploadResources: params.uploadResources
			});
		}
	});
	try {
		return await runWithSessionMcpRequestSignal(signal, () => runWithMcpElicitationHandler(handler, () => params.origin.runtime.callTool(params.origin.serverName, params.toolName, params.input, {
			...params._meta ? { _meta: params._meta } : {},
			assertCurrent
		})));
	} finally {
		signal.removeEventListener("abort", retireQuestions);
		retireQuestions();
	}
}
//#endregion
export { prepareModelCreatedAppToolCall as a, resolveMcpAppAllowedToolNames as c, mintMcpAppViewFromTranscript as d, parseMcpAppOperation as i, resolveMcpAppRequesterId as l, callMcpAppToolWithElicitation as n, requireMcpAppInteraction as o, executeMcpAppOperation as r, resolveMcpAppActiveView as s, McpAppViewExpiredError as t, withMcpAppActiveView as u };
