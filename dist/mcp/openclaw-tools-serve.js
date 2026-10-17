import { t as formatErrorMessage } from "../errors-O33D01XW.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "../automations-tool-name-DBMZPbPL.mjs";
import { o as isToolAllowedByPolicies } from "../tool-policy-match-Dn8gpf-E.mjs";
import { r as getRuntimeConfig } from "../io.runtime-BSum32pK.mjs";
import "../config-9720xhC5.mjs";
import { n as resolveRequesterToolPolicies } from "../requester-tool-policy-DIo-5B5v.mjs";
import { t as createCronTool } from "../cron-tool-C0K_7xO_.mjs";
import { a as resolveToolsMcpAgentId, i as OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, n as createToolsMcpServer, o as resolveToolsMcpAgentSessionKey, s as resolveToolsMcpSessionContext, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-DGxPdz2l.mjs";
import { t as createSystemAgentTool } from "../system-agent-tool-8nXOjjLh.mjs";
import { c as resolveOpenClawToolsMcpToolSelection, i as OPENCLAW_TOOLS_MCP_TOOLS_ENV, o as resolveOpenClawToolsMcpSystemAgentApproval, r as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, s as resolveOpenClawToolsMcpSystemAgentSurface } from "../openclaw-tools-serve-config-BTwSHtye.mjs";
import { pathToFileURL } from "node:url";
//#region src/mcp/openclaw-tools-serve.ts
/**
* Standalone MCP server for selected built-in OpenClaw tools.
*
* Run via: node --import tsx src/mcp/openclaw-tools-serve.ts
* Or: bun src/mcp/openclaw-tools-serve.ts
*/
function resolveOpenClawToolsForMcp(params = {}) {
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
			config: params.config ?? getRuntimeConfig(),
			creatorToolAllowlist: [{ name: AUTOMATIONS_TOOL_NAME }]
		});
	});
	if (!agentSessionKey) return tools;
	const requesterPolicies = resolveRequesterToolPolicies({
		config: params.config ?? getRuntimeConfig(),
		agentId: params.agentId,
		sessionKey: agentSessionKey,
		senderPolicyMode: "never"
	});
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
		tools: resolveOpenClawToolsForMcp({ agentId: resolveToolsMcpAgentId() })
	});
	await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) serveOpenClawToolsMcp().catch((err) => {
	process.stderr.write(`openclaw-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, OPENCLAW_TOOLS_MCP_TOOLS_ENV, resolveOpenClawToolsForMcp, resolveToolsMcpAgentSessionKey as resolveOpenClawToolsMcpAgentSessionKey };
