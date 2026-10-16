import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import "./code-mode-control-tools-CpOmDfxq.mjs";
//#region src/agents/embedded-agent-runner/terminal-tool-failure.ts
/** Projects a safe Code Mode catalog miss into terminal metadata for operator diagnostics. */
const SAFE_MCP_CATALOG_MISS = /^(?:Error: )?Unknown tool id: MCP\.[A-Za-z0-9][A-Za-z0-9._-]*\. (?:Did you mean: [^\r\n]+\? )?Use (?:openclaw\.tools\.search to find a tool, openclaw\.tools\.describe to inspect it, then openclaw\.tools\.call|tools\.search to find a tool, tools\.describe to inspect it, then tools\.call) with the exact id or name\.$/;
const CODE_MODE_MCP_CATALOG_MISS_MESSAGE = "Code Mode could not resolve a configured MCP tool.";
/** Validates the only terminal tool failure fact safe to persist in cron history. */
function isEmbeddedRunTerminalToolFailure(value) {
	const failure = asOptionalObjectRecord(value);
	return failure?.source === "tool" && (failure.toolName === "exec" || failure.toolName === "wait") && failure.code === "UNKNOWN_TOOL_ID";
}
/** Only the allowlisted catalog miss can enter cron history; other errors stay generic. */
function resolveEmbeddedRunTerminalToolFailure(params) {
	const failure = params.lastToolError;
	const normalizedToolName = normalizeToolPolicyName(failure?.toolName ?? "");
	if (params.trigger !== "cron" || params.codeModeEngaged !== true || !failure || normalizedToolName !== "exec" && normalizedToolName !== "wait") return;
	const failureFirstLine = typeof failure.error === "string" ? failure.error.split(/\r?\n/, 1)[0] : void 0;
	if (!(failureFirstLine ? SAFE_MCP_CATALOG_MISS.exec(failureFirstLine) : null)) return;
	return {
		source: "tool",
		toolName: normalizedToolName,
		code: "UNKNOWN_TOOL_ID"
	};
}
//#endregion
export { isEmbeddedRunTerminalToolFailure as n, resolveEmbeddedRunTerminalToolFailure as r, CODE_MODE_MCP_CATALOG_MISS_MESSAGE as t };
