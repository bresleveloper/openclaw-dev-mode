import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { i as routeLogsToStderr } from "../console-CML7QnOp.mjs";
import { s as resolveCoreToolProfilePolicy } from "../tool-catalog-DGlfxTaj.mjs";
import { n as pickSandboxToolPolicy } from "../sandbox-tool-policy-B4OWlHAG.mjs";
import { a as collectExplicitDenylist, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy } from "../tool-policy-14GRhbFd.mjs";
import { t as captureRuntimeConfigAsyncReader } from "../io.runtime-Ds5uC0Bf.mjs";
import { r as getPluginToolMeta } from "../tool-metadata-CaNEdKPR.mjs";
import "../config-B3oiWDlr.mjs";
import { i as logWarn } from "../logger-DHVmYOKs.mjs";
import { n as resolveEffectiveToolPolicy } from "../agent-tools.policy-t04F-r_I.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "../tool-policy-pipeline-CUnSsPP_.mjs";
import { n as acquireStandalonePluginToolRegistry } from "../tools-C33miWSs.mjs";
import { a as resolveToolsMcpAgentId, n as createToolsMcpServer, r as serveRegisteredToolsMcpServer, s as resolveToolsMcpSessionContext } from "../tools-stdio-server-CzPnTCAD.mjs";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/plugin-tools-serve.ts
/**
* Standalone MCP server that exposes OpenClaw plugin-registered tools
* (e.g. memory-lancedb's memory_recall, memory_store, memory_forget)
* so ACP sessions running Claude Code can use them.
*/
async function acquirePluginToolsForMcp(params) {
	const { config } = params;
	const context = {
		config,
		...resolveToolsMcpSessionContext(params)
	};
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
	const acquisition = await acquireStandalonePluginToolRegistry({
		context,
		...toolAllowlist.length > 0 ? { toolAllowlist } : {},
		...toolDenylist.length > 0 ? { toolDenylist } : {},
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
		acquireRegistry: async () => acquirePluginToolsForMcp({
			config: await captureRuntimeConfigAsyncReader()(),
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
	process.exitCode = 1;
});
//#endregion
export { acquirePluginToolsForMcp, createPluginToolsMcpServer, servePluginToolsMcp };
