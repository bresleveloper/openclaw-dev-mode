import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { g as readRuntimeConfig } from "../runtime-snapshot-BBYDJbw9.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "../automations-tool-name-DaxQ5QU2.mjs";
import { o as isToolAllowedByPolicies } from "../tool-policy-match--5jlhAPZ.mjs";
import { t as captureRuntimeConfigAsyncReader } from "../io.runtime-Ds5uC0Bf.mjs";
import { R as withPreparedSessionCapabilityRead } from "../session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import "../config-B3oiWDlr.mjs";
import { n as resolveRequesterToolPolicies } from "../requester-tool-policy-BmPXAdVs.mjs";
import { t as createCronTool } from "../cron-tool-BLlbTzAZ.mjs";
import { a as resolveToolsMcpAgentId, i as OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, n as createToolsMcpServer, o as resolveToolsMcpAgentSessionKey, s as resolveToolsMcpSessionContext, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-CzPnTCAD.mjs";
import { t as createSystemAgentTool } from "../system-agent-tool-DkVuaIIq.mjs";
import { c as resolveOpenClawToolsMcpToolSelection, i as OPENCLAW_TOOLS_MCP_TOOLS_ENV, o as resolveOpenClawToolsMcpSystemAgentApproval, r as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, s as resolveOpenClawToolsMcpSystemAgentSurface } from "../openclaw-tools-serve-config-Cxb58Zge.mjs";
import { pathToFileURL } from "node:url";
//#region src/mcp/openclaw-tools-serve.ts
/**
* Standalone MCP server for selected built-in OpenClaw tools.
*
* Run via: node --import tsx src/mcp/openclaw-tools-serve.ts
* Or: bun src/mcp/openclaw-tools-serve.ts
*/
async function resolveOpenClawToolsForMcp(params = {}) {
	const selection = params.tools ?? resolveOpenClawToolsMcpToolSelection();
	const agentSessionKey = (params.agentSessionKey ?? resolveToolsMcpAgentSessionKey())?.trim();
	const tools = selection.map((tool) => {
		if (tool === "openclaw") return createSystemAgentTool({
			agentId: params.agentId,
			surface: params.systemAgentSurface ?? resolveOpenClawToolsMcpSystemAgentSurface(),
			...resolveOpenClawToolsMcpSystemAgentApproval()
		});
		if (!agentSessionKey) throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} is required`);
		const context = resolveToolsMcpSessionContext({
			agentSessionKey,
			agentId: params.agentId
		});
		return createCronTool({
			agentSessionKey,
			agentId: context.agentId,
			config: params.config ?? readRuntimeConfig(),
			creatorToolAllowlist: [{ name: AUTOMATIONS_TOOL_NAME }]
		});
	});
	if (!agentSessionKey) return tools;
	const requesterPolicies = await withPreparedSessionCapabilityRead(() => resolveRequesterToolPolicies({
		config: params.config ?? readRuntimeConfig(),
		agentId: params.agentId,
		sessionKey: agentSessionKey,
		senderPolicyMode: "never"
	}));
	return tools.filter((tool) => isToolAllowedByPolicies(tool.name, [
		requesterPolicies.groupPolicy,
		requesterPolicies.senderPolicy,
		requesterPolicies.subagentPolicy,
		requesterPolicies.inheritedToolPolicy
	]));
}
async function serveOpenClawToolsMcp() {
	const server = createToolsMcpServer({
		name: "openclaw-tools",
		tools: await resolveOpenClawToolsForMcp({
			agentId: resolveToolsMcpAgentId(),
			config: await captureRuntimeConfigAsyncReader()()
		})
	});
	await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) serveOpenClawToolsMcp().catch((err) => {
	process.stderr.write(`openclaw-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exitCode = 1;
});
//#endregion
export { OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, OPENCLAW_TOOLS_MCP_TOOLS_ENV, resolveOpenClawToolsForMcp };
