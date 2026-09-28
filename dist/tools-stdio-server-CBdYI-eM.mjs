import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as runWithTrackedCancellation, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-Bm9V3G-F.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as routeLogsToStderr } from "./console-DwqfhE-H.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as createPluginToolsMcpHandlers } from "./plugin-tools-handlers-BYstQ71a.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//#region src/mcp/agent-session-env.ts
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
/** Private generated-helper argv selects context, never approval or execution authority. */
function resolveToolsMcpAgentId(argv = process.argv.slice(2)) {
	const index = argv.indexOf("--openclaw-agent-id");
	if (index < 0) return;
	const value = argv[index + 1]?.trim();
	if (!value || value.startsWith("--") || argv.includes("--openclaw-agent-id", index + 1)) throw new Error("--openclaw-agent-id requires one OpenClaw agent owner");
	return normalizeAgentId(value);
}
function resolveToolsMcpSessionContext(params) {
	const sessionKey = (params.agentSessionKey ?? resolveToolsMcpAgentSessionKey())?.trim();
	const encodedOwner = sessionKey ? parseAgentSessionKey(sessionKey)?.agentId : void 0;
	const agentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : encodedOwner;
	if (sessionKey && !agentId || encodedOwner && encodedOwner !== agentId || !sessionKey && agentId) throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} must be a canonical agent session key or have a matching explicit OpenClaw owner`);
	return sessionKey ? {
		sessionKey,
		agentId
	} : {};
}
function resolveToolsMcpAgentSessionKey(env = process.env) {
	return env["OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY"]?.trim() || void 0;
}
//#endregion
//#region src/mcp/tools-stdio-server.ts
var ToolsMcpServer = class extends Server {
	#work = new AsyncWorkScope();
	#closing;
	runRequest(run, signal) {
		if (this.#closing || !this.transport) return Promise.reject(McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed"));
		signal.throwIfAborted();
		return this.#work.track(run);
	}
	close() {
		if (this.#closing) return this.#closing;
		const closed = createDeferredCore();
		this.#closing = closed.promise;
		const work = this.#work;
		(async () => {
			try {
				await super.close();
			} finally {
				await work.drain();
				this.#work = new AsyncWorkScope();
				this.#closing = void 0;
			}
		})().then(closed.resolve, closed.reject);
		return closed.promise;
	}
};
function createToolsMcpServer(params) {
	const handlers = createPluginToolsMcpHandlers(params.tools);
	const server = new ToolsMcpServer({
		name: params.name,
		version: VERSION
	}, { capabilities: { tools: {} } });
	const servingContext = params.sdkResourceHost?.run(() => AsyncLocalStorage.snapshot());
	const runInServingContext = (run) => servingContext ? servingContext(run) : run();
	server.setRequestHandler(ListToolsRequestSchema, async (_request, extra) => {
		return await runInServingContext(() => server.runRequest(handlers.listTools, extra.signal));
	});
	server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
		return await runInServingContext(() => server.runRequest(async () => {
			if (!params.sdkResourceHost) return await handlers.callTool(request.params, extra.signal);
			return await runWithTrackedCancellation(extra.signal, (signal) => handlers.callTool(request.params, signal));
		}, extra.signal));
	});
	return server;
}
async function connectToolsMcpServerToStdio(server) {
	routeLogsToStderr();
	const closeFailures = /* @__PURE__ */ new Set();
	let shuttingDown = false;
	const shutdownComplete = createDeferredCore();
	const shutdown = () => {
		if (shuttingDown) return;
		shuttingDown = true;
		process.stdin.off("end", shutdown);
		process.stdin.off("close", shutdown);
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
		(async () => {
			try {
				await server.close();
			} catch (error) {
				closeFailures.add(error);
			} finally {
				shutdownComplete.resolve([...closeFailures]);
			}
		})();
	};
	class OwnedStdioTransport extends StdioServerTransport {
		async close() {
			try {
				await super.close();
			} catch (error) {
				closeFailures.add(error);
				throw error;
			} finally {
				shutdown();
			}
		}
	}
	const transport = new OwnedStdioTransport();
	process.stdin.once("end", shutdown);
	process.stdin.once("close", shutdown);
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	const failures = [];
	try {
		await server.connect(transport);
	} catch (error) {
		failures.push(error);
		shutdown();
	}
	failures.push(...await shutdownComplete.promise);
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "MCP connection and transport shutdown failed");
}
/** Owns discovered registrations and nested SDK borrows for one terminal stdio service. */
async function serveRegisteredToolsMcpServer(params) {
	const sdkResourceHost = new LegacyPluginSdkResourceHost();
	let acquisition;
	const failures = [];
	try {
		await sdkResourceHost.run(async () => {
			acquisition = await params.acquireRegistry();
			const owned = acquisition;
			await withPluginRuntimeRegistryScope(owned.registry, async () => {
				await connectToolsMcpServerToStdio(params.createServer(owned.resolveTools(), sdkResourceHost));
			});
		});
	} catch (error) {
		failures.push(error);
	}
	try {
		await sdkResourceHost.run(async () => {
			const registry = acquisition?.registry;
			if (registry?.agentHarnesses.length) try {
				const { disposeRegisteredAgentHarnesses } = await import("./registry-CenZJDCM.mjs");
				await withPluginRuntimeRegistryScope(registry, disposeRegisteredAgentHarnesses);
			} catch (error) {
				failures.push(error);
			}
			const released = await Promise.allSettled([Promise.resolve().then(() => acquisition?.release()), Promise.resolve().then(() => sdkResourceHost.close())]);
			for (const result of released) if (result.status === "rejected") failures.push(result.reason);
		});
	} catch (error) {
		failures.push(error);
	}
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "MCP serving and registration cleanup failed");
}
//#endregion
export { resolveToolsMcpAgentId as a, OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV as i, createToolsMcpServer as n, resolveToolsMcpAgentSessionKey as o, serveRegisteredToolsMcpServer as r, resolveToolsMcpSessionContext as s, connectToolsMcpServerToStdio as t };
