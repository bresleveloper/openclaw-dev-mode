import { t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { c as subscribeMcpAppModelContext, l as updateMcpAppModelContext, o as removeMcpAppModelContextItem, r as getMcpAppModelContext } from "./mcp-app-model-context-XPQPOrco.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { l as buildMcpAppSandboxPath } from "./mcp-ui-resource-BFfH0TzA.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { l as resolveMcpAppRequesterId, o as requireMcpAppInteraction, r as executeMcpAppOperation, s as resolveMcpAppActiveView, t as McpAppViewExpiredError, u as withMcpAppActiveView } from "./mcp-app-operations-Q5Op5uZm.mjs";
import { t as createMcpAppStandaloneTicket } from "./mcp-app-standalone-BauLYcGe.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-NfeOD3At.mjs";
//#region src/gateway/server-methods/mcp-app.ts
const fileRuntime = () => import("./mcp-app-host-files-Br3BtsQD.mjs");
const readMcpAppHostFile = createLazyRuntimeMethod(fileRuntime, (runtime) => runtime.readMcpAppHostFile);
const writeMcpAppHostFile = createLazyRuntimeMethod(fileRuntime, (runtime) => runtime.writeMcpAppHostFile);
const subscribeMcpAppHostFile = createLazyRuntimeMethod(fileRuntime, (runtime) => runtime.subscribeMcpAppHostFile);
const canOpenMcpAppFiles = createLazyRuntimeMethod(fileRuntime, (runtime) => runtime.canOpenMcpAppFiles);
const openMcpAppFile = createLazyRuntimeMethod(fileRuntime, (runtime) => runtime.openMcpAppFile);
function requireString(params, key) {
	const value = params[key];
	if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required`);
	return value.trim();
}
function optionalRecord(params, key) {
	const value = params[key];
	if (value === void 0) return;
	const record = asOptionalRecord(value);
	if (!record) throw new Error(`${key} must be an object`);
	return record;
}
function optionalCursor(params) {
	const cursor = params.cursor;
	return typeof cursor === "string" ? { cursor } : void 0;
}
var McpAppRequestError = class extends Error {
	constructor(shape) {
		super(shape.message);
		this.shape = shape;
	}
};
function resolveMcpAppSessionOwner(params, cfg) {
	const sessionKey = requireString(params, "sessionKey");
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? params.agentId.trim() : void 0;
	const owner = resolveRequestedSessionAgentId(cfg, sessionKey, explicitAgentId);
	if (!owner.ok) throw new McpAppRequestError(owner.error);
	return owner.agentId;
}
function resolveRequestedMcpAppView({ params, context, client }) {
	return resolveMcpAppActiveView({
		sessionKey: requireString(params, "sessionKey"),
		agentId: resolveMcpAppSessionOwner(params, context.getRuntimeConfig()),
		viewId: requireString(params, "viewId"),
		requesterId: resolveMcpAppRequesterId(client),
		cfg: context.getRuntimeConfig(),
		restore: false
	});
}
function operationHandler(buildOperation) {
	return mcpAppHandler(async (options) => {
		const { params, context, client } = options;
		const requestAuthority = readGatewayRequestMutationAuthority(options);
		const operation = buildOperation(params);
		const cfg = context.getRuntimeConfig();
		const requesterId = resolveMcpAppRequesterId(client);
		const active = await resolveMcpAppActiveView({
			sessionKey: requireString(params, "sessionKey"),
			agentId: resolveMcpAppSessionOwner(params, cfg),
			viewId: requireString(params, "viewId"),
			requesterId,
			cfg: context.getRuntimeConfig(),
			restore: false
		});
		const read = retainSessionScopedRead(options, requireString(params, "sessionKey"), active.view.agentId);
		try {
			const result = operation.method === "resources/read" && operation.params.uri.startsWith("openclaw-file://") ? await readMcpAppHostFile(options, active.view, operation.params) : await executeMcpAppOperation(active, operation, {
				options,
				assertCurrent: () => {
					requestAuthority.assertCurrent();
					read?.assertCurrent();
					options.sessionMutationAuthorization?.assertCurrent();
					if (resolveMcpAppRequesterId(client) !== requesterId || active.view.requesterId !== void 0 && active.view.requesterId !== requesterId) throw new McpAppViewExpiredError();
				}
			});
			read?.assertCurrent();
			return result;
		} finally {
			read?.release();
		}
	});
}
function mcpAppHandler(operation) {
	return async (options) => {
		try {
			options.respond(true, await operation(options));
		} catch (error) {
			options.respond(false, void 0, error instanceof McpAppRequestError ? error.shape : errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error), error instanceof McpAppViewExpiredError ? { details: { code: GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED } } : void 0));
		}
	};
}
const modelContextSubscriptions = /* @__PURE__ */ new WeakMap();
function hostFileHandler(operation) {
	return mcpAppHandler(async (options) => {
		const active = await resolveRequestedMcpAppView(options);
		return withMcpAppActiveView(active, "read", () => operation(options, active.view));
	});
}
const mcpAppHandlers = {
	"mcp.app.formResource": mcpAppHandler(async (options) => {
		const { executeMcpAppFormResource } = await import("./mcp-app-form-resources-BkDjVL_4.mjs");
		return executeMcpAppFormResource(options);
	}),
	"mcp.app.view": mcpAppHandler(async (options) => {
		const { params, context, client } = options;
		const sessionKey = requireString(params, "sessionKey");
		const agentId = resolveMcpAppSessionOwner(params, context.getRuntimeConfig());
		const requesterId = resolveMcpAppRequesterId(client);
		const read = retainSessionScopedRead(options, sessionKey, agentId);
		try {
			const active = await resolveMcpAppActiveView({
				sessionKey: requireString(params, "sessionKey"),
				agentId: resolveMcpAppSessionOwner(params, context.getRuntimeConfig()),
				viewId: requireString(params, "viewId"),
				requesterId: resolveMcpAppRequesterId(client),
				cfg: context.getRuntimeConfig()
			});
			read?.assertCurrent();
			const payload = await withMcpAppActiveView(active, "read", async () => {
				const { view } = active;
				if (client?.connId) {
					const byConnection = modelContextSubscriptions.get(view) ?? /* @__PURE__ */ new Map();
					const previous = byConnection.get(client.connId);
					previous?.();
					if (previous) view.disposeCallbacks?.delete(previous);
					if (byConnection.size >= 32 && !byConnection.has(client.connId)) throw new Error("MCP App connection limit reached");
					const connId = client.connId;
					let updateId = getMcpAppModelContext(active.runtime, view)?.updateId;
					const unsubscribe = subscribeMcpAppModelContext(view, (state) => {
						const clearedUpdateId = updateId;
						updateId = state?.updateId;
						context.broadcastToConnIds("mcp.app.hostContextChanged", {
							viewId: view.viewId,
							...state === null ? {
								modelContext: null,
								updateId: clearedUpdateId
							} : {}
						}, /* @__PURE__ */ new Set([connId]));
					});
					const stop = () => {
						unsubscribe();
						client.connectionSignal?.removeEventListener("abort", stop);
						if (byConnection.get(connId) === stop) byConnection.delete(connId);
						view.disposeCallbacks?.delete(stop);
					};
					client.connectionSignal?.addEventListener("abort", stop, { once: true });
					byConnection.set(connId, stop);
					modelContextSubscriptions.set(view, byConnection);
					view.disposeCallbacks ??= /* @__PURE__ */ new Set();
					view.disposeCallbacks.add(stop);
					if (client.connectionSignal?.aborted) stop();
				}
				let interactive = false;
				try {
					await requireMcpAppInteraction(view);
					interactive = true;
				} catch {}
				const openFilesSupported = interactive && Boolean(active.runtime.sessionKey) && await canOpenMcpAppFiles(view);
				const updateModelContextSupported = interactive && Boolean(active.runtime.sessionKey) && active.runtime.mcpAppModelContextRevoked !== true;
				const sandboxPort = context.getMcpAppSandboxPort?.() ?? await context.ensureSandboxHostPort?.();
				if (sandboxPort === void 0) throw new Error("MCP App sandbox listener is unavailable; restart the Gateway");
				const configuredOrigin = context.getRuntimeConfig().mcp?.apps?.sandboxOrigin;
				let standalone = void 0;
				try {
					standalone = createMcpAppStandaloneTicket({
						sessionKey: requireString(params, "sessionKey"),
						view,
						toolOperationsAuthorized: authorizeOperatorScopesForMethod("mcp.app.callTool", client?.connect?.scopes ?? []).allowed
					});
				} catch (error) {
					logWarn(`mcp-app: standalone ticket unavailable: ${formatErrorMessage(error)}`);
				}
				read?.assertCurrent();
				if (requesterId !== resolveMcpAppRequesterId(client)) throw new McpAppViewExpiredError();
				return {
					sandboxUrl: buildMcpAppSandboxPath(view.csp),
					sandboxPort,
					...configuredOrigin ? { sandboxOrigin: new URL(configuredOrigin).origin } : {},
					html: view.html,
					...view.csp ? { csp: view.csp } : {},
					toolInput: view.toolInput,
					toolResult: view.toolResult,
					hostContext: {
						"openai/modelContext": getMcpAppModelContext(active.runtime, view),
						...view.deepLink ? { "openai/deepLink": view.deepLink } : {}
					},
					...view.displayModes ? { displayModes: view.displayModes } : {},
					...view.displayMode ? { displayMode: view.displayMode } : {},
					richModelContextSupported: updateModelContextSupported && view.richModelContextSupported !== false,
					fileResourcesSupported: interactive && Boolean(view.hostFile),
					openFilesSupported,
					...standalone ? {
						standaloneUrl: standalone.url,
						standaloneExpiresAtMs: standalone.expiresAtMs
					} : {},
					messageSupported: interactive,
					updateModelContextSupported
				};
			});
			read?.assertCurrent();
			if (requesterId !== resolveMcpAppRequesterId(client)) throw new McpAppViewExpiredError();
			return payload;
		} finally {
			read?.release();
		}
	}),
	"mcp.app.updateModelContext": mcpAppHandler(async (options) => {
		const { params } = options;
		const active = await resolveRequestedMcpAppView(options);
		return await withMcpAppActiveView(active, "read", async () => {
			await requireMcpAppInteraction(active.view);
			return updateMcpAppModelContext(active.runtime, active.view, params);
		});
	}),
	"mcp.app.modelContext": mcpAppHandler(async (options) => {
		const active = await resolveRequestedMcpAppView(options);
		await requireMcpAppInteraction(active.view);
		return { state: getMcpAppModelContext(active.runtime, active.view) };
	}),
	"mcp.app.removeModelContext": mcpAppHandler(async (options) => {
		const { params } = options;
		const active = await resolveRequestedMcpAppView(options);
		await requireMcpAppInteraction(active.view);
		if (params.index !== void 0 && typeof params.index !== "number") throw new Error("index must be a number");
		return { state: removeMcpAppModelContextItem(active.runtime, active.view, requireString(params, "updateId"), params.index) };
	}),
	"mcp.app.writeResource": hostFileHandler((options, view) => writeMcpAppHostFile(options, view, options.params)),
	"mcp.app.subscribeResource": hostFileHandler((options, view) => subscribeMcpAppHostFile(options, view, requireString(options.params, "uri"), true)),
	"mcp.app.unsubscribeResource": hostFileHandler((options, view) => subscribeMcpAppHostFile(options, view, requireString(options.params, "uri"), false)),
	"mcp.app.openFile": hostFileHandler((options, view) => openMcpAppFile(options, view, requireString(options.params, "path"))),
	"mcp.app.callTool": operationHandler((params) => ({
		method: "tools/call",
		params: {
			name: requireString(params, "toolName"),
			arguments: optionalRecord(params, "arguments") ?? {}
		}
	})),
	"mcp.app.listTools": operationHandler((params) => ({
		method: "tools/list",
		params: optionalCursor(params) ?? {}
	})),
	"mcp.app.listResources": operationHandler((params) => ({
		method: "resources/list",
		params: optionalCursor(params) ?? {}
	})),
	"mcp.app.listResourceTemplates": operationHandler((params) => ({
		method: "resources/templates/list",
		params: optionalCursor(params) ?? {}
	})),
	"mcp.app.readResource": operationHandler((params) => ({
		method: "resources/read",
		params: {
			uri: requireString(params, "uri"),
			_meta: optionalRecord(params, "_meta")
		}
	}))
};
//#endregion
export { mcpAppHandlers };
