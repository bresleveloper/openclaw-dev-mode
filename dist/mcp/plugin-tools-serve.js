import { i as formatErrorMessage } from "../errors-sMD712F3.js";
import { a as routeLogsToStderr } from "../console-DDSYsaep.js";
import { i as getRuntimeConfig } from "../io-DxnOT4sF.js";
import "../config-Cc93keN1.js";
import { n as pickSandboxToolPolicy } from "../sandbox-tool-policy-ClB7s2K0.js";
import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, h as resolveToolProfilePolicy, i as collectExplicitAllowlist } from "../tool-policy-BHUGxE3p.js";
import { o as resolvePluginTools, r as ensureStandalonePluginToolRegistryLoaded } from "../tools-D0RJIgtl.js";
import { n as createToolsMcpServer, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-CetlnQHT.js";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/plugin-tools-serve.ts
/**
* Standalone MCP server that exposes OpenClaw plugin-registered tools
* (e.g. memory-lancedb's memory_recall, memory_store, memory_forget)
* so ACP sessions running Claude Code can use them.
*
* Run via: node --import tsx src/mcp/plugin-tools-serve.ts
* Or: bun src/mcp/plugin-tools-serve.ts
*/
function resolvePluginToolPolicy(config) {
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(config.tools?.profile), config.tools?.alsoAllow);
	const globalPolicy = pickSandboxToolPolicy(config.tools);
	const toolAllowlist = collectExplicitAllowlist([profilePolicy, globalPolicy]);
	const toolDenylist = collectExplicitDenylist([profilePolicy, globalPolicy]);
	return {
		...toolAllowlist.length > 0 ? { toolAllowlist } : {},
		...toolDenylist.length > 0 ? { toolDenylist } : {}
	};
}
function resolveTools(config) {
	const pluginToolPolicy = resolvePluginToolPolicy(config);
	const runtimeRegistry = ensureStandalonePluginToolRegistryLoaded({
		context: { config },
		...pluginToolPolicy
	});
	return resolvePluginTools({
		context: { config },
		...pluginToolPolicy,
		suppressNameConflicts: true,
		runtimeRegistry
	});
}
function createPluginToolsMcpServer(params = {}) {
	const cfg = params.config ?? getRuntimeConfig();
	return createToolsMcpServer({
		name: "openclaw-plugin-tools",
		tools: params.tools ?? resolveTools(cfg)
	});
}
async function servePluginToolsMcp() {
	routeLogsToStderr();
	const config = getRuntimeConfig();
	const tools = resolveTools(config);
	const server = createPluginToolsMcpServer({
		config,
		tools
	});
	if (tools.length === 0) process.stderr.write("plugin-tools-serve: no plugin tools found\n");
	await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) servePluginToolsMcp().catch((err) => {
	process.stderr.write(`plugin-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { createPluginToolsMcpServer, servePluginToolsMcp };
