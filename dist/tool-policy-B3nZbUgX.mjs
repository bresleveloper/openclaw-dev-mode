import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
//#region src/agents/cli-runner/tool-policy.ts
/** Transport prefix CLI harnesses use for loopback OpenClaw MCP tool names. */
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
const GEMINI_OPENCLAW_MCP_TOOL_PREFIX = "mcp_openclaw_";
/** Strips the loopback MCP transport prefix so observers see gateway tool names. */
function stripOpenClawMcpToolPrefix(toolName) {
	return toolName.startsWith(OPENCLAW_MCP_TOOL_PREFIX) ? toolName.slice(15) : toolName.startsWith(GEMINI_OPENCLAW_MCP_TOOL_PREFIX) ? toolName.slice(13) : toolName;
}
/** Match provider-native names against the canonical tool hook and policy ids. */
function normalizeCliToolName(toolName) {
	return normalizeToolPolicyName(toolName.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2"));
}
/** Keeps only explicit runtime caps for backend-owned exact translation. */
function resolveCliRuntimeToolsAllow(toolsAllow, _toolsAllowIsDefault) {
	if (toolsAllow === void 0) return;
	return toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { resolveCliRuntimeToolsAllow as n, stripOpenClawMcpToolPrefix as r, normalizeCliToolName as t };
