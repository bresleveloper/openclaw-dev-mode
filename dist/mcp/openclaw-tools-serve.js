import { i as formatErrorMessage } from "../errors-sMD712F3.js";
import { t as createCrestodianTool } from "../crestodian-tool-B2jmSQIL.js";
import { t as createCronTool } from "../cron-tool-Dm578Wy7.js";
import { n as createToolsMcpServer, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-CetlnQHT.js";
import { a as resolveOpenClawToolsMcpCrestodianSurface, i as resolveOpenClawToolsMcpCrestodianApproval, n as OPENCLAW_TOOLS_MCP_TOOLS_ENV, o as resolveOpenClawToolsMcpToolSelection, t as OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV } from "../openclaw-tools-serve-config-Ba8t55Gb.js";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/openclaw-tools-serve.ts
/**
* Standalone MCP server for selected built-in OpenClaw tools.
*
* Run via: node --import tsx src/mcp/openclaw-tools-serve.ts
* Or: bun src/mcp/openclaw-tools-serve.ts
*/
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
function resolveOpenClawToolsMcpAgentSessionKey(env = process.env) {
	return env["OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY"]?.trim() || void 0;
}
function resolveOpenClawToolsForMcp(params = {}) {
	return (params.tools ?? resolveOpenClawToolsMcpToolSelection()).map((tool) => {
		if (tool === "crestodian") return createCrestodianTool({
			surface: params.crestodianSurface ?? resolveOpenClawToolsMcpCrestodianSurface(),
			...resolveOpenClawToolsMcpCrestodianApproval()
		});
		const agentSessionKey = (params.agentSessionKey ?? resolveOpenClawToolsMcpAgentSessionKey())?.trim();
		if (!agentSessionKey) throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} is required`);
		return createCronTool({
			agentSessionKey,
			creatorToolAllowlist: [{ name: "cron" }]
		});
	});
}
function createOpenClawToolsMcpServer(params = {}) {
	return createToolsMcpServer({
		name: "openclaw-tools",
		tools: params.tools ?? resolveOpenClawToolsForMcp()
	});
}
async function serveOpenClawToolsMcp() {
	await connectToolsMcpServerToStdio(createOpenClawToolsMcpServer());
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) serveOpenClawToolsMcp().catch((err) => {
	process.stderr.write(`openclaw-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV, OPENCLAW_TOOLS_MCP_TOOLS_ENV, resolveOpenClawToolsForMcp, resolveOpenClawToolsMcpAgentSessionKey };
