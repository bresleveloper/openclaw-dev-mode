import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as updateMcpAppModelContext } from "./mcp-app-model-context-nV9u20zq.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { s as buildMcpAppSandboxPath } from "./mcp-ui-resource-CANSsmIF.mjs";
import { a as resolveMcpAppActiveView, i as requireMcpAppInteraction, n as executeMcpAppOperation, s as withMcpAppActiveView, t as McpAppViewExpiredError } from "./mcp-app-operations-DCc43zVB.mjs";
import { t as createMcpAppStandaloneTicket } from "./mcp-app-standalone-DvThyDEa.mjs";
//#region src/gateway/server-methods/mcp-app.ts
function requireString(params, key) {
	const value = params[key];
	if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required`);
	return value.trim();
}
function optionalCursor(params) {
	const cursor = params.cursor;
	return typeof cursor === "string" && cursor.trim() ? { cursor: cursor.trim() } : void 0;
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
async function runOperation(params, operation, cfg) {
	const active = await resolveMcpAppActiveView({
		sessionKey: requireString(params, "sessionKey"),
		agentId: resolveMcpAppSessionOwner(params, cfg),
		viewId: requireString(params, "viewId")
	});
	return await executeMcpAppOperation(active, operation);
}
async function handle(respond, operation) {
	try {
		respond(true, await operation());
	} catch (error) {
		respond(false, void 0, error instanceof McpAppRequestError ? error.shape : errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error), error instanceof McpAppViewExpiredError ? { details: { code: GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED } } : void 0));
	}
}
const mcpAppHandlers = {
	"mcp.app.view": async ({ respond, params, context, client }) => {
		await handle(respond, async () => {
			const active = await resolveMcpAppActiveView({
				sessionKey: requireString(params, "sessionKey"),
				agentId: resolveMcpAppSessionOwner(params, context.getRuntimeConfig()),
				viewId: requireString(params, "viewId"),
				cfg: context.getRuntimeConfig()
			});
			return await withMcpAppActiveView(active, "read", async () => {
				const { view } = active;
				let interactive = false;
				try {
					await requireMcpAppInteraction(view);
					interactive = true;
				} catch {}
				const updateModelContextSupported = interactive && active.runtime.mcpAppModelContextRevoked !== true;
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
				return {
					sandboxUrl: buildMcpAppSandboxPath(view.csp),
					sandboxPort,
					...configuredOrigin ? { sandboxOrigin: new URL(configuredOrigin).origin } : {},
					html: view.html,
					...view.csp ? { csp: view.csp } : {},
					toolInput: view.toolInput,
					toolResult: view.toolResult,
					...standalone ? {
						standaloneUrl: standalone.url,
						standaloneExpiresAtMs: standalone.expiresAtMs
					} : {},
					messageSupported: interactive,
					updateModelContextSupported
				};
			});
		});
	},
	"mcp.app.updateModelContext": async ({ respond, params, context }) => {
		await handle(respond, async () => {
			const active = await resolveMcpAppActiveView({
				sessionKey: requireString(params, "sessionKey"),
				agentId: resolveMcpAppSessionOwner(params, context.getRuntimeConfig()),
				viewId: requireString(params, "viewId")
			});
			return await withMcpAppActiveView(active, "read", async () => {
				await requireMcpAppInteraction(active.view);
				updateMcpAppModelContext(active.runtime, active.view, params);
				return {};
			});
		});
	},
	"mcp.app.callTool": async ({ respond, params, context }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "tools/call",
			params: {
				name: requireString(params, "toolName"),
				arguments: params.arguments ?? {}
			}
		}, context.getRuntimeConfig()));
	},
	"mcp.app.listTools": async ({ respond, params, context }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "tools/list",
			params: optionalCursor(params) ?? {}
		}, context.getRuntimeConfig()));
	},
	"mcp.app.listResources": async ({ respond, params, context }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/list",
			params: optionalCursor(params) ?? {}
		}, context.getRuntimeConfig()));
	},
	"mcp.app.listResourceTemplates": async ({ respond, params, context }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/templates/list",
			params: optionalCursor(params) ?? {}
		}, context.getRuntimeConfig()));
	},
	"mcp.app.readResource": async ({ respond, params, context }) => {
		await handle(respond, async () => await runOperation(params, {
			method: "resources/read",
			params: { uri: requireString(params, "uri") }
		}, context.getRuntimeConfig()));
	}
};
//#endregion
export { mcpAppHandlers };
