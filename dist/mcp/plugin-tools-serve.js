import { t as formatErrorMessage } from "../errors-O33D01XW.mjs";
import { i as routeLogsToStderr } from "../console-BnFs8ZzT.mjs";
import { s as resolveCoreToolProfilePolicy } from "../tool-catalog-DyHnjiiS.mjs";
import { n as pickSandboxToolPolicy } from "../sandbox-tool-policy-BO1puJQ0.mjs";
import { a as collectExplicitDenylist, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy } from "../tool-policy-BKvvmcQR.mjs";
import { r as getRuntimeConfig } from "../io.runtime-CPntde4x.mjs";
import "../config-CzeZu5J_.mjs";
import { i as logWarn } from "../logger-DskmrSVa.mjs";
import { r as getPluginToolMeta } from "../tool-metadata-DEC0Rqn3.mjs";
import { n as resolveEffectiveToolPolicy } from "../agent-tools.policy-Ni4Rljqy.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "../tool-policy-pipeline-DFP1wzZs.mjs";
import { n as acquireStandalonePluginToolRegistry } from "../tools-OR2DVzl1.mjs";
import { a as resolveToolsMcpAgentId, n as createToolsMcpServer, r as serveRegisteredToolsMcpServer, s as resolveToolsMcpSessionContext } from "../tools-stdio-server-CALZPMM_.mjs";
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
function resolvePluginToolPolicy(config, context) {
	const effective = context.agentId ? resolveEffectiveToolPolicy({
		config,
		agentId: context.agentId,
		sessionKey: context.sessionKey
	}) : void 0;
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effective?.profile ?? config.tools?.profile), effective?.profileAlsoAllow ?? config.tools?.alsoAllow);
	const globalPolicy = effective?.globalPolicy ?? pickSandboxToolPolicy(config.tools);
	const steps = effective ? buildDefaultToolPolicyPipelineSteps({
		profilePolicy,
		profile: effective.profile,
		globalPolicy,
		agentPolicy: effective.agentPolicy,
		agentId: effective.agentId
	}).map((step) => Object.assign({}, step, { suppressUnavailableCoreToolWarning: true })) : void 0;
	const policies = steps?.map((step) => step.policy) ?? [profilePolicy, globalPolicy];
	const toolAllowlist = collectExplicitAllowlist(policies);
	const toolDenylist = collectExplicitDenylist(policies);
	return {
		...toolAllowlist.length > 0 ? { toolAllowlist } : {},
		...toolDenylist.length > 0 ? { toolDenylist } : {},
		steps
	};
}
async function acquirePluginToolsForMcp(params) {
	const sessionContext = resolveToolsMcpSessionContext(params);
	const context = {
		config: params.config,
		...sessionContext
	};
	const { steps, ...pluginToolPolicy } = resolvePluginToolPolicy(params.config, sessionContext);
	const acquisition = await acquireStandalonePluginToolRegistry({
		context,
		...pluginToolPolicy,
		suppressNameConflicts: true
	});
	return {
		...acquisition,
		resolveTools: () => {
			const tools = acquisition.resolveTools();
			return steps ? applyToolPolicyPipeline({
				tools,
				toolMeta: getPluginToolMeta,
				warn: logWarn,
				steps
			}) : tools;
		}
	};
}
function createPluginToolsMcpServer(params) {
	return createToolsMcpServer({
		name: "openclaw-plugin-tools",
		...params
	});
}
async function servePluginToolsMcp() {
	routeLogsToStderr();
	await serveRegisteredToolsMcpServer({
		acquireRegistry: () => acquirePluginToolsForMcp({
			config: getRuntimeConfig(),
			agentId: resolveToolsMcpAgentId()
		}),
		createServer: (tools, sdkResourceHost) => {
			if (tools.length === 0) process.stderr.write("plugin-tools-serve: no plugin tools found\n");
			return createPluginToolsMcpServer({
				tools,
				sdkResourceHost
			});
		}
	});
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) servePluginToolsMcp().catch((err) => {
	process.stderr.write(`plugin-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { acquirePluginToolsForMcp, createPluginToolsMcpServer, servePluginToolsMcp };
